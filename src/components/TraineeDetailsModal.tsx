"use client";
import { XCircle, School, GraduationCap, Briefcase, CalendarDays, User, Phone, Check, X } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import type { Trainee } from '@/data/traineesData';

interface TraineeDetailsModalProps {
  trainee: Trainee;
  onClose: () => void;
}

export function TraineeDetailsModal({ trainee, onClose }: TraineeDetailsModalProps) {
  if (!trainee) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative border border-gray-100" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <XCircle size={24} />
        </button>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-bold border-2 border-indigo-200">
            {trainee.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{trainee.name}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
              <School size={14} /> {trainee.school}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="text-xs text-gray-400 uppercase font-semibold">Type</span>
            <div className="flex items-center gap-2 mt-1 font-medium text-gray-800">
              {trainee.type === 'Académique' ? <GraduationCap size={16} className="text-blue-600" /> : <Briefcase size={16} className="text-purple-600" />}
              {trainee.type}
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="text-xs text-gray-400 uppercase font-semibold">Période</span>
            <div className="flex items-center gap-2 mt-1 font-medium text-gray-800">
              <CalendarDays size={16} className="text-gray-600" /> {trainee.period}
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg col-span-2">
            <span className="text-xs text-gray-400 uppercase font-semibold">Contact</span>
            <div className="mt-1 font-medium text-gray-800 flex flex-col gap-1">
              <span className="flex items-center gap-2"><User size={14} /> {trainee.email}</span>
              <span className="flex items-center gap-2"><Phone size={14} /> {trainee.phone}</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg col-span-2 flex justify-between items-center">
            <div>
              <span className="text-xs text-gray-400 uppercase font-semibold">Statut actuel</span>
              <div className="mt-1">
                <StatusBadge status={trainee.status} />
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400 uppercase font-semibold">Note générale</span>
              <div className="mt-1 flex items-center gap-2 justify-end">
                <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${trainee.score >= 70 ? 'bg-emerald-500' : trainee.score >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${trainee.score}%` }}></div>
                </div>
                <span className="font-bold text-gray-800 text-sm">{trainee.score}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">Fermer</button>
        </div>
      </div>
    </div>
  );
}