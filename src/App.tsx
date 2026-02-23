import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { ProfileSection } from './components/ProfileSection';
import { CountryHistory } from './components/CountryHistory';
import { DocumentUpload } from './components/DocumentUpload';
import { VaccinationTimeline } from './components/VaccinationTimeline';
import { ShareRecords } from './components/ShareRecords';
import { Alerts } from './components/Alerts';

export interface VaccinationRecord {
  id: string;
  vaccineName: string;
  date: string;
  doseNumber: number;
  location: string;
  countryGiven: string;
  provider: string;
  notes?: string;
  verified: boolean;
  documentId?: string;
}

export interface UserProfile {
  fullName: string;
  dateOfBirth: string;
  currentCountry: string;
  currentState: string;
  countryOfOrigin: string;
  citizenships: string[];
  languages: string[];
  primaryProvider?: string;
  targetCountry?: string; // For compliance tracking
}

export interface CountryPeriod {
  id: string;
  country: string;
  state?: string;
  startYear: number;
  endYear: number | 'Present';
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  country: string;
  url?: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'profile' | 'countries' | 'upload' | 'timeline' | 'share' | 'alerts'>('dashboard');
  
  // Initialize with Jane Doe's profile data
  const [profile, setProfile] = useState<UserProfile>({
    fullName: 'Jane Doe',
    dateOfBirth: '2005-03-15',
    currentCountry: 'India',
    currentState: 'Karnataka',
    countryOfOrigin: 'India',
    citizenships: ['India'],
    languages: ['English', 'Hindi', 'Marathi', 'Kannada'],
    primaryProvider: 'Bangalore Medical Center',
    targetCountry: 'United States',
  });

  // Initialize with Jane's country history - moved around India
  const [countryHistory, setCountryHistory] = useState<CountryPeriod[]>([
    {
      id: '1',
      country: 'India',
      state: 'Maharashtra',
      startYear: 2005,
      endYear: 2010,
    },
    {
      id: '2',
      country: 'India',
      state: 'Delhi',
      startYear: 2010,
      endYear: 2015,
    },
    {
      id: '3',
      country: 'India',
      state: 'Tamil Nadu',
      startYear: 2015,
      endYear: 2020,
    },
    {
      id: '4',
      country: 'India',
      state: 'Karnataka',
      startYear: 2020,
      endYear: 'Present',
    },
  ]);

  // Initialize with sample documents
  const [documents, setDocuments] = useState<UploadedDocument[]>([
    {
      id: '1',
      name: 'Childhood Immunization Card',
      type: 'Vaccination Record',
      uploadDate: '2024-01-15T10:00:00Z',
      country: 'India',
    },
    {
      id: '2',
      name: 'COVID-19 Vaccination Certificate',
      type: 'Vaccination Record',
      uploadDate: '2024-01-18T14:30:00Z',
      country: 'India',
    },
  ]);

