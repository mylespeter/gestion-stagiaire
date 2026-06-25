// // // // app/attestations/page.tsx
// // // "use client";

// // // import { useState, useEffect, useMemo } from 'react';
// // // import { DataTable, Column } from '@/components/DataTable';
// // // import { FormModal, FormField, UploadedFile } from '@/components/FormModal';
// // // import { DetailsModal, DetailSection } from '@/components/DetailsModal';
// // // import { StatCard } from '@/components/ui/StatCard';
// // // import { supabase } from '@/lib/supabase';
// // // import { 
// // //   Award, User, Calendar, Download, Eye,
// // //   FileText, Plus
// // // } from 'lucide-react';

// // // interface AttestationRecord {
// // //   id: number;
// // //   stagiaire: string;
// // //   matricule: string;
// // //   type: string;
// // //   date: string;
// // //   fichier: string;
// // // }

// // // export default function AttestationsPage() {
// // //   const [data, setData] = useState<AttestationRecord[]>([]);
// // //   const [selected, setSelected] = useState<any>(null);
// // //   const [isDetailsOpen, setIsDetailsOpen] = useState(false);
// // //   const [isCreateOpen, setIsCreateOpen] = useState(false);
// // //   const [isLoading, setIsLoading] = useState(false);
// // //   const [isGenerating, setIsGenerating] = useState(false);
// // //   const [stagiaires, setStagiaires] = useState<any[]>([]);

// // //   useEffect(() => {
// // //     fetchAttestations();
// // //     fetchStagiaires();
// // //   }, []);

// // //   const fetchAttestations = async () => {
// // //     setIsLoading(true);
// // //     try {
// // //       const { data } = await supabase
// // //         .from('attestations')
// // //         .select(`
// // //           *,
// // //           stagiaire:stagiaire_id(matricule, users!inner(username))
// // //         `)
// // //         .order('created_at', { ascending: false });

// // //       if (data) {
// // //         setData(data.map((a: any) => ({
// // //           id: a.id,
// // //           stagiaire: a.stagiaire?.users?.username || 'N/A',
// // //           matricule: a.stagiaire?.matricule || 'N/A',
// // //           type: a.type,
// // //           date: new Date(a.date_emission).toLocaleDateString('fr-FR'),
// // //           fichier: a.fichier_url || ''
// // //         })));
// // //       }
// // //     } catch (error) {
// // //       console.error('Erreur:', error);
// // //     } finally {
// // //       setIsLoading(false);
// // //     }
// // //   };

// // //   const fetchStagiaires = async () => {
// // //     const { data } = await supabase
// // //       .from('stagiaires')
// // //       .select('id, matricule, users!inner(username)');
// // //     if (data) setStagiaires(data);
// // //   };

// // //   const loadDetails = async (id: number) => {
// // //     const { data } = await supabase
// // //       .from('attestations')
// // //       .select(`*, stagiaire:stagiaire_id(matricule, users!inner(username, email))`)
// // //       .eq('id', id)
// // //       .single();
// // //     if (data) setSelected(data);
// // //   };

// // //   const stats = useMemo(() => {
// // //     const total = data.length;
// // //     const stages = data.filter(a => a.type === 'stage').length;
// // //     const travaux = data.filter(a => a.type === 'travail').length;
// // //     const formations = data.filter(a => a.type === 'formation').length;

// // //     return [
// // //       { label: 'Total Attestations', value: String(total), icon: <Award size={20} /> },
// // //       { label: 'Attestations Stage', value: String(stages), icon: <FileText size={20} /> },
// // //       { label: 'Attestations Travail', value: String(travaux), icon: <FileText size={20} /> },
// // //       { label: 'Attestations Formation', value: String(formations), icon: <FileText size={20} /> },
// // //     ];
// // //   }, [data]);

// // //   const handleGenerate = async (formData: Record<string, any>, files?: UploadedFile[]) => {
// // //     setIsGenerating(true);
// // //     try {
// // //       const stagiaire = stagiaires.find(s => s.id === parseInt(formData.stagiaire_id));
      
// // //       // Générer un contenu simple d'attestation
// // //       const attestationContent = `
// // // ATTESTATION DE ${formData.type.toUpperCase()}
// // // -------------------------------------------

// // // Je soussigné, Directeur des Ressources Humaines, certifie que :

// // // ${stagiaire?.users?.username} (Matricule: ${stagiaire?.matricule})

// // // a effectué un stage de type "${formData.type}" au sein de notre organisation.

// // // Date d'émission: ${new Date().toLocaleDateString('fr-FR')}

// // // Signature
// // //       `.trim();

// // //       // Créer un blob et l'uploader
// // //       const blob = new Blob([attestationContent], { type: 'text/plain' });
// // //       const file = new File([blob], `attestation-${Date.now()}.txt`, { type: 'text/plain' });
// // //       const fileName = `attestations/${stagiaire?.id}/${Date.now()}-attestation.txt`;

// // //       const { error: uploadError } = await supabase.storage
// // //         .from('documents')
// // //         .upload(fileName, file);

// // //       if (uploadError) throw uploadError;

// // //       const { data: { publicUrl } } = supabase.storage
// // //         .from('documents')
// // //         .getPublicUrl(fileName);

// // //       const { error } = await supabase
// // //         .from('attestations')
// // //         .insert({
// // //           stagiaire_id: parseInt(formData.stagiaire_id),
// // //           type: formData.type,
// // //           fichier_url: publicUrl,
// // //           date_emission: new Date().toISOString().split('T')[0]
// // //         });

// // //       if (error) throw error;
// // //       await fetchAttestations();
// // //       setIsCreateOpen(false);
// // //     } catch (error) {
// // //       console.error('Erreur génération:', error);
// // //       throw error;
// // //     } finally {
// // //       setIsGenerating(false);
// // //     }
// // //   };

// // //   const attestationFields: FormField[] = [
// // //     {
// // //       name: 'stagiaire_id',
// // //       label: 'Stagiaire',
// // //       type: 'select',
// // //       required: true,
// // //       options: stagiaires.map(s => ({ value: String(s.id), label: `${s.users?.username} (${s.matricule})` })),
// // //       icon: <User size={14} />,
// // //     },
// // //     {
// // //       name: 'type',
// // //       label: 'Type d\'attestation',
// // //       type: 'select',
// // //       required: true,
// // //       options: [
// // //         { value: 'stage', label: 'Attestation de stage' },
// // //         { value: 'travail', label: 'Attestation de travail' },
// // //         { value: 'formation', label: 'Attestation de formation' },
// // //       ],
// // //     },
// // //   ];

// // //   const getDetailSections = (): DetailSection[] => {
// // //     if (!selected) return [];
// // //     return [{
// // //       title: '📄 Détails de l\'attestation',
// // //       fields: [
// // //         { label: 'Stagiaire', value: selected.stagiaire?.users?.username, icon: <User size={14} />, span: 'half' },
// // //         { label: 'Matricule', value: selected.stagiaire?.matricule, span: 'half' },
// // //         { label: 'Type', value: selected.type, span: 'half' },
// // //         { label: 'Date d\'émission', value: new Date(selected.date_emission).toLocaleDateString('fr-FR'), icon: <Calendar size={14} />, span: 'half' },
// // //         { 
// // //           label: 'Fichier', 
// // //           value: selected.fichier_url ? (
// // //             <a href={selected.fichier_url} target="_blank" className="text-indigo-600 hover:underline">Télécharger</a>
// // //           ) : 'N/A',
// // //           span: 'full' 
// // //         },
// // //       ]
// // //     }];
// // //   };

// // //   const columns: Column<AttestationRecord>[] = [
// // //     { key: 'stagiaire', header: 'Stagiaire', sortable: true },
// // //     { key: 'matricule', header: 'Matricule' },
// // //     { 
// // //       key: 'type', 
// // //       header: 'Type',
// // //       render: (item) => {
// // //         const labels: Record<string, string> = { stage: 'Stage', travail: 'Travail', formation: 'Formation' };
// // //         return <span className="capitalize">{labels[item.type] || item.type}</span>;
// // //       }
// // //     },
// // //     { key: 'date', header: 'Date d\'émission', sortable: true },
// // //     {
// // //       key: 'fichier',
// // //       header: 'Fichier',
// // //       render: (item) => item.fichier ? (
// // //         <a href={item.fichier} target="_blank" className="text-indigo-600 hover:underline flex items-center gap-1">
// // //           <Download size={14} /> Télécharger
// // //         </a>
// // //       ) : <span className="text-gray-400">-</span>
// // //     },
// // //   ];

