import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppContext } from '../../contexts/AppContext';
import Icon from '../Icon';
import { Icons } from '../../constants';

const AuthControl: React.FC = () => {
    const { currentUser, showAuthModal } = useAuth();

    if (!currentUser) {
        return (
            <button
                onClick={showAuthModal}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Войти или зарегистрироваться"
            >
                <Icon className="w-8 h-8">
                    {Icons.profile}
                </Icon>
            </button>
        );
    }

    return <UserMenu />;
};

const UserMenu: React.FC = () => {
    const { currentUser, logout, showProfileModal } = useAuth();
    const { theme } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsOpen(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!currentUser) return null;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 ${theme.colors.border}`}
                style={{ backgroundColor: theme.colors.accent.replace('text-', 'bg-'), color: theme.colors.bg.includes('dark') ? 'black' : 'white' }}
                aria-label="Меню пользователя"
            >
                {currentUser.name.charAt(0).toUpperCase()}
            </button>

            {isOpen && (
                <div ref={menuRef} className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${theme.colors.main} ${theme.colors.border} border z-20 animate-fade-in`}>
                    <div className="py-1">
                        <button onClick={() => { showProfileModal(); setIsOpen(false); }} className={`flex items-center gap-3 w-full text-left px-4 py-2 text-sm ${theme.colors.text} hover:${theme.colors.accent.replace('text-','bg-')} hover:text-black`}>
                            <Icon className="w-5 h-5">{Icons.profile}</Icon>
                            Профиль
                        </button>
                        <button onClick={logout} className={`flex items-center gap-3 w-full text-left px-4 py-2 text-sm ${theme.colors.text} hover:${theme.colors.accent.replace('text-','bg-')} hover:text-black`}>
                            <Icon className="w-5 h-5">{Icons.logout}</Icon>
                            Выйти
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


export default AuthControl;
