import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Calendar, MapPin, Upload, Star, CheckCircle, Sparkles } from 'lucide-react';
import { monsterProducts } from '../../data/monsters';
import { useCollection } from '../../context/CollectionContext';
import MonsterCanVisual from './MonsterCanVisual';
import { compressImage } from '../../hooks/useImageStorage';
import { fireCanCollectedConfetti } from '../../utils/confetti';
import type { MonsterProduct } from '../../types/monster';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  preselectedProduct?: MonsterProduct | null;
}

export default function AddCanModal({ isOpen, onClose, preselectedProduct }: Props) {
  const { markCollected, addDuplicate, updateRating, updateNotes, updatePersonalImage, getItem } = useCollection();

  const [search, setSearch] = useState('');
  const [chosenProduct, setChosenProduct] = useState<MonsterProduct | null>(null);
  const selectedProduct = chosenProduct || preselectedProduct || monsterProducts[0] || null;
  const [collectedDate, setCollectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [notes, setNotes] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return monsterProducts.slice(0, 15);
    const q = search.toLowerCase();
    return monsterProducts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.flavorProfile.toLowerCase().includes(q)
    ).slice(0, 15);
  }, [search]);

  if (!isOpen) return null;

  const currentItem = selectedProduct ? getItem(selectedProduct.id) : undefined;
  const isAlreadyCollected = !!currentItem?.isCollected;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setPreviewImage(compressed);
    } catch {
      // fallback
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setIsSubmitting(true);

    try {
      if (isAlreadyCollected) {
        addDuplicate(selectedProduct.id, collectedDate, location);
      } else {
        markCollected(selectedProduct.id, collectedDate, location);
      }

      if (rating > 0) {
        updateRating(selectedProduct.id, rating);
      }

      if (notes.trim()) {
        updateNotes(selectedProduct.id, notes.trim());
      }

      if (previewImage) {
        updatePersonalImage(selectedProduct.id, previewImage);
      }

      fireCanCollectedConfetti();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 shadow-2xl z-10"
          style={{ background: 'var(--bg-card)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30">
                <Sparkles size={18} />
              </div>
              <div>
                <h2 className="text-lg font-black text-white tracking-wide">
                  {isAlreadyCollected ? 'ADD DUPLICATE CAN' : 'LOG CAN TO VAULT'}
                </h2>
                <p className="text-xs text-gray-400">Record a new can in your personal collection</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.06] transition"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Step 1: Select Flavour */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                1. Select Monster Flavour
              </label>

              {/* Search Bar */}
              <div className="relative mb-3">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search can name (e.g. Mango Loco, Ultra White, Pipeline)..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#39FF14]/50"
                />
              </div>

              {/* Horizontal Can selector pills */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {filteredProducts.map(p => {
                  const isSelected = selectedProduct?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setChosenProduct(p)}
                      className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                        isSelected
                          ? 'border-[#39FF14] bg-[#39FF14]/15 text-[#39FF14]'
                          : 'border-white/[0.06] bg-white/[0.02] text-gray-300 hover:border-white/20'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: p.canColor.claw }}
                      />
                      <span className="truncate max-w-[120px]">{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Can Preview Card */}
            {selectedProduct && (
              <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center gap-5">
                <MonsterCanVisual
                  canColor={selectedProduct.canColor}
                  name={selectedProduct.name}
                  size="md"
                  collected={true}
                  personalImage={previewImage}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.08] text-gray-300">
                      {selectedProduct.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        selectedProduct.countryAvailability === 'India'
                          ? 'bg-[#39FF14]/15 text-[#39FF14]'
                          : 'bg-blue-500/15 text-blue-400'
                      }`}
                    >
                      {selectedProduct.countryAvailability}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white truncate">{selectedProduct.name}</h3>
                  <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{selectedProduct.flavorProfile}</p>
                  {isAlreadyCollected && (
                    <p className="text-[11px] text-[#39FF14] font-semibold mt-1 flex items-center gap-1">
                      <CheckCircle size={12} /> Already in vault ({currentItem?.quantity} can{currentItem?.quantity !== 1 ? 's' : ''})
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Date & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Collection Date
                </label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="date"
                    value={collectedDate}
                    onChange={e => setCollectedDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-[#39FF14]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Location / Source
                </label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Mumbai, Import Store, Goa"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#39FF14]/50"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Rating & Tasting Notes */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Flavor Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-gray-600 hover:scale-110 transition"
                      style={{ color: star <= rating ? '#39FF14' : undefined }}
                    >
                      <Star size={16} fill={star <= rating ? '#39FF14' : 'none'} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-gray-300 ml-1.5">{rating}/5</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Tasting Notes & Memories
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="How does it taste? Carbonation level, sweetness, where you found it..."
                  rows={2}
                  className="w-full p-3 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#39FF14]/50 resize-none"
                />
              </div>
            </div>

            {/* Step 4: Optional Photo Upload */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Can Photo (Optional)
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.04] border border-white/[0.08] text-gray-300 hover:text-white hover:border-[#39FF14]/40 transition"
                >
                  <Upload size={14} />
                  {previewImage ? 'Replace Photo' : 'Upload Physical Can Photo'}
                </button>
                {previewImage && (
                  <button
                    type="button"
                    onClick={() => setPreviewImage(null)}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/[0.04] transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedProduct || isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black text-black transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #39FF14, #00E676)' }}
              >
                <CheckCircle size={15} />
                {isAlreadyCollected ? 'ADD DUPLICATE TO VAULT' : 'CONFIRM & SAVE TO VAULT'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
