import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DozeyLogo from '@/components/DozeyLogo';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/features', label: 'Features' },
  { href: '/progress', label: 'Progress' },
  { href: '/team', label: 'Team' },
  { href: '/contact', label: 'Contact' },
];

export function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled ? 'rgba(0,0,0,0.97)' : 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
          transition: 'background 220ms ease, border-color 220ms ease',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 1.5rem',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <DozeyLogo className="h-11" theme="dark" />
          </Link>

          {/* Desktop nav */}
          <div
            className="hidden md:flex items-center"
            style={{ gap: '2rem' }}
          >
            {navLinks.map(({ href, label }) => {
              const active = location.pathname === href;
              return (
                <Link key={href} to={href} style={{ textDecoration: 'none' }}>
                  <span
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: active ? '600' : '400',
                      color: active ? '#38D4B8' : 'rgba(255,255,255,0.65)',
                      transition: 'color 180ms ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => { if (!active) (e.target as HTMLElement).style.color = '#FFFFFF'; }}
                    onMouseLeave={e => { if (!active) (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.65)'; }}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center" style={{ gap: '1rem' }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <span
                style={{
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: 'rgba(255,255,255,0.55)',
                  cursor: 'pointer',
                  transition: 'color 180ms ease',
                }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = '#FFFFFF')}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.55)')}
              >
                Sign in
              </span>
            </Link>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <span className="btn-primary" style={{ padding: '9px 20px', fontSize: '0.875rem' }}>
                Get started
              </span>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(o => !o)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: '#FFFFFF',
            }}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '22px', height: '22px' }}>
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '22px', height: '22px' }}>
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            background: '#000000',
            display: 'flex',
            flexDirection: 'column',
            paddingTop: '80px',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
            {navLinks.map(({ href, label }) => {
              const active = location.pathname === href;
              return (
                <Link key={href} to={href} style={{ textDecoration: 'none' }}>
                  <span
                    style={{
                      display: 'block',
                      padding: '1rem 0',
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      fontFamily: "'Poppins', sans-serif",
                      color: active ? '#38D4B8' : '#FFFFFF',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingBottom: '2.5rem' }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <span
                className="btn-ghost"
                style={{ display: 'block', textAlign: 'center', width: '100%' }}
              >
                Sign in
              </span>
            </Link>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <span
                className="btn-primary"
                style={{ display: 'block', textAlign: 'center', width: '100%', justifyContent: 'center' }}
              >
                Get started free
              </span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default PublicNavbar;
