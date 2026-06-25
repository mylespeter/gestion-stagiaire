
// // components/Sidebar.tsx
// "use client";
// import { useState, useEffect } from 'react';
// import { 
//   Search, GraduationCap, Inbox, UserPlus, Building2, LayoutDashboard, 
//   Folder, Users, Settings, ChevronLeft, ChevronRight, 
//   Users2, CalendarCheck, FileText, Star, Award, Upload, ClipboardList
// } from 'lucide-react';
// import { useAuth, useRole, type UserRole } from '@/context/AuthContext';
// import { supabase } from '@/lib/supabase';

// interface NavItem {
//   icon: React.ReactNode;
//   label: string;
//   id: string;
//   roles?: UserRole[];
//   badge?: React.ReactNode;
// }

// interface SidebarProps {
//   isOpen: boolean;
//   toggleSidebar: () => void;
//   activePage: string;
//   onNavigate: (pageId: string) => void;
// }

// export function Sidebar({ isOpen, toggleSidebar, activePage, onNavigate }: SidebarProps) {
//   const { user } = useAuth();
//   const { role } = useRole();
  
//   const [stagiaireStats, setStagiaireStats] = useState<{
//     total: number;
//     enCours: number;
//     enAttente: number;
//   }>({ total: 0, enCours: 0, enAttente: 0 });

//   useEffect(() => {
//     fetchStagiaireStats();
//   }, [role, user?.id]);

//   const fetchStagiaireStats = async () => {
//     try {
//       if (role === 'encadreur' && user?.id) {
//         // Pour l'encadreur : stats de SES stagiaires uniquement
//         const { data: affectations } = await supabase
//           .from('affectations')
//           .select('stagiaire_id')
//           .eq('encadreur_id', user.id)
//           .eq('statut', 'active');

//         if (affectations && affectations.length > 0) {
//           const stagiaireIds = affectations.map(a => a.stagiaire_id);
//           const { data: stagiaires } = await supabase
//             .from('stagiaires')
//             .select('id, stages(statut)')
//             .in('id', stagiaireIds);

//           if (stagiaires) {
//             const total = stagiaires.length;
//             const enCours = stagiaires.filter(s => s.stages?.[0]?.statut === 'en_cours').length;
//             const enAttente = stagiaires.filter(s => s.stages?.[0]?.statut === 'en_attente').length;
//             setStagiaireStats({ total, enCours, enAttente });
//           }
//         } else {
//           setStagiaireStats({ total: 0, enCours: 0, enAttente: 0 });
//         }
//       } else if (role === 'coordinateur' || role === 'admin') {
//         // Pour admin/coordinateur : stats de TOUS les stagiaires
//         const { data: stagiaires } = await supabase
//           .from('stagiaires')
//           .select('id, stages(statut)');

//         if (stagiaires) {
//           const total = stagiaires.length;
//           const enCours = stagiaires.filter(s => s.stages?.[0]?.statut === 'en_cours').length;
//           const enAttente = stagiaires.filter(s => s.stages?.[0]?.statut === 'en_attente').length;
//           setStagiaireStats({ total, enCours, enAttente });
//         }
//       }
//     } catch (error) {
//       console.error('Erreur stats stagiaires:', error);
//     }
//   };

//   // Section 1 : Gestion principale
//   const mainNavItems: NavItem[] = [
//     { 
//       icon: <LayoutDashboard size={18} />, 
//       label: 'Tableau de bord', 
//       id: 'dashboard',
//       roles: ['coordinateur', 'stagiaire', 'encadreur', 'admin']
//     },
//     // ✅ Pour le stagiaire : Rapport + Questionnaires
//     { 
//       icon: <Upload size={18} />, 
//       label: 'Rapport de stage', 
//       id: 'rapport',
//       roles: ['stagiaire']
//     },
//     { 
//       icon: <ClipboardList size={18} />, 
//       label: 'Questionnaires', 
//       id: 'questionnaires',
//       roles: ['stagiaire']
//     },
//     // ✅ Pour l'encadreur : Voir ses stagiaires
//     { 
//       icon: <Users2 size={18} />,
//       label: 'Mes Stagiaires', 
//       id: 'stagiaire',
//       roles: ['encadreur'],
//       badge: stagiaireStats.total > 0 ? (
//         <span className="ml-auto flex items-center gap-1">
//           <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
//             {stagiaireStats.total}
//           </span>
//           {stagiaireStats.enCours > 0 && (
//             <span className="w-2 h-2 rounded-full bg-emerald-500" title={`${stagiaireStats.enCours} en cours`}></span>
//           )}
//         </span>
//       ) : undefined,
//     },
//     // ✅ Pour l'encadreur : Rapports de ses stagiaires
//     { 
//       icon: <FileText size={18} />, 
//       label: 'Rapports stagiaires', 
//       id: 'rapports',
//       roles: ['encadreur']
//     },
//     // ✅ Pour l'encadreur : Évaluations
//     { 
//       icon: <Star size={18} />, 
//       label: 'Évaluations', 
//       id: 'evaluations',
//       roles: ['encadreur']
//     },
//   ];

