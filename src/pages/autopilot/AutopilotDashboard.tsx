import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { RocketIcon, PlusIcon, PlayIcon, PauseIcon, TrendingUpIcon, BarChart2Icon, ClockIcon, CheckCircleIcon, AlertCircleIcon, MousePointerClickIcon } from 'lucide-react';
import { PipelineCard } from '../../components/autopilot/PipelineCard';
import { GlassCard } from '../../components/ui/GlassCard';
export const AutopilotDashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const tabs = [{
    id: 'all',
    label: 'All Pipelines'
  }, {
    id: 'active',
    label: 'Active'
  }, {
    id: 'paused',
    label: 'Paused'
  }, {
    id: 'completed',
    label: 'Completed'
  }];
  const pipelines = [{
    id: '1',
    title: 'Daily Tech Tips',
    description: 'Short tech tips and tricks for productivity',
    contentType: 'faceless-video',
    platforms: ['Instagram', 'TikTok', 'YouTube'],
    schedule: 'Daily at 9:00 AM',
    status: 'active',
    stats: {
      posts: 24,
      views: '245K',
      engagement: '8.3%',
      growth: '+12%'
    },
    lastRun: '2 hours ago',
    nextRun: 'Today at 9:00 AM',
    hasInteractiveElements: true,
    performanceScore: 85,
    content: [{
      id: '1-1',
      title: 'Keyboard Shortcuts Everyone Should Know',
      type: 'video',
      platform: 'TikTok',
      thumbnail: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      engagement: 'viral',
      stats: {
        views: '48.2K',
        likes: '3.7K',
        shares: '842',
        ctr: '5.2%'
      },
      suggestions: ['Try adding text overlays to increase retention', 'First 3 seconds have high drop-off - consider a stronger hook']
    }, {
      id: '1-2',
      title: '5 Productivity Apps That Changed My Life',
      type: 'video',
      platform: 'Instagram',
      thumbnail: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      engagement: 'average',
      stats: {
        views: '32.4K',
        likes: '2.1K',
        shares: '456',
        ctr: '3.8%'
      },
      suggestions: ['Use brighter visuals to improve engagement', 'Consider a shorter title for better click-through']
    }, {
      id: '1-3',
      title: 'How to Organize Your Digital Workspace',
      type: 'video',
      platform: 'YouTube',
      thumbnail: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      engagement: 'low',
      stats: {
        views: '8.7K',
        likes: '430',
        shares: '65',
        ctr: '1.9%'
      },
      suggestions: ['Add more keywords in description to improve SEO', 'Video is too long - consider breaking into a series']
    }]
  }, {
    id: '2',
    title: 'Fitness Motivation',
    description: 'Workout motivation quotes with background music',
    contentType: 'image',
    platforms: ['Instagram', 'TikTok'],
    schedule: 'Weekly on Monday, Wednesday, Friday',
    status: 'paused',
    stats: {
      posts: 12,
      views: '87K',
      engagement: '6.5%',
      growth: '+5%'
    },
    lastRun: '2 days ago',
    nextRun: 'Paused',
    hasInteractiveElements: true,
    performanceScore: 62,
    content: [{
      id: '2-1',
      title: 'Morning Routine for Success',
      type: 'video',
      platform: 'Instagram',
      thumbnail: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      engagement: 'viral',
      stats: {
        views: '28.7K',
        likes: '1.9K',
        shares: '520',
        ctr: '4.8%'
      },
      suggestions: ['This format works well - create more similar content', 'Add more specific workout details in description']
    }, {
      id: '2-2',
      title: '5-Minute Desk Stretch Routine',
      type: 'video',
      platform: 'TikTok',
      thumbnail: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      engagement: 'average',
      stats: {
        views: '18.3K',
        likes: '1.2K',
        shares: '342',
        ctr: '3.2%'
      },
      suggestions: ['Add on-screen instructions for better clarity', 'Try filming in portrait mode for better TikTok engagement']
    }]
  }, {
    id: '3',
    title: 'Business Growth Tips',
    description: 'Professional advice for entrepreneurs',
    contentType: 'blog-to-video',
    platforms: ['LinkedIn', 'Twitter', 'Instagram'],
    schedule: 'Weekly on Tuesday',
    status: 'draft',
    stats: {
      posts: 8,
      views: '32K',
      engagement: '4.2%',
      growth: '+3%'
    },
    lastRun: '4 days ago',
    nextRun: 'In 3 days',
    hasInteractiveElements: false,
    performanceScore: 35,
    content: [{
      id: '3-1',
      title: 'How to Build a Personal Brand on LinkedIn',
      type: 'video',
      platform: 'LinkedIn',
      thumbnail: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      engagement: 'average',
      stats: {
        views: '12.4K',
        likes: '845',
        shares: '156',
        ctr: '3.1%'
      },
      suggestions: ['Include more actionable tips for better engagement', 'Add case studies or success stories to increase credibility']
    }, {
      id: '3-2',
      title: '7 Email Marketing Strategies That Actually Work',
      type: 'video',
      platform: 'Instagram',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      engagement: 'low',
      stats: {
        views: '7.8K',
        likes: '320',
        shares: '42',
        ctr: '1.7%'
      },
      suggestions: ['This topic performs better on LinkedIn than Instagram', 'Try a more visually engaging thumbnail with bold text']
    }]
  }, {
    id: '4',
    title: 'Weekly Newsletter',
    description: 'Curated insights for tech professionals',
    contentType: 'email',
    platforms: ['LinkedIn', 'Twitter'],
    schedule: 'Every Sunday at 8:00 AM',
    status: 'scheduled',
    stats: {
      posts: 15,
      views: '28K',
      engagement: '5.8%',
      growth: '+7%'
    },
    lastRun: '6 days ago',
    nextRun: 'Sunday at 8:00 AM',
    hasInteractiveElements: false,
    performanceScore: 73,
    content: [{
      id: '4-1',
      title: 'Top 10 AI Tools for Marketers',
      type: 'email',
      platform: 'LinkedIn',
      thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      engagement: 'average',
      stats: {
        views: '9.3K',
        likes: '645',
        shares: '124',
        ctr: '4.2%'
      },
      suggestions: ['Add more visual examples of each tool in action', 'Consider creating a downloadable comparison chart']
    }]
  }, {
    id: '5',
    title: 'Product Feature Showcase',
    description: 'Highlight new features and use cases',
    contentType: 'carousel',
    platforms: ['Instagram', 'LinkedIn'],
    schedule: 'Monthly on the 1st',
    status: 'published',
    stats: {
      posts: 6,
      views: '42K',
      engagement: '7.1%',
      growth: '+9%'
    },
    lastRun: '2 weeks ago',
    nextRun: 'August 1st at 10:00 AM',
    hasInteractiveElements: true,
    performanceScore: 88,
    content: [{
      id: '5-1',
      title: 'New Dashboard Features Explained',
      type: 'carousel',
      platform: 'LinkedIn',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      engagement: 'viral',
      stats: {
        views: '18.5K',
        likes: '1.2K',
        shares: '345',
        ctr: '6.8%'
      },
      suggestions: ['The step-by-step format works well - continue this approach', 'Add customer testimonials to increase credibility']
    }]
  }];
  const filteredPipelines = activeTab === 'all' ? pipelines : pipelines.filter(pipeline => pipeline.status === activeTab);
  const stats = [{
    title: 'Total Pipelines',
    value: '5',
    change: '+2',
    icon: <RocketIcon size={18} />,
    color: 'from-cyan-500 to-blue-600'
  }, {
    title: 'Active Pipelines',
    value: '3',
    change: '+1',
    icon: <PlayIcon size={18} />,
    color: 'from-emerald-500 to-teal-600'
  }, {
    title: 'Content Generated',
    value: '47',
    change: '+12',
    icon: <CheckCircleIcon size={18} />,
    color: 'from-indigo-500 to-purple-600'
  }, {
    title: 'Interactive Videos',
    value: '12',
    change: '+5',
    icon: <MousePointerClickIcon size={18} />,
    color: 'from-indigo-600 to-violet-600'
  }];
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Autopilot Pipelines
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Create. Post. Learn. Grow.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<BarChart2Icon size={16} />} as={Link} to="/autopilot/analytics">
            View Analytics
          </Button>
          <Button variant="primary" leftIcon={<PlusIcon size={16} />} as={Link} to="/autopilot/create">
            Create Pipeline
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => <GlassCard key={index} className="relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full transform translate-x-8 -translate-y-8 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform duration-300"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full transform -translate-x-8 translate-y-8 group-hover:-translate-x-6 group-hover:translate-y-6 transition-transform duration-300"></div>
            <div className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {stat.icon}
                </div>
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-400 backdrop-blur-sm border border-emerald-400/20 group-hover:bg-emerald-400/20 transition-colors duration-300">
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-400 dark:text-gray-300 group-hover:text-gray-300 transition-colors duration-300">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mt-1 group-hover:scale-105 transform transition-transform duration-300">
                  {stat.value}
                </p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute -inset-px bg-gradient-to-br from-white/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
          </GlassCard>)}
      </div>
      <div className="space-y-4">
        <Tabs tabs={tabs} onChange={setActiveTab} variant="enclosed" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPipelines.map(pipeline => <PipelineCard key={pipeline.id} pipeline={pipeline} />)}
          {filteredPipelines.length === 0 && <div className="col-span-2 flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 mb-4">
                <RocketIcon size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No pipelines found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
                Start automating your content creation by setting up your first
                pipeline.
              </p>
              <Button variant="primary" leftIcon={<PlusIcon size={16} />} as={Link} to="/autopilot/create">
                Create Pipeline
              </Button>
            </div>}
        </div>
      </div>
    </div>;
};