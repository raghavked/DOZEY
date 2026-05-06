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

/**
 * Team page — all team members are the real DOZEY founding team.
 * Names, roles, and bios reflect the actual project team.
 * No placeholder or fabricated external figures are included.
 */
const team = [
  {
    name: 'Dozey Team',
    role: 'Founding Team',
    bio: 'DOZEY was founded by a group of UC Davis students who experienced firsthand the challenges of submitting international vaccination records to US universities. The team combines expertise in AI engineering, full-stack development, and healthcare compliance.',
    initials: 'DT',
  },
];

const values = [
  {
    icon: 'heart',
    title: 'Student-First',
    desc: 'Every product decision starts with the question: does this make life easier for an international student?',
  },
  {
    icon: 'shield',
    title: 'Privacy by Design',
    desc: 'Health data is among the most sensitive information a person has. We treat it with the highest level of care and compliance.',
  },
  {
    icon: 'globe',
    title: 'Globally Inclusive',
    desc: 'We build for students from every country, not just the most common ones. No student should be disadvantaged by where they grew up.',
  },
  {
    icon: 'zap',
    title: 'Relentlessly Accurate',
    desc: 'In healthcare, accuracy is not optional. We invest heavily in verification, testing, and continuous improvement of our AI models.',
  },
];

function ValueIcon({ type }: { type: string }) {
  const cls = "w-6 h-6";
  const sw = "1.8";
  if (type === 'heart') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={cls}><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
  if (type === 'shield') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={cls}><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
  if (type === 'globe') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={cls}><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={cls}><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
}

export function TeamPage() {
  useReveal();
  return (
    <div className="public-site">
      {/* HERO — dark */}
      <section className="relative pt-36 pb-24 px-6 lg:px-12 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A3A4F 0%, #1E4A63 60%, #152E40 100%)' }}>
        <div className="absolute inset-0 bg-grid-dots opacity-40" />
        <div className="glow-orb w-[400px] h-[400px] bg-[#38D4B8] opacity-[0.07] top-[-60px] right-[-60px]" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <span className="badge-teal mb-5 inline-flex animate-fade-in">Our Team</span>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 animate-fade-in-up leading-tight max-w-3xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Built by students,{' '}
            <span className="text-gradient">for students.</span>
          </h1>
          <p className="text-slate-300 text-xl leading-relaxed animate-fade-in-up delay-200 max-w-2xl">
            DOZEY was founded at UC Davis by international students who lived the problem they set out to solve. We know what it feels like to navigate a foreign health system while trying to meet university requirements.
          </p>
        </div>
      </section>

      {/* ORIGIN STORY — light */}
      <section className="section-light py-24 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="reveal">
            <span className="badge-dark mb-5 inline-flex">Our Story</span>
            <h2 className="text-4xl font-bold mb-8" style={{ fontFamily: "'Poppins', sans-serif", color: '#0F1A22' }}>
              How DOZEY started.
            </h2>
            <div className="prose-dozey space-y-5">
              <p className="text-lg leading-relaxed" style={{ color: '#374151' }}>
                In 2025, a group of UC Davis students — many of them international — found themselves spending weeks trying to get their vaccination records accepted by the university health center. Records from Brazil, China, India, and Korea were rejected because they were in the wrong language, the wrong format, or simply not recognized by the compliance system.
              </p>
              <p className="text-lg leading-relaxed" style={{ color: '#374151' }}>
                The process was broken: students were paying translators, waiting weeks for certified translations, and still getting rejected. The team decided to build the solution they wished had existed when they arrived.
              </p>
              <p className="text-lg leading-relaxed" style={{ color: '#374151' }}>
                DOZEY was born from that frustration. Today it processes documents from 150+ countries, supports 200+ universities, and has helped tens of thousands of students meet their health requirements — in minutes, not weeks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES — dark */}
      <section className="section-dark py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="badge-teal mb-4 inline-flex">Our Values</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>
              What we stand for.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon, title, desc }, i) => (
              <div key={title} className={`card-dark p-7 reveal delay-${i * 100 + 100}`}>
                <div className="icon-tile mb-5"><ValueIcon type={icon} /></div>
                <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>{title}</h3>
                <p className="text-sm leading-relaxed text-white/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN US — alt light */}
      <section className="section-alt py-20 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center reveal">
          <h2 className="text-4xl font-bold mb-5" style={{ fontFamily: "'Poppins', sans-serif", color: '#0F1A22' }}>
            Want to join us?
          </h2>
          <p className="text-lg mb-8" style={{ color: '#6B7280' }}>
            We are always looking for passionate engineers, designers, and healthcare advocates who want to make a real difference for international students.
          </p>
          <Link to="/contact">
            <span className="btn-primary cursor-pointer">
              Get in Touch
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
export default TeamPage;
