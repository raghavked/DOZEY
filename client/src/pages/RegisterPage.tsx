import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Mail, Lock, Eye, EyeOff, UserPlus, CheckCircle, Shield } from 'lucide-react';
import { DozeyLogo } from '@/components/DozeyLogo';

export function RegisterPage() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [tosAccepted, setTosAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter.');
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError('Password must contain at least one lowercase letter.');
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number.');
      return;
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      setError('Password must contain at least one special character (e.g., !@#$%^&*).');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!tosAccepted) {
      setError('You must agree to the Terms of Service and Privacy Policy to create an account.');
      return;
    }

    setLoading(true);
    try {
      const result = await signUp(email, password);
      if (result?.session?.access_token) {
        await fetch('/api/auth/accept-tos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${result.session.access_token}`,
          },
        });
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <Link to="/">
            <DozeyLogo className="h-12 mx-auto mb-6" />
          </Link>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-[#26844f]" />
            </div>
            <h2 className="text-2xl font-bold text-[#22283a] mb-3">Check Your Email</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We've sent a verification link to <strong className="text-[#22283a]">{email}</strong>. Please click the link to verify your account before signing in.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-[#1051a5] hover:bg-[#0d4185] text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg"
            >
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#26844f] via-[#1e6a3f] to-[#22283a] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#97bf2d] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#1051a5] rounded-full blur-3xl" />
        </div>
        <div className="relative flex flex-col justify-center px-16 max-w-lg">
          <DozeyLogo className="h-14 mb-10" theme="dark" />
          <h2 className="text-4xl font-bold mb-6 leading-tight">Your health records, unified</h2>
          <p className="text-white/70 text-lg mb-10 leading-relaxed">
            Join the platform that helps immigrants, students, and global workers manage their vaccination records across borders.
          </p>
          <div className="space-y-4">
            {['Free to create an account', 'Upload records in any language', 'AI-powered document processing'].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#97bf2d]/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-[#97bf2d]" />
                </div>
                <span className="text-white/80 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <Link to="/">
              <DozeyLogo className="h-12 mx-auto mb-4" />
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-[#22283a] mb-2">Create Account</h1>
          <p className="text-gray-500 mb-8">Start managing your health records securely</p>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#22283a] mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1051a5]/20 focus:border-[#1051a5] outline-none transition-all bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#22283a] mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min 8 chars, uppercase, number, special"
                    required
                    className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1051a5]/20 focus:border-[#1051a5] outline-none transition-all bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#22283a] mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1051a5]/20 focus:border-[#1051a5] outline-none transition-all bg-gray-50"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <input
                  type="checkbox"
                  id="tosAccepted"
                  checked={tosAccepted}
                  onChange={e => setTosAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 text-[#1051a5] border-gray-300 rounded focus:ring-[#1051a5] cursor-pointer"
                />
                <label htmlFor="tosAccepted" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
                  I have read and agree to the{' '}
                  <Link to="/terms" target="_blank" className="text-[#1051a5] hover:underline font-semibold">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" target="_blank" className="text-[#1051a5] hover:underline font-semibold">
                    Privacy Policy
                  </Link>
                  , including the HIPAA Notice of Privacy Practices.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !tosAccepted}
                className="w-full bg-[#1051a5] hover:bg-[#0d4185] text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#1051a5]/25 hover:shadow-xl active:scale-[0.98]"
              >
                {loading ? 'Creating account...' : 'Create Account'}
                {!loading && <UserPlus className="w-5 h-5" />}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-[#1051a5] hover:underline font-semibold">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
