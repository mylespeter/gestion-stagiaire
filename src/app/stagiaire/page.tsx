

// // app/stagiaires/page.tsx
// "use client";

// import { useState, useEffect, useMemo } from 'react';
// import { DataTable, Column } from '@/components/DataTable';
// import { DetailsModal, DetailSection } from '@/components/DetailsModal';
// import { FormModal, FormField, UploadedFile } from '@/components/FormModal';
// import { StatCard } from '@/components/ui/StatCard';
// import { supabase } from '@/lib/supabase';
// import type { StagiaireRecord, Stagiaire } from '@/types/stagiaire';
// import { 
//   UserPlus, BookOpen, Briefcase, Phone, Mail, MapPin, 
//   User, Calendar, GraduationCap, FileText, Edit, Plus, XCircle,
//   Users, UserCheck, Clock, AlertCircle
// } from 'lucide-react';

// export default function StagiairesPage() {
//   const [data, setData] = useState<StagiaireRecord[]>([]);
//   const [selectedStagiaire, setSelectedStagiaire] = useState<Stagiaire | null>(null);
//   const [isDetailsOpen, setIsDetailsOpen] = useState(false);
//   const [isCreateOpen, setIsCreateOpen] = useState(false);
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [isDocumentOpen, setIsDocumentOpen] = useState(false);
//   const [isCreating, setIsCreating] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isAddingDocument, setIsAddingDocument] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchStagiaires();
//   }, []);

//   const fetchStagiaires = async () => {
//     setLoading(true);
//     try {
//       const { data: stagiaires } = await supabase
//         .from('stagiaires')
//         .select(`
//           id, matricule, user_id,
//           users!inner(username, email, telephone, genre),
//           informations_academiques(universite, niveau_etudes),
//           stages(statut)
//         `)
//         .order('created_at', { ascending: false });

//       if (stagiaires) {
//         const formatted: StagiaireRecord[] = stagiaires.map((s: any) => ({
//           id: s.id,
//           matricule: s.matricule,
//           nom_complet: s.users?.username || '',
//           email: s.users?.email || '',
//           telephone: s.users?.telephone || '',
//           universite: s.informations_academiques?.[0]?.universite || '',
//           niveau_etudes: s.informations_academiques?.[0]?.niveau_etudes || '',
//           statut_stage: s.stages?.[0]?.statut || 'aucun'
//         }));
//         setData(formatted);
//       }
//     } catch (error) {
//       console.error('Erreur lors du chargement des stagiaires:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ============ STATISTIQUES ============
  
//   const stats = useMemo(() => {
//     const total = data.length;
//     const enCours = data.filter(s => s.statut_stage === 'en_cours').length;
//     const enAttente = data.filter(s => s.statut_stage === 'en_attente').length;
//     const sansStage = data.filter(s => s.statut_stage === 'aucun').length;
    
//     return [
//       {
//         label: 'Total Stagiaires',
//         value: total.toString(),
//         icon: <Users size={20} />,
//         trend: total > 0 ? { value: '+12%', isPositive: true } : undefined,
//       },
//       {
//         label: 'En stage',
//         value: enCours.toString(),
//         icon: <UserCheck size={20} />,
//         trend: enCours > 0 ? { value: `${Math.round((enCours / total) * 100)}%`, isPositive: true } : undefined,
//       },
//       {
//         label: 'En attente',
//         value: enAttente.toString(),
//         icon: <Clock size={20} />,
//         trend: enAttente > 0 ? { value: '3 nouveaux', isPositive: false } : undefined,
//       },
//       {
//         label: 'Sans stage',
//         value: sansStage.toString(),
//         icon: <AlertCircle size={20} />,
//         trend: sansStage > 0 ? { value: `${sansStage} à affecter`, isPositive: false } : undefined,
//       },
//     ];
//   }, [data]);

//   // ============ CHAMPS ============
  
//   const stagiaireFields: FormField[] = [
//     { name: 'username', label: 'Nom complet', type: 'text', placeholder: 'Ex: Jean Dupont', required: true, icon: <User size={14} /> },
//     { name: 'email', label: 'Email', type: 'email', placeholder: 'Ex: jean@email.com', required: true, icon: <Mail size={14} /> },
//     { name: 'password', label: 'Mot de passe', type: 'password', placeholder: 'Minimum 6 caractères', required: true, hint: 'Minimum 6 caractères' },
//     { name: 'telephone', label: 'Téléphone', type: 'tel', placeholder: 'Ex: +33 6 12 34 56 78', icon: <Phone size={14} /> },
//     { name: 'genre', label: 'Genre', type: 'select', options: [
//       { value: 'M', label: 'Masculin' }, { value: 'F', label: 'Féminin' }
//     ]},
//     { name: 'date_naissance', label: 'Date de naissance', type: 'date', span: 'half' },
//     { name: 'lieu_naissance', label: 'Lieu de naissance', type: 'text', placeholder: 'Ex: Paris', span: 'half' },
//     { name: 'nationalite', label: 'Nationalité', type: 'text', defaultValue: 'Congolaise', span: 'half' },
//     { name: 'adresse', label: 'Adresse', type: 'text', placeholder: 'Ex: 15 rue des Lilas', span: 'full' },
//     { name: 'ville', label: 'Ville', type: 'text', placeholder: 'Ex: Paris', span: 'half' },
//     { name: 'nom_urgence', label: 'Contact urgence', type: 'text', placeholder: 'Nom', span: 'half' },
//     { name: 'telephone_urgence', label: 'Tél. urgence', type: 'tel', placeholder: 'Téléphone', span: 'half' },
//     { name: 'lien_urgence', label: 'Lien', type: 'select', options: [
//       { value: 'père', label: 'Père' }, { value: 'mère', label: 'Mère' },
//       { value: 'frère', label: 'Frère' }, { value: 'soeur', label: 'Soeur' },
//       { value: 'conjoint', label: 'Conjoint(e)' }, { value: 'autre', label: 'Autre' }
//     ], span: 'half' },
//     { name: 'universite', label: 'Université', type: 'text', required: true, icon: <GraduationCap size={14} /> },
//     { name: 'faculte', label: 'Faculté', type: 'text', span: 'half' },
//     { name: 'departement', label: 'Département', type: 'text', span: 'half' },
//     { name: 'niveau_etudes', label: 'Niveau', type: 'select', required: true, options: [
//       { value: 'Licence 1', label: 'Licence 1' }, { value: 'Licence 2', label: 'Licence 2' },
//       { value: 'Licence 3', label: 'Licence 3' }, { value: 'Master 1', label: 'Master 1' },
//       { value: 'Master 2', label: 'Master 2' }, { value: 'Doctorat', label: 'Doctorat' }
//     ], span: 'half' },
//     { name: 'domaine_etudes', label: 'Domaine', type: 'text', span: 'half' },
//     { name: 'annee_academique', label: 'Année acad.', type: 'text', placeholder: '2025-2026', span: 'half' },
//     { name: 'moyenne_generale', label: 'Moyenne /20', type: 'number', placeholder: '14.5', span: 'half', min: 0, max: 20, step: 0.01 },
//   ];

