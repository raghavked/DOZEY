import { useState, useEffect } from 'react';
import { UserProfile } from '@/types';
import { User, Save, AlertCircle } from 'lucide-react';
import { AutocompleteInput } from '@/components/AutocompleteInput';
import { COUNTRIES, LANGUAGES_LIST, HEALTHCARE_PROVIDERS, US_STATES, INSTITUTIONS, EMPLOYERS } from '@/lib/autocomplete-data';

interface ProfileSectionProps {
  profile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
  isNewUser?: boolean;
}

export function ProfileSection({ profile, onSave, isNewUser }: ProfileSectionProps) {
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
      targetCountry: '',
      targetInstitution: '',
      targetEmployment: '',
    }
  );

  const [citizenshipInput, setCitizenshipInput] = useState('');
  const [languageInput, setLanguageInput] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

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
    <div className="max-w-3xl mx-auto">
      {isNewUser && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#1051a5] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-[#1051a5] mb-1">Welcome to DOZEY!</h3>
            <p className="text-sm text-gray-700">
              Please complete your profile to get started. This information helps us manage your vaccination records 
              and check compliance with your destination's requirements.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-8 h-8 text-[#1051a5]" />
          <h1 className="text-[#22283a]">Your Profile</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="fullName" className="block text-gray-700 mb-2">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1051a5] focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1051a5] focus:border-transparent outline-none"
                />
              </div>

              <AutocompleteInput
                id="countryOfOrigin"
                label="Country of Origin"
                value={formData.countryOfOrigin}
                onChange={handleFieldChange('countryOfOrigin')}
                suggestions={COUNTRIES}
                required
                placeholder="e.g., Brazil, India, USA"
              />
            </div>
          </div>

          <div>
            <h2 className="text-gray-900 mb-4">Current Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AutocompleteInput
                id="currentCountry"
                label="Current Country"
                value={formData.currentCountry}
                onChange={handleFieldChange('currentCountry')}
                suggestions={COUNTRIES}
                required
              />

              <AutocompleteInput
                id="currentState"
                label="State / Province"
                value={formData.currentState}
                onChange={handleFieldChange('currentState')}
                suggestions={US_STATES}
                required
                placeholder="e.g., California, Ontario, London"
              />
            </div>
          </div>

          <div>
            <h2 className="text-gray-900 mb-4">Citizenship(s)</h2>
            <div className="flex gap-2 mb-3">
              <AutocompleteInput
                value={citizenshipInput}
                onChange={setCitizenshipInput}
                suggestions={COUNTRIES}
                placeholder="Add citizenship"
                className="flex-1"
              />
              <button
                type="button"
                onClick={addCitizenship}
                className="bg-[#1051a5] hover:bg-[#0d4185] text-white px-4 py-2 rounded-lg transition-colors flex-shrink-0"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.citizenships.map((citizenship) => (
                <span
                  key={citizenship}
                  className="bg-blue-50 text-[#1051a5] border border-blue-200 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
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
            <h2 className="text-gray-900 mb-4">Languages Spoken</h2>
            <div className="flex gap-2 mb-3">
              <AutocompleteInput
                value={languageInput}
                onChange={setLanguageInput}
                suggestions={LANGUAGES_LIST}
                placeholder="Add language"
                className="flex-1"
              />
              <button
                type="button"
                onClick={addLanguage}
                className="bg-[#1051a5] hover:bg-[#0d4185] text-white px-4 py-2 rounded-lg transition-colors flex-shrink-0"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.languages.map((language) => (
                <span
                  key={language}
                  className="bg-green-50 text-[#26844f] border border-green-200 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
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
            <h2 className="text-gray-900 mb-4">Healthcare Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <AutocompleteInput
                id="primaryProvider"
                label="Primary Healthcare Provider"
                value={formData.primaryProvider}
                onChange={handleFieldChange('primaryProvider')}
                suggestions={HEALTHCARE_PROVIDERS}
                required
                placeholder="e.g., Dr. Smith, City General Hospital"
              />

              <AutocompleteInput
                id="targetCountry"
                label="Target Country for Visa / Immigration (Optional)"
                value={formData.targetCountry || ''}
                onChange={handleFieldChange('targetCountry')}
                suggestions={COUNTRIES}
                placeholder="e.g., United States, Canada, United Kingdom"
              />
              <p className="text-gray-500 text-sm -mt-3 ml-1">
                The country you're applying for a visa to. Use the Compliance page to check that country's vaccination requirements.
              </p>

              <AutocompleteInput
                id="targetInstitution"
                label="Destination Institution / School (Optional)"
                value={formData.targetInstitution || ''}
                onChange={handleFieldChange('targetInstitution')}
                suggestions={INSTITUTIONS}
                placeholder="e.g., University of California Berkeley, Stanford University"
              />
              <p className="text-gray-500 text-sm -mt-3 ml-1">
                The school or institution you're sending records to. Use the Compliance page to check their vaccination requirements.
              </p>

              <AutocompleteInput
                id="targetEmployment"
                label="Target Employer / Organization (Optional)"
                value={formData.targetEmployment || ''}
                onChange={handleFieldChange('targetEmployment')}
                suggestions={EMPLOYERS}
                placeholder="e.g., Kaiser Permanente, World Health Organization, US Army"
              />
              <p className="text-gray-500 text-sm -mt-3 ml-1">
                The employer or organization requiring your health records. Use the Compliance page to check their requirements.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              saved
                ? 'bg-[#26844f] text-white'
                : 'bg-[#1051a5] hover:bg-[#0d4185] text-white'
            }`}
          >
            <Save className="w-5 h-5" />
            {saved ? 'Profile Saved!' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
