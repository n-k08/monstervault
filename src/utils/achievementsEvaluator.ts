import type { Achievement, UserCollectionItem } from '../types/monster';
import { monsterProducts } from '../data/monsters';
import { achievementDefinitions } from '../data/achievements';

export function evaluateAchievements(collection: Record<string, UserCollectionItem>): Achievement[] {
  const collected = Object.values(collection).filter(c => c.isCollected);
  const uniqueCount = collected.length;
  const totalCans = collected.reduce((sum, c) => sum + (c.quantity || 1), 0);

  const getCollectedByCategory = (cat: string) => {
    return collected.filter(c => {
      const prod = monsterProducts.find(p => p.id === c.productId);
      return prod?.category === cat;
    }).length;
  };

  const getCollectedBySugar = (st: string) => {
    return collected.filter(c => {
      const prod = monsterProducts.find(p => p.id === c.productId);
      return prod?.sugarType === st;
    }).length;
  };

  const getCollectedByAvailability = (avail: string) => {
    return collected.filter(c => {
      const prod = monsterProducts.find(p => p.id === c.productId);
      return prod?.countryAvailability === avail;
    }).length;
  };

  const indiaProducts = monsterProducts.filter(p => p.countryAvailability === 'India');
  const indiaCollected = getCollectedByAvailability('India');

  const limitedCollected = collected.filter(c => {
    const prod = monsterProducts.find(p => p.id === c.productId);
    return prod?.limitedEdition || prod?.category === 'Special / Limited Edition';
  }).length;

  const discontinuedCollected = collected.filter(c => {
    const prod = monsterProducts.find(p => p.id === c.productId);
    return prod?.discontinued || prod?.countryAvailability === 'Discontinued';
  }).length;

  return achievementDefinitions.map(def => {
    let progress = 0;
    let required = def.requiredCount;

    switch (def.id) {
      case 'first-can':
        progress = Math.min(uniqueCount, 1);
        break;
      case '10-can-club':
        progress = Math.min(totalCans, 10);
        break;
      case 'collector':
        progress = Math.min(uniqueCount, 25);
        break;
      case 'monster-vault':
        progress = Math.min(uniqueCount, 50);
        break;
      case 'ultra-hunter':
        progress = Math.min(getCollectedByCategory('Ultra'), 5);
        break;
      case 'juice-master':
        progress = Math.min(getCollectedByCategory('Juice'), 5);
        break;
      case 'zero-sugar':
        progress = Math.min(getCollectedBySugar('Zero Sugar'), 5);
        break;
      case 'java-fan':
        progress = Math.min(getCollectedByCategory('Java'), 3);
        break;
      case 'limited-hunter':
        progress = Math.min(limitedCollected, 3);
        break;
      case 'history-buff':
        progress = Math.min(discontinuedCollected, 2);
        break;
      case 'india-complete':
        required = indiaProducts.length;
        progress = indiaCollected;
        break;
      case 'completionist':
        required = monsterProducts.length;
        progress = uniqueCount;
        break;
      default:
        break;
    }

    const unlocked = progress >= required && required > 0;

    return {
      ...def,
      requiredCount: required,
      progress,
      unlocked,
      unlockedAt: unlocked ? new Date().toISOString() : undefined,
    };
  });
}
