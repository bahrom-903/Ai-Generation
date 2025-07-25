import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ICONS } from '../constants';
import Icon from './Icon';

const GamesModal: React.FC = () => {
  const { theme, isGamesModalOpen, setIsGamesModalOpen, gamesManifest } = useAppContext();

  if (!isGamesModalOpen) return null;

  const handleClose = () => {
    setIsGamesModalOpen(false);
  };
  
  return (
    <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleClose}
    >
      <div
        className={`w-full max-w-4xl rounded-xl border-2 ${theme.colors.border} ${theme.colors.main} shadow-2xl ${theme.colors.accentGlow} p-6 relative flex flex-col animate-fade-in`}
        onClick={(e) => e.stopPropagation()}
        style={{minHeight: '40vh', maxHeight: '90vh'}}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className={`flex-grow text-3xl font-bold ${theme.colors.accent} text-center`}>
            Игры
          </h2>
          <button onClick={handleClose} className={`p-2 rounded-full ${theme.colors.text} hover:bg-white/10`}>
            <Icon className="w-8 h-8">{ICONS.close}</Icon>
          </button>
        </div>
        <div className="flex-grow flex items-center justify-center text-center overflow-y-auto pr-2">
            {gamesManifest && gamesManifest.games.length > 0 ? (
                <div>Games list will be here</div>
            ) : (
                <div className="max-w-lg">
                    <Icon className={`w-20 h-20 mx-auto ${theme.colors.accent} opacity-50`}>{ICONS.gamepad}</Icon>
                    <p className={`mt-4 text-lg ${theme.colors.text} opacity-80`}>
                        Здесь будут находиться ваши игры.
                    </p>
                    <p className={`${theme.colors.text} opacity-60 mt-2`}>
                        Пока что они в разработке. Присоединяйтесь к сообществу, чтобы узнать всё новое, или будьте внимательны к панели новостей, там будут самые свежие новости.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default GamesModal;
