// components/dashboards/StagiaireDashboard.tsx
"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { 
  Briefcase, Building2, User, Calendar, Clock,
  FileText, CheckCircle, AlertCircle, BookOpen,
  MapPin, Phone, Mail
} from 'lucide-react';
import Link from 'next/link';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar
} from 'recharts';

interface StagiaireStage {
  id: number;
  type_stage: string;
  service_accueil: string;
  date_debut: string;
  date_fin: string;
  theme: string;
  statut: string;
  rapport_depose: boolean;
}

interface EncadreurInfo {
  id: number;
  username: string;
  email: string;
  telephone: string;
}

interface AffectationInfo {
  id: number;
  date_debut: string;
  date_fin: string;
  encadreur: EncadreurInfo | null;
  service: {
    nom: string;
    departement: { nom: string };
  } | null;
}

interface ProgressionData {
  semaine: string;
  progression: number;
}

export function StagiaireDashboard() {
  const { user } = useAuth();
  const [stage, setStage] = useState<StagiaireStage | null>(null);
  const [affectation, setAffectation] = useState<AffectationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [joursRestants, setJoursRestants] = useState<number | null>(null);
  const [joursPasses, setJoursPasses] = useState<number>(0);
  const [totalJours, setTotalJours] = useState<number>(0);
  const [progressionData, setProgressionData] = useState<ProgressionData[]>([]);
  const [evaluationsCount, setEvaluationsCount] = useState(0);

  useEffect(() => {
    if (user) fetchStagiaireData();
  }, [user]);

  // Helper pour normaliser les données Supabase
  const normalizeData = <T,>(data: T | T[]): T | null => {
    if (!data) return null;
    if (Array.isArray(data)) {
      return data.length > 0 ? data[0] : null;
    }
    return data;
  };

  const fetchStagiaireData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { data: stagiaireData } = await supabase
        .from('stagiaires')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!stagiaireData) {
        setLoading(false);
        return;
      }

      const { data: stageData } = await supabase
        .from('stages')
        .select('*')
        .eq('stagiaire_id', stagiaireData.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (stageData) {
        setStage(stageData);

        if (stageData.date_fin && stageData.date_debut) {
          const debut = new Date(stageData.date_debut);
          const fin = new Date(stageData.date_fin);
          const aujourdhui = new Date();
          
          const total = Math.ceil((fin.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24));
          const passes = Math.ceil((aujourdhui.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24));
          const restants = Math.ceil((fin.getTime() - aujourdhui.getTime()) / (1000 * 60 * 60 * 24));
          
          setTotalJours(Math.max(0, total));
          setJoursPasses(Math.max(0, Math.min(passes, total)));
          setJoursRestants(Math.max(0, restants));

          // Générer progression simulée
          const progression: ProgressionData[] = [];
          const semaines = Math.ceil(total / 7);
          for (let i = 1; i <= Math.min(semaines, Math.ceil(passes / 7) + 1); i++) {
            progression.push({
              semaine: `Sem ${i}`,
              progression: Math.min(100, Math.round((i / semaines) * 100))
            });
          }
          setProgressionData(progression);
        }
      }

      // Récupérer l'affectation active avec normalisation
      const { data: affectationData } = await supabase
        .from('affectations')
        .select(`
          id, date_debut, date_fin,
          encadreur:encadreur_id(id, username, email, telephone),
          service:service_id(nom, departement:departement_id(nom))
        `)
        .eq('stagiaire_id', stagiaireData.id)
        .eq('statut', 'active')
        .single();

      if (affectationData) {
        // Normaliser les données pour gérer les tableaux potentiels
        const encadreur = normalizeData(affectationData.encadreur);
        const service = normalizeData(affectationData.service);
        
        const normalizedAffectation: AffectationInfo = {
          id: affectationData.id,
          date_debut: affectationData.date_debut,
          date_fin: affectationData.date_fin,
          encadreur: encadreur ? {
            id: encadreur.id,
            username: encadreur.username,
            email: encadreur.email,
            telephone: encadreur.telephone
          } : null,
          service: service ? {
            nom: service.nom,
            departement: {
              nom: normalizeData(service.departement)?.nom || 'N/A'
            }
          } : null
        };
        setAffectation(normalizedAffectation);
      }

      const { count } = await supabase
        .from('evaluations')
        .select('*', { count: 'exact', head: true })
        .eq('stagiaire_id', stagiaireData.id);

      setEvaluationsCount(count || 0);
    } catch (error) {
      console.error('Erreur chargement dashboard stagiaire:', error);
    } finally {
      setLoading(false);
    }
  };

  const progressionPercent = totalJours > 0 ? Math.round((joursPasses / totalJours) * 100) : 0;

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-8">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          🎓 Mon Espace Stage
        </h1>
        <p className="text-gray-500 mt-1">Bienvenue, {user?.username}</p>
      </div>

      {/* Pas de stage */}
      {!stage && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <Briefcase size={48} className="mx-auto text-amber-300 mb-4" />
          <h2 className="text-lg font-semibold text-amber-900 mb-2">Aucun stage en cours</h2>
          <p className="text-amber-700">
            Vous n'avez pas encore de stage assigné. Veuillez contacter votre coordinateur.
          </p>
        </div>
      )}

      {/* Stage actif */}
      {stage && (
        <>
          {/* Bannière de statut */}
          <div className={`rounded-xl p-6 ${
            stage.statut === 'en_cours' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' :
            stage.statut === 'termine' ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200' :
            'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  stage.statut === 'en_cours' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  <Briefcase size={24} className={stage.statut === 'en_cours' ? 'text-green-600' : 'text-blue-600'} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Stage {stage.type_stage === 'academique' ? 'Académique' : 
                          stage.type_stage === 'professionnel' ? 'Professionnel' : 'Bénévole'}
                  </h2>
                  <p className="text-gray-600">{stage.service_accueil}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {joursRestants !== null && joursRestants > 0 && (
                  <div className="text-center px-4 py-2 bg-white rounded-lg shadow-sm">
                    <p className="text-2xl font-bold text-gray-900">{joursRestants}</p>
                    <p className="text-xs text-gray-500">jours restants</p>
                  </div>
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  stage.statut === 'en_cours' ? 'bg-green-100 text-green-800' :
                  stage.statut === 'termine' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {stage.statut === 'en_cours' ? '🟢 En cours' :
                   stage.statut === 'termine' ? '✅ Terminé' : stage.statut}
                </span>
              </div>
            </div>
          </div>

          {/* Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Progression du stage - Radial */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">📊 Progression du Stage</h3>
              <div className="flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="60%" 
                    outerRadius="100%" 
                    barSize={15} 
                    data={[
                      { name: 'Complété', value: progressionPercent, fill: '#10B981' }
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
                      className="text-2xl font-bold"
                      fill="#1F2937"
                    >
                      {progressionPercent}%
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="flex gap-4 text-sm text-gray-500 mt-2">
                  <span>{joursPasses} jours passés</span>
                  <span>•</span>
                  <span>{totalJours} jours total</span>
                </div>
              </div>
            </div>

            {/* Évolution hebdomadaire */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">📈 Progression Hebdomadaire</h3>
              {progressionData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={progressionData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="semaine" tick={{ fontSize: 11, fill: '#6B7280' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                      formatter={(value: number) => [`${value}%`, 'Progression']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="progression" 
                      stroke="#6366F1" 
                      strokeWidth={3} 
                      dot={{ fill: '#6366F1', r: 4 }} 
                      activeDot={{ r: 6, fill: '#6366F1' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-gray-400">
                  Données insuffisantes pour afficher la progression
                </div>
              )}
            </div>
          </div>

          {/* Détails */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">📋 Détails du stage</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-gray-500">Début :</span>
                    <span className="font-medium">
                      {stage.date_debut ? new Date(stage.date_debut).toLocaleDateString('fr-FR') : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-gray-500">Fin :</span>
                    <span className="font-medium">
                      {stage.date_fin ? new Date(stage.date_fin).toLocaleDateString('fr-FR') : 'Non définie'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText size={16} className="text-gray-400" />
                    <span className="text-gray-500">Rapport :</span>
                    <span className={`font-medium ${stage.rapport_depose ? 'text-green-600' : 'text-red-500'}`}>
                      {stage.rapport_depose ? '✅ Déposé' : '❌ Non déposé'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen size={16} className="text-gray-400" />
                    <span className="text-gray-500">Thème :</span>
                    <span className="font-medium truncate">{stage.theme || 'Non défini'}</span>
                  </div>
                </div>
              </div>

              {affectation?.encadreur && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">👨‍🏫 Mon encadreur</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <User size={24} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{affectation.encadreur.username}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail size={12} /> {affectation.encadreur.email}
                        </span>
                        {affectation.encadreur.telephone && (
                          <span className="flex items-center gap-1">
                            <Phone size={12} /> {affectation.encadreur.telephone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {affectation?.service && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">🏢 Service</h3>
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-gray-400" />
                    <div>
                      <p className="font-medium text-sm">{affectation.service.nom}</p>
                      <p className="text-xs text-gray-500">{affectation.service.departement.nom}</p>
                    </div>
                  </div>
                </div>
              )}

           
            </div>
          </div>
        </>
      )}
    </div>
  );
}