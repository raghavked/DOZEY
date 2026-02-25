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
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#4a7fb5] to-[#4d9068] text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px]" />
        </div>
        <div className="relative flex flex-col justify-center px-16 max-w-lg">
          <DozeyLogo className="h-20 mb-12" theme="dark" />
          <h2 className="text-4xl font-extrabold mb-6 leading-[1.05]">
            Healthcare that
            <br />moves with you
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-10">
            Securely manage your vaccination records across borders. Upload, translate, and verify.
          </p>
          <div className="space-y-3">
            {['HIPAA Compliant', '256-bit Encryption', 'AI-Powered Translation'].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-[#8aab45] rounded-full" />
                <span className="text-white/70 text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 bg-[#fbfbfd]">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8 lg:hidden">
            <Link to="/">
              <DozeyLogo className="h-16 mx-auto mb-4" />
            </Link>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-[#86868b] hover:text-[#1d1d1f] transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>

          <h1 className="text-3xl font-extrabold text-[#1d1d1f] mb-2">Welcome Back</h1>
          <p className="text-[#86868b] mb-8 text-sm">Sign in to access your health records</p>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-[#86868b] mb-2 uppercase tracking-wide">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-[#f5f5f7] border-0 rounded-xl focus:ring-2 focus:ring-[#4a7fb5]/20 outline-none transition-all text-sm text-[#1d1d1f] placeholder:text-[#86868b]/60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#86868b] mb-2 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-11 pr-12 py-3.5 bg-[#f5f5f7] border-0 rounded-xl focus:ring-2 focus:ring-[#4a7fb5]/20 outline-none transition-all text-sm text-[#1d1d1f] placeholder:text-[#86868b]/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4a7fb5] hover:bg-[#3d6a9e] text-white py-3.5 rounded-full font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm active:scale-[0.98]"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#86868b] text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#4a7fb5] hover:underline font-semibold">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
