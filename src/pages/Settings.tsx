import React, { useEffect, useState } from 'react';
import { Card, CardMenu } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SaveIcon, UserIcon, BellIcon, ShieldIcon, PaletteIcon, CreditCardIcon, DollarSignIcon, SettingsIcon, LogOutIcon, KeyIcon, MicIcon, ToggleLeftIcon, ToggleRightIcon, MonitorIcon, SlidersIcon, EditIcon, PlusIcon, InstagramIcon, TwitterIcon, LinkedinIcon, YoutubeIcon, TrendingUpIcon, MailIcon, UploadIcon, AlertCircleIcon, FileTextIcon, VideoIcon, ImageIcon, CheckIcon, XIcon, ClockIcon, ZapIcon, RefreshCwIcon, UsersIcon } from 'lucide-react';
import { BrandingSettings, BrandSettings } from '../components/settings/BrandingSettings';
import { toast } from 'sonner';
export const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [brandSettings, setBrandSettings] = useState<BrandSettings>({
    primaryColor: '#4f46e5',
    secondaryColor: '#8b5cf6',
    accentColor: '#ec4899',
    fontPrimary: 'sans-serif',
    fontSecondary: 'sans-serif',
    voiceTone: 'professional',
    logo: undefined
  });
  // Mock user data
  const userData = {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'Admin',
    avatar: null,
    timezone: 'America/New_York',
    language: 'en-US'
  };
  // Mock connected accounts
  const connectedAccounts = [{
    id: 'instagram',
    name: 'Instagram',
    connected: true,
    icon: <InstagramIcon size={16} className="text-pink-500" />
  }, {
    id: 'twitter',
    name: 'Twitter',
    connected: true,
    icon: <TwitterIcon size={16} className="text-blue-400" />
  }, {
    id: 'linkedin',
    name: 'LinkedIn',
    connected: false,
    icon: <LinkedinIcon size={16} className="text-blue-700" />
  }, {
    id: 'youtube',
    name: 'YouTube',
    connected: true,
    icon: <YoutubeIcon size={16} className="text-red-500" />
  }];
  // Mock notification settings
  const notificationSettings = {
    email: true,
    push: true,
    contentPublished: true,
    mentions: true,
    teamUpdates: false,
    analytics: true
  };
  // Mock content defaults
  const contentDefaults = {
    voiceType: 'female',
    language: 'english',
    videoResolution: '1080p',
    imageStyle: 'modern',
    autoSave: true
  };
  // Mock subscription plan
  const subscriptionPlan = {
    name: 'Pro Plan',
    price: '$29/month',
    nextBilling: '2023-10-15',
    features: ['Unlimited content creation', 'Advanced AI features', 'Priority support', 'Team collaboration']
  };
  // Mock billing history
  const billingHistory = [{
    id: 1,
    date: '2023-09-15',
    amount: '$29.00',
    status: 'Paid',
    description: 'Pro Plan - Monthly'
  }, {
    id: 2,
    date: '2023-08-15',
    amount: '$29.00',
    status: 'Paid',
    description: 'Pro Plan - Monthly'
  }, {
    id: 3,
    date: '2023-07-15',
    amount: '$29.00',
    status: 'Paid',
    description: 'Pro Plan - Monthly'
  }];
  // Mock wallet transactions
  const walletTransactions = [{
    id: 1,
    date: '2023-09-20',
    amount: '+100',
    description: 'Credit purchase',
    type: 'topup'
  }, {
    id: 2,
    date: '2023-09-18',
    amount: '-15',
    description: 'Video generation',
    type: 'usage'
  }, {
    id: 3,
    date: '2023-09-15',
    amount: '-8',
    description: 'Image generation',
    type: 'usage'
  }, {
    id: 4,
    date: '2023-09-10',
    amount: '+50',
    description: 'Credit purchase',
    type: 'topup'
  }];
  const handleSaveBrandSettings = (settings: BrandSettings) => {
    setBrandSettings(settings);
    toast.success('Brand settings saved successfully');
  };
  const handleSaveProfile = () => {
    toast.success('Profile settings saved successfully');
  };
  const handleSavePreferences = () => {
    toast.success('Preferences saved successfully');
  };
  const handleConnectAccount = (accountId: string) => {
    toast.success(`Connected to ${accountId} successfully`);
  };
  const handleDisconnectAccount = (accountId: string) => {
    toast.success(`Disconnected from ${accountId}`);
  };
  const handleSaveContentDefaults = () => {
    toast.success('Content defaults saved successfully');
  };
  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved');
  };
  const handleChangePlan = () => {
    toast.success('Redirecting to plan selection...');
  };
  const handleCancelSubscription = () => {
    toast.success('Subscription cancellation initiated');
  };
  // Get tab from URL if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['profile', 'preferences', 'content-defaults', 'branding', 'notifications', 'security', 'billing'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);
  const tabs = [{
    id: 'profile',
    label: 'Profile',
    icon: <UserIcon size={16} />
  }, {
    id: 'preferences',
    label: 'Preferences',
    icon: <SettingsIcon size={16} />
  }, {
    id: 'content-defaults',
    label: 'Content Defaults',
    icon: <SlidersIcon size={16} />
  }, {
    id: 'branding',
    label: 'Branding',
    icon: <PaletteIcon size={16} />
  }, {
    id: 'notifications',
    label: 'Notifications',
    icon: <BellIcon size={16} />
  }, {
    id: 'security',
    label: 'Security',
    icon: <ShieldIcon size={16} />
  }, {
    id: 'billing',
    label: 'Billing & Plan',
    icon: <CreditCardIcon size={16} />
  }];
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your account settings and preferences
          </p>
        </div>
      </div>
      {/* Enhanced CardMenu navigation */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <CardMenu items={[{
        icon: <UserIcon size={18} />,
        title: 'Profile',
        href: '#profile',
        onClick: () => setActiveTab('profile')
      }, {
        icon: <SettingsIcon size={18} />,
        title: 'Preferences',
        href: '#preferences',
        onClick: () => setActiveTab('preferences')
      }, {
        icon: <SlidersIcon size={18} />,
        title: 'Content',
        href: '#content-defaults',
        onClick: () => setActiveTab('content-defaults')
      }, {
        icon: <PaletteIcon size={18} />,
        title: 'Branding',
        href: '#branding',
        onClick: () => setActiveTab('branding')
      }, {
        icon: <BellIcon size={18} />,
        title: 'Notifications',
        href: '#notifications',
        onClick: () => setActiveTab('notifications')
      }, {
        icon: <ShieldIcon size={18} />,
        title: 'Security',
        href: '#security',
        onClick: () => setActiveTab('security')
      }, {
        icon: <CreditCardIcon size={18} />,
        title: 'Billing',
        href: '#billing',
        onClick: () => setActiveTab('billing')
      }]} />
      </div>
      {/* Main content area - full width */}
      <div className="pb-24">
        <div className="grid grid-cols-1 gap-6">
          <div className="lg:col-span-3">
            <Card className="overflow-hidden"></Card>
          </div>
          <div className="lg:col-span-9">
            {/* Profile Settings */}
            {activeTab === 'profile' && <div className="space-y-6">
                <Card title="Personal Information">
                  <div className="p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                          {userData.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <UploadIcon size={14} />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {userData.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {userData.email}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {userData.role}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name
                        </label>
                        <div className="flex">
                          <input type="text" defaultValue={userData.name} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address
                        </label>
                        <div className="flex">
                          <input type="email" defaultValue={userData.email} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Timezone
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                          <option value="America/New_York">
                            Eastern Time (US & Canada)
                          </option>
                          <option value="America/Chicago">
                            Central Time (US & Canada)
                          </option>
                          <option value="America/Denver">
                            Mountain Time (US & Canada)
                          </option>
                          <option value="America/Los_Angeles">
                            Pacific Time (US & Canada)
                          </option>
                          <option value="Europe/London">London</option>
                          <option value="Europe/Paris">Paris</option>
                          <option value="Asia/Tokyo">Tokyo</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Language
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                          <option value="en-US">English (US)</option>
                          <option value="en-GB">English (UK)</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="ja">Japanese</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="primary" leftIcon={<SaveIcon size={16} />} onClick={handleSaveProfile}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </Card>
                <Card title="Password">
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Current Password
                        </label>
                        <div className="flex">
                          <input type="password" placeholder="••••••••" className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                        </div>
                      </div>
                      <div className="md:pt-7">
                        <a href="#" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                          Forgot password?
                        </a>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          New Password
                        </label>
                        <div className="flex">
                          <input type="password" placeholder="••••••••" className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Confirm New Password
                        </label>
                        <div className="flex">
                          <input type="password" placeholder="••••••••" className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="primary" leftIcon={<KeyIcon size={16} />}>
                        Update Password
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>}
            {/* Preferences Settings */}
            {activeTab === 'preferences' && <Card title="Application Preferences">
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Theme
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 flex flex-col items-center bg-white dark:bg-gray-800">
                        <div className="w-full h-24 mb-4 rounded-md bg-white border border-gray-300"></div>
                        <div className="flex items-center">
                          <input type="radio" id="light-theme" name="theme" className="mr-2" />
                          <label htmlFor="light-theme" className="text-gray-700 dark:text-gray-300">
                            Light
                          </label>
                        </div>
                      </div>
                      <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 flex flex-col items-center bg-gray-900">
                        <div className="w-full h-24 mb-4 rounded-md bg-gray-800 border border-gray-700"></div>
                        <div className="flex items-center">
                          <input type="radio" id="dark-theme" name="theme" className="mr-2" checked />
                          <label htmlFor="dark-theme" className="text-gray-300">
                            Dark
                          </label>
                        </div>
                      </div>
                      <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 flex flex-col items-center bg-gradient-to-r from-white to-gray-900">
                        <div className="w-full h-24 mb-4 rounded-md bg-gradient-to-r from-white to-gray-800 border border-gray-300 dark:border-gray-700"></div>
                        <div className="flex items-center">
                          <input type="radio" id="system-theme" name="theme" className="mr-2" />
                          <label htmlFor="system-theme" className="text-gray-700 dark:text-gray-300">
                            System Default
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Interface Settings
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MonitorIcon size={16} className="text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            Compact Mode
                          </span>
                        </div>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ZapIcon size={16} className="text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            Enable Animations
                          </span>
                        </div>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ClockIcon size={16} className="text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            24-hour Time Format
                          </span>
                        </div>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="primary" leftIcon={<SaveIcon size={16} />} onClick={handleSavePreferences}>
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </Card>}
            {/* Content Defaults */}
            {activeTab === 'content-defaults' && <div className="space-y-6">
                <Card title="Content Creation Defaults">
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Default Voice Type
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" defaultValue={contentDefaults.voiceType}>
                          <option value="female">Female Voice</option>
                          <option value="male">Male Voice</option>
                          <option value="neutral">Gender Neutral</option>
                          <option value="custom">My Custom Voice</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Default Language
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" defaultValue={contentDefaults.language}>
                          <option value="english">English</option>
                          <option value="spanish">Spanish</option>
                          <option value="french">French</option>
                          <option value="german">German</option>
                          <option value="japanese">Japanese</option>
                          <option value="chinese">Chinese</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Video Resolution
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" defaultValue={contentDefaults.videoResolution}>
                          <option value="720p">HD (720p)</option>
                          <option value="1080p">Full HD (1080p)</option>
                          <option value="1440p">QHD (1440p)</option>
                          <option value="2160p">4K UHD (2160p)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Image Style
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" defaultValue={contentDefaults.imageStyle}>
                          <option value="modern">Modern</option>
                          <option value="vintage">Vintage</option>
                          <option value="minimalist">Minimalist</option>
                          <option value="vibrant">Vibrant</option>
                          <option value="professional">Professional</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Content Settings
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <RefreshCwIcon size={16} className="text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">
                              Auto-save drafts
                            </span>
                          </div>
                          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileTextIcon size={16} className="text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">
                              Include watermark on exports
                            </span>
                          </div>
                          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="primary" leftIcon={<SaveIcon size={16} />} onClick={handleSaveContentDefaults}>
                        Save Content Defaults
                      </Button>
                    </div>
                  </div>
                </Card>
                <Card title="Media Settings">
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
                            <VideoIcon size={20} />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              Video
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Default video settings
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Format
                            </label>
                            <select className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                              <option>MP4</option>
                              <option>WebM</option>
                              <option>MOV</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Frame Rate
                            </label>
                            <select className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                              <option>30 FPS</option>
                              <option>60 FPS</option>
                              <option>24 FPS</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500 dark:text-purple-400">
                            <ImageIcon size={20} />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              Image
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Default image settings
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Format
                            </label>
                            <select className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                              <option>PNG</option>
                              <option>JPG</option>
                              <option>WebP</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Quality
                            </label>
                            <select className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                              <option>High</option>
                              <option>Medium</option>
                              <option>Low</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-500 dark:text-amber-400">
                            <MicIcon size={20} />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              Audio
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Default audio settings
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Format
                            </label>
                            <select className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                              <option>MP3</option>
                              <option>WAV</option>
                              <option>AAC</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Quality
                            </label>
                            <select className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                              <option>High (256kbps)</option>
                              <option>Medium (192kbps)</option>
                              <option>Low (128kbps)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>}
            {/* Branding Settings */}
            {activeTab === 'branding' && <BrandingSettings brandSettings={brandSettings} onSave={handleSaveBrandSettings} />}
            {/* Security Settings */}
            {activeTab === 'security' && <div className="space-y-6">
                <Card title="Two-Factor Authentication">
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Two-Factor Authentication (2FA)
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Button variant="primary" leftIcon={<ShieldIcon size={16} />}>
                        Enable 2FA
                      </Button>
                    </div>
                  </div>
                </Card>
                <Card title="Login Sessions">
                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-500 dark:text-green-400">
                            <MonitorIcon size={18} />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              Current Session
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              MacBook Pro • Chrome • San Francisco, USA
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <CheckIcon size={14} />
                          <span className="text-xs font-medium">
                            Active Now
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
                            <MonitorIcon size={18} />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              iPhone 13
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Safari • New York, USA • Last active 2 days ago
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="text-red-500 dark:text-red-400 border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/10">
                          Sign Out
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
                            <MonitorIcon size={18} />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              Windows PC
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Firefox • London, UK • Last active 5 days ago
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="text-red-500 dark:text-red-400 border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/10">
                          Sign Out
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" className="text-red-500 dark:text-red-400 border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/10">
                        Sign Out All Devices
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>}
            {/* Billing & Plan */}
            {activeTab === 'billing' && <div className="space-y-6">
                <Card title="Current Plan">
                  <div className="p-6 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 mb-2">
                          Current Plan
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {subscriptionPlan.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {subscriptionPlan.price} • Next billing on{' '}
                          {subscriptionPlan.nextBilling}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button variant="outline" onClick={handleChangePlan}>
                          Change Plan
                        </Button>
                        <Button variant="outline" className="text-red-500 dark:text-red-400 border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/10" onClick={handleCancelSubscription}>
                          Cancel Subscription
                        </Button>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Plan Features
                      </h4>
                      <ul className="space-y-2">
                        {subscriptionPlan.features.map((feature, index) => <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <CheckIcon size={16} className="text-green-500 dark:text-green-400" />
                            {feature}
                          </li>)}
                      </ul>
                    </div>
                  </div>
                </Card>
                <Card title="Payment Methods">
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 dark:text-blue-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="20" height="14" x="2" y="5" rx="2" />
                            <line x1="2" x2="22" y1="10" y2="10" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            Visa ending in 4242
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Expires 12/2025
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          Default
                        </span>
                        <Button variant="outline" size="sm" leftIcon={<EditIcon size={14} />}>
                          Edit
                        </Button>
                      </div>
                    </div>
                    <Button variant="outline" leftIcon={<PlusIcon size={16} />}>
                      Add Payment Method
                    </Button>
                  </div>
                </Card>
                <Card title="Billing History">
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Receipt
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {billingHistory.map(item => <tr key={item.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {item.date}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {item.description}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {item.amount}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                  {item.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 dark:text-indigo-400">
                                <a href="#" className="hover:underline">
                                  Download
                                </a>
                              </td>
                            </tr>)}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Card>
                <Card title="Credit Wallet">
                  <div className="p-6 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          Current Balance: 120 Credits
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Use credits for generating content and media
                        </p>
                      </div>
                      <Button variant="primary" leftIcon={<PlusIcon size={16} />}>
                        Add Credits
                      </Button>
                    </div>
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Recent Transactions
                      </h4>
                      <div className="space-y-3">
                        {walletTransactions.map(transaction => <div key={transaction.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${transaction.type === 'topup' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                {transaction.type === 'topup' ? <PlusIcon size={14} /> : <TrendingUpIcon size={14} />}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {transaction.description}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {transaction.date}
                                </p>
                              </div>
                            </div>
                            <span className={`font-medium ${transaction.type === 'topup' ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                              {transaction.amount}
                            </span>
                          </div>)}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};