import React from 'react';
import { MenuIcon } from 'lucide-react';
interface MenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}
export const MenuButton = ({
  isOpen,
  onClick
}: MenuButtonProps) => {
  // Fixed: Ensure click is properly stopped from propagation
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event from bubbling up
    onClick();
  };
  return <button onClick={handleClick} className="relative group" aria-label="Toggle menu" aria-expanded={isOpen} id="menu-button">
      <div className={`
          relative z-20 p-2 rounded-xl 
          backdrop-blur-lg
          bg-white/70 dark:bg-gray-800/70 
          shadow-lg border border-white/20 dark:border-gray-700/30 
          transition-all duration-300 
          hover:shadow-xl group-hover:scale-[0.97] 
          overflow-hidden
          ${isOpen ? 'ring-2 ring-indigo-500/70' : ''}
        `}>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/5 dark:via-purple-500/5 dark:to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_65%,white_75%_80%,transparent_100%)] opacity-0 group-hover:opacity-20" />
        <MenuIcon size={24} className={`
            relative z-10 
            text-gray-700 dark:text-gray-200 
            transition-transform duration-300 
            group-hover:scale-110
            ${isOpen ? 'rotate-90' : ''}
          `} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10" />
    </button>;
};