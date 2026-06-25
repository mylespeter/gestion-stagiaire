// // app/gestion/notes-finales/page.tsx
// "use client";

// import { useState, useEffect, useMemo } from 'react';
// import { supabase } from '@/lib/supabase';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import { DataTable, Column } from '@/components/DataTable';
// import { DetailsModal, DetailSection } from '@/components/DetailsModal';
// import { FormModal, FormField } from '@/components/FormModal';
// import { StatCard } from '@/components/ui/StatCard';
// import { 
//   Eye, Download, Star, FileText, User, Building2, 
//   Calendar, Mail, Phone, BookOpen, AlertCircle,
//   CheckCircle, Clock, XCircle, GraduationCap,
//   RefreshCw, Search, Edit, Award, Trophy,
//   TrendingUp, TrendingDown, Minus, Users, FileCheck,
//   ClipboardCheck, UserCheck, AlertTriangle, Layers,
//   CheckSquare, Square, Plus, Trash2
// } from 'lucide-react';

// // Types
// interface GrilleEvaluation {
//   id: number;
//   nom: string;
//   description: string;
//   categorie: string;
//   poids: number;
//   ordre: number;
//   est_active: boolean;
//   criteres?: CritereEvaluation[];
// }

// interface CritereEvaluation {
//   id: number;
//   grille_id: number;
//   nom: string;
//   description: string;
//   note_max: number;
//   ordre: number;
// }

// interface NoteFinale {
//   id: number;
//   stagiaire_id: number;
//   encadreur_id: number;
//   stage_id: string;
//   grille_id: number;
//   note_globale: number;
//   commentaire_global: string | null;
//   date_evaluation: string;
//   statut: string;
//   created_at: string;
//   updated_at: string;
//   stagiaire?: {
//     id: number;
//     matricule: string;
//     nom: string;
//     prenom: string;
//     email: string;
//   };
//   encadreur?: {
//     id: number;
//     nom: string;
//     prenom: string;
//     email: string;
//   };
//   grille?: GrilleEvaluation;
//   notes_criteres?: {
//     id: number;
//     critere_id: number;
//     note: number;
//     commentaire: string | null;
//     critere?: CritereEvaluation;
//   }[];
// }

// interface StagiaireAvecStage {
//   id: number;
//   matricule: string;
//   nom: string;
//   prenom: string;
//   email: string;
//   stage_id: string;
//   service_accueil: string;
//   theme: string;
//   rapport_depose: boolean;
//   date_depot_rapport: string | null;
//   note_existante: boolean;
//   note_finale_id?: number;
//   note_globale?: number;
// }

// export default function NotesFinalesPage() {
//   const router = useRouter();
//   const { user, isAuthenticated, loading: authLoading } = useAuth();

//   const [stagiaires, setStagiaires] = useState<StagiaireAvecStage[]>([]);
//   const [notes, setNotes] = useState<NoteFinale[]>([]);
//   const [grilles, setGrilles] = useState<GrilleEvaluation[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedStagiaire, setSelectedStagiaire] = useState<StagiaireAvecStage | null>(null);
//   const [selectedNote, setSelectedNote] = useState<NoteFinale | null>(null);
//   const [isDetailsOpen, setIsDetailsOpen] = useState(false);
//   const [isNotationOpen, setIsNotationOpen] = useState(false);
//   const [isEditNotationOpen, setIsEditNotationOpen] = useState(false);
//   const [notationLoading, setNotationLoading] = useState(false);
//   const [notationSuccess, setNotationSuccess] = useState('');
//   const [notationError, setNotationError] = useState('');
//   const [encadreurId, setEncadreurId] = useState<number | null>(null);
//   const [selectedGrille, setSelectedGrille] = useState<GrilleEvaluation | null>(null);
//   const [notesParCritere, setNotesParCritere] = useState<Record<number, number>>({});
//   const [commentairesParCritere, setCommentairesParCritere] = useState<Record<number, string>>({});

//   useEffect(() => {
//     if (!authLoading) {
//       if (!isAuthenticated) {
//         router.push('/login');
//         return;
//       }
//       if (user && ['admin', 'coordinateur', 'encadreur'].includes(user.role)) {
//         fetchEncadreurId();
//       } else {
//         router.push('/dashboard');
//       }
//     }
//   }, [authLoading, isAuthenticated, user]);

//   const fetchEncadreurId = async () => {
//     if (!user) return;

//     try {
//       if (user.role === 'encadreur') {
//         const { data, error } = await supabase
//           .from('encadreurs')
//           .select('id')
//           .eq('user_id', user.id)
//           .single();

//         if (error) throw error;
//         setEncadreurId(data?.id || null);
//         await fetchGrilles();
//         await fetchStagiairesAvecRapport(data?.id);
//         await fetchNotes(data?.id);
//       } else {
//         setEncadreurId(null);
//         await fetchGrilles();
//         await fetchStagiairesAvecRapport(null);
//         await fetchNotes(null);
//       }
//     } catch (error: any) {
//       console.error('Erreur:', error);
//       setError(error.message || 'Erreur lors du chargement');
//       setLoading(false);
//     }
//   };

//   const fetchGrilles = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('grilles_evaluation')
//         .select(`
//           *,
//           criteres:criteres_evaluation(*)
//         `)
//         .eq('est_active', true)
//         .order('ordre');

//       if (error) throw error;
//       setGrilles(data || []);
//     } catch (error: any) {
//       console.error('Erreur chargement grilles:', error);
//     }
//   };

//   const fetchStagiairesAvecRapport = async (encadreurIdParam: number | null) => {
//     try {
//       let query = supabase
//         .from('stagiaires')
//         .select(`
//           id,
//           matricule,
//           user_id,
//           users!inner (
//             username,
//             email
//           ),
//           stages!inner (
//             id,
//             service_accueil,
//             theme,
//             rapport_depose,
//             date_depot_rapport
//           )
//         `)
//         .eq('stages.rapport_depose', true);

//       if (encadreurIdParam) {
//         const { data: affectations } = await supabase
//           .from('affectations')
//           .select('stagiaire_id')
//           .eq('encadreur_id', encadreurIdParam)
//           .eq('statut', 'active');

//         const ids = affectations?.map(a => a.stagiaire_id) || [];
//         if (ids.length === 0) {
//           setStagiaires([]);
//           return;
//         }
//         query = query.in('id', ids);
//       }

//       const { data, error } = await query;

//       if (error) throw error;

