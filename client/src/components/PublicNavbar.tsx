import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DozeyLogo from '@/components/DozeyLogo';

const navLinks = [
  { href: '/',         label: 'Home' },
  { href: '/features', label: 'Features' },
  { href: '/progress', label: 'Progress' },
  { href: '/team',     label: 'Team' },
  { href: '/contact',  label: 'Contact' },
];

export function PublicNavbar() {
  const location = useLocation();
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(0,0,0,0.97)' : 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(56,212,184,0.15)' : '1px solid rgba(255,255,255,0.04)',
          boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.6)' : 'none',
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <Link to="/" aria-label="DOZEY home">
            <span className="flex-shrink-0 hover:opacity-90 transition-opacity block">
              <DozeyLogo className="h-11" theme="dark" />
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label }) => {
              const active = location.pathname === href;
              return (
                <Link key={href} to={href}>
                  <span
                    className="text-sm font-medium transition-colors relative group cursor-pointer"
                    style={{ color: active ? '#38D4B8' : 'rgba(255,255,255,0.8)', fontFamily: "'Inter', sans-serif" }}
                  >
                    {label}
                    <span className="absolute -bottom-1 left-0 h-0.5 rounded-full transition-all duration-300" style={{ background: '#38D4B8', width: active ? '100%' : '0%' }} />
                    <span className="absolute -bottom-1 left-0 h-0.5 rounded-full bg-[#38D4B8] w-0 group-hover:w-full transition-all duration-300 opacity-50" />
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <span className="text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer text-white/75 hover:text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                Sign In
              </span>
            </Link>
            <Link to="/register">
              <span className="btn-primary text-sm py-2.5 px-5 cursor-pointer">
                Get Started
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </span>
            </Link>
          </div>
          <button
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg transition-colors"
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span className="block w-5 h-0.5 bg-white rounded-full transition-all duration-300" style={{ transform: mobileOpen ? 'rotate(45deg) translateY(8px)' : 'none' }} />
            <span className="block w-5 h-0.5 bg-white rounded-full transition-all duration-300" style={{ opacity: mobileOpen ? 0 : 1 }} />
            <span className="block w-5 h-0.5 bg-white rounded-full transition-all duration-300" style={{ transform: mobileOpen ? 'rotate(-45deg) translateY(-8px)' : 'none' }} />
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col"
          style={{ background: 'rgba(0,0,0,0.97)', backdropFilter: 'blur(24px)', paddingTop: '80px' }}
          role="dialog" aria-modal="true" aria-label="Navigation menu"
        >
          <div className="flex flex-col items-center justify-center flex-1 gap-8 px-6">
            {navLinks.map(({ href, label }) => {
              const active = location.pathname === href;
              return (
                <Link key={href} to={href}>
                  <span className="text-2xl font-bold transition-colors cursor-pointer" style={{ color: active ? '#38D4B8' : '#FFFFFF', fontFamily: "'Poppins', sans-serif" }}>
                    {label}
                  </span>
                </Link>
              );
            })}
            <div className="flex flex-col gap-3 w-full max-w-xs mt-4">
              <Link to="/login">
                <span className="block w-full text-center py-3 border rounded-xl text-white font-medium transition-colors cursor-pointer" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>Sign In</span>
              </Link>
              <Link to="/register">
                <span className="btn-primary w-full justify-center cursor-pointer">Get Started</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default PublicNavbar;
