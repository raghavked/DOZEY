import { useEffect, useRef } from 'react';
import { Upload, Brain, Shield, Share2, ArrowRight, Syringe, Lock, FileCheck, Globe, Languages, ClipboardCheck, Zap, FileText, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const pipeline = [
  {
    step: '01',
    icon: Upload,
    title: 'Upload your records',
    desc: 'Upload vaccination cards, medical documents, or doctor\'s notes. We accept PDFs, images, and scanned documents in any language. Simply drag and drop or browse your files.',
    align: 'left',
  },
  {
    step: '02',
    icon: Brain,
    title: 'Smart extraction & translation',
    desc: 'Our systems read handwritten and printed records with high accuracy. Language is detected automatically and everything is translated to English, preserving medical terminology.',
    align: 'right',
  },
  {
    step: '03',
    icon: Syringe,
    title: 'Records organized automatically',
    desc: 'Vaccine names, dates, doses, and providers are parsed into structured data and added to your personal timeline. No manual entry required.',
    align: 'left',
  },
  {
    step: '04',
    icon: ClipboardCheck,
    title: 'Check compliance instantly',
    desc: 'Compare your records against requirements for any institution, employer, or country. Generate downloadable compliance reports with gap analysis.',
    align: 'right',
  },
];

const featureGrid = [
  { icon: Shield, title: 'HIPAA Compliant', desc: 'End-to-end encryption and full audit logs.' },
  { icon: Languages, title: 'Multi-language OCR', desc: 'Reads records in 50+ languages accurately.' },
  { icon: Globe, title: '40+ Countries', desc: 'Compliance data for institutions worldwide.' },
  { icon: Share2, title: 'Secure sharing', desc: 'Share verified records with a time-limited link.' },
  { icon: FileCheck, title: 'Gap analysis', desc: 'See exactly which vaccines you still need.' },
  { icon: Lock, title: 'Zero-knowledge storage', desc: 'Your data is encrypted before it reaches us.' },
  { icon: Zap, title: 'Instant processing', desc: 'Results in seconds, not days.' },
  { icon: FileText, title: 'PDF export', desc: 'Download a clean, formatted record anytime.' },
  { icon: Stethoscope, title: 'Provider verification', desc: 'Records verified against official databases.' },
];

export function FeaturesPage() {
  const ref = useScrollFade();

  return (
    <div ref={ref} className="min-h-screen bg-[#F8F7F4] text-[#0A1428]">

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#10B981] uppercase tracking-widest mb-4">
              Features
            </p>
            <h1 className="text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight mb-6">
              How DOZEY works
            </h1>
            <p className="text-lg text-[#6B7280] leading-relaxed">
              A complete platform for managing, translating, and sharing your vaccination
              records across borders — powered by AI, built for humans.
            </p>
          </div>
        </div>
      </section>

      {/* ── Pipeline ── */}
      <section className="py-20 lg:py-28 bg-white border-y border-[#E5E7EB]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="fade-in opacity-0 translate-y-6 transition-all duration-500 mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-3">The DOZEY pipeline</h2>
            <p className="text-[#6B7280] text-lg">From upload to compliance in four simple steps</p>
          </div>
          <div className="space-y-20">
            {pipeline.map(({ step, icon: Icon, title, desc, align }, i) => (
              <div
                key={step}
                className={`fade-in opacity-0 translate-y-6 transition-all duration-500 grid lg:grid-cols-2 gap-16 items-center`}
              >
                <div className={align === 'right' ? 'lg:order-2' : ''}>
                  <span className="text-7xl font-light text-[#0A1428]/8 tabular-nums block mb-4">{step}</span>
                  <h3 className="text-2xl font-semibold text-[#0A1428] mb-4">{title}</h3>
                  <p className="text-[#6B7280] leading-relaxed">{desc}</p>
                </div>
                <div className={`${align === 'right' ? 'lg:order-1' : ''} flex items-center justify-center`}>
                  <div className="w-full max-w-sm bg-[#F8F7F4] border border-[#E5E7EB] rounded-[8px] p-12 flex items-center justify-center">
                    <Icon className="w-20 h-20 text-[#0A1428]/15" strokeWidth={1} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature grid ── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="fade-in opacity-0 translate-y-6 transition-all duration-500 mb-12">
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-3">Everything you need</h2>
            <p className="text-[#6B7280] text-lg">No complicated setups. No hidden features. Just the tools that matter.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featureGrid.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="fade-in opacity-0 translate-y-6 transition-all duration-500 bg-white border border-[#E5E7EB] rounded-[8px] p-6 hover:border-[#D1D5DB] transition-colors"
              >
                <div className="w-9 h-9 bg-[#F3F4F6] rounded-[4px] flex items-center justify-center mb-4">
                  <Icon className="w-4 h-4 text-[#0A1428]" strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-semibold text-[#0A1428] mb-1.5">{title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-[#0A1428]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold text-white tracking-tight mb-4">
            See it in action
          </h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            Join people in 40+ countries managing their health records with DOZEY.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#10B981] text-[#0A1428] font-semibold rounded-[4px] hover:bg-[#0ea572] transition-colors active:scale-[0.98]"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
