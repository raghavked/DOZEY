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
      color: '#1051a5',
      social: { linkedin: 'https://www.linkedin.com/in/aashreeti-deo/' },
    },
    {
      name: 'Isaac Karottu',
      role: 'Co-Founder & CRO',
      bio: 'UC Davis Computer Science student with expertise in AI and secure systems. Leads revenue strategy and business development to bring DOZEY to users who need it most.',
      photo: isaacImg,
      color: '#26844f',
      social: { linkedin: 'https://www.linkedin.com/in/isaac-karottu-95242b2b3/' },
    },
    {
      name: 'Raghav Kedia',
      role: 'Co-Founder & CTO',
      bio: 'UC Davis Computer Science and Economics student with expertise in AI and computing systems. Leads the technical architecture and development of DOZEY\'s platform.',
      photo: raghavImg,
      color: '#22283a',
      social: { linkedin: 'https://www.linkedin.com/in/raghav-kedia-169a42279/' },
    },
  ];

  return (
    <div ref={scrollRef} className="min-h-screen">
      <section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-[#0a3d7a] via-[#1051a5] to-[#22283a] text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-[#26844f]/6 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-40 w-full">
          <div className="max-w-3xl">
            <span className="text-[#97bf2d] text-sm font-semibold uppercase tracking-widest mb-4 block animate-fade-in">
              Our Team
            </span>
            <h1 className="animate-fade-in-up text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[0.95] tracking-tight mb-6">
              Meet the people
              <br />
              behind <span className="text-[#97bf2d]">DOZEY</span>
            </h1>
            <p className="animate-fade-in-up delay-200 text-lg text-white/50 max-w-lg">
              Founded by UC Davis students who experienced the challenges of managing
              vaccination records across borders firsthand.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fefefe] to-transparent" />
      </section>

      <section className="py-24 lg:py-32 bg-[#fefefe]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <div
                key={index}
                className={`animate-on-scroll delay-${(index + 1) * 100} group`}
              >
                <div className="aspect-[3/4] overflow-hidden rounded-2xl mb-6 bg-gray-100">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h2 className="text-2xl font-extrabold text-[#22283a] mb-1">{member.name}</h2>
                <p className="font-semibold text-sm mb-4 uppercase tracking-wide" style={{ color: member.color }}>
                  {member.role}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{member.bio}</p>
                <a
                  href={member.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#1051a5] transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="animate-on-scroll bg-white rounded-2xl p-10 border border-gray-100 text-center">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <GraduationCap className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-extrabold text-[#22283a] mb-2">UC Davis</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Built at UC Davis with EIR mentorship, research resources, and a world-class innovation ecosystem.</p>
            </div>
            <div className="animate-on-scroll delay-200 bg-white rounded-2xl p-10 border border-gray-100 text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Trophy className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-extrabold text-[#22283a] mb-2">Award-Winning</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Recognized at Hult Prize Regionals for our innovative approach to global healthcare challenges.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-[#fefefe]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-on-scroll">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#22283a] mb-6">
              Want to join our mission?
            </h2>
            <p className="text-xl text-gray-400 mb-10">
              We're always looking for passionate people who want to make healthcare more accessible.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 bg-[#1051a5] hover:bg-[#0d4185] text-white font-bold px-10 py-4 rounded-full text-lg transition-all hover:shadow-xl active:scale-[0.98]"
            >
              Get in Touch
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
