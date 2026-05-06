import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

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
  { role: 'ai',   text: "Yes. DOZEY includes a built-in compliance checker for UC Davis and all other UC System campuses. After processing, you'll see exactly which requirements are met and which still need documentation.", delay: 4200 },
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
        background: '#111111',
        border: '1px solid rgba(56,212,184,0.2)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(56,212,184,0.05)',
      }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center gap-2 px-5 py-3.5"
        style={{ borderBottom: '1px solid rgba(56,212,184,0.1)', background: 'rgba(0,0,0,0.4)' }}
      >
        <span className="w-3 h-3 rounded-full bg-red-500 opacity-70" />
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
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(56,212,184,0.15)', border: '1px solid rgba(56,212,184,0.3)' }}
              >
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
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center mr-2 flex-shrink-0"
              style={{ background: 'rgba(56,212,184,0.15)', border: '1px solid rgba(56,212,184,0.3)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#38D4B8" strokeWidth="2" className="w-3.5 h-3.5">
                <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
              </svg>
            </div>
            <div className="chat-bubble-ai flex items-center gap-1.5 py-3">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Animated stat counter ── */
function StatCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1800;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current = Math.min(current + increment, target);
          setCount(Math.floor(current));
          if (current >= target) clearInterval(timer);
        }, duration / steps);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return <div ref={ref} className="stat-number">{count.toLocaleString()}{suffix}</div>;
}

/* ── Feature card data ── */
const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Multilingual OCR',
    desc: 'Extract vaccination data from documents in any language — including handwritten records from 150+ countries.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
    title: 'AI Translation',
    desc: 'Powered by DeepL and GPT-4o-mini, translations are medically accurate and preserve all clinical terminology.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Authenticity Verification',
    desc: 'AI-powered document verification detects inconsistencies, missing data, and potential forgeries before submission.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: 'University Compliance',
    desc: 'Built-in requirement database for 200+ US universities. Instantly see which vaccinations are missing or expired.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'HIPAA-Compliant Storage',
    desc: 'AES-256 encryption at rest and in transit. Row-level security. Full audit logging. Your data stays yours.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
    title: 'Secure Sharing',
    desc: 'Generate time-limited encrypted share links to send verified records directly to university health centers.',
  },
];

/* ── How it works steps ── */
const steps = [
  { num: '01', title: 'Upload', desc: 'Drag and drop your vaccination documents in any format — PDF, photo, or scan — in any language.' },
  { num: '02', title: 'Process', desc: 'Our AI extracts, translates, and verifies your records against medical standards in under 2 minutes.' },
  { num: '03', title: 'Check', desc: 'See exactly which university requirements you meet and which vaccinations still need documentation.' },
  { num: '04', title: 'Submit', desc: 'Export a single formatted PDF or share a secure link directly with your university health center.' },
];

