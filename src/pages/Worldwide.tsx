import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Clock } from 'lucide-react';
import { monsterProducts } from '../data/monsters';
import MonsterCard from '../components/collection/MonsterCard';
import type { MonsterProduct } from '../types/monster';

interface Props {
  onOpenDetail: (p: MonsterProduct) => void;
}

export default function Worldwide({ onOpenDetail }: Props) {
  const [filter, setFilter] = useState<'all' | 'international' | 'discontinued'>('all');

  const international = monsterProducts.filter(p => p.countryAvailability === 'International');
  const discontinued = monsterProducts.filter(
    p => p.countryAvailability === 'Discontinued' || p.discontinued
  );

  const displayList = filter === 'international'
    ? international
    : filter === 'discontinued'
    ? discontinued
    : [...international, ...discontinued];

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
          style={{ background: 'radial-gradient(circle, rgba(96, 165, 250, 0.15) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[11px] font-bold tracking-wider uppercase mb-1">
            <Globe size={12} /> Global & Rare Releases
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            WORLDWIDE <span className="text-blue-400">VAULT</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            International releases, Japanese specials, American imports, and historical vaulted cans.
            These flavours are not currently on the official Monster Energy India roster.
          </p>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-white/[0.06] pb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              filter === 'all'
                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All Worldwide ({international.length + discontinued.length})
          </button>
          <button
            onClick={() => setFilter('international')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              filter === 'international'
                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Globe size={12} /> International ({international.length})
          </button>
          <button
            onClick={() => setFilter('discontinued')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              filter === 'discontinued'
                ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Clock size={12} /> Vaulted / Discontinued ({discontinued.length})
          </button>
        </div>

        <span className="text-xs text-gray-500 font-medium">
          Showing {displayList.length} global flavours
        </span>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {displayList.map((p, i) => (
          <MonsterCard key={p.id} product={p} onClick={onOpenDetail} index={i} />
        ))}
      </div>
    </div>
  );
}
