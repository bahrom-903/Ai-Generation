
import React from 'react';

interface IconProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({ children, className = 'w-5 h-5', style }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      style={style}
    >
      {children}
    </svg>
  );
};

export default Icon;