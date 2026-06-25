"use client";
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const events = [
  { id: 1, title: 'Entretien - Sophie Martin', date: '2026-03-25', time: '10:00', type: 'interview', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { id: 2, title: 'Réunion tuteurs', date: '2026-03-25', time: '14:00', type: 'meeting', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { id: 3, title: 'Date limite conventions', date: '2026-03-28', time: '23:59', type: 'deadline', color: 'bg-red-100 text-red-700 border-red-200' },
  { id: 4, title: 'Formation nouveaux stagiaires', date: '2026-03-30', time: '09:00', type: 'training', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 5, title: 'Bilan mensuel', date: '2026-03-31', time: '15:00', type: 'meeting', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
];

const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const currentMonth = 'Mars 2026';

const calendarDays = [
  { day: 23, month: 'fev' }, { day: 24, month: 'fev' }, { day: 25, month: 'mar', hasEvent: true },
  { day: 26, month: 'mar' }, { day: 27, month: 'mar' }, { day: 28, month: 'mar', hasEvent: true },
  { day: 29, month: 'mar' }, { day: 30, month: 'mar', hasEvent: true }, { day: 31, month: 'mar', hasEvent: true },
  { day: 1, month: 'avr' }, { day: 2, month: 'avr' }, { day: 3, month: 'avr' },
  { day: 4, month: 'avr' }, { day: 5, month: 'avr' },
];

export function CalendarPage() {
  return (
    <div className="flex-1 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="font-bold text-gray-900">Calendrier</h2>
          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={16} /></button>
            <span className="text-sm font-medium">{currentMonth}</span>
            <button className="p-1 hover:bg-gray-100 rounded"><ChevronRight size={16} /></button>
          </div>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus size={16} /> Nouvel événement
        </button>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Calendrier */}
        <div className="flex-1 p-4 border-r border-gray-200">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, i) => (
              <div 
                key={i} 
                className={`text-center py-2 text-sm rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors ${
                  date.month === 'mar' ? 'text-gray-900 font-medium' : 'text-gray-400'
                } ${date.day === 25 ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}`}
              >
                <div className="relative inline-block">
                  {date.day}
                  {date.hasEvent && date.day !== 25 && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-500"></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Événements */}
        <div className="w-80 p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Événements à venir</h3>
          <div className="space-y-2">
            {events.map((event) => (
              <div key={event.id} className={`p-3 rounded-lg border ${event.color} cursor-pointer hover:shadow-sm transition-shadow`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs mt-1 opacity-75">{event.date} - {event.time}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                    event.type === 'interview' ? 'bg-indigo-100 text-indigo-600 border-indigo-200' :
                    event.type === 'meeting' ? 'bg-emerald-100 text-emerald-600 border-emerald-200' :
                    event.type === 'deadline' ? 'bg-red-100 text-red-600 border-red-200' :
                    'bg-amber-100 text-amber-600 border-amber-200'
                  }`}>
                    {event.type === 'interview' ? 'Entretien' :
                     event.type === 'meeting' ? 'Réunion' :
                     event.type === 'deadline' ? 'Deadline' : 'Formation'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}