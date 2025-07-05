import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { createClient } from '../../../supabase/client';

export const AnalyticsChart = () => {
  const [timeRange, setTimeRange] = useState('year');
  // Sample data for the chart
  const yearData = [{
    month: 'Jan',
    impressions: 65000,
    engagement: 12500,
    followers: 24000
  }, {
    month: 'Feb',
    impressions: 59000,
    engagement: 15000,
    followers: 26000
  }, {
    month: 'Mar',
    impressions: 80000,
    engagement: 18000,
    followers: 28000
  }, {
    month: 'Apr',
    impressions: 81000,
    engagement: 19500,
    followers: 31000
  }, {
    month: 'May',
    impressions: 95000,
    engagement: 22000,
    followers: 35000
  }, {
    month: 'Jun',
    impressions: 110000,
    engagement: 24000,
    followers: 39000
  }, {
    month: 'Jul',
    impressions: 120000,
    engagement: 26000,
    followers: 42000
  }, {
    month: 'Aug',
    impressions: 130000,
    engagement: 28000,
    followers: 45000
  }, {
    month: 'Sep',
    impressions: 145000,
    engagement: 31000,
    followers: 48000
  }, {
    month: 'Oct',
    impressions: 160000,
    engagement: 34000,
    followers: 52000
  }, {
    month: 'Nov',
    impressions: 170000,
    engagement: 36000,
    followers: 56000
  }, {
    month: 'Dec',
    impressions: 180000,
    engagement: 38000,
    followers: 60000
  }];
  // Custom tooltip component
  const CustomTooltip = ({
    active,
    payload,
    label
  }: any) => {
    if (active && payload && payload.length) {
      return <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-gray-900 dark:text-white font-medium">{label}</p>
          {payload.map((entry: any, index: number) => <p key={`item-${index}`} className="text-sm" style={{
          color: entry.color
        }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>)}
        </div>;
    }
    return null;
  };
  return <div className="flex flex-col h-full">
      <div className="relative flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={yearData} margin={{
          top: 10,
          right: 10,
          left: 0,
          bottom: 0
        }}>
            <defs>
              <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{
            fontSize: 12
          }} axisLine={{
            stroke: '#e5e7eb',
            strokeWidth: 1
          }} tickLine={false} />
            <YAxis tick={{
            fontSize: 12
          }} axisLine={false} tickLine={false} tickFormatter={value => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="impressions" stroke="#4f46e5" fillOpacity={1} fill="url(#colorImpressions)" name="Impressions" />
            <Area type="monotone" dataKey="engagement" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorEngagement)" name="Engagement" />
            <Area type="monotone" dataKey="followers" stroke="#10b981" fillOpacity={1} fill="url(#colorFollowers)" name="Followers" />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{
            paddingTop: 15
          }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex justify-between text-sm text-gray-400">
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-400 inline-block mr-1"></span>
          <span>Impressions</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 inline-block mr-1"></span>
          <span>Engagement</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 inline-block mr-1"></span>
          <span>Followers</span>
        </div>
      </div>
    </div>;
};

// Example: Fetch data from Supabase and display in a list
export const SupabaseDemo: React.FC = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await createClient().from('analytics').select('*');
      if (error) setError(error.message);
      else setRows(data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div>
      <h3>Supabase Data</h3>
      <ul>
        {rows.map((row, idx) => (
          <li key={idx}>{JSON.stringify(row)}</li>
        ))}
      </ul>
    </div>
  );
};