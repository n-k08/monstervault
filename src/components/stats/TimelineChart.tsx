import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

interface Props {
  timelineEntries: [string, number][];
}

export default function TimelineChart({ timelineEntries }: Props) {
  if (timelineEntries.length === 0) return null;

  const maxVal = Math.max(...timelineEntries.map(([, count]) => count), 1);

  return (
    <div
      className="rounded-2xl p-5 border border-white/[0.06]"
      style={{ background: 'var(--bg-card)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <Calendar size={16} className="text-[#39FF14]" />
            COLLECTION TIMELINE
          </h2>
          <p className="text-xs text-gray-400">Monthly can acquisitions over time</p>
        </div>
      </div>

      <div className="flex items-end gap-3 h-44 pt-6 px-2 overflow-x-auto pb-2 scrollbar-thin">
        {timelineEntries.map(([month, count], i) => {
          const heightPct = Math.max(12, Math.round((count / maxVal) * 100));
          return (
            <div key={month} className="flex-1 min-w-[50px] flex flex-col items-center gap-2">
              <span className="text-[11px] font-bold text-gray-300">
                {count} {count === 1 ? 'can' : 'cans'}
              </span>
              <div className="w-full flex justify-center items-end h-28">
                <motion.div
                  className="w-8 rounded-t-lg shadow-lg relative group cursor-pointer"
                  style={{
                    background: 'linear-gradient(180deg, #39FF14, #00E676)',
                    boxShadow: '0 0 15px rgba(57,255,20,0.25)',
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: 'easeOut' }}
                >
                  <div className="absolute inset-0 rounded-t-lg bg-white/20 opacity-0 group-hover:opacity-100 transition" />
                </motion.div>
              </div>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider text-center">
                {month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
