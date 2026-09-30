import { motion } from 'framer-motion';
import { Trophy, Lock, Sparkles } from 'lucide-react';
import type { Achievement } from '../../types/monster';
import { fireMilestoneConfetti } from '../../utils/confetti';

interface Props {
  achievement: Achievement;
  index?: number;
}

export default function AchievementBadge({ achievement, index = 0 }: Props) {
  const isUnlocked = achievement.unlocked;
  const pct = achievement.requiredCount > 0
    ? Math.min(100, Math.round((achievement.progress / achievement.requiredCount) * 100))
    : 0;

  const handleCelebrate = () => {
    if (isUnlocked) {
      fireMilestoneConfetti();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={handleCelebrate}
      className={`relative p-5 rounded-2xl border transition-all duration-300 overflow-hidden ${
        isUnlocked
          ? 'border-[#FBBF24]/30 bg-[#FBBF24]/[0.03] hover:border-[#FBBF24]/60 cursor-pointer shadow-lg hover:shadow-[#FBBF24]/10'
          : 'border-white/[0.04] bg-white/[0.01] opacity-75'
      }`}
      style={{ background: 'var(--bg-card)' }}
    >
      {/* Glow aura if unlocked */}
      {isUnlocked && (
        <div
          className="absolute -top-10 -right-10 w-28 h-28 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)' }}
        />
      )}

      <div className="flex items-start gap-4">
        {/* Badge Icon Container */}
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform ${
            isUnlocked
              ? 'shadow-lg scale-100'
              : 'bg-white/[0.05] text-gray-500'
          }`}
          style={
            isUnlocked
              ? {
                  background: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
                  boxShadow: '0 0 20px rgba(251,191,36,0.3)',
                }
              : undefined
          }
        >
          {isUnlocked ? (
            <Trophy size={22} className="text-black" />
          ) : (
            <Lock size={20} className="text-gray-500" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3
              className={`text-sm font-black tracking-wide truncate ${
                isUnlocked ? 'text-white' : 'text-gray-400'
              }`}
            >
              {achievement.title}
            </h3>
            {isUnlocked && (
              <span className="shrink-0 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#39FF14]/15 text-[#39FF14] border border-[#39FF14]/30">
                <Sparkles size={10} /> Unlocked
              </span>
            )}
          </div>

          <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
            {achievement.description}
          </p>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 mb-1">
              <span>
                {achievement.progress} / {achievement.requiredCount}
              </span>
              <span style={{ color: isUnlocked ? '#39FF14' : undefined }}>{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: isUnlocked
                    ? 'linear-gradient(90deg, #39FF14, #00E676)'
                    : 'linear-gradient(90deg, #6B7280, #9CA3AF)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
