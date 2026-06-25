// // app/organisation/page.tsx
// "use client";

// import { useState, useEffect } from 'react';
// import { DataTable, Column } from '@/components/DataTable';
// import { DetailsModal, DetailSection } from '@/components/DetailsModal';
// import { FormModal, FormField } from '@/components/FormModal';
// import { supabase } from '@/lib/supabase';
// import type { DepartementRecord, ServiceRecord, Departement, Service } from '@/types/organisation';
// import { Building2, Layers, Plus, Edit, Trash2, Users, MapPin } from 'lucide-react';

// export default function OrganisationPage() {
//   const [activeTab, setActiveTab] = useState<'departements' | 'services'>('departements');
//   const [departements, setDepartements] = useState<DepartementRecord[]>([]);
//   const [services, setServices] = useState<ServiceRecord[]>([]);
//   const [selectedDepartement, setSelectedDepartement] = useState<Departement | null>(null);
//   const [selectedService, setSelectedService] = useState<Service | null>(null);
//   const [isDetailsOpen, setIsDetailsOpen] = useState(false);
//   const [isCreateOpen, setIsCreateOpen] = useState(false);
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [createMode, setCreateMode] = useState<'departement' | 'service'>('departement');

//   useEffect(() => {
//     fetchDepartements();
//     fetchServices();
//   }, []);

//   const fetchDepartements = async () => {
//     const { data } = await supabase
//       .from('departements')
//       .select('*, services:id, responsable:responsable_id(id, username, email)')
//       .order('nom');

//     if (data) {
//       const formatted: DepartementRecord[] = data.map((d: any) => ({
//         id: d.id,
//         nom: d.nom,
//         code: d.code,
//         description: d.description || '',
//         nombre_services: d.services?.length || 0,
//         responsable: d.responsable?.username || 'Non assigné'
//       }));
//       setDepartements(formatted);
//     }
//   };

//   const fetchServices = async () => {
//     const { data } = await supabase
//       .from('services')
//       .select('*, departement:departement_id(id, nom, code), responsable:responsable_id(id, username, email)')
//       .order('nom');

//     if (data) {
//       const formatted: ServiceRecord[] = data.map((s: any) => ({
//         id: s.id,
//         nom: s.nom,
//         code: s.code,
//         departement: s.departement?.nom || '',
//         description: s.description || '',
//         responsable: s.responsable?.username || 'Non assigné'
//       }));
//       setServices(formatted);
//     }
//   };

//   // ============ HANDLERS ============

//   const handleCreateDepartement = async (formData: Record<string, any>) => {
//     const { error } = await supabase.from('departements').insert({
//       nom: formData.nom,
//       code: formData.code.toUpperCase(),
//       description: formData.description || null
//     });
//     if (error) throw error;
//     await fetchDepartements();
//     setIsCreateOpen(false);
//   };

//   const handleCreateService = async (formData: Record<string, any>) => {
//     const { error } = await supabase.from('services').insert({
//       departement_id: parseInt(formData.departement_id),
//       nom: formData.nom,
//       code: formData.code.toUpperCase(),
//       description: formData.description || null
//     });
//     if (error) throw error;
//     await fetchServices();
//     setIsCreateOpen(false);
//   };

//   const handleEditDepartement = async (formData: Record<string, any>) => {
//     if (!selectedDepartement) return;
//     const { error } = await supabase.from('departements').update({
//       nom: formData.nom,
//       code: formData.code.toUpperCase(),
//       description: formData.description || null
//     }).eq('id', selectedDepartement.id);
//     if (error) throw error;
//     await fetchDepartements();
//     setIsEditOpen(false);
//   };

//   const handleEditService = async (formData: Record<string, any>) => {
//     if (!selectedService) return;
//     const { error } = await supabase.from('services').update({
//       nom: formData.nom,
//       code: formData.code.toUpperCase(),
//       description: formData.description || null
//     }).eq('id', selectedService.id);
//     if (error) throw error;
//     await fetchServices();
//     setIsEditOpen(false);
//   };

//   const handleDeleteDepartement = async (id: number) => {
//     if (!confirm('Supprimer ce département ? Tous les services associés seront supprimés.')) return;
//     await supabase.from('departements').delete().eq('id', id);
//     await fetchDepartements();
//     setIsDetailsOpen(false);
//   };

