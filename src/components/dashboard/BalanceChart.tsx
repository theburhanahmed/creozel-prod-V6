import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
export const BalanceChart = () => {
  // Sample data for the chart
  const data = [{
    month: 'Oct',
    balance: 8000
  }, {
    month: 'Nov',
    balance: 9200
  }, {
    month: 'Dec',
    balance: 10780.9
  }, {
    month: 'Jan',
    balance: 10500
  }, {
    month: 'Feb',
    balance: 11200
  }, {
    month: 'Mar',
    balance: 12100
  }];
  return <div className="relative">
      {/* Balance highlight */}
      <div className="absolute top-0 right-16 bg-white/10 rounded-lg p-3 transform -translate-y-1/2 z-10">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">21 Dec, 2023</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2">
            <path d="M9 5L16 12L9 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-lg font-bold text-white">$10,780.90</p>
      </div>
      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ade80" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{
            fill: '#6B7280',
            fontSize: 12
          }} />
            <YAxis axisLine={false} tickLine={false} tick={{
            fill: '#6B7280',
            fontSize: 12
          }} tickFormatter={value => `$${value / 1000}k`} ticks={[5000, 7500, 10000, 12500, 15000]} />
            <Tooltip contentStyle={{
            backgroundColor: '#1F2937',
            borderColor: '#374151',
            borderRadius: '0.5rem',
            color: 'white'
          }} formatter={value => [`$${value}`, 'Balance']} />
            <Line type="monotone" dataKey="balance" stroke="#4ade80" strokeWidth={2} dot={{
            r: 4,
            fill: '#4ade80',
            strokeWidth: 2,
            stroke: '#065f46'
          }} activeDot={{
            r: 6,
            fill: '#4ade80',
            strokeWidth: 2,
            stroke: '#065f46'
          }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex items-center justify-end space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-500/50"></div>
          <span className="text-xs text-gray-400">Available money</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500"></div>
          <span className="text-xs text-gray-400">Actual balance</span>
        </div>
      </div>
      {/* Average */}
      <div className="mt-4 text-xs text-gray-400">
        6 month average: $10,000.00
      </div>
    </div>;
};
