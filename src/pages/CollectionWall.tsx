import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, List, Layers, Zap } from 'lucide-react';
import { monsterProducts } from '../data/monsters';
import { useCollection } from '../context/CollectionContext';
import CollectionShelf from '../components/collection/CollectionShelf';
import type { MonsterProduct } from '../types/monster';

interface Props {
  onOpenDetail: (p: MonsterProduct) => void;
  onOpenAddCan?: () => void;
}

export default function CollectionWall({ onOpenDetail, onOpenAddCan }: Props) {
  const [viewMode, setViewMode] = useState<'grid' | 'compact' | 'shelf'>('shelf');
  const [filterMode, setFilterMode] = useState<'all' | 'collected'>('all');
  const { getItem } = useCollection();

  const products = useMemo(() => {
    if (filterMode === 'collected') {
      return monsterProducts.filter(p => getItem(p.id)?.isCollected);
    }
    return monsterProducts;
  }, [filterMode, getItem]);

  const views = [
    { mode: 'shelf' as const, icon: Layers, label: 'Collector Shelf' },
    { mode: 'grid' as const, icon: LayoutGrid, label: 'Grid Cards' },
    { mode: 'compact' as const, icon: List, label: 'Cabinet View' },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Zap size={28} className="text-[#39FF14]" />
            MONSTER WALL
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Display your physical cans on your personalized collector shelves
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] self-start sm:self-auto">
          {views.map(v => (
            <button
              key={v.mode}
              onClick={() => setViewMode(v.mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === v.mode
                  ? 'bg-[#39FF14] text-black shadow-md shadow-[#39FF14]/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <v.icon size={13} />
              <span>{v.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Filter and stats row */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-white/[0.06] pb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterMode === 'all'
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All Vault Cans ({monsterProducts.length})
          </button>
          <button
            onClick={() => setFilterMode('collected')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterMode === 'collected'
                ? 'bg-[#39FF14]/15 text-[#39FF14] border border-[#39FF14]/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            My Collected Cans ({monsterProducts.filter(p => getItem(p.id)?.isCollected).length})
          </button>
        </div>

        <span className="text-xs text-gray-400 font-medium">
          Displaying {products.length} {viewMode === 'shelf' ? 'cans across tiers' : 'items'}
        </span>
      </div>

      {/* Main Wall View */}
      {products.length === 0 ? (
        <div
          className="rounded-3xl p-12 text-center border border-white/[0.06]"
          style={{ background: 'var(--bg-card)' }}
        >
          <Zap size={36} className="mx-auto text-gray-600 mb-3" />
          <h3 className="text-base font-bold text-gray-300">Your Shelf is Empty</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
            You don't have any collected cans to display on this shelf yet.
          </p>
          {onOpenAddCan && (
            <button
              onClick={onOpenAddCan}
              className="px-4 py-2 rounded-xl text-xs font-black text-black bg-[#39FF14]"
            >
              LOG YOUR FIRST CAN
            </button>
          )}
        </div>
      ) : (
        <CollectionShelf products={products} viewMode={viewMode} onCanClick={onOpenDetail} />
      )}
    </div>
  );
}
