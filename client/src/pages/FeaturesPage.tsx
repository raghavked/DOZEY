import { Upload, Brain, Shield, Share2, ArrowRight, Syringe, Lock, FileCheck } from 'lucide-react';

export function FeaturesPage() {
  const features = [
    {
      icon: Upload,
      title: 'Upload vaccination records',
      description: 'PDFs, images, or documents',
      color: '#1051a5',
    },
    {
      icon: Brain,
      title: 'AI-powered parsing & standardization',
      description: 'Automatically extracts and organizes data',
      color: '#97bf2d',
    },
    {
      icon: Shield,
      title: 'Secure, encrypted digital vaccine record',
      description: 'Your data stays private and protected',
      color: '#26844f',
    },
    {
      icon: Share2,
      title: 'Institution-ready sharing across borders',
      description: 'Share verified records with healthcare providers globally',
      color: '#1051a5',
    },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5 z-0">
        <Syringe className="absolute top-10 right-1/4 w-40 h-40 text-[#1051a5] rotate-12" />
        <Shield className="absolute bottom-20 left-10 w-36 h-36 text-[#26844f] -rotate-12" />
        <FileCheck className="absolute top-1/2 right-10 w-32 h-32 text-[#97bf2d]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="flex justify-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-md">
              <Syringe className="w-7 h-7 text-[#1051a5]" />
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-lime-100 to-lime-200 rounded-xl flex items-center justify-center shadow-md">
              <Brain className="w-7 h-7 text-[#97bf2d]" />
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shadow-md">
              <Shield className="w-7 h-7 text-[#26844f]" />
            </div>
          </div>
          <h1 className="text-5xl mb-6 text-[#22283a]">How DOZEY Works</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our MVP provides a seamless, secure solution for managing and sharing
            vaccination records internationally.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#1051a5] via-[#97bf2d] to-[#26844f] transform -translate-y-1/2 opacity-20"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const bgColors = ['from-blue-50 to-blue-100/50', 'from-lime-50 to-lime-100/50', 'from-emerald-50 to-emerald-100/50', 'from-indigo-50 to-indigo-100/50'];
              const borderColors = ['border-blue-200/60', 'border-lime-200/60', 'border-emerald-200/60', 'border-indigo-200/60'];

              return (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${bgColors[index]} rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all border-2 ${borderColors[index]} relative hover:scale-[1.02]`}
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-[#1051a5] to-[#0d4185] border-4 border-white flex items-center justify-center shadow-lg">
                    <span className="text-lg text-white font-bold">{index + 1}</span>
                  </div>

                  <div
                    className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center shadow-md bg-white"
                    style={{ borderWidth: '2px', borderColor: feature.color }}
                  >
                    <Icon className="w-8 h-8" style={{ color: feature.color }} />
                  </div>

                  <h3 className="text-xl mb-3 text-[#22283a] font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700">{feature.description}</p>

                  {index < features.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-20 bg-gradient-to-br from-blue-100/70 via-indigo-100/60 to-green-100/60 rounded-2xl p-12 shadow-xl border-2 border-blue-200/50">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <Lock className="w-12 h-12 text-[#1051a5]" />
            </div>
            <h2 className="text-3xl mb-4 text-[#22283a]">
              Technical but Approachable
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              DOZEY combines cutting-edge AI technology with an intuitive user experience,
              making complex healthcare data management simple and secure.
            </p>

            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-blue-200/50">
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="w-6 h-6 text-[#1051a5]" />
                  <h4 className="text-lg font-semibold text-[#1051a5]">Encrypted Storage</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Bank-level encryption ensures your health data remains private and secure
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-lime-200/50">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-6 h-6 text-[#97bf2d]" />
                  <h4 className="text-lg font-semibold text-[#97bf2d]">Smart Recognition</h4>
                </div>
                <p className="text-sm text-gray-600">
                  AI automatically identifies and organizes vaccination information
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-green-200/50">
                <div className="flex items-center gap-2 mb-3">
                  <FileCheck className="w-6 h-6 text-[#26844f]" />
                  <h4 className="text-lg font-semibold text-[#26844f]">Global Standards</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Compatible with international healthcare systems and requirements
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