//   // Section 2 : Administration & Organisation
//   const adminNavItems: NavItem[] = [
//     { 
//       icon: <UserPlus size={18} />,
//       label: 'Affectations', 
//       id: 'affectations',
//       roles: ['coordinateur', 'admin']
//     },
//     { 
//       icon: <Users2 size={18} />,
//       label: 'Stagiaires', 
//       id: 'stagiaire',
//       roles: ['coordinateur', 'admin'],
//       badge: stagiaireStats.total > 0 ? (
//         <span className="ml-auto flex items-center gap-1">
//           <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
//             {stagiaireStats.total}
//           </span>
//           {stagiaireStats.enCours > 0 && (
//             <span className="w-2 h-2 rounded-full bg-emerald-500" title={`${stagiaireStats.enCours} en cours`}></span>
//           )}
//           {stagiaireStats.enAttente > 0 && (
//             <span className="w-2 h-2 rounded-full bg-amber-500" title={`${stagiaireStats.enAttente} en attente`}></span>
//           )}
//         </span>
//       ) : undefined,
//     },
//     { 
//       icon: <CalendarCheck size={18} />,
//       label: 'Calendrier Fin', 
//       id: 'calendarfin',
//       roles: ['coordinateur', 'admin']
//     },
//     // ✅ Rapports pour admin/coordinateur
//     { 
//       icon: <FileText size={18} />,
//       label: 'Rapports stagiaires', 
//       id: 'rapports',
//       roles: ['coordinateur', 'admin']
//     },
//     // ✅ Évaluations pour admin/coordinateur
//     { 
//       icon: <Star size={18} />,
//       label: 'Évaluations', 
//       id: 'evaluations',
//       roles: ['coordinateur', 'admin']
//     },
//     // ✅ Attestations pour admin/coordinateur
//     { 
//       icon: <Award size={18} />,
//       label: 'Attestations', 
//       id: 'attestations',
//       roles: ['coordinateur', 'admin']
//     },
//     { 
//       icon: <Building2 size={18} />,
//       label: 'Organisation', 
//       id: 'organisation',
//       roles: ['coordinateur', 'admin']
//     },
//     { 
//       icon: <GraduationCap size={18} />,
//       label: 'Encadrement', 
//       id: 'encadrement',
//       roles: ['coordinateur', 'admin']
//     },
//     { 
//       icon: <Users size={18} />, 
//       label: 'Utilisateurs', 
//       id: 'users',
//       roles: ['admin', 'coordinateur']
//     },
  
//   ];

//   // Filtrer les liens selon le rôle
//   const filteredMainItems = mainNavItems.filter(item => {
//     if (!item.roles) return true;
//     return role && item.roles.includes(role);
//   });

//   const filteredAdminItems = adminNavItems.filter(item => {
//     if (!item.roles) return true;
//     return role && item.roles.includes(role);
//   });

//   const renderNavGroup = (items: NavItem[]) => {
//     if (items.length === 0) return null;
    
//     return (
//       <div className="space-y-1">
//         {items.map((item) => {
//           const isActive = activePage === item.id;
//           return (
//             <div 
//               key={item.id} 
//               onClick={() => onNavigate(item.id)}
//               className={`flex items-center gap-3 rounded-lg cursor-pointer transition-colors ${
//                 isActive 
//                   ? 'bg-indigo-50 text-indigo-700 font-medium' 
//                   : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
//               } ${isOpen ? 'px-3 py-2' : 'justify-center px-2 py-3'}`}
//               title={!isOpen ? item.label : undefined}
//             >
//               <div className="w-5 h-5 flex-shrink-0">{item.icon}</div>
//               {isOpen && (
//                 <>
//                   <span className="text-sm whitespace-nowrap">{item.label}</span>
//                   {item.badge}
//                 </>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     );
//   };