//   const handleDeleteService = async (id: number) => {
//     if (!confirm('Supprimer ce service ?')) return;
//     await supabase.from('services').delete().eq('id', id);
//     await fetchServices();
//     setIsDetailsOpen(false);
//   };

//   const handleRowClick = async (item: any) => {
//     if (activeTab === 'departements') {
//       const { data } = await supabase
//         .from('departements')
//         .select('*, services(*, responsable:responsable_id(id, username)), responsable:responsable_id(id, username, email)')
//         .eq('id', item.id)
//         .single();
//       if (data) {
//         setSelectedDepartement(data as Departement);
//         setSelectedService(null);
//         setIsDetailsOpen(true);
//       }
//     } else {
//       const { data } = await supabase
//         .from('services')
//         .select('*, departement:departement_id(*), responsable:responsable_id(id, username, email)')
//         .eq('id', item.id)
//         .single();
//       if (data) {
//         setSelectedService(data as Service);
//         setSelectedDepartement(null);
//         setIsDetailsOpen(true);
//       }
//     }
//   };

//   // ============ CHAMPS ============

//   const departementFields: FormField[] = [
//     { name: 'nom', label: 'Nom du département', type: 'text', placeholder: 'Ex: Informatique', required: true, icon: <Building2 size={14} /> },
//     { name: 'code', label: 'Code', type: 'text', placeholder: 'Ex: INFO', required: true, hint: 'Code unique (max 10 caractères)', span: 'half' },
//     { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Description du département...', span: 'full' },
//   ];

//   const serviceFields: FormField[] = [
//     { 
//       name: 'departement_id', 
//       label: 'Département', 
//       type: 'select', 
//       required: true,
//       options: departements.map(d => ({ value: String(d.id), label: `${d.nom} (${d.code})` }))
//     },
//     { name: 'nom', label: 'Nom du service', type: 'text', placeholder: 'Ex: Développement Web', required: true, icon: <Layers size={14} /> },
//     { name: 'code', label: 'Code', type: 'text', placeholder: 'Ex: WEB', required: true, hint: 'Code unique dans le département', span: 'half' },
//     { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Description du service...', span: 'full' },
//   ];

//   // ============ COLONNES ============

//   const departementColumns: Column<DepartementRecord>[] = [
//     { key: 'nom', header: 'Département', sortable: true },
//     { key: 'code', header: 'Code', sortable: true },
//     { key: 'description', header: 'Description', maxChars: 50 },
//     { key: 'nombre_services', header: 'Services', className: 'text-center' },
//     { key: 'responsable', header: 'Responsable' },
//   ];

//   const serviceColumns: Column<ServiceRecord>[] = [
//     { key: 'nom', header: 'Service', sortable: true },
//     { key: 'code', header: 'Code', sortable: true },
//     { key: 'departement', header: 'Département', sortable: true },
//     { key: 'description', header: 'Description', maxChars: 50 },
//     { key: 'responsable', header: 'Responsable' },
//   ];

//   // ============ SECTIONS DÉTAILS ============

//   const getDetailSections = (): DetailSection[] => {
//     if (selectedDepartement) {
//       const sections: DetailSection[] = [
//         {
//           title: '🏢 Département',
//           fields: [
//             { label: 'Nom', value: selectedDepartement.nom, icon: <Building2 size={14} />, span: 'half' },
//             { label: 'Code', value: selectedDepartement.code, span: 'half' },
//             { label: 'Description', value: selectedDepartement.description || 'N/A', span: 'full' },
//             { label: 'Responsable', value: selectedDepartement.responsable?.username || 'Non assigné', icon: <Users size={14} />, span: 'half' },
//             { label: 'Services', value: selectedDepartement.services?.length || 0, span: 'half' },
//           ]
//         }
//       ];

//       if (selectedDepartement.services && selectedDepartement.services.length > 0) {
//         sections.push({
//           title: '📂 Services',
//           fields: selectedDepartement.services.map(s => ({
//             label: s.code,
//             value: s.nom,
//             icon: <Layers size={14} />,
//             span: 'half' as const
//           }))
//         });
//       }

//       return sections;
//     }

