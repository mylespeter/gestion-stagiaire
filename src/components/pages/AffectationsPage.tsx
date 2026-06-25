
// // app/affectations/page.tsx
// "use client";
// import React, { ReactNode } from 'react'; 
// import { useState, useEffect } from 'react';
// import { DataTable, Column } from '@/components/DataTable';
// import { FormModal, FormField } from '@/components/FormModal';
// import { DetailsModal, DetailSection } from '@/components/DetailsModal';
// import { StatCard } from '@/components/ui/StatCard';
// import { supabase } from '@/lib/supabase';
// import type { AffectationRecord, Affectation } from '@/types/organisation';
// import { 
//   UserPlus, Building2, Layers, Calendar, User, Mail, Phone, 
//   CheckCircle, XCircle, Clock, Briefcase, Users, ArrowRight
// } from 'lucide-react';

// // Composant Avatar avec initiales
// function AvatarInitials({ 
//   name, 
//   size = 'md', 
//   className = '' 
// }: { 
//   name: string; 
//   size?: 'sm' | 'md' | 'lg' | 'xl';
//   className?: string;
// }) {
//   const sizeClasses = {
//     sm: 'w-8 h-8 text-xs',
//     md: 'w-10 h-10 text-sm',
//     lg: 'w-12 h-12 text-base',
//     xl: 'w-16 h-16 text-xl'
//   };

//   const colors = [
//     'bg-indigo-100 text-indigo-700',
//     'bg-emerald-100 text-emerald-700',
//     'bg-amber-100 text-amber-700',
//     'bg-rose-100 text-rose-700',
//     'bg-cyan-100 text-cyan-700',
//     'bg-violet-100 text-violet-700',
//     'bg-teal-100 text-teal-700',
//     'bg-orange-100 text-orange-700',
//   ];

//   const getInitials = (name: string) => {
//     if (!name) return '?';
//     const parts = name.trim().split(' ');
//     if (parts.length >= 2) {
//       return (parts[0][0] + parts[1][0]).toUpperCase();
//     }
//     return parts[0][0].toUpperCase();
//   };

//   const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;

//   return (
//     <div className={`${sizeClasses[size]} ${colors[colorIndex]} rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${className}`}>
//       {getInitials(name)}
//     </div>
//   );
// }

// // Badge de statut stylisé
// function StatusBadge({ statut }: { statut: string }) {
//   const config: Record<string, { label: string; className: string; icon:  React.ReactElement}> = {
//     'active': { 
//       label: 'Active', 
//       className: 'bg-green-50 text-green-700 border-green-200',
//       icon: <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
//     },
//     'terminee': { 
//       label: 'Terminée', 
//       className: 'bg-blue-50 text-blue-700 border-blue-200',
//       icon: <CheckCircle size={12} />
//     },
//     'annulee': { 
//       label: 'Annulée', 
//       className: 'bg-red-50 text-red-700 border-red-200',
//       icon: <XCircle size={12} />
//     }
//   };

//   const c = config[statut] || { 
//     label: statut, 
//     className: 'bg-gray-50 text-gray-600 border-gray-200',
//     icon: <Clock size={12} />
//   };

//   return (
//     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${c.className}`}>
//       {c.icon}
//       {c.label}
//     </span>
//   );
// }

// export default function AffectationsPage() {
//   const [affectations, setAffectations] = useState<AffectationRecord[]>([]);
//   const [selectedAffectation, setSelectedAffectation] = useState<Affectation | null>(null);
//   const [isDetailsOpen, setIsDetailsOpen] = useState(false);
//   const [isCreateOpen, setIsCreateOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [stagiaires, setStagiaires] = useState<any[]>([]);
//   const [services, setServices] = useState<any[]>([]);
//   const [encadreurs, setEncadreurs] = useState<any[]>([]);
//   const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
//   const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
//   const [motif, setMotif] = useState('');

//   // Stats pour les tendances
//   const [previousMonthCount, setPreviousMonthCount] = useState(0);

//   useEffect(() => {
//     fetchAffectations();
//     fetchStagiaires();
//     fetchServices();
//     fetchEncadreurs();
//   }, []);

//   const fetchAffectations = async () => {
//     const { data } = await supabase
//       .from('affectations')
//       .select(`
//         *,
//         stagiaire:stagiaire_id(id, matricule, users!inner(username, email)),
//         service:service_id(id, nom, code, departement:departement_id(id, nom, code)),
//         encadreur:encadreur_id(id, username, email)
//       `)
//       .order('created_at', { ascending: false });

//     if (data) {
//       const formatted: AffectationRecord[] = data.map((a: any) => ({
//         id: a.id,
//         stagiaire: a.stagiaire?.users?.username || '',
//         matricule: a.stagiaire?.matricule || '',
//         departement: a.service?.departement?.nom || '',
//         service: a.service?.nom || '',
//         encadreur: a.encadreur?.username || 'Non assigné',
//         date_debut: new Date(a.date_debut).toLocaleDateString('fr-FR'),
//         statut: a.statut
//       }));
//       setAffectations(formatted);