//   return (
//     <aside className={`h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative z-20 ${isOpen ? 'w-64' : 'w-20'}`}>
//       <button onClick={toggleSidebar} className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 text-gray-500 hover:text-indigo-600 shadow-sm z-30">
//         {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
//       </button>
      
//       <div className={`p-5 border-b border-gray-200 flex items-center gap-3 ${isOpen ? 'justify-start' : 'justify-center'}`}>
//         <div className="w-8 h-8 min-w-[32px] flex items-center justify-center font-bold text-sm shadow-sm">
//           <img src='/logo.png' alt="Logo" />
//         </div>
//         {isOpen && (
//           <div>
//             <span className="font-bold tracking-tight text-lg text-gray-900 whitespace-nowrap block">
//               StageFlow
//             </span>
//             {role && (
//               <span className="text-xs text-gray-500 capitalize">
//                 {role}
//               </span>
//             )}
//           </div>
//         )}
//       </div>
      
//       <div className="p-4 flex flex-col flex-1 overflow-hidden gap-6">
//         {/* {isOpen && (
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input 
//               type="text" 
//               placeholder="Rechercher..." 
//               className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
//             />
//           </div>
//         )} */}
        
//         <nav className="flex-1 overflow-y-auto space-y-6">
//           {/* Section 1 : Navigation principale */}
//           <div>
//             {isOpen && filteredMainItems.length > 0 && (
//               <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                 Principal
//               </h3>
//             )}
//             {renderNavGroup(filteredMainItems)}
//           </div>

//           {/* Section 2 : Administration & Organisation */}
//           {filteredAdminItems.length > 0 && (
//             <div>
//               {isOpen && (
//                 <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                   Administration
//                 </h3>
//               )}
//               {renderNavGroup(filteredAdminItems)}
//             </div>
//           )}
//         </nav>
        
//         {/* Carte contextuelle selon le rôle */}
//         {isOpen && (
//           <div className="p-4 border-t border-gray-200 bg-gray-50/50">
//             <div className="bg-white rounded-xl p-4 border border-gray-200 flex flex-col items-center text-center gap-3 shadow-sm">
//               {role === 'coordinateur' && (
//                 <>
//                   <h3 className="font-bold text-gray-800 text-sm">Gérez vos stagiaires</h3>
//                   <button 
//                     onClick={() => onNavigate('affectations')}
//                     className="w-full bg-indigo-600 text-white text-xs font-medium py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
//                   >
//                     Nouvelle affectation
//                   </button>
//                 </>
//               )}
//               {role === 'stagiaire' && (
//                 <>
//                   <h3 className="font-bold text-gray-800 text-sm">Mon espace stagiaire</h3>
//                   <button 
//                     onClick={() => onNavigate('questionnaires')}
//                     className="w-full bg-indigo-600 text-white text-xs font-medium py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
//                   >
//                     Voir mes questionnaires
//                   </button>
//                 </>
//               )}
//               {role === 'encadreur' && (
//                 <>
//                   <h3 className="font-bold text-gray-800 text-sm">Suivi des stagiaires</h3>
//                   <button 
//                     onClick={() => onNavigate('stagiaire')}
//                     className="w-full bg-indigo-600 text-white text-xs font-medium py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
//                   >
//                     Voir mes stagiaires
//                   </button>
//                 </>
//               )}
//               {role === 'admin' && (
//                 <>
//                   <h3 className="font-bold text-gray-800 text-sm">Administration</h3>
//                   <button 
//                     onClick={() => onNavigate('users')}
//                     className="w-full bg-indigo-600 text-white text-xs font-medium py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
//                   >
//                     Gérer les utilisateurs
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </aside>
//   );
// }

// components/Sidebar.tsx
"use client";
import { useState, useEffect } from 'react';
import { 
  Search, GraduationCap, Inbox, UserPlus, Building2, LayoutDashboard, 
  Folder, Users, Settings, ChevronLeft, ChevronRight, 
  Users2, CalendarCheck, FileText, Star, Award, Upload, ClipboardList,
  ClipboardCheck, TrendingUp // Ajout des icônes pour notes-finales
} from 'lucide-react';
import { useAuth, useRole, type UserRole } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  id: string;
  roles?: UserRole[];
  badge?: React.ReactNode;
}

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  activePage: string;
  onNavigate: (pageId: string) => void;
}

