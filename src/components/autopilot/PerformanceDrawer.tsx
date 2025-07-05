import React from 'react';
import { TrendingUpIcon, EyeIcon, ThumbsUpIcon, ShareIcon, XIcon, LightbulbIcon, ChevronUpIcon } from 'lucide-react';
import { Button } from '../ui/Button';
interface PerformanceData {
  views: string;
  likes: string;
  shares: string;
  ctr: string;
  trend: 'up' | 'down' | 'stable';
  suggestions: string[];
}
interface PerformanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: PerformanceData;
  contentTitle: string;
}
export const PerformanceDrawer = ({
  isOpen,
  onClose,
  data,
  contentTitle
}: PerformanceDrawerProps) => {
  if (!isOpen) return null;
  return <div className="mt-4 overflow-hidden transition-all duration-300 ease-in-out">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center gap-2">
            <TrendingUpIcon size={16} className="text-indigo-500" />
            <h4 className="font-medium text-gray-900 dark:text-white">
              Performance Metrics
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="!p-1" onClick={onClose}>
              <ChevronUpIcon size={14} />
            </Button>
          </div>
        </div>
        <div className="p-4">
          <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3 truncate">
            "{contentTitle}"
          </h5>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <EyeIcon size={12} /> Views
                </span>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {data.trend === 'up' ? '+12%' : data.trend === 'down' ? '-8%' : '0%'}
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {data.views}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <ThumbsUpIcon size={12} /> Likes
                </span>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {data.trend === 'up' ? '+18%' : data.trend === 'down' ? '-5%' : '+2%'}
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {data.likes}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <ShareIcon size={12} /> Shares
                </span>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {data.trend === 'up' ? '+24%' : data.trend === 'down' ? '-3%' : '+8%'}
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {data.shares}
              </p>
            </div>
          </div>
          <div className="mb-6">
            <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Click-Through Rate
            </h5>
            <div className="h-24 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 flex items-end">
              <div className="flex items-end justify-between w-full h-full px-2">
                {/* Simple mock CTR graph with bars */}
                {[0.3, 0.5, 0.7, 0.6, 0.9, 0.8, 0.4].map((height, i) => <div key={i} className="w-6 bg-gradient-to-t from-indigo-500 to-blue-400 rounded-t-sm" style={{
                height: `${height * 100}%`
              }} />)}
              </div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Mon
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Wed
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Fri
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Sun
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Average CTR
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {data.ctr}
              </span>
            </div>
          </div>
          <div>
            <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
              <LightbulbIcon size={12} className="text-amber-500" /> AI
              Suggestions
            </h5>
            <div className="space-y-2">
              {data.suggestions.map((suggestion, index) => <div key={index} className="bg-blue-50 dark:bg-blue-900/10 text-blue-800 dark:text-blue-300 p-2 rounded-lg text-xs">
                  {suggestion}
                </div>)}
            </div>
          </div>
        </div>
      </div>
    </div>;
};