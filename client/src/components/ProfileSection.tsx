import { useState, useEffect } from 'react';
import { UserProfile, UploadedDocument } from '@/types';
import { User, Save, AlertCircle, Sparkles, X } from 'lucide-react';
import { AutocompleteInput } from '@/components/AutocompleteInput';
import { COUNTRIES, LANGUAGES_LIST, HEALTHCARE_PROVIDERS, US_STATES, INSTITUTIONS, EMPLOYERS } from '@/lib/autocomplete-data';
import { extractProfileSuggestions, type ProfileSuggestion } from '@/lib/document-suggestions';
import { useI18n } from '@/lib/i18n';

interface ProfileSectionProps {
  profile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
  isNewUser?: boolean;
  documents?: UploadedDocument[];
}

export function ProfileSection({ profile, onSave, isNewUser, documents = [] }: ProfileSectionProps) {
  const { t } = useI18n();
  const [formData, setFormData] = useState<UserProfile>(
    profile || {
      fullName: '',
      dateOfBirth: '',
      currentCountry: '',
      currentState: '',
      countryOfOrigin: '',
      citizenships: [],
      languages: [],
      primaryProvider: '',
      providerDetails: '',
      targetCountry: '',
      targetInstitution: '',
      targetEmployment: '',
    }
  );

  const [citizenshipInput, setCitizenshipInput] = useState('');
  const [languageInput, setLanguageInput] = useState('');
  const [saved, setSaved] = useState(false);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());

  const suggestions = extractProfileSuggestions(documents, formData).filter(
    s => !dismissedSuggestions.has(s.field)
  );

  const applySuggestion = (suggestion: ProfileSuggestion) => {
    setFormData(prev => ({ ...prev, [suggestion.field]: suggestion.value }));
    setDismissedSuggestions(prev => new Set([...prev, suggestion.field]));
  };

  const dismissSuggestion = (field: string) => {
    setDismissedSuggestions(prev => new Set([...prev, field]));
  };

  const applyAllSuggestions = () => {
    const updates: Partial<UserProfile> = {};
    suggestions.forEach(s => {
      (updates as any)[s.field] = s.value;
    });
    setFormData(prev => ({ ...prev, ...updates }));
    setDismissedSuggestions(prev => new Set([...prev, ...suggestions.map(s => s.field)]));
  };

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  interface ProviderField {
    key: string;
    label: string;
    placeholder: string;
    required: boolean;
  }

  function getProviderFields(provider: string): { heading: string; fields: ProviderField[] } | null {
    if (!provider.trim()) return null;
    const lower = provider.toLowerCase().trim();

    if (/^dr\.?\s|doctor\s|^md\b|physician|pediatrician|internist|practitioner/i.test(lower)) {
      return {
        heading: "Doctor's Office / Clinic Details",
        fields: [
          { key: "clinicName", label: "Clinic / Practice Name", placeholder: "e.g., Family Medicine Associates", required: true },
          { key: "address", label: "Address", placeholder: "e.g., 123 Main St, Suite 200, Chicago, IL 60601", required: true },
          { key: "phone", label: "Phone Number", placeholder: "e.g., (555) 123-4567", required: true },
          { key: "specialty", label: "Specialty", placeholder: "e.g., Internal Medicine, Family Practice", required: false },
          { key: "patientId", label: "Patient ID (if known)", placeholder: "e.g., PT-12345", required: false },
        ],
      };
    }
    if (/hospital|medical center|medical centre|health system/i.test(lower)) {
      return {
        heading: "Hospital Details",
        fields: [
          { key: "department", label: "Department", placeholder: "e.g., Dept. of Internal Medicine", required: true },
          { key: "attendingPhysician", label: "Attending Physician", placeholder: "e.g., Dr. Patel", required: true },
          { key: "mrn", label: "Patient ID / MRN", placeholder: "e.g., MRN #12345", required: false },
          { key: "phone", label: "Phone Number", placeholder: "e.g., (555) 987-6543", required: true },
          { key: "address", label: "Hospital Address", placeholder: "e.g., 500 University Ave, San Francisco, CA", required: false },
        ],
      };
    }
    if (/clinic|health center|health centre|urgent care|walk-in/i.test(lower)) {
      return {
        heading: "Clinic Details",
        fields: [
          { key: "address", label: "Address", placeholder: "e.g., 456 Oak Ave, Suite 101", required: true },
          { key: "doctorName", label: "Primary Doctor's Name", placeholder: "e.g., Dr. Johnson", required: true },
          { key: "patientId", label: "Patient ID", placeholder: "e.g., Patient #67890", required: false },
          { key: "phone", label: "Phone Number", placeholder: "e.g., (555) 456-7890", required: true },
        ],
      };
    }
    if (/pharmacy|cvs|walgreens|rite aid|costco|walmart/i.test(lower)) {
      return {
        heading: "Pharmacy Details",
        fields: [
          { key: "storeLocation", label: "Store Number / Location", placeholder: "e.g., CVS #4521", required: true },
          { key: "address", label: "Address", placeholder: "e.g., 789 Elm St, Boston, MA", required: true },
          { key: "pharmacistName", label: "Pharmacist Name (if known)", placeholder: "e.g., Dr. Kim", required: false },
          { key: "phone", label: "Phone Number", placeholder: "e.g., (555) 321-0987", required: true },
        ],
      };
    }
    if (/va\b|veterans|military|tricare|army|navy|air force/i.test(lower)) {
      return {
        heading: "Military / VA Healthcare Details",
        fields: [
          { key: "facilityName", label: "Facility Name", placeholder: "e.g., VA Medical Center Portland", required: true },
          { key: "branch", label: "Branch of Service", placeholder: "e.g., US Army, US Navy", required: true },
          { key: "serviceNumber", label: "EDIPI / Service Number", placeholder: "e.g., 1234567890", required: false },
          { key: "pcm", label: "Primary Care Manager (PCM)", placeholder: "e.g., Dr. Williams", required: true },
          { key: "phone", label: "Phone Number", placeholder: "e.g., (555) 555-1234", required: false },
        ],
      };
    }
    if (/university|college|student health|campus/i.test(lower)) {
      return {
        heading: "Student Health Service Details",
        fields: [
          { key: "universityName", label: "University / College Name", placeholder: "e.g., UCLA", required: true },
          { key: "studentId", label: "Student ID", placeholder: "e.g., ID #123456", required: true },
          { key: "assignedProvider", label: "Assigned Provider", placeholder: "e.g., Dr. Lee", required: false },
          { key: "phone", label: "Health Center Phone", placeholder: "e.g., (310) 825-4073", required: true },
        ],
      };
    }
    if (/insurance|aetna|cigna|united|blue cross|anthem|humana|kaiser/i.test(lower)) {
      return {
        heading: "Insurance & Provider Details",
        fields: [
          { key: "planName", label: "Plan Name", placeholder: "e.g., Aetna PPO, Blue Cross HMO", required: true },
          { key: "memberId", label: "Member / Group ID", placeholder: "e.g., Member #W123456", required: true },
          { key: "pcpName", label: "Assigned Primary Care Physician (PCP)", placeholder: "e.g., Dr. Garcia", required: true },
          { key: "network", label: "Network Type", placeholder: "e.g., In-Network, PPO, HMO", required: false },
          { key: "phone", label: "Customer Service Phone", placeholder: "e.g., 1-800-123-4567", required: false },
        ],
      };
    }
    return {
      heading: "Provider Contact Details",
      fields: [
        { key: "providerName", label: "Provider Name", placeholder: "e.g., Dr. Smith, ABC Health Clinic", required: true },
        { key: "address", label: "Address", placeholder: "e.g., 123 Health Blvd, Suite 100", required: true },
        { key: "phone", label: "Phone Number", placeholder: "e.g., (555) 000-1111", required: true },
        { key: "providerType", label: "Provider Type", placeholder: "e.g., Family Practice, Specialist", required: false },
        { key: "patientId", label: "Patient / Member ID", placeholder: "e.g., Patient #ABC123", required: false },
      ],
    };
  }

  function detectProviderType(provider: string): string {
    const lower = provider.toLowerCase().trim();
    if (/^dr\.?\s|doctor\s|^md\b|physician|pediatrician|internist|practitioner/i.test(lower)) return 'doctor';
    if (/hospital|medical center|medical centre|health system/i.test(lower)) return 'hospital';
    if (/clinic|health center|health centre|urgent care|walk-in/i.test(lower)) return 'clinic';
    if (/pharmacy|cvs|walgreens|rite aid|costco|walmart/i.test(lower)) return 'pharmacy';
    if (/va\b|veterans|military|tricare|army|navy|air force/i.test(lower)) return 'military';
    if (/university|college|student health|campus/i.test(lower)) return 'student';
    if (/insurance|aetna|cigna|united|blue cross|anthem|humana|kaiser/i.test(lower)) return 'insurance';
    return 'generic';
  }

  function getProviderDetailsObj(): Record<string, string> {
    const providerType = detectProviderType(formData.primaryProvider);
    try {
      if (formData.providerDetails) {
        const parsed = JSON.parse(formData.providerDetails);
        if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
          if (parsed._type === providerType && parsed.fields) {
            return parsed.fields;
          }
          if (!parsed._type && !parsed.fields) {
            return parsed;
          }
        }
      }
    } catch {
      if (formData.providerDetails && formData.providerDetails.trim()) {
        return { legacyNotes: formData.providerDetails };
      }
    }
    return {};
  }

  function updateProviderDetail(key: string, value: string) {
    const current = getProviderDetailsObj();
    const providerType = detectProviderType(formData.primaryProvider);
    const updated = { _type: providerType, fields: { ...current, [key]: value } };
    if (updated.fields.legacyNotes !== undefined && key !== 'legacyNotes') {
      delete updated.fields.legacyNotes;
    }
    setFormData(prev => ({ ...prev, providerDetails: JSON.stringify(updated) }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFieldChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addCitizenship = () => {
    if (citizenshipInput.trim() && !formData.citizenships.includes(citizenshipInput.trim())) {
      setFormData(prev => ({
        ...prev,
        citizenships: [...prev.citizenships, citizenshipInput.trim()],
      }));
      setCitizenshipInput('');
    }
  };

  const removeCitizenship = (citizenship: string) => {
    setFormData(prev => ({
      ...prev,
      citizenships: prev.citizenships.filter(c => c !== citizenship),
    }));
  };

  const addLanguage = () => {
    if (languageInput.trim() && !formData.languages.includes(languageInput.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, languageInput.trim()],
      }));
      setLanguageInput('');
    }
  };

  const removeLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language),
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {isNewUser && (
        <div className="bg-[#4a7fb5]/10 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#4a7fb5] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-[#4a7fb5] mb-1">{t('welcomeToApp')}</h3>
            <p className="text-sm text-[#86868b]">
              {t('completeYourProfile')}
            </p>
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="bg-[#8aab45]/10 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3 mb-3">
            <Sparkles className="w-5 h-5 text-[#4d9068] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-[#4d9068] mb-1">{t('suggestionsFromDocs')}</h3>
              <p className="text-sm text-[#86868b]">
                We extracted the following from your uploaded records. Click to apply.
              </p>
            </div>
            {suggestions.length > 1 && (
              <button
                onClick={applyAllSuggestions}
                className="text-xs bg-[#4d9068] text-white px-3 py-1.5 rounded-full hover:bg-[#3f7a56] transition-colors whitespace-nowrap"
              >
                Apply All
              </button>
            )}
          </div>
          <div className="space-y-2 ml-8">
            {suggestions.map(s => (
              <div key={s.field} className="flex items-center gap-2 bg-white rounded-xl px-4 py-2">
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-[#86868b]">{s.label}</span>
                  <p className="text-sm font-medium text-[#1d1d1f] truncate">{s.value}</p>
                  <span className="text-xs text-[#86868b]">{t('suggestedBy')}: {s.source}</span>
                </div>
                <button
                  onClick={() => applySuggestion(s)}
                  className="text-xs bg-[#4d9068]/10 text-[#4d9068] px-3 py-1.5 rounded-full hover:bg-[#4d9068]/20 transition-colors whitespace-nowrap"
                >
                  Apply
                </button>
                <button
                  onClick={() => dismissSuggestion(s.field)}
                  className="text-[#86868b] hover:text-[#1d1d1f] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-8 h-8 text-[#4a7fb5]" />
          <h1 className="font-semibold text-[#1d1d1f]">{t('profileInfo')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-[#1d1d1f] uppercase tracking-wide mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="fullName" className="block text-xs text-[#86868b] font-medium mb-2">
                  {t('fullName')} *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-[#f5f5f7] border-0 rounded-xl focus:ring-2 focus:ring-[#4a7fb5] focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block text-xs text-[#86868b] font-medium mb-2">
                  {t('dateOfBirth')} *
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-[#f5f5f7] border-0 rounded-xl focus:ring-2 focus:ring-[#4a7fb5] focus:border-transparent outline-none"
                />
              </div>

              <AutocompleteInput
                id="countryOfOrigin"
                label={t('countryOfOrigin')}
                value={formData.countryOfOrigin}
                onChange={handleFieldChange('countryOfOrigin')}
                suggestions={COUNTRIES}
                required
                placeholder="e.g., Brazil, India, USA"
              />
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#1d1d1f] uppercase tracking-wide mb-4">Current Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AutocompleteInput
                id="currentCountry"
                label={t('currentCountry')}
                value={formData.currentCountry}
                onChange={handleFieldChange('currentCountry')}
                suggestions={COUNTRIES}
                required
              />

              <AutocompleteInput
                id="currentState"
                label={t('currentState')}
                value={formData.currentState}
                onChange={handleFieldChange('currentState')}
                suggestions={US_STATES}
                required
                placeholder="e.g., California, Ontario, London"
              />
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#1d1d1f] uppercase tracking-wide mb-4">{t('citizenships')}</h2>
            <div className="flex gap-2 mb-3">
              <AutocompleteInput
                value={citizenshipInput}
                onChange={setCitizenshipInput}
                suggestions={COUNTRIES}
                placeholder={t('addCitizenship')}
                className="flex-1"
              />
              <button
                type="button"
                onClick={addCitizenship}
                className="bg-[#4a7fb5] hover:bg-[#3d6d9e] text-white px-4 py-2 rounded-full transition-colors flex-shrink-0"
              >
                {t('add')}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.citizenships.map((citizenship) => (
                <span
                  key={citizenship}
                  className="bg-[#4a7fb5]/10 text-[#4a7fb5] px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                >
                  {citizenship}
                  <button
                    type="button"
                    onClick={() => removeCitizenship(citizenship)}
                    className="hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#1d1d1f] uppercase tracking-wide mb-4">{t('languages')}</h2>
            <div className="flex gap-2 mb-3">
              <AutocompleteInput
                value={languageInput}
                onChange={setLanguageInput}
                suggestions={LANGUAGES_LIST}
                placeholder={t('addLanguage')}
                className="flex-1"
              />
              <button
                type="button"
                onClick={addLanguage}
                className="bg-[#4a7fb5] hover:bg-[#3d6d9e] text-white px-4 py-2 rounded-full transition-colors flex-shrink-0"
              >
                {t('add')}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.languages.map((language) => (
                <span
                  key={language}
                  className="bg-[#4d9068]/10 text-[#4d9068] px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                >
                  {language}
                  <button
                    type="button"
                    onClick={() => removeLanguage(language)}
                    className="hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#1d1d1f] uppercase tracking-wide mb-4">Healthcare Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <AutocompleteInput
                id="primaryProvider"
                label={t('primaryProvider')}
                value={formData.primaryProvider}
                onChange={handleFieldChange('primaryProvider')}
                suggestions={HEALTHCARE_PROVIDERS}
                required
                placeholder="e.g., Dr. Smith, City General Hospital"
              />

              {formData.primaryProvider.trim() && (() => {
                const providerConfig = getProviderFields(formData.primaryProvider);
                if (!providerConfig) return null;
                const detailsObj = getProviderDetailsObj();
                return (
                  <div className="bg-[#f5f5f7] rounded-2xl p-4">
                    <h3 className="text-sm font-semibold text-[#1d1d1f] mb-3">{providerConfig.heading}</h3>
                    {detailsObj.legacyNotes && (
                      <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 mb-3">
                        <p className="text-yellow-800 text-xs font-medium mb-1">Previously saved details:</p>
                        <p className="text-yellow-700 text-sm">{detailsObj.legacyNotes}</p>
                        <p className="text-yellow-600 text-xs mt-1">Please enter this information into the fields below. It will be cleared once you start filling in the fields.</p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {providerConfig.fields.map((field) => (
                        <div key={field.key} className={field.key === 'address' ? 'md:col-span-2' : ''}>
                          <label htmlFor={`pd-${field.key}`} className="block text-xs text-[#86868b] font-medium mb-1">
                            {field.label}{field.required ? ' *' : ''}
                          </label>
                          <input
                            type={field.key === 'phone' ? 'tel' : 'text'}
                            id={`pd-${field.key}`}
                            value={detailsObj[field.key] || ''}
                            onChange={(e) => updateProviderDetail(field.key, e.target.value)}
                            required={field.required}
                            placeholder={field.placeholder}
                            className="w-full px-3 py-2 bg-white border-0 rounded-xl focus:ring-2 focus:ring-[#4a7fb5] focus:border-transparent outline-none text-sm"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-[#86868b] text-xs mt-3">
                      This information helps us connect with your provider for record verification and transfers.
                    </p>
                  </div>
                );
              })()}

              <AutocompleteInput
                id="targetCountry"
                label={t('targetCountry')}
                value={formData.targetCountry || ''}
                onChange={handleFieldChange('targetCountry')}
                suggestions={COUNTRIES}
                placeholder="e.g., United States, Canada, United Kingdom"
              />
              <p className="text-[#86868b] text-sm -mt-3 ml-1">
                The country you're applying for a visa to. Use the Compliance page to check that country's vaccination requirements.
              </p>

              <AutocompleteInput
                id="targetInstitution"
                label={t('targetInstitution')}
                value={formData.targetInstitution || ''}
                onChange={handleFieldChange('targetInstitution')}
                suggestions={INSTITUTIONS}
                placeholder="e.g., University of California Berkeley, Stanford University"
              />
              <p className="text-[#86868b] text-sm -mt-3 ml-1">
                The school or institution you're sending records to. Use the Compliance page to check their vaccination requirements.
              </p>

              <AutocompleteInput
                id="targetEmployment"
                label={t('targetEmployment')}
                value={formData.targetEmployment || ''}
                onChange={handleFieldChange('targetEmployment')}
                suggestions={EMPLOYERS}
                placeholder="e.g., Kaiser Permanente, World Health Organization, US Army"
              />
              <p className="text-[#86868b] text-sm -mt-3 ml-1">
                The employer or organization requiring your health records. Use the Compliance page to check their requirements.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-full transition-colors flex items-center justify-center gap-2 ${
              saved
                ? 'bg-[#4d9068] text-white'
                : 'bg-[#4a7fb5] hover:bg-[#3d6d9e] text-white'
            }`}
          >
            <Save className="w-5 h-5" />
            {saved ? t('profileSaved') : t('saveProfile')}
          </button>
        </form>
      </div>
    </div>
  );
}
