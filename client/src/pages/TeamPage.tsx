import { useEffect } from 'react';
import aashImg from '@/assets/aash-photo.png';
import isaacImg from '@/assets/isaac-photo.png';
import raghavImg from '@/assets/raghav-photo.png';

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

const team = [
  {
    name: 'Aashreeti Deo',
    role: 'Co-Founder & CEO',
    bio: 'UC Davis student passionate about bridging healthcare accessibility gaps through technology. Experienced the challenges of vaccine record management firsthand across multiple countries.',
    photo: aashImg,
    linkedin: 'https://www.linkedin.com/in/aashreeti-deo/',
  },
  {
    name: 'Isaac Karottu',
    role: 'Co-Founder & CRO',
    bio: 'UC Davis Computer Science student with expertise in AI and secure systems. Leads revenue strategy and business development to bring DOZEY to users who need it most.',
    photo: isaacImg,
    linkedin: 'https://www.linkedin.com/in/isaac-karottu-95242b2b3/',
  },
  {
    name: 'Raghav Kedia',
    role: 'CTO',
    bio: "UC Davis Computer Science and Economics student with expertise in AI and computing systems. Leads the technical architecture and development of DOZEY's platform.",
    photo: raghavImg,
    linkedin: 'https://www.linkedin.com/in/raghav-kedia-169a42279/',
  },
];

export function TeamPage() {
  useReveal();

  return (
    <div className="public-site bg-[#0A1428] min-h-screen text-white">

      {/* Hero */}
      <section className="relative pt-36 pb-20 px-6 lg:px-12 overflow-hidden bg-grid-dots">
        <div className="glow-orb w-[400px] h-[400px] bg-[#00D9A3] opacity-[0.06] top-[-60px] right-[-60px]" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <span className="badge-teal mb-5 inline-flex animate-fade-in-up">Our Team</span>
          <h1 className="text-5xl md:text-6xl font-black mb-6 animate-fade-in-up delay-100 leading-tight max-w-3xl"
            style={{ fontFamily: "'Poppins', sans-serif" }}>
            Built by students who{' '}
            <span className="text-gradient">lived this.</span>
          </h1>
          <p className="text-slate-300 text-xl leading-relaxed animate-fade-in-up delay-200 max-w-2xl">
            We are UC Davis students who navigated the same confusing, stressful process of submitting international health records. We built DOZEY so no one else has to go through it alone.
          </p>
        </div>
      </section>

      {/* Team cards */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map(({ name, role, bio, photo, linkedin }, i) => (
              <div key={name} className={`card-dark overflow-hidden group reveal delay-${i * 150 + 100}`}>
                {/* Photo — portrait aspect, face centered */}
                <div className="aspect-[3/4] overflow-hidden bg-[#111827]">
                  <img
                    src={photo}
                    alt={name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                {/* Info */}
                <div className="p-6">
                  <span className="badge-teal mb-3 inline-flex">{role}</span>
                  <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>{name}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{bio}</p>
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#00D9A3] text-sm font-medium hover:text-white transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6 lg:px-12 text-center" style={{ background: 'linear-gradient(135deg, #0F2A4A 0%, #0A1428 100%)' }}>
        <div className="max-w-3xl mx-auto reveal">
          <span className="badge-teal mb-5 inline-flex">Our Mission</span>
          <h2 className="text-3xl md:text-4xl font-black mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Healthcare access shouldn't depend on{' '}
            <span className="text-gradient">where you were born.</span>
          </h2>
          <p className="text-slate-300 leading-relaxed">
            DOZEY exists to ensure that every international student — regardless of their country of origin, language, or document format — can meet US university health requirements with confidence and dignity.
          </p>
        </div>
      </section>

    </div>
  );
}

export default TeamPage;
