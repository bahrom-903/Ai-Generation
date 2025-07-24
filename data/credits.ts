import React from 'react';
import { Credit, CreditId, CreditPackage } from '../types';
import { Icons } from '../constants';
import Icon from '../components/Icon';


export const CREDITS_DATA: Record<CreditId, Credit> = {
    free: { id: 'free', name: 'Free', icon: (props) => React.createElement(Icon, {...props, children: Icons.star}), color: '#a855f7', isPurchasable: false },
    dataCoin: { id: 'dataCoin', name: 'DataCoin', icon: (props) => React.createElement(Icon, {...props, children: Icons.dataCoin}), color: '#22d3ee', isPurchasable: false },
    gold: { id: 'gold', name: 'Gold', icon: (props) => React.createElement(Icon, {...props, children: Icons.goldCoin}), color: '#facc15', isPurchasable: true },
    silver: { id: 'silver', name: 'Silver', icon: (props) => React.createElement(Icon, {...props, children: Icons.silverCoin}), color: '#d1d5db', isPurchasable: true },
    star: { id: 'star', name: 'Star', icon: (props) => React.createElement(Icon, {...props, children: Icons.star}), color: '#f97316', isPurchasable: true },
    task: { id: 'task', name: 'Task', icon: (props) => React.createElement(Icon, {...props, children: Icons.check}), color: '#4ade80', isPurchasable: false },
    rare: { id: 'rare', name: 'Rare', icon: (props) => React.createElement(Icon, {...props, children: Icons.trophy}), color: '#6366f1', isPurchasable: false },
    mythic: { id: 'mythic', name: 'Mythic', icon: (props) => React.createElement(Icon, {...props, children: Icons.generate}), color: '#ec4899', isPurchasable: false },
    epic: { id: 'epic', name: 'Epic', icon: (props) => React.createElement(Icon, {...props, children: Icons.heart}), color: '#ef4444', isPurchasable: false },
};

export const CREDIT_PACKAGES: CreditPackage[] = [
    // Silver (bonus: Rare)
    { id: 'silver_1', creditId: 'silver', amount: 1000, price: 99, bonus: { creditId: 'rare', amount: 10 } },
    { id: 'silver_2', creditId: 'silver', amount: 5500, price: 499, bonus: { creditId: 'rare', amount: 60 } },
    { id: 'silver_3', creditId: 'silver', amount: 12000, price: 999, bonus: { creditId: 'rare', amount: 150 } },

    // Gold (bonus: Mythic)
    { id: 'gold_1', creditId: 'gold', amount: 10, price: 99, bonus: { creditId: 'mythic', amount: 1 } },
    { id: 'gold_2', creditId: 'gold', amount: 55, price: 499, bonus: { creditId: 'mythic', amount: 6 } },
    { id: 'gold_3', creditId: 'gold', amount: 120, price: 999, bonus: { creditId: 'mythic', amount: 15 } },

    // Star (bonus: Mythic)
    { id: 'star_1', creditId: 'star', amount: 100, price: 249, bonus: { creditId: 'mythic', amount: 5 } },
    { id: 'star_2', creditId: 'star', amount: 500, price: 999, bonus: { creditId: 'mythic', amount: 30 } },
    { id: 'star_3', creditId: 'star', amount: 1500, price: 2499, bonus: { creditId: 'mythic', amount: 100 } },
];