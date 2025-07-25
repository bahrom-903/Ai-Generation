import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import Icon from './Icon';
import { ICONS, DOLLAR_RATES } from '../constants';
import { Currency } from '../types';

interface CurrencyDisplayProps {
    currencies: Currency[];
}

const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({ currencies }) => {
  const { theme, setShowStore, setStoreTarget } = useAppContext();
  
  const handlePurchaseClick = (currencyId: string) => {
    setStoreTarget({ tab: 'currency', subTab: currencyId });
    setShowStore(true);
  };

  const handleConvertClick = () => {
    setStoreTarget({ tab: 'currency', subTab: 'tasks' });
    setShowStore(true);
  }

  if (!currencies.length) return null;

  return (
    <div className="flex items-center gap-1.5">
      {currencies.map((currency) => {
        const dollarValue = DOLLAR_RATES[currency.id] ? (currency.amount * DOLLAR_RATES[currency.id]).toFixed(2) : null;
        const description = dollarValue ? `${currency.description} (Примерная стоимость: $${dollarValue})` : currency.description;

        return (
          <div key={currency.id} className="relative group flex items-center gap-1.5 bg-black/20 backdrop-blur-sm p-1.5 rounded-lg text-xs font-semibold border border-white/10">
            <Icon className={`w-4 h-4 ${currency.color}`}>{currency.icon}</Icon>
            <span className={`${theme.colors.text}`}>{currency.amount}</span>
            <span className={`${theme.colors.text} opacity-70 hidden xl:inline`}>{currency.name}</span>
            {currency.plus && (
              <button 
                onClick={() => handlePurchaseClick(currency.id)}
                className={`w-4 h-4 rounded-full bg-white/5 text-white/50 flex items-center justify-center border border-white/20 hover:bg-white/20 hover:text-white transition-colors`}
                aria-label={`Купить ${currency.name}`}
              >
                <Icon className="w-3 h-3 m-auto">{ICONS.plus}</Icon>
              </button>
            )}
            {currency.id === 'task' && (
               <button 
                onClick={handleConvertClick}
                className={`w-4 h-4 rounded-full bg-white/5 text-white/50 flex items-center justify-center border border-white/20 hover:bg-white/20 hover:text-white transition-colors`}
                aria-label={`Конвертировать жетоны`}
              >
                <Icon className="w-3 h-3 m-auto">{ICONS.convert}</Icon>
              </button>
            )}
            {currency.description && (
               <div className="absolute bottom-full mb-2 w-max max-w-[250px] p-2 text-xs text-white bg-black/80 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-50 pointer-events-none">
                  {description}
              </div>
            )}
          </div>
        )
      })}
    </div>
  );
};

export default CurrencyDisplay;