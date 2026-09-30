import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flag, CheckCircle, XCircle, Sparkles, Filter } from 'lucide-react';
import { monsterProducts } from '../data/monsters';
import { useCollection } from '../context/CollectionContext';
import MonsterCard from '../components/collection/MonsterCard';
import CircularProgress from '../components/dashboard/CircularProgress';
import { fireMilestoneConfetti } from '../utils/confetti';
import type { MonsterProduct } from '../types/monster';

interface Props {
  onOpenDetail: (p: MonsterProduct) => void;
}

export default function MonsterIndia({ onOpenDetail }: Props) {
  const { getItem } = useCollection();
  const [filterMode, setFilterMode] = useState<'all' | 'collected' | 'missing'>('all');

  const indiaProducts = monsterProducts.filter(p => p.countryAvailability === 'India');
  const collected = indiaProducts.filter(p => getItem(p.id)?.isCollected);
  const missing = indiaProducts.filter(p => !getItem(p.id)?.isCollected);
  const pct = indiaProducts.length > 0 ? Math.round((collected.length / indiaProducts.length) * 100) : 0;

  const displayList = filterMode === 'collected'
    ? collected
    : filterMode === 'missing'
    ? missing
    : indiaProducts;

  return (
    <div className="space-y-8 pb-10">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-white/[0.08]"
        style={{
          background: 'linear-gradient(135deg, rgba(24, 29, 35, 0.95) 0%, rgba(10, 12, 14, 0.98) 100%)',
        }}
      >
        <div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255, 153, 51, 0.15) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/30 text-[#39FF14] text-[11px] font-bold tracking-wider uppercase mb-1">
              <Flag size={12} /> Official Monster India Roster
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              MONSTER ENERGY <span className="text-[#39FF14]">INDIA</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 max-w-lg leading-relaxed">
              Tracking every flavour officially verified on the Monster Energy India catalogue.
              Collect every official Indian release to earn the India Completionist trophy!
            </p>

            {pct === 100 ? (
              <div className="pt-2">
                <button
                  onClick={() => fireMilestoneConfetti()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-black bg-[#39FF14] shadow-lg shadow-[#39FF14]/25 hover:scale-105 transition"
                >
                  <Sparkles size={14} /> INDIA VAULT 100% COMPLETE!
                </button>
              </div>
            ) : null}
          </div>

          <div className="shrink-0 flex flex-col items-center">
            <CircularProgress value={pct} label="INDIA ROSTER" size={150} strokeWidth={9} />
          </div>
        </div>
      </motion.div>

      {/* KPI counters */}
      <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
        <div
          className="rounded-2xl p-4 text-center border border-white/[0.06]"
          style={{ background: 'var(--bg-card)' }}
        >
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block mb-1">
            OFFICIAL TOTAL
          </span>
          <span className="text-2xl font-black text-white">{indiaProducts.length}</span>
        </div>
        <div
          className="rounded-2xl p-4 text-center border border-[#39FF14]/20"
          style={{ background: 'var(--bg-card)' }}
        >
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#39FF14] block mb-1">
            COLLECTED
          </span>
          <span className="text-2xl font-black text-[#39FF14]">{collected.length}</span>
        </div>
        <div
          className="rounded-2xl p-4 text-center border border-red-500/20"
          style={{ background: 'var(--bg-card)' }}
        >
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-400 block mb-1">
            MISSING
          </span>
          <span className="text-2xl font-black text-red-400">{missing.length}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-white/[0.06] pb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              filterMode === 'all'
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All India ({indiaProducts.length})
          </button>
          <button
            onClick={() => setFilterMode('collected')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              filterMode === 'collected'
                ? 'bg-[#39FF14]/15 text-[#39FF14] border border-[#39FF14]/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <CheckCircle size={12} /> Collected ({collected.length})
          </button>
          <button
            onClick={() => setFilterMode('missing')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              filterMode === 'missing'
                ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <XCircle size={12} /> Missing ({missing.length})
          </button>
        </div>

        <span className="text-xs text-gray-500 font-medium">
          Showing {displayList.length} cans
        </span>
      </div>

      {/* Can Grid */}
      {displayList.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center border border-white/[0.06]"
          style={{ background: 'var(--bg-card)' }}
        >
          <Filter size={28} className="mx-auto text-gray-600 mb-2" />
          <h3 className="text-sm font-bold text-gray-400">No cans matching filter</h3>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {displayList.map((p, i) => (
            <MonsterCard key={p.id} product={p} onClick={onOpenDetail} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
