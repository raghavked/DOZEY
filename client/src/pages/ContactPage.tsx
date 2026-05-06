import { useState, useEffect } from 'react';

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
      { threshold: 0.12 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

export function ContactPage() {
  useReveal();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="public-site bg-[#0A1428] min-h-screen text-white">

      {/* Hero */}
      <section className="relative pt-36 pb-20 px-6 lg:px-12 overflow-hidden bg-grid-dots">
        <div className="glow-orb w-[400px] h-[400px] bg-[#00D9A3] opacity-[0.06] top-[-60px] left-[-60px]" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <span className="badge-teal mb-5 inline-flex animate-fade-in-up">Contact</span>
          <h1 className="text-5xl md:text-6xl font-black mb-6 animate-fade-in-up delay-100 leading-tight max-w-3xl"
            style={{ fontFamily: "'Poppins', sans-serif" }}>
            We'd love to{' '}
            <span className="text-gradient">hear from you.</span>
          </h1>
          <p className="text-slate-300 text-xl leading-relaxed animate-fade-in-up delay-200 max-w-2xl">
            Questions about DOZEY, partnership opportunities, or just want to say hello — we respond to every message.
          </p>
        </div>
      </section>

      {/* Contact section */}
      <section className="py-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-12">

          {/* Info sidebar */}
          <div className="md:col-span-2 reveal-left">
            <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>Get in touch</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="icon-tile flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-white font-semibold mb-1">Email</div>
                  <a href="mailto:team@dozey.com" className="text-[#00D9A3] text-sm hover:text-white transition-colors">team@dozey.com</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="icon-tile flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-white font-semibold mb-1">Response Time</div>
                  <div className="text-slate-400 text-sm">Within 24 hours on business days</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="icon-tile flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-white font-semibold mb-1">Based at</div>
                  <div className="text-slate-400 text-sm">UC Davis, California</div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="text-white font-semibold mb-4">Connect with the team</div>
              <div className="flex flex-col gap-3">
                {[
                  { name: 'Aashreeti Deo', url: 'https://www.linkedin.com/in/aashreeti-deo/' },
                  { name: 'Isaac Karottu', url: 'https://www.linkedin.com/in/isaac-karottu-95242b2b3/' },
                  { name: 'Raghav Kedia', url: 'https://www.linkedin.com/in/raghav-kedia-169a42279/' },
                ].map(p => (
                  <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-400 text-sm hover:text-[#00D9A3] transition-colors">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    {p.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3 reveal-right">
            {submitted ? (
              <div className="card-dark p-10 text-center h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#00D9A3]/10 border border-[#00D9A3]/25 flex items-center justify-center mb-6">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#00D9A3" strokeWidth="2.5" className="w-8 h-8"><path d="M5 13l4 4L19 7"/></svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>Message Sent!</h3>
                <p className="text-slate-400">Thanks for reaching out. We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card-dark p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                    <input
                      type="text" required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Your name"
                      className="w-full bg-[#0A1428] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#00D9A3] focus:ring-1 focus:ring-[#00D9A3]/30 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                    <input
                      type="email" required
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="w-full bg-[#0A1428] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#00D9A3] focus:ring-1 focus:ring-[#00D9A3]/30 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                  <input
                    type="text" required
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    placeholder="How can we help?"
                    className="w-full bg-[#0A1428] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#00D9A3] focus:ring-1 focus:ring-[#00D9A3]/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                  <textarea
                    required rows={6}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us more..."
                    className="w-full bg-[#0A1428] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#00D9A3] focus:ring-1 focus:ring-[#00D9A3]/30 transition-colors resize-none"
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-teal w-full justify-center">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      Sending...
                    </span>
                  ) : (
                    <>
                      Send Message
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
export default ContactPage;
