import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { PlayIcon, PauseIcon, SettingsIcon, BarChart2Icon, EyeIcon, EditIcon, RepeatIcon, InstagramIcon, TwitterIcon, YoutubeIcon, LinkedinIcon, ClockIcon, CheckCircleIcon, MousePointerClickIcon, TrendingUpIcon, PieChartIcon, FileTextIcon, VideoIcon, ImageIcon, MailIcon, RocketIcon, ToggleLeftIcon, ToggleRightIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PerformanceDrawer } from './PerformanceDrawer';
import { RepurposeContentModal } from './RepurposeContentModal';
interface PlatformIcon {
  [key: string]: React.ReactNode;
}
const platformIcons: PlatformIcon = {
  Instagram: <InstagramIcon size={14} className="text-pink-500" />,
  TikTok: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-black dark:text-white">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>,
  YouTube: <YoutubeIcon size={14} className="text-red-500" />,
  Twitter: <TwitterIcon size={14} className="text-blue-400" />,
  LinkedIn: <LinkedinIcon size={14} className="text-blue-700" />
};
// Define content format icons and colors
const contentFormatIcons: Record<string, {
  icon: React.ReactNode;
  color: string;
  glow: string;
}> = {
  'faceless-video': {
    icon: <VideoIcon size={16} />,
    color: 'border-indigo-500',
    glow: 'shadow-indigo-500/20 dark:shadow-indigo-500/30'
  },
  'blog-to-video': {
    icon: <FileTextIcon size={16} />,
    color: 'border-emerald-500',
    glow: 'shadow-emerald-500/20 dark:shadow-emerald-500/30'
  },
  image: {
    icon: <ImageIcon size={16} />,
    color: 'border-purple-500',
    glow: 'shadow-purple-500/20 dark:shadow-purple-500/30'
  },
  email: {
    icon: <MailIcon size={16} />,
    color: 'border-blue-500',
    glow: 'shadow-blue-500/20 dark:shadow-blue-500/30'
  },
  carousel: {
    icon: <div className="flex items-center justify-center gap-0.5">
        <div className="w-1.5 h-3 rounded-sm bg-current"></div>
        <div className="w-1.5 h-3 rounded-sm bg-current"></div>
        <div className="w-1.5 h-3 rounded-sm bg-current"></div>
      </div>,
    color: 'border-amber-500',
    glow: 'shadow-amber-500/20 dark:shadow-amber-500/30'
  }
};
// Define status colors
const statusColors: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  paused: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  published: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
};
// Define engagement type and badge colors
type EngagementType = 'low' | 'average' | 'viral';
const engagementBadges: Record<EngagementType, {
  color: string;
  icon: React.ReactNode;
  label: string;
}> = {
  low: {
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    icon: <div size={12} />,
    label: 'Low'
  },
  average: {
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    icon: <PieChartIcon size={12} />,
    label: 'Average'
  },
  viral: {
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    icon: <div size={12} />,
    label: 'Viral'
  }
};
interface PipelineStats {
  posts: number;
  views: string;
  engagement: string;
  growth: string;
}
interface PipelineContent {
  id: string;
  title: string;
  type: string;
  platform: string;
  thumbnail?: string;
  engagement: EngagementType;
  stats: {
    views: string;
    likes: string;
    shares: string;
    ctr: string;
  };
  suggestions: string[];
}
interface Pipeline {
  id: string;
  title: string;
  description: string;
  contentType: string;
  platforms: string[];
  schedule: string;
  status: string;
  stats: PipelineStats;
  lastRun: string;
  nextRun: string;
  hasInteractiveElements?: boolean;
  content?: PipelineContent[];
  performanceScore?: number;
}
interface PipelineCardProps {
  pipeline: Pipeline;
}
export const PipelineCard = ({
  pipeline
}: PipelineCardProps) => {
  const [status, setStatus] = useState(pipeline.status);
  const [autoPost, setAutoPost] = useState(true);
  const [activePerformanceId, setActivePerformanceId] = useState<string | null>(null);
  const [repurposeModalOpen, setRepurposeModalOpen] = useState(false);
  const [selectedContentForRepurpose, setSelectedContentForRepurpose] = useState<PipelineContent | null>(null);
  // Get format icon and color
  const formatConfig = contentFormatIcons[pipeline.contentType] || {
    icon: <RocketIcon size={16} />,
    color: 'border-gray-500',
    glow: 'shadow-gray-500/20 dark:shadow-gray-500/30'
  };
  // Mock content if not provided
  const pipelineContent = pipeline.content || [{
    id: '1',
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
    id: '2',
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
    id: '3',
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
  }];
  const handleToggleStatus = () => {
    const newStatus = status === 'active' ? 'paused' : 'active';
    setStatus(newStatus);
    toast.success(`Pipeline ${newStatus === 'active' ? 'activated' : 'paused'}`, {
      description: `"${pipeline.title}" has been ${newStatus === 'active' ? 'activated' : 'paused'}.`
    });
  };
  const handleToggleAutoPost = () => {
    setAutoPost(!autoPost);
    toast.success(`Auto-post ${!autoPost ? 'enabled' : 'disabled'}`, {
      description: `Auto-posting for "${pipeline.title}" has been ${!autoPost ? 'enabled' : 'disabled'}.`
    });
  };
  const handleTogglePerformance = (contentId: string) => {
    setActivePerformanceId(activePerformanceId === contentId ? null : contentId);
  };
  const handleRepurposeContent = (content: PipelineContent) => {
    setSelectedContentForRepurpose(content);
    setRepurposeModalOpen(true);
  };
  const handleRepurposeComplete = (formatTo: string) => {
    toast.success('Content ready for repurposing', {
      description: `Your ${selectedContentForRepurpose?.type} has been prepared for conversion to ${formatTo}. You can now edit and publish it.`
    });
    setRepurposeModalOpen(false);
    setSelectedContentForRepurpose(null);
    // In a real app, this would navigate to the editor with the converted content
  };
  // Get performance badge if available
  const getPerformanceBadge = () => {
    if (pipeline.performanceScore === undefined) return null;
    let color = 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    let label = 'Average';
    let icon = <PieChartIcon size={12} />;
    if (pipeline.performanceScore >= 80) {
      color = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      label = 'High';
      icon = <TrendingUpIcon size={12} />;
    } else if (pipeline.performanceScore >= 60) {
      color = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      label = 'Good';
      icon = <PieChartIcon size={12} />;
    } else if (pipeline.performanceScore < 40) {
      color = 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      label = 'Low';
      icon = <TrendingUpIcon size={12} className="rotate-180" />;
    }
    return <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {icon}
        <span>Performance: {label}</span>
      </div>;
  };
  return <>
      <Card className={`hover:shadow-lg transition-all duration-300 border-l-4 ${formatConfig.color} ${formatConfig.glow}`}>
        <div className="space-y-4">
          {/* Header with format icon, title, status, and toggle */}
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${formatConfig.color.replace('border', 'from')}-400 to-gray-100 dark:to-gray-800 flex items-center justify-center text-white shadow-sm`}>
                {formatConfig.icon}
              </div>
              <div>
                <div className="flex items-center flex-wrap gap-2 mb-1">
                  <h3 className="font-medium text-lg text-gray-900 dark:text-white">
                    {pipeline.title}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || statusColors.draft}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                  {pipeline.hasInteractiveElements && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                      <MousePointerClickIcon size={10} className="mr-0.5" />
                      Interactive
                    </span>}
                  {getPerformanceBadge()}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {pipeline.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Auto-post
                </span>
                <button onClick={handleToggleAutoPost} className="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none" aria-pressed={autoPost}>
                  {autoPost ? <ToggleRightIcon size={18} className="text-emerald-500" /> : <ToggleLeftIcon size={18} className="text-gray-400" />}
                </button>
              </div>
              <Button variant={status === 'active' ? 'outline' : 'primary'} size="sm" leftIcon={status === 'active' ? <PauseIcon size={14} /> : <PlayIcon size={14} />} onClick={handleToggleStatus}>
                {status === 'active' ? 'Pause' : 'Activate'}
              </Button>
            </div>
          </div>
          {/* Platform and Schedule row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Platforms
              </p>
              <div className="flex space-x-2">
                {pipeline.platforms.map(platform => <div key={platform} className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center" title={platform}>
                    {platformIcons[platform]}
                  </div>)}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Schedule
              </p>
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <ClockIcon size={14} className="mr-1 text-gray-400" />
                {pipeline.schedule}
              </div>
            </div>
          </div>
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Posts</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {pipeline.stats.posts}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Views</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {pipeline.stats.views}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Engagement
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {pipeline.stats.engagement}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Growth</p>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {pipeline.stats.growth}
              </p>
            </div>
          </div>
          {/* Content blocks */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Recent Content
              </h4>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="!py-1 !px-2 text-xs" as={Link} to={`/autopilot/media?id=${pipeline.id}`} leftIcon={<EyeIcon size={12} />}>
                  View All
                </Button>
              </div>
            </div>
            {pipelineContent.map(content => <div key={content.id} className="space-y-2">
                <div className="flex items-start gap-3">
                  {content.thumbnail && <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden relative">
                      <img src={content.thumbnail} alt={content.title} className="w-full h-full object-cover" />
                      {/* Engagement badge */}
                      <div className={`absolute bottom-0 right-0 flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium ${engagementBadges[content.engagement].color}`}>
                        {engagementBadges[content.engagement].icon}
                        <span>
                          {engagementBadges[content.engagement].label}
                        </span>
                      </div>
                    </div>}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                        {content.title}
                      </h5>
                      <div className="flex-shrink-0 flex items-center gap-1">
                        <button onClick={() => handleTogglePerformance(content.id)} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${activePerformanceId === content.id ? 'bg-indigo-500 text-white' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'}`}>
                          <TrendingUpIcon size={10} />
                          Stats
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        {platformIcons[content.platform]}
                        {content.platform}
                      </span>
                      <span>•</span>
                      <span>{content.type}</span>
                      <span>•</span>
                      <span>{content.stats.views} views</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      <button onClick={() => handleRepurposeContent(content)} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                        <RepeatIcon size={10} />
                        Repurpose
                      </button>
                      <button className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                        <EditIcon size={10} />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
                {/* Performance drawer */}
                <PerformanceDrawer isOpen={activePerformanceId === content.id} onClose={() => setActivePerformanceId(null)} data={{
              views: content.stats.views,
              likes: content.stats.likes,
              shares: content.stats.shares,
              ctr: content.stats.ctr,
              trend: content.engagement === 'viral' ? 'up' : content.engagement === 'low' ? 'down' : 'stable',
              suggestions: content.suggestions
            }} contentTitle={content.title} />
              </div>)}
          </div>
          {/* Footer with next run info and action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {status === 'active' ? <span>Next run: {pipeline.nextRun}</span> : <span>Last run: {pipeline.lastRun}</span>}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="!p-1.5" as={Link} to={`/autopilot/analytics?id=${pipeline.id}`} title="View Analytics">
                <BarChart2Icon size={14} />
              </Button>
              <Button variant="outline" size="sm" className="!p-1.5" as={Link} to={`/autopilot/create?edit=${pipeline.id}`} title="Edit Pipeline">
                <SettingsIcon size={14} />
              </Button>
            </div>
          </div>
        </div>
      </Card>
      {/* Repurpose Content Modal */}
      {selectedContentForRepurpose && <RepurposeContentModal isOpen={repurposeModalOpen} onClose={() => setRepurposeModalOpen(false)} content={selectedContentForRepurpose} onRepurpose={handleRepurposeComplete} />}
    </>;
};