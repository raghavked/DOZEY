import { useState } from 'react';
import { VaccinationRecord, UserProfile, ComplianceResult } from '@/types';
import { Search, Target, CheckCircle2, AlertCircle, XCircle, Download, Loader2, Building2, MapPin, FileText, ClipboardList, Info, GraduationCap, Briefcase, Globe } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { Progress } from './ui/progress';

type LookupType = 'institution' | 'employer' | 'country';

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
      default: return 'bg-gray-50 border-gray-200';
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-2">
          <Target className="w-8 h-8 text-[#1051a5]" />
          <div>
            <h1 className="text-[#22283a]">Compliance Check</h1>
            <p className="text-gray-600">Check vaccination and health requirements for schools, employers, or countries</p>
          </div>
        </div>

        <div className="flex gap-2 mt-6 mb-4 bg-gray-100 p-1 rounded-lg">
          {lookupTabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.type}
                onClick={() => handleTabChange(tab.type)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-sm font-medium transition-all ${
                  lookupType === tab.type
                    ? 'bg-white text-[#1051a5] shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <p className="text-sm text-gray-500 mb-4">{activeTab.description}</p>

        <form onSubmit={handleSearch}>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab.placeholder}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1051a5] focus:border-transparent outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchQuery.trim()}
              className="bg-[#1051a5] hover:bg-[#0d4185] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
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
            <p className="text-gray-500 text-sm mb-3">
              {lookupType === 'institution' ? 'Popular institutions:' : lookupType === 'employer' ? 'Popular employers:' : 'Popular destinations:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {popularSuggestions[lookupType].map(item => (
                <button
                  key={item}
                  onClick={() => setSearchQuery(item)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-[#1051a5] hover:text-white text-gray-700 text-sm rounded-full transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Loader2 className="w-12 h-12 text-[#1051a5] animate-spin mx-auto mb-4" />
          <h3 className="text-[#22283a] text-lg mb-2">Looking up requirements...</h3>
          <p className="text-gray-500">
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
          <div className="bg-gradient-to-br from-[#1051a5] to-[#26844f] rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {resultIcon()}
                <div>
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">{resultLabel()}</p>
                  <h2 className="text-white text-xl">{result.institution.institutionName}</h2>
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

            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">Compliance Progress</span>
                <span className="text-3xl font-bold">{result.overallPercentage}%</span>
              </div>
              <Progress value={result.overallPercentage} className="h-3 bg-white/30" />
              <p className="text-white/80 text-sm mt-2">
                {result.totalCompleted} of {result.totalRequired} required doses completed
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <ClipboardList className="w-6 h-6 text-[#1051a5]" />
              <h2 className="text-[#22283a]">Requirement Details</h2>
            </div>

            <div className="space-y-3">
              {result.compliance.map((item, idx) => (
                <div key={idx} className={`border rounded-lg p-4 ${statusColor(item.status)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {statusIcon(item.status)}
                      <div>
                        <h4 className="text-gray-900 font-medium">{item.vaccine_name}</h4>
                        <p className="text-sm text-gray-600">
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
                      <p className="text-xs text-gray-500 mb-1">Your records:</p>
                      {item.matching_records.map((rec, i) => (
                        <p key={i} className="text-xs text-gray-600">- {rec}</p>
                      ))}
                    </div>
                  )}
                  {item.notes && (
                    <p className="mt-2 ml-8 text-xs text-gray-500 italic">{item.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {result.institution.additional_requirements.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-6 h-6 text-[#97bf2d]" />
                <h2 className="text-[#22283a]">Additional Requirements</h2>
              </div>
              <ul className="space-y-2">
                {result.institution.additional_requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <span className="text-[#97bf2d] mt-0.5">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-[#1051a5]" />
              <h2 className="text-[#22283a]">Submission Information</h2>
            </div>

            {result.institution.submission_instructions && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">How to Submit</h4>
                <p className="text-gray-700">{result.institution.submission_instructions}</p>
              </div>
            )}

            {result.institution.forms_needed.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Forms Needed</h4>
                <ul className="space-y-1">
                  {result.institution.forms_needed.map((form, idx) => (
                    <li key={idx} className="text-gray-700 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      {form}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.institution.contact_info && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Contact</h4>
                <p className="text-gray-700">{result.institution.contact_info}</p>
              </div>
            )}

            {result.institution.source_notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-blue-800">{result.institution.source_notes}</p>
              </div>
            )}
          </div>

          {vaccinations.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-yellow-900 font-medium mb-1">No Vaccination Records Yet</h3>
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
