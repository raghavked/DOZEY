import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

/* ── Scroll-reveal hook ── */
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

/* ── AI Demo chat simulation (OroSwap-inspired) ── */
type ChatRole = 'user' | 'ai';
interface ChatMsg { role: ChatRole; text: string; delay: number; }

const DEMO_SCRIPT: ChatMsg[] = [
  { role: 'user', text: 'I have a vaccination record from Brazil. Can DOZEY process it?', delay: 0 },
  { role: 'ai',   text: 'Absolutely. Upload your document and our AI will authenticate it, extract all vaccination data, and translate it from Portuguese to English — typically in under 2 minutes.', delay: 1200 },
  { role: 'user', text: 'Will it work for UC Davis health requirements?', delay: 2800 },
  { role: 'ai',   text: 'Yes. DOZEY includes a built-in compliance checker for UC Davis and all other UC System campuses. After processing, you\'ll see exactly which requirements are met and which still need documentation.', delay: 4200 },
  { role: 'user', text: 'Can I export everything as one PDF?', delay: 5800 },
  { role: 'ai',   text: 'Yes — once all your records are verified, you can generate a single formatted PDF combining all documents, ready for direct submission to your university health center.', delay: 7200 },
];

function AiDemoChat() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [typing, setTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          DEMO_SCRIPT.forEach((msg, i) => {
            setTimeout(() => {
              if (msg.role === 'ai') {
                setTyping(true);
                setTimeout(() => { setTyping(false); setVisibleCount(i + 1); }, 900);
              } else {
                setVisibleCount(i + 1);
              }
            }, msg.delay);
          });
        }
      },
      { threshold: 0.3 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const visible = DEMO_SCRIPT.slice(0, visibleCount);

  return (
    <div
      ref={containerRef}
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(26,58,79,0.95)',
        border: '1px solid rgba(56,212,184,0.2)',
        boxShadow: '0 32px 80px rgba(26,58,79,0.4)',
      }}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-5 py-3.5" style={{ borderBottom: '1px solid rgba(56,212,184,0.12)', background: 'rgba(26,58,79,0.6)' }}>
        <span className="w-3 h-3 rounded-full bg-red-400 opacity-70" />
        <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-70" />
        <span className="w-3 h-3 rounded-full bg-green-400 opacity-70" />
        <span className="ml-3 text-xs text-white/40 font-mono">DOZEY AI Assistant</span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38D4B8] animate-pulse" />
          <span className="text-xs text-[#38D4B8]">Live</span>
        </span>
      </div>
      {/* Messages */}
      <div className="p-5 space-y-4 min-h-[320px] flex flex-col justify-end">
        {visible.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-chat-slide`}>
            {msg.role === 'ai' && (
              <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5" style={{ background: 'rgba(56,212,184,0.2)', border: '1px solid rgba(56,212,184,0.3)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#38D4B8" strokeWidth="2" className="w-3.5 h-3.5">
                  <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                </svg>
              </div>
            )}
            <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>{msg.text}</div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start animate-chat-slide">
            <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2 flex-shrink-0" style={{ background: 'rgba(56,212,184,0.2)', border: '1px solid rgba(56,212,184,0.3)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#38D4B8" strokeWidth="2" className="w-3.5 h-3.5">
                <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
              </svg>
            </div>
            <div className="chat-bubble-ai flex items-center gap-1.5">
              <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
            </div>
          </div>
        )}
      </div>
      {/* Input bar */}
      <div className="px-5 py-4 flex items-center gap-3" style={{ borderTop: '1px solid rgba(56,212,184,0.12)' }}>
        <div className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white/30" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          Ask DOZEY anything about your health records…
        </div>
        <button className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#38D4B8' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#1A3A4F" strokeWidth="2.5" className="w-4 h-4">
            <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ── Animated stat ── */
function StatCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="stat-number mb-1">{value}</div>
      <div className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>{label}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
══════════════════════════════════════════════════════════════ */
export function HomePage() {
  useReveal();

  const features = [
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
      title: 'AI-Powered Verification',
      desc: 'Advanced authenticity checks detect tampered or fraudulent documents before they enter your records.',
    },
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>,
      title: 'Instant Translation',
      desc: 'Translate vaccination records from 50+ languages into standardized English in under 2 minutes.',
    },
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 00-1-1h-2a1 1 0 00-1 1v5m4 0H9" /></svg>,
      title: 'Compliance Checker',
      desc: 'Instantly verify if your immunization records meet requirements for any US university or institution.',
    },
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
      title: 'HIPAA-Grade Security',
      desc: 'End-to-end encryption, row-level security, and full audit logging protect every record.',
    },
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
      title: 'Unified PDF Export',
      desc: 'Merge all your health documents into a single, professionally formatted PDF for submission.',
    },
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
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
      role: 'International Student Advisor, UCLA',
      initials: 'JP',
    },
  ];

  return (
    <div className="public-site">

      {/* ══ HERO — dark #1A3A4F background ══ */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1A3A4F 0%, #1E4A63 50%, #152E40 100%)' }}
      >
        <div className="absolute inset-0 bg-grid-dots opacity-40" />
        <div className="glow-orb w-[600px] h-[600px] bg-[#38D4B8] opacity-[0.07] top-[-100px] right-[-100px]" />
        <div className="glow-orb w-[400px] h-[400px] bg-[#38D4B8] opacity-[0.05] bottom-[-80px] left-[-80px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <div>
              <span className="badge-teal mb-6 inline-flex animate-fade-in">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI-Powered Health Records
              </span>
              <h1
                className="text-5xl md:text-6xl font-black text-white mb-6 animate-fade-in-up leading-tight"
                style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: '-0.03em' }}
              >
                Your health records,{' '}
                <span className="text-gradient">anywhere in the world.</span>
              </h1>
              <p className="text-lg text-white/70 leading-relaxed mb-10 animate-fade-in-up delay-200 max-w-lg">
                DOZEY translates, verifies, and organizes international vaccination records for US university submission — in under 2 minutes.
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in-up delay-300">
                <Link to="/register">
                  <span className="btn-primary cursor-pointer">
                    Get Started Free
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                      <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                <Link to="/features">
                  <span className="btn-secondary cursor-pointer">See How It Works</span>
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-6 mt-10 animate-fade-in-up delay-400">
                {['HIPAA-compliant', '150+ countries supported', 'Results in under 2 minutes'].map(t => (
                  <div key={t} className="flex items-center gap-2 text-white/50 text-sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#38D4B8" strokeWidth="2.5" className="w-4 h-4 flex-shrink-0">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    {t}
                  </div>
                ))}
              </div>
            </div>
            {/* Right: AI demo */}
            <div className="animate-fade-in-right delay-300">
              <AiDemoChat />
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS — dark section ══ */}
      <section className="section-dark py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter value="150+" label="Countries Served" />
            <StatCounter value="50K+" label="Records Processed" />
            <StatCounter value="99.8%" label="Accuracy Rate" />
            <StatCounter value="< 2 min" label="Avg. Processing Time" />
          </div>
        </div>
      </section>

      {/* ══ FEATURES — light background ══ */}
      <section className="section-light py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="badge-dark mb-4 inline-flex">Platform Features</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-5" style={{ fontFamily: "'Poppins', sans-serif", color: '#0F1A22' }}>
              Everything you need,{' '}
              <span className="text-gradient">nothing you don't.</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#6B7280' }}>
              Built specifically for international students navigating US university health requirements.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon, title, desc }, i) => (
              <div key={title} className={`card-light p-7 reveal delay-${(i % 3) * 100 + 100}`}>
                <div className="icon-tile mb-5">{icon}</div>
                <h3 className="text-lg font-bold mb-3" style={{ fontFamily: "'Poppins', sans-serif", color: '#0F1A22' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS — dark background ══ */}
      <section className="section-dark py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="badge-teal mb-4 inline-flex">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>
              From upload to submission{' '}
              <span className="text-gradient">in 4 steps.</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-white/60">
              Our AI pipeline handles the complexity so you can focus on what matters.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ num, title, desc }, i) => (
              <div key={num} className={`card-dark p-7 reveal delay-${i * 100 + 100}`}>
                <div className="text-5xl font-black mb-5 leading-none" style={{ fontFamily: "'Poppins', sans-serif", color: 'rgba(56,212,184,0.25)' }}>{num}</div>
                <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>{title}</h3>
                <p className="text-sm leading-relaxed text-white/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS — alt light background ══ */}
      <section className="section-alt py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="badge-dark mb-4 inline-flex">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-5" style={{ fontFamily: "'Poppins', sans-serif", color: '#0F1A22' }}>
              Trusted by students{' '}
              <span className="text-gradient">worldwide.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map(({ quote, name, role, initials }, i) => (
              <div key={name} className={`card-light p-8 reveal delay-${i * 150 + 100}`}>
                <div className="text-5xl font-black leading-none mb-4" style={{ color: '#38D4B8', fontFamily: 'Georgia, serif' }}>"</div>
                <p className="text-base leading-relaxed mb-6" style={{ color: '#374151' }}>{quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1A3A4F, #38D4B8)' }}>
                    {initials}
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: '#0F1A22', fontFamily: "'Poppins', sans-serif" }}>{name}</div>
                    <div className="text-xs" style={{ color: '#6B7280' }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA — dark background ══ */}
      <section className="section-dark py-24 px-6 lg:px-12 relative overflow-hidden">
        <div className="glow-orb w-[500px] h-[500px] bg-[#38D4B8] opacity-[0.06] top-[-100px] right-[-100px]" />
        <div className="relative z-10 max-w-3xl mx-auto text-center reveal">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Ready to simplify your{' '}
            <span className="text-gradient">health records?</span>
          </h2>
          <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
            Join thousands of international students who have already used DOZEY to meet their university health requirements.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <span className="btn-primary cursor-pointer">
                Create Your Account
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link to="/contact">
              <span className="btn-secondary cursor-pointer">Talk to Us</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default HomePage;
