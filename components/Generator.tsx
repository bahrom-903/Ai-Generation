import React, { useState, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ART_STYLES, Icons, DIMENSION_PRESETS, FINE_TUNED_MODELS } from '../constants';
import { generateImages } from '../services/geminiService';
import Button from './Button';
import Icon from './Icon';
import { GeneratedImage, GenerationConfig, DimensionPreset } from '../types';

type GeneratorTab = 'settings' | 'models' | 'image-to-image';

const Generator: React.FC = () => {
  const { theme, addImages, setIsLoading, isLoading } = useAppContext();
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [styleId, setStyleId] = useState(ART_STYLES[0].id);
  const [previewImages, setPreviewImages] = useState<GeneratedImage[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState<GeneratorTab>('settings');
  
  const [generationConfig, setGenerationConfig] = useState<GenerationConfig>({
    numberOfImages: 1,
    width: 1024,
    height: 768,
    isPhotoreal: false,
    isAlchemy: true,
    guidanceScale: 7,
    isTiling: false,
    isBlackAndWhite: false,
    isAnime: false,
    isCartoon: false,
    isMedieval: false,
    sourceImage: null,
    fineTunedModelId: null,
  });

  const handleConfigChange = (key: keyof GenerationConfig, value: any) => {
    setGenerationConfig(prev => ({ ...prev, [key]: value }));
  };
  
  const handleDimensionChange = (dim: DimensionPreset) => {
      // Deselect other group
      const newConfig = { ...generationConfig, width: dim.w, height: dim.h };
      setGenerationConfig(newConfig);
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Пожалуйста, введите идею для генерации.');
      return;
    }
    setIsLoading(true);
    setPreviewImages([]); // Clear previous preview
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
  
  const mainPanelClasses = `${theme.colors.main.replace('bg-','bg-')}/60 backdrop-blur-sm`;

  return (
    <div className={`p-4 md:p-6 my-4 rounded-lg border-2 ${theme.colors.border} ${mainPanelClasses} shadow-lg`}>
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
        <select
          value={styleId}
          onChange={(e) => setStyleId(e.target.value)}
          className={`w-full p-3 rounded-md border ${theme.colors.border} ${theme.colors.inputBg} ${theme.colors.text} focus:ring-2 focus:ring-fuchsia-500 focus:outline-none transition-all appearance-none`}
          disabled={isLoading}
        >
          {ART_STYLES.map(style => (
            <option key={style.id} value={style.id} className={`${theme.colors.main} ${theme.colors.text}`}>
              {style.name}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          <Button onClick={handleGenerate} disabled={isLoading} variant="primary">
            <Icon>{Icons.generate}</Icon>
            {isLoading ? 'Генерация...' : 'Сгенерировать AI'}
          </Button>
          <Button onClick={() => alert('Поиск в сети пока не реализован')} disabled={isLoading} variant="secondary">
            <Icon>{Icons.search}</Icon>
            Найти в сети
          </Button>
           <Button onClick={() => alert('Функция в разработке')} disabled={isLoading} variant="secondary">
            <Icon>{Icons.random}</Icon>
            Случайное
          </Button>
          <Button onClick={handleRandomPrompt} disabled={isLoading} variant="secondary">
            <Icon>{Icons.random}</Icon>
            Случайный промпт
          </Button>
        </div>
        
        {/* Advanced Settings */}
        <div className={`pt-2 border-t-2 ${theme.colors.border} border-dashed`}>
          <button onClick={() => setShowAdvanced(!showAdvanced)} className={`w-full text-center py-2 ${theme.colors.text} opacity-80 hover:opacity-100`}>
             {showAdvanced ? 'Скрыть продвинутые настройки' : 'Показать продвинутые настройки'}
          </button>
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
        </div>
      </div>
       {/* Generation Preview Area */}
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
            <div className="flex gap-4 mt-4">
                <Button onClick={handleSavePreview} variant="primary">
                    <Icon>{Icons.save}</Icon>
                    Готово
                </Button>
                <Button onClick={handleCancelPreview} variant="secondary">
                    <Icon>{Icons.cancel}</Icon>
                    Отменить
                </Button>
            </div>
         </div>
      )}
    </div>
  );
};

// --- Sub-components for Tabs ---

const TabButton = ({ isActive, onClick, children }: { isActive: boolean, onClick: () => void, children: React.ReactNode }) => {
    const { theme } = useAppContext();
    return (
        <button onClick={onClick} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${isActive ? `${theme.colors.accent.replace('text-','bg-')} text-black` : `bg-white/10 ${theme.colors.text} hover:bg-white/20`}`}>
            {children}
        </button>
    )
}

const SettingsPanel = ({ config, onConfigChange, onDimensionChange }: { config: GenerationConfig, onConfigChange: (k: any, v: any) => void, onDimensionChange: (d: DimensionPreset) => void }) => {
    const { theme, isLoading } = useAppContext();
    const SettingsGroup: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
        <div className={className}>
          <h4 className={`${theme.colors.accent} font-semibold mb-3 text-sm`}>{title}</h4>
          {children}
        </div>
    );
    const SimpleToggle = ({ label, checked, onChange }: {label: string, checked: boolean, onChange: (checked: boolean) => void}) => (
        <div className="flex items-center justify-between py-1">
          <span className={`${theme.colors.text} text-sm`}>{label}</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" disabled={isLoading} />
            <div className={`w-11 h-6 ${theme.colors.inputBg} rounded-full peer peer-focus:ring-2 ${theme.colors.border} peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:${theme.colors.accent.replace('text-','bg-')}`}></div>
          </label>
        </div>
      );
    const ValueSelector = ({ options, value, onChange }: { options: (string | number)[], value: string | number, onChange: (v: any) => void }) => (
        <div className="flex items-center gap-x-2 gap-y-2 flex-wrap">
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 text-center ${value === opt ? `${theme.colors.accent.replace('text-','bg-')} text-black` : `bg-black/20 ${theme.colors.text} hover:opacity-80`}`}
            >
              {opt}
            </button>
          ))}
        </div>
    );
    
    return(
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SettingsGroup title="Количество изображений" className="flex-shrink-0">
                    <ValueSelector options={[1, 2, 3, 4]} value={config.numberOfImages} onChange={(v) => onConfigChange('numberOfImages', v)} />
                </SettingsGroup>
                <SettingsGroup title="Следование промпту" className="flex-shrink-0">
                    <ValueSelector options={[3, 5, 7, 11, 15]} value={config.guidanceScale} onChange={(v) => onConfigChange('guidanceScale', v)} />
                </SettingsGroup>
                 <SettingsGroup title="Дополнительно" className="flex-shrink-0">
                   <div className="space-y-1">
                       <SimpleToggle label="PhotoReal" checked={config.isPhotoreal} onChange={(c) => onConfigChange('isPhotoreal', c)} />
                       <SimpleToggle label="Alchemy" checked={config.isAlchemy} onChange={(c) => onConfigChange('isAlchemy', c)} />
                       <SimpleToggle label="Текстура (Tiling)" checked={config.isTiling} onChange={(c) => onConfigChange('isTiling', c)} />
                       <SimpleToggle label="Черно-белый" checked={config.isBlackAndWhite} onChange={(c) => onConfigChange('isBlackAndWhite', c)} />
                       <SimpleToggle label="Аниме" checked={config.isAnime} onChange={(c) => onConfigChange('isAnime', c)} />
                       <SimpleToggle label="Мультфильм" checked={config.isCartoon} onChange={(c) => onConfigChange('isCartoon', c)} />
                       <SimpleToggle label="Средневековье" checked={config.isMedieval} onChange={(c) => onConfigChange('isMedieval', c)} />
                   </div>
                </SettingsGroup>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-dashed border-white/10">
                <SettingsGroup title="Разрешение (Стандартное)">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {DIMENSION_PRESETS.filter(d => d.group === 'standard').map(dim => (
                            <button key={`${dim.w}x${dim.h}`} onClick={() => onDimensionChange(dim)}
                                className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 text-center ${config.width === dim.w && config.height === dim.h ? `${theme.colors.accent.replace('text-','bg-')} text-black` : `${theme.colors.inputBg} ${theme.colors.text} hover:bg-white/10`}`}>
                                {`${dim.w} x ${dim.h}`}
                            </button>
                        ))}
                    </div>
                </SettingsGroup>
                <SettingsGroup title="Разрешение (Квадратное)">
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                       {DIMENSION_PRESETS.filter(d => d.group === 'square').map(dim => (
                            <button key={`${dim.w}x${dim.h}`} onClick={() => onDimensionChange(dim)}
                                className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 text-center ${config.width === dim.w && config.height === dim.h ? `${theme.colors.accent.replace('text-','bg-')} text-black` : `${theme.colors.inputBg} ${theme.colors.text} hover:bg-white/10`}`}>
                                {`${dim.w} x ${dim.h}`}
                            </button>
                        ))}
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
                            <Icon className={`w-12 h-12 ${theme.colors.text} opacity-50 mx-auto`}>{Icons.upload}</Icon>
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

export default Generator;