//     if (selectedService) {
//       return [
//         {
//           title: '🔧 Service',
//           fields: [
//             { label: 'Nom', value: selectedService.nom, icon: <Layers size={14} />, span: 'half' },
//             { label: 'Code', value: selectedService.code, span: 'half' },
//             { label: 'Département', value: selectedService.departement?.nom || 'N/A', icon: <Building2 size={14} />, span: 'half' },
//             { label: 'Description', value: selectedService.description || 'N/A', span: 'full' },
//             { label: 'Responsable', value: selectedService.responsable?.username || 'Non assigné', icon: <Users size={14} />, span: 'half' },
//           ]
//         }
//       ];
//     }

//     return [];
//   };

//   const getDetailFooter = () => (
//     <div className="flex gap-2">
//       {selectedDepartement && (
//         <>
//           <button onClick={() => { setIsDetailsOpen(false); setTimeout(() => { setCreateMode('service'); setIsCreateOpen(true); }, 100); }} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
//             <Plus size={14} /> Ajouter service
//           </button>
//           <button onClick={() => { setIsDetailsOpen(false); setTimeout(() => setIsEditOpen(true), 100); }} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
//             <Edit size={14} /> Modifier
//           </button>
//           <button onClick={() => handleDeleteDepartement(selectedDepartement.id)} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
//             <Trash2 size={14} /> Supprimer
//           </button>
//         </>
//       )}
//       {selectedService && (
//         <>
//           <button onClick={() => { setIsDetailsOpen(false); setTimeout(() => setIsEditOpen(true), 100); }} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
//             <Edit size={14} /> Modifier
//           </button>
//           <button onClick={() => handleDeleteService(selectedService.id)} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
//             <Trash2 size={14} /> Supprimer
//           </button>
//         </>
//       )}
//     </div>
//   );

//   const renderHeader = () => (
//     <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-4 flex-wrap bg-white">
//       <div className="flex items-center gap-2">
//         <h2 className="font-bold text-gray-900 text-lg">Organisation</h2>
//       </div>
//       <div className="flex items-center gap-2">
//         <button
//           onClick={() => { setCreateMode('departement'); setIsCreateOpen(true); }}
//           className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
//         >
//           <Plus size={16} /> Département
//         </button>
//         <button
//           onClick={() => { setCreateMode('service'); setIsCreateOpen(true); }}
//           className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
//         >
//           <Plus size={16} /> Service
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="p-6 max-w-[1400px] mx-auto">
//       {/* Tabs */}
//       <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
//         <button
//           onClick={() => setActiveTab('departements')}
//           className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//             activeTab === 'departements' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
//           }`}
//         >
//           <Building2 size={14} className="inline mr-1.5" />
//           Départements ({departements.length})
//         </button>
//         <button
//           onClick={() => setActiveTab('services')}
//           className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//             activeTab === 'services' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
//           }`}
//         >
//           <Layers size={14} className="inline mr-1.5" />
//           Services ({services.length})
//         </button>
//       </div>

//       {activeTab === 'departements' ? (
//         <DataTable
//           data={departements}
//           columns={departementColumns}
//           searchable={true}
//           searchPlaceholder="Rechercher un département..."
//           onRowClick={handleRowClick}
//           emptyMessage="Aucun département trouvé"
//           striped
//           renderHeader={renderHeader}
//               loading={isLoading}
//         />
//       ) : (
//         <DataTable
//           data={services}
//           columns={serviceColumns}
//           searchable={true}
//           searchPlaceholder="Rechercher un service..."
//           onRowClick={handleRowClick}
//           emptyMessage="Aucun service trouvé"
//           striped
//           renderHeader={renderHeader}
//               loading={isLoading}
//         />
//       )}

//       {/* Modal Création */}
//       <FormModal
//         isOpen={isCreateOpen}
//         onClose={() => setIsCreateOpen(false)}
//         title={createMode === 'departement' ? 'Nouveau Département' : 'Nouveau Service'}
//         fields={createMode === 'departement' ? departementFields : serviceFields}
//         onSubmit={createMode === 'departement' ? handleCreateDepartement : handleCreateService}
//         submitLabel="Créer"
//         maxWidth="max-w-lg"
//         mode="create"
//       />

//       {/* Modal Modification */}
//       <FormModal
//         isOpen={isEditOpen}
//         onClose={() => setIsEditOpen(false)}
//         title={selectedDepartement ? 'Modifier le Département' : 'Modifier le Service'}
//         fields={
//           selectedDepartement 
//             ? departementFields 
//             : serviceFields
//         }
//         onSubmit={selectedDepartement ? handleEditDepartement : handleEditService}
//         submitLabel="Enregistrer"
//         maxWidth="max-w-lg"
//         mode="edit"
//         initialData={
//           selectedDepartement
//             ? { nom: selectedDepartement.nom, code: selectedDepartement.code, description: selectedDepartement.description || '' }
//             : selectedService
//               ? { nom: selectedService.nom, code: selectedService.code, description: selectedService.description || '', departement_id: String(selectedService.departement_id) }
//               : {}
//         }
//       />

