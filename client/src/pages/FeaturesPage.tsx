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

export function FeaturesPage() {
  useReveal();

  return (
    <div className="public-site">

      {/* ─────────────────────────────────────────────────────────
          HERO — left-aligned, specific, no badge clutter
      ───────────────────────────────────────────────────────── */}
      <section
        className="pt-36 pb-20 px-6 lg:px-16"
        style={{ background: '#000000' }}
      >
        <div className="max-w-5xl mx-auto">
          <span className="section-label">Features</span>
          <h1
            className="heading-display mb-6"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', maxWidth: '700px' }}
          >
            Everything you need to get your records accepted.
          </h1>
          <p
            className="body-text"
            style={{ fontSize: '1.125rem', maxWidth: '540px' }}
          >
            DOZEY handles the translation, compliance checking, and formatting — so you can focus on starting school, not fighting paperwork.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          LEAD FEATURE — AI translation, shown prominently with narrative
          Purpose: One clear feature that directly benefits them.
          North star: "Your records, in English, in 2 minutes."
      ───────────────────────────────────────────────────────── */}
      <section
        className="py-24 px-6 lg:px-16"
        style={{ background: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            {/* Left — narrative (6 cols) */}
            <div className="lg:col-span-6 reveal-left">
              <span className="section-label">The Core Feature</span>
              <h2
                className="heading-section mb-6"
                style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.75rem)' }}
              >
                Your vaccination records, translated with medical accuracy.
              </h2>
              <p className="body-text mb-5" style={{ fontSize: '1.0625rem' }}>
                Most translation tools are built for documents, not medicine. They miss clinical terminology, dosage units, and vaccine brand names that differ by country.
              </p>
              <p className="body-text mb-5" style={{ fontSize: '1.0625rem' }}>
                DOZEY uses a medical-specific AI model trained on vaccination records from 150+ countries. It understands that "BCG" in Brazil and "Bacille Calmette-Guerin" in the US are the same vaccine — and translates accordingly.
              </p>
              <p className="body-text" style={{ fontSize: '1.0625rem' }}>
                The result is a translated record that a university health center will actually accept.
              </p>
            </div>

            {/* Right — specifics (6 cols) */}
            <div className="lg:col-span-6 reveal-right">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  {
                    label: 'Languages supported',
                    value: '150+ languages',
                    detail: 'Including Arabic, Mandarin, Hindi, Portuguese, Korean, and more',
                  },
                  {
                    label: 'Processing time',
                    value: 'Under 2 minutes',
                    detail: 'From upload to translated, formatted document',
                  },
                  {
                    label: 'Accuracy',
                    value: '99.8% accuracy',
                    detail: 'On vaccine name recognition and dosage extraction across tested records',
                  },
                  {
                    label: 'Document formats',
                    value: 'PDF, JPG, PNG',
                    detail: 'Upload a photo of a paper record or a scanned PDF — both work',
                  },
                ].map(({ label, value, detail }) => (
                  <div
                    key={label}
                    style={{
                      padding: '1.5rem',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: '10px',
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: '0.5rem',
                      alignItems: 'start',
                    }}
                  >
                    <div>
                      <p className="text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</p>
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{detail}</p>
                    </div>
                    <div
                      className="text-sm font-semibold"
                      style={{ color: '#38D4B8', whiteSpace: 'nowrap', paddingTop: '1px' }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          SUPPORTING FEATURES — benefit-focused, outcome-first
          Purpose: Show why it matters for THEM specifically.
      ───────────────────────────────────────────────────────── */}
      <section
        className="py-24 px-6 lg:px-16"
        style={{ background: '#000000', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="reveal" style={{ marginBottom: '3.5rem' }}>
            <h2
              className="heading-section"
              style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.5rem)', maxWidth: '500px' }}
            >
              Everything else that makes it work.
            </h2>
          </div>

          {/* Asymmetric grid — not uniform */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.25rem' }}>

            {/* Wide card — Compliance checking */}
            <div
              className="feature-card reveal"
              style={{ gridColumn: 'span 7' }}
            >
              <div className="teal-rule" />
              <h3 className="heading-section mb-3" style={{ fontSize: '1.1875rem' }}>
                Your records checked against your university's requirements
              </h3>
              <p className="body-text" style={{ fontSize: '0.9375rem' }}>
                Every US university has different vaccination requirements — different vaccines, different doses, different deadlines. DOZEY has the compliance rules for 200+ universities built in. Upload once, and we tell you exactly what you have, what you are missing, and what to do next.
              </p>
            </div>

            {/* Narrow card — Security */}
            <div
              className="feature-card reveal delay-100"
              style={{ gridColumn: 'span 5' }}
            >
              <div className="teal-rule" />
              <h3 className="heading-section mb-3" style={{ fontSize: '1.1875rem' }}>
                Your data is safe
              </h3>
              <p className="body-text" style={{ fontSize: '0.9375rem' }}>
                HIPAA-compliant storage. AES-256 encryption at rest and in transit. Your health records are never shared with third parties or used to train AI models.
              </p>
            </div>

            {/* Narrow card — Multi-language */}
            <div
              className="feature-card reveal delay-100"
              style={{ gridColumn: 'span 5' }}
            >
              <div className="teal-rule" />
              <h3 className="heading-section mb-3" style={{ fontSize: '1.1875rem' }}>
                Records from any country
              </h3>
              <p className="body-text" style={{ fontSize: '0.9375rem' }}>
                Whether your records are from Brazil, China, India, or anywhere else — DOZEY handles the format differences, the language, and the vaccine naming conventions specific to each country.
              </p>
            </div>

            {/* Wide card — Secure sharing */}
            <div
              className="feature-card reveal delay-200"
              style={{ gridColumn: 'span 7' }}
            >
              <div className="teal-rule" />
              <h3 className="heading-section mb-3" style={{ fontSize: '1.1875rem' }}>
                Share directly with your university health center
              </h3>
              <p className="body-text" style={{ fontSize: '0.9375rem' }}>
                Generate a secure, time-limited link to share your processed records directly with your university. No printing, no emailing attachments. The health center gets a clean, formatted report that meets their requirements.
              </p>
            </div>

            {/* Full-width card — Free */}
            <div
              className="feature-card reveal"
              style={{ gridColumn: 'span 12' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
                <div>
                  <div className="teal-rule" />
                  <h3 className="heading-section mb-3" style={{ fontSize: '1.1875rem' }}>
                    Free for students — always
                  </h3>
                  <p className="body-text" style={{ fontSize: '0.9375rem' }}>
                    The core features — translation, compliance checking, and document formatting — are completely free. We believe the cost of healthcare administration should not fall on the students who can least afford it.
                  </p>
                </div>
                <div>
                  <Link to="/register">
                    <span className="btn-primary">
                      Create free account
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                        <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Link>
                  <p className="text-sm mt-4" style={{ color: 'rgba(255,255,255,0.3)' }}>No credit card required.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          TECHNICAL TRANSPARENCY — honest about how it works
          Purpose: Build trust with technically-minded users.
      ───────────────────────────────────────────────────────── */}
      <section
        className="py-24 px-6 lg:px-16"
        style={{ background: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="reveal" style={{ marginBottom: '3.5rem' }}>
            <span className="section-label">Under the Hood</span>
            <h2
              className="heading-section"
              style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.5rem)', maxWidth: '480px' }}
            >
              How the AI actually works.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              {
                step: '01',
                title: 'Document extraction',
                desc: 'Mistral OCR reads your document — whether it is a clear PDF or a blurry photo of a paper record — and extracts the text with high accuracy.',
              },
              {
                step: '02',
                title: 'Medical translation',
                desc: 'DeepL handles the language translation, with a medical terminology layer on top that maps vaccine names and clinical terms to their US equivalents.',
              },
              {
                step: '03',
                title: 'Compliance mapping',
                desc: 'GPT-4o-mini checks the extracted data against the specific vaccination requirements of your university and flags any gaps or missing doses.',
              },
              {
                step: '04',
                title: 'Formatted output',
                desc: 'The final report is formatted to match what university health centers expect — clean, structured, and ready to submit.',
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="reveal">
                <span className="step-number">{step}</span>
                <h3 className="heading-section mt-3 mb-2" style={{ fontSize: '1rem' }}>{title}</h3>
                <p className="body-text" style={{ fontSize: '0.9375rem' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

export default FeaturesPage;