// // //   return (
// // //     <div className="p-6 max-w-[1400px] mx-auto space-y-6">
// // //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
// // //         {stats.map((stat, i) => (
// // //           <StatCard key={i} {...stat} size="sm" />
// // //         ))}
// // //       </div>

// // //       <DataTable
// // //         data={data}
// // //         columns={columns}
// // //         searchable
// // //         searchPlaceholder="Rechercher une attestation..."
// // //         onRowClick={(item) => { loadDetails(item.id); setIsDetailsOpen(true); }}
// // //         emptyMessage="Aucune attestation trouvée"
// // //         striped
// // //         loading={isLoading}
// // //         renderHeader={() => (
// // //           <div className="px-6 py-4 border-b flex items-center justify-between bg-white">
// // //             <h2 className="font-bold text-gray-900 text-lg">Attestations</h2>
// // //             <button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
// // //               <Plus size={16} /> Générer une attestation
// // //             </button>
// // //           </div>
// // //         )}
// // //       />

// // //       <FormModal
// // //         isOpen={isCreateOpen}
// // //         onClose={() => setIsCreateOpen(false)}
// // //         title="Générer une Attestation"
// // //         subtitle="Sélectionnez le stagiaire et le type d'attestation"
// // //         fields={attestationFields}
// // //         onSubmit={handleGenerate}
// // //         submitLabel="Générer"
// // //         loading={isGenerating}
// // //         maxWidth="max-w-lg"
// // //         mode="create"
// // //       />

// // //       <DetailsModal
// // //         isOpen={isDetailsOpen}
// // //         onClose={() => setIsDetailsOpen(false)}
// // //         title={selected?.stagiaire?.users?.username || 'Détails'}
// // //         subtitle={selected?.stagiaire?.matricule}
// // //         sections={getDetailSections()}
// // //         footer={
// // //           selected?.fichier_url ? (
// // //             <a href={selected.fichier_url} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
// // //               <Eye size={14} /> Voir l'attestation
// // //             </a>
// // //           ) : undefined
// // //         }
// // //       />
// // //     </div>
// // //   );
// // // }

// // // app/attestations/page.tsx
// // "use client";

// // import { useState, useEffect, useMemo } from 'react';
// // import { DataTable, Column } from '@/components/DataTable';
// // import { FormModal, FormField, UploadedFile } from '@/components/FormModal';
// // import { DetailsModal, DetailSection } from '@/components/DetailsModal';
// // import { StatCard } from '@/components/ui/StatCard';
// // import { supabase } from '@/lib/supabase';
// // import { jsPDF } from 'jspdf';
// // import { 
// //   Award, User, Calendar, Download, Eye,
// //   FileText, Plus, Loader
// // } from 'lucide-react';

// // interface AttestationRecord {
// //   id: number;
// //   stagiaire: string;
// //   matricule: string;
// //   type: string;
// //   date: string;
// //   fichier: string;
// // }

// // export default function AttestationsPage() {
// //   const [data, setData] = useState<AttestationRecord[]>([]);
// //   const [selected, setSelected] = useState<any>(null);
// //   const [isDetailsOpen, setIsDetailsOpen] = useState(false);
// //   const [isCreateOpen, setIsCreateOpen] = useState(false);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [isGenerating, setIsGenerating] = useState(false);
// //   const [stagiaires, setStagiaires] = useState<any[]>([]);

// //   useEffect(() => {
// //     fetchAttestations();
// //     fetchStagiaires();
// //   }, []);

// //   const fetchAttestations = async () => {
// //     setIsLoading(true);
// //     try {
// //       const { data } = await supabase
// //         .from('attestations')
// //         .select(`
// //           *,
// //           stagiaire:stagiaire_id(matricule, users!inner(username))
// //         `)
// //         .order('created_at', { ascending: false });

// //       if (data) {
// //         setData(data.map((a: any) => ({
// //           id: a.id,
// //           stagiaire: a.stagiaire?.users?.username || 'N/A',
// //           matricule: a.stagiaire?.matricule || 'N/A',
// //           type: a.type,
// //           date: new Date(a.date_emission).toLocaleDateString('fr-FR'),
// //           fichier: a.fichier_url || ''
// //         })));
// //       }
// //     } catch (error) {
// //       console.error('Erreur:', error);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const fetchStagiaires = async () => {
// //     const { data } = await supabase
// //       .from('stagiaires')
// //       .select('id, matricule, users!inner(username)');
// //     if (data) setStagiaires(data);
// //   };

// //   const loadDetails = async (id: number) => {
// //     const { data } = await supabase
// //       .from('attestations')
// //       .select(`*, stagiaire:stagiaire_id(matricule, users!inner(username, email))`)
// //       .eq('id', id)
// //       .single();
// //     if (data) setSelected(data);
// //   };

// //   const stats = useMemo(() => {
// //     const total = data.length;
// //     const stages = data.filter(a => a.type === 'stage').length;
// //     const travaux = data.filter(a => a.type === 'travail').length;
// //     const formations = data.filter(a => a.type === 'formation').length;

// //     return [
// //       { label: 'Total Attestations', value: String(total), icon: <Award size={20} /> },
// //       { label: 'Attestations Stage', value: String(stages), icon: <FileText size={20} /> },
// //       { label: 'Attestations Travail', value: String(travaux), icon: <FileText size={20} /> },
// //       { label: 'Attestations Formation', value: String(formations), icon: <FileText size={20} /> },
// //     ];
// //   }, [data]);

// //   const generateAttestationPDF = async (formData: Record<string, any>): Promise<Blob> => {
// //     const stagiaire = stagiaires.find(s => s.id === parseInt(formData.stagiaire_id));
// //     const doc = new jsPDF('p', 'mm', 'a4');
    
// //     // Dimensions
// //     const pageWidth = doc.internal.pageSize.getWidth();
// //     const pageHeight = doc.internal.pageSize.getHeight();
// //     const margin = 20;

// //     // Fond de page (bordure décorative)
// //     doc.setDrawColor(41, 98, 255); // Bleu indigo
// //     doc.setLineWidth(1.5);
// //     doc.rect(margin - 5, margin - 5, pageWidth - (margin - 5) * 2, pageHeight - (margin - 5) * 2, 'S');
// //     doc.setDrawColor(200, 200, 200);
// //     doc.setLineWidth(0.5);
// //     doc.rect(margin - 2, margin - 2, pageWidth - (margin - 2) * 2, pageHeight - (margin - 2) * 2, 'S');

// //     // Logo et en-tête
// //     const logoWidth = 30;
// //     const logoHeight = 30;
// //     let logoX = margin + 10;
// //     let logoY = margin + 10;

// //     try {
// //       // Charger le logo
// //       const logoResponse = await fetch('/logo.png');
// //       if (logoResponse.ok) {
// //         const logoBlob = await logoResponse.blob();
// //         const logoBase64 = await blobToBase64(logoBlob);
// //         doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
// //       }
// //     } catch (error) {
// //       console.warn('Logo non trouvé, utilisation du texte');
// //     }

// //     // Nom de l'entreprise à côté du logo
// //     doc.setTextColor(41, 98, 255);
// //     doc.setFont('helvetica', 'bold');
// //     doc.setFontSize(24);
// //     doc.text('MERDIE COMPANY', logoX + logoWidth + 10, logoY + 12);
    
// //     doc.setTextColor(100, 100, 100);
// //     doc.setFontSize(10);
// //     doc.setFont('helvetica', 'normal');
// //     doc.text('Solutions Innovantes pour Demain', logoX + logoWidth + 10, logoY + 20);
// //     doc.text('RC: SN-DKR-2024-B-12345 | NINEA: 001234567', logoX + logoWidth + 10, logoY + 27);

// //     // Ligne de séparation
// //     doc.setDrawColor(41, 98, 255);
// //     doc.setLineWidth(0.5);
// //     doc.line(margin, logoY + logoHeight + 5, pageWidth - margin, logoY + logoHeight + 5);

