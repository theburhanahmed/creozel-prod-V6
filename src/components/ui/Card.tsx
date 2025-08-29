import React from 'react';
import { Link } from 'react-router-dom';
interface CardProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}
interface CardMenuProps {
  className?: string;
  items: {
    icon: React.ReactNode;
    title: string;
    href: string;
    onClick?: () => void;
  }[];
}
export const Card = ({
  title,
  className = '',
  children
}: CardProps) => {
  return <div className={`relative overflow-hidden bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] rounded-xl group hover:scale-[1.01] transition-all duration-300 ${className}`}>
      {/* Glass effect overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent opacity-50"></div>
      {title && <div className="px-6 py-4 border-b border-gray-200/20 dark:border-gray-700/20 backdrop-blur-sm flex items-center justify-between relative z-10">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>}
      <div className="relative z-10">{children}</div>
      {/* Hover effects - matching CardMenu exactly */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-100/10 to-gray-100/5 dark:from-gray-800/20 dark:to-gray-800/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></div>
      
      <span className="absolute inset-0 bg-gradient-to-r from-gray-100/10 to-gray-100/5 dark:from-gray-800/20 dark:to-gray-800/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></span>
    </div>;
};
export const CardMenu = ({
  className = '',
  items
}: CardMenuProps) => {
  return <div className={`p-2 bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] rounded-xl shadow-lg flex flex-wrap justify-center gap-1.5 max-w-3xl ${className}`}>
      {items.map((item, index) =>
        item.href ? (
          <Link key={index} to={item.href} onClick={item.onClick} className="relative flex justify-center items-center w-10 h-[50px] rounded-lg overflow-hidden z-10 hover:w-[120px] transition-all duration-300 ease-in-out group">
            <span className="absolute left-[18px] w-6 h-6 flex-shrink-0 z-20 text-gray-700 dark:text-gray-300 transition-transform duration-300 group-hover:scale-110">
              {item.icon}
            </span>
            {/* Background hover effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-gray-100/10 to-gray-100/5 dark:from-gray-800/20 dark:to-gray-800/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></span>
            {/* Title with improved animation */}
            <span className="text-sm text-gray-700 dark:text-gray-300 translate-x-full group-hover:translate-x-0 transition-all duration-300 ease-in-out text-center pl-7 w-full opacity-0 group-hover:opacity-100">
              {item.title}
            </span>
          </Link>
        ) : (
          <button key={index} onClick={item.onClick} className="relative flex justify-center items-center w-10 h-[50px] rounded-lg overflow-hidden z-10 hover:w-[120px] transition-all duration-300 ease-in-out group bg-transparent border-none cursor-pointer">
            <span className="absolute left-[18px] w-6 h-6 flex-shrink-0 z-20 text-gray-700 dark:text-gray-300 transition-transform duration-300 group-hover:scale-110">
              {item.icon}
            </span>
            {/* Background hover effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-gray-100/10 to-gray-100/5 dark:from-gray-800/20 dark:to-gray-800/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></span>
            {/* Title with improved animation */}
            <span className="text-sm text-gray-700 dark:text-gray-300 translate-x-full group-hover:translate-x-0 transition-all duration-300 ease-in-out text-center pl-7 w-full opacity-0 group-hover:opacity-100">
              {item.title}
            </span>
          </button>
        )
      )}
    </div>;
};
