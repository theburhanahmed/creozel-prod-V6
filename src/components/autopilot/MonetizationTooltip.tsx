import React from 'react';
import { DollarSignIcon, XIcon, TrendingUpIcon, StarIcon } from 'lucide-react';
import { Button } from '../ui/Button';
interface MonetizationTooltipProps {
  onEnable: () => void;
  onClose: () => void;
}
export const MonetizationTooltip: React.FC<MonetizationTooltipProps> = ({
  onEnable,
  onClose
}) => {
  return <div className="fixed bottom-6 right-6 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-amber-200 dark:border-amber-800/30 overflow-hidden z-50 animate-slideIn">
      <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <DollarSignIcon size={20} className="text-white" />
            </div>
            <h3 className="text-white font-medium">Earn from your content</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors" aria-label="Close tooltip">
            <XIcon size={18} />
          </button>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          This pipeline has high earning potential! Enable monetization to start
          earning from your content.
        </p>
        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-3">
            <TrendingUpIcon size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Estimated earnings
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Generate monthly revenue from your content
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <StarIcon size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Multiple revenue streams
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tips, subscriptions, and one-time purchases
              </p>
            </div>
          </div>
        </div>
        <Button variant="primary" className="w-full bg-amber-500 hover:bg-amber-600 border-amber-600" onClick={onEnable}>
          Enable Monetization
        </Button>
      </div>
    </div>;
};
