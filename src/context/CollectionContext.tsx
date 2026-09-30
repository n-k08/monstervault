import { createContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import type { UserCollectionItem, CanInstanceEntry, Achievement, MonsterProduct } from '../types/monster';
import { monsterProducts } from '../data/monsters';
import { evaluateAchievements } from '../utils/achievementsEvaluator';

interface CollectionContextType {
  collection: Record<string, UserCollectionItem>;
  achievements: Achievement[];
  oledMode: boolean;
  toggleOled: () => void;
  getItem: (productId: string) => UserCollectionItem | undefined;
  markCollected: (productId: string, date?: string, location?: string) => void;
  removeFromCollection: (productId: string) => void;
  addDuplicate: (productId: string, date?: string, location?: string) => void;
  removeDuplicate: (productId: string, entryId: string) => void;
  updateRating: (productId: string, rating: number) => void;
  updateNotes: (productId: string, notes: string) => void;
  updatePersonalImage: (productId: string, imageDataUrl: string | null) => void;
  getCollectedProducts: () => MonsterProduct[];
  getUncollectedProducts: () => MonsterProduct[];
  getTotalCollected: () => number;
  getTotalCans: () => number;
  exportJSON: () => string;
  exportCSV: () => string;
  importJSON: (json: string) => boolean;
  resetCollection: () => void;
  resetImages: () => void;
}

export const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

const STORAGE_KEY = 'monster-vault-collection';
const OLED_KEY = 'monster-vault-oled';

function loadCollection(): Record<string, UserCollectionItem> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {};
}

function saveCollection(col: Record<string, UserCollectionItem>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(col));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
}

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [collection, setCollection] = useState<Record<string, UserCollectionItem>>(loadCollection);
  const [oledMode, setOledMode] = useState(() => localStorage.getItem(OLED_KEY) === 'true');
  const achievements = useMemo(() => evaluateAchievements(collection), [collection]);

  useEffect(() => {
    saveCollection(collection);
  }, [collection]);

  useEffect(() => {
    document.documentElement.classList.toggle('oled-mode', oledMode);
    localStorage.setItem(OLED_KEY, String(oledMode));
  }, [oledMode]);

  const toggleOled = useCallback(() => setOledMode(o => !o), []);

  const getItem = useCallback((productId: string) => collection[productId], [collection]);

  const markCollected = useCallback((productId: string, date?: string, location?: string) => {
    setCollection(prev => {
      const existing = prev[productId];
      if (existing?.isCollected) return prev;
      const entry: CanInstanceEntry = {
        id: generateId(),
        collectedDate: date || new Date().toISOString().split('T')[0],
        location: location || '',
      };
      return {
        ...prev,
        [productId]: {
          productId,
          isCollected: true,
          quantity: 1,
          collectionDate: entry.collectedDate,
          personalRating: null,
          personalNotes: '',
          personalImage: null,
          canEntries: [entry],
        },
      };
    });
  }, []);

  const removeFromCollection = useCallback((productId: string) => {
    setCollection(prev => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }, []);

  const addDuplicate = useCallback((productId: string, date?: string, location?: string) => {
    setCollection(prev => {
      const existing = prev[productId];
      if (!existing) return prev;
      const entry: CanInstanceEntry = {
        id: generateId(),
        collectedDate: date || new Date().toISOString().split('T')[0],
        location: location || '',
      };
      return {
        ...prev,
        [productId]: {
          ...existing,
          quantity: existing.quantity + 1,
          canEntries: [...existing.canEntries, entry],
        },
      };
    });
  }, []);

  const removeDuplicate = useCallback((productId: string, entryId: string) => {
    setCollection(prev => {
      const existing = prev[productId];
      if (!existing) return prev;
      const newEntries = existing.canEntries.filter(e => e.id !== entryId);
      if (newEntries.length === 0) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return {
        ...prev,
        [productId]: {
          ...existing,
          quantity: newEntries.length,
          canEntries: newEntries,
        },
      };
    });
  }, []);

  const updateRating = useCallback((productId: string, rating: number) => {
    setCollection(prev => {
      const existing = prev[productId];
      if (!existing) return prev;
      return { ...prev, [productId]: { ...existing, personalRating: rating } };
    });
  }, []);

  const updateNotes = useCallback((productId: string, notes: string) => {
    setCollection(prev => {
      const existing = prev[productId];
      if (!existing) return prev;
      return { ...prev, [productId]: { ...existing, personalNotes: notes } };
    });
  }, []);

  const updatePersonalImage = useCallback((productId: string, imageDataUrl: string | null) => {
    setCollection(prev => {
      const existing = prev[productId];
      if (!existing) return prev;
      return { ...prev, [productId]: { ...existing, personalImage: imageDataUrl } };
    });
  }, []);

  const getCollectedProducts = useCallback(() => {
    return monsterProducts.filter(p => collection[p.id]?.isCollected);
  }, [collection]);

  const getUncollectedProducts = useCallback(() => {
    return monsterProducts.filter(p => !collection[p.id]?.isCollected);
  }, [collection]);

  const getTotalCollected = useCallback(() => {
    return Object.values(collection).filter(c => c.isCollected).length;
  }, [collection]);

  const getTotalCans = useCallback(() => {
    return Object.values(collection).filter(c => c.isCollected).reduce((s, c) => s + c.quantity, 0);
  }, [collection]);

  const exportJSON = useCallback(() => {
    return JSON.stringify({ version: 1, exportDate: new Date().toISOString(), collection }, null, 2);
  }, [collection]);

  const exportCSV = useCallback(() => {
    const headers = ['Product ID','Name','Category','Collected','Quantity','Date','Rating','Notes','Location'];
    const rows = Object.values(collection)
      .filter(c => c.isCollected)
      .map(c => {
        const prod = monsterProducts.find(p => p.id === c.productId);
        return [
          c.productId,
          `"${prod?.name || ''}"`,
          prod?.category || '',
          'Yes',
          c.quantity,
          c.collectionDate,
          c.personalRating ?? '',
          `"${c.personalNotes.replace(/"/g, '""')}"`,
          `"${c.canEntries.map(e => e.location).filter(Boolean).join('; ')}"`,
        ].join(',');
      });
    return [headers.join(','), ...rows].join('\n');
  }, [collection]);

  const importJSON = useCallback((json: string): boolean => {
    try {
      const data = JSON.parse(json);
      if (data.collection && typeof data.collection === 'object') {
        setCollection(data.collection);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const resetCollection = useCallback(() => {
    setCollection({});
  }, []);

  const resetImages = useCallback(() => {
    setCollection(prev => {
      const next: Record<string, UserCollectionItem> = {};
      for (const [k, v] of Object.entries(prev)) {
        next[k] = { ...v, personalImage: null };
      }
      return next;
    });
  }, []);

  return (
    <CollectionContext.Provider
      value={{
        collection, achievements, oledMode, toggleOled,
        getItem, markCollected, removeFromCollection,
        addDuplicate, removeDuplicate,
        updateRating, updateNotes, updatePersonalImage,
        getCollectedProducts, getUncollectedProducts,
        getTotalCollected, getTotalCans,
        exportJSON, exportCSV, importJSON,
        resetCollection, resetImages,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
}

export { useCollection } from '../hooks/useCollection';
