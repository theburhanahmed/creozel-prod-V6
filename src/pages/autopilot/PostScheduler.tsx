import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { toast } from 'sonner';
import { CalendarIcon, ChevronLeftIcon, PlusIcon, ClockIcon, RepeatIcon, InstagramIcon, TwitterIcon, YoutubeIcon, LinkedinIcon, CheckIcon, XIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
export const PostScheduler = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const tabs = [{
    id: 'upcoming',
    label: 'Upcoming'
  }, {
    id: 'scheduled',
    label: 'Scheduled'
  }, {
    id: 'published',
    label: 'Published'
  }, {
    id: 'drafts',
    label: 'Drafts'
  }];
  const upcomingPosts = [{
    id: '1',
    title: 'Tech Tips: Keyboard Shortcuts',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1555532538-dcdbd01d373d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8a2V5Ym9hcmR8ZW58MHx8MHx8fDA%3D',
    platforms: ['Instagram', 'TikTok', 'YouTube'],
    scheduledFor: 'Today, 3:00 PM',
    pipeline: 'Daily Tech Tips',
    status: 'ready'
  }, {
    id: '2',
    title: 'Productivity Apps Review',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdGl2aXR5fGVufDB8fDB8fHww',
    platforms: ['Instagram', 'TikTok'],
    scheduledFor: 'Tomorrow, 10:00 AM',
    pipeline: 'Daily Tech Tips',
    status: 'ready'
  }, {
    id: '3',
    title: 'Email Management Strategies',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1554188248-986adbb73be4?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZW1haWx8ZW58MHx8MHx8fDA%3D',
    platforms: ['Instagram', 'LinkedIn'],
    scheduledFor: 'Aug 18, 9:00 AM',
    pipeline: 'Daily Tech Tips',
    status: 'processing'
  }];
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return <InstagramIcon size={14} className="text-pink-500" />;
      case 'TikTok':
        return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-black dark:text-white">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
          </svg>;
      case 'YouTube':
        return <YoutubeIcon size={14} className="text-red-500" />;
      case 'Twitter':
        return <TwitterIcon size={14} className="text-blue-400" />;
      case 'LinkedIn':
        return <LinkedinIcon size={14} className="text-blue-700" />;
      default:
        return null;
    }
  };
  const handleSchedulePost = () => {
    toast.success('Post scheduled successfully', {
      description: 'Your post has been added to the schedule.'
    });
  };
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/autopilot" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <ChevronLeftIcon size={16} />
            <span>Back to Pipelines</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Post Scheduler
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Schedule and manage your social media posts
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<CalendarIcon size={16} />}>
            Calendar View
          </Button>
          <Button variant="primary" leftIcon={<PlusIcon size={16} />} onClick={handleSchedulePost}>
            Schedule Post
          </Button>
        </div>
      </div>
      <div className="space-y-6">
        <Tabs tabs={tabs} onChange={setActiveTab} variant="enclosed" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingPosts.map(post => <Card key={post.id} className="hover:shadow-lg transition-all duration-300">
              <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 mb-2">
                  <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {post.type === 'video' ? 'Video' : 'Image'}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      From pipeline:
                    </span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {post.pipeline}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {post.scheduledFor}
                  </span>
                  {post.status === 'processing' && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                      Processing
                    </span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.platforms.map(platform => <div key={platform} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs">
                      {getPlatformIcon(platform)}
                      <span>{platform}</span>
                    </div>)}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" leftIcon={<div size={14} />}>
                      Edit Caption
                    </Button>
                    <Button variant="outline" size="sm" leftIcon={<ClockIcon size={14} />}>
                      Reschedule
                    </Button>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="!p-1.5 text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400">
                      <CheckIcon size={14} />
                    </Button>
                    <Button variant="outline" size="sm" className="!p-1.5 text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400">
                      <XIcon size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>)}
          <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-cyan-500 dark:hover:border-cyan-500 transition-colors">
            <div className="h-full flex flex-col items-center justify-center py-6 cursor-pointer" onClick={handleSchedulePost}>
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 mb-4">
                <PlusIcon size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Schedule New Post
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Create and schedule a new post for your social media
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>;
};
