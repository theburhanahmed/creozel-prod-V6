import React, { useState } from 'react';
import { toast } from 'sonner';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { InstagramIcon, TwitterIcon, FacebookIcon, LinkedinIcon, PlusIcon, CalendarIcon, ImageIcon, LinkIcon, SmileIcon, SendIcon } from 'lucide-react';
export const SocialMedia = () => {
  const [activeTab, setActiveTab] = useState('compose');
  const tabs = [{
    id: 'compose',
    label: 'Compose'
  }, {
    id: 'scheduled',
    label: 'Scheduled'
  }, {
    id: 'published',
    label: 'Published'
  }, {
    id: 'analytics',
    label: 'Analytics'
  }];
  const platforms = [{
    name: 'Instagram',
    icon: <InstagramIcon size={20} />,
    color: 'from-pink-500 to-purple-500',
    connected: true
  }, {
    name: 'Twitter',
    icon: <TwitterIcon size={20} />,
    color: 'from-blue-400 to-blue-500',
    connected: true
  }, {
    name: 'Facebook',
    icon: <FacebookIcon size={20} />,
    color: 'from-blue-600 to-blue-700',
    connected: true
  }, {
    name: 'LinkedIn',
    icon: <LinkedinIcon size={20} />,
    color: 'from-blue-700 to-blue-800',
    connected: false
  }];
  const scheduledPosts = [{
    title: 'Product Feature Highlight',
    platforms: ['Instagram', 'Twitter'],
    date: 'Tomorrow, 10:00 AM',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80'
  }, {
    title: 'Customer Testimonial',
    platforms: ['Facebook', 'LinkedIn'],
    date: 'Aug 16, 2:30 PM',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80'
  }, {
    title: 'Team Spotlight',
    platforms: ['Instagram'],
    date: 'Aug 18, 11:00 AM',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80'
  }];
  const handleSchedule = () => {
    toast.success('Post scheduled successfully!');
  };
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Social Media
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and schedule your social media posts
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<CalendarIcon size={16} />}>
            View Calendar
          </Button>
          <Button variant="primary" leftIcon={<PlusIcon size={16} />}>
            New Post
          </Button>
        </div>
      </div>
      <Tabs tabs={tabs} onChange={setActiveTab} variant="enclosed" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {activeTab === 'compose' && <>
            <Card className="lg:col-span-2">
              <div className="space-y-4">
                <textarea placeholder="What would you like to share?" className="w-full h-32 px-4 py-3 bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 dark:text-white resize-none" />
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" leftIcon={<ImageIcon size={14} />}>
                    Add Media
                  </Button>
                  <Button variant="outline" size="sm" leftIcon={<LinkIcon size={14} />}>
                    Add Link
                  </Button>
                  <Button variant="outline" size="sm" leftIcon={<SmileIcon size={14} />}>
                    Add Emoji
                  </Button>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex -space-x-2">
                    {platforms.filter(p => p.connected).map((platform, index) => <div key={index} className={`w-8 h-8 rounded-full bg-gradient-to-br ${platform.color} flex items-center justify-center text-white border-2 border-white dark:border-gray-800`}>
                          {platform.icon}
                        </div>)}
                  </div>
                  <Button leftIcon={<SendIcon size={14} />} onClick={handleSchedule}>
                    Schedule Post
                  </Button>
                </div>
              </div>
            </Card>
            <Card title="Connected Platforms">
              <div className="space-y-3">
                {platforms.map((platform, index) => <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center text-white`}>
                        {platform.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {platform.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {platform.connected ? 'Connected' : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <Button variant={platform.connected ? 'outline' : 'primary'} size="sm">
                      {platform.connected ? 'Manage' : 'Connect'}
                    </Button>
                  </div>)}
              </div>
            </Card>
          </>}
        {activeTab === 'scheduled' && <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scheduledPosts.map((post, index) => <Card key={index} className="hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Scheduled for {post.date}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex -space-x-2">
                      {post.platforms.map((platform, i) => <div key={i} className={`w-8 h-8 rounded-full bg-gradient-to-br ${platform === 'Instagram' ? 'from-pink-500 to-purple-500' : platform === 'Twitter' ? 'from-blue-400 to-blue-500' : platform === 'Facebook' ? 'from-blue-600 to-blue-700' : 'from-blue-700 to-blue-800'} flex items-center justify-center text-white border-2 border-white dark:border-gray-800`}>
                          {platform === 'Instagram' ? <InstagramIcon size={14} /> : platform === 'Twitter' ? <TwitterIcon size={14} /> : platform === 'Facebook' ? <FacebookIcon size={14} /> : <LinkedinIcon size={14} />}
                        </div>)}
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </Card>)}
          </div>}
      </div>
    </div>;
};