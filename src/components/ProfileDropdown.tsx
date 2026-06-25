
// "use client";

// import { useRef, useEffect } from 'react';
// import { User, Settings, HelpCircle, LogOut, ChevronRight, Shield } from 'lucide-react';
// import { useAuth } from '@/context/AuthContext';

// interface ProfileDropdownProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onProfileClick: () => void;
//   onLogout?: () => void;
// }

// export function ProfileDropdown({ isOpen, onClose, onProfileClick, onLogout }: ProfileDropdownProps) {
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const { user, logout } = useAuth();

//   const initials = user?.username
//     .split(' ')
//     .map((n: string) => n[0])
//     .join('')
//     .toUpperCase()
//     .slice(0, 2) || '??';

//   const getRoleLabel = (role: string) => {
//     const labels: Record<string, string> = {
//       'coordinateur': 'Coordinateur',
//       'stagiaire': 'Stagiaire',
//       'encadreur': 'Encadreur',
//       'admin': 'Admin'
//     };
//     return labels[role] || role;
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isOpen, onClose]);

//   if (!isOpen || !user) return null;

//   const handleLogout = () => {
//     logout();
//     onClose();
//     onLogout?.();
//   };

//   return (
//     <div 
//       ref={dropdownRef}
//       className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
//     >
//       <div className="px-4 py-3 border-b border-gray-100">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold border border-indigo-200">
//             {initials}
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-semibold text-gray-900 truncate">
//               {user.username}
//             </p>
//             <p className="text-xs text-gray-500 truncate">
//               {user.email}
//             </p>
//           </div>
//         </div>
//         <div className="mt-2 flex items-center gap-1.5">
//           <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-200">
//             <Shield size={10} />
//             {getRoleLabel(user.role)}
//           </span>
//         </div>
//       </div>

//       <div className="py-1">
//         <button
//           onClick={() => {
//             onProfileClick();
//             onClose();
//           }}
//           className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
//         >
//           <User size={16} className="text-gray-400" />
//           <span className="flex-1 text-left">Mon profil</span>
//           <ChevronRight size={14} className="text-gray-400" />
//         </button>
        
//         <button
//           onClick={onClose}
//           className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
//         >
//           <Settings size={16} className="text-gray-400" />
//           <span className="flex-1 text-left">Paramètres</span>
//           <ChevronRight size={14} className="text-gray-400" />
//         </button>
        
//         <button
//           onClick={onClose}
//           className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
//         >
//           <HelpCircle size={16} className="text-gray-400" />
//           <span className="flex-1 text-left">Aide & Support</span>
//           <ChevronRight size={14} className="text-gray-400" />
//         </button>
//       </div>

//       <div className="border-t border-gray-100 pt-1 mt-1">
//         <button
//           onClick={handleLogout}
//           className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
//         >
//           <LogOut size={16} />
//           <span className="flex-1 text-left">Déconnexion</span>
//         </button>
//       </div>
//     </div>
//   );
// }


"use client";

import { useRef, useEffect } from 'react';
import { User, Settings, HelpCircle, LogOut, ChevronRight, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileClick: () => void;
  onLogout?: () => void;
}

export function ProfileDropdown({ isOpen, onClose, onProfileClick, onLogout }: ProfileDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  const initials = user?.username
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      'coordinateur': 'Coordinateur',
      'stagiaire': 'Stagiaire',
      'encadreur': 'Encadreur',
      'admin': 'Admin'
    };
    return labels[role] || role;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const handleLogout = () => {
    logout();
    onClose();
    onLogout?.();
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
    >
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold border border-indigo-200 overflow-hidden">
            {user.photo_profil ? (
              <img src={user.photo_profil} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user.username}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user.email}
            </p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-200">
            <Shield size={10} />
            {getRoleLabel(user.role)}
          </span>
        </div>
      </div>

      <div className="py-1">
        <button
          onClick={() => {
            onProfileClick();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
        >
          <User size={16} className="text-gray-400" />
          <span className="flex-1 text-left">Mon profil</span>
          <ChevronRight size={14} className="text-gray-400" />
        </button>
        
       
      </div>

      <div className="border-t border-gray-100 pt-1 mt-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut size={16} />
          <span className="flex-1 text-left">Déconnexion</span>
        </button>
      </div>
    </div>
  );
}