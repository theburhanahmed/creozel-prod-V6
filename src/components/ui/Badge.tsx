import React from 'react';
interface BadgeProps {
  value: number;
}
export const Badge = ({
  value
}: BadgeProps) => {
  if (value <= 0) return null;
  return <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-medium rounded-full w-5 h-5 flex items-center justify-center shadow-[0_0_10px_rgba(244,63,94,0.6)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(244,63,94,0.8)] animate-pulse-slow" style={{
    transform: 'translateZ(8px)',
    transformStyle: 'preserve-3d'
  }}>
      {value > 9 ? '9+' : value}
    </div>;
};
