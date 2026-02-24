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
      <section className="relative min-h-[70vh] flex items-center bg-gradient-to-b from-[#0a3d7a] via-[#1051a5] to-[#1a4a8a] text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#97bf2d]/5 rounded-full blur-[150px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-40 w-full">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[#97bf2d] text-xs font-semibold uppercase tracking-widest mb-6 animate-fade-in">
              Features
            </p>
            <h1 className="animate-fade-in-up text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[1.05] tracking-tight mb-6">
              How DOZEY <span className="text-[#97bf2d]">works</span>
            </h1>
            <p className="animate-fade-in-up delay-200 text-base text-white/40 max-w-lg mx-auto font-light">
              A complete platform for managing, translating, and sharing your vaccination
              records across borders — powered by AI.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fefefe] to-transparent" />
      </section>

      <section className="py-20 lg:py-28 bg-[#fefefe]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-on-scroll text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-semibold text-[#22283a] mb-3">The DOZEY Pipeline</h2>
            <p className="text-base text-gray-400 font-light">From upload to compliance in four simple steps</p>
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
                  <div className="text-6xl font-light text-gray-200 mb-4 tabular-nums">{step}</div>
                  <h3 className="text-2xl font-semibold text-[#22283a] mb-4">{title}</h3>
                  <p className="text-gray-400 leading-relaxed">{desc}</p>
                </div>
                <div className={`${align === 'right' ? 'lg:order-1' : ''} flex items-center justify-center`}>
                  <div className="w-32 h-32 rounded-3xl bg-[#fafafa] flex items-center justify-center">
                    <Icon className="w-14 h-14 text-[#22283a]/20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-on-scroll text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold text-[#22283a] mb-3">
              Everything you need
            </h2>
            <p className="text-gray-400 font-light">For health record portability across borders</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 rounded-2xl overflow-hidden">
            {[
              { icon: Languages, title: 'Multi-Language Support', desc: 'Records detected and translated from 7+ languages including Hindi, Chinese, Spanish, French, Portuguese, and Arabic.' },
              { icon: Globe, title: 'Cross-Border Compliance', desc: 'Check vaccination requirements for any country, university, or employer. Stay compliant as you move.' },
              { icon: FileText, title: 'Document Management', desc: 'Upload, organize, rename, and securely store all your medical documents with tamper-proof digital storage.' },
              { icon: Stethoscope, title: 'Medical Exemptions', desc: 'AI extracts medical exemptions from doctor\'s notes and factors them into compliance checks.' },
              { icon: Share2, title: 'Secure Sharing', desc: 'Share verified records with providers, schools, or employers with COVID-19 vaccine card format export.' },
              { icon: Zap, title: 'AI Assistant', desc: 'Doze, our AI assistant, helps navigate the app, answer vaccination questions, and guide you through the process.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className={`animate-on-scroll delay-${(i % 3 + 1) * 100} bg-white p-10 hover:bg-[#fafafa] transition-colors`}>
                <Icon className="w-6 h-6 text-[#22283a]/40 mb-5" />
                <h3 className="text-base font-semibold text-[#22283a] mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-[#fefefe]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-on-scroll text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold text-[#22283a] mb-3">Security & Privacy</h2>
            <p className="text-gray-400 font-light">Your health data deserves the highest level of protection</p>
          </div>

          <div className="grid md:grid-cols-3 gap-16 max-w-4xl mx-auto">
            {[
              { icon: Lock, title: 'HIPAA Compliant', desc: 'Following healthcare privacy standards with comprehensive Terms of Service and Privacy Policy.' },
              { icon: Shield, title: '256-bit Encryption', desc: 'Bank-level AES encryption protects your data at rest and in transit.' },
              { icon: FileCheck, title: 'Audit Trail', desc: 'Every access to your records is logged with timestamps for complete transparency.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className={`animate-on-scroll delay-${(i + 1) * 100} text-center`}>
                <div className="w-12 h-12 bg-[#fafafa] rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-6 h-6 text-[#22283a]/40" />
                </div>
                <h3 className="text-base font-semibold text-[#22283a] mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-[#22283a] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-on-scroll">
            <h2 className="text-4xl lg:text-5xl font-semibold mb-6">Ready to get started?</h2>
            <p className="text-white/30 text-lg mb-10 max-w-xl mx-auto font-light">
              Create your free account and start managing your health records the smart way.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-[#22283a] font-semibold px-8 py-4 rounded-full text-base transition-all hover:bg-white/90 active:scale-[0.98]"
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
