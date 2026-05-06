import { Users, Globe, FileCheck, TrendingUp } from 'lucide-react';

const stats = [
  { icon: <Users className="w-6 h-6" />, value: '500+', label: 'Students Helped' },
  { icon: <Globe className="w-6 h-6" />, value: '50+', label: 'Languages Supported' },
  { icon: <FileCheck className="w-6 h-6" />, value: '2,000+', label: 'Documents Processed' },
  { icon: <TrendingUp className="w-6 h-6" />, value: '98%', label: 'Satisfaction Rate' },
];

const stories = [
  { category: 'UC System', name: 'Priya S.', school: 'UC Davis', quote: 'My Hindi vaccination records were completely unreadable to the health portal. DOZEY translated everything and I cleared my hold in one day.' },
  { category: 'Community College', name: 'Carlos R.', school: 'De Anza College', quote: 'I had records from three different countries. DOZEY combined them all into one PDF that the school accepted immediately.' },
  { category: 'UC System', name: 'Mei L.', school: 'UCLA', quote: 'The compliance checker told me exactly which vaccines I was missing before I even submitted. Saved me weeks of back-and-forth.' },
  { category: 'Private University', name: 'Amara O.', school: 'USC', quote: 'I was worried my Nigerian records would not be accepted. DOZEY verified them and the university processed them without any issues.' },
  { category: 'UC System', name: 'Lucas M.', school: 'UC San Diego', quote: 'The fraud detection feature flagged an issue with one of my documents that I had not noticed. It helped me get the correct record in time.' },
  { category: 'CSU System', name: 'Fatima A.', school: 'Cal Poly SLO', quote: 'Arabic records, English requirements. DOZEY bridged that gap completely. The whole process took less than 20 minutes.' },
];

export function ProgressPage() {
  return (
    <div className="min-h-screen bg-[#0A1428] text-white">

      {/* Hero */}
      <section className="pt-36 pb-20 lg:pt-48 lg:pb-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#10B981]/10 border border-[#10B981]/20 rounded-full px-4 py-1.5 mb-8">
              <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="text-xs font-medium text-[#10B981] tracking-wide">Our Impact</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              Real students,<br />
              <span className="text-[#10B981]">real results.</span>
            </h1>
            <p className="text-lg text-[#94A3B8] leading-relaxed">
              Every number here represents a student who cleared their health hold and started their education without barriers.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#060D1A] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ icon, value, label }) => (
              <div key={label} className="text-center">
                <div className="flex justify-center text-[#10B981] mb-3">{icon}</div>
                <div className="text-4xl font-black mb-1">{value}</div>
                <div className="text-sm text-[#64748B] uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">Student stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map(({ category, name, school, quote }) => (
              <blockquote key={name} className="bg-[#111827] border border-white/10 rounded-lg p-7 hover:border-[#10B981]/20 transition-colors flex flex-col">
                <div className="inline-flex items-center mb-4">
                  <span className="text-xs font-semibold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20 rounded-full px-3 py-1">{category}</span>
                </div>
                <p className="text-[#CBD5E1] leading-relaxed italic flex-1 mb-6">"{quote}"</p>
                <footer>
                  <div className="font-semibold text-white">{name}</div>
                  <div className="text-sm text-[#64748B]">{school}</div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
