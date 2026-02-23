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
  fileName?: string | null;
  fileSize?: number | null;
  mimeType?: string | null;
  extractedText?: string | null;
  translatedText?: string | null;
  parsedData?: string | null;
  originalLanguage?: string | null;
  processingStatus?: string | null;
}

export interface ParsedVaccinationData {
  vaccinations: Array<{
    vaccine_name: string;
    date: string | null;
    dose_number: number | null;
    provider: string | null;
    country_given: string | null;
    location: string | null;
    notes: string | null;
  }>;
  patient_info?: {
    full_name: string | null;
    date_of_birth: string | null;
    id_number: string | null;
  };
  document_type?: string;
  summary?: string;
}
