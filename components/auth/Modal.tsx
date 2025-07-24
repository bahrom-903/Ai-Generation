import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppContext } from '../../contexts/AppContext';
import Icon from '../Icon';
import { Icons } from '../../constants';

interface ModalProps {
    title: string;
    show: boolean;
    children: React.ReactNode;
    onBack?: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, show, children, onBack }) => {
    const { theme } = useAppContext();
    const { closeModals } = useAuth();
    
    if (!show) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
            onClick={closeModals}
        >
          <div
            className={`w-full max-w-md rounded-xl border-2 ${theme.colors.border} ${theme.colors.main} shadow-2xl ${theme.colors.accentGlow} p-6 relative flex flex-col animate-fade-in`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              {onBack ? (
                 <button onClick={onBack} className={`p-2 rounded-full ${theme.colors.text} hover:bg-white/10`}>
                    <Icon className="w-8 h-8">{Icons.back}</Icon>
                </button>
              ) : <div className="w-12"></div>}
              <h2 className={`flex-grow text-2xl font-bold ${theme.colors.accent} text-center`}>
                {title}
              </h2>
              <button onClick={closeModals} className={`p-2 rounded-full ${theme.colors.text} hover:bg-white/10`}>
                <Icon className="w-8 h-8">{Icons.close}</Icon>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[70vh] pr-2">
                {children}
            </div>
          </div>
        </div>
    );
};

export default Modal;
