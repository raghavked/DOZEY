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
  Instagram,
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
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] scroll-smooth">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#4a7fb5]/95 backdrop-blur-md shadow-lg'
            : 'bg-[#4a7fb5]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollToSection('home')}
                className="flex items-center gap-2 group"
              >
                <div className="w-9 h-9 bg-[#8aab45] rounded-lg flex items-center justify-center font-bold text-[#1d1d1f] text-lg group-hover:scale-110 transition-transform">
                  D
                </div>
                <div className="hidden sm:block">
                  <span className="text-white font-bold text-xl tracking-tight">DOZEY</span>
                  <span className="text-[#8aab45] text-xs block -mt-1 font-medium">
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
                      ? 'text-[#8aab45] bg-white/10'
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
                className="hidden md:inline-flex items-center gap-2 bg-[#8aab45] hover:bg-[#88ad28] text-[#1d1d1f] font-semibold px-5 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-[#8aab45]/25 active:scale-95"
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
          <div className="md:hidden bg-[#4a7fb5]/95 backdrop-blur-md border-t border-white/10">
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
                className="block w-full text-center mt-2 bg-[#8aab45] hover:bg-[#88ad28] text-[#1d1d1f] font-semibold px-5 py-2.5 rounded-lg transition-colors"
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#4a7fb5] via-[#3a6a9a] to-[#2d5a8a]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#8aab45] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#4d9068] rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4a7fb5] rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <Globe className="w-4 h-4 text-[#8aab45]" />
              <span className="text-white/90 text-sm font-medium">
                Trusted by immigrants worldwide
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Your Medical Records,{' '}
              <span className="text-[#8aab45]">Anywhere</span> You Go
            </h1>

            <p className="text-lg sm:text-xl text-white/75 mb-8 max-w-2xl leading-relaxed">
              Whether you're an immigrant, international student, or global worker — DOZEY keeps
              your vaccination records, medical history, and health documents organized, translated,
              and accessible across borders.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a
                href="/api/login"
                className="inline-flex items-center justify-center gap-2 bg-[#8aab45] hover:bg-[#88ad28] text-[#1d1d1f] font-bold px-8 py-3.5 rounded-xl text-lg transition-all hover:shadow-xl hover:shadow-[#8aab45]/25 active:scale-95"
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
                { icon: Shield, text: 'HIPAA Compliant' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-white/70">
                  <Icon className="w-5 h-5 text-[#8aab45]" />
                  <span className="text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#fbfbfd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-[#4a7fb5]/10 text-[#4a7fb5] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] mb-4">
              Everything You Need for{' '}
              <span className="text-[#4a7fb5]">Health Record Portability</span>
            </h2>
            <p className="text-[#1d1d1f]/60 max-w-2xl mx-auto text-lg">
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
                  className={`${feature.span} group relative bg-gradient-to-br from-white to-[#f8faf5] border border-[#1d1d1f]/8 rounded-2xl p-6 hover:shadow-xl hover:shadow-[#4a7fb5]/5 transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className="w-12 h-12 bg-[#4a7fb5]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#4a7fb5] transition-colors duration-300">
                    <Icon className="w-6 h-6 text-[#4a7fb5] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1d1d1f] mb-2">{feature.title}</h3>
                  <p className="text-[#1d1d1f]/60 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gradient-to-b from-[#f0f4f8] to-[#fbfbfd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-[#4d9068]/10 text-[#4d9068] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                Our Mission
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] mb-6">
                Healthcare Records Should Have{' '}
                <span className="text-[#4d9068]">No Borders</span>
              </h2>
              <p className="text-[#1d1d1f]/70 mb-6 leading-relaxed">
                Millions of immigrants, refugees, and international workers face a fragmented
                healthcare system every time they cross a border. Vaccination records get lost,
                medical histories are untranslated, and critical health data remains trapped in
                incompatible systems.
              </p>
              <p className="text-[#1d1d1f]/70 mb-8 leading-relaxed">
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
                    <CheckCircle className="w-5 h-5 text-[#4d9068] mt-0.5 shrink-0" />
                    <span className="text-[#1d1d1f]/80 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#1d1d1f]/5">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: '50+', label: 'Countries Supported' },
                    { value: '10K+', label: 'Records Managed' },
                    { value: '99.9%', label: 'Uptime Guarantee' },
                    { value: '256-bit', label: 'AES Encryption' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center p-4">
                      <div className="text-3xl font-bold text-[#4a7fb5] mb-1">{stat.value}</div>
                      <div className="text-xs text-[#1d1d1f]/50 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#8aab45]/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#4a7fb5]/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24 bg-[#fbfbfd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-[#4a7fb5]/10 text-[#4a7fb5] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Our Team
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] mb-4">
              Meet the People Behind <span className="text-[#4a7fb5]">DOZEY</span>
            </h2>
            <p className="text-[#1d1d1f]/60 max-w-2xl mx-auto text-lg">
              A passionate team of healthcare professionals, engineers, and advocates working to
              make health records portable for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="group bg-white border border-[#1d1d1f]/8 rounded-2xl p-6 text-center hover:shadow-xl hover:shadow-[#4a7fb5]/5 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#4a7fb5] to-[#4d9068] rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {member.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <h3 className="text-lg font-bold text-[#1d1d1f] mb-1">{member.name}</h3>
                <p className="text-[#4a7fb5] text-sm font-semibold mb-3">{member.role}</p>
                <p className="text-[#1d1d1f]/55 text-sm leading-relaxed mb-4">{member.bio}</p>
                <div className="flex justify-center gap-3">
                  <button className="w-8 h-8 rounded-full bg-[#1d1d1f]/5 flex items-center justify-center text-[#1d1d1f]/40 hover:bg-[#4a7fb5] hover:text-white transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-[#1d1d1f]/5 flex items-center justify-center text-[#1d1d1f]/40 hover:bg-[#4a7fb5] hover:text-white transition-colors">
                    <Github className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gradient-to-b from-[#f0f4f8] to-[#fbfbfd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block bg-[#4d9068]/10 text-[#4d9068] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                Contact Us
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] mb-4">
                Get in <span className="text-[#4d9068]">Touch</span>
              </h2>
              <p className="text-[#1d1d1f]/60 text-lg">
                Have questions or feedback? We'd love to hear from you.
              </p>
              <a
                href="https://www.instagram.com/dozeyrecords?igsh=NTc4MTIwNjQ2YQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-[#4a7fb5] hover:text-[#3a6a9a] font-medium transition-colors"
              >
                <Instagram className="w-5 h-5" />
                <span>Follow us on Instagram</span>
              </a>
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="bg-white rounded-2xl shadow-xl border border-[#1d1d1f]/5 p-8 space-y-5"
            >
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#1d1d1f] mb-2">
                  <User className="w-4 h-4 text-[#4a7fb5]" />
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="w-full px-4 py-3 rounded-xl border border-[#1d1d1f]/10 bg-[#f8faf5] text-[#1d1d1f] placeholder:text-[#1d1d1f]/30 focus:outline-none focus:ring-2 focus:ring-[#4a7fb5]/30 focus:border-[#4a7fb5] transition-all"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#1d1d1f] mb-2">
                  <Mail className="w-4 h-4 text-[#4a7fb5]" />
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-[#1d1d1f]/10 bg-[#f8faf5] text-[#1d1d1f] placeholder:text-[#1d1d1f]/30 focus:outline-none focus:ring-2 focus:ring-[#4a7fb5]/30 focus:border-[#4a7fb5] transition-all"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#1d1d1f] mb-2">
                  <MessageSquare className="w-4 h-4 text-[#4a7fb5]" />
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="w-full px-4 py-3 rounded-xl border border-[#1d1d1f]/10 bg-[#f8faf5] text-[#1d1d1f] placeholder:text-[#1d1d1f]/30 focus:outline-none focus:ring-2 focus:ring-[#4a7fb5]/30 focus:border-[#4a7fb5] transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#4a7fb5] hover:bg-[#3a6a9a] text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-[#4a7fb5]/25 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Send Message
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f5f5f7] text-[#86868b] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-[#8aab45] rounded-lg flex items-center justify-center font-bold text-[#1d1d1f] text-sm">
                  D
                </div>
                <span className="text-[#1d1d1f] font-bold text-lg">DOZEY</span>
              </div>
              <p className="text-sm leading-relaxed">
                Healthcare that moves with you. Managing medical records across borders for
                immigrants, students, and global workers.
              </p>
            </div>

            <div>
              <h4 className="text-[#1d1d1f] font-semibold mb-3">Quick Links</h4>
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className="block text-sm hover:text-[#4a7fb5] transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[#1d1d1f] font-semibold mb-3">Legal</h4>
              <div className="space-y-2 text-sm">
                <p className="hover:text-[#4a7fb5] cursor-pointer transition-colors">Privacy Policy</p>
                <p className="hover:text-[#4a7fb5] cursor-pointer transition-colors">Terms of Service</p>
                <p className="hover:text-[#4a7fb5] cursor-pointer transition-colors">HIPAA Compliance</p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#1d1d1f]/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} DOZEY. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/dozeyrecords?igsh=NTc4MTIwNjQ2YQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#86868b] hover:text-[#4a7fb5] transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#8aab45]" />
                <span className="text-sm">Built with care for global health equity</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
