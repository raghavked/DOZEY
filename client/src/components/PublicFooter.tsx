import { Link } from 'react-router-dom';
import dozeyLogo from '@/assets/dozey-logo.png';

export function PublicFooter() {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-24 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center space-y-4">
          <img src={dozeyLogo} alt="DOZEY" className="h-10" />
          <div className="flex items-center gap-4 text-sm">
            <Link to="/terms" className="text-[#1051a5] hover:underline">Terms of Service</Link>
            <span className="text-gray-300">|</span>
            <Link to="/privacy" className="text-[#1051a5] hover:underline">Privacy Policy</Link>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">HIPAA Compliant</span>
          </div>
          <p className="text-sm text-[#22283a]">&copy; 2026. DOZEY Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
