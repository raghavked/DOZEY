import { User, Globe, Upload, Clock, Share2, Bell, LayoutDashboard, LogOut } from 'lucide-react';
import logo from '@/assets/db39f476989fbee8be9ff6750587bd1f003c65d8.png';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: 'dashboard' | 'profile' | 'countries' | 'upload' | 'timeline' | 'share' | 'alerts') => void;
  userName?: string;
  userImage?: string;
}

export function Navigation({ currentPage, onNavigate, userName, userImage }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'countries', label: 'Country History', icon: Globe },
    { id: 'upload', label: 'Upload Documents', icon: Upload },
    { id: 'timeline', label: 'Vaccine Timeline', icon: Clock },
    { id: 'share', label: 'Share', icon: Share2 },
    { id: 'alerts', label: 'Alerts', icon: Bell },
  ] as const;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="DOZEY Logo" className="h-12" />
            <div>
              <h1 className="text-[#1051a5]">DOZEY</h1>
              <p className="text-[#22283a] text-sm">Healthcare that moves with you!</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {userName && (
              <div className="flex items-center gap-2">
                {userImage ? (
                  <img src={userImage} alt={userName} className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#1051a5] text-white flex items-center justify-center text-sm font-medium">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm text-[#22283a] hidden sm:inline">{userName}</span>
              </div>
            )}
            <a
              href="/api/logout"
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </a>
          </div>
        </div>
        
        <div className="flex overflow-x-auto gap-1 pb-2 -mx-4 px-4">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#1051a5] text-white'
                    : 'text-[#22283a] hover:bg-[#97bf2d] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
