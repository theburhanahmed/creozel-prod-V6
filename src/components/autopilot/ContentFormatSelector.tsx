import React from 'react';
import { CheckIcon } from 'lucide-react';
interface ContentFormat {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  platforms: string[];
  color: string;
}
interface ContentFormatSelectorProps {
  formats: ContentFormat[];
  selectedFormat: string | null;
  onSelectFormat: (formatId: string) => void;
}
export const ContentFormatSelector = ({
  formats,
  selectedFormat,
  onSelectFormat
}: ContentFormatSelectorProps) => {
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {formats.map(format => <div key={format.id} onClick={() => onSelectFormat(format.id)} className={`
            p-5 rounded-xl border cursor-pointer transition-all duration-200
            hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600
            ${selectedFormat === format.id ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}
          `}>
          <div className="flex flex-col h-full">
            <div className="mb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${format.color} flex items-center justify-center text-white`}>
                {format.icon}
              </div>
            </div>
            <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">
              {format.name}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {format.description}
            </p>
            <div className="mt-auto">
              <div className="flex flex-wrap gap-1">
                {format.platforms.map(platform => <span key={platform} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    {platform}
                  </span>)}
              </div>
            </div>
            {selectedFormat === format.id && <div className="absolute top-3 right-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                  <CheckIcon size={14} className="text-white" />
                </div>
              </div>}
          </div>
        </div>)}
    </div>;
};
