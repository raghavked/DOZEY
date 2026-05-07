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

export function HomePage() {
  useReveal();

  return (
    <div className="public-site">

      {/* ─────────────────────────────────────────────────────────
          HERO — asymmetric, left-heavy, single CTA
          Purpose: Reassure. This is a real platform built by real people.
          North star: "We are real people solving a real healthcare problem."
      ───────────────────────────────────────────────────────── */}
      <section
        className="pt-36 pb-28 px-6 lg:px-16"
        style={{ background: '#000000' }}
      >
        <div className="max-w-5xl mx-auto">
          <div>

            {/* Headline + CTA */}
            <div>
              <span className="section-label">Health Records, Simplified</span>
              <h1
                className="heading-display mb-7"
                style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)' }}
              >
                Your vaccination records,<br />
                accepted by any<br />
                <span className="accent-word">US university.</span>
              </h1>
              <p
                className="body-text mb-10"
                style={{ fontSize: '1.125rem', maxWidth: '520px' }}
              >
                International students spend weeks — and hundreds of dollars — getting health records translated and certified. DOZEY does it in minutes, for free.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <span className="btn-primary">
                    Get started free
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                      <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                <Link to="/features">
                  <span className="btn-ghost">See how it works</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          THE PROBLEM — left-aligned, honest, specific
          Purpose: Make the user feel understood.
          North star: "This is a real problem that affects real students."
      ───────────────────────────────────────────────────────── */}
      <section
        className="py-24 px-6 lg:px-16"
        style={{ background: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

            {/* Left — problem statement (5 cols) */}
            <div className="lg:col-span-5 reveal-left">
              <span className="section-label">The Problem</span>
              <h2
                className="heading-section mb-6"
                style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.75rem)' }}
              >
                Getting your records accepted is harder than it should be.
              </h2>
              <p className="body-text" style={{ fontSize: '1rem' }}>
                Every year, thousands of international students arrive at US universities with vaccination records that get rejected — not because the records are wrong, but because they are in the wrong language or format.
              </p>
            </div>

            {/* Right — specific pain points (7 cols) */}
            <div className="lg:col-span-7 reveal-right" style={{ paddingTop: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {[
                  {
                    stat: '$50–$200',
                    desc: 'Cost of a single certified translation from a licensed translator',
                  },
                  {
                    stat: '1–3 weeks',
                    desc: 'Typical wait time for certified translations, often missing enrollment deadlines',
                  },
                  {
                    stat: '150+ countries',
                    desc: 'Where students come from — each with different record formats and languages',
                  },
                  {
                    stat: '200+ universities',
                    desc: 'Each with their own compliance requirements and submission portals',
                  },
                ].map(({ stat, desc }) => (
                  <div
                    key={stat}
                    style={{
                      padding: '1.75rem',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: '10px',
                    }}
                  >
                    <div className="stat-value mb-2">{stat}</div>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          HOW IT WORKS — sequential, clear, no decoration
          Purpose: Guide. Show the user exactly what happens.
          North star: "Four steps. Under two minutes. Free."
      ───────────────────────────────────────────────────────── */}
      <section
        className="py-24 px-6 lg:px-16"
        style={{ background: '#000000', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="reveal" style={{ marginBottom: '4rem' }}>
            <span className="section-label">How It Works</span>
            <h2
              className="heading-section"
              style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.75rem)', maxWidth: '480px' }}
            >
              From upload to submission in minutes.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0' }}>
            {[
              {
                n: '01',
                title: 'Upload your records',
                desc: 'Upload any vaccination document — PDF, photo, or scan. Any language, any country.',
              },
              {
                n: '02',
                title: 'AI reads and translates',
                desc: 'Our AI extracts the medical data and translates it with clinical accuracy. No human translator needed.',
              },
              {
                n: '03',
                title: 'We check compliance',
                desc: 'DOZEY checks your records against your university\'s specific requirements and flags any gaps.',
              },
              {
                n: '04',
                title: 'Submit with confidence',
                desc: 'Download a formatted, compliant report ready for your university health portal.',
              },
            ].map(({ n, title, desc }, i) => (
              <div
                key={n}
                className={`reveal delay-${i * 100 + 100}`}
                style={{
                  padding: '2rem 2rem 2rem 0',
                  borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  paddingLeft: i > 0 ? '2rem' : '0',
                }}
              >
                <span className="step-number">{n}</span>
                <h3
                  className="heading-section mt-3 mb-3"
                  style={{ fontSize: '1.0625rem' }}
                >
                  {title}
                </h3>
                <p className="body-text" style={{ fontSize: '0.9375rem' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          WHAT MAKES IT DIFFERENT — benefit-focused, not feature-list
          Purpose: Guide. Show why DOZEY, not a translator.
          North star: "Your data is safe. It's fast. It's free."
      ───────────────────────────────────────────────────────── */}
      <section
        className="py-24 px-6 lg:px-16"
        style={{ background: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

            {/* Left — headline (4 cols) */}
            <div className="lg:col-span-4 reveal-left">
              <span className="section-label">Why DOZEY</span>
              <h2
                className="heading-section mb-6"
                style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.75rem)' }}
              >
                Built for students, not for hospitals.
              </h2>
              <p className="body-text" style={{ fontSize: '1rem' }}>
                Most health record tools are designed for clinicians. DOZEY was designed for a 20-year-old arriving in the US for the first time, trying to register for classes.
              </p>
            </div>

            {/* Right — benefit cards (8 cols) */}
            <div className="lg:col-span-8 reveal-right">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                {[
                  {
                    title: 'Your data is safe',
                    desc: 'HIPAA-compliant storage with AES-256 encryption. Your health records are never shared or sold.',
                  },
                  {
                    title: 'It actually works offline',
                    desc: 'Records are processed and stored securely. You can access your documents anytime, even without a connection.',
                  },
                  {
                    title: 'No translator required',
                    desc: 'Our AI handles 150+ languages with medical accuracy. No waiting for a human translator.',
                  },
                  {
                    title: 'Works with your university',
                    desc: 'Compliance rules for 200+ US universities are built in. We know what each school requires.',
                  },
                  {
                    title: 'Results in under 2 minutes',
                    desc: 'From upload to compliant report in the time it takes to make coffee.',
                  },
                ].map(({ title, desc }) => (
                  <div key={title} className="feature-card">
                    <div className="teal-rule" />
                    <h3
                      className="heading-section mb-2"
                      style={{ fontSize: '1rem' }}
                    >
                      {title}
                    </h3>
                    <p className="body-text" style={{ fontSize: '0.9rem' }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          ORIGIN STORY — honest, conversational, human
          Purpose: Build trust. Show who built this and why.
          North star: "Real people who faced this problem built the solution."
      ───────────────────────────────────────────────────────── */}
      <section
        className="py-24 px-6 lg:px-16"
        style={{ background: '#000000', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-3xl mx-auto">

            {/* Story */}
            <div className="reveal">
              <span className="section-label">Our Story</span>
              <h2
                className="heading-section mb-8"
                style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.75rem)' }}
              >
                We built this because we needed it.
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <p className="body-text" style={{ fontSize: '1.0625rem' }}>
                  In January 2026, we were UC Davis students watching close friends — international students from Brazil, India, and Korea — get their vaccination records rejected by the university health center. Wrong language. Wrong format. Not recognized.
                </p>
                <p className="body-text" style={{ fontSize: '1.0625rem' }}>
                  We paid translators. We waited weeks. We still got rejected. The process was broken, and nobody was fixing it.
                </p>
                <p className="body-text" style={{ fontSize: '1.0625rem' }}>
                  So we built DOZEY. Not as a startup idea, but as the tool we wished had existed for them.
                </p>
              </div>
              <div style={{ marginTop: '2.5rem' }}>
                <Link to="/team">
                  <span className="btn-ghost">Meet the team</span>
                </Link>
              </div>
            </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          CTA — single, clear, inviting
          Purpose: Convert. One action. No competing elements.
          North star: "Start for free. No friction."
      ───────────────────────────────────────────────────────── */}
      <section
        className="py-24 px-6 lg:px-16"
        style={{
          background: '#0D0D0D',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="max-w-3xl reveal">
          <span className="section-label">Get Started</span>
          <h2
            className="heading-section mb-5"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Ready to stop fighting with your health records?
          </h2>
          <p className="body-text mb-10" style={{ fontSize: '1.0625rem', maxWidth: '480px' }}>
            Create a free account. Upload your first document. See your results in under two minutes.
          </p>
          <Link to="/register">
            <span className="btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
              Create free account
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
          <p className="text-sm mt-5" style={{ color: 'rgba(255,255,255,0.3)' }}>
            No credit card required. Free for students.
          </p>
        </div>
      </section>

    </div>
  );
}

export default HomePage;
