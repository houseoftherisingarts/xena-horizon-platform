import React from 'react';
import { GLASS_CLASSES } from '../constants';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick, hoverEffect = false }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        ${GLASS_CLASSES} 
        ${className}
        ${hoverEffect ? 'hover:bg-white/10 hover:border-white/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer' : ''}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;