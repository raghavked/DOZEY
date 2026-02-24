import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Mail, Lock, Eye, EyeOff, UserPlus, CheckCircle } from 'lucide-react';
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
      <div className="min-h-screen bg-[#fefefe] flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <Link to="/">
            <DozeyLogo className="h-10 mx-auto mb-8" />
          </Link>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-[#26844f]" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#22283a] mb-3">Check your email</h2>
          <p className="text-gray-400 mb-8 text-sm leading-relaxed">
            We've sent a verification link to <strong className="text-[#22283a]">{email}</strong>. Click the link to verify your account.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-[#22283a] hover:bg-[#1a1f2e] text-white px-8 py-3.5 rounded-full font-bold transition-all text-sm"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#22283a] text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#26844f]/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-[#1051a5]/10 rounded-full blur-[80px]" />
        </div>
        <div className="relative flex flex-col justify-center px-16 max-w-lg">
          <DozeyLogo className="h-12 mb-12" theme="dark" />
          <h2 className="text-4xl font-extrabold mb-6 leading-[1.05]">
            Your health records,
            <br />unified
          </h2>
          <p className="text-white/30 text-lg leading-relaxed mb-10">
            Join the platform that helps immigrants, students, and global workers manage vaccination records.
          </p>
          <div className="space-y-3">
            {['Free to create an account', 'Upload records in any language', 'AI-powered processing'].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-[#97bf2d] rounded-full" />
                <span className="text-white/40 text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 bg-[#fefefe]">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8 lg:hidden">
            <Link to="/">
              <DozeyLogo className="h-10 mx-auto mb-4" />
            </Link>
          </div>

          <h1 className="text-3xl font-extrabold text-[#22283a] mb-2">Create account</h1>
          <p className="text-gray-400 mb-8 text-sm">Start managing your health records securely</p>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1051a5]/10 focus:border-[#1051a5] outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 8 chars, uppercase, number, special"
                  required
                  className="w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1051a5]/10 focus:border-[#1051a5] outline-none transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1051a5]/10 focus:border-[#1051a5] outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
              <input
                type="checkbox"
                id="tosAccepted"
                checked={tosAccepted}
                onChange={e => setTosAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#1051a5] border-gray-300 rounded focus:ring-[#1051a5] cursor-pointer"
              />
              <label htmlFor="tosAccepted" className="text-xs text-gray-500 leading-relaxed cursor-pointer">
                I agree to the{' '}
                <Link to="/terms" target="_blank" className="text-[#1051a5] hover:underline font-semibold">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" target="_blank" className="text-[#1051a5] hover:underline font-semibold">Privacy Policy</Link>
                , including the HIPAA Notice of Privacy Practices.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !tosAccepted}
              className="w-full bg-[#22283a] hover:bg-[#1a1f2e] text-white py-3.5 rounded-full font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm active:scale-[0.98]"
            >
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <UserPlus className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-[#1051a5] hover:underline font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
