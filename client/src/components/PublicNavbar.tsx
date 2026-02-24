import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { DozeyLogo } from '@/components/DozeyLogo';

const links = [
  { to: '/', label: 'Home' },
  { to: '/features', label: 'Features' },
  { to: '/progress', label: 'Progress & Validation' },
  { to: '/team', label: 'Team' },
  { to: '/contact', label: 'Contact Us' },
];

export function PublicNavbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex-shrink-0">
            <DozeyLogo className="h-12" />
          </Link>

          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-[#1051a5] ${
                  location.pathname === link.to
                    ? 'text-[#1051a5]'
                    : 'text-[#22283a]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden lg:inline-flex items-center px-6 py-2.5 bg-[#1051a5] text-white rounded-lg hover:bg-[#0d4185] transition-all shadow-md hover:shadow-lg font-medium"
            >
              Sign In
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-[#22283a] hover:bg-gray-100 rounded-lg"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-3 rounded-xl text-sm font-medium ${
                  location.pathname === link.to
                    ? 'text-[#1051a5] bg-blue-50'
                    : 'text-[#22283a] hover:bg-gray-50'
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
