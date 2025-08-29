import React, { useEffect, useRef } from 'react';
import { XIcon } from 'lucide-react';
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'right' | 'left';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
export const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  size = 'md'
}: DrawerProps) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  // Handle ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);
  // Size mapping
  const sizeClasses = {
    sm: 'w-72',
    md: 'w-96',
    lg: 'w-[32rem]',
    xl: 'w-[40rem]'
  };
  // Position mapping
  const positionClasses = {
    right: 'right-0 translate-x-full',
    left: 'left-0 -translate-x-full'
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm transition-opacity duration-300">
      <div ref={drawerRef} className={`fixed top-0 bottom-0 ${sizeClasses[size]} ${position === 'right' ? 'right-0' : 'left-0'} glass-effect border-l border-gray-800/30 shadow-xl transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : position === 'right' ? 'translate-x-full' : '-translate-x-full'} h-full overflow-auto`}>
        <div className="flex flex-col h-full">
          {/* Enhanced header */}
          <div className="p-4 border-b border-gray-800/20 backdrop-blur-sm flex items-center justify-between">
            <h2 className="text-lg font-medium text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {title}
            </h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-800/30 text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-105">
              <XIcon size={18} />
            </button>
          </div>
          {/* Enhanced content area */}
          <div className="flex-1 overflow-auto p-4 backdrop-blur-sm">
            {children}
          </div>
        </div>
      </div>
    </div>;
};
