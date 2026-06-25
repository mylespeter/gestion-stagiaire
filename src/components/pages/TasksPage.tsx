"use client";
import { CheckCircle2, Circle, Clock, AlertCircle, Plus } from 'lucide-react';

const tasks = [
  { id: 1, title: 'Valider les candidatures', description: '3 stagiaires en attente', priority: 'high', dueDate: 'Aujourd\'hui', completed: false },
  { id: 2, title: 'Préparer les conventions', description: 'Documents à signer pour 2 stagiaires', priority: 'medium', dueDate: 'Demain', completed: false },
  { id: 3, title: 'Réunion équipe pédagogique', description: 'Bilan mensuel des stages', priority: 'low', dueDate: '28 Mars', completed: true },
  { id: 4, title: 'Mise à jour CRM', description: 'Ajouter les nouveaux contacts', priority: 'medium', dueDate: 'Cette semaine', completed: false },
  { id: 5, title: 'Envoyer les évaluations', description: 'Formulaires à transmettre aux tuteurs', priority: 'high', dueDate: 'Aujourd\'hui', completed: false },
  { id: 6, title: 'Rédiger le rapport trimestriel', description: 'Statistiques et analyses des stages', priority: 'low', dueDate: '30 Mars', completed: false },
];

export function TasksPage() {
  const completedCount = tasks.filter(t => t.completed).length;
  
  return (
    <div className="flex-1 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-900">Mes tâches</h2>
          <p className="text-sm text-gray-500">{completedCount}/{tasks.length} terminées</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus size={16} /> Nouvelle tâche
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-start gap-4 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors group">
            <button className="mt-0.5 flex-shrink-0">
              {task.completed ? (
                <CheckCircle2 size={20} className="text-emerald-500" />
              ) : (
                <Circle size={20} className="text-gray-300 group-hover:text-indigo-400 transition-colors" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                  {task.title}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  task.priority === 'high' ? 'bg-red-50 text-red-600' :
                  task.priority === 'medium' ? 'bg-amber-50 text-amber-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{task.description}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {task.priority === 'high' && !task.completed ? (
                <AlertCircle size={16} className="text-red-500" />
              ) : (
                <Clock size={16} className="text-gray-400" />
              )}
              <span className="text-xs text-gray-400">{task.dueDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}