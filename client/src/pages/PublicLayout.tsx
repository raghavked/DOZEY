import { Outlet } from 'react-router-dom';
import { PublicNavbar } from '@/components/PublicNavbar';
import { PublicFooter } from '@/components/PublicFooter';

/**
 * Public layout wrapper.
 * Background is pure black (#000000) per PDR v3.
 * OroSwap-style dark aesthetic throughout.
 */
export function PublicLayout() {
  return (
    <div style={{ background: '#000000', minHeight: '100vh' }}>
      <PublicNavbar />
      <main>
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}

export default PublicLayout;
