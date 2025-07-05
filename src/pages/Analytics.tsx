import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { TrendingUpIcon, UsersIcon, EyeIcon, MessageSquareIcon, ShareIcon, BarChart4Icon, DownloadIcon, CalendarIcon, GlobeIcon, HeartIcon, ClockIcon, LineChartIcon, PieChartIcon, BarChart2Icon, ArrowUpRightIcon, ArrowDownRightIcon, CheckCircleIcon, XCircleIcon, InstagramIcon, TwitterIcon, YoutubeIcon, LinkedinIcon, MapPinIcon, UserIcon, ThumbsUpIcon } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
export const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const tabs = [{
    id: 'overview',
    label: 'Overview'
  }, {
    id: 'engagement',
    label: 'Engagement'
  }, {
    id: 'audience',
    label: 'Audience'
  }, {
    id: 'content',
    label: 'Content'
  }];
  const metrics = [{
    title: 'Total Reach',
    value: '2.4M',
    change: '+14.2%',
    icon: <EyeIcon size={20} />,
    color: 'from-blue-500 to-indigo-600'
  }, {
    title: 'Engagement Rate',
    value: '5.2%',
    change: '+2.1%',
    icon: <MessageSquareIcon size={20} />,
    color: 'from-purple-500 to-pink-500'
  }, {
    title: 'Total Followers',
    value: '84.2K',
    change: '+5.4%',
    icon: <UsersIcon size={20} />,
    color: 'from-emerald-500 to-teal-500'
  }, {
    title: 'Shares',
    value: '12.8K',
    change: '+8.7%',
    icon: <ShareIcon size={20} />,
    color: 'from-orange-500 to-amber-500'
  }];
  const topPosts = [{
    title: 'Product Launch Video',
    engagement: '24.5K',
    reach: '156.2K',
    type: 'Video'
  }, {
    title: 'Customer Success Story',
    engagement: '18.3K',
    reach: '142.8K',
    type: 'Image'
  }, {
    title: 'Team Culture Post',
    engagement: '15.7K',
    reach: '98.4K',
    type: 'Text'
  }];
  const audienceGrowth = [{
    platform: 'Instagram',
    growth: '+2.4K',
    percentage: '+5.2%'
  }, {
    platform: 'Twitter',
    growth: '+1.8K',
    percentage: '+3.7%'
  }, {
    platform: 'Facebook',
    growth: '+3.2K',
    percentage: '+4.5%'
  }, {
    platform: 'LinkedIn',
    growth: '+956',
    percentage: '+2.8%'
  }];
  // Overview chart data
  const overviewChartData = [{
    month: 'Jan',
    impressions: 65000,
    engagement: 12500,
    followers: 24000
  }, {
    month: 'Feb',
    impressions: 59000,
    engagement: 15000,
    followers: 26000
  }, {
    month: 'Mar',
    impressions: 80000,
    engagement: 18000,
    followers: 28000
  }, {
    month: 'Apr',
    impressions: 81000,
    engagement: 19500,
    followers: 31000
  }, {
    month: 'May',
    impressions: 95000,
    engagement: 22000,
    followers: 35000
  }, {
    month: 'Jun',
    impressions: 110000,
    engagement: 24000,
    followers: 39000
  }, {
    month: 'Jul',
    impressions: 120000,
    engagement: 26000,
    followers: 42000
  }, {
    month: 'Aug',
    impressions: 130000,
    engagement: 28000,
    followers: 45000
  }, {
    month: 'Sep',
    impressions: 145000,
    engagement: 31000,
    followers: 48000
  }, {
    month: 'Oct',
    impressions: 160000,
    engagement: 34000,
    followers: 52000
  }, {
    month: 'Nov',
    impressions: 170000,
    engagement: 36000,
    followers: 56000
  }, {
    month: 'Dec',
    impressions: 180000,
    engagement: 38000,
    followers: 60000
  }];
  // Engagement tab data
  const engagementMetrics = [{
    title: 'Average Engagement',
    value: '7.4%',
    change: '+1.2%',
    icon: <ThumbsUpIcon size={20} />,
    color: 'from-indigo-500 to-blue-600'
  }, {
    title: 'Comments',
    value: '8.6K',
    change: '+24%',
    icon: <MessageSquareIcon size={20} />,
    color: 'from-cyan-500 to-blue-500'
  }, {
    title: 'Saves',
    value: '14.3K',
    change: '+32%',
    icon: <HeartIcon size={20} />,
    color: 'from-pink-500 to-rose-500'
  }, {
    title: 'Click-through Rate',
    value: '3.8%',
    change: '+0.7%',
    icon: <ArrowUpRightIcon size={20} />,
    color: 'from-amber-500 to-orange-500'
  }];
  const engagementByPlatform = [{
    platform: 'Instagram',
    icon: <InstagramIcon size={18} className="text-pink-500" />,
    rate: '8.7%',
    change: '+1.2%',
    trend: 'up'
  }, {
    platform: 'Twitter',
    icon: <TwitterIcon size={18} className="text-blue-400" />,
    rate: '4.2%',
    change: '+0.8%',
    trend: 'up'
  }, {
    platform: 'YouTube',
    icon: <YoutubeIcon size={18} className="text-red-500" />,
    rate: '6.1%',
    change: '-0.3%',
    trend: 'down'
  }, {
    platform: 'LinkedIn',
    icon: <LinkedinIcon size={18} className="text-blue-700" />,
    rate: '5.4%',
    change: '+2.1%',
    trend: 'up'
  }];
  const engagementByTime = [{
    time: '6AM-9AM',
    rate: '3.2%'
  }, {
    time: '9AM-12PM',
    rate: '4.8%'
  }, {
    time: '12PM-3PM',
    rate: '6.7%'
  }, {
    time: '3PM-6PM',
    rate: '7.9%'
  }, {
    time: '6PM-9PM',
    rate: '8.4%'
  }, {
    time: '9PM-12AM',
    rate: '5.2%'
  }];
  // Engagement trend data
  const engagementTrendData = [{
    month: 'Jul',
    likes: 4200,
    comments: 1800,
    shares: 960
  }, {
    month: 'Aug',
    likes: 4800,
    comments: 2100,
    shares: 1100
  }, {
    month: 'Sep',
    likes: 5300,
    comments: 2400,
    shares: 1300
  }, {
    month: 'Oct',
    likes: 5900,
    comments: 2600,
    shares: 1450
  }, {
    month: 'Nov',
    likes: 6200,
    comments: 2900,
    shares: 1600
  }, {
    month: 'Dec',
    likes: 6800,
    comments: 3200,
    shares: 1750
  }];
  // Audience tab data
  const audienceMetrics = [{
    title: 'Total Audience',
    value: '94.7K',
    change: '+8.2K',
    icon: <UsersIcon size={20} />,
    color: 'from-blue-500 to-indigo-600'
  }, {
    title: 'Active Followers',
    value: '76.3K',
    change: '+6.5K',
    icon: <UserIcon size={20} />,
    color: 'from-emerald-500 to-teal-500'
  }, {
    title: 'Avg. Age',
    value: '28',
    change: '-2',
    icon: <UsersIcon size={20} />,
    color: 'from-violet-500 to-purple-600'
  }, {
    title: 'Top Location',
    value: 'USA',
    change: '+12%',
    icon: <MapPinIcon size={20} />,
    color: 'from-rose-500 to-pink-600'
  }];
  const audienceDemographics = [{
    age: '18-24',
    percentage: 28
  }, {
    age: '25-34',
    percentage: 42
  }, {
    age: '35-44',
    percentage: 18
  }, {
    age: '45-54',
    percentage: 8
  }, {
    age: '55+',
    percentage: 4
  }];
  const audienceLocations = [{
    country: 'United States',
    percentage: 42,
    count: '39.8K'
  }, {
    country: 'United Kingdom',
    percentage: 18,
    count: '17.1K'
  }, {
    country: 'Canada',
    percentage: 12,
    count: '11.4K'
  }, {
    country: 'Australia',
    percentage: 8,
    count: '7.6K'
  }, {
    country: 'Germany',
    percentage: 6,
    count: '5.7K'
  }, {
    country: 'Other',
    percentage: 14,
    count: '13.2K'
  }];
  const audienceInterests = [{
    interest: 'Technology',
    percentage: 64
  }, {
    interest: 'Business',
    percentage: 52
  }, {
    interest: 'Marketing',
    percentage: 47
  }, {
    interest: 'Design',
    percentage: 41
  }, {
    interest: 'Productivity',
    percentage: 38
  }];
  // Audience growth trend data
  const audienceGrowthData = [{
    month: 'Jul',
    followers: 62000,
    growth: 2400
  }, {
    month: 'Aug',
    followers: 68000,
    growth: 6000
  }, {
    month: 'Sep',
    followers: 74000,
    growth: 6000
  }, {
    month: 'Oct',
    followers: 79000,
    growth: 5000
  }, {
    month: 'Nov',
    followers: 86500,
    growth: 7500
  }, {
    month: 'Dec',
    followers: 94700,
    growth: 8200
  }];
  // Content tab data
  const contentPerformance = [{
    title: 'Total Content',
    value: '248',
    change: '+32',
    icon: <BarChart2Icon size={20} />,
    color: 'from-blue-500 to-indigo-600'
  }, {
    title: 'Avg. Engagement',
    value: '6.7%',
    change: '+1.3%',
    icon: <LineChartIcon size={20} />,
    color: 'from-emerald-500 to-teal-500'
  }, {
    title: 'Best Time',
    value: '6PM',
    change: '',
    icon: <ClockIcon size={20} />,
    color: 'from-amber-500 to-orange-500'
  }, {
    title: 'Top Format',
    value: 'Video',
    change: '',
    icon: <PieChartIcon size={20} />,
    color: 'from-purple-500 to-pink-500'
  }];
  const contentByType = [{
    type: 'Video',
    count: 86,
    engagement: '8.4%'
  }, {
    type: 'Image',
    count: 104,
    engagement: '6.2%'
  }, {
    type: 'Carousel',
    count: 42,
    engagement: '7.8%'
  }, {
    type: 'Text',
    count: 16,
    engagement: '4.1%'
  }];
  const contentTypeData = [{
    name: 'Video',
    value: 86
  }, {
    name: 'Image',
    value: 104
  }, {
    name: 'Carousel',
    value: 42
  }, {
    name: 'Text',
    value: 16
  }];
  const contentTypeColors = ['#4f46e5', '#06b6d4', '#8b5cf6', '#f59e0b'];
  const topPerformingContent = [{
    title: '10 Productivity Hacks for Remote Work',
    type: 'Video',
    views: '124.7K',
    engagement: '9.8%',
    platform: 'Instagram'
  }, {
    title: 'How We Built Our Product in 30 Days',
    type: 'Carousel',
    views: '98.2K',
    engagement: '8.7%',
    platform: 'LinkedIn'
  }, {
    title: 'Behind the Scenes: Team Retreat',
    type: 'Image',
    views: '87.5K',
    engagement: '8.2%',
    platform: 'Instagram'
  }];
  const worstPerformingContent = [{
    title: 'Weekly Industry News Roundup',
    type: 'Text',
    views: '12.4K',
    engagement: '2.1%',
    platform: 'Twitter'
  }, {
    title: 'New Feature Announcement',
    type: 'Image',
    views: '18.7K',
    engagement: '2.8%',
    platform: 'LinkedIn'
  }, {
    title: 'Company Milestone Celebration',
    type: 'Video',
    views: '24.3K',
    engagement: '3.2%',
    platform: 'YouTube'
  }];
  // Publishing time heatmap data (simplified for this implementation)
  const publishingTimeData = [{
    day: 'Monday',
    hour: '6AM-9AM',
    value: 3.2
  }, {
    day: 'Monday',
    hour: '9AM-12PM',
    value: 4.1
  }, {
    day: 'Monday',
    hour: '12PM-3PM',
    value: 5.3
  }, {
    day: 'Monday',
    hour: '3PM-6PM',
    value: 6.2
  }, {
    day: 'Monday',
    hour: '6PM-9PM',
    value: 7.8
  }, {
    day: 'Monday',
    hour: '9PM-12AM',
    value: 4.5
  }, {
    day: 'Tuesday',
    hour: '6AM-9AM',
    value: 3.5
  }, {
    day: 'Tuesday',
    hour: '9AM-12PM',
    value: 4.3
  }, {
    day: 'Tuesday',
    hour: '12PM-3PM',
    value: 5.6
  }, {
    day: 'Tuesday',
    hour: '3PM-6PM',
    value: 6.5
  }, {
    day: 'Tuesday',
    hour: '6PM-9PM',
    value: 8.2
  }, {
    day: 'Tuesday',
    hour: '9PM-12AM',
    value: 4.8
  }, {
    day: 'Wednesday',
    hour: '6AM-9AM',
    value: 3.6
  }, {
    day: 'Wednesday',
    hour: '9AM-12PM',
    value: 4.5
  }, {
    day: 'Wednesday',
    hour: '12PM-3PM',
    value: 5.8
  }, {
    day: 'Wednesday',
    hour: '3PM-6PM',
    value: 7.1
  }, {
    day: 'Wednesday',
    hour: '6PM-9PM',
    value: 8.4
  }, {
    day: 'Wednesday',
    hour: '9PM-12AM',
    value: 5.2
  }, {
    day: 'Thursday',
    hour: '6AM-9AM',
    value: 3.4
  }, {
    day: 'Thursday',
    hour: '9AM-12PM',
    value: 4.2
  }, {
    day: 'Thursday',
    hour: '12PM-3PM',
    value: 5.5
  }, {
    day: 'Thursday',
    hour: '3PM-6PM',
    value: 6.7
  }, {
    day: 'Thursday',
    hour: '6PM-9PM',
    value: 7.9
  }, {
    day: 'Thursday',
    hour: '9PM-12AM',
    value: 4.9
  }, {
    day: 'Friday',
    hour: '6AM-9AM',
    value: 3.1
  }, {
    day: 'Friday',
    hour: '9AM-12PM',
    value: 3.9
  }, {
    day: 'Friday',
    hour: '12PM-3PM',
    value: 5.0
  }, {
    day: 'Friday',
    hour: '3PM-6PM',
    value: 5.8
  }, {
    day: 'Friday',
    hour: '6PM-9PM',
    value: 6.7
  }, {
    day: 'Friday',
    hour: '9PM-12AM',
    value: 5.5
  }, {
    day: 'Saturday',
    hour: '6AM-9AM',
    value: 2.5
  }, {
    day: 'Saturday',
    hour: '9AM-12PM',
    value: 3.2
  }, {
    day: 'Saturday',
    hour: '12PM-3PM',
    value: 4.1
  }, {
    day: 'Saturday',
    hour: '3PM-6PM',
    value: 5.3
  }, {
    day: 'Saturday',
    hour: '6PM-9PM',
    value: 6.2
  }, {
    day: 'Saturday',
    hour: '9PM-12AM',
    value: 4.8
  }, {
    day: 'Sunday',
    hour: '6AM-9AM',
    value: 2.3
  }, {
    day: 'Sunday',
    hour: '9AM-12PM',
    value: 2.9
  }, {
    day: 'Sunday',
    hour: '12PM-3PM',
    value: 3.8
  }, {
    day: 'Sunday',
    hour: '3PM-6PM',
    value: 4.7
  }, {
    day: 'Sunday',
    hour: '6PM-9PM',
    value: 5.5
  }, {
    day: 'Sunday',
    hour: '9PM-12AM',
    value: 4.2
  }];
  // Custom tooltip for charts
  const CustomTooltip = ({
    active,
    payload,
    label
  }: any) => {
    if (active && payload && payload.length) {
      return <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-gray-900 dark:text-white font-medium">{label}</p>
          {payload.map((entry: any, index: number) => <p key={`item-${index}`} className="text-sm" style={{
          color: entry.color
        }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>)}
        </div>;
    }
    return null;
  };
  return <div className="max-w-[1600px] mx-auto space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your social media performance
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" leftIcon={<CalendarIcon size={16} />} className="min-w-[140px] justify-center">
            Last 30 Days
          </Button>
          <Button variant="primary" leftIcon={<DownloadIcon size={16} />} className="min-w-[140px] justify-center">
            Export Report
          </Button>
        </div>
      </div>
      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="enclosed" />
      {/* Overview Tab Content */}
      {activeTab === 'overview' && <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => <Card key={index} className="hover:shadow-md transition-shadow">
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center text-white shadow-sm`}>
                      {metric.icon}
                    </div>
                    <span className="text-sm font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                      {metric.change}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {metric.title}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metric.value}
                    </p>
                  </div>
                </div>
              </Card>)}
          </div>
          {/* Charts and Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <BarChart4Icon size={18} className="text-gray-500" />
                  Engagement Overview
                </h3>
                <Button variant="ghost" size="sm" leftIcon={<BarChart4Icon size={14} />}>
                  Detailed Report
                </Button>
              </div>
              <div className="p-6">
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={overviewChartData} margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0
                }}>
                      <defs>
                        <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area type="monotone" dataKey="impressions" stroke="#4f46e5" fillOpacity={1} fill="url(#colorImpressions)" name="Impressions" />
                      <Area type="monotone" dataKey="engagement" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorEngagement)" name="Engagement" />
                      <Area type="monotone" dataKey="followers" stroke="#10b981" fillOpacity={1} fill="url(#colorFollowers)" name="Followers" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
            <Card>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Top Performing Posts
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {topPosts.map((post, index) => <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
                    <h4 className="font-medium text-gray-900 dark:text-white leading-snug">
                      {post.title}
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Engagement
                        </p>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                          {post.engagement}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Reach
                        </p>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                          {post.reach}
                        </p>
                      </div>
                    </div>
                  </div>)}
              </div>
            </Card>
          </div>
          {/* Audience Growth Section */}
          <Card>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Audience Growth
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {audienceGrowth.map((platform, index) => <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                      {platform.platform}
                    </h4>
                    <div className="flex items-end justify-between">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {platform.growth}
                      </p>
                      <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        {platform.percentage}
                      </p>
                    </div>
                  </div>)}
              </div>
            </div>
          </Card>
        </div>}
      {/* Engagement Tab Content */}
      {activeTab === 'engagement' && <div className="space-y-6">
          {/* Engagement Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {engagementMetrics.map((metric, index) => <Card key={index} className="hover:shadow-md transition-shadow">
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center text-white shadow-sm`}>
                      {metric.icon}
                    </div>
                    <span className="text-sm font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                      {metric.change}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {metric.title}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metric.value}
                    </p>
                  </div>
                </div>
              </Card>)}
          </div>
          {/* Engagement Chart */}
          <Card>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <LineChartIcon size={18} className="text-indigo-500" />
                Engagement Over Time
              </h3>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 rounded-full text-gray-400 text-xs hover:text-gray-900 dark:hover:text-white">
                  1 year
                </button>
                <button className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs">
                  6 month
                </button>
                <button className="px-3 py-1 rounded-full text-gray-400 text-xs hover:text-gray-900 dark:hover:text-white">
                  30 days
                </button>
                <button className="px-3 py-1 rounded-full text-gray-400 text-xs hover:text-gray-900 dark:hover:text-white">
                  7 days
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagementTrendData} margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0
              }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="likes" stroke="#4f46e5" strokeWidth={2} dot={{
                  r: 4
                }} activeDot={{
                  r: 6
                }} name="Likes" />
                    <Line type="monotone" dataKey="comments" stroke="#8b5cf6" strokeWidth={2} dot={{
                  r: 4
                }} activeDot={{
                  r: 6
                }} name="Comments" />
                    <Line type="monotone" dataKey="shares" stroke="#10b981" strokeWidth={2} dot={{
                  r: 4
                }} activeDot={{
                  r: 6
                }} name="Shares" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
          {/* Engagement by Platform */}
          <Card>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Engagement by Platform
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {engagementByPlatform.map((platform, index) => <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                      {platform.icon}
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {platform.platform}
                      </h4>
                    </div>
                    <div className="flex items-end justify-between">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {platform.rate}
                      </p>
                      <p className={`text-sm font-medium flex items-center ${platform.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {platform.trend === 'up' ? <ArrowUpRightIcon size={14} className="mr-1" /> : <ArrowDownRightIcon size={14} className="mr-1" />}
                        {platform.change}
                      </p>
                    </div>
                  </div>)}
              </div>
            </div>
          </Card>
          {/* Engagement by Time of Day */}
          <Card>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Engagement by Time of Day
              </h3>
            </div>
            <div className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={engagementByTime} margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 5
              }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="time" />
                    <YAxis tickFormatter={value => `${value}%`} />
                    <Tooltip formatter={value => [`${value}%`, 'Engagement Rate']} labelFormatter={label => `Time: ${label}`} />
                    <Bar dataKey="rate" name="Engagement Rate" fill="#4f46e5" radius={[4, 4, 0, 0]}>
                      {engagementByTime.map((entry, index) => <Cell key={`cell-${index}`} fill={parseFloat(entry.rate) > 7 ? '#10b981' : '#4f46e5'} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Best time to post:{' '}
                  <span className="font-medium text-gray-900 dark:text-white">
                    6PM - 9PM
                  </span>
                </p>
              </div>
            </div>
          </Card>
        </div>}
      {/* Audience Tab Content */}
      {activeTab === 'audience' && <div className="space-y-6">
          {/* Audience Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {audienceMetrics.map((metric, index) => <Card key={index} className="hover:shadow-md transition-shadow">
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center text-white shadow-sm`}>
                      {metric.icon}
                    </div>
                    <span className="text-sm font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                      {metric.change}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {metric.title}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metric.value}
                    </p>
                  </div>
                </div>
              </Card>)}
          </div>
          {/* Audience Demographics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <UsersIcon size={18} className="text-blue-500" />
                  Age Demographics
                </h3>
              </div>
              <div className="p-6">
                <div className="h-[240px] mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={audienceDemographics} layout="vertical" margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5
                }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" tickFormatter={value => `${value}%`} />
                      <YAxis dataKey="age" type="category" width={60} />
                      <Tooltip formatter={value => [`${value}%`, 'Percentage']} />
                      <Bar dataKey="percentage" fill="#4f46e5" radius={[0, 4, 4, 0]} name="Percentage">
                        {audienceDemographics.map((entry, index) => <Cell key={`cell-${index}`} fill={index === 1 ? '#10b981' : '#4f46e5'} // Highlight the largest demographic
                    />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
            <Card>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <GlobeIcon size={18} className="text-emerald-500" />
                  Top Locations
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {audienceLocations.map((item, index) => <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
                          <MapPinIcon size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.country}
                          </p>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{
                        width: `${item.percentage}%`
                      }} />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.count}
                      </p>
                    </div>)}
                </div>
              </div>
            </Card>
          </div>
          {/* Audience Interests */}
          <Card>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <PieChartIcon size={18} className="text-purple-500" />
                Audience Interests
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[200px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={audienceInterests} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="percentage" nameKey="interest" label={({
                    name,
                    percent
                  }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                        {audienceInterests.map((entry, index) => <Cell key={`cell-${index}`} fill={['#4f46e5', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][index % 5]} />)}
                      </Pie>
                      <Tooltip formatter={value => [`${value}%`, 'Percentage']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  {audienceInterests.map((item, index) => <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {item.interest}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {item.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full" style={{
                    width: `${item.percentage}%`
                  }} />
                      </div>
                    </div>)}
                </div>
              </div>
            </div>
          </Card>
          {/* Audience Growth Trend */}
          <Card>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUpIcon size={18} className="text-emerald-500" />
                Audience Growth Trend
              </h3>
            </div>
            <div className="p-6">
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={audienceGrowthData} margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0
              }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area yAxisId="left" type="monotone" dataKey="followers" fill="#4f46e5" stroke="#4f46e5" fillOpacity={0.3} name="Total Followers" />
                    <Bar yAxisId="right" dataKey="growth" fill="#10b981" radius={[4, 4, 0, 0]} name="New Followers" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>}
      {/* Content Tab */}
      {activeTab === 'content' && <div className="space-y-6">
          {/* Content Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contentPerformance.map((metric, index) => <Card key={index} className="hover:shadow-md transition-shadow">
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center text-white shadow-sm`}>
                      {metric.icon}
                    </div>
                    {metric.change && <span className="text-sm font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        {metric.change}
                      </span>}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {metric.title}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metric.value}
                    </p>
                  </div>
                </div>
              </Card>)}
          </div>
          {/* Content by Type */}
          <Card>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <PieChartIcon size={18} className="text-blue-500" />
                Content by Type
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[200px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={contentTypeData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={({
                    name,
                    percent
                  }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                        {contentTypeData.map((entry, index) => <Cell key={`cell-${index}`} fill={contentTypeColors[index % contentTypeColors.length]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  {contentByType.map((item, index) => <div key={index} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.type}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {item.count} posts
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.engagement}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          avg. engagement
                        </div>
                      </div>
                    </div>)}
                </div>
              </div>
            </div>
          </Card>
          {/* Top and Bottom Performing Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckCircleIcon size={18} className="text-emerald-500" />
                  Top Performing Content
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {topPerformingContent.map((content, index) => <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {content.title}
                      </h4>
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                        {content.engagement}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <EyeIcon size={14} />
                        <span>{content.views}</span>
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {content.type}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {content.platform}
                      </div>
                    </div>
                  </div>)}
              </div>
            </Card>
            <Card>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <XCircleIcon size={18} className="text-rose-500" />
                  Underperforming Content
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {worstPerformingContent.map((content, index) => <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-rose-500 dark:hover:border-rose-500 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {content.title}
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400">
                        {content.engagement}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <EyeIcon size={14} />
                        <span>{content.views}</span>
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {content.type}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {content.platform}
                      </div>
                    </div>
                  </div>)}
              </div>
            </Card>
          </div>
          {/* Publishing Time Analysis */}
          <Card>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <ClockIcon size={18} className="text-amber-500" />
                Publishing Time Analysis
              </h3>
            </div>
            <div className="p-6">
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={publishingTimeData} margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5
              }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis dataKey="day" type="category" />
                    <Tooltip formatter={value => [`${value}%`, 'Engagement Rate']} labelFormatter={label => `Time: ${label}`} />
                    <Bar dataKey="value" name="Engagement Rate">
                      {publishingTimeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.value > 7 ? '#10b981' : entry.value > 5 ? '#4f46e5' : entry.value > 3 ? '#8b5cf6' : '#d1d5db'} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Best Day
                  </p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    Wednesday
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Best Time
                  </p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    6:00 PM - 8:00 PM
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Worst Time
                  </p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    3:00 AM - 6:00 AM
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>}
    </div>;
};