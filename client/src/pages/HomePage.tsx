import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import DozeyLogo from '@/components/DozeyLogo';

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

export function HomePage() {
  useReveal();

  const stats = [
    { value: '150+', label: 'Countries Served' },
    { value: '50K+', label: 'Records Processed' },
    { value: '99.8%', label: 'Accuracy Rate' },
    { value: '< 2min', label: 'Avg. Processing Time' },
  ];

  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
      ),
      title: 'AI-Powered Verification',
      desc: 'Advanced authenticity checks detect tampered or fraudulent documents before they enter your records.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
          <path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
        </svg>
      ),
      title: 'Instant Translation',
      desc: 'Translate vaccination records from 50+ languages into standardized English in under 2 minutes.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
          <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 00-1-1h-2a1 1 0 00-1 1v5m4 0H9"/>
        </svg>
      ),
      title: 'Compliance Checker',
      desc: 'Instantly verify if your immunization records meet requirements for any US university or institution.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
          <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
      ),
      title: 'HIPAA-Grade Security',
      desc: 'End-to-end encryption, row-level security, and full audit logging protect every record.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
          <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
        </svg>
      ),
      title: 'Unified PDF Export',
      desc: 'Merge all your health documents into a single, professionally formatted PDF for submission.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
          <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      title: 'Global Coverage',
      desc: 'Supports immunization record formats from 150+ countries with intelligent field mapping.',
    },
  ];

  const steps = [
    { num: '01', title: 'Upload Your Documents', desc: 'Drag and drop vaccination records, doctor notes, or any health document in any language or format.' },
    { num: '02', title: 'AI Processes & Verifies', desc: 'Our pipeline authenticates, translates, and extracts structured data from your documents in real time.' },
    { num: '03', title: 'Check Compliance', desc: 'Enter your target university or institution and instantly see which requirements you meet.' },
    { num: '04', title: 'Export & Submit', desc: 'Download a unified, formatted PDF ready for direct submission to your institution.' },
  ];

  const testimonials = [
    {
      quote: "DOZEY saved me weeks of back-and-forth with my university's health center. My records from Brazil were translated and verified in minutes.",
      name: 'Ana Souza',
      role: 'Graduate Student, UC Berkeley',
      initials: 'AS',
    },
    {
      quote: "As an international student advisor, I recommend DOZEY to every incoming student. The compliance checker alone is worth it.",
      name: 'Dr. James Park',
      role: 'Student Health Advisor, UCLA',
      initials: 'JP',
    },
    {
      quote: "The document verification feature gave our health center confidence that submitted records are authentic. It's transformed our intake process.",
      name: 'Maria Chen',
      role: 'Health Center Director, UC San Diego',
      initials: 'MC',
    },
  ];

  return (
    <div className="public-site bg-[#0A1428] min-h-screen text-white">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-grid-dots">
        {/* Glow orbs */}
        <div className="glow-orb w-[600px] h-[600px] bg-[#00D9A3] opacity-[0.07] top-[-100px] left-[-100px]" />
        <div className="glow-orb w-[500px] h-[500px] bg-[#00B4D8] opacity-[0.06] bottom-[-80px] right-[-80px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-20 w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="animate-fade-in-up mb-6">
              <span className="badge-teal">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                HIPAA Compliant · AI-Powered
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-up delay-100 text-5xl md:text-6xl lg:text-7xl font-black leading-[1.08] mb-6"
              style={{ fontFamily: "'Poppins', sans-serif" }}>
              Your Health Records,{' '}
              <span className="text-gradient">Anywhere in the World.</span>
            </h1>

            <p className="animate-fade-in-up delay-200 text-lg md:text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl">
              DOZEY translates, verifies, and standardizes international vaccination records so international students can meet US university health requirements — instantly.
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-4 mb-16">
              <Link to="/register">
                <button className="btn-teal text-base">
                  Get Started Free
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                </button>
              </Link>
              <Link to="/features">
                <button className="btn-ghost-teal text-base">
                  See How It Works
                </button>
              </Link>
            </div>

            {/* Trust strip */}
            <div className="animate-fade-in-up delay-400 flex flex-wrap items-center gap-6 text-sm text-slate-400">
              {['UC System Ready', 'HIPAA Compliant', '150+ Countries', 'No Credit Card'].map(t => (
                <span key={t} className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#00D9A3" strokeWidth="2.5" className="w-4 h-4 flex-shrink-0"><path d="M5 13l4 4L19 7"/></svg>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 border-y border-white/[0.06]" style={{ background: 'rgba(0,217,163,0.04)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={s.label} className={`text-center reveal delay-${i * 100 + 100}`}>
                <div className="text-4xl md:text-5xl font-black text-gradient mb-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}>{s.value}</div>
                <div className="text-slate-400 text-sm font-medium tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="badge-teal mb-4 inline-flex">Features</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Everything You Need,{' '}
              <span className="text-gradient">Nothing You Don't</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              A complete platform built specifically for international students navigating US health requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={f.title} className={`card-dark p-6 reveal delay-${(i % 3) * 100 + 100}`}>
                <div className="icon-tile mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6 lg:px-12" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="badge-teal mb-4 inline-flex">Process</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              From Upload to{' '}
              <span className="text-gradient">Submission in 4 Steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={s.num} className={`reveal delay-${i * 150 + 100}`}>
                <div className="text-6xl font-black text-gradient opacity-40 mb-4 leading-none"
                  style={{ fontFamily: "'Poppins', sans-serif" }}>{s.num}</div>
                <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 text-[#00D9A3] opacity-30">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="badge-teal mb-4 inline-flex">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Trusted by Students &{' '}
              <span className="text-gradient">Institutions</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={t.name} className={`card-dark p-8 reveal delay-${i * 150 + 100}`}>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} viewBox="0 0 24 24" fill="#00D9A3" className="w-4 h-4"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
                  ))}
                </div>
                <blockquote className="text-slate-300 text-sm leading-relaxed mb-6 italic">"{t.quote}"</blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D9A3] to-[#00B4D8] flex items-center justify-center text-[#0A1428] font-bold text-sm flex-shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-slate-500 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 lg:px-12 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F2A4A 0%, #0A1428 100%)' }}>
        <div className="glow-orb w-[400px] h-[400px] bg-[#00D9A3] opacity-[0.06] top-[-100px] right-[-100px]" />
        <div className="relative z-10 max-w-3xl mx-auto text-center reveal">
          <span className="badge-teal mb-6 inline-flex">Get Started</span>
          <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Ready to Simplify Your{' '}
            <span className="text-gradient">Health Records?</span>
          </h2>
          <p className="text-slate-300 text-lg mb-10">
            Join thousands of international students who have already streamlined their university health submissions with DOZEY.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <button className="btn-teal text-base">
                Create Free Account
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </button>
            </Link>
            <Link to="/contact">
              <button className="btn-ghost-teal text-base">Contact Us</button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
export default HomePage;
