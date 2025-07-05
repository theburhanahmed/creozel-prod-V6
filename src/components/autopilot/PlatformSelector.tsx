import React from 'react';
import { CheckIcon } from 'lucide-react';
interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  audience: string;
  bestTimes: string[];
}
interface PlatformSelectorProps {
  platforms: Platform[];
  selectedPlatforms: string[];
  onChange: (platforms: string[]) => void;
}
export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  platforms,
  selectedPlatforms,
  onChange
}) => {
  const handleTogglePlatform = (platformId: string) => {
    const updatedPlatforms = selectedPlatforms.includes(platformId) ? selectedPlatforms.filter(id => id !== platformId) : [...selectedPlatforms, platformId];
    onChange(updatedPlatforms);
  };
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {platforms.map(platform => {
      const isSelected = selectedPlatforms.includes(platform.id);
      return <div key={platform.id} onClick={() => handleTogglePlatform(platform.id)} className={`
              relative flex flex-col p-4 rounded-lg border-2 transition-all cursor-pointer
              ${isSelected ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'}
            `}>
            {isSelected && <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                <CheckIcon size={12} />
              </div>}
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center text-white`}>
                {platform.icon}
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {platform.name}
              </h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              {platform.description}
            </p>
            <div className="mt-auto">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Best posting times:
              </div>
              <div className="flex flex-wrap gap-1">
                {platform.bestTimes.map(time => <span key={time} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {time}
                  </span>)}
              </div>
            </div>
          </div>;
    })}
    </div>;
};