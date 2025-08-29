import React from 'react';
interface TypingIndicatorProps {
  name: string;
  avatar: string;
}
export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  name,
  avatar
}) => {
  return <div className="flex items-center gap-2">
      <img src={avatar} alt={name} className="w-8 h-8 rounded-full object-cover" />
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-2 shadow-sm">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-typing-1"></div>
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-typing-2"></div>
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-typing-3"></div>
        </div>
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {name} is typing...
      </span>
    </div>;
};
