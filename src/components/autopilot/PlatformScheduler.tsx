import React, { useState } from 'react';
import { CalendarIcon, ClockIcon, RepeatIcon, ToggleLeftIcon, ToggleRightIcon, InstagramIcon, YoutubeIcon, SendIcon, FileTextIcon, MailIcon, CalendarDaysIcon, ListIcon, PlusIcon, CheckIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
// Define types for our platforms and scheduling
interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  options?: PlatformOption[];
}
interface PlatformOption {
  id: string;
  name: string;
  type: 'select' | 'toggle' | 'input';
  options?: {
    value: string;
    label: string;
  }[];
  default?: string | boolean;
}
interface ScheduleItem {
  id: string;
  date: Date;
  time: string;
  platforms: string[];
  title: string;
  status: 'scheduled' | 'draft' | 'posted';
}
interface PlatformSchedulerProps {
  onSchedule: (scheduleData: any) => void;
  contentTitle?: string;
  contentType?: string;
}
export const PlatformScheduler: React.FC<PlatformSchedulerProps> = ({
  onSchedule,
  contentTitle = 'Untitled Content',
  contentType = 'video'
}) => {
  // State for scheduling mode
  const [schedulingMode, setSchedulingMode] = useState<'auto' | 'manual'>('manual');
  // State for selected platforms
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  // State for date and time
  const [scheduleDate, setScheduleDate] = useState<string>(getTodayDate());
  const [scheduleTime, setScheduleTime] = useState<string>('12:00');
  // State for platform options
  const [platformOptions, setPlatformOptions] = useState<Record<string, Record<string, any>>>({});
  // State for view mode
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  // Mock scheduled items
  const [scheduledItems, setScheduledItems] = useState<ScheduleItem[]>([{
    id: '1',
    date: new Date(),
    time: '14:30',
    platforms: ['instagram', 'tiktok'],
    title: 'Tech Tips: Keyboard Shortcuts',
    status: 'scheduled'
  }, {
    id: '2',
    date: new Date(Date.now() + 86400000),
    time: '10:00',
    platforms: ['youtube'],
    title: 'Productivity Apps Review',
    status: 'scheduled'
  }, {
    id: '3',
    date: new Date(Date.now() + 172800000),
    time: '09:00',
    platforms: ['instagram', 'threads', 'blog'],
    title: 'Email Management Strategies',
    status: 'draft'
  }]);
  // Platform definitions
  const platforms: Platform[] = [{
    id: 'instagram',
    name: 'Instagram',
    icon: <InstagramIcon size={16} className="text-pink-500" />,
    color: 'from-pink-500 to-purple-500',
    options: [{
      id: 'post_type',
      name: 'Post Type',
      type: 'select',
      options: [{
        value: 'feed',
        label: 'Feed Post'
      }, {
        value: 'story',
        label: 'Story'
      }, {
        value: 'reel',
        label: 'Reel'
      }],
      default: 'feed'
    }, {
      id: 'caption_length',
      name: 'Caption Length',
      type: 'select',
      options: [{
        value: 'short',
        label: 'Short'
      }, {
        value: 'medium',
        label: 'Medium'
      }, {
        value: 'long',
        label: 'Long'
      }],
      default: 'medium'
    }]
  }, {
    id: 'tiktok',
    name: 'TikTok',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-black dark:text-white">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
        </svg>,
    color: 'from-black to-gray-800 dark:from-gray-200 dark:to-gray-400',
    options: [{
      id: 'hashtags',
      name: 'Include Hashtags',
      type: 'toggle',
      default: true
    }, {
      id: 'sound_category',
      name: 'Sound Category',
      type: 'select',
      options: [{
        value: 'trending',
        label: 'Trending'
      }, {
        value: 'viral',
        label: 'Viral'
      }, {
        value: 'none',
        label: 'No Sound'
      }],
      default: 'trending'
    }]
  }, {
    id: 'youtube',
    name: 'YouTube',
    icon: <YoutubeIcon size={16} className="text-red-500" />,
    color: 'from-red-500 to-red-600',
    options: [{
      id: 'video_type',
      name: 'Video Type',
      type: 'select',
      options: [{
        value: 'short',
        label: 'Short'
      }, {
        value: 'regular',
        label: 'Regular Video'
      }],
      default: 'short'
    }, {
      id: 'title_length',
      name: 'Title Length',
      type: 'select',
      options: [{
        value: 'short',
        label: 'Short (< 40 chars)'
      }, {
        value: 'medium',
        label: 'Medium (40-60 chars)'
      }, {
        value: 'long',
        label: 'Long (60+ chars)'
      }],
      default: 'medium'
    }]
  }, {
    id: 'threads',
    name: 'Threads',
    icon: <SendIcon size={16} className="text-black dark:text-white" />,
    color: 'from-black to-gray-800 dark:from-gray-200 dark:to-gray-400',
    options: [{
      id: 'thread_length',
      name: 'Thread Length',
      type: 'select',
      options: [{
        value: 'single',
        label: 'Single Post'
      }, {
        value: 'thread',
        label: 'Thread (Multiple)'
      }],
      default: 'single'
    }]
  }, {
    id: 'blog',
    name: 'Blog',
    icon: <FileTextIcon size={16} className="text-emerald-500" />,
    color: 'from-emerald-500 to-teal-500',
    options: [{
      id: 'blog_platform',
      name: 'Platform',
      type: 'select',
      options: [{
        value: 'wordpress',
        label: 'WordPress'
      }, {
        value: 'medium',
        label: 'Medium'
      }, {
        value: 'custom',
        label: 'Custom CMS'
      }],
      default: 'wordpress'
    }, {
      id: 'seo_optimization',
      name: 'SEO Optimization',
      type: 'toggle',
      default: true
    }]
  }, {
    id: 'email',
    name: 'Email',
    icon: <MailIcon size={16} className="text-blue-500" />,
    color: 'from-blue-500 to-blue-600',
    options: [{
      id: 'email_list',
      name: 'Email List',
      type: 'select',
      options: [{
        value: 'all',
        label: 'All Subscribers'
      }, {
        value: 'engaged',
        label: 'Engaged Users'
      }, {
        value: 'new',
        label: 'New Subscribers'
      }],
      default: 'all'
    }, {
      id: 'personalization',
      name: 'Personalization',
      type: 'toggle',
      default: true
    }]
  }];
  // Helper function to get today's date in YYYY-MM-DD format
  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  // Handle platform selection
  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        return prev.filter(id => id !== platformId);
      } else {
        return [...prev, platformId];
      }
    });
    // Initialize platform options if not already set
    if (!platformOptions[platformId]) {
      const platform = platforms.find(p => p.id === platformId);
      if (platform?.options) {
        const initialOptions: Record<string, any> = {};
        platform.options.forEach(option => {
          initialOptions[option.id] = option.default;
        });
        setPlatformOptions(prev => ({
          ...prev,
          [platformId]: initialOptions
        }));
      }
    }
  };
  // Handle platform option change
  const handleOptionChange = (platformId: string, optionId: string, value: any) => {
    setPlatformOptions(prev => ({
      ...prev,
      [platformId]: {
        ...prev[platformId],
        [optionId]: value
      }
    }));
  };
  // Handle scheduling
  const handleSchedule = () => {
    const newSchedule = {
      id: `schedule-${Date.now()}`,
      date: new Date(scheduleDate),
      time: scheduleTime,
      platforms: selectedPlatforms,
      title: contentTitle,
      status: 'scheduled' as const
    };
    setScheduledItems(prev => [...prev, newSchedule]);
    onSchedule({
      mode: schedulingMode,
      date: scheduleDate,
      time: scheduleTime,
      platforms: selectedPlatforms,
      platformOptions,
      scheduleId: newSchedule.id
    });
  };
  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  // Get platform icon by ID
  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform?.icon || null;
  };
  return <div className="space-y-6">
      {/* Scheduling Mode Toggle */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Cross-Platform Scheduler
        </h3>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Scheduling Mode:
          </span>
          <button className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${schedulingMode === 'manual' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`} onClick={() => setSchedulingMode('manual')}>
            {schedulingMode === 'manual' ? <ToggleRightIcon size={16} /> : <ToggleLeftIcon size={16} />}
            Manual
          </button>
          <button className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${schedulingMode === 'auto' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`} onClick={() => setSchedulingMode('auto')}>
            {schedulingMode === 'auto' ? <ToggleRightIcon size={16} /> : <ToggleLeftIcon size={16} />}
            Auto
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="space-y-6">
              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Select Platforms
                </label>
                <div className="flex flex-wrap gap-2">
                  {platforms.map(platform => <button key={platform.id} onClick={() => handlePlatformToggle(platform.id)} className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${selectedPlatforms.includes(platform.id) ? `bg-gradient-to-r ${platform.color} text-white` : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                      {platform.icon}
                      <span>{platform.name}</span>
                      {selectedPlatforms.includes(platform.id) && <CheckIcon size={14} className="ml-1" />}
                    </button>)}
                </div>
              </div>
              {/* Date and Time Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <CalendarIcon size={16} className="inline mr-2" />
                    Date
                  </label>
                  <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" min={getTodayDate()} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <ClockIcon size={16} className="inline mr-2" />
                    Time
                  </label>
                  <input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
              </div>
              {/* Frequency (only for Auto mode) */}
              {schedulingMode === 'auto' && <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <RepeatIcon size={16} className="inline mr-2" />
                    Posting Frequency
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" defaultValue="weekly">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>}
              {/* Platform-specific options */}
              {selectedPlatforms.length > 0 && <div className="space-y-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Platform-specific Options
                  </h4>
                  <div className="space-y-4">
                    {selectedPlatforms.map(platformId => {
                  const platform = platforms.find(p => p.id === platformId);
                  if (!platform || !platform.options) return null;
                  return <div key={platformId} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${platform.color} flex items-center justify-center text-white`}>
                              {platform.icon}
                            </div>
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              {platform.name} Options
                            </h5>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {platform.options.map(option => <div key={option.id}>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  {option.name}
                                </label>
                                {option.type === 'select' && <select className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white" value={platformOptions[platformId]?.[option.id] || option.default} onChange={e => handleOptionChange(platformId, option.id, e.target.value)}>
                                    {option.options?.map(opt => <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>)}
                                  </select>}
                                {option.type === 'toggle' && <div className="flex items-center">
                                    <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${platformOptions[platformId]?.[option.id] ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`} onClick={() => handleOptionChange(platformId, option.id, !platformOptions[platformId]?.[option.id])}>
                                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${platformOptions[platformId]?.[option.id] ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                      {platformOptions[platformId]?.[option.id] ? 'Enabled' : 'Disabled'}
                                    </span>
                                  </div>}
                                {option.type === 'input' && <input type="text" className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white" value={platformOptions[platformId]?.[option.id] || ''} onChange={e => handleOptionChange(platformId, option.id, e.target.value)} />}
                              </div>)}
                          </div>
                        </div>;
                })}
                  </div>
                </div>}
              {/* Schedule Button */}
              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="primary" onClick={handleSchedule} disabled={selectedPlatforms.length === 0}>
                  {schedulingMode === 'auto' ? 'Set Up Auto Schedule' : 'Schedule Post'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
        {/* Scheduled Posts */}
        <div>
          <Card title="Scheduled Posts">
            <div className="space-y-4">
              {/* View toggle */}
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Upcoming Posts
                </h4>
                <div className="flex items-center gap-1">
                  <button className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`} onClick={() => setViewMode('list')}>
                    <ListIcon size={14} />
                  </button>
                  <button className={`p-1.5 rounded-md transition-colors ${viewMode === 'calendar' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`} onClick={() => setViewMode('calendar')}>
                    <CalendarDaysIcon size={14} />
                  </button>
                </div>
              </div>
              {/* List view */}
              {viewMode === 'list' && <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {scheduledItems.map(item => <div key={item.id} className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                          {item.title}
                        </h5>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === 'scheduled' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'}`}>
                          {item.status === 'scheduled' ? 'Scheduled' : 'Draft'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <CalendarIcon size={12} />
                        <span>{formatDate(item.date)}</span>
                        <span>•</span>
                        <ClockIcon size={12} />
                        <span>{item.time}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.platforms.map(platform => <div key={platform} className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center" title={platform}>
                            {getPlatformIcon(platform)}
                          </div>)}
                      </div>
                    </div>)}
                  <button className="w-full p-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <PlusIcon size={14} />
                    Add More Posts
                  </button>
                </div>}
              {/* Calendar view */}
              {viewMode === 'calendar' && <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-7 text-center border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="py-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                          {day}
                        </div>)}
                  </div>
                  <div className="grid grid-cols-7 grid-rows-5 h-64">
                    {/* Calendar cells would go here */}
                    {Array.from({
                  length: 35
                }).map((_, i) => <div key={i} className={`border-b border-r border-gray-200 dark:border-gray-700 p-1 text-xs ${i % 7 === 6 ? 'border-r-0' : ''} ${i >= 28 ? 'border-b-0' : ''}`}>
                        <div className="font-medium text-gray-500 dark:text-gray-400">
                          {i % 30 + 1}
                        </div>
                        {/* Example dot for scheduled item */}
                        {i === 8 && <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500"></div>}
                        {i === 15 && <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500"></div>}
                      </div>)}
                  </div>
                </div>}
            </div>
          </Card>
        </div>
      </div>
    </div>;
};
// Helper function to get platform-specific color
export const getPlatformColor = (platformId: string): string => {
  switch (platformId) {
    case 'instagram':
      return 'from-pink-500 to-purple-500';
    case 'tiktok':
      return 'from-black to-gray-800 dark:from-gray-200 dark:to-gray-400';
    case 'youtube':
      return 'from-red-500 to-red-600';
    case 'threads':
      return 'from-black to-gray-800 dark:from-gray-200 dark:to-gray-400';
    case 'blog':
      return 'from-emerald-500 to-teal-500';
    case 'email':
      return 'from-blue-500 to-blue-600';
    default:
      return 'from-gray-500 to-gray-600';
  }
};