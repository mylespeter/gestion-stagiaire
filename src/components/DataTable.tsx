

// // components/DataTable.tsx
// "use client";
// import { useState, useMemo, useCallback } from 'react';
// import { 
//   Search, ChevronDown, ArrowUpDown,
//   ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight,
//   Funnel,
//   DownloadCloud,
//   ArrowUp,
//   ArrowDown,
//   X
// } from 'lucide-react';

// // Types pour la configuration des colonnes
// export interface Column<T> {
//   key: string;
//   header: string;
//   sortable?: boolean;
//   render?: (item: T) => React.ReactNode;
//   width?: string;
//   maxChars?: number;
//   className?: string;
// }

// interface DataTableProps<T> {
//   data: T[];
//   columns: Column<T>[];
//   title?: string;
//   searchPlaceholder?: string;
//   searchable?: boolean;
//   onRowClick?: (item: T) => void;
//   selectable?: boolean;
//   defaultRowsPerPage?: number;
//   rowsPerPageOptions?: number[];
//   gridTemplateColumns?: string;
//   renderHeader?: () => React.ReactNode;
//   minWidth?: string;
//   loading?: boolean;
//   emptyMessage?: string;
//   stickyHeader?: boolean;
//   striped?: boolean;
//   compact?: boolean;
//   onExport?: () => void;
//   exportLabel?: string;
// }

// export function DataTable<T extends { id: string | number }>({
//   data,
//   columns,
//   title,
//   searchPlaceholder = "Rechercher",
//   searchable = true,
//   onRowClick,
//   selectable = true,
//   defaultRowsPerPage = 10,
//   rowsPerPageOptions = [5, 10, 20, 50],
//   gridTemplateColumns,
//   renderHeader,
//   minWidth = "900px",
//   loading = false,
//   emptyMessage = "Aucun résultat trouvé",
//   stickyHeader = false,
//   striped = false,
//   compact = false,
//   onExport,
//   exportLabel = "Exporter",
// }: DataTableProps<T>) {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
//   const [showRowsOptions, setShowRowsOptions] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
  
//   const [sortColumn, setSortColumn] = useState<string | null>(null);
//   const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
//   const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
//   const [selectAll, setSelectAll] = useState(false);

//   // Helper pour déterminer l'alignement
//   const getAlignment = (className?: string) => {
//     if (className?.includes('text-right')) return 'flex-end';
//     if (className?.includes('text-center')) return 'center';
//     return 'flex-start';
//   };

//   // Tri des données
//   const sortedData = useMemo(() => {
//     if (!sortColumn) return data;
    
//     return [...data].sort((a, b) => {
//       const aVal = (a as any)[sortColumn];
//       const bVal = (b as any)[sortColumn];
      
//       if (aVal == null) return 1;
//       if (bVal == null) return -1;
      
//       if (typeof aVal === 'string' && typeof bVal === 'string') {
//         return sortDirection === 'asc' 
//           ? aVal.localeCompare(bVal)
//           : bVal.localeCompare(aVal);
//       }
      
//       return sortDirection === 'asc' 
//         ? (aVal > bVal ? 1 : -1)
//         : (bVal > aVal ? 1 : -1);
//     });
//   }, [data, sortColumn, sortDirection]);

//   // Filtrage
//   const filteredData = useMemo(() => {
//     if (!searchTerm.trim()) return sortedData;
//     return sortedData.filter(item => 
//       columns.some(col => {
//         const value = (item as any)[col.key];
//         return value && String(value).toLowerCase().includes(searchTerm.toLowerCase());
//       })
//     );
//   }, [sortedData, searchTerm, columns]);

//   // Pagination
//   const totalItems = filteredData.length;
//   const totalPages = Math.ceil(totalItems / rowsPerPage);
  
//   const paginatedData = useMemo(() => {
//     const startIndex = (currentPage - 1) * rowsPerPage;
//     const endIndex = startIndex + rowsPerPage;
//     return filteredData.slice(startIndex, endIndex);
//   }, [filteredData, currentPage, rowsPerPage]);

//   useMemo(() => {
//     if (currentPage > totalPages && totalPages > 0) {
//       setCurrentPage(1);
//     }
//   }, [totalItems, currentPage, totalPages]);

//   const handleSort = useCallback((columnKey: string) => {
//     if (sortColumn === columnKey) {
//       setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortColumn(columnKey);
//       setSortDirection('asc');
//     }
//   }, [sortColumn]);

