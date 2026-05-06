import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import { DozeyLogo } from '@/components/DozeyLogo';

export function PublicFooter() {
  return (
    <footer className="bg-[#060D1A] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <DozeyLogo className="h-14 mb-4" />
            <p className="text-sm text-[#64748B] leading-relaxed mt-4">
              Empowering immigrant students to navigate healthcare requirements and access education without barriers.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="https://www.instagram.com/dozey.health/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#10B981]/20 flex items-center justify-center text-[#64748B] hover:text-[#10B981] transition-colors"
                aria-label="DOZEY on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-5">Product</h4>
            <ul className="space-y-3">
              {[
                { to: '/features', label: 'Features' },
                { to: '/progress', label: 'Progress' },
                { to: '/register', label: 'Get Started' },
                { to: '/login', label: 'Sign In' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-[#64748B] hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-5">Company</h4>
            <ul className="space-y-3">
              {[
                { to: '/team', label: 'Team' },
                { to: '/contact', label: 'Contact' },
                { to: '/progress', label: 'Impact' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-[#64748B] hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-5">Legal</h4>
            <ul className="space-y-3">
              {[
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/terms', label: 'Terms of Service' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-[#64748B] hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#475569]">© {new Date().getFullYear()} DOZEY. All rights reserved.</p>
          <p className="text-xs text-[#475569]">Built for immigrant students, by students who understand.</p>
        </div>
      </div>
    </footer>
  );
}
