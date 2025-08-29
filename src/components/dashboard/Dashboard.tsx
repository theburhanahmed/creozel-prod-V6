import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { BarChart2Icon, ArrowRightIcon, PlusIcon, BellIcon, SparklesIcon } from 'lucide-react';
import { ContentCreationPanel } from './ContentCreationPanel';
import { UpcomingPosts } from './UpcomingPosts';
import { AffiliateStatsWidget } from './AffiliateStatsWidget';
import { AnalyticsChart } from './AnalyticsChart';
import { Link } from 'react-router-dom';
export const Dashboard = () => {
  const [showAIModal, setShowAIModal] = useState(false);
  const handleCreateContent = () => {
    setShowAIModal(true);
  };
  return <div className="w-full space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Welcome back to your content hub</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" leftIcon={<BellIcon size={16} />}>
            Notifications
          </Button>
          <Button variant="primary" leftIcon={<PlusIcon size={16} />} onClick={handleCreateContent}>
            Create Content
          </Button>
        </div>
      </div>
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Views" value="248.5K" change="+12.5%" isPositive={true} />
        <StatsCard title="Engagement Rate" value="5.2%" change="+0.8%" isPositive={true} />
        <StatsCard title="Conversion Rate" value="3.1%" change="-0.2%" isPositive={false} />
        <StatsCard title="Avg. Watch Time" value="2:45" change="+0:15" isPositive={true} />
      </div>
      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <div className="p-5 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg text-white flex items-center gap-2">
                  <BarChart2Icon size={18} className="text-green-500" />
                  Performance Overview
                </h3>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 rounded-full text-gray-400 text-xs hover:text-white">
                    1 year
                  </button>
                  <button className="px-3 py-1 rounded-full bg-[#2A3245] text-white text-xs">
                    6 month
                  </button>
                  <button className="px-3 py-1 rounded-full text-gray-400 text-xs hover:text-white">
                    30 days
                  </button>
                  <button className="px-3 py-1 rounded-full text-gray-400 text-xs hover:text-white">
                    7 days
                  </button>
                </div>
              </div>
            </div>
            <div className="p-5">
              <div className="h-64">
                <AnalyticsChart />
              </div>
            </div>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContentCreationPanel onCreateContent={handleCreateContent} />
            <UpcomingPosts />
          </div>
        </div>
        {/* Right column */}
        <div className="space-y-6">
          <AffiliateStatsWidget />
          <GlassCard className="hover:shadow-lg transition-all duration-300">
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <SparklesIcon size={16} className="text-purple-500" />
                  AI Assistant
                </h3>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                  New
                </span>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-700/30">
                <p className="text-sm text-gray-300 mb-3">
                  Let AI help you create engaging content and optimize your
                  workflow.
                </p>
                <Button variant="neon" className="w-full justify-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-none shadow-md shadow-purple-500/20" onClick={handleCreateContent}>
                  Try AI Assistant
                </Button>
              </div>
              <div className="pt-3 border-t border-gray-700">
                <Link to="/content" className="flex items-center justify-between text-purple-400 text-sm hover:text-purple-300 transition-colors">
                  <span>Explore AI Features</span>
                  <ArrowRightIcon size={16} className="animate-pulse-slow" />
                </Link>
              </div>
            </div>
          </GlassCard>
          <Card className="overflow-hidden">
            <div className="p-5 border-b border-gray-700">
              <h3 className="font-medium text-lg text-white">
                Recent Activity
              </h3>
            </div>
            <div className="divide-y divide-gray-700">
              {[{
              title: 'New follower gained',
              description: 'Someone started following your account',
              time: '2 hours ago'
            }, {
              title: 'Content published',
              description: '"10 Productivity Tips" went live on Instagram',
              time: '5 hours ago'
            }, {
              title: 'Post scheduled',
              description: '"Future of AI" scheduled for tomorrow',
              time: 'Yesterday'
            }].map((activity, index) => <div key={index} className="p-4 hover:bg-gray-800/30 transition-colors">
                  <h4 className="text-sm font-medium text-white">
                    {activity.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    {activity.description}
                  </p>
                  <span className="text-xs text-gray-500 mt-2 block">
                    {activity.time}
                  </span>
                </div>)}
            </div>
            <div className="p-4 border-t border-gray-700">
              <Link to="/analytics" className="flex items-center justify-center text-sm text-gray-400 hover:text-white transition-colors">
                View All Activity
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>;
};
// Stats card component for dashboard
const StatsCard = ({
  title,
  value,
  change,
  isPositive
}) => {
  return <Card className="hover:shadow-md transition-shadow">
      <div className="p-5">
        <h3 className="text-sm font-medium text-gray-400 mb-2">{title}</h3>
        <div className="flex items-end justify-between">
          <p className="text-2xl font-bold text-white">{value}</p>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center ${isPositive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
            {change}
          </span>
        </div>
      </div>
    </Card>;
};