// //     // Titre
// //     const centerX = pageWidth / 2;
// //     doc.setTextColor(41, 98, 255);
// //     doc.setFontSize(22);
// //     doc.setFont('helvetica', 'bold');
// //     const typeLabels: Record<string, string> = {
// //       stage: 'ATTESTATION DE STAGE',
// //       travail: 'ATTESTATION DE TRAVAIL',
// //       formation: 'ATTESTATION DE FORMATION'
// //     };
// //     const title = typeLabels[formData.type] || 'ATTESTATION';
// //     doc.text(title, centerX, logoY + logoHeight + 25, { align: 'center' });

// //     // Numéro d'attestation
// //     const attestationNumber = `N° ${new Date().getFullYear()}/${String(Date.now()).slice(-6)}/MERDIE`;
// //     doc.setFontSize(10);
// //     doc.setTextColor(100, 100, 100);
// //     doc.text(attestationNumber, centerX, logoY + logoHeight + 33, { align: 'center' });

// //     // Corps du texte
// //     doc.setTextColor(50, 50, 50);
// //     doc.setFontSize(12);
// //     doc.setFont('helvetica', 'normal');
    
// //     const startY = logoY + logoHeight + 55;
// //     const lineHeight = 7;

// //     const textLines = [
// //       `Je soussigné, Monsieur le Directeur des Ressources Humaines de MERDIE COMPANY,`,
// //       `certifie par la présente que :`,
// //       ``,
// //       `M./Mme ${stagiaire?.users?.username.toUpperCase()}`,
// //       `Matricule : ${stagiaire?.matricule}`,
// //       ``,
// //       formData.type === 'stage' ? 
// //         `a effectué un stage au sein de notre entreprise du ${formData.date_debut || '_____'} au ${formData.date_fin || '_____'}.` :
// //       formData.type === 'travail' ?
// //         `est employé(e) au sein de notre entreprise en qualité de ${formData.poste || '_____'} depuis le ${formData.date_debut || '_____'}.` :
// //         `a suivi avec succès la formation "${formData.formation || '_____'}" du ${formData.date_debut || '_____'} au ${formData.date_fin || '_____'}.`,
// //       ``,
// //       `Durant cette période, ${stagiaire?.users?.username} a fait preuve de sérieux,`,
// //       `d'assiduité et de professionnalisme, donnant entière satisfaction à ses`,
// //       `responsables hiérarchiques.`,
// //       ``,
// //       `La présente attestation est délivrée à l'intéressé(e) pour servir et valoir`,
// //       `ce que de droit.`,
// //     ];

// //     textLines.forEach((line, index) => {
// //       doc.text(line, margin + 5, startY + (index * lineHeight));
// //     });

// //     // Badge
// //     const badgeSize = 25;
// //     const badgeX = pageWidth - margin - badgeSize - 10;
// //     const badgeY = startY + 15;

// //     try {
// //       const badgeResponse = await fetch('/badge.png');
// //       if (badgeResponse.ok) {
// //         const badgeBlob = await badgeResponse.blob();
// //         const badgeBase64 = await blobToBase64(badgeBlob);
// //         doc.addImage(badgeBase64, 'PNG', badgeX, badgeY, badgeSize, badgeSize);
// //         doc.setTextColor(150, 150, 150);
// //         doc.setFontSize(8);
// //         doc.text('CERTIFIÉ', badgeX + badgeSize/2, badgeY + badgeSize + 5, { align: 'center' });
// //       }
// //     } catch (error) {
// //       console.warn('Badge non trouvé');
// //     }

// //     // Date
// //     const dateY = startY + (textLines.length * lineHeight) + 15;
// //     doc.setTextColor(50, 50, 50);
// //     doc.setFontSize(11);
// //     doc.text(`Fait à lubumbashi, le ${new Date().toLocaleDateString('fr-FR', { 
// //       day: 'numeric', 
// //       month: 'long', 
// //       year: 'numeric' 
// //     })}`, margin + 5, dateY);

// //     // Signature
// //     const signatureWidth = 40;
// //     const signatureHeight = 20;
// //     const signatureX = pageWidth - margin - signatureWidth - 30;
// //     const signatureY = dateY - 5;

// //     try {
// //       const signatureResponse = await fetch('/signature.png');
// //       if (signatureResponse.ok) {
// //         const signatureBlob = await signatureResponse.blob();
// //         const signatureBase64 = await blobToBase64(signatureBlob);
// //         doc.addImage(signatureBase64, 'PNG', signatureX, signatureY, signatureWidth, signatureHeight);
// //       }
// //     } catch (error) {
// //       console.warn('Signature non trouvée');
// //     }

// //     // Texte de signature
// //     doc.setDrawColor(50, 50, 50);
// //     doc.line(signatureX, signatureY + signatureHeight, signatureX + signatureWidth, signatureY + signatureHeight);
// //     doc.setFontSize(10);
// //     doc.text('Le Directeur des RH', signatureX + signatureWidth/2, signatureY + signatureHeight + 7, { align: 'center' });
// //     doc.setFontSize(8);
// //     doc.text('Merdie Company', signatureX + signatureWidth/2, signatureY + signatureHeight + 12, { align: 'center' });

// //     // Pied de page
// //     doc.setTextColor(150, 150, 150);
// //     doc.setFontSize(8);
// //     doc.text('MERDIE COMPANY - Siège social : Lubumbashi ,RDC', centerX, pageHeight - 20, { align: 'center' });
// //     doc.text('Email : contact@merdiecompany.sn', centerX, pageHeight - 15, { align: 'center' });
// //     doc.text('www.merdiecompany.sn', centerX, pageHeight - 10, { align: 'center' });



// //     return doc.output('blob');
// //   };

// //   // Fonction utilitaire pour convertir un Blob en base64
// //   const blobToBase64 = (blob: Blob): Promise<string> => {
// //     return new Promise((resolve, reject) => {
// //       const reader = new FileReader();
// //       reader.onloadend = () => resolve(reader.result as string);
// //       reader.onerror = reject;
// //       reader.readAsDataURL(blob);
// //     });
// //   };

// //   const handleGenerate = async (formData: Record<string, any>, files?: UploadedFile[]) => {
// //     setIsGenerating(true);
// //     try {
// //       const stagiaire = stagiaires.find(s => s.id === parseInt(formData.stagiaire_id));
      
// //       // Générer le PDF
// //       const pdfBlob = await generateAttestationPDF(formData);
      
// //       // Créer le fichier pour l'upload
// //       const fileName = `attestations/${stagiaire?.id}/${Date.now()}-attestation.pdf`;
// //       const file = new File([pdfBlob], `attestation-${Date.now()}.pdf`, { type: 'application/pdf' });

// //       // Upload vers Supabase Storage
// //       const { error: uploadError } = await supabase.storage
// //         .from('documents')
// //         .upload(fileName, file);

// //       if (uploadError) throw uploadError;

// //       // Obtenir l'URL publique
// //       const { data: { publicUrl } } = supabase.storage
// //         .from('documents')
// //         .getPublicUrl(fileName);

// //       // Insérer dans la base de données
// //       const { error } = await supabase
// //         .from('attestations')
// //         .insert({
// //           stagiaire_id: parseInt(formData.stagiaire_id),
// //           type: formData.type,
// //           fichier_url: publicUrl,
// //           date_emission: new Date().toISOString().split('T')[0]
// //         });

// //       if (error) throw error;
// //       await fetchAttestations();
// //       setIsCreateOpen(false);
// //     } catch (error) {
// //       console.error('Erreur génération:', error);
// //       throw error;
// //     } finally {
// //       setIsGenerating(false);
// //     }
// //   };

