import { useEffect, useRef } from 'react';
import { Linkedin, GraduationCap, Award, ArrowRight, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import aashImg from '@/assets/aash-photo.png';
import isaacImg from '@/assets/isaac-photo.png';
import raghavImg from '@/assets/raghav-photo.png';

function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animated');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    ref.current?.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export function TeamPage() {
  const scrollRef = useScrollAnimation();

  const team = [
    {
      name: 'Aashreeti Deo',
      role: 'Co-Founder & CEO',
      bio: 'UC Davis student passionate about bridging healthcare accessibility gaps through technology. Experienced the challenges of vaccine record management firsthand across multiple countries.',
      photo: aashImg,
      social: { linkedin: 'https://www.linkedin.com/in/aashreeti-deo/' },
    },
    {
      name: 'Isaac Karottu',
      role: 'Co-Founder & CRO',
      bio: 'UC Davis Computer Science student with expertise in AI and secure systems. Leads revenue strategy and business development to bring DOZEY to users who need it most.',
      photo: isaacImg,
      social: { linkedin: 'https://www.linkedin.com/in/isaac-karottu-95242b2b3/' },
    },
    {
      name: 'Raghav Kedia',
      role: 'CTO',
      bio: 'UC Davis Computer Science and Economics student with expertise in AI and computing systems. Leads the technical architecture and development of DOZEY\'s platform.',
      photo: raghavImg,
      social: { linkedin: 'https://www.linkedin.com/in/raghav-kedia-169a42279/' },
    },
  ];

  return (
    <div ref={scrollRef} className="min-h-screen">
      <section className="relative min-h-[70vh] flex items-center bg-gradient-to-b from-[#f5f5f7] to-[#fbfbfd] text-[#1d1d1f] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-[#4d9068]/5 rounded-full blur-[150px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-40 w-full">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[#8aab45] text-xs font-semibold uppercase tracking-widest mb-6 animate-fade-in">
              Our Team
            </p>
            <h1 className="animate-fade-in-up text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[1.05] tracking-tight mb-6">
              Meet the people
              <br />
              behind <span className="text-[#8aab45]">DOZEY</span>
            </h1>
            <p className="animate-fade-in-up delay-200 text-base text-[#86868b] max-w-lg mx-auto font-light">
              Founded by UC Davis students who experienced the challenges of managing
              vaccination records across borders firsthand.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fbfbfd] to-transparent" />
      </section>

      <section className="py-24 lg:py-32 bg-[#fbfbfd]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-10">
            {team.map((member, index) => (
              <div
                key={index}
                className={`animate-on-scroll delay-${(index + 1) * 100} group`}
              >
                <div className="aspect-[3/4] overflow-hidden rounded-2xl mb-6 bg-[#f5f5f7]">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  />
                </div>
                <h2 className="text-lg font-semibold text-[#1d1d1f] mb-1">{member.name}</h2>
                <p className="text-xs text-[#86868b] mb-3 uppercase tracking-wide">
                  {member.role}
                </p>
                <p className="text-sm text-[#86868b] leading-relaxed mb-4">{member.bio}</p>
                <a
                  href={member.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#86868b] hover:text-[#4a7fb5] transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  LinkedIn
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-[#f5f5f7]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="animate-on-scroll bg-white rounded-2xl p-8 text-center">
              <GraduationCap className="w-6 h-6 text-[#1d1d1f]/30 mx-auto mb-4" />
              <h3 className="text-base font-semibold text-[#1d1d1f] mb-1">UC Davis</h3>
              <p className="text-sm text-[#86868b] leading-relaxed">Built at UC Davis with EIR mentorship, research resources, and a world-class innovation ecosystem.</p>
            </div>
            <div className="animate-on-scroll delay-200 bg-white rounded-2xl p-8 text-center">
              <Trophy className="w-6 h-6 text-[#1d1d1f]/30 mx-auto mb-4" />
              <h3 className="text-base font-semibold text-[#1d1d1f] mb-1">Award-Winning</h3>
              <p className="text-sm text-[#86868b] leading-relaxed">Recognized at Hult Prize Regionals for our innovative approach to global healthcare challenges.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-[#fbfbfd]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-on-scroll">
            <h2 className="text-3xl lg:text-4xl font-semibold text-[#1d1d1f] mb-4">
              Want to join our mission?
            </h2>
            <p className="text-base text-[#86868b] mb-10 font-light">
              We're always looking for passionate people who want to make healthcare more accessible.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#4a7fb5] hover:bg-[#3d6a9e] text-white font-semibold px-8 py-4 rounded-full text-base transition-all active:scale-[0.98]"
            >
              Get in Touch
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
