import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Upload, Trash2, MapPin, Calendar, Edit3, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import type { MonsterProduct } from '../../types/monster';
import { useCollection } from '../../context/CollectionContext';
import MonsterCanVisual from './MonsterCanVisual';
import Badge from '../ui/Badge';
import StarRating from '../ui/StarRating';
import { compressImage } from '../../hooks/useImageStorage';
import { fireCanCollectedConfetti } from '../../utils/confetti';

interface Props {
  product: MonsterProduct | null;
  onClose: () => void;
}

export default function FlavourDetailModal({ product, onClose }: Props) {
  const {
    getItem,
    markCollected,
    removeFromCollection,
    addDuplicate,
    removeDuplicate,
    updateRating,
    updateNotes,
    updatePersonalImage,
  } = useCollection();

  const [editingNotes, setEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');
  const [addingCan, setAddingCan] = useState(false);
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newLocation, setNewLocation] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!product) return null;

  const item = getItem(product.id);
  const isCollected = !!item?.isCollected;

  const handleCollect = () => {
    markCollected(product.id);
    fireCanCollectedConfetti();
  };

  const handleConfirmRemove = () => {
    removeFromCollection(product.id);
    setConfirmDelete(false);
  };

  const handleAddDuplicate = () => {
    addDuplicate(product.id, newDate, newLocation);
    fireCanCollectedConfetti();
    setAddingCan(false);
    setNewDate(new Date().toISOString().split('T')[0]);
    setNewLocation('');
  };

  const handleStartEditNotes = () => {
    setNotesDraft(item?.personalNotes || '');
    setEditingNotes(true);
  };

  const handleSaveNotes = () => {
    updateNotes(product.id, notesDraft);
    setEditingNotes(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      updatePersonalImage(product.id, compressed);
    } catch {
      const reader = new FileReader();
      reader.onload = () => updatePersonalImage(product.id, reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const getBadgeVariant = () => {
    if (product.discontinued) return 'discontinued' as const;
    if (product.limitedEdition) return 'limited' as const;
    if (product.countryAvailability === 'India') return 'india' as const;
    return 'international' as const;
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
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal content */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl border border-white/[0.1] shadow-2xl z-10"
          style={{ background: 'var(--bg-card)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header Banner */}
          <div className="relative p-6 pb-4 border-b border-white/[0.06]">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.06] hover:bg-white/[0.12] text-gray-400 hover:text-white transition"
            >
              <X size={16} />
            </button>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="shrink-0 pt-2">
                <MonsterCanVisual
                  canColor={product.canColor}
                  name={product.name}
                  size="lg"
                  collected={isCollected}
                  personalImage={item?.personalImage}
                />
              </div>

              <div className="flex-1 min-w-0 text-center sm:text-left">
                <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mb-2">
                  <Badge label={product.countryAvailability} variant={getBadgeVariant()} />
                  {product.sugarType === 'Zero Sugar' && (
                    <Badge label="Zero Sugar" variant="zero-sugar" />
                  )}
                  {product.limitedEdition && <Badge label="Limited" variant="limited" />}
                  {isCollected && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/40">
                      <CheckCircle size={10} /> In Vault ({item?.quantity || 1})
                    </span>
                  )}
                </div>

                <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
                  {product.category}
                </p>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mt-0.5">
                  {product.name}
                </h2>
                <p className="text-xs text-gray-400 mt-1">{product.flavorProfile}</p>

                {/* Rating if collected */}
                {isCollected && item && (
                  <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-xs font-semibold text-gray-400">My Rating:</span>
                    <StarRating
                      rating={item.personalRating}
                      onChange={r => updateRating(product.id, r)}
                      size="md"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description & Specs */}
          <div className="px-6 py-4 space-y-3">
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {product.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-gray-500 block">
                  Origin Region
                </span>
                <span className="text-xs font-semibold text-gray-200 mt-0.5 block truncate">
                  {product.region}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-gray-500 block">
                  Year Launched
                </span>
                <span className="text-xs font-semibold text-gray-200 mt-0.5 block">
                  {product.yearIntroduced || 'Classic'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] col-span-2 sm:col-span-1">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-gray-500 block">
                  Availability Status
                </span>
                <span className="text-xs font-semibold text-gray-200 mt-0.5 block truncate">
                  {product.availabilityStatus}
                </span>
              </div>
            </div>

            {product.referenceUrl && (
              <a
                href={product.referenceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#39FF14] hover:underline pt-1"
              >
                Official Product Link <ExternalLink size={12} />
              </a>
            )}
          </div>

          {/* Collection Logging Details (if in Vault) */}
          {isCollected && item && (
            <div className="px-6 py-4 border-t border-white/[0.06] space-y-4">
              {/* Notes */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Tasting Impressions & Notes
                  </span>
                  {!editingNotes && (
                    <button
                      onClick={handleStartEditNotes}
                      className="text-xs text-[#39FF14] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Edit3 size={11} /> Edit Notes
                    </button>
                  )}
                </div>

                {editingNotes ? (
                  <div className="space-y-2">
                    <textarea
                      value={notesDraft}
                      onChange={e => setNotesDraft(e.target.value)}
                      rows={3}
                      className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#39FF14]/50"
                      placeholder="Add personal thoughts, carbonation level, taste impressions..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveNotes}
                        className="px-3 py-1.5 rounded-lg text-xs font-black text-black bg-[#39FF14]"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingNotes(false)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 bg-white/[0.04]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs text-gray-300">
                    {item.personalNotes || (
                      <span className="italic text-gray-500">
                        No tasting notes logged yet. Click edit to record your thoughts.
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Physical Cans List (Duplicates) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Cans in Vault ({item.quantity})
                  </span>
                  <button
                    onClick={() => setAddingCan(true)}
                    className="text-xs text-[#39FF14] hover:underline flex items-center gap-1 font-bold"
                  >
                    <Plus size={12} /> Add Duplicate Can
                  </button>
                </div>

                <div className="space-y-2">
                  {item.canEntries.map((entry, idx) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black bg-[#39FF14]/15 text-[#39FF14]">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 text-xs font-medium text-gray-200">
                            <Calendar size={11} className="text-gray-500" />
                            {new Date(entry.collectedDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                          {entry.location && (
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-0.5">
                              <MapPin size={9} className="text-gray-500" />
                              {entry.location}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => removeDuplicate(product.id, entry.id)}
                        className="p-1 rounded text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition"
                        title="Remove this can copy"
                      >
                        <Minus size={13} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add duplicate can form */}
                <AnimatePresence>
                  {addingCan && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2.5"
                    >
                      <h4 className="text-xs font-bold text-white">Log Additional Can</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="date"
                          value={newDate}
                          onChange={e => setNewDate(e.target.value)}
                          className="px-3 py-1.5 text-xs rounded-lg bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-[#39FF14]/50"
                        />
                        <input
                          type="text"
                          value={newLocation}
                          onChange={e => setNewLocation(e.target.value)}
                          placeholder="Source / City / Store"
                          className="px-3 py-1.5 text-xs rounded-lg bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#39FF14]/50"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddDuplicate}
                          className="px-3 py-1.5 rounded-lg text-xs font-black text-black bg-[#39FF14]"
                        >
                          Confirm Can
                        </button>
                        <button
                          onClick={() => setAddingCan(false)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 bg-white/[0.04]"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Physical Photo Upload */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Physical Can Photo
                  </span>
                  {item.personalImage && (
                    <button
                      onClick={() => updatePersonalImage(product.id, null)}
                      className="text-xs text-red-400 hover:underline flex items-center gap-1"
                    >
                      <Trash2 size={11} /> Remove Photo
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.04] border border-white/[0.08] text-gray-300 hover:text-white hover:border-[#39FF14]/30 transition"
                  >
                    <Upload size={13} />
                    {item.personalImage ? 'Change Photo' : 'Upload Can Photo'}
                  </button>
                  <span className="text-[11px] text-gray-500">
                    Overrides standard graphic with your physical can
                  </span>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          )}

          {/* Delete confirmation alert */}
          {confirmDelete && (
            <div className="mx-6 my-2 p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-red-300">
                <AlertTriangle size={15} className="text-red-400 shrink-0" />
                <span>Remove this flavour and all logged cans from your vault?</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleConfirmRemove}
                  className="px-2.5 py-1 rounded text-xs font-black bg-red-500 text-white"
                >
                  Yes, Remove
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-2.5 py-1 rounded text-xs font-semibold bg-white/[0.08] text-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="p-6 pt-3 border-t border-white/[0.06] flex items-center gap-3">
            {!isCollected ? (
              <button
                onClick={handleCollect}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-black text-black transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-[#39FF14]/20"
                style={{ background: 'linear-gradient(135deg, #39FF14, #00E676)' }}
              >
                <CheckCircle size={16} />
                MARK AS COLLECTED IN VAULT
              </button>
            ) : (
              <div className="w-full flex items-center justify-between gap-3">
                <button
                  onClick={() => setAddingCan(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black text-[#39FF14] bg-[#39FF14]/10 border border-[#39FF14]/30 hover:bg-[#39FF14]/20 transition"
                >
                  <Plus size={14} /> +1 DUPLICATE CAN
                </button>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-red-400/80 hover:text-red-400 bg-red-500/5 hover:bg-red-500/15 border border-red-500/20 transition"
                >
                  REMOVE
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
