import { useState, useEffect } from 'react';
import {
  Shield,
  Globe,
  FileText,
  Upload,
  Share2,
  Clock,
  CheckCircle,
  Languages,
  ClipboardCheck,
  Heart,
  Menu,
  X,
  Mail,
  User,
  MessageSquare,
  ChevronRight,
  Lock,
  ArrowRight,
  Linkedin,
  Github,
} from 'lucide-react';

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

const navLinks = [
  { label: 'Home', id: 'home' },
  { label: 'Features', id: 'features' },
  { label: 'About', id: 'about' },
  { label: 'Team', id: 'team' },
  { label: 'Contact', id: 'contact' },
];

const features = [
  {
    icon: Languages,
    title: 'Record Translation & Parsing',
    description: 'Automatically translate and parse medical records from different countries and languages into a unified format.',
    span: 'md:col-span-2',
  },
  {
    icon: Globe,
    title: 'Cross-border Compliance Tracking',
    description: 'Stay compliant with vaccination and health requirements as you move between countries.',
    span: 'md:col-span-1',
  },
  {
    icon: ClipboardCheck,
    title: 'EHR/EMR Integration Support',
    description: 'Connect with electronic health record systems worldwide for seamless data exchange.',
    span: 'md:col-span-1',
  },
  {
    icon: Upload,
    title: 'Document Upload & Verification',
    description: 'Upload, verify, and securely store your medical documents with tamper-proof verification.',
    span: 'md:col-span-2',
  },
  {
    icon: Clock,
    title: 'Vaccination Timeline',
    description: 'Visualize your complete vaccination history on an interactive timeline with upcoming reminders.',
    span: 'md:col-span-1',
  },
  {
    icon: Share2,
    title: 'Share Records Securely',
    description: 'Share your verified records with healthcare providers, schools, or employers with granular access control.',
    span: 'md:col-span-2',
  },
];