//       const transformed: StagiaireAvecStage[] = await Promise.all(
//         (data || []).map(async (item: any) => {
//           const stage = item.stages?.[0];
//           const usernameParts = (item.users?.username || '').split(' ');
          
//           // Vérifier si une note existe déjà
//           const { data: noteExistante } = await supabase
//             .from('notes_finales')
//             .select('id, note_globale')
//             .eq('stagiaire_id', item.id)
//             .eq('stage_id', stage?.id)
//             .maybeSingle();

//           return {
//             id: item.id,
//             matricule: item.matricule || '',
//             nom: usernameParts[0] || '',
//             prenom: usernameParts.slice(1).join(' ') || '',
//             email: item.users?.email || '',
//             stage_id: stage?.id,
//             service_accueil: stage?.service_accueil || '',
//             theme: stage?.theme || '',
//             rapport_depose: stage?.rapport_depose || false,
//             date_depot_rapport: stage?.date_depot_rapport || null,
//             note_existante: !!noteExistante,
//             note_finale_id: noteExistante?.id,
//             note_globale: noteExistante?.note_globale
//           };
//         })
//       );

//       setStagiaires(transformed);
//     } catch (error: any) {
//       console.error('Erreur chargement stagiaires:', error);
//     }
//   };

//   const fetchNotes = async (encadreurIdParam: number | null) => {
//     try {
//       let query = supabase
//         .from('notes_finales')
//         .select(`
//           *,
//           stagiaire:stagiaires!stagiaire_id (
//             id,
//             matricule,
//             user_id,
//             users!inner (username, email)
//           ),
//           encadreur:encadreurs!encadreur_id (
//             id,
//             user_id,
//             users!inner (username, email)
//           ),
//           grille:grilles_evaluation!grille_id (*),
//           notes_criteres:notes_criteres (
//             *,
//             critere:criteres_evaluation!critere_id (*)
//           )
//         `)
//         .order('created_at', { ascending: false });

//       if (encadreurIdParam) {
//         query = query.eq('encadreur_id', encadreurIdParam);
//       }

//       const { data, error } = await query;

//       if (error) throw error;

//       const transformed = (data || []).map((item: any) => {
//         const stagiaireUser = item.stagiaire?.users;
//         const encadreurUser = item.encadreur?.users;
        
//         return {
//           ...item,
//           stagiaire: item.stagiaire ? {
//             id: item.stagiaire.id,
//             matricule: item.stagiaire.matricule || '',
//             nom: stagiaireUser?.username?.split(' ')[0] || '',
//             prenom: stagiaireUser?.username?.split(' ').slice(1).join(' ') || '',
//             email: stagiaireUser?.email || ''
//           } : undefined,
//           encadreur: item.encadreur ? {
//             id: item.encadreur.id,
//             nom: encadreurUser?.username?.split(' ')[0] || '',
//             prenom: encadreurUser?.username?.split(' ').slice(1).join(' ') || '',
//             email: encadreurUser?.email || ''
//           } : undefined
//         };
//       });

//       setNotes(transformed);
//     } catch (error: any) {
//       console.error('Erreur chargement notes:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fonction pour ouvrir la notation
//   const handleOpenNotation = async (stagiaire: StagiaireAvecStage) => {
//     setSelectedStagiaire(stagiaire);
//     setSelectedGrille(grilles[0] || null);
//     setNotesParCritere({});
//     setCommentairesParCritere({});
//     setNotationError('');
//     setNotationSuccess('');
//     setIsNotationOpen(true);
//   };

//   // Fonction pour ouvrir la modification
//   const handleEditNotation = async (note: NoteFinale) => {
//     setSelectedNote(note);
//     setSelectedGrille(note.grille || null);
    
//     // Récupérer les notes par critère
//     const notesMap: Record<number, number> = {};
//     const commentairesMap: Record<number, string> = {};
    
//     note.notes_criteres?.forEach(nc => {
//       if (nc.critere_id) {
//         notesMap[nc.critere_id] = nc.note;
//         if (nc.commentaire) commentairesMap[nc.critere_id] = nc.commentaire;
//       }
//     });
    
//     setNotesParCritere(notesMap);
//     setCommentairesParCritere(commentairesMap);
//     setNotationError('');
//     setNotationSuccess('');
//     setIsEditNotationOpen(true);
//   };

//   // Gestion du changement de note pour un critère
//   const handleNoteChange = (critereId: number, value: number) => {
//     setNotesParCritere(prev => ({
//       ...prev,
//       [critereId]: value
//     }));
//   };

//   // Gestion du commentaire pour un critère
//   const handleCommentaireChange = (critereId: number, value: string) => {
//     setCommentairesParCritere(prev => ({
//       ...prev,
//       [critereId]: value
//     }));
//   };

//   // Calcul de la note globale
//   const calculateNoteGlobale = () => {
//     if (!selectedGrille || !selectedGrille.criteres) return 0;
    
//     const totalNotes = selectedGrille.criteres.reduce((sum, critere) => {
//       const note = notesParCritere[critere.id] || 0;
//       return sum + note;
//     }, 0);
    
//     const maxNotes = selectedGrille.criteres.length * 5;
//     return maxNotes > 0 ? (totalNotes / maxNotes) * 20 : 0; // Note sur 20
//   };

// // Soumettre la notation
// const handleSubmitNotation = async () => {
//   if (!selectedStagiaire || !selectedGrille) return;

//   setNotationLoading(true);
//   setNotationError('');

//   try {
//     // Vérifier que tous les critères sont notés
//     const criteres = selectedGrille.criteres || [];
//     const criteresNonNotes = criteres.filter(
//       c => !notesParCritere[c.id] || notesParCritere[c.id] === 0
//     );

//     if (criteresNonNotes.length > 0) {
//       throw new Error(`Veuillez noter tous les critères (${criteresNonNotes.map(c => c.nom).join(', ')})`);
//     }

//     const noteGlobale = calculateNoteGlobale();

//     // Créer la note finale
//     const { data: noteData, error: noteError } = await supabase
//       .from('notes_finales')
//       .insert({
//         stagiaire_id: selectedStagiaire.id,
//         encadreur_id: encadreurId,
//         stage_id: selectedStagiaire.stage_id,
//         grille_id: selectedGrille.id,
//         note_globale: noteGlobale,
//         date_evaluation: new Date().toISOString().split('T')[0],
//         statut: 'valide'
//       })
//       .select('id')
//       .single();

