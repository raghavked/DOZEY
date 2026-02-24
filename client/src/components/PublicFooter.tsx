import { Link } from 'react-router-dom';
import { Shield, Heart } from 'lucide-react';
import { DozeyLogo } from '@/components/DozeyLogo';

export function PublicFooter() {
  return (
    <footer className="bg-[#22283a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <DozeyLogo className="h-10 mb-4" theme="dark" />
            <p className="text-white/60 text-sm leading-relaxed max-w-md mb-4">
              Healthcare that moves with you. Managing medical records across borders for
              immigrants, international students, and global workers.
            </p>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2 w-fit">
              <div className="w-2 h-2 bg-[#97bf2d] rounded-full animate-pulse" />
              <span className="text-[#97bf2d] text-xs font-medium">Actively in development</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Navigate</h4>
            <div className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/features', label: 'Features' },
                { to: '/progress', label: 'Progress' },
                { to: '/team', label: 'Team' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-sm text-white/60 hover:text-[#97bf2d] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Legal & Security</h4>
            <div className="space-y-3">
              <Link to="/terms" className="block text-sm text-white/60 hover:text-[#97bf2d] transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="block text-sm text-white/60 hover:text-[#97bf2d] transition-colors">
                Privacy Policy
              </Link>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Shield className="w-4 h-4 text-[#97bf2d]" />
                HIPAA Compliant
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} DOZEY Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-white/40">
            <Heart className="w-4 h-4 text-[#97bf2d]" />
            <span className="text-sm">Built with care for global health equity</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
