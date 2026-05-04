import { Outlet } from 'react-router-dom';
import { PublicNavbar } from '@/components/PublicNavbar';
import { PublicFooter } from '@/components/PublicFooter';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#0A1428]">
      <PublicNavbar />
      <main>
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
