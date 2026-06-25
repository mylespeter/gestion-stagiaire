// components/dashboards/EncadreurDashboard.tsx
"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/DataTable';
import { 
  Users, GraduationCap, FileText, Clock,
  BookOpen, CheckCircle, AlertCircle, Calendar,
  Activity, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer,
  RadialBarChart, RadialBar, Legend
} from 'recharts';

interface StagiaireInfo {
  id: number;
  nom: string;
  matricule: string;
  universite: string;
  niveau: string;
  date_debut: string;
  stage_statut: string;
  rapport_depose: boolean;
}

interface EncadreurStats {
  totalStagiaires: number;
  stagiairesActifs: number;
  rapportsDeposes: number;
  rapportsManquants: number;
  finProche: number;
}

interface ChartData {
  rapportData: { name: string; value: number; fill: string }[];
  progressionData: { name: string; stagiaires: number; rapports: number }[];
}

export function EncadreurDashboard() {
  const { user } = useAuth();
  const [stagiaires, setStagiaires] = useState<StagiaireInfo[]>([]);
  const [stats, setStats] = useState<EncadreurStats>({
    totalStagiaires: 0,
    stagiairesActifs: 0,
    rapportsDeposes: 0,
    rapportsManquants: 0,
    finProche: 0
  });
  const [chartData, setChartData] = useState<ChartData>({
    rapportData: [],
    progressionData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchEncadreurData();
  }, [user]);

  const fetchEncadreurData = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      const { data: affectations } = await supabase
        .from('affectations')
        .select(`
          id, date_debut, date_fin, statut,
          stagiaire:stagiaire_id(
            id, matricule,
            users(username),
            informations_academiques(universite, niveau_etudes),
            stages(statut, rapport_depose, date_fin, type_stage)
          )
        `)
        .eq('encadreur_id', user.id)
        .eq('statut', 'active');

      const stagiairesList: StagiaireInfo[] = (affectations || []).map((a: any) => {
        const stage = a.stagiaire?.stages?.[0];
        return {
          id: a.stagiaire?.id,
          nom: a.stagiaire?.users?.username || 'N/A',
          matricule: a.stagiaire?.matricule || 'N/A',
          universite: a.stagiaire?.informations_academiques?.[0]?.universite || 'N/A',
          niveau: a.stagiaire?.informations_academiques?.[0]?.niveau_etudes || 'N/A',
          date_debut: a.date_debut,
          stage_statut: stage?.statut || 'aucun',
          rapport_depose: stage?.rapport_depose || false
        };
      });

      const totalStagiaires = stagiairesList.length;
      const stagiairesActifs = stagiairesList.filter(s => s.stage_statut === 'en_cours').length;
      const rapportsDeposes = stagiairesList.filter(s => s.rapport_depose).length;
      const rapportsManquants = totalStagiaires - rapportsDeposes;

      const aujourdhui = new Date();
      const dans15Jours = new Date();
      dans15Jours.setDate(aujourdhui.getDate() + 15);
      
      const finProche = affectations?.filter(a => {
        if (!a.date_fin) return false;
        const dateFin = new Date(a.date_fin);
        return dateFin >= aujourdhui && dateFin <= dans15Jours;
      }).length || 0;

      setStats({ totalStagiaires, stagiairesActifs, rapportsDeposes, rapportsManquants, finProche });
      setStagiaires(stagiairesList);

      // Données graphiques
      setChartData({
        rapportData: [
          { name: 'Déposés', value: rapportsDeposes, fill: '#10B981' },
          { name: 'Manquants', value: rapportsManquants, fill: '#EF4444' }
        ].filter(d => d.value > 0),
        progressionData: stagiairesList.map(s => ({
          name: s.nom.split(' ')[0],
          stagiaires: 1,
          rapports: s.rapport_depose ? 1 : 0
        }))
      });
    } catch (error) {
      console.error('Erreur chargement dashboard encadreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<StagiaireInfo>[] = [
    { key: 'nom', header: 'Stagiaire', sortable: true },
    { key: 'matricule', header: 'Matricule' },
    { key: 'universite', header: 'Université', maxChars: 20 },
    { key: 'niveau', header: 'Niveau' },
    { 
      key: 'stage_statut', 
      header: 'Stage',
      render: (item) => {
        const config: Record<string, { label: string; className: string }> = {
          'en_cours': { label: 'En cours', className: 'bg-green-100 text-green-800' },
          'termine': { label: 'Terminé', className: 'bg-blue-100 text-blue-800' }
        };
        const c = config[item.stage_statut] || { label: item.stage_statut, className: 'bg-gray-100 text-gray-600' };
        return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${c.className}`}>{c.label}</span>;
      }
    },
    { 
      key: 'rapport_depose', 
      header: 'Rapport',
      render: (item) => (
        item.rapport_depose 
          ? <CheckCircle size={16} className="text-green-500" />
          : <AlertCircle size={16} className="text-red-400" />
      )
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          👨‍🏫 Tableau de Bord - {user?.username || 'Encadreur'}
        </h1>
        <p className="text-gray-500 mt-1">Suivi de vos stagiaires</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Mes Stagiaires"
          value={String(stats.totalStagiaires)}
          icon={<Users size={20} />}
          trend={{ value: `${stats.stagiairesActifs} actifs`, isPositive: true }}
        />
        <StatCard
          label="Rapports déposés"
          value={String(stats.rapportsDeposes)}
          icon={<FileText size={20} />}
          trend={stats.totalStagiaires > 0 ? { 
            value: `${Math.round((stats.rapportsDeposes / stats.totalStagiaires) * 100)}%`, 
            isPositive: stats.rapportsDeposes >= stats.totalStagiaires / 2 
          } : undefined}
        />
        <StatCard
          label="Rapports manquants"
          value={String(stats.rapportsManquants)}
          icon={<AlertCircle size={20} />}
          trend={stats.rapportsManquants > 0 ? { value: 'Action requise', isPositive: false } : { value: 'Tous déposés', isPositive: true }}
        />
        <StatCard
          label="Fin proche"
          value={String(stats.finProche)}
          icon={<Clock size={20} />}
          trend={stats.finProche > 0 ? { value: '< 15 jours', isPositive: false } : undefined}
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
   
{/* État des Rapports - Design amélioré */}
<div className="bg-white rounded-xl border border-gray-200 p-6">
  <div className="flex items-center justify-between mb-6">
    <div>
      <h3 className="font-semibold text-gray-900">📊 État des Rapports</h3>
      <p className="text-xs text-gray-500 mt-0.5">Suivi des dépôts de vos stagiaires</p>
    </div>
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-green-500"></span>
      <span className="text-xs text-gray-500">Déposés</span>
      <span className="w-2 h-2 rounded-full bg-red-400 ml-2"></span>
      <span className="text-xs text-gray-500">Manquants</span>
    </div>
  </div>

  {chartData.rapportData.length > 0 ? (
    <div className="flex items-center gap-6">
      {/* Donut Chart */}
      <div className="relative flex-shrink-0">
        <ResponsiveContainer width={180} height={180}>
          <PieChart>
            <Pie
              data={chartData.rapportData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {chartData.rapportData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                padding: '8px 12px'
              }}
              formatter={(value: number, name: string) => [`${value} stagiaire(s)`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Centre du donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-gray-800">
            {stats.totalStagiaires}
          </span>
          <span className="text-xs text-gray-500">total</span>
        </div>
      </div>

      {/* Légende détaillée */}
      <div className="flex-1 space-y-4">
        {/* Rapports déposés */}
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-900">Rapports déposés</p>
                <p className="text-xs text-green-600">
                  {stats.totalStagiaires > 0 
                    ? `${Math.round((stats.rapportsDeposes / stats.totalStagiaires) * 100)}% de complétion` 
                    : 'N/A'}
                </p>
              </div>
            </div>
            <span className="text-2xl font-bold text-green-700">{stats.rapportsDeposes}</span>
          </div>
          {/* Barre de progression */}
          <div className="mt-3 w-full bg-green-200 rounded-full h-1.5">
            <div 
              className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
              style={{ 
                width: `${stats.totalStagiaires > 0 
                  ? (stats.rapportsDeposes / stats.totalStagiaires) * 100 
                  : 0}%` 
              }}
            />
          </div>
        </div>

        {/* Rapports manquants */}
        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle size={20} className="text-red-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-900">Rapports manquants</p>
                <p className="text-xs text-red-600">
                  {stats.rapportsManquants > 0 
                    ? 'Action requise' 
                    : 'Tous les rapports sont déposés ✅'}
                </p>
              </div>
            </div>
            <span className="text-2xl font-bold text-red-600">{stats.rapportsManquants}</span>
          </div>
          {/* Barre de progression */}
          <div className="mt-3 w-full bg-red-200 rounded-full h-1.5">
            <div 
              className="bg-red-400 h-1.5 rounded-full transition-all duration-500"
              style={{ 
                width: `${stats.totalStagiaires > 0 
                  ? (stats.rapportsManquants / stats.totalStagiaires) * 100 
                  : 0}%` 
              }}
            />
          </div>
        </div>

        {/* Résumé textuel */}
        <div className="text-center pt-1">
          {stats.rapportsManquants === 0 ? (
            <p className="text-sm text-green-600 font-medium">
              🎉 Tous vos stagiaires ont déposé leur rapport !
            </p>
          ) : stats.rapportsDeposes === 0 ? (
            <p className="text-sm text-red-500 font-medium">
              ⚠️ Aucun rapport déposé pour le moment
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              <span className="font-medium text-green-600">{stats.rapportsDeposes} déposé(s)</span>
              {' • '}
              <span className="font-medium text-red-500">{stats.rapportsManquants} manquant(s)</span>
            </p>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <FileText size={48} className="mb-3 opacity-30" />
      <p className="text-sm">Aucun stagiaire assigné</p>
      <p className="text-xs mt-1">Les rapports apparaîtront ici</p>
    </div>
  )}
</div>

        {/* Taux de complétion - Radial */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-6">🎯 Taux de Complétion</h3>
          {stats.totalStagiaires > 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px]">
              <ResponsiveContainer width="100%" height={220}>
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="60%" 
                  outerRadius="100%" 
                  barSize={20} 
                  data={[
                    { 
                      name: 'Rapports', 
                      value: Math.round((stats.rapportsDeposes / stats.totalStagiaires) * 100), 
                      fill: '#10B981' 
                    }
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
                    {Math.round((stats.rapportsDeposes / stats.totalStagiaires) * 100)}%
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-500 text-center">
                {stats.rapportsDeposes} rapports sur {stats.totalStagiaires} stagiaires
              </p>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              Aucun stagiaire
            </div>
          )}
        </div>
      </div>

      {/* BarChart - Progression par stagiaire */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-6">📋 Suivi par Stagiaire</h3>
        {chartData.progressionData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.progressionData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} allowDecimals={false} domain={[0, 1]} ticks={[0, 1]} tickFormatter={(v) => v === 1 ? 'Oui' : 'Non'} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                formatter={(value: number, name: string) => [value === 1 ? '✅ Oui' : '❌ Non', name === 'rapports' ? 'Rapport' : 'Stagiaire']}
              />
              <Legend verticalAlign="top" iconType="circle" />
              <Bar dataKey="stagiaires" fill="#6366F1" radius={[6, 6, 0, 0]} name="Stagiaire" maxBarSize={40} />
              <Bar dataKey="rapports" fill="#10B981" radius={[6, 6, 0, 0]} name="Rapport déposé" maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-400">
            Aucune donnée
          </div>
        )}
      </div>

      {/* Tableau des stagiaires */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">📋 Mes stagiaires</h2>
          <Link href="/stagiaire" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
            Voir tout <ArrowUpRight size={14} />
          </Link>
        </div>
        <DataTable
          data={stagiaires}
          columns={columns}
          searchable={true}
          searchPlaceholder="Rechercher un stagiaire..."
          emptyMessage="Aucun stagiaire assigné"
          striped
        />
      </div>

      {/* Alertes */}
      {stats.rapportsManquants > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900">Rapports en attente</h3>
            <p className="text-amber-700 text-sm mt-1">
              {stats.rapportsManquants} stagiaire(s) n'ont pas encore déposé leur rapport de stage.
            </p>
          </div>
        </div>
      )}

    
    </div>
  );
}