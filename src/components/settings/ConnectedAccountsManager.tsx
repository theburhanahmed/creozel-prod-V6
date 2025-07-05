import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { RefreshCwIcon, XIcon, CheckIcon, LoaderIcon, ExternalLinkIcon, AlertCircleIcon, ShieldIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ConfirmationModal } from '../ui/ConfirmationModal';
// Platform icons
import { InstagramIcon, TwitterIcon, LinkedinIcon, YoutubeIcon, FacebookIcon } from 'lucide-react';
// Define types
interface SocialAccount {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  username?: string;
  profileUrl?: string;
  connected: boolean;
  lastRefreshed?: string;
  followers?: number;
  isRefreshing?: boolean;
}
export const ConnectedAccountsManager = () => {
  // Mock accounts data - in a real app, this would come from an API
  const [accounts, setAccounts] = useState<SocialAccount[]>([{
    id: 'youtube',
    name: 'YouTube',
    icon: <YoutubeIcon size={18} />,
    color: 'from-red-500 to-red-600',
    username: 'CreativeTechChannel',
    profileUrl: 'https://youtube.com/creativetechchannel',
    connected: true,
    lastRefreshed: '2 hours ago',
    followers: 12500
  }, {
    id: 'instagram',
    name: 'Instagram',
    icon: <InstagramIcon size={18} />,
    color: 'from-pink-500 to-purple-500',
    username: 'creativedash',
    profileUrl: 'https://instagram.com/creativedash',
    connected: true,
    lastRefreshed: '1 hour ago',
    followers: 8750
  }, {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: <TwitterIcon size={18} />,
    color: 'from-blue-400 to-blue-600',
    username: '@creativedash',
    profileUrl: 'https://twitter.com/creativedash',
    connected: true,
    lastRefreshed: '30 minutes ago',
    followers: 5280
  }, {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <LinkedinIcon size={18} />,
    color: 'from-blue-700 to-blue-900',
    connected: false
  }, {
    id: 'facebook',
    name: 'Facebook',
    icon: <FacebookIcon size={18} />,
    color: 'from-blue-600 to-blue-800',
    connected: false
  }, {
    id: 'threads',
    name: 'Threads',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.7001 7.41006C18.2276 6.94766 17.6533 6.59064 17.0212 6.35878C16.389 6.12692 15.7143 6.02513 15.0401 6.06006C13.1514 6.06006 11.8001 6.91006 11.0001 8.60006C10.3201 6.91006 9.00009 6.06006 7.00009 6.06006C3.60009 6.06006 1.00009 8.56006 1.00009 12.1301C0.988851 13.1661 1.19382 14.1918 1.60009 15.1301C2.30009 16.6301 3.50009 17.9301 5.20009 19.0001C6.70009 19.9601 8.30009 20.7301 10.0001 21.2001L11.0001 21.4001L12.0001 21.2001C13.7001 20.7301 15.3001 19.9601 16.8001 19.0001C18.5001 17.9301 19.7001 16.6301 20.4001 15.1301C20.8063 14.1918 21.0113 13.1661 21.0001 12.1301C21.0001 10.2801 20.1001 8.65006 18.7001 7.41006ZM17.4001 13.5001C17.2203 14.4165 16.7899 15.2587 16.1601 15.9301C15.6001 16.5301 14.9001 17.0301 14.1001 17.5001C13.4001 17.9001 12.7001 18.2001 12.0001 18.3001C11.3001 18.2001 10.6001 17.9001 9.90009 17.5001C9.10009 17.0301 8.40009 16.5301 7.84009 15.9301C7.21034 15.2587 6.77986 14.4165 6.60009 13.5001C6.52144 13.0238 6.52144 12.5364 6.60009 12.0601C6.70009 11.5601 6.90009 11.1601 7.10009 10.7601C7.30009 10.3601 7.60009 10.0601 8.00009 9.76006C8.40009 9.46006 8.80009 9.26006 9.30009 9.16006C9.80009 9.06006 10.3001 9.06006 10.8001 9.16006C11.3001 9.26006 11.7001 9.46006 12.1001 9.76006C12.5001 10.0601 12.8001 10.3601 13.0001 10.7601C13.2001 11.1601 13.4001 11.5601 13.5001 12.0601C13.5788 12.5364 13.5788 13.0238 13.5001 13.5001H17.4001Z" />
        </svg>,
    color: 'from-gray-800 to-gray-900 dark:from-gray-200 dark:to-gray-100',
    connected: false
  }]);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [accountToDisconnect, setAccountToDisconnect] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Simulate API loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  // Connect a platform
  const handleConnect = (platformId: string) => {
    // In a real app, this would trigger OAuth flow
    toast.loading(`Connecting to ${platformId}...`);
    // Simulate API call
    setTimeout(() => {
      setAccounts(prev => prev.map(account => {
        if (account.id === platformId) {
          // Mock data for newly connected accounts
          const mockData: Partial<SocialAccount> = {
            connected: true,
            lastRefreshed: 'Just now'
          };
          // Add platform-specific mock data
          if (platformId === 'linkedin') {
            mockData.username = 'creativedash-company';
            mockData.profileUrl = 'https://linkedin.com/company/creativedash';
            mockData.followers = 3200;
          } else if (platformId === 'facebook') {
            mockData.username = 'CreativeDash';
            mockData.profileUrl = 'https://facebook.com/creativedash';
            mockData.followers = 15800;
          } else if (platformId === 'threads') {
            mockData.username = '@creativedash';
            mockData.profileUrl = 'https://threads.net/creativedash';
            mockData.followers = 2400;
          }
          return {
            ...account,
            ...mockData
          };
        }
        return account;
      }));
      toast.dismiss();
      toast.success(`Successfully connected to ${platformId}`, {
        description: 'Your account has been linked successfully.'
      });
    }, 2000);
  };
  // Open disconnect confirmation modal
  const openDisconnectModal = (platformId: string) => {
    setAccountToDisconnect(platformId);
    setIsDisconnecting(true);
  };
  // Confirm disconnect
  const confirmDisconnect = () => {
    if (!accountToDisconnect) return;
    // In a real app, this would call an API to revoke access
    toast.loading(`Disconnecting from ${accountToDisconnect}...`);
    // Simulate API call
    setTimeout(() => {
      setAccounts(prev => prev.map(account => {
        if (account.id === accountToDisconnect) {
          return {
            ...account,
            connected: false,
            username: undefined,
            profileUrl: undefined,
            lastRefreshed: undefined,
            followers: undefined
          };
        }
        return account;
      }));
      setIsDisconnecting(false);
      setAccountToDisconnect(null);
      toast.dismiss();
      toast.success(`Disconnected from ${accountToDisconnect}`, {
        description: 'Your account has been unlinked successfully.'
      });
    }, 1500);
  };
  // Refresh account data
  const handleRefresh = (platformId: string) => {
    setAccounts(prev => prev.map(account => {
      if (account.id === platformId) {
        return {
          ...account,
          isRefreshing: true
        };
      }
      return account;
    }));
    // Simulate API refresh
    setTimeout(() => {
      setAccounts(prev => prev.map(account => {
        if (account.id === platformId) {
          return {
            ...account,
            isRefreshing: false,
            lastRefreshed: 'Just now',
            // Simulate updated follower count
            followers: account.followers ? account.followers + Math.floor(Math.random() * 10) : undefined
          };
        }
        return account;
      }));
      toast.success(`Refreshed ${platformId} data`, {
        description: 'Your account data has been updated.'
      });
    }, 1500);
  };
  // Format follower count
  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };
  if (isLoading) {
    return <div className="flex items-center justify-center py-12">
        <LoaderIcon size={24} className="animate-spin text-indigo-500" />
        <span className="ml-2 text-gray-600 dark:text-gray-300">
          Loading accounts...
        </span>
      </div>;
  }
  return <>
      <div className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map(account => <Card key={account.id} className="overflow-hidden backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <div className="relative">
                {/* Platform color band */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${account.color}`}></div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${account.color} flex items-center justify-center text-white`}>
                        {account.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {account.name}
                        </h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${account.connected ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
                          {account.connected ? 'Connected' : 'Not Connected'}
                        </span>
                      </div>
                    </div>
                    {account.connected && <button onClick={() => handleRefresh(account.id)} className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Refresh account data" disabled={account.isRefreshing}>
                        <RefreshCwIcon size={14} className={account.isRefreshing ? 'animate-spin' : ''} />
                      </button>}
                  </div>
                  {account.connected ? <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Username
                            </span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {account.username}
                            </span>
                          </div>
                          {account.followers !== undefined && <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Followers
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {formatFollowers(account.followers)}
                              </span>
                            </div>}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Last refreshed
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {account.lastRefreshed}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <a href={account.profileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center hover:underline">
                          View Profile{' '}
                          <ExternalLinkIcon size={12} className="ml-1" />
                        </a>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" leftIcon={<RefreshCwIcon size={12} />} onClick={() => handleConnect(account.id)} className="text-xs">
                            Reconnect
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/10" leftIcon={<XIcon size={12} />} onClick={() => openDisconnectModal(account.id)}>
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    </div> : <div className="mt-4">
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-gray-400 dark:text-gray-500">
                            <AlertCircleIcon size={16} />
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Connect your {account.name} account to schedule
                            posts and analyze performance.
                          </p>
                        </div>
                      </div>
                      <Button variant="primary" size="sm" leftIcon={<ShieldIcon size={14} />} onClick={() => handleConnect(account.id)} className="w-full">
                        Connect {account.name}
                      </Button>
                    </div>}
                </div>
              </div>
            </Card>)}
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-indigo-500 mt-0.5">
              <ShieldIcon size={18} />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                Data & Privacy
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                We only request access to publish content and view basic
                analytics. We never post without your explicit permission or
                access private messages.
              </p>
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal isOpen={isDisconnecting} onClose={() => setIsDisconnecting(false)} onConfirm={confirmDisconnect} title="Disconnect Account" description={`Are you sure you want to disconnect your ${accountToDisconnect} account? You'll need to reconnect to publish content to this platform.`} confirmLabel="Disconnect" isDanger />
    </>;
};