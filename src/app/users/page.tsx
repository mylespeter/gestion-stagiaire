


// "use client";
// import { useState, useEffect } from 'react';
// import { DataTable, type Column } from '@/components/DataTable';
// import { Shield, Mail, Phone, User } from 'lucide-react';

// interface User {
//   id: string;
//   username: string;
//   email: string;
//   role: string;
//   telephone: string;
//   genre: string;
//   created_at: string;
// }

// const usersData: User[] = [
//   { id: '1', username: 'Admin Système', email: 'admin@entreprise.com', role: 'admin', telephone: '+33 6 00 00 00 01', genre: 'M', created_at: '2024-01-01' },
//   { id: '2', username: 'Thomas Dubois', email: 'thomas.dubois@entreprise.com', role: 'coordinateur', telephone: '+33 6 12 34 56 78', genre: 'M', created_at: '2024-01-15' },
//   { id: '3', username: 'Sophie Moreau', email: 'sophie.moreau@entreprise.com', role: 'coordinateur', telephone: '+33 6 23 45 67 89', genre: 'F', created_at: '2024-01-20' },
//   { id: '4', username: 'Pierre Martin', email: 'pierre.martin@entreprise.com', role: 'encadreur', telephone: '+33 6 45 67 89 01', genre: 'M', created_at: '2024-02-01' },
//   { id: '5', username: 'Julie Bernard', email: 'julie.bernard@entreprise.com', role: 'encadreur', telephone: '+33 6 56 78 90 12', genre: 'F', created_at: '2024-02-10' },
//   { id: '6', username: 'Marie Lambert', email: 'marie.lambert@entreprise.com', role: 'stagiaire', telephone: '+33 6 98 76 54 32', genre: 'F', created_at: '2024-02-15' },
//   { id: '7', username: 'Lucas Morel', email: 'lucas.morel@entreprise.com', role: 'stagiaire', telephone: '+33 6 87 65 43 21', genre: 'M', created_at: '2024-03-01' },
//   { id: '8', username: 'Emma Garcia', email: 'emma.garcia@entreprise.com', role: 'stagiaire', telephone: '+33 6 76 54 32 10', genre: 'F', created_at: '2024-03-05' },
//   { id: '9', username: 'Hugo Fernandez', email: 'hugo.fernandez@entreprise.com', role: 'stagiaire', telephone: '+33 6 65 43 21 09', genre: 'M', created_at: '2024-03-10' },
//   { id: '10', username: 'Léa Dubois', email: 'lea.dubois@entreprise.com', role: 'stagiaire', telephone: '+33 6 54 32 10 98', genre: 'F', created_at: '2024-03-15' },
// ];

// export default function UtilisateursPage() {
//   const [isLoading, setIsLoading] = useState(true);

//   // Simuler un chargement de données
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 1500); // Simule un chargement de 1.5 secondes

//     return () => clearTimeout(timer);
//   }, []);

//   const getRoleBadge = (role: string) => {
//     const styles: Record<string, string> = {
//       admin: 'bg-red-50 text-red-600 border-red-200',
//       coordinateur: 'bg-indigo-50 text-indigo-600 border-indigo-200',
//       encadreur: 'bg-amber-50 text-amber-600 border-amber-200',
//       stagiaire: 'bg-emerald-50 text-emerald-600 border-emerald-200',
//     };
//     return styles[role] || 'bg-gray-50 text-gray-600 border-gray-200';
//   };

//   const getRoleLabel = (role: string) => {
//     const labels: Record<string, string> = {
//       admin: 'Admin',
//       coordinateur: 'Coordinateur',
//       encadreur: 'Encadreur',
//       stagiaire: 'Stagiaire',
//     };
//     return labels[role] || role;
//   };

