import { useState } from 'react';
import { Users, CheckCircle2, Globe, Heart, Award, GraduationCap, Trophy, ChevronLeft, ChevronRight, Quote, Syringe, Shield, Stethoscope, Activity, MapPin, Building } from 'lucide-react';

const impactStories = [
  {
    name: 'Alfredo C.',
    location: 'Mexico to USA',
    quote: 'My new hire from Mexico had all her paperwork ready, but her vaccine records were in Spanish with different names. She couldn\'t start for two months, lost $30,000 in salary, and spent $150 on revaccinations she didn\'t need.',
    impact: 'Lost $30,000 in salary and 2 months of work',
    category: 'Employment',
  },
  {
    name: 'Priya S.',
    location: 'India to Canada',
    quote: 'When I moved to Canada for my master\'s program, my childhood vaccination records from India were handwritten in Hindi. The university health center couldn\'t read them and I had to get revaccinated for MMR, Hepatitis B, and Tdap.',
    impact: 'Forced to repeat 3 vaccinations at $400+',
    category: 'Education',
  },
  {
    name: 'Ahmed K.',
    location: 'Syria to Germany',
    quote: 'As a refugee, I fled with nothing. My medical records were destroyed. In Germany, I had to start my entire vaccination history from scratch because there was no way to verify what I had received as a child.',
    impact: 'Entire vaccination history lost',
    category: 'Refugee',
  },
  {
    name: 'Maria L.',
    location: 'Brazil to Portugal',
    quote: 'My yellow fever vaccination card from Brazil wasn\'t accepted in Portugal because the format was different. I was told I needed to get vaccinated again, even though I had proof.',
    impact: 'Unnecessary revaccination despite having proof',
    category: 'Immigration',
  },
  {
    name: 'Chen W.',
    location: 'China to Australia',
    quote: 'Moving to Sydney for work, my vaccination records from China were all in Mandarin. The immigration medical exam cost me extra time and money to get everything translated and verified.',
    impact: 'Additional $500 in translation and verification fees',
    category: 'Employment',
  },
  {
    name: 'Fatima A.',
    location: 'Nigeria to UK',
    quote: 'I was accepted to a nursing program in London but couldn\'t start on time because my Nigerian vaccination records didn\'t match the UK format. The program nearly revoked my admission.',
    impact: 'Nearly lost university admission',
    category: 'Education',
  },
  {
    name: 'Juan R.',
    location: 'Colombia to Spain',
    quote: 'My employer in Spain needed proof of Hepatitis B vaccination. I had received it in Colombia but the certificate was from a clinic that had closed. I had no way to prove it.',
    impact: 'Unable to prove vaccination, risked job offer',
    category: 'Employment',
  },
  {
    name: 'Yuki T.',
    location: 'Japan to USA',
    quote: 'Japanese vaccination records use completely different names for the same vaccines. My university in the US couldn\'t match them and told me to restart my immunization schedule.',
    impact: 'Had to restart entire immunization schedule',
    category: 'Education',
  },
  {
    name: 'Olga P.',
    location: 'Ukraine to Poland',
    quote: 'After fleeing the war, I had no medical records for my children. Polish doctors had to vaccinate them from the beginning because there was no system to verify their records from Ukraine.',
    impact: 'Children revaccinated from scratch',
    category: 'Refugee',
  },
  {
    name: 'Raj M.',
    location: 'India to UAE',
    quote: 'My employer in Dubai required proof of specific vaccinations. My Indian records were in different units and formats. It took three weeks and multiple visits to get everything converted.',
    impact: '3 weeks of delays and multiple clinic visits',
    category: 'Employment',
  },
  {
    name: 'Sofia V.',
    location: 'Argentina to Italy',
    quote: 'My children\'s vaccination booklets from Argentina were not recognized by the Italian school system. We had to get blood tests to prove immunity, which cost over 600 euros.',
    impact: '600+ euros in unnecessary blood tests',
    category: 'Education',
  },
  {
    name: 'Hassan B.',
    location: 'Iraq to Sweden',
    quote: 'Sweden\'s healthcare system couldn\'t verify my Iraqi vaccination records. I spent months going back and forth between clinics trying to establish my vaccination history.',
    impact: 'Months of bureaucratic delays',
    category: 'Refugee',
  },
  {
    name: 'Lisa K.',
    location: 'South Korea to Canada',
    quote: 'My Korean vaccination records listed vaccine brand names that don\'t exist in Canada. The pharmacist had no idea which Canadian equivalent each one corresponded to.',
    impact: 'Healthcare providers couldn\'t identify vaccines',
    category: 'Immigration',
  },
  {
    name: 'Daniel O.',
    location: 'Ghana to UK',
    quote: 'I needed my yellow fever certificate for a UK visa application. My original from Ghana was faded and partially illegible. The embassy rejected it, delaying my visa by two months.',
    impact: 'Visa delayed by 2 months',
    category: 'Immigration',
  },
  {
    name: 'Mei-Ling C.',
    location: 'Taiwan to USA',
    quote: 'My graduate school required a TB test and proof of MMR. The records from Taiwan used different naming conventions. I had to see three different doctors before one could verify them.',
    impact: 'Visited 3 doctors to verify records',
    category: 'Education',
  },
  {
    name: 'Pavel N.',
    location: 'Russia to Germany',
    quote: 'Russian vaccination records are in a booklet format that German doctors don\'t recognize. My entire family had to get evaluated individually, costing us thousands of euros.',
    impact: 'Thousands of euros in re-evaluation costs',
    category: 'Immigration',
  },
  {
    name: 'Ana M.',
    location: 'Philippines to Saudi Arabia',
    quote: 'As a nurse moving to Saudi Arabia, I needed extensive vaccination proof. My Philippine records were spread across three different clinics. Gathering them took weeks.',
    impact: 'Weeks spent collecting records from multiple clinics',
    category: 'Employment',
  },
  {
    name: 'James O.',
    location: 'Kenya to USA',
    quote: 'My Kenyan vaccination card was a small paper document that had become water-damaged. The US immigration doctor couldn\'t read half of it and I had to get several vaccines redone.',
    impact: 'Water-damaged records led to revaccination',
    category: 'Immigration',
  },
  {
    name: 'Nadia H.',
    location: 'Afghanistan to Turkey',
    quote: 'Fleeing Afghanistan, I had nothing but the clothes on my back. My daughter\'s vaccination records, carefully kept for 8 years, were left behind. We had to start everything over.',
    impact: '8 years of vaccination records lost',
    category: 'Refugee',
  },
  {
    name: 'Carlos D.',
    location: 'Venezuela to Chile',
    quote: 'Venezuelan hospitals had closed and their records were inaccessible. When I arrived in Chile, I couldn\'t prove any of my vaccinations. The cost of revaccination was devastating.',
    impact: 'Entire medical history inaccessible',
    category: 'Refugee',
  },
  {
    name: 'Amara T.',
    location: 'Ethiopia to Norway',
    quote: 'Norwegian schools required proof of all childhood vaccinations for my children. Our Ethiopian records were handwritten and partially in Amharic. The school gave us one month to sort it out.',
    impact: 'One month deadline to verify or restart vaccinations',
    category: 'Education',
  },
  {
    name: 'Min-Jun P.',
    location: 'South Korea to Australia',
    quote: 'My employer required a complete immunization record. Korean records list batch numbers and manufacturers that Australian databases don\'t recognize. HR had no idea how to process them.',
    impact: 'HR unable to process foreign vaccination records',
    category: 'Employment',
  },
];

