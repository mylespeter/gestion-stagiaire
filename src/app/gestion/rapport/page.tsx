// app/admin/stagiaires/page.tsx - Version avec filtrage par encadreur
"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DataTable, Column } from '@/components/DataTable';
import { DetailsModal, DetailSection } from '@/components/DetailsModal';
import { FormModal, FormField } from '@/components/FormModal';
import { 
  Eye, Download, Star, FileText, User, Building2, 
  Calendar, Mail, Phone, BookOpen, AlertCircle,
  CheckCircle, Clock, XCircle, GraduationCap,
  RefreshCw, Search, Edit, FileWarning
} from 'lucide-react';

// Types
interface Stagiaire {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  filiere: string;
  niveau: string;
  stage: Stage | null;
}

interface Stage {
  id: string;
  type_stage: string;
  service_accueil: string;
  date_debut: string;
  date_fin: string;
  theme: string;
  statut: string;
  rapport_url: string | null;
  rapport_depose: boolean;
  date_depot_rapport: string | null;
  note_rapport: number | null;
  commentaire_rapport: string | null;
  date_evaluation: string | null;
  created_at?: string;
}

export default function AdminStagiairesPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  const [stagiaires, setStagiaires] = useState<Stagiaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStagiaire, setSelectedStagiaire] = useState<Stagiaire | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isNotationOpen, setIsNotationOpen] = useState(false);
  const [isRapportViewerOpen, setIsRapportViewerOpen] = useState(false);
  const [notationLoading, setNotationLoading] = useState(false);
  const [notationSuccess, setNotationSuccess] = useState('');
  const [notationError, setNotationError] = useState('');
  const [encadreurId, setEncadreurId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      if (user && ['admin', 'coordinateur', 'encadreur'].includes(user.role)) {
        // Si encadreur, récupérer d'abord son ID
        if (user.role === 'encadreur') {
          fetchEncadreurId();
        } else {
          fetchStagiaires();
        }
      } else {
        router.push('/dashboard');
      }
    }
  }, [authLoading, isAuthenticated, user]);

  // Récupérer l'ID de l'encadreur connecté
 
// Remplacer fetchEncadreurId par cette version simplifiée
const fetchEncadreurId = async () => {
    if (!user) return;
    
    // L'encadreur est directement dans la table users avec role='encadreur'
    // On utilise son user.id directement
    setEncadreurId(user.id);
    
    // Charger les stagiaires après
    fetchStagiaires();
  };
