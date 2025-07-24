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
  name: string;
  keywords: string;
}

export interface FineTunedModel {
  id: string;
  name: string;
  description: string;
  keywords: string;
  previewImg: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    bg: string;
    main: string;
    text: string;
    accent: string;
    accentGlow: string;
    border: string;
    cardBg: string;
    inputBg: string;
  };
}

export interface Background {
  id: string;
  name: string;
}

export interface DimensionPreset {
    w: number;
    h: number;
    group?: 'square' | 'standard';
}


export interface GenerationConfig {
  numberOfImages: number;
  width: number;
  height: number;
  isPhotoreal: boolean;
  isAlchemy: boolean;
  guidanceScale: number;
  isTiling: boolean;
  isBlackAndWhite: boolean;
  isAnime: boolean;
  isCartoon: boolean;
  isMedieval: boolean;
  sourceImage: {
    src: string;
    strength: number; // 0.25, 0.5, 0.75
  } | null;
  fineTunedModelId: string | null;
}

// --- Auth & Credits System Types ---

export type CreditId = 'free' | 'dataCoin' | 'gold' | 'silver' | 'star' | 'task' | 'rare' | 'mythic' | 'epic';

export interface Credit {
  id: CreditId;
  name: string;
  icon: (props: { className?: string; style?: React.CSSProperties }) => React.ReactNode;
  color: string;
  isPurchasable: boolean;
}

export interface CreditPackage {
  id: string;
  creditId: CreditId;
  amount: number;
  price: number; // in RUB
  bonus?: {
    creditId: CreditId;
    amount: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // In a real app, never store plain passwords!
  credits: Record<CreditId, number>;
  vipProgress: number; // 0 to 100
}

export type PaymentMethod = 'card' | 'crypto' | 'steam';

export interface ModalState {
  auth: boolean;
  profile: boolean;
  purchase: CreditPackage | null;
}

export interface AuthContextType {
  users: User[];
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  purchaseCredits: (pkg: CreditPackage) => void;
  
  // Modal controls
  modalState: ModalState;
  showAuthModal: () => void;
  showProfileModal: () => void;
  showPurchaseModal: (pkg: CreditPackage) => void;
  closeModals: () => void;
}

export interface FeedbackData {
    type: 'Bug Report' | 'Idea Suggestion';
    message: string;
}