// components/users/UserDetailsModal.tsx
"use client";
import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { User } from '@/context/AuthContext';
import { Mail, Phone, Calendar, Shield, User as UserIcon, Clock } from 'lucide-react';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function UserDetailsModal({ isOpen, onClose, user }: UserDetailsModalProps) {
  if (!user) return null;

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: 'bg-purple-100 text-purple-700',
      coordinateur: 'bg-blue-100 text-blue-700',
      encadreur: 'bg-emerald-100 text-emerald-700',
      stagiaire: 'bg-amber-100 text-amber-700',
    };
    return badges[role as keyof typeof badges] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Détails de l'utilisateur"
      subtitle={`ID: ${user.id}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Avatar + Info principale */}
        <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-xl font-medium text-gray-600">
            {user.photo_profil ? (
              <img src={user.photo_profil} alt={user.username} className="w-full h-full rounded-full object-cover" />
            ) : (
              user.username?.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{user.username}</h3>
            <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleBadge(user.role)}`}>
              {user.role}
            </span>
          </div>
        </div>

        {/* Informations */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Informations personnelles</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Email</label>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Mail size={14} className="text-gray-400" />
                <span>{user.email}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400">Téléphone</label>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Phone size={14} className="text-gray-400" />
                <span>{user.telephone || 'Non renseigné'}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400">Genre</label>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <UserIcon size={14} className="text-gray-400" />
                <span>{user.genre === 'M' ? 'Masculin' : user.genre === 'F' ? 'Féminin' : 'Non spécifié'}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400">Rôle</label>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Shield size={14} className="text-gray-400" />
                <span className="capitalize">{user.role}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400">Créé le</label>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Calendar size={14} className="text-gray-400" />
                <span>{formatDate(user.created_at)}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400">Dernière modification</label>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock size={14} className="text-gray-400" />
                <span>{formatDate(user.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
        <button 
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Fermer
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
          Modifier
        </button>
      </div>
    </Modal>
  );
}