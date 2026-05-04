import { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const impactStories = [
  { name: 'Sofia R.', location: 'Argentina to Italy', quote: 'My children\'s vaccination booklets from Argentina were not recognized by the Italian school system. We had to get blood tests to prove immunity, which cost over 600 euros.', impact: '600+ euros in unnecessary blood tests', category: 'Education' },
  { name: 'Hassan B.', location: 'Iraq to Sweden', quote: 'Sweden\'s healthcare system couldn\'t verify my Iraqi vaccination records. I spent months going back and forth between clinics trying to establish my vaccination history.', impact: 'Months of bureaucratic delays', category: 'Refugee' },
  { name: 'Lisa K.', location: 'South Korea to Canada', quote: 'My Korean vaccination records listed vaccine brand names that don\'t exist in Canada. The pharmacist had no idea which Canadian equivalent each one corresponded to.', impact: 'Healthcare providers couldn\'t identify vaccines', category: 'Immigration' },
  { name: 'Daniel O.', location: 'Ghana to UK', quote: 'I needed my yellow fever certificate for a UK visa application. My original from Ghana was faded and partially illegible. The embassy rejected it, delaying my visa by two months.', impact: 'Visa delayed by 2 months', category: 'Immigration' },
  { name: 'Mei-Ling C.', location: 'Taiwan to USA', quote: 'My graduate school required a TB test and proof of MMR. The records from Taiwan used different naming conventions. I had to see three different doctors before one could verify them.', impact: 'Visited 3 doctors to verify records', category: 'Education' },
  { name: 'Pavel N.', location: 'Russia to Germany', quote: 'Russian vaccination records are in a booklet format that German doctors don\'t recognize. My entire family had to get evaluated individually, costing us thousands of euros.', impact: 'Thousands of euros in re-evaluation costs', category: 'Immigration' },
  { name: 'Ana M.', location: 'Philippines to Saudi Arabia', quote: 'As a nurse moving to Saudi Arabia, I needed extensive vaccination proof. My Philippine records were spread across three different clinics. Gathering them took weeks.', impact: 'Weeks spent collecting records from multiple clinics', category: 'Employment' },
  { name: 'James O.', location: 'Kenya to USA', quote: 'My Kenyan vaccination card was a small paper document that had become water-damaged. The US immigration doctor couldn\'t read half of it and I had to get several vaccines redone.', impact: 'Water-damaged records led to revaccination', category: 'Immigration' },
  { name: 'Nadia H.', location: 'Afghanistan to Turkey', quote: 'Fleeing Afghanistan, I had nothing but the clothes on my back. My daughter\'s vaccination records, carefully kept for 8 years, were left behind. We had to start everything over.', impact: '8 years of vaccination records lost', category: 'Refugee' },
  { name: 'Carlos D.', location: 'Venezuela to Chile', quote: 'Venezuelan hospitals had closed and their records were inaccessible. When I arrived in Chile, I couldn\'t prove any of my vaccinations. The cost of revaccination was devastating.', impact: 'Entire medical history inaccessible', category: 'Refugee' },
  { name: 'Amara T.', location: 'Ethiopia to Norway', quote: 'Norwegian schools required proof of all childhood vaccinations for my children. Our Ethiopian records were handwritten and partially in Amharic. The school gave us one month to sort it out.', impact: 'One month deadline to verify or restart vaccinations', category: 'Education' },
  { name: 'Min-Jun P.', location: 'South Korea to Australia', quote: 'My employer required a complete immunization record. Korean records list batch numbers and manufacturers that Australian databases don\'t recognize. HR had no idea how to process them.', impact: 'HR unable to process foreign vaccination records', category: 'Employment' },
];

const categoryColors: Record<string, string> = {
  Employment: '#0A1428',
  Education: '#10B981',
  Refugee: '#F97316',
  Immigration: '#6B7280',
};

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

export function ProgressPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const ref = useScrollFade();

  const filtered = selectedCategory
    ? impactStories.filter((s) => s.category === selectedCategory)
    : impactStories;

  const categories = Array.from(new Set(impactStories.map((s) => s.category)));

  return (
    <div ref={ref} className="min-h-screen bg-[#F8F7F4] text-[#0A1428]">

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#10B981] uppercase tracking-widest mb-4">
              Why DOZEY exists
            </p>
            <h1 className="text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight mb-6">
              Real stories,
              <br />
              real barriers
            </h1>
            <p className="text-lg text-[#6B7280] leading-relaxed">
              Every feature in DOZEY was built because someone, somewhere, faced a real
              barrier with their health records. These are their stories.
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 bg-white border-y border-[#E5E7EB]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '1B+', label: 'People cross borders annually' },
              { value: '40+', label: 'Countries with incompatible records' },
              { value: '600€', label: 'Average cost of re-testing' },
              { value: '12', label: 'Stories collected so far' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-semibold text-[#0A1428] mb-1">{value}</p>
                <p className="text-sm text-[#6B7280]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stories ── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">

          {/* Filter */}
          <div className="fade-in opacity-0 translate-y-6 transition-all duration-500 flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-[#0A1428] text-white'
                  : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB] hover:text-[#0A1428]'
              }`}
            >
              All stories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#0A1428] text-white'
                    : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB] hover:text-[#0A1428]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 gap-5">
            {filtered.map(({ name, location, quote, impact, category }) => (
              <div
                key={name}
                className="fade-in opacity-0 translate-y-6 transition-all duration-500 bg-white border border-[#E5E7EB] rounded-[8px] p-7 hover:border-[#D1D5DB] transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${categoryColors[category]}15`,
                      color: categoryColors[category],
                    }}
                  >
                    {category}
                  </span>
                  <span className="text-xs text-[#6B7280]">{location}</span>
                </div>
                <blockquote className="text-[#0A1428] text-sm leading-relaxed mb-5">
                  &ldquo;{quote}&rdquo;
                </blockquote>
                <div className="border-t border-[#F3F4F6] pt-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#0A1428]">{name}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">{impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-[#0A1428]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold text-white tracking-tight mb-4">
            Your data deserves better
          </h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            Join DOZEY and make sure your health records are always ready, wherever you go.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#10B981] text-[#0A1428] font-semibold rounded-[4px] hover:bg-[#0ea572] transition-colors active:scale-[0.98]"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
