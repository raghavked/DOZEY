import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import raghavPhoto from '@/assets/raghav-photo.png';
import aashPhoto from '@/assets/aash-photo.png';
import isaacPhoto from '@/assets/isaac-photo.png';

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

export function TeamPage() {
  useReveal();

  return (
    <div className="public-site">

      {/* HERO */}
      <section
        className="pt-36 pb-20 px-6 lg:px-16"
        style={{ background: '#000000' }}
      >
        <div className="max-w-5xl mx-auto">
          <span className="section-label">The Team</span>
          <h1
            className="heading-display mb-6"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', maxWidth: '640px' }}
          >
            Three UC Davis students who got tired of the problem and built the solution.
          </h1>
          <p
            className="body-text"
            style={{ fontSize: '1.125rem', maxWidth: '520px' }}
          >
            DOZEY started as a frustration. We watched international students miss enrollment deadlines over paperwork. So we built the tool that should have already existed.
          </p>
        </div>
      </section>

      {/* TEAM MEMBERS */}
      <section
        className="py-24 px-6 lg:px-16"
        style={{ background: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-7xl mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>

          {/* Raghav — photo left, bio right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start reveal">
            <div className="lg:col-span-4">
              <img
                src={raghavPhoto}
                alt="Raghav, Co-Founder"
                style={{
                  width: '100%',
                  maxWidth: '340px',
                  aspectRatio: '3/4',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.07)',
                  display: 'block',
                }}
              />
            </div>
            <div className="lg:col-span-8" style={{ paddingTop: '1.5rem' }}>
              <h2 className="heading-section mb-1" style={{ fontSize: '1.75rem' }}>Raghav</h2>
              <p className="text-sm font-medium mb-6" style={{ color: '#38D4B8' }}>Co-Founder, Engineering</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p className="body-text" style={{ fontSize: '1.0625rem' }}>
                  Raghav built the core AI pipeline that powers DOZEY's document processing. He grew up in the US as a naturalized citizen and watched close friends — international students arriving at UC Davis — spend their first weeks fighting paperwork instead of starting school.
                </p>
                <p className="body-text" style={{ fontSize: '1.0625rem' }}>
                  His motivation is straightforward: the process of getting health records accepted is a bureaucratic obstacle that has nothing to do with whether a student is healthy. He wanted to remove that obstacle. DOZEY is the result.
                </p>
              </div>
            </div>
          </div>

          {/* Aash — bio left, photo right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start reveal">
            <div className="lg:col-span-8" style={{ paddingTop: '1.5rem' }}>
              <h2 className="heading-section mb-1" style={{ fontSize: '1.75rem' }}>Aash</h2>
              <p className="text-sm font-medium mb-6" style={{ color: '#38D4B8' }}>Co-Founder, Product</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p className="body-text" style={{ fontSize: '1.0625rem' }}>
                  Aash leads product design and user experience at DOZEY. Her focus is on making the platform feel approachable to students who are already overwhelmed — arriving in a new country, starting a new school, dealing with a new healthcare system.
                </p>
                <p className="body-text" style={{ fontSize: '1.0625rem' }}>
                  She watched close friends spend weeks in limbo because their records were in the wrong format. That experience shaped her conviction that good design can remove real barriers — and that healthcare tools should be built for patients, not administrators.
                </p>
              </div>
            </div>
            <div className="lg:col-span-4">
              <img
                src={aashPhoto}
                alt="Aash, Co-Founder"
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  aspectRatio: '3/4',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.07)',
                  display: 'block',
                  marginLeft: 'auto',
                }}
              />
            </div>
          </div>

          {/* Isaac — photo left, bio right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start reveal">
            <div className="lg:col-span-4">
              <img
                src={isaacPhoto}
                alt="Isaac, Co-Founder"
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  aspectRatio: '3/4',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.07)',
                  display: 'block',
                }}
              />
            </div>
            <div className="lg:col-span-8" style={{ paddingTop: '1.5rem' }}>
              <h2 className="heading-section mb-1" style={{ fontSize: '1.75rem' }}>Isaac</h2>
              <p className="text-sm font-medium mb-6" style={{ color: '#38D4B8' }}>Co-Founder, Development</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p className="body-text" style={{ fontSize: '1.0625rem' }}>
                  Isaac handles full-stack development and the backend infrastructure that keeps DOZEY secure and reliable. He joined the project because he believed the technical problem was solvable — and that nobody had bothered to solve it yet.
                </p>
                <p className="body-text" style={{ fontSize: '1.0625rem' }}>
                  His focus is on the parts of the product that students never see: the security, the reliability, the edge cases that happen when someone uploads a water-damaged paper record from 1998. Getting those details right is what makes the product trustworthy.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ORIGIN STORY */}
      <section
        className="py-24 px-6 lg:px-16"
        style={{ background: '#000000', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-4xl mx-auto reveal">
          <span className="section-label">How It Started</span>
          <h2
            className="heading-section mb-8"
            style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.75rem)' }}
          >
            January 2026. UC Davis. A health center rejection notice.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <p className="body-text" style={{ fontSize: '1.0625rem' }}>
              The three of us were at UC Davis in early 2026 when the problem became impossible to ignore. Students we knew — from Brazil, India, Korea, China — were getting their vaccination records rejected by the university health center. Not because they were missing vaccines, but because their records were in the wrong language or the wrong format.
            </p>
            <p className="body-text" style={{ fontSize: '1.0625rem' }}>
              The solution the university offered was to hire a certified translator. Cost: $50 to $200 per document. Wait time: one to three weeks. And after all that, some records still got rejected because the format didn't match what the health center expected.
            </p>
            <p className="body-text" style={{ fontSize: '1.0625rem' }}>
              We started building DOZEY in January 2026. Not because we thought it would become a company, but because the problem was clearly solvable and nobody had solved it. The first version processed a single document from a single country. Today it handles 150+ countries and 200+ universities.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section
        className="py-24 px-6 lg:px-16"
        style={{ background: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-3xl reveal">
          <h2
            className="heading-section mb-5"
            style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.5rem)' }}
          >
            Want to work with us?
          </h2>
          <p className="body-text mb-8" style={{ fontSize: '1.0625rem', maxWidth: '440px' }}>
            We are always looking for engineers, designers, and healthcare advocates who want to solve real problems for real students.
          </p>
          <Link to="/contact">
            <span className="btn-ghost">Get in touch</span>
          </Link>
        </div>
      </section>

    </div>
  );
}

export default TeamPage;
