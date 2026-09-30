import type { UserCollectionItem } from '../types/monster';
import { monsterProducts } from '../data/monsters';

export interface ExportData {
  version: number;
  appName: string;
  exportDate: string;
  totalItems: number;
  collection: Record<string, UserCollectionItem>;
}

export function generateJSONBackup(collection: Record<string, UserCollectionItem>): string {
  const data: ExportData = {
    version: 1,
    appName: 'Monster Vault India',
    exportDate: new Date().toISOString(),
    totalItems: Object.values(collection).filter(c => c.isCollected).length,
    collection,
  };
  return JSON.stringify(data, null, 2);
}

export function generateCSVExport(collection: Record<string, UserCollectionItem>): string {
  const headers = [
    'Product ID',
    'Flavor Name',
    'Category',
    'Country Availability',
    'Sugar Type',
    'Collected',
    'Quantity',
    'Collected Date',
    'Personal Rating',
    'Personal Notes',
    'Locations',
  ];

  const rows = Object.values(collection)
    .filter(c => c.isCollected)
    .map(c => {
      const prod = monsterProducts.find(p => p.id === c.productId);
      const locations = c.canEntries?.map(e => e.location).filter(Boolean).join('; ') || '';
      return [
        c.productId,
        `"${(prod?.name || '').replace(/"/g, '""')}"`,
        `"${(prod?.category || '').replace(/"/g, '""')}"`,
        `"${(prod?.countryAvailability || '').replace(/"/g, '""')}"`,
        `"${(prod?.sugarType || '').replace(/"/g, '""')}"`,
        'Yes',
        c.quantity || 1,
        c.collectionDate || '',
        c.personalRating ?? '',
        `"${(c.personalNotes || '').replace(/"/g, '""')}"`,
        `"${locations.replace(/"/g, '""')}"`,
      ].join(',');
    });

  return [headers.join(','), ...rows].join('\n');
}

export function validateAndParseBackup(jsonString: string): Record<string, UserCollectionItem> | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') return null;

    // Direct collection object or wrapped object
    const collectionData = parsed.collection || parsed;
    if (typeof collectionData !== 'object' || collectionData === null) return null;

    const validated: Record<string, UserCollectionItem> = {};
    for (const [key, value] of Object.entries(collectionData)) {
      if (value && typeof value === 'object' && 'productId' in value) {
        const item = value as Partial<UserCollectionItem>;
        validated[key] = {
          productId: String(item.productId || key),
          isCollected: Boolean(item.isCollected),
          quantity: typeof item.quantity === 'number' ? item.quantity : 1,
          collectionDate: String(item.collectionDate || new Date().toISOString().split('T')[0]),
          personalRating: typeof item.personalRating === 'number' ? item.personalRating : null,
          personalNotes: String(item.personalNotes || ''),
          personalImage: item.personalImage ? String(item.personalImage) : null,
          canEntries: Array.isArray(item.canEntries) ? item.canEntries : [],
        };
      }
    }
    return validated;
  } catch {
    return null;
  }
}

export function triggerDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
