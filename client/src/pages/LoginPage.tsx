import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DozeyLogo from '@/components/DozeyLogo';
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
    <div className="min-h-screen flex" style={{ background: '#0A1428' }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12" style={{ background: '#060D1A', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
        <DozeyLogo className="h-16" />
        <div>
          <blockquote className="text-xl font-light leading-relaxed mb-6 italic" style={{ color: '#CBD5E1' }}>
            "DOZEY made it possible for me to start school on time. My records were in three languages — they handled it all."
          </blockquote>
          <div>
            <div className="font-semibold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Priya S.</div>
            <div className="text-sm" style={{ color: '#00D9A3' }}>UC Davis, Class of 2027</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: '#475569' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#00D9A3" strokeWidth="2" className="w-4 h-4">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          HIPAA Compliant · AES-256 Encrypted
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-10 flex justify-center">
            <DozeyLogo className="h-14" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Welcome back</h1>
          <p className="text-sm mb-8" style={{ color: '#94A3B8' }}>Sign in to your DOZEY account.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg p-4 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171' }}>{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#94A3B8' }}>Email address</label>
              <input
                type="email" required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg px-4 py-3 text-white text-sm outline-none transition-colors"
                style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                onFocus={e => (e.target.style.borderColor = '#00D9A3')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#94A3B8' }}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg px-4 py-3 pr-12 text-white text-sm outline-none transition-colors"
                  style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => (e.target.style.borderColor = '#00D9A3')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#64748B' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full font-semibold py-3.5 rounded-lg transition-all text-sm"
              style={{ background: loading ? '#00A882' : '#00D9A3', color: '#0A1428', opacity: loading ? 0.8 : 1, fontFamily: "'Poppins', sans-serif" }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm mt-8" style={{ color: '#64748B' }}>
            Don't have an account?{' '}
            <Link to="/register">
              <a className="font-medium hover:underline" style={{ color: '#00D9A3' }}>Sign up</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
