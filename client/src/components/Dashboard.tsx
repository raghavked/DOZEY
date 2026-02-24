import { VaccinationRecord, UserProfile, CountryPeriod, UploadedDocument } from '@/types';
import { User, Globe, FileText, Syringe, AlertCircle, CheckCircle, Target, ArrowRight, Upload, Shield, Share2, Bell, Sparkles } from 'lucide-react';
import { Progress } from './ui/progress';
import { generateDashboardInsights } from '@/lib/document-suggestions';

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
  const insights = generateDashboardInsights(documents, vaccinations, profile, countryHistory);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-[#1d1d1f] mb-1">
          Welcome back{profile ? `, ${profile.fullName}` : ''}
        </h1>
        <p className="text-[#86868b]">
          {profile?.targetCountry ? `Tracking compliance for ${profile.targetCountry}` : 'Manage your vaccination records'}
        </p>
      </div>

      {insights.length > 0 && (
        <div className="bg-[#8aab45]/10 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-[#4d9068]" />
            <h2 className="font-semibold text-[#4d9068]">Smart Suggestions</h2>
          </div>
          <div className="space-y-2">
            {insights.map((insight, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1d1d1f]">{insight.message}</p>
                </div>
                {insight.action && insight.navigateTo && (
                  <button
                    onClick={() => onNavigate(insight.navigateTo!)}
                    className="text-xs bg-[#4d9068] text-white px-4 py-2 rounded-full hover:bg-[#3f7a56] transition-colors whitespace-nowrap"
                  >
                    {insight.action}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { id: 'timeline' as const, icon: Syringe, value: vaccinations.length, label: 'Vaccines', sub: `${verifiedCount} verified` },
          { id: 'countries' as const, icon: Globe, value: countryHistory.length, label: 'Countries', sub: 'Residence history' },
          { id: 'upload' as const, icon: FileText, value: documents.length, label: 'Documents', sub: 'Uploaded files' },
          { id: 'profile' as const, icon: User, value: profile ? '100%' : '0%', label: 'Profile', sub: profile ? 'Complete' : 'Incomplete' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.id}
              onClick={() => onNavigate(stat.id)}
              className="bg-white rounded-2xl p-6 text-left transition-all hover:shadow-sm group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#f5f5f7]">
                  <Icon className="w-5 h-5 text-[#86868b]" />
                </div>
                <ArrowRight className="w-4 h-4 text-[#1d1d1f]/10 group-hover:text-[#86868b] transition-colors" />
              </div>
              <div className="text-3xl font-semibold text-[#1d1d1f] mb-0.5">{stat.value}</div>
              <div className="text-sm font-medium text-[#1d1d1f]">{stat.label}</div>
              <div className="text-xs text-[#86868b] mt-1">{stat.sub}</div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {profile?.targetCountry === 'United States' && (
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-[#f5f5f7] rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-[#86868b]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[#1d1d1f]">U.S. College Compliance</h2>
                    <p className="text-[#86868b] text-xs">Required for undergraduate admission</p>
                  </div>
                  <div className="ml-auto text-3xl font-semibold text-[#4a7fb5]">{compliance.percentage}%</div>
                </div>
                
                <Progress value={compliance.percentage} className="h-2 bg-[#f5f5f7]" />
                <p className="text-[#86868b] text-xs mt-2">
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
            <div className="bg-amber-50 rounded-2xl p-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-amber-900 font-semibold mb-1">Complete Your Profile</h3>
                  <p className="text-amber-700/70 text-sm mb-4">
                    Add your personal information to get personalized vaccine tracking and compliance recommendations.
                  </p>
                  <button
                    onClick={() => onNavigate('profile')}
                    className="inline-flex items-center gap-2 bg-[#4a7fb5] hover:bg-[#3d6d9e] text-white px-5 py-2.5 rounded-full font-medium transition-colors text-sm"
                  >
                    Set Up Profile
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#1d1d1f] mb-3">Quick Actions</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'upload' as const, icon: Upload, title: 'Upload Document' },
              { id: 'compliance' as const, icon: Shield, title: 'Check Compliance' },
              { id: 'share' as const, icon: Share2, title: 'Share Records' },
              { id: 'alerts' as const, icon: Bell, title: 'View Alerts' },
              { id: 'countries' as const, icon: Globe, title: 'Country History' },
            ].map(({ id, icon: Icon, title }) => (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className="flex items-center gap-2 bg-[#f5f5f7] hover:bg-[#e8e8ed] px-4 py-2.5 rounded-full transition-all group text-left"
              >
                <Icon className="w-4 h-4 text-[#86868b]" />
                <span className="font-medium text-[#1d1d1f] text-sm">{title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {vaccinations.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#1d1d1f]">Recent Vaccinations</h2>
            {vaccinations.length > 6 && (
              <button
                onClick={() => onNavigate('timeline')}
                className="text-[#4a7fb5] hover:text-[#3d6d9e] text-sm font-medium flex items-center gap-1"
              >
                View all ({vaccinations.length})
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {vaccinations.slice(0, 6).map(vax => (
              <div key={vax.id} className="flex items-center justify-between p-4 bg-white rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#f5f5f7] flex items-center justify-center shrink-0">
                    <Syringe className="w-4 h-4 text-[#86868b]" />
                  </div>
                  <div>
                    <p className="text-[#1d1d1f] font-medium text-sm">{vax.vaccineName}</p>
                    <p className="text-[#86868b] text-xs">{vax.location} · {(() => { const [y,m,d] = vax.date.split('-').map(Number); return new Date(y, m-1, d).toLocaleDateString(); })()}</p>
                  </div>
                </div>
                {vax.verified ? (
                  <div className="flex items-center gap-1.5 text-[#4d9068] bg-[#4d9068]/10 px-3 py-1 rounded-full text-xs font-medium">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[#86868b] bg-[#f5f5f7] px-3 py-1 rounded-full text-xs font-medium">
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
