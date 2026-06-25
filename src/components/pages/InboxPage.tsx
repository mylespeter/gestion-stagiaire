"use client";
import { Mail, MailOpen, Star, Paperclip, ChevronRight } from 'lucide-react';

const messages = [
  { id: 1, from: 'Sophie Martin', subject: 'Candidature stage développeur', preview: 'Bonjour, je vous transmets ma candidature pour le poste de développeur...', time: '10:30', unread: true, starred: true, hasAttachment: true },
  { id: 2, from: 'Thomas Dubois', subject: 'Disponibilité pour entretien', preview: 'Je suis disponible cette semaine pour un entretien...', time: 'Hier', unread: true, starred: false, hasAttachment: false },
  { id: 3, from: 'Marie Lambert', subject: 'Rapport de stage - Semaine 3', preview: 'Voici mon rapport de stage pour la troisième semaine...', time: 'Lun', unread: false, starred: true, hasAttachment: true },
  { id: 4, from: 'Lucas Bernard', subject: 'Question sur les missions', preview: 'J\'aimerais avoir plus de détails sur les missions proposées...', time: 'Dim', unread: false, starred: false, hasAttachment: false },
  { id: 5, from: 'Emma Petit', subject: 'Confirmation de présence', preview: 'Je confirme ma présence à la réunion de demain...', time: 'Sam', unread: true, starred: false, hasAttachment: false },
];

export function InboxPage() {
  return (
    <div className="flex-1 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-bold text-gray-900">Boîte de réception</h2>
        <span className="text-sm text-gray-500">3 non lus</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-center gap-4 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${msg.unread ? 'bg-indigo-50/30' : ''}`}>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${msg.unread ? 'bg-indigo-600' : 'bg-transparent'}`}></div>
              {msg.unread ? <Mail size={18} className="text-indigo-600 flex-shrink-0" /> : <MailOpen size={18} className="text-gray-400 flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold truncate ${msg.unread ? 'text-gray-900' : 'text-gray-600'}`}>{msg.from}</span>
                  {msg.starred && <Star size={14} className="text-amber-400 fill-amber-400 flex-shrink-0" />}
                </div>
                <p className={`text-sm truncate ${msg.unread ? 'font-medium text-gray-800' : 'text-gray-500'}`}>{msg.subject}</p>
                <p className="text-xs text-gray-400 truncate">{msg.preview}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {msg.hasAttachment && <Paperclip size={14} className="text-gray-400" />}
              <span className="text-xs text-gray-400">{msg.time}</span>
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}