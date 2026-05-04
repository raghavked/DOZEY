import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { DozeyLogo } from '@/components/DozeyLogo';

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/app');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A1428] text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#10B981]/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#10B981]/5 rounded-full blur-[80px]" />
        </div>
        <div className="relative flex flex-col justify-center px-16 max-w-lg">
          <DozeyLogo className="h-16 mb-12" theme="dark" />
          <h2 className="text-4xl font-bold mb-6 leading-[1.1] tracking-tight">
            Healthcare that
            <br />moves with you
          </h2>
          <p className="text-white/60 text-lg leading-relaxed mb-10">
            Securely manage your vaccination records across borders. Upload, translate, and verify.
          </p>
          <div className="space-y-3">
            {['HIPAA Compliant', '256-bit Encryption', 'AI-Powered Translation'].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full" />
                <span className="text-white/60 text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 bg-[#F8F7F4]">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="text-center mb-8 lg:hidden">
            <Link to="/">
              <DozeyLogo className="h-14 mx-auto mb-4" />
            </Link>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#0A1428] transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>

          <h1 className="text-3xl font-bold text-[#0A1428] mb-2 tracking-tight">Welcome back</h1>
          <p className="text-[#6B7280] mb-8 text-sm">Sign in to access your health records</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[4px] mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#0A1428] mb-1.5" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-[#D1D5DB] rounded-[4px] bg-white text-sm text-[#0A1428] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#0A1428] focus:ring-2 focus:ring-[#0A1428]/10 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0A1428] mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-12 py-3 border border-[#D1D5DB] rounded-[4px] bg-white text-sm text-[#0A1428] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#0A1428] focus:ring-2 focus:ring-[#0A1428]/10 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#0A1428] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0A1428] hover:bg-[#1F2937] text-white py-3.5 rounded-[4px] font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm active:scale-[0.98]"
            >
              {loading ? 'Signing in…' : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#6B7280] text-sm">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-[#0A1428] font-semibold underline underline-offset-4 hover:text-[#1F2937]">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
