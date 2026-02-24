import { useEffect, useRef } from 'react';
import { ArrowRight, Globe, Syringe, Shield, Lock, CheckCircle, FileText, Zap, ChevronRight, Users, Brain, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';

function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const elements = ref.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export function HomePage() {
  const scrollRef = useScrollAnimation();

  return (
    <div ref={scrollRef} className="min-h-screen">
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[#0a3d7a] via-[#1051a5] to-[#22283a] text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#97bf2d]/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#26844f]/8 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-5xl">
            <div className="animate-fade-in-up inline-flex items-center gap-2 bg-white/8 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2.5 mb-10">
              <div className="w-2 h-2 bg-[#97bf2d] rounded-full animate-pulse" />
              <span className="text-white/80 text-sm tracking-wide">
                Actively in development
              </span>
            </div>

            <h1 className="animate-fade-in-up delay-100 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[0.95] tracking-tight mb-8">
              Healthcare
              <br />
              that moves
              <br />
              <span className="text-[#97bf2d]">with you</span>
            </h1>

            <p className="animate-fade-in-up delay-200 text-lg sm:text-xl text-white/60 mb-12 max-w-xl leading-relaxed">
              Upload and convert your vaccine records into a format accepted worldwide — no delays, no repeat vaccinations, and no money lost.
            </p>

            <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row items-start gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-3 bg-[#97bf2d] hover:bg-[#88ad28] text-[#22283a] font-bold px-8 py-4 rounded-full text-lg transition-all hover:shadow-2xl hover:shadow-[#97bf2d]/20 active:scale-[0.98]"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/features"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white font-medium px-4 py-4 text-lg transition-colors"
              >
                See How It Works
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fefefe] to-transparent" />
      </section>

      <section className="py-24 lg:py-32 bg-[#fefefe]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { value: '5', label: 'Countries Validated', color: '#1051a5' },
              { value: '60+', label: 'Interviews Conducted', color: '#26844f' },
              { value: '86%', label: 'Validate Our Problem', color: '#22283a' },
              { value: '10+', label: 'Healthcare Experts', color: '#1051a5' },
            ].map((stat, i) => (
              <div key={stat.label} className={`animate-on-scroll text-center delay-${(i + 1) * 100}`}>
                <div className="text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-3" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-gray-500 text-sm font-medium uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-[#fefefe]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="animate-on-scroll">
              <span className="text-[#26844f] text-sm font-semibold uppercase tracking-widest mb-4 block">
                Our Mission
              </span>
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-[#22283a] leading-[1.05] mb-8">
                Healthcare records
                <br />
                should have{' '}
                <span className="text-[#26844f]">no borders</span>
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
                Millions of immigrants, refugees, and international workers face a fragmented
                healthcare system every time they cross a border. Vaccination records get lost,
                medical histories are untranslated, and critical health data remains trapped.
              </p>
              <div className="space-y-4">
                {[
                  'Bridging gaps in global health record portability',
                  'Supporting immigrant and refugee health equity',
                  'Making compliance tracking effortless across borders',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#26844f] flex items-center justify-center shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-[#22283a] font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-on-scroll delay-200 space-y-5">
              {[
                { icon: Globe, title: 'Records Lost in Translation', desc: 'Vaccine records from one country are not accepted in another due to language and format differences.' },
                { icon: Syringe, title: 'Unnecessary Revaccinations', desc: 'Without proof, people are forced to repeat vaccinations they already received.' },
                { icon: FileText, title: 'No Unified System', desc: 'There is no global standard for storing and sharing vaccination records across borders.' },
                { icon: Users, title: 'Millions Affected', desc: 'Immigrants, students, healthcare workers, and refugees face these barriers daily.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-5 p-5 rounded-2xl hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 bg-[#1051a5]/8 rounded-2xl flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-[#1051a5]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#22283a] mb-1">{title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-on-scroll text-center mb-20">
            <span className="text-[#1051a5] text-sm font-semibold uppercase tracking-widest mb-4 block">
              How It Works
            </span>
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-[#22283a] leading-tight">
              From upload to compliance
              <br />
              <span className="text-[#1051a5]">in minutes</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', icon: FileText, title: 'Upload Documents', desc: 'Upload vaccination cards, medical records, or doctor\'s notes in any language.', color: '#1051a5' },
              { step: '02', icon: Brain, title: 'AI Extracts & Translates', desc: 'Our AI reads handwritten and printed records, detects the language, and translates to English.', color: '#97bf2d' },
              { step: '03', icon: Syringe, title: 'Records Organized', desc: 'Vaccinations are automatically parsed and added to your timeline with dates and providers.', color: '#26844f' },
              { step: '04', icon: Shield, title: 'Check Compliance', desc: 'Compare your records against requirements for any school, employer, or country.', color: '#1051a5' },
            ].map(({ step, icon: Icon, title, desc, color }, i) => (
              <div key={step} className={`animate-on-scroll delay-${(i + 1) * 100} group`}>
                <div className="text-7xl font-black text-gray-100 mb-6 group-hover:text-gray-200 transition-colors">
                  {step}
                </div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: `${color}10` }}>
                  <Icon className="w-7 h-7" style={{ color }} />
                </div>
                <h3 className="text-xl font-bold text-[#22283a] mb-3">{title}</h3>
                <p className="text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 lg:py-32 bg-[#22283a] text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#1051a5]/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#26844f]/15 rounded-full blur-[80px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-on-scroll text-center mb-16">
            <span className="text-[#97bf2d] text-sm font-semibold uppercase tracking-widest mb-4 block">
              Security First
            </span>
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
              Built with privacy at the core
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Your health data deserves the highest level of protection.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Lock, title: 'HIPAA Compliant', desc: 'Following healthcare privacy standards to protect your information.' },
              { icon: Shield, title: '256-bit Encryption', desc: 'Bank-level encryption ensures your data remains private and secure.' },
              { icon: Languages, title: 'Multi-Language', desc: '7+ languages supported including Hindi, Chinese, Spanish, and Arabic.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className={`animate-on-scroll delay-${(i + 1) * 100} text-center`}>
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-8 h-8 text-[#97bf2d]" />
                </div>
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-[#fefefe]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-on-scroll">
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-[#22283a] mb-6 leading-tight">
              Ready to take control of your{' '}
              <span className="text-[#1051a5]">health records</span>?
            </h2>
            <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">
              Join immigrants, students, and global workers who manage their vaccination records the smart way.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-3 bg-[#1051a5] hover:bg-[#0d4185] text-white font-bold px-10 py-4 rounded-full text-lg transition-all hover:shadow-xl active:scale-[0.98]"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/progress"
                className="inline-flex items-center gap-2 text-[#1051a5] font-semibold text-lg hover:underline"
              >
                View Our Progress
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