const fetchStagiaires = async () => {
    if (!user) return;
    
    setLoading(true);
    setError('');

    try {
      // Récupérer les stagiaires assignés à cet encadreur via les affectations
      let stagiaireIds: string[] = [];
      
      if (user.role === 'encadreur') {
        const { data: affectations } = await supabase
          .from('affectations')
          .select('stagiaire_id')
          .eq('encadreur_id', user.id)  // On utilise directement user.id
          .eq('statut', 'active');

        stagiaireIds = affectations?.map(a => a.stagiaire_id) || [];
        
        if (stagiaireIds.length === 0) {
          setStagiaires([]);
          setLoading(false);
          return;
        }
      }

      // Requête pour récupérer les stagiaires
      let query = supabase
        .from('stagiaires')
        .select(`
          id,
          matricule,
          user_id,
          stages (
            id,
            type_stage,
            service_accueil,
            date_debut,
            date_fin,
            theme,
            statut,
            rapport_url,
            rapport_depose,
            date_depot_rapport,
            note_rapport,
            commentaire_rapport,
            date_evaluation,
            created_at
          )
        `);

      // Appliquer le filtre si encadreur
      if (stagiaireIds.length > 0) {
        query = query.in('id', stagiaireIds);
      }

      const { data: stagiairesData, error: stagiairesError } = await query
        .order('created_at', { ascending: false });

      if (stagiairesError) {
        console.error('Erreur Supabase:', stagiairesError);
        throw new Error(stagiairesError.message);
      }

      if (!stagiairesData || stagiairesData.length === 0) {
        setStagiaires([]);
        setLoading(false);
        return;
      }

      // Récupérer les infos users
      const userIds = stagiairesData
        .map(s => s.user_id)
        .filter(Boolean) as string[];
      
      let usersMap = new Map();
      
      if (userIds.length > 0) {
        const { data: usersData } = await supabase
          .from('users')
          .select('id, email, username, telephone')
          .in('id', userIds);

        usersMap = new Map(usersData?.map(u => [u.id, u]) || []);
      }

      // Transformation
      const transformedData: Stagiaire[] = stagiairesData.map((stagiaire: any) => {
        const userInfo = usersMap.get(stagiaire.user_id) || {};
        const usernameParts = (userInfo.username || stagiaire.matricule || 'Inconnu').split(' ');
        
        const stage = getLatestStage(stagiaire.stages);

        return {
          id: stagiaire.id,
          matricule: stagiaire.matricule || '',
          nom: usernameParts[0] || '',
          prenom: usernameParts.slice(1).join(' ') || '',
          email: userInfo.email || '',
          telephone: userInfo.telephone || '',
          filiere: 'Non définie',
          niveau: 'Non défini',
          stage: stage
        };
      });

      setStagiaires(transformedData);
    } catch (error: any) {
      console.error('Erreur chargement stagiaires:', error);
      setError(error.message || 'Erreur lors du chargement des stagiaires.');
    } finally {
      setLoading(false);
    }
  };

  const getLatestStage = (stages: any[] | null): Stage | null => {
    if (!stages || stages.length === 0) return null;
    
    const sortedStages = stages.sort((a, b) => {
      const dateA = new Date(a.created_at || a.date_debut || 0).getTime();
      const dateB = new Date(b.created_at || b.date_debut || 0).getTime();
      return dateB - dateA;
    });

    const latest = sortedStages[0];
    
    return {
      id: latest.id,
      type_stage: latest.type_stage || '',
      service_accueil: latest.service_accueil || '',
      date_debut: latest.date_debut || '',
      date_fin: latest.date_fin || '',
      theme: latest.theme || '',
      statut: latest.statut || 'en_attente',
      rapport_url: latest.rapport_url || null,
      rapport_depose: latest.rapport_depose || false,
      date_depot_rapport: latest.date_depot_rapport || null,
      note_rapport: latest.note_rapport || null,
      commentaire_rapport: latest.commentaire_rapport || null,
      date_evaluation: latest.date_evaluation || null,
      created_at: latest.created_at || null
    };
  };

  // Formatage de la note avec étoiles
  const renderNoteStars = (note: number | null) => {
    if (note === null || note === undefined) {
      return <span className="text-gray-400 text-xs italic">Non noté</span>;
    }

    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={14}
          className={i <= note ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
        />
      );
    }

    return (
      <div className="flex items-center gap-0.5">
        {stars}
        <span className="ml-1 text-xs font-semibold text-gray-700">{note}/5</span>
      </div>
    );
  };

  const getRapportStatus = (stage: Stage | null) => {
    if (!stage || !stage.rapport_depose) {
      return {
        icon: <FileWarning size={14} className="text-gray-400" />,
        label: 'Non déposé',
        color: 'text-gray-500',
        bg: 'bg-gray-50',
        border: 'border-gray-200'
      };
    }

    if (stage.note_rapport !== null && stage.note_rapport !== undefined) {
      return {
        icon: <CheckCircle size={14} className="text-emerald-500" />,
        label: 'Noté',
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200'
      };
    }

    return {
      icon: <Clock size={14} className="text-amber-500" />,
      label: 'En attente de notation',
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200'
    };
  };

  const columns: Column<Stagiaire>[] = [
    {
      key: 'matricule',
      header: 'Matricule',
      sortable: true,
      maxChars: 12,
      render: (item) => (
        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded-md">
          {item.matricule}
        </span>
      )
    },
    {
      key: 'nom',
      header: 'Stagiaire',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <User size={14} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {item.prenom} {item.nom}
            </p>
            <p className="text-xs text-gray-500">{item.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'filiere',
      header: 'Filière',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-1.5">
          <GraduationCap size={14} className="text-violet-500" />
          <span className="text-sm text-gray-700">{item.filiere} - {item.niveau}</span>
        </div>
      )
    },
    {
      key: 'stage',
      header: 'Stage',
      sortable: true,
      render: (item) => {
        if (!item.stage) {
          return <span className="text-xs text-gray-400 italic">Aucun stage</span>;
        }
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Building2 size={14} className="text-cyan-500" />
              <span className="text-sm text-gray-700">{item.stage.service_accueil || 'N/A'}</span>
            </div>
            {item.stage.date_debut && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Calendar size={12} />
                {new Date(item.stage.date_debut).toLocaleDateString('fr-FR')}
                {item.stage.date_fin && ` → ${new Date(item.stage.date_fin).toLocaleDateString('fr-FR')}`}
              </div>
            )}
          </div>
        );
      }
    },
    {
      key: 'rapport',
      header: 'Rapport',
      sortable: false,
      render: (item) => {
        const status = getRapportStatus(item.stage);
        return (
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color} border ${status.border}`}>
              {status.icon}
              {status.label}
            </span>
            {item.stage?.note_rapport !== null && item.stage?.note_rapport !== undefined && (
              <div className="flex items-center">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-semibold text-gray-700 ml-0.5">{item.stage.note_rapport}/5</span>
              </div>
            )}
          </div>
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
          <button
            onClick={(e) => { e.stopPropagation(); handleViewDetails(item); }}
            className="p-1.5 hover:bg-indigo-50 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors"
            title="Voir détails"
          >
            <Eye size={16} />
          </button>
          {item.stage?.rapport_depose && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handleViewRapport(item); }}
                className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
                title="Voir le rapport"
              >
                <FileText size={16} />
              </button>
              {/* Les encadreurs peuvent aussi noter leurs stagiaires */}
              {user && ['admin', 'coordinateur', 'encadreur'].includes(user.role) && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleOpenNotation(item); }}
                  className="p-1.5 hover:bg-amber-50 rounded-lg text-gray-400 hover:text-amber-600 transition-colors"
                  title={item.stage?.note_rapport ? 'Modifier la note' : 'Noter le rapport'}
                >
                  {item.stage?.note_rapport ? <Edit size={16} /> : <Star size={16} />}
                </button>
              )}
            </>
          )}
        </div>
      )
    }
  ];

  const handleViewDetails = (stagiaire: Stagiaire) => {
    setSelectedStagiaire(stagiaire);
    setIsDetailsOpen(true);
  };

  const handleViewRapport = (stagiaire: Stagiaire) => {
    setSelectedStagiaire(stagiaire);
    setIsRapportViewerOpen(true);
  };

  const handleOpenNotation = (stagiaire: Stagiaire) => {
    setSelectedStagiaire(stagiaire);
    setIsNotationOpen(true);
    setNotationError('');
    setNotationSuccess('');
  };

  const handleSubmitNotation = async (formData: Record<string, any>) => {
    if (!selectedStagiaire?.stage) return;

    setNotationLoading(true);
    setNotationError('');
    setNotationSuccess('');

    try {
      const note = parseFloat(formData.note);
      if (isNaN(note) || note < 0 || note > 5) {
        throw new Error('La note doit être comprise entre 0 et 5');
      }

      const { error: updateError } = await supabase
        .from('stages')
        .update({
          note_rapport: note,
          commentaire_rapport: formData.commentaire || null,
          date_evaluation: new Date().toISOString().split('T')[0]
        })
        .eq('id', selectedStagiaire.stage.id);

      if (updateError) throw updateError;

      setNotationSuccess('Note enregistrée avec succès !');
      setTimeout(() => {
        setIsNotationOpen(false);
        setNotationSuccess('');
        fetchStagiaires();
      }, 1500);
    } catch (error: any) {
      console.error('Erreur notation:', error);
      setNotationError(error.message || 'Erreur lors de l\'enregistrement de la note.');
    } finally {
      setNotationLoading(false);
    }
  };

  const getStagiaireSections = (stagiaire: Stagiaire): DetailSection[] => {
    const sections: DetailSection[] = [
      {
        title: 'Informations personnelles',
        fields: [
          { label: 'Matricule', value: stagiaire.matricule, icon: <User size={14} /> },
          { label: 'Nom complet', value: `${stagiaire.prenom} ${stagiaire.nom}` },
          { label: 'Email', value: stagiaire.email || 'Non renseigné', icon: <Mail size={14} /> },
          { label: 'Téléphone', value: stagiaire.telephone || 'Non renseigné', icon: <Phone size={14} /> },
          { label: 'Filière', value: stagiaire.filiere, icon: <GraduationCap size={14} /> },
          { label: 'Niveau', value: stagiaire.niveau, icon: <BookOpen size={14} /> },
        ]
      }
    ];

    if (stagiaire.stage) {
      sections.push({
        title: 'Informations du stage',
        fields: [
          { label: 'Type de stage', value: stagiaire.stage.type_stage || 'Non défini', icon: <Building2 size={14} /> },
          { label: 'Service d\'accueil', value: stagiaire.stage.service_accueil || 'Non défini' },
          { 
            label: 'Date de début', 
            value: stagiaire.stage.date_debut ? new Date(stagiaire.stage.date_debut).toLocaleDateString('fr-FR', {
              year: 'numeric', month: 'long', day: 'numeric'
            }) : 'N/A',
            icon: <Calendar size={14} />
          },
          { 
            label: 'Date de fin', 
            value: stagiaire.stage.date_fin ? new Date(stagiaire.stage.date_fin).toLocaleDateString('fr-FR', {
              year: 'numeric', month: 'long', day: 'numeric'
            }) : 'N/A',
            icon: <Calendar size={14} />
          },
          { label: 'Thème', value: stagiaire.stage.theme || 'Non défini', span: 'full' },
          {
            label: 'Statut',
            value: (
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                stagiaire.stage.statut === 'en_cours' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                stagiaire.stage.statut === 'termine' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                'bg-gray-50 text-gray-700 border border-gray-200'
              }`}>
                {stagiaire.stage.statut === 'en_cours' && <CheckCircle size={12} />}
                {stagiaire.stage.statut === 'termine' && <CheckCircle size={12} />}
                {stagiaire.stage.statut || 'Non défini'}
              </span>
            )
          }
        ]
      });

      if (stagiaire.stage.rapport_depose) {
        sections.push({
          title: 'Rapport de stage',
          fields: [
            {
              label: 'Statut rapport',
              value: (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle size={12} />
                  Déposé le {stagiaire.stage.date_depot_rapport ? new Date(stagiaire.stage.date_depot_rapport).toLocaleDateString('fr-FR', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  }) : 'N/A'}
                </span>
              ),
              span: 'full'
            },
            { label: 'Note', value: renderNoteStars(stagiaire.stage.note_rapport), span: 'full' },
            { label: 'Commentaire', value: stagiaire.stage.commentaire_rapport || 'Aucun commentaire', span: 'full' },
            { 
              label: 'Date d\'évaluation', 
              value: stagiaire.stage.date_evaluation ? new Date(stagiaire.stage.date_evaluation).toLocaleDateString('fr-FR', {
                year: 'numeric', month: 'long', day: 'numeric'
              }) : 'Non évalué',
              span: 'full' 
            }
          ]
        });
      }
    }

    return sections;
  };

  const notationFields: FormField[] = [
    {
      name: 'note',
      label: 'Note sur 5',
      type: 'number',
      required: true,
      placeholder: 'Attribuez une note de 0 à 5',
    },
    {
      name: 'commentaire',
      label: 'Commentaire (optionnel)',
      type: 'textarea',
      required: false,
      placeholder: 'Votre évaluation détaillée du rapport...',
    }
  ];

  const filteredStagiaires = stagiaires.filter(stagiaire => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      stagiaire.matricule?.toLowerCase().includes(searchLower) ||
      stagiaire.nom?.toLowerCase().includes(searchLower) ||
      stagiaire.prenom?.toLowerCase().includes(searchLower) ||
      stagiaire.email?.toLowerCase().includes(searchLower) ||
      stagiaire.filiere?.toLowerCase().includes(searchLower)
    );
  });

  const handleExport = () => {
    const csvContent = [
      ['Matricule', 'Nom', 'Prénom', 'Email', 'Filière', 'Niveau', 'Service', 'Statut Stage', 'Rapport', 'Note'].join(','),
      ...filteredStagiaires.map(s => [
        s.matricule, s.nom, s.prenom, s.email, s.filiere, s.niveau,
        s.stage?.service_accueil || 'N/A', s.stage?.statut || 'N/A',
        s.stage?.rapport_depose ? 'Déposé' : 'Non déposé',
        s.stage?.note_rapport || 'Non noté'
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `stagiaires_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderHeader = () => (
    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-4 flex-wrap bg-white">
      <div className="flex items-center gap-4">
        <h2 className="font-bold text-gray-900 text-lg tracking-tight whitespace-nowrap">
          {user?.role === 'encadreur' ? 'Mes stagiaires' : 'Liste des stagiaires'}
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Rechercher un stagiaire..."
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
        <button onClick={fetchStagiaires} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm transition-colors text-gray-600 font-medium">
          <RefreshCw size={14} />
          <span className="hidden sm:inline">Actualiser</span>
        </button>
        {user?.role !== 'encadreur' && (
          <button onClick={handleExport} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors">
            <Download size={14} />
            <span className="hidden sm:inline">Exporter</span>
          </button>
        )}
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
          <button onClick={fetchStagiaires} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-sm font-semibold transition-all mx-auto">
            <RefreshCw size={16} /> Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* En-tête avec rôle affiché */}
      <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full -mr-20 -mt-20" />
        <div className="relative p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.role === 'encadreur' ? 'Mes stagiaires' : 'Gestion des stagiaires'}
              </h1>
              <p className="text-sm text-gray-500 mt-1.5">
                {user?.role === 'encadreur' 
                  ? 'Gérez les rapports de vos stagiaires assignés' 
                  : 'Consultez les stagiaires, leurs rapports et attribuez des notes'
                }
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stagiaires.length}</p>
                <p className="text-xs text-gray-500">
                  {user?.role === 'encadreur' ? 'mes stagiaires' : 'stagiaires'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">
                  {stagiaires.filter(s => s.stage?.rapport_depose).length}
                </p>
                <p className="text-xs text-gray-500">rapports déposés</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">
                  {stagiaires.filter(s => s.stage?.note_rapport !== null && s.stage?.note_rapport !== undefined).length}
                </p>
                <p className="text-xs text-gray-500">rapports notés</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau */}
      <DataTable
        data={filteredStagiaires}
        columns={columns}
        renderHeader={renderHeader}
        onRowClick={handleViewDetails}
        selectable={false}
        defaultRowsPerPage={15}
        rowsPerPageOptions={[10, 15, 25, 50]}
        emptyMessage={
          user?.role === 'encadreur' 
            ? "Aucun stagiaire ne vous est assigné pour le moment" 
            : "Aucun stagiaire trouvé"
        }
        minWidth="1000px"
      />

      {/* Modal Détails */}
      <DetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={selectedStagiaire ? `${selectedStagiaire.prenom} ${selectedStagiaire.nom}` : ''}
        subtitle={selectedStagiaire && (
          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{selectedStagiaire.matricule}</span>
        )}
        avatar={selectedStagiaire && (
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <User size={20} className="text-indigo-600" />
          </div>
        )}
        sections={selectedStagiaire ? getStagiaireSections(selectedStagiaire) : []}
        footer={
          <div className="flex gap-2 w-full justify-end">
            <button onClick={() => setIsDetailsOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Fermer
            </button>
            {selectedStagiaire?.stage?.rapport_depose && (
              <>
                <button onClick={() => { setIsDetailsOpen(false); setTimeout(() => selectedStagiaire && handleViewRapport(selectedStagiaire), 100); }}
                  className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2">
                  <FileText size={14} /> Voir le rapport
                </button>
                <button onClick={() => { setIsDetailsOpen(false); setTimeout(() => selectedStagiaire && handleOpenNotation(selectedStagiaire), 100); }}
                  className="px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-2">
                  <Star size={14} /> {selectedStagiaire.stage?.note_rapport ? 'Modifier la note' : 'Noter'}
                </button>
              </>
            )}
          </div>
        }
      />

      {/* Modal Visualisation Rapport */}
      {isRapportViewerOpen && selectedStagiaire?.stage?.rapport_url && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsRapportViewerOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Rapport de {selectedStagiaire.prenom} {selectedStagiaire.nom}</h3>
                <p className="text-sm text-gray-500">
                  Déposé le {selectedStagiaire.stage.date_depot_rapport ? new Date(selectedStagiaire.stage.date_depot_rapport).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a href={selectedStagiaire.stage.rapport_url} download target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download size={16} /> Télécharger
                </a>
                <button onClick={() => setIsRapportViewerOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <XCircle size={20} className="text-gray-400" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-0 bg-gray-100">
              <iframe src={selectedStagiaire.stage.rapport_url} className="w-full h-[75vh] rounded-b-2xl" title="Rapport de stage" />
            </div>
          </div>
        </div>
      )}

      {/* Modal Notation */}
      {isNotationOpen && (
        <>
          <div className="fixed top-4 right-4 z-[60] space-y-2">
            {notationError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 shadow-lg max-w-md">
                <AlertCircle size={18} className="text-red-500" />
                <p className="text-sm text-red-700">{notationError}</p>
              </div>
            )}
            {notationSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 shadow-lg max-w-md">
                <CheckCircle size={18} className="text-emerald-500" />
                <p className="text-sm text-emerald-700">{notationSuccess}</p>
              </div>
            )}
          </div>

          <FormModal
            isOpen={isNotationOpen}
            onClose={() => { setIsNotationOpen(false); setNotationError(''); setNotationSuccess(''); }}
            title={`Noter le rapport - ${selectedStagiaire?.prenom} ${selectedStagiaire?.nom}`}
            subtitle="Attribuez une note de 0 à 5 et un commentaire optionnel"
            fields={notationFields}
            onSubmit={handleSubmitNotation}
            submitLabel={notationLoading ? "Enregistrement..." : "Enregistrer la note"}
            loading={notationLoading}
            maxWidth="max-w-lg"
            mode="create"
            initialData={selectedStagiaire?.stage ? {
              note: selectedStagiaire.stage.note_rapport || '',
              commentaire: selectedStagiaire.stage.commentaire_rapport || ''
            } : {}}
          />
        </>
      )}
    </div>
  );
}