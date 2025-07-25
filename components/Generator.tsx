import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ART_STYLES, ICONS, DIMENSION_PRESETS, FINE_TUNED_MODELS, GENERATION_MODELS, THEMES, BACKGROUNDS, VIP_PASSES, CURRENCIES, TASK_CONVERSION_RATES } from '../constants';
import { SPECIAL_OFFERS, SHOP_DATA } from '../data/shopData';
import { generateImages } from '../services/imageGenerationService';
import Button from './Button';
import Icon from './Icon';
import { GeneratedImage, GenerationConfig, DimensionPreset, Currency, ManifestItem, ShopPackage, PurchaseableItem, VipPass } from '../types';
import Checkout from './Checkout';

type GeneratorTab = 'settings' | 'models' | 'image-to-image';
type NeonColor = GenerationConfig['neonColor'];

type StoreMajorTab = 'items' | 'currency';
type StoreItemsTab = 'themes' | 'backgrounds';
type StoreCurrencyTab = 'special' | 'silver' | 'gold' | 'star' | 'vip' | 'tasks';

const isDimensionAllowed = (dim: {w: number, h: number}, currency: 'free' | 'silver' | 'gold' | 'star'): boolean => {
    const key = `${dim.w}_${dim.h}`;
    
    const freeDims = new Set(['512_768', '768_512', '512_512', '768_768']);
    const silverOnlyDims = new Set(['768_1024', '1024_768', '1920_1080', '1080_1920', '1024_1024']);
    const goldOnlyDims = new Set(['1920_1080', '1080_1920', '3840_2160', '2160_3840', '2048_2048']);
    const starOnlyDims = new Set(['3840_2160', '2160_3840', '7680_4320', '4096_4096', '8192_8192']);

    switch (currency) {
        case 'free':
            return freeDims.has(key);
        case 'silver':
            return freeDims.has(key) || silverOnlyDims.has(key);
        case 'gold':
            return goldOnlyDims.has(key);
        case 'star':
            return starOnlyDims.has(key);
        default:
            return false;
    }
};


