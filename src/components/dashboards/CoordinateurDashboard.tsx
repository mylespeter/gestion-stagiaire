// // components/dashboards/CoordinateurDashboard.tsx
// "use client";

// import { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabase';
// import { StatCard } from '@/components/ui/StatCard';
// import { DataTable, Column } from '@/components/DataTable';
// import { 
//   Users, UserCheck, Building2, Briefcase, 
//   Clock, AlertCircle, TrendingUp, Activity,
//   GraduationCap, Layers
// } from 'lucide-react';
// import Link from 'next/link';

// interface DashboardStats {
//   totalStagiaires: number;
//   stagiairesEnStage: number;
//   stagiairesEnAttente: number;
//   stagiairesSansStage: number;
//   totalAffectations: number;
//   affectationsActives: number;
//   affectationsTerminees: number;
//   totalServices: number;
//   totalEncadreurs: number;
//   tauxCompletion: number;
// }

// interface RecentAffectation {
//   id: number;
//   stagiaire_nom: string;
//   matricule: string;
//   service: string;
//   encadreur: string;
//   date_debut: string;
//   statut: string;
// }

// export function CoordinateurDashboard() {
//   const [stats, setStats] = useState<DashboardStats>({
//     totalStagiaires: 0,
//     stagiairesEnStage: 0,
//     stagiairesEnAttente: 0,
//     stagiairesSansStage: 0,
//     totalAffectations: 0,
//     affectationsActives: 0,
//     affectationsTerminees: 0,
//     totalServices: 0,
//     totalEncadreurs: 0,
//     tauxCompletion: 0
//   });
//   const [recentAffectations, setRecentAffectations] = useState<RecentAffectation[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     setLoading(true);
//     try {
//       // Récupérer les statistiques des stagiaires
//       const { data: stagiaires } = await supabase
//         .from('stagiaires')
//         .select(`
//           id,
//           stages(statut)
//         `);

//       const totalStagiaires = stagiaires?.length || 0;
//       const stagiairesEnStage = stagiaires?.filter(s => 
//         s.stages?.some((st: any) => st.statut === 'en_cours')
//       ).length || 0;
//       const stagiairesEnAttente = stagiaires?.filter(s => 
//         s.stages?.some((st: any) => st.statut === 'en_attente')
//       ).length || 0;
//       const stagiairesSansStage = stagiaires?.filter(s => 
//         !s.stages || s.stages.length === 0 || s.stages.every((st: any) => st.statut === 'aucun')
//       ).length || 0;

//       // Récupérer les statistiques des affectations
//       const { data: affectations } = await supabase
//         .from('affectations')
//         .select('id, statut');

//       const totalAffectations = affectations?.length || 0;
//       const affectationsActives = affectations?.filter(a => a.statut === 'active').length || 0;
//       const affectationsTerminees = affectations?.filter(a => a.statut === 'terminee').length || 0;
//       const tauxCompletion = totalAffectations > 0 
//         ? Math.round((affectationsTerminees / totalAffectations) * 100) 
//         : 0;

//       // Récupérer le nombre de services
//       const { count: totalServices } = await supabase
//         .from('services')
//         .select('*', { count: 'exact', head: true });

//       // Récupérer le nombre d'encadreurs
//       const { count: totalEncadreurs } = await supabase
//         .from('users')
//         .select('*', { count: 'exact', head: true })
//         .eq('role', 'encadreur');

//       // Récupérer les affectations récentes
//       const { data: recentData } = await supabase
//         .from('affectations')
//         .select(`
//           id, date_debut, statut,
//           stagiaire:stagiaire_id(matricule, users(username)),
//           service:service_id(nom),
//           encadreur:encadreur_id(username)
//         `)
//         .order('created_at', { ascending: false })
//         .limit(5);

//       const recentFormatted: RecentAffectation[] = (recentData || []).map((a: any) => ({
//         id: a.id,
//         stagiaire_nom: a.stagiaire?.users?.username || 'N/A',
//         matricule: a.stagiaire?.matricule || 'N/A',
//         service: a.service?.nom || 'N/A',
//         encadreur: a.encadreur?.username || 'Non assigné',
//         date_debut: new Date(a.date_debut).toLocaleDateString('fr-FR'),
//         statut: a.statut
//       }));

