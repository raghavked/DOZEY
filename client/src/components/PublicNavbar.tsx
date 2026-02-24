import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { DozeyLogo } from '@/components/DozeyLogo';

const links = [
  { to: '/', label: 'Home' },
  { to: '/features', label: 'Features' },
  { to: '/progress', label: 'Progress' },
  { to: '/team', label: 'Team' },
  { to: '/contact', label: 'Contact' },
];

export function PublicNavbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHeroPage = ['/', '/features', '/progress', '/team', '/contact'].includes(location.pathname);
  const showTransparent = isHeroPage && !scrolled && !mobileOpen;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      showTransparent
        ? 'bg-transparent'
        : 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex-shrink-0">
            <DozeyLogo className="h-10" theme={showTransparent ? 'dark' : 'light'} />
          </Link>

          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  showTransparent
                    ? location.pathname === link.to
                      ? 'text-white'
                      : 'text-white/60 hover:text-white'
                    : location.pathname === link.to
                      ? 'text-[#1051a5]'
                      : 'text-gray-500 hover:text-[#22283a]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className={`hidden lg:inline-flex items-center px-6 py-2.5 rounded-full font-medium text-sm transition-all ${
                showTransparent
                  ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                  : 'bg-[#1051a5] text-white hover:bg-[#0d4185] shadow-md hover:shadow-lg'
              }`}
            >
              Sign In
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                showTransparent ? 'text-white hover:bg-white/10' : 'text-[#22283a] hover:bg-gray-100'
              }`}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-[#1051a5] bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center mt-3 bg-[#1051a5] text-white font-medium px-5 py-3 rounded-xl"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
