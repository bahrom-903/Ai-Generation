import { ReactNode } from "react";

export interface GeneratedImage {
  id: string;
  name: string; // User-defined name for the image
  src: string;
  prompt: string;
  style: string;
  isAi: boolean;
  isFavorite: boolean;
  createdAt: number;
  width: number;
  height: number;
}

export interface ArtStyle {
  id: string;
  name:string;
  keywords: string;
}

export interface FineTunedModel {
  id: string;
  name: string;
  description: string;
  keywords: string;
  previewImg: string;
}

// Manifest Types
export interface ManifestPrice {
    currency: string;
    amount?: number;
}

export interface ThemeColors {
  bg: string;
  main: string;
  text: string;
  accent: string;
  accentGlow: string;
  border: string;
  cardBg: string;
  inputBg: string;
}

export interface ManifestItem {
    id: string;
    name: string;
    description?: string;
    scope: string[];
    price: ManifestPrice;
    url?: string; // for backgrounds, icons
    data?: ThemeColors; // for themes
}

export interface Manifest {
    version: number;
    themes: ManifestItem[];
    backgrounds: ManifestItem[];
}

export interface Theme extends Omit<ManifestItem, 'data'> {
  colors: ThemeColors;
}


export interface DimensionPreset {
    w: number;
    h: number;
    group?: 'square' | 'standard';
}


export interface GenerationConfig {
  paymentCurrency: 'free' | 'silver' | 'gold' | 'star';
  numberOfImages: number;
  width: number;
  height: number;
  generationModelId: string;
  isPhotoreal: boolean;
  isAlchemy: boolean;
  guidanceScale: number;
  isTiling: boolean;
  isBlackAndWhite: boolean;
  isAnime: boolean;
  isCartoon: boolean;
  isMedieval: boolean;
  isGames: boolean;
  isPixel: boolean;
  isMatrix: boolean;
  isUFO: boolean;
  isBlood: boolean;
  isSupernatural: boolean;
  isHorror: boolean;
  isNSFW: boolean;
  isFuture: boolean;
  isVintage: boolean;
  isSteampunk: boolean;
  isWatercolor: boolean;
  isAbstract: boolean;
  isNeon: boolean;
  neonStrength: number; // 1-100
  neonTarget: 'background' | 'character' | 'all' | 'frame';
  neonColor: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'indigo' | 'violet' | 'pink' | 'cyan' | 'lime' | 'white' | 'purple' | 'rainbow' | 'teal' | 'gold';
  sourceImage: {
    src: string;
    strength: number; // 0.25, 0.5, 0.75
  } | null;
  fineTunedModelId: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string; // URL to avatar image
  createdAt: number; // Timestamp of account creation
  vipStatus: 'none' | 'silver' | 'gold' | 'star';
}

export interface Currency {
  id:string;
  name: string;
  amount: number;
  icon: React.ReactNode;
  color: string; // a tailwind color class
  plus?: boolean;
  description?: string;
}

// Shop related types
export interface ShopBonus {
    id: string;
    amount: number;
}

export interface ShopPackage {
  id: string;
  name: string;
  price: number;
  currencySymbol: string;
  bonuses: ShopBonus[];
  note: string;
  exclusiveUnlocks?: string[]; // e.g. ['bg:bg_neo_tokyo', 'status:Меценат']
  amount?: number; // For simple packages
}

export interface CurrencyShopData {
  currencyId: string;
  name: string;
  icon: ReactNode;
  packages: ShopPackage[];
}

export interface VipMonthlyGrant {
    currency: string;
    amount: number;
}

export interface VipPass {
    id: 'silver' | 'gold' | 'star';
    name: string;
    price: string;
    priceValue: number;
    icon: ReactNode;
    color: string;
    borderColor: string;
    unlocks: string[];
    monthlyGrants: VipMonthlyGrant[];
    perks: string[];
}


// Feed related types
export interface NewsItem {
    id: number;
    title: string;
    content: string;
    date: string;
    category: string;
}

export interface AdItem {
    id: number;
    title: string;
    content: string;
    imgSrc: string;
    link: string;
    cta: string;
}

// User Ad types
export interface UserAd {
    id: string; // Unique ID for each ad
    userId: string; // ID of the user who created it
    images: [string | null, string | null];
    links: [string, string];
    shortText: string;
    longText: string;
    expiresAt: number; // timestamp
}

export interface AdPurchaseOption {
    id: string;
    durationDays: number;
    price: number;
    name: string;
}

// Per-user data structure
export interface UserData {
    currencies: Record<string, number>;
    unlockedItems: string[];
    starterPackPurchased: boolean; // This can be deprecated if starter pack is just an ID
    purchasedPackageIds: string[]; // To track one-time purchases
    vipStatus: 'none' | 'silver' | 'gold' | 'star';
    createdAt: number;
    pendingAdSlot: boolean;
    patronStatus?: string;
    trialStartedAt: number | null;
    dailyFreeGenerationsUsed: number;
    lastFreeGenerationReset: number;
}

// Unified Checkout Type
export interface PurchaseableItem {
  id: string;
  name: string;
  price: number;
  currencySymbol: string;
  description: string;
  icon?: React.ReactNode;
  color?: string;
  originalItem: any; // The original ShopPackage, VipPass, or AdPurchaseOption
}

// Games Manifest Types
export interface GameItem {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
}

export interface GameManifest {
  version: number;
  games: GameItem[];
}