//   const stagiaireSections = [
//     {
//       title: '👤 Informations personnelles',
//       fields: ['username', 'email', 'password', 'telephone', 'genre', 'date_naissance', 'lieu_naissance', 'nationalite']
//     },
//     {
//       title: '📍 Contact & Urgence',
//       fields: ['adresse', 'ville', 'nom_urgence', 'telephone_urgence', 'lien_urgence']
//     },
//     {
//       title: '🎓 Informations académiques',
//       fields: ['universite', 'faculte', 'departement', 'niveau_etudes', 'domaine_etudes', 'annee_academique', 'moyenne_generale']
//     }
//   ];

//   const documentFields: FormField[] = [
//     { name: 'type_document', label: 'Type de document', type: 'select', required: true, options: [
//       { value: 'cv', label: 'CV' },
//       { value: 'lettre_motivation', label: 'Lettre de motivation' },
//       { value: 'attestation', label: 'Attestation' },
//       { value: 'rapport', label: 'Rapport de stage' },
//       { value: 'certificat', label: 'Certificat' },
//       { value: 'autre', label: 'Autre' }
//     ]},
//     { name: 'fichier', label: 'Document', type: 'file', required: true, accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png', maxSize: 5, hint: 'Formats PDF, Word ou images acceptés (max 5MB)' },
//   ];

//   // ============ LOAD DETAILS ============
  
//   const loadStagiaireDetails = async (stagiaireId: number) => {
//     const { data: details } = await supabase
//       .from('stagiaires')
//       .select(`*, users!inner(*), informations_academiques(*), stages(*), documents_stagiaire(*)`)
//       .eq('id', stagiaireId)
//       .single();

//     if (details) {
//       setSelectedStagiaire(details as unknown as Stagiaire);
//     }
//   };

//   const handleRowClick = async (item: StagiaireRecord) => {
//     setIsDetailsOpen(true);
//     await loadStagiaireDetails(item.id);
//   };

//   // ============ HANDLERS ============

//   const handleCreate = async (formData: Record<string, any>) => {
//     setIsCreating(true);
//     try {
//       // 1. Créer l'utilisateur
//       const { data: userData, error: userError } = await supabase
//         .from('users')
//         .insert({
//           username: formData.username,
//           email: formData.email.toLowerCase().trim(),
//           password: formData.password,
//           role: 'stagiaire',
//           genre: formData.genre || null,
//           telephone: formData.telephone || null
//         })
//         .select('id')
//         .single();
//       if (userError) throw userError;

//       // 2. Créer le stagiaire
//       const { data: stagiaireData, error: stagiaireError } = await supabase
//         .from('stagiaires')
//         .insert({
//           user_id: userData.id,
//           date_naissance: formData.date_naissance || null,
//           lieu_naissance: formData.lieu_naissance || null,
//           nationalite: formData.nationalite,
//           adresse: formData.adresse || null,
//           ville: formData.ville || null,
//           nom_urgence: formData.nom_urgence || null,
//           telephone_urgence: formData.telephone_urgence || null,
//           lien_urgence: formData.lien_urgence || null
//         })
//         .select('id')
//         .single();
//       if (stagiaireError) throw stagiaireError;

//       // 3. Créer les informations académiques
//       await supabase.from('informations_academiques').insert({
//         stagiaire_id: stagiaireData.id,
//         universite: formData.universite,
//         faculte: formData.faculte || null,
//         departement: formData.departement || null,
//         niveau_etudes: formData.niveau_etudes,
//         domaine_etudes: formData.domaine_etudes || null,
//         annee_academique: formData.annee_academique || null,
//         moyenne_generale: formData.moyenne_generale ? parseFloat(formData.moyenne_generale) : null
//       });

//       await fetchStagiaires();
//       setIsCreateOpen(false);
//     } catch (error: any) {
//       throw error;
//     } finally {
//       setIsCreating(false);
//     }
//   };

//   const handleEdit = async (formData: Record<string, any>) => {
//     if (!selectedStagiaire) return;
//     setIsEditing(true);
    
//     try {
//       // Mettre à jour l'utilisateur
//       const updateUserData: any = {
//         username: formData.username,
//         email: formData.email.toLowerCase().trim(),
//         genre: formData.genre || null,
//         telephone: formData.telephone || null
//       };
//       if (formData.password) {
//         updateUserData.password = formData.password;
//       }
//       await supabase.from('users').update(updateUserData).eq('id', selectedStagiaire.user_id);

//       // Mettre à jour le stagiaire
//       await supabase.from('stagiaires').update({
//         date_naissance: formData.date_naissance || null,
//         lieu_naissance: formData.lieu_naissance || null,
//         nationalite: formData.nationalite,
//         adresse: formData.adresse || null,
//         ville: formData.ville || null,
//         nom_urgence: formData.nom_urgence || null,
//         telephone_urgence: formData.telephone_urgence || null,
//         lien_urgence: formData.lien_urgence || null
//       }).eq('id', selectedStagiaire.id);

//       // Mettre à jour les informations académiques
//       if (selectedStagiaire.informations_academiques?.[0]) {
//         await supabase.from('informations_academiques').update({
//           universite: formData.universite,
//           faculte: formData.faculte || null,
//           departement: formData.departement || null,
//           niveau_etudes: formData.niveau_etudes,
//           domaine_etudes: formData.domaine_etudes || null,
//           annee_academique: formData.annee_academique || null,
//           moyenne_generale: formData.moyenne_generale ? parseFloat(formData.moyenne_generale) : null
//         }).eq('id', selectedStagiaire.informations_academiques[0].id);
//       }

//       await fetchStagiaires();
//       await loadStagiaireDetails(selectedStagiaire.id);
//       setIsEditOpen(false);
//     } catch (error: any) {
//       throw error;
//     } finally {
//       setIsEditing(false);
//     }
//   };

//   const handleAddDocument = async (formData: Record<string, any>, files?: UploadedFile[]) => {
//     if (!selectedStagiaire || !files || files.length === 0) {
//       throw new Error('Aucun fichier sélectionné');
//     }
    
//     setIsAddingDocument(true);

//     try {
//       const file = files[0].file!;
//       const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
//       const filePath = `stagiaires/${selectedStagiaire.id}/documents/${fileName}`;

//       const { error: uploadError } = await supabase.storage
//         .from('profiles')
//         .upload(filePath, file, {
//           cacheControl: '3600',
//           upsert: false
//         });

//       if (uploadError) {
//         console.error('Erreur upload:', uploadError);
//         throw new Error(`Erreur lors de l'upload: ${uploadError.message}`);
//       }

//       const { data: { publicUrl } } = supabase.storage
//         .from('profiles')
//         .getPublicUrl(filePath);

