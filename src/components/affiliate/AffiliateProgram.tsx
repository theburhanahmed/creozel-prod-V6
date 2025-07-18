import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ClipboardCopyIcon, QrCodeIcon, UsersIcon, DollarSignIcon, CreditCardIcon, TrendingUpIcon, MailIcon, CheckCircleIcon, XCircleIcon, ClockIcon, CalendarIcon, RefreshCwIcon, ChevronDownIcon, SendIcon, AlertCircleIcon, ExternalLinkIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
// TODO: Fetch affiliate data from production data source (Supabase or backend)
// Remove MOCK_AFFILIATE_DATA
// QR Code component (simplified)
const QRCode = ({
  value
}: {
  value: string;
}) => {
  return <div className="w-full h-full min-h-[180px] bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center">
      <div className="w-40 h-40 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://app.example.com/ref?code=alex123')] bg-no-repeat bg-center bg-contain"></div>
    </div>;
};
// Animated counter component
const AnimatedCounter = ({
  value,
  prefix = '',
  suffix = ''
}: {
  value: number | string;
  prefix?: string;
  suffix?: string;
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    const duration = 1500;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    const initialValue = 0;
    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentValue = Math.round(initialValue + (numericValue - initialValue) * progress);
      setDisplayValue(currentValue);
      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, frameDuration);
    return () => clearInterval(counter);
  }, [value]);
  return <span className="transition-all duration-300">
      {prefix}
      {displayValue}
      {suffix}
    </span>;
};
export const AffiliateProgram = () => {
  const [showQRCode, setShowQRCode] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState('paypal');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState("Hey! I think you'll love this platform. Use my referral link to sign up and we both get rewards!");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [affiliateData, setAffiliateData] = useState<any>(null);
  // Example: useEffect(() => { fetchAffiliateData().then(setAffiliateData); }, []);
  // Copy referral link
  const copyReferralLink = () => {
    navigator.clipboard.writeText(affiliateData.referralLink);
    toast.success('Referral link copied to clipboard!');
  };
  // Handle payout request
  const handlePayoutRequest = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowPayoutModal(false);
      toast.success('Payout request submitted successfully!', {
        description: 'You will receive your payment within 3-5 business days.'
      });
    }, 1500);
  };
  // Handle send invitation
  const handleSendInvitation = () => {
    if (!inviteEmail) {
      toast.error('Please enter an email address');
      return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowInviteModal(false);
      toast.success('Invitation sent successfully!', {
        description: `Your referral link has been sent to ${inviteEmail}`
      });
      setInviteEmail('');
    }, 1500);
  };
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  // Format date
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateString));
  };
  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'subscribed':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };
  // Fix linter errors for parameter types
  const renderReferralRow = (referral: any) => {
    // ... existing code ...
  };
  const renderPayoutRow = (payout: any) => {
    // ... existing code ...
  };
  if (!affiliateData) {
    return <div className="flex items-center justify-center min-h-[300px] text-gray-500 dark:text-gray-300">Loading affiliate data...</div>;
  }
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Affiliate Program
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Earn rewards by referring others to our platform
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<RefreshCwIcon size={16} />} onClick={() => toast.success('Affiliate data refreshed')}>
            Refresh Data
          </Button>
          <Button variant="primary" leftIcon={<CreditCardIcon size={16} />} onClick={() => setShowPayoutModal(true)} disabled={affiliateData.stats.pendingPayouts < 50}>
            Request Payout
          </Button>
        </div>
      </div>
      {/* Referral Link Card */}
      <Card className="backdrop-blur-sm">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                Your Referral Link
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Share this link to earn commissions when people sign up
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" leftIcon={<QrCodeIcon size={14} />} onClick={() => setShowQRCode(!showQRCode)}>
                {showQRCode ? 'Hide QR Code' : 'Show QR Code'}
              </Button>
              <Button variant="outline" size="sm" leftIcon={<MailIcon size={14} />} onClick={() => setShowInviteModal(true)}>
                Send Invite
              </Button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-center">
                <div className="relative flex-1">
                  <input type="text" value={affiliateData.referralLink} readOnly className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 pr-24" />
                  <Button variant="primary" size="sm" className="absolute right-1.5 top-1.5" leftIcon={<ClipboardCopyIcon size={14} />} onClick={copyReferralLink}>
                    Copy
                  </Button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-1 flex items-center">
                        <UsersIcon size={12} className="mr-1" />
                        Total Referrals
                      </p>
                      <h4 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                        <AnimatedCounter value={affiliateData.stats.totalReferrals} />
                      </h4>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
                      +{affiliateData.stats.currentMonth.referrals} this month
                    </span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 p-4 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1 flex items-center">
                        <DollarSignIcon size={12} className="mr-1" />
                        Total Earnings
                      </p>
                      <h4 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                        <AnimatedCounter value={affiliateData.stats.totalEarnings} prefix="$" />
                      </h4>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                      +${affiliateData.stats.currentMonth.earnings} this month
                    </span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 p-4 rounded-lg border border-amber-100 dark:border-amber-800/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mb-1 flex items-center">
                        <CreditCardIcon size={12} className="mr-1" />
                        Pending Payout
                      </p>
                      <h4 className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                        <AnimatedCounter value={affiliateData.stats.pendingPayouts} prefix="$" />
                      </h4>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${affiliateData.stats.pendingPayouts >= 50 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'}`}>
                      {affiliateData.stats.pendingPayouts >= 50 ? 'Ready' : 'Threshold: $50'}
                    </span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mb-1 flex items-center">
                        <TrendingUpIcon size={12} className="mr-1" />
                        Link Clicks
                      </p>
                      <h4 className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                        <AnimatedCounter value={affiliateData.stats.totalClicks} />
                      </h4>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                      {affiliateData.stats.conversionRate} conversion
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {showQRCode && <div className="w-full sm:w-auto sm:min-w-[200px]">
                <QRCode value={affiliateData.referralLink} />
              </div>}
          </div>
        </div>
      </Card>
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button className={`py-3 px-4 border-b-2 text-sm font-medium ${activeTab === 'overview' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`} onClick={() => setActiveTab('overview')}>
          Referral Activity
        </button>
        <button className={`py-3 px-4 border-b-2 text-sm font-medium ${activeTab === 'payouts' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`} onClick={() => setActiveTab('payouts')}>
          Payout History
        </button>
        <button className={`py-3 px-4 border-b-2 text-sm font-medium ${activeTab === 'resources' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`} onClick={() => setActiveTab('resources')}>
          Resources
        </button>
      </div>
      {/* Referral Activity Table */}
      {activeTab === 'overview' && <Card title="Referral Activity" className="backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Commission
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {affiliateData.referrals.map(referral => <tr key={referral.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                          <img src={referral.avatar} alt={referral.name} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {referral.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {referral.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <CalendarIcon size={14} className="mr-2" />
                        {formatDate(referral.joinDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                        {referral.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(referral.status)}`}>
                        {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(referral.commission)}
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </Card>}
      {/* Payout History */}
      {activeTab === 'payouts' && <Card title="Payout History" className="backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {affiliateData.payoutHistory.map(payout => <tr key={payout.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(payout.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(payout.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {payout.method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                        {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                      </span>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </Card>}
      {/* Resources */}
      {activeTab === 'resources' && <div className="space-y-6">
          <Card title="Marketing Materials" className="backdrop-blur-sm">
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Use these resources to promote our platform and increase your
                referrals
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Social Media Posts
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Pre-written posts for your social media channels
                  </p>
                  <Button variant="outline" size="sm" leftIcon={<ExternalLinkIcon size={14} />}>
                    Download Pack
                  </Button>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Email Templates
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Ready-to-use email templates for outreach
                  </p>
                  <Button variant="outline" size="sm" leftIcon={<ExternalLinkIcon size={14} />}>
                    Download Templates
                  </Button>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Banner Images
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Promotional banners for websites and blogs
                  </p>
                  <Button variant="outline" size="sm" leftIcon={<ExternalLinkIcon size={14} />}>
                    Download Images
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          <Card title="Affiliate Program FAQ" className="backdrop-blur-sm">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  How do commissions work?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  You earn 30% commission on every paid subscription from your
                  referrals for their first year. Commissions are calculated at
                  the end of each month and paid out once you reach the $50
                  threshold.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  When will I get paid?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Payments are processed between the 1st and 5th of each month
                  for the previous month's earnings, as long as you've reached
                  the minimum payout threshold of $50.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  What payment methods are available?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  We currently support PayPal and direct bank transfers. You can
                  set your preferred payment method in your affiliate settings.
                </p>
              </div>
            </div>
          </Card>
        </div>}
      {/* Payout Request Modal */}
      <Modal isOpen={showPayoutModal} onClose={() => setShowPayoutModal(false)} title="Request Payout" actions={<>
            <Button variant="outline" onClick={() => setShowPayoutModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handlePayoutRequest} isLoading={isLoading} disabled={isLoading || affiliateData.stats.pendingPayouts < 50}>
              Confirm Request
            </Button>
          </>}>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Available for payout
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(affiliateData.stats.pendingPayouts)}
              </p>
            </div>
            <div>
              {affiliateData.stats.pendingPayouts >= 50 ? <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 flex items-center">
                  <CheckCircleIcon size={14} className="mr-1" />
                  Threshold Met
                </span> : <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 flex items-center">
                  <AlertCircleIcon size={14} className="mr-1" />
                  Minimum $50 Required
                </span>}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" className={`p-3 border rounded-lg flex items-center justify-center ${payoutMethod === 'paypal' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700'}`} onClick={() => setPayoutMethod('paypal')}>
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.384a.77.77 0 0 1 .757-.648h6.136c2.896 0 4.92.74 6.006 2.193 1.084 1.446 1.349 3.193.867 5.124-.508 2.06-1.404 3.621-2.665 4.644-1.263 1.023-2.953 1.516-5.031 1.516h-2.49a.77.77 0 0 0-.759.65l-.689 4.474zm7.378-13.219c-.273-.744-.742-1.27-1.401-1.566-.66-.296-1.515-.444-2.564-.444H7.558l-1.25 7.9h2.829c1.205 0 2.215-.194 3.036-.58.82-.386 1.465-.969 1.932-1.747.467-.777.773-1.608.916-2.49.144-.884.088-1.582-.168-2.073z" />
                  </svg>
                </button>
                <button type="button" className={`p-3 border rounded-lg flex items-center justify-center ${payoutMethod === 'bank' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700'}`} onClick={() => setPayoutMethod('bank')}>
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                </button>
              </div>
            </div>
            {payoutMethod === 'paypal' && <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  PayPal Email
                </label>
                <input type="email" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="your-email@example.com" defaultValue="alex@example.com" />
              </div>}
            {payoutMethod === 'bank' && <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Account Holder Name
                  </label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="John Doe" defaultValue="Alex Johnson" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Account Number
                  </label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="XXXX-XXXX-XXXX-XXXX" defaultValue="****-****-****-5678" />
                </div>
              </div>}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-lg p-3">
              <div className="flex items-start gap-3">
                <div className="text-amber-500 mt-0.5">
                  <AlertCircleIcon size={16} />
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  Payout requests are typically processed within 3-5 business
                  days. Once processed, it may take additional time for the
                  funds to appear in your account depending on your payment
                  method.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {/* Invite Modal */}
      <Modal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} title="Send Invitation" actions={<>
            <Button variant="outline" onClick={() => setShowInviteModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSendInvitation} isLoading={isLoading} disabled={isLoading || !inviteEmail}>
              Send Invitation
            </Button>
          </>}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recipient Email
            </label>
            <input type="email" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="friend@example.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Personalized Message
            </label>
            <textarea className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white h-32 resize-none" placeholder="Add a personal message..." value={inviteMessage} onChange={e => setInviteMessage(e.target.value)} />
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Preview
            </h4>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800/50">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {inviteMessage}
              </p>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
                <p className="text-xs text-indigo-700 dark:text-indigo-300 mb-2">
                  Join using my referral link:
                </p>
                <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium truncate">
                  {affiliateData.referralLink}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>;
};