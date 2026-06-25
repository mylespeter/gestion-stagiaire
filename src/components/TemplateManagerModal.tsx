// Composant à ajouter dans le même fichier ou dans un fichier séparé
// components/TemplateManagerModal.tsx

"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Plus, Edit, Trash2, X, Save, GripVertical, 
  FileText, HelpCircle, Hash, MoveUp, MoveDown
} from 'lucide-react';

interface EvaluationTemplate {
  id: number;
  titre: string;
  description: string;
  question_count?: number;
  created_at?: string;
}

interface EvaluationQuestion {
  id: number;
  template_id: number;
  question: string;
  ordre: number;
  coefficient: number;
  max_note: number;
}

interface TemplateManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: EvaluationTemplate[];
  onUpdate: () => void;
}

export function TemplateManagerModal({ 
  isOpen, 
  onClose, 
  templates, 
  onUpdate 
}: TemplateManagerModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<EvaluationTemplate | null>(null);
  const [questions, setQuestions] = useState<EvaluationQuestion[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Formulaire template
  const [templateForm, setTemplateForm] = useState({
    titre: '',
    description: ''
  });

  // Formulaire question
  const [questionForm, setQuestionForm] = useState({
    question: '',
    coefficient: 1,
    max_note: 20
  });
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);

  useEffect(() => {
    if (selectedTemplate) {
      loadQuestions(selectedTemplate.id);
    }
  }, [selectedTemplate]);

  const loadQuestions = async (templateId: number) => {
    const { data } = await supabase
      .from('evaluation_questions')
      .select('*')
      .eq('template_id', templateId)
      .order('ordre');
    
    if (data) setQuestions(data);
  };

  const handleCreateTemplate = async () => {
    if (!templateForm.titre.trim()) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from('evaluation_templates')
      .insert({
        titre: templateForm.titre,
        description: templateForm.description,
        created_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (!error && data) {
      setTemplateForm({ titre: '', description: '' });
      setShowForm(false);
      onUpdate();
      setSelectedTemplate(data);
      setIsEditing(true);
    }
    setIsLoading(false);
  };

  const handleUpdateTemplate = async () => {
    if (!selectedTemplate || !templateForm.titre.trim()) return;
    
    setIsLoading(true);
    const { error } = await supabase
      .from('evaluation_templates')
      .update({
        titre: templateForm.titre,
        description: templateForm.description
      })
      .eq('id', selectedTemplate.id);

    if (!error) {
      onUpdate();
      setIsEditing(false);
    }
    setIsLoading(false);
  };

  const handleDeleteTemplate = async (templateId: number) => {
    if (!confirm('Supprimer ce modèle et toutes ses questions ?')) return;
    
    setIsLoading(true);
    const { error } = await supabase
      .from('evaluation_templates')
      .delete()
      .eq('id', templateId);

    if (!error) {
      setSelectedTemplate(null);
      setQuestions([]);
      onUpdate();
    }
    setIsLoading(false);
  };

  const handleAddQuestion = async () => {
    if (!selectedTemplate || !questionForm.question.trim()) return;
    
    setIsLoading(true);
    const maxOrdre = questions.length > 0 
      ? Math.max(...questions.map(q => q.ordre)) 
      : 0;

    const { error } = await supabase
      .from('evaluation_questions')
      .insert({
        template_id: selectedTemplate.id,
        question: questionForm.question,
        ordre: maxOrdre + 1,
        coefficient: questionForm.coefficient,
        max_note: questionForm.max_note
      });

    if (!error) {
      setQuestionForm({ question: '', coefficient: 1, max_note: 20 });
      loadQuestions(selectedTemplate.id);
    }
    setIsLoading(false);
  };

  const handleUpdateQuestion = async (questionId: number) => {
    if (!questionForm.question.trim()) return;
    
    setIsLoading(true);
    const { error } = await supabase
      .from('evaluation_questions')
      .update({
        question: questionForm.question,
        coefficient: questionForm.coefficient,
        max_note: questionForm.max_note
      })
      .eq('id', questionId);

    if (!error) {
      setEditingQuestionId(null);
      setQuestionForm({ question: '', coefficient: 1, max_note: 20 });
      loadQuestions(selectedTemplate!.id);
    }
    setIsLoading(false);
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (!confirm('Supprimer cette question ?')) return;
    
    setIsLoading(true);
    const { error } = await supabase
      .from('evaluation_questions')
      .delete()
      .eq('id', questionId);

    if (!error) {
      loadQuestions(selectedTemplate!.id);
    }
    setIsLoading(false);
  };

  const handleMoveQuestion = async (questionId: number, direction: 'up' | 'down') => {
    const currentIndex = questions.findIndex(q => q.id === questionId);
    if (
      (direction === 'up' && currentIndex === 0) || 
      (direction === 'down' && currentIndex === questions.length - 1)
    ) return;

    const newQuestions = [...questions];
    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Échanger les ordres
    const tempOrdre = newQuestions[currentIndex].ordre;
    newQuestions[currentIndex].ordre = newQuestions[swapIndex].ordre;
    newQuestions[swapIndex].ordre = tempOrdre;

    setIsLoading(true);
    const { error } = await supabase
      .from('evaluation_questions')
      .upsert([
        { id: newQuestions[currentIndex].id, ordre: newQuestions[currentIndex].ordre },
        { id: newQuestions[swapIndex].id, ordre: newQuestions[swapIndex].ordre }
      ]);

    if (!error) {
      loadQuestions(selectedTemplate!.id);
    }
    setIsLoading(false);
  };

  const startEditQuestion = (question: EvaluationQuestion) => {
    setEditingQuestionId(question.id);
    setQuestionForm({
      question: question.question,
      coefficient: question.coefficient,
      max_note: question.max_note
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Modèles d'évaluation
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Créez et gérez vos modèles avec leurs questions
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Liste des templates */}
          <div className="w-72 border-r bg-gray-50/50 p-4 space-y-3 overflow-y-auto">
            <button
              onClick={() => {
                setShowForm(true);
                setSelectedTemplate(null);
                setTemplateForm({ titre: '', description: '' });
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
            >
              <Plus size={16} />
              Nouveau modèle
            </button>

            <div className="space-y-1">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplate(template);
                    setTemplateForm({
                      titre: template.titre,
                      description: template.description || ''
                    });
                    setShowForm(false);
                    setIsEditing(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    selectedTemplate?.id === template.id
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={14} className="flex-shrink-0" />
                      <span className="truncate">{template.titre}</span>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {template.question_count} Q
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {showForm || selectedTemplate ? (
              <>
                {/* Formulaire template */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-medium text-gray-900 mb-3">
                    {selectedTemplate ? 'Modifier le modèle' : 'Nouveau modèle'}
                  </h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Titre du modèle"
                      value={templateForm.titre}
                      onChange={(e) => setTemplateForm({ ...templateForm, titre: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                    <textarea
                      placeholder="Description (optionnelle)"
                      value={templateForm.description}
                      onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                    <div className="flex gap-2">
                      {selectedTemplate ? (
                        <>
                          <button
                            onClick={handleUpdateTemplate}
                            disabled={isLoading}
                            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                          >
                            <Save size={14} /> Enregistrer
                          </button>
                          <button
                            onClick={() => handleDeleteTemplate(selectedTemplate.id)}
                            disabled={isLoading}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                          >
                            <Trash2 size={14} /> Supprimer
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleCreateTemplate}
                          disabled={isLoading}
                          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                        >
                          <Plus size={14} /> Créer
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Gestion des questions */}
                {selectedTemplate && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Questions ({questions.length})
                    </h4>

                    {/* Ajouter une question */}
                    <div className="mb-4 p-3 border border-dashed border-gray-300 rounded-lg space-y-2">
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-6">
                          <input
                            type="text"
                            placeholder="Nouvelle question..."
                            value={questionForm.question}
                            onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            placeholder="Coeff."
                            value={questionForm.coefficient}
                            onChange={(e) => setQuestionForm({ ...questionForm, coefficient: parseFloat(e.target.value) || 0 })}
                            min="0.5"
                            max="10"
                            step="0.5"
                            className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            placeholder="Max"
                            value={questionForm.max_note}
                            onChange={(e) => setQuestionForm({ ...questionForm, max_note: parseInt(e.target.value) || 0 })}
                            min="1"
                            max="100"
                            className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          {editingQuestionId ? (
                            <button
                              onClick={() => handleUpdateQuestion(editingQuestionId)}
                              disabled={isLoading}
                              className="w-full px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                            >
                              <Save size={14} />
                            </button>
                          ) : (
                            <button
                              onClick={handleAddQuestion}
                              disabled={isLoading}
                              className="w-full px-3 py-1.5 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                            >
                              <Plus size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                      {editingQuestionId && (
                        <button
                          onClick={() => {
                            setEditingQuestionId(null);
                            setQuestionForm({ question: '', coefficient: 1, max_note: 20 });
                          }}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Annuler
                        </button>
                      )}
                    </div>

                    {/* Liste des questions */}
                    <div className="space-y-2">
                      {questions.map((question, index) => (
                        <div
                          key={question.id}
                          className="flex items-center gap-2 p-3 bg-white border rounded-lg hover:border-indigo-200 transition-colors"
                        >
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleMoveQuestion(question.id, 'up')}
                              disabled={index === 0}
                              className="p-0.5 hover:bg-gray-100 rounded disabled:opacity-30"
                            >
                              <MoveUp size={12} />
                            </button>
                            <button
                              onClick={() => handleMoveQuestion(question.id, 'down')}
                              disabled={index === questions.length - 1}
                              className="p-0.5 hover:bg-gray-100 rounded disabled:opacity-30"
                            >
                              <MoveDown size={12} />
                            </button>
                          </div>
                          
                          <span className="text-xs text-gray-400 w-6 text-center">
                            {index + 1}
                          </span>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 truncate">
                              {question.question}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Hash size={10} />
                                Coeff: {question.coefficient}
                              </span>
                              <span>Max: {question.max_note}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => startEditQuestion(question)}
                              className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-indigo-600"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(question.id)}
                              className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-red-600"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}

                      {questions.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          <HelpCircle size={32} className="mx-auto mb-2" />
                          <p className="text-sm">Aucune question</p>
                          <p className="text-xs">Ajoutez votre première question</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <FileText size={48} className="mb-3" />
                <p className="text-lg font-medium">Gestionnaire de modèles</p>
                <p className="text-sm mt-1">
                  Sélectionnez un modèle ou créez-en un nouveau
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}