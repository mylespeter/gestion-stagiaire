// app/stagiaire/rapport/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FormModal, FormField, UploadedFile } from '@/components/FormModal';
import { 
  FileText, Upload, CheckCircle, AlertCircle, Download, Eye, 
  AlertTriangle, LogIn, FileArchive, FileImage, FileSpreadsheet,
  RefreshCw, Clock, Building2, Calendar, BookOpen, User
} from 'lucide-react';
import { PiMicrosoftWordLogo, PiMicrosoftExcelLogo, PiMicrosoftPowerpointLogo } from 'react-icons/pi';
import { FaFilePdf, FaFileImage, FaFileArchive, FaFileAlt } from 'react-icons/fa';
import React from 'react'
export default function RapportStagePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [stage, setStage] = useState<any>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        setError('Vous devez être connecté pour accéder à cette page.');
        setLoading(false);
        return;
      }
      fetchStageData();
    }
  }, [authLoading, isAuthenticated]);

  const fetchStageData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError('');
    
    try {
      const { data: stagiaire, error: stagiaireError } = await supabase
        .from('stagiaires')
        .select('id, matricule')
        .eq('user_id', user.id)
        .maybeSingle();

      if (stagiaireError) {
        console.error('Erreur stagiaire:', stagiaireError);
        setError('Erreur lors de la récupération de votre profil.');
        return;
      }

      if (!stagiaire) {
        setError('Profil stagiaire non trouvé. Contactez l\'administration.');
        return;
      }

      const { data: stages, error: stageError } = await supabase
        .from('stages')
        .select('*')
        .eq('stagiaire_id', stagiaire.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (stageError) {
        console.error('Erreur stage:', stageError);
        setError('Erreur lors de la récupération de votre stage.');
        return;
      }

      setStage(stages && stages.length > 0 ? stages[0] : null);

    } catch (error) {
      console.error('Erreur chargement:', error);
      setError('Une erreur inattendue est survenue.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Détection du type de fichier avec icônes
  const getFileTypeInfo = (url: string | null, fileName?: string) => {
    if (!url && !fileName) return { icon: <FaFileAlt className="text-gray-400" size={20} />, label: 'Fichier', color: 'text-gray-500' };
    
    const name = fileName || url?.split('/').pop() || '';
    const extension = name.split('.').pop()?.toLowerCase() || '';

    const types: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
      pdf: { icon: <FaFilePdf className="text-red-500" size={20} />, label: 'PDF', color: 'text-red-600' },
      doc: { icon: <PiMicrosoftWordLogo className="text-blue-600" size={20} />, label: 'Word', color: 'text-blue-600' },
      docx: { icon: <PiMicrosoftWordLogo className="text-blue-600" size={20} />, label: 'Word', color: 'text-blue-600' },
      xls: { icon: <PiMicrosoftExcelLogo className="text-green-600" size={20} />, label: 'Excel', color: 'text-green-600' },
      xlsx: { icon: <PiMicrosoftExcelLogo className="text-green-600" size={20} />, label: 'Excel', color: 'text-green-600' },
      ppt: { icon: <PiMicrosoftPowerpointLogo className="text-orange-600" size={20} />, label: 'PowerPoint', color: 'text-orange-600' },
      pptx: { icon: <PiMicrosoftPowerpointLogo className="text-orange-600" size={20} />, label: 'PowerPoint', color: 'text-orange-600' },
      jpg: { icon: <FaFileImage className="text-purple-500" size={20} />, label: 'Image', color: 'text-purple-600' },
      jpeg: { icon: <FaFileImage className="text-purple-500" size={20} />, label: 'Image', color: 'text-purple-600' },
      png: { icon: <FaFileImage className="text-purple-500" size={20} />, label: 'Image', color: 'text-purple-600' },
      gif: { icon: <FaFileImage className="text-purple-500" size={20} />, label: 'Image', color: 'text-purple-600' },
      webp: { icon: <FaFileImage className="text-purple-500" size={20} />, label: 'Image', color: 'text-purple-600' },
      zip: { icon: <FaFileArchive className="text-yellow-600" size={20} />, label: 'Archive', color: 'text-yellow-600' },
      rar: { icon: <FaFileArchive className="text-yellow-600" size={20} />, label: 'Archive', color: 'text-yellow-600' },
      txt: { icon: <FaFileAlt className="text-gray-500" size={20} />, label: 'Texte', color: 'text-gray-600' },
    };

    return types[extension] || { icon: <FaFileAlt className="text-gray-400" size={20} />, label: extension.toUpperCase(), color: 'text-gray-500' };
  };

  // ✅ Extraction du nom de fichier depuis l'URL
  const getFileNameFromUrl = (url: string) => {
    const parts = url.split('/');
    const fullName = parts[parts.length - 1];
    // Enlever le timestamp si présent (format: 1234567890-nom-fichier.pdf)
    const cleanName = fullName.replace(/^\d+-/, '');
    return cleanName || 'rapport';
  };

  const rapportFields: FormField[] = [
    { 
      name: 'fichier', 
      label: 'Rapport de stage', 
      type: 'file', 
      required: true, 
      accept: '.pdf,.doc,.docx', 
      maxSize: 10, 
      hint: 'Formats acceptés: PDF, Word (max 10MB)' 
    },
  ];

  const handleUploadRapport = async (formData: Record<string, any>, files?: UploadedFile[]) => {
    if (!files || files.length === 0 || !stage) {
      throw new Error('Aucun fichier sélectionné');
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const file = files[0].file!;
      const fileName = `${Date.now()}-rapport-${file.name.replace(/\s+/g, '_')}`;
      const filePath = `stagiaires/${stage.stagiaire_id}/rapports/${fileName}`;

      // Simuler la progression
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      setUploadProgress(100);

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('stages')
        .update({
          rapport_url: publicUrl,
          rapport_depose: true,
          date_depot_rapport: new Date().toISOString().split('T')[0]
        })
        .eq('id', stage.id);

      if (updateError) throw updateError;

      setSuccessMessage('Rapport déposé avec succès !');
      setTimeout(() => {
        setSuccessMessage('');
        setUploadProgress(0);
      }, 3000);
      
      await fetchStageData();
      setIsUploadOpen(false);
    } catch (error: any) {
      console.error('Erreur upload:', error);
      setUploadProgress(0);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusBadge = (statut: string) => {
    const configs: Record<string, { gradient: string; icon: any; label: string; dot: string }> = {
      'en_cours': { 
        gradient: 'from-emerald-50 to-green-50 border-emerald-200 text-emerald-700', 
        icon: CheckCircle, 
        label: 'En cours',
        dot: 'bg-emerald-500'
      },
      'en_attente': { 
        gradient: 'from-amber-50 to-yellow-50 border-amber-200 text-amber-700', 
        icon: Clock, 
        label: 'En attente',
        dot: 'bg-amber-500'
      },
      'termine': { 
        gradient: 'from-blue-50 to-indigo-50 border-blue-200 text-blue-700', 
        icon: CheckCircle, 
        label: 'Terminé',
        dot: 'bg-blue-500'
      },
      'abandonne': { 
        gradient: 'from-red-50 to-rose-50 border-red-200 text-red-700', 
        icon: AlertCircle, 
        label: 'Abandonné',
        dot: 'bg-red-500'
      },
    };
    const config = configs[statut] || configs.en_attente;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${config.gradient} border shadow-sm`}>
        <span className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
        <Icon size={13} />
        {config.label}
      </span>
    );
  };

  const getStageTypeBadge = (type: string) => {
    const types: Record<string, { icon: any; label: string; color: string }> = {
      'academique': { icon: BookOpen, label: 'Académique', color: 'bg-violet-100 text-violet-700 border-violet-200' },
      'professionnel': { icon: Building2, label: 'Professionnel', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
      'benevole': { icon: User, label: 'Bénévole', color: 'bg-pink-100 text-pink-700 border-pink-200' },
    };
    const config = types[type] || { icon: FileText, label: type || 'Non défini', color: 'bg-gray-100 text-gray-700 border-gray-200' };
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  // Affichage du chargement
  if (authLoading || loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl"></div>
          <div className="h-48 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl"></div>
          <div className="h-32 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  // Affichage des erreurs
  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-50 flex items-center justify-center">
            <AlertTriangle size={36} className="text-amber-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Accès impossible</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">{error}</p>
          <div className="flex gap-3 justify-center">
            {!isAuthenticated && (
              <button
                onClick={() => router.push('/login')}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-sm font-semibold transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
              >
                <LogIn size={16} /> Se connecter
              </button>
            )}
            <button
              onClick={fetchStageData}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 text-sm font-semibold transition-all"
            >
              <RefreshCw size={16} /> Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Aucun stage trouvé
  if (!stage) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-50 flex items-center justify-center">
            <FileText size={36} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun stage trouvé</h3>
          <p className="text-gray-500 mb-8">Vous n'avez pas encore de stage attribué. Contactez votre administrateur.</p>
          <button
            onClick={fetchStageData}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 text-sm font-semibold transition-all mx-auto"
          >
            <RefreshCw size={16} /> Actualiser
          </button>
        </div>
      </div>
    );
  }

  const fileInfo = getFileTypeInfo(stage.rapport_url, getFileNameFromUrl(stage.rapport_url));

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* En-tête avec dégradé */}
      <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full -mr-20 -mt-20" />
        <div className="relative p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Rapport de Stage</h1>
              <p className="text-sm text-gray-500 mt-1.5">Déposez et consultez votre rapport de stage</p>
            </div>
            {getStatusBadge(stage.statut)}
          </div>
        </div>
      </div>

      {/* Message de succès */}
      {successMessage && (
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle size={18} className="text-emerald-600" />
          </div>
          <p className="text-sm font-medium text-emerald-700">{successMessage}</p>
        </div>
      )}

      {/* Progression upload */}
      {isUploading && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Téléchargement en cours...</span>
            <span className="text-sm font-semibold text-indigo-600">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Informations du stage */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
          <Building2 size={20} className="text-indigo-600" />
          Informations du stage
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Type de stage</p>
            <div className="mt-1 rounded-full">{getStageTypeBadge(stage.type_stage)}</div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Service d'accueil</p>
            <p className="text-sm font-semibold text-gray-900">{stage.service_accueil || 'Non défini'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Date de début</p>
            <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Calendar size={14} className="text-gray-400" />
              {stage.date_debut ? new Date(stage.date_debut).toLocaleDateString('fr-FR', { 
                year: 'numeric', month: 'long', day: 'numeric' 
              }) : 'N/A'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Date de fin</p>
            <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Calendar size={14} className="text-gray-400" />
              {stage.date_fin ? new Date(stage.date_fin).toLocaleDateString('fr-FR', { 
                year: 'numeric', month: 'long', day: 'numeric' 
              }) : <span className="text-gray-400 italic">Non définie</span>}
            </p>
          </div>
          {stage.theme && (
            <div className="md:col-span-2 space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Thème</p>
              <p className="text-sm font-semibold text-gray-900 bg-gray-50 rounded-lg p-3 border border-gray-100">
                {stage.theme}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Section Rapport */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
          <FileText size={20} className="text-indigo-600" />
          Rapport de stage
        </h2>
        
        {stage.rapport_depose && stage.rapport_url ? (
          <div className="space-y-5">
            {/* Carte du fichier déposé */}
            <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-emerald-100 flex items-center justify-center flex-shrink-0">
                {fileInfo.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-emerald-900">Rapport déposé</p>
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-2">
                  <Calendar size={12} />
                  Déposé le {stage.date_depot_rapport ? new Date(stage.date_depot_rapport).toLocaleDateString('fr-FR', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  }) : 'N/A'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs font-medium ${fileInfo.color}`}>
                    {fileInfo.label}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 truncate">
                    {getFileNameFromUrl(stage.rapport_url)}
                  </span>
                </div>
              </div>
              <CheckCircle size={20} className="text-emerald-500 flex-shrink-0 mt-1" />
            </div>
            
            {/* Boutons d'action */}
            <div className="flex flex-wrap gap-3">
              <a
                href={stage.rapport_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 text-sm font-semibold transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
              >
                <Eye size={16} /> Voir le rapport
              </a>
              <a
                href={stage.rapport_url}
                download
                className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 text-sm font-semibold transition-all"
              >
                <Download size={16} /> Télécharger
              </a>
              <button
                onClick={() => setIsUploadOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 text-sm font-semibold transition-all"
              >
                <Upload size={16} /> Remplacer
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center">
              <Upload size={28} className="text-gray-400" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Aucun rapport déposé</h3>
            <p className="text-sm text-gray-500 mb-6">Déposez votre rapport de stage au format PDF ou Word (max 10MB)</p>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 text-sm font-semibold transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
            >
              <Upload size={16} /> Déposer le rapport
            </button>
          </div>
        )}
      </div>

      {/* Modal Upload */}
      <FormModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Déposer le rapport de stage"
        subtitle="Téléchargez votre rapport de stage"
        fields={rapportFields}
        onSubmit={handleUploadRapport}
        submitLabel="Télécharger le rapport"
        loading={isUploading}
        maxWidth="max-w-lg"
        mode="create"
      />
    </div>
  );
}