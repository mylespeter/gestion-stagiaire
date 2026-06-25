"use client";
import { DataTable, type Column } from '@/components/DataTable';
import { TrendingUp, TrendingDown, DollarSign, Package } from 'lucide-react';

interface Sale {
  id: string;
  product: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
  client: string;
  date: string;
  trend: 'up' | 'down';
}

const salesData: Sale[] = [
  { id: '1', product: 'Formation Web', amount: 1500, status: 'completed', client: 'Sophie Martin', date: '2024-03-15', trend: 'up' },
  { id: '2', product: 'Stage Marketing', amount: 800, status: 'pending', client: 'Lucas Bernard', date: '2024-03-14', trend: 'down' },
  { id: '3', product: 'Atelier Design', amount: 2300, status: 'completed', client: 'Emma Petit', date: '2024-03-13', trend: 'up' },
  { id: '4', product: 'Coaching Pro', amount: 1200, status: 'cancelled', client: 'Thomas Dubois', date: '2024-03-12', trend: 'down' },
  { id: '5', product: 'Formation Data', amount: 3000, status: 'completed', client: 'Marie Lambert', date: '2024-03-11', trend: 'up' },
  { id: '6', product: 'Stage DevOps', amount: 950, status: 'pending', client: 'Hugo Fernandez', date: '2024-03-10', trend: 'up' },
  { id: '7', product: 'Atelier UX', amount: 1800, status: 'completed', client: 'Chloé Robert', date: '2024-03-09', trend: 'up' },
  { id: '8', product: 'Formation IA', amount: 4500, status: 'pending', client: 'Gabriel Michel', date: '2024-03-08', trend: 'down' },
];

export default function VentesPage() {
  const columns: Column<Sale>[] = [
    {
      key: 'product',
      header: 'Produit',
      sortable: true,
      render: (sale) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            <Package size={16} />
          </div>
          <span className="text-sm font-semibold text-gray-800">{sale.product}</span>
        </div>
      ),
      width: '200px',
    },
    {
      key: 'client',
      header: 'Client',
      sortable: true,
      render: (sale) => (
        <span className="text-sm text-gray-600 font-medium">{sale.client}</span>
      ),
    },
    {
      key: 'amount',
      header: 'Montant',
      sortable: true,
      render: (sale) => (
        <div className="flex items-center gap-2">
          <DollarSign size={14} className="text-gray-400" />
          <span className="text-sm font-semibold text-gray-800">{sale.amount.toLocaleString()} €</span>
          {sale.trend === 'up' ? (
            <TrendingUp size={14} className="text-emerald-500" />
          ) : (
            <TrendingDown size={14} className="text-red-500" />
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Statut',
      sortable: true,
      render: (sale) => {
        const statusStyles = {
          completed: 'bg-emerald-50 text-emerald-600 border-emerald-200',
          pending: 'bg-amber-50 text-amber-600 border-amber-200',
          cancelled: 'bg-red-50 text-red-600 border-red-200',
        };
        const statusLabels = {
          completed: 'Payée',
          pending: 'En attente',
          cancelled: 'Annulée',
        };
        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[sale.status]}`}>
            {statusLabels[sale.status]}
          </span>
        );
      },
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (sale) => (
        <span className="text-sm text-gray-500">
          {new Date(sale.date).toLocaleDateString('fr-FR', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}
        </span>
      ),
    },
  ];

  return (
    <>
    <div className='max-w-6xl p-4 mx-auto'>


    <DataTable
      data={salesData}
      columns={columns}
      title="Historique des ventes"
      searchPlaceholder="Rechercher une vente..."
      onRowClick={(sale) => console.log('Vente cliquée:', sale)}
    />
    </div>
    </>
  );
}