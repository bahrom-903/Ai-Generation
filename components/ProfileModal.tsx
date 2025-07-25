import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ICONS, DOLLAR_RATES } from '../constants';
import Icon from './Icon';

const ProfileModal: React.FC = () => {
  const { user, currencies, setIsProfileOpen, setShowStore, setStoreTarget, vipStatus, patronStatus } = useAppContext();

  if (!user) return null;

  const handlePurchaseClick = (currencyId: string) => {
    setIsProfileOpen(false);
    setStoreTarget({ tab: 'currency', subTab: currencyId });
    setShowStore(true);
  };
  
  const vipDisplay = {
      'none': { text: 'Нет VIP статуса', color: 'bg-gray-600/50' },
      'silver': { text: 'VIP Серебро', color: 'bg-gray-400/50' },
      'gold': { text: 'VIP Золото', color: 'bg-yellow-500/50' },
      'star': { text: 'VIP Звезда', color: 'bg-yellow-300/50' },
  };

  const currentVip = vipDisplay[vipStatus];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsProfileOpen(false)}>
      <div className="w-full max-w-2xl bg-gradient-to-br from-[#404258] to-[#2f3143] rounded-2xl shadow-2xl p-6 md:p-8 text-white border border-white/10 relative animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setIsProfileOpen(false)} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
          <Icon className="w-8 h-8">{ICONS.close}</Icon>
        </button>

        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border-4 border-indigo-500/80 shadow-lg" />
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold">{user.name}</h2>
            <p className="text-white/70">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
                <div className={`px-3 py-1 ${currentVip.color} rounded-full text-sm inline-block border border-white/10`}>{currentVip.text}</div>
                {patronStatus && (
                    <div className={`px-3 py-1 bg-cyan-500/50 rounded-full text-sm inline-block border border-white/10 font-bold text-cyan-200`}>{patronStatus}</div>
                )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4 text-indigo-300">Кошелёк</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {currencies.map(currency => {
              const dollarValue = DOLLAR_RATES[currency.id] ? (currency.amount * DOLLAR_RATES[currency.id]).toFixed(2) : null;

              return (
                <div key={currency.id} className="bg-[#484a62]/80 p-4 rounded-xl flex items-center justify-between border border-white/10 shadow-md relative group">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-6 h-6 ${currency.color}`}>{currency.icon}</Icon>
                    <div>
                      <p className="font-bold text-xl">{currency.amount}</p>
                      <p className="text-white/70 text-sm">{currency.name}</p>
                    </div>
                  </div>
                  {currency.plus && (
                    <button 
                      onClick={() => handlePurchaseClick(currency.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
                      aria-label={`Купить ${currency.name}`}
                    >
                      <Icon className="w-5 h-5">{ICONS.plus}</Icon>
                    </button>
                  )}
                  {dollarValue && (
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max p-2 text-xs text-white bg-black/80 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10 pointer-events-none">
                          Примерная стоимость: ${dollarValue}
                      </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;