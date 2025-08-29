import React from 'react';
interface GlassCardProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}
export const GlassCard = ({
  title,
  className = '',
  children
}: GlassCardProps) => {
  return <div className={`glass-effect rounded-xl shadow-sm transition-all duration-300 ${className}`}>
      {title && <div className="px-6 py-4 border-b border-gray-200/30 dark:border-gray-700/30 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>}
      {children}
    </div>;
};
