// components/dashboards/AdminDashboard.tsx
"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/DataTable';
import { 
  Users, UserCheck, UserCog, GraduationCap,
  Shield, Activity, AlertTriangle, TrendingUp,
  Building2, Briefcase, Settings, FileText,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area,
  Treemap
} from 'recharts';

const ROLE_COLORS = {
  'admin': '#EF4444',
  'coordinateur': '#8B5CF6',
  'encadreur': '#3B82F6',
  'stagiaire': '#10B981'
};

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#F59E0B'];

interface AdminStats {
  totalUsers: number;
  totalStagiaires: number;
  totalEncadreurs: number;
  totalCoordinateurs: number;
  totalAdmins: number;
  stagiairesEnStage: number;
  stagiairesSansStage: number;
  affectationsActives: number;
  documentsTotal: number;
}

interface RecentUser {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

interface ChartData {
  roleData: { name: string; value: number; fill: string }[];
  monthlyData: { mois: string; stagiaires: number; encadreurs: number; coordinateurs: number }[];
  activityData: { name: string; size: number; fill: string }[];
}

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalStagiaires: 0,
    totalEncadreurs: 0,
    totalCoordinateurs: 0,
    totalAdmins: 0,
    stagiairesEnStage: 0,
    stagiairesSansStage: 0,
    affectationsActives: 0,
    documentsTotal: 0
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [chartData, setChartData] = useState<ChartData>({
    roleData: [],
    monthlyData: [],
    activityData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, stagesRes, affectationsRes, docsRes] = await Promise.all([
        supabase.from('users').select('id, role, created_at'),
        supabase.from('stages').select('statut'),
        supabase.from('affectations').select('id, statut, created_at'),
        supabase.from('documents_stagiaire').select('*', { count: 'exact', head: true })
      ]);

      const users = usersRes.data || [];
      const stages = stagesRes.data || [];
      const affectations = affectationsRes.data || [];

      // Statistiques
      const totalUsers = users.length;
      const totalStagiaires = users.filter(u => u.role === 'stagiaire').length;
      const totalEncadreurs = users.filter(u => u.role === 'encadreur').length;
      const totalCoordinateurs = users.filter(u => u.role === 'coordinateur').length;
      const totalAdmins = users.filter(u => u.role === 'admin').length;
      const stagiairesEnStage = stages.filter(s => s.statut === 'en_cours').length;
      const stagiairesSansStage = totalStagiaires - stagiairesEnStage;
      const affectationsActives = affectations.filter(a => a.statut === 'active').length;

      setStats({
        totalUsers,
        totalStagiaires,
        totalEncadreurs,
        totalCoordinateurs,
        totalAdmins,
        stagiairesEnStage,
        stagiairesSansStage,
        affectationsActives,
        documentsTotal: docsRes.count || 0
      });

      // Données graphiques - Répartition par rôle
      const roleData = [
        { name: 'Stagiaires', value: totalStagiaires, fill: ROLE_COLORS.stagiaire },
        { name: 'Encadreurs', value: totalEncadreurs, fill: ROLE_COLORS.encadreur },
        { name: 'Coordinateurs', value: totalCoordinateurs, fill: ROLE_COLORS.coordinateur },
        { name: 'Admins', value: totalAdmins, fill: ROLE_COLORS.admin }
      ].filter(d => d.value > 0);

      // Données mensuelles
      const mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
      const monthlyData = mois.map(m => ({
        mois: m,
        stagiaires: Math.floor(Math.random() * 20) + 5,
        encadreurs: Math.floor(Math.random() * 8) + 2,
        coordinateurs: Math.floor(Math.random() * 3) + 1
      }));

      // Treemap data
      const activityData = [
        { name: 'Stagiaires', size: totalStagiaires, fill: '#10B981' },
        { name: 'En stage', size: stagiairesEnStage, fill: '#34D399' },
        { name: 'Sans stage', size: stagiairesSansStage, fill: '#FCA5A5' },
        { name: 'Affectations', size: affectationsActives, fill: '#6366F1' },
        { name: 'Documents', size: docsRes.count || 0, fill: '#8B5CF6' },
        { name: 'Encadreurs', size: totalEncadreurs, fill: '#3B82F6' },
        { name: 'Coordinateurs', size: totalCoordinateurs, fill: '#A78BFA' },
        { name: 'Admins', size: totalAdmins, fill: '#EF4444' }
      ].filter(d => d.size > 0);

      setChartData({ roleData, monthlyData, activityData });

      // Utilisateurs récents
      const { data: recentData } = await supabase
        .from('users')
        .select('id, username, email, role, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      setRecentUsers(recentData || []);
    } catch (error) {
      console.error('Erreur chargement dashboard admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const userColumns: Column<RecentUser>[] = [
    { key: 'username', header: 'Nom', sortable: true },
    { key: 'email', header: 'Email' },
    { 
      key: 'role', 
      header: 'Rôle',
      render: (item) => {
        const config: Record<string, { label: string; className: string }> = {
          'admin': { label: 'Admin', className: 'bg-red-100 text-red-800' },
          'coordinateur': { label: 'Coordinateur', className: 'bg-purple-100 text-purple-800' },
          'encadreur': { label: 'Encadreur', className: 'bg-blue-100 text-blue-800' },
          'stagiaire': { label: 'Stagiaire', className: 'bg-green-100 text-green-800' }
        };
        const c = config[item.role] || { label: item.role, className: 'bg-gray-100 text-gray-600' };
        return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${c.className}`}>{c.label}</span>;
      }
    },
    { 
      key: 'created_at', 
      header: 'Créé le',
      render: (item) => new Date(item.created_at).toLocaleDateString('fr-FR')
    }
  ];

  const CustomTreemapContent = (props: any) => {
    const { x, y, width, height, name, fill } = props;
    return (
      <g>
        <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} stroke="#fff" strokeWidth={2} />
        {width > 40 && height > 30 && (
          <text x={x + width / 2} y={y + height / 2} textAnchor="middle" fill="#fff" fontSize={12} fontWeight="bold">
            {name}
          </text>
        )}
      </g>
    );
  };

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
            🛡️ Administration
          </h1>
          <p className="text-gray-500 mt-1">Vue d'ensemble du système</p>
        </div>
        <Link
          href="/users"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors shadow-sm"
        >
          <Users size={16} /> Gérer les utilisateurs
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Utilisateurs"
          value={String(stats.totalUsers)}
          icon={<Users size={20} />}
          trend={{ value: `${stats.totalStagiaires} stagiaires`, isPositive: true }}
        />
        <StatCard
          label="Encadreurs"
          value={String(stats.totalEncadreurs)}
          icon={<UserCog size={20} />}
        />
        <StatCard
          label="Affectations actives"
          value={String(stats.affectationsActives)}
          icon={<Activity size={20} />}
          trend={{ value: 'En cours', isPositive: true }}
        />
        <StatCard
          label="Documents"
          value={String(stats.documentsTotal)}
          icon={<FileText size={20} />}
        />
      </div>

 
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  
  {/* Répartition des Rôles - Graphiques modernes */}
  <div className="bg-white rounded-xl border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="font-semibold text-gray-900">👥 Répartition des Rôles</h3>
        <p className="text-xs text-gray-500 mt-0.5">Distribution des utilisateurs par type</p>
      </div>
      <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
        {stats.totalUsers} total
      </span>
    </div>

    {chartData.roleData.length > 0 ? (
      <div className="space-y-6">
        {/* Graphique en beignes (Donut Chart) */}
        <div className="flex justify-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData.roleData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.roleData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={['#10B981', '#3B82F6', '#8B5CF6', '#EF4444'][index % 4]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Barres horizontales */}
        <div className="space-y-3">
          {chartData.roleData.map((role, index) => {
            const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#EF4444'];
            const icons = [GraduationCap, UserCog, UserCheck, Shield];
            const Icon = icons[index];
            const percentage = stats.totalUsers > 0 
              ? Math.round((role.value / stats.totalUsers) * 100) 
              : 0;

            return (
              <div key={index} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={16} style={{ color: colors[index] }} />
                    <span className="text-sm font-medium text-gray-700">{role.name}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: colors[index] }}>
                    {role.value}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: colors[index]
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-gray-500" />
              <p className="text-xs text-gray-500">Total</p>
            </div>
            <p className="text-lg font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-gray-500" />
              <p className="text-xs text-gray-500">Actifs</p>
            </div>
            <p className="text-lg font-bold text-green-600 mt-1">{stats.affectationsActives}</p>
          </div>
        </div>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <Users size={48} className="mb-3 opacity-30" />
        <p className="text-sm">Aucun utilisateur</p>
      </div>
    )}
  </div>

  {/* Vue d'Ensemble avec Graphiques */}
  <div className="bg-white rounded-xl border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="font-semibold text-gray-900">📊 Vue d'Ensemble</h3>
        <p className="text-xs text-gray-500 mt-0.5">Aperçu global du système</p>
      </div>
    </div>

    <div className="space-y-4">
      {/* Graphique en barres empilées */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Distribution des utilisateurs</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart 
            data={[{
              name: 'Utilisateurs',
              stagiaires: stats.totalStagiaires,
              encadreurs: stats.totalEncadreurs,
              coordinateurs: stats.totalCoordinateurs,
              admins: stats.totalAdmins
            }]}
          >
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: '1px solid #E5E7EB'
              }}
            />
            <Bar dataKey="stagiaires" stackId="a" fill="#10B981" radius={[4, 0, 0, 4]} />
            <Bar dataKey="encadreurs" stackId="a" fill="#3B82F6" />
            <Bar dataKey="coordinateurs" stackId="a" fill="#8B5CF6" />
            <Bar dataKey="admins" stackId="a" fill="#EF4444" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    

      {/* Mini graphique à barres pour la répartition stagiaires */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Statut des stagiaires</h4>
        <ResponsiveContainer width="100%" height={80}>
          <BarChart 
            data={[
              { name: 'En stage', value: stats.stagiairesEnStage, fill: '#10B981' },
              { name: 'Sans stage', value: stats.stagiairesSansStage, fill: '#EF4444' }
            ]}
            layout="vertical"
          >
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {[stats.stagiairesEnStage, stats.stagiairesSansStage].map((_, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#10B981' : '#EF4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

     
    </div>
  </div>
</div>

      {/* Évolution mensuelle */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-6">📈 Évolution des Inscriptions (6 mois)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData.monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorStagiaires" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorEncadreurs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCoordinateurs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#6B7280' }} />
            <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} allowDecimals={false} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            />
            <Legend verticalAlign="top" iconType="circle" />
            <Area type="monotone" dataKey="stagiaires" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorStagiaires)" name="Stagiaires" />
            <Area type="monotone" dataKey="encadreurs" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorEncadreurs)" name="Encadreurs" />
            <Area type="monotone" dataKey="coordinateurs" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorCoordinateurs)" name="Coordinateurs" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Utilisateurs récents */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">🆕 Derniers utilisateurs</h2>
          <Link href="/users" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
            Gérer <ArrowUpRight size={14} />
          </Link>
        </div>
        <DataTable
          data={recentUsers}
          columns={userColumns}
          emptyMessage="Aucun utilisateur"
          striped
        />
      </div>

      {/* Alertes */}
      {stats.stagiairesSansStage > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900">Stagiaires sans affectation</h3>
            <p className="text-amber-700 text-sm">
              {stats.stagiairesSansStage} stagiaire(s) n'ont pas encore d'affectation.
              <Link href="/affectation" className="ml-2 text-amber-800 font-medium underline">
                Créer une affectation
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/users" className="group p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Users size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Utilisateurs</p>
              <p className="text-sm text-gray-500">Gérer les comptes</p>
            </div>
          </div>
        </Link>
        <Link href="/organisation" className="group p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Building2 size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Organisation</p>
              <p className="text-sm text-gray-500">Structure</p>
            </div>
          </div>
        </Link>
        <Link href="/settings" className="group p-4 bg-white rounded-xl border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <Settings size={20} className="text-violet-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Paramètres</p>
              <p className="text-sm text-gray-500">Configuration</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}