import { useEffect } from 'react';

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
      { threshold: 0.12 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

export function ProgressPage() {
  useReveal();

  const stats = [
    { value: '50K+', label: 'Records Processed' },
    { value: '150+', label: 'Countries Covered' },
    { value: '98%', label: 'Student Satisfaction' },
    { value: '< 2min', label: 'Avg. Processing Time' },
  ];

  const stories = [
    { category: 'UC System', name: 'Priya M.', from: 'India → UC Berkeley', quote: 'My vaccination records from India were in Hindi. DOZEY translated and verified them in 90 seconds. UC Berkeley accepted them immediately.' },
    { category: 'Graduate School', name: 'Carlos R.', from: 'Brazil → UCLA', quote: 'Three years of health records from São Paulo, all in Portuguese. DOZEY organized everything into a single PDF that UCLA\'s health center loved.' },
    { category: 'Medical School', name: 'Yuna K.', from: 'South Korea → UC San Diego', quote: 'The compliance checker showed me exactly which vaccines I was missing before I even arrived in the US. Saved me so much stress.' },
    { category: 'Undergraduate', name: 'Amara O.', from: 'Nigeria → UC Davis', quote: 'I was worried my Nigerian health records wouldn\'t be accepted. DOZEY verified their authenticity and translated everything perfectly.' },
    { category: 'Transfer Student', name: 'Liu W.', from: 'China → UC Irvine', quote: 'The document verification feature gave me confidence that my records would be accepted. No more back-and-forth with the health center.' },
    { category: 'PhD Program', name: 'Sofia A.', from: 'Argentina → UC Santa Barbara', quote: 'As a PhD student, I had records from three different countries. DOZEY merged them all into one coherent health profile.' },
  ];

  const milestones = [
    { year: '2023', event: 'DOZEY founded by international students at UC Berkeley' },
    { year: 'Q1 2024', event: 'Launched AI translation pipeline supporting 20 languages' },
    { year: 'Q2 2024', event: 'Added UC System compliance checker for all 9 campuses' },
    { year: 'Q3 2024', event: 'Reached 10,000 records processed milestone' },
    { year: 'Q4 2024', event: 'Launched document authenticity verification feature' },
    { year: '2025', event: 'Expanded to 150+ countries and 50+ languages' },
  ];

  return (
    <div className="public-site bg-[#0A1428] min-h-screen text-white">

      {/* Hero */}
      <section className="relative pt-36 pb-20 px-6 lg:px-12 overflow-hidden bg-grid-dots">
        <div className="glow-orb w-[400px] h-[400px] bg-[#00D9A3] opacity-[0.06] top-[-60px] left-[-60px]" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <span className="badge-teal mb-5 inline-flex animate-fade-in-up">Our Impact</span>
          <h1 className="text-5xl md:text-6xl font-black mb-6 animate-fade-in-up delay-100 leading-tight max-w-3xl"
            style={{ fontFamily: "'Poppins', sans-serif" }}>
            Real Students,{' '}
            <span className="text-gradient">Real Results</span>
          </h1>
          <p className="text-slate-300 text-xl leading-relaxed animate-fade-in-up delay-200 max-w-2xl">
            From Nairobi to New York, DOZEY has helped thousands of international students navigate US university health requirements.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-white/[0.06]" style={{ background: 'rgba(0,217,163,0.04)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={s.label} className={`text-center reveal delay-${i * 100 + 100}`}>
                <div className="text-4xl md:text-5xl font-black text-gradient mb-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}>{s.value}</div>
                <div className="text-slate-400 text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="badge-teal mb-4 inline-flex">Student Stories</span>
            <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Voices from <span className="text-gradient">Around the World</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((s, i) => (
              <div key={s.name} className={`card-dark p-6 reveal delay-${(i % 3) * 100 + 100}`}>
                <span className="badge-teal mb-4 inline-flex">{s.category}</span>
                <blockquote className="text-slate-300 text-sm leading-relaxed mb-5 italic">"{s.quote}"</blockquote>
                <div className="border-t border-white/[0.06] pt-4">
                  <div className="text-white font-semibold text-sm">{s.name}</div>
                  <div className="text-[#00D9A3] text-xs mt-0.5">{s.from}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Timeline */}
      <section className="py-24 px-6 lg:px-12" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="badge-teal mb-4 inline-flex">Timeline</span>
            <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Our <span className="text-gradient">Journey</span>
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#00D9A3] to-transparent opacity-30" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={m.year} className={`flex gap-6 reveal delay-${i * 100 + 100}`}>
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#00D9A3]/10 border border-[#00D9A3]/25 flex items-center justify-center z-10">
                    <div className="w-2 h-2 rounded-full bg-[#00D9A3]" />
                  </div>
                  <div className="pb-8">
                    <div className="text-[#00D9A3] font-bold text-sm mb-1">{m.year}</div>
                    <div className="text-white font-medium">{m.event}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
export default ProgressPage;
