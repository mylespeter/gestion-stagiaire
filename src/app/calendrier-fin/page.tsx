// // // app/calendrier-fin-stage/page.tsx
// // "use client";

// // import { useState, useEffect, useMemo } from 'react';
// // import { ChevronLeft, ChevronRight, Users, GraduationCap, Briefcase } from 'lucide-react';
// // import { DataTable, Column } from '@/components/DataTable';
// // import { DetailsModal, DetailSection } from '@/components/DetailsModal';
// // import { supabase } from '@/lib/supabase';

// // interface StagiaireFinStage {
// //   id: number;
// //   matricule: string;
// //   nom_complet: string;
// //   email: string;
// //   telephone: string;
// //   universite: string;
// //   niveau_etudes: string;
// //   date_fin: string;
// //   service_accueil: string;
// //   statut: string;
// // }

// // interface StagiaireDetail extends StagiaireFinStage {
// //   genre: string;
// //   date_naissance: string;
// //   lieu_naissance: string;
// //   nationalite: string;
// //   adresse: string;
// //   ville: string;
// //   nom_urgence: string;
// //   telephone_urgence: string;
// //   lien_urgence: string;
// //   faculte: string;
// //   departement: string;
// //   domaine_etudes: string;
// //   annee_academique: string;
// //   moyenne_generale: number;
// //   type_stage: string;
// //   date_debut: string;
// //   theme_stage: string;
// // }

// // const MONTHS = [
// //   'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
// //   'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
// // ];

// // const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

// // export default function CalendrierFinStagePage() {
// //   const [currentDate, setCurrentDate] = useState(new Date());
// //   const [selectedDay, setSelectedDay] = useState<number | null>(null);
// //   const [stagiaires, setStagiaires] = useState<StagiaireFinStage[]>([]);
// //   const [selectedStagiaire, setSelectedStagiaire] = useState<StagiaireDetail | null>(null);
// //   const [isDetailsOpen, setIsDetailsOpen] = useState(false);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     fetchStagiairesFinStage();
// //   }, []);

// //   const fetchStagiairesFinStage = async () => {
// //     setLoading(true);
// //     try {
// //       const { data } = await supabase
// //         .from('stages')
// //         .select(`
// //           date_fin, statut, service_accueil, type_stage,
// //           stagiaire:stagiaire_id (
// //             id, matricule,
// //             users!inner(username, email, telephone),
// //             informations_academiques(universite, niveau_etudes)
// //           )
// //         `)
// //         .not('date_fin', 'is', null)
// //         .order('date_fin', { ascending: true });

// //       if (data) {
// //         const formatted: StagiaireFinStage[] = data
// //           .filter((s: any) => s.stagiaire)
// //           .map((s: any) => ({
// //             id: s.stagiaire.id,
// //             matricule: s.stagiaire.matricule,
// //             nom_complet: s.stagiaire.users?.username || '',
// //             email: s.stagiaire.users?.email || '',
// //             telephone: s.stagiaire.users?.telephone || '',
// //             universite: s.stagiaire.informations_academiques?.[0]?.universite || '',
// //             niveau_etudes: s.stagiaire.informations_academiques?.[0]?.niveau_etudes || '',
// //             date_fin: s.date_fin,
// //             service_accueil: s.service_accueil || '',
// //             statut: s.statut
// //           }));
// //         setStagiaires(formatted);
// //       }
// //     } catch (error) {
// //       console.error('Erreur chargement stagiaires:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Jours du mois actuel avec stagiaires finissant ce jour
// //   const calendarDays = useMemo(() => {
// //     const year = currentDate.getFullYear();
// //     const month = currentDate.getMonth();
    
// //     // Premier jour du mois et nombre de jours
// //     const firstDay = new Date(year, month, 1);
// //     const lastDay = new Date(year, month + 1, 0);
// //     const daysInMonth = lastDay.getDate();
    
// //     // Jour de la semaine du premier jour (0 = Dimanche, on convertit en 0 = Lundi)
// //     let startDayOfWeek = firstDay.getDay() - 1;
// //     if (startDayOfWeek < 0) startDayOfWeek = 6;

// //     const days = [];
    
// //     // Jours du mois précédent (grisés)
// //     const prevMonthLastDay = new Date(year, month, 0).getDate();
// //     for (let i = startDayOfWeek - 1; i >= 0; i--) {
// //       days.push({
// //         day: prevMonthLastDay - i,
// //         month: 'prev',
// //         isToday: false,
// //         stagiaireCount: 0
// //       });
// //     }

// //     // Jours du mois actuel
// //     const today = new Date();
// //     for (let day = 1; day <= daysInMonth; day++) {
// //       const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
// //       const count = stagiaires.filter(s => s.date_fin === dateStr).length;
      
// //       days.push({
// //         day,
// //         month: 'current',
// //         isToday: today.getFullYear() === year && today.getMonth() === month && today.getDate() === day,
// //         stagiaireCount: count,
// //         dateStr
// //       });
// //     }

// //     // Jours du mois suivant (grisés)
// //     const remainingCells = 42 - days.length; // 6 semaines
// //     for (let day = 1; day <= remainingCells; day++) {
// //       days.push({
// //         day,
// //         month: 'next',
// //         isToday: false,
// //         stagiaireCount: 0
// //       });
// //     }

// //     return days;
// //   }, [currentDate, stagiaires]);

// //   const navigateMonth = (direction: 'prev' | 'next') => {
// //     setCurrentDate(prev => {
// //       const newDate = new Date(prev);
// //       if (direction === 'prev') newDate.setMonth(newDate.getMonth() - 1);
// //       else newDate.setMonth(newDate.getMonth() + 1);
// //       return newDate;
// //     });
// //     setSelectedDay(null);
// //   };

// //   const handleDayClick = (day: number, month: string, dateStr?: string) => {
// //     if (month !== 'current' || !dateStr) return;
// //     setSelectedDay(day);
// //   };

// //   // Stagiaires filtrés par jour sélectionné
// //   const stagiairesOfDay = useMemo(() => {
// //     if (!selectedDay) return [];
// //     const year = currentDate.getFullYear();
// //     const month = currentDate.getMonth() + 1;
// //     const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
// //     return stagiaires.filter(s => s.date_fin === dateStr);
// //   }, [selectedDay, currentDate, stagiaires]);

