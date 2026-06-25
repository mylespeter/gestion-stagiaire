// app/encadrement/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { DataTable, Column } from '@/components/DataTable';
import { DetailsModal, DetailSection } from '@/components/DetailsModal';
import { StatCard } from '@/components/ui/StatCard';
import { supabase } from '@/lib/supabase';
import { 
  Users, UserCheck, UserPlus, GraduationCap, Building2, 
  Calendar, Mail, Phone, Briefcase, ArrowRight, Clock
} from 'lucide-react';

// Types
interface EncadreurRecord {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  nombre_stagiaires: number;
  stagiaires_actifs: number;
  departement: string;
}

interface EncadreurDetail {
  id: number;
  username: string;
  email: string;
  telephone: string;
  created_at: string;
  stagiaires: StagiaireAffecte[];
}

interface StagiaireAffecte {
  id: number;
  username: string;
  matricule: string;
  email: string;
  service: string;
  departement: string;
  date_debut: string;
  date_fin: string | null;
  statut: string;
}

// Avatar avec initiales
function AvatarInitials({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl'
  };

  const colors = [
    'bg-indigo-100 text-indigo-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
    'bg-cyan-100 text-cyan-700',
    'bg-violet-100 text-violet-700',
  ];

  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    return parts.length >= 2 
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
  };

  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;

  return (
    <div className={`${sizeClasses[size]} ${colors[colorIndex]} rounded-full flex items-center justify-center font-semibold flex-shrink-0`}>
      {getInitials(name)}
    </div>
  );
}

