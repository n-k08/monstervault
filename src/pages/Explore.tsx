import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Compass, Search } from 'lucide-react';
import { monsterProducts } from '../data/monsters';
import MonsterCard from '../components/collection/MonsterCard';
import SearchInput from '../components/filters/SearchInput';
import type { MonsterProduct } from '../types/monster';

interface Props {
  onOpenDetail: (p: MonsterProduct) => void;
}

const categories = [
  'All',
  'Original',
  'Ultra',
  'Juice',
  'Java',
  'Rehab',
  'Reserve',
  'Special / Limited Edition',
];

export default function Explore({ onOpenDetail }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered = useMemo(() => {
    let results = [...monsterProducts];
    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.flavorProfile.toLowerCase().includes(q) ||
          p.aliases.some(a => a.toLowerCase().includes(q))
      );
    }
    if (selectedCategory !== 'All') {
      results = results.filter(p => p.category === selectedCategory);
    }
    return results;
  }, [search, selectedCategory]);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
          <Compass size={28} className="text-[#39FF14]" />
          EXPLORE CATALOGUE
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Discover detailed flavor profiles, can designs, and regional releases
        </p>
      </motion.div>

      {/* Search Input */}
      <SearchInput value={search} onChange={setSearch} />

      {/* Category Pills with Counts */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => {
          const count =
            cat === 'All'
              ? monsterProducts.length
              : monsterProducts.filter(p => p.category === cat).length;
          const isActive = selectedCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#39FF14] text-black shadow-md shadow-[#39FF14]/20'
                  : 'bg-white/[0.04] text-gray-400 border border-white/[0.06] hover:text-white hover:border-white/20'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-black/20 text-black' : 'bg-white/[0.08] text-gray-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="text-xs text-gray-400 font-medium">
        Showing {filtered.length} {filtered.length === 1 ? 'flavour' : 'flavours'}
      </div>

      {/* Card Grid */}
      {filtered.length === 0 ? (
        <div
          className="rounded-3xl p-16 text-center border border-white/[0.06]"
          style={{ background: 'var(--bg-card)' }}
        >
          <Search size={36} className="mx-auto text-gray-600 mb-3" />
          <h3 className="text-sm font-bold text-gray-400">No flavours found</h3>
          <p className="text-xs text-gray-500 mt-1">Try a different search term or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((p, i) => (
            <MonsterCard key={p.id} product={p} onClick={onOpenDetail} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
