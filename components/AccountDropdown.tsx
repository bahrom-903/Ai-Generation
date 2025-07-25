import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ICONS } from '../constants';
import Icon from './Icon';

const AccountDropdown: React.FC = () => {
    const { user, logout, theme, setIsProfileOpen } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!user) return null;
    
    const userInitial = user.name.startsWith('Гость') ? 'Г' : user.name.charAt(0).toUpperCase();

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xl overflow-hidden ring-2 ring-offset-2 ring-offset-transparent ring-indigo-500/50">
                 <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.outerHTML = userInitial)} />
            </button>

            {isOpen && (
                <div className={`absolute top-full right-0 mt-2 w-64 rounded-lg shadow-lg ${theme.colors.main} border ${theme.colors.border} z-20 animate-fade-in`}>
                    <div className="p-4 border-b ${theme.colors.border}">
                        <p className={`font-bold ${theme.colors.text}`}>{user.name}</p>
                        <p className={`text-sm ${theme.colors.text} opacity-70 truncate`}>{user.email}</p>
                    </div>
                    <div className="p-2">
                        <button 
                            onClick={() => { setIsProfileOpen(true); setIsOpen(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left ${theme.colors.text} hover:${theme.colors.accent.replace('text-','bg-')} hover:text-black transition-colors`}
                        >
                            <Icon className="w-5 h-5">{ICONS.profile}</Icon>
                            <span>Профиль</span>
                        </button>
                         <button 
                            onClick={logout}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left ${theme.colors.text} hover:${theme.colors.accent.replace('text-','bg-')} hover:text-black transition-colors`}
                        >
                            <Icon className="w-5 h-5">{ICONS.logout}</Icon>
                            <span>Выйти</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountDropdown;
