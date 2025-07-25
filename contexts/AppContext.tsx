import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { GeneratedImage, Theme, User, Currency, ShopPackage, VipPass, UserAd, AdPurchaseOption, UserData, Manifest, ManifestItem, GameManifest } from '../types';
import { CURRENCIES, TASK_CONVERSION_RATES, VIP_PASSES, THEMES, BACKGROUNDS } from '../constants';

type StoreTarget = {
  tab: 'items' | 'currency' | 'vip' | 'tasks',
  subTab: string, // e.g. 'themes', 'backgrounds', 'silver', 'gold'...
}

interface AppContextType {
  theme: Theme;
  setThemeById: (id: string) => void;
  unlockedItems: string[];
  purchaseManifestItem: (item: ManifestItem) => boolean;
  purchaseDefaultItem: (item: ManifestItem) => boolean;
  images: GeneratedImage[];
  setImages: (images: GeneratedImage[]) => void;
  addImage: (image: GeneratedImage) => void;
  addImages: (images: GeneratedImage[]) => void;
  deleteImages: (ids: string[]) => void;
  renameImage: (id: string, newName: string) => void;
  toggleFavorite: (id: string) => void;
  selectedImageIds: Set<string>;
  toggleImageSelection: (id: string) => void;
  selectAllImages: () => void;
  deselectAllImages: () => void;
  setSelectedImageIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  viewerSrc: string | null;
  setViewerSrc: (src: string | null) => void;
  appBackground: string | null;
  setAppBackground: (src: string | null) => void;
  appBlur: number;
  setAppBlur: (blur: number) => void;
  
  // Auth and user state
  user: User | null;
  vipStatus: 'none' | 'silver' | 'gold' | 'star';
  patronStatus?: string;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  loginAsGuest: () => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  
  // Currency and Shop state
  currencies: Currency[];
  currencyMap: Record<string, Currency>;
  purchasePackage: (pkg: ShopPackage | VipPass) => void;
  handleGenerationPayment: (currencyId: string, cost: number) => boolean;
  convertTasks: (targetCurrencyId: 'silver' | 'gold' | 'star', amount: number) => boolean;
  purchasedPackageIds: string[];

  // New integrated store controls
  showStore: boolean;
  setShowStore: (open: boolean) => void;
  storeTarget: StoreTarget | null;
  setStoreTarget: (target: StoreTarget | null) => void;

  // Side Panels State
  isNewsFeedCollapsed: boolean;
  setIsNewsFeedCollapsed: (collapsed: boolean) => void;
  isAdFeedCollapsed: boolean;
  setIsAdFeedCollapsed: (collapsed: boolean) => void;

  // User Ad State
  userAds: UserAd[];
  saveUserAd: (adData: Omit<UserAd, 'id' | 'expiresAt' | 'userId'>, durationDays: number) => void;
  updateUserAd: (adData: UserAd) => void;
  confirmAdPurchase: (option: AdPurchaseOption) => void;
  isAdPurchaseModalOpen: boolean;
  setIsAdPurchaseModalOpen: (open: boolean) => void;
  isAdCreatorModalOpen: boolean;
  setIsAdCreatorModalOpen: (open: boolean) => void;
  selectedAdOption: AdPurchaseOption | null;
  adToEdit: UserAd | null;
  setAdToEdit: (ad: UserAd | null) => void;
  pendingAdSlot: boolean;

  // Manifest
  manifest: Manifest | null;
  
  // Games
  isGamesModalOpen: boolean;
  setIsGamesModalOpen: (open: boolean) => void;
  gamesManifest: GameManifest | null;

