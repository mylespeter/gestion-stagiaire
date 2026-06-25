"use client";
import { FolderOpen, Users, Calendar, MoreHorizontal } from 'lucide-react';

const projects = [
  { id: 1, name: 'Plateforme Recrutement', description: 'Refonte du processus de candidature', members: 5, progress: 75, dueDate: '15 Avril', color: 'bg-indigo-500' },
  { id: 2, name: 'Suivi Stagiaires 2026', description: 'Application de gestion des stagiaires', members: 8, progress: 90, dueDate: '30 Mars', color: 'bg-emerald-500' },
  { id: 3, name: 'Formation Tuteurs', description: 'Programme de formation en ligne', members: 3, progress: 45, dueDate: '10 Mai', color: 'bg-amber-500' },
  { id: 4, name: 'Évaluation Compétences', description: 'Outil d\'évaluation des compétences', members: 4, progress: 20, dueDate: '25 Juin', color: 'bg-purple-500' },
];

export function ProjectsPage() {
  return (
    <div className="flex-1 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-bold text-gray-900">Projets</h2>
        <p className="text-sm text-gray-500">4 projets en cours</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${project.color} text-white flex items-center justify-center`}>
                    <FolderOpen size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-500">{project.description}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal size={18} />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Progression</span>
                    <span className="font-medium text-gray-700">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${project.color}`} 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Users size={14} />
                    <span>{project.members}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>{project.dueDate}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}