//     if (noteError) throw noteError;

//     // Créer les notes par critère
//     const notesCriteresData = criteres.map(critere => ({
//       note_finale_id: noteData.id,
//       critere_id: critere.id,
//       note: notesParCritere[critere.id] || 0,
//       commentaire: commentairesParCritere[critere.id] || null
//     }));

//     if (notesCriteresData.length > 0) {
//       const { error: notesError } = await supabase
//         .from('notes_criteres')
//         .insert(notesCriteresData);

//       if (notesError) throw notesError;
//     }

//     setNotationSuccess('Note attribuée avec succès !');
//     setTimeout(() => {
//       setIsNotationOpen(false);
//       setNotationSuccess('');
//       fetchStagiairesAvecRapport(encadreurId);
//       fetchNotes(encadreurId);
//     }, 1500);

//   } catch (error: any) {
//     console.error('Erreur:', error);
//     setNotationError(error.message || 'Erreur lors de l\'enregistrement');
//   } finally {
//     setNotationLoading(false);
//   }
// };

// // Modifier une notation existante
// const handleUpdateNotation = async () => {
//   if (!selectedNote || !selectedGrille) return;

//   setNotationLoading(true);
//   setNotationError('');

//   try {
//     const criteres = selectedGrille.criteres || [];
//     const criteresNonNotes = criteres.filter(
//       c => !notesParCritere[c.id] || notesParCritere[c.id] === 0
//     );

//     if (criteresNonNotes.length > 0) {
//       throw new Error(`Veuillez noter tous les critères (${criteresNonNotes.map(c => c.nom).join(', ')})`);
//     }

//     const noteGlobale = calculateNoteGlobale();

//     // Mettre à jour la note finale
//     const { error: noteError } = await supabase
//       .from('notes_finales')
//       .update({
//         note_globale: noteGlobale,
//         date_evaluation: new Date().toISOString().split('T')[0],
//         updated_at: new Date().toISOString()
//       })
//       .eq('id', selectedNote.id);

//     if (noteError) throw noteError;

//     // Supprimer les anciennes notes par critère
//     await supabase
//       .from('notes_criteres')
//       .delete()
//       .eq('note_finale_id', selectedNote.id);

//     // Créer les nouvelles notes par critère
//     const notesCriteresData = criteres.map(critere => ({
//       note_finale_id: selectedNote.id,
//       critere_id: critere.id,
//       note: notesParCritere[critere.id] || 0,
//       commentaire: commentairesParCritere[critere.id] || null
//     }));

//     if (notesCriteresData.length > 0) {
//       const { error: notesError } = await supabase
//         .from('notes_criteres')
//         .insert(notesCriteresData);

//       if (notesError) throw notesError;
//     }

//     setNotationSuccess('Note modifiée avec succès !');
//     setTimeout(() => {
//       setIsEditNotationOpen(false);
//       setNotationSuccess('');
//       fetchStagiairesAvecRapport(encadreurId);
//       fetchNotes(encadreurId);
//     }, 1500);

//   } catch (error: any) {
//     console.error('Erreur:', error);
//     setNotationError(error.message || 'Erreur lors de la modification');
//   } finally {
//     setNotationLoading(false);
//   }
// };

//   // Colonnes du tableau
//   const columns: Column<StagiaireAvecStage>[] = [
//     {
//       key: 'stagiaire',
//       header: 'Stagiaire',
//       sortable: true,
//       render: (item) => (
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
//             <User size={18} className="text-indigo-600" />
//           </div>
//           <div>
//             <p className="text-sm font-semibold text-gray-900">
//               {item.prenom} {item.nom}
//             </p>
//             <p className="text-xs text-gray-500">{item.matricule}</p>
//           </div>
//         </div>
//       )
//     },
//     {
//       key: 'service',
//       header: 'Service / Stage',
//       sortable: true,
//       render: (item) => (
//         <div>
//           <p className="text-sm text-gray-700">{item.service_accueil}</p>
//           <p className="text-xs text-gray-400 truncate max-w-xs">{item.theme}</p>
//         </div>
//       )
//     },
//     {
//       key: 'rapport',
//       header: 'Rapport',
//       sortable: true,
//       render: (item) => (
//         <div className="flex items-center gap-2">
//           <FileCheck size={16} className="text-emerald-500" />
//           <span className="text-sm text-gray-600">
//             {item.date_depot_rapport ? new Date(item.date_depot_rapport).toLocaleDateString('fr-FR') : 'Déposé'}
//           </span>
//         </div>
//       )
//     },
//     {
//       key: 'note',
//       header: 'Note',
//       sortable: true,
//       render: (item) => {
//         if (item.note_existante) {
//           return (
//             <div className="flex items-center gap-2">
//               <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
//                 {item.note_globale?.toFixed(1)}/20
//               </span>
//               <CheckCircle size={16} className="text-emerald-500" />
//             </div>
//           );
//         }
//         return (
//           <span className="text-xs text-gray-400 italic">Non noté</span>
//         );
//       }
//     },
//     {
//       key: 'actions',
//       header: 'Actions',
//       sortable: false,
//       width: '120px',
//       render: (item) => (
//         <div className="flex items-center gap-1">
//           {item.note_existante ? (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 const note = notes.find(n => n.id === item.note_finale_id);
//                 if (note) handleEditNotation(note);
//               }}
//               className="p-1.5 hover:bg-amber-50 rounded-lg text-gray-400 hover:text-amber-600 transition-colors"
//               title="Modifier la note"
//             >
//               <Edit size={16} />
//             </button>
//           ) : (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleOpenNotation(item);
//               }}
//               className="p-1.5 hover:bg-emerald-50 rounded-lg text-gray-400 hover:text-emerald-600 transition-colors"
//               title="Noter"
//             >
//               <Award size={16} />
//             </button>
//           )}
//         </div>
//       )
//     }
//   ];

//   // Statistiques
//   const stats = useMemo(() => {
//     const total = stagiaires.length;
//     const notesAttribuees = stagiaires.filter(s => s.note_existante).length;
//     const notesManquantes = total - notesAttribuees;
//     const moyenne = notes.length > 0 
//       ? notes.reduce((acc, n) => acc + n.note_globale, 0) / notes.length 
//       : 0;

