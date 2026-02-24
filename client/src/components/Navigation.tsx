import { User, Globe, Upload, Clock, Share2, Bell, LayoutDashboard, LogOut, Target, ChevronRight } from 'lucide-react';
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
    { id: 'countries', label: 'Country History', icon: Globe },
    { id: 'upload', label: 'Upload Documents', icon: Upload },
    { id: 'timeline', label: 'Vaccine Timeline', icon: Clock },
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
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <DozeyLogo className="h-10" />

          <div className="flex items-center gap-4">
            <LanguageSelector />
            {userName && (
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1051a5] to-[#26844f] text-white flex items-center justify-center text-sm font-bold shadow-md">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-[#22283a] hidden sm:inline">{userName}</span>
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all text-sm font-medium ${
                  isActive
                    ? 'bg-[#1051a5] text-white shadow-md shadow-[#1051a5]/25'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#22283a]'
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
