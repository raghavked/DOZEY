import { useState } from 'react';
import { CountryPeriod, VaccinationRecord, UploadedDocument } from '@/types';
import { Globe, Plus, Trash2, MapPin, Sparkles, X, Check } from 'lucide-react';
import { AutocompleteInput } from '@/components/AutocompleteInput';
import { COUNTRIES, US_STATES } from '@/lib/autocomplete-data';
import { extractCountrySuggestions } from '@/lib/document-suggestions';
import { useI18n } from '@/lib/i18n';

interface CountryHistoryProps {
  periods: CountryPeriod[];
  onAdd: (period: Omit<CountryPeriod, 'id'>) => void;
  onDelete: (id: string) => void;
  vaccinations?: VaccinationRecord[];
  documents?: UploadedDocument[];
}

export function CountryHistory({ periods, onAdd, onDelete, vaccinations = [], documents = [] }: CountryHistoryProps) {
  const { t } = useI18n();
  const [showForm, setShowForm] = useState(false);
  const [dismissedCountries, setDismissedCountries] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    country: '',
    state: '',
    startYear: new Date().getFullYear(),
    startMonth: null as number | null,
    endYear: 'Present' as number | 'Present',
    endMonth: null as number | null,
  });

  const monthOptions = [
    { value: 1, label: t('jan') }, { value: 2, label: t('feb') }, { value: 3, label: t('mar') },
    { value: 4, label: t('apr') }, { value: 5, label: t('may') }, { value: 6, label: t('jun') },
    { value: 7, label: t('jul') }, { value: 8, label: t('aug') }, { value: 9, label: t('sep') },
    { value: 10, label: t('oct') }, { value: 11, label: t('nov') }, { value: 12, label: t('dec') },
  ];

  const countrySuggestions = extractCountrySuggestions(vaccinations, documents, periods)
    .filter(s => !dismissedCountries.has(s.country.toLowerCase()));

  const addSuggestedCountry = (suggestion: { country: string; earliestYear: number; latestYear: number }) => {
    onAdd({
      country: suggestion.country,
      state: '',
      startYear: suggestion.earliestYear,
      endYear: suggestion.latestYear >= new Date().getFullYear() ? 'Present' : suggestion.latestYear,
    });
    setDismissedCountries(prev => new Set([...prev, suggestion.country.toLowerCase()]));
  };

  const dismissCountrySuggestion = (country: string) => {
    setDismissedCountries(prev => new Set([...prev, country.toLowerCase()]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      country: '',
      state: '',
      startYear: new Date().getFullYear(),
      startMonth: null,
      endYear: 'Present',
      endMonth: null,
    });
    setShowForm(false);
  };

  const formatMonthYear = (month: number | null | undefined, year: number | string) => {
    if (year === 'Present') return t('present');
    if (month) {
      const labels = [t('jan'), t('feb'), t('mar'), t('apr'), t('may'), t('jun'), t('jul'), t('aug'), t('sep'), t('oct'), t('nov'), t('dec')];
      return `${labels[month - 1]} ${year}`;
    }
    return `${year}`;
  };

  const sortedPeriods = [...periods].sort((a, b) => {
    if (a.startYear !== b.startYear) return a.startYear - b.startYear;
    return (a.startMonth || 0) - (b.startMonth || 0);
  });

  return (
    <div>
      <div className="bg-white rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-8 h-8 text-[#1d1d1f]/30" />
          <div>
            <h1 className="font-semibold text-[#1d1d1f]">{t('residenceHistory')}</h1>
            <p className="text-[#86868b]">{t('residenceDescription')}</p>
          </div>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-[#4d9068] hover:bg-[#3f7a56] text-white py-3 rounded-full flex items-center justify-center gap-2 transition-colors mb-6"
          >
            <Plus className="w-5 h-5" />
            {t('addCountry')}
          </button>
        )}

        {countrySuggestions.length > 0 && (
          <div className="bg-[#8aab45]/10 rounded-2xl p-4 mb-6">
            <div className="flex items-start gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-[#4d9068] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-[#4d9068] mb-1">{t('countrySuggestions')}</h3>
                <p className="text-sm text-[#86868b]">
                  {t('addFromDocuments')}
                </p>
              </div>
            </div>
            <div className="space-y-2 ml-8">
              {countrySuggestions.map(s => (
                <div key={s.country} className="flex items-center gap-2 bg-white rounded-xl px-4 py-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1d1d1f]">{s.country}</p>
                    <span className="text-xs text-[#86868b]">
                      {s.vaccinationCount} vaccination{s.vaccinationCount !== 1 ? 's' : ''}
                      {s.earliestYear ? ` · ${s.earliestYear}${s.latestYear !== s.earliestYear ? `–${s.latestYear}` : ''}` : ''}
                    </span>
                  </div>
                  <button
                    onClick={() => addSuggestedCountry(s)}
                    className="text-xs bg-[#4d9068]/10 text-[#4d9068] px-3 py-1.5 rounded-full hover:bg-[#4d9068]/20 transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    {t('add')}
                  </button>
                  <button
                    onClick={() => dismissCountrySuggestion(s.country)}
                    className="text-[#86868b] hover:text-[#1d1d1f] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-[#f5f5f7] p-6 rounded-2xl mb-6">
            <h3 className="text-sm font-semibold text-[#1d1d1f] uppercase tracking-wide mb-4">{t('addResidence')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <AutocompleteInput
                id="country"
                label={t('country')}
                value={formData.country}
                onChange={(val) => setFormData(prev => ({ ...prev, country: val }))}
                suggestions={COUNTRIES}
                required
                placeholder="e.g., Canada, India, USA"
              />

              <AutocompleteInput
                id="state"
                label={t('state')}
                value={formData.state}
                onChange={(val) => setFormData(prev => ({ ...prev, state: val }))}
                suggestions={US_STATES}
                placeholder="e.g., Ontario, California"
              />

              <div>
                <label htmlFor="startYear" className="block text-xs text-[#86868b] font-medium mb-2">
                  {t('startYear')} *
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.startMonth ?? ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, startMonth: e.target.value ? parseInt(e.target.value) : null }))}
                    className="w-24 px-3 py-2 bg-white border-0 rounded-xl focus:ring-2 focus:ring-[#4a7fb5] focus:border-transparent outline-none text-sm"
                  >
                    <option value="">{t('monthOptional')}</option>
                    {monthOptions.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    id="startYear"
                    value={formData.startYear}
                    onChange={(e) => setFormData(prev => ({ ...prev, startYear: parseInt(e.target.value) }))}
                    required
                    min="1900"
                    max={new Date().getFullYear()}
                    className="flex-1 px-4 py-2 bg-white border-0 rounded-xl focus:ring-2 focus:ring-[#4a7fb5] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="endYear" className="block text-xs text-[#86868b] font-medium mb-2">
                  {t('endYear')} *
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.endMonth ?? ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, endMonth: e.target.value ? parseInt(e.target.value) : null }))}
                    className="w-24 px-3 py-2 bg-white border-0 rounded-xl focus:ring-2 focus:ring-[#4a7fb5] focus:border-transparent outline-none text-sm"
                  >
                    <option value="">{t('monthOptional')}</option>
                    {monthOptions.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    id="endYear"
                    value={formData.endYear === 'Present' ? '' : formData.endYear}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      endYear: e.target.value ? parseInt(e.target.value) : 'Present' 
                    }))}
                    placeholder="Leave empty for Present"
                    min="1900"
                    max={new Date().getFullYear()}
                    className="flex-1 px-4 py-2 bg-white border-0 rounded-xl focus:ring-2 focus:ring-[#4a7fb5] focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-[#4d9068] hover:bg-[#3f7a56] text-white py-2 rounded-full transition-colors"
              >
                {t('addResidence')}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed] py-2 rounded-full transition-colors"
              >
                {t('cancel')}
              </button>
            </div>
          </form>
        )}

        {periods.length === 0 ? (
          <div className="text-center py-12 text-[#86868b]">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-[#1d1d1f]/10" />
            <p>{t('noCountries')}</p>
            <p className="text-sm mt-2">{t('addCountriesToTrack')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#1d1d1f] uppercase tracking-wide">Your Timeline</h3>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-black/5" />
              
              {sortedPeriods.map((period, index) => (
                <div key={period.id} className="relative flex items-start gap-4 pb-8">
                  <div className="w-16 flex-shrink-0 flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-[#4a7fb5] border-4 border-white shadow-sm z-10" />
                    {index === sortedPeriods.length - 1 && period.endYear === 'Present' && (
                      <div className="mt-2 px-2 py-1 bg-[#4d9068]/10 text-[#4d9068] text-xs rounded-full">
                        Now
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 bg-[#f5f5f7] rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-[#1d1d1f]">
                          {period.country}{period.state ? `, ${period.state}` : ''}
                        </h4>
                        <p className="text-[#86868b]">
                          {formatMonthYear(period.startMonth, period.startYear)} - {formatMonthYear(period.endMonth, period.endYear === 'Present' ? 'Present' : period.endYear)}
                          {period.endYear !== 'Present' && (
                            <span className="text-[#86868b] ml-2">
                              ({(typeof period.endYear === 'number' ? period.endYear : 0) - period.startYear} years)
                            </span>
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => onDelete(period.id)}
                        className="text-[#86868b] hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
