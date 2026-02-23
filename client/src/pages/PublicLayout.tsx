import { Outlet } from 'react-router-dom';
import { PublicNavbar } from '@/components/PublicNavbar';
import { PublicFooter } from '@/components/PublicFooter';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/20 text-[#22283a]">
      <PublicNavbar />
      <Outlet />
      <PublicFooter />
    </div>
  );
}