const teamMembers = [
  { name: 'Dr. Sarah Chen', role: 'CEO & Co-Founder', bio: 'Former WHO health informaticist with 12 years of global health experience.' },
  { name: 'Marcus Williams', role: 'CTO & Co-Founder', bio: 'Full-stack engineer passionate about health equity and data interoperability.' },
  { name: 'Aisha Patel', role: 'Head of Product', bio: 'Product leader focused on accessible healthcare solutions for underserved populations.' },
  { name: 'Carlos Rivera', role: 'Lead Engineer', bio: 'Systems architect specializing in secure, HIPAA-compliant cloud infrastructure.' },
];

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = navLinks.map((l) => l.id);
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#fefefe] text-[#22283a] scroll-smooth">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#1051a5]/95 backdrop-blur-md shadow-lg'
            : 'bg-[#1051a5]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollToSection('home')}
                className="flex items-center gap-2 group"
              >
                <div className="w-9 h-9 bg-[#97bf2d] rounded-lg flex items-center justify-center font-bold text-[#22283a] text-lg group-hover:scale-110 transition-transform">
                  D
                </div>
                <div className="hidden sm:block">
                  <span className="text-white font-bold text-xl tracking-tight">DOZEY</span>
                  <span className="text-[#97bf2d] text-xs block -mt-1 font-medium">
                    Healthcare that moves with you!
                  </span>
                </div>
              </button>
            </div>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeSection === link.id
                      ? 'text-[#97bf2d] bg-white/10'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/api/login"
                className="hidden md:inline-flex items-center gap-2 bg-[#97bf2d] hover:bg-[#88ad28] text-[#22283a] font-semibold px-5 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-[#97bf2d]/25 active:scale-95"
              >
                Sign In
                <ChevronRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white p-2 rounded-md hover:bg-white/10"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#1051a5]/95 backdrop-blur-md border-t border-white/10">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    scrollToSection(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 text-sm font-medium"
                >
                  {link.label}
                </button>
              ))}
              <a
                href="/api/login"
                className="block w-full text-center mt-2 bg-[#97bf2d] hover:bg-[#88ad28] text-[#22283a] font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                Sign In
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#1051a5] via-[#0d4290] to-[#22283a]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#97bf2d] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#26844f] rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1051a5] rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <Globe className="w-4 h-4 text-[#97bf2d]" />
              <span className="text-white/90 text-sm font-medium">
                Trusted by immigrants worldwide
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Your Medical Records,{' '}
              <span className="text-[#97bf2d]">Anywhere</span> You Go
            </h1>

            <p className="text-lg sm:text-xl text-white/75 mb-8 max-w-2xl leading-relaxed">
              Whether you're an immigrant, international student, or global worker — DOZEY keeps
              your vaccination records, medical history, and health documents organized, translated,
              and accessible across borders.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a
                href="/api/login"
                className="inline-flex items-center justify-center gap-2 bg-[#97bf2d] hover:bg-[#88ad28] text-[#22283a] font-bold px-8 py-3.5 rounded-xl text-lg transition-all hover:shadow-xl hover:shadow-[#97bf2d]/25 active:scale-95"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </a>
              <button
                onClick={() => scrollToSection('features')}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl text-lg transition-all"
              >
                Learn More
              </button>
            </div>

            <div className="flex flex-wrap gap-6">
              {[
                { icon: CheckCircle, text: 'Free to use' },
                { icon: Lock, text: 'Secure & Private' },
                { icon: Shield, text: 'HIPAA Aware' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-white/70">
                  <Icon className="w-5 h-5 text-[#97bf2d]" />
                  <span className="text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#fefefe]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-[#1051a5]/10 text-[#1051a5] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#22283a] mb-4">
              Everything You Need for{' '}
              <span className="text-[#1051a5]">Health Record Portability</span>
            </h2>
            <p className="text-[#22283a]/60 max-w-2xl mx-auto text-lg">
              DOZEY provides a comprehensive suite of tools to manage, translate, and share your
              medical records across borders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`${feature.span} group relative bg-gradient-to-br from-white to-[#f8faf5] border border-[#22283a]/8 rounded-2xl p-6 hover:shadow-xl hover:shadow-[#1051a5]/5 transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className="w-12 h-12 bg-[#1051a5]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#1051a5] transition-colors duration-300">
                    <Icon className="w-6 h-6 text-[#1051a5] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-bold text-[#22283a] mb-2">{feature.title}</h3>
                  <p className="text-[#22283a]/60 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gradient-to-b from-[#f0f4f8] to-[#fefefe]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-[#26844f]/10 text-[#26844f] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                Our Mission
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#22283a] mb-6">
                Healthcare Records Should Have{' '}
                <span className="text-[#26844f]">No Borders</span>
              </h2>
              <p className="text-[#22283a]/70 mb-6 leading-relaxed">
                Millions of immigrants, refugees, and international workers face a fragmented
                healthcare system every time they cross a border. Vaccination records get lost,
                medical histories are untranslated, and critical health data remains trapped in
                incompatible systems.
              </p>
              <p className="text-[#22283a]/70 mb-8 leading-relaxed">
                DOZEY was built to solve this. We believe that your health information should
                travel with you — securely, seamlessly, and in a format that every healthcare
                provider can understand, no matter what country you're in.
              </p>
              <div className="space-y-4">
                {[
                  'Bridging gaps in global health record portability',
                  'Supporting immigrant and refugee health equity',
                  'Making compliance tracking effortless across borders',
                  'Building trust through transparent, secure data handling',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#26844f] mt-0.5 shrink-0" />
                    <span className="text-[#22283a]/80 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#22283a]/5">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: '50+', label: 'Countries Supported' },
                    { value: '10K+', label: 'Records Managed' },
                    { value: '99.9%', label: 'Uptime Guarantee' },
                    { value: '256-bit', label: 'AES Encryption' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center p-4">
                      <div className="text-3xl font-bold text-[#1051a5] mb-1">{stat.value}</div>
                      <div className="text-xs text-[#22283a]/50 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#97bf2d]/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#1051a5]/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24 bg-[#fefefe]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-[#1051a5]/10 text-[#1051a5] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Our Team
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#22283a] mb-4">
              Meet the People Behind <span className="text-[#1051a5]">DOZEY</span>
            </h2>
            <p className="text-[#22283a]/60 max-w-2xl mx-auto text-lg">
              A passionate team of healthcare professionals, engineers, and advocates working to
              make health records portable for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="group bg-white border border-[#22283a]/8 rounded-2xl p-6 text-center hover:shadow-xl hover:shadow-[#1051a5]/5 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#1051a5] to-[#26844f] rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {member.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <h3 className="text-lg font-bold text-[#22283a] mb-1">{member.name}</h3>
                <p className="text-[#1051a5] text-sm font-semibold mb-3">{member.role}</p>
                <p className="text-[#22283a]/55 text-sm leading-relaxed mb-4">{member.bio}</p>
                <div className="flex justify-center gap-3">
                  <button className="w-8 h-8 rounded-full bg-[#22283a]/5 flex items-center justify-center text-[#22283a]/40 hover:bg-[#1051a5] hover:text-white transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-[#22283a]/5 flex items-center justify-center text-[#22283a]/40 hover:bg-[#22283a] hover:text-white transition-colors">
                    <Github className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gradient-to-b from-[#f0f4f8] to-[#fefefe]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block bg-[#26844f]/10 text-[#26844f] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                Contact Us
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#22283a] mb-4">
                Get in <span className="text-[#26844f]">Touch</span>
              </h2>
              <p className="text-[#22283a]/60 text-lg">
                Have questions or feedback? We'd love to hear from you.
              </p>
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="bg-white rounded-2xl shadow-xl border border-[#22283a]/5 p-8 space-y-5"
            >
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#22283a] mb-2">
                  <User className="w-4 h-4 text-[#1051a5]" />
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="w-full px-4 py-3 rounded-xl border border-[#22283a]/10 bg-[#f8faf5] text-[#22283a] placeholder:text-[#22283a]/30 focus:outline-none focus:ring-2 focus:ring-[#1051a5]/30 focus:border-[#1051a5] transition-all"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#22283a] mb-2">
                  <Mail className="w-4 h-4 text-[#1051a5]" />
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-[#22283a]/10 bg-[#f8faf5] text-[#22283a] placeholder:text-[#22283a]/30 focus:outline-none focus:ring-2 focus:ring-[#1051a5]/30 focus:border-[#1051a5] transition-all"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#22283a] mb-2">
                  <MessageSquare className="w-4 h-4 text-[#1051a5]" />
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="w-full px-4 py-3 rounded-xl border border-[#22283a]/10 bg-[#f8faf5] text-[#22283a] placeholder:text-[#22283a]/30 focus:outline-none focus:ring-2 focus:ring-[#1051a5]/30 focus:border-[#1051a5] transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#1051a5] hover:bg-[#0d4290] text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-[#1051a5]/25 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Send Message
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#22283a] text-white/70 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-[#97bf2d] rounded-lg flex items-center justify-center font-bold text-[#22283a] text-sm">
                  D
                </div>
                <span className="text-white font-bold text-lg">DOZEY</span>
              </div>
              <p className="text-sm leading-relaxed">
                Healthcare that moves with you. Managing medical records across borders for
                immigrants, students, and global workers.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Quick Links</h4>
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className="block text-sm hover:text-[#97bf2d] transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Legal</h4>
              <div className="space-y-2 text-sm">
                <p className="hover:text-[#97bf2d] cursor-pointer transition-colors">Privacy Policy</p>
                <p className="hover:text-[#97bf2d] cursor-pointer transition-colors">Terms of Service</p>
                <p className="hover:text-[#97bf2d] cursor-pointer transition-colors">HIPAA Compliance</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} DOZEY. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#97bf2d]" />
              <span className="text-sm">Built with care for global health equity</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
