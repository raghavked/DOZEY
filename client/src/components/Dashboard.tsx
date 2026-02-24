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
      <div>
        <h1 className="text-3xl font-extrabold text-[#22283a] mb-1">
          Welcome back{profile ? `, ${profile.fullName}` : ''}
        </h1>
        <p className="text-gray-400">
          {profile?.targetCountry ? `Tracking compliance for ${profile.targetCountry}` : 'Manage your vaccination records'}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { id: 'timeline' as const, icon: Syringe, value: vaccinations.length, label: 'Vaccines', color: '#1051a5', sub: `${verifiedCount} verified` },
          { id: 'countries' as const, icon: Globe, value: countryHistory.length, label: 'Countries', color: '#26844f', sub: 'Residence history' },
          { id: 'upload' as const, icon: FileText, value: documents.length, label: 'Documents', color: '#22283a', sub: 'Uploaded files' },
          { id: 'profile' as const, icon: User, value: profile ? '100%' : '0%', label: 'Profile', color: '#1051a5', sub: profile ? 'Complete' : 'Incomplete' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.id}
              onClick={() => onNavigate(stat.id)}
              className="bg-white rounded-2xl border border-gray-100 p-6 text-left transition-all hover:shadow-md hover:-translate-y-0.5 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}08` }}>
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <ArrowRight className="w-4 h-4 text-gray-200 group-hover:text-gray-400 transition-colors" />
              </div>
              <div className="text-3xl font-extrabold text-[#22283a] mb-0.5">{stat.value}</div>
              <div className="text-sm font-medium text-gray-500">{stat.label}</div>
              <div className="text-xs text-gray-300 mt-1">{stat.sub}</div>
            </button>
          );
        })}
      </div>

      {profile?.targetCountry === 'United States' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-[#1051a5]/8 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-[#1051a5]" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[#22283a]">U.S. College Compliance</h2>
                <p className="text-gray-400 text-xs">Required for undergraduate admission</p>
              </div>
              <div className="ml-auto text-3xl font-extrabold text-[#1051a5]">{compliance.percentage}%</div>
            </div>
            
            <Progress value={compliance.percentage} className="h-2 bg-gray-100" />
            <p className="text-gray-400 text-xs mt-2">
              {compliance.totalCompleted} of {compliance.totalRequired} required doses completed
            </p>
          </div>

          {compliance.missing.length > 0 && (
            <div className="px-6 pb-6 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {compliance.missing.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-amber-50 rounded-lg px-3 py-2 text-xs">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="text-amber-800">{item.name}: <strong>{item.needed} dose{item.needed > 1 ? 's' : ''}</strong></span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!profile && (
        <div className="bg-amber-50 border border-amber-200/50 rounded-2xl p-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-amber-900 font-bold mb-1">Complete Your Profile</h3>
              <p className="text-amber-700/70 text-sm mb-4">
                Add your personal information to get personalized vaccine tracking and compliance recommendations.
              </p>
              <button
                onClick={() => onNavigate('profile')}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-full font-medium transition-colors text-sm"
              >
                Set Up Profile
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-extrabold text-[#22283a] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { id: 'upload' as const, icon: Upload, title: 'Upload Document', sub: 'Add vaccine records', color: '#1051a5' },
            { id: 'compliance' as const, icon: Shield, title: 'Check Compliance', sub: 'Verify requirements', color: '#26844f' },
            { id: 'share' as const, icon: Share2, title: 'Share Records', sub: 'Export & share', color: '#22283a' },
          ].map(({ id, icon: Icon, title, sub, color }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="flex items-center gap-4 bg-white border border-gray-100 hover:border-gray-200 p-5 rounded-2xl transition-all hover:shadow-sm group text-left"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}08` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <div className="font-bold text-[#22283a] text-sm">{title}</div>
                <div className="text-gray-400 text-xs">{sub}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-200 group-hover:text-gray-400 ml-auto transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {vaccinations.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-[#22283a]">Recent Vaccinations</h2>
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
          <div className="space-y-2">
            {vaccinations.slice(0, 5).map(vax => (
              <div key={vax.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    <Syringe className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[#22283a] font-medium text-sm">{vax.vaccineName}</p>
                    <p className="text-gray-400 text-xs">{vax.location} · {new Date(vax.date).toLocaleDateString()}</p>
                  </div>
                </div>
                {vax.verified ? (
                  <div className="flex items-center gap-1.5 text-[#26844f] bg-green-50 px-3 py-1 rounded-full text-xs font-medium">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs font-medium">
                    <AlertCircle className="w-3 h-3" />
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
