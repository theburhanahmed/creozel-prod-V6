import React, { useEffect, useState } from 'react';
interface LiveCursorProps {
  name: string;
  color: string;
  position: {
    x: number;
    y: number;
  };
}
export const LiveCursor = ({
  name,
  color,
  position
}: LiveCursorProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  // Fade out cursor after inactivity
  useEffect(() => {
    setIsVisible(true);
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [position]);
  if (!isVisible) return null;
  return <div className="absolute pointer-events-none z-50 transition-all duration-300" style={{
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: 'translateY(-10px)'
  }}>
      <div className="flex items-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{
        color: color
      }} className="drop-shadow-md">
          <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z" fill="currentColor" stroke="white" />
        </svg>
        <div className="ml-1 rounded-md px-1.5 py-0.5 text-xs text-white shadow-sm" style={{
        backgroundColor: color
      }}>
          {initials}
        </div>
      </div>
    </div>;
};