// //   const loadStagiaireDetails = async (stagiaireId: number) => {
// //     const { data: detail } = await supabase
// //       .from('stagiaires')
// //       .select(`
// //         *, 
// //         users!inner(*), 
// //         informations_academiques(*), 
// //         stages(*)
// //       `)
// //       .eq('id', stagiaireId)
// //       .single();

// //     if (detail) {
// //       const d = detail as any;
// //       setSelectedStagiaire({
// //         id: d.id,
// //         matricule: d.matricule,
// //         nom_complet: d.users?.username || '',
// //         email: d.users?.email || '',
// //         telephone: d.users?.telephone || '',
// //         universite: d.informations_academiques?.[0]?.universite || '',
// //         niveau_etudes: d.informations_academiques?.[0]?.niveau_etudes || '',
// //         date_fin: d.stages?.[0]?.date_fin || '',
// //         service_accueil: d.stages?.[0]?.service_accueil || '',
// //         statut: d.stages?.[0]?.statut || '',
// //         genre: d.users?.genre || '',
// //         date_naissance: d.date_naissance || '',
// //         lieu_naissance: d.lieu_naissance || '',
// //         nationalite: d.nationalite || '',
// //         adresse: d.adresse || '',
// //         ville: d.ville || '',
// //         nom_urgence: d.nom_urgence || '',
// //         telephone_urgence: d.telephone_urgence || '',
// //         lien_urgence: d.lien_urgence || '',
// //         faculte: d.informations_academiques?.[0]?.faculte || '',
// //         departement: d.informations_academiques?.[0]?.departement || '',
// //         domaine_etudes: d.informations_academiques?.[0]?.domaine_etudes || '',
// //         annee_academique: d.informations_academiques?.[0]?.annee_academique || '',
// //         moyenne_generale: d.informations_academiques?.[0]?.moyenne_generale || 0,
// //         type_stage: d.stages?.[0]?.type_stage || '',
// //         date_debut: d.stages?.[0]?.date_debut || '',
// //         theme_stage: d.stages?.[0]?.theme || ''
// //       });
// //     }
// //   };

// //   const handleRowClick = async (item: StagiaireFinStage) => {
// //     setIsDetailsOpen(true);
// //     await loadStagiaireDetails(item.id);
// //   };

// //   const getDetailSections = (): DetailSection[] => {
// //     if (!selectedStagiaire) return [];
// //     return [
// //       {
// //         title: '👤 Informations personnelles',
// //         fields: [
// //           { label: 'Nom complet', value: selectedStagiaire.nom_complet, span: 'full' },
// //           { label: 'Email', value: selectedStagiaire.email, span: 'half' },
// //           { label: 'Téléphone', value: selectedStagiaire.telephone || 'N/A', span: 'half' },
// //           { label: 'Genre', value: selectedStagiaire.genre === 'M' ? 'Masculin' : 'Féminin', span: 'half' },
// //           { label: 'Nationalité', value: selectedStagiaire.nationalite || 'N/A', span: 'half' },
// //         ]
// //       },
// //       {
// //         title: '🎓 Formation',
// //         fields: [
// //           { label: 'Université', value: selectedStagiaire.universite, span: 'full' },
// //           { label: 'Niveau', value: selectedStagiaire.niveau_etudes, span: 'half' },
// //           { label: 'Domaine', value: selectedStagiaire.domaine_etudes || 'N/A', span: 'half' },
// //         ]
// //       },
// //       {
// //         title: '💼 Stage',
// //         fields: [
// //           { label: 'Type', value: selectedStagiaire.type_stage, span: 'half' },
// //           { label: 'Service', value: selectedStagiaire.service_accueil || 'N/A', span: 'half' },
// //           { label: 'Début', value: selectedStagiaire.date_debut ? new Date(selectedStagiaire.date_debut).toLocaleDateString('fr-FR') : 'N/A', span: 'half' },
// //           { label: 'Fin prévue', value: selectedStagiaire.date_fin ? new Date(selectedStagiaire.date_fin).toLocaleDateString('fr-FR') : 'N/A', span: 'half' },
// //           { label: 'Statut', value: selectedStagiaire.statut, span: 'half' },
// //         ]
// //       }
// //     ];
// //   };

// //   const columns: Column<StagiaireFinStage>[] = [
// //     { key: 'matricule', header: 'Matricule', sortable: true, maxChars: 15 },
// //     { key: 'nom_complet', header: 'Nom complet', sortable: true },
// //     { key: 'email', header: 'Email', maxChars: 25 },
// //     { key: 'universite', header: 'Université', maxChars: 20 },
// //     { key: 'niveau_etudes', header: 'Niveau' },
// //     { 
// //       key: 'date_fin', 
// //       header: 'Fin stage', 
// //       sortable: true,
// //       render: (item) => (
// //         <span className="text-amber-600 font-medium">
// //           {new Date(item.date_fin).toLocaleDateString('fr-FR')}
// //         </span>
// //       )
// //     },
// //     { 
// //       key: 'statut', 
// //       header: 'Statut',
// //       render: (item) => {
// //         const config: Record<string, { label: string; className: string }> = {
// //           'en_cours': { label: 'En cours', className: 'bg-green-100 text-green-800' },
// //           'en_attente': { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
// //           'termine': { label: 'Terminé', className: 'bg-blue-100 text-blue-800' },
// //           'abandonne': { label: 'Abandonné', className: 'bg-red-100 text-red-800' },
// //         };
// //         const c = config[item.statut] || { label: item.statut, className: 'bg-gray-100 text-gray-600' };
// //         return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${c.className}`}>{c.label}</span>;
// //       }
// //     }
// //   ];

// //   const renderHeader = () => (
// //     <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3 bg-white">
// //       <Users size={20} className="text-indigo-600" />
// //       <h2 className="font-bold text-gray-900 text-lg">
// //         Stagiaires finissant le {selectedDay} {MONTHS[currentDate.getMonth()].toLowerCase()} {currentDate.getFullYear()}
// //       </h2>
// //     </div>
// //   );

// //   // Calculer le total des stagiaires finissant ce mois
// //   const totalFinMois = useMemo(() => {
// //     const year = currentDate.getFullYear();
// //     const month = currentDate.getMonth() + 1;
// //     return stagiaires.filter(s => {
// //       const date = new Date(s.date_fin);
// //       return date.getFullYear() === year && date.getMonth() + 1 === month;
// //     }).length;
// //   }, [currentDate, stagiaires]);