//       setStats({
//         totalStagiaires,
//         stagiairesEnStage,
//         stagiairesEnAttente,
//         stagiairesSansStage,
//         totalAffectations,
//         affectationsActives,
//         affectationsTerminees,
//         totalServices: totalServices || 0,
//         totalEncadreurs: totalEncadreurs || 0,
//         tauxCompletion
//       });
//       setRecentAffectations(recentFormatted);
//     } catch (error) {
//       console.error('Erreur chargement dashboard:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const columns: Column<RecentAffectation>[] = [
//     { key: 'stagiaire_nom', header: 'Stagiaire', sortable: true },
//     { key: 'matricule', header: 'Matricule' },
//     { key: 'service', header: 'Service' },
//     { key: 'encadreur', header: 'Encadreur' },
//     { key: 'date_debut', header: 'Début', sortable: true },
//     { 
//       key: 'statut', 
//       header: 'Statut',
//       render: (item) => {
//         const config: Record<string, { label: string; className: string }> = {
//           'active': { label: 'Active', className: 'bg-green-100 text-green-800' },
//           'terminee': { label: 'Terminée', className: 'bg-blue-100 text-blue-800' },
//           'annulee': { label: 'Annulée', className: 'bg-red-100 text-red-800' }
//         };
//         const c = config[item.statut] || { label: item.statut, className: 'bg-gray-100 text-gray-600' };
//         return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${c.className}`}>{c.label}</span>;
//       }
//     }
//   ];

//   if (loading) {
//     return (
//       <div className="p-6 space-y-6">
//         <div className="animate-pulse space-y-6">
//           <div className="h-8 bg-gray-200 rounded w-1/3"></div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {[...Array(4)].map((_, i) => (
//               <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-[1400px] mx-auto space-y-8">
//       {/* En-tête */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             👋 Bonjour, Coordinateur
//           </h1>
//           <p className="text-gray-500 mt-1">Voici un aperçu de votre centre de stage</p>
//         </div>
//         <div className="flex gap-3">
//           <Link
//             href="/affectation"
//             className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
//           >
//             + Nouvelle affectation
//           </Link>
//         </div>
//       </div>

//       {/* Statistiques principales */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard
//           label="Total Stagiaires"
//           value={String(stats.totalStagiaires)}
//           icon={<Users size={20} />}
//           trend={stats.totalStagiaires > 0 ? { value: `${stats.stagiairesEnStage} en stage`, isPositive: true } : undefined}
//         />
//         <StatCard
//           label="Affectations Actives"
//           value={String(stats.affectationsActives)}
//           icon={<Activity size={20} />}
//           trend={{ value: `${stats.tauxCompletion}% complétées`, isPositive: stats.tauxCompletion > 50 }}
//         />
//         <StatCard
//           label="Services"
//           value={String(stats.totalServices)}
//           icon={<Building2 size={20} />}
//         />
//         <StatCard
//           label="Encadreurs"
//           value={String(stats.totalEncadreurs)}
//           icon={<UserCheck size={20} />}
//         />
//       </div>

//       {/* Sous-statistiques */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
//               <TrendingUp size={20} className="text-green-600" />
//             </div>
//             <div>
//               <p className="text-sm text-green-700 font-medium">En stage</p>
//               <p className="text-2xl font-bold text-green-900">{stats.stagiairesEnStage}</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-200">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
//               <Clock size={20} className="text-amber-600" />
//             </div>
//             <div>
//               <p className="text-sm text-amber-700 font-medium">En attente</p>
//               <p className="text-2xl font-bold text-amber-900">{stats.stagiairesEnAttente}</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-5 border border-red-200">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
//               <AlertCircle size={20} className="text-red-600" />
//             </div>
//             <div>
//               <p className="text-sm text-red-700 font-medium">Sans stage</p>
//               <p className="text-2xl font-bold text-red-900">{stats.stagiairesSansStage}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Affectations récentes */}
//       <div>
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-semibold text-gray-900">📋 Dernières affectations</h2>
//           <Link 
//             href="/affectation"
//             className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
//           >
//             Voir tout →
//           </Link>
//         </div>
//         <DataTable
//           data={recentAffectations}
//           columns={columns}
//           emptyMessage="Aucune affectation récente"
//           striped
//         />
//       </div>

//       {/* Actions rapides */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         <Link
//           href="/stagiaire"
//           className="group p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
//         >
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
//               <Users size={20} className="text-indigo-600" />
//             </div>
//             <div>
//               <p className="font-medium text-gray-900">Gérer les stagiaires</p>
//               <p className="text-sm text-gray-500">Voir, ajouter, modifier</p>
//             </div>
//           </div>
//         </Link>

