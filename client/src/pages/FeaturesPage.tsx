import { useEffect } from 'react';
import { Link } from 'react-router-dom';

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

const allFeatures = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    title: 'Multilingual OCR',
    desc: 'Extract vaccination data from documents in any language — including handwritten records from 150+ countries. Powered by Mistral OCR with medical-domain fine-tuning.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>,
    title: 'Medical-Grade Translation',
    desc: 'Powered by DeepL and GPT-4o-mini, translations are medically accurate and preserve all clinical terminology, vaccine names, and dosage information.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    title: 'Authenticity Verification',
    desc: 'AI-powered document verification detects inconsistencies, missing data, and potential forgeries before submission. Flags issues for manual review.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
    title: 'University Compliance',
    desc: 'Built-in requirement database for 200+ US universities. Instantly see which vaccinations are missing, expired, or need boosters for your specific institution.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
    title: 'HIPAA-Compliant Storage',
    desc: 'AES-256 encryption at rest and in transit. Row-level security. Full audit logging. Your health data is stored with the same standards as major healthcare providers.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>,
    title: 'Secure Sharing',
    desc: 'Generate time-limited encrypted share links to send verified records directly to university health centers. No account required for recipients.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    title: 'Compliance Dashboard',
    desc: 'Visual timeline of all your vaccinations, upcoming boosters, and compliance status across all your enrolled institutions.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
    title: 'PDF Export',
    desc: 'Export a single formatted PDF combining all your verified, translated records — ready for direct submission to your university health center.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
    title: 'Free to Use',
    desc: 'DOZEY is free for students. No subscription, no credit card required. We believe every international student deserves access to this tool.',
  },
];

export function FeaturesPage() {
  useReveal();
  return (
    <div className="public-site">
      {/* HERO */}
      <section className="relative pt-36 pb-24 px-6 lg:px-12 overflow-hidden" style={{ background: '#000000' }}>
        <div className="absolute inset-0 bg-grid-dots opacity-25 pointer-events-none" />
        <div className="glow-orb w-[500px] h-[500px] bg-[#38D4B8] opacity-[0.05] top-[-80px] right-[-80px]" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <span className="badge-teal mb-6 inline-flex wgb-fade-in">Features</span>
          <h1
            className="text-5xl md:text-6xl font-black text-white mb-6 wgb-fade-up delay-100 leading-tight max-w-3xl"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Built for every{' '}
            <span className="text-gradient">international student.</span>
          </h1>
          <p
            className="text-xl leading-relaxed wgb-fade-up delay-200 max-w-2xl"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            Every feature in DOZEY was designed to solve a real problem faced by international students navigating US university health requirements.
          </p>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="section-dark py-24 px-6 lg:px-12" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allFeatures.map(({ icon, title, desc }, i) => (
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

      {/* AI PIPELINE */}
      <section className="section-black py-24 px-6 lg:px-12" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="badge-teal mb-5 inline-flex">Under the Hood</span>
            <h2
              className="text-4xl md:text-5xl font-black text-white mb-5"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              The processing{' '}
              <span className="text-gradient">pipeline.</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Every document goes through a rigorous multi-step process to ensure accuracy and compliance.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'OCR Extraction', desc: 'Mistral OCR extracts all text and structure from your document, including handwritten notes.' },
              { step: '2', title: 'Translation', desc: 'DeepL and GPT-4o-mini translate the content with medical-domain accuracy.' },
              { step: '3', title: 'Verification', desc: 'AI cross-checks data consistency, date formats, vaccine names, and document authenticity.' },
              { step: '4', title: 'Compliance Check', desc: 'Results are matched against your university\'s specific immunization requirements.' },
            ].map(({ step, title, desc }, i) => (
              <div key={step} className={`oroswap-card text-center reveal delay-${i * 100 + 100}`}>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5 text-lg font-black"
                  style={{
                    background: 'rgba(56,212,184,0.1)',
                    border: '1px solid rgba(56,212,184,0.3)',
                    color: '#38D4B8',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {step}
                </div>
                <h3
                  className="text-base font-bold text-white mb-3"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 px-6 lg:px-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0A1A14 0%, #000000 100%)', borderTop: '1px solid rgba(56,212,184,0.1)' }}
      >
        <div className="glow-orb w-[400px] h-[400px] bg-[#38D4B8] opacity-[0.05] top-[-50px] left-1/2 -translate-x-1/2" />
        <div className="relative z-10 max-w-3xl mx-auto text-center reveal">
          <h2
            className="text-4xl font-black text-white mb-5"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Ready to get started?
          </h2>
          <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Create your free account and process your first document in under 2 minutes.
          </p>
          <Link to="/register">
            <span className="btn-primary cursor-pointer text-base px-10 py-4">
              Get Started Free
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
export default FeaturesPage;
