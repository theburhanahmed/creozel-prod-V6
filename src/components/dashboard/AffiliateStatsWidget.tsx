import React from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../ui/GlassCard';
import { UsersIcon, DollarSignIcon, TrendingUpIcon, ChevronRightIcon } from 'lucide-react';
import { CountUpAnimation } from '../ui/CountUpAnimation';
export const AffiliateStatsWidget = () => {
  // Mock data
  const stats = {
    referrals: 28,
    earnings: 842.5,
    pendingPayout: 175.25,
    monthlyChange: '+12.5%'
  };
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };
  return <GlassCard className="hover:shadow-lg transition-all duration-300">
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-white flex items-center gap-2">
            <DollarSignIcon size={18} className="text-emerald-500" />
            Affiliate Program
          </h3>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-900/30 text-emerald-400 flex items-center">
            <TrendingUpIcon size={12} className="mr-1" />
            {stats.monthlyChange}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <UsersIcon size={14} />
              <span>Total Referrals</span>
            </div>
            <p className="text-lg font-semibold text-white mt-1">
              <CountUpAnimation end={stats.referrals} duration={1500} />
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <DollarSignIcon size={14} />
              <span>Total Earnings</span>
            </div>
            <p className="text-lg font-semibold text-white mt-1">
              <span className="text-emerald-500">$</span>
              <CountUpAnimation end={stats.earnings} decimals={2} />
            </p>
          </div>
        </div>
        <div className="pt-3 border-t border-gray-700">
          <Link to="/settings?tab=affiliate" className="flex items-center justify-between text-indigo-400 text-sm hover:text-indigo-300 transition-colors">
            <span>View Affiliate Dashboard</span>
            <ChevronRightIcon size={16} className="animate-pulse-slow" />
          </Link>
        </div>
      </div>
    </GlassCard>;
};
