import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppContext } from '../../contexts/AppContext';
import { CREDITS_DATA } from '../../data/credits';
import { CreditId } from '../../types';
import Icon from '../Icon';
import { Icons } from '../../constants';

const CreditBar: React.FC = () => {
    const { currentUser } = useAuth();
    const { theme } = useAppContext();

    if (!currentUser) return null;

    // Filter to show only credits the user has or purchasable ones
    const relevantCredits = Object.values(CREDITS_DATA).filter(
        c => currentUser.credits[c.id] > 0 || c.isPurchasable
    );

    return (
        <div className="flex items-center gap-3 overflow-x-auto py-1 pr-2" style={{scrollbarWidth: 'none'}}>
            {relevantCredits.map(credit => (
                <div 
                    key={credit.id} 
                    className={`flex items-center gap-1.5 p-1.5 rounded-md whitespace-nowrap ${theme.colors.cardBg}`}
                    title={`${credit.name}: ${currentUser.credits[credit.id].toLocaleString('ru-RU')}`}
                >
                    <credit.icon className={`w-5 h-5`} style={{ color: credit.color }} />
                    <span className={`font-semibold text-sm ${theme.colors.text}`}>
                        {currentUser.credits[credit.id].toLocaleString('ru-RU')}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default CreditBar;
