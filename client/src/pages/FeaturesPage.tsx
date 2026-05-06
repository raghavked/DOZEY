import { Link } from 'react-router-dom';
import { useEffect } from 'react';

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

export function FeaturesPage() {
  useReveal();

  const pipeline = [
    {
      num: '01',
      title: 'Upload Any Document',
      desc: 'Drag and drop vaccination cards, immunization records, doctor notes, or any health document. We accept PDF, JPG, PNG, and HEIC formats from any country.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
          <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
        </svg>
      ),
    },
    {
      num: '02',
      title: 'AI Verification & OCR',
      desc: 'Our AI pipeline authenticates document legitimacy, extracts text via Mistral OCR, and flags any anomalies — preventing fraudulent records from entering the system.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
      ),
    },
    {
      num: '03',
      title: 'Translation & Parsing',
      desc: 'DeepL translates content from 50+ languages. GPT-4 then parses and structures the data — extracting vaccine names, dates, doses, and provider information.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
          <path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
        </svg>
      ),
    },
    {
      num: '04',
      title: 'Compliance Check',
      desc: 'Enter your target university or institution. Our engine cross-references your records against the institution\'s specific immunization requirements and returns a detailed gap analysis.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
        </svg>
      ),
    },
  ];

  const capabilities = [
    { title: 'Mistral OCR Engine', desc: 'Industry-leading optical character recognition for handwritten and printed records.' },
    { title: 'DeepL Translation', desc: '50+ language pairs with medical terminology accuracy.' },
    { title: 'GPT-4 Parsing', desc: 'Intelligent extraction of structured data from unstructured documents.' },
    { title: 'Document Authenticity AI', desc: 'Multi-signal fraud detection using visual and semantic analysis.' },
    { title: 'UC System Database', desc: 'Pre-loaded requirements for all 9 UC campuses and 100+ other institutions.' },
    { title: 'PDF Merge & Export', desc: 'Professional unified PDF generation ready for institutional submission.' },
    { title: 'HIPAA Encryption', desc: 'AES-256 encryption at rest and in transit for all health data.' },
    { title: 'Audit Logging', desc: 'Complete immutable audit trail of all document access and changes.' },
    { title: 'Row-Level Security', desc: 'Supabase RLS ensures users can only access their own records.' },
  ];

  return (
    <div className="public-site bg-[#0A1428] min-h-screen text-white">

      {/* Hero */}
      <section className="relative pt-36 pb-20 px-6 lg:px-12 overflow-hidden bg-grid-dots">
        <div className="glow-orb w-[500px] h-[500px] bg-[#00D9A3] opacity-[0.06] top-[-80px] right-[-80px]" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <span className="badge-teal mb-5 inline-flex animate-fade-in-up">Platform Features</span>
            <h1 className="text-5xl md:text-6xl font-black mb-6 animate-fade-in-up delay-100 leading-tight"
              style={{ fontFamily: "'Poppins', sans-serif" }}>
              Built for the{' '}
              <span className="text-gradient">Global Student</span>
            </h1>
            <p className="text-slate-300 text-xl leading-relaxed animate-fade-in-up delay-200 mb-8">
              Every feature in DOZEY was designed to solve a real problem faced by international students navigating US university health requirements.
            </p>
            <Link to="/register">
              <button className="btn-teal animate-fade-in-up delay-300">
                Get Started Free
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </button>
            </Link>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Pipeline */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="badge-teal mb-4 inline-flex">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: "'Poppins', sans-serif" }}>
              The DOZEY <span className="text-gradient">Pipeline</span>
            </h2>
          </div>

          <div className="space-y-8">
            {pipeline.map((step, i) => (
              <div key={step.num} className={`card-dark p-8 flex flex-col md:flex-row gap-6 items-start ${i % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}>
                <div className="flex-shrink-0">
                  <div className="text-5xl font-black text-gradient opacity-30 leading-none mb-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}>{step.num}</div>
                  <div className="icon-tile">{step.icon}</div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Capabilities grid */}
      <section className="py-24 px-6 lg:px-12" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="badge-teal mb-4 inline-flex">Technology</span>
            <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Powered by <span className="text-gradient">Best-in-Class AI</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {capabilities.map((c, i) => (
              <div key={c.title} className={`card-dark p-6 reveal delay-${(i % 3) * 100 + 100}`}>
                <div className="flex items-start gap-3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#00D9A3" strokeWidth="2.5" className="w-5 h-5 flex-shrink-0 mt-0.5"><path d="M5 13l4 4L19 7"/></svg>
                  <div>
                    <h4 className="text-white font-semibold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{c.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 lg:px-12 text-center reveal" style={{ background: 'linear-gradient(135deg, #0F2A4A 0%, #0A1428 100%)' }}>
        <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Ready to try it? <span className="text-gradient">It's free.</span>
        </h2>
        <p className="text-slate-400 mb-8">No credit card required. Start processing your records today.</p>
        <Link to="/register">
          <button className="btn-teal">Create Free Account</button>
        </Link>
      </section>

    </div>
  );
}
export default FeaturesPage;