//     return [
//       {
//         label: 'Stagiaires avec rapport',
//         value: total.toString(),
//         icon: <FileCheck size={20} />,
//         trend: total > 0 ? { value: `${total} rapport(s) déposé(s)`, isPositive: true } : undefined,
//       },
//       {
//         label: 'Notes attribuées',
//         value: notesAttribuees.toString(),
//         icon: <Award size={20} />,
//         trend: notesAttribuees > 0 ? { value: `${Math.round((notesAttribuees / Math.max(total, 1)) * 100)}%`, isPositive: true } : undefined,
//       },
//       {
//         label: 'En attente de notation',
//         value: notesManquantes.toString(),
//         icon: <Clock size={20} />,
//         trend: notesManquantes > 0 ? { value: `${notesManquantes} à noter`, isPositive: false } : undefined,
//       },
//       {
//         label: 'Moyenne générale',
//         value: moyenne > 0 ? moyenne.toFixed(1) + '/20' : 'N/A',
//         icon: <TrendingUp size={20} />,
//         trend: moyenne > 0 ? { value: 'sur 20', isPositive: true } : undefined,
//       },
//     ];
//   }, [stagiaires, notes]);

//   // Rendu du header
//   const renderHeader = () => (
//     <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-4 flex-wrap bg-white">
//       <div className="flex items-center gap-4">
//         <h2 className="font-bold text-gray-900 text-lg tracking-tight whitespace-nowrap">
//           {user?.role === 'encadreur' ? 'Mes notations' : 'Notes finales'}
//         </h2>
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Rechercher..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-64 bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
//           />
//           {searchTerm && (
//             <button onClick={() => setSearchTerm('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors">
//               <XCircle size={14} className="text-gray-400" />
//             </button>
//           )}
//         </div>
//       </div>
//       <div className="flex items-center gap-2">
//         <button onClick={() => { fetchStagiairesAvecRapport(encadreurId); fetchNotes(encadreurId); }} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm transition-colors text-gray-600 font-medium">
//           <RefreshCw size={14} />
//           <span className="hidden sm:inline">Actualiser</span>
//         </button>
//       </div>
//     </div>
//   );

