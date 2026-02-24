import { Link } from 'react-router-dom';
import { DozeyLogo } from '@/components/DozeyLogo';

export function PublicFooter() {
  return (
    <footer className="bg-[#fafafa] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          <div className="md:col-span-5">
            <DozeyLogo className="h-9 mb-4" theme="light" />
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-4">
              Healthcare that moves with you. Managing vaccination records across borders for
              immigrants, international students, and global workers.
            </p>
            <div className="inline-flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#97bf2d] rounded-full animate-pulse" />
              <span className="text-gray-400 text-xs">Actively in development</span>
            </div>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <h4 className="text-gray-400 font-medium mb-4 text-xs uppercase tracking-widest">Navigate</h4>
            <div className="space-y-2.5">
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
                  className="block text-sm text-gray-400 hover:text-[#22283a] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-gray-400 font-medium mb-4 text-xs uppercase tracking-widest">Legal</h4>
            <div className="space-y-2.5">
              <Link to="/terms" className="block text-sm text-gray-400 hover:text-[#22283a] transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="block text-sm text-gray-400 hover:text-[#22283a] transition-colors">
                Privacy Policy
              </Link>
              <div className="text-gray-400 text-sm">HIPAA Compliant</div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-300">
            &copy; {new Date().getFullYear()} DOZEY Inc. All rights reserved.
          </p>
          <p className="text-xs text-gray-300">
            Built with care for global health equity
          </p>
        </div>
      </div>
    </footer>
  );
}