// //   const attestationFields: FormField[] = [
// //     {
// //       name: 'stagiaire_id',
// //       label: 'Stagiaire',
// //       type: 'select',
// //       required: true,
// //       options: stagiaires.map(s => ({ value: String(s.id), label: `${s.users?.username} (${s.matricule})` })),
// //       icon: <User size={14} />,
// //     },
// //     {
// //       name: 'type',
// //       label: 'Type d\'attestation',
// //       type: 'select',
// //       required: true,
// //       options: [
// //         { value: 'stage', label: 'Attestation de stage' },
// //         { value: 'travail', label: 'Attestation de travail' },
// //         { value: 'formation', label: 'Attestation de formation' },
// //       ],
// //     },
// //     {
// //       name: 'date_debut',
// //       label: 'Date de début',
// //       type: 'date',
// //       required: true,
// //       icon: <Calendar size={14} />,
// //     },
// //     {
// //       name: 'date_fin',
// //       label: 'Date de fin',
// //       type: 'date',
// //       required: false,
// //       icon: <Calendar size={14} />,
// //     },
// //     {
// //       name: 'poste',
// //       label: 'Poste / Qualité',
// //       type: 'text',
// //       required: false,
// //       placeholder: 'Ex: Développeur Full Stack',
// //       icon: <User size={14} />,
// //     },
// //     {
// //       name: 'formation',
// //       label: 'Intitulé de la formation',
// //       type: 'text',
// //       required: false,
// //       placeholder: 'Ex: Formation en Intelligence Artificielle',
// //       icon: <FileText size={14} />,
// //     },
// //   ];

// //   const getDetailSections = (): DetailSection[] => {
// //     if (!selected) return [];
// //     return [{
// //       title: '📄 Détails de l\'attestation',
// //       fields: [
// //         { label: 'Stagiaire', value: selected.stagiaire?.users?.username, icon: <User size={14} />, span: 'half' },
// //         { label: 'Matricule', value: selected.stagiaire?.matricule, span: 'half' },
// //         { label: 'Type', value: selected.type, span: 'half' },
// //         { label: 'Date d\'émission', value: new Date(selected.date_emission).toLocaleDateString('fr-FR'), icon: <Calendar size={14} />, span: 'half' },
// //         { 
// //           label: 'Fichier', 
// //           value: selected.fichier_url ? (
// //             <a href={selected.fichier_url} target="_blank" className="text-indigo-600 hover:underline flex items-center gap-1">
// //               <Download size={14} /> Télécharger le PDF
// //             </a>
// //           ) : 'N/A',
// //           span: 'full' 
// //         },
// //       ]
// //     }];
// //   };

// //   const columns: Column<AttestationRecord>[] = [
// //     { key: 'stagiaire', header: 'Stagiaire', sortable: true },
// //     { key: 'matricule', header: 'Matricule' },
// //     { 
// //       key: 'type', 
// //       header: 'Type',
// //       render: (item) => {
// //         const labels: Record<string, string> = { stage: 'Stage', travail: 'Travail', formation: 'Formation' };
// //         return (
// //           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
// //             {labels[item.type] || item.type}
// //           </span>
// //         );
// //       }
// //     },
// //     { key: 'date', header: 'Date d\'émission', sortable: true },
// //     {
// //       key: 'fichier',
// //       header: 'Fichier',
// //       render: (item) => item.fichier ? (
// //         <a href={item.fichier} target="_blank" className="text-indigo-600 hover:underline flex items-center gap-1">
// //           <Download size={14} /> Télécharger
// //         </a>
// //       ) : <span className="text-gray-400">-</span>
// //     },
// //   ];

// //   return (
// //     <div className="p-6 max-w-[1400px] mx-auto space-y-6">
// //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
// //         {stats.map((stat, i) => (
// //           <StatCard key={i} {...stat} size="sm" />
// //         ))}
// //       </div>

// //       <DataTable
// //         data={data}
// //         columns={columns}
// //         searchable
// //         searchPlaceholder="Rechercher une attestation..."
// //         onRowClick={(item) => { loadDetails(item.id); setIsDetailsOpen(true); }}
// //         emptyMessage="Aucune attestation trouvée"
// //         striped
// //         loading={isLoading}
// //         renderHeader={() => (
// //           <div className="px-6 py-4 border-b flex items-center justify-between bg-white">
// //             <h2 className="font-bold text-gray-900 text-lg">Attestations</h2>
// //             <button 
// //               onClick={() => setIsCreateOpen(true)} 
// //               className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm transition-colors"
// //             >
// //               <Plus size={16} /> Générer une attestation
// //             </button>
// //           </div>
// //         )}
// //       />

// //       <FormModal
// //         isOpen={isCreateOpen}
// //         onClose={() => setIsCreateOpen(false)}
// //         title="Générer une Attestation PDF"
// //         subtitle="Remplissez les informations pour générer l'attestation"
// //         fields={attestationFields}
// //         onSubmit={handleGenerate}
// //         submitLabel={
// //         'Generation PDF...'
          
// //         }
// //         loading={isGenerating}
// //         maxWidth="max-w-lg"
// //         mode="create"
// //       />

// //       <DetailsModal
// //         isOpen={isDetailsOpen}
// //         onClose={() => setIsDetailsOpen(false)}
// //         title={selected?.stagiaire?.users?.username || 'Détails'}
// //         subtitle={selected?.stagiaire?.matricule}
// //         sections={getDetailSections()}
// //         footer={
// //           selected?.fichier_url ? (
// //             <a 
// //               href={selected.fichier_url} 
// //               target="_blank" 
// //               className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm transition-colors"
// //             >
// //               <Eye size={14} /> Voir le PDF
// //             </a>
// //           ) : undefined
// //         }
// //       />
// //     </div>
// //   );
// // }

// // app/attestations/page.tsx
// "use client";

// import { useState, useEffect, useMemo } from 'react';
// import { DataTable, Column } from '@/components/DataTable';
// import { FormModal, FormField, UploadedFile } from '@/components/FormModal';
// import { DetailsModal, DetailSection } from '@/components/DetailsModal';
// import { StatCard } from '@/components/ui/StatCard';
// import { supabase } from '@/lib/supabase';
// import { jsPDF } from 'jspdf';
// import { 
//   Award, User, Calendar, Download, Eye,
//   FileText, Plus, Loader
// } from 'lucide-react';

// interface AttestationRecord {
//   id: number;
//   stagiaire: string;
//   matricule: string;
//   type: string;
//   date: string;
//   fichier: string;
// }

// export default function AttestationsPage() {
//   const [data, setData] = useState<AttestationRecord[]>([]);
//   const [selected, setSelected] = useState<any>(null);
//   const [isDetailsOpen, setIsDetailsOpen] = useState(false);
//   const [isCreateOpen, setIsCreateOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [stagiaires, setStagiaires] = useState<any[]>([]);

//   useEffect(() => {
//     fetchAttestations();
//     fetchStagiaires();
//   }, []);

//   const fetchAttestations = async () => {
//     setIsLoading(true);
//     try {
//       const { data } = await supabase
//         .from('attestations')
//         .select(`
//           *,
//           stagiaire:stagiaire_id(matricule, users!inner(username))
//         `)
//         .order('created_at', { ascending: false });

//       if (data) {
//         setData(data.map((a: any) => ({
//           id: a.id,
//           stagiaire: a.stagiaire?.users?.username || 'N/A',
//           matricule: a.stagiaire?.matricule || 'N/A',
//           type: a.type,
//           date: new Date(a.date_emission).toLocaleDateString('fr-FR'),
//           fichier: a.fichier_url || ''
//         })));
//       }
//     } catch (error) {
//       console.error('Erreur:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchStagiaires = async () => {
//     const { data } = await supabase
//       .from('stagiaires')
//       .select('id, matricule, users!inner(username)');
//     if (data) setStagiaires(data);
//   };

//   const loadDetails = async (id: number) => {
//     const { data } = await supabase
//       .from('attestations')
//       .select(`*, stagiaire:stagiaire_id(matricule, users!inner(username, email))`)
//       .eq('id', id)
//       .single();
//     if (data) setSelected(data);
//   };

//   const stats = useMemo(() => {
//     const total = data.length;
//     const stages = data.filter(a => a.type === 'stage').length;
//     const travaux = data.filter(a => a.type === 'travail').length;
//     const formations = data.filter(a => a.type === 'formation').length;

//     return [
//       { label: 'Total Attestations', value: String(total), icon: <Award size={20} /> },
//       { label: 'Attestations Stage', value: String(stages), icon: <FileText size={20} /> },
//       { label: 'Attestations Travail', value: String(travaux), icon: <FileText size={20} /> },
//       { label: 'Attestations Formation', value: String(formations), icon: <FileText size={20} /> },
//     ];
//   }, [data]);

