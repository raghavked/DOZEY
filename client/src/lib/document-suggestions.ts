import type { UploadedDocument, VaccinationRecord, UserProfile, CountryPeriod } from '@/types';

export interface ProfileSuggestion {
  field: string;
  label: string;
  value: string;
  source: string;
}

export interface CountrySuggestion {
  country: string;
  vaccinationCount: number;
  earliestYear: number;
  latestYear: number;
}

export interface DocumentInsight {
  type: 'profile' | 'country' | 'compliance' | 'info';
  message: string;
  action?: string;
  navigateTo?: 'profile' | 'countries' | 'compliance' | 'timeline';
}

function parseDocumentData(doc: UploadedDocument): any | null {
  if (!doc.parsedData || doc.processingStatus !== 'completed') return null;
  try {
    return typeof doc.parsedData === 'object' ? doc.parsedData : JSON.parse(doc.parsedData as string);
  } catch {
    return null;
  }
}

export function extractProfileSuggestions(
  documents: UploadedDocument[],
  currentProfile: UserProfile | null
): ProfileSuggestion[] {
  const suggestions: ProfileSuggestion[] = [];
  const seen = new Set<string>();

  for (const doc of documents) {
    const parsed = parseDocumentData(doc);
    if (!parsed?.patient_info) continue;

    const info = parsed.patient_info;
    const docName = doc.name || 'Processed document';

    if (info.full_name && (!currentProfile?.fullName || currentProfile.fullName.trim() === '') && !seen.has('fullName')) {
      suggestions.push({
        field: 'fullName',
        label: 'Full Name',
        value: info.full_name,
        source: docName,
      });
      seen.add('fullName');
    }

    if (info.date_of_birth && (!currentProfile?.dateOfBirth || currentProfile.dateOfBirth.trim() === '') && !seen.has('dateOfBirth')) {
      suggestions.push({
        field: 'dateOfBirth',
        label: 'Date of Birth',
        value: info.date_of_birth,
        source: docName,
      });
      seen.add('dateOfBirth');
    }
  }

  const providers = new Set<string>();
  for (const doc of documents) {
    const parsed = parseDocumentData(doc);
    if (!parsed?.vaccinations) continue;
    for (const v of parsed.vaccinations) {
      if (v.provider && v.provider.trim()) {
        providers.add(v.provider.trim());
      }
    }
  }

  if (providers.size > 0 && (!currentProfile?.primaryProvider || currentProfile.primaryProvider.trim() === '') && !seen.has('primaryProvider')) {
    const providerArr = Array.from(providers);
    suggestions.push({
      field: 'primaryProvider',
      label: 'Healthcare Provider',
      value: providerArr[0],
      source: 'vaccination records',
    });
    seen.add('primaryProvider');
  }

  return suggestions;
}

export function extractCountrySuggestions(
  vaccinations: VaccinationRecord[],
  documents: UploadedDocument[],
  existingHistory: CountryPeriod[]
): CountrySuggestion[] {
  const countriesInHistory = new Set(existingHistory.map(p => p.country.toLowerCase().trim()));
  const countryData: Record<string, { count: number; years: number[] }> = {};

  for (const v of vaccinations) {
    if (!v.countryGiven || !v.countryGiven.trim()) continue;
    const country = v.countryGiven.trim();
    const key = country.toLowerCase();
    if (countriesInHistory.has(key)) continue;

    if (!countryData[country]) {
      countryData[country] = { count: 0, years: [] };
    }
    countryData[country].count++;
    const year = v.date ? new Date(v.date).getFullYear() : null;
    if (year && !isNaN(year)) {
      countryData[country].years.push(year);
    }
  }

  for (const doc of documents) {
    if (doc.country && doc.country.trim()) {
      const country = doc.country.trim();
      const key = country.toLowerCase();
      if (!countriesInHistory.has(key) && !countryData[country]) {
        countryData[country] = { count: 0, years: [] };
      }
    }
  }

  return Object.entries(countryData)
    .map(([country, data]) => ({
      country,
      vaccinationCount: data.count,
      earliestYear: data.years.length > 0 ? Math.min(...data.years) : new Date().getFullYear(),
      latestYear: data.years.length > 0 ? Math.max(...data.years) : new Date().getFullYear(),
    }))
    .sort((a, b) => b.vaccinationCount - a.vaccinationCount);
}

export function generateDashboardInsights(
  documents: UploadedDocument[],
  vaccinations: VaccinationRecord[],
  profile: UserProfile | null,
  countryHistory: CountryPeriod[]
): DocumentInsight[] {
  const insights: DocumentInsight[] = [];

  const profileSuggestions = extractProfileSuggestions(documents, profile);
  if (profileSuggestions.length > 0) {
    insights.push({
      type: 'profile',
      message: `We found ${profileSuggestions.map(s => s.label.toLowerCase()).join(', ')} in your documents that can fill in your profile.`,
      action: 'Update Profile',
      navigateTo: 'profile',
    });
  }

  const countrySuggestions = extractCountrySuggestions(vaccinations, documents, countryHistory);
  if (countrySuggestions.length > 0) {
    const countryNames = countrySuggestions.slice(0, 3).map(s => s.country).join(', ');
    insights.push({
      type: 'country',
      message: `Your records show vaccinations in ${countryNames}${countrySuggestions.length > 3 ? ` and ${countrySuggestions.length - 3} more` : ''} — add ${countrySuggestions.length === 1 ? 'it' : 'them'} to your residence history?`,
      action: 'Add Countries',
      navigateTo: 'countries',
    });
  }

  const processedDocs = documents.filter(d => d.processingStatus === 'completed');
  const unprocessedDocs = documents.filter(d => d.processingStatus !== 'completed' && d.processingStatus !== 'processing');
  if (unprocessedDocs.length > 0 && processedDocs.length === 0) {
    insights.push({
      type: 'info',
      message: `You have ${unprocessedDocs.length} document${unprocessedDocs.length !== 1 ? 's' : ''} waiting to be processed. Process them to automatically extract your vaccination records.`,
      action: 'Go to Documents',
      navigateTo: 'timeline',
    });
  }

  const docVaccCount = vaccinations.filter(v => v.documentId).length;
  if (docVaccCount > 0) {
    insights.push({
      type: 'info',
      message: `${docVaccCount} vaccination${docVaccCount !== 1 ? 's' : ''} were imported from your documents — check your compliance status.`,
      action: 'Check Compliance',
      navigateTo: 'compliance',
    });
  }

  return insights;
}
