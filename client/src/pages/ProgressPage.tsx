import { Users, CheckCircle2, Globe, Heart } from 'lucide-react';
import { Syringe, Shield, Stethoscope, Activity } from 'lucide-react';

export function ProgressPage() {
  const validationMetrics = [
    {
      icon: Users,
      count: '60+',
      label: 'Customer Interviews & Survey Responses',
      color: '#1051a5',
    },
    {
      icon: Stethoscope,
      count: '10+',
      label: 'Healthcare Professionals Consulted',
      color: '#26844f',
    },
    {
      icon: CheckCircle2,
      count: '86%',
      label: 'Validate Our Pain Point',
      color: '#97bf2d',
    },
  ];

  const regions = ['Europe', 'Mexico', 'India'];

  return (
    <div className="min-h-screen py-20">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5 z-0">
        <Syringe className="absolute top-20 left-1/4 w-40 h-40 text-[#1051a5] rotate-45" />
        <Stethoscope className="absolute bottom-40 right-20 w-36 h-36 text-[#26844f] -rotate-12" />
        <Activity className="absolute top-1/2 left-10 w-32 h-32 text-[#97bf2d]" />
        <Shield className="absolute bottom-10 left-1/3 w-36 h-36 text-[#1051a5]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-8 h-8 text-[#26844f]" />
            </div>
          </div>
          <h1 className="text-5xl mb-6 text-[#22283a]">
            Validated by Real Users & Experts
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            DOZEY is built on extensive research and real-world validation from the people
            who need it most.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {validationMetrics.map((metric, index) => {
            const Icon = metric.icon;
            const bgGradients = ['from-blue-100 to-blue-200/70', 'from-emerald-100 to-emerald-200/70', 'from-lime-100 to-lime-200/70'];
            const borderColors = ['border-blue-300/60', 'border-emerald-300/60', 'border-lime-300/60'];

            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${bgGradients[index]} rounded-2xl p-8 shadow-xl border-2 ${borderColors[index]} text-center hover:shadow-2xl transition-all hover:scale-[1.02]`}
              >
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg bg-white border-2"
                  style={{ borderColor: metric.color }}
                >
                  <Icon className="w-10 h-10" style={{ color: metric.color }} />
                </div>
                <div
                  className="text-5xl mb-4 font-bold"
                  style={{ color: metric.color }}
                >
                  {metric.count}
                </div>
                <p className="text-gray-700 font-medium">{metric.label}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-br from-blue-100/80 via-indigo-100/70 to-green-100/70 rounded-2xl p-12 mb-20 shadow-xl border-2 border-blue-200/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Globe className="w-10 h-10 text-white" />
                </div>
              </div>
              <h2 className="text-3xl mb-4 text-[#22283a]">
                Cross-Border Complexity Verified
              </h2>
              <p className="text-lg text-gray-700">
                Personal research and stakeholder validation across multiple regions
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {regions.map((region, idx) => {
                const iconColors = ['text-blue-600', 'text-green-600', 'text-indigo-600'];
                const bgColors = ['from-blue-50 to-blue-100', 'from-green-50 to-green-100', 'from-indigo-50 to-indigo-100'];

                return (
                  <div
                    key={region}
                    className={`bg-gradient-to-br ${bgColors[idx]} rounded-xl p-6 shadow-lg border-2 border-white hover:shadow-xl transition-all`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl text-[#22283a] font-semibold">{region}</span>
                      <CheckCircle2 className={`w-8 h-8 ${iconColors[idx]}`} />
                    </div>
                    <p className="text-sm text-gray-700 font-medium">
                      Verified complexity and need for standardized records
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="flex justify-center gap-3 mb-4">
              <Heart className="w-10 h-10 text-[#1051a5]" />
              <h2 className="text-3xl text-[#22283a]">
                Impact Stories
              </h2>
              <Heart className="w-10 h-10 text-[#1051a5]" />
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-red-50/50 rounded-2xl p-10 shadow-xl border-2 border-rose-200/60 hover:shadow-2xl transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-pink-200 rounded-xl flex items-center justify-center shadow-md">
                  <Heart className="w-7 h-7 text-[#1051a5]" />
                </div>
                <h3 className="text-2xl text-[#22283a] font-semibold">Every Record Matters</h3>
              </div>

              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                <p>
                  Alfredo Costilla Reyes, a small business owner, was thrilled to hire a talented new team member from Mexico. She had all her paperwork ready and was excited to start her new job.
                </p>

                <p>
                  But when it came time to submit her vaccine records, problems appeared. Some were in Spanish, others had slightly different names, and the authorities would not accept them.
                </p>

                <p>
                  Because of this, she could not start her job for two months. She lost $30,000 in salary, precious time, and had to spend over $150 on revaccinations she did not need. What should have been a smooth beginning became a stressful and costly delay.
                </p>

                <div className="mt-6 p-6 bg-white/70 rounded-xl border-2 border-blue-200">
                  <p className="text-[#1051a5] italic font-medium">
                    Stories like Alfredo's show why DOZEY exists. We help people keep their vaccine records organized, verified, and ready so they can start new opportunities on time. We help businesses protect their employees and their bottom line. Every record matters, because behind every record is a life waiting to move forward.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 bg-gradient-to-r from-[#1051a5] to-[#0d4185] text-white rounded-2xl p-12 text-center shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Syringe className="absolute top-4 right-10 w-24 h-24 rotate-45" />
            <Shield className="absolute bottom-4 left-10 w-20 h-20 -rotate-12" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl mb-4 font-bold">Real-World Validation, Not Hype</h2>
            <p className="text-lg opacity-90 max-w-3xl mx-auto mb-8">
              Every feature of DOZEY has been shaped by direct feedback from users who face
              this problem daily and professionals who see its impact on healthcare delivery.
            </p>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-6 h-6" />
              <span className="font-semibold">Validated &bull; Tested &bull; Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
