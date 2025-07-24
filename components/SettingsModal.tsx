import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Icons, THEMES, BACKGROUNDS } from '../constants';
import Icon from './Icon';
import { sendFeedback } from '../services/telegramService';
import Button from './Button';

type Panel = 'main' | 'themes' | 'changelog' | 'backgrounds' | 'report' | 'idea';

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
          case 'report': return 'Сообщить о проблеме';
          case 'idea': return 'Предложить идею';
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
       case 'report':
        return <FeedbackPanel type="Bug Report" placeholder="Например: Когда я нажимаю 'Экспорт', ничего не происходит..." />;
      case 'idea':
        return <FeedbackPanel type="Idea Suggestion" placeholder="Например: Было бы круто добавить возможность менять размер картинки..." />;
      default:
        return (
            <>
                <SettingsButton icon={Icons.theme} text="Темы" onClick={() => setActivePanel('themes')} />
                <SettingsButton icon={Icons.bg} text="Фоны" onClick={() => setActivePanel('backgrounds')} />
                <SettingsButton icon={Icons.trophy} text="Зал Славы и Версии" onClick={() => setActivePanel('changelog')} />
                <SettingsButton icon={Icons.bug} text="Сообщить о проблеме" onClick={() => setActivePanel('report')} />
                <SettingsButton icon={Icons.idea} text="Предложить идею" onClick={() => setActivePanel('idea')} />
                <button
                    onClick={handleClearGallery}
                    className={`w-full flex items-center justify-center gap-4 p-4 rounded-lg ${theme.colors.cardBg} hover:bg-red-500/20 text-red-400 border border-transparent hover:border-red-500 transition-all duration-200`}
                >
                    <Icon className="w-6 h-6">{Icons.delete}</Icon>
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
        className={`w-full max-w-2xl rounded-xl border-2 ${theme.colors.border} ${theme.colors.main} shadow-2xl ${theme.colors.accentGlow} p-6 relative flex flex-col animate-fade-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          {activePanel !== 'main' && (
             <button onClick={() => setActivePanel('main')} className={`p-2 rounded-full ${theme.colors.text} hover:bg-white/10`}>
                <Icon className="w-8 h-8">{Icons.back}</Icon>
            </button>
          )}
          <h2 className={`flex-grow text-3xl font-bold ${theme.colors.accent} text-center`}>
            {getTitle()}
          </h2>
          <button onClick={handleClose} className={`p-2 rounded-full ${theme.colors.text} hover:bg-white/10`}>
            <Icon className="w-8 h-8">{Icons.close}</Icon>
          </button>
        </div>
        <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-2">
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

const ThemesPanel: React.FC = () => {
    const { theme, setThemeById } = useAppContext();
    return (
        <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {THEMES.map(t => (
                    <button 
                        key={t.id}
                        onClick={() => setThemeById(t.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${theme.id === t.id ? `${theme.colors.border} ${theme.colors.accentGlow.replace('shadow-[', 'shadow-md shadow-')}` : 'border-transparent hover:border-gray-500'}`}
                    >
                        <div className={`w-full h-16 rounded ${t.colors.bg} border-2 ${t.colors.border} mb-2 flex items-center justify-center`}>
                           <div className={`w-1/2 h-1/2 rounded ${t.colors.main} flex items-center justify-center`}>
                             <div style={{color: t.colors.accent.replace('text-','')}} className={`w-4 h-4 rounded-full ${t.colors.accent.replace('text-', 'bg-')}`}></div>
                           </div>
                        </div>
                        <span className={`${theme.colors.text} font-semibold`}>{t.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

const BackgroundsPanel: React.FC = () => {
    const { theme, setAppBackground, appBackground } = useAppContext();
    
    return (
        <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {BACKGROUNDS.map(bg => {
                    const bgPath = `/backgrounds/${bg.id}`;
                    const isSelected = appBackground === bgPath;
                    return (
                        <button 
                            key={bg.id}
                            onClick={() => setAppBackground(bgPath)}
                            className={`p-2 rounded-lg border-2 transition-all ${isSelected ? `${theme.colors.border} ${theme.colors.accentGlow.replace('shadow-[', 'shadow-md shadow-')}` : 'border-transparent hover:border-gray-500'}`}
                        >
                            <div 
                                className="w-full h-24 bg-cover bg-center rounded mb-2"
                                style={{backgroundImage: `url(${bgPath})`}}
                            >
                            </div>
                            <span className={`${theme.colors.text} font-semibold capitalize`}>{bg.name.replace('.jpg', '').replace('.png','').replace('-', ' ')}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

const FeedbackPanel: React.FC<{ type: 'Bug Report' | 'Idea Suggestion'; placeholder: string; }> = ({ type, placeholder }) => {
    const { theme } = useAppContext();
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) {
            alert('Пожалуйста, введите ваше сообщение.');
            return;
        }
        setStatus('sending');
        try {
            await sendFeedback({ type, message });
            setStatus('success');
            setMessage('');
            setTimeout(() => setStatus('idle'), 3000);
        } catch (error) {
            setStatus('error');
            console.error(error);
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <p className={`${theme.colors.text} opacity-80`}>
                {type === 'Bug Report'
                    ? 'Пожалуйста, опишите проблему как можно подробнее. Что вы делали, когда она возникла?'
                    : 'Есть идея, как сделать сервис лучше? Расскажите!'}
            </p>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={placeholder}
                className={`w-full p-3 rounded-md border ${theme.colors.border} ${theme.colors.inputBg} ${theme.colors.text} focus:ring-2 focus:ring-fuchsia-500 focus:outline-none transition-all min-h-[150px]`}
                rows={5}
                disabled={status === 'sending'}
            />
            <div className="flex justify-end">
                <Button type="submit" variant="primary" disabled={status === 'sending'}>
                    {status === 'sending' && 'Отправка...'}
                    {status === 'idle' && 'Отправить'}
                    {status === 'success' && 'Отправлено!'}
                    {status === 'error' && 'Ошибка'}
                </Button>
            </div>
             {status === 'success' && <p className="text-green-400 text-sm text-center">Спасибо за ваш отзыв!</p>}
             {status === 'error' && <p className="text-red-400 text-sm text-center">Не удалось отправить. Попробуйте позже.</p>}
        </form>
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