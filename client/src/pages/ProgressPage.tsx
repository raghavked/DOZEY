import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('is-visible');
      }),
      { threshold: 0.08 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

const milestones = [
  {
    period: 'Fall 2024',
    title: 'Problem identified',
    desc: 'Multiple UC Davis international students in our network had vaccination records rejected by the university health center. We started documenting the scope of the problem.',
    status: 'done',
  },
  {
    period: 'Winter 2024',
    title: 'First prototype',
    desc: 'Built a proof-of-concept that could extract vaccination data from a PDF and translate it from Spanish to English. Tested with 12 real documents.',
    status: 'done',
  },
  {
    period: 'Spring 2025',
    title: 'Core AI pipeline',
    desc: 'Integrated Mistral OCR for document extraction and DeepL for translation. Added a medical terminology layer to handle vaccine name mapping across countries.',
    status: 'done',
  },
  {
    period: 'Summer 2025',
    title: 'University compliance database',
    desc: 'Built the compliance rules engine with vaccination requirements for 50 US universities. Expanded language support to 80+ languages.',
    status: 'done',
  },
  {
    period: 'Fall 2025',
    title: 'Beta launch',
    desc: 'Opened the platform to a closed beta of 200 UC Davis international students. Processed over 600 documents. Collected feedback and iterated on the UX.',
    status: 'done',
  },
  {
    period: 'Winter 2025',
    title: 'HIPAA compliance',
    desc: 'Completed HIPAA compliance audit. Implemented AES-256 encryption at rest and in transit. Established data retention and deletion policies.',
    status: 'done',
  },
  {
    period: 'Spring 2026',
    title: 'Public launch',
    desc: 'Opened DOZEY to all international students. Expanded university coverage to 200+ institutions. Launched secure sharing feature for direct submission to health centers.',
    status: 'current',
  },
  {
    period: 'Summer 2026',
    title: 'Mobile app',
    desc: 'Native iOS and Android app for uploading documents from your phone. Offline access to processed records. Push notifications for compliance deadlines.',
    status: 'upcoming',
  },
];

export function ProgressPage() {
  useReveal();

  return (
    <div className="public-site">

      {/* HERO */}
      <section
        className="pt-36 pb-20 px-6 lg:px-16"
        style={{ background: '#000000' }}
      >
        <div className="max-w-5xl mx-auto">
          <span className="section-label">Progress</span>
          <h1
            className="heading-display mb-6"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', maxWidth: '640px' }}
          >
            Where we are and where we are going.
          </h1>
          <p
            className="body-text"
            style={{ fontSize: '1.125rem', maxWidth: '520px' }}
          >
            DOZEY started as a weekend project in 2024. Here is an honest account of what we have built, what works, and what is still in progress.
          </p>
        </div>
      </section>

      {/* TIMELINE */}
      <section
        className="py-24 px-6 lg:px-16"
        style={{ background: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-4xl mx-auto">
          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div
              style={{
                position: 'absolute',
                left: '7px',
                top: '8px',
                bottom: '8px',
                width: '1px',
                background: 'rgba(255,255,255,0.08)',
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {milestones.map(({ period, title, desc, status }, i) => (
                <div
                  key={period}
                  className={`reveal delay-${Math.min(i * 100, 400)}`}
                  style={{ display: 'grid', gridTemplateColumns: '16px 1fr', gap: '1.75rem', alignItems: 'start' }}
                >
                  {/* Dot */}
                  <div
                    style={{
                      width: '15px',
                      height: '15px',
                      borderRadius: '50%',
                      marginTop: '4px',
                      flexShrink: 0,
                      background: status === 'done' ? '#38D4B8' : status === 'current' ? '#38D4B8' : 'transparent',
                      border: status === 'upcoming' ? '1px solid rgba(255,255,255,0.2)' : '2px solid #38D4B8',
                      boxShadow: status === 'current' ? '0 0 0 4px rgba(56,212,184,0.12)' : 'none',
                    }}
                  />

                  {/* Content */}
                  <div>
                    <p
                      className="text-xs font-semibold mb-2"
                      style={{
                        color: status === 'upcoming' ? 'rgba(255,255,255,0.3)' : '#38D4B8',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {period}
                      {status === 'current' && (
                        <span
                          className="ml-3 text-xs font-medium"
                          style={{
                            color: '#38D4B8',
                            background: 'rgba(56,212,184,0.1)',
                            border: '1px solid rgba(56,212,184,0.2)',
                            borderRadius: '4px',
                            padding: '1px 8px',
                          }}
                        >
                          Now
                        </span>
                      )}
                    </p>
                    <h3
                      className="heading-section mb-2"
                      style={{
                        fontSize: '1.125rem',
                        color: status === 'upcoming' ? 'rgba(255,255,255,0.45)' : '#FFFFFF',
                      }}
                    >
                      {title}
                    </h3>
                    <p
                      className="body-text"
                      style={{
                        fontSize: '0.9375rem',
                        color: status === 'upcoming' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.6)',
                      }}
                    >
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CURRENT STATUS */}
      <section
        className="py-24 px-6 lg:px-16"
        style={{ background: '#000000', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5 reveal-left">
              <span className="section-label">Current Status</span>
              <h2
                className="heading-section mb-6"
                style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.75rem)' }}
              >
                Live and processing documents.
              </h2>
              <p className="body-text" style={{ fontSize: '1.0625rem' }}>
                DOZEY is publicly available. The core features — document translation, compliance checking, and formatted output — are working and free for students.
              </p>
            </div>
            <div className="lg:col-span-7 reveal-right" style={{ paddingTop: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                {[
                  { value: '150+', label: 'Countries supported' },
                  { value: '200+', label: 'US universities in compliance database' },
                  { value: '< 2 min', label: 'Average processing time' },
                  { value: 'Free', label: 'Core features, always' },
                ].map(({ value, label }) => (
                  <div
                    key={label}
                    style={{
                      padding: '1.75rem',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: '10px',
                    }}
                  >
                    <div className="stat-value mb-2">{value}</div>
                    <p className="stat-label">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-24 px-6 lg:px-16"
        style={{ background: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-3xl reveal">
          <h2
            className="heading-section mb-5"
            style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.5rem)' }}
          >
            Try it now. It is free.
          </h2>
          <p className="body-text mb-8" style={{ fontSize: '1.0625rem', maxWidth: '440px' }}>
            Upload your vaccination records and see your compliance report in under two minutes.
          </p>
          <Link to="/register">
            <span className="btn-primary">
              Get started free
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

export default ProgressPage;
