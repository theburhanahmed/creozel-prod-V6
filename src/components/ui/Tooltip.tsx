import React, { useEffect, useState } from 'react';
interface TooltipProps {
  text: string;
  visible: boolean;
  x: number;
  y: number;
}
export const Tooltip: React.FC<TooltipProps> = ({
  text,
  visible,
  x,
  y
}) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (visible) {
      // Small delay to prevent flickering
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [visible]);
  if (!isVisible) return null;
  return <div className="fixed z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-md shadow-sm pointer-events-none transform -translate-x-1/2 transition-opacity duration-200" style={{
    left: x,
    top: y - 40,
    opacity: isVisible ? 1 : 0
  }}>
      {text}
      <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 left-1/2 -ml-1 bottom-[-4px]" />
    </div>;
};
