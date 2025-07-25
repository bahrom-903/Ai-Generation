import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ICONS, AD_PURCHASE_OPTIONS } from '../constants';
import Icon from './Icon';
import type { AdPurchaseOption, PurchaseableItem } from '../types';
import Checkout from './Checkout';


type View = 'options' | 'checkout';

const AdPurchaseModal: React.FC = () => {
    const { setIsAdPurchaseModalOpen, confirmAdPurchase } = useAppContext();
    const [view, setView] = useState<View>('options');
    const [selectedItem, setSelectedItem] = useState<PurchaseableItem | null>(null);

    const handleSelectOption = (option: AdPurchaseOption) => {
        const item: PurchaseableItem = {
            id: option.id,
            name: `Рекламное место (${option.name})`,
            price: option.price,
            currencySymbol: '$',
            description: `Ваша реклама будет видна всем ${option.durationDays} дней.`,
            icon: ICONS.trophy,
            color: 'text-indigo-500',
            originalItem: option
        };
        setSelectedItem(item);
        setView('checkout');
    };

    const handleBackToOptions = () => {
        setView('options');
        setSelectedItem(null);
    };
    
    const handleFinalPurchase = () => {
        if (!selectedItem) return;
        
        confirmAdPurchase(selectedItem.originalItem as AdPurchaseOption);

        alert(`Поздравляем! Покупка рекламного места на "${(selectedItem.originalItem as AdPurchaseOption).name}" прошла успешно. Теперь создайте ваше объявление.`);
    };

    const modalBg = "bg-gray-100 dark:bg-[#1f2233]";
    const modalText = "text-gray-800 dark:text-gray-200";
    const cardBg = "bg-white dark:bg-gray-700/50";
    const border = "border-gray-200 dark:border-gray-600";
    const accentColor = "indigo";

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans" onClick={() => setIsAdPurchaseModalOpen(false)}>
            <div className={`w-full max-w-2xl ${modalBg} rounded-2xl shadow-2xl relative animate-fade-in flex flex-col`} style={{maxHeight: '90vh'}} onClick={(e) => e.stopPropagation()}>
                <header className={`flex items-center justify-between p-4 border-b ${border}`}>
                    <div className={`flex items-center gap-3 ${modalText}`}>
                        <Icon className="w-7 h-7 text-indigo-500">{ICONS.trophy}</Icon>
                        <h2 className="text-xl font-bold">{view === 'options' ? 'Покупка рекламного места' : 'Подтверждение заказа'}</h2>
                    </div>
                    <button onClick={() => setIsAdPurchaseModalOpen(false)} className={`${modalText} opacity-50 hover:opacity-100 transition-colors`}>
                        <Icon className="w-7 h-7">{ICONS.close}</Icon>
                    </button>
                </header>

                <main className="p-6 md:p-8 overflow-y-auto">
                    {view === 'options' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {AD_PURCHASE_OPTIONS.map(opt => (
                                <div key={opt.id} className={`${cardBg} rounded-xl border ${border} p-6 flex flex-col text-center transition-transform hover:scale-105 hover:shadow-lg`}>
                                    <div className="flex-grow">
                                        <h3 className={`text-2xl font-bold ${modalText}`}>{opt.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">рекламы</p>
                                        <p className={`my-4 text-4xl font-bold text-${accentColor}-500`}>${opt.price.toFixed(2)}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleSelectOption(opt)} 
                                        className={`w-full mt-4 bg-${accentColor}-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-${accentColor}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${accentColor}-500 transition shadow-md`}
                                    >
                                        Выбрать
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    {view === 'checkout' && selectedItem && (
                        <Checkout item={selectedItem} onBack={handleBackToOptions} onConfirm={handleFinalPurchase}/>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdPurchaseModal;
