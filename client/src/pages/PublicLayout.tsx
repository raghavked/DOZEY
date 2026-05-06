import { Outlet } from 'react-router-dom';
import { PublicNavbar } from '@/components/PublicNavbar';
import { PublicFooter } from '@/components/PublicFooter';

/**
 * Public layout wrapper.
 * Background is white — individual sections use .section-dark or .section-light
 * for the alternating light/dark rhythm specified in the PDR.
 */
export function PublicLayout() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      <main>
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}

export default PublicLayout;