//   if (authLoading || loading) {
//     return (
//       <div className="p-6 max-w-7xl mx-auto">
//         <div className="animate-pulse space-y-6">
//           <div className="h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl"></div>
//           <div className="h-96 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6 max-w-7xl mx-auto">
//         <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
//           <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
//             <AlertCircle size={36} className="text-red-500" />
//           </div>
//           <h3 className="text-xl font-bold text-gray-900 mb-2">Erreur</h3>
//           <p className="text-gray-500 mb-8 max-w-md mx-auto">{error}</p>
//           <button onClick={() => { fetchStagiairesAvecRapport(encadreurId); fetchNotes(encadreurId); }} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-sm font-semibold transition-all mx-auto">
//             <RefreshCw size={16} /> Réessayer
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const filteredStagiaires = stagiaires.filter(s => {
//     if (!searchTerm) return true;
//     const searchLower = searchTerm.toLowerCase();
//     return (
//       s.prenom.toLowerCase().includes(searchLower) ||
//       s.nom.toLowerCase().includes(searchLower) ||
//       s.matricule.toLowerCase().includes(searchLower) ||
//       s.service_accueil.toLowerCase().includes(searchLower)
//     );
//   });

//   return (
//     <div className="p-6 max-w-7xl mx-auto space-y-6">
//       {/* En-tête */}
//       <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm">
//         <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full -mr-20 -mt-20" />
//         <div className="relative p-6">
//           <div className="flex items-start justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">
//                 {user?.role === 'encadreur' ? 'Mes notations' : 'Gestion des notes finales'}
//               </h1>
//               <p className="text-sm text-gray-500 mt-1.5">
//                 {user?.role === 'encadreur'
//                   ? 'Attribuez des notes aux rapports de vos stagiaires'
//                   : 'Consultez toutes les notes attribuées'
//                 }
//               </p>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
//                 {grilles.length} grilles disponibles
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Statistiques */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map((stat, index) => (
//           <StatCard key={index} {...stat} size="sm" />
//         ))}
//       </div>

//       {/* Tableau */}
//       <DataTable
//         data={filteredStagiaires}
//         columns={columns}
//         renderHeader={renderHeader}
//         selectable={false}
//         defaultRowsPerPage={15}
//         rowsPerPageOptions={[10, 15, 25, 50]}
//         emptyMessage="Aucun stagiaire n'a déposé de rapport"
//         minWidth="800px"
//       />

//       {/* Modal de Notation */}
//       {isNotationOpen && selectedStagiaire && selectedGrille && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
//             <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   Notation - {selectedStagiaire.prenom} {selectedStagiaire.nom}
//                 </h3>
//                 <p className="text-sm text-gray-500">
//                   {selectedStagiaire.service_accueil} - {selectedGrille.nom}
//                 </p>
//               </div>
//               <div className="flex items-center gap-3">
//                 <div className="text-center">
//                   <p className="text-2xl font-bold text-indigo-600">
//                     {calculateNoteGlobale().toFixed(1)}
//                   </p>
//                   <p className="text-xs text-gray-500">/20</p>
//                 </div>
//                 <button onClick={() => setIsNotationOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                   <XCircle size={20} className="text-gray-400" />
//                 </button>
//               </div>
//             </div>

//             <div className="flex-1 overflow-y-auto p-6 space-y-4">
//               {notationError && (
//                 <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
//                   <AlertCircle size={18} className="text-red-500" />
//                   <p className="text-sm text-red-700">{notationError}</p>
//                 </div>
//               )}
//               {notationSuccess && (
//                 <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
//                   <CheckCircle size={18} className="text-emerald-500" />
//                   <p className="text-sm text-emerald-700">{notationSuccess}</p>
//                 </div>
//               )}

//               <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
//                 <p className="text-sm font-medium text-gray-700 mb-2">Grille : {selectedGrille.nom}</p>
//                 <p className="text-xs text-gray-500">{selectedGrille.description}</p>
//               </div>

//               {selectedGrille.criteres?.map((critere) => (
//                 <div key={critere.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-200 transition-colors">
//                   <div className="flex items-start gap-4">
//                     <div className="flex-1">
//                       <p className="text-sm font-medium text-gray-900">{critere.nom}</p>
//                       <p className="text-xs text-gray-500">{critere.description}</p>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <select
//                         value={notesParCritere[critere.id] || 0}
//                         onChange={(e) => handleNoteChange(critere.id, parseInt(e.target.value))}
//                         className="w-16 px-2 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
//                       >
//                         {[0, 1, 2, 3, 4, 5].map(n => (
//                           <option key={n} value={n}>{n}</option>
//                         ))}
//                       </select>
//                       <input
//                         type="text"
//                         placeholder="Commentaire..."
//                         value={commentairesParCritere[critere.id] || ''}
//                         onChange={(e) => handleCommentaireChange(critere.id, e.target.value)}
//                         className="w-40 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
//               <button
//                 onClick={() => setIsNotationOpen(false)}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 Annuler
//               </button>
//               <button
//                 onClick={handleSubmitNotation}
//                 disabled={notationLoading}
//                 className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-semibold transition-colors disabled:opacity-50"
//               >
//                 {notationLoading ? (
//                   <>
//                     <RefreshCw size={16} className="animate-spin" />
//                     Enregistrement...
//                   </>
//                 ) : (
//                   <>
//                     <Award size={16} />
//                     Attribuer la note
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal de Modification */}
//       {isEditNotationOpen && selectedNote && selectedGrille && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
//             <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   Modifier la note - {selectedNote.stagiaire?.prenom} {selectedNote.stagiaire?.nom}
//                 </h3>
//                 <p className="text-sm text-gray-500">
//                   {selectedGrille.nom}
//                 </p>
//               </div>
//               <div className="flex items-center gap-3">
//                 <div className="text-center">
//                   <p className="text-2xl font-bold text-amber-600">
//                     {calculateNoteGlobale().toFixed(1)}
//                   </p>
//                   <p className="text-xs text-gray-500">/20</p>
//                 </div>
//                 <button onClick={() => setIsEditNotationOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                   <XCircle size={20} className="text-gray-400" />
//                 </button>
//               </div>
//             </div>

//             <div className="flex-1 overflow-y-auto p-6 space-y-4">
//               {notationError && (
//                 <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
//                   <AlertCircle size={18} className="text-red-500" />
//                   <p className="text-sm text-red-700">{notationError}</p>
//                 </div>
//               )}
//               {notationSuccess && (
//                 <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
//                   <CheckCircle size={18} className="text-emerald-500" />
//                   <p className="text-sm text-emerald-700">{notationSuccess}</p>
//                 </div>
//               )}

//               <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
//                 <p className="text-sm font-medium text-gray-700 mb-2">Grille : {selectedGrille.nom}</p>
//                 <p className="text-xs text-gray-500">{selectedGrille.description}</p>
//               </div>

//               {selectedGrille.criteres?.map((critere) => (
//                 <div key={critere.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-amber-200 transition-colors">
//                   <div className="flex items-start gap-4">
//                     <div className="flex-1">
//                       <p className="text-sm font-medium text-gray-900">{critere.nom}</p>
//                       <p className="text-xs text-gray-500">{critere.description}</p>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <select
//                         value={notesParCritere[critere.id] || 0}
//                         onChange={(e) => handleNoteChange(critere.id, parseInt(e.target.value))}
//                         className="w-16 px-2 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
//                       >
//                         {[0, 1, 2, 3, 4, 5].map(n => (
//                           <option key={n} value={n}>{n}</option>
//                         ))}
//                       </select>
//                       <input
//                         type="text"
//                         placeholder="Commentaire..."
//                         value={commentairesParCritere[critere.id] || ''}
//                         onChange={(e) => handleCommentaireChange(critere.id, e.target.value)}
//                         className="w-40 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
//               <button
//                 onClick={() => setIsEditNotationOpen(false)}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 Annuler
//               </button>
//               <button
//                 onClick={handleUpdateNotation}
//                 disabled={notationLoading}
//                 className="flex items-center gap-2 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-semibold transition-colors disabled:opacity-50"
//               >
//                 {notationLoading ? (
//                   <>
//                     <RefreshCw size={16} className="animate-spin" />
//                     Enregistrement...
//                   </>
//                 ) : (
//                   <>
//                     <Edit size={16} />
//                     Modifier la note
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// app/gestion/notes-finales/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DataTable, Column } from '@/components/DataTable';
import { StatCard } from '@/components/ui/StatCard';
import { 
  User, Building2, Calendar, AlertCircle,
  CheckCircle, Clock, XCircle, RefreshCw, 
  Search, Edit, Award, TrendingUp, Users,
  FileCheck, UserCheck, AlertTriangle
} from 'lucide-react';

// Types
interface GrilleEvaluation {
  id: number;
  nom: string;
  description: string;
  categorie: string;
  poids: number;
  ordre: number;
  est_active: boolean;
  criteres?: CritereEvaluation[];
}

interface CritereEvaluation {
  id: number;
  grille_id: number;
  nom: string;
  description: string;
  note_max: number;
  ordre: number;
}

interface NoteFinale {
  id: number;
  stagiaire_id: number;
  encadreur_id: number;
  stage_id: number;
  grille_id: number;
  note_globale: number;
  commentaire_global: string | null;
  date_evaluation: string;
  statut: string;
  created_at: string;
  updated_at: string;
  stagiaire?: {
    id: number;
    matricule: string;
    nom: string;
    prenom: string;
    email: string;
  };
  encadreur?: {
    id: number;
    username: string;
    email: string;
  };
  grille?: GrilleEvaluation;
  notes_criteres?: {
    id: number;
    critere_id: number;
    note: number;
    commentaire: string | null;
    critere?: CritereEvaluation;
  }[];
}

interface StagiaireAvecStage {
  id: number;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  stage_id: number;
  service_accueil: string;
  theme: string;
  rapport_depose: boolean;
  date_depot_rapport: string | null;
  note_existante: boolean;
  note_finale_id?: number;
  note_globale?: number;
}

export default function NotesFinalesPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [stagiaires, setStagiaires] = useState<StagiaireAvecStage[]>([]);
  const [notes, setNotes] = useState<NoteFinale[]>([]);
  const [grilles, setGrilles] = useState<GrilleEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStagiaire, setSelectedStagiaire] = useState<StagiaireAvecStage | null>(null);
  const [selectedNote, setSelectedNote] = useState<NoteFinale | null>(null);
  const [isNotationOpen, setIsNotationOpen] = useState(false);
  const [isEditNotationOpen, setIsEditNotationOpen] = useState(false);
  const [notationLoading, setNotationLoading] = useState(false);
  const [notationSuccess, setNotationSuccess] = useState('');
  const [notationError, setNotationError] = useState('');
  const [encadreurId, setEncadreurId] = useState<number | null>(null);
  const [selectedGrille, setSelectedGrille] = useState<GrilleEvaluation | null>(null);
  const [notesParCritere, setNotesParCritere] = useState<Record<number, number>>({});
  const [commentairesParCritere, setCommentairesParCritere] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      if (user && ['admin', 'coordinateur', 'encadreur'].includes(user.role)) {
        fetchEncadreurId();
      } else {
        router.push('/dashboard');
      }
    }
  }, [authLoading, isAuthenticated, user]);

  const fetchEncadreurId = async () => {
    if (!user) return;

    try {
      if (user.role === 'encadreur') {
        // user.id est déjà l'ID dans la table users
        const encadreurIdNumber = typeof user.id === 'string' ? parseInt(user.id) : user.id;
        setEncadreurId(encadreurIdNumber);
        
        await fetchGrilles();
        await fetchStagiairesAvecRapport(encadreurIdNumber);
        await fetchNotes(encadreurIdNumber);
      } else {
        setEncadreurId(null);
        await fetchGrilles();
        await fetchStagiairesAvecRapport(null);
        await fetchNotes(null);
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      setError(error.message || 'Erreur lors du chargement');
      setLoading(false);
    }
  };

  const fetchGrilles = async () => {
    try {
      const { data, error } = await supabase
        .from('grilles_evaluation')
        .select(`
          *,
          criteres:criteres_evaluation(*)
        `)
        .eq('est_active', true)
        .order('ordre');

      if (error) throw error;
      setGrilles(data || []);
    } catch (error: any) {
      console.error('Erreur chargement grilles:', error);
    }
  };

  const fetchStagiairesAvecRapport = async (encadreurIdParam: number | null) => {
    try {
      let query = supabase
        .from('stagiaires')
        .select(`
          id,
          matricule,
          user_id,
          users!inner (
            username,
            email
          ),
          stages!inner (
            id,
            service_accueil,
            theme,
            rapport_depose,
            date_depot_rapport
          )
        `)
        .eq('stages.rapport_depose', true);

      if (encadreurIdParam) {
        const { data: affectations } = await supabase
          .from('affectations')
          .select('stagiaire_id')
          .eq('encadreur_id', encadreurIdParam)
          .eq('statut', 'active');

        const ids = affectations?.map(a => a.stagiaire_id) || [];
        if (ids.length === 0) {
          setStagiaires([]);
          return;
        }
        query = query.in('id', ids);
      }

      const { data, error } = await query;

      if (error) throw error;

      const transformed: StagiaireAvecStage[] = await Promise.all(
        (data || []).map(async (item: any) => {
          const stage = item.stages?.[0];
          const usernameParts = (item.users?.username || '').split(' ');
          
          const { data: noteExistante } = await supabase
            .from('notes_finales')
            .select('id, note_globale')
            .eq('stagiaire_id', item.id)
            .eq('stage_id', stage?.id)
            .maybeSingle();

          return {
            id: item.id,
            matricule: item.matricule || '',
            nom: usernameParts[0] || '',
            prenom: usernameParts.slice(1).join(' ') || '',
            email: item.users?.email || '',
            stage_id: stage?.id,
            service_accueil: stage?.service_accueil || '',
            theme: stage?.theme || '',
            rapport_depose: stage?.rapport_depose || false,
            date_depot_rapport: stage?.date_depot_rapport || null,
            note_existante: !!noteExistante,
            note_finale_id: noteExistante?.id,
            note_globale: noteExistante?.note_globale
          };
        })
      );

      setStagiaires(transformed);
    } catch (error: any) {
      console.error('Erreur chargement stagiaires:', error);
    }
  };

  const fetchNotes = async (encadreurIdParam: number | null) => {
    try {
      let query = supabase
        .from('notes_finales')
        .select(`
          *,
          stagiaire:stagiaires!stagiaire_id (
            id,
            matricule,
            user_id,
            users!inner (username, email)
          ),
          encadreur:users!encadreur_id (
            id,
            username,
            email
          ),
          grille:grilles_evaluation!grille_id (*),
          notes_criteres:notes_criteres (
            *,
            critere:criteres_evaluation!critere_id (*)
          )
        `)
        .order('created_at', { ascending: false });

      if (encadreurIdParam) {
        query = query.eq('encadreur_id', encadreurIdParam);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erreur Supabase fetchNotes:', error);
        throw error;
      }

      const transformed = (data || []).map((item: any) => {
        const stagiaireUser = item.stagiaire?.users;
        const encadreurUser = item.encadreur;
        
        return {
          ...item,
          stagiaire: item.stagiaire ? {
            id: item.stagiaire.id,
            matricule: item.stagiaire.matricule || '',
            nom: stagiaireUser?.username?.split(' ')[0] || '',
            prenom: stagiaireUser?.username?.split(' ').slice(1).join(' ') || '',
            email: stagiaireUser?.email || ''
          } : undefined,
          encadreur: item.encadreur ? {
            id: encadreurUser.id,
            username: encadreurUser.username || '',
            email: encadreurUser.email || ''
          } : undefined
        };
      });

      setNotes(transformed);
    } catch (error: any) {
      console.error('Erreur chargement notes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour ouvrir la notation
  const handleOpenNotation = async (stagiaire: StagiaireAvecStage) => {
    setSelectedStagiaire(stagiaire);
    setSelectedGrille(grilles[0] || null);
    setNotesParCritere({});
    setCommentairesParCritere({});
    setNotationError('');
    setNotationSuccess('');
    setIsNotationOpen(true);
  };

  // Fonction pour ouvrir la modification
  const handleEditNotation = async (note: NoteFinale) => {
    setSelectedNote(note);
    setSelectedGrille(note.grille || null);
    
    const notesMap: Record<number, number> = {};
    const commentairesMap: Record<number, string> = {};
    
    note.notes_criteres?.forEach(nc => {
      if (nc.critere_id) {
        notesMap[nc.critere_id] = nc.note;
        if (nc.commentaire) commentairesMap[nc.critere_id] = nc.commentaire;
      }
    });
    
    setNotesParCritere(notesMap);
    setCommentairesParCritere(commentairesMap);
    setNotationError('');
    setNotationSuccess('');
    setIsEditNotationOpen(true);
  };

  const handleNoteChange = (critereId: number, value: number) => {
    setNotesParCritere(prev => ({
      ...prev,
      [critereId]: value
    }));
  };

  const handleCommentaireChange = (critereId: number, value: string) => {
    setCommentairesParCritere(prev => ({
      ...prev,
      [critereId]: value
    }));
  };

  const calculateNoteGlobale = () => {
    if (!selectedGrille || !selectedGrille.criteres) return 0;
    
    const totalNotes = selectedGrille.criteres.reduce((sum, critere) => {
      const note = notesParCritere[critere.id] || 0;
      return sum + note;
    }, 0);
    
    const maxNotes = selectedGrille.criteres.length * 5;
    return maxNotes > 0 ? (totalNotes / maxNotes) * 20 : 0;
  };

  const handleSubmitNotation = async () => {
    if (!selectedStagiaire || !selectedGrille) return;

    setNotationLoading(true);
    setNotationError('');

    try {
      const criteres = selectedGrille.criteres || [];
      const criteresNonNotes = criteres.filter(
        c => !notesParCritere[c.id] || notesParCritere[c.id] === 0
      );

      if (criteresNonNotes.length > 0) {
        throw new Error(`Veuillez noter tous les critères (${criteresNonNotes.map(c => c.nom).join(', ')})`);
      }

      const noteGlobale = calculateNoteGlobale();

      const { data: noteData, error: noteError } = await supabase
        .from('notes_finales')
        .insert({
          stagiaire_id: selectedStagiaire.id,
          encadreur_id: encadreurId,
          stage_id: selectedStagiaire.stage_id,
          grille_id: selectedGrille.id,
          note_globale: noteGlobale,
          date_evaluation: new Date().toISOString().split('T')[0],
          statut: 'valide'
        })
        .select('id')
        .single();

      if (noteError) throw noteError;

      const notesCriteresData = criteres.map(critere => ({
        note_finale_id: noteData.id,
        critere_id: critere.id,
        note: notesParCritere[critere.id] || 0,
        commentaire: commentairesParCritere[critere.id] || null
      }));

      if (notesCriteresData.length > 0) {
        const { error: notesError } = await supabase
          .from('notes_criteres')
          .insert(notesCriteresData);

        if (notesError) throw notesError;
      }

      setNotationSuccess('Note attribuée avec succès !');
      setTimeout(() => {
        setIsNotationOpen(false);
        setNotationSuccess('');
        fetchStagiairesAvecRapport(encadreurId);
        fetchNotes(encadreurId);
      }, 1500);

    } catch (error: any) {
      console.error('Erreur:', error);
      setNotationError(error.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setNotationLoading(false);
    }
  };

  const handleUpdateNotation = async () => {
    if (!selectedNote || !selectedGrille) return;

    setNotationLoading(true);
    setNotationError('');

    try {
      const criteres = selectedGrille.criteres || [];
      const criteresNonNotes = criteres.filter(
        c => !notesParCritere[c.id] || notesParCritere[c.id] === 0
      );

      if (criteresNonNotes.length > 0) {
        throw new Error(`Veuillez noter tous les critères (${criteresNonNotes.map(c => c.nom).join(', ')})`);
      }

      const noteGlobale = calculateNoteGlobale();

      const { error: noteError } = await supabase
        .from('notes_finales')
        .update({
          note_globale: noteGlobale,
          date_evaluation: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedNote.id);

      if (noteError) throw noteError;

      await supabase
        .from('notes_criteres')
        .delete()
        .eq('note_finale_id', selectedNote.id);

      const notesCriteresData = criteres.map(critere => ({
        note_finale_id: selectedNote.id,
        critere_id: critere.id,
        note: notesParCritere[critere.id] || 0,
        commentaire: commentairesParCritere[critere.id] || null
      }));

      if (notesCriteresData.length > 0) {
        const { error: notesError } = await supabase
          .from('notes_criteres')
          .insert(notesCriteresData);

        if (notesError) throw notesError;
      }

      setNotationSuccess('Note modifiée avec succès !');
      setTimeout(() => {
        setIsEditNotationOpen(false);
        setNotationSuccess('');
        fetchStagiairesAvecRapport(encadreurId);
        fetchNotes(encadreurId);
      }, 1500);

    } catch (error: any) {
      console.error('Erreur:', error);
      setNotationError(error.message || 'Erreur lors de la modification');
    } finally {
      setNotationLoading(false);
    }
  };

  const columns: Column<StagiaireAvecStage>[] = [
    {
      key: 'stagiaire',
      header: 'Stagiaire',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <User size={18} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {item.prenom} {item.nom}
            </p>
            <p className="text-xs text-gray-500">{item.matricule}</p>
          </div>
        </div>
      )
    },
    {
      key: 'service',
      header: 'Service / Stage',
      sortable: true,
      render: (item) => (
        <div>
          <p className="text-sm text-gray-700">{item.service_accueil}</p>
          <p className="text-xs text-gray-400 truncate max-w-xs">{item.theme}</p>
        </div>
      )
    },
    {
      key: 'rapport',
      header: 'Rapport',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          <FileCheck size={16} className="text-emerald-500" />
          <span className="text-sm text-gray-600">
            {item.date_depot_rapport ? new Date(item.date_depot_rapport).toLocaleDateString('fr-FR') : 'Déposé'}
          </span>
        </div>
      )
    },
    {
      key: 'note',
      header: 'Note',
      sortable: true,
      render: (item) => {
        if (item.note_existante) {
          return (
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                {item.note_globale?.toFixed(1)}/20
              </span>
              <CheckCircle size={16} className="text-emerald-500" />
            </div>
          );
        }
        return (
          <span className="text-xs text-gray-400 italic">Non noté</span>
        );
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      width: '120px',
      render: (item) => (
        <div className="flex items-center gap-1">
          {item.note_existante ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const note = notes.find(n => n.id === item.note_finale_id);
                if (note) handleEditNotation(note);
              }}
              className="p-1.5 hover:bg-amber-50 rounded-lg text-gray-400 hover:text-amber-600 transition-colors"
              title="Modifier la note"
            >
              <Edit size={16} />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenNotation(item);
              }}
              className="p-1.5 hover:bg-emerald-50 rounded-lg text-gray-400 hover:text-emerald-600 transition-colors"
              title="Noter"
            >
              <Award size={16} />
            </button>
          )}
        </div>
      )
    }
  ];

  const stats = useMemo(() => {
    const total = stagiaires.length;
    const notesAttribuees = stagiaires.filter(s => s.note_existante).length;
    const notesManquantes = total - notesAttribuees;
    const moyenne = notes.length > 0 
      ? notes.reduce((acc, n) => acc + n.note_globale, 0) / notes.length 
      : 0;

    return [
      {
        label: 'Stagiaires avec rapport',
        value: total.toString(),
        icon: <FileCheck size={20} />,
        trend: total > 0 ? { value: `${total} rapport(s) déposé(s)`, isPositive: true } : undefined,
      },
      {
        label: 'Notes attribuées',
        value: notesAttribuees.toString(),
        icon: <Award size={20} />,
        trend: notesAttribuees > 0 ? { value: `${Math.round((notesAttribuees / Math.max(total, 1)) * 100)}%`, isPositive: true } : undefined,
      },
      {
        label: 'En attente de notation',
        value: notesManquantes.toString(),
        icon: <Clock size={20} />,
        trend: notesManquantes > 0 ? { value: `${notesManquantes} à noter`, isPositive: false } : undefined,
      },
      {
        label: 'Moyenne générale',
        value: moyenne > 0 ? moyenne.toFixed(1) + '/20' : 'N/A',
        icon: <TrendingUp size={20} />,
        trend: moyenne > 0 ? { value: 'sur 20', isPositive: true } : undefined,
      },
    ];
  }, [stagiaires, notes]);

  const renderHeader = () => (
    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-4 flex-wrap bg-white">
      <div className="flex items-center gap-4">
        <h2 className="font-bold text-gray-900 text-lg tracking-tight whitespace-nowrap">
          {user?.role === 'encadreur' ? 'Mes notations' : 'Notes finales'}
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors">
              <XCircle size={14} className="text-gray-400" />
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => { fetchStagiairesAvecRapport(encadreurId); fetchNotes(encadreurId); }} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm transition-colors text-gray-600 font-medium">
          <RefreshCw size={14} />
          <span className="hidden sm:inline">Actualiser</span>
        </button>
      </div>
    </div>
  );

  if (authLoading || loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl"></div>
          <div className="h-96 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle size={36} className="text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Erreur</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">{error}</p>
          <button onClick={() => { fetchStagiairesAvecRapport(encadreurId); fetchNotes(encadreurId); }} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-sm font-semibold transition-all mx-auto">
            <RefreshCw size={16} /> Réessayer
          </button>
        </div>
      </div>
    );
  }

  const filteredStagiaires = stagiaires.filter(s => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      s.prenom.toLowerCase().includes(searchLower) ||
      s.nom.toLowerCase().includes(searchLower) ||
      s.matricule.toLowerCase().includes(searchLower) ||
      s.service_accueil.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full -mr-20 -mt-20" />
        <div className="relative p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.role === 'encadreur' ? 'Mes notations' : 'Gestion des notes finales'}
              </h1>
              <p className="text-sm text-gray-500 mt-1.5">
                {user?.role === 'encadreur'
                  ? 'Attribuez des notes aux rapports de vos stagiaires'
                  : 'Consultez toutes les notes attribuées'
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                {grilles.length} grilles disponibles
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} size="sm" />
        ))}
      </div>

      {/* Tableau */}
      <DataTable
        data={filteredStagiaires}
        columns={columns}
        renderHeader={renderHeader}
        selectable={false}
        defaultRowsPerPage={15}
        rowsPerPageOptions={[10, 15, 25, 50]}
        emptyMessage="Aucun stagiaire n'a déposé de rapport"
        minWidth="800px"
      />

      {/* Modal de Notation */}
      {isNotationOpen && selectedStagiaire && selectedGrille && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Notation - {selectedStagiaire.prenom} {selectedStagiaire.nom}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedStagiaire.service_accueil} - {selectedGrille.nom}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">
                    {calculateNoteGlobale().toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500">/20</p>
                </div>
                <button onClick={() => setIsNotationOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <XCircle size={20} className="text-gray-400" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {notationError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                  <AlertCircle size={18} className="text-red-500" />
                  <p className="text-sm text-red-700">{notationError}</p>
                </div>
              )}
              {notationSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                  <CheckCircle size={18} className="text-emerald-500" />
                  <p className="text-sm text-emerald-700">{notationSuccess}</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Grille : {selectedGrille.nom}</p>
                <p className="text-xs text-gray-500">{selectedGrille.description}</p>
              </div>

              {selectedGrille.criteres?.map((critere) => (
                <div key={critere.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-200 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{critere.nom}</p>
                      <p className="text-xs text-gray-500">{critere.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={notesParCritere[critere.id] || 0}
                        onChange={(e) => handleNoteChange(critere.id, parseInt(e.target.value))}
                        className="w-16 px-2 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                      >
                        {[0, 1, 2, 3, 4, 5].map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Commentaire..."
                        value={commentairesParCritere[critere.id] || ''}
                        onChange={(e) => handleCommentaireChange(critere.id, e.target.value)}
                        className="w-40 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setIsNotationOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmitNotation}
                disabled={notationLoading}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {notationLoading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Award size={16} />
                    Attribuer la note
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Modification */}
      {isEditNotationOpen && selectedNote && selectedGrille && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Modifier la note - {selectedNote.stagiaire?.prenom} {selectedNote.stagiaire?.nom}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedGrille.nom}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-600">
                    {calculateNoteGlobale().toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500">/20</p>
                </div>
                <button onClick={() => setIsEditNotationOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <XCircle size={20} className="text-gray-400" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {notationError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                  <AlertCircle size={18} className="text-red-500" />
                  <p className="text-sm text-red-700">{notationError}</p>
                </div>
              )}
              {notationSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                  <CheckCircle size={18} className="text-emerald-500" />
                  <p className="text-sm text-emerald-700">{notationSuccess}</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Grille : {selectedGrille.nom}</p>
                <p className="text-xs text-gray-500">{selectedGrille.description}</p>
              </div>

              {selectedGrille.criteres?.map((critere) => (
                <div key={critere.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-amber-200 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{critere.nom}</p>
                      <p className="text-xs text-gray-500">{critere.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={notesParCritere[critere.id] || 0}
                        onChange={(e) => handleNoteChange(critere.id, parseInt(e.target.value))}
                        className="w-16 px-2 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                      >
                        {[0, 1, 2, 3, 4, 5].map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Commentaire..."
                        value={commentairesParCritere[critere.id] || ''}
                        onChange={(e) => handleCommentaireChange(critere.id, e.target.value)}
                        className="w-40 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setIsEditNotationOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleUpdateNotation}
                disabled={notationLoading}
                className="flex items-center gap-2 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {notationLoading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Edit size={16} />
                    Modifier la note
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}