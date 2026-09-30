import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Flag, Globe, Sparkles, Clock, Zap, Heart, PieChart } from 'lucide-react';
import { useCollection } from '../context/CollectionContext';
import { computeCollectionMetrics, computeCategoryStats } from '../utils/collectionStats';
import CategoryBreakdown from '../components/stats/CategoryBreakdown';
import TimelineChart from '../components/stats/TimelineChart';

export default function Stats() {
  const { collection } = useCollection();

  const metrics = useMemo(() => computeCollectionMetrics(collection), [collection]);
  const categoryStats = useMemo(() => computeCategoryStats(collection), [collection]);

  const timelineEntries = useMemo(() => {
    const timeline: Record<string, number> = {};
    Object.values(collection)
      .filter(c => c.isCollected && c.collectionDate)
      .forEach(c => {
        const d = new Date(c.collectionDate);
        const key = `${d.toLocaleString('en', { month: 'short' })} ${d.getFullYear()}`;
        timeline[key] = (timeline[key] || 0) + (c.quantity || 1);
      });

    return Object.entries(timeline).sort((a, b) => {
      return new Date(a[0]).getTime() - new Date(b[0]).getTime();
    });
  }, [collection]);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
          <BarChart3 size={28} className="text-[#39FF14]" />
          COLLECTION ANALYTICS
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Detailed metrics, flavour distributions, and acquisition history
        </p>
      </motion.div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {[
          {
            label: 'UNIQUE FLAVOURS',
            value: metrics.totalCollected,
            total: metrics.totalFlavours,
            color: '#39FF14',
            icon: Zap,
            bg: 'rgba(57, 255, 20, 0.08)',
          },
          {
            label: 'TOTAL CANS IN VAULT',
            value: metrics.totalCans,
            color: '#60A5FA',
            icon: BarChart3,
            bg: 'rgba(96, 165, 250, 0.08)',
          },
          {
            label: 'INDIA VAULT COMPLETE',
            value: `${metrics.indiaPercentage}%`,
            total: `${metrics.indiaCollected}/${metrics.indiaTotal}`,
            color: '#39FF14',
            icon: Flag,
            bg: 'rgba(57, 255, 20, 0.08)',
          },
          {
            label: 'OVERALL COMPLETION',
            value: `${metrics.completionPercentage}%`,
            color: '#FBBF24',
            icon: PieChart,
            bg: 'rgba(251, 191, 36, 0.08)',
          },
          {
            label: 'INTERNATIONAL CANS',
            value: metrics.intlCollected,
            total: metrics.intlTotal,
            color: '#818CF8',
            icon: Globe,
            bg: 'rgba(129, 140, 248, 0.08)',
          },
          {
            label: 'LIMITED EDITIONS',
            value: metrics.limitedCollected,
            total: metrics.limitedTotal,
            color: '#F472B6',
            icon: Sparkles,
            bg: 'rgba(244, 114, 182, 0.08)',
          },
          {
            label: 'DISCONTINUED CANS',
            value: metrics.discontinuedCollected,
            total: metrics.discontinuedTotal,
            color: '#EF4444',
            icon: Clock,
            bg: 'rgba(239, 68, 68, 0.08)',
          },
          {
            label: 'ZERO SUGAR FLAVOURS',
            value: metrics.zeroSugarCollected,
            total: metrics.zeroSugarTotal,
            color: '#C084FC',
            icon: Heart,
            bg: 'rgba(192, 132, 252, 0.08)',
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="p-4 rounded-2xl border border-white/[0.06] flex flex-col justify-between"
            style={{ background: 'var(--bg-card)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                {s.label}
              </span>
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: s.bg, color: s.color }}
              >
                <s.icon size={14} />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black" style={{ color: s.color }}>
                {s.value}
              </span>
              {s.total !== undefined && (
                <span className="text-xs font-semibold text-gray-500">
                  / {s.total}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Category Breakdown Component */}
      <CategoryBreakdown categoryStats={categoryStats} />

      {/* Timeline Chart Component */}
      <TimelineChart timelineEntries={timelineEntries} />

      {/* Empty State */}
      {metrics.totalCollected === 0 && (
        <div
          className="rounded-2xl p-10 border border-white/[0.06] text-center"
          style={{ background: 'var(--bg-card)' }}
        >
          <BarChart3 size={32} className="mx-auto text-gray-600 mb-2" />
          <h3 className="text-base font-bold text-gray-400">No Statistics Yet</h3>
          <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1">
            As soon as you log cans into your vault, your charts and statistics will automatically
            populate here.
          </p>
        </div>
      )}
    </div>
  );
}