/* ── Main component ── */
export function HomePage() {
  useReveal();

  return (
    <div className="public-site">

      {/* ══════════════════════════════════════════════════════
          HERO — pure black, WGB page-load animations
      ══════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex items-center pt-20 pb-16 px-6 lg:px-12 overflow-hidden"
        style={{ background: '#000000' }}
      >
        {/* Background elements */}
        <div className="absolute inset-0 bg-grid-dots opacity-30 pointer-events-none" />
        <div className="glow-orb w-[600px] h-[600px] bg-[#38D4B8] opacity-[0.04] top-[-100px] right-[-100px]" />
        <div className="glow-orb w-[400px] h-[400px] bg-[#38D4B8] opacity-[0.03] bottom-[-50px] left-[-100px]" />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — copy */}
            <div>
              <span className="badge-teal mb-6 inline-flex wgb-fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38D4B8] animate-pulse" />
                AI-Powered Health Records
              </span>
              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6 wgb-fade-up delay-100"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Your health records,{' '}
                <span className="text-gradient">any language.</span>
              </h1>
              <p
                className="text-lg md:text-xl leading-relaxed mb-10 wgb-fade-up delay-200"
                style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '520px' }}
              >
                DOZEY translates, verifies, and formats international vaccination records for US university submission — in under 2 minutes.
              </p>
              <div className="flex flex-wrap gap-4 wgb-fade-up delay-300">
                <Link to="/register">
                  <span className="btn-primary cursor-pointer text-base px-8 py-4">
                    Get Started Free
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                      <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                <Link to="/features">
                  <span className="btn-outline cursor-pointer text-base px-8 py-4">
                    See How It Works
                  </span>
                </Link>
              </div>
              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-6 mt-10 wgb-fade-up delay-400">
                {[
                  { icon: '🔒', label: 'HIPAA Compliant' },
                  { icon: '🌍', label: '150+ Countries' },
                  { icon: '⚡', label: 'Under 2 Minutes' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-base">{icon}</span>
                    <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — AI demo chat */}
            <div className="wgb-slide-right delay-200">
              <AiDemoChat />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STATS — dark gray section
      ══════════════════════════════════════════════════════ */}
      <section className="section-dark py-16 px-6 lg:px-12" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { target: 50000, suffix: '+', label: 'Documents Processed' },
              { target: 150, suffix: '+', label: 'Countries Represented' },
              { target: 200, suffix: '+', label: 'Universities Supported' },
              { target: 99, suffix: '.8%', label: 'Verification Accuracy' },
            ].map(({ target, suffix, label }) => (
              <div key={label} className="reveal">
                <StatCounter target={target} suffix={suffix} />
                <div className="text-sm font-medium mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURES — pure black, OroSwap interactive cards
      ══════════════════════════════════════════════════════ */}
      <section className="section-black py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="badge-teal mb-5 inline-flex">Features</span>
            <h2
              className="text-4xl md:text-5xl font-black text-white mb-5"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Everything you need to{' '}
              <span className="text-gradient">get compliant.</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
              From multilingual OCR to HIPAA-compliant storage, DOZEY handles every step of the process.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon, title, desc }, i) => (
              <div key={title} className={`oroswap-card reveal delay-${(i % 3) * 100 + 100}`}>
                <div className="icon-tile mb-5">{icon}</div>
                <h3
                  className="text-lg font-bold text-white mb-3"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS — dark gray, numbered steps
      ══════════════════════════════════════════════════════ */}
      <section className="section-dark py-24 px-6 lg:px-12" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="badge-teal mb-5 inline-flex">How It Works</span>
            <h2
              className="text-4xl md:text-5xl font-black text-white mb-5"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              From upload to submission{' '}
              <span className="text-gradient">in 4 steps.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ num, title, desc }, i) => (
              <div key={num} className={`oroswap-card reveal delay-${i * 100 + 100}`}>
                <div
                  className="text-5xl font-black mb-4 leading-none"
                  style={{ color: 'rgba(56,212,184,0.2)', fontFamily: "'Poppins', sans-serif" }}
                >
                  {num}
                </div>
                <h3
                  className="text-lg font-bold text-white mb-3"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PROBLEM / SOLUTION — pure black
      ══════════════════════════════════════════════════════ */}
      <section className="section-black py-24 px-6 lg:px-12" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="reveal-left">
              <span className="badge-teal mb-5 inline-flex">The Problem</span>
              <h2
                className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                International students deserve{' '}
                <span className="text-gradient">better.</span>
              </h2>
              <div className="space-y-4">
                {[
                  'Vaccination records in foreign languages are rejected by US university health centers',
                  'Certified translations cost $50–$200 per document and take 1–3 weeks',
                  'Students miss enrollment deadlines due to administrative delays',
                  'No standardized format exists for international health records',
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" className="w-3 h-3">
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{point}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal-right">
              <span className="badge-teal mb-5 inline-flex">The DOZEY Solution</span>
              <h2
                className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Fast, accurate,{' '}
                <span className="text-gradient">and free.</span>
              </h2>
              <div className="space-y-4">
                {[
                  'AI processes documents from 150+ countries in any language',
                  'Medically accurate translations in under 2 minutes',
                  'Built-in compliance checking for 200+ US universities',
                  'HIPAA-compliant storage and secure sharing',
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(56,212,184,0.15)', border: '1px solid rgba(56,212,184,0.3)' }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="#38D4B8" strokeWidth="2.5" className="w-3 h-3">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA — teal accent section
      ══════════════════════════════════════════════════════ */}
      <section
        className="py-24 px-6 lg:px-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0A1A14 0%, #0D2018 50%, #000000 100%)', borderTop: '1px solid rgba(56,212,184,0.1)' }}
      >
        <div className="glow-orb w-[500px] h-[500px] bg-[#38D4B8] opacity-[0.06] top-[-100px] left-1/2 -translate-x-1/2" />
        <div className="relative z-10 max-w-3xl mx-auto text-center reveal">
          <span className="badge-teal mb-6 inline-flex">Get Started Today</span>
          <h2
            className="text-4xl md:text-5xl font-black text-white mb-6"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Start for free.{' '}
            <span className="text-gradient">No credit card required.</span>
          </h2>
          <p className="text-lg mb-10" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Join thousands of international students who have already simplified their university health submissions with DOZEY.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register">
              <span className="btn-primary cursor-pointer text-base px-10 py-4">
                Create Free Account
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link to="/features">
              <span className="btn-outline cursor-pointer text-base px-10 py-4">
                Learn More
              </span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default HomePage;