//       // Calculer les stats du mois précédent (simulation)
//       const now = new Date();
//       const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
//       const prevMonthAffectations = data.filter((a: any) => {
//         const created = new Date(a.created_at);
//         return created.getMonth() === lastMonth.getMonth() && 
//                created.getFullYear() === lastMonth.getFullYear();
//       });
//       setPreviousMonthCount(prevMonthAffectations.length);
//     }
//   };

//   const fetchStagiaires = async () => {
//     const { data } = await supabase
//       .from('stagiaires')
//       .select('id, matricule, users!inner(username)')
//       .order('created_at', { ascending: false });
//     if (data) setStagiaires(data);
//   };

//   const fetchServices = async () => {
//     const { data } = await supabase
//       .from('services')
//       .select('id, nom, code, departement:departement_id(nom)')
//       .order('nom');
//     if (data) setServices(data);
//   };

//   const fetchEncadreurs = async () => {
//     const { data } = await supabase
//       .from('users')
//       .select('id, username, email')
//       .eq('role', 'encadreur')
//       .order('username');
//     if (data) setEncadreurs(data);
//   };

//   const loadAffectationDetails = async (id: number) => {
//     const { data } = await supabase
//       .from('affectations')
//       .select(`
//         *,
//         stagiaire:stagiaire_id(
//           id, matricule, date_naissance, lieu_naissance,
//           users!inner(username, email, telephone)
//         ),
//         service:service_id(
//           id, nom, code,
//           departement:departement_id(id, nom, code)
//         ),
//         encadreur:encadreur_id(id, username, email, telephone)
//       `)
//       .eq('id', id)
//       .single();
//     if (data) {
//       setSelectedAffectation(data as Affectation);
//     }
//   };

//   const handleCreate = async (formData: Record<string, any>) => {
//     setIsLoading(true);
//     try {
//       const { data: existingAffectation } = await supabase
//         .from('affectations')
//         .select('id')
//         .eq('stagiaire_id', parseInt(formData.stagiaire_id))
//         .eq('statut', 'active')
//         .single();

//       if (existingAffectation) {
//         throw new Error('Ce stagiaire a déjà une affectation active');
//       }

