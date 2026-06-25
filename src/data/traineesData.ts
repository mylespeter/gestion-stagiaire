export interface Trainee {
  id: number;
  name: string;
  type: 'Académique' | 'Professionnelle';
  email: string;
  period: string;
  status: 'Validé' | 'Échec';
  score: number;
  school: string;
  phone: string;
}

export const traineesData: Trainee[] = [
  { id: 1, name: 'Abigail Martin', type: 'Académique', email: 'abigail.m@univ-paris.fr', period: '1 mois restant', status: 'Validé', score: 89, school: 'Université Paris Cité', phone: '+33 6 12 34 56 78' },
  { id: 2, name: 'Alexander Dupont', type: 'Professionnelle', email: 'alex.d@epitech.eu', period: '3 mois restants', status: 'Échec', score: 51, school: 'Epitech', phone: '+33 6 23 45 67 89' },
  // ... reste des données

    { 
    id: 3, 
    name: 'Amelia Roux', 
    type: 'Académique', 
    email: 'amelia.r@hec.edu', 
    period: '1 mois restant', 
    status: 'Validé', 
    score: 92, 
    school: 'HEC Paris', 
    phone: '+33 6 34 56 78 90' 
  },
  { 
    id: 4, 
    name: 'Aria Benoit', 
    type: 'Professionnelle', 
    email: 'aria.b@louvre.fr', 
    period: '2 mois restants', 
    status: 'Validé', 
    score: 78, 
    school: 'École du Louvre', 
    phone: '+33 6 45 67 89 01' 
  },
  { 
    id: 5, 
    name: 'Ava Moreau', 
    type: 'Académique', 
    email: 'ava.m@supinfo.com', 
    period: '3 mois restants', 
    status: 'Validé', 
    score: 88, 
    school: 'Supinfo', 
    phone: '+33 6 56 78 90 12' 
  },
  { 
    id: 6, 
    name: 'Benjamin Lefevre', 
    type: 'Professionnelle', 
    email: 'ben.l@yahoo.com', 
    period: '5 mois restants', 
    status: 'Échec', 
    score: 31, 
    school: 'Autodidacte', 
    phone: '+33 6 67 89 01 23' 
  },
  { 
    id: 7, 
    name: 'Carter Petit', 
    type: 'Académique', 
    email: 'carter.p@outlook.com', 
    period: 'Stage terminé', 
    status: 'Échec', 
    score: 24, 
    school: 'Université Lyon 1', 
    phone: '+33 6 78 90 12 34' 
  },
];