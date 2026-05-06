import { useState, useEffect } from 'react';

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
      { threshold: 0.1 }
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all required fields.');
      return;
    }
    await new Promise(r => setTimeout(r, 600));
    setSubmitted(true);
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white',
    borderRadius: '12px',
    padding: '12px 16px',
    width: '100%',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  } as const;

  return (
    <div className="public-site">
      {/* HERO */}
      <section className="relative pt-36 pb-24 px-6 lg:px-12 overflow-hidden" style={{ background: '#000000' }}>
        <div className="absolute inset-0 bg-grid-dots opacity-25 pointer-events-none" />
        <div className="glow-orb w-[500px] h-[500px] bg-[#38D4B8] opacity-[0.05] top-[-80px] right-[-80px]" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <span className="badge-teal mb-6 inline-flex wgb-fade-in">Contact Us</span>
          <h1
            className="text-5xl md:text-6xl font-black text-white mb-6 wgb-fade-up delay-100 leading-tight max-w-3xl"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            We would love to{' '}
            <span className="text-gradient">hear from you.</span>
          </h1>
          <p
            className="text-xl leading-relaxed wgb-fade-up delay-200 max-w-2xl"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            Whether you have a question about DOZEY, need help with your records, or want to partner with us — we are here.
          </p>
        </div>
      </section>

      {/* CONTACT METHODS */}
      <section className="section-dark py-16 px-6 lg:px-12" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
                title: 'Email',
                value: 'hello@dozey.app',
                desc: 'We respond within 24 hours on business days.',
              },
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
                title: 'Location',
                value: 'UC Davis, California',
                desc: 'Davis, CA 95616, United States',
              },
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
                title: 'Student Support',
                value: 'support@dozey.app',
                desc: 'For help with document processing or account issues.',
              },
            ].map(({ icon, title, value, desc }) => (
              <div key={title} className="oroswap-card reveal">
                <div className="icon-tile mb-5">{icon}</div>
                <h3
                  className="text-lg font-bold text-white mb-1"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {title}
                </h3>
                <p className="font-medium mb-1 text-sm" style={{ color: '#38D4B8' }}>{value}</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="section-black py-24 px-6 lg:px-12" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 reveal">
            <span className="badge-teal mb-5 inline-flex">Send a Message</span>
            <h2
              className="text-4xl font-black text-white"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Get in touch.
            </h2>
          </div>
          {submitted ? (
            <div
              className="rounded-2xl p-12 text-center reveal"
              style={{ background: '#111111', border: '1px solid rgba(56,212,184,0.2)' }}
            >
              <div
                className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ background: 'rgba(56,212,184,0.1)', border: '1px solid rgba(56,212,184,0.3)' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="#38D4B8" strokeWidth="2.5" className="w-8 h-8">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3
                className="text-2xl font-bold text-white mb-3"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Message Sent
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.5)' }}>
                Thank you for reaching out. We will get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl p-8 reveal space-y-5"
              style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {error && (
                <div
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5' }}
                >
                  {error}
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    Name <span style={{ color: '#38D4B8' }}>*</span>
                  </label>
                  <input
                    type="text" name="name" value={form.name} onChange={handleChange}
                    placeholder="Your name"
                    style={inputStyle}
                    className="placeholder-white/20"
                    onFocus={e => (e.currentTarget.style.borderColor = '#38D4B8')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    Email <span style={{ color: '#38D4B8' }}>*</span>
                  </label>
                  <input
                    type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="your@email.com"
                    style={inputStyle}
                    className="placeholder-white/20"
                    onFocus={e => (e.currentTarget.style.borderColor = '#38D4B8')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>Subject</label>
                <select
                  name="subject" value={form.subject} onChange={handleChange}
                  style={{ ...inputStyle, appearance: 'none' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#38D4B8')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                >
                  <option value="" style={{ background: '#111111' }}>Select a subject</option>
                  <option value="general" style={{ background: '#111111' }}>General Inquiry</option>
                  <option value="support" style={{ background: '#111111' }}>Technical Support</option>
                  <option value="partnership" style={{ background: '#111111' }}>Partnership / Institution</option>
                  <option value="press" style={{ background: '#111111' }}>Press / Media</option>
                  <option value="careers" style={{ background: '#111111' }}>Careers</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  Message <span style={{ color: '#38D4B8' }}>*</span>
                </label>
                <textarea
                  name="message" value={form.message} onChange={handleChange}
                  placeholder="How can we help you?"
                  rows={5}
                  style={{ ...inputStyle, resize: 'none' }}
                  className="placeholder-white/20"
                  onFocus={e => (e.currentTarget.style.borderColor = '#38D4B8')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
              <button type="submit" className="btn-primary w-full justify-center">
                Send Message
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                </svg>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
export default ContactPage;
