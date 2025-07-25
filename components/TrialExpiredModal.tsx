import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ICONS } from '../constants';
import Icon from './Icon';
import Button from './Button';

const TrialExpiredModal: React.FC = () => {
    const { theme, setIsTrialExpiredModalOpen, setShowStore, setStoreTarget } = useAppContext();

    const handleClose = () => {
        setIsTrialExpiredModalOpen(false);
    };

    const handleViewVip = () => {
        handleClose();
        setShowStore(true);
        setStoreTarget({ tab: 'currency', subTab: 'vip' });
    }

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleClose}
        >
            <div
                className={`w-full max-w-lg rounded-xl border-2 ${theme.colors.border} ${theme.colors.main} shadow-2xl ${theme.colors.accentGlow} p-8 relative flex flex-col items-center text-center animate-fade-in`}
                onClick={(e) => e.stopPropagation()}
            >
                <Icon className={`w-20 h-20 mx-auto ${theme.colors.accent} mb-4`}>{ICONS.lock}</Icon>
                <h2 className={`text-3xl font-bold ${theme.colors.accent}`}>Ваш пробный период завершен!</h2>
                <p className={`mt-4 text-lg ${theme.colors.text} opacity-80`}>
                    Приобретите любой VIP-статус, чтобы навсегда разблокировать ежедневные бесплатные генерации и увеличить их количество!
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
                    <Button onClick={handleViewVip} variant="primary" className="w-full">
                        Посмотреть VIP-статусы
                    </Button>
                    <Button onClick={handleClose} variant="secondary" className="w-full">
                        Закрыть
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TrialExpiredModal;
