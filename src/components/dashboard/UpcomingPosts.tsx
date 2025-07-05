import React from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../ui/GlassCard';
import { CalendarIcon, ChevronRightIcon, InstagramIcon, TwitterIcon, LinkedinIcon, ClockIcon } from 'lucide-react';
export const UpcomingPosts = () => {
  // Mock data for upcoming posts
  const upcomingPosts = [{
    title: '10 Productivity Tips for Remote Work',
    platform: 'Instagram',
    icon: <InstagramIcon size={14} className="text-pink-500" />,
    scheduledFor: 'Today, 3:00 PM'
  }, {
    title: 'The Future of AI in Content Creation',
    platform: 'Twitter',
    icon: <TwitterIcon size={14} className="text-blue-400" />,
    scheduledFor: 'Tomorrow, 9:00 AM'
  }, {
    title: 'How to Build a Personal Brand Online',
    platform: 'LinkedIn',
    icon: <LinkedinIcon size={14} className="text-blue-700" />,
    scheduledFor: 'Jan 15, 11:30 AM'
  }];
  return <GlassCard className="hover:shadow-lg transition-all duration-300">
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-white flex items-center gap-2">
            <CalendarIcon size={16} className="text-indigo-500" />
            Upcoming Posts
          </h3>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-400">
            {upcomingPosts.length} scheduled
          </span>
        </div>
        <div className="space-y-3">
          {upcomingPosts.map((post, index) => <div key={index} className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                  {post.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-medium text-white truncate">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">
                      {post.platform}
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-400 flex items-center">
                      <ClockIcon size={10} className="mr-1" />
                      {post.scheduledFor}
                    </span>
                  </div>
                </div>
              </div>
            </div>)}
        </div>
        <div className="pt-3 border-t border-gray-700">
          <Link to="/calendar" className="flex items-center justify-between text-indigo-400 text-sm hover:text-indigo-300 transition-colors">
            <span>View All Scheduled Posts</span>
            <ChevronRightIcon size={16} className="animate-pulse-slow" />
          </Link>
        </div>
      </div>
    </GlassCard>;
};