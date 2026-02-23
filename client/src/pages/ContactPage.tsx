import { useState } from 'react';
import { Mail, Send, Syringe, Heart, MessageCircle } from 'lucide-react';

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
    <div className="min-h-screen py-20">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5 z-0">
        <Mail className="absolute top-20 right-1/4 w-40 h-40 text-[#1051a5]" />
        <Heart className="absolute bottom-20 left-10 w-36 h-36 text-[#26844f]" />
        <MessageCircle className="absolute top-1/2 right-10 w-32 h-32 text-[#97bf2d]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-lg">
              <Mail className="w-8 h-8 text-[#1051a5]" />
            </div>
          </div>
          <h1 className="text-5xl mb-6 text-[#22283a]">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions or want to learn more? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100/50 rounded-2xl p-8 shadow-xl border-2 border-blue-200/60 hover:shadow-2xl transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <Send className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl text-[#22283a] font-semibold">Send us a message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm mb-2 text-gray-700 font-medium"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-[#1051a5] focus:ring-2 focus:ring-[#1051a5] focus:ring-opacity-20 outline-none transition-all shadow-sm bg-white"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm mb-2 text-gray-700 font-medium"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-[#1051a5] focus:ring-2 focus:ring-[#1051a5] focus:ring-opacity-20 outline-none transition-all shadow-sm bg-white"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm mb-2 text-gray-700 font-medium"
                >
                  Questions / Concerns *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-[#1051a5] focus:ring-2 focus:ring-[#1051a5] focus:ring-opacity-20 outline-none transition-all resize-none shadow-sm bg-white"
                  placeholder="Tell us what's on your mind..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#1051a5] to-[#0d4185] text-white py-4 rounded-lg hover:from-[#0d4185] hover:to-[#0a3366] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl font-medium"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-teal-50 rounded-2xl p-8 shadow-xl border-2 border-indigo-200/60">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl text-[#22283a] font-semibold">Get in Touch</h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                Whether you're interested in learning more about DOZEY, want to join our
                beta testing program, or have questions about our platform, we're here to help.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Or email us at <a href="mailto:dozeyvaccines@gmail.com" className="text-[#1051a5] hover:underline font-semibold">dozeyvaccines@gmail.com</a> to contact us directly.
              </p>
              <div className="space-y-3 mt-6 p-5 bg-white/70 rounded-xl border border-blue-200">
                <p className="text-sm text-gray-700">
                  <strong className="text-[#22283a]">Response Time:</strong> Within 24-48 hours
                </p>
                <p className="text-sm text-gray-700">
                  <strong className="text-[#22283a]">Office Hours:</strong> Monday - Friday, 9am - 5pm PST
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-100/50 rounded-2xl p-8 shadow-xl border-2 border-green-200/60 hover:shadow-2xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center shadow-md">
                  <Syringe className="w-5 h-5 text-[#26844f]" />
                </div>
                <h3 className="text-xl text-[#22283a] font-semibold">Interested in joining the waitlist?</h3>
              </div>
              <p className="text-gray-700 mb-6">
                Be among the first to experience DOZEY's secure vaccination record management platform.
              </p>
              <a
                href="https://forms.gle/Tr7WLVfQR6W3PeXb6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#26844f] to-[#1e6a3f] text-white rounded-lg hover:from-[#1e6a3f] hover:to-[#165230] transition-all shadow-md hover:shadow-lg font-medium"
              >
                Join the Waitlist
              </a>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-100/50 rounded-2xl p-8 shadow-xl border-2 border-purple-200/60 hover:shadow-2xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-200 rounded-lg flex items-center justify-center shadow-md">
                  <Heart className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl text-[#22283a] font-semibold">Partnership Opportunities</h3>
              </div>
              <p className="text-gray-700">
                We're open to collaborations with healthcare institutions, universities,
                and organizations that share our vision of simplifying global health record management.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
