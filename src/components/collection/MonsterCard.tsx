import { motion } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
import type { MonsterProduct } from '../../types/monster';
import { useCollection } from '../../context/CollectionContext';
import MonsterCanVisual from './MonsterCanVisual';
import Badge from '../ui/Badge';
import StarRating from '../ui/StarRating';
import { fireCanCollectedConfetti } from '../../utils/confetti';

interface Props {
  product: MonsterProduct;
  onClick: (product: MonsterProduct) => void;
  index?: number;
}

export default function MonsterCard({ product, onClick, index = 0 }: Props) {
  const { getItem, markCollected, removeFromCollection } = useCollection();
  const item = getItem(product.id);
  const isCollected = !!item?.isCollected;

  const getBadgeVariant = () => {
    if (product.discontinued) return 'discontinued' as const;
    if (product.limitedEdition) return 'limited' as const;
    if (product.countryAvailability === 'India') return 'india' as const;
    return 'international' as const;
  };

  const getBadgeLabel = () => {
    if (product.discontinued) return 'Discontinued';
    if (product.limitedEdition) return 'Limited';
    if (product.countryAvailability === 'India') return 'India Official';
    return 'International';
  };

  const handleToggleCollect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCollected) {
      removeFromCollection(product.id);
    } else {
      markCollected(product.id);
      fireCanCollectedConfetti();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(0.3, index * 0.025), duration: 0.3 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={() => onClick(product)}
      className={`relative cursor-pointer rounded-2xl p-4 transition-all duration-200 border flex flex-col justify-between group overflow-hidden ${
        isCollected
          ? 'border-[#39FF14]/30 hover:border-[#39FF14]/60 bg-white/[0.03]'
          : 'border-white/[0.06] hover:border-white/20 bg-white/[0.015]'
      }`}
      style={{ background: 'var(--bg-card)' }}
    >
      {/* Subtle collected ambient glow */}
      {isCollected && (
        <div
          className="absolute -top-12 -right-12 w-28 h-28 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(57,255,20,0.12) 0%, transparent 70%)' }}
        />
      )}

      {/* Top row: Availability Badge + Collect Action */}
      <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
        <Badge label={getBadgeLabel()} variant={getBadgeVariant()} />

        <button
          onClick={handleToggleCollect}
          title={isCollected ? 'Remove from vault' : 'Mark as collected'}
          className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
            isCollected
              ? 'bg-[#39FF14] text-black shadow-md shadow-[#39FF14]/30 scale-105'
              : 'bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.1] border border-white/[0.08]'
          }`}
        >
          {isCollected ? <Check size={14} strokeWidth={3} /> : <Plus size={14} />}
        </button>
      </div>

      {/* Can Visual */}
      <div className="flex justify-center my-2 py-1">
        <MonsterCanVisual
          canColor={product.canColor}
          name={product.name}
          size="md"
          collected={isCollected}
          personalImage={item?.personalImage}
        />
      </div>

      {/* Details */}
      <div className="mt-2 pt-2 border-t border-white/[0.05] relative z-10">
        <div className="flex items-center justify-between text-[9px] font-extrabold uppercase tracking-wider text-gray-500 mb-0.5">
          <span>{product.category}</span>
          {product.sugarType === 'Zero Sugar' && (
            <span className="text-purple-400 font-bold bg-purple-500/10 px-1.5 py-0.2 rounded border border-purple-500/20">
              Zero Sugar
            </span>
          )}
        </div>

        <h3 className="text-xs font-black text-white leading-snug line-clamp-1 group-hover:text-[#39FF14] transition">
          {product.name}
        </h3>
        <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
          {product.flavorProfile}
        </p>

        {/* Collected Metadata Footer */}
        {isCollected && item ? (
          <div className="mt-2.5 pt-2 border-t border-white/[0.05] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-[#39FF14] bg-[#39FF14]/10 px-1.5 py-0.5 rounded border border-[#39FF14]/20">
                x{item.quantity || 1}
              </span>
              {item.collectionDate && (
                <span className="text-[10px] text-gray-400">
                  {new Date(item.collectionDate).toLocaleDateString('en-IN', {
                    month: 'short',
                    year: '2-digit',
                  })}
                </span>
              )}
            </div>
            {item.personalRating ? (
              <StarRating rating={item.personalRating} size="sm" readonly />
            ) : (
              <span className="text-[10px] text-gray-500">In Vault</span>
            )}
          </div>
        ) : (
          <div className="mt-2.5 pt-2 border-t border-white/[0.05] flex items-center justify-between text-[10px] text-gray-500 group-hover:text-gray-400 transition">
            <span>Click to inspect</span>
            <span className="text-[#39FF14] font-semibold opacity-0 group-hover:opacity-100 transition">
              + Log Can
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
