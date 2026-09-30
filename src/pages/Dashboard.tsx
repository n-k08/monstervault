import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Target, Compass, Sparkles, ChevronRight, Plus } from 'lucide-react';
import { useCollection } from '../context/CollectionContext';
import CircularProgress from '../components/dashboard/CircularProgress';
import QuickStats from '../components/dashboard/QuickStats';
import RecentActivity from '../components/dashboard/RecentActivity';
import MonsterCanVisual from '../components/collection/MonsterCanVisual';
import { computeCollectionMetrics, getRecentlyCollected } from '../utils/collectionStats';
import type { MonsterProduct } from '../types/monster';

interface Props {
  onNavigate: (path: string) => void;
  onOpenDetail: (p: MonsterProduct) => void;
  onOpenAddCan?: () => void;
}

export default function Dashboard({ onNavigate, onOpenDetail, onOpenAddCan }: Props) {
  const { collection, getUncollectedProducts } = useCollection();

  const metrics = useMemo(() => computeCollectionMetrics(collection), [collection]);
  const recentCollected = useMemo(() => getRecentlyCollected(collection, 6), [collection]);
  const nextToCollect = useMemo(() => getUncollectedProducts().slice(0, 8), [getUncollectedProducts]);

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-white/[0.08]"
        style={{
          background: 'linear-gradient(135deg, rgba(24, 29, 35, 0.9) 0%, rgba(10, 12, 14, 0.95) 100%)',
        }}
      >
        {/* Glow ambient background */}
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(57, 255, 20, 0.15) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/25 text-[#39FF14] text-[11px] font-bold tracking-wider uppercase mb-1">
              <Sparkles size={12} /> Digital Collector's Cabinet
            </div>
            <h1
              className="text-3xl sm:text-5xl font-black tracking-tight"
              style={{
                color: '#FFFFFF',
                textShadow: '0 0 35px rgba(57,255,20,0.3)',
              }}
            >
              MONSTER VAULT <span className="text-[#39FF14]">INDIA</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl leading-relaxed">
              Track, organize, and catalog your Monster Energy can collection. Keep track of official
              India releases, rare international imports, and physical can conditions.
            </p>

            <div className="pt-3 flex flex-wrap items-center justify-center md:justify-start gap-3">
              {onOpenAddCan && (
                <button
                  onClick={onOpenAddCan}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black text-black transition-all hover:scale-105 shadow-md shadow-[#39FF14]/20"
                  style={{ background: 'linear-gradient(135deg, #39FF14, #00E676)' }}
                >
                  <Plus size={15} strokeWidth={3} /> LOG CAN TO VAULT
                </button>
              )}
              <button
                onClick={() => onNavigate('/collection')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition"
              >
                Browse Collection <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Radial progress ring */}
          <div className="shrink-0 flex flex-col items-center">
            <CircularProgress
              value={metrics.completionPercentage}
              label="VAULT COMPLETE"
              size={170}
              strokeWidth={10}
            />
          </div>
        </div>
      </motion.div>

      {/* Quick stats grid */}
      <QuickStats metrics={metrics} onNavigate={onNavigate} />

      {/* Recently Logged Cans */}
      <RecentActivity
        recentProducts={recentCollected}
        onOpenDetail={onOpenDetail}
        onOpenAddCan={onOpenAddCan || (() => onNavigate('/collection'))}
        onViewAll={() => onNavigate('/collection')}
      />

      {/* Next to Collect Rail */}
      {nextToCollect.length > 0 && (
        <div
          className="rounded-2xl p-5 border border-white/[0.06]"
          style={{ background: 'var(--bg-card)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Target size={18} className="text-[#FBBF24]" />
                RECOMMENDED NEXT TO COLLECT
              </h2>
              <p className="text-xs text-gray-400">Popular flavours waiting to join your shelf</p>
            </div>
            <button
              onClick={() => onNavigate('/explore')}
              className="text-xs font-bold text-[#FBBF24] hover:underline flex items-center gap-1"
            >
              Explore Database <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {nextToCollect.map(p => (
              <motion.div
                key={p.id}
                whileHover={{ y: -6, scale: 1.04 }}
                onClick={() => onOpenDetail(p)}
                className="cursor-pointer flex flex-col items-center gap-2 p-3 rounded-2xl border border-white/[0.04] hover:border-[#FBBF24]/30 bg-white/[0.015] hover:bg-white/[0.04] transition group"
              >
                <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                  <MonsterCanVisual canColor={p.canColor} name={p.name} size="sm" />
                </div>
                <div className="text-center w-full mt-0.5">
                  <span className="text-[8px] font-extrabold uppercase tracking-wider text-gray-500 block truncate">
                    {p.category}
                  </span>
                  <p className="text-[11px] font-bold text-gray-300 group-hover:text-white truncate mt-0.5">
                    {p.name.replace('Monster Energy', '').trim()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State Banner if completely 0 cans collected */}
      {metrics.totalCollected === 0 && (
        <div
          className="rounded-3xl p-10 border border-[#39FF14]/20 text-center relative overflow-hidden"
          style={{ background: 'var(--bg-card)' }}
        >
          <div className="max-w-md mx-auto space-y-3">
            <h3 className="text-2xl font-black text-white">READY TO UNLEASH THE BEAST?</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              You haven't logged any cans into your vault yet. Start by browsing the official India
              lineup or search for whatever can you're holding right now!
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('/india')}
                className="px-5 py-2.5 rounded-xl text-xs font-black text-black bg-[#39FF14] hover:bg-[#2ee00e] transition"
              >
                BROWSE INDIA FLAVOURS
              </button>
              <button
                onClick={() => onNavigate('/explore')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-300 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] transition flex items-center gap-1.5"
              >
                <Compass size={14} /> Full Catalogue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
