export type Category = 
  | 'Original' 
  | 'Ultra' 
  | 'Juice' 
  | 'Java' 
  | 'Rehab' 
  | 'Reserve' 
  | 'Special / Limited Edition';

export type CountryAvailability = 
  | 'India' 
  | 'International' 
  | 'Discontinued' 
  | 'Unknown';

export type SugarType = 
  | 'Sugar' 
  | 'Zero Sugar' 
  | 'Unknown';

export interface CanColorConfig {
  main: string;        // Main background hex/gradient (e.g. #000000 or #FFFFFF)
  accent: string;      // Trim/text accent color hex
  claw: string;        // Claw emblem color hex
  topCap?: string;     // Top metallic rim accent
  pattern?: 'smooth' | 'matte' | 'textured' | 'glossy' | 'camo';
}

export interface MonsterProduct {
  id: string;
  name: string;
  brand: string;
  category: Category;
  flavorProfile: string;
  description: string;
  countryAvailability: CountryAvailability;
  availabilityStatus: string;
  canColor: CanColorConfig;
  sugarType: SugarType;
  limitedEdition: boolean;
  discontinued: boolean;
  yearIntroduced: number;
  region: string;
  aliases: string[];
  image?: string;
  referenceUrl?: string;
}

export interface CanInstanceEntry {
  id: string;
  collectedDate: string;
  location: string;
  notes?: string;
  condition?: 'Mint' | 'Slight Scratch' | 'Opened' | 'Full Can';
}

export interface UserCollectionItem {
  productId: string;
  isCollected: boolean;
  quantity: number;
  collectionDate: string;
  personalRating: number | null;
  personalNotes: string;
  personalImage: string | null; // Data URL or object URL
  canEntries: CanInstanceEntry[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'collection' | 'category' | 'special';
  requiredCount: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
}

export type SortOption = 
  | 'name-asc' 
  | 'name-desc' 
  | 'recent' 
  | 'status' 
  | 'category' 
  | 'rating';

export interface FilterState {
  category: string;
  availability: string;
  collectionStatus: string;
  sugarType: string;
  searchQuery: string;
  sortBy: SortOption;
}
