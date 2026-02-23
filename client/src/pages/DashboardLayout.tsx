import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/components/Dashboard';
import { ProfileSection } from '@/components/ProfileSection';
import { CountryHistory } from '@/components/CountryHistory';
import { DocumentUpload } from '@/components/DocumentUpload';
import { VaccinationTimeline } from '@/components/VaccinationTimeline';
import { ShareRecords } from '@/components/ShareRecords';
import { Alerts } from '@/components/Alerts';
import { useProfile, useVaccinations, useDocuments, useCountryHistory } from '@/hooks/use-api';
import type { User } from '@shared/models/auth';

interface DashboardLayoutProps {
  user: User;
}

export function DashboardLayout({ user }: DashboardLayoutProps) {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'profile' | 'countries' | 'upload' | 'timeline' | 'share' | 'alerts'>('dashboard');
  
  const { profile, isLoading: profileLoading, saveProfile } = useProfile();
  const { vaccinations, isLoading: vaccLoading, addVaccination, deleteVaccination } = useVaccinations();
  const { documents, isLoading: docsLoading, addDocument, deleteDocument } = useDocuments();
  const { countryHistory, isLoading: historyLoading, addCountryPeriod, deleteCountryPeriod } = useCountryHistory();

  const isLoading = profileLoading || vaccLoading || docsLoading || historyLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f4f8] to-[#e1e8ed]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#1051a5] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#22283a] text-lg">Loading your records...</p>
        </div>
      </div>
    );
  }

  const defaultProfile = profile || {
    fullName: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'New User',
    dateOfBirth: '',
    currentCountry: '',
    currentState: '',
    countryOfOrigin: '',
    citizenships: [],
    languages: [],
    primaryProvider: '',
    targetCountry: '',
  };

  const userName = user.firstName || user.email || 'User';

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            vaccinations={vaccinations}
            profile={defaultProfile}
            countryHistory={countryHistory}
            documents={documents}
            onNavigate={setCurrentPage}
          />
        );
      case 'profile':
        return <ProfileSection profile={defaultProfile} onSave={(p) => saveProfile(p)} />;
      case 'countries':
        return (
          <CountryHistory
            periods={countryHistory}
            onAdd={(period) => addCountryPeriod(period)}
            onDelete={(id) => deleteCountryPeriod(String(id))}
          />
        );
      case 'upload':
        return (
          <DocumentUpload
            documents={documents}
            onUpload={(doc) => addDocument(doc)}
            onDelete={(id) => deleteDocument(String(id))}
            onAddVaccination={(v) => addVaccination(v)}
          />
        );
      case 'timeline':
        return (
          <VaccinationTimeline
            vaccinations={vaccinations}
            onAdd={(v) => addVaccination(v)}
            onDelete={(id) => deleteVaccination(String(id))}
          />
        );
      case 'share':
        return (
          <ShareRecords
            vaccinations={vaccinations}
            profile={defaultProfile}
            countryHistory={countryHistory}
          />
        );
      case 'alerts':
        return (
          <Alerts
            vaccinations={vaccinations}
            countryHistory={countryHistory}
            profile={defaultProfile}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#e1e8ed]">
      <Navigation
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        userName={userName}
        userImage={user.profileImageUrl || undefined}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderPage()}
      </main>
    </div>
  );
}
