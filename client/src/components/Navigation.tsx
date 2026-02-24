import { User, Globe, Upload, Clock, Share2, Bell, LayoutDashboard, LogOut, Target } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { LanguageSelector } from '@/components/LanguageSelector';
import { DozeyLogo } from '@/components/DozeyLogo';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: 'dashboard' | 'profile' | 'countries' | 'upload' | 'timeline' | 'compliance' | 'share' | 'alerts') => void;
  userName?: string;
}

export function Navigation({ currentPage, onNavigate, userName }: NavigationProps) {
  const { signOut } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'countries', label: 'Countries', icon: Globe },
    { id: 'upload', label: 'Documents', icon: Upload },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'compliance', label: 'Compliance', icon: Target },
    { id: 'share', label: 'Share', icon: Share2 },
    { id: 'alerts', label: 'Alerts', icon: Bell },
  ] as const;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-2xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <DozeyLogo className="h-9" />

          <div className="flex items-center gap-3">
            <LanguageSelector />
            {userName && (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#22283a] text-white flex items-center justify-center text-xs font-medium">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-[#22283a] hidden sm:inline">{userName}</span>
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-300 hover:text-red-500 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
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
                    ? 'bg-[#22283a] text-white font-medium'
                    : 'text-gray-400 hover:bg-gray-50 hover:text-[#22283a] font-medium'
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
