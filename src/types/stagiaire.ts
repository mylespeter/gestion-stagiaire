// // types/stagiaire.ts

// export interface Stagiaire {
//   id: number;
//   user_id: number;
//   matricule: string;
//   date_naissance: string | null;
//   lieu_naissance: string | null;
//   nationalite: string | null;
//   adresse: string | null;
//   ville: string | null;
//   nom_urgence: string | null;
//   telephone_urgence: string | null;
//   lien_urgence: string | null;
//   users: {
//     id: number;
//     username: string;
//     email: string;
//     telephone: string | null;
//     genre: string | null;
//     password?: string;
//   };
//   informations_academiques: InformationAcademique[];
//   stages: Stage[];
//   documents_stagiaire: DocumentStagiaire[];
// }

// export interface InformationAcademique {
//   id: number;
//   stagiaire_id: number;
//   universite: string;
//   faculte: string | null;
//   departement: string | null;
//   niveau_etudes: string;
//   domaine_etudes: string | null;
//   annee_academique: string | null;
//   moyenne_generale: number | null;
// }

// export interface Stage {
//   id: number;
//   stagiaire_id: number;
//   encadreur_id: number | null;
//   type_stage: 'academique' | 'professionnel' | 'benevole';
//   service_accueil: string | null;
//   date_debut: string;
//   date_fin: string;
//   theme: string | null;
//   statut: 'en_attente' | 'en_cours' | 'termine' | 'abandonne';
//   rapport_depose: boolean;
// }

// export interface DocumentStagiaire {
//   id: number;
//   stagiaire_id: number;
//   type_document: 'cv' | 'lettre_motivation' | 'attestation' | 'rapport' | 'certificat' | 'autre';
//   nom_fichier: string | null;
//   url_fichier: string;
//   taille_fichier: number | null;
//   date_upload: string;
// }

// export interface StagiaireRecord {
//   id: number;
//   matricule: string;
//   nom_complet: string;
//   email: string;
//   telephone: string;
//   universite: string;
//   niveau_etudes: string;
//   statut_stage: string;
// }

// types/stagiaire.ts

export interface Stagiaire {
  id: number;
  user_id: number;
  matricule: string;
  date_naissance: string | null;
  lieu_naissance: string | null;
  nationalite: string | null;
  adresse: string | null;
  ville: string | null;
  nom_urgence: string | null;
  telephone_urgence: string | null;
  lien_urgence: string | null;
  users: {
    id: number;
    username: string;
    email: string;
    telephone: string | null;
    genre: string | null;
    password?: string;
  };
  informations_academiques: InformationAcademique[];
  stages: Stage[];
  documents_stagiaire: DocumentStagiaire[];
  affectations: Affectation[]; // AJOUTÉ : pour les affectations du stagiaire
}

export interface InformationAcademique {
  id: number;
  stagiaire_id: number;
  universite: string;
  faculte: string | null;
  departement: string | null;
  niveau_etudes: string;
  domaine_etudes: string | null;
  annee_academique: string | null;
  moyenne_generale: number | null;
}

export interface Stage {
  id: number;
  stagiaire_id: number;
  encadreur_id: number | null;
  type_stage: 'academique' | 'professionnel' | 'benevole';
  service_accueil: string | null;
  date_debut: string;
  date_fin: string;
  theme: string | null;
  statut: 'en_attente' | 'en_cours' | 'termine' | 'abandonne';
  rapport_depose: boolean;
}

export interface DocumentStagiaire {
  id: number;
  stagiaire_id: number;
  type_document: 'cv' | 'lettre_motivation' | 'attestation' | 'rapport' | 'certificat' | 'autre';
  nom_fichier: string | null;
  url_fichier: string;
  taille_fichier: number | null;
  date_upload: string;
}

// AJOUTÉ : Interface pour les affectations
export interface Affectation {
  id: number;
  stagiaire_id?: number;
  service_id?: number;
  encadreur_id?: number;
  date_debut?: string;
  date_fin?: string | null;
  statut: 'active' | 'terminee' | 'annulee';
  motif_fin?: string | null;
  encadreur?: {
    id: number;
    username: string;
    email: string;
    telephone?: string | null;
  };
}

export interface StagiaireRecord {
  id: number;
  matricule: string;
  nom_complet: string;
  email: string;
  telephone: string;
  universite: string;
  niveau_etudes: string;
  statut_stage: string;
}