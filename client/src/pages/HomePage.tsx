import { ArrowRight, Globe, Syringe, Heart, Shield, Stethoscope, Activity, CheckCircle, Lock, Users, FileText, Zap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1051a5] via-[#0d4290] to-[#22283a] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#97bf2d] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#26844f] rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1051a5] rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8">
              <div className="w-2 h-2 bg-[#97bf2d] rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">
                Actively in development — prioritizing your privacy & security
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-8">
              Healthcare that moves{' '}
              <span className="text-[#97bf2d]">with you</span>
            </h1>

            <p className="text-xl sm:text-2xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
              Upload and convert your vaccine records into a format accepted worldwide — no delays, no repeat vaccinations, and no money lost.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-[#97bf2d] hover:bg-[#88ad28] text-[#22283a] font-bold px-10 py-4 rounded-xl text-lg transition-all hover:shadow-xl hover:shadow-[#97bf2d]/30 active:scale-95"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/features"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold px-10 py-4 rounded-xl text-lg transition-all"
              >
                See How It Works
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8">
              {[
                { icon: Lock, text: 'HIPAA Compliant' },
                { icon: Shield, text: '256-bit Encryption' },
                { icon: CheckCircle, text: 'Free to Use' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-white/70">
                  <Icon className="w-5 h-5 text-[#97bf2d]" />
                  <span className="text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#fefefe] to-transparent" />
      </section>

      <section className="py-20 lg:py-28 bg-[#fefefe]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { value: '5', label: 'Countries Validated', sublabel: 'Expanding to more', color: '#1051a5' },
              { value: '60+', label: 'Interviews Conducted', sublabel: 'Users & professionals', color: '#26844f' },
              { value: '86%', label: 'Validate Our Problem', sublabel: 'From survey responses', color: '#97bf2d' },
              { value: '10+', label: 'Healthcare Experts', sublabel: 'Consulted & validated', color: '#1051a5' },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="text-5xl lg:text-6xl font-bold mb-3" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-[#22283a] font-semibold text-lg mb-1">{stat.label}</div>
                <div className="text-gray-500 text-sm">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 to-blue-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block bg-[#26844f]/10 text-[#26844f] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                Our Mission
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#22283a] mb-6 leading-tight">
                Healthcare Records Should Have{' '}
                <span className="text-[#26844f]">No Borders</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Millions of immigrants, refugees, and international workers face a fragmented
                healthcare system every time they cross a border. Vaccination records get lost,
                medical histories are untranslated, and critical health data remains trapped in
                incompatible systems.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                DOZEY was born from personal experience navigating complex vaccination requirements
                across countries. Our mission is to empower individuals with secure, accessible, and
                internationally-recognized health records that move with them — wherever life takes them.
              </p>
              <div className="space-y-4">
                {[
                  'Bridging gaps in global health record portability',
                  'Supporting immigrant and refugee health equity',
                  'Making compliance tracking effortless across borders',
                  'Building trust through transparent, secure data handling',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#26844f] mt-0.5 shrink-0" />
                    <span className="text-[#22283a] text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
                <h3 className="text-2xl font-bold text-[#22283a] mb-8 text-center">The Problem We Solve</h3>
                <div className="space-y-6">
                  {[
                    { icon: Globe, title: 'Records Lost in Translation', desc: 'Vaccine records from one country are not accepted in another due to language and format differences.' },
                    { icon: Syringe, title: 'Unnecessary Revaccinations', desc: 'Without proof, people are forced to repeat vaccinations they already received — wasting time and money.' },
                    { icon: FileText, title: 'No Unified System', desc: 'There is no global standard for storing and sharing vaccination records across borders.' },
                    { icon: Users, title: 'Millions Affected', desc: 'Immigrants, students, healthcare workers, and refugees face these barriers daily.' },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex gap-4">
                      <div className="w-12 h-12 bg-[#1051a5]/10 rounded-xl flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-[#1051a5]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#22283a] mb-1">{title}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#97bf2d]/15 rounded-full blur-2xl" />
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-[#1051a5]/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-[#fefefe]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-[#1051a5]/10 text-[#1051a5] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              How It Works
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#22283a] mb-4">
              From Upload to <span className="text-[#1051a5]">Compliance</span> in Minutes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered pipeline handles the heavy lifting so you can focus on what matters.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '1', icon: FileText, title: 'Upload Documents', desc: 'Upload vaccination cards, medical records, or doctor\'s notes in any language — PDFs, photos, or scans.', color: '#1051a5' },
              { step: '2', icon: Zap, title: 'AI Extracts & Translates', desc: 'Our AI reads handwritten and printed records, detects the language, and translates everything to English.', color: '#97bf2d' },
              { step: '3', icon: Syringe, title: 'Records Organized', desc: 'Vaccinations are automatically parsed and added to your timeline with dates, doses, and providers.', color: '#26844f' },
              { step: '4', icon: Shield, title: 'Check Compliance', desc: 'Compare your records against requirements for any school, employer, or country instantly.', color: '#1051a5' },
            ].map(({ step, icon: Icon, title, desc, color }) => (
              <div key={step} className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 group">
                <div className="absolute -top-4 left-6 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg" style={{ backgroundColor: color }}>
                  {step}
                </div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 mt-2 transition-colors duration-300" style={{ backgroundColor: `${color}15` }}>
                  <Icon className="w-7 h-7" style={{ color }} />
                </div>
                <h3 className="text-xl font-bold text-[#22283a] mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-gradient-to-br from-[#22283a] via-[#1051a5] to-[#0d4290] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Stethoscope className="absolute top-10 right-20 w-48 h-48 rotate-12" />
          <Activity className="absolute bottom-10 left-20 w-40 h-40 -rotate-12" />
          <Heart className="absolute top-1/2 left-1/2 w-32 h-32" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-white/10 text-white/90 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              Active Development
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Built with <span className="text-[#97bf2d]">Security First</span>
            </h2>
            <p className="text-xl text-white/80 mb-12 leading-relaxed">
              DOZEY is in active development with privacy and security at the core of everything we build.
              Your health data deserves the highest level of protection.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Lock, title: 'HIPAA Compliant', desc: 'Following healthcare privacy standards to protect your health information.' },
                { icon: Shield, title: '256-bit Encryption', desc: 'Bank-level encryption ensures your data remains private and secure.' },
                { icon: Activity, title: 'Audit Trail', desc: 'Every access to your records is logged for complete transparency.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-8 hover:bg-white/15 transition-all">
                  <Icon className="w-10 h-10 text-[#97bf2d] mb-5" />
                  <h3 className="text-xl font-bold mb-3">{title}</h3>
                  <p className="text-white/70 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-[#fefefe]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#22283a] mb-6">
            Ready to Take Control of Your <span className="text-[#1051a5]">Health Records</span>?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Join thousands of immigrants, students, and global workers who are managing their vaccination records the smart way.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-[#1051a5] hover:bg-[#0d4185] text-white font-bold px-10 py-4 rounded-xl text-lg transition-all hover:shadow-xl active:scale-95"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/progress"
              className="inline-flex items-center gap-2 border-2 border-[#1051a5] text-[#1051a5] font-semibold px-10 py-4 rounded-xl text-lg hover:bg-[#1051a5] hover:text-white transition-all"
            >
              View Our Progress
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
