import { User, Globe, Upload, Clock, Share2, Bell, LayoutDashboard, LogOut, Target } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useI18n } from '@/lib/i18n';
import { LanguageSelector } from '@/components/LanguageSelector';
import { DozeyLogo } from '@/components/DozeyLogo';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: 'dashboard' | 'profile' | 'countries' | 'upload' | 'timeline' | 'compliance' | 'share' | 'alerts') => void;
  userName?: string;
}

export function Navigation({ currentPage, onNavigate, userName }: NavigationProps) {
  const { signOut } = useAuth();
  const { t } = useI18n();

  const navItems = [
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { id: 'profile', label: t('navProfile'), icon: User },
    { id: 'countries', label: t('navCountries'), icon: Globe },
    { id: 'upload', label: t('navDocuments'), icon: Upload },
    { id: 'timeline', label: t('navTimeline'), icon: Clock },
    { id: 'compliance', label: t('navCompliance'), icon: Target },
    { id: 'share', label: t('navShare'), icon: Share2 },
    { id: 'alerts', label: t('navAlerts'), icon: Bell },
  ] as const;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <nav className="bg-white border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <DozeyLogo className="h-16" />

          <div className="flex items-center gap-3">
            <LanguageSelector />
            {userName && (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#4a7fb5] text-white flex items-center justify-center text-xs font-medium">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-[#1d1d1f] hidden sm:inline">{userName}</span>
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#86868b] hover:text-red-500 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{t('signOut')}</span>
            </button>
          </div>
        </div>
        
        <div className="flex overflow-x-auto gap-1 pb-3 -mx-4 px-4 scrollbar-hide">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm ${
                  isActive
                    ? 'bg-[#4a7fb5] text-white font-medium'
                    : 'text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f] font-medium'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
