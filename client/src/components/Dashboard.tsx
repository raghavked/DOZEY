import { VaccinationRecord, UserProfile, CountryPeriod, UploadedDocument } from '@/types';
import { User, Globe, FileText, Syringe, AlertCircle, CheckCircle, Target, ArrowRight, Upload, Shield, Share2, Bell, Sparkles, Loader2 } from 'lucide-react';
import { Progress } from './ui/progress';
import { generateDashboardInsights } from '@/lib/document-suggestions';
import { useI18n } from '@/lib/i18n';
import type { ComplianceSummary } from '@/hooks/use-api';

interface DashboardProps {
  vaccinations: VaccinationRecord[];
  profile: UserProfile | null;
  countryHistory: CountryPeriod[];
  documents: UploadedDocument[];
  onNavigate: (page: 'dashboard' | 'profile' | 'countries' | 'upload' | 'timeline' | 'compliance' | 'share' | 'alerts') => void;
  complianceSummary?: ComplianceSummary | null;
}

export function Dashboard({ vaccinations, profile, countryHistory, documents, onNavigate, complianceSummary }: DashboardProps) {
  const { t } = useI18n();
  const verifiedCount = vaccinations.filter(v => v.verified).length;
  const unverifiedCount = vaccinations.length - verifiedCount;
  const insights = generateDashboardInsights(documents, vaccinations, profile, countryHistory);

  const processedDocs = documents.filter(d => d.processingStatus === 'completed').length;

  const lookupTypeLabels: Record<string, string> = {
    institution: 'Institution Compliance',
    employer: 'Employer Compliance',
    country: 'Country/Visa Compliance',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-[#1d1d1f] mb-1">
          {`${t('welcomeBack')}${profile ? `, ${profile.fullName}` : ''}`}
        </h1>
        <p className="text-[#86868b]">
          {profile?.targetCountry ? `${t('trackingCompliance')} ${profile.targetCountry}` : t('manageRecords')}
        </p>
      </div>

      {insights.length > 0 && (
        <div className="bg-[#8aab45]/10 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-[#4d9068]" />
            <h2 className="font-semibold text-[#4d9068]">{t('smartSuggestions')}</h2>
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
                    {t('apply')}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { id: 'timeline' as const, icon: Syringe, value: vaccinations.length, label: t('vaccines'), sub: `${verifiedCount} ${t('verified')}` },
          { id: 'countries' as const, icon: Globe, value: countryHistory.length, label: t('countries'), sub: t('residenceHistorySub') },
          { id: 'upload' as const, icon: FileText, value: documents.length, label: t('documents'), sub: processedDocs > 0 ? `${processedDocs} processed` : t('uploadedFiles') },
          { id: 'profile' as const, icon: User, value: profile ? '100%' : '0%', label: t('profile'), sub: profile ? t('complete') : t('incomplete') },
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
          {complianceSummary?.hasTarget && !complianceSummary.aiUnavailable && complianceSummary.percentage !== undefined && (
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-[#f5f5f7] rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-[#86868b]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold text-[#1d1d1f] truncate">
                      {lookupTypeLabels[complianceSummary.lookupType || 'institution']}
                    </h2>
                    <p className="text-[#86868b] text-xs truncate">{complianceSummary.targetLabel}</p>
                  </div>
                  <div className="ml-auto text-3xl font-semibold text-[#4a7fb5]">{complianceSummary.percentage}%</div>
                </div>

                <Progress value={complianceSummary.percentage} className="h-2 bg-[#f5f5f7]" />
                <p className="text-[#86868b] text-xs mt-2">
                  {complianceSummary.totalCompleted} of {complianceSummary.totalRequired} {t('dosesCompleted')}
                </p>
              </div>

              {complianceSummary.missing && complianceSummary.missing.length > 0 && (
                <div className="px-6 pb-6 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {complianceSummary.missing.map((item, idx) => (
                      <div key={idx} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                        item.status === 'partial' ? 'bg-amber-50' : 'bg-red-50'
                      }`}>
                        <AlertCircle className={`w-3.5 h-3.5 shrink-0 ${
                          item.status === 'partial' ? 'text-amber-500' : 'text-red-400'
                        }`} />
                        <span className={item.status === 'partial' ? 'text-amber-800' : 'text-red-700'}>
                          {item.name}: <strong>{item.needed} dose{item.needed > 1 ? 's' : ''} needed</strong>
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => onNavigate('compliance')}
                    className="mt-4 text-[#4a7fb5] hover:text-[#3a6a9a] text-sm font-medium flex items-center gap-1"
                  >
                    View full compliance report
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {complianceSummary.percentage === 100 && (
                <div className="px-6 pb-6 pt-2">
                  <div className="flex items-center gap-2 bg-[#4d9068]/10 rounded-lg px-4 py-3">
                    <CheckCircle className="w-4 h-4 text-[#4d9068]" />
                    <span className="text-sm text-[#4d9068] font-medium">All requirements met for {complianceSummary.targetLabel}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {complianceSummary?.hasTarget && complianceSummary.aiUnavailable && (
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f5f5f7] rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#86868b]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[#1d1d1f]">Compliance Check</h2>
                  <p className="text-[#86868b] text-xs">Target: {complianceSummary.targetLabel}</p>
                </div>
              </div>
              <p className="text-sm text-[#86868b] mt-4">
                Compliance data is being prepared. Visit the compliance page to run a full check.
              </p>
              <button
                onClick={() => onNavigate('compliance')}
                className="mt-3 text-[#4a7fb5] hover:text-[#3a6a9a] text-sm font-medium flex items-center gap-1"
              >
                Check Compliance
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {!complianceSummary?.hasTarget && (
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#f5f5f7] rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#86868b]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[#1d1d1f]">Compliance Tracking</h2>
                  <p className="text-[#86868b] text-xs">Set a target to track your progress</p>
                </div>
              </div>
              <p className="text-sm text-[#86868b] mb-4">
                Add a target country, institution, or employer in your profile to see your compliance progress here.
              </p>
              <button
                onClick={() => onNavigate('profile')}
                className="inline-flex items-center gap-2 bg-[#4a7fb5] hover:bg-[#3d6d9e] text-white px-5 py-2.5 rounded-full font-medium transition-colors text-sm"
              >
                Set Up Target
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {!profile && (
            <div className="bg-amber-50 rounded-2xl p-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-amber-900 font-semibold mb-1">{t('completeProfileAlert')}</h3>
                  <p className="text-amber-700/70 text-sm mb-4">
                    {t('personalizeCompliance')}
                  </p>
                  <button
                    onClick={() => onNavigate('profile')}
                    className="inline-flex items-center gap-2 bg-[#4a7fb5] hover:bg-[#3d6d9e] text-white px-5 py-2.5 rounded-full font-medium transition-colors text-sm"
                  >
                    {t('setUpProfile')}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#1d1d1f] mb-3 text-center">{t('quickActions')}</h2>
          <div className="flex flex-row flex-wrap justify-center gap-3">
            {[
              { id: 'upload' as const, icon: Upload, title: t('uploadNewDocument') },
              { id: 'compliance' as const, icon: Shield, title: t('checkCompliance') },
              { id: 'share' as const, icon: Share2, title: t('shareRecords') },
              { id: 'alerts' as const, icon: Bell, title: t('viewAlerts') },
              { id: 'countries' as const, icon: Globe, title: t('countryHistory') },
            ].map(({ id, icon: Icon, title }) => (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className="flex items-center gap-2 bg-[#f5f5f7] hover:bg-[#e8e8ed] px-4 py-2.5 rounded-full transition-all group"
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
            <h2 className="text-lg font-semibold text-[#1d1d1f]">{t('recentVaccinations')}</h2>
            {vaccinations.length > 6 && (
              <button
                onClick={() => onNavigate('timeline')}
                className="text-[#4a7fb5] hover:text-[#3d6d9e] text-sm font-medium flex items-center gap-1"
              >
                {t('viewAll')} ({vaccinations.length})
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
                    {t('verifiedRecords')}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[#86868b] bg-[#f5f5f7] px-3 py-1 rounded-full text-xs font-medium">
                    <AlertCircle className="w-3 h-3" />
                    {t('pendingVerification')}
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
