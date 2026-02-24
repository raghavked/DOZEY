import { Linkedin, GraduationCap, Heart, Users, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import aashImg from '@/assets/aash-photo.png';
import isaacImg from '@/assets/isaac-photo.png';
import raghavImg from '@/assets/raghav-photo.png';

export function TeamPage() {
  const team = [
    {
      name: 'Aashreeti Deo',
      role: 'Co-Founder & CEO',
      bio: 'UC Davis student passionate about bridging healthcare accessibility gaps through technology. Experienced the challenges of vaccine record management firsthand across multiple countries.',
      photo: aashImg,
      social: {
        linkedin: 'https://www.linkedin.com/in/aashreeti-deo/',
      },
    },
    {
      name: 'Isaac Karottu',
      role: 'Co-Founder & CRO',
      bio: 'UC Davis Computer Science student with expertise in AI and secure systems. Leads revenue strategy and business development to bring DOZEY to users who need it most.',
      photo: isaacImg,
      social: {
        linkedin: 'https://www.linkedin.com/in/isaac-karottu-95242b2b3/',
      },
    },
    {
      name: 'Raghav Kedia',
      role: 'Co-Founder & CTO',
      bio: 'UC Davis Computer Science and Economics student with expertise in AI and computing systems. Leads the technical architecture and development of DOZEY\'s platform.',
      photo: raghavImg,
      social: {
        linkedin: 'https://www.linkedin.com/in/raghav-kedia-169a42279/',
      },
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1051a5] via-[#0d4290] to-[#22283a] text-white py-24 lg:py-32">
        <div className="absolute inset-0 opacity-10">
          <Heart className="absolute top-10 right-1/4 w-48 h-48" />
          <Users className="absolute bottom-10 left-20 w-40 h-40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-white/10 text-white/90 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            Our Team
          </span>
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            Meet the People Behind <span className="text-[#97bf2d]">DOZEY</span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Founded by UC Davis students who experienced the challenges of managing
            vaccination records across borders firsthand.
          </p>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-[#fefefe]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {team.map((member, index) => {
              const accentColors = ['#1051a5', '#26844f', '#97bf2d'];
              const color = accentColors[index];

              return (
                <div
                  key={index}
                  className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-2 group"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-[#22283a] mb-2">{member.name}</h2>
                    <p className="font-semibold mb-5 text-lg" style={{ color }}>
                      {member.role}
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-6">{member.bio}</p>
                    <div className="flex gap-3 pt-5 border-t border-gray-100">
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-md hover:shadow-lg text-white"
                        style={{ backgroundColor: color }}
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-blue-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-10 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <GraduationCap className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-[#22283a] mb-2">UC Davis</h3>
              <p className="text-gray-600">Built at UC Davis with access to EIR mentorship, research resources, and a world-class innovation ecosystem.</p>
            </div>
            <div className="bg-white rounded-2xl p-10 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-[#22283a] mb-2">Award-Winning</h3>
              <p className="text-gray-600">Recognized at Hult Prize Regionals for our innovative approach to solving global healthcare challenges.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-[#fefefe]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-[#22283a] mb-6">
            Want to Join Our <span className="text-[#1051a5]">Mission</span>?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            We're always looking for passionate people who want to make healthcare more accessible.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-[#1051a5] hover:bg-[#0d4185] text-white font-bold px-10 py-4 rounded-xl text-lg transition-all hover:shadow-xl active:scale-95"
          >
            Get in Touch
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
