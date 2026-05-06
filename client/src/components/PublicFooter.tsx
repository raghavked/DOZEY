import { Link } from 'react-router-dom';
import DozeyLogo from '@/components/DozeyLogo';

const navGroups = [
  {
    title: 'Product',
    links: [
      { href: '/features', label: 'Features' },
      { href: '/progress', label: 'Impact & Progress' },
      { href: '/register', label: 'Get Started Free' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/team', label: 'Our Team' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
    ],
  },
];

export function PublicFooter() {
  return (
    <footer className="section-dark" style={{ borderTop: '1px solid rgba(56,212,184,0.1)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/">
              <span className="block mb-5 hover:opacity-90 transition-opacity">
                <DozeyLogo className="h-10" theme="dark" />
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.55)', maxWidth: '280px' }}>
              AI-powered health record management for international students. Translate, verify, and submit your vaccination records to any US university — in minutes.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#38D4B8] animate-pulse" />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>HIPAA-compliant platform</span>
            </div>
          </div>

          {/* Nav groups */}
          {navGroups.map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-sm font-semibold mb-4 text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>{title}</h4>
              <ul className="space-y-3">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link to={href}>
                      <span
                        className="text-sm transition-colors cursor-pointer hover:text-white"
                        style={{ color: 'rgba(255,255,255,0.5)' }}
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
          className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            &copy; {new Date().getFullYear()} DOZEY. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy">
              <span className="text-xs transition-colors cursor-pointer hover:text-white" style={{ color: 'rgba(255,255,255,0.35)' }}>Privacy</span>
            </Link>
            <Link to="/terms">
              <span className="text-xs transition-colors cursor-pointer hover:text-white" style={{ color: 'rgba(255,255,255,0.35)' }}>Terms</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default PublicFooter;
