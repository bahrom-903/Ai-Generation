import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ICONS, THEMES, BACKGROUNDS } from '../constants';
import Icon from './Icon';
import { ManifestItem } from '../types';

type Panel = 'main' | 'themes' | 'changelog' | 'backgrounds';

const SettingsModal: React.FC = () => {
  const { theme, isSettingsOpen, setIsSettingsOpen, setImages, setSelectedImageIds } = useAppContext();
  const [activePanel, setActivePanel] = useState<Panel>('main');

  if (!isSettingsOpen) return null;

  const handleClose = () => {
    setIsSettingsOpen(false);
    setActivePanel('main');
  };
  
  const handleClearGallery = () => {
    if (window.confirm('Вы уверены, что хотите полностью очистить галерею? Это действие необратимо.')) {
        setImages([]);
        setSelectedImageIds(new Set());
        handleClose();
    }
  };
  
  const getTitle = () => {
      switch(activePanel) {
          case 'themes': return 'Темы';
          case 'backgrounds': return 'Фоны';
          case 'changelog': return 'Зал Славы и Версии';
          default: return 'Настройки'
      }
  }

  const renderPanel = () => {
    switch (activePanel) {
      case 'themes':
        return <ThemesPanel />;
      case 'backgrounds':
        return <BackgroundsPanel />;
      case 'changelog':
        return <ChangelogPanel />;
      default:
        return (
            <>
                <SettingsButton icon={ICONS.theme} text="Темы" onClick={() => setActivePanel('themes')} />
                <SettingsButton icon={ICONS.bg} text="Фоны" onClick={() => setActivePanel('backgrounds')} />
                <SettingsButton icon={ICONS.trophy} text="Зал Славы и Версии" onClick={() => setActivePanel('changelog')} />
                <SettingsButton icon={ICONS.bug} text="Сообщить о проблеме" onClick={() => alert('Функция в разработке')} />
                <SettingsButton icon={ICONS.idea} text="Предложить идею" onClick={() => alert('Функция в разработке')} />
                <button
                    onClick={handleClearGallery}
                    className={`w-full flex items-center justify-center gap-4 p-4 rounded-lg ${theme.colors.cardBg} hover:bg-red-500/20 text-red-400 border border-transparent hover:border-red-500 transition-all duration-200`}
                >
                    <Icon className="w-6 h-6">{ICONS.delete}</Icon>
                    <span className="text-lg font-semibold">Очистить галерею</span>
                </button>
            </>
        );
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleClose}
    >
      <div
        className={`w-full max-w-4xl rounded-xl border-2 ${theme.colors.border} ${theme.colors.main} shadow-2xl ${theme.colors.accentGlow} p-6 relative flex flex-col animate-fade-in`}
        onClick={(e) => e.stopPropagation()}
        style={{maxHeight: '90vh'}}
      >
        <div className="flex justify-between items-center mb-6">
          {activePanel !== 'main' && (
             <button onClick={() => setActivePanel('main')} className={`p-2 rounded-full ${theme.colors.text} hover:bg-white/10`}>
                <Icon className="w-8 h-8">{ICONS.back}</Icon>
            </button>
          )}
          <h2 className={`flex-grow text-3xl font-bold ${theme.colors.accent} text-center`}>
            {getTitle()}
          </h2>
          <button onClick={handleClose} className={`p-2 rounded-full ${theme.colors.text} hover:bg-white/10`}>
            <Icon className="w-8 h-8">{ICONS.close}</Icon>
          </button>
        </div>
        <div className="space-y-3 overflow-y-auto pr-2">
            {renderPanel()}
        </div>
      </div>
    </div>
  );
};

