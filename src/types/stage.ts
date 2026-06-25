// types/stage.ts
export interface Stage {
  id: number;
  stagiaire_id: number;
  type_stage: string;
  service_accueil?: string;
  date_debut: string;
  date_fin?: string;
  theme?: string;
  statut: string;
  rapport_depose: boolean;
  rapport_url?: string;
  date_depot_rapport?: string;
  created_at: string;
}

export interface Evaluation {
  id: number;
  stagiaire_id: number;
  encadreur_id?: number;
  note_globale: number;
  commentaire?: string;
  date_evaluation: string;
  created_at: string;
}

export interface Attestation {
  id: number;
  stagiaire_id: number;
  type: string;
  fichier_url?: string;
  date_emission: string;
  created_at: string;
}