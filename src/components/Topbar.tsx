// "use client";
// import { useState } from 'react';
// import { Menu, Sparkles, Share2 } from 'lucide-react';
// import { ProfileDropdown } from './ProfileDropdown';
// import { ProfileModal } from './ProfileModal';
// import { useAuth } from '@/context/AuthContext';

// interface TopbarProps {
//   toggleSidebar: () => void;
//   pageTitle: string;
// }

// export function Topbar({ toggleSidebar, pageTitle }: TopbarProps) {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const { user } = useAuth();

//   const initials = user?.username
//     .split(' ')
//     .map((n: string) => n[0])
//     .join('')
//     .toUpperCase()
//     .slice(0, 2) || '??';

//   return (
//     <>
//       <header className="flex items-center justify-between mb-6 bg-white py-2 px-1">
//         <div className="flex items-center gap-4">
//           <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
//             <Menu className="w-5 h-5" />
//           </button>
//           <div className="flex items-center gap-2 text-sm text-gray-500">
//             <span className="text-gray-400">/</span>
//             <span className="text-gray-900 font-semibold text-base">{pageTitle}</span>
//           </div>
//         </div>
        
//         <div className="flex items-center gap-3">
//           <div className="flex -space-x-2">
//             <div className="w-7 h-7 rounded-full bg-indigo-500 border-2 border-white"></div>
//             <div className="w-7 h-7 rounded-full bg-pink-500 border-2 border-white"></div>
//             <div className="w-7 h-7 rounded-full bg-purple-500 border-2 border-white"></div>
//           </div>
//           <div className="h-5 w-[1px] bg-gray-300"></div>
//           <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-sm transition-colors shadow-sm">
//             <Sparkles className="w-4 h-4 text-indigo-500" /> IA
//           </button>
//           <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-sm transition-colors shadow-sm">
//             <Share2 className="w-4 h-4" /> Partager
//           </button>
          
//           <div className="relative">
//             <button
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold border border-indigo-200 hover:ring-2 hover:ring-indigo-500/20 transition-all"
//             >
//               {initials}
//             </button>

//             <ProfileDropdown 
//               isOpen={isDropdownOpen}
//               onClose={() => setIsDropdownOpen(false)}
//               onProfileClick={() => setIsProfileOpen(true)}
//             />
//           </div>
//         </div>
//       </header>

//       <ProfileModal 
//         isOpen={isProfileOpen}
//         onClose={() => setIsProfileOpen(false)}
//       />
//     </>
//   );
// }


"use client";
import { useState } from 'react';
import { Menu, Sparkles, Share2 } from 'lucide-react';
import { ProfileDropdown } from './ProfileDropdown';
import { ProfileModal } from './ProfileModal';
import { useAuth } from '@/context/AuthContext';

interface TopbarProps {
  toggleSidebar: () => void;
  pageTitle: string;
}

export function Topbar({ toggleSidebar, pageTitle }: TopbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useAuth();

  const initials = user?.username
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  return (
    <>
      <header className="flex items-center justify-between mb-6 pr-7 bg-white py-2 px-1">
        <div className="flex items-center gap-4">
          <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold text-base">{pageTitle}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
         
          
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 mr-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold border border-indigo-200 hover:ring-2 hover:ring-indigo-500/20 transition-all overflow-hidden"
            >
              {user?.photo_profil ? (
                <img src={user.photo_profil} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </button>

            <ProfileDropdown 
              isOpen={isDropdownOpen}
              onClose={() => setIsDropdownOpen(false)}
              onProfileClick={() => setIsProfileOpen(true)}
            />
          </div>
        </div>
      </header>

      <ProfileModal 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}