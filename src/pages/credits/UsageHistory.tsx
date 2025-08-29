import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ChevronLeftIcon, FilterIcon, DownloadIcon, BarChart2Icon, TextIcon, ImageIcon, VideoIcon, MusicIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
export const UsageHistory = () => {
  const [dateRange, setDateRange] = useState('last30days');
  const [filter, setFilter] = useState('all');
  // TODO: Fetch usage history from production data source (Supabase or backend)
  const [usageData, setUsageData] = useState<any[]>([]);
  // Example: useEffect(() => { fetchUsageHistory().then(setUsageData); }, []);
  // Filter usage data based on selected filter
  const filteredData = usageData.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });
  // Calculate total credits used
  const totalCreditsUsed = filteredData.reduce((sum, item) => sum + item.credits, 0);
  return <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 mb-2">
            <ChevronLeftIcon size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Credit Usage History
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track how your credits are being used across different features
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1 p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-900/30">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Credits Summary
              </h2>
              <BarChart2Icon size={20} className="text-green-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">
                  Current Balance:
                </span>
                <span className="text-xl font-bold text-green-600 dark:text-green-400">
                  120
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">
                  Used This Period:
                </span>
                <span className="text-lg font-medium text-amber-600 dark:text-amber-400">
                  {totalCreditsUsed}
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="primary" className="w-full" as={Link} to="/credits/add">
                Add More Credits
              </Button>
            </div>
          </div>
        </Card>
        <div className="md:col-span-3 space-y-6">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="flex flex-wrap gap-2">
                <select value={filter} onChange={e => setFilter(e.target.value)} className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 text-sm">
                  <option value="all">All Types</option>
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                </select>
                <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 text-sm">
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last90days">Last 90 Days</option>
                </select>
              </div>
              <Button variant="outline" leftIcon={<DownloadIcon size={16} />}>
                Export CSV
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Credits Used
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredData.map(item => <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3">
                            {item.icon}
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                            {item.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {item.description}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {item.date} at {item.time}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                          -{item.credits}
                        </span>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
            {filteredData.length === 0 && <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No usage data found for the selected filter.
                </p>
              </div>}
          </Card>
        </div>
      </div>
    </div>;
};
