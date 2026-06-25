// app/stagiaire/questionnaires/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { 
  ClipboardList, Send, Loader2, CheckCircle2, 
  AlertCircle, Star, ChevronLeft, ChevronRight,
  Calendar, User
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Questionnaire {
  id: number;
  titre: string;
  description: string;
  created_at: string;
  encadreur_username: string;
  questions_count: number;
  repondu: boolean;
  date_reponse?: string;
  note_globale?: number;
  corrige?: boolean;
}

interface Question {
  id: number;
  question: string;
  type: 'text' | 'choice' | 'multiple' | 'rating';
  options: string[];
  obligatoire: boolean;
  ordre: number;
  bareme: number;
}

interface ReponseEnCours {
  questionId: number;
  reponse: string;
}

export default function StagiaireQuestionnairesPage() {
  const { user } = useAuth();
  
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<Questionnaire | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [reponses, setReponses] = useState<ReponseEnCours[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [showDetails, setShowDetails] = useState(false);
  const [detailsReponses, setDetailsReponses] = useState<any[]>([]);
  const [detailsQuestionnaire, setDetailsQuestionnaire] = useState<any>(null);

  useEffect(() => {
    if (user) fetchQuestionnaires();
  }, [user]);

  const fetchQuestionnaires = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: stagiaire, error: stagiaireError } = await supabase
        .from('stagiaires')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (stagiaireError || !stagiaire) {
        const { data: userData } = await supabase.from('users').select('role').eq('id', user?.id).single();
        if (!userData) setError('Compte utilisateur introuvable.');
        else if (userData.role !== 'stagiaire') setError('Cette page est réservée aux stagiaires.');
        else setError('Profil stagiaire introuvable. Contactez l\'administration.');
        setIsLoading(false);
        return;
      }

      const { data: affectation } = await supabase
        .from('affectations')
        .select('encadreur_id')
        .eq('stagiaire_id', stagiaire.id)
        .eq('statut', 'active')
        .single();

      if (!affectation?.encadreur_id) {
        setError('Aucun encadreur assigné. Contactez l\'administration.');
        setIsLoading(false);
        return;
      }

      const { data: questionnairesData } = await supabase
        .from('questionnaires')
        .select('*, questions:questions(id)')
        .eq('created_by', affectation.encadreur_id)
        .order('created_at', { ascending: false });

      const { data: encadreur } = await supabase
        .from('users')
        .select('username')
        .eq('id', affectation.encadreur_id)
        .single();

      const { data: mesReponses } = await supabase
        .from('reponses_stagiaires')
        .select('id, questionnaire_id, date_reponse, note_globale, corrige')
        .eq('stagiaire_id', stagiaire.id);

      const reponsesMap = new Map();
      (mesReponses || []).forEach(r => reponsesMap.set(r.questionnaire_id, r));

      setQuestionnaires((questionnairesData || []).map(q => ({
        id: q.id,
        titre: q.titre,
        description: q.description,
        created_at: q.created_at,
        encadreur_username: encadreur?.username || 'Votre encadreur',
        questions_count: q.questions?.length || 0,
        repondu: reponsesMap.has(q.id),
        date_reponse: reponsesMap.get(q.id)?.date_reponse,
        note_globale: reponsesMap.get(q.id)?.note_globale,
        corrige: reponsesMap.get(q.id)?.corrige
      })));
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors du chargement.');
    } finally {
      setIsLoading(false);
    }
  };

  const startQuestionnaire = async (questionnaire: Questionnaire) => {
    const { data: questionsData } = await supabase
      .from('questions')
      .select('*')
      .eq('questionnaire_id', questionnaire.id)
      .order('ordre');

    if (questionsData) {
      setQuestions(questionsData);
      setReponses(questionsData.map(q => ({ questionId: q.id, reponse: '' })));
      setCurrentQuestionIndex(0);
      setSelectedQuestionnaire(questionnaire);
      setShowQuestionnaire(true);
      setSubmitted(false);
    }
  };

  const voirDetailsReponse = async (questionnaireId: number) => {
    setIsLoading(true);
    try {
      const { data: stagiaire } = await supabase.from('stagiaires').select('id').eq('user_id', user?.id).single();
      if (!stagiaire) return;

      const { data: reponse } = await supabase
        .from('reponses_stagiaires')
        .select(`*, questionnaire:questionnaire_id(*), details:reponses_details(reponse, note, commentaire, question:questions(question, type, bareme))`)
        .eq('questionnaire_id', questionnaireId)
        .eq('stagiaire_id', stagiaire.id)
        .single();

      if (reponse) {
        setDetailsQuestionnaire(reponse.questionnaire);
        setDetailsReponses(reponse.details || []);
        setShowDetails(true);
      }
    } catch (err) { console.error('Erreur:', err); } finally { setIsLoading(false); }
  };

  const updateReponse = (questionId: number, value: string) => {
    setReponses(prev => prev.map(r => r.questionId === questionId ? { ...r, reponse: value } : r));
  };

  const toggleMultipleChoice = (questionId: number, option: string) => {
    setReponses(prev => prev.map(r => {
      if (r.questionId === questionId) {
        const current = r.reponse ? r.reponse.split('|') : [];
        const updated = current.includes(option) ? current.filter(o => o !== option) : [...current, option];
        return { ...r, reponse: updated.join('|') };
      }
      return r;
    }));
  };

  const validerReponses = () => {
    for (const q of questions) {
      if (q.obligatoire) {
        const rep = reponses.find(r => r.questionId === q.id);
        if (!rep || !rep.reponse.trim()) return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validerReponses()) { alert('Veuillez répondre à toutes les questions obligatoires (*).'); return; }
    if (!confirm('Confirmer l\'envoi ? Vous ne pourrez plus modifier.')) return;

    setIsSubmitting(true);
    try {
      const { data: stagiaire } = await supabase.from('stagiaires').select('id').eq('user_id', user?.id).single();
      if (!stagiaire) throw new Error('Profil stagiaire introuvable');

      const { data: reponseStagiaire, error: reponseError } = await supabase
        .from('reponses_stagiaires')
        .insert({ questionnaire_id: selectedQuestionnaire!.id, stagiaire_id: stagiaire.id, date_reponse: new Date().toISOString() })
        .select('id')
        .single();

      if (reponseError || !reponseStagiaire?.id) throw new Error(reponseError?.message || 'Erreur création réponse');

      const detailsData = reponses.filter(r => r.reponse.trim()).map(r => ({
        reponse_stagiaire_id: reponseStagiaire.id,
        question_id: r.questionId,
        reponse: r.reponse
      }));

      if (detailsData.length > 0) {
        const { error: detailsError } = await supabase.from('reponses_details').insert(detailsData);
        if (detailsError) throw new Error(detailsError.message);
      }

      setSubmitted(true);
      setTimeout(() => { setShowQuestionnaire(false); fetchQuestionnaires(); }, 2000);
    } catch (err: any) {
      console.error('Erreur:', err);
      alert('Erreur : ' + (err.message || 'Erreur inconnue'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextQuestion = () => { if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(prev => prev + 1); };
  const prevQuestion = () => { if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1); };

  const currentQuestion = questions[currentQuestionIndex];
  const currentReponse = reponses.find(r => r.questionId === currentQuestion?.id);
  const totalQuestions = questions.length;
  const answeredCount = reponses.filter(r => r.reponse.trim()).length;

  // ====== RENDU RÉPONSE ======
  const renderReponseInput = () => {
    if (!currentQuestion) return null;
    switch (currentQuestion.type) {
      case 'text':
        return (
          <textarea value={currentReponse?.reponse || ''} onChange={(e) => updateReponse(currentQuestion.id, e.target.value)}
            placeholder="Votre réponse..." rows={5}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none text-sm" />
        );
      case 'choice':
        return (
          <div className="space-y-2">
            {currentQuestion.options?.filter(o => o.trim()).map((option, i) => (
              <label key={i} className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all text-sm ${
                currentReponse?.reponse === option ? 'border-indigo-500 bg-indigo-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name={`q_${currentQuestion.id}`} value={option} checked={currentReponse?.reponse === option}
                  onChange={(e) => updateReponse(currentQuestion.id, e.target.value)} className="w-4 h-4 text-indigo-600" />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      case 'multiple':
        return (
          <div className="space-y-2">
            {currentQuestion.options?.filter(o => o.trim()).map((option, i) => {
              const selected = (currentReponse?.reponse || '').split('|').includes(option);
              return (
                <label key={i} className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all text-sm ${
                  selected ? 'border-indigo-500 bg-indigo-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="checkbox" checked={selected} onChange={() => toggleMultipleChoice(currentQuestion.id, option)}
                    className="w-4 h-4 text-indigo-600 rounded" />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
        );
      case 'rating':
        const rating = parseInt(currentReponse?.reponse || '0');
        return (
          <div className="text-center">
            <div className="flex justify-center gap-2 mb-3">
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => updateReponse(currentQuestion.id, String(n))}
                  className={`p-3 rounded-xl transition-all ${rating >= n ? 'bg-amber-100 text-amber-500 scale-105' : 'bg-gray-100 text-gray-300 hover:bg-gray-200'}`}>
                  <Star size={28} fill={rating >= n ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400">{rating > 0 ? `${rating}/5` : 'Cliquez pour noter'}</p>
          </div>
        );
      default: return null;
    }
  };

  // ====== ÉTAT SOUMISSION RÉUSSIE ======
  if (showQuestionnaire && submitted) {
    return (
      <div className="p-6 max-w-lg mx-auto mt-20">
        <div className="bg-white rounded-2xl border p-10 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Réponses envoyées</h2>
          <p className="text-sm text-gray-500">Votre encadreur va pouvoir corriger votre évaluation.</p>
        </div>
      </div>
    );
  }

  // ====== INTERFACE QUESTIONNAIRE ======
  if (showQuestionnaire && !submitted && currentQuestion) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        {/* Header + Progression */}
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-bold text-gray-900">{selectedQuestionnaire?.titre}</h1>
              {selectedQuestionnaire?.description && <p className="text-sm text-gray-500 mt-0.5">{selectedQuestionnaire.description}</p>}
            </div>
            <button onClick={() => setShowQuestionnaire(false)} className="text-xs text-gray-400 hover:text-gray-600">Quitter</button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
              <div className="bg-indigo-600 h-1.5 rounded-full transition-all" style={{ width: `${(answeredCount / totalQuestions) * 100}%` }} />
            </div>
            <span className="text-xs font-medium text-gray-500">{answeredCount}/{totalQuestions}</span>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2l border p-8">
          <div className="flex items-center justify-between mb-5">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Question {currentQuestionIndex + 1} · {currentQuestion.type === 'text' ? 'Texte libre' : currentQuestion.type === 'choice' ? 'Choix unique' : currentQuestion.type === 'multiple' ? 'Choix multiples' : 'Note'}
            </span>
            {currentQuestion.obligatoire && <span className="text-xs text-red-400">* Obligatoire</span>}
          </div>
          
          <h2 className="text-base font-semibold text-gray-900 mb-8">{currentQuestion.question}</h2>
          
          <div className="mb-6">{renderReponseInput()}</div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <button onClick={prevQuestion} disabled={currentQuestionIndex === 0}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-900 disabled:opacity-30 transition-colors">
              <ChevronLeft size={16} /> Précédent
            </button>

            <div className="flex gap-1.5">
              {questions.map((_, i) => (
                <button key={i} onClick={() => setCurrentQuestionIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentQuestionIndex ? 'bg-indigo-600 w-4' :
                    reponses.find(r => r.questionId === questions[i].id)?.reponse.trim() ? 'bg-green-400' : 'bg-gray-250'
                  }`} />
              ))}
            </div>

            {currentQuestionIndex < totalQuestions - 1 ? (
              <button onClick={nextQuestion}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Suivant <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium transition-colors">
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                Envoyer
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ====== DÉTAILS RÉPONSE ======
  if (showDetails && detailsQuestionnaire) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <button onClick={() => setShowDetails(false)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ChevronLeft size={16} /> Retour
        </button>

        <div className="bg-white roundedxl border p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-bold text-gray-900">{detailsQuestionnaire.titre}</h1>
              {detailsQuestionnaire.description && <p className="text-sm text-gray-500 mt-0.5">{detailsQuestionnaire.description}</p>}
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
              <CheckCircle2 size={12} /> Répondu
            </span>
          </div>

          <div className="space-y-1">
            {detailsReponses.map((detail, i) => (
              <div key={i} className="py-4 border-b border-gray-50 last:border-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 mb-2">{i + 1}. {detail.question?.question}</p>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">{detail.reponse || <span className="text-gray-400 italic">Non répondu</span>}</p>
                    </div>
                    {detail.commentaire && (
                      <div className="mt-2 bg-blue-50 rounded-lg p-3">
                        <p className="text-xs text-blue-500 mb-0.5">Commentaire</p>
                        <p className="text-sm text-blue-800">{detail.commentaire}</p>
                      </div>
                    )}
                  </div>
                  {detail.note != null && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold flex-shrink-0">
                      {detail.note}/{detail.question?.bareme || 0}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ====== PAGE PRINCIPALE ======
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Mes évaluations</h2>
        <p className="text-sm text-gray-500 mt-1">Questionnaires à compléter pour votre encadreur</p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-indigo-600" />
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-white rounded-2xl border p-10 text-center">
          <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} className="text-amber-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">Information</h3>
          <p className="text-sm text-gray-500 mb-5">{error}</p>
          <button onClick={fetchQuestionnaires} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">Réessayer</button>
        </div>
      )}

      {!isLoading && !error && questionnaires.length === 0 && (
        <div className="bg-white rounded-2xl border p-10 text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardList size={28} className="text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">Aucun questionnaire</h3>
          <p className="text-sm text-gray-500">Votre encadreur n'a pas encore créé de questionnaire.</p>
        </div>
      )}

      {!isLoading && !error && questionnaires.length > 0 && (
        <div className="space-y-3">
          {questionnaires.map((q) => (
            <div key={q.id} className={`bg-white rounded-2 border p-5 transition-all hover:shadow-sm ${
              q.repondu ? 'border-l-[3px] border-l-green-500' : 'border-l-[3px] border-l-indigo-500'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${q.repondu ? 'bg-green-50' : 'bg-indigo-50'}`}>
                    <ClipboardList size={18} className={q.repondu ? 'text-green-600' : 'text-indigo-600'} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{q.titre}</h3>
                    {q.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{q.description}</p>}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><ClipboardList size={11} /> {q.questions_count} questions</span>
                      <span className="flex items-center gap-1"><Calendar size={11} /> {format(new Date(q.created_at), 'dd/MM/yyyy')}</span>
                      <span className="flex items-center gap-1"><User size={11} /> {q.encadreur_username}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {q.repondu ? (
                    <>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                        <CheckCircle2 size={12} /> {q.corrige ? 'Corrigé' : 'Répondu'}
                      </span>
                      {q.note_globale != null && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">
                          <Star size={12} /> {q.note_globale}/20
                        </span>
                      )}
                      <button onClick={() => voirDetailsReponse(q.id)} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                        Voir mes réponses →
                      </button>
                    </>
                  ) : (
                    <button onClick={() => startQuestionnaire(q)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors">
                      <Send size={14} /> Répondre
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}