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

  const inputBase = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'white',
  } as const;

  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: '#000000' }}
      >
        <div className="w-full max-w-sm">
          <Link to="/">
            <span className="block mb-8 hover:opacity-90 transition-opacity">
              <DozeyLogo className="h-12 mx-auto" theme="dark" />
            </span>
          </Link>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(56,212,184,0.15)', border: '1px solid rgba(56,212,184,0.3)' }}
          >
            <CheckCircle className="w-8 h-8" style={{ color: '#38D4B8' }} />
          </div>
          <h2
            className="text-2xl font-bold text-white mb-3"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Check your email
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
            We've sent a verification link to{' '}
            <strong className="text-white">{email}</strong>. Click the link to verify your account.
          </p>
          <Link to="/login">
            <span
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all cursor-pointer"
              style={{ background: '#38D4B8', color: '#0F1A22', fontFamily: "'Poppins', sans-serif" }}
            >
              Go to Sign In
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#000000' }}>

      {/* ── Left panel (desktop only) ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative overflow-hidden"
        style={{ background: 'rgba(0,0,0,0.98)', borderRight: '1px solid rgba(56,212,184,0.12)' }}
      >
        <div className="glow-orb w-[400px] h-[400px] bg-[#38D4B8] opacity-[0.06] top-[-100px] right-[-100px]" />
        <div className="relative z-10">
          <DozeyLogo className="h-12 mb-12" theme="dark" />
          <h2
            className="text-4xl font-black text-white mb-6 leading-tight"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Your health records,{' '}
            <span style={{ color: '#38D4B8' }}>unified.</span>
          </h2>
          <p className="text-lg leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Join the platform that helps international students manage vaccination records and meet US university health requirements.
          </p>
          <div className="space-y-3">
            {[
              'Free to create an account',
              'Upload records in any language',
              'AI-powered processing in under 2 minutes',
              'HIPAA-compliant and secure',
            ].map(feature => (
              <div key={feature} className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="#38D4B8" strokeWidth="2.5" className="w-4 h-4 flex-shrink-0">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div
        className="flex-1 flex items-center justify-center px-6 py-12"
        style={{ background: '#0A0A0A' }}
      >
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="text-center mb-8 lg:hidden">
            <Link to="/">
              <span className="block hover:opacity-90 transition-opacity">
                <DozeyLogo className="h-12 mx-auto mb-4" theme="dark" />
              </span>
            </Link>
          </div>

          <h1
            className="text-3xl font-black text-white mb-2"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Create account
          </h1>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Start managing your health records securely.
          </p>

          {error && (
            <div
              className="rounded-xl px-4 py-3 mb-6 text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all"
                  style={inputBase}
                  onFocus={e => (e.currentTarget.style.borderColor = '#38D4B8')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 8 chars, uppercase, number, special"
                  required
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all"
                  style={inputBase}
                  onFocus={e => (e.currentTarget.style.borderColor = '#38D4B8')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all"
                  style={inputBase}
                  onFocus={e => (e.currentTarget.style.borderColor = '#38D4B8')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                />
              </div>
            </div>

            <div
              className="flex items-start gap-3 p-4 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <input
                type="checkbox"
                id="tosAccepted"
                checked={tosAccepted}
                onChange={e => setTosAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded cursor-pointer"
                style={{ accentColor: '#38D4B8' }}
              />
              <label htmlFor="tosAccepted" className="text-xs leading-relaxed cursor-pointer" style={{ color: 'rgba(255,255,255,0.5)' }}>
                I agree to the{' '}
                <Link to="/terms" target="_blank">
                  <span className="font-semibold text-white hover:underline cursor-pointer">Terms of Service</span>
                </Link>
                {' '}and{' '}
                <Link to="/privacy" target="_blank">
                  <span className="font-semibold text-white hover:underline cursor-pointer">Privacy Policy</span>
                </Link>
                , including the HIPAA Notice of Privacy Practices.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !tosAccepted}
              className="w-full py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: '#38D4B8',
                color: '#0F1A22',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {loading ? 'Creating account…' : 'Create Account'}
              {!loading && <UserPlus className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Already have an account?{' '}
              <Link to="/login">
                <span className="font-semibold text-white hover:underline cursor-pointer">Sign In</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
