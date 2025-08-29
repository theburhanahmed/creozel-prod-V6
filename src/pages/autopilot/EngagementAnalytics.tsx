import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { BarChart2Icon, ChevronLeftIcon, DownloadIcon, CalendarIcon, TrendingUpIcon, UsersIcon, EyeIcon, ThumbsUpIcon, MessageSquareIcon, InstagramIcon, TwitterIcon, YoutubeIcon, LinkedinIcon, RefreshCwIcon, AlertCircleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
export const EngagementAnalytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPipeline, setSelectedPipeline] = useState('all');
  const [dateRange, setDateRange] = useState('30d');
  const tabs = [{
    id: 'overview',
    label: 'Overview'
  }, {
    id: 'platforms',
    label: 'Platforms'
  }, {
    id: 'content',
    label: 'Content Performance'
  }, {
    id: 'audience',
    label: 'Audience'
  }];
  const pipelines = [{
    id: 'all',
    name: 'All Pipelines'
  }, {
    id: '1',
    name: 'Daily Tech Tips'
  }, {
    id: '2',
    name: 'Fitness Motivation'
  }, {
    id: '3',
    name: 'Business Growth Tips'
  }];
  const dateRanges = [{
    id: '7d',
    label: 'Last 7 days'
  }, {
    id: '30d',
    label: 'Last 30 days'
  }, {
    id: '90d',
    label: 'Last 90 days'
  }, {
    id: 'ytd',
    label: 'Year to date'
  }];
  const metrics = [{
    title: 'Total Views',
    value: '384K',
    change: '+42K',
    changePercent: '+12.3%',
    icon: <EyeIcon size={20} />,
    color: 'from-blue-500 to-indigo-600'
  }, {
    title: 'Engagement Rate',
    value: '8.2%',
    change: '+0.7%',
    changePercent: '+9.3%',
    icon: <ThumbsUpIcon size={20} />,
    color: 'from-emerald-500 to-teal-600'
  }, {
    title: 'Followers Gained',
    value: '12.8K',
    change: '+2.4K',
    changePercent: '+23.1%',
    icon: <UsersIcon size={20} />,
    color: 'from-purple-500 to-pink-600'
  }, {
    title: 'Comments',
    value: '5.2K',
    change: '+1.1K',
    changePercent: '+26.8%',
    icon: <MessageSquareIcon size={20} />,
    color: 'from-amber-500 to-orange-600'
  }];
  const platformPerformance = [{
    platform: 'Instagram',
    icon: <InstagramIcon size={18} className="text-pink-500" />,
    views: '142K',
    engagement: '6.8%',
    followers: '+4.2K',
    posts: 18,
    color: 'from-pink-500 to-purple-500'
  }, {
    platform: 'TikTok',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-black dark:text-white">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
        </svg>,
    views: '205K',
    engagement: '9.4%',
    followers: '+5.8K',
    posts: 15,
    color: 'from-gray-700 to-gray-900'
  }, {
    platform: 'YouTube',
    icon: <YoutubeIcon size={18} className="text-red-500" />,
    views: '24K',
    engagement: '4.2%',
    followers: '+1.2K',
    posts: 8,
    color: 'from-red-500 to-red-600'
  }, {
    platform: 'LinkedIn',
    icon: <LinkedinIcon size={18} className="text-blue-700" />,
    views: '13K',
    engagement: '3.6%',
    followers: '+1.6K',
    posts: 6,
    color: 'from-blue-600 to-blue-700'
  }];
  const topPerforming = [{
    title: 'Keyboard Shortcuts Everyone Should Know',
    type: 'video',
    views: '48.2K',
    engagement: '9.7%',
    platform: 'TikTok',
    pipeline: 'Daily Tech Tips'
  }, {
    title: '5 Productivity Apps That Changed My Life',
    type: 'video',
    views: '32.4K',
    engagement: '7.2%',
    platform: 'Instagram',
    pipeline: 'Daily Tech Tips'
  }, {
    title: 'Morning Routine for Success',
    type: 'video',
    views: '28.7K',
    engagement: '8.4%',
    platform: 'YouTube',
    pipeline: 'Fitness Motivation'
  }];
  const aiSuggestions = ['Videos about keyboard shortcuts are performing well. Consider creating more content on this topic.', 'TikTok has the highest engagement rate. Consider posting more frequently on this platform.', 'Content posted between 7-9 PM gets 30% more engagement. Adjust your posting schedule.', 'Users engage more with videos that include text overlays. Add captions to improve performance.'];
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/autopilot" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <ChevronLeftIcon size={16} />
            <span>Back to Pipelines</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Engagement Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Track and optimize your content performance
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<DownloadIcon size={16} />}>
            Export Report
          </Button>
          <Button variant="primary" leftIcon={<RefreshCwIcon size={16} />}>
            Refresh Data
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pipeline
          </label>
          <select value={selectedPipeline} onChange={e => setSelectedPipeline(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            {pipelines.map(pipeline => <option key={pipeline.id} value={pipeline.id}>
                {pipeline.name}
              </option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date Range
          </label>
          <div className="flex gap-2">
            {dateRanges.map(range => <button key={range.id} className={`px-3 py-2 text-sm font-medium rounded-md border ${dateRange === range.id ? 'bg-cyan-50 border-cyan-500 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-700' : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'}`} onClick={() => setDateRange(range.id)}>
                {range.label}
              </button>)}
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <Tabs tabs={tabs} onChange={setActiveTab} variant="enclosed" />
        {activeTab === 'overview' && <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric, index) => <Card key={index} className="hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center text-white`}>
                        {metric.icon}
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30">
                          {metric.changePercent}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {metric.title}
                      </h3>
                      <div className="flex items-end gap-2 mt-1">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {metric.value}
                        </p>
                        <p className="text-sm text-emerald-600 dark:text-emerald-400">
                          {metric.change}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2" title="Performance Over Time">
                <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  Chart will be implemented with a charting library
                </div>
              </Card>
              <Card title="AI Insights">
                <div className="space-y-4">
                  {aiSuggestions.map((suggestion, index) => <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                        <AlertCircleIcon size={16} />
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {suggestion}
                      </p>
                    </div>)}
                </div>
              </Card>
            </div>
            <Card title="Platform Performance">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {platformPerformance.map((platform, index) => <div key={index} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center text-white`}>
                        {platform.icon}
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {platform.platform}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Views
                        </p>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                          {platform.views}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Engagement
                        </p>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                          {platform.engagement}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Followers
                        </p>
                        <p className="text-lg font-medium text-emerald-600 dark:text-emerald-400">
                          {platform.followers}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Posts
                        </p>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                          {platform.posts}
                        </p>
                      </div>
                    </div>
                  </div>)}
              </div>
            </Card>
            <Card title="Top Performing Content">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Content
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Pipeline
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Platform
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Views
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Engagement
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {topPerforming.map((content, index) => <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {content.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {content.pipeline}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {content.platform}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {content.views}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-600 dark:text-emerald-400">
                          {content.engagement}
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </Card>
          </>}
      </div>
    </div>;
};
