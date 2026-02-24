import { Link } from 'react-router-dom';
import { DozeyLogo } from '@/components/DozeyLogo';

export function PublicFooter() {
  return (
    <footer className="bg-[#22283a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          <div className="md:col-span-5">
            <DozeyLogo className="h-9 mb-5" theme="dark" />
            <p className="text-white/30 text-sm leading-relaxed max-w-sm mb-5">
              Healthcare that moves with you. Managing vaccination records across borders for
              immigrants, international students, and global workers.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/5 rounded-full px-4 py-2">
              <div className="w-1.5 h-1.5 bg-[#97bf2d] rounded-full animate-pulse" />
              <span className="text-[#97bf2d] text-xs font-medium">Actively in development</span>
            </div>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <h4 className="text-white/50 font-medium mb-5 text-xs uppercase tracking-widest">Navigate</h4>
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
                  className="block text-sm text-white/30 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-white/50 font-medium mb-5 text-xs uppercase tracking-widest">Legal</h4>
            <div className="space-y-3">
              <Link to="/terms" className="block text-sm text-white/30 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="block text-sm text-white/30 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <div className="text-white/30 text-sm">HIPAA Compliant</div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">
            &copy; {new Date().getFullYear()} DOZEY Inc. All rights reserved.
          </p>
          <p className="text-xs text-white/20">
            Built with care for global health equity
          </p>
        </div>
      </div>
    </footer>
  );
}
