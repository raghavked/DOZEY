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

const milestones = [
  {
    date: 'Q1 2025',
    title: 'Project Inception',
    desc: 'DOZEY was founded at UC Davis by a team of international students who experienced firsthand the difficulty of submitting foreign vaccination records to US universities.',
    status: 'complete',
  },
  {
    date: 'Q2 2025',
    title: 'Core AI Pipeline',
    desc: 'Built and validated the core document processing pipeline: Mistral OCR extraction, DeepL translation, and GPT-4o-mini authenticity verification.',
    status: 'complete',
  },
  {
    date: 'Q3 2025',
    title: 'UC System Integration',
    desc: 'Integrated immunization requirement databases for all 9 UC System campuses. Launched closed beta with 50 UC Davis international students.',
    status: 'complete',
  },
  {
    date: 'Q4 2025',
    title: 'Public Beta Launch',
    desc: 'Opened DOZEY to all international students. Processed over 10,000 documents in the first 60 days. Expanded university database to 200+ institutions.',
    status: 'complete',
  },
  {
    date: 'Q1 2026',
    title: 'HIPAA Compliance & Security Audit',
    desc: 'Completed third-party HIPAA compliance audit. Implemented row-level security, full audit logging, and end-to-end encryption across all data stores.',
    status: 'complete',
  },
  {
    date: 'Q2 2026',
    title: 'Secure Sharing & Dashboard',
    desc: 'Launched time-limited encrypted share links and the compliance dashboard. Added vaccination timeline visualization.',
    status: 'current',
  },
  {
    date: 'Q3 2026',
    title: 'Institution API',
    desc: 'Direct API integration for university health centers to receive and verify student records programmatically — eliminating manual review.',
    status: 'upcoming',
  },
  {
    date: 'Q4 2026',
    title: 'Mobile Application',
    desc: 'Native iOS and Android apps for document upload, compliance checking, and record management on the go.',
    status: 'upcoming',
  },
];

const stats = [
  { value: '50K+', label: 'Documents Processed' },
  { value: '150+', label: 'Countries Represented' },
  { value: '200+', label: 'Universities Supported' },
  { value: '99.8%', label: 'Verification Accuracy' },
];

export function ProgressPage() {
  useReveal();
  return (
    <div className="public-site">
      {/* HERO — dark */}
      <section className="relative pt-36 pb-24 px-6 lg:px-12 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A3A4F 0%, #1E4A63 60%, #152E40 100%)' }}>
        <div className="absolute inset-0 bg-grid-dots opacity-40" />
        <div className="glow-orb w-[400px] h-[400px] bg-[#38D4B8] opacity-[0.07] top-[-60px] right-[-60px]" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <span className="badge-teal mb-5 inline-flex animate-fade-in">Our Progress</span>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 animate-fade-in-up leading-tight max-w-3xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Building the future of{' '}
            <span className="text-gradient">health record management.</span>
          </h1>
          <p className="text-slate-300 text-xl leading-relaxed animate-fade-in-up delay-200 max-w-2xl">
            From a UC Davis dorm room idea to a platform serving students from 150+ countries. Here is where we have been and where we are going.
          </p>
        </div>
      </section>

      {/* STATS — dark */}
      <section className="section-dark py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label }, i) => (
              <div key={label} className={`text-center reveal delay-${i * 100 + 100}`}>
                <div className="stat-number mb-1">{value}</div>
                <div className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE — light */}
      <section className="section-light py-24 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="badge-dark mb-4 inline-flex">Roadmap</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-5" style={{ fontFamily: "'Poppins', sans-serif", color: '#0F1A22' }}>
              Milestone timeline.
            </h2>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(to bottom, #38D4B8, rgba(56,212,184,0.1))' }} />
            <div className="space-y-8">
              {milestones.map(({ date, title, desc, status }, i) => (
                <div key={title} className={`relative pl-16 reveal delay-${i * 100 + 100}`}>
                  {/* Dot */}
                  <div
                    className="absolute left-4 top-1.5 w-4 h-4 rounded-full border-2 -translate-x-1/2"
                    style={{
                      background: status === 'complete' ? '#38D4B8' : status === 'current' ? '#1A3A4F' : '#E5E7EB',
                      borderColor: status === 'upcoming' ? '#D1D5DB' : '#38D4B8',
                    }}
                  />
                  <div
                    className="rounded-xl p-6"
                    style={{
                      background: status === 'current' ? 'rgba(56,212,184,0.06)' : '#FFFFFF',
                      border: status === 'current' ? '1px solid rgba(56,212,184,0.3)' : '1px solid #E5E7EB',
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: '#F0FDF4', color: '#15803D' }}>{date}</span>
                      {status === 'current' && <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(56,212,184,0.15)', color: '#38D4B8' }}>In Progress</span>}
                      {status === 'upcoming' && <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: '#F3F4F6', color: '#6B7280' }}>Upcoming</span>}
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Poppins', sans-serif", color: '#0F1A22' }}>{title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA — dark */}
      <section className="section-dark py-20 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center reveal">
          <h2 className="text-4xl font-bold text-white mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Be part of the journey.
          </h2>
          <p className="text-white/60 text-lg mb-8">
            Join thousands of students already using DOZEY to simplify their university health submissions.
          </p>
          <Link to="/register">
            <span className="btn-primary cursor-pointer">
              Get Started Free
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
export default ProgressPage;
