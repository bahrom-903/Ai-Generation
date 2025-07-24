import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppContext } from '../../contexts/AppContext';
import { CreditPackage, PaymentMethod } from '../../types';
import { CREDIT_PACKAGES, CREDITS_DATA } from '../../data/credits';
import Modal from './Modal';
import Button from '../Button';
import Icon from '../Icon';
import { Icons } from '../../constants';


interface PurchaseModalProps {
    packageToBuy: CreditPackage;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ packageToBuy }) => {
    const [selectedPackage, setSelectedPackage] = useState<CreditPackage>(packageToBuy);
    const [step, setStep] = useState(1); // 1 for package selection, 2 for payment

    const creditInfo = CREDITS_DATA[selectedPackage.creditId];

    return (
        <Modal title={`Покупка ${creditInfo.name}`} show onBack={step === 2 ? () => setStep(1) : undefined}>
            {step === 1 && (
                <PackageSelection 
                    creditId={creditInfo.id}
                    onPackageSelect={(pkg) => {
                        setSelectedPackage(pkg);
                        setStep(2);
                    }}
                />
            )}
            {step === 2 && <PaymentScreen selectedPackage={selectedPackage} />}
        </Modal>
    );
};

const PackageSelection: React.FC<{creditId: string, onPackageSelect: (pkg: CreditPackage) => void}> = ({ creditId, onPackageSelect }) => {
    const { theme } = useAppContext();
    const packages = CREDIT_PACKAGES.filter(p => p.creditId === creditId);
    
    return (
        <div className="space-y-3">
            <p className={`${theme.colors.text} opacity-80 text-center mb-4`}>Выберите подходящий пакет:</p>
            {packages.map(pkg => (
                <button
                    key={pkg.id}
                    onClick={() => onPackageSelect(pkg)}
                    className={`w-full p-4 rounded-lg border text-left flex justify-between items-center transition-all ${theme.colors.border} ${theme.colors.cardBg} hover:border-fuchsia-400 hover:ring-2 hover:ring-fuchsia-400/50`}
                >
                    <div>
                        <div className="flex items-center gap-2">
                            <CREDITS_DATA[pkg.creditId].icon className="w-6 h-6" style={{color: CREDITS_DATA[pkg.creditId].color}}/>
                            <span className={`${theme.colors.text} text-lg font-bold`}>{pkg.amount.toLocaleString('ru-RU')}</span>
                        </div>
                        {pkg.bonus && (
                             <div className={`flex items-center gap-2 mt-1 text-xs ${theme.colors.text} opacity-70`}>
                                <Icon className="w-4 h-4">{Icons.plus}</Icon>
                                <span>{pkg.bonus.amount.toLocaleString('ru-RU')} {CREDITS_DATA[pkg.bonus.creditId].name} в подарок</span>
                            </div>
                        )}
                    </div>
                    <div className={`${theme.colors.accent} text-lg font-semibold`}>
                        {pkg.price} ₽
                    </div>
                </button>
            ))}
        </div>
    )
}

const PaymentScreen: React.FC<{selectedPackage: CreditPackage}> = ({ selectedPackage }) => {
    const [activeTab, setActiveTab] = useState<PaymentMethod>('card');
    const { purchaseCredits } = useAuth();
    
    // In a real app, payment processing would happen here.
    // For this simulation, we'll just confirm the purchase.
    const handleConfirmPurchase = () => {
        purchaseCredits(selectedPackage);
    }
    
    return (
        <div>
             <div className="mb-4 border-b border-white/10">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    <PaymentTab id="card" activeTab={activeTab} setActiveTab={setActiveTab}>Банковская карта</PaymentTab>
                    <PaymentTab id="crypto" activeTab={activeTab} setActiveTab={setActiveTab}>Криптовалюта</PaymentTab>
                    <PaymentTab id="steam" activeTab={activeTab} setActiveTab={setActiveTab}>Steam</PaymentTab>
                </nav>
            </div>
            <div className="py-4">
                {activeTab === 'card' && <CardPaymentForm />}
                {activeTab === 'crypto' && <p className="text-center text-gray-400">Симуляция оплаты криптовалютой.</p>}
                {activeTab === 'steam' && <p className="text-center text-gray-400">Симуляция оплаты через Steam.</p>}
            </div>
            <Button onClick={handleConfirmPurchase} variant="primary" className="w-full mt-4">
                Оплатить {selectedPackage.price} ₽
            </Button>
        </div>
    )
}

const PaymentTab: React.FC<{id: PaymentMethod, activeTab: PaymentMethod, setActiveTab: (id: PaymentMethod) => void, children: React.ReactNode}> = ({ id, activeTab, setActiveTab, children }) => (
     <button
        onClick={() => setActiveTab(id)}
        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === id ? 'border-fuchsia-400 text-fuchsia-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
    >
        {children}
    </button>
)

const CardPaymentForm: React.FC = () => {
     const { theme } = useAppContext();
     const InputField = (props: any) => (
        <input {...props} className={`w-full p-3 rounded-md border ${theme.colors.border} ${theme.colors.inputBg} ${theme.colors.text} focus:ring-2 focus:ring-fuchsia-500 focus:outline-none transition-all`}/>
     )
     return (
        <div className="space-y-4">
            <InputField placeholder="Номер карты" />
            <InputField placeholder="Имя владельца"/>
            <div className="flex gap-4">
                <InputField placeholder="ММ / ГГ" />
                <InputField placeholder="CVC" />
            </div>
        </div>
     )
}


export default PurchaseModal;
