import { Link } from 'react-router-dom';
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

const features = [
  {
    icon: 'shield',
    title: 'AI Document Verification',
    desc: 'Our AI model analyzes uploaded documents for signs of tampering, forgery, or inconsistency. High-risk documents are flagged and blocked before they enter your records.',
    detail: 'Powered by GPT-4o-mini with custom healthcare document prompts.',
  },
  {
    icon: 'translate',
    title: 'Multi-Language Translation',
    desc: 'Supports 50+ languages using DeepL and Mistral OCR. Records from any country are converted to standardized English with field-level accuracy.',
    detail: 'Average translation time: under 90 seconds per document.',
  },
  {
    icon: 'building',
    title: 'University Compliance Checker',
    desc: 'Enter any US university and instantly see which immunization requirements your records satisfy. Supports all UC System campuses and hundreds of other institutions.',
    detail: 'Database updated each semester with current health center requirements.',
  },
  {
    icon: 'lock',
    title: 'HIPAA-Grade Security',
    desc: 'All data is encrypted at rest and in transit. Row-level security (RLS) via Supabase ensures users can only access their own records. Full audit logging for every action.',
    detail: 'Compliant with HIPAA Privacy Rule standards for health information.',
  },
  {
    icon: 'document',
    title: 'Unified PDF Export',
    desc: 'Combine all your verified health documents into a single, professionally formatted PDF. Generated client-side using jsPDF and html2canvas for instant download.',
    detail: 'Formatted to meet standard university health center submission requirements.',
  },
  {
    icon: 'globe',
    title: 'Global Record Coverage',
    desc: 'Intelligent field mapping handles vaccination record formats from 150+ countries. Vaccine names, dosage schedules, and date formats are normalized automatically.',
    detail: 'Covers WHO-standard vaccination schedules from all major health systems.',
  },
  {
    icon: 'calendar',
    title: 'Vaccination Timeline',
    desc: 'Visualize your complete immunization history on an interactive timeline. See upcoming boosters, overdue vaccines, and gaps in your records at a glance.',
    detail: 'Automatically populated from verified uploaded documents.',
  },
  {
    icon: 'share',
    title: 'Secure Record Sharing',
    desc: 'Generate time-limited, encrypted share links to send your verified records directly to health centers, advisors, or institutions — without email attachments.',
    detail: 'Links expire automatically and can be revoked at any time.',
  },
  {
    icon: 'chart',
    title: 'Compliance Dashboard',
    desc: 'A clear, at-a-glance dashboard showing your compliance status for each university requirement. Color-coded indicators make it easy to see what is complete and what is missing.',
    detail: 'Exportable as a compliance summary report for health center advisors.',
  },
];

function FeatureIcon({ type }: { type: string }) {
  const cls = "w-6 h-6";
  const sw = "1.8";
  if (type === 'shield') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={cls}><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
  if (type === 'translate') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={cls}><path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>;
  if (type === 'building') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={cls}><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 00-1-1h-2a1 1 0 00-1 1v5m4 0H9" /></svg>;
  if (type === 'lock') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={cls}><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
  if (type === 'document') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={cls}><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
  if (type === 'globe') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={cls}><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  if (type === 'calendar') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={cls}><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
  if (type === 'share') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={cls}><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={cls}><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
}

