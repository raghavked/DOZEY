import { useState, useEffect, useRef } from 'react';
import { Mail, Send, MessageCircle, Clock, MapPin, Syringe, ArrowRight, Linkedin } from 'lucide-react';

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

export function ContactPage() {
  const scrollRef = useScrollAnimation();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for reaching out! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div ref={scrollRef} className="min-h-screen">
      <section className="relative min-h-[70vh] flex items-center bg-gradient-to-b from-[#f5f5f7] to-[#fbfbfd] text-[#1d1d1f] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[#8aab45]/5 rounded-full blur-[150px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-40 w-full">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[#8aab45] text-xs font-semibold uppercase tracking-widest mb-6 animate-fade-in">
              Contact
            </p>
            <h1 className="animate-fade-in-up text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[1.05] tracking-tight mb-6">
              Get in <span className="text-[#8aab45]">touch</span>
            </h1>
            <p className="animate-fade-in-up delay-200 text-base text-[#86868b] max-w-lg mx-auto font-light">
              Questions, feedback, or partnership inquiries — we'd love to hear from you.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fbfbfd] to-transparent" />
      </section>

      <section className="py-24 lg:py-32 bg-[#fbfbfd]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16">
            <div className="lg:col-span-3 animate-on-scroll">
              <h2 className="text-xl font-semibold text-[#1d1d1f] mb-8">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-xs text-[#86868b] mb-2 font-medium uppercase tracking-wide">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-black/5 focus:border-[#4a7fb5] focus:ring-2 focus:ring-[#4a7fb5]/10 outline-none transition-all text-sm text-[#1d1d1f]"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs text-[#86868b] mb-2 font-medium uppercase tracking-wide">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-black/5 focus:border-[#4a7fb5] focus:ring-2 focus:ring-[#4a7fb5]/10 outline-none transition-all text-sm text-[#1d1d1f]"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs text-[#86868b] mb-2 font-medium uppercase tracking-wide">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3.5 rounded-xl border border-black/5 focus:border-[#4a7fb5] focus:ring-2 focus:ring-[#4a7fb5]/10 outline-none transition-all resize-none text-sm text-[#1d1d1f]"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-[#4a7fb5] hover:bg-[#3d6a9e] text-white px-8 py-3.5 rounded-full transition-all font-semibold text-sm active:scale-[0.98]"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4 animate-on-scroll delay-200">
              {[
                { icon: Mail, title: 'Email Us', desc: 'dozeyvaccines@gmail.com', href: 'mailto:dozeyvaccines@gmail.com' },
                { icon: Linkedin, title: 'LinkedIn', desc: 'Follow us on LinkedIn', href: 'https://www.linkedin.com/company/dozey-vaccines' },
                { icon: Clock, title: 'Response Time', desc: 'Within 24-48 hours' },
                { icon: MapPin, title: 'Office Hours', desc: 'Mon-Fri, 9am-5pm PST' },
              ].map(({ icon: Icon, title, desc, href }) => (
                <div key={title} className="flex items-center gap-4 p-4 rounded-xl">
                  <div className="w-10 h-10 bg-[#f5f5f7] rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#1d1d1f]/40" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1d1d1f] text-sm">{title}</h3>
                    {href ? (
                      <a href={href} className="text-[#4a7fb5] text-sm" {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{desc}</a>
                    ) : (
                      <p className="text-[#86868b] text-sm">{desc}</p>
                    )}
                  </div>
                </div>
              ))}

              <div className="bg-[#f5f5f7] rounded-2xl p-8 text-[#1d1d1f] mt-6">
                <Syringe className="w-5 h-5 text-[#8aab45] mb-4" />
                <h3 className="text-base font-semibold mb-2">Get Started Today</h3>
                <p className="text-[#86868b] mb-6 text-sm leading-relaxed font-light">
                  Be among the first to experience DOZEY's secure vaccination record management platform.
                </p>
                <a
                  href="/register"
                  className="inline-flex items-center gap-2 bg-[#4a7fb5] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#3d6a9e] transition-all text-sm"
                >
                  Create Your Free Account
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl">
                <div className="w-10 h-10 bg-[#f5f5f7] rounded-xl flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4 text-[#1d1d1f]/40" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1d1d1f] text-sm">Partnerships</h3>
                  <p className="text-[#86868b] text-sm">We welcome collaborations with healthcare institutions and universities.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