//   const handleSelectAll = useCallback(() => {
//     if (selectAll) {
//       setSelectedIds(new Set());
//       setSelectAll(false);
//     } else {
//       const allIds = new Set(paginatedData.map(item => item.id));
//       setSelectedIds(allIds);
//       setSelectAll(true);
//     }
//   }, [selectAll, paginatedData]);

//   const handleSelectItem = useCallback((id: string | number) => {
//     const newSelected = new Set(selectedIds);
//     if (newSelected.has(id)) {
//       newSelected.delete(id);
//     } else {
//       newSelected.add(id);
//     }
//     setSelectedIds(newSelected);
//     setSelectAll(newSelected.size === paginatedData.length);
//   }, [selectedIds, paginatedData]);

//   const gridCols = useMemo(() => {
//     if (gridTemplateColumns) return gridTemplateColumns;
    
//     const cols = [];
//     if (selectable) cols.push('40px');
    
//     columns.forEach(col => {
//       if (col.width) {
//         cols.push(col.width);
//       } else {
//         cols.push('1fr');
//       }
//     });
    
//     return cols.join(' ');
//   }, [columns, selectable, gridTemplateColumns]);

//   const truncateText = (text: string, maxChars?: number) => {
//     if (!maxChars || !text) return text || '';
//     if (text.length <= maxChars) return text;
//     return text.substring(0, maxChars) + '...';
//   };

//   const goToPage = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleRowsPerPageChange = (value: number) => {
//     setRowsPerPage(value);
//     setCurrentPage(1);
//     setShowRowsOptions(false);
//   };

//   const startItem = totalItems > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
//   const endItem = Math.min(currentPage * rowsPerPage, totalItems);

//   const getPageNumbers = () => {
//     const pages = [];
//     const maxVisible = 5;
    
//     if (totalPages <= maxVisible) {
//       for (let i = 1; i <= totalPages; i++) pages.push(i);
//     } else {
//       if (currentPage <= 3) {
//         for (let i = 1; i <= 4; i++) pages.push(i);
//         pages.push('...');
//         pages.push(totalPages);
//       } else if (currentPage >= totalPages - 2) {
//         pages.push(1);
//         pages.push('...');
//         for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
//       } else {
//         pages.push(1);
//         pages.push('...');
//         for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
//         pages.push('...');
//         pages.push(totalPages);
//       }
//     }
    
//     return pages;
//   };

//   if (loading) {
//     return (
//       <div className="bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <div className="animate-pulse flex items-center justify-between">
//             <div className="h-6 bg-gray-200 rounded w-48"></div>
//             <div className="h-10 bg-gray-200 rounded w-64"></div>
//           </div>
//         </div>
//         {[1, 2, 3, 4, 5].map((i) => (
//           <div key={i} className="px-6 py-4 animate-pulse">
//             <div className="h-4 bg-gray-200 rounded w-full"></div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
      
//       {/* En-tête */}
// {renderHeader ? renderHeader() : (
//   <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-4 flex-wrap bg-white">
//     <div className="flex items-center gap-4">
//       {title && <h2 className="font-bold text-gray-900 text-lg tracking-tight whitespace-nowrap">{title}</h2>}
//       {searchable && (
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//           <input 
//             type="text" 
//             placeholder={searchPlaceholder}
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="w-56 lg:w-64 bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
//           />
//           {searchTerm && (
//             <button
//               onClick={() => setSearchTerm('')}
//               className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
//             >
//               <X size={14} className="text-gray-400" />
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//     <div className="flex items-center gap-1.5">
//       {selectedIds.size > 0 && (
//         <span className="text-sm text-indigo-600 font-medium px-3 py-1.5 bg-indigo-50 rounded-lg">
//           {selectedIds.size} sélectionné{selectedIds.size > 1 ? 's' : ''}
//         </span>
//       )}
//       <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm transition-colors text-gray-600 font-medium">
//         <Funnel size={14} />
//         <span className="hidden sm:inline">Filtrer</span>
//       </button>
//       <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm transition-colors text-gray-600 font-medium">
//         <ArrowUpDown size={14} />
//         <span className="hidden sm:inline">Trier</span>
//       </button>
//       {onExport && (
//         <button 
//           onClick={onExport}
//           className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm transition-colors text-gray-600 font-medium"
//         >
//           <DownloadCloud size={14} />
//           <span className="hidden sm:inline">{exportLabel}</span>
//         </button>
//       )}
//     </div>
//   </div>
// )}
//       {/* Tableau avec scroll horizontal */}
//       <div className="overflow-x-auto">
//         <div className="inline-block min-w-full">
//           <div style={{ minWidth: minWidth }}>
            
