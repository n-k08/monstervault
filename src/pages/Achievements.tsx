import { motion } from 'framer-motion';
import { Trophy, CheckCircle, Lock, Sparkles } from 'lucide-react';
import { useCollection } from '../context/CollectionContext';
import AchievementBadge from '../components/achievements/AchievementBadge';
import { fireMilestoneConfetti } from '../utils/confetti';

export default function Achievements() {
  const { achievements } = useCollection();

  const unlocked = achievements.filter(a => a.unlocked);
  const locked = achievements.filter(a => !a.unlocked);
  const pct = achievements.length > 0 ? Math.round((unlocked.length / achievements.length) * 100) : 0;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Trophy size={28} className="text-[#FBBF24]" />
            COLLECTOR ACHIEVEMENTS
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Unlock badges and milestones as your Monster Vault grows
          </p>
        </div>

        {unlocked.length > 0 && (
          <button
            onClick={() => fireMilestoneConfetti()}
            className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black text-black bg-[#FBBF24] hover:bg-[#f59e0b] transition-all hover:scale-105 shadow-md shadow-[#FBBF24]/20"
          >
            <Sparkles size={14} /> CELEBRATE BADGES
          </button>
        )}
      </motion.div>

      {/* Progress banner */}
      <div
        className="rounded-2xl p-5 border border-white/[0.08]"
        style={{ background: 'var(--bg-card)' }}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-300">Unlocked Milestones</span>
            <span className="text-xs font-black text-[#FBBF24]">
              ({unlocked.length} of {achievements.length})
            </span>
          </div>
          <span className="text-xs font-black text-[#FBBF24]">{pct}% COMPLETE</span>
        </div>
        <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #FBBF24, #F59E0B)' }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Unlocked Badges */}
      {unlocked.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-black text-white tracking-wide uppercase flex items-center gap-2">
            <CheckCircle size={16} className="text-[#39FF14]" />
            Unlocked Trophies ({unlocked.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {unlocked.map((ach, i) => (
              <AchievementBadge key={ach.id} achievement={ach} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Locked Badges */}
      {locked.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-black text-gray-400 tracking-wide uppercase flex items-center gap-2">
            <Lock size={15} />
            In Progress & Locked ({locked.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {locked.map((ach, i) => (
              <AchievementBadge key={ach.id} achievement={ach} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
