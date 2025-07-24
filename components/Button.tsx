import React from 'react';
import { useAppContext } from '../contexts/AppContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}

const Button: React.FC<ButtonProps> = ({ children, icon, variant = 'primary', ...props }) => {
  const { theme } = useAppContext();

  const baseClasses = 'flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 text-center';

  const variantClasses = {
    primary: `${theme.colors.accent.replace('text-','bg-')} ${theme.colors.bg.includes('dark') || theme.colors.bg.includes('100122') ? 'text-gray-900' : 'text-white'} hover:opacity-90 ${theme.colors.accentGlow.replace('shadow-[','hover:shadow-[')} focus:ring-offset-gray-800 focus:ring-fuchsia-500`,
    secondary: `border-2 ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.accent.replace('text-','bg-')} hover:${theme.colors.bg.includes('dark') || theme.colors.bg.includes('100122') ? 'text-gray-900' : 'text-white'}`,
    ghost: `${theme.colors.text} hover:${theme.colors.accent} hover:bg-white/10`,
  };

  const disabledClasses = 'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses}`}
      {...props}
    >
      {icon && <div className="w-5 h-5">{icon}</div>}
      {children}
    </button>
  );
};

export default Button;