
// "use client";

// import { XCircle, Mail, Building, Calendar, Phone, MapPin, Shield } from 'lucide-react';
// import { useAuth } from '@/context/AuthContext';

// interface ProfileModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
//   const { user } = useAuth();

//   if (!isOpen || !user) return null;

//   const getRoleLabel = (role: string) => {
//     const labels: Record<string, string> = {
//       'coordinateur': 'Coordinateur',
//       'stagiaire': 'Stagiaire',
//       'encadreur': 'Encadreur',
//       'admin': 'Administrateur'
//     };
//     return labels[role] || role;
//   };

//   const initials = user.username
//     .split(' ')
//     .map((n: string) => n[0])
//     .join('')
//     .toUpperCase()
//     .slice(0, 2);

//   return (
//     <div 
//       className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       <div 
//         className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative border border-gray-100"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
//           <XCircle size={24} />
//         </button>
        
//         <div className="flex items-center gap-4 mb-6">
//           <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-bold border-2 border-indigo-200">
//             {initials}
//           </div>
//           <div>
//             <h3 className="text-xl font-bold text-gray-900">{user.username}</h3>
//             <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
//               <Shield size={14} /> {getRoleLabel(user.role)}
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-4">
//           <div className="bg-gray-50 p-3 rounded-lg">
//             <span className="text-xs text-gray-400 uppercase font-semibold">Email</span>
//             <div className="flex items-center gap-2 mt-1 font-medium text-gray-800">
//               <Mail size={16} className="text-gray-600" /> {user.email}
//             </div>
//           </div>
          
//           <div className="bg-gray-50 p-3 rounded-lg">
//             <span className="text-xs text-gray-400 uppercase font-semibold">Téléphone</span>
//             <div className="flex items-center gap-2 mt-1 font-medium text-gray-800">
//               <Phone size={16} className="text-gray-600" /> {user.telephone || 'Non renseigné'}
//             </div>
//           </div>
          
//           <div className="bg-gray-50 p-3 rounded-lg">
//             <span className="text-xs text-gray-400 uppercase font-semibold">Genre</span>
//             <div className="flex items-center gap-2 mt-1 font-medium text-gray-800">
//               <Building size={16} className="text-gray-600" /> {user.genre === 'M' ? 'Masculin' : user.genre === 'F' ? 'Féminin' : 'Non spécifié'}
//             </div>
//           </div>
          
//           <div className="bg-gray-50 p-3 rounded-lg">
//             <span className="text-xs text-gray-400 uppercase font-semibold">Rôle</span>
//             <div className="flex items-center gap-2 mt-1 font-medium text-gray-800">
//               <MapPin size={16} className="text-gray-600" /> {getRoleLabel(user.role)}
//             </div>
//           </div>
          
//           <div className="bg-gray-50 p-3 rounded-lg col-span-2">
//             <span className="text-xs text-gray-400 uppercase font-semibold">Membre depuis</span>
//             <div className="flex items-center gap-2 mt-1 font-medium text-gray-800">
//               <Calendar size={16} className="text-gray-600" /> {new Date(user.created_at).toLocaleDateString('fr-FR')}
//             </div>
//           </div>
//         </div>
        
//         <div className="mt-6 flex justify-end">
//           <button onClick={onClose} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
//             Fermer
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useRef } from 'react';
import { XCircle, Mail, Building, Calendar, Phone, MapPin, Shield, Camera, Check, Pencil } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    telephone: user?.telephone || '',
  });

  if (!isOpen || !user) return null;

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      'coordinateur': 'Coordinateur',
      'stagiaire': 'Stagiaire',
      'encadreur': 'Encadreur',
      'admin': 'Administrateur'
    };
    return labels[role] || role;
  };

  const initials = formData.username
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      // Mettre à jour dans la base de données
      const { data, error: updateError } = await supabase
        .from('users')
        .update({ photo_profil: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Mettre à jour le contexte
      updateUser({ ...user, photo_profil: publicUrl });
    } catch (error) {
      console.error('Erreur upload:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ 
          username: formData.username, 
          telephone: formData.telephone,
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      updateUser({ ...user, username: formData.username, telephone: formData.telephone });
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur mise à jour:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user.username,
      telephone: user.telephone || '',
    });
    setIsEditing(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <XCircle size={24} />
        </button>
        
        {/* Avatar avec bouton modification */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative group">
            {user.photo_profil ? (
              <img 
                src={user.photo_profil} 
                alt={user.username}
                className="w-14 h-14 rounded-full object-cover border-2 border-indigo-200"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-bold border-2 border-indigo-200">
                {initials}
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {uploading ? (
                <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Camera size={12} className="text-gray-500" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full text-xl font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            ) : (
              <h3 className="text-xl font-bold text-gray-900">{user.username}</h3>
            )}
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
              <Shield size={14} /> {getRoleLabel(user.role)}
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Pencil size={16} className="text-gray-400" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-4">
          <div className="bg-gray-50 p-3 rounded-lg col-span-2">
            <span className="text-xs text-gray-400 uppercase font-semibold">Email</span>
            <div className="flex items-center gap-2 mt-1 font-medium text-gray-800">
              <Mail size={16} className="text-gray-600" /> {user.email}
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg col-span-2">
            <span className="text-xs text-gray-400 uppercase font-semibold">Téléphone</span>
            <div className="flex items-center gap-2 mt-1 font-medium text-gray-800">
              <Phone size={16} className="text-gray-600" />
              {isEditing ? (
                <input
                  type="text"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className="flex-1 bg-white border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="+33 6 00 00 00 00"
                />
              ) : (
                <span>{user.telephone || 'Non renseigné'}</span>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="text-xs text-gray-400 uppercase font-semibold">Genre</span>
            <div className="flex items-center gap-2 mt-1 font-medium text-gray-800">
              <Building size={16} className="text-gray-600" /> {user.genre === 'M' ? 'Masculin' : user.genre === 'F' ? 'Féminin' : 'Non spécifié'}
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="text-xs text-gray-400 uppercase font-semibold">Rôle</span>
            <div className="flex items-center gap-2 mt-1 font-medium text-gray-800">
              <MapPin size={16} className="text-gray-600" /> {getRoleLabel(user.role)}
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg col-span-2">
            <span className="text-xs text-gray-400 uppercase font-semibold">Membre depuis</span>
            <div className="flex items-center gap-2 mt-1 font-medium text-gray-800">
              <Calendar size={16} className="text-gray-600" /> {new Date(user.created_at).toLocaleDateString('fr-FR')}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end gap-3">
          {isEditing ? (
            <>
              <button 
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Check size={16} />
                Enregistrer
              </button>
            </>
          ) : (
            <button 
              onClick={onClose} 
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Fermer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}