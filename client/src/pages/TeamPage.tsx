import { Linkedin } from 'lucide-react';
import { Heart, Users, Syringe, Stethoscope } from 'lucide-react';
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
      role: 'Co-Founder & CTO',
      bio: 'UC Davis Computer Science student with expertise in AI and secure systems. Dedicated to building technology that solves real-world healthcare challenges.',
      photo: isaacImg,
      social: {
        linkedin: 'https://www.linkedin.com/in/isaac-karottu-95242b2b3/',
      },
    },
    {
      name: 'Raghav Kedia',
      role: 'Co-Founder & CIO',
      bio: 'UC Davis Computer Science and Economics student with expertise in AI and computing systems. Experienced in building and launching apps aimed toward the betterment of people.',
      photo: raghavImg,
      social: {
        linkedin: 'https://www.linkedin.com/in/raghav-kedia-169a42279/',
      },
    },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5 z-0">
        <Heart className="absolute top-10 right-1/4 w-40 h-40 text-[#26844f]" />
        <Users className="absolute bottom-20 left-10 w-36 h-36 text-[#1051a5]" />
        <Stethoscope className="absolute top-1/2 right-10 w-32 h-32 text-[#97bf2d] rotate-12" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="flex justify-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-md">
              <Users className="w-7 h-7 text-[#1051a5]" />
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shadow-md">
              <Heart className="w-7 h-7 text-[#26844f]" />
            </div>
          </div>
          <h1 className="text-5xl mb-6 text-[#22283a]">Meet the Team</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            DOZEY was founded by UC Davis students dedicated to solving the challenges of
            managing vaccination records across borders.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {team.map((member, index) => {
            const bgGradients = ['from-blue-50 to-indigo-100/50', 'from-emerald-50 to-green-100/50', 'from-amber-50 to-orange-100/50'];
            const borderColors = ['border-blue-200/60', 'border-green-200/60', 'border-amber-200/60'];

            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${bgGradients[index]} rounded-2xl overflow-hidden shadow-xl border-2 ${borderColors[index]} hover:shadow-2xl transition-all hover:scale-[1.02]`}
              >
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-8 bg-white/70">
                  <h2 className="text-2xl mb-2 text-[#22283a] font-semibold">{member.name}</h2>
                  <p className="text-[#1051a5] mb-6 font-medium">{member.role}</p>

                  <p className="text-gray-700 leading-relaxed mb-6">{member.bio}</p>

                  <div className="flex gap-4 pt-6 border-t border-gray-200">
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 hover:from-[#1051a5] hover:to-[#0d4185] text-[#1051a5] hover:text-white transition-all flex items-center justify-center shadow-md hover:shadow-lg"
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

        <div className="mt-20 bg-gradient-to-br from-indigo-100/70 via-blue-100/60 to-teal-100/70 rounded-2xl p-12 shadow-xl border-2 border-blue-200/50">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Syringe className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl mb-6 text-[#22283a] font-semibold">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              We believe that managing your health records shouldn't be a barrier to global
              mobility. DOZEY was born from personal experience navigating complex vaccination
              requirements across countries. Our mission is to empower individuals with secure,
              accessible, and internationally-recognized health records that move with them—wherever
              life takes them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
