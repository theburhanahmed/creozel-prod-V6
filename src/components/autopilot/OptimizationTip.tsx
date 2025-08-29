import React from 'react';
import { ZapIcon, XIcon, ClockIcon, BarChart2Icon } from 'lucide-react';
import { Button } from '../ui/Button';
interface OptimizationTipProps {
  recommendedTime: string;
  onApply: () => void;
  onClose: () => void;
}
export const OptimizationTip: React.FC<OptimizationTipProps> = ({
  recommendedTime,
  onApply,
  onClose
}) => {
  return <div className="fixed bottom-6 right-6 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-blue-200 dark:border-blue-800/30 overflow-hidden z-50 animate-slideIn">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ZapIcon size={20} className="text-white" />
            </div>
            <h3 className="text-white font-medium">Auto Optimizer</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors" aria-label="Close tooltip">
            <XIcon size={18} />
          </button>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Based on your audience analytics, we recommend posting at{' '}
          <span className="font-medium text-blue-600 dark:text-blue-400">
            {recommendedTime}
          </span>{' '}
          for maximum engagement.
        </p>
        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-3">
            <ClockIcon size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Optimal timing
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your audience is most active at this time
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <BarChart2Icon size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Increased engagement
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                +23% higher engagement rate expected
              </p>
            </div>
          </div>
        </div>
        <Button variant="primary" className="w-full bg-blue-500 hover:bg-blue-600 border-blue-600" onClick={onApply}>
          Apply Optimized Time
        </Button>
      </div>
    </div>;
};
