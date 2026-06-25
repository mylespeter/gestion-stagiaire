

// // app/dashboard/page.tsx
// "use client";
// import React, { useState } from 'react';
// import { Sidebar } from '@/components/Sidebar';
// import { Topbar } from '@/components/Topbar';
// import { UsersManagement } from '@/components/users/UsersManagement';
// import { CoordinateurDashboard } from '@/components/dashboards/CoordinateurDashboard';
// import { StagiaireDashboard } from '@/components/dashboards/StagiaireDashboard';
// import { EncadreurDashboard } from '@/components/dashboards/EncadreurDashboard';
// import { AdminDashboard } from '@/components/dashboards/AdminDashboard';
// import AffectationsPage from '@/app/affectation/page';
// import OrganisationPage from '@/components/pages/OrganisationPage';
// import { useRole } from '@/context/AuthContext';
// import EncadrementPage from '@/app/encadrement/page';
// import StagiairesPage from '../stagiaire/page'; 
// import CalendrierFinStagePage from '../calendrier-fin/page';
// // ✅ Pages stagiaire
// import RapportStagePage from '../stagiaire/rapport/page';
// import StagiaireQuestionnairesPage from '../stagiaire/questionnaires/page';
// // ✅ Pages admin/encadreur
// import AdminRapportsPage from '../gestion/rapport/page';
// import EvaluationsPage from '../evaluations/page';
// import AttestationsPage from '../attestations/page';

// const pageNames: Record<string, string> = {
//   dashboard: 'Tableau de bord',
//   users: 'Utilisateurs',
//   settings: 'Paramètres',
//   encadrement: 'Encadrement',
//   affectations: 'Affectations',
//   organisation: 'Organisation',
//   stagiaire: 'Stagiaires',
//   calendarfin: 'Calendrier Fin de Stage',
//   rapport: 'Rapport de stage',
//   questionnaires: 'Questionnaires',
//   rapports: 'Rapports des stagiaires',
//   evaluations: 'Évaluations',
//   attestations: 'Attestations',
// };

// export default function DashboardPage() {
//   const { role } = useRole();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [activePage, setActivePage] = useState('dashboard');

//   const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
//   const handleNavigate = (pageId: string) => setActivePage(pageId);

//   const renderDashboard = () => {
//     switch (role) {
//       case 'coordinateur': return <CoordinateurDashboard />;
//       case 'stagiaire': return <StagiaireDashboard />;
//       case 'encadreur': return <EncadreurDashboard />;
//       case 'admin': return <AdminDashboard />;
//       default: return <CoordinateurDashboard />;
//     }
//   };

//   const renderPage = () => {
//     switch (activePage) {
//       case 'users': return <UsersManagement />;
//       case 'encadrement': return <EncadrementPage />;
//       case 'affectations': return <AffectationsPage />;
//       case 'organisation': return <OrganisationPage />;
//       case 'stagiaire': return <StagiairesPage />; // ✅ Accessible à tous (coordinateur, admin, encadreur)
//       case 'calendarfin': return <CalendrierFinStagePage />;
//       // ✅ Pages stagiaire
//       case 'rapport': return <RapportStagePage />;
//       case 'questionnaires': return <StagiaireQuestionnairesPage />;
//       // ✅ Pages admin/encadreur
//       case 'rapports': return <AdminRapportsPage />;
//       case 'evaluations': return <EvaluationsPage />;
//       case 'attestations': return <AttestationsPage />;
//       default: return renderDashboard();
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-50/5">
//       <Sidebar 
//         isOpen={isSidebarOpen} 
//         toggleSidebar={toggleSidebar} 
//         activePage={activePage}
//         onNavigate={handleNavigate}
//       />
//       <main className="flex-1 flex flex-col min-w-0">
//         <Topbar 
//           toggleSidebar={toggleSidebar} 
//           pageTitle={pageNames[activePage] || 'Tableau de bord'}
//         />
//         <div className="flex-1 overflow-y-auto">
//           {renderPage()}
//         </div>
//       </main>
//     </div>
//   );
// }

// app/dashboard/page.tsx
"use client";
import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { UsersManagement } from '@/components/users/UsersManagement';
import { CoordinateurDashboard } from '@/components/dashboards/CoordinateurDashboard';
import { StagiaireDashboard } from '@/components/dashboards/StagiaireDashboard';
import { EncadreurDashboard } from '@/components/dashboards/EncadreurDashboard';
import { AdminDashboard } from '@/components/dashboards/AdminDashboard';
import AffectationsPage from '@/app/affectation/page';
import OrganisationPage from '@/components/pages/OrganisationPage';
import { useRole } from '@/context/AuthContext';
import EncadrementPage from '@/app/encadrement/page';
import StagiairesPage from '../stagiaire/page'; 
import CalendrierFinStagePage from '../calendrier-fin/page';
// ✅ Pages stagiaire
import RapportStagePage from '../stagiaire/rapport/page';
import StagiaireQuestionnairesPage from '../stagiaire/questionnaires/page';
// ✅ Pages admin/encadreur
import AdminRapportsPage from '../gestion/rapport/page';
import EvaluationsPage from '../evaluations/page';
import AttestationsPage from '../attestations/page';
// ✅ Nouvelle page Notes Finales
import NotesFinalesPage from '../gestion/notes-finales/page';

const pageNames: Record<string, string> = {
  dashboard: 'Tableau de bord',
  users: 'Utilisateurs',
  settings: 'Paramètres',
  encadrement: 'Encadrement',
  affectations: 'Affectations',
  organisation: 'Organisation',
  stagiaire: 'Stagiaires',
  calendarfin: 'Calendrier Fin de Stage',
  rapport: 'Rapport de stage',
  questionnaires: 'Questionnaires',
  rapports: 'Rapports des stagiaires',
  evaluations: 'Évaluations',
  attestations: 'Attestations',
  'notes-finales': 'Notes finales', // ✅ Ajout
};

export default function DashboardPage() {
  const { role } = useRole();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const handleNavigate = (pageId: string) => setActivePage(pageId);

  const renderDashboard = () => {
    switch (role) {
      case 'coordinateur': return <CoordinateurDashboard />;
      case 'stagiaire': return <StagiaireDashboard />;
      case 'encadreur': return <EncadreurDashboard />;
      case 'admin': return <AdminDashboard />;
      default: return <CoordinateurDashboard />;
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'users': return <UsersManagement />;
      case 'encadrement': return <EncadrementPage />;
      case 'affectations': return <AffectationsPage />;
      case 'organisation': return <OrganisationPage />;
      case 'stagiaire': return <StagiairesPage />;
      case 'calendarfin': return <CalendrierFinStagePage />;
      // ✅ Pages stagiaire
      case 'rapport': return <RapportStagePage />;
      case 'questionnaires': return <StagiaireQuestionnairesPage />;
      // ✅ Pages admin/encadreur
      case 'rapports': return <AdminRapportsPage />;
      case 'evaluations': return <EvaluationsPage />;
      case 'attestations': return <AttestationsPage />;
      // ✅ Nouvelle page Notes Finales
      case 'notes-finales': return <NotesFinalesPage />;
      default: return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50/5">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        activePage={activePage}
        onNavigate={handleNavigate}
      />
      <main className="flex-1 flex flex-col min-w-0">
        <Topbar 
          toggleSidebar={toggleSidebar} 
          pageTitle={pageNames[activePage] || 'Tableau de bord'}
        />
        <div className="flex-1 overflow-y-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}