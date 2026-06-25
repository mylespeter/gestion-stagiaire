import { Check, X } from 'lucide-react';

interface StatusBadgeProps {
  status: 'Validé' | 'Échec';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isValidated = status === 'Validé';
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
      isValidated 
        ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
        : 'bg-rose-50 text-rose-600 border-rose-200'
    }`}>
      {isValidated ? <Check size={12} /> : <X size={12} />}
      {status}
    </span>
  );
}