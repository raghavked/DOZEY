import { VaccinationRecord, UserProfile, CountryPeriod, UploadedDocument } from '@/types';
import { User, Globe, FileText, Syringe, AlertCircle, CheckCircle, Target } from 'lucide-react';
import { Progress } from './ui/progress';

interface DashboardProps {
  vaccinations: VaccinationRecord[];
  profile: UserProfile | null;
  countryHistory: CountryPeriod[];
  documents: UploadedDocument[];
  onNavigate: (page: 'dashboard' | 'profile' | 'countries' | 'upload' | 'timeline' | 'compliance' | 'share' | 'alerts') => void;
}

// U.S. Undergrad Vaccination Requirements
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
    // Count doses for this vaccine (match by name prefix)
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
    <div className="space-y-6">
      <div>
        <h1 className="text-[#22283a] mb-2">Welcome back{profile ? `, ${profile.fullName}` : ''}!</h1>
        <p className="text-[#6b7280]">
          {profile?.targetCountry ? `Tracking your vaccination compliance for ${profile.targetCountry}` : 'Manage your vaccination records from around the world'}
        </p>
      </div>

      {/* U.S. Compliance Progress */}
      {profile?.targetCountry === 'United States' && (
        <div className="bg-gradient-to-br from-[#1051a5] to-[#26844f] rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-8 h-8" />
            <div>
              <h2 className="text-white">U.S. College Vaccination Compliance</h2>
              <p className="text-white/80 text-sm">Required for undergraduate admission</p>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">Progress</span>
              <span className="text-2xl">{compliance.percentage}%</span>
            </div>
            <Progress value={compliance.percentage} className="h-3 bg-white/30" />
            <p className="text-white/80 text-sm mt-2">
              {compliance.totalCompleted} of {compliance.totalRequired} required doses completed
            </p>
          </div>

          {compliance.missing.length > 0 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-white mb-2">Still Needed:</h3>
              <ul className="space-y-1">
                {compliance.missing.map((item, idx) => (
                  <li key={idx} className="text-white/80 text-sm">
                    • {item.name}: {item.needed} dose{item.needed > 1 ? 's' : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigate('timeline')}
          className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-[#1051a5]"
        >
          <div className="flex items-center justify-between mb-2">
            <Syringe className="w-8 h-8 text-[#1051a5]" />
            <span className="text-[#22283a]">{vaccinations.length}</span>
          </div>
          <p className="text-[#6b7280]">Total Vaccines</p>
          <div className="mt-2 flex gap-2 text-sm">
            <span className="text-[#26844f]">✓ {verifiedCount}</span>
            <span className="text-[#97bf2d]">⊘ {unverifiedCount}</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('countries')}
          className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-[#26844f]"
        >
          <div className="flex items-center justify-between mb-2">
            <Globe className="w-8 h-8 text-[#26844f]" />
            <span className="text-[#22283a]">{countryHistory.length}</span>
          </div>
          <p className="text-[#6b7280]">Countries Lived In</p>
        </div>

        <div 
          onClick={() => onNavigate('upload')}
          className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-[#97bf2d]"
        >
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-8 h-8 text-[#97bf2d]" />
            <span className="text-[#22283a]">{documents.length}</span>
          </div>
          <p className="text-[#6b7280]">Documents Uploaded</p>
        </div>

        <div 
          onClick={() => onNavigate('profile')}
          className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-[#1051a5]"
        >
          <div className="flex items-center justify-between mb-2">
            <User className="w-8 h-8 text-[#1051a5]" />
            {profile ? (
              <CheckCircle className="w-6 h-6 text-[#26844f]" />
            ) : (
              <AlertCircle className="w-6 h-6 text-[#97bf2d]" />
            )}
          </div>
          <p className="text-[#6b7280]">Profile {profile ? 'Complete' : 'Incomplete'}</p>
        </div>
      </div>

      {/* Getting Started */}
      {!profile && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <div className="flex gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
            <div>
              <h3 className="text-yellow-900 mb-2">Complete Your Profile</h3>
              <p className="text-yellow-700 mb-4">
                Add your personal information and country history to help us provide better vaccine tracking and recommendations.
              </p>
              <button
                onClick={() => onNavigate('profile')}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Set Up Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-[#22283a] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('upload')}
            className="bg-[#1051a5] hover:bg-[#0d4185] text-white py-4 rounded-lg transition-colors"
          >
            Upload Vaccine Document
          </button>
          <button
            onClick={() => onNavigate('compliance')}
            className="bg-[#26844f] hover:bg-[#1e6a3f] text-white py-4 rounded-lg transition-colors"
          >
            Check Compliance
          </button>
          <button
            onClick={() => onNavigate('share')}
            className="bg-[#97bf2d] hover:bg-[#7a9924] text-white py-4 rounded-lg transition-colors"
          >
            Share
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      {vaccinations.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-[#22283a] mb-4">Recent Vaccinations</h2>
          <div className="space-y-3">
            {vaccinations.slice(0, 5).map(vax => (
              <div key={vax.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-[#22283a]">{vax.vaccineName}</p>
                  <p className="text-[#6b7280] text-sm">{vax.location} • {new Date(vax.date).toLocaleDateString()}</p>
                </div>
                {vax.verified ? (
                  <CheckCircle className="w-5 h-5 text-[#26844f]" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-[#97bf2d]" />
                )}
              </div>
            ))}
          </div>
          {vaccinations.length > 5 && (
            <button
              onClick={() => onNavigate('timeline')}
              className="mt-4 text-[#1051a5] hover:text-[#0d4185]"
            >
              View all {vaccinations.length} vaccinations →
            </button>
          )}
        </div>
      )}
    </div>
  );
}