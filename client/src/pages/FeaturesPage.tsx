import { Link } from 'react-router-dom';
import { Globe, Shield, FileText, Brain, Lock, Zap, CheckCircle, ArrowRight, Languages, ClipboardCheck, Download, AlertTriangle } from 'lucide-react';

const features = [
  { icon: <Languages className="w-6 h-6" />, title: 'Multilingual OCR', desc: 'Reads and extracts data from vaccination records in 50+ languages including Arabic, Hindi, Mandarin, Spanish, Portuguese, and more.' },
  { icon: <Brain className="w-6 h-6" />, title: 'AI-Powered Parsing', desc: 'Intelligently identifies vaccine names, dates, lot numbers, and healthcare provider information from any document format.' },
  { icon: <AlertTriangle className="w-6 h-6" />, title: 'Fraud Detection', desc: 'Analyzes structural markers, date logic, and formatting consistency to flag potentially fraudulent or tampered documents.' },
  { icon: <Globe className="w-6 h-6" />, title: 'Global Compliance', desc: 'Matches your records against requirements for UC System, CSU, Ivy League, and hundreds of other universities worldwide.' },
  { icon: <ClipboardCheck className="w-6 h-6" />, title: 'Gap Analysis', desc: 'Automatically identifies missing vaccinations and tells you exactly what you need before your enrollment deadline.' },
  { icon: <Download className="w-6 h-6" />, title: 'Instant PDF Export', desc: 'Generate a single, professionally formatted PDF combining all your records — ready to submit to any university health portal.' },
  { icon: <Lock className="w-6 h-6" />, title: 'HIPAA Compliant', desc: 'All data is encrypted at rest and in transit. We never share your health information with third parties.' },
  { icon: <Shield className="w-6 h-6" />, title: 'Secure Storage', desc: 'Your documents are stored with enterprise-grade security. Access them from any device, any time.' },
  { icon: <Zap className="w-6 h-6" />, title: 'Fast Processing', desc: 'Most documents are processed in under 60 seconds. No waiting, no manual data entry.' },
];

const steps = [
  { step: '01', title: 'Upload Your Records', desc: 'Drag and drop your vaccination documents in any format — PDF, JPG, PNG, or scanned images. Multiple files supported.' },
  { step: '02', title: 'AI Translates & Parses', desc: 'Our AI reads every field, translates the content, and extracts structured data — vaccine names, dates, doses, and provider info.' },
  { step: '03', title: 'Authenticity Verified', desc: 'Each document is analyzed for signs of tampering or fraud. You receive a confidence score and risk assessment.' },
  { step: '04', title: 'Compliance Checked', desc: 'Your records are matched against your target university\'s requirements. Missing vaccines are clearly flagged.' },
];

export function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#0A1428] text-white">

      {/* Hero */}
      <section className="pt-36 pb-20 lg:pt-48 lg:pb-28 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-[600px] h-[400px] bg-[#10B981]/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#10B981]/10 border border-[#10B981]/20 rounded-full px-4 py-1.5 mb-8">
              <FileText className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="text-xs font-medium text-[#10B981] tracking-wide">Platform Features</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              Everything you need to<br />
              <span className="text-[#10B981]">clear enrollment.</span>
            </h1>
            <p className="text-lg text-[#94A3B8] leading-relaxed mb-8">
              DOZEY combines AI translation, fraud detection, and university compliance checking into one seamless platform built specifically for international students.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-[#10B981] hover:bg-[#0ea472] text-white font-semibold px-8 py-4 rounded-[4px] transition-colors"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="py-24 bg-[#060D1A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">The DOZEY pipeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(({ step, title, desc }) => (
              <div key={step} className="relative">
                <div className="text-7xl font-black text-white/5 leading-none mb-3">{step}</div>
                <h3 className="text-lg font-semibold mb-2 -mt-6">{title}</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Every feature you need</h2>
            <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">Built by students who experienced these challenges firsthand.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="bg-[#111827] border border-white/10 rounded-lg p-7 hover:border-[#10B981]/30 transition-colors group">
                <div className="w-11 h-11 rounded-lg bg-[#10B981]/10 flex items-center justify-center text-[#10B981] mb-5 group-hover:bg-[#10B981]/20 transition-colors">
                  {icon}
                </div>
                <h3 className="text-base font-semibold mb-2">{title}</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#060D1A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black mb-6">Start clearing your requirements today</h2>
          <p className="text-[#94A3B8] text-lg mb-10 max-w-xl mx-auto">Upload your first document and see DOZEY in action.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="inline-flex items-center gap-2 bg-[#10B981] hover:bg-[#0ea472] text-white font-semibold px-8 py-4 rounded-[4px] transition-colors">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-[#94A3B8] hover:text-white font-medium px-8 py-4 rounded-[4px] transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
