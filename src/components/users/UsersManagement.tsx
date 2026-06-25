

// components/users/UsersManagement.tsx
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { DataTable, Column } from '@/components/DataTable';
import { StatCard } from '@/components/ui/StatCard';
import { UserDetailsModal } from '@/components/users/UserDetailsModal';
import { UserFormModal } from '@/components/users/UserFormModal';
import { User } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Edit2, Eye } from 'lucide-react';

export function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setShowFormModal(true);
  };

  const handleAddUser = () => {
    setUserToEdit(null);
    setShowFormModal(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${user.username} ?`)) return;

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id);

      if (error) throw error;
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const stats = {
    total: users.length,
    stagiaires: users.filter(u => u.role === 'stagiaire').length,
    encadreurs: users.filter(u => u.role === 'encadreur').length,
    coordinateurs: users.filter(u => u.role === 'coordinateur').length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: 'bg-purple-100 text-purple-700',
      coordinateur: 'bg-blue-100 text-blue-700',
      encadreur: 'bg-emerald-100 text-emerald-700',
      stagiaire: 'bg-amber-100 text-amber-700',
    };
    return badges[role as keyof typeof badges] || 'bg-gray-100 text-gray-700';
  };

const columns: Column<User>[] = [
  {
    key: 'username',
    header: 'Utilisateur',
    // width: '230px',
    sortable: true,
    render: (user) => (
      // Structure correcte pour truncate
      <div className="flex items-center gap-3 min-w-0 w-full">
        {user.photo_profil ? (
          <img 
            src={user.photo_profil} 
            alt={user.username}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 flex-shrink-0">
            {user.username?.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0 overflow-hidden">
          <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'role',
    header: 'Rôle',
        width: '120px',

    sortable: true,
    render: (user) => (
      // Ajouter un wrapper avec truncate
      <div className="min-w-0 overflow-hidden w-full">
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize whitespace-nowrap ${getRoleBadge(user.role)}`}>
          {user.role}
        </span>
      </div>
    ),
  },
  {
    key: 'genre',
    header: 'Genre',
    render: (user) => (
      // Ajouter truncate
      <span className="text-sm text-gray-600 block truncate w-full">
        {user.genre === 'M' ? 'M' : user.genre === 'F' ? 'F' : '-'}
      </span>
    ),
  },
  {
    key: 'telephone',
    header: 'Téléphone',
    render: (user) => (
      // Ajouter truncate
      <span className="text-sm text-gray-600 block truncate w-full">
        {user.telephone || '-'}
      </span>
    ),
  },
  {
    key: 'created_at',
    header: 'Créé le',
    sortable: true,
    render: (user) => (
      // Ajouter truncate
      <span className="text-sm text-gray-600 block truncate w-full">
        {new Date(user.created_at).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })}
      </span>
    ),
  },
  {
    key: 'actions',
    header: 'Actions',
        width: '120px',

    className: 'text-right',
    render: (user) => (
      // Garder flex-shrink-0 pour que les boutons ne soient pas coupés
      <div className="flex items-center justify-end gap-1 flex-shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewUser(user);
          }}
          className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Eye className='w-5'/>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEditUser(user);
          }}
          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="Modifier"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteUser(user);
          }}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Supprimer"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ),
  },
];

  return (
    <div className="space-y- ">
      {/* En-tête avec titre et bouton */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez les comptes et les rôles des utilisateurs</p>
        </div>
        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={16} />
          Ajouter un utilisateur
        </button>
      </div>

   

{/* Stats avec pourcentage */}
<div className="grid grid-cols-2 my-6 md:grid-cols-3 lg:grid-cols-5 gap-3">
  <StatCard 
    label="Total" 
    value={String(stats.total)} 
    size="sm"
    trend={{ value: "8%", isPositive: true }}
  />
  <StatCard 
    label="Stagiaires" 
    value={String(stats.stagiaires)} 
    size="sm"
    trend={{ value: "14%", isPositive: true }}
  />
  <StatCard 
    label="Encadreurs" 
    value={String(stats.encadreurs)} 
    size="sm"
    trend={{ value: "11%", isPositive: true }}
  />
  <StatCard 
    label="Coordinateurs" 
    value={String(stats.coordinateurs)} 
    size="sm"
    trend={{ value: "0%", isPositive: true }}
  />
  <StatCard 
    label="Admins" 
    value={String(stats.admins)} 
    size="sm"
    trend={{ value: "25%", isPositive: false }}
  />
</div>

      {/* Tableau */}
      <DataTable<User>
        data={users}
        columns={columns}
        title="Tous les utilisateurs"
        searchPlaceholder="Rechercher un utilisateur..."
        onRowClick={handleViewUser}
        loading={loading}
        emptyMessage="Aucun utilisateur trouvé"
        striped
        compact
        selectable={false}
        minWidth="800px"
        onExport={() => console.log('Export CSV')}
        exportLabel="Exporter"
      />

      {/* Modals */}
      <UserDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      <UserFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setUserToEdit(null);
        }}
        onSuccess={fetchUsers}
        userToEdit={userToEdit}
      />
    </div>
  );
}