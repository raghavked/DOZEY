import { useState, useEffect, useRef } from 'react';
import { Users, CheckCircle2, Globe, Award, GraduationCap, Trophy, ChevronLeft, ChevronRight, Quote, Syringe, Shield, Stethoscope, MapPin } from 'lucide-react';
import { SavingsTicker } from '../components/SavingsTicker';

const impactStories = [
  { name: 'Alfredo C.', location: 'Mexico to USA', quote: 'My new hire from Mexico had all her paperwork ready, but her vaccine records were in Spanish with different names. She couldn\'t start for two months, lost $30,000 in salary, and spent $150 on revaccinations she didn\'t need.', impact: 'Lost $30,000 in salary and 2 months of work', category: 'Employment' },
  { name: 'Priya S.', location: 'India to Canada', quote: 'When I moved to Canada for my master\'s program, my childhood vaccination records from India were handwritten in Hindi. The university health center couldn\'t read them and I had to get revaccinated for MMR, Hepatitis B, and Tdap.', impact: 'Forced to repeat 3 vaccinations at $400+', category: 'Education' },
  { name: 'Ahmed K.', location: 'Syria to Germany', quote: 'As a refugee, I fled with nothing. My medical records were destroyed. In Germany, I had to start my entire vaccination history from scratch because there was no way to verify what I had received as a child.', impact: 'Entire vaccination history lost', category: 'Refugee' },
  { name: 'Maria L.', location: 'Brazil to Portugal', quote: 'My yellow fever vaccination card from Brazil wasn\'t accepted in Portugal because the format was different. I was told I needed to get vaccinated again, even though I had proof.', impact: 'Unnecessary revaccination despite having proof', category: 'Immigration' },
  { name: 'Chen W.', location: 'China to Australia', quote: 'Moving to Sydney for work, my vaccination records from China were all in Mandarin. The immigration medical exam cost me extra time and money to get everything translated and verified.', impact: 'Additional $500 in translation and verification fees', category: 'Employment' },
  { name: 'Fatima A.', location: 'Nigeria to UK', quote: 'I was accepted to a nursing program in London but couldn\'t start on time because my Nigerian vaccination records didn\'t match the UK format. The program nearly revoked my admission.', impact: 'Nearly lost university admission', category: 'Education' },
  { name: 'Juan R.', location: 'Colombia to Spain', quote: 'My employer in Spain needed proof of Hepatitis B vaccination. I had received it in Colombia but the certificate was from a clinic that had closed. I had no way to prove it.', impact: 'Unable to prove vaccination, risked job offer', category: 'Employment' },
  { name: 'Yuki T.', location: 'Japan to USA', quote: 'Japanese vaccination records use completely different names for the same vaccines. My university in the US couldn\'t match them and told me to restart my immunization schedule.', impact: 'Had to restart entire immunization schedule', category: 'Education' },
  { name: 'Olga P.', location: 'Ukraine to Poland', quote: 'After fleeing the war, I had no medical records for my children. Polish doctors had to vaccinate them from the beginning because there was no system to verify their records from Ukraine.', impact: 'Children revaccinated from scratch', category: 'Refugee' },
  { name: 'Raj M.', location: 'India to UAE', quote: 'My employer in Dubai required proof of specific vaccinations. My Indian records were in different units and formats. It took three weeks and multiple visits to get everything converted.', impact: '3 weeks of delays and multiple clinic visits', category: 'Employment' },
  { name: 'Sofia V.', location: 'Argentina to Italy', quote: 'My children\'s vaccination booklets from Argentina were not recognized by the Italian school system. We had to get blood tests to prove immunity, which cost over 600 euros.', impact: '600+ euros in unnecessary blood tests', category: 'Education' },
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
  Employment: '#4a7fb5',
  Education: '#4d9068',
  Refugee: '#c2410c',
  Immigration: '#7c3aed',
};

