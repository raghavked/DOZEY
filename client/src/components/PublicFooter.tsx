import { Link } from 'react-router-dom';
import DozeyLogo from '@/components/DozeyLogo';

export default function PublicFooter() {
  return (
    <footer style={{ background: '#060D1A', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <DozeyLogo className="h-14 mb-5" />
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Helping international students navigate US university health requirements with AI-powered document translation and verification.
            </p>
            <a
              href="https://www.instagram.com/dozey.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-[#00D9A3] transition-colors text-sm"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              @dozey.app
            </a>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>Product</h4>
            <ul className="space-y-3">
              {[
                { href: '/features', label: 'Features' },
                { href: '/progress', label: 'Impact' },
                { href: '/login', label: 'Sign In' },
                { href: '/register', label: 'Get Started' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link to={href}>
                    <a className="text-slate-400 hover:text-[#00D9A3] transition-colors text-sm">{label}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>Company</h4>
            <ul className="space-y-3">
              {[
                { href: '/team', label: 'Team' },
                { href: '/contact', label: 'Contact' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link to={href}>
                    <a className="text-slate-400 hover:text-[#00D9A3] transition-colors text-sm">{label}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>Legal</h4>
            <ul className="space-y-3">
              {[
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Service' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link to={href}>
                    <a className="text-slate-400 hover:text-[#00D9A3] transition-colors text-sm">{label}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} DOZEY. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="#00D9A3" strokeWidth="2" className="w-4 h-4">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <span className="text-slate-500 text-sm">HIPAA Compliant · AES-256 Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
export { PublicFooter };
