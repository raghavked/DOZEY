import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Users, ArrowRight, Upload, Brain, ClipboardCheck, Globe } from 'lucide-react';

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

const benefits = [
  {
    icon: Shield,
    title: 'Enterprise-grade security',
    desc: 'End-to-end encryption, HIPAA compliance, and full audit logs keep your health data private and protected.',
  },
  {
    icon: Zap,
    title: 'Instant record processing',
    desc: 'Upload a document in any language and get a structured, verified record in seconds — no manual entry.',
  },
  {
    icon: Users,
    title: 'Real support, real people',
    desc: 'Questions? Our team responds within 24 hours. No bots, no ticket queues — just humans helping humans.',
  },
];

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload your records',
    desc: 'Drag and drop vaccination cards, medical documents, or doctor\'s notes. We accept PDFs and images in any language.',
  },
  {
    number: '02',
    icon: Brain,
    title: 'AI reads and translates',
    desc: 'Our system extracts and translates your records automatically — preserving medical terminology with high accuracy.',
  },
  {
    number: '03',
    icon: ClipboardCheck,
    title: 'Check compliance instantly',
    desc: 'Compare your records against requirements for any institution, employer, or country. Get a downloadable report.',
  },
  {
    number: '04',
    icon: Globe,
    title: 'Share across borders',
    desc: 'Generate verified, shareable records accepted by healthcare providers and institutions worldwide.',
  },
];