// //   return (
// //     <div className="p-6 max-w-[1400px] mx-auto space-y-6">
// //       {/* Calendrier */}
// //       <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
// //         {/* En-tête */}
// //         <div className="p-4 border-b border-gray-200 flex items-center justify-between">
// //           <div className="flex items-center gap-4">
// //             <div className="flex items-center gap-2">
// //               <GraduationCap size={20} className="text-indigo-600" />
// //               <h2 className="font-bold text-gray-900">Fins de stage</h2>
// //             </div>
// //             <div className="flex items-center gap-2">
// //               <button 
// //                 onClick={() => navigateMonth('prev')} 
// //                 className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
// //               >
// //                 <ChevronLeft size={18} />
// //               </button>
// //               <span className="text-sm font-semibold text-gray-700 min-w-[140px] text-center">
// //                 {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
// //               </span>
// //               <button 
// //                 onClick={() => navigateMonth('next')} 
// //                 className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
// //               >
// //                 <ChevronRight size={18} />
// //               </button>
// //             </div>
// //           </div>
// //           <div className="flex items-center gap-3">
// //             <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
// //               <Briefcase size={16} className="text-amber-600" />
// //               <span className="text-sm font-medium text-amber-700">
// //                 {totalFinMois} fin{totalFinMois > 1 ? 's' : ''} ce mois
// //               </span>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Corps du calendrier */}
// //         <div className="p-5">
// //           {/* Jours de la semaine */}
// //           <div className="grid grid-cols-7 gap-2 mb-3">
// //             {DAYS.map(day => (
// //               <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
// //                 {day}
// //               </div>
// //             ))}
// //           </div>

// //           {/* Grille des jours */}
// //           <div className="grid grid-cols-7 gap-2">
// //             {calendarDays.map((date, i) => (
// //               <div
// //                 key={i}
// //                 onClick={() => handleDayClick(date.day, date.month, date.dateStr)}
// //                 className={`
// //                   relative text-center py-3 rounded-xl cursor-pointer transition-all duration-200
// //                   ${date.month === 'current' 
// //                     ? 'hover:bg-amber-50 hover:shadow-sm' 
// //                     : 'text-gray-300 cursor-default'}
// //                   ${date.isToday 
// //                     ? 'ring-2 ring-indigo-400 ring-offset-1' 
// //                     : ''}
// //                   ${selectedDay === date.day && date.month === 'current'
// //                     ? 'bg-amber-500 text-white shadow-md scale-105'
// //                     : date.month === 'current'
// //                     ? 'text-gray-700'
// //                     : ''}
// //                 `}
// //               >
// //                 <span className={`text-sm font-medium`}>
// //                   {date.day}
// //                 </span>
// //                 {date.stagiaireCount > 0 && (
// //                   <span 
// //                     className={`
// //                       absolute -bottom-0.5 left-1/2 -translate-x-1/2 
// //                       text-[10px] font-bold px-1.5 py-0.5 rounded-full
// //                       ${selectedDay === date.day 
// //                         ? 'bg-white text-amber-600' 
// //                         : 'bg-amber-100 text-amber-700'}
// //                     `}
// //                   >
// //                     {date.stagiaireCount}
// //                   </span>
// //                 )}
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Liste des stagiaires du jour sélectionné */}
// //       {selectedDay && (
// //         <DataTable
// //           data={stagiairesOfDay}
// //           columns={columns}
// //           searchable={true}
// //           searchPlaceholder="Rechercher un stagiaire..."
// //           onRowClick={handleRowClick}
// //           emptyMessage="Aucun stagiaire ne termine son stage ce jour"
// //           striped
// //           renderHeader={renderHeader}
// //           loading={loading}
// //         />
// //       )}

// //       {!selectedDay && (
// //         <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
// //           <div className="text-4xl mb-4">📅</div>
// //           <h3 className="text-lg font-semibold text-gray-700 mb-2">Sélectionnez un jour</h3>
// //           <p className="text-sm text-gray-500">
// //             Cliquez sur un jour du calendrier pour voir les stagiaires qui terminent leur stage à cette date.
// //           </p>
// //         </div>
// //       )}

// //       {/* Modal de détails */}
// //       <DetailsModal
// //         isOpen={isDetailsOpen}
// //         onClose={() => setIsDetailsOpen(false)}
// //         title={selectedStagiaire?.nom_complet || ''}
// //         subtitle={
// //           <div className="flex items-center gap-2">
// //             <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">
// //               {selectedStagiaire?.matricule}
// //             </span>
// //             <span className="text-xs text-gray-400">
// //               Fin le {selectedStagiaire?.date_fin ? new Date(selectedStagiaire.date_fin).toLocaleDateString('fr-FR') : 'N/A'}
// //             </span>
// //           </div>
// //         }
// //         avatar={selectedStagiaire?.nom_complet?.charAt(0).toUpperCase()}
// //         sections={getDetailSections()}
// //       />
// //     </div>
// //   );
// // }

// // app/calendrier-fin-stage/page.tsx
// "use client";

// import { useState, useEffect, useMemo } from 'react';
// import { ChevronLeft, ChevronRight, Users, GraduationCap, Briefcase } from 'lucide-react';
// import { DataTable, Column } from '@/components/DataTable';
// import { DetailsModal, DetailSection } from '@/components/DetailsModal';
// import { supabase } from '@/lib/supabase';

// interface StagiaireFinStage {
//   id: number;
//   matricule: string;
//   nom_complet: string;
//   email: string;
//   telephone: string;
//   universite: string;
//   niveau_etudes: string;
//   date_fin: string;
//   service_accueil: string;
//   statut: string;
// }

// interface StagiaireDetail extends StagiaireFinStage {
//   genre: string;
//   date_naissance: string;
//   lieu_naissance: string;
//   nationalite: string;
//   adresse: string;
//   ville: string;
//   nom_urgence: string;
//   telephone_urgence: string;
//   lien_urgence: string;
//   faculte: string;
//   departement: string;
//   domaine_etudes: string;
//   annee_academique: string;
//   moyenne_generale: number;
//   type_stage: string;
//   date_debut: string;
//   theme_stage: string;
// }

// const MONTHS = [
//   'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
//   'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
// ];

// const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

// export default function CalendrierFinStagePage() {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDay, setSelectedDay] = useState<number | null>(null);
//   const [stagiaires, setStagiaires] = useState<StagiaireFinStage[]>([]);
//   const [selectedStagiaire, setSelectedStagiaire] = useState<StagiaireDetail | null>(null);
//   const [isDetailsOpen, setIsDetailsOpen] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchStagiairesFinStage();
//   }, []);

