
// components/FormModal.tsx
"use client";

import { useState, ReactNode, FormEvent, useRef, useEffect } from 'react';
import { X, Upload, FileText, Trash2, Eye } from 'lucide-react';

// Type pour un champ de formulaire
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'tel' | 'file' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  span?: 'full' | 'half';
  options?: { value: string; label: string }[];
  disabled?: boolean;
  defaultValue?: any;
  icon?: ReactNode;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  hint?: string;
  min?: number;
  max?: number;
  step?: number;
}

// Type pour un fichier uploadé
export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  file?: File;
}

// Props du composant
interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  fields: FormField[];
  sections?: {
    title?: string;
    fields: string[];
  }[];
  onSubmit: (data: Record<string, any>, files?: UploadedFile[]) => Promise<void> | void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  maxWidth?: string;
  footerExtra?: ReactNode;
  mode?: 'create' | 'edit';
  initialData?: Record<string, any>;
  initialFiles?: UploadedFile[];
  onFileDelete?: (fileId: string) => Promise<void> | void;
}

export function FormModal({
  isOpen,
  onClose,
  title,
  subtitle,
  fields,
  sections,
  onSubmit,
  submitLabel = "Enregistrer",
  cancelLabel = "Annuler",
  loading = false,
  maxWidth = "max-w-2xl",
  footerExtra,
  mode = 'create',
  initialData,
  initialFiles = [],
  onFileDelete
}: FormModalProps) {
  const getInitialFormData = () => {
    const initial: Record<string, any> = {};
    fields.forEach(field => {
      if (initialData && initialData[field.name] !== undefined) {
        initial[field.name] = initialData[field.name];
      } else if (field.defaultValue !== undefined) {
        initial[field.name] = field.defaultValue;
      } else {
        initial[field.name] = field.type === 'checkbox' ? false : '';
      }
    });
    return initial;
  };

  const [formData, setFormData] = useState<Record<string, any>>(getInitialFormData());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(initialFiles);
  const [uploading, setUploading] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Réinitialiser le formulaire quand il s'ouvre ou quand les données initiales changent
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData());
      setUploadedFiles(initialFiles);
      setErrors({});
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = async (fieldName: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const field = fields.find(f => f.name === fieldName);
    const maxSize = (field?.maxSize || 5) * 1024 * 1024;

    setUploading(true);
    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: `Le fichier ${file.name} dépasse la taille maximale de ${field?.maxSize || 5}MB`
        }));
        continue;
      }

      if (field?.accept) {
        const acceptedTypes = field.accept.split(',').map(t => t.trim().replace('.', ''));
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (fileExtension && !acceptedTypes.includes(fileExtension)) {
          setErrors(prev => ({
            ...prev,
            [fieldName]: `Type de fichier non accepté. Types acceptés : ${field.accept}`
          }));
          continue;
        }
      }

      const url = URL.createObjectURL(file);
      
      newFiles.push({
        id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url,
        file
      });
    }

    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }

    setUploading(false);
  };

  const handleRemoveFile = async (fileId: string) => {
    if (onFileDelete) {
      await onFileDelete(fileId);
    }
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      const value = formData[field.name];
      
      if (field.required && !value && field.type !== 'file') {
        newErrors[field.name] = `${field.label} est requis`;
      }
      
      if (field.type === 'file' && field.required && uploadedFiles.length === 0) {
        newErrors[field.name] = `${field.label} est requis`;
      }
      
      if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.name] = 'Email invalide';
        }
      }

      if (field.type === 'tel' && value) {
        const telRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]*$/;
        if (!telRegex.test(value)) {
          newErrors[field.name] = 'Numéro de téléphone invalide';
        }
      }

      if (field.type === 'number' && value) {
        const num = parseFloat(value);
        if (field.min !== undefined && num < field.min) {
          newErrors[field.name] = `Minimum ${field.min}`;
        }
        if (field.max !== undefined && num > field.max) {
          newErrors[field.name] = `Maximum ${field.max}`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    try {
      await onSubmit(formData, uploadedFiles);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' o';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko';
    return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
  };

  const renderFileField = (field: FormField) => {
    return (
      <div key={field.name} className={field.span === 'full' ? 'col-span-2' : ''}>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          {field.label}
          {field.required && <span className="text-red-400 ml-1">*</span>}
        </label>

        <div className="space-y-2">
          <div
            onClick={() => fileInputRefs.current[field.name]?.click()}
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
              ${errors[field.name] 
                ? 'border-red-300 bg-red-50 hover:bg-red-100' 
                : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
              }`}
          >
            <input
              ref={el => { fileInputRefs.current[field.name] = el; }}
              type="file"
              className="hidden"
              accept={field.accept}
              multiple={field.multiple}
              onChange={(e) => handleFileChange(field.name, e.target.files)}
              disabled={uploading}
            />
            <Upload size={20} className="mx-auto mb-1 text-gray-400" />
            <p className="text-xs text-gray-500">
              {uploading ? 'Upload en cours...' : 'Cliquez pour uploader ou glissez-déposez'}
            </p>
            {field.hint && (
              <p className="text-xs text-gray-400 mt-0.5">{field.hint}</p>
            )}
            {field.accept && (
              <p className="text-xs text-gray-400 mt-0.5">
                Formats acceptés : {field.accept}
              </p>
            )}
            {field.maxSize && (
              <p className="text-xs text-gray-400 mt-0.5">
                Taille max : {field.maxSize}MB
              </p>
            )}
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-1">
              {uploadedFiles.map((file) => (
                <div 
                  key={file.id}
                  className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg text-sm"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="truncate text-gray-700">{file.name}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      ({formatFileSize(file.size)})
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {file.url && (
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600"
                        title="Voir"
                      >
                        <Eye size={14} />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(file.id)}
                      className="p-1 hover:bg-red-100 rounded text-gray-400 hover:text-red-600"
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {errors[field.name] && (
          <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>
        )}
      </div>
    );
  };

  const renderField = (field: FormField) => {
    if (field.type === 'file') {
      return renderFileField(field);
    }

    const commonClasses = `w-full px-3 py-2 rounded-lg border text-sm transition-all
      ${errors[field.name] 
        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500 bg-red-50' 
        : 'border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white'
      }
      ${field.disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`;

    const renderInput = () => {
      switch (field.type) {
        case 'select':
          return (
            <select
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className={commonClasses}
              disabled={field.disabled}
              required={field.required}
            >
              <option value="">{field.placeholder || 'Sélectionner...'}</option>
              {field.options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          );

        case 'textarea':
          return (
            <textarea
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={`${commonClasses} min-h-[80px] resize-y`}
              disabled={field.disabled}
              required={field.required}
              rows={3}
            />
          );

        case 'checkbox':
          return (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData[field.name] || false}
                onChange={(e) => handleChange(field.name, e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                disabled={field.disabled}
              />
              <span className="text-sm text-gray-700">{field.placeholder || field.label}</span>
            </label>
          );

        case 'radio':
          return (
            <div className="flex flex-wrap gap-3">
              {field.options?.map(opt => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={field.name}
                    value={opt.value}
                    checked={formData[field.name] === opt.value}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-4 h-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    disabled={field.disabled}
                  />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          );

        default:
          return (
            <div className="relative">
              {field.icon && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {field.icon}
                </span>
              )}
              <input
                type={field.type}
                value={formData[field.name] ?? ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className={`${commonClasses} ${field.icon ? 'pl-9' : ''}`}
                disabled={field.disabled}
                required={field.required}
                min={field.min}
                max={field.max}
                step={field.step}
              />
            </div>
          );
      }
    };

    return (
      <div key={field.name} className={field.span === 'full' ? 'col-span-2' : ''}>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          {field.label}
          {field.required && <span className="text-red-400 ml-1">*</span>}
        </label>
        {renderInput()}
        {field.hint && !errors[field.name] && (
          <p className="text-xs text-gray-400 mt-1">{field.hint}</p>
        )}
        {errors[field.name] && (
          <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>
        )}
      </div>
    );
  };

  const renderFields = () => {
    if (sections && sections.length > 0) {
      return sections.map((section, idx) => {
        const sectionFields = fields.filter(f => section.fields.includes(f.name));
        if (sectionFields.length === 0) return null;
        
        return (
          <div key={idx}>
            {section.title && (
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {section.title}
              </h4>
            )}
            <div className="grid grid-cols-2 gap-4">
              {sectionFields.map(renderField)}
            </div>
          </div>
        );
      });
    }

    return (
      <div className="grid grid-cols-2 gap-4">
        {fields.map(renderField)}
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 pt-[5vh] overflow-y-auto" 
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-xl w-full ${maxWidth} my-8 relative shadow-xl`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white rounded-t-xl z-10 px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {mode === 'edit' ? '✏️ ' : '➕ '}{title}
              </h3>
              {subtitle && (
                <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
              )}
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 max-h-[60vh] overflow-y-auto space-y-6">
            {renderFields()}
          </div>
          
          <div className="sticky bottom-0 bg-gray-50/80 backdrop-blur-sm rounded-b-xl px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div>{footerExtra}</div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                {cancelLabel}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {submitLabel}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}