//       const { error: insertError } = await supabase
//         .from('documents_stagiaire')
//         .insert({
//           stagiaire_id: selectedStagiaire.id,
//           type_document: formData.type_document,
//           nom_fichier: file.name,
//           url_fichier: publicUrl,
//           taille_fichier: file.size
//         });

//       if (insertError) throw insertError;

//       await loadStagiaireDetails(selectedStagiaire.id);
//       setIsDocumentOpen(false);
//     } catch (error: any) {
//       console.error('Erreur lors de l\'ajout du document:', error);
//       throw error;
//     } finally {
//       setIsAddingDocument(false);
//     }
//   };

//   const handleDeleteDocument = async (documentId: number) => {
//     if (!confirm('Supprimer ce document ?')) return;
    
//     try {
//       await supabase.from('documents_stagiaire').delete().eq('id', documentId);
//       if (selectedStagiaire) {
//         await loadStagiaireDetails(selectedStagiaire.id);
//       }
//     } catch (error) {
//       console.error('Erreur suppression document:', error);
//     }
//   };

//   // ============ SECTIONS DÉTAILS ============
  
//   const getDetailSections = (): DetailSection[] => {
//     if (!selectedStagiaire) return [];

//     const user = selectedStagiaire.users;
//     const acad = selectedStagiaire.informations_academiques?.[0];
//     const stage = selectedStagiaire.stages?.[0];

//     const sections: DetailSection[] = [
//       {
//         title: '📋 Informations personnelles',
//         fields: [
//           { label: 'Matricule', value: selectedStagiaire.matricule, icon: <User size={14} />, span: 'half' },
//           { label: 'Nom complet', value: user?.username, span: 'half' },
//           { label: 'Email', value: user?.email, icon: <Mail size={14} />, span: 'half' },
//           { label: 'Téléphone', value: user?.telephone || 'Non renseigné', icon: <Phone size={14} />, span: 'half' },
//           { label: 'Genre', value: user?.genre === 'M' ? 'Masculin' : user?.genre === 'F' ? 'Féminin' : 'N/A', span: 'half' },
//           { label: 'Date naissance', value: selectedStagiaire.date_naissance ? new Date(selectedStagiaire.date_naissance).toLocaleDateString('fr-FR') : 'N/A', icon: <Calendar size={14} />, span: 'half' },
//           { label: 'Lieu naissance', value: selectedStagiaire.lieu_naissance || 'N/A', icon: <MapPin size={14} />, span: 'half' },
//           { label: 'Nationalité', value: selectedStagiaire.nationalite || 'N/A', span: 'half' },
//           { label: 'Adresse', value: selectedStagiaire.adresse || 'N/A', span: 'full' },
//           { label: 'Contact urgence', value: selectedStagiaire.nom_urgence ? `${selectedStagiaire.nom_urgence} (${selectedStagiaire.lien_urgence})` : 'N/A', span: 'half' },
//           { label: 'Tél. urgence', value: selectedStagiaire.telephone_urgence || 'N/A', span: 'half' },
//         ]
//       }
//     ];

//     if (acad) {
//       sections.push({
//         title: '🎓 Informations académiques',
//         fields: [
//           { label: 'Université', value: acad.universite, icon: <GraduationCap size={14} />, span: 'full' },
//           { label: 'Faculté', value: acad.faculte || 'N/A', span: 'half' },
//           { label: 'Département', value: acad.departement || 'N/A', span: 'half' },
//           { label: 'Niveau', value: acad.niveau_etudes, span: 'half' },
//           { label: 'Domaine', value: acad.domaine_etudes || 'N/A', span: 'half' },
//           { label: 'Année', value: acad.annee_academique || 'N/A', span: 'half' },
//           { label: 'Moyenne', value: acad.moyenne_generale ? `${acad.moyenne_generale}/20` : 'N/A', span: 'half' },
//         ]
//       });
//     }

//     // Stage - maintenant en lecture seule, géré par les affectations
//     if (stage) {
//       const statusLabels: Record<string, string> = {
//         'en_attente': '⏳ En attente',
//         'en_cours': '🟢 En cours',
//         'termine': '✅ Terminé',
//         'abandonne': '❌ Abandonné'
//       };

//       sections.push({
//         title: '💼 Stage (géré par les affectations)',
//         fields: [
//           { label: 'Type', value: stage.type_stage || 'N/A', icon: <Briefcase size={14} />, span: 'half' },
//           { label: 'Service', value: stage.service_accueil || 'N/A', span: 'half' },
//           { label: 'Date début', value: stage.date_debut ? new Date(stage.date_debut).toLocaleDateString('fr-FR') : 'N/A', span: 'half' },
//           { label: 'Date fin', value: stage.date_fin ? new Date(stage.date_fin).toLocaleDateString('fr-FR') : 'N/A', span: 'half' },
//           { label: 'Statut', value: statusLabels[stage.statut] || stage.statut, span: 'half' },
//           { label: 'Rapport', value: stage.rapport_depose ? '✅ Déposé' : '❌ Non déposé', span: 'half' },
//           { label: 'Thème', value: stage.theme || 'N/A', span: 'full' },
//         ]
//       });
//     } else {
//       sections.push({
//         title: '💼 Stage',
//         fields: [
//           { label: 'Statut', value: 'Aucun stage - À affecter depuis la page Affectations', span: 'full' },
//         ]
//       });
//     }

//     if (selectedStagiaire.documents_stagiaire?.length > 0) {
//       sections.push({
//         title: '📄 Documents',
//         fields: selectedStagiaire.documents_stagiaire.map(doc => ({
//           label: doc.type_document === 'cv' ? 'CV' :
//                  doc.type_document === 'lettre_motivation' ? 'Lettre motivation' :
//                  doc.type_document === 'attestation' ? 'Attestation' :
//                  doc.type_document === 'rapport' ? 'Rapport' :
//                  doc.type_document === 'certificat' ? 'Certificat' : 'Autre',
//           value: (
//             <div className="flex items-center gap-2">
//               <a href={doc.url_fichier} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline truncate">
//                 {doc.nom_fichier || 'Voir'}
//               </a>
//               <button 
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleDeleteDocument(doc.id);
//                 }}
//                 className="text-red-400 hover:text-red-600 flex-shrink-0"
//                 title="Supprimer"
//               >
//                 <XCircle size={14} />
//               </button>
//             </div>
//           ),
//           icon: <FileText size={14} />,
//           span: 'half'
//         }))
//       });
//     }

//     return sections;
//   };

//   const getEditInitialData = () => {
//     if (!selectedStagiaire) return {};
//     const user = selectedStagiaire.users;
//     const acad = selectedStagiaire.informations_academiques?.[0];
    