//             {/* Ligne d'en-tête des colonnes */}
//             <div 
//               className={`grid gap-4 px-6 py-3 bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider ${
//                 stickyHeader ? 'sticky top-0 z-10 backdrop-blur-sm' : ''
//               }`}
//               style={{ gridTemplateColumns: gridCols }}
//             >
//               {selectable && (
//                 <div className="flex items-center justify-center">
//                   <input 
//                     type="checkbox"
//                     checked={selectAll}
//                     onChange={handleSelectAll}
//                     className="accent-indigo-600 rounded border-gray-300 w-4 h-4 cursor-pointer" 
//                   />
//                 </div>
//               )}
//               {columns.map((col) => (
//                 <div 
//                   key={col.key} 
//                   onClick={() => col.sortable && handleSort(col.key)}
//                   className={`flex items-center gap-1.5 ${col.sortable ? 'cursor-pointer hover:text-gray-900 select-none group' : ''}`}
//                   style={{ justifyContent: getAlignment(col.className) }}
//                 >
//                   <span className="truncate">{col.header}</span>
//                   {col.sortable && (
//                     <span className="flex-shrink-0">
//                       {sortColumn === col.key ? (
//                         sortDirection === 'asc' ? (
//                           <ArrowUp className="w-3.5 h-3.5 text-indigo-600" />
//                         ) : (
//                           <ArrowDown className="w-3.5 h-3.5 text-indigo-600" />
//                         )
//                       ) : (
//                         <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-colors" />
//                       )}
//                     </span>
//                   )}
//                 </div>
//               ))}
//             </div>

//           {/* Lignes de données */}
// <div className="bg-white divide-y divide-gray-100">
//   {paginatedData.length === 0 ? (
//     <div className="text-center py-16 text-gray-500 text-sm">
//       <p className="text-lg mb-1">🔍</p>
//       <p>{emptyMessage}</p>
//       {searchTerm && (
//         <div className="flex flex-col items-center gap-2 mt-3">
//           <p className="text-xs text-gray-400">
//             Essayez de modifier vos critères de recherche
//           </p>
//           <button
//             onClick={() => setSearchTerm('')}
//             className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
//           >
//             Effacer la recherche
//           </button>
//         </div>
//       )}
//     </div>
//   ) : (
//     paginatedData.map((item, index) => (
//       <div 
//         key={item.id} 
//         onClick={() => onRowClick?.(item)}
//         className={`grid gap-4 px-6 ${compact ? 'py-2' : 'py-3.5'} transition-colors ${
//           striped && index % 2 === 0 ? 'bg-gray-50/50' : ''
//         } ${
//           onRowClick ? 'cursor-pointer hover:bg-indigo-50/40' : 'hover:bg-gray-50/50'
//         } ${
//           selectedIds.has(item.id) ? 'bg-indigo-50/50 ring-1 ring-indigo-200' : ''
//         }`}
//         style={{ gridTemplateColumns: gridCols }}
//       >
//         {selectable && (
//           <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
//             <input 
//               type="checkbox"
//               checked={selectedIds.has(item.id)}
//               onChange={() => handleSelectItem(item.id)}
//               className="accent-indigo-600 rounded border-gray-300 w-4 h-4 cursor-pointer" 
//             />
//           </div>
//         )}
//         {/* CORRECTION ICI : Structure pour que truncate fonctionne */}
//         {columns.map((col) => (
//           <div 
//             key={col.key}
//             className="flex items-center"
//             style={{ 
//               justifyContent: getAlignment(col.className),
//               minWidth: 0, // Important pour le truncate
//               overflow: 'hidden' // Important pour le truncate
//             }}
//             title={typeof (item as any)[col.key] === 'string' ? (item as any)[col.key] : undefined}
//           >
//             {col.render ? (
//               <div className="min-w-0 overflow-hidden w-full">
//                 {col.render(item)}
//               </div>
//             ) : (
//               <span className="text-sm text-gray-700 block truncate w-full">
//                 {truncateText(String((item as any)[col.key] || ''), col.maxChars)}
//               </span>
//             )}
//           </div>
//         ))}
//       </div>
//     ))
//   )}
// </div>
//           </div>
//         </div>
//       </div>