//   const fetchStagiairesFinStage = async () => {
//     setLoading(true);
//     try {
//       const { data } = await supabase
//         .from('stages')
//         .select(`
//           date_fin, statut, service_accueil, type_stage,
//           stagiaire:stagiaire_id (
//             id, matricule,
//             users!inner(username, email, telephone),
//             informations_academiques(universite, niveau_etudes)
//           )
//         `)
//         .not('date_fin', 'is', null)
//         .order('date_fin', { ascending: true });

//       if (data) {
//         const formatted: StagiaireFinStage[] = data
//           .filter((s: any) => s.stagiaire)
//           .map((s: any) => ({
//             id: s.stagiaire.id,
//             matricule: s.stagiaire.matricule,
//             nom_complet: s.stagiaire.users?.username || '',
//             email: s.stagiaire.users?.email || '',
//             telephone: s.stagiaire.users?.telephone || '',
//             universite: s.stagiaire.informations_academiques?.[0]?.universite || '',
//             niveau_etudes: s.stagiaire.informations_academiques?.[0]?.niveau_etudes || '',
//             date_fin: s.date_fin,
//             service_accueil: s.service_accueil || '',
//             statut: s.statut
//           }));
//         setStagiaires(formatted);
//       }
//     } catch (error) {
//       console.error('Erreur chargement stagiaires:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calendarDays = useMemo(() => {
//     const year = currentDate.getFullYear();
//     const month = currentDate.getMonth();
    
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const daysInMonth = lastDay.getDate();
    
//     let startDayOfWeek = firstDay.getDay() - 1;
//     if (startDayOfWeek < 0) startDayOfWeek = 6;

//     const days = [];
    
//     // Jours du mois précédent
//     const prevMonthLastDay = new Date(year, month, 0).getDate();
//     for (let i = startDayOfWeek - 1; i >= 0; i--) {
//       days.push({
//         day: prevMonthLastDay - i,
//         month: 'prev',
//         isToday: false,
//         stagiaireCount: 0
//       });
//     }

//     // Jours du mois actuel
//     const today = new Date();
//     for (let day = 1; day <= daysInMonth; day++) {
//       const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
//       const count = stagiaires.filter(s => s.date_fin === dateStr).length;
      
//       days.push({
//         day,
//         month: 'current',
//         isToday: today.getFullYear() === year && today.getMonth() === month && today.getDate() === day,
//         stagiaireCount: count,
//         dateStr
//       });
//     }

//     // Jours du mois suivant
//     const remainingCells = 42 - days.length;
//     for (let day = 1; day <= remainingCells; day++) {
//       days.push({
//         day,
//         month: 'next',
//         isToday: false,
//         stagiaireCount: 0
//       });
//     }

//     return days;
//   }, [currentDate, stagiaires]);

//   const navigateMonth = (direction: 'prev' | 'next') => {
//     setCurrentDate(prev => {
//       const newDate = new Date(prev);
//       if (direction === 'prev') newDate.setMonth(newDate.getMonth() - 1);
//       else newDate.setMonth(newDate.getMonth() + 1);
//       return newDate;
//     });
//     setSelectedDay(null);
//   };

//   const handleDayClick = (day: number, month: string, dateStr?: string) => {
//     if (month !== 'current' || !dateStr) return;
//     setSelectedDay(day);
//   };

//   const stagiairesOfDay = useMemo(() => {
//     if (!selectedDay) return [];
//     const year = currentDate.getFullYear();
//     const month = currentDate.getMonth() + 1;
//     const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
//     return stagiaires.filter(s => s.date_fin === dateStr);
//   }, [selectedDay, currentDate, stagiaires]);

//   const loadStagiaireDetails = async (stagiaireId: number) => {
//     const { data: detail } = await supabase
//       .from('stagiaires')
//       .select(`
//         *, 
//         users!inner(*), 
//         informations_academiques(*), 
//         stages(*)
//       `)
//       .eq('id', stagiaireId)
//       .single();

//     if (detail) {
//       const d = detail as any;
//       setSelectedStagiaire({
//         id: d.id,
//         matricule: d.matricule,
//         nom_complet: d.users?.username || '',
//         email: d.users?.email || '',
//         telephone: d.users?.telephone || '',
//         universite: d.informations_academiques?.[0]?.universite || '',
//         niveau_etudes: d.informations_academiques?.[0]?.niveau_etudes || '',
//         date_fin: d.stages?.[0]?.date_fin || '',
//         service_accueil: d.stages?.[0]?.service_accueil || '',
//         statut: d.stages?.[0]?.statut || '',
//         genre: d.users?.genre || '',
//         date_naissance: d.date_naissance || '',
//         lieu_naissance: d.lieu_naissance || '',
//         nationalite: d.nationalite || '',
//         adresse: d.adresse || '',
//         ville: d.ville || '',
//         nom_urgence: d.nom_urgence || '',
//         telephone_urgence: d.telephone_urgence || '',
//         lien_urgence: d.lien_urgence || '',
//         faculte: d.informations_academiques?.[0]?.faculte || '',
//         departement: d.informations_academiques?.[0]?.departement || '',
//         domaine_etudes: d.informations_academiques?.[0]?.domaine_etudes || '',
//         annee_academique: d.informations_academiques?.[0]?.annee_academique || '',
//         moyenne_generale: d.informations_academiques?.[0]?.moyenne_generale || 0,
//         type_stage: d.stages?.[0]?.type_stage || '',
//         date_debut: d.stages?.[0]?.date_debut || '',
//         theme_stage: d.stages?.[0]?.theme || ''
//       });
//     }
//   };

//   const handleRowClick = async (item: StagiaireFinStage) => {
//     setIsDetailsOpen(true);
//     await loadStagiaireDetails(item.id);
//   };