  // Initialize with Jane's existing vaccinations (70% complete)
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([
    // MMR - Complete (2 doses) - Mumbai
    {
      id: '1',
      vaccineName: 'MMR (Measles, Mumps, Rubella)',
      date: '2006-05-10',
      doseNumber: 1,
      location: 'Kokilaben Hospital, Mumbai',
      countryGiven: 'India',
      provider: 'Dr. Anjali Sharma',
      verified: true,
      notes: 'First dose as per schedule',
    },
    {
      id: '2',
      vaccineName: 'MMR (Measles, Mumps, Rubella)',
      date: '2010-08-22',
      doseNumber: 2,
      location: 'Lilavati Hospital, Mumbai',
      countryGiven: 'India',
      provider: 'Dr. Rajesh Mehta',
      verified: false,
      notes: 'Booster dose - record pending verification',
    },
    // Hepatitis B - Complete (3 doses) - Mumbai
    {
      id: '3',
      vaccineName: 'Hepatitis B',
      date: '2005-04-01',
      doseNumber: 1,
      location: 'Breach Candy Hospital, Mumbai',
      countryGiven: 'India',
      provider: 'Dr. Suresh Patel',
      verified: true,
    },
    {
      id: '4',
      vaccineName: 'Hepatitis B',
      date: '2005-05-01',
      doseNumber: 2,
      location: 'Breach Candy Hospital, Mumbai',
      countryGiven: 'India',
      provider: 'Dr. Suresh Patel',
      verified: true,
    },
    {
      id: '5',
      vaccineName: 'Hepatitis B',
      date: '2005-10-01',
      doseNumber: 3,
      location: 'Breach Candy Hospital, Mumbai',
      countryGiven: 'India',
      provider: 'Dr. Suresh Patel',
      verified: false,
      notes: 'Document missing from hospital records',
    },
    // Varicella - Complete (2 doses) - Mumbai & Delhi
    {
      id: '6',
      vaccineName: 'Varicella (Chickenpox)',
      date: '2006-06-15',
      doseNumber: 1,
      location: 'Kokilaben Hospital, Mumbai',
      countryGiven: 'India',
      provider: 'Dr. Anjali Sharma',
      verified: true,
    },
    {
      id: '7',
      vaccineName: 'Varicella (Chickenpox)',
      date: '2011-09-10',
      doseNumber: 2,
      location: 'Apollo Hospital, Delhi',
      countryGiven: 'India',
      provider: 'Dr. Priya Verma',
      verified: true,
    },
    // Tdap - Complete (1 dose) - Chennai
    {
      id: '8',
      vaccineName: 'Tdap (Tetanus, Diphtheria, Pertussis)',
      date: '2016-03-20',
      doseNumber: 1,
      location: 'Apollo Hospitals, Chennai',
      countryGiven: 'India',
      provider: 'Dr. Kumaran Subramanian',
      verified: false,
      notes: 'Awaiting document from Chennai hospital',
    },
    // COVID-19 - Complete (2 doses) - Bangalore
    {
      id: '9',
      vaccineName: 'COVID-19 (Covishield)',
      date: '2021-05-10',
      doseNumber: 1,
      location: 'Fortis Hospital, Bangalore',
      countryGiven: 'India',
      provider: 'Dr. Lakshmi Narayanan',
      verified: true,
    },
    {
      id: '10',
      vaccineName: 'COVID-19 (Covishield)',
      date: '2021-08-15',
      doseNumber: 2,
      location: 'Manipal Hospital, Bangalore',
      countryGiven: 'India',
      provider: 'Dr. Ramesh Kumar',
      verified: true,
    },
    // Polio - Partial (2 of 4 doses) - Mumbai & Delhi
    {
      id: '11',
      vaccineName: 'Polio (IPV)',
      date: '2005-06-01',
      doseNumber: 1,
      location: 'Breach Candy Hospital, Mumbai',
      countryGiven: 'India',
      provider: 'Dr. Suresh Patel',
      verified: true,
    },
    {
      id: '12',
      vaccineName: 'Polio (IPV)',
      date: '2005-08-01',
      doseNumber: 2,
      location: 'Wadia Children Hospital, Mumbai',
      countryGiven: 'India',
      provider: 'Dr. Meena Agarwal',
      verified: false,
      notes: 'Old paper record - digitization pending',
    },
    // Hepatitis A - Partial (1 of 2 doses) - Bangalore
    {
      id: '13',
      vaccineName: 'Hepatitis A',
      date: '2023-06-10',
      doseNumber: 1,
      location: 'Bangalore Medical Center',
      countryGiven: 'India',
      provider: 'Dr. Arjun Reddy',
      verified: true,
      notes: 'Preparing for U.S. travel',
    },
  ]);

  const addVaccination = (vaccination: Omit<VaccinationRecord, 'id'>) => {
    const newVaccination: VaccinationRecord = {
      ...vaccination,
      id: Date.now().toString(),
    };
    setVaccinations([newVaccination, ...vaccinations]);
  };

  const deleteVaccination = (id: string) => {
    setVaccinations(vaccinations.filter(v => v.id !== id));
  };

  const saveProfile = (profileData: UserProfile) => {
    setProfile(profileData);
  };

  const addCountryPeriod = (period: Omit<CountryPeriod, 'id'>) => {
    const newPeriod: CountryPeriod = {
      ...period,
      id: Date.now().toString(),
    };
    setCountryHistory([...countryHistory, newPeriod]);
  };

  const deleteCountryPeriod = (id: string) => {
    setCountryHistory(countryHistory.filter(p => p.id !== id));
  };

  const addDocument = (doc: Omit<UploadedDocument, 'id' | 'uploadDate'>) => {
    const newDoc: UploadedDocument = {
      ...doc,
      id: Date.now().toString(),
      uploadDate: new Date().toISOString(),
    };
    setDocuments([...documents, newDoc]);
  };

  const deleteDocument = (id: string) => {
    setDocuments(documents.filter(d => d.id !== id));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            vaccinations={vaccinations}
            profile={profile}
            countryHistory={countryHistory}
            documents={documents}
            onNavigate={setCurrentPage}
          />
        );
      case 'profile':
        return <ProfileSection profile={profile} onSave={saveProfile} />;
      case 'countries':
        return (
          <CountryHistory
            periods={countryHistory}
            onAdd={addCountryPeriod}
            onDelete={deleteCountryPeriod}
          />
        );
      case 'upload':
        return (
          <DocumentUpload
            documents={documents}
            onUpload={addDocument}
            onDelete={deleteDocument}
            onAddVaccination={addVaccination}
          />
        );
      case 'timeline':
        return (
          <VaccinationTimeline
            vaccinations={vaccinations}
            onAdd={addVaccination}
            onDelete={deleteVaccination}
          />
        );
      case 'share':
        return (
          <ShareRecords
            vaccinations={vaccinations}
            profile={profile}
            countryHistory={countryHistory}
          />
        );
      case 'alerts':
        return (
          <Alerts
            vaccinations={vaccinations}
            countryHistory={countryHistory}
            profile={profile}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#e1e8ed]">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderPage()}
      </main>
    </div>
  );
}