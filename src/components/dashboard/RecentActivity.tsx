import { motion } from 'framer-motion';
import { Calendar, MapPin, Plus, Sparkles, ChevronRight } from 'lucide-react';
import type { MonsterProduct } from '../../types/monster';
import { useCollection } from '../../context/CollectionContext';
import MonsterCanVisual from '../collection/MonsterCanVisual';
import StarRating from '../ui/StarRating';

interface Props {
  recentProducts: MonsterProduct[];
  onOpenDetail: (p: MonsterProduct) => void;
  onOpenAddCan: () => void;
  onViewAll: () => void;
}

export default function RecentActivity({
  recentProducts,
  onOpenDetail,
  onOpenAddCan,
  onViewAll,
}: Props) {
  const { getItem } = useCollection();

  if (recentProducts.length === 0) {
    return (
      <div
        className="rounded-2xl p-8 border border-white/[0.06] text-center"
        style={{ background: 'var(--bg-card)' }}
      >
        <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20">
          <Sparkles size={20} />
        </div>
        <h3 className="text-base font-bold text-white mb-1">Vault Awaiting First Can</h3>
        <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
          Start recording the Monster cans in your fridge or on your collector shelf.
        </p>
        <button
          onClick={onOpenAddCan}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-black"
          style={{ background: 'linear-gradient(135deg, #39FF14, #00E676)' }}
        >
          <Plus size={14} /> LOG FIRST CAN
        </button>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5 border border-white/[0.06]"
      style={{ background: 'var(--bg-card)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#39FF14]" />
            RECENTLY LOGGED CANS
          </h2>
          <p className="text-xs text-gray-500">Your latest acquisitions and vault entries</p>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-[#39FF14] hover:underline flex items-center gap-1"
        >
          View All <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {recentProducts.map((p, i) => {
          const item = getItem(p.id);
          const firstEntry = item?.canEntries?.[item.canEntries.length - 1];
          const dateStr = item?.collectionDate || firstEntry?.collectedDate;
          const location = firstEntry?.location || (item?.canEntries?.find(e => e.location)?.location);

          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onOpenDetail(p)}
              className="p-3.5 rounded-xl border border-white/[0.04] hover:border-[#39FF14]/30 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer flex items-center gap-3.5 group"
            >
              <div className="shrink-0 group-hover:scale-105 transition-transform">
                <MonsterCanVisual
                  canColor={p.canColor}
                  name={p.name}
                  size="sm"
                  collected={true}
                  personalImage={item?.personalImage}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-500">
                    {p.category}
                  </span>
                  <span className="text-gray-600 text-[10px]">•</span>
                  <span className="text-[10px] font-semibold text-[#39FF14]">
                    x{item?.quantity || 1}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white truncate group-hover:text-[#39FF14] transition">
                  {p.name}
                </h4>

                <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                  {dateStr && (
                    <span className="flex items-center gap-1 truncate">
                      <Calendar size={10} className="text-gray-500" />
                      {new Date(dateStr).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                  {location && (
                    <span className="flex items-center gap-1 truncate text-gray-400">
                      <MapPin size={10} className="text-gray-500 shrink-0" />
                      {location}
                    </span>
                  )}
                </div>

                {item?.personalRating && (
                  <div className="mt-1">
                    <StarRating rating={item.personalRating} size="sm" readonly />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
