// app/profile/page.tsx
'use client';

import { useState } from 'react';
import { useAuth, useRole } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  User, Phone, Mail, Calendar, Save, Edit, Lock, CheckCircle2, Loader2, X, Shield
} from 'lucide-react';

// Configuration des rôles
const ROLE_LABELS: Record<string, string> = {
  coordinateur: 'Coordinateur',
  encadreur: 'Encadreur',
  stagiaire: 'Stagiaire',
  admin: 'Administrateur',
};

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { role } = useRole();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    telephone: user?.telephone || '',
    genre: user?.genre || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  const roleLabel = ROLE_LABELS[user.role] || user.role;

  const handleSave = async () => {
    if (!formData.username.trim()) {
      setError('Le nom est requis');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updateData: any = {
        username: formData.username.trim(),
        telephone: formData.telephone || null,
        genre: formData.genre || null,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      if (updateError) throw updateError;

      updateUser({ ...user, ...updateData });
      
      setSuccess('Profil mis à jour');
      setIsEditing(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (passwordData.newPassword.length < 4) {
      setError('Minimum 4 caractères');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const { data: userData, error: checkError } = await supabase
        .from('users')
        .select('password')
        .eq('id', user.id)
        .single();

      if (checkError) throw checkError;
      if (userData.password !== passwordData.currentPassword) {
        setError('Mot de passe actuel incorrect');
        setSaving(false);
        return;
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ password: passwordData.newPassword, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setSuccess('Mot de passe modifié');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  // Avatar avec initiales
  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
  };

  const avatarColors = [
    'bg-indigo-100 text-indigo-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
  ];
  const colorIndex = (user.username || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % avatarColors.length;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Titre */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Mon profil</h2>
        <p className="text-sm text-gray-500 mt-1">Gérez vos informations personnelles</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">!</div>
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          <CheckCircle2 size={16} className="flex-shrink-0" />
          {success}
        </div>
      )}

      {/* Carte profil */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* En-tête avatar */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 ${avatarColors[colorIndex]} rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0`}>
              {getInitials(user.username)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{user.username}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                  <Shield size={10} /> {roleLabel}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">Inscrit le {formatDate(user.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Nom complet *</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Genre</label>
                  <select
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="">Non spécifié</option>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    placeholder="+243 XXX XXX XXX"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ username: user.username, telephone: user.telephone || '', genre: user.genre || '' });
                    setError(null);
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium transition-colors"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Enregistrer
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoBlock icon={<User size={16} />} label="Nom complet" value={user.username} />
                <InfoBlock icon={<User size={16} />} label="Genre" value={user.genre === 'M' ? 'Masculin' : user.genre === 'F' ? 'Féminin' : 'Non spécifié'} />
                <InfoBlock icon={<Mail size={16} />} label="Email" value={user.email} />
                <InfoBlock icon={<Phone size={16} />} label="Téléphone" value={user.telephone || 'Non renseigné'} />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Lock size={16} /> Mot de passe
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
                >
                  <Edit size={16} /> Modifier
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal mot de passe */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowPasswordModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Changer le mot de passe</h3>
              <button onClick={() => setShowPasswordModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Mot de passe actuel</label>
                <input type="password" value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Nouveau mot de passe</label>
                <input type="password" value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20" />
                <p className="text-xs text-gray-400 mt-1">Minimum 4 caractères</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Confirmer</label>
                <input type="password" value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20" />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">Annuler</button>
              <button onClick={handleChangePassword} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium">
                {saving ? <Loader2 size={16} className="animate-spin" /> : null} Modifier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Petit composant pour les blocs d'info
function InfoBlock({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
      <div className="text-gray-400 flex-shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900 truncate">{value || '—'}</p>
      </div>
    </div>
  );
}