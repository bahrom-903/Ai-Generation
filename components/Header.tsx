import React, { useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ICONS } from '../constants';
import Icon from './Icon';
import CurrencyDisplay from './CurrencyDisplay';
import AccountDropdown from './AccountDropdown';

const Header: React.FC = () => {
  const { theme, setIsSettingsOpen, currencies, vipStatus, setShowStore, setStoreTarget } = useAppContext();

  // Define the sorting order of all currencies
  const currencyOrder = ['silver', 'gold', 'star', 'free', 'task', 'rare', 'epic', 'mythic', 'data'];
  
  const sortedCurrencies = useMemo(() => 
    [...currencies].sort((a, b) => {
      const indexA = currencyOrder.indexOf(a.id);
      const indexB = currencyOrder.indexOf(b.id);
      return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
    }), [currencies]);

  const vipDisplay = {
      'none': { text: 'Нет', color: theme.colors.text },
      'silver': { text: 'Серебро', color: 'text-gray-300' },
      'gold': { text: 'Золото', color: 'text-yellow-400' },
      'star': { text: 'Звезда', color: 'text-yellow-200' },
  };

  return (
    <header className={`p-2 md:p-3 ${theme.colors.main} rounded-b-lg border-b-2 ${theme.colors.border} shadow-lg flex flex-col items-center gap-2`}>
        {/* Top Row: Title and Account Controls */}
        <div className="w-full flex items-center justify-between">
            {/* Spacer to balance the title */}
            <div className="flex-1"></div>
            
            <div className="flex-1 text-center">
                <h1 className={`text-xl md:text-2xl font-bold ${theme.colors.accent} tracking-wider whitespace-nowrap`}>
                    Аниме Галерея AI
                </h1>
            </div>
            
            <div className="flex-1 flex justify-end items-center gap-2">
                 <div className={`flex items-center gap-1 bg-black/10 backdrop-blur-sm p-1.5 rounded-lg text-xs font-semibold border border-white/10`}>
                    <span className="text-yellow-400">VIP:</span>
                    <span className={`${vipDisplay[vipStatus].color}`}>{vipDisplay[vipStatus].text}</span>
                    <button 
                        onClick={() => { setShowStore(true); setStoreTarget({ tab: 'currency', subTab: 'vip' }); }}
                        className={`w-4 h-4 rounded-full bg-white/5 text-white/50 flex items-center justify-center border border-white/20 hover:bg-white/20 hover:text-white transition-colors`}
                        aria-label={`Купить VIP`}
                    >
                        <Icon className="w-3 h-3 m-auto">{ICONS.plus}</Icon>
                    </button>
                </div>
                <AccountDropdown />
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className={`p-1.5 rounded-md hover:bg-white/10 ${theme.colors.text} transition-colors`}
                    aria-label="Открыть настройки"
                >
                    <Icon className="w-7 h-7">{ICONS.menu}</Icon>
                </button>
            </div>
        </div>

        {/* Separator Line */}
        <div className="w-full border-b-2 border-dashed border-white/10"></div>

        {/* Bottom Row: Currencies */}
        <div className="w-full flex justify-center flex-wrap gap-1.5 py-1">
            <CurrencyDisplay currencies={sortedCurrencies} />
        </div>
    </header>
  );
};

export default Header;