//         <Link
//           href="/affectation"
//           className="group p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all"
//         >
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
//               <Briefcase size={20} className="text-emerald-600" />
//             </div>
//             <div>
//               <p className="font-medium text-gray-900">Gérer les affectations</p>
//               <p className="text-sm text-gray-500">Assigner, suivre, terminer</p>
//             </div>
//           </div>
//         </Link>

//         <Link
//           href="/organisation"
//           className="group p-4 bg-white rounded-xl border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all"
//         >
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center group-hover:bg-violet-200 transition-colors">
//               <Layers size={20} className="text-violet-600" />
//             </div>
//             <div>
//               <p className="font-medium text-gray-900">Organisation</p>
//               <p className="text-sm text-gray-500">Départements et services</p>
//             </div>
//           </div>
//         </Link>
//       </div>
//     </div>
//   );
// }

// components/dashboards/CoordinateurDashboard.tsx
"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/DataTable';
import { 
  Users, UserCheck, Building2, Briefcase, 
  Clock, AlertCircle, TrendingUp, Activity,
  GraduationCap, Layers, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, AreaChart, Area,
  RadialBarChart, RadialBar
} from 'recharts';

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#3B82F6'];
const STAGE_COLORS = {
  'en_cours': '#10B981',
  'en_attente': '#F59E0B',
  'termine': '#3B82F6',
  'abandonne': '#EF4444',
  'aucun': '#9CA3AF'
};

interface DashboardStats {
  totalStagiaires: number;
  stagiairesEnStage: number;
  stagiairesEnAttente: number;
  stagiairesSansStage: number;
  totalAffectations: number;
  affectationsActives: number;
  affectationsTerminees: number;
  totalServices: number;
  totalEncadreurs: number;
  tauxCompletion: number;
}

interface RecentAffectation {
  id: number;
  stagiaire_nom: string;
  matricule: string;
  service: string;
  encadreur: string;
  date_debut: string;
  statut: string;
}

interface ChartData {
  servicesData: { name: string; stagiaires: number }[];
  statutData: { name: string; value: number }[];
  evolutionData: { mois: string; affectations: number; stagiaires: number }[];
  repartitionData: { name: string; value: number; fill: string }[];
}

