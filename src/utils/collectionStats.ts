import type { MonsterProduct, UserCollectionItem } from '../types/monster';
import { monsterProducts } from '../data/monsters';

export interface CollectionSummaryMetrics {
  totalFlavours: number;
  totalCollected: number;
  totalCans: number;
  completionPercentage: number;
  indiaTotal: number;
  indiaCollected: number;
  indiaPercentage: number;
  intlTotal: number;
  intlCollected: number;
  limitedTotal: number;
  limitedCollected: number;
  discontinuedTotal: number;
  discontinuedCollected: number;
  zeroSugarTotal: number;
  zeroSugarCollected: number;
}

export function computeCollectionMetrics(
  collection: Record<string, UserCollectionItem>
): CollectionSummaryMetrics {
  const collectedItems = Object.values(collection).filter(c => c.isCollected);
  const totalFlavours = monsterProducts.length;
  const totalCollected = collectedItems.length;
  const totalCans = collectedItems.reduce((acc, cur) => acc + (cur.quantity || 1), 0);
  const completionPercentage = totalFlavours > 0 ? Math.round((totalCollected / totalFlavours) * 100) : 0;

  const indiaProducts = monsterProducts.filter(p => p.countryAvailability === 'India');
  const indiaCollected = collectedItems.filter(c => {
    const prod = monsterProducts.find(p => p.id === c.productId);
    return prod?.countryAvailability === 'India';
  }).length;
  const indiaPercentage = indiaProducts.length > 0 ? Math.round((indiaCollected / indiaProducts.length) * 100) : 0;

  const intlProducts = monsterProducts.filter(p => p.countryAvailability === 'International');
  const intlCollected = collectedItems.filter(c => {
    const prod = monsterProducts.find(p => p.id === c.productId);
    return prod?.countryAvailability === 'International';
  }).length;

  const limitedProducts = monsterProducts.filter(p => p.limitedEdition);
  const limitedCollected = collectedItems.filter(c => {
    const prod = monsterProducts.find(p => p.id === c.productId);
    return prod?.limitedEdition;
  }).length;

  const discontinuedProducts = monsterProducts.filter(p => p.countryAvailability === 'Discontinued' || p.discontinued);
  const discontinuedCollected = collectedItems.filter(c => {
    const prod = monsterProducts.find(p => p.id === c.productId);
    return prod?.countryAvailability === 'Discontinued' || prod?.discontinued;
  }).length;

  const zeroSugarProducts = monsterProducts.filter(p => p.sugarType === 'Zero Sugar');
  const zeroSugarCollected = collectedItems.filter(c => {
    const prod = monsterProducts.find(p => p.id === c.productId);
    return prod?.sugarType === 'Zero Sugar';
  }).length;

  return {
    totalFlavours,
    totalCollected,
    totalCans,
    completionPercentage,
    indiaTotal: indiaProducts.length,
    indiaCollected,
    indiaPercentage,
    intlTotal: intlProducts.length,
    intlCollected,
    limitedTotal: limitedProducts.length,
    limitedCollected,
    discontinuedTotal: discontinuedProducts.length,
    discontinuedCollected,
    zeroSugarTotal: zeroSugarProducts.length,
    zeroSugarCollected,
  };
}

export interface CategoryStat {
  category: string;
  total: number;
  collected: number;
  percentage: number;
}

export function computeCategoryStats(
  collection: Record<string, UserCollectionItem>
): CategoryStat[] {
  const categories = ['Original', 'Ultra', 'Juice', 'Java', 'Rehab', 'Reserve', 'Special / Limited Edition'];
  const collectedItems = Object.values(collection).filter(c => c.isCollected);

  return categories.map(cat => {
    const total = monsterProducts.filter(p => p.category === cat).length;
    const collected = collectedItems.filter(c => {
      const prod = monsterProducts.find(p => p.id === c.productId);
      return prod?.category === cat;
    }).length;

    return {
      category: cat,
      total,
      collected,
      percentage: total > 0 ? Math.round((collected / total) * 100) : 0,
    };
  });
}

export function getRecentlyCollected(
  collection: Record<string, UserCollectionItem>,
  limit: number = 6
): MonsterProduct[] {
  return monsterProducts
    .filter(p => collection[p.id]?.isCollected)
    .sort((a, b) => {
      const dateA = collection[a.id]?.collectionDate || '';
      const dateB = collection[b.id]?.collectionDate || '';
      return dateB.localeCompare(dateA);
    })
    .slice(0, limit);
}
