import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { RefreshCwIcon, XIcon, CheckIcon, LoaderIcon, ExternalLinkIcon, AlertCircleIcon, ShieldIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ConfirmationModal } from '../ui/ConfirmationModal';
// Platform icons
import { InstagramIcon, TwitterIcon, LinkedinIcon, YoutubeIcon, FacebookIcon } from 'lucide-react';
import { socialService } from '../../services/social/socialService';
import { useAuth } from '../../contexts/AuthContext';
import { getFacebookOAuthUrl, getLinkedInOAuthUrl, getGoogleOAuthUrl, getTwitterOAuthUrl, getYouTubeOAuthUrl, getInstagramOAuthUrl, getTikTokOAuthUrl } from '../../services/social/socialService';
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
  // Accounts state, initially empty
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [accountToDisconnect, setAccountToDisconnect] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  // Load connected platforms from API
  useEffect(() => {
    setIsLoading(true);
    socialService.getConnectedPlatforms()
      .then((data: SocialAccount[]) => {
        setAccounts(data || []);
      })
      .catch((err: Error) => {
        toast.error('Failed to load connected accounts');
      })
      .finally(() => setIsLoading(false));
  }, []);
  // Connect a platform (Facebook: real OAuth2, others: placeholder)
  const handleConnect = async (platformId: string) => {
    if (!user?.id) {
      toast.error('You must be logged in to connect accounts');
      return;
    }
    if (platformId === 'facebook') {
      const redirectUri = `${window.location.origin}/auth/callback/facebook`;
      const url = getFacebookOAuthUrl(user.id, redirectUri);
      window.location.href = url;
      return;
    }
    if (platformId === 'linkedin') {
      const redirectUri = `${window.location.origin}/auth/callback/linkedin`;
      const url = getLinkedInOAuthUrl(user.id, redirectUri);
      window.location.href = url;
      return;
    }
    if (platformId === 'google') {
      const redirectUri = `${window.location.origin}/auth/callback/google`;
      const url = getGoogleOAuthUrl(user.id, redirectUri);
      window.location.href = url;
      return;
    }
    if (platformId === 'twitter' || platformId === 'x') {
      const redirectUri = `${window.location.origin}/auth/callback/twitter`;
      const codeChallenge = await generateCodeChallenge();
      const url = getTwitterOAuthUrl(user.id, redirectUri, codeChallenge);
      window.location.href = url;
      return;
    }
    if (platformId === 'youtube') {
      const redirectUri = `${window.location.origin}/auth/callback/youtube`;
      const url = getYouTubeOAuthUrl(user.id, redirectUri);
      window.location.href = url;
      return;
    }
    if (platformId === 'instagram') {
      const redirectUri = `${window.location.origin}/auth/callback/instagram`;
      const url = getInstagramOAuthUrl(user.id, redirectUri);
      window.location.href = url;
      return;
    }
    if (platformId === 'tiktok') {
      const redirectUri = `${window.location.origin}/auth/callback/tiktok`;
      const url = getTikTokOAuthUrl(user.id, redirectUri);
      window.location.href = url;
      return;
    }
    // Placeholder for other platforms
    toast.info('OAuth2 flow for this platform is not yet implemented.');
  };
  // Open disconnect confirmation modal
  const openDisconnectModal = (platformId: string) => {
    setAccountToDisconnect(platformId);
    setIsDisconnecting(true);
  };
  // Confirm disconnect
  const confirmDisconnect = async () => {
    if (!accountToDisconnect) return;
    try {
      toast.loading(`Disconnecting from ${accountToDisconnect}...`);
      await socialService.disconnect(accountToDisconnect);
      // Refresh accounts
      const data = await socialService.getConnectedPlatforms();
      setAccounts(data || []);
      setIsDisconnecting(false);
      setAccountToDisconnect(null);
      toast.dismiss();
      toast.success(`Disconnected from ${accountToDisconnect}`, {
        description: 'Your account has been unlinked successfully.'
      });
    } catch (err: any) {
      toast.dismiss();
      toast.error(`Failed to disconnect: ${err.message || err}`);
    }
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
  // PKCE code challenge generator
  async function generateCodeChallenge() {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    const codeVerifier = btoa(String.fromCharCode(...array)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(digest));
    const codeChallenge = btoa(String.fromCharCode(...hashArray)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    sessionStorage.setItem('twitter_code_verifier', codeVerifier);
    return codeChallenge;
  }
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
