import { useEffect, useRef } from 'react';
import { ArrowRight, Globe, Syringe, Shield, Lock, CheckCircle, FileText, ChevronRight, Users, Brain, Languages } from 'lucide-react';
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
      <section className="relative min-h-[100vh] flex items-center bg-gradient-to-b from-[#0a3d7a] via-[#1051a5] to-[#1a4a8a] text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-[800px] h-[800px] bg-[#97bf2d]/5 rounded-full blur-[200px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-[#26844f]/5 rounded-full blur-[160px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="animate-fade-in-up text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-semibold leading-[1.05] tracking-tight mb-8">
              Healthcare that
              <br />
              moves <span className="text-[#97bf2d]">with you</span>
            </h1>

            <p className="animate-fade-in-up delay-100 text-lg sm:text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              Upload and convert your vaccine records into a format accepted worldwide. No delays, no repeat vaccinations, no money lost.
            </p>

            <div className="animate-fade-in-up delay-200 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-white text-[#22283a] font-semibold px-8 py-4 rounded-full text-base transition-all hover:bg-white/90 active:scale-[0.98]"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/features"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white font-medium px-6 py-4 text-base transition-colors"
              >
                How It Works
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#fefefe] to-transparent" />
      </section>

      <section className="py-20 lg:py-28 bg-[#fefefe]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16">
            {[
              { value: '5', label: 'Countries Validated', color: '#1051a5' },
              { value: '60+', label: 'Interviews Conducted', color: '#26844f' },
              { value: '86%', label: 'Validate Our Problem', color: '#22283a' },
              { value: '10+', label: 'Healthcare Experts', color: '#1051a5' },
            ].map((stat, i) => (
              <div key={stat.label} className={`animate-on-scroll text-center delay-${(i + 1) * 100}`}>
                <div className="text-5xl lg:text-6xl font-semibold tracking-tight mb-2" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-gray-400 text-xs font-medium uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-[#fefefe]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="animate-on-scroll">
              <p className="text-[#1051a5] text-xs font-semibold uppercase tracking-widest mb-6">
                Our Mission
              </p>
              <h2 className="text-4xl lg:text-5xl font-semibold text-[#22283a] leading-[1.1] mb-8">
                Healthcare records
                <br />
                should have{' '}
                <span className="text-[#26844f]">no borders</span>
              </h2>
              <p className="text-base text-gray-400 leading-relaxed mb-10 max-w-lg">
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
                    <CheckCircle className="w-4 h-4 text-[#26844f] shrink-0" />
                    <span className="text-[#22283a] text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-on-scroll delay-200 space-y-3">
              {[
                { icon: Globe, title: 'Records Lost in Translation', desc: 'Vaccine records from one country are not accepted in another due to language and format differences.' },
                { icon: Syringe, title: 'Unnecessary Revaccinations', desc: 'Without proof, people are forced to repeat vaccinations they already received.' },
                { icon: FileText, title: 'No Unified System', desc: 'There is no global standard for storing and sharing vaccination records across borders.' },
                { icon: Users, title: 'Millions Affected', desc: 'Immigrants, students, healthcare workers, and refugees face these barriers daily.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4 p-5 rounded-2xl hover:bg-gray-50/80 transition-colors">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#22283a]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#22283a] text-sm mb-1">{title}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-on-scroll text-center mb-20">
            <p className="text-[#1051a5] text-xs font-semibold uppercase tracking-widest mb-4">
              How It Works
            </p>
            <h2 className="text-4xl lg:text-5xl font-semibold text-[#22283a] leading-tight">
              From upload to compliance
              <br />
              <span className="text-[#1051a5]">in minutes</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { step: '01', icon: FileText, title: 'Upload Documents', desc: 'Upload vaccination cards, medical records, or doctor\'s notes in any language.' },
              { step: '02', icon: Brain, title: 'AI Extracts & Translates', desc: 'Our AI reads handwritten and printed records, detects the language, and translates to English.' },
              { step: '03', icon: Syringe, title: 'Records Organized', desc: 'Vaccinations are automatically parsed and added to your timeline with dates and providers.' },
              { step: '04', icon: Shield, title: 'Check Compliance', desc: 'Compare your records against requirements for any school, employer, or country.' },
            ].map(({ step, icon: Icon, title, desc }, i) => (
              <div key={step} className={`animate-on-scroll delay-${(i + 1) * 100}`}>
                <div className="text-5xl font-light text-gray-200 mb-6 tabular-nums">
                  {step}
                </div>
                <div className="w-10 h-10 bg-[#22283a] rounded-xl flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-semibold text-[#22283a] mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 lg:py-28 bg-[#22283a] text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1051a5]/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-on-scroll text-center mb-16">
            <p className="text-[#97bf2d] text-xs font-semibold uppercase tracking-widest mb-4">
              Security
            </p>
            <h2 className="text-4xl lg:text-5xl font-semibold mb-6 leading-tight">
              Built with privacy at the core
            </h2>
            <p className="text-lg text-white/40 max-w-2xl mx-auto font-light">
              Your health data deserves the highest level of protection.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {[
              { icon: Lock, title: 'HIPAA Compliant', desc: 'Following healthcare privacy standards to protect your information.' },
              { icon: Shield, title: '256-bit Encryption', desc: 'Bank-level encryption ensures your data remains private and secure.' },
              { icon: Languages, title: 'Multi-Language', desc: '7+ languages supported including Hindi, Chinese, Spanish, and Arabic.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className={`animate-on-scroll delay-${(i + 1) * 100} text-center`}>
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-6 h-6 text-white/60" />
                </div>
                <h3 className="text-sm font-semibold mb-2">{title}</h3>
                <p className="text-white/30 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-[#fefefe]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-on-scroll">
            <h2 className="text-4xl lg:text-5xl font-semibold text-[#22283a] mb-6 leading-tight">
              Ready to take control of
              <br />
              your <span className="text-[#1051a5]">health records</span>?
            </h2>
            <p className="text-lg text-gray-400 mb-12 max-w-xl mx-auto font-light">
              Join immigrants, students, and global workers who manage their vaccination records the smart way.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-[#1051a5] hover:bg-[#0d4185] text-white font-semibold px-8 py-4 rounded-full text-base transition-all active:scale-[0.98]"
              >
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/progress"
                className="inline-flex items-center gap-2 text-[#1051a5] font-medium text-base hover:underline"
              >
                View Our Progress
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
