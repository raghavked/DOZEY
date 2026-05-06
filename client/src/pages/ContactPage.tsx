import { useState } from 'react';
import { useEffect } from 'react';

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
    // In production this would POST to an API endpoint.
    // For now, simulate success after a short delay.
    await new Promise(r => setTimeout(r, 600));
    setSubmitted(true);
  }

  const contactMethods = [
    {
      icon: 'email',
      title: 'Email',
      value: 'hello@dozey.app',
      desc: 'We respond within 24 hours on business days.',
    },
    {
      icon: 'location',
      title: 'Location',
      value: 'UC Davis, California',
      desc: 'Davis, CA 95616, United States',
    },
    {
      icon: 'support',
      title: 'Student Support',
      value: 'support@dozey.app',
      desc: 'For help with document processing or account issues.',
    },
  ];

  return (
    <div className="public-site">
      {/* HERO — dark */}
      <section className="relative pt-36 pb-24 px-6 lg:px-12 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A3A4F 0%, #1E4A63 60%, #152E40 100%)' }}>
        <div className="absolute inset-0 bg-grid-dots opacity-40" />
        <div className="glow-orb w-[400px] h-[400px] bg-[#38D4B8] opacity-[0.07] top-[-60px] right-[-60px]" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <span className="badge-teal mb-5 inline-flex animate-fade-in">Contact Us</span>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 animate-fade-in-up leading-tight max-w-3xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
            We would love to{' '}
            <span className="text-gradient">hear from you.</span>
          </h1>
          <p className="text-slate-300 text-xl leading-relaxed animate-fade-in-up delay-200 max-w-2xl">
            Whether you have a question about DOZEY, need help with your records, or want to partner with us — we are here.
          </p>
        </div>
      </section>

      {/* CONTACT METHODS — light */}
      <section className="section-light py-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactMethods.map(({ icon, title, value, desc }) => (
              <div key={title} className="card-light p-7 reveal">
                <div className="icon-tile mb-5">
                  {icon === 'email' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                  {icon === 'location' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                  {icon === 'support' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                </div>
                <h3 className="text-lg font-bold mb-1" style={{ fontFamily: "'Poppins', sans-serif", color: '#0F1A22' }}>{title}</h3>
                <p className="font-medium mb-1" style={{ color: '#38D4B8' }}>{value}</p>
                <p className="text-sm" style={{ color: '#6B7280' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT FORM — dark */}
      <section className="section-dark py-24 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 reveal">
            <span className="badge-teal mb-4 inline-flex">Send a Message</span>
            <h2 className="text-4xl font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Get in touch.
            </h2>
          </div>
          {submitted ? (
            <div className="card-dark p-12 text-center reveal">
              <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(56,212,184,0.15)', border: '1px solid rgba(56,212,184,0.3)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#38D4B8" strokeWidth="2.5" className="w-8 h-8"><path d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>Message Sent</h3>
              <p className="text-white/60">Thank you for reaching out. We will get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card-dark p-8 reveal space-y-5">
              {error && (
                <div className="rounded-lg px-4 py-3 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5' }}>
                  {error}
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Name <span className="text-[#38D4B8]">*</span></label>
                  <input
                    type="text" name="name" value={form.name} onChange={handleChange}
                    placeholder="Your name"
                    className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Email <span className="text-[#38D4B8]">*</span></label>
                  <input
                    type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Subject</label>
                <select
                  name="subject" value={form.subject} onChange={handleChange}
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <option value="" style={{ background: '#1A3A4F' }}>Select a subject</option>
                  <option value="general" style={{ background: '#1A3A4F' }}>General Inquiry</option>
                  <option value="support" style={{ background: '#1A3A4F' }}>Technical Support</option>
                  <option value="partnership" style={{ background: '#1A3A4F' }}>Partnership / Institution</option>
                  <option value="press" style={{ background: '#1A3A4F' }}>Press / Media</option>
                  <option value="careers" style={{ background: '#1A3A4F' }}>Careers</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Message <span className="text-[#38D4B8]">*</span></label>
                <textarea
                  name="message" value={form.message} onChange={handleChange}
                  placeholder="How can we help you?"
                  rows={5}
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all resize-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>
              <button type="submit" className="btn-primary w-full justify-center">
                Send Message
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" /></svg>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
export default ContactPage;
