// components/users/UserFormModal.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { User, UserRole } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userToEdit?: User | null;
}

export function UserFormModal({ isOpen, onClose, onSuccess, userToEdit }: UserFormModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'stagiaire' as UserRole,
    genre: 'M' as 'M' | 'F',
    telephone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isEditing = !!userToEdit;

  // Préremplir les données quand on édite un utilisateur
  useEffect(() => {
    if (isOpen) {
      if (userToEdit) {
        console.log('Préremplissage avec:', userToEdit); // Debug
        setFormData({
          username: userToEdit.username || '',
          email: userToEdit.email || '',
          password: '', // On ne préremplit jamais le mot de passe
          role: userToEdit.role || 'stagiaire',
          genre: userToEdit.genre || 'M',
          telephone: userToEdit.telephone || '',
        });
      } else {
        // Reset du formulaire pour un nouvel utilisateur
        setFormData({
          username: '',
          email: '',
          password: '',
          role: 'stagiaire',
          genre: 'M',
          telephone: '',
        });
      }
      setError('');
      setSuccess('');
    }
  }, [isOpen, userToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isEditing && userToEdit) {
        // Vérifier si l'email a changé et s'il n'est pas déjà utilisé
        if (formData.email !== userToEdit.email) {
          const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', formData.email.toLowerCase().trim())
            .neq('id', userToEdit.id)
            .single();

          if (existingUser) {
            throw new Error('Cet email est déjà utilisé par un autre utilisateur');
          }
        }

        // Préparer les données de mise à jour
        const updateData: any = {
          username: formData.username.trim(),
          email: formData.email.toLowerCase().trim(),
          role: formData.role,
          genre: formData.genre,
          telephone: formData.telephone.trim(),
          updated_at: new Date().toISOString(),
        };

        // Ajouter le mot de passe seulement s'il est fourni
        if (formData.password.trim()) {
          if (formData.password.length < 6) {
            throw new Error('Le mot de passe doit contenir au moins 6 caractères');
          }
          updateData.password = formData.password;
        }

        const { error: updateError } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', userToEdit.id);

        if (updateError) throw updateError;
        
        setSuccess('Utilisateur modifié avec succès !');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1000);
        
      } else {
        // Création d'un nouvel utilisateur
        // Vérifier si l'email existe déjà
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', formData.email.toLowerCase().trim())
          .single();

        if (existingUser) {
          throw new Error('Cet email est déjà utilisé');
        }

        if (formData.password.length < 6) {
          throw new Error('Le mot de passe doit contenir au moins 6 caractères');
        }

        const { error: insertError } = await supabase
          .from('users')
          .insert([{
            username: formData.username.trim(),
            email: formData.email.toLowerCase().trim(),
            password: formData.password,
            role: formData.role,
            genre: formData.genre,
            telephone: formData.telephone.trim(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }]);

        if (insertError) throw insertError;
        
        setSuccess('Utilisateur créé avec succès !');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEditing ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
      subtitle={isEditing ? `Modification de ${userToEdit?.username}` : "Créez un nouveau compte utilisateur"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Messages */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-sm text-emerald-700">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {/* Nom d'utilisateur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nom d'utilisateur <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="john.doe"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="john@example.com"
              required
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Mot de passe {!isEditing && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder={isEditing ? "Laisser vide pour ne pas changer" : "Minimum 6 caractères"}
              required={!isEditing}
              minLength={isEditing ? undefined : 6}
            />
            {isEditing && (
              <p className="text-xs text-gray-400 mt-1">
                Laissez vide pour conserver le mot de passe actuel
              </p>
            )}
          </div>

          {/* Rôle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Rôle <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option value="stagiaire">Stagiaire</option>
              <option value="encadreur">Encadreur</option>
              <option value="coordinateur">Coordinateur</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Genre
            </label>
            <select
              value={formData.genre}
              onChange={(e) => handleChange('genre', e.target.value as 'M' | 'F')}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Téléphone
            </label>
            <input
              type="tel"
              value={formData.telephone}
              onChange={(e) => handleChange('telephone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="+33 6 12 34 56 78"
            />
          </div>
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {isEditing ? 'Modification...' : 'Création...'}
              </>
            ) : (
              isEditing ? 'Modifier' : 'Créer'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}