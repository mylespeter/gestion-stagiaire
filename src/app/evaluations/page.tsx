// app/evaluations/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { DataTable, Column } from '@/components/DataTable';
import { StatCard } from '@/components/ui/StatCard';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { 
  Star, Plus, Trash2, X, Save,
  Type, List, CheckSquare,
  ClipboardList, Users,
  Loader2,
  LayoutList, PenTool, CheckCircle,
  FileText, ShieldAlert
} from 'lucide-react';
import { format } from 'date-fns';

// Types
interface Questionnaire {
  id: number;
  titre: string;
  description: string;
  created_at: string;
  questions_count: number;
  reponses_count: number;
  reponses_corrigees_count: number;
}

interface Question {
  id: string;
  question: string;
  type: 'text' | 'choice' | 'multiple' | 'rating';
  options: string[];
  obligatoire: boolean;
  ordre: number;
  bareme: number;
}

interface ReponseStagiaire {
  id: number;
  stagiaire_username: string;
  stagiaire_matricule: string;
  date_reponse: string;
  note_globale: number | null;
  corrige: boolean;
}

// Composants Skeleton
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const StatCardSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-xl p-3.5 space-y-2">
    <div className="flex items-center justify-between">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-7 w-7 rounded-md" />
    </div>
    <Skeleton className="h-7 w-12" />
    <Skeleton className="h-2.5 w-16" />
  </div>
);

const TableSkeleton = () => (
  <div className="bg-white rounded-xl border overflow-hidden">
    <div className="px-6 py-4 border-b bg-white flex items-center justify-between">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-9 w-32 rounded-lg" />
    </div>
    <div className="p-4 border-b">
      <Skeleton className="h-10 w-full max-w-md rounded-lg" />
    </div>
    <div className="divide-y">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="px-6 py-4 flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      ))}
    </div>
  </div>
);

