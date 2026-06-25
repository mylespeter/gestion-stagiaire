// types/organisation.ts

export interface Departement {
  id: number;
  nom: string;
  code: string;
  description: string | null;
  responsable_id: number | null;
  responsable?: {
    id: number;
    username: string;
    email: string;
    telephone?: string; // ✅ Ajouté
  };
  services?: Service[];
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  departement_id: number;
  nom: string;
  code: string;
  description: string | null;
  responsable_id: number | null;
  responsable?: {
    id: number;
    username: string;
    email: string;
    telephone?: string; // ✅ Ajouté
  };
  departement?: {
    id: number;
    nom: string;
    code: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Affectation {
  id: number;
  stagiaire_id: number;
  service_id: number;
  encadreur_id: number | null;
  date_debut: string;
  date_fin: string | null;
  statut: 'active' | 'terminee' | 'annulee';
  motif_fin: string | null;
  stagiaire?: {
    id: number;
    matricule: string;
    date_naissance?: string; // ✅ Ajouté (utilisé dans loadAffectationDetails)
    lieu_naissance?: string; // ✅ Ajouté (utilisé dans loadAffectationDetails)
    users: {
      username: string;
      email: string;
      telephone?: string; // ✅ Ajouté
    }
  };
  service?: {
    id: number;
    nom: string;
    code: string;
    departement: {
      id: number;
      nom: string;
      code: string;
    }
  };
  encadreur?: {
    id: number;
    username: string;
    email: string;
    telephone?: string; // ✅ Ajouté
  };
  created_at: string;
  updated_at: string;
}

// Interfaces pour les enregistrements formatés (utilisées dans les DataTable)

export interface DepartementRecord {
  id: number;
  nom: string;
  code: string;
  description: string;
  nombre_services: number;
  responsable: string;
}

export interface ServiceRecord {
  id: number;
  nom: string;
  code: string;
  departement: string;
  description: string;
  responsable: string;
}

export interface AffectationRecord {
  id: number;
  stagiaire: string;
  matricule: string;
  departement: string;
  service: string;
  encadreur: string;
  date_debut: string;
  statut: 'active' | 'terminee' | 'annulee'; // ✅ Plus précis que string
}

// ✅ Ajout d'une interface pour les utilisateurs (optionnel mais recommandé)
export interface User {
  id: number;
  username: string;
  email: string;
  telephone?: string;
  role?: 'admin' | 'encadreur' | 'stagiaire';
  created_at?: string;
  updated_at?: string;
}

// ✅ Type pour le statut d'affectation (utile pour la réutilisation)
export type StatutAffectation = 'active' | 'terminee' | 'annulee';