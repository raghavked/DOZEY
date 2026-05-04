import { useState, useEffect, useRef } from 'react';
import { Mail, Linkedin, ArrowRight, Clock, MapPin } from 'lucide-react';

function useScrollFade() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-6');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    ref.current?.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export function ContactPage() {
  const ref = useScrollFade();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div ref={ref} className="min-h-screen bg-[#F8F7F4] text-[#0A1428]">

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#10B981] uppercase tracking-widest mb-4">
              Contact
            </p>
            <h1 className="text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight mb-6">
              Get in touch
            </h1>
            <p className="text-lg text-[#6B7280] leading-relaxed">
              Questions, feedback, or partnership inquiries — we&apos;d love to hear from you.
              Real support, real people.
            </p>
          </div>
        </div>
      </section>

      {/* ── Contact body ── */}
      <section className="py-20 lg:py-28 bg-white border-y border-[#E5E7EB]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16">

            {/* Form */}
            <div className="lg:col-span-3 fade-in opacity-0 translate-y-6 transition-all duration-500">
              <h2 className="text-2xl font-semibold text-[#0A1428] mb-8">Send us a message</h2>

              {submitted ? (
                <div className="bg-[#10B981]/10 border border-[#10B981]/20 rounded-[8px] p-8 text-center">
                  <div className="w-12 h-12 bg-[#10B981]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ArrowRight className="w-5 h-5 text-[#10B981]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0A1428] mb-2">Message sent</h3>
                  <p className="text-[#6B7280] text-sm">
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-sm font-medium text-[#0A1428] underline underline-offset-4 hover:text-[#1F2937]"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#0A1428] mb-1.5" htmlFor="name">
                      Full name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 border border-[#D1D5DB] rounded-[4px] text-[#0A1428] placeholder:text-[#9CA3AF] bg-white text-base focus:outline-none focus:border-[#0A1428] focus:ring-2 focus:ring-[#0A1428]/10 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0A1428] mb-1.5" htmlFor="email">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 border border-[#D1D5DB] rounded-[4px] text-[#0A1428] placeholder:text-[#9CA3AF] bg-white text-base focus:outline-none focus:border-[#0A1428] focus:ring-2 focus:ring-[#0A1428]/10 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0A1428] mb-1.5" htmlFor="message">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                      className="w-full px-4 py-3 border border-[#D1D5DB] rounded-[4px] text-[#0A1428] placeholder:text-[#9CA3AF] bg-white text-base focus:outline-none focus:border-[#0A1428] focus:ring-2 focus:ring-[#0A1428]/10 transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#0A1428] text-white font-semibold py-3.5 rounded-[4px] hover:bg-[#1F2937] transition-colors active:scale-[0.98] flex items-center justify-center gap-2 text-base"
                  >
                    Send Message
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Info sidebar */}
            <div className="lg:col-span-2 fade-in opacity-0 translate-y-6 transition-all duration-500 space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-[#0A1428] mb-4">Contact information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-[#6B7280] mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-medium text-[#0A1428]">Email</p>
                      <a
                        href="mailto:hello@dozey.com"
                        className="text-sm text-[#6B7280] hover:text-[#0A1428] transition-colors underline underline-offset-4"
                      >
                        hello@dozey.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[#6B7280] mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-medium text-[#0A1428]">Response time</p>
                      <p className="text-sm text-[#6B7280]">Within 24 hours on business days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#6B7280] mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-medium text-[#0A1428]">Based in</p>
                      <p className="text-sm text-[#6B7280]">Davis, California, USA</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#E5E7EB] pt-8">
                <h3 className="text-lg font-semibold text-[#0A1428] mb-4">Connect with the team</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Aashreeti Deo', role: 'CEO', url: 'https://www.linkedin.com/in/aashreeti-deo/' },
                    { name: 'Isaac Karottu', role: 'CRO', url: 'https://www.linkedin.com/in/isaac-karottu-95242b2b3/' },
                    { name: 'Raghav Kedia', role: 'CTO', url: 'https://www.linkedin.com/in/raghav-kedia-169a42279/' },
                  ].map(({ name, role, url }) => (
                    <a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-[#6B7280] hover:text-[#0A1428] transition-colors group"
                    >
                      <Linkedin className="w-4 h-4 flex-shrink-0" />
                      <span>
                        <span className="font-medium text-[#0A1428]">{name}</span>
                        <span className="text-[#6B7280]"> &mdash; {role}</span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
