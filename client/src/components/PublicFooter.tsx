import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import { DozeyLogo } from '@/components/DozeyLogo';

const productLinks = [
  { to: '/features', label: 'Features' },
  { to: '/progress', label: 'Progress' },
  { to: '/login', label: 'Sign In' },
];

const companyLinks = [
  { to: '/team', label: 'Team' },
  { to: '/contact', label: 'Contact' },
];

const legalLinks = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Service' },
];

export function PublicFooter() {
  return (
    <footer className="bg-[#0A1428] text-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" aria-label="DOZEY Home" className="inline-block mb-4">
              <DozeyLogo className="h-14" theme="dark" />
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              Healthcare that moves with you. Managing medical records across borders for
              immigrants, students, and global workers.
            </p>
            <a
              href="https://www.instagram.com/dozeyrecords"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-white/50 hover:text-white transition-colors"
              aria-label="Follow DOZEY on Instagram"
            >
              <Instagram className="w-4 h-4" />
              <span className="text-sm">@dozeyrecords</span>
            </a>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Product</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <span className="text-sm text-white/60">HIPAA Compliant</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} DOZEY Inc. All rights reserved.
          </p>
          <p className="text-sm text-white/40">
            Built with care for global health equity
          </p>
        </div>
      </div>
    </footer>
  );
}
