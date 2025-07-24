import React, { useState, useMemo, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ART_STYLES, Icons } from '../constants';
import Button from './Button';
import ImageCard from './ImageCard';
import Icon from './Icon';
import { GeneratedImage } from '../types';
import JSZip from 'jszip';

type FilterType = 'all' | 'ai' | 'favorite' | 'uploaded';
type SortType = 'newest' | 'oldest' | 'random';

const Gallery: React.FC = () => {
  const { theme, images, selectedImageIds, deleteImages, selectAllImages, deselectAllImages, setImages, addImage, setAppBackground } = useAppContext();
  const [activeFilter, setActiveFilter] = useState<string>('all_styles');
  const [activeSort, setActiveSort] = useState<SortType>('newest');
  const [userFilter, setUserFilter] = useState<FilterType>('all');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredAndSortedImages = useMemo(() => {
    let filtered: GeneratedImage[] = [...images];

    // Filter by style
    if (activeFilter !== 'all_styles') {
        const styleName = ART_STYLES.find(s => s.id === activeFilter)?.name;
        if(styleName) {
            filtered = filtered.filter(img => img.style === styleName);
        }
    }

    // Filter by user criteria
    if (userFilter === 'ai') {
        filtered = filtered.filter(img => img.isAi);
    } else if (userFilter === 'favorite') {
        filtered = filtered.filter(img => img.isFavorite);
    } else if (userFilter === 'uploaded') {
        filtered = filtered.filter(img => !img.isAi);
    }

    // Sort
    switch (activeSort) {
      case 'oldest':
        filtered.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'random':
        // Sorting is now handled directly on button click to shuffle view without permanent state change
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => b.createdAt - a.createdAt);
        break;
    }

    return filtered;
  }, [images, activeFilter, activeSort, userFilter]);
  
  const handleSort = (sort: SortType) => {
    if (sort === 'random') {
        setImages([...images].sort(() => Math.random() - 0.5));
    }
    setActiveSort(sort);
  };
  
  const handleDownloadSelected = () => {
    selectedImageIds.forEach(id => {
      const image = images.find(img => img.id === id);
      if (image) {
        const link = document.createElement('a');
        link.href = image.src;
        const fileName = (image.name || image.prompt.slice(0, 30) || image.id).replace(/[^a-z0-9]/gi, '_').toLowerCase();
        link.download = `${fileName}.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };

  const handleExportSelected = async () => {
    if (selectedImageIds.size === 0) return;
    const zip = new JSZip();
    alert(`Начинается экспорт ${selectedImageIds.size} изображений...`);

    for(const id of selectedImageIds) {
        const image = images.find(img => img.id === id);
        if (image) {
            const fileName = (image.name || image.id).replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const base64Data = image.src.split(',')[1];
            zip.file(`${fileName}.jpeg`, base64Data, { base64: true });
        }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = `anime_gallery_export_${Date.now()}.zip`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleSetBackground = () => {
    if (selectedImageIds.size !== 1) {
        alert("Пожалуйста, выберите ровно одно изображение для установки фона.");
        return;
    }
    const imageId = selectedImageIds.values().next().value;
    const image = images.find(img => img.id === imageId);
    if (!image) return;

    const isPortraitScreen = window.matchMedia("(orientation: portrait)").matches;
    const isPortraitImage = image.height > image.width;

    if (isPortraitScreen && !isPortraitImage) {
        alert("Для портретного режима экрана рекомендуется выбирать вертикальные изображения, чтобы избежать обрезки.");
        if (!window.confirm("Все равно установить этот фон?")) return;
    }
    if (!isPortraitScreen && isPortraitImage) {
        alert("Для альбомного режима экрана рекомендуется выбирать горизонтальные изображения, чтобы избежать обрезки.");
         if (!window.confirm("Все равно установить этот фон?")) return;
    }

    setAppBackground(image.src);
    alert("Фон установлен!");
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
        const imgSrc = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
            const newImage: GeneratedImage = {
                id: crypto.randomUUID(),
                src: imgSrc,
                prompt: file.name,
                name: file.name,
                style: 'Uploaded',
                isAi: false,
                isFavorite: false,
                createdAt: Date.now(),
                width: img.width,
                height: img.height,
            };
            addImage(newImage);
            setIsUploading(false);
        };
        img.onerror = () => {
            alert("Не удалось загрузить изображение.");
            setIsUploading(false);
        }
        img.src = imgSrc;
    };
    reader.readAsDataURL(file);
    event.target.value = ''; // Reset input
  };

  const FilterButton = ({ id, name }: {id: string, name: string}) => (
    <button
      onClick={() => setActiveFilter(id)}
      className={`px-3 py-1.5 text-sm rounded-md transition-all ${activeFilter === id ? `${theme.colors.accent.replace('text-','bg-')} text-black font-bold` : `${theme.colors.cardBg} ${theme.colors.text} hover:bg-white/20`}`}
    >
      {name}
    </button>
  );

  const mainPanelClasses = `${theme.colors.main.replace('bg-','bg-')}/60 backdrop-blur-sm`;

  return (
    <div className={`p-4 md:p-6 my-4 rounded-lg border-2 ${theme.colors.border} ${mainPanelClasses} shadow-lg`}>
      <h2 className={`text-xl font-bold mb-4 ${theme.colors.accent} text-center`}>Галерея</h2>
      
      {/* Top Filter Bar */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
          <FilterButton id="all_styles" name="Все" />
          {ART_STYLES.filter(s=>s.id !== 'none').map(style => (
              <FilterButton key={style.id} id={style.id} name={style.name} />
          ))}
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap gap-2 mb-4 p-2 rounded-md bg-black/20 justify-center">
        <Button variant="secondary" onClick={selectAllImages}>Выбрать всё</Button>
        <Button variant="secondary" onClick={deselectAllImages}>Снять выбор</Button>
        <Button variant="secondary" onClick={() => setUserFilter('ai')} disabled={userFilter === 'ai'}>Только AI</Button>
        <Button variant="secondary" onClick={() => setUserFilter('favorite')} disabled={userFilter === 'favorite'}>Избранное</Button>
        <Button variant="secondary" onClick={() => setUserFilter('uploaded')} disabled={userFilter === 'uploaded'}>Загруженные</Button>
        <Button variant="secondary" onClick={() => setUserFilter('all')} disabled={userFilter === 'all'}>Сброс</Button>
        <Button variant="secondary" onClick={() => handleSort('newest')} disabled={activeSort === 'newest'}>Сначала новые</Button>
        <Button variant="secondary" onClick={() => handleSort('oldest')} disabled={activeSort === 'oldest'}>Сначала старые</Button>
        <Button variant="secondary" onClick={() => handleSort('random')}>Случайное</Button>
        <Button variant="secondary" onClick={handleUploadClick}><Icon>{Icons.upload}</Icon>Загрузить своё</Button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden"/>
      </div>
      
      {/* Delete/Download Selected Bar */}
      {selectedImageIds.size > 0 && (
          <div className={`flex flex-wrap items-center justify-between p-3 mb-4 rounded-lg bg-black/30 border ${theme.colors.border} gap-2`}>
              <span className={`${theme.colors.text} font-semibold`}>Выбрано: {selectedImageIds.size}</span>
              <div className="flex flex-wrap gap-2">
                <Button variant='secondary' onClick={handleDownloadSelected}><Icon>{Icons.download}</Icon>Скачать</Button>
                <Button variant='secondary' onClick={handleExportSelected}><Icon>{Icons.export}</Icon>Экспорт</Button>
                <Button variant='secondary' onClick={handleSetBackground}><Icon>{Icons.bg}</Icon>Сделать фоном</Button>
                <Button variant='secondary' onClick={() => setAppBackground(null)}>Сбросить фон</Button>
                <Button variant='secondary' onClick={() => deleteImages(Array.from(selectedImageIds))}>
                    <Icon>{Icons.delete}</Icon>Удалить
                </Button>
              </div>
          </div>
      )}

      {/* Image Grid */}
      {isUploading ? (
         <div className="text-center py-16">
            <div className="w-16 h-16 loader-container mx-auto">
                <svg viewBox="0 0 36 36">
                    <path className="loader-circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className={`loader-circle-fg ${theme.colors.accent}`} stroke="currentColor" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
            </div>
            <p className={`mt-4 text-lg ${theme.colors.accent} font-semibold`}>Загрузка...</p>
        </div>
      ) : filteredAndSortedImages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredAndSortedImages.map(image => (
            <ImageCard key={image.id} image={image} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className={`${theme.colors.text} opacity-70`}>Галерея пуста.</p>
          <p className={`${theme.colors.text} opacity-50 text-sm`}>Сгенерируйте что-нибудь, чтобы начать!</p>
        </div>
      )}
    </div>
  );
};

export default Gallery;