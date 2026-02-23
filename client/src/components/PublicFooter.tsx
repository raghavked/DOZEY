import dozeyLogo from '@/assets/dozey-logo.png';

export function PublicFooter() {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-24 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center space-y-4">
          <img src={dozeyLogo} alt="DOZEY" className="h-10" />
          <p className="text-sm text-[#22283a]">&copy; 2026. DOZEY</p>
        </div>
      </div>
    </footer>
  );
}
