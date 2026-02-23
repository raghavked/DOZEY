import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/20">
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
  );
}
