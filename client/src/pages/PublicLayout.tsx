import { Outlet } from 'react-router-dom';
import { PublicNavbar } from '@/components/PublicNavbar';
import { PublicFooter } from '@/components/PublicFooter';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#0A1428] text-white">
      <PublicNavbar />
      <main>
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
