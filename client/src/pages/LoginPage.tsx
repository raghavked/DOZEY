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

  const inputBase = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'white',
  } as const;

  return (
    <div className="min-h-screen flex" style={{ background: '#000000' }}>

      {/* ── Left panel (desktop only) ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ background: 'rgba(0,0,0,0.98)', borderRight: '1px solid rgba(56,212,184,0.12)' }}
      >
        <Link to="/">
          <DozeyLogo className="h-12" theme="dark" />
        </Link>
        <div>
          <div
            className="text-4xl font-black leading-none mb-4"
            style={{ color: 'rgba(56,212,184,0.2)', fontFamily: "'Poppins', sans-serif" }}
          >
            "
          </div>
          <blockquote
            className="text-xl font-light leading-relaxed mb-6"
            style={{ color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}
          >
            DOZEY made it possible for me to start school on time. My records were in three languages — they handled it all.
          </blockquote>
          <div>
            <div className="font-semibold text-white text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Priya S.</div>
            <div className="text-sm" style={{ color: '#38D4B8' }}>UC Davis, Class of 2027</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#38D4B8" strokeWidth="2" className="w-4 h-4">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          HIPAA Compliant · AES-256 Encrypted
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div
        className="flex-1 flex items-center justify-center p-8"
        style={{ background: '#0A0A0A' }}
      >
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 flex justify-center">
            <DozeyLogo className="h-12" theme="dark" />
          </div>

          <h1
            className="text-3xl font-black text-white mb-2"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Welcome back
          </h1>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Sign in to your DOZEY account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                className="rounded-xl p-4 text-sm"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5' }}
              >
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Email address
              </label>
              <input
                type="email" required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder-white/30"
                style={inputBase}
                onFocus={e => (e.currentTarget.style.borderColor = '#38D4B8')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl px-4 py-3 pr-12 text-white text-sm outline-none transition-all placeholder-white/30"
                  style={inputBase}
                  onFocus={e => (e.currentTarget.style.borderColor = '#38D4B8')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-semibold py-3.5 rounded-xl transition-all text-sm"
              style={{
                background: loading ? 'rgba(56,212,184,0.7)' : '#38D4B8',
                color: '#0F1A22',
                fontFamily: "'Poppins', sans-serif",
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm mt-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Don't have an account?{' '}
            <Link to="/register">
              <span className="font-medium hover:underline cursor-pointer" style={{ color: '#38D4B8' }}>Sign up</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