//   const getDetailSections = (): DetailSection[] => {
//     if (!selectedStagiaire) return [];
//     return [
//       {
//         title: '👤 Informations personnelles',
//         fields: [
//           { label: 'Nom complet', value: selectedStagiaire.nom_complet, span: 'full' },
//           { label: 'Email', value: selectedStagiaire.email, span: 'half' },
//           { label: 'Téléphone', value: selectedStagiaire.telephone || 'N/A', span: 'half' },
//           { label: 'Genre', value: selectedStagiaire.genre === 'M' ? 'Masculin' : 'Féminin', span: 'half' },
//           { label: 'Nationalité', value: selectedStagiaire.nationalite || 'N/A', span: 'half' },
//         ]
//       },
//       {
//         title: '🎓 Formation',
//         fields: [
//           { label: 'Université', value: selectedStagiaire.universite, span: 'full' },
//           { label: 'Niveau', value: selectedStagiaire.niveau_etudes, span: 'half' },
//           { label: 'Domaine', value: selectedStagiaire.domaine_etudes || 'N/A', span: 'half' },
//         ]
//       },
//       {
//         title: '💼 Stage',
//         fields: [
//           { label: 'Type', value: selectedStagiaire.type_stage, span: 'half' },
//           { label: 'Service', value: selectedStagiaire.service_accueil || 'N/A', span: 'half' },
//           { label: 'Début', value: selectedStagiaire.date_debut ? new Date(selectedStagiaire.date_debut).toLocaleDateString('fr-FR') : 'N/A', span: 'half' },
//           { label: 'Fin prévue', value: selectedStagiaire.date_fin ? new Date(selectedStagiaire.date_fin).toLocaleDateString('fr-FR') : 'N/A', span: 'half' },
//           { label: 'Statut', value: selectedStagiaire.statut, span: 'half' },
//         ]
//       }
//     ];
//   };

//   const columns: Column<StagiaireFinStage>[] = [
//     { key: 'matricule', header: 'Matricule', sortable: true, maxChars: 15 },
//     { key: 'nom_complet', header: 'Nom complet', sortable: true },
//     { key: 'email', header: 'Email', maxChars: 25 },
//     { key: 'universite', header: 'Université', maxChars: 20 },
//     { key: 'niveau_etudes', header: 'Niveau' },
//     { 
//       key: 'date_fin', 
//       header: 'Fin stage', 
//       sortable: true,
//       render: (item) => (
//         <span className="text-amber-600 font-medium">
//           {new Date(item.date_fin).toLocaleDateString('fr-FR')}
//         </span>
//       )
//     },
//     { 
//       key: 'statut', 
//       header: 'Statut',
//       render: (item) => {
//         const config: Record<string, { label: string; className: string }> = {
//           'en_cours': { label: 'En cours', className: 'bg-green-100 text-green-800' },
//           'en_attente': { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
//           'termine': { label: 'Terminé', className: 'bg-blue-100 text-blue-800' },
//           'abandonne': { label: 'Abandonné', className: 'bg-red-100 text-red-800' },
//         };
//         const c = config[item.statut] || { label: item.statut, className: 'bg-gray-100 text-gray-600' };
//         return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${c.className}`}>{c.label}</span>;
//       }
//     }
//   ];

//   const renderHeader = () => (
//     <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3 bg-white">
//       <Users size={20} className="text-indigo-600" />
//       <h2 className="font-bold text-gray-900 text-lg">
//         Stagiaires finissant le {selectedDay} {MONTHS[currentDate.getMonth()].toLowerCase()} {currentDate.getFullYear()}
//       </h2>
//     </div>
//   );

//   const totalFinMois = useMemo(() => {
//     const year = currentDate.getFullYear();
//     const month = currentDate.getMonth() + 1;
//     return stagiaires.filter(s => {
//       const date = new Date(s.date_fin);
//       return date.getFullYear() === year && date.getMonth() + 1 === month;
//     }).length;
//   }, [currentDate, stagiaires]);

//   const today = new Date();
//   const isCurrentMonth = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();

//   return (
//     <div className="flex flex-col h-full  max-w-5xl mx-auto py-5">
//       {/* Grand Calendrier - prend toute la hauteur */}
//       <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
//         {/* En-tête minimal */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2">
//               <GraduationCap size={18} className="text-gray-400" />
//               <h2 className="text-lg font-semibold text-gray-900">
//                 {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
//               </h2>
//             </div>
//             <div className="flex items-center gap-0.5">
//               <button 
//                 onClick={() => navigateMonth('prev')} 
//                 className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
//               >
//                 <ChevronLeft size={16} className="text-gray-500" />
//               </button>
//               {isCurrentMonth && (
//                 <span className="text-xs text-gray-400 px-2">(mois en cours)</span>
//               )}
//               <button 
//                 onClick={() => navigateMonth('next')} 
//                 className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
//               >
//                 <ChevronRight size={16} className="text-gray-500" />
//               </button>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-3">
//             {totalFinMois > 0 && (
//               <div className="flex items-center gap-2 text-xs text-gray-500">
//                 <Briefcase size={14} className="text-gray-400" />
//                 <span>{totalFinMois} fin{totalFinMois > 1 ? 's' : ''} de stage ce mois</span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Jours de la semaine */}
//         <div className="grid grid-cols-7 border-b border-gray-100">
//           {DAYS.map((day, i) => (
//             <div
//               key={day}
//               className={`px-3 py-2.5 text-xs font-medium text-center ${
//                 i >= 5 ? 'text-gray-400' : 'text-gray-500'
//               }`}
//             >
//               {day}
//             </div>
//           ))}
//         </div>

//         {/* Grille du mois - prend toute la hauteur restante */}
//         <div className="flex-1 grid grid-cols-7 auto-rows-fr">
//           {calendarDays.map((date, i) => {
//             const isWeekend = i % 7 >= 5;
//             const isSelected = selectedDay === date.day && date.month === 'current';
            
