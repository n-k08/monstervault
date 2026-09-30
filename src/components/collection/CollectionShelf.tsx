import { motion } from 'framer-motion';
import type { MonsterProduct } from '../../types/monster';
import { useCollection } from '../../context/CollectionContext';
import MonsterCanVisual from './MonsterCanVisual';

interface Props {
  products: MonsterProduct[];
  viewMode: 'grid' | 'compact' | 'shelf';
  onCanClick: (product: MonsterProduct) => void;
}

export default function CollectionShelf({ products, viewMode, onCanClick }: Props) {
  const { getItem } = useCollection();

  if (viewMode === 'compact') {
    return (
      <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.01]">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3 justify-items-center">
          {products.map((p, i) => {
            const item = getItem(p.id);
            const isCollected = !!item?.isCollected;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.015 }}
                whileHover={{ scale: 1.15, y: -6 }}
                onClick={() => onCanClick(p)}
                className="cursor-pointer flex flex-col items-center group"
                title={`${p.name} - ${isCollected ? 'Collected' : 'Not Collected'}`}
              >
                <div className={`transition-all ${isCollected ? 'drop-shadow-md' : 'opacity-60 group-hover:opacity-100'}`}>
                  <MonsterCanVisual
                    canColor={p.canColor}
                    name={p.name}
                    size="sm"
                    collected={isCollected}
                    personalImage={item?.personalImage}
                  />
                </div>
                <span className="text-[9px] text-gray-400 font-medium truncate max-w-[60px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {p.name.replace('Monster Energy', '').trim()}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  if (viewMode === 'shelf') {
    // Group into rows of 7 cans per shelf for balanced widescreen viewing
    const cansPerRow = 7;
    const rows: MonsterProduct[][] = [];
    for (let i = 0; i < products.length; i += cansPerRow) {
      rows.push(products.slice(i, i + cansPerRow));
    }

    return (
      <div className="space-y-8 py-4">
        {rows.map((row, ri) => (
          <div
            key={ri}
            className="relative px-4 pt-6 pb-2 rounded-2xl bg-gradient-to-b from-white/[0.01] to-black/40 border border-white/[0.04]"
          >
            {/* Shelf label / row indicator */}
            <div className="flex justify-between items-center px-4 mb-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              <span>SHELF TIER 0{ri + 1}</span>
              <span>{row.filter(p => getItem(p.id)?.isCollected).length} / {row.length} COLLECTED</span>
            </div>

            {/* Standing cans */}
            <div className="flex justify-around items-end gap-3 sm:gap-6 px-2 min-h-[160px]">
              {row.map((p, ci) => {
                const item = getItem(p.id);
                const isCollected = !!item?.isCollected;
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: (ri * cansPerRow + ci) * 0.025,
                      type: 'spring',
                      damping: 18,
                    }}
                    whileHover={{ y: -12, scale: 1.08 }}
                    onClick={() => onCanClick(p)}
                    className="cursor-pointer flex flex-col items-center group relative"
                  >
                    {/* Can Visual */}
                    <div className={`transition-all duration-300 ${!isCollected ? 'opacity-65 group-hover:opacity-100' : ''}`}>
                      <MonsterCanVisual
                        canColor={p.canColor}
                        name={p.name}
                        size="md"
                        collected={isCollected}
                        personalImage={item?.personalImage}
                      />
                    </div>

                    {/* Can base reflection */}
                    <div className="w-12 h-2.5 rounded-full bg-black/60 blur-[3px] mt-1" />

                    {/* Can name tooltip on hover */}
                    <div className="absolute -bottom-7 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 px-2 py-1 rounded text-[10px] font-bold text-white border border-white/20 whitespace-nowrap z-20 shadow-xl">
                      {p.name}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Realistic Physical Shelf Beam with under-glow */}
            <div className="relative mt-2">
              {/* Top metallic trim line */}
              <div className="h-[3px] w-full rounded-full bg-gradient-to-r from-transparent via-[#39FF14]/50 to-transparent shadow-[0_0_8px_rgba(57,255,20,0.4)]" />
              {/* Shelf wooden/carbon slab */}
              <div
                className="h-4 w-full rounded-b-md shadow-2xl"
                style={{
                  background: 'linear-gradient(180deg, #262b32 0%, #171a1e 40%, #0d0f12 100%)',
                  borderBottom: '2px solid rgba(0,0,0,0.8)',
                }}
              />
              {/* Depth shadow under the shelf */}
              <div className="h-3 w-full bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default: Grid view
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {products.map((p, i) => {
        const item = getItem(p.id);
        const isCollected = !!item?.isCollected;
        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.025 }}
            whileHover={{ y: -6, scale: 1.03 }}
            onClick={() => onCanClick(p)}
            className={`cursor-pointer flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all ${
              isCollected
                ? 'border-[#39FF14]/30 hover:border-[#39FF14]/60 bg-white/[0.03]'
                : 'border-white/[0.05] hover:border-white/20 bg-white/[0.01] opacity-75 hover:opacity-100'
            }`}
            style={{ background: 'var(--bg-card)' }}
          >
            <MonsterCanVisual
              canColor={p.canColor}
              name={p.name}
              size="md"
              collected={isCollected}
              personalImage={item?.personalImage}
            />
            <div className="w-full text-center mt-1">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-500 block mb-0.5">
                {p.category}
              </span>
              <p className="text-xs font-bold text-white truncate">{p.name}</p>
              <p className="text-[10px] text-gray-400 truncate mt-0.5">{p.flavorProfile}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
