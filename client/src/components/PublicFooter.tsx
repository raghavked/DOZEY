import { Link } from 'react-router-dom';
import DozeyLogo from '@/components/DozeyLogo';

const navGroups = [
  {
    title: 'Product',
    links: [
      { href: '/features', label: 'Features' },
      { href: '/progress', label: 'Progress' },
      { href: '/register', label: 'Get started free' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/team', label: 'Our team' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy policy' },
      { href: '/terms', label: 'Terms of service' },
    ],
  },
];

export function PublicFooter() {
  return (
    <footer
      style={{
        background: '#000000',
        borderTop: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '4rem 1.5rem 3rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '3rem',
          }}
        >
          {/* Brand column */}
          <div>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '1.25rem', textDecoration: 'none' }}>
              <DozeyLogo className="h-8" theme="dark" />
            </Link>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'rgba(255,255,255,0.38)',
                lineHeight: '1.65',
                maxWidth: '260px',
              }}
            >
              AI-powered health record management for international students. Translate, verify, and submit your vaccination records to any US university.
            </p>
            <p
              style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.22)',
                marginTop: '1.25rem',
              }}
            >
              HIPAA-compliant platform
            </p>
          </div>

          {/* Nav groups */}
          {navGroups.map(({ title, links }) => (
            <div key={title}>
              <h4
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'rgba(255,255,255,0.38)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '1.25rem',
                }}
              >
                {title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link to={href} style={{ textDecoration: 'none' }}>
                      <span
                        style={{
                          fontSize: '0.875rem',
                          color: 'rgba(255,255,255,0.45)',
                          transition: 'color 180ms ease',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={e => ((e.target as HTMLElement).style.color = '#FFFFFF')}
                        onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.45)')}
                      >
                        {label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            marginTop: '3rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.22)' }}>
            &copy; {new Date().getFullYear()} DOZEY. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {[{ href: '/privacy', label: 'Privacy' }, { href: '/terms', label: 'Terms' }].map(({ href, label }) => (
              <Link key={href} to={href} style={{ textDecoration: 'none' }}>
                <span
                  style={{
                    fontSize: '0.8125rem',
                    color: 'rgba(255,255,255,0.22)',
                    cursor: 'pointer',
                    transition: 'color 180ms ease',
                  }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.55)')}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.22)')}
                >
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;
