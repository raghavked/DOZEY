import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { LandingPage } from '@/pages/LandingPage';
import { DashboardLayout } from '@/pages/DashboardLayout';

export default function App() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f4f8] to-[#e1e8ed]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#1051a5] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#22283a] text-lg">Loading DOZEY...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/app/*" element={<DashboardLayout user={user!} />} />
            <Route path="*" element={<Navigate to="/app" replace />} />
          </>
        ) : (
          <>
            <Route path="/*" element={<LandingPage />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
