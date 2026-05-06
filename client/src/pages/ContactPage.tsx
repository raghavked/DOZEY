import { useState } from 'react';
import { Mail, Clock, Linkedin, CheckCircle } from 'lucide-react';

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0A1428] text-white">

      {/* Hero */}
      <section className="pt-36 pb-16 lg:pt-48 lg:pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#10B981]/10 border border-[#10B981]/20 rounded-full px-4 py-1.5 mb-8">
              <Mail className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="text-xs font-medium text-[#10B981] tracking-wide">Get in Touch</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              We would love<br />
              <span className="text-[#10B981]">to hear from you.</span>
            </h1>
            <p className="text-lg text-[#94A3B8] leading-relaxed">
              Questions about DOZEY, partnership inquiries, or just want to share your story — reach out and we will get back to you quickly.
            </p>
          </div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-16 pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="bg-[#111827] border border-[#10B981]/30 rounded-lg p-12 text-center">
                  <CheckCircle className="w-16 h-16 text-[#10B981] mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-3">Message sent!</h3>
                  <p className="text-[#94A3B8]">We typically respond within 24 hours. We will be in touch soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-[#111827] border border-white/10 rounded-lg p-8 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#94A3B8] mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="w-full bg-[#0A1428] border border-white/10 focus:border-[#10B981] rounded-[4px] px-4 py-3 text-white placeholder-[#475569] outline-none transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#94A3B8] mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="w-full bg-[#0A1428] border border-white/10 focus:border-[#10B981] rounded-[4px] px-4 py-3 text-white placeholder-[#475569] outline-none transition-colors text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-2">Subject</label>
                    <select
                      name="subject"
                      required
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full bg-[#0A1428] border border-white/10 focus:border-[#10B981] rounded-[4px] px-4 py-3 text-white outline-none transition-colors text-sm"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Question</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership Inquiry</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-2">Message</label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                      className="w-full bg-[#0A1428] border border-white/10 focus:border-[#10B981] rounded-[4px] px-4 py-3 text-white placeholder-[#475569] outline-none transition-colors text-sm resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#10B981] hover:bg-[#0ea472] disabled:opacity-60 text-white font-semibold py-4 rounded-[4px] transition-colors text-sm"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Info sidebar */}
            <div className="space-y-6">
              <div className="bg-[#111827] border border-white/10 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-[#10B981]" />
                  <h4 className="font-semibold">Response Time</h4>
                </div>
                <p className="text-sm text-[#94A3B8]">We typically respond within 24 hours on weekdays.</p>
              </div>
              <div className="bg-[#111827] border border-white/10 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Linkedin className="w-5 h-5 text-[#10B981]" />
                  <h4 className="font-semibold">Connect with the Team</h4>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Aashreeti Deo', url: 'https://www.linkedin.com/in/aashreeti-deo/' },
                    { name: 'Isaac Karottu', url: 'https://www.linkedin.com/in/isaac-karottu-95242b2b3/' },
                    { name: 'Raghav Kedia', url: 'https://www.linkedin.com/in/raghav-kedia-169a42279/' },
                  ].map(({ name, url }) => (
                    <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#10B981] transition-colors">
                      <Linkedin className="w-3.5 h-3.5" />
                      {name}
                    </a>
                  ))}
                </div>
              </div>
              <div className="bg-[#111827] border border-white/10 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="w-5 h-5 text-[#10B981]" />
                  <h4 className="font-semibold">Email</h4>
                </div>
                <a href="mailto:hello@dozey.health" className="text-sm text-[#94A3B8] hover:text-white transition-colors">
                  hello@dozey.health
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
