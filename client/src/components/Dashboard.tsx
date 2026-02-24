import { VaccinationRecord, UserProfile, CountryPeriod, UploadedDocument } from '@/types';
import { User, Globe, FileText, Syringe, AlertCircle, CheckCircle, Target, ArrowRight, Upload, Shield, Share2 } from 'lucide-react';
import { Progress } from './ui/progress';

interface DashboardProps {
  vaccinations: VaccinationRecord[];
  profile: UserProfile | null;
  countryHistory: CountryPeriod[];
  documents: UploadedDocument[];
  onNavigate: (page: 'dashboard' | 'profile' | 'countries' | 'upload' | 'timeline' | 'compliance' | 'share' | 'alerts') => void;
}

const US_VACCINE_REQUIREMENTS = [
  { name: 'MMR (Measles, Mumps, Rubella)', requiredDoses: 2 },
  { name: 'Hepatitis B', requiredDoses: 3 },
  { name: 'Varicella (Chickenpox)', requiredDoses: 2 },
  { name: 'Tdap (Tetanus, Diphtheria, Pertussis)', requiredDoses: 1 },
  { name: 'Meningococcal (MenACWY)', requiredDoses: 1 },
  { name: 'COVID-19', requiredDoses: 2 },
  { name: 'Polio (IPV)', requiredDoses: 4 },
  { name: 'Hepatitis A', requiredDoses: 2 },
];

function calculateCompliance(vaccinations: VaccinationRecord[]) {
  let totalRequired = 0;
  let totalCompleted = 0;
  const missing: Array<{name: string, needed: number}> = [];

  US_VACCINE_REQUIREMENTS.forEach(req => {
    totalRequired += req.requiredDoses;
    const doses = vaccinations.filter(v => 
      v.vaccineName.toLowerCase().includes(req.name.toLowerCase().split('(')[0].trim().toLowerCase())
    ).length;
    
    totalCompleted += Math.min(doses, req.requiredDoses);
    
    if (doses < req.requiredDoses) {
      missing.push({
        name: req.name,
        needed: req.requiredDoses - doses,
      });
    }
  });

  const percentage = Math.round((totalCompleted / totalRequired) * 100);
  return { percentage, totalCompleted, totalRequired, missing };
}

export function Dashboard({ vaccinations, profile, countryHistory, documents, onNavigate }: DashboardProps) {
  const verifiedCount = vaccinations.filter(v => v.verified).length;
  const unverifiedCount = vaccinations.length - verifiedCount;
  const compliance = calculateCompliance(vaccinations);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-[#1051a5] via-[#0d4290] to-[#22283a] rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#97bf2d] rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#26844f] rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="relative">
          <h1 className="text-3xl font-bold mb-2">Welcome back{profile ? `, ${profile.fullName}` : ''}!</h1>
          <p className="text-white/70 text-lg">
            {profile?.targetCountry ? `Tracking your vaccination compliance for ${profile.targetCountry}` : 'Manage your vaccination records from around the world'}
          </p>
        </div>
      </div>

      {profile?.targetCountry === 'United States' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#1051a5] to-[#26844f] p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">U.S. College Vaccination Compliance</h2>
                <p className="text-white/80 text-sm">Required for undergraduate admission</p>
              </div>
            </div>
            
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Progress</span>
                <span className="text-2xl font-bold">{compliance.percentage}%</span>
              </div>
              <Progress value={compliance.percentage} className="h-3 bg-white/30" />
              <p className="text-white/80 text-sm mt-2">
                {compliance.totalCompleted} of {compliance.totalRequired} required doses completed
              </p>
            </div>
          </div>

          {compliance.missing.length > 0 && (
            <div className="p-6">
              <h3 className="text-[#22283a] font-semibold mb-3">Still Needed:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {compliance.missing.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 text-sm">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-amber-800">{item.name}: <strong>{item.needed} dose{item.needed > 1 ? 's' : ''}</strong></span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { id: 'timeline' as const, icon: Syringe, value: vaccinations.length, label: 'Total Vaccines', color: '#1051a5', sub: `${verifiedCount} verified, ${unverifiedCount} pending` },
          { id: 'countries' as const, icon: Globe, value: countryHistory.length, label: 'Countries', color: '#26844f', sub: 'Residence history' },
          { id: 'upload' as const, icon: FileText, value: documents.length, label: 'Documents', color: '#97bf2d', sub: 'Uploaded files' },
          { id: 'profile' as const, icon: User, value: profile ? '100%' : '0%', label: 'Profile', color: '#1051a5', sub: profile ? 'Complete' : 'Incomplete' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.id}
              onClick={() => onNavigate(stat.id)}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg border border-gray-100 p-6 text-left transition-all hover:-translate-y-0.5 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}12` }}>
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
              <div className="text-3xl font-bold text-[#22283a] mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-gray-600">{stat.label}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.sub}</div>
            </button>
          );
        })}
      </div>

      {!profile && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-amber-900 font-bold text-lg mb-1">Complete Your Profile</h3>
              <p className="text-amber-700 mb-4 text-sm">
                Add your personal information and country history to get personalized vaccine tracking and compliance recommendations.
              </p>
              <button
                onClick={() => onNavigate('profile')}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-md text-sm"
              >
                Set Up Profile
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-[#22283a] mb-5">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('upload')}
            className="flex items-center gap-4 bg-gradient-to-r from-[#1051a5] to-[#0d4290] text-white p-5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-bold">Upload Document</div>
              <div className="text-white/70 text-xs">Add vaccine records</div>
            </div>
          </button>
          <button
            onClick={() => onNavigate('compliance')}
            className="flex items-center gap-4 bg-gradient-to-r from-[#26844f] to-[#1e6a3f] text-white p-5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-bold">Check Compliance</div>
              <div className="text-white/70 text-xs">Verify requirements</div>
            </div>
          </button>
          <button
            onClick={() => onNavigate('share')}
            className="flex items-center gap-4 bg-gradient-to-r from-[#97bf2d] to-[#7a9924] text-white p-5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-bold">Share Records</div>
              <div className="text-white/70 text-xs">Export & share</div>
            </div>
          </button>
        </div>
      </div>

      {vaccinations.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-[#22283a]">Recent Vaccinations</h2>
            {vaccinations.length > 5 && (
              <button
                onClick={() => onNavigate('timeline')}
                className="text-[#1051a5] hover:text-[#0d4185] text-sm font-medium flex items-center gap-1"
              >
                View all ({vaccinations.length})
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="space-y-3">
            {vaccinations.slice(0, 5).map(vax => (
              <div key={vax.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1051a5]/10 flex items-center justify-center shrink-0">
                    <Syringe className="w-5 h-5 text-[#1051a5]" />
                  </div>
                  <div>
                    <p className="text-[#22283a] font-medium">{vax.vaccineName}</p>
                    <p className="text-gray-500 text-sm">{vax.location} · {new Date(vax.date).toLocaleDateString()}</p>
                  </div>
                </div>
                {vax.verified ? (
                  <div className="flex items-center gap-1.5 text-[#26844f] bg-green-50 px-3 py-1 rounded-full text-xs font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verified
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Pending
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
