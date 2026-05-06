import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DozeyLogo } from '@/components/DozeyLogo';
import { useAuth } from '@/hooks/use-auth';
import { Eye, EyeOff } from 'lucide-react';

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await signIn(email, password);
      if (result?.user) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1428] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#060D1A] border-r border-white/10 flex-col justify-between p-12">
        <DozeyLogo className="h-16" />
        <div>
          <blockquote className="text-xl font-light text-[#CBD5E1] leading-relaxed mb-6 italic">
            "DOZEY made it possible for me to start school on time. My records were in three languages — they handled it all."
          </blockquote>
          <div>
            <div className="font-semibold text-white">Priya S.</div>
            <div className="text-sm text-[#10B981]">UC Davis, Class of 2027</div>
          </div>
        </div>
        <div className="text-xs text-[#475569]">HIPAA Compliant · End-to-End Encrypted</div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-10 flex justify-center">
            <DozeyLogo className="h-14" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-[#94A3B8] mb-8 text-sm">Sign in to your DOZEY account.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm text-red-400">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#111827] border border-white/10 focus:border-[#10B981] rounded-[4px] px-4 py-3 text-white placeholder-[#475569] outline-none transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#111827] border border-white/10 focus:border-[#10B981] rounded-[4px] px-4 py-3 pr-12 text-white placeholder-[#475569] outline-none transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#10B981] hover:bg-[#0ea472] disabled:opacity-60 text-white font-semibold py-3.5 rounded-[4px] transition-colors text-sm"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-[#64748B] mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#10B981] hover:underline font-medium">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
