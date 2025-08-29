import React from 'react';
import { BarChart2Icon, TrendingUpIcon } from 'lucide-react';
interface EarningsProjectionProps {
  tipsEnabled: boolean;
  paidContentEnabled: boolean;
  paidContentType: string;
  paidContentPrice: number;
  estimatedReach: number;
}
export const EarningsProjection: React.FC<EarningsProjectionProps> = ({
  tipsEnabled,
  paidContentEnabled,
  paidContentType,
  paidContentPrice,
  estimatedReach
}) => {
  // Calculate earnings breakdown
  const calculateEarnings = () => {
    // Base calculation from ad revenue/views
    const baseEarnings = estimatedReach * 0.001;
    // Tips calculation (if enabled)
    const tipsEarnings = tipsEnabled ? estimatedReach * 0.0003 : 0;
    // Paid content calculation (if enabled)
    let paidContentEarnings = 0;
    if (paidContentEnabled) {
      const conversionRate = paidContentType === 'subscription' ? 0.01 : 0.005;
      paidContentEarnings = estimatedReach * conversionRate * paidContentPrice;
    }
    return {
      baseEarnings: baseEarnings.toFixed(2),
      tipsEarnings: tipsEarnings.toFixed(2),
      paidContentEarnings: paidContentEarnings.toFixed(2),
      totalEarnings: (baseEarnings + tipsEarnings + paidContentEarnings).toFixed(2)
    };
  };
  const earnings = calculateEarnings();
  // Calculate percentages for chart visualization
  const total = parseFloat(earnings.totalEarnings);
  const basePercent = parseFloat(earnings.baseEarnings) / total * 100;
  const tipsPercent = parseFloat(earnings.tipsEarnings) / total * 100;
  const paidContentPercent = parseFloat(earnings.paidContentEarnings) / total * 100;
  return <div className="space-y-6">
      <div className="flex flex-col">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Monthly Earnings Breakdown
        </h4>
        {/* Horizontal stacked bar chart */}
        <div className="h-8 flex rounded-md overflow-hidden mb-3">
          <div className="bg-blue-500 h-full flex items-center justify-center text-xs text-white font-medium" style={{
          width: `${basePercent}%`
        }}>
            {basePercent > 15 ? 'Base' : ''}
          </div>
          {tipsEnabled && <div className="bg-green-500 h-full flex items-center justify-center text-xs text-white font-medium" style={{
          width: `${tipsPercent}%`
        }}>
              {tipsPercent > 15 ? 'Tips' : ''}
            </div>}
          {paidContentEnabled && <div className="bg-amber-500 h-full flex items-center justify-center text-xs text-white font-medium" style={{
          width: `${paidContentPercent}%`
        }}>
              {paidContentPercent > 15 ? 'Paid' : ''}
            </div>}
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
            <span className="text-xs text-gray-600 dark:text-gray-300">
              Base: ${earnings.baseEarnings}
            </span>
          </div>
          {tipsEnabled && <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
              <span className="text-xs text-gray-600 dark:text-gray-300">
                Tips: ${earnings.tipsEarnings}
              </span>
            </div>}
          {paidContentEnabled && <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-sm"></div>
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {paidContentType === 'subscription' ? 'Subscriptions' : 'Purchases'}
                : ${earnings.paidContentEarnings}
              </span>
            </div>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUpIcon size={16} className="text-amber-500" />
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Conversion Metrics
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-gray-500 dark:text-gray-400">
                Viewer to Tipper
              </p>
              <p className="text-gray-900 dark:text-white font-medium">0.5%</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">
                Avg. Tip Amount
              </p>
              <p className="text-gray-900 dark:text-white font-medium">$3.50</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">
                Subscription Rate
              </p>
              <p className="text-gray-900 dark:text-white font-medium">1.0%</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Purchase Rate</p>
              <p className="text-gray-900 dark:text-white font-medium">0.5%</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2Icon size={16} className="text-amber-500" />
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Growth Potential
            </h4>
          </div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">Current</p>
            <p className="text-xs font-medium text-gray-900 dark:text-white">
              ${earnings.totalEarnings}/mo
            </p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
            <div className="bg-amber-500 h-2 rounded-full" style={{
            width: '33%'
          }}></div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Potential
            </p>
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
              ${(parseFloat(earnings.totalEarnings) * 3).toFixed(2)}/mo
            </p>
          </div>
        </div>
      </div>
    </div>;
};