//   const generateAttestationPDF = async (formData: Record<string, any>): Promise<Blob> => {
//     const stagiaire = stagiaires.find(s => s.id === parseInt(formData.stagiaire_id));
    
//     // Format paysage A4 (297mm x 210mm)
//     const doc = new jsPDF('l', 'mm', 'a4');
    
//     // Dimensions paysage
//     const pageWidth = doc.internal.pageSize.getWidth();   // 297mm
//     const pageHeight = doc.internal.pageSize.getHeight();  // 210mm
//     const margin = 15;

//     // Bordure extérieure décorative
//     doc.setDrawColor(41, 98, 255); // Bleu indigo
//     doc.setLineWidth(2);
//     doc.rect(margin - 3, margin - 3, pageWidth - (margin - 3) * 2, pageHeight - (margin - 3) * 2, 'S');
//     doc.setDrawColor(180, 180, 180);
//     doc.setLineWidth(0.5);
//     doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2, 'S');

//     // ---- SECTION GAUCHE (Logo + Infos entreprise) ----
//     const leftSectionX = margin + 10;
//     const leftSectionWidth = 90;

//     // Logo
//     const logoWidth = 35;
//     const logoHeight = 35;
//     let logoY = margin + 15;

//     try {
//       const logoResponse = await fetch('/logo.png');
//       if (logoResponse.ok) {
//         const logoBlob = await logoResponse.blob();
//         const logoBase64 = await blobToBase64(logoBlob);
//         doc.addImage(logoBase64, 'PNG', leftSectionX, logoY, logoWidth, logoHeight);
//       }
//     } catch (error) {
//       console.warn('Logo non trouvé');
//     }

//     // Nom entreprise
//     doc.setTextColor(41, 98, 255);
//     doc.setFont('helvetica', 'bold');
//     doc.setFontSize(22);
//     doc.text('MERDIE COMPANY', leftSectionX + logoWidth + 10, logoY + 10);
    
//     doc.setTextColor(100, 100, 100);
//     doc.setFontSize(9);
//     doc.setFont('helvetica', 'normal');
//     doc.text('Solutions Innovantes pour Demain', leftSectionX + logoWidth + 10, logoY + 18);
//     doc.text('RC: SN-DKR-2024-B-12345', leftSectionX + logoWidth + 10, logoY + 25);
//     doc.text('NINEA: 001234567', leftSectionX + logoWidth + 10, logoY + 31);

//     // Séparateur horizontal sous l'en-tête
//     doc.setDrawColor(41, 98, 255);
//     doc.setLineWidth(0.5);
//     doc.line(margin + 5, logoY + logoHeight + 8, pageWidth - margin - 5, logoY + logoHeight + 8);

//     // ---- SECTION DROITE (Numéro + Date) ----
//     const rightSectionX = pageWidth - margin - 15;
//     doc.setTextColor(100, 100, 100);
//     doc.setFontSize(8);
//     doc.text(`N° ${new Date().getFullYear()}/${String(Date.now()).slice(-6)}/MERDIE`, rightSectionX, margin + 15, { align: 'right' });
//     doc.text(`Lubumbashi, le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`, rightSectionX, margin + 22, { align: 'right' });

//     // ---- TITRE CENTRAL ----
//     const centerX = pageWidth / 2;
//     const titleY = logoY + logoHeight + 30;
    
//     doc.setTextColor(41, 98, 255);
//     doc.setFontSize(20);
//     doc.setFont('helvetica', 'bold');
    
//     const typeLabels: Record<string, string> = {
//       stage: 'ATTESTATION DE STAGE',
//       travail: 'ATTESTATION DE TRAVAIL',
//       formation: 'ATTESTATION DE FORMATION'
//     };
//     const title = typeLabels[formData.type] || 'ATTESTATION';
//     doc.text(title, centerX, titleY, { align: 'center' });

//     // Ligne décorative sous le titre
//     doc.setDrawColor(41, 98, 255);
//     doc.setLineWidth(1);
//     doc.line(centerX - 60, titleY + 4, centerX + 60, titleY + 4);

//     // ---- CORPS DU TEXTE (sur 2 colonnes si nécessaire) ----
//     const corpsY = titleY + 20;
//     doc.setTextColor(60, 60, 60);
//     doc.setFontSize(11);
//     doc.setFont('helvetica', 'normal');

//     const leftColumnX = margin + 15;
//     const rightColumnX = centerX + 15;
//     const columnWidth = (pageWidth - margin * 2 - 60) / 2;

//     // Colonne gauche
//     const leftLines = [
//       `Je soussigné, Monsieur le Directeur des`,
//       `Ressources Humaines de MERDIE COMPANY,`,
//       `certifie par la présente que :`,
//       ``,
//       `M./Mme ${stagiaire?.users?.username?.toUpperCase() || '_________________'}`,
//       `Matricule : ${stagiaire?.matricule || '_________________'}`,
//       ``,
//     ];

//     if (formData.type === 'stage') {
//       leftLines.push(`a effectué un stage au sein de notre`);
//       leftLines.push(`entreprise du ${formData.date_debut || '_____'} au ${formData.date_fin || '_____'}.`);
//     } else if (formData.type === 'travail') {
//       leftLines.push(`est employé(e) au sein de notre entreprise`);
//       leftLines.push(`en qualité de ${formData.poste || '_____'} depuis le`);
//       leftLines.push(`${formData.date_debut || '_____'}.`);
//     } else {
//       leftLines.push(`a suivi avec succès la formation`);
//       leftLines.push(`"${formData.formation || '_____'}" du`);
//       leftLines.push(`${formData.date_debut || '_____'} au ${formData.date_fin || '_____'}.`);
//     }

//     const lineHeight = 6;
//     leftLines.forEach((line, index) => {
//       doc.text(line, leftColumnX, corpsY + (index * lineHeight));
//     });

//     // Colonne droite
//     const rightStartY = corpsY;
//     const rightLines = [
//       `Durant cette période, ${stagiaire?.users?.username || 'l\'intéressé(e)'}`,
//       `a fait preuve de sérieux, d'assiduité et`,
//       `de professionnalisme, donnant entière`,
//       `satisfaction à ses responsables`,
//       `hiérarchiques.`,
//       ``,
//       `La présente attestation est délivrée à`,
//       `l'intéressé(e) pour servir et valoir ce`,
//       `que de droit.`,
//       ``,
//       `Nous lui souhaitons pleine réussite dans`,
//       `ses projets futurs.`,
//     ];

//     rightLines.forEach((line, index) => {
//       doc.text(line, rightColumnX, rightStartY + (index * lineHeight));
//     });

//     // ---- BADGE ----
//     const badgeSize = 30;
//     const badgeX = pageWidth - margin - badgeSize - 20;
//     const badgeY = corpsY + 40;

//     try {
//       const badgeResponse = await fetch('/badge.png');
//       if (badgeResponse.ok) {
//         const badgeBlob = await badgeResponse.blob();
//         const badgeBase64 = await blobToBase64(badgeBlob);
//         doc.addImage(badgeBase64, 'PNG', badgeX, badgeY, badgeSize, badgeSize);
//         doc.setTextColor(150, 150, 150);
//         doc.setFontSize(7);
//         doc.text('CERTIFIÉ AUTHENTIQUE', badgeX + badgeSize/2, badgeY + badgeSize + 6, { align: 'center' });
//       }
//     } catch (error) {
//       console.warn('Badge non trouvé');
//     }

//     // ---- SIGNATURE ----
//     const signatureSectionY = pageHeight - margin - 45;
//     doc.setDrawColor(41, 98, 255);
//     doc.setLineWidth(0.5);
//     doc.line(margin + 15, signatureSectionY, pageWidth - margin - 15, signatureSectionY);

//     // Bloc signature à droite
//     const sigX = pageWidth - margin - 80;
//     const sigY = signatureSectionY + 12;
    
//     try {
//       const signatureResponse = await fetch('/signature.png');
//       if (signatureResponse.ok) {
//         const signatureBlob = await signatureResponse.blob();
//         const signatureBase64 = await blobToBase64(signatureBlob);
//         doc.addImage(signatureBase64, 'PNG', sigX, sigY - 5, 50, 20);
//       }
//     } catch (error) {
//       console.warn('Signature non trouvée');
//     }