export function HomePage() {
  const ref = useScrollFade();

  return (
    <div ref={ref} className="min-h-screen bg-[#F8F7F4] text-[#0A1428]">

      {/* ── Hero ── */}
      <section className="pt-36 pb-20 lg:pt-44 lg:pb-28">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <p className="text-sm font-medium text-[#10B981] uppercase tracking-widest mb-6">
                Healthcare that moves with you
              </p>
              <h1 className="text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight mb-6">
                Your health records,
                <br />
                wherever life takes you
              </h1>
              <p className="text-lg text-[#6B7280] leading-relaxed mb-8 max-w-lg">
                DOZEY makes it simple to manage, translate, and share your vaccination
                records across borders. No more lost paperwork, no more costly re-tests.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-[#0A1428] text-white text-base font-semibold rounded-[4px] hover:bg-[#1F2937] transition-colors active:scale-[0.98]"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/features"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#0A1428] text-base font-semibold rounded-[4px] border border-[#0A1428] hover:bg-[#F3F4F6] transition-colors"
                >
                  See How It Works
                </Link>
              </div>
              
            </div>

            {/* Visual panel */}
            <div className="relative hidden lg:block">
              <div className="bg-white border border-[#E5E7EB] rounded-[8px] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-[#10B981]/10 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-[#10B981]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0A1428]">Record Verified</p>
                    <p className="text-xs text-[#6B7280]">MMR Vaccine &mdash; Dose 2 of 2</p>
                  </div>
                  <span className="ml-auto text-xs font-medium text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full">
                    Compliant
                  </span>
                </div>
                <div className="space-y-3">
                  {['Yellow Fever', 'Hepatitis B', 'Typhoid', 'MMR'].map((vaccine, i) => (
                    <div key={vaccine} className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0">
                      <span className="text-sm text-[#0A1428]">{vaccine}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        i < 3
                          ? 'text-[#10B981] bg-[#10B981]/10'
                          : 'text-[#F97316] bg-[#F97316]/10'
                      }`}>
                        {i < 3 ? 'Verified' : 'Due soon'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-[#F3F4F6]">
                  <p className="text-xs text-[#6B7280]">Last synced &middot; just now</p>
                </div>
              </div>
              {/* Floating trust badge */}
              <div className="absolute -bottom-4 -left-4 bg-[#0A1428] text-white rounded-[8px] px-4 py-3 shadow-lg">
                <p className="text-xs font-semibold">HIPAA Compliant</p>
                <p className="text-xs text-white/60">End-to-end encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="py-10 border-y border-[#E5E7EB] bg-white">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <p className="text-center text-sm text-[#6B7280] mb-6">
            Trusted by immigrants, students, and global workers in 40+ countries
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-[#0A1428]/40">
            {['HIPAA Compliant', 'SOC 2 Type II', 'GDPR Ready', 'End-to-End Encrypted', '40+ Countries'].map((badge) => (
              <span key={badge} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="fade-in opacity-0 translate-y-6 transition-all duration-500 text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
              Why people choose DOZEY
            </h2>
            <p className="text-[#6B7280] text-lg max-w-xl mx-auto">
              We make healthcare records simple. No more sleepless nights over missing documents.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className={`fade-in opacity-0 translate-y-6 transition-all duration-500 delay-${i * 100} bg-white border border-[#E5E7EB] rounded-[8px] p-8 hover:border-[#D1D5DB] transition-colors`}
              >
                <div className="w-10 h-10 bg-[#F3F4F6] rounded-[4px] flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-[#0A1428]" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-[#0A1428] mb-3">{title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 lg:py-28 bg-white border-y border-[#E5E7EB]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="fade-in opacity-0 translate-y-6 transition-all duration-500 mb-16">
            <p className="text-sm font-medium text-[#10B981] uppercase tracking-widest mb-3">
              The process
            </p>
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight max-w-lg">
              From upload to compliance in four steps
            </h2>
          </div>
          <div className="space-y-16">
            {steps.map(({ number, icon: Icon, title, desc }, i) => (
              <div
                key={number}
                className={`fade-in opacity-0 translate-y-6 transition-all duration-500 grid lg:grid-cols-2 gap-12 items-center ${
                  i % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <span className="text-6xl font-light text-[#0A1428]/8 tabular-nums block mb-3">{number}</span>
                  <h3 className="text-2xl font-semibold text-[#0A1428] mb-3">{title}</h3>
                  <p className="text-[#6B7280] leading-relaxed">{desc}</p>
                  <Link
                    to="/features"
                    className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-[#0A1428] underline underline-offset-4 hover:text-[#1F2937] transition-colors"
                  >
                    Learn more <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className={`${i % 2 === 1 ? 'lg:order-1' : ''} flex items-center justify-center`}>
                  <div className="w-full max-w-sm bg-[#F8F7F4] border border-[#E5E7EB] rounded-[8px] p-10 flex items-center justify-center">
                    <Icon className="w-16 h-16 text-[#0A1428]/20" strokeWidth={1} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Real stories ── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="fade-in opacity-0 translate-y-6 transition-all duration-500 mb-12">
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
              Real problems, real people
            </h2>
            <p className="text-[#6B7280] text-lg max-w-xl">
              Every feature in DOZEY was built because someone, somewhere, faced a real
              barrier with their health records.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                quote: 'My children\'s vaccination booklets from Argentina were not recognized by the Italian school system. We had to get blood tests to prove immunity — over 600 euros.',
                name: 'Sofia R.',
                location: 'Argentina → Italy',
                category: 'Education',
              },
              {
                quote: 'My Korean vaccination records listed vaccine brand names that don\'t exist in Canada. The pharmacist had no idea which Canadian equivalent each one corresponded to.',
                name: 'Lisa K.',
                location: 'South Korea → Canada',
                category: 'Immigration',
              },
            ].map(({ quote, name, location, category }) => (
              <div
                key={name}
                className="fade-in opacity-0 translate-y-6 transition-all duration-500 bg-white border border-[#E5E7EB] rounded-[8px] p-8"
              >
                <span className="inline-block text-xs font-medium text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-full mb-4">
                  {category}
                </span>
                <blockquote className="text-[#0A1428] text-base leading-relaxed mb-6">
                  &ldquo;{quote}&rdquo;
                </blockquote>
                <div>
                  <p className="text-sm font-semibold text-[#0A1428]">{name}</p>
                  <p className="text-sm text-[#6B7280]">{location}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/progress"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0A1428] underline underline-offset-4 hover:text-[#1F2937] transition-colors"
            >
              Read more stories <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 lg:py-28 bg-[#0A1428]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-semibold text-white tracking-tight mb-4">
            Ready to take control of your health records?
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-lg mx-auto">
            Join people in 40+ countries who trust DOZEY to protect what matters most.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#10B981] text-[#0A1428] text-base font-semibold rounded-[4px] hover:bg-[#0ea572] transition-colors active:scale-[0.98]"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
          
        </div>
      </section>

    </div>
  );
}