//       const { error } = await supabase.from('affectations').insert({
//         stagiaire_id: parseInt(formData.stagiaire_id),
//         service_id: parseInt(formData.service_id),
//         encadreur_id: formData.encadreur_id ? parseInt(formData.encadreur_id) : null,
//         date_debut: formData.date_debut,
//         date_fin: formData.date_fin || null,
//         statut: 'active'
//       });
//       if (error) throw error;
//       await fetchAffectations();
//       setIsCreateOpen(false);
//     } catch (error: any) {
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleTerminate = async () => {
//     if (!selectedAffectation || !motif.trim()) return;
    
//     try {
//       await supabase.from('affectations').update({
//         statut: 'terminee',
//         date_fin: new Date().toISOString().split('T')[0],
//         motif_fin: motif.trim()
//       }).eq('id', selectedAffectation.id);
      
//       await fetchAffectations();
//       await loadAffectationDetails(selectedAffectation.id);
//       setIsTerminateModalOpen(false);
//       setMotif('');
//     } catch (error) {
//       console.error('Erreur terminaison:', error);
//     }
//   };

//   const handleCancel = async () => {
//     if (!selectedAffectation || !motif.trim()) return;
    
//     try {
//       await supabase.from('affectations').update({
//         statut: 'annulee',
//         date_fin: new Date().toISOString().split('T')[0],
//         motif_fin: motif.trim()
//       }).eq('id', selectedAffectation.id);
      
//       await fetchAffectations();
//       await loadAffectationDetails(selectedAffectation.id);
//       setIsCancelModalOpen(false);
//       setMotif('');
//     } catch (error) {
//       console.error('Erreur annulation:', error);
//     }
//   };

//   const handleRowClick = async (item: AffectationRecord) => {
//     await loadAffectationDetails(item.id);
//     setIsDetailsOpen(true);
//   };

//   const affectationFields: FormField[] = [
//     {
//       name: 'stagiaire_id',
//       label: 'Stagiaire',
//       type: 'select',
//       required: true,
//       options: stagiaires.map(s => ({ 
//         value: String(s.id), 
//         label: `${s.users?.username} (${s.matricule})` 
//       })),
//       icon: <User size={14} />,
//       placeholder: 'Sélectionner un stagiaire...'
//     },
//     {
//       name: 'service_id',
//       label: 'Service',
//       type: 'select',
//       required: true,
//       options: services.map(s => ({ 
//         value: String(s.id), 
//         label: `${s.nom} - ${s.departement?.nom} (${s.code})` 
//       })),
//       icon: <Layers size={14} />,
//       placeholder: 'Sélectionner un service...'
//     },
//     {
//       name: 'encadreur_id',
//       label: 'Encadreur',
//       type: 'select',
//       options: [
//         { value: '', label: 'Aucun encadreur' },
//         ...encadreurs.map(e => ({ 
//           value: String(e.id), 
//           label: `${e.username} (${e.email})` 
//         }))
//       ],
//       icon: <User size={14} />
//     },
//     { 
//       name: 'date_debut', 
//       label: 'Date de début', 
//       type: 'date', 
//       required: true, 
//       span: 'half',
//       defaultValue: new Date().toISOString().split('T')[0]
//     },
//     { 
//       name: 'date_fin', 
//       label: 'Date de fin prévue', 
//       type: 'date', 
//       span: 'half',
//       hint: 'Optionnel'
//     },
//   ];

//   const columns: Column<AffectationRecord>[] = [
//     { 
//       key: 'stagiaire', 
//       header: 'Stagiaire', 
//       sortable: true,
//       render: (item) => (
//         <div className="flex items-center gap-3">
//           <AvatarInitials name={item.stagiaire} size="sm" />
//           <div className="min-w-0">
//             <p className="text-sm font-medium text-gray-900 truncate">{item.stagiaire}</p>
//             <p className="text-xs text-gray-500">{item.matricule}</p>
//           </div>
//         </div>
//       )
//     },
//     { key: 'departement', header: 'Département', sortable: true, maxChars: 20 },
//     { key: 'service', header: 'Service', sortable: true, maxChars: 20 },
//     { 
//       key: 'encadreur', 
//       header: 'Encadreur',
//       render: (item) => (
//         <div className="flex items-center gap-2">
//           {item.encadreur !== 'Non assigné' ? (
//             <>
//               <AvatarInitials name={item.encadreur} size="sm" className="w-6 h-6 text-[10px]" />
//               <span className="text-sm text-gray-700">{item.encadreur}</span>
//             </>
//           ) : (
//             <span className="text-sm text-gray-400 italic">Non assigné</span>
//           )}
//         </div>
//       )
//     },
//     { key: 'date_debut', header: 'Début', sortable: true },
//     {
//       key: 'statut',
//       header: 'Statut',
//       sortable: true,
//       render: (item) => <StatusBadge statut={item.statut} />
//     }
//   ];

//   const getDetailSections = (): DetailSection[] => {
//     if (!selectedAffectation) return [];

//     const stagiaire = selectedAffectation.stagiaire;
//     const service = selectedAffectation.service;
//     const encadreur = selectedAffectation.encadreur;

//     return [
//       {
//         title: '👤 Stagiaire',
//         fields: [
//           { label: 'Nom complet', value: stagiaire?.users?.username || 'N/A', icon: <User size={14} />, span: 'half' },
//           { label: 'Matricule', value: stagiaire?.matricule || 'N/A', span: 'half' },
//           { label: 'Email', value: stagiaire?.users?.email || 'N/A', icon: <Mail size={14} />, span: 'half' },
//           { label: 'Téléphone', value: stagiaire?.users?.telephone || 'N/A', icon: <Phone size={14} />, span: 'half' },
//         ]
//       },
//       {
//         title: '🏢 Affectation',
//         fields: [
//           { label: 'Département', value: service?.departement?.nom || 'N/A', icon: <Building2 size={14} />, span: 'half' },
//           { label: 'Service', value: service?.nom || 'N/A', icon: <Layers size={14} />, span: 'half' },
//           { label: 'Code service', value: service?.code || 'N/A', span: 'half' },
//           { label: 'Encadreur', value: encadreur?.username || 'Non assigné', icon: <User size={14} />, span: 'half' },
//           { label: 'Email encadreur', value: encadreur?.email || 'N/A', icon: <Mail size={14} />, span: 'half' },
//           { label: 'Tél. encadreur', value: encadreur?.telephone || 'N/A', icon: <Phone size={14} />, span: 'half' },
//           { label: 'Date début', value: selectedAffectation.date_debut ? new Date(selectedAffectation.date_debut).toLocaleDateString('fr-FR') : 'N/A', icon: <Calendar size={14} />, span: 'half' },
//           { label: 'Date fin', value: selectedAffectation.date_fin ? new Date(selectedAffectation.date_fin).toLocaleDateString('fr-FR') : 'Non définie', icon: <Calendar size={14} />, span: 'half' },
//           { label: 'Statut', value: <StatusBadge statut={selectedAffectation.statut} />, span: 'half' },
//           { label: 'Motif fin', value: selectedAffectation.motif_fin || 'N/A', span: 'full' },
//         ]
//       }
//     ];
//   };

//   const getDetailFooter = () => {
//     if (!selectedAffectation || selectedAffectation.statut !== 'active') return null;
    
//     return (
//       <div className="flex gap-2">
//         <button 
//           onClick={() => {
//             setMotif('');
//             setIsTerminateModalOpen(true);
//           }}
//           className="flex items-center gap-1.5 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
//         >
//           <CheckCircle size={14} /> Terminer
//         </button>
//         <button 
//           onClick={() => {
//             setMotif('');
//             setIsCancelModalOpen(true);
//           }}
//           className="flex items-center gap-1.5 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
//         >
//           <XCircle size={14} /> Annuler
//         </button>
//       </div>
//     );
//   };

//   const renderHeader = () => (
//     <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-4 flex-wrap bg-white">
//       <div>
//         <h2 className="font-bold text-gray-900 text-lg">Affectations des Stagiaires</h2>
//         <p className="text-sm text-gray-500 mt-0.5">
//           Gérez les affectations des stagiaires aux départements et services
//         </p>
//       </div>
//       <button 
//         onClick={() => setIsCreateOpen(true)} 
//         className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium shadow-sm"
//       >
//         <UserPlus size={16} /> Nouvelle affectation
//       </button>
//     </div>
//   );

//   // Calcul des stats
//   const activeCount = affectations.filter(a => a.statut === 'active').length;
//   const termineeCount = affectations.filter(a => a.statut === 'terminee').length;
//   const annuleeCount = affectations.filter(a => a.statut === 'annulee').length;
//   const totalCount = affectations.length;

//   // Calcul des tendances
//   const activeTrend = previousMonthCount > 0 
//     ? Math.round(((activeCount - previousMonthCount) / previousMonthCount) * 100)
//     : 100;
//   const completionRate = totalCount > 0 
//     ? Math.round((termineeCount / totalCount) * 100) 
//     : 0;

//   return (
//     <div className="p-6 max-w-[1400px] mx-auto space-y-6">
//       {/* Cartes statistiques avec StatCard */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard
//           label="Total affectations"
//           value={String(totalCount)}
//           trend={totalCount > 0 ? { 
//             value: `${activeTrend > 0 ? '+' : ''}${activeTrend}%`, 
//             isPositive: activeTrend >= 0 
//           } : undefined}
//         />
        
//         <StatCard
//           label="Affectations actives"
//           value={String(activeCount)}
//           trend={activeCount > 0 ? { 
//             value: `${activeCount} en cours`, 
//             isPositive: true 
//           } : undefined}
//         />
        
//         <StatCard
//           label="Affectations terminées"
//           value={String(termineeCount)}
//           trend={completionRate > 0 ? { 
//             value: `${completionRate}% de complétion`, 
//             isPositive: true 
//           } : undefined}
//         />
        
//         <StatCard
//           label="Affectations annulées"
//           value={String(annuleeCount)}
//           trend={annuleeCount > 0 ? { 
//             value: `${annuleeCount} annulation(s)`, 
//             isPositive: false 
//           } : undefined}
//         />
//       </div>

//       {/* Tableau */}
//       <DataTable
//         data={affectations}
//         columns={columns}
//         searchable={true}
//         searchPlaceholder="Rechercher une affectation..."
//         onRowClick={handleRowClick}
//      emptyMessage="Aucune affectation trouvée. Créez une nouvelle affectation pour commencer."
//         striped
//         renderHeader={renderHeader}
//         loading={isLoading}

//       />

//       {/* Modal Création */}
//       <FormModal
//         isOpen={isCreateOpen}
//         onClose={() => setIsCreateOpen(false)}
//         title="Nouvelle Affectation"
//         subtitle="Affectez un stagiaire à un service"
//         fields={affectationFields}
//         onSubmit={handleCreate}
//         submitLabel="Affecter le stagiaire"
//         loading={isLoading}
//         maxWidth="max-w-lg"
//         mode="create"
//       />

//       {/* Modal Détails */}
//       <DetailsModal
//         isOpen={isDetailsOpen}
//         onClose={() => setIsDetailsOpen(false)}
//         title={selectedAffectation?.stagiaire?.users?.username || 'Détails'}
//         subtitle={
//           <div className="flex items-center gap-2 flex-wrap">
//             <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
//               {selectedAffectation?.stagiaire?.matricule}
//             </span>
//             <ArrowRight size={12} className="text-gray-400" />
//             <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
//               {selectedAffectation?.service?.nom}
//             </span>
//             {selectedAffectation && (
//               <StatusBadge statut={selectedAffectation.statut} />
//             )}
//           </div>
//         }
//         avatar={
//           <AvatarInitials 
//             name={selectedAffectation?.stagiaire?.users?.username || '?'} 
//             size="md" 
//           />
//         }
//         sections={getDetailSections()}
//         footer={getDetailFooter()}
//       />

//       {/* Modal Terminer */}
//       {isTerminateModalOpen && (
//         <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setIsTerminateModalOpen(false)}>
//           <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
//                 <CheckCircle size={20} className="text-green-600" />
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900">Terminer l'affectation</h3>
//                 <p className="text-sm text-gray-500">
//                   {selectedAffectation?.stagiaire?.users?.username}
//                 </p>
//               </div>
//             </div>
//             <label className="block text-xs font-medium text-gray-500 mb-1.5">
//               Motif de fin <span className="text-red-400">*</span>
//             </label>
//             <textarea
//               value={motif}
//               onChange={(e) => setMotif(e.target.value)}
//               placeholder="Ex: Fin de stage, Mission accomplie..."
//               className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 min-h-[80px] resize-y"
//               rows={3}
//             />
//             <div className="flex justify-end gap-3 mt-4">
//               <button onClick={() => setIsTerminateModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
//                 Annuler
//               </button>
//               <button onClick={handleTerminate} disabled={!motif.trim()} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
//                 Confirmer la terminaison
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal Annuler */}
//       {isCancelModalOpen && (
//         <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setIsCancelModalOpen(false)}>
//           <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
//                 <XCircle size={20} className="text-red-600" />
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900">Annuler l'affectation</h3>
//                 <p className="text-sm text-gray-500">
//                   {selectedAffectation?.stagiaire?.users?.username}
//                 </p>
//               </div>
//             </div>
//             <label className="block text-xs font-medium text-gray-500 mb-1.5">
//               Motif d'annulation <span className="text-red-400">*</span>
//             </label>
//             <textarea
//               value={motif}
//               onChange={(e) => setMotif(e.target.value)}
//               placeholder="Ex: Abandon, Réorientation..."
//               className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 min-h-[80px] resize-y"
//               rows={3}
//             />
//             <div className="flex justify-end gap-3 mt-4">
//               <button onClick={() => setIsCancelModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
//                 Annuler
//               </button>
//               <button onClick={handleCancel} disabled={!motif.trim()} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
//                 Confirmer l'annulation
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// app/affectations/page.tsx
"use client";
import React, { ReactNode } from 'react'; 
import { useState, useEffect } from 'react';
import { DataTable, Column } from '@/components/DataTable';
import { FormModal, FormField } from '@/components/FormModal';
import { DetailsModal, DetailSection } from '@/components/DetailsModal';
import { StatCard } from '@/components/ui/StatCard';
import { supabase } from '@/lib/supabase';
import type { AffectationRecord, Affectation } from '@/types/organisation';
import { 
  UserPlus, Building2, Layers, Calendar, User, Mail, Phone, 
  CheckCircle, XCircle, Clock, Briefcase, Users, ArrowRight
} from 'lucide-react';

