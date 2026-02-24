import { useEffect, useRef } from 'react';
import { Upload, Brain, Shield, Share2, ArrowRight, Syringe, Lock, FileCheck, Globe, Languages, ClipboardCheck, Zap, FileText, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';

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

export function FeaturesPage() {
  const scrollRef = useScrollAnimation();

  return (
    <div ref={scrollRef} className="min-h-screen">
      <section className="relative min-h-[70vh] flex items-center bg-gradient-to-b from-[#1d1d1f] to-[#2d2d30] text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#8aab45]/5 rounded-full blur-[150px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-40 w-full">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[#8aab45] text-xs font-medium uppercase tracking-widest mb-6 animate-fade-in">
              Features
            </p>
            <h1 className="animate-fade-in-up text-6xl lg:text-7xl xl:text-8xl font-semibold leading-[1.05] tracking-tight mb-6">
              How DOZEY <span className="text-[#8aab45]">works</span>
            </h1>
            <p className="animate-fade-in-up delay-200 text-base text-white/40 max-w-lg mx-auto font-light">
              A complete platform for managing, translating, and sharing your vaccination
              records across borders — powered by AI.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fbfbfd] to-transparent" />
      </section>

      <section className="py-24 lg:py-32 bg-[#fbfbfd]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-on-scroll text-center mb-20">
            <p className="text-[#4a7fb5] text-xs font-medium uppercase tracking-widest mb-4">
              The Pipeline
            </p>
            <h2 className="text-5xl lg:text-6xl font-semibold text-[#1d1d1f] leading-[1.05] tracking-tight mb-3">The DOZEY Pipeline</h2>
            <p className="text-base text-[#86868b] font-light">From upload to compliance in four simple steps</p>
          </div>

          <div className="space-y-24">
            {[
              { step: '01', icon: Upload, title: 'Upload Records', desc: 'Upload vaccination cards, medical documents, or doctor\'s notes. We accept PDFs, images, and scanned documents in any language. Simply drag and drop or browse your files.', align: 'left' },
              { step: '02', icon: Brain, title: 'AI Extracts & Translates', desc: 'Our Mistral OCR reads handwritten and printed records with high accuracy. DeepL detects the language and translates everything to English automatically, preserving medical terminology.', align: 'right' },
              { step: '03', icon: Syringe, title: 'Records Organized', desc: 'OpenAI parses the translated text into structured data — vaccine names, dates, doses, and providers are added to your personal timeline. No manual entry required.', align: 'left' },
              { step: '04', icon: ClipboardCheck, title: 'Check Compliance', desc: 'Compare your records against requirements for any institution, employer, or country. Generate downloadable compliance reports with gap analysis.', align: 'right' },
            ].map(({ step, icon: Icon, title, desc, align }, i) => (
              <div key={step} className={`animate-on-scroll delay-${(i + 1) * 100} grid lg:grid-cols-2 gap-16 items-center`}>
                <div className={`${align === 'right' ? 'lg:order-2' : ''}`}>
                  <div className="text-7xl font-light text-[#1d1d1f]/10 mb-4 tabular-nums">{step}</div>
                  <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-4">{title}</h3>
                  <p className="text-[#86868b] leading-relaxed">{desc}</p>
                </div>
                <div className={`${align === 'right' ? 'lg:order-1' : ''} flex items-center justify-center`}>
                  <div className="w-32 h-32 rounded-3xl bg-[#f5f5f7] flex items-center justify-center">
                    <Icon className="w-14 h-14 text-[#1d1d1f]/20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-[#f5f5f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-on-scroll text-center mb-16">
            <p className="text-[#4a7fb5] text-xs font-medium uppercase tracking-widest mb-4">
              Capabilities
            </p>
            <h2 className="text-5xl lg:text-6xl font-semibold text-[#1d1d1f] leading-[1.05] tracking-tight mb-3">
              Everything you need
            </h2>
            <p className="text-[#86868b] font-light">For health record portability across borders</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Languages, title: 'Multi-Language Support', desc: 'Records detected and translated from 7+ languages including Hindi, Chinese, Spanish, French, Portuguese, and Arabic.' },
              { icon: Globe, title: 'Cross-Border Compliance', desc: 'Check vaccination requirements for any country, university, or employer. Stay compliant as you move.' },
              { icon: FileText, title: 'Document Management', desc: 'Upload, organize, rename, and securely store all your medical documents with tamper-proof digital storage.' },
              { icon: Stethoscope, title: 'Medical Exemptions', desc: 'AI extracts medical exemptions from doctor\'s notes and factors them into compliance checks.' },
              { icon: Share2, title: 'Secure Sharing', desc: 'Share verified records with providers, schools, or employers with COVID-19 vaccine card format export.' },
              { icon: Zap, title: 'AI Assistant', desc: 'Doze, our AI assistant, helps navigate the app, answer vaccination questions, and guide you through the process.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className={`animate-on-scroll delay-${(i % 3 + 1) * 100} bg-white rounded-2xl p-10`}>
                <div className="w-10 h-10 bg-[#f5f5f7] rounded-2xl flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-[#1d1d1f]" />
                </div>
                <h3 className="text-base font-semibold text-[#1d1d1f] mb-2">{title}</h3>
                <p className="text-[#86868b] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-[#fbfbfd]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-on-scroll text-center mb-16">
            <p className="text-[#4a7fb5] text-xs font-medium uppercase tracking-widest mb-4">
              Trust
            </p>
            <h2 className="text-5xl lg:text-6xl font-semibold text-[#1d1d1f] leading-[1.05] tracking-tight mb-3">Security & Privacy</h2>
            <p className="text-[#86868b] font-light">Your health data deserves the highest level of protection</p>
          </div>

          <div className="grid md:grid-cols-3 gap-16 max-w-4xl mx-auto">
            {[
              { icon: Lock, title: 'HIPAA Compliant', desc: 'Following healthcare privacy standards with comprehensive Terms of Service and Privacy Policy.' },
              { icon: Shield, title: '256-bit Encryption', desc: 'Bank-level AES encryption protects your data at rest and in transit.' },
              { icon: FileCheck, title: 'Audit Trail', desc: 'Every access to your records is logged with timestamps for complete transparency.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className={`animate-on-scroll delay-${(i + 1) * 100} text-center`}>
                <div className="w-12 h-12 bg-[#f5f5f7] rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-6 h-6 text-[#1d1d1f]/40" />
                </div>
                <h3 className="text-base font-semibold text-[#1d1d1f] mb-2">{title}</h3>
                <p className="text-[#86868b] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-[#1d1d1f] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-on-scroll">
            <h2 className="text-5xl lg:text-6xl font-semibold mb-6 leading-[1.05] tracking-tight">Ready to get started?</h2>
            <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto font-light">
              Create your free account and start managing your health records the smart way.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-[#4a7fb5] hover:bg-[#5a8fc5] text-white font-semibold px-8 py-4 rounded-full text-base transition-all active:scale-[0.98]"
            >
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