const SettingsButton: React.FC<{ icon: React.ReactNode; text: string; onClick: () => void }> = ({ icon, text, onClick }) => {
    const { theme } = useAppContext();
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-center gap-4 p-4 rounded-lg ${theme.colors.cardBg} ${theme.colors.text} hover:${theme.colors.accent.replace('text-','bg-')} hover:text-black border ${theme.colors.border} hover:border-transparent transition-all duration-200 group`}
        >
            <Icon className={`w-6 h-6 ${theme.colors.accent} group-hover:text-black`}>{icon}</Icon>
            <span className="text-lg font-semibold">{text}</span>
        </button>
    );
};

const ItemCard = ({ item, isUnlocked, onSelect, onBuy, isSelected, currencyMap }: { item: ManifestItem, isUnlocked: boolean, onSelect: () => void, onBuy: () => void, isSelected: boolean, currencyMap: any }) => {
    const { theme } = useAppContext();
    const canAfford = item.price.currency === 'free' || (currencyMap[item.price.currency]?.amount || 0) >= (item.price.amount || 0);

    return (
        <div 
            className={`p-3 rounded-lg border-2 flex items-center gap-4 ${isSelected ? `${theme.colors.border} ${theme.colors.accentGlow.replace('shadow-[', 'shadow-md shadow-')}` : `border-transparent ${theme.colors.cardBg}`}`}
        >
            {item.data && (
                 <div className={`w-12 h-12 flex-shrink-0 rounded ${item.data.bg} border-2 ${item.data.border} flex items-center justify-center`}>
                    <div className={`w-1/2 h-1/2 rounded ${item.data.main} flex items-center justify-center`}>
                        <div style={{backgroundColor: item.data.accent.replace('text-','')}} className={`w-3 h-3 rounded-full ${item.data.accent.replace('text-', 'bg-')}`}></div>
                    </div>
                 </div>
            )}
            {item.url && (
                <div 
                    className="w-12 h-12 flex-shrink-0 rounded border-2 border-white/10 bg-cover bg-center"
                    style={{backgroundImage: `url(${item.url})`}}
                ></div>
            )}

            <div className="flex-grow">
                <h4 className={`${theme.colors.text} font-semibold`}>{item.name}</h4>
                <p className={`${theme.colors.text} opacity-70 text-xs`}>{item.description}</p>
            </div>

            <div className="flex-shrink-0 w-36 text-right">
               {isUnlocked ? (
                   isSelected ? (
                       <span className="px-3 py-1.5 rounded-md bg-green-500 text-white text-sm font-semibold">Активно</span>
                   ) : (
                       <button onClick={onSelect} className={`px-3 py-1.5 rounded-md ${theme.colors.accent.replace('text-','bg-')} text-black text-sm font-semibold hover:opacity-90`}>
                           Выбрать
                       </button>
                   )
               ) : (
                   <button 
                        onClick={onBuy} 
                        disabled={!canAfford}
                        className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-1 w-full"
                    >
                       Купить за {item.price.amount} 
                       <Icon className={`w-4 h-4 ${currencyMap[item.price.currency]?.color}`}>{currencyMap[item.price.currency]?.icon}</Icon>
                   </button>
               )}
            </div>
        </div>
    )
}

const ThemesPanel: React.FC = () => {
    const { theme, setThemeById, unlockedItems, purchaseDefaultItem, currencyMap } = useAppContext();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {THEMES.map(t => (
                <ItemCard 
                    key={t.id}
                    item={t}
                    isUnlocked={unlockedItems.includes(t.id)}
                    isSelected={theme.id === t.id}
                    onSelect={() => setThemeById(t.id)}
                    onBuy={() => purchaseDefaultItem(t)}
                    currencyMap={currencyMap}
                />
            ))}
        </div>
    );
};

const BackgroundsPanel: React.FC = () => {
    const { setAppBackground, appBackground, unlockedItems, purchaseDefaultItem, currencyMap, appBlur, setAppBlur } = useAppContext();
    
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {BACKGROUNDS.map(bg => (
                    <ItemCard 
                        key={bg.id}
                        item={bg}
                        isUnlocked={unlockedItems.includes(bg.id)}
                        isSelected={appBackground === bg.url}
                        onSelect={() => setAppBackground(bg.url!)}
                        onBuy={() => purchaseDefaultItem(bg)}
                        currencyMap={currencyMap}
                    />
                ))}
            </div>
             <div className="mt-6 pt-4 border-t border-white/10">
                <label htmlFor="blur-slider" className="block text-sm font-medium mb-2">Размытие фона панелей</label>
                <div className="flex items-center gap-4">
                    <input
                        id="blur-slider"
                        type="range"
                        min="0"
                        max="24"
                        value={appBlur}
                        onChange={(e) => setAppBlur(Number(e.target.value))}
                        className="w-full h-2 bg-gray-500/50 rounded-lg appearance-none cursor-pointer"
                        style={{ '--thumb-color': 'red' } as React.CSSProperties}
                    />
                    <span className="font-semibold w-12 text-center p-1 bg-black/20 rounded-md">{appBlur}px</span>
                </div>
            </div>
        </div>
    );
};

const ChangelogPanel: React.FC = () => {
    const { theme } = useAppContext();
    return (
        <div>
            <div className={`prose prose-invert ${theme.colors.text}`}>
                <h3 className={`text-2xl font-bold ${theme.colors.accent}`}>V 1.0 - Initial Release</h3>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                    <li>Реализована базовая генерация изображений с помощью AI.</li>
                    <li>Добавлена галерея для просмотра сгенерированных артов.</li>
                    <li>Создана система тем, включая Cyberpunk, Dark и Light.</li>
                    <li>Реализовано сохранение галереи и темы в localStorage.</li>
                    <li>Добавлена модалка настроек с основной навигацией.</li>
                </ul>
            </div>
        </div>
    );
}

export default SettingsModal;