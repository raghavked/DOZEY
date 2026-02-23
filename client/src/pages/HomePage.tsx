import { ArrowRight, Users, Globe, Syringe, Heart, Shield, Stethoscope, Pill, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HomePage() {
  const regionsData = [
    { region: 'Europe', validated: true },
    { region: 'Mexico', validated: true },
    { region: 'India', validated: true },
  ];

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5 z-0">
        <Syringe className="absolute top-20 left-10 w-32 h-32 text-[#1051a5] rotate-45" />
        <Heart className="absolute top-40 right-20 w-40 h-40 text-[#26844f]" />
        <Shield className="absolute bottom-40 left-1/4 w-36 h-36 text-[#1051a5]" />
        <Stethoscope className="absolute top-1/3 right-10 w-36 h-36 text-[#97bf2d] rotate-12" />
        <Pill className="absolute bottom-20 right-1/3 w-28 h-28 text-[#26844f] -rotate-45" />
        <Activity className="absolute top-2/3 left-20 w-32 h-32 text-[#1051a5]" />
      </div>

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-4xl mx-auto relative z-10">
          <div className="mb-6 flex justify-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
              <Syringe className="w-8 h-8 text-[#1051a5]" />
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center shadow-lg animate-bounce" style={{ animationDelay: '0.2s' }}>
              <Heart className="w-8 h-8 text-[#26844f]" />
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-lime-100 to-lime-200 rounded-2xl flex items-center justify-center shadow-lg animate-bounce" style={{ animationDelay: '0.4s' }}>
              <Shield className="w-8 h-8 text-[#97bf2d]" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl mb-6 text-[#22283a]">
            Healthcare that moves with you!
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
            Upload and convert your vaccine records into a format accepted worldwide — no delays, no repeat vaccinations, and no money lost!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-[#1051a5] text-white rounded-xl hover:bg-[#0d4185] transition-all shadow-xl hover:shadow-2xl hover:scale-105 font-medium"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>

            <Link
              to="/features"
              className="inline-flex items-center px-8 py-4 border-2 border-[#1051a5] text-[#1051a5] bg-white rounded-xl hover:bg-[#1051a5] hover:text-white transition-all shadow-md hover:shadow-lg font-medium"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      <section className="relative py-20 bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-emerald-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <Stethoscope className="w-10 h-10 text-[#1051a5]" />
              <h2 className="text-4xl text-[#22283a]">
                A Global Healthcare Problem — Personally Experienced
              </h2>
              <Stethoscope className="w-10 h-10 text-[#1051a5]" />
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Through extensive research and personal experience, we've validated the urgent need
              for a unified vaccination record system.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-8 shadow-xl border border-blue-200/50 hover:shadow-2xl transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl text-[#22283a]">Customer Validation</h3>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center p-6 bg-gradient-to-br from-blue-100 to-blue-200/70 rounded-xl shadow-md border border-blue-300/50">
                  <Users className="w-10 h-10 text-[#1051a5] mx-auto mb-3" />
                  <p className="text-4xl text-[#1051a5] mb-2 font-bold">60+</p>
                  <p className="text-sm text-gray-700">Customer Interviews & Survey Responses</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-emerald-100 to-emerald-200/70 rounded-xl shadow-md border border-emerald-300/50">
                  <Stethoscope className="w-10 h-10 text-[#26844f] mx-auto mb-3" />
                  <p className="text-4xl text-[#26844f] mb-2 font-bold">10+</p>
                  <p className="text-sm text-gray-700">Healthcare Professionals</p>
                </div>
              </div>

              <div className="mt-6 p-5 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-xl text-center shadow-sm">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Heart className="w-6 h-6 text-[#26844f]" />
                  <p className="text-lg text-[#26844f] font-semibold">
                    <strong>86%</strong> validate our pain point
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-green-50/30 rounded-2xl p-8 shadow-xl border border-green-200/50 hover:shadow-2xl transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl text-[#22283a]">Global Verification</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Cross-border complexity verified in multiple regions through personal research
                and stakeholder conversations.
              </p>

              <div className="space-y-4">
                {regionsData.map((region) => (
                  <div
                    key={region.region}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-100/70 rounded-xl border border-blue-300/50 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-6 h-6 text-[#1051a5]" />
                      <span className="text-[#22283a] font-medium">{region.region}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#26844f]">
                      <Shield className="w-6 h-6" />
                      <span className="text-sm font-semibold">Verified</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl shadow-sm">
                <p className="text-sm text-[#1051a5] italic">
                  "Navigating vaccination requirements across countries personally revealed the
                  urgent need for a centralized, secure solution."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