  // Trial and Daily Generations
  isTrialExpiredModalOpen: boolean;
  setIsTrialExpiredModalOpen: (open: boolean) => void;
  dailyFreeGenerationsLeft: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const GUEST_DEFAULTS: UserData = {
    currencies: { free: 5, data: 0, gold: 0, silver: 0, star: 0, task: 1000, mythic: 0, epic: 0, rare: 0 },
    unlockedItems: THEMES.filter(t => t.price.currency === 'free').map(t => t.id)
                   .concat(BACKGROUNDS.filter(b => b.price.currency === 'free').map(b => b.id)),
    starterPackPurchased: false,
    purchasedPackageIds: [],
    vipStatus: 'none',
    createdAt: 0,
    pendingAdSlot: false,
    patronStatus: undefined,
    trialStartedAt: null,
    dailyFreeGenerationsUsed: 0,
    lastFreeGenerationReset: Date.now(),
};

const NEW_USER_BONUS_CURRENCIES: Record<string, number> = {
    ...GUEST_DEFAULTS.currencies,
    data: 15000,
    silver: 2,
    gold: 1,
    rare: 2,
    task: 150,
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [images, setImages] = useLocalStorage<GeneratedImage[]>('gallery-images', []);
  const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [viewerSrc, setViewerSrc] = useState<string | null>(null);
  const [appBackground, setAppBackground] = useLocalStorage<string | null>('app-background', '/backgrounds/cyberpunk.jpg');
  const [appBlur, setAppBlur] = useLocalStorage<number>('app-blur', 4);
  
  // Manifest
  const [manifest, setManifest] = useState<Manifest | null>(null);
  
  // Side Panels
  const [isNewsFeedCollapsed, setIsNewsFeedCollapsed] = useLocalStorage('news-feed-collapsed', false);
  const [isAdFeedCollapsed, setIsAdFeedCollapsed] = useLocalStorage('ad-feed-collapsed', false);

  // Auth state
  const [user, setUser] = useLocalStorage<User | null>('user-session', null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Per-user data management
  const [allUsersData, setAllUsersData] = useLocalStorage<Record<string, UserData>>('all-users-data', {});
  
  // Trial Modal State
  const [isTrialExpiredModalOpen, setIsTrialExpiredModalOpen] = useState(false);

  const currentUserData = useMemo(() => {
    if (user) {
        return allUsersData[user.id] || GUEST_DEFAULTS;
    }
    return GUEST_DEFAULTS;
  }, [user, allUsersData]);

  const updateCurrentUserData = useCallback((data: Partial<UserData>) => {
    if(!user) return;
    setAllUsersData(prev => {
        const currentUserDataForUpdate = prev[user.id] || GUEST_DEFAULTS;
        const newUserData = {
            ...currentUserDataForUpdate,
            ...data,
        };
        return { ...prev, [user.id]: newUserData };
    });
  }, [user, setAllUsersData]);

  // Daily reset effect
  useEffect(() => {
    if (!user) return;
    const now = Date.now();
    const lastReset = currentUserData.lastFreeGenerationReset || 0;
    const oneDay = 24 * 60 * 60 * 1000;
    if (now - lastReset > oneDay) {
        updateCurrentUserData({
            dailyFreeGenerationsUsed: 0,
            lastFreeGenerationReset: now,
        });
    }
  }, [user, currentUserData.lastFreeGenerationReset, updateCurrentUserData]);

  const unlockedItems = currentUserData.unlockedItems;
  const purchasedPackageIds = currentUserData.purchasedPackageIds || [];
  const vipStatus = currentUserData.vipStatus;
  const patronStatus = currentUserData.patronStatus;
  const pendingAdSlot = currentUserData.pendingAdSlot;
  const [themeId, setThemeId] = useLocalStorage('app-theme', 'dark');


  // Shop and Currency state
  const [showStore, setShowStore] = useState(false);
  const [storeTarget, setStoreTarget] = useState<StoreTarget | null>(null);
  
  // User Ad state
  const [userAds, setUserAds] = useLocalStorage<UserAd[]>('user-ads-v2', []);
  const [isAdPurchaseModalOpen, setIsAdPurchaseModalOpen] = useState(false);
  const [isAdCreatorModalOpen, setIsAdCreatorModalOpen] = useState(false);
  const [selectedAdOption, setSelectedAdOption] = useState<AdPurchaseOption | null>(null);
  const [adToEdit, setAdToEdit] = useState<UserAd | null>(null);
  
  // Games state
  const [isGamesModalOpen, setIsGamesModalOpen] = useState(false);
  const [gamesManifest, setGamesManifest] = useState<GameManifest | null>(null);

  // Fetch Manifest on load
  useEffect(() => {
    fetch('/manifest.json')
        .then(response => response.json())
        .then(data => setManifest(data))
        .catch(error => console.error("Failed to load manifest.json:", error));
    
    fetch('/games.json')
        .then(response => response.json())
        .then(data => setGamesManifest(data))
        .catch(error => console.error("Failed to load games.json:", error));
  }, []);

  const theme: Theme = useMemo(() => {
    const defaultThemeData: Theme = { id: 'dark', name: 'Dark', description: '', scope: [], price: {currency: 'free'}, colors: { bg: 'bg-[#1a1b26]', main: 'bg-[#24283b]', text: 'text-[#c0caf5]', accent: 'text-[#bb9af7]', accentGlow: 'shadow-[0_0_15px_rgba(187,154,247,0.7)]', border: 'border-[#bb9af7]/50', cardBg: 'bg-[#24283b]/80', inputBg: 'bg-[#1a1b26]/80' } };
    
    const allThemes = [...THEMES, ...(manifest?.themes || [])];
    const t = allThemes.find(t => t.id === themeId);

    if (!t || !t.data) return defaultThemeData;
    return { ...t, colors: t.data };
  }, [themeId, manifest]);
  
  // Check for expired ads on load
  useEffect(() => {
    const now = Date.now();
    const activeAds = userAds.filter(ad => ad.expiresAt >= now);
    if (activeAds.length !== userAds.length) {
        setUserAds(activeAds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmAdPurchase = (option: AdPurchaseOption) => {
    setSelectedAdOption(option);
    updateCurrentUserData({ pendingAdSlot: true });
    setIsAdPurchaseModalOpen(false);
    setIsAdCreatorModalOpen(true);
  };

  const saveUserAd = (adData: Omit<UserAd, 'id' | 'expiresAt' | 'userId'>, durationDays: number) => {
      if(!user) return;
      const expiresAt = Date.now() + durationDays * 24 * 60 * 60 * 1000;
      const newAd: UserAd = { 
          ...adData, 
          id: crypto.randomUUID(),
          userId: user.id,
          expiresAt
        };
      setUserAds(prev => [...prev, newAd]);
      updateCurrentUserData({ pendingAdSlot: false });
  };

  const updateUserAd = (adData: UserAd) => {
    setUserAds(prevAds => prevAds.map(ad => ad.id === adData.id ? adData : ad));
    updateCurrentUserData({ pendingAdSlot: false });
  };

  const isAuthenticated = !!user;

  const currencies: Currency[] = useMemo(() => CURRENCIES.map(c => ({
      ...c,
      amount: currentUserData.currencies[c.id] || 0
  })), [currentUserData.currencies]);

  const currencyMap = useMemo(() => {
    return currencies.reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
    }, {} as Record<string, Currency>);
  }, [currencies]);
  
  const purchasePackage = (pkg: ShopPackage | VipPass) => {
    const newCurrencies = { ...currentUserData.currencies };
    const newUnlockedItems = [...currentUserData.unlockedItems];
    let newVipStatus = vipStatus;
    let newPatronStatus = patronStatus;
    const newPurchasedPackageIds = [...(currentUserData.purchasedPackageIds || [])];

    // It's a VipPass
    if ('monthlyGrants' in pkg) {
        const pass = pkg as VipPass;
        newVipStatus = pass.id;
        // Grant initial bonus
        pass.monthlyGrants.forEach(grant => {
            newCurrencies[grant.currency] = (newCurrencies[grant.currency] || 0) + grant.amount;
        });

    // It's a ShopPackage
    } else {
        const shopPkg = pkg as ShopPackage;
        // Add currencies from bonuses
        shopPkg.bonuses.forEach(bonus => {
            newCurrencies[bonus.id] = (newCurrencies[bonus.id] || 0) + bonus.amount;
        });
        
        // Handle exclusive unlocks
        shopPkg.exclusiveUnlocks?.forEach(unlock => {
            const [type, id] = unlock.split(':');
            if (type === 'bg' && !newUnlockedItems.includes(id)) {
                newUnlockedItems.push(id);
            }
            if (type === 'status') {
                newPatronStatus = id;
            }
            // 'animation' unlock is visual and handled in components, no state change needed here.
        });
        
        // Add package ID to purchased list to prevent re-buying one-time offers
        if (shopPkg.id && !newPurchasedPackageIds.includes(shopPkg.id)) {
             newPurchasedPackageIds.push(shopPkg.id);
        }
    }
    
    updateCurrentUserData({
        currencies: newCurrencies,
        vipStatus: newVipStatus,
        unlockedItems: newUnlockedItems,
        patronStatus: newPatronStatus,
        purchasedPackageIds: newPurchasedPackageIds
    });
  };

  const dailyFreeGenerationsLeft = useMemo(() => {
    if (!user) return 0;
    const trialStart = currentUserData.trialStartedAt;
    const now = Date.now();
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    const isTrialActive = trialStart ? (now - trialStart < threeDays) : false;

    const dailyLimit = (() => {
        if (isTrialActive) return 5;
        switch(vipStatus) {
            case 'silver': return 10;
            case 'gold': return 15;
            case 'star': return 30;
            default: return 0;
        }
    })();
    return Math.max(0, dailyLimit - (currentUserData.dailyFreeGenerationsUsed || 0));
  }, [user, currentUserData, vipStatus]);

  
  const handleGenerationPayment = (currencyId: string, cost: number): boolean => {
    if (currencyId === 'free') {
        if (dailyFreeGenerationsLeft <= 0) {
            // Check if trial just expired
             const trialStart = currentUserData.trialStartedAt;
             const now = Date.now();
             const threeDays = 3 * 24 * 60 * 60 * 1000;
             const trialExpired = trialStart ? (now - trialStart >= threeDays) : true;

             if (vipStatus === 'none' && trialExpired) {
                setIsTrialExpiredModalOpen(true);
             } else {
                alert(`Вы исчерпали свой дневной лимит бесплатных генераций. Возвращайтесь завтра или приобретите VIP для увеличения лимита!`);
             }
            return false;
        }
        
        updateCurrentUserData({ dailyFreeGenerationsUsed: (currentUserData.dailyFreeGenerationsUsed || 0) + 1 });
        return true;
    }

    const currentBalance = currentUserData.currencies[currencyId] || 0;
    if (currentBalance < cost) {
      alert(`Недостаточно ${currencyMap[currencyId]?.name || 'валюты'} для генерации. Пожалуйста, пополните баланс.`);
      return false; // Not enough funds
    }
    const newCurrencies = { 
        ...currentUserData.currencies, 
        [currencyId]: currentUserData.currencies[currencyId] - cost
    };
    updateCurrentUserData({ currencies: newCurrencies });
    return true;
  };

  const convertTasks = (targetCurrencyId: 'silver' | 'gold' | 'star', amount: number): boolean => {
    const conversionRate = TASK_CONVERSION_RATES[targetCurrencyId].tasks;
    const totalTaskCost = amount * conversionRate;
    if (currentUserData.currencies.task < totalTaskCost) {
        alert("Недостаточно жетонов для обмена.");
        return false;
    }
    const newCurrencies = {
        ...currentUserData.currencies,
        task: currentUserData.currencies.task - totalTaskCost,
        [targetCurrencyId]: (currentUserData.currencies[targetCurrencyId] || 0) + amount,
    };
    updateCurrentUserData({ currencies: newCurrencies });
    alert(`Обмен успешен! Вы получили ${amount} ${TASK_CONVERSION_RATES[targetCurrencyId].name}.`);
    return true;
  }
  
  const purchaseItem = (item: ManifestItem): boolean => {
      if (unlockedItems.includes(item.id)) return true;

      const isFree = item.price.currency === 'free';
      if (isFree) {
        const newUnlockedItems = [...unlockedItems, item.id];
        updateCurrentUserData({ unlockedItems: newUnlockedItems });
        // No alert for free items
        return true;
      }
      
      const price = item.price.amount || 0;
      const currencyId = item.price.currency;
      const balance = currencyMap[currencyId]?.amount || 0;

      if (balance < price) {
          alert(`Недостаточно средств. Требуется: ${price} ${currencyMap[currencyId]?.name || ''}`);
          return false;
      }

      const newCurrencies = {...currentUserData.currencies};
      newCurrencies[currencyId] -= price;
      
      const newUnlockedItems = [...unlockedItems, item.id];

      updateCurrentUserData({ currencies: newCurrencies, unlockedItems: newUnlockedItems });
      
      alert(`Предмет "${item.name}" разблокирован!`);
      return true;
  }

  const login = (email: string, pass: string): boolean => {
    if (email && pass) {
        const userId = 'user-' + email.replace(/[@.]/g, '-');
        const isNewUser = !allUsersData[userId];
        
        const newUser: User = {
            id: userId,
            name: email.split('@')[0],
            email: email,
            avatar: `https://api.dicebear.com/8.x/initials/svg?seed=${email.split('@')[0]}`,
            createdAt: allUsersData[userId]?.createdAt || Date.now(),
            vipStatus: allUsersData[userId]?.vipStatus || 'none',
        };
        
        if (isNewUser) {
             setAllUsersData(prev => ({
                ...prev,
                [userId]: {
                    ...GUEST_DEFAULTS,
                    currencies: NEW_USER_BONUS_CURRENCIES,
                    createdAt: newUser.createdAt,
                    trialStartedAt: Date.now(),
                    lastFreeGenerationReset: Date.now(),
                }
             }));
        }
        setUser(newUser);
        return true;
    }
    return false;
  };

  const loginAsGuest = () => {
    const guestId = 'guest-' + Date.now();
    const guestUser: User = {
        id: guestId,
        name: `Гость${Math.floor(1000 + Math.random() * 9000)}`,
        email: 'guest@example.com',
        avatar: `https://api.dicebear.com/8.x/adventurer/svg?seed=${guestId}`,
        createdAt: Date.now(),
        vipStatus: 'none',
    };
    setAllUsersData(prev => ({ ...prev, [guestId]: { ...GUEST_DEFAULTS, createdAt: guestUser.createdAt, trialStartedAt: Date.now(), lastFreeGenerationReset: Date.now() } }));
    setUser(guestUser);
  }

  const logout = () => {
    setUser(null);
    setIsProfileOpen(false);
  };

  useEffect(() => {
    const needsMigration = images.some(img => typeof img.name === 'undefined' || typeof img.width === 'undefined' || typeof img.height === 'undefined');
    if (needsMigration) {
      console.log("Migrating image data...");
      setImages(images.map(img => ({
        ...img,
        name: img.name || '',
        width: img.width || 0,
        height: img.height || 0,
      })));
    }
  }, [images, setImages]);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // This is a list of ALL possible theme classes.
    const allThemeClasses = [...THEMES, ...(manifest?.themes || [])]
        .flatMap(t => t.data ? [t.data.bg, t.data.text] : [])
        .filter(Boolean) as string[];

    // Clean up old theme classes more robustly
    const bgClassesToRemove = allThemeClasses.filter(c => c.startsWith('bg-'));
    const textClassesToRemove = allThemeClasses.filter(c => c.startsWith('text-'));
    
    if (bgClassesToRemove.length > 0) root.classList.remove(...bgClassesToRemove);
    if (textClassesToRemove.length > 0) body.classList.remove(...textClassesToRemove);

    // Add current theme classes
    if (theme.colors.bg) root.classList.add(theme.colors.bg);
    if (theme.colors.text) body.classList.add(theme.colors.text);
  }, [theme, manifest]);

  const setThemeById = (id: string) => {
    const allThemesAndManifest = [...THEMES, ...(manifest?.themes || [])];
    const t = allThemesAndManifest.find(t => t.id === id);
    if (!t) return;

    const isFree = t.price.currency === 'free';
    if (unlockedItems.includes(id) || isFree) {
      if (isFree && !unlockedItems.includes(id)) {
        purchaseItem(t); // Silently unlock and add to user data
      }
      setThemeId(id);
    } else {
      alert("Эта тема не разблокирована. Пожалуйста, приобретите ее сначала.");
    }
  };

  const addImage = (image: GeneratedImage) => {
    setImages([image, ...images]);
  };
  
  const addImages = (newImages: GeneratedImage[]) => {
    setImages([...newImages, ...images]);
  };

  const deleteImages = (ids: string[]) => {
    const idsSet = new Set(ids);
    setImages(images.filter(img => !idsSet.has(img.id)));
    setSelectedImageIds(prev => {
        const newSet = new Set(prev);
        ids.forEach(id => newSet.delete(id));
        return newSet;
    });
  };

  const renameImage = (id: string, newName: string) => {
    setImages(
      images.map(img => (img.id === id ? { ...img, name: newName } : img))
    );
  };

  const toggleFavorite = (id:string) => {
    setImages(
      images.map(img =>
        img.id === id ? { ...img, isFavorite: !img.isFavorite } : img
      )
    );
  };

  const toggleImageSelection = (id: string) => {
    setSelectedImageIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAllImages = () => {
    setSelectedImageIds(new Set(images.map(img => img.id)));
  };

  const deselectAllImages = () => {
    setSelectedImageIds(new Set());
  };

  const value: AppContextType = {
    theme,
    setThemeById,
    unlockedItems,
    purchaseManifestItem: purchaseItem,
    purchaseDefaultItem: purchaseItem,
    images,
    setImages,
    addImage,
    addImages,
    deleteImages,
    renameImage,
    toggleFavorite,
    selectedImageIds,
    toggleImageSelection,
    selectAllImages,
    deselectAllImages,
    setSelectedImageIds,
    isLoading,
    setIsLoading,
    isSettingsOpen,
    setIsSettingsOpen,
    viewerSrc,
    setViewerSrc,
    appBackground,
    setAppBackground,
    appBlur,
    setAppBlur,
    user,
    vipStatus,
    patronStatus,
    isAuthenticated,
    login,
    logout,
    loginAsGuest,
    isProfileOpen,
    setIsProfileOpen,
    currencies,
    currencyMap,
    purchasePackage,
    handleGenerationPayment,
    convertTasks,
    purchasedPackageIds,
    showStore,
    setShowStore,
    storeTarget,
    setStoreTarget,
    isNewsFeedCollapsed,
    setIsNewsFeedCollapsed,
    isAdFeedCollapsed,
    setIsAdFeedCollapsed,
    userAds,
    saveUserAd,
    updateUserAd,
    confirmAdPurchase,
    isAdPurchaseModalOpen,
    setIsAdPurchaseModalOpen,
    isAdCreatorModalOpen,
    setIsAdCreatorModalOpen,
    selectedAdOption,
    adToEdit,
    setAdToEdit,
    pendingAdSlot,
    manifest,
    isGamesModalOpen,
    setIsGamesModalOpen,
    gamesManifest,
    isTrialExpiredModalOpen,
    setIsTrialExpiredModalOpen,
    dailyFreeGenerationsLeft
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
