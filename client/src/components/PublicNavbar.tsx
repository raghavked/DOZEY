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
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F8F7F4]/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-sm'
          : 'bg-[#F8F7F4] border-b border-transparent'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center" aria-label="DOZEY Home">
            <DozeyLogo className="h-9" theme="light" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors relative group ${
                  location.pathname === link.to
                    ? 'text-[#0A1428]'
                    : 'text-[#6B7280] hover:text-[#0A1428]'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px bg-[#0A1428] transition-all duration-200 ${
                    location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden lg:inline-flex items-center px-5 py-2 rounded-[4px] text-sm font-semibold bg-[#0A1428] text-white transition-colors hover:bg-[#1F2937] active:scale-[0.98]"
            >
              Sign In
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-md text-[#0A1428] hover:bg-[#F3F4F6] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#F8F7F4] border-t border-[#E5E7EB]">
          <div className="px-6 py-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-[4px] text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-[#0A1428] bg-[#F3F4F6]'
                    : 'text-[#6B7280] hover:text-[#0A1428] hover:bg-[#F3F4F6]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center mt-3 bg-[#0A1428] text-white font-semibold px-6 py-2.5 rounded-[4px] text-sm hover:bg-[#1F2937] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