//   const columns: Column<User>[] = [
//     {
//       key: 'username',
//       header: 'Utilisateur',
//       sortable: true,
//       render: (user) => (
//         <div className="flex items-center gap-3 min-w-0">
//           <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold border border-indigo-200 flex-shrink-0">
//             {user.username.split(' ').map(n => n[0]).join('')}
//           </div>
//           <span className="text-sm font-semibold text-gray-800 truncate">{user.username}</span>
//         </div>
//       ),
//       width: '220px',
//     },
//     {
//       key: 'email',
//       header: 'Email',
//       sortable: true,
//       width: '280px',
//     },
//     {
//       key: 'telephone',
//       header: 'Téléphone',
//       sortable: true,
//       render: (user) => (
//         <span className="text-sm text-gray-600 whitespace-nowrap">
//           {user.telephone}
//         </span>
//       ),
//       width: '160px',
//     },
//     {
//       key: 'genre',
//       header: 'Genre',
//       sortable: true,
//       render: (user) => (
//         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
//           user.genre === 'M' 
//             ? 'bg-blue-50 text-blue-600 border-blue-200' 
//             : 'bg-pink-50 text-pink-600 border-pink-200'
//         }`}>
//           <User size={12} />
//           {user.genre === 'M' ? 'Masculin' : 'Féminin'}
//         </span>
//       ),
//       width: '120px',
//     },
//     {
//       key: 'role',
//       header: 'Rôle',
//       sortable: true,
//       render: (user) => (
//         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getRoleBadge(user.role)}`}>
//           <Shield size={12} />
//           {getRoleLabel(user.role)}
//         </span>
//       ),
//       width: '140px',
//     },
//     {
//       key: 'created_at',
//       header: 'Inscription',
//       sortable: true,
//       render: (user) => (
//         <span className="text-sm text-gray-500 whitespace-nowrap">
//           {new Date(user.created_at).toLocaleDateString('fr-FR', { 
//             year: 'numeric', 
//             month: '2-digit',
//             day: '2-digit'
//           })}
//         </span>
//       ),
//       width: '120px',
//     },
//   ];

//   return (
//     <div className="px-6 mt-6 max-w-7xl mx-auto">
//       <DataTable
//         data={usersData}
//         columns={columns}
//         title="Gestion des utilisateurs"
//         searchPlaceholder="Rechercher un utilisateur..."
//         onRowClick={(user) => console.log('Utilisateur cliqué:', user)}
//         loading={isLoading}
//         striped
     
//         stickyHeader
//         onExport={() => console.log('Export CSV')}
//         exportLabel="Télécharger"
//       />
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from 'react';
import { DataTable, type Column } from '@/components/DataTable';
import { Shield, Mail, Phone, User } from 'lucide-react';
import { DetailsModal, type DetailSection } from '@/components/DetailsModal';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  telephone: string;
  genre: string;
  created_at: string;
}

const usersData: User[] = [
  { id: '1', username: 'Admin Système', email: 'admin@entreprise.com', role: 'admin', telephone: '+33 6 00 00 00 01', genre: 'M', created_at: '2024-01-01' },
  { id: '2', username: 'Thomas Dubois', email: 'thomas.dubois@entreprise.com', role: 'coordinateur', telephone: '+33 6 12 34 56 78', genre: 'M', created_at: '2024-01-15' },
  { id: '3', username: 'Sophie Moreau', email: 'sophie.moreau@entreprise.com', role: 'coordinateur', telephone: '+33 6 23 45 67 89', genre: 'F', created_at: '2024-01-20' },
  { id: '4', username: 'Pierre Martin', email: 'pierre.martin@entreprise.com', role: 'encadreur', telephone: '+33 6 45 67 89 01', genre: 'M', created_at: '2024-02-01' },
  { id: '5', username: 'Julie Bernard', email: 'julie.bernard@entreprise.com', role: 'encadreur', telephone: '+33 6 56 78 90 12', genre: 'F', created_at: '2024-02-10' },
  { id: '6', username: 'Marie Lambert', email: 'marie.lambert@entreprise.com', role: 'stagiaire', telephone: '+33 6 98 76 54 32', genre: 'F', created_at: '2024-02-15' },
  { id: '7', username: 'Lucas Morel', email: 'lucas.morel@entreprise.com', role: 'stagiaire', telephone: '+33 6 87 65 43 21', genre: 'M', created_at: '2024-03-01' },
  { id: '8', username: 'Emma Garcia', email: 'emma.garcia@entreprise.com', role: 'stagiaire', telephone: '+33 6 76 54 32 10', genre: 'F', created_at: '2024-03-05' },
  { id: '9', username: 'Hugo Fernandez', email: 'hugo.fernandez@entreprise.com', role: 'stagiaire', telephone: '+33 6 65 43 21 09', genre: 'M', created_at: '2024-03-10' },
  { id: '10', username: 'Léa Dubois', email: 'lea.dubois@entreprise.com', role: 'stagiaire', telephone: '+33 6 54 32 10 98', genre: 'F', created_at: '2024-03-15' },
];

