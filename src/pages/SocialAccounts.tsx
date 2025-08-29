import React, { useState } from 'react';
import { ConnectedAccountsManager } from '../components/settings/ConnectedAccountsManager';
import { Button } from '../components/ui/Button';
import { Drawer } from '../components/ui/Drawer';
import { Card } from '../components/ui/Card';
import { PlusIcon, ShieldIcon, InstagramIcon, TwitterIcon, FacebookIcon, LinkedinIcon, YoutubeIcon, RefreshCwIcon, SearchIcon, FilterIcon, DownloadIcon, CheckIcon, ChevronDownIcon } from 'lucide-react';
import { toast } from 'sonner';
export const SocialAccounts = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const platforms = [{
    id: 'instagram',
    name: 'Instagram',
    icon: <InstagramIcon size={18} />,
    color: 'from-pink-500 to-purple-500'
  }, {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: <TwitterIcon size={18} />,
    color: 'from-blue-400 to-blue-600'
  }, {
    id: 'facebook',
    name: 'Facebook',
    icon: <FacebookIcon size={18} />,
    color: 'from-blue-600 to-blue-800'
  }, {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <LinkedinIcon size={18} />,
    color: 'from-blue-700 to-blue-900'
  }, {
    id: 'youtube',
    name: 'YouTube',
    icon: <YoutubeIcon size={18} />,
    color: 'from-red-500 to-red-600'
  }, {
    id: 'threads',
    name: 'Threads',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.7001 7.41006C18.2276 6.94766 17.6533 6.59064 17.0212 6.35878C16.389 6.12692 15.7143 6.02513 15.0401 6.06006C13.1514 6.06006 11.8001 6.91006 11.0001 8.60006C10.3201 6.91006 9.00009 6.06006 7.00009 6.06006C3.60009 6.06006 1.00009 8.56006 1.00009 12.1301C0.988851 13.1661 1.19382 14.1918 1.60009 15.1301C2.30009 16.6301 3.50009 17.9301 5.20009 19.0001C6.70009 19.9601 8.30009 20.7301 10.0001 21.2001L11.0001 21.4001L12.0001 21.2001C13.7001 20.7301 15.3001 19.9601 16.8001 19.0001C18.5001 17.9301 19.7001 16.6301 20.4001 15.1301C20.8063 14.1918 21.0113 13.1661 21.0001 12.1301C21.0001 10.2801 20.1001 8.65006 18.7001 7.41006ZM17.4001 13.5001C17.2203 14.4165 16.7899 15.2587 16.1601 15.9301C15.6001 16.5301 14.9001 17.0301 14.1001 17.5001C13.4001 17.9001 12.7001 18.2001 12.0001 18.3001C11.3001 18.2001 10.6001 17.9001 9.90009 17.5001C9.10009 17.0301 8.40009 16.5301 7.84009 15.9301C7.21034 15.2587 6.77986 14.4165 6.60009 13.5001C6.52144 13.0238 6.52144 12.5364 6.60009 12.0601C6.70009 11.5601 6.90009 11.1601 7.10009 10.7601C7.30009 10.3601 7.60009 10.0601 8.00009 9.76006C8.40009 9.46006 8.80009 9.26006 9.30009 9.16006C9.80009 9.06006 10.3001 9.06006 10.8001 9.16006C11.3001 9.26006 11.7001 9.46006 12.1001 9.76006C12.5001 10.0601 12.8001 10.3601 13.0001 10.7601C13.2001 11.1601 13.4001 11.5601 13.5001 12.0601C13.5788 12.5364 13.5788 13.0238 13.5001 13.5001H17.4001Z" />
        </svg>,
    color: 'from-gray-800 to-gray-900 dark:from-gray-200 dark:to-gray-100'
  }];
  const handleOpenDrawer = (platformId: string) => {
    setSelectedPlatform(platformId);
    setIsDrawerOpen(true);
  };
  const handleConnect = () => {
    if (!selectedPlatform) return;
    // Simulate connection
    toast.loading(`Connecting to ${selectedPlatform}...`);
    setTimeout(() => {
      toast.dismiss();
      toast.success(`Successfully connected to ${selectedPlatform}`, {
        description: 'Your account has been linked successfully.'
      });
      setIsDrawerOpen(false);
    }, 2000);
  };
  const handleRefreshAll = () => {
    toast.success('All accounts refreshed');
  };
  const getSelectedPlatform = () => {
    return platforms.find(platform => platform.id === selectedPlatform);
  };
  const filterOptions = [{
    id: 'active',
    label: 'Active Accounts'
  }, {
    id: 'inactive',
    label: 'Inactive Accounts'
  }, {
    id: 'personal',
    label: 'Personal Accounts'
  }, {
    id: 'business',
    label: 'Business Accounts'
  }];
  const exportOptions = [{
    id: 'csv',
    label: 'Export as CSV',
    icon: 'CSV'
  }, {
    id: 'excel',
    label: 'Export as Excel',
    icon: 'XLS'
  }, {
    id: 'pdf',
    label: 'Export as PDF',
    icon: 'PDF'
  }];
  const handleFilterSelect = (filterId: string) => {
    setActiveFilters(prev => {
      const isAlreadySelected = prev.includes(filterId);
      if (isAlreadySelected) {
        return prev.filter(id => id !== filterId);
      }
      return [...prev, filterId];
    });
    toast.success(`Filter ${activeFilters.includes(filterId) ? 'removed' : 'applied'}`);
  };
  const handleExport = (format: string) => {
    setShowExportDropdown(false);
    toast.success(`Exporting accounts as ${format.toUpperCase()}`, {
      description: 'Your file will be ready to download shortly.'
    });
  };
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Social Accounts
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Connect and manage your social media accounts
          </p>
        </div>
      </div>
      {/* New Search and Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search accounts..." className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20" />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Button variant="outline" leftIcon={<FilterIcon size={16} />} rightIcon={<ChevronDownIcon size={14} />} onClick={() => {
            setShowFilterDropdown(!showFilterDropdown);
            setShowExportDropdown(false);
          }}>
              Filter
              {activeFilters.length > 0 && <span className="ml-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilters.length}
                </span>}
            </Button>
            {showFilterDropdown && <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                {filterOptions.map(option => <button key={option.id} onClick={() => handleFilterSelect(option.id)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-200">
                      {option.label}
                    </span>
                    {activeFilters.includes(option.id) && <CheckIcon size={14} className="text-green-500" />}
                  </button>)}
              </div>}
          </div>
          <div className="relative">
            <Button variant="outline" leftIcon={<DownloadIcon size={16} />} rightIcon={<ChevronDownIcon size={14} />} onClick={() => {
            setShowExportDropdown(!showExportDropdown);
            setShowFilterDropdown(false);
          }}>
              Export
            </Button>
            {showExportDropdown && <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                {exportOptions.map(option => <button key={option.id} onClick={() => handleExport(option.id)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                    <span className="w-8 text-xs font-medium text-gray-500 dark:text-gray-400">
                      {option.icon}
                    </span>
                    <span className="text-gray-700 dark:text-gray-200">
                      {option.label}
                    </span>
                  </button>)}
              </div>}
          </div>
          <Button variant="outline" leftIcon={<RefreshCwIcon size={16} />} onClick={handleRefreshAll}>
            Refresh All
          </Button>
          <Button variant="primary" leftIcon={<PlusIcon size={16} />} onClick={() => setIsDrawerOpen(true)}>
            Connect New Account
          </Button>
        </div>
      </div>
      <ConnectedAccountsManager />
      {/* Connection Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={selectedPlatform ? `Connect to ${getSelectedPlatform()?.name}` : 'Connect New Account'} size="md">
        {selectedPlatform ? <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getSelectedPlatform()?.color} flex items-center justify-center text-white`}>
                {getSelectedPlatform()?.icon}
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">
                  {getSelectedPlatform()?.name}
                </h3>
                <p className="text-sm text-gray-400">
                  Connect your account to publish content and view analytics
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username or Email
                </label>
                <input type="text" className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 text-white" placeholder="Enter your username or email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input type="password" className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 text-white" placeholder="Enter your password" />
              </div>
            </div>
            <div className="bg-indigo-900/20 border border-indigo-800/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-indigo-400 mt-0.5">
                  <ShieldIcon size={18} />
                </div>
                <div>
                  <h4 className="font-medium text-white text-sm">
                    Secure Connection
                  </h4>
                  <p className="text-sm text-gray-300 mt-1">
                    Your credentials are securely transmitted directly to the
                    service. We never store your passwords.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="primary" onClick={handleConnect}>
                Connect Account
              </Button>
            </div>
          </div> : <div className="space-y-4">
            <p className="text-gray-300 mb-4">
              Select a platform to connect your account:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {platforms.map(platform => <Card key={platform.id} className="cursor-pointer hover:bg-gray-800/50 transition-colors" onClick={() => handleOpenDrawer(platform.id)}>
                  <div className="flex items-center gap-3 p-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center text-white`}>
                      {platform.icon}
                    </div>
                    <span className="font-medium text-white">
                      {platform.name}
                    </span>
                  </div>
                </Card>)}
            </div>
          </div>}
      </Drawer>
    </div>;
};