function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animated');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    ref.current?.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export function ProgressPage() {
  const [currentStory, setCurrentStory] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const scrollRef = useScrollAnimation();

  const filteredStories = selectedCategory
    ? impactStories.filter((s) => s.category === selectedCategory)
    : impactStories;

  const story = filteredStories[currentStory % filteredStories.length];

  const nextStory = () => setCurrentStory((prev) => (prev + 1) % filteredStories.length);
  const prevStory = () => setCurrentStory((prev) => (prev - 1 + filteredStories.length) % filteredStories.length);

  return (
    <div ref={scrollRef} className="min-h-screen">
      <section className="relative min-h-[70vh] flex items-center bg-gradient-to-b from-[#f5f5f7] to-[#fbfbfd] text-[#1d1d1f] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-[#8aab45]/10 rounded-full blur-[150px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-40 w-full">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[#8aab45] text-xs font-medium uppercase tracking-widest mb-6 animate-fade-in">
              Progress & Validation
            </p>
            <h1 className="animate-fade-in-up text-6xl lg:text-7xl xl:text-8xl font-semibold leading-[1.05] tracking-tight mb-6">
              Validated by <span className="text-[#8aab45]">real people</span>
            </h1>
            <p className="animate-fade-in-up delay-200 text-base text-[#86868b] max-w-lg mx-auto font-light">
              Built on extensive research, real-world validation, and recognition from top innovation programs.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fbfbfd] to-transparent" />
      </section>

      <section className="py-24 lg:py-32 bg-[#fbfbfd]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16 mb-24">
            {[
              { value: '60+', label: 'Customer Interviews', color: '#4a7fb5' },
              { value: '10+', label: 'Healthcare Experts', color: '#4d9068' },
              { value: '86%', label: 'Validate Problem', color: '#1d1d1f' },
              { value: '5', label: 'Countries Validated', color: '#4a7fb5' },
            ].map((stat, i) => (
              <div key={stat.label} className={`animate-on-scroll delay-${(i + 1) * 100} text-center`}>
                <div className="text-6xl lg:text-7xl font-semibold tracking-tight mb-3" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-[#86868b] text-xs font-medium uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="animate-on-scroll grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-[#f5f5f7] rounded-2xl p-8">
              <GraduationCap className="w-6 h-6 text-[#1d1d1f]/40 mb-4" />
              <h3 className="text-base font-semibold text-[#1d1d1f] mb-1">EIR at UC Davis</h3>
              <p className="text-xs text-[#86868b] mb-3">Entrepreneur in Residence</p>
              <p className="text-sm text-[#86868b] leading-relaxed">
                Selected as an Entrepreneur in Residence at UC Davis, receiving mentorship,
                resources, and support to develop DOZEY from concept to product.
              </p>
            </div>

            <div className="bg-[#f5f5f7] rounded-2xl p-8">
              <Trophy className="w-6 h-6 text-[#1d1d1f]/40 mb-4" />
              <h3 className="text-base font-semibold text-[#1d1d1f] mb-1">Hult Prize Regionals</h3>
              <p className="text-xs text-[#86868b] mb-3">Regional Winner</p>
              <p className="text-sm text-[#86868b] leading-relaxed">
                Won the Hult Prize Regional Competition, recognized for our innovative approach
                to solving global healthcare record portability challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SavingsTicker />

      <section className="py-24 lg:py-32 bg-[#f5f5f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="animate-on-scroll">
              <p className="text-[#4a7fb5] text-xs font-medium uppercase tracking-widest mb-4">
                Stories
              </p>
              <h2 className="text-5xl lg:text-6xl font-semibold text-[#1d1d1f] leading-[1.05] tracking-tight mb-3">
                Impact Stories
              </h2>
              <p className="text-base text-[#86868b] max-w-lg mx-auto mb-10 font-light">
                Real experiences from people who have faced the challenge of managing health records across borders.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              <button
                onClick={() => { setSelectedCategory(null); setCurrentStory(0); }}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedCategory
                    ? 'bg-[#4a7fb5] text-white'
                    : 'bg-white text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                All ({impactStories.length})
              </button>
              {Object.entries(categoryColors).map(([cat, color]) => {
                const count = impactStories.filter((s) => s.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setCurrentStory(0); }}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? 'text-white'
                        : 'bg-white text-[#86868b] hover:text-[#1d1d1f]'
                    }`}
                    style={selectedCategory === cat ? { backgroundColor: color } : {}}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="p-10 lg:p-14">
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-xs font-medium px-3 py-1 rounded-full text-white" style={{ backgroundColor: categoryColors[story.category] }}>
                    {story.category}
                  </span>
                  <span className="text-xs text-[#86868b]">
                    {(currentStory % filteredStories.length) + 1} / {filteredStories.length}
                  </span>
                </div>

                <Quote className="w-8 h-8 text-[#1d1d1f]/10 mb-6" />

                <blockquote className="text-lg lg:text-xl text-[#1d1d1f] leading-relaxed mb-10 font-light">
                  "{story.quote}"
                </blockquote>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t border-[#f5f5f7]">
                  <div>
                    <div className="font-semibold text-[#1d1d1f]">{story.name}</div>
                    <div className="flex items-center gap-1.5 text-[#86868b] mt-1">
                      <MapPin className="w-3 h-3" />
                      <span className="text-xs">{story.location}</span>
                    </div>
                  </div>
                  <div className="bg-red-50 rounded-lg px-4 py-2.5">
                    <div className="text-[10px] text-red-400 font-medium uppercase tracking-wide mb-0.5">Impact</div>
                    <div className="text-red-600 font-medium text-xs">{story.impact}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-10 pb-8">
                <button
                  onClick={prevStory}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] font-medium transition-all text-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex gap-1.5">
                  {filteredStories.slice(0, Math.min(filteredStories.length, 8)).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentStory(idx)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        idx === currentStory % filteredStories.length
                          ? 'bg-[#4a7fb5] w-5'
                          : 'bg-[#4a7fb5]/15 hover:bg-[#4a7fb5]/30'
                      }`}
                    />
                  ))}
                  {filteredStories.length > 8 && (
                    <span className="text-xs text-[#86868b] ml-1">+{filteredStories.length - 8}</span>
                  )}
                </div>

                <button
                  onClick={nextStory}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#4a7fb5] hover:bg-[#5a8fc5] text-white font-medium transition-all text-sm"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-[#f5f5f7] text-[#1d1d1f]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-on-scroll">
            <h2 className="text-5xl lg:text-6xl font-semibold mb-6 leading-[1.05] tracking-tight">Real-world validation, not hype</h2>
            <p className="text-[#86868b] text-base mb-10 max-w-xl mx-auto font-light">
              Every feature of DOZEY has been shaped by direct feedback from users who face
              this problem daily.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {['EIR at UC Davis', 'Hult Prize Winner', '5 Countries', '60+ Interviews'].map((badge) => (
                <div key={badge} className="flex items-center gap-2 bg-white rounded-full px-4 py-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8aab45]" />
                  <span className="text-sm text-[#86868b]">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