export function FeaturesPage() {
  useReveal();
  return (
    <div className="public-site">
      {/* HERO — dark */}
      <section className="relative pt-36 pb-24 px-6 lg:px-12 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A3A4F 0%, #1E4A63 60%, #152E40 100%)' }}>
        <div className="absolute inset-0 bg-grid-dots opacity-40" />
        <div className="glow-orb w-[400px] h-[400px] bg-[#38D4B8] opacity-[0.07] top-[-60px] right-[-60px]" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <span className="badge-teal mb-5 inline-flex animate-fade-in">Platform Features</span>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 animate-fade-in-up leading-tight max-w-3xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Built for international students.{' '}
            <span className="text-gradient">Trusted by health centers.</span>
          </h1>
          <p className="text-slate-300 text-xl leading-relaxed animate-fade-in-up delay-200 max-w-2xl">
            Every feature in DOZEY was designed around the real challenges international students face when submitting health records to US universities.
          </p>
        </div>
      </section>

      {/* FEATURES GRID — light */}
      <section className="section-light py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="badge-dark mb-4 inline-flex">All Features</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-5" style={{ fontFamily: "'Poppins', sans-serif", color: '#0F1A22' }}>
              Everything in one platform.
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#6B7280' }}>
              No more juggling multiple tools, translators, and spreadsheets. DOZEY handles the entire process from upload to submission.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon, title, desc, detail }, i) => (
              <div key={title} className={`card-light p-7 reveal delay-${(i % 3) * 100 + 100}`}>
                <div className="icon-tile mb-5"><FeatureIcon type={icon} /></div>
                <h3 className="text-lg font-bold mb-3" style={{ fontFamily: "'Poppins', sans-serif", color: '#0F1A22' }}>{title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B7280' }}>{desc}</p>
                <p className="text-xs font-medium" style={{ color: '#38D4B8' }}>{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI PIPELINE — dark */}
      <section className="section-dark py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="reveal-left">
              <span className="badge-teal mb-5 inline-flex">AI Pipeline</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                How our AI processes your documents.
              </h2>
              <div className="space-y-6">
                {[
                  { step: '1', title: 'OCR Extraction', desc: 'Mistral OCR reads text from any document format — scanned PDFs, photos, or digital files — with high accuracy.' },
                  { step: '2', title: 'Authenticity Check', desc: 'GPT-4o-mini analyzes the document for signs of tampering, inconsistencies, or fraudulent patterns.' },
                  { step: '3', title: 'Translation & Normalization', desc: 'DeepL translates content while our AI normalizes vaccine names, dates, and dosage formats to US standards.' },
                  { step: '4', title: 'Structured Data Extraction', desc: 'Vaccination events, dates, providers, and lot numbers are extracted into a structured, searchable format.' },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5" style={{ background: 'rgba(56,212,184,0.2)', color: '#38D4B8', border: '1px solid rgba(56,212,184,0.3)' }}>{step}</div>
                    <div>
                      <div className="font-semibold text-white mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{title}</div>
                      <div className="text-sm text-white/60 leading-relaxed">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal-right">
              <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(56,212,184,0.15)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(56,212,184,0.15)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#38D4B8" strokeWidth="2" className="w-5 h-5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">Document Processing</div>
                    <div className="text-white/40 text-xs">vaccination_record_brazil.pdf</div>
                  </div>
                  <span className="ml-auto text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: 'rgba(56,212,184,0.15)', color: '#38D4B8' }}>Verified</span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Document Authenticity', value: 'Authentic', ok: true },
                    { label: 'Language Detected', value: 'Portuguese (Brazil)', ok: true },
                    { label: 'Translation Status', value: 'Complete', ok: true },
                    { label: 'Vaccines Extracted', value: '8 records found', ok: true },
                    { label: 'MMR (2 doses)', value: 'Compliant', ok: true },
                    { label: 'Hepatitis B (3 doses)', value: 'Compliant', ok: true },
                    { label: 'Varicella', value: 'Missing dose 2', ok: false },
                  ].map(({ label, value, ok }) => (
                    <div key={label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <span className="text-sm text-white/60">{label}</span>
                      <span className="text-sm font-medium" style={{ color: ok ? '#38D4B8' : '#F59E0B' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — alt light */}
      <section className="section-alt py-20 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center reveal">
          <h2 className="text-4xl font-bold mb-5" style={{ fontFamily: "'Poppins', sans-serif", color: '#0F1A22' }}>Ready to get started?</h2>
          <p className="text-lg mb-8" style={{ color: '#6B7280' }}>Create your account and upload your first document in minutes.</p>
          <Link to="/register">
            <span className="btn-primary cursor-pointer">
              Create Free Account
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
export default FeaturesPage;
