import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppContext } from '../../contexts/AppContext';
import { CREDITS_DATA } from '../../data/credits';
import { Credit, CreditId } from '../../types';
import Modal from './Modal';
import Icon from '../Icon';
import { Icons } from '../../constants';

const ProfileModal: React.FC = () => {
    const { currentUser, showPurchaseModal } = useAuth();
    const { theme } = useAppContext();

    if (!currentUser) return null;

    return (
        <Modal title="Профиль" show>
            <div className="flex flex-col items-center gap-4 mb-6">
                 <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center font-bold text-4xl border-4 ${theme.colors.border}`}
                    style={{ backgroundColor: theme.colors.accent.replace('text-', 'bg-'), color: theme.colors.bg.includes('dark') ? 'black' : 'white' }}
                >
                    {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-center">
                    <h3 className={`text-2xl font-bold ${theme.colors.text}`}>{currentUser.name}</h3>
                    <p className={`${theme.colors.text} opacity-70`}>{currentUser.email}</p>
                </div>
            </div>

            <div className="mb-6">
                <h4 className={`text-lg font-semibold mb-2 ${theme.colors.accent}`}>VIP Статус</h4>
                <div className="w-full bg-black/20 rounded-full h-2.5">
                    <div className={`${theme.colors.accent.replace('text-', 'bg-')} h-2.5 rounded-full`} style={{ width: `${currentUser.vipProgress}%` }}></div>
                </div>
            </div>
            
            <div>
                 <h4 className={`text-lg font-semibold mb-4 ${theme.colors.accent}`}>Кошелек</h4>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                     {Object.values(CREDITS_DATA).map(credit => (
                         <CreditWalletCard key={credit.id} credit={credit} amount={currentUser.credits[credit.id]}/>
                     ))}
                 </div>
            </div>
        </Modal>
    );
};

const CreditWalletCard: React.FC<{credit: Credit, amount: number}> = ({ credit, amount }) => {
    const { theme } = useAppContext();
    const { showPurchaseModal, closeModals } = useAuth();
    const creditPackages = []; // In a real app, you would filter packages for this credit type.

    const handlePurchase = () => {
        // For simplicity, we assume there's one package type per purchasable credit.
        // In a real app, you might show a selection.
        const pkg = { id: `${credit.id}_purchase`, creditId: credit.id, amount: 100, price: 99 }; // Dummy package
        closeModals(); // Close profile modal first
        setTimeout(() => showPurchaseModal(pkg), 200); // Open purchase modal after a short delay
    }

    return (
        <div className={`p-4 rounded-lg flex flex-col items-center justify-center text-center border ${theme.colors.border} ${theme.colors.cardBg}`}>
            <credit.icon className="w-8 h-8" style={{color: credit.color}}/>
            <span className={`text-xl font-bold mt-2 ${theme.colors.text}`}>{amount.toLocaleString('ru-RU')}</span>
            <span className={`${theme.colors.text} opacity-70 text-sm`}>{credit.name}</span>
            {credit.isPurchasable && (
                <button onClick={handlePurchase} className={`mt-2 p-1.5 rounded-full ${theme.colors.inputBg} hover:bg-white/20 transition`}>
                    <Icon className="w-5 h-5">{Icons.plus}</Icon>
                </button>
            )}
        </div>
    )
}

export default ProfileModal;
