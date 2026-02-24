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
import { useI18n } from '@/lib/i18n';

export function DashboardLayout() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'profile' | 'countries' | 'upload' | 'timeline' | 'compliance' | 'share' | 'alerts'>('dashboard');
  const [isNewUser, setIsNewUser] = useState(false);
  
  const { profile, isLoading: profileLoading, saveProfile } = useProfile();
  const { vaccinations, isLoading: vaccLoading, addVaccination, updateVaccination, deleteVaccination } = useVaccinations();
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
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#f5f5f7] border-t-[#4a7fb5] rounded-full animate-spin" />
          <p className="text-[#86868b] text-sm">{t('loadingRecords')}</p>
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

  const userName = profile?.fullName || user?.email?.split('@')[0] || 'User';

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
        return <ProfileSection profile={defaultProfile} onSave={(p) => saveProfile(p)} isNewUser={isNewUser} documents={documents} />;
      case 'countries':
        return (
          <CountryHistory
            periods={countryHistory}
            onAdd={(period) => addCountryPeriod(period)}
            onDelete={(id) => deleteCountryPeriod(String(id))}
            vaccinations={vaccinations}
            documents={documents}
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
            vaccinations={vaccinations}
          />
        );
      case 'timeline':
        return (
          <VaccinationTimeline
            vaccinations={vaccinations}
            documents={documents}
            onAdd={(v) => addVaccination(v)}
            onDelete={(id) => deleteVaccination(String(id))}
            onUpdate={(id, data) => updateVaccination({ id, data })}
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
            userEmail={user?.email || ''}
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
    <div className="min-h-screen bg-[#f5f5f7]">
      <Navigation
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        userName={userName}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>
      <DozeChat />
    </div>
  );
}
