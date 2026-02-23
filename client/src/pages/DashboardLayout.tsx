import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/components/Dashboard';
import { ProfileSection } from '@/components/ProfileSection';
import { CountryHistory } from '@/components/CountryHistory';
import { DocumentUpload } from '@/components/DocumentUpload';
import { VaccinationTimeline } from '@/components/VaccinationTimeline';
import { ComplianceReport } from '@/components/ComplianceReport';
import { ShareRecords } from '@/components/ShareRecords';
import { Alerts } from '@/components/Alerts';
import { DozeChat } from '@/components/DozeChat';
import { useProfile, useVaccinations, useDocuments, useCountryHistory, useExemptions } from '@/hooks/use-api';
import { useAuth } from '@/hooks/use-auth';

export function DashboardLayout() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'profile' | 'countries' | 'upload' | 'timeline' | 'compliance' | 'share' | 'alerts'>('dashboard');
  const [isNewUser, setIsNewUser] = useState(false);
  
  const { profile, isLoading: profileLoading, saveProfile } = useProfile();
  const { vaccinations, isLoading: vaccLoading, addVaccination, deleteVaccination } = useVaccinations();
  const { documents, isLoading: docsLoading, addDocument, updateDocument, deleteDocument, refreshAll } = useDocuments();
  const { countryHistory, isLoading: historyLoading, addCountryPeriod, deleteCountryPeriod } = useCountryHistory();
  const { exemptions, isLoading: exemptionsLoading, refreshExemptions } = useExemptions();

  const isLoading = profileLoading || vaccLoading || docsLoading || historyLoading || exemptionsLoading;

  useEffect(() => {
    if (!isLoading) {
      const isProfileEmpty = !profile || (!profile.fullName && !profile.dateOfBirth && !profile.currentCountry && !profile.primaryProvider);
      if (isProfileEmpty) {
        setCurrentPage('profile');
        setIsNewUser(true);
      }
    }
  }, [isLoading, profile]);

  useEffect(() => {
    if (isNewUser && currentPage !== 'profile' && profile) {
      setIsNewUser(false);
    }
  }, [currentPage, isNewUser, profile]);

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
    fullName: user?.email?.split('@')[0] || 'New User',
    dateOfBirth: '',
    currentCountry: '',
    currentState: '',
    countryOfOrigin: '',
    citizenships: [],
    languages: [],
    primaryProvider: '',
    targetCountry: '',
    targetInstitution: '',
    targetEmployment: '',
  };

  const userName = user?.email?.split('@')[0] || 'User';

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
        return <ProfileSection profile={defaultProfile} onSave={(p) => saveProfile(p)} isNewUser={isNewUser} />;
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
            onUpload={(formData) => addDocument(formData)}
            onUpdate={(id, data) => updateDocument({ id, data })}
            onDelete={(id) => deleteDocument(String(id))}
            onAddVaccination={(v) => addVaccination(v)}
            onRefresh={() => { refreshAll(); refreshExemptions(); }}
            exemptions={exemptions}
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
      case 'compliance':
        return (
          <ComplianceReport
            vaccinations={vaccinations}
            profile={defaultProfile}
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
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderPage()}
      </main>
      <DozeChat />
    </div>
  );
}
