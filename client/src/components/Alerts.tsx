import { VaccinationRecord, UserProfile, CountryPeriod } from '@/types';
import { Bell, AlertCircle, CheckCircle, Info, Calendar } from 'lucide-react';

interface AlertsProps {
  vaccinations: VaccinationRecord[];
  countryHistory: CountryPeriod[];
  profile: UserProfile | null;
}

export function Alerts({ vaccinations, countryHistory, profile }: AlertsProps) {
  const generateAlerts = () => {
    const alerts: Array<{
      type: 'warning' | 'info' | 'success';
      title: string;
      message: string;
      icon: any;
    }> = [];

    const unverifiedCount = vaccinations.filter(v => !v.verified).length;
    if (unverifiedCount > 0) {
      alerts.push({
        type: 'warning',
        title: `${unverifiedCount} Unverified Vaccination${unverifiedCount !== 1 ? 's' : ''}`,
        message: 'These records are pending verification by a healthcare provider. Consider uploading official documents or contacting your previous clinics.',
        icon: AlertCircle,
      });
    }

    if (!profile) {
      alerts.push({
        type: 'warning',
        title: 'Complete Your Profile',
        message: 'Add your personal information to help doctors understand your vaccination history and needs.',
        icon: AlertCircle,
      });
    }

    const hasMMR = vaccinations.some(v => 
      v.vaccineName.toLowerCase().includes('mmr') || 
      v.vaccineName.toLowerCase().includes('measles')
    );
    if (!hasMMR && profile) {
      alerts.push({
        type: 'info',
        title: 'MMR Vaccine Recommendation',
        message: 'Most countries require proof of MMR (Measles, Mumps, Rubella) vaccination for school and university enrollment.',
        icon: Info,
      });
    }

    const hasTetanus = vaccinations.some(v => 
      v.vaccineName.toLowerCase().includes('tetanus') || 
      v.vaccineName.toLowerCase().includes('tdap')
    );
    if (hasTetanus) {
      const latestTetanus = vaccinations
        .filter(v => v.vaccineName.toLowerCase().includes('tetanus') || v.vaccineName.toLowerCase().includes('tdap'))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      
      const vaccineDate = new Date(latestTetanus.date);
      const tenYearsLater = new Date(vaccineDate);
      tenYearsLater.setFullYear(tenYearsLater.getFullYear() + 10);
      
      const today = new Date();
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
      
      if (tenYearsLater < sixMonthsFromNow) {
        alerts.push({
          type: 'warning',
          title: 'Tetanus Booster Due Soon',
          message: `Your last tetanus shot was on ${vaccineDate.toLocaleDateString()}. Boosters are recommended every 10 years.`,
          icon: Calendar,
        });
      }
    }

    const livedInTropicalCountry = countryHistory.some(p => 
      ['Brazil', 'India', 'Thailand', 'Kenya', 'Nigeria', 'Indonesia'].includes(p.country)
    );
    if (livedInTropicalCountry) {
      const hasYellowFever = vaccinations.some(v => 
        v.vaccineName.toLowerCase().includes('yellow fever')
      );
      if (!hasYellowFever) {
        alerts.push({
          type: 'info',
          title: 'Yellow Fever Vaccination',
          message: 'You lived in a tropical region. Some countries require yellow fever vaccination proof for entry.',
          icon: Info,
        });
      }
    }

    if (profile && profile.currentCountry !== profile.countryOfOrigin) {
      alerts.push({
        type: 'info',
        title: 'International Student/Immigrant',
        message: 'Many universities and employers require complete vaccination records. Make sure to keep your documents updated.',
        icon: Info,
      });
    }

    if (profile?.targetCountry === 'United States') {
      const hasMeningococcal = vaccinations.some(v => 
        v.vaccineName.toLowerCase().includes('meningococcal') || 
        v.vaccineName.toLowerCase().includes('menacwy')
      );
      if (!hasMeningococcal) {
        alerts.push({
          type: 'warning',
          title: 'Meningococcal Vaccine Required',
          message: 'U.S. colleges require the Meningococcal (MenACWY) vaccine for all students, especially those living in dormitories.',
          icon: AlertCircle,
        });
      }

      const polioCount = vaccinations.filter(v => v.vaccineName.toLowerCase().includes('polio')).length;
      if (polioCount < 4) {
        alerts.push({
          type: 'warning',
          title: 'Polio Series Incomplete',
          message: `You have ${polioCount} of 4 required Polio (IPV) doses. Complete the series before starting college in the U.S.`,
          icon: AlertCircle,
        });
      }

      const hepACount = vaccinations.filter(v => v.vaccineName.toLowerCase().includes('hepatitis a')).length;
      if (hepACount < 2) {
        alerts.push({
          type: 'warning',
          title: 'Hepatitis A Series Incomplete',
          message: `You have ${hepACount} of 2 required Hepatitis A doses. The second dose should be given 6-12 months after the first.`,
          icon: AlertCircle,
        });
      }
    }

    if (vaccinations.length >= 5 && vaccinations.filter(v => v.verified).length === vaccinations.length) {
      alerts.push({
        type: 'success',
        title: 'Records Complete!',
        message: 'All your vaccination records are verified and up to date. Great job!',
        icon: CheckCircle,
      });
    }

    return alerts;
  };

  const alerts = generateAlerts();

  return (
    <div>
      <div className="bg-white rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-8 h-8 text-[#1d1d1f]/30" />
          <div>
            <h1 className="text-[#1d1d1f] font-semibold">Alerts & Recommendations</h1>
            <p className="text-[#86868b]">Important notifications about your vaccination records</p>
          </div>
        </div>

        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-[#1d1d1f] font-semibold mb-2">All Clear!</h3>
            <p className="text-[#86868b]">
              No alerts at this time. Your records look good.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {alerts.map((alert, index) => {
              const Icon = alert.icon;
              const colorClasses = {
                warning: 'bg-yellow-50 border-yellow-400 text-yellow-900',
                info: 'bg-blue-50 border-blue-400 text-blue-900',
                success: 'bg-green-50 border-green-400 text-green-900',
              };
              const iconColors = {
                warning: 'text-yellow-600',
                info: 'text-blue-600',
                success: 'text-green-600',
              };

              return (
                <div
                  key={index}
                  className={`border-l-4 p-6 rounded-xl ${colorClasses[alert.type]}`}
                >
                  <div className="flex gap-3">
                    <Icon className={`w-6 h-6 flex-shrink-0 ${iconColors[alert.type]}`} />
                    <div>
                      <h3 className="font-semibold mb-2">{alert.title}</h3>
                      <p className="text-sm opacity-90">{alert.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-black/5">
          <h2 className="text-sm font-semibold text-[#1d1d1f] mb-4">Common Vaccination Requirements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-[#f5f5f7] p-4 rounded-2xl">
              <h4 className="text-sm font-semibold text-[#1d1d1f] mb-2">University Students</h4>
              <ul className="text-[#86868b] text-sm space-y-1">
                <li>• MMR (Measles, Mumps, Rubella)</li>
                <li>• Meningococcal (Meningitis)</li>
                <li>• Hepatitis B</li>
                <li>• Tdap (Tetanus, Diphtheria, Pertussis)</li>
              </ul>
            </div>

            <div className="bg-[#f5f5f7] p-4 rounded-2xl">
              <h4 className="text-sm font-semibold text-[#1d1d1f] mb-2">Immigration/Work Visa</h4>
              <ul className="text-[#86868b] text-sm space-y-1">
                <li>• Varies by country</li>
                <li>• Usually includes MMR, Varicella</li>
                <li>• TB test often required</li>
                <li>• Check embassy requirements</li>
              </ul>
            </div>

            <div className="bg-[#f5f5f7] p-4 rounded-2xl">
              <h4 className="text-sm font-semibold text-[#1d1d1f] mb-2">International Travel</h4>
              <ul className="text-[#86868b] text-sm space-y-1">
                <li>• Yellow Fever (Africa, South America)</li>
                <li>• Typhoid</li>
                <li>• Hepatitis A</li>
                <li>• Country-specific requirements</li>
              </ul>
            </div>

            <div className="bg-[#f5f5f7] p-4 rounded-2xl">
              <h4 className="text-sm font-semibold text-[#1d1d1f] mb-2">Healthcare Workers</h4>
              <ul className="text-[#86868b] text-sm space-y-1">
                <li>• Hepatitis B</li>
                <li>• Annual Flu vaccine</li>
                <li>• MMR</li>
                <li>• Varicella (Chickenpox)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
