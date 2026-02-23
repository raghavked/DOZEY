import { useState } from 'react';
import { UserProfile } from '@/types';
import { User, Save } from 'lucide-react';

interface ProfileSectionProps {
  profile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
}

export function ProfileSection({ profile, onSave }: ProfileSectionProps) {
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
    }
  );

  const [citizenshipInput, setCitizenshipInput] = useState('');
  const [languageInput, setLanguageInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-8 h-8 text-[#1051a5]" />
          <h1 className="text-[#22283a]">Your Profile</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label htmlFor="countryOfOrigin" className="block text-gray-700 mb-2">
                  Country of Origin *
                </label>
                <input
                  type="text"
                  id="countryOfOrigin"
                  name="countryOfOrigin"
                  value={formData.countryOfOrigin}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Brazil, India, USA"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Current Location */}
          <div>
            <h2 className="text-gray-900 mb-4">Current Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="currentCountry" className="block text-gray-700 mb-2">
                  Current Country *
                </label>
                <input
                  type="text"
                  id="currentCountry"
                  name="currentCountry"
                  value={formData.currentCountry}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label htmlFor="currentState" className="block text-gray-700 mb-2">
                  State / Province *
                </label>
                <input
                  type="text"
                  id="currentState"
                  name="currentState"
                  value={formData.currentState}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Citizenships */}
          <div>
            <h2 className="text-gray-900 mb-4">Citizenship(s)</h2>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={citizenshipInput}
                onChange={(e) => setCitizenshipInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCitizenship())}
                placeholder="Add citizenship"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={addCitizenship}
                className="bg-[#1051a5] hover:bg-[#0d4185] text-white px-4 py-2 rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.citizenships.map((citizenship) => (
                <span
                  key={citizenship}
                  className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {citizenship}
                  <button
                    type="button"
                    onClick={() => removeCitizenship(citizenship)}
                    className="hover:text-indigo-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h2 className="text-gray-900 mb-4">Languages Spoken</h2>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                placeholder="Add language"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={addLanguage}
                className="bg-[#1051a5] hover:bg-[#0d4185] text-white px-4 py-2 rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.languages.map((language) => (
                <span
                  key={language}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {language}
                  <button
                    type="button"
                    onClick={() => removeLanguage(language)}
                    className="hover:text-green-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Healthcare Provider */}
          <div>
            <h2 className="text-gray-900 mb-4">Healthcare Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="primaryProvider" className="block text-gray-700 mb-2">
                  Primary Healthcare Provider (Optional)
                </label>
                <input
                  type="text"
                  id="primaryProvider"
                  name="primaryProvider"
                  value={formData.primaryProvider}
                  onChange={handleChange}
                  placeholder="e.g., Dr. Smith, City General Hospital"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              
              <div>
                <label htmlFor="targetCountry" className="block text-gray-700 mb-2">
                  Target Country (Optional)
                </label>
                <input
                  type="text"
                  id="targetCountry"
                  name="targetCountry"
                  value={formData.targetCountry || ''}
                  onChange={handleChange}
                  placeholder="e.g., United States, Canada, United Kingdom"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
                <p className="text-gray-500 text-sm mt-1">
                  If you're planning to study or work in another country, enter it here to track compliance requirements.
                </p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#1051a5] hover:bg-[#0d4185] text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}