// Badge de statut
function StatusBadge({ statut }: { statut: string }) {
  const config: Record<string, { label: string; className: string }> = {
    'active': { 
      label: 'En cours', 
      className: 'bg-green-50 text-green-700 border-green-200'
    },
    'terminee': { 
      label: 'Terminée', 
      className: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    'annulee': { 
      label: 'Annulée', 
      className: 'bg-red-50 text-red-700 border-red-200'
    }
  };

  const c = config[statut] || { 
    label: statut, 
    className: 'bg-gray-50 text-gray-600 border-gray-200'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${c.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        statut === 'active' ? 'bg-green-500 animate-pulse' : 
        statut === 'terminee' ? 'bg-blue-500' : 'bg-red-500'
      }`} />
      {c.label}
    </span>
  );
}

export default function EncadrementPage() {
  const [encadreurs, setEncadreurs] = useState<EncadreurRecord[]>([]);
  const [selectedEncadreur, setSelectedEncadreur] = useState<EncadreurDetail | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEncadreurs();
  }, []);

  const fetchEncadreurs = async () => {
    setIsLoading(true);
    
    // Récupérer tous les encadreurs avec leurs affectations
    const { data: encadreursData } = await supabase
      .from('users')
      .select(`
        id,
        username,
        email,
        telephone,
        created_at,
        affectations!affectations_encadreur_id_fkey(
          id,
          statut,
          date_debut,
          stagiaire:stagiaire_id(
            id,
            matricule,
            users!inner(username, email)
          ),
          service:service_id(
            nom,
            departement:departement_id(nom)
          )
        )
      `)
      .eq('role', 'encadreur')
      .order('username');

    if (encadreursData) {
      const formatted: EncadreurRecord[] = encadreursData.map((encadreur: any) => {
        const stagiairesActifs = encadreur.affectations?.filter((a: any) => a.statut === 'active') || [];
        
        return {
          id: encadreur.id,
          nom: encadreur.username,
          email: encadreur.email,
          telephone: encadreur.telephone || 'N/A',
          nombre_stagiaires: encadreur.affectations?.length || 0,
          stagiaires_actifs: stagiairesActifs.length,
          departement: encadreur.affectations?.[0]?.service?.departement?.nom || 'Non assigné'
        };
      });

      setEncadreurs(formatted);
    }
    setIsLoading(false);
  };

  const loadEncadreurDetails = async (id: number) => {
    const { data } = await supabase
      .from('users')
      .select(`
        id,
        username,
        email,
        telephone,
        created_at,
        affectations!affectations_encadreur_id_fkey(
          id,
          statut,
          date_debut,
          date_fin,
          stagiaire:stagiaire_id(
            id,
            matricule,
            users!inner(username, email)
          ),
          service:service_id(
            nom,
            departement:departement_id(nom)
          )
        )
      `)
      .eq('id', id)
      .single();

    if (data) {
      const stagiaires: StagiaireAffecte[] = (data.affectations || []).map((a: any) => ({
        id: a.stagiaire?.id,
        username: a.stagiaire?.users?.username || 'N/A',
        matricule: a.stagiaire?.matricule || 'N/A',
        email: a.stagiaire?.users?.email || 'N/A',
        service: a.service?.nom || 'N/A',
        departement: a.service?.departement?.nom || 'N/A',
        date_debut: a.date_debut ? new Date(a.date_debut).toLocaleDateString('fr-FR') : 'N/A',
        date_fin: a.date_fin ? new Date(a.date_fin).toLocaleDateString('fr-FR') : null,
        statut: a.statut
      }));

      setSelectedEncadreur({
        id: data.id,
        username: data.username,
        email: data.email,
        telephone: data.telephone || 'N/A',
        created_at: new Date(data.created_at).toLocaleDateString('fr-FR'),
        stagiaires
      });
    }
  };

  const handleRowClick = async (item: EncadreurRecord) => {
    await loadEncadreurDetails(item.id);
    setIsDetailsOpen(true);
  };

  // Colonnes du tableau principal
  const columns: Column<EncadreurRecord>[] = [
    {
      key: 'nom',
      header: 'Encadreur',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <AvatarInitials name={item.nom} size="sm" />
          <div>
            <p className="text-sm font-medium text-gray-900">{item.nom}</p>
            <p className="text-xs text-gray-500">{item.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'departement',
      header: 'Département',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          <Building2 size={14} className="text-gray-400" />
          <span className="text-sm text-gray-700">{item.departement}</span>
        </div>
      )
    },
    {
      key: 'nombre_stagiaires',
      header: 'Total stagiaires',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          <Users size={14} className="text-indigo-400" />
          <span className="text-sm font-medium text-gray-900">{item.nombre_stagiaires}</span>
        </div>
      )
    },
    {
      key: 'stagiaires_actifs',
      header: 'Actifs',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          <UserCheck size={14} className="text-green-500" />
          <span className="text-sm font-medium text-green-700">{item.stagiaires_actifs}</span>
        </div>
      )
    },
    {
      key: 'telephone',
      header: 'Contact',
      render: (item) => (
        <div className="flex items-center gap-1">
          <Phone size={12} className="text-gray-400" />
          <span className="text-xs text-gray-500">{item.telephone}</span>
        </div>
      )
    }
  ];

  // Sections de détails
  const getDetailSections = (): DetailSection[] => {
    if (!selectedEncadreur) return [];

    const sections: DetailSection[] = [
      {
        title: '👤 Informations personnelles',
        fields: [
          { label: 'Nom complet', value: selectedEncadreur.username, icon: <Users size={14} />, span: 'half' },
          { label: 'Email', value: selectedEncadreur.email, icon: <Mail size={14} />, span: 'half' },
          { label: 'Téléphone', value: selectedEncadreur.telephone, icon: <Phone size={14} />, span: 'half' },
          { label: 'Date inscription', value: selectedEncadreur.created_at, icon: <Calendar size={14} />, span: 'half' },
        ]
      }
    ];

    // Section des stagiaires affectés
    if (selectedEncadreur.stagiaires.length > 0) {
      const stagiairesFields = selectedEncadreur.stagiaires.map((s, index) => ({
        label: `${s.username} (${s.matricule})`,
        value: (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge statut={s.statut} />
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Building2 size={10} />
                {s.departement} - {s.service}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Calendar size={10} />
              <span>Début: {s.date_debut}</span>
              {s.date_fin && (
                <>
                  <ArrowRight size={10} />
                  <span>Fin: {s.date_fin}</span>
                </>
              )}
            </div>
          </div>
        ),
        icon: <GraduationCap size={14} />,
        span: 'full' as const
      }));

      sections.push({
        title: `🎓 Stagiaires affectés (${selectedEncadreur.stagiaires.length})`,
        fields: stagiairesFields
      });
    } else {
      sections.push({
        title: '🎓 Stagiaires affectés',
        fields: [
          {
            label: 'Aucun stagiaire',
            value: 'Cet encadreur n\'a pas encore de stagiaire affecté',
            span: 'full'
          }
        ]
      });
    }

    return sections;
  };

  // Stats
  const totalEncadreurs = encadreurs.length;
  const totalStagiaires = encadreurs.reduce((sum, e) => sum + e.nombre_stagiaires, 0);
  const totalActifs = encadreurs.reduce((sum, e) => sum + e.stagiaires_actifs, 0);
  const moyenneStagiaires = totalEncadreurs > 0 
    ? (totalStagiaires / totalEncadreurs).toFixed(1) 
    : '0';

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Encadrement</h2>
          <p className="text-sm text-gray-500 mt-1">
            Liste des encadreurs et leurs stagiaires affectés
          </p>
        </div>
      </div>

   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
  <StatCard
    label="Total encadreurs"
    value={String(totalEncadreurs)}
    icon={<Users size={16} className="text-indigo-600" />}
    size="sm"
  />
  <StatCard
    label="Total stagiaires"
    value={String(totalStagiaires)}
    icon={<GraduationCap size={16} className="text-blue-600" />}
    size="sm"
  />
  <StatCard
    label="Stagiaires actifs"
    value={String(totalActifs)}
    icon={<UserCheck size={16} className="text-green-600" />}
    size="sm"
    trend={totalActifs > 0 ? { 
      value: `${((totalActifs / totalStagiaires) * 100).toFixed(0)}%`, 
      isPositive: true 
    } : undefined}
  />
  <StatCard
    label="Moyenne par encadreur"
    value={moyenneStagiaires}
    icon={<Briefcase size={16} className="text-amber-600" />}
    size="sm"
  />
</div>

      {/* Tableau principal */}
      <DataTable    
        data={encadreurs}
        columns={columns}
        searchable={true}
        searchPlaceholder="Rechercher un encadreur..."
        onRowClick={handleRowClick}
        emptyMessage="Aucun encadreur trouvé"
        striped
        loading={isLoading}
        renderHeader={() => (
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <h3 className="font-semibold text-gray-900">
              Liste des encadreurs
            </h3>
          </div>
        )}
      />

      {/* Modal Détails */}
      <DetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={selectedEncadreur?.username || ''}
        subtitle={
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
              {selectedEncadreur?.stagiaires?.length || 0} stagiaire(s)
            </span>
            {selectedEncadreur?.email && (
              <span className="text-xs text-gray-500">{selectedEncadreur.email}</span>
            )}
          </div>
        }
        avatar={
          <AvatarInitials 
            name={selectedEncadreur?.username || '?'} 
            size="md" 
          />
        }
        sections={getDetailSections()}
      />
    </div>
  );
}