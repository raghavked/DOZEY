import { useState, useEffect, useRef } from 'react';
import { Mail, Send, MessageCircle, Clock, MapPin, Syringe, ArrowRight } from 'lucide-react';

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
      <section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-[#0a3d7a] via-[#1051a5] to-[#22283a] text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[#97bf2d]/6 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-40 w-full">
          <div className="max-w-3xl">
            <span className="text-[#97bf2d] text-sm font-semibold uppercase tracking-widest mb-4 block animate-fade-in">
              Contact
            </span>
            <h1 className="animate-fade-in-up text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[0.95] tracking-tight mb-6">
              Get in
              <br />
              <span className="text-[#97bf2d]">touch</span>
            </h1>
            <p className="animate-fade-in-up delay-200 text-lg text-white/50 max-w-lg">
              Questions, feedback, or partnership inquiries — we'd love to hear from you.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fefefe] to-transparent" />
      </section>

      <section className="py-24 lg:py-32 bg-[#fefefe]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16 max-w-6xl mx-auto">
            <div className="lg:col-span-3 animate-on-scroll">
              <h2 className="text-2xl font-extrabold text-[#22283a] mb-8">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm mb-2 text-gray-500 font-medium">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-[#1051a5] focus:ring-2 focus:ring-[#1051a5]/10 outline-none transition-all bg-gray-50 text-[#22283a]"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm mb-2 text-gray-500 font-medium">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-[#1051a5] focus:ring-2 focus:ring-[#1051a5]/10 outline-none transition-all bg-gray-50 text-[#22283a]"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm mb-2 text-gray-500 font-medium">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-[#1051a5] focus:ring-2 focus:ring-[#1051a5]/10 outline-none transition-all resize-none bg-gray-50 text-[#22283a]"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#22283a] hover:bg-[#1a1f2e] text-white py-4 rounded-full transition-all flex items-center justify-center gap-2 font-bold text-lg active:scale-[0.98]"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-6 animate-on-scroll delay-200">
              {[
                { icon: Mail, title: 'Email Us', desc: 'dozeyvaccines@gmail.com', href: 'mailto:dozeyvaccines@gmail.com', color: '#1051a5' },
                { icon: Clock, title: 'Response Time', desc: 'Within 24-48 hours', color: '#26844f' },
                { icon: MapPin, title: 'Office Hours', desc: 'Mon-Fri, 9am-5pm PST', color: '#22283a' },
              ].map(({ icon: Icon, title, desc, href, color }) => (
                <div key={title} className="flex items-center gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}08` }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#22283a] text-sm">{title}</h3>
                    {href ? (
                      <a href={href} className="text-[#1051a5] hover:underline text-sm">{desc}</a>
                    ) : (
                      <p className="text-gray-500 text-sm">{desc}</p>
                    )}
                  </div>
                </div>
              ))}

              <div className="bg-[#22283a] rounded-2xl p-8 text-white">
                <Syringe className="w-8 h-8 text-[#97bf2d] mb-4" />
                <h3 className="text-lg font-extrabold mb-2">Join the Waitlist</h3>
                <p className="text-white/40 mb-6 text-sm leading-relaxed">
                  Be among the first to experience DOZEY's secure vaccination record management platform.
                </p>
                <a
                  href="https://forms.gle/Tr7WLVfQR6W3PeXb6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#97bf2d] text-[#22283a] font-bold px-6 py-3 rounded-full hover:bg-[#88ad28] transition-all text-sm"
                >
                  Join Now
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <div className="flex items-center gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-purple-50">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-[#22283a] text-sm">Partnership Opportunities</h3>
                  <p className="text-gray-500 text-sm">We welcome collaborations with healthcare institutions and universities.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
