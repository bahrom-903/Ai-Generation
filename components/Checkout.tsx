import React, { useState } from 'react';
import { ICONS } from '../constants';
import Icon from './Icon';
import type { PurchaseableItem } from '../types';

interface CheckoutProps {
    item: PurchaseableItem;
    onBack: () => void;
    onConfirm: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ item, onBack, onConfirm }) => {
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto' | 'platform'>('card');
    
    const baseTabClass = "px-4 py-2 font-semibold text-sm rounded-t-lg transition-colors";
    const activeTabClass = "bg-white dark:bg-gray-700 border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400";
    const inactiveTabClass = "text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50";
    
    return (
        <div className="animate-fade-in">
             <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-4">
                <Icon className="w-4 h-4">{ICONS.back}</Icon>
                Назад к выбору
            </button>

            <div className="bg-white dark:bg-gray-700/50 rounded-lg p-4 mb-6 flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Вы покупаете:</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        {item.icon && <Icon className={`w-6 h-6 ${item.color || ''}`}>{item.icon}</Icon>}
                        {item.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 pl-8">{item.description}</p>
                </div>
                <div>
                     <p className="text-sm text-gray-500 dark:text-gray-400">Сумма к оплате:</p>
                    <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        {item.price.toLocaleString('ru-RU', { style: 'currency', currency: item.currencySymbol === '$' ? 'USD' : 'RUB' })}
                    </p>
                </div>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-600 mb-6">
                <nav className="-mb-px flex gap-4" aria-label="Tabs">
                    <button onClick={() => setPaymentMethod('card')} className={`${baseTabClass} ${paymentMethod === 'card' ? activeTabClass : inactiveTabClass}`}>Банковская карта</button>
                    <button onClick={() => setPaymentMethod('crypto')} className={`${baseTabClass} ${paymentMethod === 'crypto' ? activeTabClass : inactiveTabClass}`}>Криптовалюта</button>
                    <button onClick={() => setPaymentMethod('platform')} className={`${baseTabClass} ${paymentMethod === 'platform' ? activeTabClass : inactiveTabClass}`}>Игровые платформы</button>
                </nav>
            </div>
            
            {paymentMethod === 'card' && <CardPaymentForm onConfirm={onConfirm} />}
            {paymentMethod === 'crypto' && <CryptoPayment onConfirm={onConfirm} />}
            {paymentMethod === 'platform' && <PlatformPayment onConfirm={onConfirm} />}
        </div>
    );
};

const CardPaymentForm = ({ onConfirm }: { onConfirm: () => void }) => {
    return (
        <div className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Номер карты</label>
                <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-3 py-2 bg-gray-200 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Имя владельца</label>
                <input type="text" placeholder="IVAN IVANOV" className="w-full px-3 py-2 bg-gray-200 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Срок действия</label>
                    <input type="text" placeholder="ММ / ГГ" className="w-full px-3 py-2 bg-gray-200 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVC / CVV</label>
                    <input type="text" placeholder="123" className="w-full px-3 py-2 bg-gray-200 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
            </div>
            <button onClick={onConfirm} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 shadow-lg">
                Оплатить
            </button>
        </div>
    )
}

const CryptoPayment = ({ onConfirm }: { onConfirm: () => void }) => {
    const [coin, setCoin] = useState('bitcoin');
    return (
        <div className="text-center">
            <div className="flex justify-center gap-4 mb-4">
                <button onClick={() => setCoin('bitcoin')} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${coin === 'bitcoin' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}><Icon className="w-5 h-5">{ICONS.bitcoin}</Icon> Bitcoin</button>
                <button onClick={() => setCoin('ethereum')} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${coin === 'ethereum' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}><Icon className="w-5 h-5">{ICONS.ethereum}</Icon> Ethereum</button>
                <button onClick={() => setCoin('usdt')} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${coin === 'usdt' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}><Icon className="w-5 h-5">{ICONS.usdt}</Icon> USDT</button>
            </div>
            <p className="mb-4 text-gray-500 dark:text-gray-400">Отправьте {coin.charAt(0).toUpperCase() + coin.slice(1)} на адрес ниже:</p>
            <img src="/qr-code.svg" alt="QR Code" className="w-48 h-48 mx-auto rounded-lg bg-white p-2" />
            <div className="mt-4 p-3 bg-gray-200 dark:bg-gray-900/50 rounded-lg font-mono text-sm break-all">
                bc1qxy2kgdygjrsqtza2n0yrf2493p83kkfjhx0w1h
            </div>
             <button onClick={onConfirm} className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 shadow-lg">
                Я оплатил
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">После отправки средств нажмите на кнопку. Зачисление произойдет после подтверждения транзакции в сети.</p>
        </div>
    )
}

const PlatformPayment = ({ onConfirm }: { onConfirm: () => void }) => {
     return (
        <div className="text-center p-6 bg-gray-200/50 dark:bg-gray-900/50 rounded-lg">
            <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Оплата через Steam</h4>
            <p className="mb-6 text-gray-600 dark:text-gray-400">Вы будете перенаправлены на сайт Steam для завершения платежа. Оплата будет произведена с вашего кошелька Steam.</p>
             <button onClick={onConfirm} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1b2838] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#2c435a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#66c0f4] transition shadow-lg">
                <Icon className="w-6 h-6">{ICONS.steam}</Icon>
                Перейти к оплате в Steam
            </button>
        </div>
    )
}

export default Checkout;
