import { motion } from 'framer-motion';
import { Package, Target, TrendingUp, Zap, Flag, Sparkles } from 'lucide-react';
import type { CollectionSummaryMetrics } from '../../utils/collectionStats';

interface Props {
  metrics: CollectionSummaryMetrics;
  onNavigate?: (path: string) => void;
}

export default function QuickStats({ metrics, onNavigate }: Props) {
  const cards = [
    {
      label: 'TOTAL FLAVOURS',
      value: metrics.totalFlavours,
      sub: 'In database',
      icon: Package,
      color: '#9CA3AF',
      bg: 'rgba(156, 163, 175, 0.08)',
      onClick: () => onNavigate?.('/explore'),
    },
    {
      label: 'COLLECTED',
      value: metrics.totalCollected,
      sub: `${metrics.completionPercentage}% of database`,
      icon: Target,
      color: '#39FF14',
      bg: 'rgba(57, 255, 20, 0.08)',
      onClick: () => onNavigate?.('/collection'),
    },
    {
      label: 'TOTAL CANS',
      value: metrics.totalCans,
      sub: 'Including duplicates',
      icon: Zap,
      color: '#60A5FA',
      bg: 'rgba(96, 165, 250, 0.08)',
      onClick: () => onNavigate?.('/wall'),
    },
    {
      label: 'INDIA VAULT',
      value: `${metrics.indiaCollected}/${metrics.indiaTotal}`,
      sub: `${metrics.indiaPercentage}% completed`,
      icon: Flag,
      color: '#39FF14',
      bg: 'rgba(57, 255, 20, 0.08)',
      onClick: () => onNavigate?.('/india'),
    },
    {
      label: 'REMAINING',
      value: metrics.totalFlavours - metrics.totalCollected,
      sub: 'Flavours to find',
      icon: TrendingUp,
      color: '#FBBF24',
      bg: 'rgba(251, 191, 36, 0.08)',
      onClick: () => onNavigate?.('/collection'),
    },
    {
      label: 'LIMITED EDITIONS',
      value: metrics.limitedCollected,
      sub: `Of ${metrics.limitedTotal} limited`,
      icon: Sparkles,
      color: '#A78BFA',
      bg: 'rgba(167, 139, 250, 0.08)',
      onClick: () => onNavigate?.('/worldwide'),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          onClick={c.onClick}
          className="p-4 rounded-2xl border border-white/[0.06] hover:border-white/20 transition-all cursor-pointer group flex flex-col justify-between"
          style={{ background: 'var(--bg-card)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 group-hover:text-gray-200 transition">
              {c.label}
            </span>
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ backgroundColor: c.bg, color: c.color }}
            >
              <c.icon size={14} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight" style={{ color: c.color }}>
              {c.value}
            </div>
            <div className="text-[11px] text-gray-500 font-medium mt-0.5 truncate">
              {c.sub}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
