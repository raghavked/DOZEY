import { useState, useEffect, useRef } from 'react';
import { Clock, DollarSign, FileText, Shield, Users, Syringe, Globe, TrendingUp } from 'lucide-react';

interface PlatformStats {
  totalUsers: number;
  totalDocuments: number;
  totalVaccinations: number;
  totalCountries: number;
  hoursSaved: number;
  dollarsSaved: number;
  revaccinationsAvoided: number;
  translationsAvoided: number;
  timestamp: number;
}

function AnimatedCounter({ target, duration = 2000, prefix = '', suffix = '', decimals = 0 }: {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const [current, setCurrent] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    if (target === 0) { setCurrent(0); return; }

    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = startValue + (target - startValue) * eased;
      setCurrent(value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCurrent(target);
      }
    };

    requestAnimationFrame(animate);
  }, [hasStarted, target, duration]);

  const formatted = decimals > 0
    ? current.toFixed(decimals)
    : Math.round(current).toLocaleString();

  return <span ref={ref}>{prefix}{formatted}{suffix}</span>;
}

function PulsingDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8aab45] opacity-75" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8aab45]" />
    </span>
  );
}

export function SavingsTicker() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/platform-stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-24 lg:py-32 bg-[#fbfbfd]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-[#f5f5f7] rounded-lg w-64 mx-auto" />
            <div className="h-24 bg-[#f5f5f7] rounded-2xl w-full max-w-3xl mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const breakdownItems = [
    {
      icon: FileText,
      label: 'Documents Processed',
      value: stats.totalDocuments,
      detail: `${stats.translationsAvoided} translations automated`,
      color: '#4a7fb5',
    },
    {
      icon: Syringe,
      label: 'Records Digitized',
      value: stats.totalVaccinations,
      detail: `${stats.revaccinationsAvoided} unnecessary revaccinations avoided`,
      color: '#4d9068',
    },
    {
      icon: Users,
      label: 'Users Protected',
      value: stats.totalUsers,
      detail: 'Immigrants, students, and global workers',
      color: '#1d1d1f',
    },
    {
      icon: Globe,
      label: 'Country Histories Tracked',
      value: stats.totalCountries,
      detail: 'Cross-border compliance simplified',
      color: '#4a7fb5',
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-[#fbfbfd]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8aab45]/10 mb-6">
            <PulsingDot />
            <span className="text-xs font-medium text-[#8aab45] uppercase tracking-widest">Live Platform Impact</span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-semibold text-[#1d1d1f] leading-[1.05] tracking-tight mb-3">
            Saving time and money
          </h2>
          <p className="text-base text-[#86868b] max-w-lg mx-auto font-light">
            Every document processed, every record digitized — measured against the traditional process of manual translation, clinic visits, and revaccination.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          <div className="bg-[#f5f5f7] rounded-2xl p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4a7fb5] to-[#4d9068]" />
            <Clock className="w-6 h-6 text-[#4a7fb5] mx-auto mb-4" />
            <div className="text-5xl lg:text-6xl font-semibold text-[#1d1d1f] tracking-tight mb-2">
              <AnimatedCounter target={stats.hoursSaved} decimals={1} suffix="+" />
            </div>
            <div className="text-xs text-[#86868b] font-medium uppercase tracking-widest mb-3">Hours Saved</div>
            <p className="text-sm text-[#86868b] font-light">
              Compared to manual document translation, clinic visits, and re-vaccination appointments
            </p>
          </div>

          <div className="bg-[#f5f5f7] rounded-2xl p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8aab45] to-[#4d9068]" />
            <DollarSign className="w-6 h-6 text-[#8aab45] mx-auto mb-4" />
            <div className="text-5xl lg:text-6xl font-semibold text-[#1d1d1f] tracking-tight mb-2">
              <AnimatedCounter target={stats.dollarsSaved} prefix="$" suffix="+" />
            </div>
            <div className="text-xs text-[#86868b] font-medium uppercase tracking-widest mb-3">Dollars Saved</div>
            <p className="text-sm text-[#86868b] font-light">
              In avoided revaccination costs, translation fees, and lost wages from delays
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-xs text-[#86868b] font-medium uppercase tracking-widest">
              <TrendingUp className="w-3.5 h-3.5" />
              How we calculate savings
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {breakdownItems.map((item) => (
              <div key={item.label} className="bg-white rounded-xl p-5 text-center">
                <item.icon className="w-5 h-5 mx-auto mb-3" style={{ color: item.color }} />
                <div className="text-3xl font-semibold text-[#1d1d1f] tracking-tight mb-1">
                  <AnimatedCounter target={item.value} duration={1500} />
                </div>
                <div className="text-[10px] text-[#86868b] font-medium uppercase tracking-wider mb-2">{item.label}</div>
                <p className="text-[11px] text-[#86868b]/70 font-light leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-[#f5f5f7] rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-[#4a7fb5] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-[#86868b] leading-relaxed">
                  <span className="font-medium text-[#1d1d1f]">How we calculate:</span> Traditional processes average 4.5 hours per document (finding translators, clinic visits, verification), $150 per unnecessary revaccination, and $75 per professional translation. DOZEY automates document processing in under 15 minutes, eliminating most of these costs. Savings grow with every user and document processed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
