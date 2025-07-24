
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { GeneratedImage, Theme } from '../types';
import { THEMES } from '../constants';

interface AppContextType {
  theme: Theme;
  setThemeById: (id: string) => void;
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const GALLERY_LIMIT = 50; // A reasonable limit to prevent quota errors

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [themeId, setThemeId] = useLocalStorage('app-theme', 'cyberpunk');
  const [images, setImages] = useLocalStorage<GeneratedImage[]>('gallery-images', []);
  const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [viewerSrc, setViewerSrc] = useState<string | null>(null);
  const [appBackground, setAppBackground] = useLocalStorage<string | null>('app-background', null);

  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  
  // Data migration for adding new properties to avoid app crashes
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
    const currentTheme = THEMES.find(t => t.id === themeId) || THEMES[0];
    
    // Remove old theme classes from <html> to prevent conflicts
    THEMES.forEach(t => {
      document.body.classList.remove(...Object.values(t.colors));
      root.classList.remove(t.colors.bg.split(' ')[0]);
    });
    
    // Add new theme class to <html> and body
    root.classList.add(currentTheme.colors.bg.split(' ')[0]);
    document.body.className = `${currentTheme.colors.text}`;

  }, [themeId]);

  const setThemeById = (id: string) => {
    if (THEMES.some(t => t.id === id)) {
      setThemeId(id);
    }
  };

  const addImage = (image: GeneratedImage) => {
    let updatedImages = [image, ...images];
    if (updatedImages.length > GALLERY_LIMIT) {
        alert(`Внимание: Достигнут лимит галереи (${GALLERY_LIMIT} изображений). Самые старые изображения удаляются для освобождения места.`);
        updatedImages = updatedImages.slice(0, GALLERY_LIMIT);
    }
    setImages(updatedImages);
  };
  
  const addImages = (newImages: GeneratedImage[]) => {
    let combinedImages = [...newImages, ...images];
    if (combinedImages.length > GALLERY_LIMIT) {
        alert(`Внимание: Достигнут лимит галереи (${GALLERY_LIMIT} изображений). Самые старые изображения удаляются для освобождения места.`);
        combinedImages = combinedImages.slice(0, GALLERY_LIMIT);
    }
    setImages(combinedImages);
  };

  const deleteImages = (ids: string[]) => {
    const idsSet = new Set(ids);
    setImages(images.filter(img => !idsSet.has(img.id)));
    // Also clear selection for deleted items
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

  const toggleFavorite = (id: string) => {
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

  const value = {
    theme,
    setThemeById,
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