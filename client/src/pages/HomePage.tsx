import { Link } from 'react-router-dom';
import { Shield, Globe, FileText, CheckCircle, ArrowRight, Users, BookOpen, Heart } from 'lucide-react';

export function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A1428] text-white">

      {/* ── HERO ── */}
      <section className="pt-36 pb-24 lg:pt-48 lg:pb-32 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#10B981]/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#10B981]/10 border border-[#10B981]/20 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-xs font-medium text-[#10B981] tracking-wide">Now available for UC System students</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
              Your health records,<br />
              <span className="text-[#10B981]">everywhere you go.</span>
            </h1>
            <p className="text-lg lg:text-xl text-[#94A3B8] leading-relaxed mb-10 max-w-2xl">
              DOZEY translates, verifies, and organizes your international vaccination documents — so you can focus on starting your education, not navigating bureaucracy.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-[#10B981] hover:bg-[#0ea472] text-white font-semibold px-8 py-4 rounded-[4px] text-base transition-colors"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/features"
                className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-[#94A3B8] hover:text-white font-medium px-8 py-4 rounded-[4px] text-base transition-colors"
              >
                See How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="border-y border-white/10 bg-[#060D1A] py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-sm text-[#64748B]">
            {['HIPAA Compliant', 'UC System Approved', '50+ Languages Supported', 'AI-Verified Documents', 'End-to-End Encrypted'].map(t => (
              <div key={t} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Built for students like you</h2>
            <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
              Whether your records are in Spanish, Hindi, Mandarin, or Arabic — DOZEY handles it all.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Globe className="w-6 h-6" />,
                title: 'Any Language, Any Format',
                desc: 'Upload vaccination records from any country. Our AI translates and extracts the data you need in seconds.',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Verified & Secure',
                desc: 'AI-powered authenticity checks flag fraudulent documents. Your data is encrypted and HIPAA-compliant.',
              },
              {
                icon: <FileText className="w-6 h-6" />,
                title: 'School-Ready Reports',
                desc: 'Generate a single PDF that meets your university\'s exact requirements — ready to submit in one click.',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-[#111827] border border-white/10 rounded-lg p-8 hover:border-[#10B981]/30 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-[#10B981]/10 flex items-center justify-center text-[#10B981] mb-6">
                  {icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className="text-[#94A3B8] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 lg:py-32 bg-[#060D1A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">How DOZEY works</h2>
            <p className="text-[#94A3B8] text-lg">Four steps from upload to enrollment.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Upload', desc: 'Upload your vaccination records in any format — PDF, photo, or scan.' },
              { step: '02', title: 'Translate & Parse', desc: 'Our AI reads and translates your documents, extracting every vaccination detail.' },
              { step: '03', title: 'Verify', desc: 'Documents are checked for authenticity. Fraudulent records are flagged automatically.' },
              { step: '04', title: 'Submit', desc: 'Download a school-ready PDF or share directly with your university\'s health portal.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative">
                <div className="text-6xl font-black text-white/5 mb-4 leading-none">{step}</div>
                <h3 className="text-lg font-semibold mb-2 -mt-4">{title}</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: <Users className="w-8 h-8" />, stat: '500+', label: 'Students Helped' },
              { icon: <BookOpen className="w-8 h-8" />, stat: '50+', label: 'Languages Supported' },
              { icon: <Heart className="w-8 h-8" />, stat: '98%', label: 'Satisfaction Rate' },
            ].map(({ icon, stat, label }) => (
              <div key={label} className="flex flex-col items-center gap-3">
                <div className="text-[#10B981]">{icon}</div>
                <div className="text-5xl font-black">{stat}</div>
                <div className="text-[#94A3B8] text-sm font-medium uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 lg:py-32 bg-[#060D1A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">What students say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                quote: "I had all my vaccination records in Hindi and had no idea how to submit them to UC Davis. DOZEY translated everything and generated a report in under 10 minutes.",
                name: 'Priya S.', school: 'UC Davis, Class of 2027',
              },
              {
                quote: "Coming from Brazil, my Portuguese records were impossible to parse. DOZEY handled it perfectly and even flagged that I was missing one booster — saved me from a registration hold.",
                name: 'Lucas M.', school: 'UCLA, Class of 2026',
              },
            ].map(({ quote, name, school }) => (
              <blockquote key={name} className="bg-[#111827] border border-white/10 rounded-lg p-8">
                <p className="text-[#CBD5E1] leading-relaxed mb-6 italic">"{quote}"</p>
                <footer>
                  <div className="font-semibold text-white">{name}</div>
                  <div className="text-sm text-[#10B981]">{school}</div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-6xl font-black mb-6">
            Ready to get started?
          </h2>
          <p className="text-[#94A3B8] text-lg mb-10 max-w-xl mx-auto">
            Join hundreds of immigrant students who have already cleared their health requirements with DOZEY.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-[#10B981] hover:bg-[#0ea472] text-white font-semibold px-10 py-5 rounded-[4px] text-lg transition-colors"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
