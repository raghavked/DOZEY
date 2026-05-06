import { Linkedin } from 'lucide-react';
import aashImg from '@/assets/aash-photo.png';
import isaacImg from '@/assets/isaac-photo.png';
import raghavImg from '@/assets/raghav-photo.png';

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
  return (
    <div className="min-h-screen bg-[#0A1428] text-white">

      {/* Hero */}
      <section className="pt-36 pb-20 lg:pt-48 lg:pb-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#10B981]/10 border border-[#10B981]/20 rounded-full px-4 py-1.5 mb-8">
              <span className="text-xs font-medium text-[#10B981] tracking-wide">Our Team</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              Built by students<br />
              <span className="text-[#10B981]">who lived this.</span>
            </h1>
            <p className="text-lg text-[#94A3B8] leading-relaxed">
              We are UC Davis students who navigated the same confusing, stressful process of submitting international health records. We built DOZEY so no one else has to go through it alone.
            </p>
          </div>
        </div>
      </section>

      {/* Team cards */}
      <section className="py-24 bg-[#060D1A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map(({ name, role, bio, photo, linkedin }) => (
              <div key={name} className="bg-[#111827] border border-white/10 rounded-lg overflow-hidden hover:border-[#10B981]/30 transition-colors group">
                {/* Photo */}
                <div className="aspect-[3/4] overflow-hidden bg-[#1E293B]">
                  <img
                    src={photo}
                    alt={`${name}, ${role}`}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {/* Info */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-0.5">{name}</h3>
                  <p className="text-sm font-medium text-[#10B981] mb-3">{role}</p>
                  <p className="text-sm text-[#94A3B8] leading-relaxed mb-4">{bio}</p>
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B] hover:text-[#10B981] transition-colors"
                    aria-label={`${name} on LinkedIn`}
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    LinkedIn
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-8">Our mission</h2>
            <p className="text-lg text-[#94A3B8] leading-relaxed mb-6">
              Every year, thousands of international students arrive at U.S. universities with vaccination records in foreign languages, only to face registration holds and bureaucratic delays that have nothing to do with their academic readiness.
            </p>
            <p className="text-lg text-[#94A3B8] leading-relaxed">
              DOZEY exists to eliminate that barrier. We believe where you come from should never determine how easily you can access education.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