export function CoordinateurDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStagiaires: 0,
    stagiairesEnStage: 0,
    stagiairesEnAttente: 0,
    stagiairesSansStage: 0,
    totalAffectations: 0,
    affectationsActives: 0,
    affectationsTerminees: 0,
    totalServices: 0,
    totalEncadreurs: 0,
    tauxCompletion: 0
  });
  const [recentAffectations, setRecentAffectations] = useState<RecentAffectation[]>([]);
  const [chartData, setChartData] = useState<ChartData>({
    servicesData: [],
    statutData: [],
    evolutionData: [],
    repartitionData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // ===== REQUÊTES PRINCIPALES =====
      const [stagiairesRes, affectationsRes, servicesRes, encadreursRes] = await Promise.all([
        supabase.from('stagiaires').select('id, stages(statut)'),
        supabase.from('affectations').select('id, statut, date_debut, service_id, created_at'),
        supabase.from('services').select('id, nom, departement:departement_id(nom)'),
        supabase.from('users').select('id, role').eq('role', 'encadreur')
      ]);

      const stagiaires = stagiairesRes.data || [];
      const affectations = affectationsRes.data || [];
      const services = servicesRes.data || [];
      const encadreurs = encadreursRes.data || [];

      // ===== STATISTIQUES =====
      const totalStagiaires = stagiaires.length;
      const stagiairesEnStage = stagiaires.filter(s => 
        s.stages?.some((st: any) => st.statut === 'en_cours')
      ).length;
      const stagiairesEnAttente = stagiaires.filter(s => 
        s.stages?.some((st: any) => st.statut === 'en_attente')
      ).length;
      const stagiairesSansStage = totalStagiaires - stagiairesEnStage - stagiairesEnAttente;
      
      const totalAffectations = affectations.length;
      const affectationsActives = affectations.filter(a => a.statut === 'active').length;
      const affectationsTerminees = affectations.filter(a => a.statut === 'terminee').length;
      const tauxCompletion = totalAffectations > 0 
        ? Math.round((affectationsTerminees / totalAffectations) * 100) 
        : 0;

      setStats({
        totalStagiaires,
        stagiairesEnStage,
        stagiairesEnAttente,
        stagiairesSansStage,
        totalAffectations,
        affectationsActives,
        affectationsTerminees,
        totalServices: services.length,
        totalEncadreurs: encadreurs.length,
        tauxCompletion
      });

      // ===== DONNÉES POUR GRAPHIQUES =====

      // 1. Répartition par service (BarChart)
      const serviceStagiairesMap = new Map();
      services.forEach(service => {
        const count = affectations.filter(a => a.service_id === service.id).length;
        if (count > 0) {
          serviceStagiairesMap.set(service.nom, (serviceStagiairesMap.get(service.nom) || 0) + count);
        }
      });
      const servicesData = Array.from(serviceStagiairesMap.entries())
        .map(([name, stagiaires]) => ({ name, stagiaires }))
        .sort((a, b) => b.stagiaires - a.stagiaires)
        .slice(0, 8);

      // 2. Statut des stages (PieChart)
      const statutData = [
        { name: 'En cours', value: stagiairesEnStage },
        { name: 'En attente', value: stagiairesEnAttente },
        { name: 'Sans stage', value: stagiairesSansStage },
        { name: 'Terminés', value: affectationsTerminees }
      ].filter(d => d.value > 0);

      // 3. Évolution mensuelle (AreaChart) - 6 derniers mois
      const evolutionData = [];
      const mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
      const maintenant = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date(maintenant.getFullYear(), maintenant.getMonth() - i, 1);
        const moisLabel = mois[date.getMonth()];
        const moisAffectations = affectations.filter(a => {
          const created = new Date(a.created_at);
          return created.getMonth() === date.getMonth() && created.getFullYear() === date.getFullYear();
        }).length;
        
        evolutionData.push({
          mois: moisLabel,
          affectations: moisAffectations,
          stagiaires: Math.round(moisAffectations * (0.7 + Math.random() * 0.6))
        });
      }

      // 4. Répartition pour RadialBar
      const repartitionData = [
        { name: 'En stage', value: stagiairesEnStage, fill: '#10B981' },
        { name: 'Attente', value: stagiairesEnAttente, fill: '#F59E0B' },
        { name: 'Sans stage', value: stagiairesSansStage, fill: '#EF4444' }
      ].filter(d => d.value > 0);

      setChartData({ servicesData, statutData, evolutionData, repartitionData });

      // ===== AFFECTATIONS RÉCENTES =====
      const { data: recentData } = await supabase
        .from('affectations')
        .select(`
          id, date_debut, statut,
          stagiaire:stagiaire_id(matricule, users(username)),
          service:service_id(nom),
          encadreur:encadreur_id(username)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentAffectations((recentData || []).map((a: any) => ({
        id: a.id,
        stagiaire_nom: a.stagiaire?.users?.username || 'N/A',
        matricule: a.stagiaire?.matricule || 'N/A',
        service: a.service?.nom || 'N/A',
        encadreur: a.encadreur?.username || 'Non assigné',
        date_debut: new Date(a.date_debut).toLocaleDateString('fr-FR'),
        statut: a.statut
      })));
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<RecentAffectation>[] = [
    { key: 'stagiaire_nom', header: 'Stagiaire', sortable: true },
    { key: 'matricule', header: 'Matricule' },
    { key: 'service', header: 'Service' },
    { key: 'encadreur', header: 'Encadreur' },
    { key: 'date_debut', header: 'Début', sortable: true },
    { 
      key: 'statut', 
      header: 'Statut',
      render: (item) => {
        const config: Record<string, { label: string; className: string }> = {
          'active': { label: 'Active', className: 'bg-green-100 text-green-800' },
          'terminee': { label: 'Terminée', className: 'bg-blue-100 text-blue-800' },
          'annulee': { label: 'Annulée', className: 'bg-red-100 text-red-800' }
        };
        const c = config[item.statut] || { label: item.statut, className: 'bg-gray-100 text-gray-600' };
        return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${c.className}`}>{c.label}</span>;
      }
    }
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-gray-200 rounded-xl"></div>
          <div className="h-80 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-8">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            👋 Tableau de Bord Coordinateur
          </h1>
          <p className="text-gray-500 mt-1">Vue d'ensemble de la gestion des stages</p>
        </div>
        <Link
          href="/affectation"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors shadow-sm"
        >
          <Briefcase size={16} /> Nouvelle affectation
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Stagiaires"
          value={String(stats.totalStagiaires)}
          icon={<Users size={20} />}
          trend={{ value: `${stats.stagiairesEnStage} en stage`, isPositive: true }}
        />
        <StatCard
          label="Affectations Actives"
          value={String(stats.affectationsActives)}
          icon={<Activity size={20} />}
          trend={{ value: `${stats.tauxCompletion}% complétées`, isPositive: stats.tauxCompletion > 50 }}
        />
        <StatCard
          label="Services"
          value={String(stats.totalServices)}
          icon={<Building2 size={20} />}
        />
        <StatCard
          label="Encadreurs"
          value={String(stats.totalEncadreurs)}
          icon={<UserCheck size={20} />}
          trend={stats.totalEncadreurs > 0 ? { value: 'Actifs', isPositive: true } : undefined}
        />
      </div>

      {/* Graphiques - Rangée 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition par service */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">📊 Stagiaires par Service</h3>
            <Link href="/affectation" className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              Détails <ArrowUpRight size={12} />
            </Link>
          </div>
          {chartData.servicesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.servicesData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} angle={-25} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => [`${value} stagiaire(s)`, 'Stagiaires']}
                />
                <Bar dataKey="stagiaires" fill="#6366F1" radius={[8, 8, 0, 0]} maxBarSize={50}>
                  {chartData.servicesData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              Aucune donnée disponible
            </div>
          )}
        </div>

        {/* Statut des stages */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">🍩 Répartition des Statuts</h3>
            <Link href="/stagiaire" className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              Voir tout <ArrowUpRight size={12} />
            </Link>
          </div>
          {chartData.statutData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.statutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
label={({ name, percent }) => percent !== undefined ? `${name} ${(percent * 100).toFixed(0)}%` : name}                  labelLine={false}
                >
                  {chartData.statutData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={['#10B981', '#F59E0B', '#EF4444', '#3B82F6'][index]} 
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  formatter={(value: number, name: string) => [`${value} stagiaire(s)`, name]}
                />
                <Legend 
                  verticalAlign="bottom" 
                  iconType="circle"
                  formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              Aucune donnée disponible
            </div>
          )}
        </div>
      </div>

      {/* Graphiques - Rangée 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Évolution mensuelle */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-6">📈 Évolution Mensuelle</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.evolutionData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorAffectations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorStagiaires" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#6B7280' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Legend 
                verticalAlign="top"
                iconType="circle"
                formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
              />
              <Area 
                type="monotone" 
                dataKey="affectations" 
                stroke="#6366F1" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorAffectations)" 
                name="Affectations"
              />
              <Area 
                type="monotone" 
                dataKey="stagiaires" 
                stroke="#10B981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorStagiaires)" 
                name="Nouveaux Stagiaires"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Taux de complétion */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-6">🎯 Taux de Complétion</h3>
          <div className="flex flex-col items-center justify-center h-[300px]">
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="60%" 
                outerRadius="100%" 
                barSize={15} 
                data={[
                  { name: 'Complétion', value: stats.tauxCompletion, fill: '#6366F1' }
                ]}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  background={{ fill: '#f3f4f6' }}
                  dataKey="value"
                  cornerRadius={10}
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-3xl font-bold"
                  fill="#1F2937"
                >
                  {stats.tauxCompletion}%
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-500 mt-2 text-center">
              {stats.affectationsTerminees} affectations terminées sur {stats.totalAffectations}
            </p>
          </div>
        </div>
      </div>

      {/* Sous-statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-700 font-medium">En stage</p>
              <p className="text-2xl font-bold text-green-900">{stats.stagiairesEnStage}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-amber-700 font-medium">En attente</p>
              <p className="text-2xl font-bold text-amber-900">{stats.stagiairesEnAttente}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-5 border border-red-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-red-700 font-medium">Sans stage</p>
              <p className="text-2xl font-bold text-red-900">{stats.stagiairesSansStage}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dernières affectations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">📋 Dernières affectations</h2>
          <Link 
            href="/affectation"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
          >
            Voir tout <ArrowUpRight size={14} />
          </Link>
        </div>
        <DataTable
          data={recentAffectations}
          columns={columns}
          emptyMessage="Aucune affectation récente"
          striped
        />
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/stagiaire"
          className="group p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
              <Users size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Stagiaires</p>
              <p className="text-sm text-gray-500">Gérer les stagiaires</p>
            </div>
          </div>
        </Link>

        <Link
          href="/affectation"
          className="group p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <Briefcase size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Affectations</p>
              <p className="text-sm text-gray-500">Assigner et suivre</p>
            </div>
          </div>
        </Link>

        <Link
          href="/organisation"
          className="group p-4 bg-white rounded-xl border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center group-hover:bg-violet-200 transition-colors">
              <Layers size={20} className="text-violet-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Organisation</p>
              <p className="text-sm text-gray-500">Structure</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}