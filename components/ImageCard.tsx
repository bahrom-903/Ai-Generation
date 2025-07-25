import React, { useState, useRef, useEffect } from 'react';
import { GeneratedImage } from '../types';
import { useAppContext } from '../contexts/AppContext';
import Icon from './Icon';
import { ICONS } from '../constants';

interface ImageCardProps {
  image: GeneratedImage;
}

const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  const { theme, selectedImageIds, toggleImageSelection, toggleFavorite, deleteImages, renameImage, setViewerSrc } = useAppContext();
  const isSelected = selectedImageIds.has(image.id);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleRename = () => {
    const newName = prompt("Введите новое имя для изображения:", image.name || '');
    if (newName !== null) {
        renameImage(image.id, newName);
    }
    setIsMenuOpen(false);
  }

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(image.prompt);
    alert('Промпт скопирован!');
    setIsMenuOpen(false);
  }

  return (
    <div 
        className="relative group aspect-[3/4] overflow-hidden rounded-lg shadow-lg"
        onDoubleClick={() => setViewerSrc(image.src)}
    >
      <img src={image.src} alt={image.prompt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      
      {/* Overlay with image name, appears on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-white text-xs truncate" title={image.name || image.prompt}>{image.name || image.prompt}</p>
      </div>

      {/* Vertical actions on the left */}
      <div className="absolute top-2 left-2 flex flex-col gap-2">
        {/* Checkbox */}
        <button
            onClick={() => toggleImageSelection(image.id)}
            className={`w-7 h-7 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${isSelected ? `${theme.colors.accent.replace('text-','bg-')} ${theme.colors.border}` : `bg-black/40 hover:bg-black/60 ${theme.colors.border}`}`}
        >
          {isSelected && <Icon className="w-5 h-5 text-black">{ICONS.check}</Icon>}
        </button>
        {/* Favorite */}
        <button
            onClick={() => toggleFavorite(image.id)}
            className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors duration-200 ${image.isFavorite ? 'text-red-500 bg-red-500/30' : 'text-white bg-black/40 hover:bg-white/20'}`}
            title={image.isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
        >
            <Icon className="w-5 h-5">{ICONS.heart}</Icon>
        </button>
        {/* More Options Menu */}
        <div className="relative">
            <button
                onClick={() => setIsMenuOpen(prev => !prev)}
                className="w-7 h-7 rounded-md flex items-center justify-center text-white bg-black/40 hover:bg-white/20 transition-colors duration-200"
                title="Больше опций"
            >
                <Icon className="w-5 h-5">{ICONS.more}</Icon>
            </button>
            {isMenuOpen && (
                <div ref={menuRef} className={`absolute left-full top-0 ml-2 w-48 rounded-md shadow-lg ${theme.colors.main} ${theme.colors.border} border z-10 animate-fade-in`}>
                    <div className="py-1">
                        <button onClick={handleRename} className={`block w-full text-left px-4 py-2 text-sm ${theme.colors.text} hover:${theme.colors.accent.replace('text-','bg-')} hover:text-black`}>
                            Переименовать
                        </button>
                        <button onClick={handleCopyPrompt} className={`block w-full text-left px-4 py-2 text-sm ${theme.colors.text} hover:${theme.colors.accent.replace('text-','bg-')} hover:text-black`}>
                            Копировать промпт
                        </button>
                        <div className={`my-1 h-px ${theme.colors.border} bg-current opacity-30`}></div>
                        <button onClick={() => deleteImages([image.id])} className={`block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20`}>
                            Удалить
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ImageCard;