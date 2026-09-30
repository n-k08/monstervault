import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Search } from 'lucide-react';
import { monsterProducts } from '../data/monsters';
import { useCollection } from '../context/CollectionContext';
import MonsterCard from '../components/collection/MonsterCard';
import FilterBar from '../components/filters/FilterBar';
import SearchInput from '../components/filters/SearchInput';
import type { MonsterProduct, FilterState } from '../types/monster';

interface Props {
  onOpenDetail: (p: MonsterProduct) => void;
  onOpenAddCan?: () => void;
}

const defaultFilters: FilterState = {
  category: 'All',
  availability: 'All',
  collectionStatus: 'All',
  sugarType: 'All',
  searchQuery: '',
  sortBy: 'name-asc',
};

export default function Collection({ onOpenDetail, onOpenAddCan }: Props) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const { getItem } = useCollection();

  const filtered = useMemo(() => {
    let results = [...monsterProducts];

    // Search
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      results = results.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.flavorProfile.toLowerCase().includes(q) ||
          p.region.toLowerCase().includes(q) ||
          p.aliases.some(a => a.toLowerCase().includes(q))
      );
    }

    // Category
    if (filters.category !== 'All') {
      results = results.filter(p => p.category === filters.category);
    }

    // Availability
    if (filters.availability !== 'All') {
      results = results.filter(p => p.countryAvailability === filters.availability);
    }

    // Collection status
    if (filters.collectionStatus === 'Collected') {
      results = results.filter(p => getItem(p.id)?.isCollected);
    } else if (filters.collectionStatus === 'Not Collected') {
      results = results.filter(p => !getItem(p.id)?.isCollected);
    }

    // Sugar
    if (filters.sugarType !== 'All') {
      results = results.filter(p => p.sugarType === filters.sugarType);
    }

    // Sort
    results.sort((a, b) => {
      const itemA = getItem(a.id);
      const itemB = getItem(b.id);
      switch (filters.sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'recent':
          return (itemB?.collectionDate || '').localeCompare(itemA?.collectionDate || '');
        case 'status':
          return (itemB?.isCollected ? 1 : 0) - (itemA?.isCollected ? 1 : 0);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'rating':
          return (itemB?.personalRating || 0) - (itemA?.personalRating || 0);
        default:
          return 0;
      }
    });

    return results;
  }, [filters, getItem]);

  const hasActiveFilters =
    filters.category !== 'All' ||
    filters.availability !== 'All' ||
    filters.collectionStatus !== 'All' ||
    filters.sugarType !== 'All' ||
    filters.searchQuery.trim() !== '';

  const handleResetFilters = () => setFilters(defaultFilters);

  return (
    <div className="space-y-6 pb-10">
      {/* Top Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            COLLECTION CHECKLIST
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Browse and filter through your entire Monster Energy inventory
          </p>
        </div>

        {onOpenAddCan && (
          <button
            onClick={onOpenAddCan}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black text-black transition-all hover:scale-105 shadow-md shadow-[#39FF14]/20"
            style={{ background: 'linear-gradient(135deg, #39FF14, #00E676)' }}
          >
            <Plus size={15} strokeWidth={3} />
            <span>LOG NEW CAN</span>
          </button>
        )}
      </motion.div>

      {/* Search Input */}
      <SearchInput
        value={filters.searchQuery}
        onChange={v => setFilters(f => ({ ...f, searchQuery: v }))}
      />

      {/* Filter Bar */}
      <FilterBar filters={filters} onChange={setFilters} />

      {/* Results Header with Active Filter Tags */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-300">
            {filtered.length} {filtered.length === 1 ? 'flavour' : 'flavours'} found
          </span>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-[#39FF14] hover:underline text-[11px] font-semibold flex items-center gap-1 ml-2"
            >
              <X size={12} /> Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Grid of Cans */}
      {filtered.length === 0 ? (
        <div
          className="rounded-3xl p-16 text-center border border-white/[0.06]"
          style={{ background: 'var(--bg-card)' }}
        >
          <Search size={36} className="mx-auto text-gray-600 mb-3" />
          <h3 className="text-base font-bold text-gray-300">No Monster Flavours Match</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
            Try adjusting your search terms or clearing your category and availability filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white/[0.08] hover:bg-white/[0.12] text-white transition"
          >
            Clear All Filters
          </button>
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
