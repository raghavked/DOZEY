import { useState, useRef, useEffect } from 'react';
import { VaccinationRecord, UserProfile, ComplianceResult } from '@/types';
import { Search, Target, CheckCircle2, AlertCircle, XCircle, Download, Loader2, Building2, MapPin, FileText, ClipboardList, Info, GraduationCap, Briefcase, Globe } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { Progress } from './ui/progress';
import { INSTITUTIONS, EMPLOYERS, COUNTRIES } from '@/lib/autocomplete-data';

type LookupType = 'institution' | 'employer' | 'country';

function ComplianceSearchInput({ value, onChange, placeholder, suggestions }: { value: string; onChange: (v: string) => void; placeholder: string; suggestions: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef<HTMLUListElement>(null);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered = value
    ? suggestions.filter(s => s.toLowerCase().includes(value.toLowerCase())).slice(0, 8)
    : suggestions.slice(0, 8);

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const el = listRef.current.children[activeIndex] as HTMLElement;
      el?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  useEffect(() => () => { if (blurTimeout.current) clearTimeout(blurTimeout.current); }, []);

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b] z-10" />
      <input
        type="text"
        value={value}
        onChange={(e) => { onChange(e.target.value); setIsOpen(true); setActiveIndex(-1); }}
        onFocus={() => { if (blurTimeout.current) clearTimeout(blurTimeout.current); setIsOpen(true); setActiveIndex(-1); }}
        onBlur={() => { blurTimeout.current = setTimeout(() => { setIsOpen(false); setActiveIndex(-1); }, 200); }}
        onKeyDown={(e) => {
          if (!isOpen || filtered.length === 0) { if (e.key === 'ArrowDown') { setIsOpen(true); setActiveIndex(0); e.preventDefault(); } return; }
          if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(p => p < filtered.length - 1 ? p + 1 : 0); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(p => p > 0 ? p - 1 : filtered.length - 1); }
          else if (e.key === 'Enter' && activeIndex >= 0) { e.preventDefault(); onChange(filtered[activeIndex]); setIsOpen(false); }
          else if (e.key === 'Escape') { setIsOpen(false); setActiveIndex(-1); }
        }}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full pl-11 pr-4 py-3 bg-[#f5f5f7] border-0 rounded-xl focus:ring-2 focus:ring-[#4a7fb5] focus:border-transparent outline-none"
      />
      {isOpen && filtered.length > 0 && (
        <ul ref={listRef} className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg max-h-64 overflow-y-auto">
          {filtered.map((item, i) => (
            <li key={item} onMouseDown={(e) => { e.preventDefault(); onChange(item); setIsOpen(false); }} onMouseEnter={() => setActiveIndex(i)}
              className={`px-4 py-2.5 cursor-pointer transition-colors text-sm ${i === activeIndex ? 'bg-[#4a7fb5] text-white' : 'hover:bg-[#f5f5f7] text-[#1d1d1f]'}`}
            >{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface ComplianceReportProps {
  vaccinations: VaccinationRecord[];
  profile: UserProfile | null;
}

const lookupTabs: { type: LookupType; label: string; icon: typeof GraduationCap; description: string; placeholder: string; defaultQuery: (p: UserProfile | null) => string }[] = [
  {
    type: 'institution',
    label: 'School / Institution',
    icon: GraduationCap,
    description: 'Check vaccination requirements for universities, colleges, and schools',
    placeholder: 'Search for a university, college, or school...',
    defaultQuery: (p) => p?.targetInstitution || '',
  },
  {
    type: 'employer',
    label: 'Employer',
    icon: Briefcase,
    description: 'Check health requirements for employers and organizations',
    placeholder: 'Search for an employer or organization...',
    defaultQuery: (p) => p?.targetEmployment || '',
  },
  {
    type: 'country',
    label: 'Country / Visa',
    icon: Globe,
    description: 'Check vaccination requirements for immigration and visa applications',
    placeholder: 'Search for a country...',
    defaultQuery: (p) => p?.targetCountry || '',
  },
];

const popularSuggestions: Record<LookupType, string[]> = {
  institution: [
    'University of California, Berkeley',
    'University of California, Los Angeles',
    'Stanford University',
    'Harvard University',
    'MIT',
    'University of Michigan',
    'University of Toronto',
    'University of Oxford',
    'Columbia University',
    'New York University',
  ],
  employer: [
    'Kaiser Permanente',
    'Mayo Clinic',
    'Cleveland Clinic',
    'Johns Hopkins Hospital',
    'World Health Organization',
    'United Nations',
    'US Military',
    'Amazon Warehouse',
    'Doctors Without Borders',
    'Peace Corps',
  ],
  country: [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany',
    'Saudi Arabia',
    'United Arab Emirates',
    'Japan',
    'Singapore',
    'New Zealand',
  ],
};

export function ComplianceReport({ vaccinations, profile }: ComplianceReportProps) {
  const [lookupType, setLookupType] = useState<LookupType>('institution');
  const [searchQuery, setSearchQuery] = useState(profile?.targetInstitution || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [activeResultType, setActiveResultType] = useState<LookupType>('institution');

  const handleTabChange = (type: LookupType) => {
    setLookupType(type);
    const tab = lookupTabs.find(t => t.type === type);
    setSearchQuery(tab?.defaultQuery(profile) || '');
    setResult(null);
    setError(null);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const sb = await getSupabase();
      const { data: { session } } = await sb.auth.getSession();
      const res = await fetch('/api/compliance/lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ institutionName: searchQuery.trim(), lookupType }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to look up requirements');
      }

      const data = await res.json();
      setResult(data);
      setActiveResultType(lookupType);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!result) return;
    setDownloading(true);

    try {
      const sb = await getSupabase();
      const { data: { session } } = await sb.auth.getSession();
      const res = await fetch('/api/compliance/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          institution: result.institution,
          compliance: result.compliance,
          overallPercentage: result.overallPercentage,
          lookupType: activeResultType,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate report');

      const data = await res.json();
      const blob = new Blob([data.report], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const prefix = activeResultType === 'country' ? 'Visa' : activeResultType === 'employer' ? 'Employment' : 'Compliance';
      a.download = `DOZEY-${prefix}-Report-${result.institution.institutionName.replace(/\s+/g, '-')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || 'Failed to download report');
    } finally {
      setDownloading(false);
    }
  };

  const activeTab = lookupTabs.find(t => t.type === lookupType)!;

  const statusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'partial': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'missing': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-50 border-green-200';
      case 'partial': return 'bg-yellow-50 border-yellow-200';
      case 'missing': return 'bg-red-50 border-red-200';
      default: return 'bg-[#f5f5f7] border-0';
    }
  };

  const resultIcon = () => {
    switch (activeResultType) {
      case 'employer': return <Briefcase className="w-8 h-8" />;
      case 'country': return <Globe className="w-8 h-8" />;
      default: return <Building2 className="w-8 h-8" />;
    }
  };

  const resultLabel = () => {
    switch (activeResultType) {
      case 'employer': return 'EMPLOYER';
      case 'country': return 'DESTINATION COUNTRY';
      default: return 'INSTITUTION';
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border-0 p-8">
        <div className="flex items-center gap-3 mb-2">
          <Target className="w-8 h-8 text-[#1d1d1f]/30" />
          <div>
            <h1 className="text-[#1d1d1f] font-semibold">Compliance Check</h1>
            <p className="text-[#86868b]">Check vaccination and health requirements for schools, employers, or countries</p>
          </div>
        </div>

        <div className="flex gap-2 mt-6 mb-4 bg-[#f5f5f7] p-1 rounded-xl">
          {lookupTabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.type}
                onClick={() => handleTabChange(tab.type)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                  lookupType === tab.type
                    ? 'bg-[#4a7fb5] text-white'
                    : 'bg-[#f5f5f7] text-[#86868b]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <p className="text-sm text-[#86868b] mb-4">{activeTab.description}</p>

        <form onSubmit={handleSearch}>
          <div className="flex gap-3">
            <ComplianceSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={activeTab.placeholder}
              suggestions={lookupType === 'institution' ? INSTITUTIONS : lookupType === 'employer' ? EMPLOYERS : COUNTRIES}
            />
            <button
              type="submit"
              disabled={loading || !searchQuery.trim()}
              className="bg-[#4a7fb5] hover:bg-[#3a6a9a] text-white px-6 py-3 rounded-full font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Looking up...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Check
                </>
              )}
            </button>
          </div>
        </form>

        {!result && !loading && !error && (
          <div className="mt-6">
            <p className="text-[#86868b] text-sm mb-3">
              {lookupType === 'institution' ? 'Popular institutions:' : lookupType === 'employer' ? 'Popular employers:' : 'Popular destinations:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {popularSuggestions[lookupType].map(item => (
                <button
                  key={item}
                  onClick={() => setSearchQuery(item)}
                  className="px-3 py-1.5 bg-[#f5f5f7] hover:bg-[#4a7fb5] hover:text-white text-[#1d1d1f] text-sm rounded-full transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-2xl border-0 p-12 text-center">
          <Loader2 className="w-12 h-12 text-[#4a7fb5] animate-spin mx-auto mb-4" />
          <h3 className="text-[#1d1d1f] font-semibold text-lg mb-2">Looking up requirements...</h3>
          <p className="text-[#86868b]">
            {lookupType === 'employer' 
              ? `Searching for health requirements at ${searchQuery}` 
              : lookupType === 'country'
              ? `Searching for immigration requirements for ${searchQuery}`
              : `Searching for vaccination requirements at ${searchQuery}`}
          </p>
        </div>
      )}

      {result && (
        <>
          <div className="bg-gradient-to-br from-[#4a7fb5] to-[#4d9068] rounded-2xl border-0 p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {resultIcon()}
                <div>
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">{resultLabel()}</p>
                  <h2 className="text-white text-xl font-semibold">{result.institution.institutionName}</h2>
                  <div className="flex items-center gap-1 text-white/80 text-sm">
                    <MapPin className="w-4 h-4" />
                    {result.institution.location}
                  </div>
                </div>
              </div>
              <button
                onClick={handleDownloadReport}
                disabled={downloading}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {downloading ? 'Generating...' : 'Download Report'}
              </button>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold">Compliance Progress</span>
                <span className="text-3xl font-semibold">{result.overallPercentage}%</span>
              </div>
              <Progress value={result.overallPercentage} className="h-3 bg-white/30" />
              <p className="text-white/80 text-sm mt-2">
                {result.totalCompleted} of {result.totalRequired} required doses completed
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border-0 p-8">
            <div className="flex items-center gap-3 mb-6">
              <ClipboardList className="w-6 h-6 text-[#1d1d1f]/30" />
              <h2 className="text-[#1d1d1f] font-semibold">Requirement Details</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {result.compliance.map((item, idx) => (
                <div key={idx} className={`border rounded-xl p-4 ${statusColor(item.status)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {statusIcon(item.status)}
                      <div>
                        <h4 className="text-[#1d1d1f] font-medium">{item.vaccine_name}</h4>
                        <p className="text-sm text-[#86868b]">
                          {item.completed_doses} of {item.required_doses} dose{item.required_doses !== 1 ? 's' : ''} completed
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'complete' ? 'bg-green-200 text-green-800' :
                      item.status === 'partial' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-red-200 text-red-800'
                    }`}>
                      {item.status === 'complete' ? 'Complete' : item.status === 'partial' ? 'Partial' : 'Missing'}
                    </span>
                  </div>
                  {item.matching_records.length > 0 && (
                    <div className="mt-2 ml-8">
                      <p className="text-xs text-[#86868b] mb-1">Your records:</p>
                      {item.matching_records.map((rec, i) => {
                        const isExemption = rec.startsWith('Natural Immunity:') || rec.startsWith('Medical Exemption:') || rec.startsWith('Titer:');
                        return (
                          <p key={i} className={`text-xs ${isExemption ? 'text-purple-700 font-medium' : 'text-[#86868b]'}`}>
                            - {isExemption ? '🛡️ ' : ''}{rec}
                          </p>
                        );
                      })}
                    </div>
                  )}
                  {item.notes && (
                    <p className="mt-2 ml-8 text-xs text-[#86868b] italic">{item.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {result.institution.additional_requirements.length > 0 && (
            <div className="bg-white rounded-2xl border-0 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-6 h-6 text-[#1d1d1f]/30" />
                <h2 className="text-[#1d1d1f] font-semibold">Additional Requirements</h2>
              </div>
              <ul className="space-y-2">
                {result.institution.additional_requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[#1d1d1f]">
                    <span className="text-[#8aab45] mt-0.5">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white rounded-2xl border-0 p-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-[#1d1d1f]/30" />
              <h2 className="text-[#1d1d1f] font-semibold">Submission Information</h2>
            </div>

            {result.institution.submission_instructions && (
              <div className="mb-4">
                <h4 className="text-xs text-[#86868b] font-medium uppercase mb-2">How to Submit</h4>
                <p className="text-[#1d1d1f]">{result.institution.submission_instructions}</p>
              </div>
            )}

            {result.institution.forms_needed.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs text-[#86868b] font-medium uppercase mb-2">Forms Needed</h4>
                <ul className="space-y-1">
                  {result.institution.forms_needed.map((form, idx) => (
                    <li key={idx} className="text-[#1d1d1f] flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#86868b]" />
                      {form}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.institution.contact_info && (
              <div className="mb-4">
                <h4 className="text-xs text-[#86868b] font-medium uppercase mb-2">Contact</h4>
                <p className="text-[#1d1d1f]">{result.institution.contact_info}</p>
              </div>
            )}

            {result.institution.source_notes && (
              <div className="bg-[#f5f5f7] border-0 rounded-2xl p-3 mt-4">
                <p className="text-sm text-[#86868b]">{result.institution.source_notes}</p>
              </div>
            )}
          </div>

          {vaccinations.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-yellow-900 font-semibold mb-1">No Vaccination Records Yet</h3>
                  <p className="text-yellow-700 text-sm">
                    You haven't added any vaccination records yet. Upload your vaccine documents or add records manually to see how your records match against these requirements.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
