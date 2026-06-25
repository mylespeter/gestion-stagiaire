// app/encadreur/mes-stagiaires/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { DataTable, Column } from '@/components/DataTable';
import { StatCard } from '@/components/ui/StatCard';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { 
  Users, GraduationCap, ClipboardList, Star,
  Calendar, Building2, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Types corrects pour les données
interface StagiaireRecord {
  id: number;
  username: string;
  matricule: string;
  email: string;
  service: string;
  departement: string;
  date_debut: string;
  date_fin: string | null;
  statut: string;
  derniere_evaluation: string | null;
  note_moyenne: number | null;
  evaluations_count: number;
}

export default function MesStagiairesPage() {
  const { user } = useAuth();
  const [stagiaires, setStagiaires] = useState<StagiaireRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchMesStagiaires();
    }
  }, [user]);

  const fetchMesStagiaires = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    
    try {
      // 1. Récupérer les affectations avec les relations imbriquées
      const { data: affectations, error: affectError } = await supabase
        .from('affectations')
        .select(`
          id,
          statut,
          date_debut,
          date_fin,
          stagiaire:stagiaire_id (
            id,
            matricule,
            users (
              username,
              email
            )
          ),
          service:service_id (
            nom,
            departement:departement_id (
              nom
            )
          )
        `)
        .eq('encadreur_id', user.id)
        .order('date_debut', { ascending: false });

      if (affectError) {
        console.error('Erreur affectations:', affectError);
        setIsLoading(false);
        return;
      }

      if (!affectations || affectations.length === 0) {
        setStagiaires([]);
        setIsLoading(false);
        return;
      }

      // 2. Pour chaque stagiaire, récupérer ses évaluations
      const stagiairesWithEvals = await Promise.all(
        affectations.map(async (affectation: any) => {
          // Extraire les données du stagiaire (qui est un objet unique, pas un tableau)
          const stagiaireData = affectation.stagiaire;
          const serviceData = affectation.service;
          
          // Récupérer les évaluations du stagiaire
          const { data: evaluations } = await supabase
            .from('evaluations')
            .select('id, note_globale, date_evaluation')
            .eq('stagiaire_id', stagiaireData.id)
            .order('date_evaluation', { ascending: false });

          // Calculer la moyenne
          const notes = evaluations?.map(e => e.note_globale) || [];
          const moyenne = notes.length > 0 
            ? notes.reduce((sum, n) => sum + n, 0) / notes.length 
            : null;

          return {
            id: stagiaireData.id,
            username: stagiaireData.users?.username || 'N/A',
            matricule: stagiaireData.matricule || 'N/A',
            email: stagiaireData.users?.email || 'N/A',
            service: serviceData?.nom || 'N/A',
            departement: serviceData?.departement?.nom || 'N/A',
            date_debut: affectation.date_debut,
            date_fin: affectation.date_fin,
            statut: affectation.statut,
            derniere_evaluation: evaluations?.[0]?.date_evaluation || null,
            note_moyenne: moyenne ? Math.round(moyenne * 10) / 10 : null,
            evaluations_count: evaluations?.length || 0
          };
        })
      );

      setStagiaires(stagiairesWithEvals);
    } catch (error) {
      console.error('Erreur fetchMesStagiaires:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Statistiques
  const stats = [
    {
      label: 'Stagiaires actifs',
      value: String(stagiaires.filter(s => s.statut === 'active').length),
      icon: <Users size={20} className="text-indigo-600" />,
    },
    {
      label: 'Total stagiaires',
      value: String(stagiaires.length),
      icon: <GraduationCap size={20} className="text-blue-600" />,
    },
    {
      label: 'Évaluations faites',
      value: String(stagiaires.reduce((sum, s) => sum + s.evaluations_count, 0)),
      icon: <ClipboardList size={20} className="text-green-600" />,
    },
    {
      label: 'Note moyenne',
      value: (() => {
        const notesMoyennes = stagiaires
          .filter(s => s.note_moyenne !== null)
          .map(s => s.note_moyenne as number);
        
        if (notesMoyennes.length === 0) return 'N/A';
        
        const moyenne = notesMoyennes.reduce((sum, n) => sum + n, 0) / notesMoyennes.length;
        return `${moyenne.toFixed(1)}/20`;
      })(),
      icon: <Star size={20} className="text-amber-600" />,
    },
  ];

  // Colonnes du tableau
  const columns: Column<StagiaireRecord>[] = [
    {
      key: 'username',
      header: 'Stagiaire',
      sortable: true,
      render: (item) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{item.username}</p>
          <p className="text-xs text-gray-500">{item.matricule}</p>
        </div>
      )
    },
    {
      key: 'departement',
      header: 'Département',
      render: (item) => (
        <div className="flex items-center gap-1">
          <Building2 size={12} className="text-gray-400" />
          <span className="text-sm text-gray-700">{item.departement} - {item.service}</span>
        </div>
      )
    },
    {
      key: 'date_debut',
      header: 'Période',
      render: (item) => (
        <div className="text-sm text-gray-700">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            {format(new Date(item.date_debut), 'dd/MM/yy')}
          </div>
          {item.date_fin && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <ArrowRight size={10} />
              {format(new Date(item.date_fin), 'dd/MM/yy')}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'statut',
      header: 'Statut',
      render: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.statut === 'active' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {item.statut === 'active' ? 'En cours' : 'Terminé'}
        </span>
      )
    },
    {
      key: 'note_moyenne',
      header: 'Moyenne',
      sortable: true,
      render: (item) => (
        item.note_moyenne !== null ? (
          <span className={`font-semibold ${
            item.note_moyenne >= 16 ? 'text-green-600' : 
            item.note_moyenne >= 10 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {item.note_moyenne}/20
          </span>
        ) : (
          <span className="text-gray-400 text-sm">Non évalué</span>
        )
      )
    },
    {
      key: 'evaluations_count',
      header: 'Évals',
      render: (item) => (
        <span className="text-sm text-gray-700">
          {item.evaluations_count} éval{item.evaluations_count > 1 ? 's' : ''}
        </span>
      )
    },
    {
      key: 'actions',
      header: '',
      render: (item) => (
        <div className="flex gap-1">
          <Link
            href={`/evaluations?stagiaire=${item.id}`}
            className="p-1.5 hover:bg-indigo-50 rounded-lg text-indigo-600"
            title="Nouvelle évaluation"
          >
            <ClipboardList size={16} />
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mes Stagiaires</h2>
          <p className="text-sm text-gray-500 mt-1">
            Gérez et évaluez les stagiaires sous votre supervision
          </p>
        </div>
        <Link
          href="/evaluations"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
        >
          <ClipboardList size={16} /> Nouvelle évaluation
        </Link>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} size="sm" />
        ))}
      </div>

      {/* Tableau */}
      <DataTable
        data={stagiaires}
        columns={columns}
        searchable
        searchPlaceholder="Rechercher un stagiaire..."
        emptyMessage="Aucun stagiaire trouvé"
        striped
        loading={isLoading}
        renderHeader={() => (
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <h3 className="font-semibold text-gray-900">
              Stagiaires sous ma supervision
            </h3>
          </div>
        )}
      />
    </div>
  );
}