//     return {
//       username: user?.username || '',
//       email: user?.email || '',
//       password: '',
//       telephone: user?.telephone || '',
//       genre: user?.genre || '',
//       date_naissance: selectedStagiaire.date_naissance || '',
//       lieu_naissance: selectedStagiaire.lieu_naissance || '',
//       nationalite: selectedStagiaire.nationalite || '',
//       adresse: selectedStagiaire.adresse || '',
//       ville: selectedStagiaire.ville || '',
//       nom_urgence: selectedStagiaire.nom_urgence || '',
//       telephone_urgence: selectedStagiaire.telephone_urgence || '',
//       lien_urgence: selectedStagiaire.lien_urgence || '',
//       universite: acad?.universite || '',
//       faculte: acad?.faculte || '',
//       departement: acad?.departement || '',
//       niveau_etudes: acad?.niveau_etudes || '',
//       domaine_etudes: acad?.domaine_etudes || '',
//       annee_academique: acad?.annee_academique || '',
//       moyenne_generale: acad?.moyenne_generale || '',
//     };
//   };

//   // ============ COLONNES ============
  
//   const columns: Column<StagiaireRecord>[] = [
//     { key: 'matricule', header: 'Matricule', sortable: true, maxChars: 15 },
//     { key: 'nom_complet', header: 'Nom complet', sortable: true },
//     { key: 'email', header: 'Email', maxChars: 25 },
//     { key: 'telephone', header: 'Téléphone' },
//     { key: 'universite', header: 'Université', maxChars: 25 },
//     { key: 'niveau_etudes', header: 'Niveau', sortable: true },
//     { 
//       key: 'statut_stage', 
//       header: 'Statut', 
//       sortable: true,
//       render: (item) => {
//         const config: Record<string, { label: string; className: string }> = {
//           'en_cours': { label: 'En cours', className: 'bg-green-100 text-green-800' },
//           'en_attente': { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
//           'termine': { label: 'Terminé', className: 'bg-blue-100 text-blue-800' },
//           'abandonne': { label: 'Abandonné', className: 'bg-red-100 text-red-800' },
//           'aucun': { label: 'Aucun', className: 'bg-gray-100 text-gray-600' }
//         };
//         const c = config[item.statut_stage] || config.aucun;
//         return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${c.className}`}>{c.label}</span>;
//       }
//     }
//   ];

//   const renderHeader = () => (
//     <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-4 flex-wrap bg-white">
//       <h2 className="font-bold text-gray-900 text-lg">Gestion des Stagiaires</h2>
//       <button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors shadow-sm">
//         <UserPlus size={16} /> Nouveau stagiaire
//       </button>
//     </div>
//   );

//   const getDetailFooter = () => (
//     <div className="flex gap-2 flex-wrap">
//       <button onClick={() => { setIsDetailsOpen(false); setTimeout(() => setIsEditOpen(true), 100); }} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
//         <Edit size={14} /> Modifier
//       </button>
//       <button onClick={() => { setIsDetailsOpen(false); setTimeout(() => setIsDocumentOpen(true), 100); }} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
//         <Plus size={14} /> Document
//       </button>
//     </div>
//   );

//   return (
//     <div className="p-6 max-w-[1400px] mx-auto space-y-6">
//       {/* Cartes de statistiques */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map((stat, index) => (
//           <StatCard
//             key={index}
//             label={stat.label}
//             value={stat.value}
//             icon={stat.icon}
//             trend={stat.trend}
//             size="sm"
//           />
//         ))}
//       </div>

//       {/* Tableau des stagiaires */}
//       <DataTable
//         data={data}
//         columns={columns}
//         searchable={true}
//         searchPlaceholder="Rechercher un stagiaire..."
//         onRowClick={handleRowClick}
//         emptyMessage="Aucun stagiaire trouvé"
//         striped
//         renderHeader={renderHeader}
//         loading={loading}
//       />

//       {/* Modal Création */}
//       <FormModal
//         isOpen={isCreateOpen}
//         onClose={() => setIsCreateOpen(false)}
//         title="Nouveau Stagiaire"
//         subtitle="Créez un compte stagiaire complet"
//         fields={stagiaireFields}
//         sections={stagiaireSections}
//         onSubmit={handleCreate}
//         submitLabel="Créer le stagiaire"
//         loading={isCreating}
//         maxWidth="max-w-3xl"
//         mode="create"
//       />

//       {/* Modal Édition - Prérempli avec les données du stagiaire */}
//       <FormModal
//         isOpen={isEditOpen}
//         onClose={() => setIsEditOpen(false)}
//         title="Modifier le Stagiaire"
//         subtitle={`${selectedStagiaire?.users?.username} - ${selectedStagiaire?.matricule}`}
//         fields={stagiaireFields.map(f => 
//           f.name === 'password' 
//             ? { ...f, required: false, placeholder: 'Laisser vide pour ne pas changer', hint: 'Laissez vide pour conserver le mot de passe actuel' } 
//             : f
//         )}
//         sections={stagiaireSections}
//         onSubmit={handleEdit}
//         submitLabel="Enregistrer les modifications"
//         loading={isEditing}
//         maxWidth="max-w-3xl"
//         mode="edit"
//         initialData={getEditInitialData()} // ✅ Préremplissage avec les données du stagiaire
//       />

//       {/* Modal Document */}
//       <FormModal
//         isOpen={isDocumentOpen}
//         onClose={() => setIsDocumentOpen(false)}
//         title="Ajouter un document"
//         subtitle={selectedStagiaire?.users?.username}
//         fields={documentFields}
//         onSubmit={handleAddDocument}
//         submitLabel="Uploader le document"
//         loading={isAddingDocument}
//         maxWidth="max-w-lg"
//         mode="create"
//       />

//       {/* Modal Détails */}
//       <DetailsModal
//         isOpen={isDetailsOpen}
//         onClose={() => setIsDetailsOpen(false)}
//         title={selectedStagiaire?.users?.username || ''}
//         subtitle={
//           <div className="flex items-center gap-2">
//             <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">{selectedStagiaire?.matricule}</span>
//           </div>
//         }
//         avatar={selectedStagiaire?.users?.username?.charAt(0).toUpperCase()}
//         sections={getDetailSections()}
//         footer={getDetailFooter()}
//       />
//     </div>
//   );
// }

// app/stagiaires/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { DataTable, Column } from '@/components/DataTable';
import { DetailsModal, DetailSection } from '@/components/DetailsModal';
import { FormModal, FormField, UploadedFile } from '@/components/FormModal';
import { StatCard } from '@/components/ui/StatCard';
import { supabase } from '@/lib/supabase';
import type { StagiaireRecord, Stagiaire } from '@/types/stagiaire';
import { useAuth } from '@/context/AuthContext';
import { 
  UserPlus, BookOpen, Briefcase, Phone, Mail, MapPin, 
  User, Calendar, GraduationCap, FileText, Edit, Plus, XCircle,
  Users, UserCheck, Clock, AlertCircle, UserCog, Eye
} from 'lucide-react';