const categoryColors: Record<string, string> = {
  Employment: '#1051a5',
  Education: '#26844f',
  Refugee: '#c2410c',
  Immigration: '#7c3aed',
};

export function ProgressPage() {
  const [currentStory, setCurrentStory] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredStories = selectedCategory
    ? impactStories.filter((s) => s.category === selectedCategory)
    : impactStories;

  const story = filteredStories[currentStory % filteredStories.length];

  const nextStory = () => setCurrentStory((prev) => (prev + 1) % filteredStories.length);
  const prevStory = () => setCurrentStory((prev) => (prev - 1 + filteredStories.length) % filteredStories.length);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1051a5] via-[#0d4290] to-[#22283a] text-white py-24 lg:py-32">
        <div className="absolute inset-0 opacity-10">
          <Activity className="absolute top-10 right-20 w-48 h-48 rotate-12" />
          <Shield className="absolute bottom-10 left-20 w-40 h-40 -rotate-12" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-white/10 text-white/90 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              Our Progress
            </span>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Validated by <span className="text-[#97bf2d]">Real People</span> & Experts
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              DOZEY is built on extensive research, real-world validation, and recognition from top innovation programs.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-[#fefefe]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#22283a] mb-4">Recognition & Achievements</h2>
            <p className="text-lg text-gray-600">Validated by leading innovation and entrepreneurship programs</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-amber-50 to-yellow-100/80 rounded-2xl p-10 shadow-xl border-2 border-amber-200/60 hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#22283a]">EIR at UC Davis</h3>
                  <p className="text-amber-700 font-medium">Entrepreneur in Residence</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Selected as an Entrepreneur in Residence at UC Davis, receiving mentorship,
                resources, and support to develop DOZEY from concept to product.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-100/80 rounded-2xl p-10 shadow-xl border-2 border-purple-200/60 hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#22283a]">Hult Prize Regionals</h3>
                  <p className="text-purple-700 font-medium">Regional Winner</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Won the Hult Prize Regional Competition, recognized for our innovative approach
                to solving global healthcare record portability challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-blue-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#22283a] mb-4">Research & Validation</h2>
            <p className="text-lg text-gray-600">Numbers that prove the need</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, value: '60+', label: 'Customer Interviews', sublabel: 'Survey responses collected', color: '#1051a5' },
              { icon: Stethoscope, value: '10+', label: 'Healthcare Experts', sublabel: 'Consulted and validated', color: '#26844f' },
              { icon: CheckCircle2, value: '86%', label: 'Validate Problem', sublabel: 'Confirm the pain point', color: '#97bf2d' },
              { icon: Globe, value: '5', label: 'Countries Validated', sublabel: 'Expanding to more', color: '#1051a5' },
            ].map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ backgroundColor: `${metric.color}15` }}>
                    <Icon className="w-8 h-8" style={{ color: metric.color }} />
                  </div>
                  <div className="text-5xl font-bold mb-2" style={{ color: metric.color }}>
                    {metric.value}
                  </div>
                  <div className="text-[#22283a] font-semibold text-lg mb-1">{metric.label}</div>
                  <div className="text-gray-500 text-sm">{metric.sublabel}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-[#fefefe]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-rose-100 text-rose-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              {filteredStories.length} Real Stories
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#22283a] mb-4">
              Impact <span className="text-[#1051a5]">Stories</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Real experiences from people who have faced the challenge of managing health records across borders.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              <button
                onClick={() => { setSelectedCategory(null); setCurrentStory(0); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedCategory
                    ? 'bg-[#1051a5] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Stories ({impactStories.length})
              </button>
              {Object.entries(categoryColors).map(([cat, color]) => {
                const count = impactStories.filter((s) => s.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setCurrentStory(0); }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? 'text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    style={selectedCategory === cat ? { backgroundColor: color } : {}}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="p-3" style={{ backgroundColor: `${categoryColors[story.category]}10` }}>
                <div className="flex items-center justify-between px-6 py-2">
                  <span className="text-sm font-semibold px-3 py-1 rounded-full text-white" style={{ backgroundColor: categoryColors[story.category] }}>
                    {story.category}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    {(currentStory % filteredStories.length) + 1} of {filteredStories.length}
                  </span>
                </div>
              </div>

              <div className="p-10 lg:p-14">
                <Quote className="w-12 h-12 text-[#1051a5]/20 mb-6" />

                <blockquote className="text-xl lg:text-2xl text-[#22283a] leading-relaxed mb-8 italic">
                  "{story.quote}"
                </blockquote>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-gray-100">
                  <div>
                    <div className="font-bold text-[#22283a] text-lg">{story.name}</div>
                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{story.location}</span>
                    </div>
                  </div>
                  <div className="bg-rose-50 border border-rose-200 rounded-xl px-5 py-3">
                    <div className="text-xs text-rose-500 font-medium uppercase tracking-wide mb-0.5">Impact</div>
                    <div className="text-rose-700 font-semibold text-sm">{story.impact}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-10 pb-8">
                <button
                  onClick={prevStory}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#22283a] font-medium transition-all active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>

                <div className="flex gap-1.5">
                  {filteredStories.slice(0, Math.min(filteredStories.length, 10)).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentStory(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        idx === currentStory % filteredStories.length
                          ? 'bg-[#1051a5] w-6'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                  {filteredStories.length > 10 && (
                    <span className="text-xs text-gray-400 ml-1">+{filteredStories.length - 10}</span>
                  )}
                </div>

                <button
                  onClick={nextStory}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1051a5] hover:bg-[#0d4185] text-white font-medium transition-all active:scale-95"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-gradient-to-br from-[#22283a] via-[#1051a5] to-[#0d4290] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="w-16 h-16 text-[#97bf2d] mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">Real-World Validation, Not Hype</h2>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Every feature of DOZEY has been shaped by direct feedback from users who face
            this problem daily and professionals who see its impact on healthcare delivery.
          </p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {['EIR at UC Davis', 'Hult Prize Winner', '5 Countries Validated', '60+ Interviews'].map((badge) => (
              <div key={badge} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-5 py-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#97bf2d]" />
                <span className="font-medium text-sm">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