//       {/* Modal Détails */}
//       <DetailsModal
//         isOpen={isDetailsOpen}
//         onClose={() => setIsDetailsOpen(false)}
//         title={selectedDepartement?.nom || selectedService?.nom || ''}
//         subtitle={
//           <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
//             {selectedDepartement?.code || selectedService?.code}
//           </span>
//         }
//         avatar={(selectedDepartement?.nom || selectedService?.nom)?.charAt(0).toUpperCase()}
//         sections={getDetailSections()}
//         footer={getDetailFooter()}
//       />
//     </div>
//   );
// }

// app/organisation/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { DataTable, Column } from '@/components/DataTable';
import { DetailsModal, DetailSection } from '@/components/DetailsModal';
import { FormModal, FormField } from '@/components/FormModal';
import { supabase } from '@/lib/supabase';
import type { DepartementRecord, ServiceRecord, Departement, Service } from '@/types/organisation';
import { Building2, Layers, Plus, Edit, Trash2, Users, MapPin } from 'lucide-react';

export default function OrganisationPage() {
  const [activeTab, setActiveTab] = useState<'departements' | 'services'>('departements');
  const [departements, setDepartements] = useState<DepartementRecord[]>([]);
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [selectedDepartement, setSelectedDepartement] = useState<Departement | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // ✅ Changé à true
  const [createMode, setCreateMode] = useState<'departement' | 'service'>('departement');

  useEffect(() => {
    fetchData(); // ✅ Appel unique qui gère le loading
  }, []);

  // ✅ Nouvelle fonction pour gérer le chargement initial
  const fetchData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchDepartements(), fetchServices()]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDepartements = async () => {
    const { data } = await supabase
      .from('departements')
      .select('*, services:id, responsable:responsable_id(id, username, email)')
      .order('nom');

    if (data) {
      const formatted: DepartementRecord[] = data.map((d: any) => ({
        id: d.id,
        nom: d.nom,
        code: d.code,
        description: d.description || '',
        nombre_services: d.services?.length || 0,
        responsable: d.responsable?.username || 'Non assigné'
      }));
      setDepartements(formatted);
    }
  };

  const fetchServices = async () => {
    const { data } = await supabase
      .from('services')
      .select('*, departement:departement_id(id, nom, code), responsable:responsable_id(id, username, email)')
      .order('nom');

    if (data) {
      const formatted: ServiceRecord[] = data.map((s: any) => ({
        id: s.id,
        nom: s.nom,
        code: s.code,
        departement: s.departement?.nom || '',
        description: s.description || '',
        responsable: s.responsable?.username || 'Non assigné'
      }));
      setServices(formatted);
    }
  };

  // ============ HANDLERS ============

  const handleCreateDepartement = async (formData: Record<string, any>) => {
    const { error } = await supabase.from('departements').insert({
      nom: formData.nom,
      code: formData.code.toUpperCase(),
      description: formData.description || null
    });
    if (error) throw error;
    await fetchDepartements();
    setIsCreateOpen(false);
  };

  const handleCreateService = async (formData: Record<string, any>) => {
    const { error } = await supabase.from('services').insert({
      departement_id: parseInt(formData.departement_id),
      nom: formData.nom,
      code: formData.code.toUpperCase(),
      description: formData.description || null
    });
    if (error) throw error;
    await fetchServices();
    setIsCreateOpen(false);
  };

  const handleEditDepartement = async (formData: Record<string, any>) => {
    if (!selectedDepartement) return;
    const { error } = await supabase.from('departements').update({
      nom: formData.nom,
      code: formData.code.toUpperCase(),
      description: formData.description || null
    }).eq('id', selectedDepartement.id);
    if (error) throw error;
    await fetchDepartements();
    setIsEditOpen(false);
  };

  const handleEditService = async (formData: Record<string, any>) => {
    if (!selectedService) return;
    const { error } = await supabase.from('services').update({
      nom: formData.nom,
      code: formData.code.toUpperCase(),
      description: formData.description || null
    }).eq('id', selectedService.id);
    if (error) throw error;
    await fetchServices();
    setIsEditOpen(false);
  };

  const handleDeleteDepartement = async (id: number) => {
    if (!confirm('Supprimer ce département ? Tous les services associés seront supprimés.')) return;
    await supabase.from('departements').delete().eq('id', id);
    await fetchDepartements();
    setIsDetailsOpen(false);
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm('Supprimer ce service ?')) return;
    await supabase.from('services').delete().eq('id', id);
    await fetchServices();
    setIsDetailsOpen(false);
  };

  const handleRowClick = async (item: any) => {
    if (activeTab === 'departements') {
      const { data } = await supabase
        .from('departements')
        .select('*, services(*, responsable:responsable_id(id, username)), responsable:responsable_id(id, username, email)')
        .eq('id', item.id)
        .single();
      if (data) {
        setSelectedDepartement(data as Departement);
        setSelectedService(null);
        setIsDetailsOpen(true);
      }
    } else {
      const { data } = await supabase
        .from('services')
        .select('*, departement:departement_id(*), responsable:responsable_id(id, username, email)')
        .eq('id', item.id)
        .single();
      if (data) {
        setSelectedService(data as Service);
        setSelectedDepartement(null);
        setIsDetailsOpen(true);
      }
    }
  };

  // ============ CHAMPS ============

  const departementFields: FormField[] = [
    { name: 'nom', label: 'Nom du département', type: 'text', placeholder: 'Ex: Informatique', required: true, icon: <Building2 size={14} /> },
    { name: 'code', label: 'Code', type: 'text', placeholder: 'Ex: INFO', required: true, hint: 'Code unique (max 10 caractères)', span: 'half' },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Description du département...', span: 'full' },
  ];

  const serviceFields: FormField[] = [
    { 
      name: 'departement_id', 
      label: 'Département', 
      type: 'select', 
      required: true,
      options: departements.map(d => ({ value: String(d.id), label: `${d.nom} (${d.code})` }))
    },
    { name: 'nom', label: 'Nom du service', type: 'text', placeholder: 'Ex: Développement Web', required: true, icon: <Layers size={14} /> },
    { name: 'code', label: 'Code', type: 'text', placeholder: 'Ex: WEB', required: true, hint: 'Code unique dans le département', span: 'half' },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Description du service...', span: 'full' },
  ];

  // ============ COLONNES ============

  const departementColumns: Column<DepartementRecord>[] = [
    { key: 'nom', header: 'Département', sortable: true },
    { key: 'code', header: 'Code', sortable: true },
    { key: 'description', header: 'Description', maxChars: 50 },
    { key: 'nombre_services', header: 'Services', className: 'text-center' },
    { key: 'responsable', header: 'Responsable' },
  ];

  const serviceColumns: Column<ServiceRecord>[] = [
    { key: 'nom', header: 'Service', sortable: true },
    { key: 'code', header: 'Code', sortable: true },
    { key: 'departement', header: 'Département', sortable: true },
    { key: 'description', header: 'Description', maxChars: 50 },
    { key: 'responsable', header: 'Responsable' },
  ];

  // ============ SECTIONS DÉTAILS ============

  const getDetailSections = (): DetailSection[] => {
    if (selectedDepartement) {
      const sections: DetailSection[] = [
        {
          title: '🏢 Département',
          fields: [
            { label: 'Nom', value: selectedDepartement.nom, icon: <Building2 size={14} />, span: 'half' },
            { label: 'Code', value: selectedDepartement.code, span: 'half' },
            { label: 'Description', value: selectedDepartement.description || 'N/A', span: 'full' },
            { label: 'Responsable', value: selectedDepartement.responsable?.username || 'Non assigné', icon: <Users size={14} />, span: 'half' },
            { label: 'Services', value: selectedDepartement.services?.length || 0, span: 'half' },
          ]
        }
      ];

      if (selectedDepartement.services && selectedDepartement.services.length > 0) {
        sections.push({
          title: '📂 Services',
          fields: selectedDepartement.services.map(s => ({
            label: s.code,
            value: s.nom,
            icon: <Layers size={14} />,
            span: 'half' as const
          }))
        });
      }

      return sections;
    }

    if (selectedService) {
      return [
        {
          title: '🔧 Service',
          fields: [
            { label: 'Nom', value: selectedService.nom, icon: <Layers size={14} />, span: 'half' },
            { label: 'Code', value: selectedService.code, span: 'half' },
            { label: 'Département', value: selectedService.departement?.nom || 'N/A', icon: <Building2 size={14} />, span: 'half' },
            { label: 'Description', value: selectedService.description || 'N/A', span: 'full' },
            { label: 'Responsable', value: selectedService.responsable?.username || 'Non assigné', icon: <Users size={14} />, span: 'half' },
          ]
        }
      ];
    }

    return [];
  };

  const getDetailFooter = () => (
    <div className="flex gap-2">
      {selectedDepartement && (
        <>
          <button onClick={() => { setIsDetailsOpen(false); setTimeout(() => { setCreateMode('service'); setIsCreateOpen(true); }, 100); }} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
            <Plus size={14} /> Ajouter service
          </button>
          <button onClick={() => { setIsDetailsOpen(false); setTimeout(() => setIsEditOpen(true), 100); }} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Edit size={14} /> Modifier
          </button>
          <button onClick={() => handleDeleteDepartement(selectedDepartement.id)} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
            <Trash2 size={14} /> Supprimer
          </button>
        </>
      )}
      {selectedService && (
        <>
          <button onClick={() => { setIsDetailsOpen(false); setTimeout(() => setIsEditOpen(true), 100); }} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Edit size={14} /> Modifier
          </button>
          <button onClick={() => handleDeleteService(selectedService.id)} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
            <Trash2 size={14} /> Supprimer
          </button>
        </>
      )}
    </div>
  );

  const renderHeader = () => (
    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-4 flex-wrap bg-white">
      <div className="flex items-center gap-2">
        <h2 className="font-bold text-gray-900 text-lg">Organisation</h2>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => { setCreateMode('departement'); setIsCreateOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
        >
          <Plus size={16} /> Département
        </button>
        <button
          onClick={() => { setCreateMode('service'); setIsCreateOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
        >
          <Plus size={16} /> Service
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('departements')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'departements' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Building2 size={14} className="inline mr-1.5" />
          Départements ({departements.length})
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'services' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Layers size={14} className="inline mr-1.5" />
          Services ({services.length})
        </button>
      </div>

      {activeTab === 'departements' ? (
        <DataTable
          data={departements}
          columns={departementColumns}
          searchable={true}
          searchPlaceholder="Rechercher un département..."
          onRowClick={handleRowClick}
          emptyMessage="Aucun département trouvé"
          striped
          loading={isLoading}
          renderHeader={renderHeader}
        />
      ) : (
        <DataTable
          data={services}
          columns={serviceColumns}
          searchable={true}
          searchPlaceholder="Rechercher un service..."
          onRowClick={handleRowClick}
          emptyMessage="Aucun service trouvé"
          striped
          loading={isLoading}
          renderHeader={renderHeader}
        />
      )}

      {/* Modal Création */}
      <FormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title={createMode === 'departement' ? 'Nouveau Département' : 'Nouveau Service'}
        fields={createMode === 'departement' ? departementFields : serviceFields}
        onSubmit={createMode === 'departement' ? handleCreateDepartement : handleCreateService}
        submitLabel="Créer"
        maxWidth="max-w-lg"
        mode="create"
      />

      {/* Modal Modification */}
      <FormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={selectedDepartement ? 'Modifier le Département' : 'Modifier le Service'}
        fields={
          selectedDepartement 
            ? departementFields 
            : serviceFields
        }
        onSubmit={selectedDepartement ? handleEditDepartement : handleEditService}
        submitLabel="Enregistrer"
        maxWidth="max-w-lg"
        mode="edit"
        initialData={
          selectedDepartement
            ? { nom: selectedDepartement.nom, code: selectedDepartement.code, description: selectedDepartement.description || '' }
            : selectedService
              ? { nom: selectedService.nom, code: selectedService.code, description: selectedService.description || '', departement_id: String(selectedService.departement_id) }
              : {}
        }
      />

      {/* Modal Détails */}
      <DetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={selectedDepartement?.nom || selectedService?.nom || ''}
        subtitle={
          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
            {selectedDepartement?.code || selectedService?.code}
          </span>
        }
        avatar={(selectedDepartement?.nom || selectedService?.nom)?.charAt(0).toUpperCase()}
        sections={getDetailSections()}
        footer={getDetailFooter()}
      />
    </div>
  );
}