export default function StagiairesPage() {
  const { user } = useAuth();
  const [data, setData] = useState<StagiaireRecord[]>([]);
  const [selectedStagiaire, setSelectedStagiaire] = useState<Stagiaire | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDocumentOpen, setIsDocumentOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingDocument, setIsAddingDocument] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEncadreur, setIsEncadreur] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur connecté est un encadreur
    if (user?.role === 'encadreur') {
      setIsEncadreur(true);
    }
    fetchStagiaires();
  }, [user]);

  const fetchStagiaires = async () => {
    setLoading(true);
    try {
      // Si encadreur, filtrer pour ne voir que ses stagiaires
      if (user?.role === 'encadreur') {
        const { data: myStagiaires, error: affectError } = await supabase
          .from('affectations')
          .select('stagiaire_id')
          .eq('encadreur_id', user.id)
          .eq('statut', 'active');

        if (affectError) {
          console.error('Erreur récupération stagiaires encadreur:', affectError);
          setData([]);
          setLoading(false);
          return;
        }

        if (!myStagiaires || myStagiaires.length === 0) {
          setData([]);
          setLoading(false);
          return;
        }

        const stagiaireIds = myStagiaires.map(a => a.stagiaire_id);

        const { data: stagiaires, error } = await supabase
          .from('stagiaires')
          .select(`
            id, matricule, user_id,
            users!inner(username, email, telephone, genre),
            informations_academiques(universite, niveau_etudes),
            stages(statut)
          `)
          .in('id', stagiaireIds)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erreur fetchStagiaires:', error);
          setData([]);
        } else if (stagiaires) {
          const formatted: StagiaireRecord[] = stagiaires.map((s: any) => ({
            id: s.id,
            matricule: s.matricule,
            nom_complet: s.users?.username || '',
            email: s.users?.email || '',
            telephone: s.users?.telephone || '',
            universite: s.informations_academiques?.[0]?.universite || '',
            niveau_etudes: s.informations_academiques?.[0]?.niveau_etudes || '',
            statut_stage: s.stages?.[0]?.statut || 'aucun'
          }));
          setData(formatted);
        }
      } else {
        // Pour les autres rôles, récupérer tous les stagiaires
        const { data: stagiaires, error } = await supabase
          .from('stagiaires')
          .select(`
            id, matricule, user_id,
            users!inner(username, email, telephone, genre),
            informations_academiques(universite, niveau_etudes),
            stages(statut)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erreur fetchStagiaires:', error);
          setData([]);
        } else if (stagiaires) {
          const formatted: StagiaireRecord[] = stagiaires.map((s: any) => ({
            id: s.id,
            matricule: s.matricule,
            nom_complet: s.users?.username || '',
            email: s.users?.email || '',
            telephone: s.users?.telephone || '',
            universite: s.informations_academiques?.[0]?.universite || '',
            niveau_etudes: s.informations_academiques?.[0]?.niveau_etudes || '',
            statut_stage: s.stages?.[0]?.statut || 'aucun'
          }));
          setData(formatted);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des stagiaires:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============ STATISTIQUES ============
  
  const stats = useMemo(() => {
    const total = data.length;
    const enCours = data.filter(s => s.statut_stage === 'en_cours').length;
    const enAttente = data.filter(s => s.statut_stage === 'en_attente').length;
    const sansStage = data.filter(s => s.statut_stage === 'aucun').length;
    
    return [
      {
        label: isEncadreur ? 'Mes Stagiaires' : 'Total Stagiaires',
        value: total.toString(),
        icon: <Users size={20} />,
        trend: total > 0 ? { value: `${total} stagiaire${total > 1 ? 's' : ''}`, isPositive: true } : undefined,
      },
      {
        label: 'En stage',
        value: enCours.toString(),
        icon: <UserCheck size={20} />,
        trend: enCours > 0 ? { value: `${Math.round((enCours / Math.max(total, 1)) * 100)}%`, isPositive: true } : undefined,
      },
      {
        label: 'En attente',
        value: enAttente.toString(),
        icon: <Clock size={20} />,
        trend: enAttente > 0 ? { value: `${enAttente} en attente`, isPositive: false } : undefined,
      },
      {
        label: 'Sans stage',
        value: sansStage.toString(),
        icon: <AlertCircle size={20} />,
        trend: sansStage > 0 ? { value: `${sansStage} à affecter`, isPositive: false } : undefined,
      },
    ];
  }, [data, isEncadreur]);

  // ============ CHAMPS (uniquement pour non-encadreurs) ============
  
  const stagiaireFields: FormField[] = [
    { name: 'username', label: 'Nom complet', type: 'text', placeholder: 'Ex: Jean Dupont', required: true, icon: <User size={14} /> },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Ex: jean@email.com', required: true, icon: <Mail size={14} /> },
    { name: 'password', label: 'Mot de passe', type: 'password', placeholder: 'Minimum 6 caractères', required: true, hint: 'Minimum 6 caractères' },
    { name: 'telephone', label: 'Téléphone', type: 'tel', placeholder: 'Ex: +33 6 12 34 56 78', icon: <Phone size={14} /> },
    { name: 'genre', label: 'Genre', type: 'select', options: [
      { value: 'M', label: 'Masculin' }, { value: 'F', label: 'Féminin' }
    ]},
    { name: 'date_naissance', label: 'Date de naissance', type: 'date', span: 'half' },
    { name: 'lieu_naissance', label: 'Lieu de naissance', type: 'text', placeholder: 'Ex: Paris', span: 'half' },
    { name: 'nationalite', label: 'Nationalité', type: 'text', defaultValue: 'Congolaise', span: 'half' },
    { name: 'adresse', label: 'Adresse', type: 'text', placeholder: 'Ex: 15 rue des Lilas', span: 'full' },
    { name: 'ville', label: 'Ville', type: 'text', placeholder: 'Ex: Paris', span: 'half' },
    { name: 'nom_urgence', label: 'Contact urgence', type: 'text', placeholder: 'Nom', span: 'half' },
    { name: 'telephone_urgence', label: 'Tél. urgence', type: 'tel', placeholder: 'Téléphone', span: 'half' },
    { name: 'lien_urgence', label: 'Lien', type: 'select', options: [
      { value: 'père', label: 'Père' }, { value: 'mère', label: 'Mère' },
      { value: 'frère', label: 'Frère' }, { value: 'soeur', label: 'Soeur' },
      { value: 'conjoint', label: 'Conjoint(e)' }, { value: 'autre', label: 'Autre' }
    ], span: 'half' },
    { name: 'universite', label: 'Université', type: 'text', required: true, icon: <GraduationCap size={14} /> },
    { name: 'faculte', label: 'Faculté', type: 'text', span: 'half' },
    { name: 'departement', label: 'Département', type: 'text', span: 'half' },
    { name: 'niveau_etudes', label: 'Niveau', type: 'select', required: true, options: [
      { value: 'Licence 1', label: 'Licence 1' }, { value: 'Licence 2', label: 'Licence 2' },
      { value: 'Licence 3', label: 'Licence 3' }, { value: 'Master 1', label: 'Master 1' },
      { value: 'Master 2', label: 'Master 2' }, { value: 'Doctorat', label: 'Doctorat' }
    ], span: 'half' },
    { name: 'domaine_etudes', label: 'Domaine', type: 'text', span: 'half' },
    { name: 'annee_academique', label: 'Année acad.', type: 'text', placeholder: '2025-2026', span: 'half' },
    { name: 'moyenne_generale', label: 'Moyenne /20', type: 'number', placeholder: '14.5', span: 'half', min: 0, max: 20, step: 0.01 },
  ];

  const stagiaireSections = [
    {
      title: '👤 Informations personnelles',
      fields: ['username', 'email', 'password', 'telephone', 'genre', 'date_naissance', 'lieu_naissance', 'nationalite']
    },
    {
      title: '📍 Contact & Urgence',
      fields: ['adresse', 'ville', 'nom_urgence', 'telephone_urgence', 'lien_urgence']
    },
    {
      title: '🎓 Informations académiques',
      fields: ['universite', 'faculte', 'departement', 'niveau_etudes', 'domaine_etudes', 'annee_academique', 'moyenne_generale']
    }
  ];

  const documentFields: FormField[] = [
    { name: 'type_document', label: 'Type de document', type: 'select', required: true, options: [
      { value: 'cv', label: 'CV' },
      { value: 'lettre_motivation', label: 'Lettre de motivation' },
      { value: 'attestation', label: 'Attestation' },
      { value: 'rapport', label: 'Rapport de stage' },
      { value: 'certificat', label: 'Certificat' },
      { value: 'autre', label: 'Autre' }
    ]},
    { name: 'fichier', label: 'Document', type: 'file', required: true, accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png', maxSize: 5, hint: 'Formats PDF, Word ou images acceptés (max 5MB)' },
  ];

  // ============ LOAD DETAILS ============
  
  const loadStagiaireDetails = async (stagiaireId: number) => {
    const { data: details } = await supabase
      .from('stagiaires')
      .select(`
        *, 
        users!inner(*), 
        informations_academiques(*), 
        stages(*), 
        documents_stagiaire(*),
        affectations(
          id, 
          statut,
          date_debut,
          date_fin,
          encadreur:encadreur_id(id, username, email, telephone)
        )
      `)
      .eq('id', stagiaireId)
      .single();

    if (details) {
      setSelectedStagiaire(details as unknown as Stagiaire);
    }
  };

  const handleRowClick = async (item: StagiaireRecord) => {
    setIsDetailsOpen(true);
    await loadStagiaireDetails(item.id);
  };

  // ============ HANDLERS (uniquement pour non-encadreurs) ============

  const handleCreate = async (formData: Record<string, any>) => {
    if (isEncadreur) return; // Sécurité supplémentaire
    
    setIsCreating(true);
    try {
      // 1. Créer l'utilisateur
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          username: formData.username,
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          role: 'stagiaire',
          genre: formData.genre || null,
          telephone: formData.telephone || null
        })
        .select('id')
        .single();
      if (userError) throw userError;

      // 2. Créer le stagiaire
      const { data: stagiaireData, error: stagiaireError } = await supabase
        .from('stagiaires')
        .insert({
          user_id: userData.id,
          date_naissance: formData.date_naissance || null,
          lieu_naissance: formData.lieu_naissance || null,
          nationalite: formData.nationalite,
          adresse: formData.adresse || null,
          ville: formData.ville || null,
          nom_urgence: formData.nom_urgence || null,
          telephone_urgence: formData.telephone_urgence || null,
          lien_urgence: formData.lien_urgence || null
        })
        .select('id')
        .single();
      if (stagiaireError) throw stagiaireError;

      // 3. Créer les informations académiques
      await supabase.from('informations_academiques').insert({
        stagiaire_id: stagiaireData.id,
        universite: formData.universite,
        faculte: formData.faculte || null,
        departement: formData.departement || null,
        niveau_etudes: formData.niveau_etudes,
        domaine_etudes: formData.domaine_etudes || null,
        annee_academique: formData.annee_academique || null,
        moyenne_generale: formData.moyenne_generale ? parseFloat(formData.moyenne_generale) : null
      });

      await fetchStagiaires();
      setIsCreateOpen(false);
    } catch (error: any) {
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = async (formData: Record<string, any>) => {
    if (isEncadreur || !selectedStagiaire) return; // Sécurité supplémentaire
    
    setIsEditing(true);
    
    try {
      // Mettre à jour l'utilisateur
      const updateUserData: any = {
        username: formData.username,
        email: formData.email.toLowerCase().trim(),
        genre: formData.genre || null,
        telephone: formData.telephone || null
      };
      if (formData.password) {
        updateUserData.password = formData.password;
      }
      await supabase.from('users').update(updateUserData).eq('id', selectedStagiaire.user_id);

      // Mettre à jour le stagiaire
      await supabase.from('stagiaires').update({
        date_naissance: formData.date_naissance || null,
        lieu_naissance: formData.lieu_naissance || null,
        nationalite: formData.nationalite,
        adresse: formData.adresse || null,
        ville: formData.ville || null,
        nom_urgence: formData.nom_urgence || null,
        telephone_urgence: formData.telephone_urgence || null,
        lien_urgence: formData.lien_urgence || null
      }).eq('id', selectedStagiaire.id);

      // Mettre à jour les informations académiques
      if (selectedStagiaire.informations_academiques?.[0]) {
        await supabase.from('informations_academiques').update({
          universite: formData.universite,
          faculte: formData.faculte || null,
          departement: formData.departement || null,
          niveau_etudes: formData.niveau_etudes,
          domaine_etudes: formData.domaine_etudes || null,
          annee_academique: formData.annee_academique || null,
          moyenne_generale: formData.moyenne_generale ? parseFloat(formData.moyenne_generale) : null
        }).eq('id', selectedStagiaire.informations_academiques[0].id);
      }

      await fetchStagiaires();
      await loadStagiaireDetails(selectedStagiaire.id);
      setIsEditOpen(false);
    } catch (error: any) {
      throw error;
    } finally {
      setIsEditing(false);
    }
  };

  const handleAddDocument = async (formData: Record<string, any>, files?: UploadedFile[]) => {
    if (!selectedStagiaire || !files || files.length === 0) {
      throw new Error('Aucun fichier sélectionné');
    }
    
    setIsAddingDocument(true);

    try {
      const file = files[0].file!;
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      const filePath = `stagiaires/${selectedStagiaire.id}/documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Erreur upload:', uploadError);
        throw new Error(`Erreur lors de l'upload: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('documents_stagiaire')
        .insert({
          stagiaire_id: selectedStagiaire.id,
          type_document: formData.type_document,
          nom_fichier: file.name,
          url_fichier: publicUrl,
          taille_fichier: file.size
        });

      if (insertError) throw insertError;

      await loadStagiaireDetails(selectedStagiaire.id);
      setIsDocumentOpen(false);
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du document:', error);
      throw error;
    } finally {
      setIsAddingDocument(false);
    }
  };

  const handleDeleteDocument = async (documentId: number) => {
    if (isEncadreur) return; // Les encadreurs ne peuvent pas supprimer de documents
    if (!confirm('Supprimer ce document ?')) return;
    
    try {
      await supabase.from('documents_stagiaire').delete().eq('id', documentId);
      if (selectedStagiaire) {
        await loadStagiaireDetails(selectedStagiaire.id);
      }
    } catch (error) {
      console.error('Erreur suppression document:', error);
    }
  };

  // ============ SECTIONS DÉTAILS ============
  
  const getDetailSections = (): DetailSection[] => {
    if (!selectedStagiaire) return [];

    const userData = selectedStagiaire.users;
    const acad = selectedStagiaire.informations_academiques?.[0];
    const stage = selectedStagiaire.stages?.[0];
    const affectation = selectedStagiaire.affectations?.[0];

    const sections: DetailSection[] = [
      {
        title: '📋 Informations personnelles',
        fields: [
          { label: 'Matricule', value: selectedStagiaire.matricule, icon: <User size={14} />, span: 'half' },
          { label: 'Nom complet', value: userData?.username, span: 'half' },
          { label: 'Email', value: userData?.email, icon: <Mail size={14} />, span: 'half' },
          { label: 'Téléphone', value: userData?.telephone || 'Non renseigné', icon: <Phone size={14} />, span: 'half' },
          { label: 'Genre', value: userData?.genre === 'M' ? 'Masculin' : userData?.genre === 'F' ? 'Féminin' : 'N/A', span: 'half' },
          { label: 'Date naissance', value: selectedStagiaire.date_naissance ? new Date(selectedStagiaire.date_naissance).toLocaleDateString('fr-FR') : 'N/A', icon: <Calendar size={14} />, span: 'half' },
          { label: 'Lieu naissance', value: selectedStagiaire.lieu_naissance || 'N/A', icon: <MapPin size={14} />, span: 'half' },
          { label: 'Nationalité', value: selectedStagiaire.nationalite || 'N/A', span: 'half' },
          { label: 'Adresse', value: selectedStagiaire.adresse || 'N/A', span: 'full' },
          { label: 'Contact urgence', value: selectedStagiaire.nom_urgence ? `${selectedStagiaire.nom_urgence} (${selectedStagiaire.lien_urgence})` : 'N/A', span: 'half' },
          { label: 'Tél. urgence', value: selectedStagiaire.telephone_urgence || 'N/A', span: 'half' },
        ]
      }
    ];

    // Section Encadreur (si affectation active) - Visible par tous
    if (affectation?.encadreur && affectation.statut === 'active') {
      sections.push({
        title: '👨‍🏫 Encadreur actuel',
        fields: [
          { label: 'Nom', value: affectation.encadreur.username, icon: <UserCog size={14} />, span: 'half' },
          { label: 'Email', value: affectation.encadreur.email, icon: <Mail size={14} />, span: 'half' },
          { label: 'Téléphone', value: affectation.encadreur.telephone || 'N/A', icon: <Phone size={14} />, span: 'half' },
          { label: 'Date début', value: affectation.date_debut ? new Date(affectation.date_debut).toLocaleDateString('fr-FR') : 'N/A', icon: <Calendar size={14} />, span: 'half' },
        ]
      });
    }

    if (acad) {
      sections.push({
        title: '🎓 Informations académiques',
        fields: [
          { label: 'Université', value: acad.universite, icon: <GraduationCap size={14} />, span: 'full' },
          { label: 'Faculté', value: acad.faculte || 'N/A', span: 'half' },
          { label: 'Département', value: acad.departement || 'N/A', span: 'half' },
          { label: 'Niveau', value: acad.niveau_etudes, span: 'half' },
          { label: 'Domaine', value: acad.domaine_etudes || 'N/A', span: 'half' },
          { label: 'Année', value: acad.annee_academique || 'N/A', span: 'half' },
          { label: 'Moyenne', value: acad.moyenne_generale ? `${acad.moyenne_generale}/20` : 'N/A', span: 'half' },
        ]
      });
    }

    // Stage - maintenant en lecture seule, géré par les affectations
    if (stage) {
      const statusLabels: Record<string, string> = {
        'en_attente': '⏳ En attente',
        'en_cours': '🟢 En cours',
        'termine': '✅ Terminé',
        'abandonne': '❌ Abandonné'
      };

      sections.push({
        title: '💼 Stage',
        fields: [
          { label: 'Type', value: stage.type_stage || 'N/A', icon: <Briefcase size={14} />, span: 'half' },
          { label: 'Service', value: stage.service_accueil || 'N/A', span: 'half' },
          { label: 'Date début', value: stage.date_debut ? new Date(stage.date_debut).toLocaleDateString('fr-FR') : 'N/A', span: 'half' },
          { label: 'Date fin', value: stage.date_fin ? new Date(stage.date_fin).toLocaleDateString('fr-FR') : 'N/A', span: 'half' },
          { label: 'Statut', value: statusLabels[stage.statut] || stage.statut, span: 'half' },
          { label: 'Rapport', value: stage.rapport_depose ? '✅ Déposé' : '❌ Non déposé', span: 'half' },
          { label: 'Thème', value: stage.theme || 'N/A', span: 'full' },
        ]
      });
    } else {
      sections.push({
        title: '💼 Stage',
        fields: [
          { label: 'Statut', value: 'Aucun stage', span: 'full' },
        ]
      });
    }

    // Documents - visibles par tous, mais suppression uniquement pour non-encadreurs
    if (selectedStagiaire.documents_stagiaire?.length > 0) {
      sections.push({
        title: '📄 Documents',
        fields: selectedStagiaire.documents_stagiaire.map(doc => ({
          label: doc.type_document === 'cv' ? 'CV' :
                 doc.type_document === 'lettre_motivation' ? 'Lettre motivation' :
                 doc.type_document === 'attestation' ? 'Attestation' :
                 doc.type_document === 'rapport' ? 'Rapport' :
                 doc.type_document === 'certificat' ? 'Certificat' : 'Autre',
          value: (
            <div className="flex items-center gap-2">
              <a href={doc.url_fichier} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline truncate">
                {doc.nom_fichier || 'Voir'}
              </a>
              {!isEncadreur && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteDocument(doc.id);
                  }}
                  className="text-red-400 hover:text-red-600 flex-shrink-0"
                  title="Supprimer"
                >
                  <XCircle size={14} />
                </button>
              )}
            </div>
          ),
          icon: <FileText size={14} />,
          span: 'half'
        }))
      });
    }

    return sections;
  };

  const getEditInitialData = () => {
    if (!selectedStagiaire) return {};
    const userData = selectedStagiaire.users;
    const acad = selectedStagiaire.informations_academiques?.[0];
    
    return {
      username: userData?.username || '',
      email: userData?.email || '',
      password: '',
      telephone: userData?.telephone || '',
      genre: userData?.genre || '',
      date_naissance: selectedStagiaire.date_naissance || '',
      lieu_naissance: selectedStagiaire.lieu_naissance || '',
      nationalite: selectedStagiaire.nationalite || '',
      adresse: selectedStagiaire.adresse || '',
      ville: selectedStagiaire.ville || '',
      nom_urgence: selectedStagiaire.nom_urgence || '',
      telephone_urgence: selectedStagiaire.telephone_urgence || '',
      lien_urgence: selectedStagiaire.lien_urgence || '',
      universite: acad?.universite || '',
      faculte: acad?.faculte || '',
      departement: acad?.departement || '',
      niveau_etudes: acad?.niveau_etudes || '',
      domaine_etudes: acad?.domaine_etudes || '',
      annee_academique: acad?.annee_academique || '',
      moyenne_generale: acad?.moyenne_generale || '',
    };
  };

  // ============ COLONNES ============
  
  const columns: Column<StagiaireRecord>[] = [
    { key: 'matricule', header: 'Matricule', sortable: true, maxChars: 15 },
    { key: 'nom_complet', header: 'Nom complet', sortable: true },
    { key: 'email', header: 'Email', maxChars: 25 },
    { key: 'telephone', header: 'Téléphone' },
    { key: 'universite', header: 'Université', maxChars: 25 },
    { key: 'niveau_etudes', header: 'Niveau', sortable: true },
    { 
      key: 'statut_stage', 
      header: 'Statut', 
      sortable: true,
      render: (item) => {
        const config: Record<string, { label: string; className: string }> = {
          'en_cours': { label: 'En cours', className: 'bg-green-100 text-green-800' },
          'en_attente': { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
          'termine': { label: 'Terminé', className: 'bg-blue-100 text-blue-800' },
          'abandonne': { label: 'Abandonné', className: 'bg-red-100 text-red-800' },
          'aucun': { label: 'Aucun', className: 'bg-gray-100 text-gray-600' }
        };
        const c = config[item.statut_stage] || config.aucun;
        return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${c.className}`}>{c.label}</span>;
      }
    }
  ];

  const renderHeader = () => (
    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-4 flex-wrap bg-white">
      <div>
        <h2 className="font-bold text-gray-900 text-lg">
          {isEncadreur ? 'Mes Stagiaires' : 'Gestion des Stagiaires'}
        </h2>
        {isEncadreur && (
          <p className="text-sm text-gray-500 mt-0.5">
            Consultation des stagiaires sous votre encadrement
          </p>
        )}
      </div>
      {/* Bouton de création uniquement pour les non-encadreurs */}
      {!isEncadreur && (
        <button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors shadow-sm">
          <UserPlus size={16} /> Nouveau stagiaire
        </button>
      )}
    </div>
  );

  // Footer des détails - adapté selon le rôle
  const getDetailFooter = () => {
    if (isEncadreur) {
      // Les encadreurs ne peuvent que voir les détails et documents
      return (
        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={() => { setIsDetailsOpen(false); setTimeout(() => setIsDocumentOpen(true), 100); }} 
            className="flex items-center gap-1.5 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Eye size={14} /> Voir documents
          </button>
        </div>
      );
    }

    // Pour les autres rôles (admin, coordinateur)
    return (
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => { setIsDetailsOpen(false); setTimeout(() => setIsEditOpen(true), 100); }} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Edit size={14} /> Modifier
        </button>
        <button onClick={() => { setIsDetailsOpen(false); setTimeout(() => setIsDocumentOpen(true), 100); }} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
          <Plus size={14} /> Document
        </button>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      {/* Message d'information pour les encadreurs */}
      {isEncadreur && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Eye size={16} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-800">Mode consultation</h3>
            <p className="text-sm text-blue-600 mt-0.5">
              Vous êtes en lecture seule. Vous pouvez consulter les informations de vos stagiaires mais pas les modifier.
            </p>
          </div>
        </div>
      )}

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            size="sm"
          />
        ))}
      </div>

      {/* Tableau des stagiaires */}
      <DataTable
        data={data}
        columns={columns}
        searchable={true}
        searchPlaceholder="Rechercher un stagiaire..."
        onRowClick={handleRowClick}
        emptyMessage={isEncadreur ? "Aucun stagiaire ne vous est assigné pour le moment" : "Aucun stagiaire trouvé"}
        striped
        renderHeader={renderHeader}
        loading={loading}
      />

      {/* Modal Création (uniquement pour non-encadreurs) */}
      {!isEncadreur && (
        <FormModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Nouveau Stagiaire"
          subtitle="Créez un compte stagiaire complet"
          fields={stagiaireFields}
          sections={stagiaireSections}
          onSubmit={handleCreate}
          submitLabel="Créer le stagiaire"
          loading={isCreating}
          maxWidth="max-w-3xl"
          mode="create"
        />
      )}

      {/* Modal Édition (uniquement pour non-encadreurs) */}
      {!isEncadreur && (
        <FormModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          title="Modifier le Stagiaire"
          subtitle={`${selectedStagiaire?.users?.username} - ${selectedStagiaire?.matricule}`}
          fields={stagiaireFields.map(f => 
            f.name === 'password' 
              ? { ...f, required: false, placeholder: 'Laisser vide pour ne pas changer', hint: 'Laissez vide pour conserver le mot de passe actuel' } 
              : f
          )}
          sections={stagiaireSections}
          onSubmit={handleEdit}
          submitLabel="Enregistrer les modifications"
          loading={isEditing}
          maxWidth="max-w-3xl"
          mode="edit"
          initialData={getEditInitialData()}
        />
      )}

      {/* Modal Document (accessible à tous pour voir/ajouter) */}
      <FormModal
        isOpen={isDocumentOpen}
        onClose={() => setIsDocumentOpen(false)}
        title={isEncadreur ? "Consulter les documents" : "Ajouter un document"}
        subtitle={selectedStagiaire?.users?.username}
        fields={isEncadreur ? [] : documentFields}
        onSubmit={isEncadreur ? async () => {} : handleAddDocument}
        submitLabel={isEncadreur ? "Fermer" : "Uploader le document"}
        loading={isAddingDocument}
        maxWidth="max-w-lg"
        mode="create"
      />

      {/* Modal Détails */}
      <DetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={selectedStagiaire?.users?.username || ''}
        subtitle={
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">{selectedStagiaire?.matricule}</span>
          </div>
        }
        avatar={selectedStagiaire?.users?.username?.charAt(0).toUpperCase()}
        sections={getDetailSections()}
        footer={getDetailFooter()}
      />
    </div>
  );
}