//     doc.setDrawColor(80, 80, 80);
//     doc.setLineWidth(0.3);
//     doc.line(sigX, sigY + 18, sigX + 60, sigY + 18);
    
//     doc.setTextColor(50, 50, 50);
//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Le Directeur des Ressources Humaines', sigX + 30, sigY + 25, { align: 'center' });
//     doc.setFontSize(8);
//     doc.setFont('helvetica', 'normal');
//     doc.text('MERDIE COMPANY', sigX + 30, sigY + 30, { align: 'center' });

//     // Bloc cachet à gauche
//     const cachetX = margin + 30;
//     const cachetY = signatureSectionY + 10;
//     doc.setDrawColor(41, 98, 255);
//     doc.setLineWidth(1.5);
//     doc.circle(cachetX, cachetY + 10, 15, 'S');
//     doc.setFontSize(7);
//     doc.setTextColor(41, 98, 255);
//     doc.setFont('helvetica', 'bold');
//     doc.text('MERDIE', cachetX, cachetY + 8, { align: 'center' });
//     doc.text('COMPANY', cachetX, cachetY + 12, { align: 'center' });
//     doc.setFontSize(5);
//     doc.text('CACHET OFFICIEL', cachetX, cachetY + 16, { align: 'center' });

//     // ---- PIED DE PAGE ----
//     const footerY = pageHeight - margin - 5;
//     doc.setTextColor(130, 130, 130);
//     doc.setFontSize(7);
//     doc.setFont('helvetica', 'normal');
//     doc.text('MERDIE COMPANY - Siège social : Lubumbashi, RDC', centerX, footerY, { align: 'center' });
//     doc.text('Email : contact@merdiecompany.sn | www.merdiecompany.sn | Tél : +243 XX XXX XX XX', centerX, footerY + 5, { align: 'center' });
//     doc.text('Document généré électroniquement - Valide sans signature manuscrite', centerX, footerY + 10, { align: 'center' });

//     return doc.output('blob');
//   };

//   // Fonction utilitaire pour convertir un Blob en base64
//   const blobToBase64 = (blob: Blob): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result as string);
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
//   };

//   const handleGenerate = async (formData: Record<string, any>, files?: UploadedFile[]) => {
//     setIsGenerating(true);
//     try {
//       const stagiaire = stagiaires.find(s => s.id === parseInt(formData.stagiaire_id));
      
//       // Générer le PDF
//       const pdfBlob = await generateAttestationPDF(formData);
      
//       // Créer le fichier pour l'upload
//       const fileName = `attestations/${stagiaire?.id}/${Date.now()}-attestation.pdf`;
//       const file = new File([pdfBlob], `attestation-${Date.now()}.pdf`, { type: 'application/pdf' });

//       // Upload vers Supabase Storage
//       const { error: uploadError } = await supabase.storage
//         .from('documents')
//         .upload(fileName, file);

//       if (uploadError) throw uploadError;

//       // Obtenir l'URL publique
//       const { data: { publicUrl } } = supabase.storage
//         .from('documents')
//         .getPublicUrl(fileName);

//       // Insérer dans la base de données
//       const { error } = await supabase
//         .from('attestations')
//         .insert({
//           stagiaire_id: parseInt(formData.stagiaire_id),
//           type: formData.type,
//           fichier_url: publicUrl,
//           date_emission: new Date().toISOString().split('T')[0]
//         });

