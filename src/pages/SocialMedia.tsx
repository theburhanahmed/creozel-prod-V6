import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Share2Icon, 
  InstagramIcon, 
  TwitterIcon, 
  LinkedinIcon, 
  FacebookIcon, 
  YoutubeIcon, 
  CalendarIcon,
  PlusIcon,
  Trash2Icon,
  ExternalLinkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../supabase/client';
import { socialService } from '../services/social/socialService';

interface ConnectedAccount {
  id: string;
  provider: string;
  account_name: string;
  is_active: boolean;
  connected_at: string;
}

interface ScheduledPost {
  id: string;
  content: string;
  platforms: string[];
  scheduled_time: string;
  status: 'pending' | 'posted' | 'failed';
  created_at: string;
}

export const SocialMedia = () => {
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduleTime, setScheduleTime] = useState('');

  useEffect(() => {
    loadConnectedAccounts();
    loadScheduledPosts();
  }, []);

  const loadConnectedAccounts = async () => {
    try {
      const accounts = await socialService.getConnectedAccounts();
      setConnectedAccounts(accounts || []);
    } catch (error) {
      console.error('Failed to load connected accounts:', error);
    }
  };

  const loadScheduledPosts = async () => {
    try {
      // This would typically come from a database query
      // For now, we'll use mock data
      const mockPosts: ScheduledPost[] = [
        {
          id: '1',
          content: 'Excited to share our latest product launch! 🚀',
          platforms: ['twitter', 'linkedin'],
          scheduled_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          created_at: new Date().toISOString(),
        },
      ];
      setScheduledPosts(mockPosts);
    } catch (error) {
      console.error('Failed to load scheduled posts:', error);
    }
  };

  const handleConnectPlatform = async (platform: string) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would redirect to OAuth
      // For now, we'll simulate the connection
      const mockAccount: ConnectedAccount = {
        id: Date.now().toString(),
        provider: platform,
        account_name: `@user_${platform}`,
        is_active: true,
        connected_at: new Date().toISOString(),
      };
      
      setConnectedAccounts(prev => [...prev, mockAccount]);
      toast.success(`${platform} account connected successfully!`);
      setShowConnectModal(false);
    } catch (error) {
      toast.error(`Failed to connect ${platform} account`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnectPlatform = async (platform: string) => {
    try {
      await socialService.disconnectPlatform(platform);
      setConnectedAccounts(prev => prev.filter(acc => acc.provider !== platform));
      toast.success(`${platform} account disconnected successfully!`);
    } catch (error) {
      toast.error(`Failed to disconnect ${platform} account`);
    }
  };

  const handleSchedulePost = async () => {
    if (!postContent.trim() || selectedPlatforms.length === 0 || !scheduleTime) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const post: ScheduledPost = {
        id: Date.now().toString(),
        content: postContent,
        platforms: selectedPlatforms,
        scheduled_time: scheduleTime,
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      // In a real implementation, this would call the social service
      setScheduledPosts(prev => [...prev, post]);
      toast.success('Post scheduled successfully!');
      setShowScheduleModal(false);
      setPostContent('');
      setSelectedPlatforms([]);
      setScheduleTime('');
    } catch (error) {
      toast.error('Failed to schedule post');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostNow = async (post: ScheduledPost) => {
    try {
      // In a real implementation, this would call the social service
      const updatedPosts = scheduledPosts.map(p => 
        p.id === post.id ? { ...p, status: 'posted' as const } : p
      );
      setScheduledPosts(updatedPosts);
      toast.success('Post published successfully!');
    } catch (error) {
      toast.error('Failed to publish post');
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      setScheduledPosts(prev => prev.filter(p => p.id !== postId));
      toast.success('Post deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: InstagramIcon, color: 'from-pink-500 to-purple-600' },
    { id: 'twitter', name: 'Twitter/X', icon: TwitterIcon, color: 'from-blue-400 to-blue-600' },
    { id: 'linkedin', name: 'LinkedIn', icon: LinkedinIcon, color: 'from-blue-600 to-blue-800' },
    { id: 'facebook', name: 'Facebook', icon: FacebookIcon, color: 'from-blue-600 to-blue-800' },
    { id: 'youtube', name: 'YouTube', icon: YoutubeIcon, color: 'from-red-500 to-red-700' },
  ];

  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (platform) {
      const Icon = platform.icon;
      return <Icon className="h-4 w-4" />;
    }
    return null;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'posted':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'failed':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <Share2Icon className="h-8 w-8 text-green-500" />
          Social Media Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Connect your social accounts and schedule posts across multiple platforms
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connected Accounts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Connected Accounts
            </h2>
            <Button
              onClick={() => setShowConnectModal(true)}
              leftIcon={<PlusIcon className="h-4 w-4" />}
              size="sm"
            >
              Connect Account
            </Button>
          </div>

          <div className="space-y-3">
            {connectedAccounts.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Share2Icon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No social accounts connected yet</p>
                <p className="text-sm">Connect your first account to get started</p>
              </div>
            ) : (
              connectedAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white">
                      {getPlatformIcon(account.provider)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {account.provider}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {account.account_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      account.is_active 
                        ? 'text-green-600 bg-green-100 dark:bg-green-900/20' 
                        : 'text-red-600 bg-red-100 dark:bg-red-900/20'
                    }`}>
                      {account.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <Button
                      onClick={() => handleDisconnectPlatform(account.provider)}
                      variant="outline"
                      size="sm"
                      leftIcon={<Trash2Icon className="h-4 w-4" />}
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          
          <div className="space-y-3">
            <Button
              onClick={() => setShowScheduleModal(true)}
              leftIcon={<CalendarIcon className="h-4 w-4" />}
              fullWidth
              size="lg"
            >
              Schedule New Post
            </Button>
            
            <Button
              variant="outline"
              leftIcon={<ExternalLinkIcon className="h-4 w-4" />}
              fullWidth
              size="lg"
            >
              View Analytics
            </Button>
          </div>

          {/* Platform Status */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Platform Status
            </h3>
            <div className="space-y-2">
              {platforms.map((platform) => {
                const isConnected = connectedAccounts.some(acc => acc.provider === platform.id);
                const Icon = platform.icon;
                return (
                  <div
                    key={platform.id}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      isConnected 
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                        : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${platform.color} flex items-center justify-center text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {platform.name}
                    </span>
                    <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                      isConnected 
                        ? 'text-green-600 bg-green-100 dark:bg-green-900/20' 
                        : 'text-gray-500 bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {isConnected ? 'Connected' : 'Not Connected'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* Scheduled Posts */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Scheduled Posts
          </h2>
          <Button
            onClick={() => setShowScheduleModal(true)}
            leftIcon={<PlusIcon className="h-4 w-4" />}
            size="sm"
          >
            Schedule Post
          </Button>
        </div>

        <div className="space-y-3">
          {scheduledPosts.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No scheduled posts yet</p>
              <p className="text-sm">Schedule your first post to get started</p>
            </div>
          ) : (
            scheduledPosts.map((post) => (
              <div
                key={post.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white mb-2">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {new Date(post.scheduled_time).toLocaleString()}
                      </span>
                      <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(post.status)}`}>
                        {getStatusIcon(post.status)}
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {post.status === 'pending' && (
                      <Button
                        onClick={() => handlePostNow(post)}
                        size="sm"
                        variant="outline"
                      >
                        Post Now
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDeletePost(post.id)}
                      size="sm"
                      variant="outline"
                      leftIcon={<Trash2Icon className="h-4 w-4" />}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Platforms:</span>
                  <div className="flex gap-1">
                    {post.platforms.map((platform) => (
                      <div
                        key={platform}
                        className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                        title={platform}
                      >
                        {getPlatformIcon(platform)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Connect Account Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Connect Social Account
            </h3>
            
            <div className="space-y-4">
              {platforms.map((platform) => {
                const isConnected = connectedAccounts.some(acc => acc.provider === platform.id);
                const Icon = platform.icon;
                return (
                  <Button
                    key={platform.id}
                    onClick={() => handleConnectPlatform(platform.id)}
                    disabled={isConnected || isLoading}
                    variant={isConnected ? "outline" : "primary"}
                    fullWidth
                    leftIcon={<Icon className="h-4 w-4" />}
                  >
                    {isConnected ? 'Connected' : `Connect ${platform.name}`}
                  </Button>
                );
              })}
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={() => setShowConnectModal(false)}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Schedule Post Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Schedule New Post
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Post Content
                </label>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="What would you like to post?"
                  className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Platforms
                </label>
                <div className="space-y-2">
                  {platforms.map((platform) => {
                    const Icon = platform.icon;
                    const isSelected = selectedPlatforms.includes(platform.id);
                    const isConnected = connectedAccounts.some(acc => acc.provider === platform.id);
                    
                    return (
                      <label
                        key={platform.id}
                        className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer ${
                          isSelected 
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                            : 'border-gray-200 dark:border-gray-700'
                        } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPlatforms(prev => [...prev, platform.id]);
                            } else {
                              setSelectedPlatforms(prev => prev.filter(p => p !== platform.id));
                            }
                          }}
                          disabled={!isConnected}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${platform.color} flex items-center justify-center text-white`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {platform.name}
                        </span>
                        {!isConnected && (
                          <span className="ml-auto text-xs text-red-500">Not Connected</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Schedule Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                onClick={() => setShowScheduleModal(false)}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSchedulePost}
                disabled={isLoading || !postContent.trim() || selectedPlatforms.length === 0 || !scheduleTime}
                size="sm"
              >
                Schedule Post
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
