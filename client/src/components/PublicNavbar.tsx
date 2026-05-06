import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DozeyLogo from '@/components/DozeyLogo';

const navLinks = [
  { href: '/features', label: 'Features' },
  { href: '/progress', label: 'Impact' },
  { href: '/team', label: 'Team' },
  { href: '/contact', label: 'Contact' },
];

export default function PublicNavbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? 'rgba(10, 20, 40, 0.95)'
            : 'rgba(10, 20, 40, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <a className="flex-shrink-0 hover:opacity-90 transition-opacity">
              <DozeyLogo className="h-12" />
            </a>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <Link key={href} to={href}>
                <a
                  className="text-sm font-medium transition-colors relative group"
                  style={{
                    color: location.pathname === href ? '#00D9A3' : '#94A3B8',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {label}
                  <span
                    className="absolute -bottom-1 left-0 h-px bg-[#00D9A3] transition-all duration-300"
                    style={{ width: location.pathname === href ? '100%' : '0%' }}
                  />
                  <span className="absolute -bottom-1 left-0 h-px bg-[#00D9A3] w-0 group-hover:w-full transition-all duration-300 opacity-60" />
                </a>
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <a className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2">
                Sign In
              </a>
            </Link>
            <Link to="/register">
              <a className="btn-teal text-sm py-2.5 px-5">
                Get Started
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </a>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col"
          style={{ background: 'rgba(10, 20, 40, 0.98)', backdropFilter: 'blur(20px)', paddingTop: '80px' }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex flex-col items-center justify-center flex-1 gap-8 px-6">
            {navLinks.map(({ href, label }) => (
              <Link key={href} to={href}>
                <a
                  className="text-2xl font-bold transition-colors"
                  style={{
                    color: location.pathname === href ? '#00D9A3' : 'white',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {label}
                </a>
              </Link>
            ))}
            <div className="flex flex-col gap-3 w-full max-w-xs mt-4">
              <Link to="/login">
                <a className="w-full text-center py-3 border border-white/20 rounded-lg text-white font-medium hover:border-[#00D9A3]/50 transition-colors">
                  Sign In
                </a>
              </Link>
              <Link to="/register">
                <a className="btn-teal w-full justify-center">Get Started</a>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export { PublicNavbar };