// Composant Avatar avec initiales
function AvatarInitials({ 
  name, 
  size = 'md', 
  className = '' 
}: { 
  name: string; 
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl'
  };

  const colors = [
    'bg-indigo-100 text-indigo-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
    'bg-cyan-100 text-cyan-700',
    'bg-violet-100 text-violet-700',
    'bg-teal-100 text-teal-700',
    'bg-orange-100 text-orange-700',
  ];

  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;

  return (
    <div className={`${sizeClasses[size]} ${colors[colorIndex]} rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${className}`}>
      {getInitials(name)}
    </div>
  );
}

// Badge de statut stylisé
function StatusBadge({ statut }: { statut: string }) {
  const config: Record<string, { label: string; className: string; icon: React.ReactElement}> = {
    'active': { 
      label: 'Active', 
      className: 'bg-green-50 text-green-700 border-green-200',
      icon: <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
    },
    'terminee': { 
      label: 'Terminée', 
      className: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: <CheckCircle size={12} />
    },
    'annulee': { 
      label: 'Annulée', 
      className: 'bg-red-50 text-red-700 border-red-200',
      icon: <XCircle size={12} />
    }
  };

  const c = config[statut] || { 
    label: statut, 
    className: 'bg-gray-50 text-gray-600 border-gray-200',
    icon: <Clock size={12} />
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${c.className}`}>
      {c.icon}
      {c.label}
    </span>
  );
}

export default function AffectationsPage() {
  const [affectations, setAffectations] = useState<AffectationRecord[]>([]);
  const [selectedAffectation, setSelectedAffectation] = useState<Affectation | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stagiaires, setStagiaires] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [encadreurs, setEncadreurs] = useState<any[]>([]);
  const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [motif, setMotif] = useState('');

  // Stats pour les tendances
  const [previousMonthCount, setPreviousMonthCount] = useState(0);

  useEffect(() => {
    fetchAffectations();
    fetchStagiaires();
    fetchServices();
    fetchEncadreurs();
  }, []);

  const fetchAffectations = async () => {
    const { data } = await supabase
      .from('affectations')
      .select(`
        *,
        stagiaire:stagiaire_id(id, matricule, users!inner(username, email)),
        service:service_id(id, nom, code, departement:departement_id(id, nom, code)),
        encadreur:encadreur_id(id, username, email)
      `)
      .order('created_at', { ascending: false });

    if (data) {
      const formatted: AffectationRecord[] = data.map((a: any) => ({
        id: a.id,
        stagiaire: a.stagiaire?.users?.username || '',
        matricule: a.stagiaire?.matricule || '',
        departement: a.service?.departement?.nom || '',
        service: a.service?.nom || '',
        encadreur: a.encadreur?.username || 'Non assigné',
        date_debut: new Date(a.date_debut).toLocaleDateString('fr-FR'),
        statut: a.statut
      }));
      setAffectations(formatted);

      // Calculer les stats du mois précédent (simulation)
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const prevMonthAffectations = data.filter((a: any) => {
        const created = new Date(a.created_at);
        return created.getMonth() === lastMonth.getMonth() && 
               created.getFullYear() === lastMonth.getFullYear();
      });
      setPreviousMonthCount(prevMonthAffectations.length);
    }
  };

  const fetchStagiaires = async () => {
    const { data } = await supabase
      .from('stagiaires')
      .select('id, matricule, users!inner(username)')
      .order('created_at', { ascending: false });
    if (data) setStagiaires(data);
  };

  const fetchServices = async () => {
    const { data } = await supabase
      .from('services')
      .select('id, nom, code, departement:departement_id(nom)')
      .order('nom');
    if (data) setServices(data);
  };

  const fetchEncadreurs = async () => {
    const { data } = await supabase
      .from('users')
      .select('id, username, email')
      .eq('role', 'encadreur')
      .order('username');
    if (data) setEncadreurs(data);
  };

  const loadAffectationDetails = async (id: number) => {
    const { data } = await supabase
      .from('affectations')
      .select(`
        *,
        stagiaire:stagiaire_id(
          id, matricule, date_naissance, lieu_naissance,
          users!inner(username, email, telephone)
        ),
        service:service_id(
          id, nom, code,
          departement:departement_id(id, nom, code)
        ),
        encadreur:encadreur_id(id, username, email, telephone)
      `)
      .eq('id', id)
      .single();
    if (data) {
      setSelectedAffectation(data as Affectation);
    }
  };

  const handleCreate = async (formData: Record<string, any>) => {
    setIsLoading(true);
    try {
      // Vérifier si le stagiaire a déjà une affectation active
      const { data: existingAffectation } = await supabase
        .from('affectations')
        .select('id')
        .eq('stagiaire_id', parseInt(formData.stagiaire_id))
        .eq('statut', 'active')
        .single();

      if (existingAffectation) {
        throw new Error('Ce stagiaire a déjà une affectation active');
      }

      // Créer l'affectation
      const { error: affectationError } = await supabase.from('affectations').insert({
        stagiaire_id: parseInt(formData.stagiaire_id),
        service_id: parseInt(formData.service_id),
        encadreur_id: formData.encadreur_id ? parseInt(formData.encadreur_id) : null,
        date_debut: formData.date_debut,
        date_fin: formData.date_fin || null,
        statut: 'active'
      });
      if (affectationError) throw affectationError;

      // Mettre à jour ou créer le stage du stagiaire
      const service = services.find(s => s.id === parseInt(formData.service_id));
      const { data: existingStage } = await supabase
        .from('stages')
        .select('id')
        .eq('stagiaire_id', parseInt(formData.stagiaire_id))
        .single();

      if (existingStage) {
        // Mettre à jour le stage existant
        await supabase.from('stages').update({
          statut: 'en_cours',
          service_accueil: service?.nom || '',
          date_debut: formData.date_debut,
          date_fin: formData.date_fin || null,
          type_stage: 'professionnel'
        }).eq('id', existingStage.id);
      } else {
        // Créer un nouveau stage
        await supabase.from('stages').insert({
          stagiaire_id: parseInt(formData.stagiaire_id),
          type_stage: 'professionnel',
          service_accueil: service?.nom || '',
          date_debut: formData.date_debut,
          date_fin: formData.date_fin || null,
          statut: 'en_cours',
          rapport_depose: false
        });
      }

      await fetchAffectations();
      setIsCreateOpen(false);
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleTerminate = async () => {
    if (!selectedAffectation || !motif.trim()) return;
    
    try {
      // Mettre à jour l'affectation
      await supabase.from('affectations').update({
        statut: 'terminee',
        date_fin: new Date().toISOString().split('T')[0],
        motif_fin: motif.trim()
      }).eq('id', selectedAffectation.id);
      
      // Mettre à jour le stage du stagiaire
      await supabase.from('stages').update({
        statut: 'termine',
        date_fin: new Date().toISOString().split('T')[0]
      }).eq('stagiaire_id', selectedAffectation.stagiaire_id);
      
      await fetchAffectations();
      await loadAffectationDetails(selectedAffectation.id);
      setIsTerminateModalOpen(false);
      setMotif('');
    } catch (error) {
      console.error('Erreur terminaison:', error);
    }
  };

  const handleCancel = async () => {
    if (!selectedAffectation || !motif.trim()) return;
    
    try {
      // Mettre à jour l'affectation
      await supabase.from('affectations').update({
        statut: 'annulee',
        date_fin: new Date().toISOString().split('T')[0],
        motif_fin: motif.trim()
      }).eq('id', selectedAffectation.id);
      
      // Mettre à jour le stage du stagiaire
      await supabase.from('stages').update({
        statut: 'abandonne',
        date_fin: new Date().toISOString().split('T')[0]
      }).eq('stagiaire_id', selectedAffectation.stagiaire_id);
      
      await fetchAffectations();
      await loadAffectationDetails(selectedAffectation.id);
      setIsCancelModalOpen(false);
      setMotif('');
    } catch (error) {
      console.error('Erreur annulation:', error);
    }
  };

  const handleRowClick = async (item: AffectationRecord) => {
    await loadAffectationDetails(item.id);
    setIsDetailsOpen(true);
  };

  const affectationFields: FormField[] = [
    {
      name: 'stagiaire_id',
      label: 'Stagiaire',
      type: 'select',
      required: true,
      options: stagiaires.map(s => ({ 
        value: String(s.id), 
        label: `${s.users?.username} (${s.matricule})` 
      })),
      icon: <User size={14} />,
      placeholder: 'Sélectionner un stagiaire...'
    },
    {
      name: 'service_id',
      label: 'Service',
      type: 'select',
      required: true,
      options: services.map(s => ({ 
        value: String(s.id), 
        label: `${s.nom} - ${s.departement?.nom} (${s.code})` 
      })),
      icon: <Layers size={14} />,
      placeholder: 'Sélectionner un service...'
    },
    {
      name: 'encadreur_id',
      label: 'Encadreur',
      type: 'select',
      options: [
        { value: '', label: 'Aucun encadreur' },
        ...encadreurs.map(e => ({ 
          value: String(e.id), 
          label: `${e.username} (${e.email})` 
        }))
      ],
      icon: <User size={14} />
    },
    { 
      name: 'date_debut', 
      label: 'Date de début', 
      type: 'date', 
      required: true, 
      span: 'half',
      defaultValue: new Date().toISOString().split('T')[0]
    },
    { 
      name: 'date_fin', 
      label: 'Date de fin prévue', 
      type: 'date', 
      span: 'half',
      hint: 'Optionnel'
    },
  ];

  const columns: Column<AffectationRecord>[] = [
    { 
      key: 'stagiaire', 
      header: 'Stagiaire', 
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <AvatarInitials name={item.stagiaire} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{item.stagiaire}</p>
            <p className="text-xs text-gray-500">{item.matricule}</p>
          </div>
        </div>
      )
    },
    { key: 'departement', header: 'Département', sortable: true, maxChars: 20 },
    { key: 'service', header: 'Service', sortable: true, maxChars: 20 },
    { 
      key: 'encadreur', 
      header: 'Encadreur',
      render: (item) => (
        <div className="flex items-center gap-2">
          {item.encadreur !== 'Non assigné' ? (
            <>
              <AvatarInitials name={item.encadreur} size="sm" className="w-6 h-6 text-[10px]" />
              <span className="text-sm text-gray-700">{item.encadreur}</span>
            </>
          ) : (
            <span className="text-sm text-gray-400 italic">Non assigné</span>
          )}
        </div>
      )
    },
    { key: 'date_debut', header: 'Début', sortable: true },
    {
      key: 'statut',
      header: 'Statut',
      sortable: true,
      render: (item) => <StatusBadge statut={item.statut} />
    }
  ];

  const getDetailSections = (): DetailSection[] => {
    if (!selectedAffectation) return [];

    const stagiaire = selectedAffectation.stagiaire;
    const service = selectedAffectation.service;
    const encadreur = selectedAffectation.encadreur;

    return [
      {
        title: '👤 Stagiaire',
        fields: [
          { label: 'Nom complet', value: stagiaire?.users?.username || 'N/A', icon: <User size={14} />, span: 'half' },
          { label: 'Matricule', value: stagiaire?.matricule || 'N/A', span: 'half' },
          { label: 'Email', value: stagiaire?.users?.email || 'N/A', icon: <Mail size={14} />, span: 'half' },
          { label: 'Téléphone', value: stagiaire?.users?.telephone || 'N/A', icon: <Phone size={14} />, span: 'half' },
        ]
      },
      {
        title: '🏢 Affectation',
        fields: [
          { label: 'Département', value: service?.departement?.nom || 'N/A', icon: <Building2 size={14} />, span: 'half' },
          { label: 'Service', value: service?.nom || 'N/A', icon: <Layers size={14} />, span: 'half' },
          { label: 'Code service', value: service?.code || 'N/A', span: 'half' },
          { label: 'Encadreur', value: encadreur?.username || 'Non assigné', icon: <User size={14} />, span: 'half' },
          { label: 'Email encadreur', value: encadreur?.email || 'N/A', icon: <Mail size={14} />, span: 'half' },
          { label: 'Tél. encadreur', value: encadreur?.telephone || 'N/A', icon: <Phone size={14} />, span: 'half' },
          { label: 'Date début', value: selectedAffectation.date_debut ? new Date(selectedAffectation.date_debut).toLocaleDateString('fr-FR') : 'N/A', icon: <Calendar size={14} />, span: 'half' },
          { label: 'Date fin', value: selectedAffectation.date_fin ? new Date(selectedAffectation.date_fin).toLocaleDateString('fr-FR') : 'Non définie', icon: <Calendar size={14} />, span: 'half' },
          { label: 'Statut', value: <StatusBadge statut={selectedAffectation.statut} />, span: 'half' },
          { label: 'Motif fin', value: selectedAffectation.motif_fin || 'N/A', span: 'full' },
        ]
      }
    ];
  };

  const getDetailFooter = () => {
    if (!selectedAffectation || selectedAffectation.statut !== 'active') return null;
    
    return (
      <div className="flex gap-2">
        <button 
          onClick={() => {
            setMotif('');
            setIsTerminateModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <CheckCircle size={14} /> Terminer
        </button>
        <button 
          onClick={() => {
            setMotif('');
            setIsCancelModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <XCircle size={14} /> Annuler
        </button>
      </div>
    );
  };

  const renderHeader = () => (
    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-4 flex-wrap bg-white">
      <div>
        <h2 className="font-bold text-gray-900 text-lg">Affectations des Stagiaires</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Gérez les affectations des stagiaires aux départements et services
        </p>
      </div>
      <button 
        onClick={() => setIsCreateOpen(true)} 
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium shadow-sm"
      >
        <UserPlus size={16} /> Nouvelle affectation
      </button>
    </div>
  );

  // Calcul des stats
  const activeCount = affectations.filter(a => a.statut === 'active').length;
  const termineeCount = affectations.filter(a => a.statut === 'terminee').length;
  const annuleeCount = affectations.filter(a => a.statut === 'annulee').length;
  const totalCount = affectations.length;

  // Calcul des tendances
  const activeTrend = previousMonthCount > 0 
    ? Math.round(((activeCount - previousMonthCount) / previousMonthCount) * 100)
    : 100;
  const completionRate = totalCount > 0 
    ? Math.round((termineeCount / totalCount) * 100) 
    : 0;

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      {/* Cartes statistiques avec StatCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total affectations"
          value={String(totalCount)}
          trend={totalCount > 0 ? { 
            value: `${activeTrend > 0 ? '+' : ''}${activeTrend}%`, 
            isPositive: activeTrend >= 0 
          } : undefined}
        />
        
        <StatCard
          label="Affectations actives"
          value={String(activeCount)}
          trend={activeCount > 0 ? { 
            value: `${activeCount} en cours`, 
            isPositive: true 
          } : undefined}
        />
        
        <StatCard
          label="Affectations terminées"
          value={String(termineeCount)}
          trend={completionRate > 0 ? { 
            value: `${completionRate}% de complétion`, 
            isPositive: true 
          } : undefined}
        />
        
        <StatCard
          label="Affectations annulées"
          value={String(annuleeCount)}
          trend={annuleeCount > 0 ? { 
            value: `${annuleeCount} annulation(s)`, 
            isPositive: false 
          } : undefined}
        />
      </div>

      {/* Tableau */}
      <DataTable
        data={affectations}
        columns={columns}
        searchable={true}
        searchPlaceholder="Rechercher une affectation..."
        onRowClick={handleRowClick}
        emptyMessage="Aucune affectation trouvée. Créez une nouvelle affectation pour commencer."
        striped
        renderHeader={renderHeader}
        loading={isLoading}
      />

      {/* Modal Création */}
      <FormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Nouvelle Affectation"
        subtitle="Affectez un stagiaire à un service - Le stage sera automatiquement créé"
        fields={affectationFields}
        onSubmit={handleCreate}
        submitLabel="Affecter le stagiaire"
        loading={isLoading}
        maxWidth="max-w-lg"
        mode="create"
      />

      {/* Modal Détails */}
      <DetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={selectedAffectation?.stagiaire?.users?.username || 'Détails'}
        subtitle={
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
              {selectedAffectation?.stagiaire?.matricule}
            </span>
            <ArrowRight size={12} className="text-gray-400" />
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
              {selectedAffectation?.service?.nom}
            </span>
            {selectedAffectation && (
              <StatusBadge statut={selectedAffectation.statut} />
            )}
          </div>
        }
        avatar={
          <AvatarInitials 
            name={selectedAffectation?.stagiaire?.users?.username || '?'} 
            size="md" 
          />
        }
        sections={getDetailSections()}
        footer={getDetailFooter()}
      />

      {/* Modal Terminer */}
      {isTerminateModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setIsTerminateModalOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Terminer l'affectation</h3>
                <p className="text-sm text-gray-500">
                  {selectedAffectation?.stagiaire?.users?.username}
                </p>
              </div>
            </div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Motif de fin <span className="text-red-400">*</span>
            </label>
            <textarea
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              placeholder="Ex: Fin de stage, Mission accomplie..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 min-h-[80px] resize-y"
              rows={3}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setIsTerminateModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={handleTerminate} disabled={!motif.trim()} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Confirmer la terminaison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Annuler */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setIsCancelModalOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Annuler l'affectation</h3>
                <p className="text-sm text-gray-500">
                  {selectedAffectation?.stagiaire?.users?.username}
                </p>
              </div>
            </div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Motif d'annulation <span className="text-red-400">*</span>
            </label>
            <textarea
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              placeholder="Ex: Abandon, Réorientation..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 min-h-[80px] resize-y"
              rows={3}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setIsCancelModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={handleCancel} disabled={!motif.trim()} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Confirmer l'annulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}