//       {/* Pagination */}
//       {totalItems > 0 && (
//         <div className="px-6 py-3 border-t border-gray-200 bg-white flex items-center justify-between text-sm text-gray-600">
//           <div className="flex items-center gap-4">
//             <div className="relative">
//               <button 
//                 onClick={() => setShowRowsOptions(!showRowsOptions)}
//                 className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm font-medium text-gray-600 transition-colors"
//               >
//                 {rowsPerPage} <ChevronDown size={14} />
//               </button>
              
//               {showRowsOptions && (
//                 <>
//                   <div className="fixed inset-0 z-10" onClick={() => setShowRowsOptions(false)}></div>
//                   <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden min-w-[80px]">
//                     {rowsPerPageOptions.map((num) => (
//                       <button
//                         key={num}
//                         onClick={() => handleRowsPerPageChange(num)}
//                         className={`block w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors ${
//                           rowsPerPage === num ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600'
//                         }`}
//                       >
//                         {num}
//                       </button>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
            
//             <span className="text-sm text-gray-500 whitespace-nowrap">
//               {startItem}-{endItem} <span className="text-gray-400">sur</span> {totalItems}
//             </span>
//           </div>

//           <div className="flex items-center gap-1">
//             <button 
//               onClick={() => goToPage(1)} 
//               disabled={currentPage === 1} 
//               className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//             >
//               <ChevronsLeft size={16} />
//             </button>
//             <button 
//               onClick={() => goToPage(currentPage - 1)} 
//               disabled={currentPage === 1} 
//               className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//             >
//               <ChevronLeft size={16} />
//             </button>
            
//             <div className="flex items-center gap-0.5 mx-1">
//               {getPageNumbers().map((page, index) => (
//                 page === '...' ? (
//                   <span key={`ellipsis-${index}`} className="px-2 text-gray-400 text-xs">•••</span>
//                 ) : (
//                   <button
//                     key={page}
//                     onClick={() => goToPage(page as number)}
//                     className={`min-w-[32px] h-8 rounded-lg font-medium text-sm transition-all ${
//                       currentPage === page 
//                         ? 'bg-indigo-600 text-white shadow-sm scale-105' 
//                         : 'hover:bg-gray-100 text-gray-600 hover:scale-105'
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 )
//               ))}
//             </div>
            
//             <button 
//               onClick={() => goToPage(currentPage + 1)} 
//               disabled={currentPage === totalPages} 
//               className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//             >
//               <ChevronRight size={16} />
//             </button>
//             <button 
//               onClick={() => goToPage(totalPages)} 
//               disabled={currentPage === totalPages} 
//               className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//             >
//               <ChevronsRight size={16} />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// components/DataTable.tsx
"use client";
import { useState, useMemo, useCallback } from 'react';
import { 
  Search, ChevronDown, ArrowUpDown,
  ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight,
  Funnel,
  DownloadCloud,
  ArrowUp,
  ArrowDown,
  X,
  Loader2
} from 'lucide-react';

