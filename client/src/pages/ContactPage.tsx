import { useEffect, useState } from 'react';

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('is-visible');
      }),
      { threshold: 0.08 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

export function ContactPage() {
  useReveal();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in your name, email, and message.');
      return;
    }
    // In production this would POST to an API endpoint
    setSubmitted(true);
  };

  return (
    <div className="public-site">

      {/* HERO */}
      <section
        className="pt-36 pb-20 px-6 lg:px-16"
        style={{ background: '#000000' }}
      >
        <div className="max-w-5xl mx-auto">
          <span className="section-label">Contact</span>
          <h1
            className="heading-display mb-6"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', maxWidth: '600px' }}
          >
            We read every message.
          </h1>
          <p
            className="body-text"
            style={{ fontSize: '1.125rem', maxWidth: '480px' }}
          >
            Questions about the product, feedback, partnership inquiries, or just want to say hello — reach out. We are a small team and we respond personally.
          </p>
        </div>
      </section>

      {/* CONTACT FORM + INFO */}
      <section
        className="py-24 px-6 lg:px-16"
        style={{ background: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

            {/* Left — contact info (4 cols) */}
            <div className="lg:col-span-4 reveal-left">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: '#38D4B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Email</p>
                  <a
                    href="mailto:dozeyrecords@gmail.com"
                    className="body-text"
                    style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}
                  >
                    dozeyrecords@gmail.com
                  </a>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: '#38D4B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Based in</p>
                  <p className="body-text" style={{ fontSize: '1rem' }}>Davis, California</p>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: '#38D4B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Response time</p>
                  <p className="body-text" style={{ fontSize: '1rem' }}>Usually within 24 hours</p>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-3" style={{ color: '#38D4B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Good for</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[
                      'Product questions',
                      'Bug reports',
                      'University partnership inquiries',
                      'Press and media',
                      'General feedback',
                    ].map(item => (
                      <p key={item} className="body-text" style={{ fontSize: '0.9375rem' }}>{item}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right — form (8 cols) */}
            <div className="lg:col-span-8 reveal-right">
              {submitted ? (
                <div
                  style={{
                    padding: '3rem',
                    background: 'rgba(56,212,184,0.05)',
                    border: '1px solid rgba(56,212,184,0.15)',
                    borderRadius: '12px',
                  }}
                >
                  <h3 className="heading-section mb-3" style={{ fontSize: '1.375rem' }}>Message sent.</h3>
                  <p className="body-text" style={{ fontSize: '1rem' }}>
                    Thanks for reaching out. We will get back to you at {form.email} within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div>
                      <label
                        className="text-xs font-semibold"
                        style={{ display: 'block', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.5rem' }}
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Your name"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: '#FFFFFF',
                          fontSize: '0.9375rem',
                          outline: 'none',
                          fontFamily: 'inherit',
                          transition: 'border-color 200ms',
                        }}
                        onFocus={e => (e.target.style.borderColor = 'rgba(56,212,184,0.4)')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                      />
                    </div>
                    <div>
                      <label
                        className="text-xs font-semibold"
                        style={{ display: 'block', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.5rem' }}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="your@email.com"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: '#FFFFFF',
                          fontSize: '0.9375rem',
                          outline: 'none',
                          fontFamily: 'inherit',
                          transition: 'border-color 200ms',
                        }}
                        onFocus={e => (e.target.style.borderColor = 'rgba(56,212,184,0.4)')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className="text-xs font-semibold"
                      style={{ display: 'block', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.5rem' }}
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      placeholder="What is this about?"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '0.9375rem',
                        outline: 'none',
                        fontFamily: 'inherit',
                        transition: 'border-color 200ms',
                      }}
                      onFocus={e => (e.target.style.borderColor = 'rgba(56,212,184,0.4)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                    />
                  </div>
                  <div>
                    <label
                      className="text-xs font-semibold"
                      style={{ display: 'block', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.5rem' }}
                    >
                      Message
                    </label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us what you need..."
                      rows={6}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '0.9375rem',
                        outline: 'none',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        transition: 'border-color 200ms',
                      }}
                      onFocus={e => (e.target.style.borderColor = 'rgba(56,212,184,0.4)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                    />
                  </div>
                  {error && (
                    <p className="text-sm" style={{ color: '#EF4444' }}>{error}</p>
                  )}
                  <div>
                    <button type="submit" className="btn-primary">
                      Send message
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                        <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

export default ContactPage;