//       if (error) throw error;
//       await fetchAttestations();
//       setIsCreateOpen(false);
//     } catch (error) {
//       console.error('Erreur génération:', error);
//       throw error;
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const attestationFields: FormField[] = [
//     {
//       name: 'stagiaire_id',
//       label: 'Stagiaire',
//       type: 'select',
//       required: true,
//       options: stagiaires.map(s => ({ value: String(s.id), label: `${s.users?.username} (${s.matricule})` })),
//       icon: <User size={14} />,
//     },
//     {
//       name: 'type',
//       label: 'Type d\'attestation',
//       type: 'select',
//       required: true,
//       options: [
//         { value: 'stage', label: 'Attestation de stage' },
//         { value: 'travail', label: 'Attestation de travail' },
//         { value: 'formation', label: 'Attestation de formation' },
//       ],
//     },
//     {
//       name: 'date_debut',
//       label: 'Date de début',
//       type: 'date',
//       required: true,
//       icon: <Calendar size={14} />,
//     },
//     {
//       name: 'date_fin',
//       label: 'Date de fin',
//       type: 'date',
//       required: false,
//       icon: <Calendar size={14} />,
//     },
//     {
//       name: 'poste',
//       label: 'Poste / Qualité',
//       type: 'text',
//       required: false,
//       placeholder: 'Ex: Développeur Full Stack',
//       icon: <User size={14} />,
//     },
//     {
//       name: 'formation',
//       label: 'Intitulé de la formation',
//       type: 'text',
//       required: false,
//       placeholder: 'Ex: Formation en Intelligence Artificielle',
//       icon: <FileText size={14} />,
//     },
//   ];

//   const getDetailSections = (): DetailSection[] => {
//     if (!selected) return [];
//     return [{
//       title: '📄 Détails de l\'attestation',
//       fields: [
//         { label: 'Stagiaire', value: selected.stagiaire?.users?.username, icon: <User size={14} />, span: 'half' },
//         { label: 'Matricule', value: selected.stagiaire?.matricule, span: 'half' },
//         { label: 'Type', value: selected.type, span: 'half' },
//         { label: 'Date d\'émission', value: new Date(selected.date_emission).toLocaleDateString('fr-FR'), icon: <Calendar size={14} />, span: 'half' },
//         { 
//           label: 'Fichier', 
//           value: selected.fichier_url ? (
//             <a href={selected.fichier_url} target="_blank" className="text-indigo-600 hover:underline flex items-center gap-1">
//               <Download size={14} /> Télécharger le PDF
//             </a>
//           ) : 'N/A',
//           span: 'full' 
//         },
//       ]
//     }];
//   };

//   const columns: Column<AttestationRecord>[] = [
//     { key: 'stagiaire', header: 'Stagiaire', sortable: true },
//     { key: 'matricule', header: 'Matricule' },
//     { 
//       key: 'type', 
//       header: 'Type',
//       render: (item) => {
//         const labels: Record<string, string> = { stage: 'Stage', travail: 'Travail', formation: 'Formation' };
//         return (
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
//             {labels[item.type] || item.type}
//           </span>
//         );
//       }
//     },
//     { key: 'date', header: 'Date d\'émission', sortable: true },
//     {
//       key: 'fichier',
//       header: 'Fichier',
//       render: (item) => item.fichier ? (
//         <a href={item.fichier} target="_blank" className="text-indigo-600 hover:underline flex items-center gap-1">
//           <Download size={14} /> Télécharger
//         </a>
//       ) : <span className="text-gray-400">-</span>
//     },
//   ];

//   return (
//     <div className="p-6 max-w-[1400px] mx-auto space-y-6">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map((stat, i) => (
//           <StatCard key={i} {...stat} size="sm" />
//         ))}
//       </div>

//       <DataTable
//         data={data}
//         columns={columns}
//         searchable
//         searchPlaceholder="Rechercher une attestation..."
//         onRowClick={(item) => { loadDetails(item.id); setIsDetailsOpen(true); }}
//         emptyMessage="Aucune attestation trouvée"
//         striped
//         loading={isLoading}
//         renderHeader={() => (
//           <div className="px-6 py-4 border-b flex items-center justify-between bg-white">
//             <h2 className="font-bold text-gray-900 text-lg">Attestations</h2>
//             <button 
//               onClick={() => setIsCreateOpen(true)} 
//               className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm transition-colors"
//             >
//               <Plus size={16} /> Générer une attestation
//             </button>
//           </div>
//         )}
//       />

//       <FormModal
//         isOpen={isCreateOpen}
//         onClose={() => setIsCreateOpen(false)}
//         title="Générer une Attestation PDF"
//         subtitle="Remplissez les informations pour générer l'attestation"
//         fields={attestationFields}
//         onSubmit={handleGenerate}
//         submitLabel={
//         'Generation PDF...'
          
//         }
//         loading={isGenerating}
//         maxWidth="max-w-lg"
//         mode="create"
//       />

//       <DetailsModal
//         isOpen={isDetailsOpen}
//         onClose={() => setIsDetailsOpen(false)}
//         title={selected?.stagiaire?.users?.username || 'Détails'}
//         subtitle={selected?.stagiaire?.matricule}
//         sections={getDetailSections()}
//         footer={
//           selected?.fichier_url ? (
//             <a 
//               href={selected.fichier_url} 
//               target="_blank" 
//               className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm transition-colors"
//             >
//               <Eye size={14} /> Voir le PDF
//             </a>
//           ) : undefined
//         }
//       />
//     </div>
//   );
// }

// app/attestations/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { DataTable, Column } from '@/components/DataTable';
import { FormModal, FormField, UploadedFile } from '@/components/FormModal';
import { DetailsModal, DetailSection } from '@/components/DetailsModal';
import { StatCard } from '@/components/ui/StatCard';
import { supabase } from '@/lib/supabase';
import { jsPDF } from 'jspdf';
import { 
  Award, User, Calendar, Download, Eye,
  FileText, Plus, Loader
} from 'lucide-react';

interface AttestationRecord {
  id: number;
  stagiaire: string;
  matricule: string;
  type: string;
  date: string;
  fichier: string;
}

export default function AttestationsPage() {
  const [data, setData] = useState<AttestationRecord[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [stagiaires, setStagiaires] = useState<any[]>([]);

  useEffect(() => {
    fetchAttestations();
    fetchStagiaires();
  }, []);

  const fetchAttestations = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from('attestations')
        .select(`
          *,
          stagiaire:stagiaire_id(matricule, users!inner(username))
        `)
        .order('created_at', { ascending: false });

      if (data) {
        setData(data.map((a: any) => ({
          id: a.id,
          stagiaire: a.stagiaire?.users?.username || 'N/A',
          matricule: a.stagiaire?.matricule || 'N/A',
          type: a.type,
          date: new Date(a.date_emission).toLocaleDateString('fr-FR'),
          fichier: a.fichier_url || ''
        })));
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStagiaires = async () => {
    const { data } = await supabase
      .from('stagiaires')
      .select('id, matricule, users!inner(username)');
    if (data) setStagiaires(data);
  };

  const loadDetails = async (id: number) => {
    const { data } = await supabase
      .from('attestations')
      .select(`*, stagiaire:stagiaire_id(matricule, users!inner(username, email))`)
      .eq('id', id)
      .single();
    if (data) setSelected(data);
  };

  const stats = useMemo(() => {
    const total = data.length;
    const stages = data.filter(a => a.type === 'stage').length;
    const travaux = data.filter(a => a.type === 'travail').length;
    const formations = data.filter(a => a.type === 'formation').length;

    return [
      { label: 'Total Attestations', value: String(total), icon: <Award size={20} /> },
      { label: 'Attestations Stage', value: String(stages), icon: <FileText size={20} /> },
      { label: 'Attestations Travail', value: String(travaux), icon: <FileText size={20} /> },
      { label: 'Attestations Formation', value: String(formations), icon: <FileText size={20} /> },
    ];
  }, [data]);

  const generateAttestationPDF = async (formData: Record<string, any>): Promise<Blob> => {
    const stagiaire = stagiaires.find(s => s.id === parseInt(formData.stagiaire_id));
    
    // Format paysage A4 (297mm x 210mm)
    const doc = new jsPDF('l', 'mm', 'a4');
    
    // Dimensions paysage
    const pageWidth = doc.internal.pageSize.getWidth();   // 297mm
    const pageHeight = doc.internal.pageSize.getHeight();  // 210mm
    const margin = 12;

    // Bordure extérieure décorative
    doc.setDrawColor(41, 98, 255); // Bleu indigo
    doc.setLineWidth(2);
    doc.rect(margin - 2, margin - 2, pageWidth - (margin - 2) * 2, pageHeight - (margin - 2) * 2, 'S');
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2, 'S');

    // ---- SECTION GAUCHE (Logo + Badge) ----
    const leftSectionX = margin + 8;
    const headerY = margin + 10;

    // Logo
    const logoWidth = 32;
    const logoHeight = 32;

    try {
      const logoResponse = await fetch('/logo.png');
      if (logoResponse.ok) {
        const logoBlob = await logoResponse.blob();
        const logoBase64 = await blobToBase64(logoBlob);
        doc.addImage(logoBase64, 'PNG', leftSectionX, headerY, logoWidth, logoHeight);
      }
    } catch (error) {
      console.warn('Logo non trouvé');
    }

    // Badge à gauche, à côté du logo
    const badgeSize = 28;
    const badgeX = leftSectionX + logoWidth + 8;
    const badgeY = headerY + 2;

    try {
      const badgeResponse = await fetch('/badge.png');
      if (badgeResponse.ok) {
        const badgeBlob = await badgeResponse.blob();
        const badgeBase64 = await blobToBase64(badgeBlob);
        doc.addImage(badgeBase64, 'PNG', badgeX, badgeY, badgeSize, badgeSize);
        doc.setTextColor(41, 98, 255);
        doc.setFontSize(6);
        doc.setFont('helvetica', 'bold');
        doc.text('CERTIFIÉ', badgeX + badgeSize/2, badgeY + badgeSize + 4, { align: 'center' });
      }
    } catch (error) {
      console.warn('Badge non trouvé');
    }

    // Nom entreprise
    doc.setTextColor(41, 98, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('MERDIE COMPANY', badgeX + badgeSize + 10, headerY + 10);
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Solutions Innovantes pour Demain', badgeX + badgeSize + 10, headerY + 18);
    doc.text('RC: SN-DKR-2024-B-12345 | NINEA: 001234567', badgeX + badgeSize + 10, headerY + 25);

    // Numéro et date en haut à droite
    const rightSectionX = pageWidth - margin - 10;
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text(`N° ${new Date().getFullYear()}/${String(Date.now()).slice(-6)}/MERDIE`, rightSectionX, headerY + 8, { align: 'right' });
    doc.text(`Lubumbashi, le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`, rightSectionX, headerY + 15, { align: 'right' });

    // ---- TITRE CENTRAL ----
    const titleY = headerY + logoHeight + 15;
    const centerX = pageWidth / 2;
    
    doc.setTextColor(41, 98, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    
    const typeLabels: Record<string, string> = {
      stage: 'ATTESTATION DE STAGE',
      travail: 'ATTESTATION DE TRAVAIL',
      formation: 'ATTESTATION DE FORMATION'
    };
    const title = typeLabels[formData.type] || 'ATTESTATION';
    doc.text(title, centerX, titleY, { align: 'center' });

    // Légère ligne décorative sous le titre
    doc.setDrawColor(41, 98, 255);
    doc.setLineWidth(0.8);
    doc.line(centerX - 50, titleY + 3, centerX + 50, titleY + 3);

    // ---- CORPS DU TEXTE ----
    const corpsY = titleY + 15;
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Préparer tout le texte
    const introLines = [
      `Je soussigné, Monsieur le Directeur des Ressources Humaines de MERDIE COMPANY,`,
      `certifie par la présente que :`,
    ];

    const infoLines = [
      `M./Mme ${stagiaire?.users?.username?.toUpperCase() || '_________________'}`,
      `Matricule : ${stagiaire?.matricule || '_________________'}`,
      ``,
    ];

    let detailLines: string[] = [];
    if (formData.type === 'stage') {
      detailLines = [
        `a effectué un stage au sein de notre entreprise du ${formData.date_debut || '_____'}`,
        `au ${formData.date_fin || '_____'}.`,
      ];
    } else if (formData.type === 'travail') {
      detailLines = [
        `est employé(e) au sein de notre entreprise en qualité de`,
        `${formData.poste || '_____'} depuis le ${formData.date_debut || '_____'}.`,
      ];
    } else {
      detailLines = [
        `a suivi avec succès la formation "${formData.formation || '_____'}"`,
        `du ${formData.date_debut || '_____'} au ${formData.date_fin || '_____'}.`,
      ];
    }

    const appreciationLines = [
      ``,
      `Durant cette période, ${stagiaire?.users?.username || 'l\'intéressé(e)'} a fait preuve de sérieux,`,
      `d'assiduité et de professionnalisme, donnant entière satisfaction à ses responsables`,
      `hiérarchiques.`,
      ``,
      `La présente attestation est délivrée à l'intéressé(e) pour servir et valoir`,
      `ce que de droit. Nous lui souhaitons pleine réussite dans ses projets futurs.`,
    ];

    const allLines = [...introLines, ...infoLines, ...detailLines, ...appreciationLines];
    
    const lineHeight = 5.5;
    const maxLinesPerPage = Math.floor((pageHeight - margin * 2 - corpsY + margin) / lineHeight);
    
    // Vérifier si le texte déborde
    if (allLines.length > maxLinesPerPage - 2) {
      // Réduire légèrement la taille si nécessaire
      doc.setFontSize(9.5);
    }

    allLines.forEach((line, index) => {
      const y = corpsY + (index * lineHeight);
      // S'assurer que le texte ne dépasse pas la marge du bas
      if (y < pageHeight - margin - 30) {
        doc.text(line, margin + 12, y);
      }
    });

    const textEndY = Math.min(corpsY + (allLines.length * lineHeight), pageHeight - margin - 30);

    // ---- SIGNATURE (en bas à droite) ----
    const sigX = pageWidth - margin - 75;
    const sigY = pageHeight - margin - 40;
    
    try {
      const signatureResponse = await fetch('/signature.png');
      if (signatureResponse.ok) {
        const signatureBlob = await signatureResponse.blob();
        const signatureBase64 = await blobToBase64(signatureBlob);
        doc.addImage(signatureBase64, 'PNG', sigX, sigY - 8, 45, 18);
      }
    } catch (error) {
      console.warn('Signature non trouvée');
    }

    // Ligne de signature
    doc.setDrawColor(80, 80, 80);
    doc.setLineWidth(0.3);
    doc.line(sigX, sigY + 12, sigX + 55, sigY + 12);
    
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Le Directeur des Ressources Humaines', sigX + 27, sigY + 18, { align: 'center' });
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('MERDIE COMPANY', sigX + 27, sigY + 23, { align: 'center' });

    // ---- PIED DE PAGE ----
    const footerY = pageHeight - margin - 8;
    
    // Ligne fine de séparation avant le footer
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin + 5, footerY - 3, pageWidth - margin - 5, footerY - 3);
    
    doc.setTextColor(140, 140, 140);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.text('MERDIE COMPANY - Siège social : Lubumbashi, RDC | Email : contact@merdiecompany.sn | www.merdiecompany.sn | Tél : +243 XX XXX XX XX', centerX, footerY + 2, { align: 'center' });
    doc.text('Document généré électroniquement - Valide sans signature manuscrite', centerX, footerY + 7, { align: 'center' });

    return doc.output('blob');
  };

  // Fonction utilitaire pour convertir un Blob en base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleGenerate = async (formData: Record<string, any>, files?: UploadedFile[]) => {
    setIsGenerating(true);
    try {
      const stagiaire = stagiaires.find(s => s.id === parseInt(formData.stagiaire_id));
      
      // Générer le PDF
      const pdfBlob = await generateAttestationPDF(formData);
      
      // Créer le fichier pour l'upload
      const fileName = `attestations/${stagiaire?.id}/${Date.now()}-attestation.pdf`;
      const file = new File([pdfBlob], `attestation-${Date.now()}.pdf`, { type: 'application/pdf' });

      // Upload vers Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Insérer dans la base de données
      const { error } = await supabase
        .from('attestations')
        .insert({
          stagiaire_id: parseInt(formData.stagiaire_id),
          type: formData.type,
          fichier_url: publicUrl,
          date_emission: new Date().toISOString().split('T')[0]
        });

      if (error) throw error;
      await fetchAttestations();
      setIsCreateOpen(false);
    } catch (error) {
      console.error('Erreur génération:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const attestationFields: FormField[] = [
    {
      name: 'stagiaire_id',
      label: 'Stagiaire',
      type: 'select',
      required: true,
      options: stagiaires.map(s => ({ value: String(s.id), label: `${s.users?.username} (${s.matricule})` })),
      icon: <User size={14} />,
    },
    {
      name: 'type',
      label: 'Type d\'attestation',
      type: 'select',
      required: true,
      options: [
        { value: 'stage', label: 'Attestation de stage' },
        { value: 'travail', label: 'Attestation de travail' },
        { value: 'formation', label: 'Attestation de formation' },
      ],
    },
    {
      name: 'date_debut',
      label: 'Date de début',
      type: 'date',
      required: true,
      icon: <Calendar size={14} />,
    },
    {
      name: 'date_fin',
      label: 'Date de fin',
      type: 'date',
      required: false,
      icon: <Calendar size={14} />,
    },
    {
      name: 'poste',
      label: 'Poste / Qualité',
      type: 'text',
      required: false,
      placeholder: 'Ex: Développeur Full Stack',
      icon: <User size={14} />,
    },
    {
      name: 'formation',
      label: 'Intitulé de la formation',
      type: 'text',
      required: false,
      placeholder: 'Ex: Formation en Intelligence Artificielle',
      icon: <FileText size={14} />,
    },
  ];

  const getDetailSections = (): DetailSection[] => {
    if (!selected) return [];
    return [{
      title: '📄 Détails de l\'attestation',
      fields: [
        { label: 'Stagiaire', value: selected.stagiaire?.users?.username, icon: <User size={14} />, span: 'half' },
        { label: 'Matricule', value: selected.stagiaire?.matricule, span: 'half' },
        { label: 'Type', value: selected.type, span: 'half' },
        { label: 'Date d\'émission', value: new Date(selected.date_emission).toLocaleDateString('fr-FR'), icon: <Calendar size={14} />, span: 'half' },
        { 
          label: 'Fichier', 
          value: selected.fichier_url ? (
            <a href={selected.fichier_url} target="_blank" className="text-indigo-600 hover:underline flex items-center gap-1">
              <Download size={14} /> Télécharger le PDF
            </a>
          ) : 'N/A',
          span: 'full' 
        },
      ]
    }];
  };

  const columns: Column<AttestationRecord>[] = [
    { key: 'stagiaire', header: 'Stagiaire', sortable: true },
    { key: 'matricule', header: 'Matricule' },
    { 
      key: 'type', 
      header: 'Type',
      render: (item) => {
        const labels: Record<string, string> = { stage: 'Stage', travail: 'Travail', formation: 'Formation' };
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
            {labels[item.type] || item.type}
          </span>
        );
      }
    },
    { key: 'date', header: 'Date d\'émission', sortable: true },
    {
      key: 'fichier',
      header: 'Fichier',
      render: (item) => item.fichier ? (
        <a href={item.fichier} target="_blank" className="text-indigo-600 hover:underline flex items-center gap-1">
          <Download size={14} /> Télécharger
        </a>
      ) : <span className="text-gray-400">-</span>
    },
  ];

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} size="sm" />
        ))}
      </div>

      <DataTable
        data={data}
        columns={columns}
        searchable
        searchPlaceholder="Rechercher une attestation..."
        onRowClick={(item) => { loadDetails(item.id); setIsDetailsOpen(true); }}
        emptyMessage="Aucune attestation trouvée"
        striped
        loading={isLoading}
        renderHeader={() => (
          <div className="px-6 py-4 border-b flex items-center justify-between bg-white">
            <h2 className="font-bold text-gray-900 text-lg">Attestations</h2>
            <button 
              onClick={() => setIsCreateOpen(true)} 
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm transition-colors"
            >
              <Plus size={16} /> Générer une attestation
            </button>
          </div>
        )}
      />

      <FormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Générer une Attestation PDF"
        subtitle="Remplissez les informations pour générer l'attestation"
        fields={attestationFields}
        onSubmit={handleGenerate}
        submitLabel={
        'Generation PDF...'
          
        }
        loading={isGenerating}
        maxWidth="max-w-lg"
        mode="create"
      />

      <DetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={selected?.stagiaire?.users?.username || 'Détails'}
        subtitle={selected?.stagiaire?.matricule}
        sections={getDetailSections()}
        footer={
          selected?.fichier_url ? (
            <a 
              href={selected.fichier_url} 
              target="_blank" 
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm transition-colors"
            >
              <Eye size={14} /> Voir le PDF
            </a>
          ) : undefined
        }
      />
    </div>
  );
}