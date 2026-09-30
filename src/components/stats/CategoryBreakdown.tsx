import { motion } from 'framer-motion';
import type { CategoryStat } from '../../utils/collectionStats';

interface Props {
  categoryStats: CategoryStat[];
}

export default function CategoryBreakdown({ categoryStats }: Props) {
  return (
    <div
      className="rounded-2xl p-5 border border-white/[0.06]"
      style={{ background: 'var(--bg-card)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-black text-white">COLLECTION BY LINE</h2>
          <p className="text-xs text-gray-400">Progress across Monster Energy product lines</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {categoryStats.map((c, i) => (
          <div
            key={c.category}
            className="p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.02]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white tracking-wide">{c.category}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-400">
                  {c.collected} / {c.total}
                </span>
                <span className="text-xs font-black text-[#39FF14] min-w-[32px] text-right">
                  {c.percentage}%
                </span>
              </div>
            </div>

            <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    c.percentage === 100
                      ? 'linear-gradient(90deg, #FBBF24, #F59E0B)'
                      : 'linear-gradient(90deg, #39FF14, #00E676)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${c.percentage}%` }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.7, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