// Types pour la configuration des colonnes
export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  width?: string;
  maxChars?: number;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  searchPlaceholder?: string;
  searchable?: boolean;
  onRowClick?: (item: T) => void;
  selectable?: boolean;
  defaultRowsPerPage?: number;
  rowsPerPageOptions?: number[];
  gridTemplateColumns?: string;
  renderHeader?: () => React.ReactNode;
  minWidth?: string;
  loading?: boolean;
  emptyMessage?: string;
  stickyHeader?: boolean;
  striped?: boolean;
  compact?: boolean;
  onExport?: () => void;
  exportLabel?: string;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  title,
  searchPlaceholder = "Rechercher",
  searchable = true,
  onRowClick,
  selectable = true,
  defaultRowsPerPage = 10,
  rowsPerPageOptions = [5, 10, 20, 50],
  gridTemplateColumns,
  renderHeader,
  minWidth = "900px",
  loading = false,
  emptyMessage = "Aucun résultat trouvé",
  stickyHeader = false,
  striped = false,
  compact = false,
  onExport,
  exportLabel = "Exporter",
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [showRowsOptions, setShowRowsOptions] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // État interne pour simuler ou gérer le chargement
  const [internalLoading, setInternalLoading] = useState(false);

  // Helper pour déterminer l'alignement
  const getAlignment = (className?: string) => {
    if (className?.includes('text-right')) return 'flex-end';
    if (className?.includes('text-center')) return 'center';
    return 'flex-start';
  };

  // Tri des données
  const sortedData = useMemo(() => {
    if (!sortColumn) return data;
    
    return [...data].sort((a, b) => {
      const aVal = (a as any)[sortColumn];
      const bVal = (b as any)[sortColumn];
      
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      return sortDirection === 'asc' 
        ? (aVal > bVal ? 1 : -1)
        : (bVal > aVal ? 1 : -1);
    });
  }, [data, sortColumn, sortDirection]);

  // Filtrage avec loader
  const filteredData = useMemo(() => {
    setInternalLoading(true);
    const timeout = setTimeout(() => setInternalLoading(false), 300);
    
    if (!searchTerm.trim()) {
      clearTimeout(timeout);
      setInternalLoading(false);
      return sortedData;
    }
    
    const result = sortedData.filter(item => 
      columns.some(col => {
        const value = (item as any)[col.key];
        return value && String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
    
    return result;
  }, [sortedData, searchTerm, columns]);

  // Pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, rowsPerPage]);

  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalItems, currentPage, totalPages]);

  const handleSort = useCallback((columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  }, [sortColumn]);

  const handleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelectedIds(new Set());
      setSelectAll(false);
    } else {
      const allIds = new Set(paginatedData.map(item => item.id));
      setSelectedIds(allIds);
      setSelectAll(true);
    }
  }, [selectAll, paginatedData]);

  const handleSelectItem = useCallback((id: string | number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
    setSelectAll(newSelected.size === paginatedData.length);
  }, [selectedIds, paginatedData]);

  const gridCols = useMemo(() => {
    if (gridTemplateColumns) return gridTemplateColumns;
    
    const cols = [];
    if (selectable) cols.push('40px');
    
    columns.forEach(col => {
      if (col.width) {
        cols.push(col.width);
      } else {
        cols.push('1fr');
      }
    });
    
    return cols.join(' ');
  }, [columns, selectable, gridTemplateColumns]);

  const truncateText = (text: string, maxChars?: number) => {
    if (!maxChars || !text) return text || '';
    if (text.length <= maxChars) return text;
    return text.substring(0, maxChars) + '...';
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
    setShowRowsOptions(false);
  };

  const startItem = totalItems > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * rowsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
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

  // Loader principal (loading externe)
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="animate-pulse flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="h-10 bg-gray-200 rounded w-64"></div>
          </div>
        </div>
        <div className="p-8 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-sm text-gray-500">Chargement des données...</p>
        </div>
        <div className="space-y-3 p-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden shadow-sm relative">
      
      {/* Loader interne pour les opérations de recherche/filtrage */}
      {internalLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-sm font-medium text-gray-600">Filtrage en cours...</p>
          </div>
        </div>
      )}

      {/* En-tête */}
      {renderHeader ? renderHeader() : (
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-4 flex-wrap bg-white">
          <div className="flex items-center gap-4">
            {title && <h2 className="font-bold text-gray-900 text-lg tracking-tight whitespace-nowrap">{title}</h2>}
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-56 lg:w-64 bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X size={14} className="text-gray-400" />
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {selectedIds.size > 0 && (
              <span className="text-sm text-indigo-600 font-medium px-3 py-1.5 bg-indigo-50 rounded-lg">
                {selectedIds.size} sélectionné{selectedIds.size > 1 ? 's' : ''}
              </span>
            )}
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm transition-colors text-gray-600 font-medium">
              <Funnel size={14} />
              <span className="hidden sm:inline">Filtrer</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm transition-colors text-gray-600 font-medium">
              <ArrowUpDown size={14} />
              <span className="hidden sm:inline">Trier</span>
            </button>
            {onExport && (
              <button 
                onClick={onExport}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm transition-colors text-gray-600 font-medium"
              >
                <DownloadCloud size={14} />
                <span className="hidden sm:inline">{exportLabel}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tableau avec scroll horizontal */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div style={{ minWidth: minWidth }}>
            
            {/* Ligne d'en-tête des colonnes */}
            <div 
              className={`grid gap-4 px-6 py-3 bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                stickyHeader ? 'sticky top-0 z-10 backdrop-blur-sm' : ''
              }`}
              style={{ gridTemplateColumns: gridCols }}
            >
              {selectable && (
                <div className="flex items-center justify-center">
                  <input 
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="accent-indigo-600 rounded border-gray-300 w-4 h-4 cursor-pointer" 
                  />
                </div>
              )}
              {columns.map((col) => (
                <div 
                  key={col.key} 
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`flex items-center gap-1.5 ${col.sortable ? 'cursor-pointer hover:text-gray-900 select-none group' : ''}`}
                  style={{ justifyContent: getAlignment(col.className) }}
                >
                  <span className="truncate">{col.header}</span>
                  {col.sortable && (
                    <span className="flex-shrink-0">
                      {sortColumn === col.key ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="w-3.5 h-3.5 text-indigo-600" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5 text-indigo-600" />
                        )
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      )}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Lignes de données */}
            <div className="bg-white divide-y divide-gray-100">
              {paginatedData.length === 0 ? (
                <div className="text-center py-16 text-gray-500 text-sm">
                  <p className="text-lg mb-1">🔍</p>
                  <p>{emptyMessage}</p>
                  {searchTerm && (
                    <div className="flex flex-col items-center gap-2 mt-3">
                      <p className="text-xs text-gray-400">
                        Essayez de modifier vos critères de recherche
                      </p>
                      <button
                        onClick={() => setSearchTerm('')}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        Effacer la recherche
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                paginatedData.map((item, index) => (
                  <div 
                    key={item.id} 
                    onClick={() => onRowClick?.(item)}
                    className={`grid gap-4 px-6 ${compact ? 'py-2' : 'py-3.5'} transition-colors ${
                      striped && index % 2 === 0 ? 'bg-gray-50/50' : ''
                    } ${
                      onRowClick ? 'cursor-pointer hover:bg-indigo-50/40' : 'hover:bg-gray-50/50'
                    } ${
                      selectedIds.has(item.id) ? 'bg-indigo-50/50 ring-1 ring-indigo-200' : ''
                    }`}
                    style={{ gridTemplateColumns: gridCols }}
                  >
                    {selectable && (
                      <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox"
                          checked={selectedIds.has(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className="accent-indigo-600 rounded border-gray-300 w-4 h-4 cursor-pointer" 
                        />
                      </div>
                    )}
                    {columns.map((col) => (
                      <div 
                        key={col.key}
                        className="flex items-center"
                        style={{ 
                          justifyContent: getAlignment(col.className),
                          minWidth: 0,
                          overflow: 'hidden'
                        }}
                        title={typeof (item as any)[col.key] === 'string' ? (item as any)[col.key] : undefined}
                      >
                        {col.render ? (
                          <div className="min-w-0 overflow-hidden w-full">
                            {col.render(item)}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-700 block truncate w-full">
                            {truncateText(String((item as any)[col.key] || ''), col.maxChars)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="px-6 py-3 border-t border-gray-200 bg-white flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowRowsOptions(!showRowsOptions)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm font-medium text-gray-600 transition-colors"
              >
                {rowsPerPage} <ChevronDown size={14} />
              </button>
              
              {showRowsOptions && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowRowsOptions(false)}></div>
                  <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden min-w-[80px]">
                    {rowsPerPageOptions.map((num) => (
                      <button
                        key={num}
                        onClick={() => handleRowsPerPageChange(num)}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors ${
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
            
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {startItem}-{endItem} <span className="text-gray-400">sur</span> {totalItems}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button 
              onClick={() => goToPage(1)} 
              disabled={currentPage === 1} 
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft size={16} />
            </button>
            <button 
              onClick={() => goToPage(currentPage - 1)} 
              disabled={currentPage === 1} 
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="flex items-center gap-0.5 mx-1">
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-gray-400 text-xs">•••</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page as number)}
                    className={`min-w-[32px] h-8 rounded-lg font-medium text-sm transition-all ${
                      currentPage === page 
                        ? 'bg-indigo-600 text-white shadow-sm scale-105' 
                        : 'hover:bg-gray-100 text-gray-600 hover:scale-105'
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}
            </div>
            
            <button 
              onClick={() => goToPage(currentPage + 1)} 
              disabled={currentPage === totalPages} 
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
            <button 
              onClick={() => goToPage(totalPages)} 
              disabled={currentPage === totalPages} 
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}