const PageSkeleton = () => (
  <div className="p-6 max-w-[1400px] mx-auto space-y-6">
    {/* Header skeleton */}
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="flex bg-gray-100 rounded-lg p-1">
        <Skeleton className="h-9 w-36 rounded-md" />
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>
    </div>
    
    {/* Stats cards skeleton */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
    
    {/* Table skeleton */}
    <TableSkeleton />
  </div>
);

const QuestionnaireFormSkeleton = () => (
  <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
    <div className="absolute inset-0 bg-black/50" />
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
      <div className="flex items-center justify-between p-6 border-b">
        <div className="space-y-1">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <div className="p-6 space-y-4">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
        {[...Array(2)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4 bg-gray-50 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 space-y-3">
          <Skeleton className="h-4 w-40" />
          <div className="grid grid-cols-2 gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between p-6 border-t bg-gray-50 rounded-b-2xl">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

const CorrectionModalSkeleton = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/50" />
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
      <div className="flex items-center justify-between p-6 border-b">
        <div className="space-y-1">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right space-y-1">
            <Skeleton className="h-3 w-16 ml-auto" />
            <Skeleton className="h-8 w-20 ml-auto" />
          </div>
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between p-6 border-t bg-gray-50 rounded-b-2xl">
        <Skeleton className="h-4 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

export default function EvaluationsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'questionnaires' | 'corrections'>('questionnaires');
  
  // États de chargement
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Questionnaires
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [isLoadingQuestionnaires, setIsLoadingQuestionnaires] = useState(false);
  const [showCreateQuestionnaire, setShowCreateQuestionnaire] = useState(false);
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Corrections
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<any>(null);
  const [reponses, setReponses] = useState<ReponseStagiaire[]>([]);
  const [isLoadingReponses, setIsLoadingReponses] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionEnCours, setCorrectionEnCours] = useState<any>(null);
  const [isSavingCorrection, setIsSavingCorrection] = useState(false);
  const [isOpeningCorrection, setIsOpeningCorrection] = useState(false);

  useEffect(() => {
    fetchQuestionnaires();
  }, [user]);

  const fetchQuestionnaires = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user) {
        setError('Vous devez être connecté.');
        return;
      }

      const { data } = await supabase
        .from('questionnaires')
        .select(`*, questions:questions(id)`)
        .eq('created_by', user?.id)
        .order('created_at', { ascending: false });

      if (data) {
        const questionnairesWithCounts = await Promise.all(data.map(async (q) => {
          const { count: totalCount } = await supabase
            .from('reponses_stagiaires')
            .select('*', { count: 'exact', head: true })
            .eq('questionnaire_id', q.id);
          
          const { count: corrigeCount } = await supabase
            .from('reponses_stagiaires')
            .select('*', { count: 'exact', head: true })
            .eq('questionnaire_id', q.id)
            .eq('corrige', true);

          return {
            id: q.id,
            titre: q.titre,
            description: q.description,
            created_at: q.created_at,
            questions_count: q.questions?.length || 0,
            reponses_count: totalCount || 0,
            reponses_corrigees_count: corrigeCount || 0
          };
        }));
        setQuestionnaires(questionnairesWithCounts);
      }
    } catch (err: any) {
      console.error('Erreur:', err);
      setError('Erreur lors du chargement des questionnaires.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce questionnaire ?')) return;
    setDeletingId(id);
    try {
      await supabase.from('questionnaires').delete().eq('id', id);
      await fetchQuestionnaires();
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur suppression');
    } finally {
      setDeletingId(null);
    }
  };

  const getTypeLabel = (t: string) => ({
    text: 'Texte libre', choice: 'Choix unique', multiple: 'Choix multiples', rating: 'Note'
  }[t] || t);

  const addQuestion = (type: 'text' | 'choice' | 'multiple' | 'rating') => {
    setQuestions([...questions, {
      id: `temp_${Date.now()}`, question: '', type,
      options: type === 'choice' || type === 'multiple' ? ['', ''] : [],
      obligatoire: true, ordre: questions.length + 1, bareme: type === 'text' ? 5 : 1
    }]);
  };
  const updateQuestion = (id: string, field: string, value: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };
  const removeQuestion = (id: string) => setQuestions(questions.filter(q => q.id !== id));
  const addOption = (qId: string) => setQuestions(questions.map(q => q.id === qId ? { ...q, options: [...q.options, ''] } : q));
  const updateOption = (qId: string, idx: number, val: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) { const o = [...q.options]; o[idx] = val; return { ...q, options: o }; }
      return q;
    }));
  };
  const removeOption = (qId: string, idx: number) => {
    setQuestions(questions.map(q => q.id === qId ? { ...q, options: q.options.filter((_, i) => i !== idx) } : q));
  };

  const handleCreateQuestionnaire = async () => {
    if (!titre.trim()) { alert('Donnez un titre'); return; }
    if (questions.length === 0) { alert('Ajoutez au moins une question'); return; }
    if (questions.some(q => !q.question.trim())) { alert('Toutes les questions doivent avoir un texte'); return; }

    setIsCreating(true);
    try {
      const { data: q, error } = await supabase
        .from('questionnaires')
        .insert({ titre: titre.trim(), description: description.trim() || null, created_by: user?.id })
        .select().single();
      if (error) throw error;

      await supabase.from('questions').insert(questions.map((qu, i) => ({
        questionnaire_id: q.id, question: qu.question.trim(), type: qu.type,
        options: (qu.type === 'choice' || qu.type === 'multiple') ? qu.options.filter(o => o.trim()) : null,
        obligatoire: qu.obligatoire, ordre: i + 1, bareme: qu.bareme
      })));

      alert('Questionnaire créé !');
      setShowCreateQuestionnaire(false);
      setTitre(''); setDescription(''); setQuestions([]);
      await fetchQuestionnaires();
    } catch (err: any) {
      console.error('Erreur:', err);
      alert('Erreur: ' + err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const chargerReponses = async (questionnaireId: number) => {
    setIsLoadingReponses(true);
    try {
      const { data: q } = await supabase.from('questionnaires').select('*').eq('id', questionnaireId).single();
      setSelectedQuestionnaire(q);

      const { data: r } = await supabase
        .from('reponses_stagiaires')
        .select('id, stagiaire_id, date_reponse, note_globale, corrige')
        .eq('questionnaire_id', questionnaireId)
        .order('date_reponse', { ascending: false });

      if (r && r.length > 0) {
        const stagiaireIds = r.map(rep => rep.stagiaire_id);
        const { data: stagiaires } = await supabase
          .from('stagiaires')
          .select('id, matricule, user_id')
          .in('id', stagiaireIds);

        const stagiaireMap = new Map();
        if (stagiaires) {
          const userIds = stagiaires.map(s => s.user_id);
          const { data: users } = await supabase
            .from('users')
            .select('id, username')
            .in('id', userIds);
          
          const userMap = new Map();
          (users || []).forEach(u => userMap.set(u.id, u));

          stagiaires.forEach(s => {
            stagiaireMap.set(s.id, {
              matricule: s.matricule,
              username: userMap.get(s.user_id)?.username || 'Anonyme'
            });
          });
        }

        setReponses(r.map(rep => ({
          id: rep.id,
          stagiaire_username: stagiaireMap.get(rep.stagiaire_id)?.username || 'Anonyme',
          stagiaire_matricule: stagiaireMap.get(rep.stagiaire_id)?.matricule || 'N/A',
          date_reponse: rep.date_reponse,
          note_globale: rep.note_globale,
          corrige: rep.corrige
        })));
      } else {
        setReponses([]);
      }
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setIsLoadingReponses(false);
    }
  };

  const ouvrirCorrection = async (reponseId: number, stagiaireName: string) => {
    setIsOpeningCorrection(true);
    setShowCorrectionModal(true);
    try {
      const { data: questions } = await supabase
        .from('questions')
        .select('*')
        .eq('questionnaire_id', selectedQuestionnaire.id)
        .order('ordre');

      const { data: details } = await supabase
        .from('reponses_details')
        .select('id, reponse, note, commentaire, question_id')
        .eq('reponse_stagiaire_id', reponseId);

      const detailMap = new Map();
      (details || []).forEach(d => detailMap.set(d.question_id, d));

      const correctionDetails = (questions || []).map(q => {
        const detail = detailMap.get(q.id);
        return {
          question_id: q.id,
          question: q.question,
          type: q.type,
          reponse_stagiaire: detail?.reponse || 'Non répondu',
          note: detail?.note ?? null,
          commentaire: detail?.commentaire ?? '',
          bareme: q.bareme || 0
        };
      });

      setCorrectionEnCours({ reponse_id: reponseId, stagiaire: stagiaireName, details: correctionDetails });
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setIsOpeningCorrection(false);
    }
  };

  const updateNote = (questionId: number, note: number) => {
    if (!correctionEnCours) return;
    setCorrectionEnCours({
      ...correctionEnCours,
      details: correctionEnCours.details.map((d: any) =>
        d.question_id === questionId ? { ...d, note: d.bareme > 0 ? Math.min(note, d.bareme) : note } : d
      )
    });
  };

  const updateCommentaire = (questionId: number, commentaire: string) => {
    if (!correctionEnCours) return;
    setCorrectionEnCours({
      ...correctionEnCours,
      details: correctionEnCours.details.map((d: any) =>
        d.question_id === questionId ? { ...d, commentaire } : d
      )
    });
  };

  const calculerNoteTotale = (details: any[]) => {
    const totalBareme = details.reduce((acc: number, d: any) => acc + d.bareme, 0);
    if (totalBareme === 0) return 0;
    const totalNote = details.reduce((acc: number, d: any) => acc + (d.note || 0), 0);
    return Math.round((totalNote / totalBareme) * 20 * 10) / 10;
  };

  const sauvegarderCorrection = async () => {
    if (!correctionEnCours) return;
    setIsSavingCorrection(true);
    try {
      for (const detail of correctionEnCours.details) {
        await supabase
          .from('reponses_details')
          .upsert({
            reponse_stagiaire_id: correctionEnCours.reponse_id,
            question_id: detail.question_id,
            note: detail.note,
            commentaire: detail.commentaire || null
          }, {
            onConflict: 'reponse_stagiaire_id,question_id'
          });
      }

      const noteGlobale = calculerNoteTotale(correctionEnCours.details);
      await supabase
        .from('reponses_stagiaires')
        .update({ note_globale: noteGlobale, corrige: true })
        .eq('id', correctionEnCours.reponse_id);

      alert('Correction sauvegardée !');
      setShowCorrectionModal(false);
      setCorrectionEnCours(null);
      await chargerReponses(selectedQuestionnaire.id);
    } catch (err: any) {
      console.error('Erreur:', err);
      alert('Erreur: ' + err.message);
    } finally {
      setIsSavingCorrection(false);
    }
  };

  const columnsQuestionnaires: Column<Questionnaire>[] = [
    { key: 'titre', header: 'Questionnaire', sortable: true, render: (item) => (
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-50 rounded-lg"><ClipboardList size={20} className="text-indigo-600" /></div>
        <div><p className="text-sm font-medium">{item.titre}</p><p className="text-xs text-gray-500 line-clamp-1">{item.description || 'Aucune description'}</p></div>
      </div>
    )},
    { key: 'questions_count', header: 'Questions', render: (item) => <span className="text-sm">{item.questions_count} questions</span> },
    { key: 'reponses_count', header: 'Réponses', render: (item) => (
      <span className="text-sm">{item.reponses_count} ({item.reponses_corrigees_count} corrigées)</span>
    )},
    { key: 'created_at', header: 'Date', sortable: true, render: (item) => <span className="text-sm text-gray-500">{format(new Date(item.created_at), 'dd/MM/yyyy')}</span> },
    { key: 'actions', header: '', render: (item) => (
      <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} disabled={deletingId === item.id} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-600">
        {deletingId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
      </button>
    )}
  ];

  const columnsReponses: Column<ReponseStagiaire>[] = [
    { key: 'stagiaire_username', header: 'Stagiaire', render: (item) => (
      <div><p className="font-medium">{item.stagiaire_username}</p><p className="text-xs text-gray-500">{item.stagiaire_matricule}</p></div>
    )},
    { key: 'date_reponse', header: 'Date', render: (item) => <span className="text-sm text-gray-500">{format(new Date(item.date_reponse), 'dd/MM/yyyy HH:mm')}</span> },
    { key: 'note_globale', header: 'Note', render: (item) => {
      if (item.note_globale == null) return <span className="text-sm text-gray-400 italic">Non corrigé</span>;
      const color = item.note_globale >= 16 ? 'text-green-600 bg-green-50' : item.note_globale >= 10 ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50';
      return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-bold ${color}`}><Star size={14} />{item.note_globale}/20</span>;
    }},
    { key: 'corrige', header: 'Statut', render: (item) => item.corrige ? <span className="text-xs text-green-600"><CheckCircle size={14} /> Corrigé</span> : <span className="text-xs text-orange-500">⏳ À corriger</span> },
    { key: 'actions', header: '', render: (item) => (
      <button onClick={(e) => { e.stopPropagation(); ouvrirCorrection(item.id, item.stagiaire_username); }} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-xs font-medium">
        <PenTool size={14} className="inline mr-1" />{item.corrige ? 'Modifier' : 'Corriger'}
      </button>
    )}
  ];

  // Afficher le skeleton pendant le chargement
  if (isLoading) {
    return <PageSkeleton />;
  }

  // Afficher l'erreur
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShieldAlert size={48} className="mx-auto text-red-400 mb-4" />
          <p className="text-gray-500">{error}</p>
          <button 
            onClick={fetchQuestionnaires}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Évaluations</h2>
          <p className="text-sm text-gray-500">Créez des questionnaires et corrigez les réponses</p>
        </div>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button onClick={() => setActiveTab('questionnaires')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'questionnaires' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600'}`}><LayoutList size={16} /> Questionnaires</button>
          <button onClick={() => setActiveTab('corrections')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'corrections' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600'}`}><PenTool size={16} /> Corrections</button>
        </div>
      </div>

      {activeTab === 'questionnaires' && (() => {
        const totalReponses = questionnaires.reduce((acc, q) => acc + q.reponses_count, 0);
        const totalCorrigees = questionnaires.reduce((acc, q) => acc + q.reponses_corrigees_count, 0);

        return (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard
                label="Questionnaires"
                value={String(questionnaires.length)}
                icon={<ClipboardList size={18} />}
                size="sm"
              />
              <StatCard
                label="Questions"
                value={String(questionnaires.reduce((acc, q) => acc + q.questions_count, 0))}
                icon={<FileText size={18} />}
                size="sm"
              />
              <StatCard
                label="Réponses"
                value={String(totalReponses)}
                icon={<Users size={18} />}
                size="sm"
              />
              <StatCard
                label="Corrigées"
                value={String(totalCorrigees)}
                icon={<CheckCircle size={18} />}
                size="sm"
              />
            </div>

            <DataTable 
              data={questionnaires} 
              columns={columnsQuestionnaires} 
              searchable 
              searchPlaceholder="Rechercher un questionnaire..." 
              emptyMessage="Aucun questionnaire créé"
              loading={isLoadingQuestionnaires}
              renderHeader={() => (
                <div className="px-6 py-4 border-b flex items-center justify-between bg-white">
                  <h3 className="font-bold text-lg">Mes questionnaires</h3>
                  <button 
                    onClick={() => { setTitre(''); setDescription(''); setQuestions([]); setShowCreateQuestionnaire(true); }} 
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                  >
                    <Plus size={16} /> Nouveau
                  </button>
                </div>
              )}
            />
          </>
        );
      })()}

      {activeTab === 'corrections' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-4">
            <select 
              onChange={(e) => { const id = parseInt(e.target.value); if (id) chargerReponses(id); else { setSelectedQuestionnaire(null); setReponses([]); } }} 
              className="w-full px-4 py-2 border rounded-lg text-sm" 
              defaultValue=""
            >
              <option value="" disabled>Choisir un questionnaire à corriger...</option>
              {questionnaires.map(q => <option key={q.id} value={q.id}>{q.titre} ({q.reponses_count} réponses)</option>)}
            </select>
          </div>
          {selectedQuestionnaire && (
            isLoadingReponses ? (
              <TableSkeleton />
            ) : (
              <DataTable 
                data={reponses} 
                columns={columnsReponses} 
                searchable 
                searchPlaceholder="Rechercher un stagiaire..." 
                emptyMessage="Aucune réponse pour ce questionnaire"
                loading={isLoadingReponses}
                renderHeader={() => (
                  <div className="px-6 py-4 border-b bg-white">
                    <h3 className="font-bold text-lg">{selectedQuestionnaire.titre}</h3>
                    <p className="text-sm text-gray-500">{reponses.length} réponse(s) • {reponses.filter(r => r.corrige).length} corrigée(s)</p>
                  </div>
                )}
              />
            )
          )}
        </div>
      )}

      {/* Modal création questionnaire */}
      {showCreateQuestionnaire && (
        isCreating ? (
          <QuestionnaireFormSkeleton />
        ) : (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreateQuestionnaire(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
              <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white rounded-t-2xl z-10">
                <div><h3 className="text-xl font-bold">Créer un questionnaire</h3><p className="text-sm text-gray-500">Ajoutez des questions avec leur barème</p></div>
                <button onClick={() => setShowCreateQuestionnaire(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Titre du questionnaire *" className="w-full px-4 py-2 border rounded-lg text-lg font-medium" />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optionnelle)" rows={2} className="w-full px-4 py-2 border rounded-lg" />
                
                {questions.map((q, i) => (
                  <div key={q.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full text-xs font-bold mt-1">{i + 1}</span>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 bg-white border rounded text-xs">{getTypeLabel(q.type)}</span>
                          <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={q.obligatoire} onChange={(e) => updateQuestion(q.id, 'obligatoire', e.target.checked)} className="rounded" /> Obligatoire</label>
                          <div className="flex items-center gap-1 text-xs">Barème : <input type="number" value={q.bareme} onChange={(e) => updateQuestion(q.id, 'bareme', parseInt(e.target.value) || 0)} min={0} className="w-14 px-2 py-0.5 border rounded text-center" /> pts</div>
                        </div>
                        <input type="text" value={q.question} onChange={(e) => updateQuestion(q.id, 'question', e.target.value)} placeholder="Votre question..." className="w-full px-3 py-2 bg-white border rounded-lg text-sm" />
                        {(q.type === 'choice' || q.type === 'multiple') && (
                          <div className="space-y-1.5 pl-2">
                            {q.options.map((o, oi) => (
                              <div key={oi} className="flex items-center gap-2">
                                <span className="text-xs text-gray-400 w-4">{q.type === 'choice' ? '○' : '☐'}</span>
                                <input type="text" value={o} onChange={(e) => updateOption(q.id, oi, e.target.value)} placeholder={`Option ${oi + 1}`} className="flex-1 px-2 py-1 bg-white border rounded text-sm" />
                                <button onClick={() => removeOption(q.id, oi)} className="text-red-400 text-xs">✕</button>
                              </div>
                            ))}
                            <button onClick={() => addOption(q.id)} className="text-xs text-indigo-600 font-medium">+ Ajouter une option</button>
                          </div>
                        )}
                      </div>
                      <button onClick={() => removeQuestion(q.id)} className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
                  <p className="text-sm font-medium mb-3">Ajouter une question</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => addQuestion('text')} className="flex items-center gap-2 p-3 bg-white border rounded-lg hover:border-indigo-400 text-sm"><Type size={18} className="text-indigo-600" /> Texte libre</button>
                    <button onClick={() => addQuestion('choice')} className="flex items-center gap-2 p-3 bg-white border rounded-lg hover:border-blue-400 text-sm"><List size={18} className="text-blue-600" /> Choix unique</button>
                    <button onClick={() => addQuestion('multiple')} className="flex items-center gap-2 p-3 bg-white border rounded-lg hover:border-green-400 text-sm"><CheckSquare size={18} className="text-green-600" /> Choix multiples</button>
                    <button onClick={() => addQuestion('rating')} className="flex items-center gap-2 p-3 bg-white border rounded-lg hover:border-amber-400 text-sm"><Star size={18} className="text-amber-600" /> Note/Échelle</button>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-6 border-t bg-gray-50 rounded-b-2xl">
                <span className="text-sm text-gray-500">{questions.length} question(s) • Barème total: {questions.reduce((acc, q) => acc + q.bareme, 0)} pts</span>
                <div className="flex gap-2">
                  <button onClick={() => setShowCreateQuestionnaire(false)} className="px-4 py-2 border rounded-lg text-sm">Annuler</button>
                  <button onClick={handleCreateQuestionnaire} disabled={isCreating} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium">
                    {isCreating ? <><Loader2 size={16} className="animate-spin" /> Création...</> : <><Save size={16} /> Créer</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {/* Modal correction */}
      {showCorrectionModal && (
        isOpeningCorrection ? (
          <CorrectionModalSkeleton />
        ) : correctionEnCours ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowCorrectionModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b">
                <div><h3 className="text-xl font-bold">Correction</h3><p className="text-sm text-gray-500">{correctionEnCours.stagiaire}</p></div>
                <div className="flex items-center gap-3">
                  <div className="text-right"><p className="text-xs text-gray-500">Note totale</p><p className="text-2xl font-bold text-indigo-600">{calculerNoteTotale(correctionEnCours.details)}/20</p></div>
                  <button onClick={() => setShowCorrectionModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {correctionEnCours.details.map((detail: any, i: number) => (
                  <div key={detail.question_id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full text-xs font-bold">Q{i + 1}</span>
                      <span className="text-sm text-gray-500">{getTypeLabel(detail.type)}</span>
                      <span className="text-xs text-gray-400">Barème: {detail.bareme} pts</span>
                    </div>
                    <p className="font-medium text-gray-900 mb-3">{detail.question}</p>
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-xs text-gray-500 mb-1">Réponse du stagiaire :</p>
                      <p className="text-sm">{detail.reponse_stagiaire || 'Non répondu'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Note {detail.bareme > 0 ? `(sur ${detail.bareme})` : '(sans barème)'}</label>
                        <input type="number" value={detail.note ?? ''} onChange={(e) => updateNote(detail.question_id, parseFloat(e.target.value) || 0)} min={0} max={detail.bareme || 999} step={0.5} className="w-full px-3 py-1.5 border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Commentaire</label>
                        <input type="text" value={detail.commentaire || ''} onChange={(e) => updateCommentaire(detail.question_id, e.target.value)} className="w-full px-3 py-1.5 border rounded-lg text-sm" placeholder="Commentaire..." />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between p-6 border-t bg-gray-50 rounded-b-2xl">
                <span className="text-sm text-gray-500">{correctionEnCours.details.filter((d: any) => d.note != null).length}/{correctionEnCours.details.length} questions notées</span>
                <div className="flex gap-2">
                  <button onClick={() => setShowCorrectionModal(false)} className="px-4 py-2 border rounded-lg text-sm">Annuler</button>
                  <button onClick={sauvegarderCorrection} disabled={isSavingCorrection} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium">
                    {isSavingCorrection ? <><Loader2 size={16} className="animate-spin" /> Sauvegarde...</> : <><Save size={16} /> Sauvegarder</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}