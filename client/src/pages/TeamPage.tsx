import { useEffect, useRef } from 'react';
import { Linkedin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import aashImg from '@/assets/aash-photo.png';
import isaacImg from '@/assets/isaac-photo.png';
import raghavImg from '@/assets/raghav-photo.png';

function useScrollFade() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-6');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    ref.current?.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return ref;
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
    bio: 'UC Davis Computer Science and Economics student with expertise in AI and computing systems. Leads the technical architecture and development of DOZEY\'s platform.',
    photo: raghavImg,
    linkedin: 'https://www.linkedin.com/in/raghav-kedia-169a42279/',
  },
];

export function TeamPage() {
  const ref = useScrollFade();

  return (
    <div ref={ref} className="min-h-screen bg-[#F8F7F4] text-[#0A1428]">

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#10B981] uppercase tracking-widest mb-4">
              Our Team
            </p>
            <h1 className="text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight mb-6">
              Meet the people
              <br />
              behind DOZEY
            </h1>
            <p className="text-lg text-[#6B7280] leading-relaxed">
              Founded by UC Davis students who experienced the challenges of managing
              vaccination records across borders firsthand.
            </p>
          </div>
        </div>
      </section>

      {/* ── Team grid ── */}
      <section className="py-20 lg:py-28 bg-white border-y border-[#E5E7EB]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {team.map(({ name, role, bio, photo, linkedin }, i) => (
              <div
                key={name}
                className="fade-in opacity-0 translate-y-6 transition-all duration-500 bg-[#F8F7F4] border border-[#E5E7EB] rounded-[8px] overflow-hidden hover:border-[#D1D5DB] transition-colors"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#F3F4F6]">
                  <img
                    src={photo}
                    alt={`${name}, ${role}`}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-[#0A1428] mb-0.5">{name}</h3>
                  <p className="text-sm font-medium text-[#10B981] mb-3">{role}</p>
                  <p className="text-sm text-[#6B7280] leading-relaxed mb-4">{bio}</p>
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#0A1428] hover:text-[#1F2937] transition-colors"
                    aria-label={`${name} on LinkedIn`}
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="max-w-3xl fade-in opacity-0 translate-y-6 transition-all duration-500">
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-6">
              Why we built DOZEY
            </h2>
            <p className="text-lg text-[#6B7280] leading-relaxed mb-6">
              As international students ourselves, we know what it feels like to arrive in a
              new country with records that nobody recognizes. We spent weeks chasing down
              documents, paying for repeat tests, and navigating bureaucracy that assumed
              everyone had the same healthcare background.
            </p>
            <p className="text-lg text-[#6B7280] leading-relaxed mb-8">
              DOZEY exists because health records should follow the person, not the country.
              We built the tool we wished existed.
            </p>
            <Link
              to="/progress"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0A1428] underline underline-offset-4 hover:text-[#1F2937] transition-colors"
            >
              Read the stories that inspired us <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-[#0A1428]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold text-white tracking-tight mb-4">
            Want to work with us?
          </h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            We&apos;re a small team with big ambitions. Get in touch.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#10B981] text-[#0A1428] font-semibold rounded-[4px] hover:bg-[#0ea572] transition-colors active:scale-[0.98]"
          >
            Contact Us <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