//             return (
//               <div
//                 key={i}
//                 onClick={() => handleDayClick(date.day, date.month, date.dateStr)}
//                 className={`
//                   border-r border-b border-gray-50 p-2 relative
//                   ${date.month !== 'current' 
//                     ? 'bg-gray-50/30 text-gray-300' 
//                     : isSelected
//                     ? 'bg-amber-50/50 ring-1 ring-amber-200'
//                     : isWeekend
//                     ? 'bg-gray-50/20'
//                     : 'hover:bg-gray-50/50 cursor-pointer'}
//                   transition-colors
//                 `}
//               >
//                 {date.month === 'current' && (
//                   <>
//                     <div className="flex items-center justify-between mb-1">
//                       <span
//                         className={`
//                           text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full
//                           ${date.isToday 
//                             ? 'bg-indigo-600 text-white' 
//                             : isSelected
//                             ? 'text-amber-700'
//                             : isWeekend
//                             ? 'text-gray-400'
//                             : 'text-gray-700'}
//                         `}
//                       >
//                         {date.day}
//                       </span>
//                       {date.stagiaireCount > 0 && (
//                         <span className={`
//                           text-[10px] font-medium px-1.5 py-0.5 rounded-full
//                           ${isSelected 
//                             ? 'bg-amber-200 text-amber-800' 
//                             : 'bg-gray-100 text-gray-600'}
//                         `}>
//                           {date.stagiaireCount}
//                         </span>
//                       )}
//                     </div>
//                     {/* Mini-liste des stagiaires */}
//                     <div className="space-y-0.5">
//                       {stagiaires
//                         .filter(s => s.date_fin === date.dateStr)
//                         .slice(0, 2)
//                         .map((s) => (
//                           <div
//                             key={s.id}
//                             className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-100/50 text-amber-800 truncate"
//                             title={s.nom_complet}
//                           >
//                             <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
//                             {s.nom_complet}
//                           </div>
//                         ))}
//                       {stagiaires.filter(s => s.date_fin === date.dateStr).length > 2 && (
//                         <span className="text-[10px] text-gray-400 px-1.5">
//                           +{stagiaires.filter(s => s.date_fin === date.dateStr).length - 2}
//                         </span>
//                       )}
//                     </div>
//                   </>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Liste des stagiaires du jour sélectionné */}
//       {selectedDay && stagiairesOfDay.length > 0 && (
//         <div className="mt-4">
//           <DataTable
//             data={stagiairesOfDay}
//             columns={columns}
//             searchable={true}
//             searchPlaceholder="Rechercher un stagiaire..."
//             onRowClick={handleRowClick}
//             emptyMessage="Aucun stagiaire ne termine son stage ce jour"
//             striped
//             renderHeader={renderHeader}
//             loading={loading}
//           />
//         </div>
//       )}

//       {selectedDay && stagiairesOfDay.length === 0 && (
//         <div className="mt-4 bg-white border border-gray-200 rounded-xl p-8 text-center">
//           <p className="text-gray-500 text-sm">Aucun stagiaire ne termine son stage le {selectedDay} {MONTHS[currentDate.getMonth()].toLowerCase()} {currentDate.getFullYear()}</p>
//         </div>
//       )}

//       {/* Modal de détails */}
//       <DetailsModal
//         isOpen={isDetailsOpen}
//         onClose={() => setIsDetailsOpen(false)}
//         title={selectedStagiaire?.nom_complet || ''}
//         subtitle={
//           <div className="flex items-center gap-2">
//             <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">
//               {selectedStagiaire?.matricule}
//             </span>
//             <span className="text-xs text-gray-400">
//               Fin le {selectedStagiaire?.date_fin ? new Date(selectedStagiaire.date_fin).toLocaleDateString('fr-FR') : 'N/A'}
//             </span>
//           </div>
//         }
//         avatar={selectedStagiaire?.nom_complet?.charAt(0).toUpperCase()}
//         sections={getDetailSections()}
//       />
//     </div>
//   );
// }

// app/calendrier-fin-stage/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Users, GraduationCap, Briefcase, Calendar } from 'lucide-react';
import { DataTable, Column } from '@/components/DataTable';
import { DetailsModal, DetailSection } from '@/components/DetailsModal';
import { supabase } from '@/lib/supabase';

interface StagiaireFinStage {
  id: number;
  matricule: string;
  nom_complet: string;
  email: string;
  telephone: string;
  universite: string;
  niveau_etudes: string;
  date_fin: string;
  service_accueil: string;
  statut: string;
}

