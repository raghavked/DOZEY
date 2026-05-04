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

  // Scroll-aware border
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Main navbar bar ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#F8F7F4]/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-sm'
            : 'bg-[#F8F7F4] border-b border-transparent'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center" aria-label="DOZEY Home">
              <DozeyLogo className="h-12" theme="light" />
            </Link>

            {/* Desktop nav links */}
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

            {/* Desktop CTA + mobile hamburger */}
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
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* ── Mobile menu — full-screen overlay (z-40, below navbar z-50) ──
          Renders as a sibling outside <nav> so it never clips page content.
          Body scroll is locked while open.
      */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-[#F8F7F4] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Mirror the navbar top bar so the logo stays visible */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-[#E5E7EB] flex-shrink-0">
            <Link to="/" aria-label="DOZEY Home">
              <DozeyLogo className="h-12" theme="light" />
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-md text-[#0A1428] hover:bg-[#F3F4F6] transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav links */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center px-3 py-3.5 rounded-[4px] text-base font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-[#0A1428] bg-[#F3F4F6]'
                    : 'text-[#6B7280] hover:text-[#0A1428] hover:bg-[#F3F4F6]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4">
              <Link
                to="/login"
                className="block w-full text-center bg-[#0A1428] text-white font-semibold px-6 py-3.5 rounded-[4px] text-base hover:bg-[#1F2937] transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
