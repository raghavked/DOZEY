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
  targetCountry?: string;
}

export interface CountryPeriod {
  id: string;
  country: string;
  state?: string;
  startYear: number;
  endYear: number | string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  country: string;
  url?: string;
}