export function Sidebar({ isOpen, toggleSidebar, activePage, onNavigate }: SidebarProps) {
  const { user } = useAuth();
  const { role } = useRole();
  
  const [stagiaireStats, setStagiaireStats] = useState<{
    total: number;
    enCours: number;
    enAttente: number;
  }>({ total: 0, enCours: 0, enAttente: 0 });

  const [notesStats, setNotesStats] = useState<{
    total: number;
    notesAttribuees: number;
    notesManquantes: number;
  }>({ total: 0, notesAttribuees: 0, notesManquantes: 0 });

  useEffect(() => {
    fetchStagiaireStats();
    fetchNotesStats();
  }, [role, user?.id]);

  const fetchStagiaireStats = async () => {
    try {
      if (role === 'encadreur' && user?.id) {
        const { data: affectations } = await supabase
          .from('affectations')
          .select('stagiaire_id')
          .eq('encadreur_id', user.id)
          .eq('statut', 'active');

        if (affectations && affectations.length > 0) {
          const stagiaireIds = affectations.map(a => a.stagiaire_id);
          const { data: stagiaires } = await supabase
            .from('stagiaires')
            .select('id, stages(statut)')
            .in('id', stagiaireIds);

          if (stagiaires) {
            const total = stagiaires.length;
            const enCours = stagiaires.filter(s => s.stages?.[0]?.statut === 'en_cours').length;
            const enAttente = stagiaires.filter(s => s.stages?.[0]?.statut === 'en_attente').length;
            setStagiaireStats({ total, enCours, enAttente });
          }
        } else {
          setStagiaireStats({ total: 0, enCours: 0, enAttente: 0 });
        }
      } else if (role === 'coordinateur' || role === 'admin') {
        const { data: stagiaires } = await supabase
          .from('stagiaires')
          .select('id, stages(statut)');

        if (stagiaires) {
          const total = stagiaires.length;
          const enCours = stagiaires.filter(s => s.stages?.[0]?.statut === 'en_cours').length;
          const enAttente = stagiaires.filter(s => s.stages?.[0]?.statut === 'en_attente').length;
          setStagiaireStats({ total, enCours, enAttente });
        }
      }
    } catch (error) {
      console.error('Erreur stats stagiaires:', error);
    }
  };

  const fetchNotesStats = async () => {
    try {
      let query = supabase
        .from('notes_finales')
        .select('id, stagiaire_id', { count: 'exact' });

      if (role === 'encadreur' && user?.id) {
        // Pour l'encadreur : compter ses stagiaires avec rapports déposés
        const { data: affectations } = await supabase
          .from('affectations')
          .select('stagiaire_id')
          .eq('encadreur_id', user.id)
          .eq('statut', 'active');

        if (affectations && affectations.length > 0) {
          const stagiaireIds = affectations.map(a => a.stagiaire_id);
          
          // Compter les stagiaires avec rapport déposé
          const { data: stagiairesAvecRapport, count: total } = await supabase
            .from('stagiaires')
            .select('id, stages!inner(rapport_depose)', { count: 'exact' })
            .in('id', stagiaireIds)
            .eq('stages.rapport_depose', true);

          // Compter les notes attribuées
          const { count: notesAttribuees } = await supabase
            .from('notes_finales')
            .select('id', { count: 'exact' })
            .in('stagiaire_id', stagiaireIds);

          setNotesStats({
            total: total || 0,
            notesAttribuees: notesAttribuees || 0,
            notesManquantes: (total || 0) - (notesAttribuees || 0)
          });
        }
      } else if (role === 'coordinateur' || role === 'admin') {
        // Compter les stagiaires avec rapport déposé
        const { count: total } = await supabase
          .from('stagiaires')
          .select('id', { count: 'exact' })
          .eq('stages.rapport_depose', true);

        // Compter les notes attribuées
        const { count: notesAttribuees } = await supabase
          .from('notes_finales')
          .select('id', { count: 'exact' });

        setNotesStats({
          total: total || 0,
          notesAttribuees: notesAttribuees || 0,
          notesManquantes: (total || 0) - (notesAttribuees || 0)
        });
      }
    } catch (error) {
      console.error('Erreur stats notes:', error);
    }
  };

  // Section 1 : Gestion principale
  const mainNavItems: NavItem[] = [
    { 
      icon: <LayoutDashboard size={18} />, 
      label: 'Tableau de bord', 
      id: 'dashboard',
      roles: ['coordinateur', 'stagiaire', 'encadreur', 'admin']
    },
    // ✅ Pour le stagiaire : Rapport + Questionnaires
    { 
      icon: <Upload size={18} />, 
      label: 'Rapport de stage', 
      id: 'rapport',
      roles: ['stagiaire']
    },
    { 
      icon: <ClipboardList size={18} />, 
      label: 'Questionnaires', 
      id: 'questionnaires',
      roles: ['stagiaire']
    },
    // ✅ Pour l'encadreur : Voir ses stagiaires
    { 
      icon: <Users2 size={18} />,
      label: 'Mes Stagiaires', 
      id: 'stagiaire',
      roles: ['encadreur'],
      badge: stagiaireStats.total > 0 ? (
        <span className="ml-auto flex items-center gap-1">
          <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
            {stagiaireStats.total}
          </span>
          {stagiaireStats.enCours > 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" title={`${stagiaireStats.enCours} en cours`}></span>
          )}
        </span>
      ) : undefined,
    },
    // ✅ Pour l'encadreur : Rapports de ses stagiaires
    { 
      icon: <FileText size={18} />, 
      label: 'Rapports stagiaires', 
      id: 'rapports',
      roles: ['encadreur']
    },
    // ✅ Pour l'encadreur : Notes finales (remplace Évaluations)
    { 
      icon: <ClipboardCheck size={18} />, 
      label: 'Notes finales', 
      id: 'notes-finales',
      roles: ['encadreur'],
      badge: notesStats.notesManquantes > 0 ? (
        <span className="ml-auto flex items-center gap-1">
          <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full">
            {notesStats.notesManquantes} à noter
          </span>
        </span>
      ) : notesStats.total > 0 ? (
        <span className="ml-auto flex items-center gap-1">
          <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full">
            {notesStats.notesAttribuees}/{notesStats.total}
          </span>
        </span>
      ) : undefined,
    },
    // ✅ Pour l'encadreur : Évaluations (garde pour compatibilité)
    { 
      icon: <Star size={18} />, 
      label: 'Évaluations', 
      id: 'evaluations',
      roles: ['encadreur']
    },
  ];

  // Section 2 : Administration & Organisation
  const adminNavItems: NavItem[] = [
    { 
      icon: <UserPlus size={18} />,
      label: 'Affectations', 
      id: 'affectations',
      roles: ['coordinateur', 'admin']
    },
    { 
      icon: <Users2 size={18} />,
      label: 'Stagiaires', 
      id: 'stagiaire',
      roles: ['coordinateur', 'admin'],
      badge: stagiaireStats.total > 0 ? (
        <span className="ml-auto flex items-center gap-1">
          <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
            {stagiaireStats.total}
          </span>
          {stagiaireStats.enCours > 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" title={`${stagiaireStats.enCours} en cours`}></span>
          )}
          {stagiaireStats.enAttente > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500" title={`${stagiaireStats.enAttente} en attente`}></span>
          )}
        </span>
      ) : undefined,
    },
    { 
      icon: <CalendarCheck size={18} />,
      label: 'Calendrier Fin', 
      id: 'calendarfin',
      roles: ['coordinateur', 'admin']
    },
    // ✅ Rapports pour admin/coordinateur
    { 
      icon: <FileText size={18} />,
      label: 'Rapports stagiaires', 
      id: 'rapports',
      roles: ['coordinateur', 'admin']
    },
    // ✅ Notes finales pour admin/coordinateur
    { 
      icon: <ClipboardCheck size={18} />,
      label: 'Notes finales', 
      id: 'notes-finales',
      roles: ['coordinateur', 'admin'],
      badge: notesStats.total > 0 ? (
        <span className="ml-auto flex items-center gap-1">
          <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full">
            {notesStats.notesAttribuees}/{notesStats.total}
          </span>
          {notesStats.notesManquantes > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500" title={`${notesStats.notesManquantes} à noter`}></span>
          )}
        </span>
      ) : undefined,
    },
    // ✅ Évaluations pour admin/coordinateur (garde pour compatibilité)
    { 
      icon: <Star size={18} />,
      label: 'Évaluations', 
      id: 'evaluations',
      roles: ['coordinateur', 'admin']
    },
    // ✅ Attestations pour admin/coordinateur
    { 
      icon: <Award size={18} />,
      label: 'Attestations', 
      id: 'attestations',
      roles: ['coordinateur', 'admin']
    },
    { 
      icon: <Building2 size={18} />,
      label: 'Organisation', 
      id: 'organisation',
      roles: ['coordinateur', 'admin']
    },
    { 
      icon: <GraduationCap size={18} />,
      label: 'Encadrement', 
      id: 'encadrement',
      roles: ['coordinateur', 'admin']
    },
    { 
      icon: <Users size={18} />, 
      label: 'Utilisateurs', 
      id: 'users',
      roles: ['admin', 'coordinateur']
    },
  ];

  // Filtrer les liens selon le rôle
  const filteredMainItems = mainNavItems.filter(item => {
    if (!item.roles) return true;
    return role && item.roles.includes(role);
  });

  const filteredAdminItems = adminNavItems.filter(item => {
    if (!item.roles) return true;
    return role && item.roles.includes(role);
  });

  const renderNavGroup = (items: NavItem[]) => {
    if (items.length === 0) return null;
    
    return (
      <div className="space-y-1">
        {items.map((item) => {
          const isActive = activePage === item.id;
          return (
            <div 
              key={item.id} 
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-3 rounded-lg cursor-pointer transition-colors ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-700 font-medium' 
                  : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
              } ${isOpen ? 'px-3 py-2' : 'justify-center px-2 py-3'}`}
              title={!isOpen ? item.label : undefined}
            >
              <div className="w-5 h-5 flex-shrink-0">{item.icon}</div>
              {isOpen && (
                <>
                  <span className="text-sm whitespace-nowrap">{item.label}</span>
                  {item.badge}
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <aside className={`h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative z-20 ${isOpen ? 'w-64' : 'w-20'}`}>
      <button onClick={toggleSidebar} className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 text-gray-500 hover:text-indigo-600 shadow-sm z-30">
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
      
      <div className={`p-5 border-b border-gray-200 flex items-center gap-3 ${isOpen ? 'justify-start' : 'justify-center'}`}>
        <div className="w-8 h-8 min-w-[32px] flex items-center justify-center font-bold text-sm shadow-sm">
          <img src='/logo.png' alt="Logo" />
        </div>
        {isOpen && (
          <div>
            <span className="font-bold tracking-tight text-lg text-gray-900 whitespace-nowrap block">
              StageFlow
            </span>
            {role && (
              <span className="text-xs text-gray-500 capitalize">
                {role}
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-1 overflow-hidden gap-6">
        <nav className="flex-1 overflow-y-auto space-y-6">
          {/* Section 1 : Navigation principale */}
          <div>
            {isOpen && filteredMainItems.length > 0 && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Principal
              </h3>
            )}
            {renderNavGroup(filteredMainItems)}
          </div>

          {/* Section 2 : Administration & Organisation */}
          {filteredAdminItems.length > 0 && (
            <div>
              {isOpen && (
                <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Administration
                </h3>
              )}
              {renderNavGroup(filteredAdminItems)}
            </div>
          )}
        </nav>
        
        {/* Carte contextuelle selon le rôle */}
        {isOpen && (
          <div className="p-4 border-t border-gray-200 bg-gray-50/50">
            <div className="bg-white rounded-xl p-4 border border-gray-200 flex flex-col items-center text-center gap-3 shadow-sm">
              {role === 'coordinateur' && (
                <>
                  <h3 className="font-bold text-gray-800 text-sm">Gérez vos stagiaires</h3>
                  <button 
                    onClick={() => onNavigate('affectations')}
                    className="w-full bg-indigo-600 text-white text-xs font-medium py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    Nouvelle affectation
                  </button>
                </>
              )}
              {role === 'stagiaire' && (
                <>
                  <h3 className="font-bold text-gray-800 text-sm">Mon espace stagiaire</h3>
                  <button 
                    onClick={() => onNavigate('questionnaires')}
                    className="w-full bg-indigo-600 text-white text-xs font-medium py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    Voir mes questionnaires
                  </button>
                </>
              )}
              {role === 'encadreur' && (
                <>
                  <h3 className="font-bold text-gray-800 text-sm">Notation des stagiaires</h3>
                  <button 
                    onClick={() => onNavigate('notes-finales')}
                    className="w-full bg-indigo-600 text-white text-xs font-medium py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    {notesStats.notesManquantes > 0 
                      ? `${notesStats.notesManquantes} stagiaires à noter` 
                      : 'Voir les notes finales'}
                  </button>
                </>
              )}
              {role === 'admin' && (
                <>
                  <h3 className="font-bold text-gray-800 text-sm">Administration</h3>
                  <button 
                    onClick={() => onNavigate('users')}
                    className="w-full bg-indigo-600 text-white text-xs font-medium py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    Gérer les utilisateurs
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}