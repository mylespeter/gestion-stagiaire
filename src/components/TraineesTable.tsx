

"use client";
import { useState, useMemo } from 'react';
import { 
  Search, ChevronDown, GraduationCap, Briefcase,
  ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight,
  Settings2, ArrowUpDown, ArrowDown,
  Funnel,
  DownloadCloud
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { traineesData, type Trainee } from '@/data/traineesData';

interface TraineesTableProps {
  onTraineeClick: (trainee: Trainee) => void;
}

export function TraineesTable({ onTraineeClick }: TraineesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showRowsOptions, setShowRowsOptions] = useState(false);

  // Calculs pour la pagination
  const totalItems = traineesData.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  
  // Données paginées
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return traineesData.slice(startIndex, endIndex);
  }, [currentPage, rowsPerPage]);

  // Gérer le changement de page
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Gérer le changement de lignes par page
  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1); // Reset à la première page
    setShowRowsOptions(false);
  };

  // Calcul pour l'affichage "X à Y de Z"
  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalItems);

  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex-1 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
      
      {/* En-tête du tableau */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4 flex-wrap bg-white">
        <div className="flex items-center gap-4">
          <h2 className="font-bold text-gray-900 text-base tracking-tight">Gestion des stagiaires</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Rechercher" className="w-48 bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm transition-colors text-gray-600 font-medium">
            Filtrer <Funnel className='w-4'/>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm transition-colors text-gray-600 font-medium">
            Trier <ArrowUpDown className='w-4'/>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm transition-colors text-gray-600 font-medium">
            Exporter <DownloadCloud className='w-4'/>
          </button>
        </div>
      </div>

      {/* Tableau avec scroll horizontal */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-[1100px]">
          
          {/* Colonnes */}
          <div className="grid grid-cols-[40px_200px_130px_200px_150px_100px_120px_180px] gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div className="flex items-center">
              <input type="checkbox" className="accent-indigo-600 rounded border-gray-300 w-4 h-4 cursor-pointer" />
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-gray-800">Stagiaire <ChevronDown className="w-3 h-3" /></div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-gray-800">Type <ChevronDown className="w-3 h-3" /></div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-gray-800">Email <ChevronDown className="w-3 h-3" /></div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-gray-800">Période <ChevronDown className="w-3 h-3" /></div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-gray-800">Statut <ChevronDown className="w-3 h-3" /></div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-gray-800">Note <ChevronDown className="w-3 h-3" /></div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-gray-800">École <ChevronDown className="w-3 h-3" /></div>
          </div>

          {/* Lignes */}
          <div className="bg-white">
            {paginatedData.map((trainee) => (
              <div 
                key={trainee.id} 
                onClick={() => onTraineeClick(trainee)}
                className="grid grid-cols-[40px_200px_130px_200px_150px_100px_120px_180px] gap-4 px-4 py-3 border-b border-gray-100 hover:bg-indigo-50/60 transition-colors items-center cursor-pointer group"
              >
                <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" className="accent-indigo-600 rounded border-gray-300 w-4 h-4 cursor-pointer" />
                </div>
                
                <div className="flex items-center gap-3 text-sm font-semibold text-gray-800">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0 border border-indigo-200">
                    {trainee.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <span className="truncate">{trainee.name}</span>
                </div>

                <div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                    trainee.type === 'Académique' 
                      ? 'bg-blue-50 text-blue-600 border-blue-200' 
                      : 'bg-purple-50 text-purple-600 border-purple-200'
                  }`}>
                    {trainee.type === 'Académique' ? <GraduationCap size={12} /> : <Briefcase size={12} />}
                    {trainee.type}
                  </span>
                </div>

                <div className="text-sm text-gray-500 truncate font-medium">{trainee.email}</div>
                <div className="text-sm text-gray-600 font-medium">{trainee.period}</div>
                
                <div>
                  <StatusBadge status={trainee.status} />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden max-w-[60px]">
                    <div 
                      className={`h-full rounded-full ${trainee.score >= 70 ? 'bg-emerald-500' : trainee.score >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                      style={{ width: `${trainee.score}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 font-bold w-6 text-right tabular-nums">{trainee.score}</span>
                </div>

                <div className="text-sm text-gray-600 font-medium truncate">{trainee.school}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination fonctionnelle */}
      <div className="p-3 border-t border-gray-200 bg-white flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-3">
          {/* Sélecteur de lignes par page */}
          <div className="relative">
            <button 
              onClick={() => setShowRowsOptions(!showRowsOptions)}
              className="flex items-center gap-1 px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 text-xs font-medium text-gray-600"
            >
              {rowsPerPage} <ChevronDown size={14} />
            </button>
            
            {showRowsOptions && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowRowsOptions(false)}></div>
                <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  {[5, 10, 20, 50].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleRowsPerPageChange(num)}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-600 ${
                        rowsPerPage === num ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          
          <span className="font-medium text-xs">
            Affichage {startItem} à {endItem} de {totalItems} stagiaires
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Première page */}
          <button 
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className="p-1.5 hover:bg-gray-100 rounded text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronsLeft size={16} />
          </button>
          
          {/* Page précédente */}
          <button 
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 hover:bg-gray-100 rounded text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          
          {/* Numéros de page */}
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
            ) : (
              <button
                key={page}
                onClick={() => goToPage(page as number)}
                className={`px-3 py-1 rounded font-medium text-xs ${
                  currentPage === page 
                    ? 'bg-indigo-600 text-white' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {page}
              </button>
            )
          ))}
          
          {/* Page suivante */}
          <button 
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1.5 hover:bg-gray-100 rounded text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
          
          {/* Dernière page */}
          <button 
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1.5 hover:bg-gray-100 rounded text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}