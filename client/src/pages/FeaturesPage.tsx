import { Upload, Brain, Shield, Share2, ArrowRight, Syringe, Lock, FileCheck, Globe, Languages, ClipboardCheck, Zap, FileText, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1051a5] via-[#0d4290] to-[#22283a] text-white py-24 lg:py-32">
        <div className="absolute inset-0 opacity-10">
          <Syringe className="absolute top-10 right-1/4 w-48 h-48 rotate-45" />
          <Shield className="absolute bottom-10 left-20 w-40 h-40 -rotate-12" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-white/10 text-white/90 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            Features
          </span>
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            How <span className="text-[#97bf2d]">DOZEY</span> Works
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            A complete platform for managing, translating, and sharing your vaccination
            records across borders — powered by AI.
          </p>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-[#fefefe]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#22283a] mb-4">The DOZEY Pipeline</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From upload to compliance in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '1', icon: Upload, title: 'Upload Records', desc: 'Upload vaccination cards, medical documents, or doctor\'s notes. We accept PDFs, images, and scanned documents in any language.', color: '#1051a5' },
              { step: '2', icon: Brain, title: 'AI Extracts & Translates', desc: 'Our Mistral OCR reads handwritten and printed records. DeepL detects the language and translates everything to English automatically.', color: '#97bf2d' },
              { step: '3', icon: Syringe, title: 'Records Organized', desc: 'OpenAI parses the translated text into structured data — vaccine names, dates, doses, and providers are added to your timeline.', color: '#26844f' },
              { step: '4', icon: ClipboardCheck, title: 'Check Compliance', desc: 'Compare your records against requirements for any institution, employer, or country. Generate downloadable compliance reports.', color: '#1051a5' },
            ].map(({ step, icon: Icon, title, desc, color }) => (
              <div key={step} className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="absolute -top-5 left-6 w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg" style={{ backgroundColor: color }}>
                  {step}
                </div>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mt-3" style={{ backgroundColor: `${color}12` }}>
                  <Icon className="w-8 h-8" style={{ color }} />
                </div>
                <h3 className="text-xl font-bold text-[#22283a] mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 to-blue-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#22283a] mb-4">
              Everything You Need for <span className="text-[#1051a5]">Health Record Portability</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Languages, title: 'Multi-Language Support', desc: 'Records are automatically detected and translated from 7+ languages including Hindi, Chinese, Spanish, French, Portuguese, and Arabic.', color: '#1051a5' },
              { icon: Globe, title: 'Cross-Border Compliance', desc: 'Check vaccination requirements for any country, university, or employer. Stay compliant as you move between countries.', color: '#26844f' },
              { icon: FileText, title: 'Document Management', desc: 'Upload, organize, rename, and securely store all your medical documents with tamper-proof digital storage.', color: '#97bf2d' },
              { icon: Stethoscope, title: 'Medical Exemptions', desc: 'AI extracts medical exemptions from doctor\'s notes and factors them into compliance checks automatically.', color: '#1051a5' },
              { icon: Share2, title: 'Secure Sharing', desc: 'Share verified records with healthcare providers, schools, or employers with COVID-19 vaccine card format export.', color: '#26844f' },
              { icon: Zap, title: 'AI Chatbot Assistant', desc: 'Doze, our AI assistant, helps you navigate the app, answer vaccination questions, and guides you through the process.', color: '#97bf2d' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 group">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300" style={{ backgroundColor: `${color}12` }}>
                  <Icon className="w-7 h-7" style={{ color }} />
                </div>
                <h3 className="text-xl font-bold text-[#22283a] mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-[#fefefe]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#22283a] mb-4">Security & Privacy</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your health data deserves the highest level of protection
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Lock, title: 'HIPAA Compliant', desc: 'Following healthcare privacy standards with comprehensive Terms of Service and Privacy Policy.', color: '#1051a5' },
              { icon: Shield, title: '256-bit Encryption', desc: 'Bank-level AES encryption protects your data at rest and in transit.', color: '#26844f' },
              { icon: FileCheck, title: 'Audit Trail', desc: 'Every access to your records is logged with timestamps for complete transparency and accountability.', color: '#97bf2d' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-10 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${color}12` }}>
                  <Icon className="w-10 h-10" style={{ color }} />
                </div>
                <h3 className="text-2xl font-bold text-[#22283a] mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-gradient-to-br from-[#22283a] via-[#1051a5] to-[#0d4290] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Create your free account and start managing your health records the smart way.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-[#97bf2d] hover:bg-[#88ad28] text-[#22283a] font-bold px-10 py-4 rounded-xl text-lg transition-all hover:shadow-xl hover:shadow-[#97bf2d]/30 active:scale-95"
          >
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
