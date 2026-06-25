
"use client";
import { useState } from 'react';
import { DataTable, type Column } from '@/components/DataTable';
import { DetailsModal, type DetailSection } from '@/components/DetailsModal';
import { StatusBadge } from '@/components/StatusBadge';
import { GraduationCap, Briefcase, School, CalendarDays, User, Phone } from 'lucide-react';
import { traineesData, type Trainee } from '@/data/traineesData';

export default function StagerPage() {
  const [selectedTrainee, setSelectedTrainee] = useState<Trainee | null>(null);

  const columns: Column<Trainee>[] = [
    {
      key: 'name',
      header: 'Stagiaire',
      sortable: true,
      render: (trainee) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold border border-indigo-200 flex-shrink-0">
            {trainee.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <span className="text-sm font-semibold text-gray-800 truncate">{trainee.name}</span>
        </div>
      ),
      width: '220px',
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (trainee) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
          trainee.type === 'Académique' 
            ? 'bg-blue-50 text-blue-600 border-blue-200' 
            : 'bg-purple-50 text-purple-600 border-purple-200'
        }`}>
          {trainee.type === 'Académique' ? <GraduationCap size={12} /> : <Briefcase size={12} />}
          {trainee.type}
        </span>
      ),
      width: '150px',
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      maxChars: 25,
      width: '180px',
    },
    {
      key: 'period',
      header: 'Période',
      sortable: true,
      maxChars: 10,
      width: '120px',
    },
    {
      key: 'status',
      header: 'Statut',
      sortable: true,
      render: (trainee) => <StatusBadge status={trainee.status} />,
      width: '130px',
    },
    {
      key: 'school',
      header: 'École',
      sortable: true,
      maxChars: 20,
      width: '180px',
    },
  ];

  const getTraineeSections = (trainee: Trainee): DetailSection[] => {
    return [
      {
        fields: [
          {
            label: 'Type',
            value: trainee.type,
            icon: trainee.type === 'Académique' 
              ? <GraduationCap size={16} className="text-blue-600" /> 
              : <Briefcase size={16} className="text-purple-600" />,
          },
          {
            label: 'Période',
            value: trainee.period,
            icon: <CalendarDays size={16} className="text-gray-600" />,
          },
        ]
      },
      {
        title: 'Contact',
        fields: [
          {
            label: 'Email',
            value: trainee.email,
            icon: <User size={14} className="text-gray-600" />,
            span: 'full' as const,
          },
          {
            label: 'Téléphone',
            value: trainee.phone,
            icon: <Phone size={14} className="text-gray-600" />,
            span: 'full' as const,
          },
        ]
      },
      {
        fields: [
          {
            label: 'Statut actuel',
            value: <StatusBadge status={trainee.status} />,
            span: 'full' as const,
          },
          {
            label: 'Note générale',
            value: (
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${trainee.score >= 70 ? 'bg-emerald-500' : trainee.score >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                    style={{ width: `${trainee.score}%` }}
                  ></div>
                </div>
                <span className="font-bold text-gray-800 text-sm">{trainee.score}</span>
              </div>
            ),
            span: 'full' as const,
          },
        ]
      },
    ];
  };

  return (
    <div className="px-6 mt-6  max-w-7xl mx-auto space-y-">
      <DataTable
        data={traineesData}
        columns={columns}
        title="Gestion des stagiaires"
        searchPlaceholder="Rechercher un stagiaire..."
        onRowClick={(trainee) => setSelectedTrainee(trainee)}
      />
      
      {selectedTrainee && (
        <DetailsModal
          isOpen={!!selectedTrainee}
          onClose={() => setSelectedTrainee(null)}
          title={selectedTrainee.name}
          subtitle={
            <span className="flex items-center gap-1">
              <School size={14} /> {selectedTrainee.school}
            </span>
          }
          avatar={selectedTrainee.name.split(' ').map((n: string) => n[0]).join('')}
          sections={getTraineeSections(selectedTrainee)}
        />
      )}
    </div>
  );
}