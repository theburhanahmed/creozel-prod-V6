import React, { useEffect, useState, useRef } from 'react';
interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}
export const ColorPicker = ({
  color,
  onChange
}: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const presetColors = ['#4f46e5', '#8b5cf6', '#ec4899', '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#6366f1', '#000000', '#ffffff' // white
  ];
  const handleClickOutside = (event: MouseEvent) => {
    if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  return <div className="relative" ref={colorPickerRef}>
      <div className="flex items-center gap-2">
        <button type="button" className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden" onClick={() => setIsOpen(!isOpen)} style={{
        backgroundColor: color
      }} />
        <input type="text" value={color} onChange={e => onChange(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="#RRGGBB" />
      </div>
      {isOpen && <div className="absolute z-10 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-6 gap-2">
            {presetColors.map(presetColor => <button key={presetColor} className="w-6 h-6 rounded-md border border-gray-300 dark:border-gray-600 flex items-center justify-center" style={{
          backgroundColor: presetColor
        }} onClick={() => {
          onChange(presetColor);
          setIsOpen(false);
        }}>
                {presetColor === color && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${presetColor === '#ffffff' ? 'text-gray-900' : 'text-white'}`}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>}
              </button>)}
          </div>
          <div className="mt-3">
            <input type="color" value={color} onChange={e => onChange(e.target.value)} className="w-full h-8 cursor-pointer" />
          </div>
        </div>}
    </div>;
};
