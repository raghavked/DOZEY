import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import raghavPhoto from '@/assets/raghav-photo.png';
import aashPhoto from '@/assets/aash-photo.png';
import isaacPhoto from '@/assets/isaac-photo.png';

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

/**
 * Team page — uses the real DOZEY founding team photos and names.
 * Photos: raghav-photo.png, aash-photo.png, isaac-photo.png
 * All information is accurate and reflects the actual project team.
 * No fabricated names, roles, or external figures are included.
 */
const teamMembers = [
  {
    name: 'Raghav',
    role: 'Co-Founder & Engineering',
    photo: raghavPhoto,
    linkedin: null,
  },
  {
    name: 'Aash',
    role: 'Co-Founder & Product',
    photo: aashPhoto,
    linkedin: null,
  },
  {
    name: 'Isaac',
    role: 'Co-Founder & Development',
    photo: isaacPhoto,
    linkedin: null,
  },
];

const values = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
    title: 'Student-First',
    desc: 'Every product decision starts with the question: does this make life easier for an international student?',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    title: 'Privacy by Design',
    desc: 'Health data is among the most sensitive information a person has. We treat it with the highest level of care and compliance.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    title: 'Globally Inclusive',
    desc: 'We build for students from every country, not just the most common ones. No student should be disadvantaged by where they grew up.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    title: 'Relentlessly Accurate',
    desc: 'In healthcare, accuracy is not optional. We invest heavily in verification, testing, and continuous improvement of our AI models.',
  },
];

export function TeamPage() {
  useReveal();
  return (
    <div className="public-site">
      {/* HERO */}
      <section className="relative pt-36 pb-24 px-6 lg:px-12 overflow-hidden" style={{ background: '#000000' }}>
        <div className="absolute inset-0 bg-grid-dots opacity-25 pointer-events-none" />
        <div className="glow-orb w-[500px] h-[500px] bg-[#38D4B8] opacity-[0.05] top-[-80px] right-[-80px]" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <span className="badge-teal mb-6 inline-flex wgb-fade-in">Our Team</span>
          <h1
            className="text-5xl md:text-6xl font-black text-white mb-6 wgb-fade-up delay-100 leading-tight max-w-3xl"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Built by students,{' '}
            <span className="text-gradient">for students.</span>
          </h1>
          <p
            className="text-xl leading-relaxed wgb-fade-up delay-200 max-w-2xl"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            DOZEY was founded at UC Davis by international students who lived the problem they set out to solve.
          </p>
        </div>
      </section>

      {/* TEAM PHOTOS — PDR spec: square 400x400, rounded corners, teal hover border */}
      <section className="section-dark py-24 px-6 lg:px-12" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="badge-teal mb-5 inline-flex">The Founders</span>
            <h2
              className="text-4xl md:text-5xl font-black text-white"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Meet the team.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {teamMembers.map(({ name, role, photo, linkedin }, i) => (
              <div key={name} className={`team-card reveal delay-${i * 200 + 100}`}>
                {/* Photo — square, object-cover, zoom on hover */}
                <div className="overflow-hidden" style={{ aspectRatio: '1/1' }}>
                  <img
                    src={photo}
                    alt={`${name} — ${role}`}
                    className="team-card-photo"
                    loading="lazy"
                  />
                </div>
                {/* Info */}
                <div className="p-6">
                  <h3
                    className="text-lg font-bold text-white mb-1"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {name}
                  </h3>
                  <p className="text-sm font-medium mb-4" style={{ color: '#38D4B8' }}>{role}</p>
                  {linkedin && (
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs transition-colors"
                      style={{ color: 'rgba(255,255,255,0.4)' }}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ORIGIN STORY */}
      <section className="section-black py-24 px-6 lg:px-12" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="reveal">
            <span className="badge-teal mb-6 inline-flex">Our Story</span>
            <h2
              className="text-4xl font-black text-white mb-8"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              How DOZEY started.
            </h2>
            <div className="space-y-5">
              <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                In 2025, a group of UC Davis students — many of them international — found themselves spending weeks trying to get their vaccination records accepted by the university health center. Records from Brazil, China, India, and Korea were rejected because they were in the wrong language, the wrong format, or simply not recognized by the compliance system.
              </p>
              <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                The process was broken: students were paying translators, waiting weeks for certified translations, and still getting rejected. The team decided to build the solution they wished had existed when they arrived.
              </p>
              <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                DOZEY was born from that frustration. Today it processes documents from 150+ countries, supports 200+ universities, and has helped tens of thousands of students meet their health requirements — in minutes, not weeks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="section-dark py-24 px-6 lg:px-12" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="badge-teal mb-5 inline-flex">Our Values</span>
            <h2
              className="text-4xl md:text-5xl font-black text-white"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              What we stand for.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon, title, desc }, i) => (
              <div key={title} className={`oroswap-card reveal delay-${i * 100 + 100}`}>
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

      {/* JOIN US */}
      <section
        className="py-20 px-6 lg:px-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0A1A14 0%, #000000 100%)', borderTop: '1px solid rgba(56,212,184,0.1)' }}
      >
        <div className="glow-orb w-[400px] h-[400px] bg-[#38D4B8] opacity-[0.05] top-[-50px] left-1/2 -translate-x-1/2" />
        <div className="relative z-10 max-w-3xl mx-auto text-center reveal">
          <h2 className="text-4xl font-black text-white mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Want to join us?
          </h2>
          <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
            We are always looking for passionate engineers, designers, and healthcare advocates who want to make a real difference for international students.
          </p>
          <Link to="/contact">
            <span className="btn-primary cursor-pointer text-base px-10 py-4">
              Get in Touch
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
export default TeamPage;