const Generator: React.FC = () => {
  const { theme, addImages, setIsLoading, isLoading, currencies, handleGenerationPayment, currencyMap, vipStatus, appBlur, setAppBackground, addImage, showStore, setShowStore, storeTarget, setStoreTarget, setIsGamesModalOpen, dailyFreeGenerationsLeft } = useAppContext();
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [styleId, setStyleId] = useState(ART_STYLES[0].id);
  const [previewImages, setPreviewImages] = useState<GeneratedImage[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState<GeneratorTab>('settings');
  
  const [generationConfig, setGenerationConfig] = useState<GenerationConfig>({
    paymentCurrency: 'free',
    numberOfImages: 1,
    width: 768,
    height: 512,
    generationModelId: 'replicate:stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
    isPhotoreal: false,
    isAlchemy: true,
    guidanceScale: 7,
    isTiling: false,
    isBlackAndWhite: false,
    isAnime: false,
    isCartoon: false,
    isMedieval: false,
    isGames: false,
    isPixel: false,
    isMatrix: false,
    isUFO: false,
    isBlood: false,
    isSupernatural: false,
    isHorror: false,
    isNSFW: false,
    isFuture: false,
    isVintage: false,
    isSteampunk: false,
    isWatercolor: false,
    isAbstract: false,
    isNeon: false,
    neonStrength: 50,
    neonTarget: 'all',
    neonColor: 'blue',
    sourceImage: null,
    fineTunedModelId: null,
  });

  const vipLevels = { none: 0, silver: 1, gold: 2, star: 3 };
  const userVipLevel = vipLevels[vipStatus];

  const maxImages = useMemo(() => {
    switch (vipStatus) {
        case 'star': return 8;
        case 'gold': return 6;
        case 'silver': return 4;
        default: return 2;
    }
  }, [vipStatus]);

  const generationCost = useMemo(() => {
    if (generationConfig.paymentCurrency === 'free') {
      return 1;
    }
    return generationConfig.numberOfImages;
  }, [generationConfig.numberOfImages, generationConfig.paymentCurrency]);

  const hasEnoughFunds = useMemo(() => {
    if (generationConfig.paymentCurrency === 'free') {
      return dailyFreeGenerationsLeft > 0;
    }
    const balance = currencyMap[generationConfig.paymentCurrency]?.amount || 0;
    return balance >= generationCost;
  }, [currencyMap, generationConfig.paymentCurrency, generationCost, dailyFreeGenerationsLeft]);


  const handleConfigChange = (key: keyof GenerationConfig, value: any) => {
    let newConfig = { ...generationConfig, [key]: value };

    if (key === 'paymentCurrency') {
        if (!isDimensionAllowed({ w: generationConfig.width, h: generationConfig.height }, value)) {
            if (value === 'free' || value === 'silver') {
                newConfig = {...newConfig, width: 768, height: 512};
            } else if (value === 'gold') {
                newConfig = {...newConfig, width: 1920, height: 1080};
            } else if (value === 'star') {
                 newConfig = {...newConfig, width: 3840, height: 2160};
            }
        }
    }
    if(key === 'numberOfImages' && value > maxImages) {
        newConfig.numberOfImages = maxImages;
    }
    setGenerationConfig(newConfig);
  };
  
  const handleDimensionChange = (dim: DimensionPreset) => {
      const newConfig = { ...generationConfig, width: dim.w, height: dim.h };
      setGenerationConfig(newConfig);
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Пожалуйста, введите идею для генерации.');
      return;
    }
    
    if (generationConfig.numberOfImages > maxImages) {
      alert(`Ваш VIP статус позволяет генерировать до ${maxImages} изображений за раз.`);
      return;
    }

    if (!hasEnoughFunds) {
        const currencyName = currencyMap[generationConfig.paymentCurrency]?.name || 'попыток';
        if (generationConfig.paymentCurrency === 'free') {
             handleGenerationPayment(generationConfig.paymentCurrency, generationCost); // This will trigger the modal
             return;
        }
        alert(`Недостаточно ${currencyName} для генерации. Пожалуйста, пополните баланс.`);
        return;
    }

    if (!isDimensionAllowed({w: generationConfig.width, h: generationConfig.height}, generationConfig.paymentCurrency)) {
        alert('Выбранное разрешение недоступно для этого типа валюты. Пожалуйста, выберите другое разрешение.');
        return;
    }

    setIsLoading(true);
    setPreviewImages([]);

    const paymentSuccessful = handleGenerationPayment(generationConfig.paymentCurrency, generationCost);
    if (!paymentSuccessful) {
        setIsLoading(false);
        // Alert is handled inside context now for free payments
        return;
    }
    
    try {
      const selectedStyle = ART_STYLES.find(s => s.id === styleId)!;
      const imageSrcs = await generateImages(prompt, negativePrompt, selectedStyle, generationConfig);
      
      const imagePromises = imageSrcs.map(src => 
        new Promise<GeneratedImage>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            resolve({
              id: crypto.randomUUID(),
              src: src,
              prompt: prompt,
              name: prompt.substring(0, 50),
              style: selectedStyle.name,
              isAi: true,
              isFavorite: false,
              createdAt: Date.now(),
              width: img.width,
              height: img.height,
            });
          };
          img.onerror = () => reject(new Error('Image could not be loaded'));
          img.src = src;
        })
      );
      
      const newImages = await Promise.all(imagePromises);
      setPreviewImages(newImages);

    } catch (error) {
      console.error(error);
      alert((error as Error).message || 'Не удалось сгенерировать изображение. Попробуйте снова.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleSavePreview = () => {
    if (previewImages.length > 0) {
      addImages(previewImages);
      setPreviewImages([]);
      setPrompt('');
      setNegativePrompt('');
    }
  };

  const handleCancelPreview = () => {
    setPreviewImages([]);
  };

  const handleSetAsBackground = () => {
    if (previewImages.length !== 1) {
        alert("Пожалуйста, сгенерируйте ровно одно изображение для установки фона.");
        return;
    }
    const imageToSet = previewImages[0];
    setAppBackground(imageToSet.src);
    addImages(previewImages);
    setPreviewImages([]);
    alert("Фон установлен и изображение сохранено в галерею!");
  };
  
  const handleRandomPrompt = () => {
    const randomPrompts = [
        "девушка-киборг в неоновом Токио",
        "магический лес со светящимися грибами",
        "космический самурай с лазерной катаной",
        "аниме-девушка в уютном кафе под дождем",
        "дракон, парящий над футуристическим городом",
    ];
    setPrompt(randomPrompts[Math.floor(Math.random() * randomPrompts.length)]);
  };
  
  const mainPanelClasses = `${theme.colors.main.replace('bg-','bg-')}/60`;
  const baseSelectClasses = `w-full p-3 rounded-md border ${theme.colors.border} ${theme.colors.inputBg} ${theme.colors.text} focus:ring-2 focus:ring-fuchsia-500 focus:outline-none transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed`;

  const paymentOptions = [
    { id: 'free', name: 'Бесплатно', requiredVip: 0, balance: dailyFreeGenerationsLeft },
    { id: 'silver', name: 'Серебро', requiredVip: 1, balance: currencyMap['silver']?.amount || 0 },
    { id: 'gold', name: 'Золото', requiredVip: 2, balance: currencyMap['gold']?.amount || 0 },
    { id: 'star', name: 'Звёзды', requiredVip: 3, balance: currencyMap['star']?.amount || 0 },
  ];

  return (
    <div 
        className={`p-4 md:p-6 my-4 rounded-lg border-2 ${theme.colors.border} ${mainPanelClasses} shadow-lg`}
        style={{ backdropFilter: `blur(${appBlur}px)` }}
    >
      <h2 className={`text-xl text-center font-bold mb-4 ${theme.colors.accent}`}>Новая генерация</h2>
      <div className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Опиши свою идею здесь... (например, 'девушка с красными волосами')"
          className={`w-full p-3 rounded-md border ${theme.colors.border} ${theme.colors.inputBg} ${theme.colors.text} focus:ring-2 focus:ring-fuchsia-500 focus:outline-none transition-all`}
          rows={2}
          disabled={isLoading}
        />
        <input
          type="text"
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
          placeholder="🚫 Негативный промпт (что НЕ нужно рисовать)"
          className={`w-full p-3 rounded-md border ${theme.colors.border} ${theme.colors.inputBg} ${theme.colors.text} focus:ring-2 focus:ring-fuchsia-500 focus:outline-none transition-all`}
          disabled={isLoading}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={styleId}
              onChange={(e) => setStyleId(e.target.value)}
              className={baseSelectClasses}
              disabled={isLoading}
            >
              {ART_STYLES.map(style => (
                <option key={style.id} value={style.id} className={`${theme.colors.main} ${theme.colors.text}`}>
                  {style.name}
                </option>
              ))}
            </select>
            <select
                value={generationConfig.generationModelId}
                onChange={(e) => handleConfigChange('generationModelId', e.target.value)}
                className={baseSelectClasses}
                disabled={isLoading}
              >
              {GENERATION_MODELS.map(model => (
                <option key={model.id} value={model.id} className={`${theme.colors.main} ${theme.colors.text}`}>
                  {model.name}
                </option>
              ))}
            </select>
            <select
                value={generationConfig.paymentCurrency}
                onChange={(e) => handleConfigChange('paymentCurrency', e.target.value)}
                className={baseSelectClasses}
                disabled={isLoading}
            >
                {paymentOptions.map(opt => {
                    const isDisabled = userVipLevel < opt.requiredVip;
                    const currencyName = opt.id === 'free' ? 'Осталось' : 'Баланс';
                    return (
                        <option key={opt.id} value={opt.id} disabled={isDisabled} className={`${theme.colors.main} ${theme.colors.text} disabled:text-gray-500`}>
                            {`${opt.name} (${currencyName}: ${opt.balance})`}
                            {isDisabled && ' (Нужен VIP)'}
                        </option>
                    )
                })}
            </select>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          <Button onClick={handleGenerate} disabled={isLoading || !hasEnoughFunds} variant="primary">
            <Icon>{ICONS.generate}</Icon>
            {isLoading ? 'Генерация...' : `Сгенерировать (${generationCost} ${currencyMap[generationConfig.paymentCurrency]?.name})`}
          </Button>
          <Button onClick={() => alert('Поиск в сети пока не реализован')} disabled={isLoading} variant="secondary">
            <Icon>{ICONS.search}</Icon>
            Найти в сети
          </Button>
           <Button onClick={() => alert('Функция в разработке')} disabled={isLoading} variant="secondary">
            <Icon>{ICONS.random}</Icon>
            Случайное
          </Button>
          <Button onClick={handleRandomPrompt} disabled={isLoading} variant="secondary">
            <Icon>{ICONS.random}</Icon>
            Случайный промпт
          </Button>
        </div>
        
        <div className={`pt-2 border-t-2 ${theme.colors.border} border-dashed`}>
          <div className="flex justify-center items-center gap-4 py-2">
            <button onClick={() => setShowAdvanced(!showAdvanced)} className={`${theme.colors.text} opacity-80 hover:opacity-100 transition-colors`}>
               {showAdvanced ? 'Скрыть продвинутые настройки' : 'Показать продвинутые настройки'}
            </button>
             <button onClick={() => setShowStore(!showStore)} className={`${theme.colors.text} opacity-80 hover:opacity-100 transition-colors`}>
               {showStore ? 'Скрыть магазин' : 'Показать магазин'}
            </button>
             <button onClick={() => setIsGamesModalOpen(true)} className={`${theme.colors.text} opacity-80 hover:opacity-100 transition-colors`}>
                <span className="flex items-center gap-2">
                    <Icon className="w-5 h-5">{ICONS.gamepad}</Icon> Игры
                </span>
            </button>
          </div>

          {showAdvanced && (
            <div className="pt-4 animate-fade-in space-y-4">
              <div className="flex justify-center gap-2 border-b-2 border-dashed border-white/10 pb-4 mb-4">
                  <TabButton isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>Настройки</TabButton>
                  <TabButton isActive={activeTab === 'models'} onClick={() => setActiveTab('models')}>Модели</TabButton>
                  <TabButton isActive={activeTab === 'image-to-image'} onClick={() => setActiveTab('image-to-image')}>Изображение к изображению</TabButton>
              </div>

              {activeTab === 'settings' && <SettingsPanel config={generationConfig} onConfigChange={handleConfigChange} onDimensionChange={handleDimensionChange} />}
              {activeTab === 'models' && <ModelsPanel config={generationConfig} onConfigChange={handleConfigChange} />}
              {activeTab === 'image-to-image' && <ImageToImagePanel config={generationConfig} onConfigChange={handleConfigChange} />}
            </div>
          )}
          {showStore && <StorePanel target={storeTarget} onTargetClear={() => setStoreTarget(null)}/>}
        </div>
      </div>
       {isLoading && (
        <div className="mt-6 flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-24 h-24 loader-container">
            <svg viewBox="0 0 36 36">
              <path className="loader-circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className={`loader-circle-fg ${theme.colors.accent}`} stroke="currentColor" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
          </div>
          <p className={`mt-4 text-lg text-center ${theme.colors.accent} font-semibold`}>AI-генерация...</p>
        </div>
      )}
      {!isLoading && previewImages.length > 0 && (
         <div className="flex flex-col items-center gap-4 mt-6 animate-fade-in">
            <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 max-w-4xl`}>
                {previewImages.map(img => (
                    <img key={img.id} src={img.src} alt="предпросмотр" className="rounded-lg shadow-lg object-contain"/>
                ))}
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                <Button onClick={handleSavePreview} variant="primary">
                    <Icon>{ICONS.save}</Icon>
                    Готово
                </Button>
                <Button onClick={handleSetAsBackground} disabled={previewImages.length !== 1} variant="secondary">
                    <Icon>{ICONS.bg}</Icon>
                    Сделать фоном
                </Button>
                <Button onClick={handleCancelPreview} variant="secondary">
                    <Icon>{ICONS.cancel}</Icon>
                    Отменить
                </Button>
            </div>
         </div>
      )}
    </div>
  );
};

const TabButton = ({ isActive, onClick, children }: { isActive: boolean, onClick: () => void, children: React.ReactNode }) => {
    const { theme } = useAppContext();
    return (
        <button onClick={onClick} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${isActive ? `${theme.colors.accent.replace('text-','bg-')} text-black` : `bg-white/10 ${theme.colors.text} hover:bg-white/20`}`}>
            {children}
        </button>
    )
}

const SettingsPanel = ({ config, onConfigChange, onDimensionChange }: { config: GenerationConfig, onConfigChange: (k: any, v: any) => void, onDimensionChange: (d: DimensionPreset) => void }) => {
    const { theme, isLoading, currencyMap, vipStatus } = useAppContext();

    const vipLevels = { none: 0, silver: 1, gold: 2, star: 3 };
    const userVipLevel = vipLevels[vipStatus];

    const requiredVipForToggle: { [key: string]: 'gold' | 'star' } = {
        isGames: 'gold', isMedieval: 'gold', isMatrix: 'gold',
        isSupernatural: 'star', isHorror: 'star', isUFO: 'star', isBlood: 'star', isNSFW: 'star',
    };

    const hasVipAccess = (toggleKey: keyof typeof requiredVipForToggle): boolean => {
        const requiredStatus = requiredVipForToggle[toggleKey as keyof typeof requiredVipForToggle];
        if (!requiredStatus) return true;
        return userVipLevel >= vipLevels[requiredStatus];
    };

    const maxImages = useMemo(() => {
        switch (vipStatus) {
            case 'star': return 8;
            case 'gold': return 6;
            case 'silver': return 4;
            default: return 2;
        }
    }, [vipStatus]);

    const SettingsGroup: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
        <div className={`p-3 border rounded-lg ${theme.colors.border} flex flex-col ${className}`}>
            <h4 className={`${theme.colors.accent} font-semibold mb-3 text-sm`}>{title}</h4>
            {children}
        </div>
    );
    
    const ToggleGrid: React.FC<{children: React.ReactNode}> = ({ children }) => (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
            {children}
        </div>
    );

    const SimpleToggle = ({ label, checked, onChange, toggleKey }: {label: string, checked: boolean, onChange: (checked: boolean) => void, toggleKey: keyof GenerationConfig}) => {
        const isLocked = !hasVipAccess(toggleKey as any);
        const isPermanentlyDisabled = toggleKey === 'isNSFW'; // This key might be used to permanently disable a feature

        const vipPass = isLocked ? VIP_PASSES.find(p => p.id === requiredVipForToggle[toggleKey as keyof typeof requiredVipForToggle]) : null;

        return (
            <div className="flex items-center justify-between py-1" title={isLocked ? `Требуется ${vipPass?.name || 'более высокий VIP'}` : ''}>
              <span className={`${theme.colors.text} text-sm flex items-center gap-1.5 ${isLocked || isPermanentlyDisabled ? 'opacity-50' : ''}`}>
                {label}
                {(isLocked || isPermanentlyDisabled) && <Icon className="w-3.5 h-3.5 text-yellow-400">{ICONS.lock}</Icon>}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" disabled={isLoading || isLocked || isPermanentlyDisabled} />
                <div className={`w-11 h-6 ${theme.colors.inputBg} rounded-full peer peer-focus:ring-2 ${theme.colors.border} peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:${theme.colors.accent.replace('text-','bg-')} ${isLocked || isPermanentlyDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
              </label>
            </div>
        )
    };
    
    const NumberButton = ({ opt, value, onChange, isCost, currency }: { opt: number, value: number, onChange: (v:any) => void, isCost?: boolean, currency?: Currency }) => {
         const isDisabled = isLoading || (isCost && Number(opt) > maxImages);
         return (
            <button
                key={opt}
                onClick={() => onChange(opt)}
                disabled={isDisabled}
                className={`px-2 py-1 rounded-md text-xs font-semibold transition-all duration-200 text-center flex flex-col items-center min-w-[40px]
                ${value === opt ? `${theme.colors.accent.replace('text-','bg-')} text-black` : `bg-black/20 ${theme.colors.text} hover:opacity-80`}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                <span className="flex items-center gap-1">
                    {opt}
                    {isDisabled && !isLoading && <Icon className="w-3 h-3 text-yellow-500">{ICONS.lock}</Icon>}
                </span>
                {isCost && currency && currency.id !== 'free' && (
                    <span className="text-black/50 text-[10px] flex items-center gap-0.5">({Number(opt)} <Icon className={`w-2.5 h-2.5 ${currency.color}`}>{currency.icon}</Icon>)</span>
                )}
            </button>
        )
    }

    const neonColors: { name: NeonColor, class: string }[] = [
        { name: 'red', class: 'bg-red-500' }, { name: 'orange', class: 'bg-orange-500' },
        { name: 'yellow', class: 'bg-yellow-500' }, { name: 'gold', class: 'bg-yellow-400' },
        { name: 'lime', class: 'bg-lime-500' }, { name: 'green', class: 'bg-green-500' },
        { name: 'teal', class: 'bg-teal-500' }, { name: 'cyan', class: 'bg-cyan-500' },
        { name: 'blue', class: 'bg-blue-500' }, { name: 'indigo', class: 'bg-indigo-500' },
        { name: 'violet', class: 'bg-violet-500' }, { name: 'pink', class: 'bg-pink-500' },
        { name: 'white', class: 'bg-white' },
        { name: 'rainbow', class: 'bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500' },
    ];
    
    return(
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SettingsGroup title="Количество изображений">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4].map(opt => <NumberButton key={opt} opt={opt} value={config.numberOfImages} onChange={(v) => onConfigChange('numberOfImages', v)} isCost currency={currencyMap[config.paymentCurrency]}/>)}
                        </div>
                         <div className="flex items-center gap-2">
                            {[5, 6, 7, 8].map(opt => <NumberButton key={opt} opt={opt} value={config.numberOfImages} onChange={(v) => onConfigChange('numberOfImages', v)} isCost currency={currencyMap[config.paymentCurrency]}/>)}
                        </div>
                    </div>
                </SettingsGroup>
                 <SettingsGroup title="Следование промпту">
                    <div className="flex items-center gap-2 flex-wrap">
                      {[3, 5, 7, 11, 15].map(opt => <NumberButton key={opt} opt={opt} value={config.guidanceScale} onChange={(v) => onConfigChange('guidanceScale', v)} />)}
                    </div>
                </SettingsGroup>
                <SettingsGroup title="Неоновый стиль">
                    <div className="flex-grow space-y-3">
                        <SimpleToggle label="Включить" checked={config.isNeon} onChange={(c) => onConfigChange('isNeon', c)} toggleKey="isNeon" />
                        <div className={`space-y-3 ${!config.isNeon ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Сила: {config.neonStrength}%</label>
                                <input type="range" min="1" max="100" value={config.neonStrength} onChange={(e) => onConfigChange('neonStrength', Number(e.target.value))} className="w-full h-2 bg-gray-500/50 rounded-lg appearance-none cursor-pointer"/>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Применить к:</label>
                                <div className="flex gap-1">
                                    <button type="button" onClick={() => onConfigChange('neonTarget', 'all')} className={`text-xs px-2 py-1 rounded-md flex-1 ${config.neonTarget === 'all' ? `${theme.colors.accent.replace('text-','bg-')} text-black` : `bg-black/20 ${theme.colors.text}`}`}>Всем</button>
                                    <button type="button" onClick={() => onConfigChange('neonTarget', 'character')} className={`text-xs px-2 py-1 rounded-md flex-1 ${config.neonTarget === 'character' ? `${theme.colors.accent.replace('text-','bg-')} text-black` : `bg-black/20 ${theme.colors.text}`}`}>Персонажу</button>
                                    <button type="button" onClick={() => onConfigChange('neonTarget', 'background')} className={`text-xs px-2 py-1 rounded-md flex-1 ${config.neonTarget === 'background' ? `${theme.colors.accent.replace('text-','bg-')} text-black` : `bg-black/20 ${theme.colors.text}`}`}>Фону</button>
                                    <button type="button" onClick={() => onConfigChange('neonTarget', 'frame')} className={`text-xs px-2 py-1 rounded-md flex-1 ${config.neonTarget === 'frame' ? `${theme.colors.accent.replace('text-','bg-')} text-black` : `bg-black/20 ${theme.colors.text}`}`}>Рамка</button>
                                </div>
                            </div>
                             <div>
                                <label className="block text-xs text-gray-400 mb-1">Цвет:</label>
                                <div className="grid grid-cols-7 gap-2">
                                    {neonColors.map(color => (
                                        <button key={color.name} type="button" onClick={() => onConfigChange('neonColor', color.name)} className={`w-6 h-6 rounded-full ${color.class} transition-transform transform hover:scale-110 ${config.neonColor === color.name ? 'ring-2 ring-offset-2 ring-white dark:ring-offset-gray-800' : ''} border border-black/20`}></button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </SettingsGroup>
            </div>
            
            <div className="space-y-4">
                 <SettingsGroup title="Основные стили и эффекты">
                    <ToggleGrid>
                       <SimpleToggle label="PhotoReal" checked={config.isPhotoreal} onChange={(c) => onConfigChange('isPhotoreal', c)} toggleKey="isPhotoreal" />
                       <SimpleToggle label="Alchemy" checked={config.isAlchemy} onChange={(c) => onConfigChange('isAlchemy', c)} toggleKey="isAlchemy" />
                       <SimpleToggle label="Текстура (Tiling)" checked={config.isTiling} onChange={(c) => onConfigChange('isTiling', c)} toggleKey="isTiling" />
                       <SimpleToggle label="Черно-белый" checked={config.isBlackAndWhite} onChange={(c) => onConfigChange('isBlackAndWhite', c)} toggleKey="isBlackAndWhite" />
                       <SimpleToggle label="Future" checked={config.isFuture} onChange={(c) => onConfigChange('isFuture', c)} toggleKey="isFuture" />
                       <SimpleToggle label="Vintage" checked={config.isVintage} onChange={(c) => onConfigChange('isVintage', c)} toggleKey="isVintage" />
                    </ToggleGrid>
                </SettingsGroup>
                <SettingsGroup title="Тематики">
                   <ToggleGrid>
                       <SimpleToggle label="Аниме" checked={config.isAnime} onChange={(c) => onConfigChange('isAnime', c)} toggleKey="isAnime" />
                       <SimpleToggle label="Мультфильм" checked={config.isCartoon} onChange={(c) => onConfigChange('isCartoon', c)} toggleKey="isCartoon" />
                       <SimpleToggle label="Пиксель" checked={config.isPixel} onChange={(c) => onConfigChange('isPixel', c)} toggleKey="isPixel" />
                       <SimpleToggle label="Абстракция" checked={config.isAbstract} onChange={(c) => onConfigChange('isAbstract', c)} toggleKey="isAbstract" />
                       <SimpleToggle label="Акварель" checked={config.isWatercolor} onChange={(c) => onConfigChange('isWatercolor', c)} toggleKey="isWatercolor" />
                       <SimpleToggle label="Стимпанк" checked={config.isSteampunk} onChange={(c) => onConfigChange('isSteampunk', c)} toggleKey="isSteampunk" />
                   </ToggleGrid>
                </SettingsGroup>
                <SettingsGroup title="Тематики (VIP)">
                    <ToggleGrid>
                       <SimpleToggle label="Средневековье" checked={config.isMedieval} onChange={(c) => onConfigChange('isMedieval', c)} toggleKey="isMedieval" />
                       <SimpleToggle label="Игры" checked={config.isGames} onChange={(c) => onConfigChange('isGames', c)} toggleKey="isGames" />
                       <SimpleToggle label="Матрица" checked={config.isMatrix} onChange={(c) => onConfigChange('isMatrix', c)} toggleKey="isMatrix" />
                       <SimpleToggle label="Сверхъестественное" checked={config.isSupernatural} onChange={(c) => onConfigChange('isSupernatural', c)} toggleKey="isSupernatural" />
                       <SimpleToggle label="Ужасы" checked={config.isHorror} onChange={(c) => onConfigChange('isHorror', c)} toggleKey="isHorror" />
                       <SimpleToggle label="НЛО" checked={config.isUFO} onChange={(c) => onConfigChange('isUFO', c)} toggleKey="isUFO" />
                       <SimpleToggle label="Blood" checked={config.isBlood} onChange={(c) => onConfigChange('isBlood', c)} toggleKey="isBlood" />
                       <SimpleToggle label="NSFW" checked={config.isNSFW} onChange={(c) => onConfigChange('isNSFW', c)} toggleKey="isNSFW" />
                    </ToggleGrid>
                </SettingsGroup>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SettingsGroup title="Разрешение (Стандартное)">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {DIMENSION_PRESETS.filter(d => d.group === 'standard').map(dim => {
                            const allowed = isDimensionAllowed(dim, config.paymentCurrency);
                            return (
                                <button key={`${dim.w}x${dim.h}`} onClick={() => onDimensionChange(dim)} disabled={!allowed || isLoading}
                                    className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 text-center disabled:opacity-30 disabled:cursor-not-allowed
                                    ${config.width === dim.w && config.height === dim.h ? `${theme.colors.accent.replace('text-','bg-')} text-black` : `${theme.colors.inputBg} ${theme.colors.text} hover:bg-white/10`}`}>
                                    {`${dim.w} x ${dim.h}`}
                                </button>
                            )
                        })}
                    </div>
                </SettingsGroup>
                <SettingsGroup title="Разрешение (Квадратное)">
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                       {DIMENSION_PRESETS.filter(d => d.group === 'square').map(dim => {
                            const allowed = isDimensionAllowed(dim, config.paymentCurrency);
                            return (
                               <button key={`${dim.w}x${dim.h}`} onClick={() => onDimensionChange(dim)} disabled={!allowed || isLoading}
                                className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 text-center disabled:opacity-30 disabled:cursor-not-allowed
                                ${config.width === dim.w && config.height === dim.h ? `${theme.colors.accent.replace('text-','bg-')} text-black` : `${theme.colors.inputBg} ${theme.colors.text} hover:bg-white/10`}`}>
                                {`${dim.w} x ${dim.h}`}
                               </button>
                           )
                        })}
                    </div>
                </SettingsGroup>
            </div>
        </div>
    );
}

const ModelsPanel = ({ config, onConfigChange }: { config: GenerationConfig, onConfigChange: (k: any, v: any) => void }) => {
    const { theme } = useAppContext();
    const { fineTunedModelId } = config;

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[50vh] overflow-y-auto pr-2">
            {FINE_TUNED_MODELS.map(model => (
                <button 
                    key={model.id} 
                    onClick={() => onConfigChange('fineTunedModelId', fineTunedModelId === model.id ? null : model.id)}
                    className={`p-2 rounded-lg border-2 transition-all text-left ${fineTunedModelId === model.id ? `${theme.colors.border} ring-2 ring-offset-2 ring-offset-transparent ${theme.colors.accent.replace('text-', 'ring-')}`: 'border-transparent hover:border-white/20'}`}
                >
                    <div 
                        className="w-full aspect-square bg-cover bg-center rounded mb-2 bg-black/20"
                        style={{ backgroundImage: `url(${model.previewImg})` }}
                    />
                    <h5 className={`${theme.colors.text} font-semibold text-sm`}>{model.name}</h5>
                    <p className={`${theme.colors.text} opacity-70 text-xs`}>{model.description}</p>
                </button>
            ))}
        </div>
    )
}

const ImageToImagePanel = ({ config, onConfigChange }: { config: GenerationConfig, onConfigChange: (k: any, v: any) => void }) => {
    const { theme } = useAppContext();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { sourceImage } = config;

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                onConfigChange('sourceImage', { src: event.target?.result as string, strength: sourceImage?.strength || 0.5 });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const strengthOptions = [{label: 'Низкая', value: 0.25}, {label: 'Средняя', value: 0.5}, {label: 'Высокая', value: 0.75}];

    return (
        <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-1/3 flex flex-col items-center">
                <div 
                    onClick={handleUploadClick}
                    className={`w-full aspect-square rounded-lg border-2 border-dashed ${theme.colors.border} flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all bg-cover bg-center`}
                    style={{ backgroundImage: `url(${sourceImage?.src})` }}
                >
                    {!sourceImage && (
                        <div className="text-center">
                            <Icon className={`w-12 h-12 ${theme.colors.text} opacity-50 mx-auto`}>{ICONS.upload}</Icon>
                            <p className={`${theme.colors.text} opacity-70 mt-2`}>Загрузить изображение</p>
                        </div>
                    )}
                </div>
                {sourceImage && (
                    <Button onClick={() => onConfigChange('sourceImage', null)} variant='secondary' className="mt-2 w-full">Удалить изображение</Button>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>
            <div className="w-full md:w-2/3">
                 <h4 className={`${theme.colors.accent} font-semibold mb-3 text-sm`}>Сила схожести</h4>
                 <p className={`${theme.colors.text} opacity-70 text-xs mb-3`}>
                    Определяет, насколько сильно AI будет следовать стилю и композиции вашего изображения.
                 </p>
                 <div className="flex gap-2">
                     {strengthOptions.map(opt => (
                        <button 
                            key={opt.value}
                            onClick={() => onConfigChange('sourceImage', { ...sourceImage, src: sourceImage?.src || '', strength: opt.value })}
                            disabled={!sourceImage}
                            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all w-full
                                ${sourceImage?.strength === opt.value ? `${theme.colors.accent.replace('text-','bg-')} text-black` : `${theme.colors.inputBg} ${theme.colors.text} hover:bg-white/10`}
                                disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                        >{opt.label}</button>
                     ))}
                 </div>
            </div>
        </div>
    )
}

const StorePanel = ({target, onTargetClear}: {target: any, onTargetClear: ()=>void}) => {
    const { theme, manifest, unlockedItems, purchaseManifestItem, currencyMap, setAppBackground, setThemeById, appBackground, purchasePackage, convertTasks, purchasedPackageIds } = useAppContext();
    
    const [majorTab, setMajorTab] = useState<StoreMajorTab>('items');
    const [itemsTab, setItemsTab] = useState<StoreItemsTab>('themes');
    const [currencyTab, setCurrencyTab] = useState<StoreCurrencyTab>('special');
    const [checkoutItem, setCheckoutItem] = useState<PurchaseableItem | null>(null);

    useEffect(() => {
        if (target) {
            if (target.tab === 'items') {
                setMajorTab('items');
                setItemsTab(target.subTab);
            } else if (target.tab === 'currency') {
                setMajorTab('currency');
                setCurrencyTab(target.subTab);
            } else if (target.tab === 'vip') {
                setMajorTab('currency');
                setCurrencyTab('vip');
            } else if (target.tab === 'tasks') {
                setMajorTab('currency');
                setCurrencyTab('tasks');
            }
            onTargetClear();
        }
    }, [target, onTargetClear]);

    const allThemes = [...THEMES, ...(manifest?.themes || [])];
    const allBackgrounds = [...BACKGROUNDS, ...(manifest?.backgrounds || [])];

    const ItemCard = ({ item }: {item: ManifestItem}) => {
        const isUnlocked = unlockedItems.includes(item.id);
        const isFree = item.price.currency === 'free';
        const canAfford = isFree || (currencyMap[item.price.currency]?.amount || 0) >= (item.price.amount || 0);
        const currency = currencyMap[item.price.currency];
        const isSelected = itemsTab === 'themes' ? theme.id === item.id : appBackground === item.url;
        
        const handleBuy = () => {
            if (window.confirm(`Вы уверены, что хотите купить "${item.name}"?`)) {
                purchaseManifestItem(item);
            }
        };

        const handleApply = () => {
            if (itemsTab === 'themes') {
                setThemeById(item.id);
            } else if (itemsTab === 'backgrounds' && item.url) {
                setAppBackground(item.url);
                 if (isFree && !isUnlocked) {
                    purchaseManifestItem(item);
                }
            }
        };

        return (
            <div className={`p-3 rounded-lg border flex flex-col ${theme.colors.cardBg} ${theme.colors.border}`}>
                {itemsTab === 'themes' && item.data ? (
                     <div className={`w-full h-24 rounded mb-2 ${item.data.bg} border-2 ${item.data.border} flex items-center justify-center`}>
                        <div className={`w-1/2 h-1/2 rounded ${item.data.main} flex items-center justify-center`}>
                            <div style={{backgroundColor: item.data.accent.replace('text-','')}} className={`w-4 h-4 rounded-full`}></div>
                        </div>
                    </div>
                ) : itemsTab === 'backgrounds' && item.url ? (
                    <div className="w-full h-24 bg-cover bg-center rounded mb-2" style={{backgroundImage: `url(${item.url})`}}/>
                ) : <div className={`w-full h-24 rounded mb-2 ${theme.colors.cardBg}`}/>
                }
                <div className="flex-grow">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-xs opacity-70">{item.description}</p>
                </div>
                <div className="mt-3">
                     {isUnlocked || isFree ? (
                        <Button variant={isSelected ? "primary" : "secondary"} onClick={handleApply} className="w-full">
                            {isSelected ? 'Активно' : 'Применить'}
                        </Button>
                    ) : (
                        <Button onClick={handleBuy} disabled={!canAfford} variant="primary" className="w-full">
                            <span className="flex items-center justify-center gap-2">
                                Купить за {item.price.amount} <Icon className={`w-4 h-4 ${currency?.color}`}>{currency?.icon}</Icon>
                            </span>
                        </Button>
                    )}
                </div>
            </div>
        )
    };

    const handlePackageSelect = (pkg: ShopPackage | VipPass) => {
        const isVip = 'monthlyGrants' in pkg;
        const currencyInfo = CURRENCIES.find(c => c.id === (isVip ? pkg.id : (pkg as ShopPackage).bonuses[0]?.id));
        const item: PurchaseableItem = {
            id: pkg.id,
            name: pkg.name,
            price: isVip ? pkg.priceValue : pkg.price,
            currencySymbol: isVip ? '$' : pkg.currencySymbol,
            description: isVip ? pkg.price : ('note' in pkg ? pkg.note : 'VIP Подписка'),
            icon: currencyInfo?.icon,
            color: currencyInfo?.color,
            originalItem: pkg
        };
        setCheckoutItem(item);
    }
    
    const handleFinalPurchase = () => {
        if (!checkoutItem) return;
        purchasePackage(checkoutItem.originalItem);
        alert(`Поздравляем! Покупка "${checkoutItem.originalItem.name}" прошла успешно.`);
        setCheckoutItem(null);
    }

    if (checkoutItem) {
        return <Checkout item={checkoutItem} onBack={() => setCheckoutItem(null)} onConfirm={handleFinalPurchase} />
    }

    return (
        <div className="pt-4 animate-fade-in space-y-4">
            <div className="flex justify-center gap-2 border-b-2 border-dashed border-white/10 pb-4 mb-4">
              <TabButton isActive={majorTab === 'items'} onClick={() => setMajorTab('items')}>Магазин Предметов</TabButton>
              <TabButton isActive={majorTab === 'currency'} onClick={() => setMajorTab('currency')}>Магазин Валют</TabButton>
            </div>
            
            {majorTab === 'items' && (
                <div>
                    <div className="flex justify-center gap-2 mb-4">
                        <TabButton isActive={itemsTab === 'themes'} onClick={() => setItemsTab('themes')}>Темы</TabButton>
                        <TabButton isActive={itemsTab === 'backgrounds'} onClick={() => setItemsTab('backgrounds')}>Фоны</TabButton>
                    </div>
                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                        {(itemsTab === 'themes' ? allThemes : allBackgrounds).map(item => <ItemCard key={item.id} item={item} />)}
                     </div>
                </div>
            )}

            {majorTab === 'currency' && (
                <div>
                    <div className="flex justify-center gap-2 mb-4 flex-wrap">
                        <TabButton isActive={currencyTab === 'special'} onClick={() => setCurrencyTab('special')}>Спец предложения</TabButton>
                        <TabButton isActive={currencyTab === 'silver'} onClick={() => setCurrencyTab('silver')}>Серебро</TabButton>
                        <TabButton isActive={currencyTab === 'gold'} onClick={() => setCurrencyTab('gold')}>Золото</TabButton>
                        <TabButton isActive={currencyTab === 'star'} onClick={() => setCurrencyTab('star')}>Звёзды</TabButton>
                        <TabButton isActive={currencyTab === 'vip'} onClick={() => setCurrencyTab('vip')}>VIP</TabButton>
                        <TabButton isActive={currencyTab === 'tasks'} onClick={() => setCurrencyTab('tasks')}>Обмен</TabButton>
                    </div>
                    
                    <div className="max-h-[60vh] overflow-y-auto pr-2">
                        {currencyTab === 'special' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                               {SPECIAL_OFFERS.map(pkg => {
                                   const isPurchased = purchasedPackageIds.includes(pkg.id);
                                    return (
                                        <div key={pkg.id} className={`${theme.colors.cardBg} rounded-xl border ${theme.colors.border} p-4 flex flex-col text-left relative`}>
                                            {isPurchased && <div className="absolute top-2 right-2 px-2 py-1 text-xs bg-green-500 text-white rounded-full font-bold">Куплено</div>}
                                            <h4 className={`font-bold text-lg mb-1`}>{pkg.name}</h4>
                                            <p className="text-sm opacity-70 mb-3 flex-grow">{pkg.note}</p>
                                            <div className='my-3 border-t border-dashed border-white/20'></div>
                                            <div className='space-y-1 mb-4'>
                                                {pkg.bonuses.map(bonus => {
                                                    const currencyInfo = CURRENCIES.find(c => c.id === bonus.id);
                                                    return(
                                                        <div key={bonus.id} className="flex items-center gap-2 text-sm">
                                                            <Icon className={`w-4 h-4 ${currencyInfo?.color}`}>{currencyInfo?.icon}</Icon>
                                                            <span>{bonus.amount.toLocaleString()} {currencyInfo?.name}</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            <Button onClick={() => handlePackageSelect(pkg)} disabled={isPurchased} className="mt-auto" variant="primary">
                                                {pkg.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                            </Button>
                                        </div>
                                    )
                               })}
                            </div>
                        )}
                        {['silver', 'gold', 'star'].includes(currencyTab) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {SHOP_DATA.find(d => d.currencyId === currencyTab)?.packages.map(pkg => {
                                    const currencyInfo = CURRENCIES.find(c => c.id === currencyTab);
                                    return (
                                        <div key={pkg.name} className={`${theme.colors.cardBg} rounded-xl border ${theme.colors.border} p-4 flex flex-col text-center`}>
                                            <h4 className={`font-bold text-lg mb-1`}>{pkg.name}</h4>
                                            <p className="text-sm opacity-70 mb-3">{pkg.note}</p>
                                            <div className="flex items-center justify-center gap-2 mb-3">
                                                <Icon className={`w-10 h-10 ${currencyInfo?.color}`}>{currencyInfo?.icon}</Icon>
                                                <p className={`text-3xl font-bold`}>{pkg.amount?.toLocaleString()}</p>
                                            </div>
                                            <Button onClick={() => handlePackageSelect(pkg)} className="mt-auto" variant="primary">
                                                {pkg.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                            </Button>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                        {currencyTab === 'vip' && (
                             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {VIP_PASSES.map(pass => (
                                    <div key={pass.id} className={`${theme.colors.cardBg} rounded-xl border-2 ${pass.borderColor} p-6 flex flex-col text-center`}>
                                        <div className={`flex justify-center items-center gap-2 mb-2 ${pass.color}`}>
                                            <Icon className="w-10 h-10">{pass.icon}</Icon>
                                            <h3 className="text-2xl font-bold">{pass.name}</h3>
                                        </div>
                                        <p className="font-semibold text-3xl mb-4">{pass.price}</p>
                                        
                                        <div className='text-left space-y-4 opacity-80 flex-grow mb-6'>
                                            <div>
                                                <h5 className='font-bold text-sm mb-2'>Что открывает:</h5>
                                                <ul className='space-y-1 text-sm'>
                                                    {pass.unlocks.map(f => <li key={f} className="flex items-start gap-3"><Icon className="w-4 h-4 text-green-400 mt-1 shrink-0">{ICONS.check}</Icon><span>{f}</span></li>)}
                                                </ul>
                                            </div>
                                             <div>
                                                <h5 className='font-bold text-sm mb-2'>Ежемесячные начисления:</h5>
                                                <ul className='space-y-1 text-sm'>
                                                    {pass.monthlyGrants.map(f => {
                                                        const currency = CURRENCIES.find(c=>c.id === f.currency);
                                                        return(<li key={f.currency} className="flex items-center gap-3"><Icon className={`w-4 h-4 ${currency?.color}`}>{currency?.icon}</Icon><span>{f.amount.toLocaleString()} {currency?.name}</span></li>)
                                                    })}
                                                </ul>
                                            </div>
                                             <div>
                                                <h5 className='font-bold text-sm mb-2'>Постоянные привилегии:</h5>
                                                <ul className='space-y-1 text-sm'>
                                                    {pass.perks.map(f => <li key={f} className="flex items-start gap-3"><Icon className="w-4 h-4 text-green-400 mt-1 shrink-0">{ICONS.check}</Icon><span>{f}</span></li>)}
                                                </ul>
                                            </div>
                                        </div>
                                        
                                        <Button onClick={() => handlePackageSelect(pass)} className="w-full mt-auto" variant="primary">Выбрать План</Button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {currencyTab === 'tasks' && <TaskConversionPanel />}
                    </div>
                </div>
            )}
        </div>
    )
}

const TaskConversionPanel = () => {
    const { theme, currencyMap, convertTasks } = useAppContext();
    const [amounts, setAmounts] = useState({ silver: 1, gold: 1, star: 1 });
    const taskBalance = currencyMap['task']?.amount || 0;

    const handleAmountChange = (currency: 'silver' | 'gold' | 'star', value: string) => {
        const numValue = Math.max(1, parseInt(value) || 1);
        setAmounts(prev => ({ ...prev, [currency]: numValue }));
    };

    return (
        <div className="space-y-4">
            <div className="text-center">
                <p className={`${theme.colors.text} text-lg`}>Ваш баланс: <span className="font-bold text-blue-400">{taskBalance.toLocaleString()}</span> жетонов</p>
            </div>
            {(Object.keys(TASK_CONVERSION_RATES) as Array<'silver' | 'gold' | 'star'>).map(currencyId => {
                const currencyInfo = CURRENCIES.find(c => c.id === currencyId)!;
                const rate = TASK_CONVERSION_RATES[currencyId];
                const amount = amounts[currencyId];
                const cost = amount * rate.tasks;
                return (
                    <div key={currencyId} className={`p-4 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 ${theme.colors.cardBg}`}>
                        <div className="flex items-center gap-3">
                            <Icon className={`w-10 h-10 ${currencyInfo.color}`}>{currencyInfo.icon}</Icon>
                            <div>
                                <p className={`font-bold text-lg`}>1 {currencyInfo.name}</p>
                                <p className={`opacity-70 text-sm flex items-center gap-1.5`}>= {rate.tasks} <Icon className="w-4 h-4 text-blue-400">{ICONS.currencyTask}</Icon></p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                             <input type="number" min="1" value={amount} onChange={(e) => handleAmountChange(currencyId, e.target.value)} className={`w-20 text-center p-2 rounded-md ${theme.colors.inputBg} ${theme.colors.border} border`} />
                             <span className={`font-semibold`}>{currencyInfo.name}</span>
                        </div>
                        <div className="flex flex-col items-center w-full md:w-auto">
                            <Button onClick={() => convertTasks(currencyId, amount)} disabled={taskBalance < cost} className="w-full" variant="primary">Обменять</Button>
                            <span className="text-xs opacity-70 mt-1">Стоимость: {cost} жетонов</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Generator;