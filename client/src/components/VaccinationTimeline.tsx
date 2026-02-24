import { useState, useMemo } from 'react';
import { VaccinationRecord, UploadedDocument } from '@/types';
import { Clock, CheckCircle, AlertCircle, Trash2, Filter, Globe, Syringe, FileText, ChevronDown, ChevronUp, MapPin, Calendar, User, X } from 'lucide-react';
import { CustomSelect } from '@/components/CustomSelect';
import { ImmunizationGlobe } from '@/components/ImmunizationGlobe';

interface VaccinationTimelineProps {
  vaccinations: VaccinationRecord[];
  documents?: UploadedDocument[];
  onAdd: (vaccination: Omit<VaccinationRecord, 'id'>) => void;
  onDelete: (id: string) => void;
}

export function VaccinationTimeline({ vaccinations, documents = [], onAdd, onDelete }: VaccinationTimelineProps) {
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [filterVerified, setFilterVerified] = useState<string>('all');
  const [filterVaccine, setFilterVaccine] = useState<string>('all');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [showGlobe, setShowGlobe] = useState(true);
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);

  const countries = useMemo(() => Array.from(new Set(vaccinations.map(v => v.countryGiven).filter(Boolean))), [vaccinations]);
  const vaccineTypes = useMemo(() => Array.from(new Set(vaccinations.map(v => v.vaccineName).filter(Boolean))).sort(), [vaccinations]);
  const years = useMemo(() => {
    const yrs = Array.from(new Set(vaccinations.map(v => v.date?.split('-')[0]).filter(Boolean)));
    return yrs.sort((a, b) => Number(b) - Number(a));
  }, [vaccinations]);

  const processedDocs = useMemo(() => 
    documents.filter(d => d.processingStatus === 'completed' && d.parsedData), 
    [documents]
  );

  const activeCountryFilter = selectedCountry || (filterCountry !== 'all' ? filterCountry : null);

  const filteredVaccinations = useMemo(() => {
    return vaccinations
      .filter(v => !activeCountryFilter || v.countryGiven === activeCountryFilter)
      .filter(v => filterVerified === 'all' || (filterVerified === 'verified' ? v.verified : !v.verified))
      .filter(v => filterVaccine === 'all' || v.vaccineName === filterVaccine)
      .filter(v => filterYear === 'all' || v.date?.startsWith(filterYear))
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });
  }, [vaccinations, activeCountryFilter, filterVerified, filterVaccine, filterYear]);

  const groupedByYear = useMemo(() => {
    const groups: Record<string, VaccinationRecord[]> = {};
    filteredVaccinations.forEach(v => {
      const year = v.date?.split('-')[0] || 'Unknown';
      if (!groups[year]) groups[year] = [];
      groups[year].push(v);
    });
    return Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a));
  }, [filteredVaccinations]);

  const formatDate = (dateString: string) => {
    const [y, m, d] = dateString.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleGlobeCountryClick = (country: string) => {
    if (selectedCountry === country) {
      setSelectedCountry(null);
    } else {
      setSelectedCountry(country);
      setFilterCountry('all');
    }
  };

  const clearAllFilters = () => {
    setFilterCountry('all');
    setFilterVerified('all');
    setFilterVaccine('all');
    setFilterYear('all');
    setSelectedCountry(null);
  };

  const hasActiveFilters = filterCountry !== 'all' || filterVerified !== 'all' || filterVaccine !== 'all' || filterYear !== 'all' || selectedCountry !== null;

  const parseParsedData = (pd: string | null) => {
    if (!pd) return null;
    try {
      const data = typeof pd === 'object' ? pd : JSON.parse(pd);
      return data;
    } catch { return null; }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-[#1d1d1f]/30" />
            <div>
              <h1 className="text-[#1d1d1f] font-semibold text-xl">Vaccine Timeline</h1>
              <p className="text-[#86868b] text-sm">All your vaccinations in chronological order</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGlobe(!showGlobe)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                showGlobe ? 'bg-[#4a7fb5] text-white' : 'bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed]'
              }`}
            >
              <Globe className="w-4 h-4" />
              Globe View
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[#f5f5f7] p-4 rounded-2xl text-center">
            <div className="text-2xl font-semibold text-[#4a7fb5]">{vaccinations.length}</div>
            <p className="text-[#86868b] text-xs mt-1">Total Vaccines</p>
          </div>
          <div className="bg-[#f5f5f7] p-4 rounded-2xl text-center">
            <div className="text-2xl font-semibold text-[#4d9068]">{vaccinations.filter(v => v.verified).length}</div>
            <p className="text-[#86868b] text-xs mt-1">Verified</p>
          </div>
          <div className="bg-[#f5f5f7] p-4 rounded-2xl text-center">
            <div className="text-2xl font-semibold text-[#8aab45]">{countries.length}</div>
            <p className="text-[#86868b] text-xs mt-1">Countries</p>
          </div>
        </div>

        {showGlobe && vaccinations.length > 0 && (
          <div className="mb-6 bg-[#f5f5f7] rounded-2xl p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#86868b]" />
                <h3 className="text-sm font-semibold text-[#1d1d1f]">Immunization Map</h3>
              </div>
              {selectedCountry && (
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="flex items-center gap-1 text-xs text-[#4a7fb5] hover:text-[#3a6a9a] font-medium"
                >
                  <X className="w-3 h-3" />
                  Clear "{selectedCountry}"
                </button>
              )}
            </div>
            <p className="text-xs text-[#86868b] mb-3">Click a country marker to filter vaccinations received there. Zoom and pan to explore.</p>
            <ImmunizationGlobe
              vaccinations={vaccinations}
              onCountryClick={handleGlobeCountryClick}
              selectedCountry={selectedCountry}
            />
            {selectedCountry && (
              <div className="mt-3 bg-white rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-[#4a7fb5]" />
                  <h4 className="font-semibold text-[#1d1d1f] text-sm">{selectedCountry}</h4>
                  <span className="ml-auto bg-[#4a7fb5]/10 text-[#4a7fb5] px-2 py-0.5 rounded-full text-xs font-medium">
                    {vaccinations.filter(v => v.countryGiven === selectedCountry).length} vaccine{vaccinations.filter(v => v.countryGiven === selectedCountry).length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {vaccinations
                    .filter(v => v.countryGiven === selectedCountry)
                    .map(v => (
                      <span key={v.id} className="inline-flex items-center gap-1.5 bg-[#f5f5f7] px-3 py-1.5 rounded-full text-xs">
                        <Syringe className="w-3 h-3 text-[#86868b]" />
                        <span className="text-[#1d1d1f] font-medium">{v.vaccineName}</span>
                        <span className="text-[#86868b]">· {formatDate(v.date)}</span>
                      </span>
                    ))
                  }
                </div>
              </div>
            )}
          </div>
        )}

        {processedDocs.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-[#86868b]" />
              <h3 className="text-sm font-semibold text-[#1d1d1f]">Analyzed Documents</h3>
              <span className="bg-[#4d9068]/10 text-[#4d9068] text-xs px-2 py-0.5 rounded-full font-medium">
                {processedDocs.length} processed
              </span>
            </div>
            <div className="space-y-2">
              {processedDocs.map(doc => {
                const parsed = parseParsedData(doc.parsedData ?? null);
                const isExpanded = expandedDocId === doc.id;
                const vaxCount = parsed?.vaccinations?.length || 0;
                return (
                  <div key={doc.id} className="bg-[#f5f5f7] rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setExpandedDocId(isExpanded ? null : doc.id)}
                      className="w-full flex items-center gap-3 p-4 text-left hover:bg-[#e8e8ed] transition-colors"
                    >
                      <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-[#4a7fb5]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1d1d1f] truncate">{doc.name}</p>
                        <p className="text-xs text-[#86868b]">
                          {doc.country} · {vaxCount} vaccination{vaxCount !== 1 ? 's' : ''} found
                          {doc.originalLanguage && doc.originalLanguage !== 'en' ? ` · Translated from ${doc.originalLanguage}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-[#4d9068]/10 text-[#4d9068] text-xs px-2 py-0.5 rounded-full font-medium">
                          <CheckCircle className="w-3 h-3 inline mr-1" />
                          Processed
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-[#86868b]" /> : <ChevronDown className="w-4 h-4 text-[#86868b]" />}
                      </div>
                    </button>

                    {isExpanded && parsed && (
                      <div className="px-4 pb-4 space-y-3">
                        {parsed.patient_info && (
                          <div className="bg-white rounded-xl p-3">
                            <h5 className="text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">Patient Information</h5>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {parsed.patient_info.full_name && (
                                <div>
                                  <span className="text-[#86868b]">Name:</span>
                                  <span className="ml-1 text-[#1d1d1f]">{parsed.patient_info.full_name}</span>
                                </div>
                              )}
                              {parsed.patient_info.date_of_birth && (
                                <div>
                                  <span className="text-[#86868b]">DOB:</span>
                                  <span className="ml-1 text-[#1d1d1f]">{parsed.patient_info.date_of_birth}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {parsed.summary && (
                          <div className="bg-white rounded-xl p-3">
                            <h5 className="text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">Summary</h5>
                            <p className="text-sm text-[#1d1d1f]">{parsed.summary}</p>
                          </div>
                        )}
                        {parsed.vaccinations && parsed.vaccinations.length > 0 && (
                          <div className="bg-white rounded-xl p-3">
                            <h5 className="text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">Extracted Vaccinations</h5>
                            <div className="space-y-2">
                              {parsed.vaccinations.map((vax: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-3 bg-[#f5f5f7] rounded-lg p-3">
                                  <Syringe className="w-4 h-4 text-[#4a7fb5] shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[#1d1d1f]">{vax.vaccine_name}</p>
                                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-[#86868b]">
                                      {vax.date && <span>{vax.date}</span>}
                                      {vax.dose_number && <span>Dose {vax.dose_number}</span>}
                                      {vax.provider && <span>{vax.provider}</span>}
                                      {vax.country_given && <span>{vax.country_given}</span>}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-[#f5f5f7] p-4 rounded-2xl mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#86868b]" />
              <h3 className="text-sm font-semibold text-[#1d1d1f]">Filters</h3>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-[#4a7fb5] hover:text-[#3a6a9a] font-medium flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <CustomSelect
              id="filterCountry"
              label="Country"
              value={selectedCountry ? 'all' : filterCountry}
              onChange={(val) => { setFilterCountry(val); setSelectedCountry(null); }}
              options={[
                { value: 'all', label: 'All Countries' },
                ...countries.map(c => ({ value: c, label: c })),
              ]}
            />
            <CustomSelect
              id="filterVaccine"
              label="Vaccine"
              value={filterVaccine}
              onChange={setFilterVaccine}
              options={[
                { value: 'all', label: 'All Vaccines' },
                ...vaccineTypes.map(v => ({ value: v, label: v })),
              ]}
            />
            <CustomSelect
              id="filterYear"
              label="Year"
              value={filterYear}
              onChange={setFilterYear}
              options={[
                { value: 'all', label: 'All Years' },
                ...years.map(y => ({ value: y, label: y })),
              ]}
            />
            <CustomSelect
              id="filterVerified"
              label="Status"
              value={filterVerified}
              onChange={setFilterVerified}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'verified', label: 'Verified Only' },
                { value: 'unverified', label: 'Unverified Only' },
              ]}
            />
          </div>
        </div>

        {filteredVaccinations.length === 0 ? (
          <div className="text-center py-12 text-[#86868b]">
            <Clock className="w-16 h-16 mx-auto mb-4 text-[#1d1d1f]/10" />
            <p className="font-medium">No vaccination records found</p>
            <p className="text-sm mt-2">
              {hasActiveFilters
                ? 'Try adjusting your filters'
                : 'Add your first vaccination record to get started'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="mt-4 text-[#4a7fb5] hover:text-[#3a6a9a] text-sm font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {groupedByYear.map(([year, vaxes]) => (
              <div key={year}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-[#4a7fb5] text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {year}
                  </div>
                  <div className="flex-1 h-px bg-[#1d1d1f]/5" />
                  <span className="text-xs text-[#86868b]">{vaxes.length} record{vaxes.length !== 1 ? 's' : ''}</span>
                </div>

                <div className="relative pl-6">
                  <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-[#1d1d1f]/5" />

                  <div className="space-y-3">
                    {vaxes.map((vax) => (
                      <div
                        key={vax.id}
                        className="relative bg-white border border-black/5 rounded-2xl p-5 hover:shadow-sm transition-all"
                      >
                        <div className="absolute -left-[15px] top-6 w-3 h-3 rounded-full border-2 border-white bg-[#4a7fb5] shadow-sm" />

                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                              <h3 className="font-semibold text-[#1d1d1f]">{vax.vaccineName}</h3>
                              {vax.verified ? (
                                <span className="flex items-center gap-1 bg-[#4d9068]/10 text-[#4d9068] px-2.5 py-0.5 rounded-full text-xs font-medium">
                                  <CheckCircle className="w-3 h-3" />
                                  Verified
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 bg-[#8aab45]/10 text-[#8aab45] px-2.5 py-0.5 rounded-full text-xs font-medium">
                                  <AlertCircle className="w-3 h-3" />
                                  Pending
                                </span>
                              )}
                              <span className="bg-[#4a7fb5]/10 text-[#4a7fb5] px-2.5 py-0.5 rounded-full text-xs font-medium">
                                Dose {vax.doseNumber}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => onDelete(vax.id)}
                            className="text-[#86868b] hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#86868b]" />
                            <span className="text-[#1d1d1f]">{formatDate(vax.date)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#86868b]" />
                            <span className="text-[#1d1d1f]">{vax.countryGiven}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-[#86868b]" />
                            <span className="text-[#1d1d1f]">{vax.location || '—'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-[#86868b]" />
                            <span className="text-[#1d1d1f]">{vax.provider || '—'}</span>
                          </div>
                        </div>

                        {vax.notes && (
                          <div className="mt-3 pt-3 border-t border-black/5">
                            <p className="text-sm text-[#86868b]">{vax.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