interface StagiaireDetail extends StagiaireFinStage {
  genre: string;
  date_naissance: string;
  lieu_naissance: string;
  nationalite: string;
  adresse: string;
  ville: string;
  nom_urgence: string;
  telephone_urgence: string;
  lien_urgence: string;
  faculte: string;
  departement: string;
  domaine_etudes: string;
  annee_academique: string;
  moyenne_generale: number;
  type_stage: string;
  date_debut: string;
  theme_stage: string;
}

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function CalendrierFinStagePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [stagiaires, setStagiaires] = useState<StagiaireFinStage[]>([]);
  const [selectedStagiaire, setSelectedStagiaire] = useState<StagiaireDetail | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStagiairesFinStage();
  }, []);

  const fetchStagiairesFinStage = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('stages')
        .select(`
          date_fin, statut, service_accueil, type_stage,
          stagiaire:stagiaire_id (
            id, matricule,
            users!inner(username, email, telephone),
            informations_academiques(universite, niveau_etudes)
          )
        `)
        .not('date_fin', 'is', null)
        .order('date_fin', { ascending: true });

      if (data) {
        const formatted: StagiaireFinStage[] = data
          .filter((s: any) => s.stagiaire)
          .map((s: any) => ({
            id: s.stagiaire.id,
            matricule: s.stagiaire.matricule,
            nom_complet: s.stagiaire.users?.username || '',
            email: s.stagiaire.users?.email || '',
            telephone: s.stagiaire.users?.telephone || '',
            universite: s.stagiaire.informations_academiques?.[0]?.universite || '',
            niveau_etudes: s.stagiaire.informations_academiques?.[0]?.niveau_etudes || '',
            date_fin: s.date_fin,
            service_accueil: s.service_accueil || '',
            statut: s.statut
          }));
        setStagiaires(formatted);
      }
    } catch (error) {
      console.error('Erreur chargement stagiaires:', error);
    } finally {
      setLoading(false);
    }
  };

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek < 0) startDayOfWeek = 6;

    const days = [];
    
    // Jours du mois précédent
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        month: 'prev',
        isToday: false,
        stagiaireCount: 0
      });
    }

    // Jours du mois actuel
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const count = stagiaires.filter(s => s.date_fin === dateStr).length;
      
      days.push({
        day,
        month: 'current',
        isToday: today.getFullYear() === year && today.getMonth() === month && today.getDate() === day,
        stagiaireCount: count,
        dateStr
      });
    }

    // Jours du mois suivant
    const remainingCells = 42 - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        day,
        month: 'next',
        isToday: false,
        stagiaireCount: 0
      });
    }

    return days;
  }, [currentDate, stagiaires]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') newDate.setMonth(newDate.getMonth() - 1);
      else newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
    setSelectedDay(null);
  };

  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
    setSelectedDay(null);
  };

  const handleDayClick = (day: number, month: string, dateStr?: string) => {
    if (month !== 'current' || !dateStr) return;
    setSelectedDay(selectedDay === day ? null : day);
  };

  const stagiairesOfDay = useMemo(() => {
    if (!selectedDay) return [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    return stagiaires.filter(s => s.date_fin === dateStr);
  }, [selectedDay, currentDate, stagiaires]);

  const loadStagiaireDetails = async (stagiaireId: number) => {
    const { data: detail } = await supabase
      .from('stagiaires')
      .select(`
        *, 
        users!inner(*), 
        informations_academiques(*), 
        stages(*)
      `)
      .eq('id', stagiaireId)
      .single();

    if (detail) {
      const d = detail as any;
      setSelectedStagiaire({
        id: d.id,
        matricule: d.matricule,
        nom_complet: d.users?.username || '',
        email: d.users?.email || '',
        telephone: d.users?.telephone || '',
        universite: d.informations_academiques?.[0]?.universite || '',
        niveau_etudes: d.informations_academiques?.[0]?.niveau_etudes || '',
        date_fin: d.stages?.[0]?.date_fin || '',
        service_accueil: d.stages?.[0]?.service_accueil || '',
        statut: d.stages?.[0]?.statut || '',
        genre: d.users?.genre || '',
        date_naissance: d.date_naissance || '',
        lieu_naissance: d.lieu_naissance || '',
        nationalite: d.nationalite || '',
        adresse: d.adresse || '',
        ville: d.ville || '',
        nom_urgence: d.nom_urgence || '',
        telephone_urgence: d.telephone_urgence || '',
        lien_urgence: d.lien_urgence || '',
        faculte: d.informations_academiques?.[0]?.faculte || '',
        departement: d.informations_academiques?.[0]?.departement || '',
        domaine_etudes: d.informations_academiques?.[0]?.domaine_etudes || '',
        annee_academique: d.informations_academiques?.[0]?.annee_academique || '',
        moyenne_generale: d.informations_academiques?.[0]?.moyenne_generale || 0,
        type_stage: d.stages?.[0]?.type_stage || '',
        date_debut: d.stages?.[0]?.date_debut || '',
        theme_stage: d.stages?.[0]?.theme || ''
      });
    }
  };

  const handleRowClick = async (item: StagiaireFinStage) => {
    setIsDetailsOpen(true);
    await loadStagiaireDetails(item.id);
  };

  const getDetailSections = (): DetailSection[] => {
    if (!selectedStagiaire) return [];
    return [
      {
        title: '👤 Informations personnelles',
        fields: [
          { label: 'Nom complet', value: selectedStagiaire.nom_complet, span: 'full' },
          { label: 'Email', value: selectedStagiaire.email, span: 'half' },
          { label: 'Téléphone', value: selectedStagiaire.telephone || 'N/A', span: 'half' },
          { label: 'Genre', value: selectedStagiaire.genre === 'M' ? 'Masculin' : 'Féminin', span: 'half' },
          { label: 'Nationalité', value: selectedStagiaire.nationalite || 'N/A', span: 'half' },
        ]
      },
      {
        title: '🎓 Formation',
        fields: [
          { label: 'Université', value: selectedStagiaire.universite, span: 'full' },
          { label: 'Niveau', value: selectedStagiaire.niveau_etudes, span: 'half' },
          { label: 'Domaine', value: selectedStagiaire.domaine_etudes || 'N/A', span: 'half' },
        ]
      },
      {
        title: '💼 Stage',
        fields: [
          { label: 'Type', value: selectedStagiaire.type_stage, span: 'half' },
          { label: 'Service', value: selectedStagiaire.service_accueil || 'N/A', span: 'half' },
          { label: 'Début', value: selectedStagiaire.date_debut ? new Date(selectedStagiaire.date_debut).toLocaleDateString('fr-FR') : 'N/A', span: 'half' },
          { label: 'Fin prévue', value: selectedStagiaire.date_fin ? new Date(selectedStagiaire.date_fin).toLocaleDateString('fr-FR') : 'N/A', span: 'half' },
          { label: 'Statut', value: selectedStagiaire.statut, span: 'half' },
        ]
      }
    ];
  };

  const columns: Column<StagiaireFinStage>[] = [
    { key: 'matricule', header: 'Matricule', sortable: true, maxChars: 15 },
    { key: 'nom_complet', header: 'Nom complet', sortable: true },
    { key: 'email', header: 'Email', maxChars: 25 },
    { key: 'universite', header: 'Université', maxChars: 20 },
    { key: 'niveau_etudes', header: 'Niveau' },
    { 
      key: 'date_fin', 
      header: 'Fin stage', 
      sortable: true,
      render: (item) => (
        <span className="text-amber-600 font-medium">
          {new Date(item.date_fin).toLocaleDateString('fr-FR')}
        </span>
      )
    },
    { 
      key: 'statut', 
      header: 'Statut',
      render: (item) => {
        const config: Record<string, { label: string; className: string }> = {
          'en_cours': { label: 'En cours', className: 'bg-green-100 text-green-800' },
          'en_attente': { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
          'termine': { label: 'Terminé', className: 'bg-blue-100 text-blue-800' },
          'abandonne': { label: 'Abandonné', className: 'bg-red-100 text-red-800' },
        };
        const c = config[item.statut] || { label: item.statut, className: 'bg-gray-100 text-gray-600' };
        return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${c.className}`}>{c.label}</span>;
      }
    }
  ];

  const renderHeader = () => (
    <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3 bg-white">
      <Users size={20} className="text-indigo-600" />
      <h2 className="font-bold text-gray-900 text-lg">
        Stagiaires finissant le {selectedDay} {MONTHS[currentDate.getMonth()].toLowerCase()} {currentDate.getFullYear()}
      </h2>
    </div>
  );

  const totalFinMois = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    return stagiaires.filter(s => {
      const date = new Date(s.date_fin);
      return date.getFullYear() === year && date.getMonth() + 1 === month;
    }).length;
  }, [currentDate, stagiaires]);

  const today = new Date();
  const isCurrentMonth = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto py-5 px-4">
      {/* En-tête fixe */}
      <div className="flex-shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Calendar size={20} className="text-indigo-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Calendrier des fins de stage
              </h1>
            </div>
            
            <div className="flex items-center gap-2.5">
              {isCurrentMonth && (
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-200">
                  Mois en cours
                </span>
              )}
              {totalFinMois > 0 && (
                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium border border-amber-200 flex items-center gap-1">
                  <Briefcase size={12} />
                  {totalFinMois} fin{totalFinMois > 1 ? 's' : ''} de stage
                </span>
              )}
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-gray-100">
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => navigateMonth('prev')}
                className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all duration-150 cursor-pointer active:scale-95"
              >
                <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
                <span className="hidden sm:inline">Mois précédent</span>
                <span className="sm:hidden">Préc.</span>
              </button>

              <div className="flex items-center gap-2 min-w-[180px] justify-center">
                <GraduationCap size={20} className="text-gray-400 hidden sm:block" />
                <h2 className="text-lg font-bold text-gray-900 whitespace-nowrap select-none">
                  {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
              </div>

              <button
                onClick={() => navigateMonth('next')}
                className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all duration-150 cursor-pointer active:scale-95"
              >
                <span className="hidden sm:inline">Mois suivant</span>
                <span className="sm:hidden">Suiv.</span>
                <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            {!isCurrentMonth && (
              <div className="flex justify-center mt-3">
                <button
                  onClick={goToCurrentMonth}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Calendar size={13} />
                  Retour au mois actuel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Zone principale : Calendrier + Liste côte à côte */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        {/* Calendrier - taille fixe */}
        <div className="lg:w-[60%] lg:min-w-[500px] flex-shrink-0 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Jours de la semaine */}
          <div className="flex-shrink-0 grid grid-cols-7 border-b border-gray-100 bg-gray-50/80">
            {DAYS.map((day, i) => (
              <div
                key={day}
                className={`px-3 py-3 text-xs font-semibold text-center uppercase tracking-wider ${
                  i >= 5 ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Grille du mois - prend toute la hauteur */}
          <div className="flex-1 grid grid-cols-7 auto-rows-fr">
            {calendarDays.map((date, i) => {
              const isWeekend = i % 7 >= 5;
              const isSelected = selectedDay === date.day && date.month === 'current';
              const hasStagiaires = date.stagiaireCount > 0;
              
              return (
                <div
                  key={i}
                  onClick={() => handleDayClick(date.day, date.month, date.dateStr)}
                  className={`
                    border-r border-b border-gray-50 p-2 relative transition-all duration-150
                    ${date.month !== 'current' 
                      ? 'bg-gray-50/30 text-gray-300' 
                      : isSelected
                      ? 'bg-amber-50/80 ring-2 ring-amber-300 ring-inset shadow-sm z-10'
                      : isWeekend
                      ? 'bg-gray-50/20 hover:bg-gray-100/30'
                      : hasStagiaires
                      ? 'hover:bg-amber-50/40'
                      : 'hover:bg-gray-50/50'}
                    ${date.month === 'current' ? 'cursor-pointer' : 'cursor-default'}
                  `}
                >
                  {date.month === 'current' && (
                    <>
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`
                            text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full
                            ${date.isToday 
                              ? 'bg-indigo-600 text-white shadow-sm' 
                              : isSelected
                              ? 'text-amber-700 bg-amber-100'
                              : isWeekend
                              ? 'text-gray-400'
                              : 'text-gray-700'}
                          `}
                        >
                          {date.day}
                        </span>
                        {hasStagiaires && (
                          <span className={`
                            text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center
                            ${isSelected 
                              ? 'bg-amber-200 text-amber-800' 
                              : 'bg-amber-100 text-amber-700'}
                          `}>
                            {date.stagiaireCount}
                          </span>
                        )}
                      </div>

                      {hasStagiaires && (
                        <div className="space-y-0.5">
                          {stagiaires
                            .filter(s => s.date_fin === date.dateStr)
                            .slice(0, 2)
                            .map((s) => (
                              <div
                                key={s.id}
                                className={`
                                  flex items-center gap-1.5 px-1.5 py-1 rounded text-[10px] leading-tight truncate
                                  ${isSelected 
                                    ? 'bg-white/60 text-amber-900 border border-amber-200/50' 
                                    : 'bg-amber-50/80 text-amber-800 border border-amber-100/50'}
                                `}
                                title={s.nom_complet}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                                <span className="truncate">{s.nom_complet}</span>
                              </div>
                            ))}
                          {stagiaires.filter(s => s.date_fin === date.dateStr).length > 2 && (
                            <span className="text-[10px] text-gray-400 px-1.5 font-medium">
                              +{stagiaires.filter(s => s.date_fin === date.dateStr).length - 2} autres
                            </span>
                          )}
                        </div>
                      )}

                      {isSelected && !hasStagiaires && (
                        <div className="mt-1 text-[10px] text-amber-600 text-center font-medium">
                          Aucun stagiaire
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Liste des stagiaires - à droite sur desktop, en dessous sur mobile */}
        <div className="lg:w-[40%] lg:min-w-[350px] flex flex-col min-h-0">
          {selectedDay && stagiairesOfDay.length > 0 ? (
            <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0">
              <DataTable
                data={stagiairesOfDay}
                columns={columns}
                searchable={true}
                searchPlaceholder="Rechercher un stagiaire..."
                onRowClick={handleRowClick}
                emptyMessage="Aucun stagiaire ne termine son stage ce jour"
                striped
                renderHeader={renderHeader}
                loading={loading}
              />
            </div>
          ) : selectedDay && stagiairesOfDay.length === 0 ? (
            <div className="flex-1 bg-white rounded-xl border border-gray-200 p-8 flex flex-col items-center justify-center text-center">
              <Calendar size={40} className="text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">
                Aucun stagiaire ne termine son stage le {selectedDay} {MONTHS[currentDate.getMonth()].toLowerCase()} {currentDate.getFullYear()}
              </p>
              <button
                onClick={() => setSelectedDay(null)}
                className="mt-3 text-xs text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
              >
                ← Retour au calendrier
              </button>
            </div>
          ) : (
            <div className="flex-1 bg-white rounded-xl border border-gray-200 p-8 flex flex-col items-center justify-center text-center">
              <Calendar size={40} className="text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">
                Sélectionnez un jour dans le calendrier pour voir les stagiaires qui terminent leur stage
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de détails */}
      <DetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={selectedStagiaire?.nom_complet || ''}
        subtitle={
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">
              {selectedStagiaire?.matricule}
            </span>
            <span className="text-xs text-gray-400">
              Fin le {selectedStagiaire?.date_fin ? new Date(selectedStagiaire.date_fin).toLocaleDateString('fr-FR') : 'N/A'}
            </span>
          </div>
        }
        avatar={selectedStagiaire?.nom_complet?.charAt(0).toUpperCase()}
        sections={getDetailSections()}
      />
    </div>
  );
}