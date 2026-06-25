// components/DetailsModal.tsx
"use client";

import { X } from 'lucide-react';

// Type pour les champs à afficher
export interface DetailField {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  span?: 'full' | 'half';
}

// Type pour les sections
export interface DetailSection {
  title?: string;
  fields: DetailField[];
}

// Props du composant
interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: React.ReactNode;
  avatar?: React.ReactNode;
  sections: DetailSection[];
  footer?: React.ReactNode;
}

export function DetailsModal({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  avatar, 
  sections, 
  footer 
}: DetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl w-full max-w-lg my-8 relative shadow-xl" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton fermer - fixe en haut à droite */}
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 z-10 p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
        
        {/* En-tête - fixe en haut */}
        <div className="sticky top-0 bg-white rounded-t-xl z-[5] px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3 pr-8">
            {avatar && (
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-semibold text-indigo-600 flex-shrink-0">
                {avatar}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{title}</h3>
              {subtitle && (
                <div className="text-sm text-gray-500 mt-0.5">
                  {subtitle}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          {sections.length > 0 ? (
            <div className="space-y-6">
              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  {section.title && (
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      {section.title}
                    </h4>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    {section.fields.map((field, fieldIndex) => (
                      <div 
                        key={fieldIndex} 
                        className={field.span === 'full' ? 'col-span-2' : ''}
                      >
                        <label className="text-xs text-gray-400 block mb-1">
                          {field.label}
                        </label>
                        <div className="flex items-center gap-2 text-sm text-gray-700 min-h-[20px]">
                          {field.icon && <span className="text-gray-400 flex-shrink-0">{field.icon}</span>}
                          <span className="break-words">{field.value || 'Non renseigné'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">
              Aucune information disponible
            </div>
          )}
        </div>
        
        {/* Footer - fixe en bas */}
        {footer && (
          <div className="sticky bottom-0 bg-white rounded-b-xl px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}