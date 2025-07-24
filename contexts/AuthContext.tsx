import React, { createContext, useContext, useState, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { User, AuthContextType, ModalState, CreditPackage } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple hashing function for demonstration. 
// DO NOT USE THIS IN PRODUCTION. Use a proper library like bcrypt.
const simpleHash = (s: string) => {
    let h = 0;
    for(let i = 0; i < s.length; i++) {
        h = Math.imul(31, h) + s.charCodeAt(i) | 0;
    }
    return h.toString();
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [users, setUsers] = useLocalStorage<User[]>('app-users', []);
    const [currentUser, setCurrentUser] = useLocalStorage<User | null>('app-current-user', null);
    const [modalState, setModalState] = useState<ModalState>({ auth: false, profile: false, purchase: null });

    const register = (name: string, email: string, password: string): boolean => {
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            alert('Пользователь с таким email уже существует.');
            return false;
        }
        const newUser: User = {
            id: crypto.randomUUID(),
            name,
            email,
            passwordHash: simpleHash(password),
            credits: {
                free: 5,
                dataCoin: 15000,
                gold: 0,
                silver: 0,
                star: 0,
                task: 0,
                rare: 0,
                mythic: 0,
                epic: 0
            },
            vipProgress: 0
        };
        setUsers([...users, newUser]);
        setCurrentUser(newUser);
        closeModals();
        return true;
    };

    const login = (email: string, password: string): boolean => {
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user && user.passwordHash === simpleHash(password)) {
            setCurrentUser(user);
            closeModals();
            return true;
        }
        alert('Неверный email или пароль.');
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
    };
    
    const purchaseCredits = (pkg: CreditPackage) => {
        if (!currentUser) return;

        const updatedUser = { ...currentUser, credits: { ...currentUser.credits }};
        updatedUser.credits[pkg.creditId] += pkg.amount;
        if (pkg.bonus) {
            updatedUser.credits[pkg.bonus.creditId] += pkg.bonus.amount;
        }

        // Update user in the main list and in current session
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        setCurrentUser(updatedUser);
        closeModals();
        alert(`Покупка успешна! Начислено ${pkg.amount} ${pkg.creditId}.`);
    };

    // Modal controls
    const showAuthModal = () => setModalState({ auth: true, profile: false, purchase: null });
    const showProfileModal = () => setModalState({ auth: false, profile: true, purchase: null });
    const showPurchaseModal = (pkg: CreditPackage) => setModalState({ auth: false, profile: false, purchase: pkg });
    const closeModals = () => setModalState({ auth: false, profile: false, purchase: null });


    const value = {
        users,
        currentUser,
        login,
        register,
        logout,
        purchaseCredits,
        modalState,
        showAuthModal,
        showProfileModal,
        showPurchaseModal,
        closeModals
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
