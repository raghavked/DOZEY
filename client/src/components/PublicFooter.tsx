import { Link } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/features', label: 'Features' },
  { to: '/progress', label: 'Progress' },
  { to: '/team', label: 'Team' },
  { to: '/contact', label: 'Contact' },
];

const legalLinks = [
  { to: '/terms', label: 'Terms of Service' },
  { to: '/privacy', label: 'Privacy Policy' },
];

export function PublicFooter() {
  return (
    <footer className="bg-[#f5f5f7] border-t border-black/5">
      <div className="max-w-[980px] mx-auto px-4 sm:px-6 py-5">
        <div className="flex flex-wrap items-center gap-x-1 text-xs text-[#86868b] mb-2">
          {navLinks.map((link, i) => (
            <span key={link.to} className="flex items-center">
              {i > 0 && <span className="mx-2 text-[#d2d2d7]">|</span>}
              <Link to={link.to} className="hover:text-[#1d1d1f] transition-colors">
                {link.label}
              </Link>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-1 text-xs text-[#86868b] mb-4">
          {legalLinks.map((link, i) => (
            <span key={link.to} className="flex items-center">
              {i > 0 && <span className="mx-2 text-[#d2d2d7]">|</span>}
              <Link to={link.to} className="hover:text-[#1d1d1f] transition-colors">
                {link.label}
              </Link>
            </span>
          ))}
          <span className="mx-2 text-[#d2d2d7]">|</span>
          <span>HIPAA Compliant</span>
        </div>
        <div className="border-t border-black/5 pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs text-[#86868b]">
            &copy; {new Date().getFullYear()} DOZEY Inc. All rights reserved.
          </p>
          <p className="text-xs text-[#86868b]">
            Built with care for global health equity
          </p>
        </div>
      </div>
    </footer>
  );
}