export default function UtilisateursPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simuler un chargement de données
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      admin: 'bg-red-50 text-red-600 border-red-200',
      coordinateur: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      encadreur: 'bg-amber-50 text-amber-600 border-amber-200',
      stagiaire: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    };
    return styles[role] || 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Admin',
      coordinateur: 'Coordinateur',
      encadreur: 'Encadreur',
      stagiaire: 'Stagiaire',
    };
    return labels[role] || role;
  };

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const getDetailSections = (user: User): DetailSection[] => {
    return [
      {
        title: 'Informations personnelles',
        fields: [
          {
            label: 'Nom complet',
            value: user.username,
            icon: <User size={16} />,
            span: 'full',
          },
          {
            label: 'Genre',
            value: user.genre === 'M' ? 'Masculin' : 'Féminin',
            span: 'half',
          },
          {
            label: 'Rôle',
            value: (
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                <Shield size={12} />
                {getRoleLabel(user.role)}
              </span>
            ),
            span: 'half',
          },
        ],
      },
      {
        title: 'Coordonnées',
        fields: [
          {
            label: 'Email',
            value: user.email,
            icon: <Mail size={16} />,
            span: 'full',
          },
          {
            label: 'Téléphone',
            value: user.telephone,
            icon: <Phone size={16} />,
            span: 'full',
          },
        ],
      },
      {
        title: 'Activité',
        fields: [
          {
            label: 'Date d\'inscription',
            value: new Date(user.created_at).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            span: 'half',
          },
          {
            label: 'ID utilisateur',
            value: `#${user.id}`,
            span: 'half',
          },
        ],
      },
    ];
  };

  const columns: Column<User>[] = [
    {
      key: 'username',
      header: 'Utilisateur',
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold border border-indigo-200 flex-shrink-0">
            {user.username.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="text-sm font-semibold text-gray-800 truncate">{user.username}</span>
        </div>
      ),
      width: '220px',
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      width: '280px',
    },
    {
      key: 'telephone',
      header: 'Téléphone',
      sortable: true,
      render: (user) => (
        <span className="text-sm text-gray-600 whitespace-nowrap">
          {user.telephone}
        </span>
      ),
      width: '160px',
    },
    {
      key: 'genre',
      header: 'Genre',
      sortable: true,
      render: (user) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
          user.genre === 'M' 
            ? 'bg-blue-50 text-blue-600 border-blue-200' 
            : 'bg-pink-50 text-pink-600 border-pink-200'
        }`}>
          <User size={12} />
          {user.genre === 'M' ? 'Masculin' : 'Féminin'}
        </span>
      ),
      width: '120px',
    },
    {
      key: 'role',
      header: 'Rôle',
      sortable: true,
      render: (user) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getRoleBadge(user.role)}`}>
          <Shield size={12} />
          {getRoleLabel(user.role)}
        </span>
      ),
      width: '140px',
    },
    {
      key: 'created_at',
      header: 'Inscription',
      sortable: true,
      render: (user) => (
        <span className="text-sm text-gray-500 whitespace-nowrap">
          {new Date(user.created_at).toLocaleDateString('fr-FR', { 
            year: 'numeric', 
            month: '2-digit',
            day: '2-digit'
          })}
        </span>
      ),
      width: '120px',
    },
  ];

  return (
    <div className="px-6 mt-6 max-w-7xl mx-auto">
      <DataTable
        data={usersData}
        columns={columns}
        title="Gestion des utilisateurs"
        searchPlaceholder="Rechercher un utilisateur..."
        onRowClick={handleRowClick}
        loading={isLoading}
        striped
        stickyHeader
        onExport={() => console.log('Export CSV')}
        exportLabel="Télécharger"
      />

      {/* Modal de détails */}
      {selectedUser && (
        <DetailsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={selectedUser.username}
          subtitle={
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(selectedUser.role)}`}>
              <Shield size={12} />
              {getRoleLabel(selectedUser.role)}
            </span>
          }
          avatar={selectedUser.username.split(' ').map(n => n[0]).join('')}
          sections={getDetailSections(selectedUser)}
          footer={
            <>
              <button 
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Annuler
              </button>
              <button 
                onClick={() => {
                  console.log('Modifier:', selectedUser);
                  closeModal();
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Modifier
              </button>
            </>
          }
        />
      )}
    </div>
  );
}