import { useState } from 'react';
import { Mail, Send, Heart, MessageCircle, Clock, MapPin, Syringe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for reaching out! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1051a5] via-[#0d4290] to-[#22283a] text-white py-24 lg:py-32">
        <div className="absolute inset-0 opacity-10">
          <Mail className="absolute top-10 right-1/4 w-48 h-48" />
          <Heart className="absolute bottom-10 left-20 w-40 h-40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-white/10 text-white/90 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            Contact
          </span>
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            Get in <span className="text-[#97bf2d]">Touch</span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Questions, feedback, or partnership inquiries — we'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-[#fefefe]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10">
                <h2 className="text-2xl font-bold text-[#22283a] mb-8">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm mb-2 text-[#22283a] font-semibold">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-[#1051a5] focus:ring-2 focus:ring-[#1051a5]/20 outline-none transition-all bg-gray-50 text-[#22283a]"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm mb-2 text-[#22283a] font-semibold">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-[#1051a5] focus:ring-2 focus:ring-[#1051a5]/20 outline-none transition-all bg-gray-50 text-[#22283a]"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm mb-2 text-[#22283a] font-semibold">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-[#1051a5] focus:ring-2 focus:ring-[#1051a5]/20 outline-none transition-all resize-none bg-gray-50 text-[#22283a]"
                      placeholder="Tell us what's on your mind..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#1051a5] hover:bg-[#0d4185] text-white py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl font-bold text-lg active:scale-[0.98]"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#1051a5]/10 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#1051a5]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#22283a]">Email Us</h3>
                    <a href="mailto:dozeyvaccines@gmail.com" className="text-[#1051a5] hover:underline text-sm font-medium">
                      dozeyvaccines@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#26844f]/10 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-[#26844f]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#22283a]">Response Time</h3>
                    <p className="text-gray-600 text-sm">Within 24-48 hours</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#97bf2d]/10 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-[#97bf2d]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#22283a]">Office Hours</h3>
                    <p className="text-gray-600 text-sm">Mon-Fri, 9am-5pm PST</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#26844f] to-[#1e6a3f] rounded-2xl p-8 text-white shadow-xl">
                <Syringe className="w-10 h-10 text-white/80 mb-4" />
                <h3 className="text-xl font-bold mb-3">Join the Waitlist</h3>
                <p className="text-white/80 mb-5 text-sm leading-relaxed">
                  Be among the first to experience DOZEY's secure vaccination record management platform.
                </p>
                <a
                  href="https://forms.gle/Tr7WLVfQR6W3PeXb6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-[#26844f] font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-all shadow-md"
                >
                  Join Now
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-[#22283a]">Partnership Opportunities</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We welcome collaborations with healthcare institutions, universities,
                  and organizations that share our vision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
