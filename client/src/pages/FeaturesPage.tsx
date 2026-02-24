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
      <section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-[#0a3d7a] via-[#1051a5] to-[#22283a] text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#97bf2d]/8 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-40 w-full">
          <div className="max-w-3xl">
            <span className="text-[#97bf2d] text-sm font-semibold uppercase tracking-widest mb-4 block animate-fade-in">
              Features
            </span>
            <h1 className="animate-fade-in-up text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[0.95] tracking-tight mb-6">
              How DOZEY
              <br />
              <span className="text-[#97bf2d]">works</span>
            </h1>
            <p className="animate-fade-in-up delay-200 text-lg text-white/50 max-w-lg">
              A complete platform for managing, translating, and sharing your vaccination
              records across borders — powered by AI.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fefefe] to-transparent" />
      </section>

      <section className="py-24 lg:py-32 bg-[#fefefe]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-on-scroll text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#22283a] mb-4">The DOZEY Pipeline</h2>
            <p className="text-lg text-gray-400 max-w-lg mx-auto">From upload to compliance in four simple steps</p>
          </div>

          <div className="space-y-20">
            {[
              { step: '01', icon: Upload, title: 'Upload Records', desc: 'Upload vaccination cards, medical documents, or doctor\'s notes. We accept PDFs, images, and scanned documents in any language. Simply drag and drop or browse your files.', color: '#1051a5', align: 'left' },
              { step: '02', icon: Brain, title: 'AI Extracts & Translates', desc: 'Our Mistral OCR reads handwritten and printed records with high accuracy. DeepL detects the language and translates everything to English automatically, preserving medical terminology.', color: '#97bf2d', align: 'right' },
              { step: '03', icon: Syringe, title: 'Records Organized', desc: 'OpenAI parses the translated text into structured data — vaccine names, dates, doses, and providers are added to your personal timeline. No manual entry required.', color: '#26844f', align: 'left' },
              { step: '04', icon: ClipboardCheck, title: 'Check Compliance', desc: 'Compare your records against requirements for any institution, employer, or country. Generate downloadable compliance reports with gap analysis.', color: '#1051a5', align: 'right' },
            ].map(({ step, icon: Icon, title, desc, color, align }, i) => (
              <div key={step} className={`animate-on-scroll delay-${(i + 1) * 100} grid lg:grid-cols-2 gap-12 items-center`}>
                <div className={`${align === 'right' ? 'lg:order-2' : ''}`}>
                  <div className="text-8xl font-black text-gray-100 mb-4">{step}</div>
                  <h3 className="text-3xl font-extrabold text-[#22283a] mb-4">{title}</h3>
                  <p className="text-gray-500 leading-relaxed text-lg">{desc}</p>
                </div>
                <div className={`${align === 'right' ? 'lg:order-1' : ''} flex items-center justify-center`}>
                  <div className="w-40 h-40 rounded-3xl flex items-center justify-center" style={{ backgroundColor: `${color}08` }}>
                    <Icon className="w-20 h-20" style={{ color, opacity: 0.6 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-on-scroll text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#22283a] mb-4">
              Everything you need
            </h2>
            <p className="text-gray-400 text-lg">For health record portability across borders</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Languages, title: 'Multi-Language Support', desc: 'Records detected and translated from 7+ languages including Hindi, Chinese, Spanish, French, Portuguese, and Arabic.', color: '#1051a5' },
              { icon: Globe, title: 'Cross-Border Compliance', desc: 'Check vaccination requirements for any country, university, or employer. Stay compliant as you move.', color: '#26844f' },
              { icon: FileText, title: 'Document Management', desc: 'Upload, organize, rename, and securely store all your medical documents with tamper-proof digital storage.', color: '#22283a' },
              { icon: Stethoscope, title: 'Medical Exemptions', desc: 'AI extracts medical exemptions from doctor\'s notes and factors them into compliance checks.', color: '#1051a5' },
              { icon: Share2, title: 'Secure Sharing', desc: 'Share verified records with providers, schools, or employers with COVID-19 vaccine card format export.', color: '#26844f' },
              { icon: Zap, title: 'AI Assistant', desc: 'Doze, our AI assistant, helps navigate the app, answer vaccination questions, and guide you through the process.', color: '#22283a' },
            ].map(({ icon: Icon, title, desc, color }, i) => (
              <div key={title} className={`animate-on-scroll delay-${(i % 3 + 1) * 100} bg-white rounded-2xl p-8 hover:shadow-lg transition-all group border border-gray-100`}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: `${color}08` }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <h3 className="text-lg font-bold text-[#22283a] mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-[#fefefe]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-on-scroll max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#22283a] mb-6">Security & Privacy</h2>
            <p className="text-gray-400 text-lg mb-16">Your health data deserves the highest level of protection</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {[
              { icon: Lock, title: 'HIPAA Compliant', desc: 'Following healthcare privacy standards with comprehensive Terms of Service and Privacy Policy.' },
              { icon: Shield, title: '256-bit Encryption', desc: 'Bank-level AES encryption protects your data at rest and in transit.' },
              { icon: FileCheck, title: 'Audit Trail', desc: 'Every access to your records is logged with timestamps for complete transparency.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className={`animate-on-scroll delay-${(i + 1) * 100} text-center`}>
                <div className="w-16 h-16 bg-[#1051a5]/6 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-8 h-8 text-[#1051a5]" />
                </div>
                <h3 className="text-xl font-bold text-[#22283a] mb-3">{title}</h3>
                <p className="text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-[#22283a] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-on-scroll">
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6">Ready to get started?</h2>
            <p className="text-white/40 text-xl mb-10 max-w-2xl mx-auto">
              Create your free account and start managing your health records the smart way.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-3 bg-[#97bf2d] hover:bg-[#88ad28] text-[#22283a] font-bold px-10 py-4 rounded-full text-lg transition-all hover:shadow-2xl hover:shadow-[#97bf2d]/20 active:scale-[0.98]"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
