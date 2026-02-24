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
      <div className="hidden lg:flex lg:w-1/2 bg-[#22283a] text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#1051a5]/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#26844f]/10 rounded-full blur-[80px]" />
        </div>
        <div className="relative flex flex-col justify-center px-16 max-w-lg">
          <DozeyLogo className="h-12 mb-12" theme="dark" />
          <h2 className="text-4xl font-extrabold mb-6 leading-[1.05]">
            Healthcare that
            <br />moves with you
          </h2>
          <p className="text-white/30 text-lg leading-relaxed mb-10">
            Securely manage your vaccination records across borders. Upload, translate, and verify.
          </p>
          <div className="space-y-3">
            {['HIPAA Compliant', '256-bit Encryption', 'AI-Powered Translation'].map((feature) => (
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

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#22283a] transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>

          <h1 className="text-3xl font-extrabold text-[#22283a] mb-2">Welcome back</h1>
          <p className="text-gray-400 mb-8 text-sm">Sign in to access your health records</p>

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
                  placeholder="Enter your password"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#22283a] hover:bg-[#1a1f2e] text-white py-3.5 rounded-full font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm active:scale-[0.98]"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#1051a5] hover:underline font-semibold">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
