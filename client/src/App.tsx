import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { PublicLayout } from '@/pages/PublicLayout';
import { HomePage } from '@/pages/HomePage';
import { FeaturesPage } from '@/pages/FeaturesPage';
import { ProgressPage } from '@/pages/ProgressPage';
import { TeamPage } from '@/pages/TeamPage';
import { ContactPage } from '@/pages/ContactPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardLayout } from '@/pages/DashboardLayout';
import { TermsOfService } from '@/pages/TermsOfService';
import { PrivacyPolicy } from '@/pages/PrivacyPolicy';

export default function App() {
  const { isLoading, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const prevAuthRef = useRef(isAuthenticated);

  useEffect(() => {
    if (prevAuthRef.current && !isAuthenticated) {
      queryClient.clear();
    }
    if (!prevAuthRef.current && isAuthenticated) {
      queryClient.invalidateQueries();
    }
    prevAuthRef.current = isAuthenticated;
  }, [isAuthenticated, queryClient]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1428]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#0A1428] text-lg">Loading DOZEY...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          {isAuthenticated ? (
            <>
              <Route path="/app/*" element={<DashboardLayout />} />
              <Route path="*" element={<Navigate to="/app" replace />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route element={<PublicLayout />}>
                <Route index element={<HomePage />} />
                <Route path="features" element={<FeaturesPage />} />
                <Route path="progress" element={<ProgressPage />} />
                <Route path="team" element={<TeamPage />} />
                <Route path="contact" element={<ContactPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors theme="light" />
    </>
  );
}
