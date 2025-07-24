import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Icons } from '../constants';
import Icon from './Icon';
import CreditBar from './auth/CreditBar';
import AuthControl from './auth/AuthControl';
import { useAuth } from '../contexts/AuthContext';


const Header: React.FC = () => {
  const { theme, setIsSettingsOpen } = useAppContext();
  const { currentUser } = useAuth();

  return (
    <header className={`p-4 ${theme.colors.main} rounded-b-lg border-b-2 ${theme.colors.border} shadow-lg flex justify-between items-center gap-4`}>
      <div className="flex-1 flex justify-start">
        {currentUser && <CreditBar />}
      </div>
      
      <h1 className={`text-lg md:text-2xl font-bold ${theme.colors.accent} tracking-wider text-center whitespace-nowrap`}>
        Аниме Галерея <span className="hidden sm:inline">AI-генератор</span>
      </h1>

      <div className="flex-1 flex justify-end items-center gap-2">
        <AuthControl />
        <button
          onClick={() => setIsSettingsOpen(true)}
          className={`p-2 rounded-md hover:bg-white/10 ${theme.colors.text} transition-colors`}
          aria-label="Открыть настройки"
        >
          <Icon className="w-8 h-8">
            {Icons.menu}
          </Icon>
        </button>
      </div>
    </header>
  );
};

export default Header;