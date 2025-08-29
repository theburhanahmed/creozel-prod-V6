import React from 'react';
import { ResponsiveContainer, Sankey, Tooltip } from 'recharts';
export const SpendingDiagram = () => {
  // Sample data for the Sankey diagram
  const data = {
    nodes: [{
      name: 'Accounts'
    }, {
      name: 'Education'
    }, {
      name: 'Transfers'
    }, {
      name: 'Travel'
    }],
    links: [{
      source: 0,
      target: 1,
      value: 30,
      color: '#6366f1'
    }, {
      source: 0,
      target: 2,
      value: 40,
      color: '#8b5cf6'
    }, {
      source: 0,
      target: 3,
      value: 30,
      color: '#ec4899'
    }]
  };
  // Create a simplified visual representation of a Sankey diagram
  return <div className="h-40 relative">
      {/* Left side nodes */}
      <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between">
        <div className="h-10 bg-indigo-600 rounded-md">
          <span className="absolute left-12 top-3 text-xs text-white">12%</span>
        </div>
        <div className="h-14 bg-purple-600 rounded-md">
          <span className="absolute left-12 top-[70px] text-xs text-white">
            Education
          </span>
        </div>
        <div className="h-10 bg-pink-600 rounded-md">
          <span className="absolute left-12 bottom-3 text-xs text-white">
            75%
          </span>
        </div>
      </div>
      {/* Connecting flows */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 160">
        {/* Flow from top node */}
        <path d="M40,20 C150,20 250,60 360,60" fill="none" stroke="#6366f1" strokeWidth="20" strokeOpacity="0.6" />
        {/* Flow from middle node */}
        <path d="M40,80 C150,80 250,80 360,80" fill="none" stroke="#8b5cf6" strokeWidth="28" strokeOpacity="0.6" />
        {/* Flow from bottom node */}
        <path d="M40,140 C150,140 250,100 360,100" fill="none" stroke="#ec4899" strokeWidth="20" strokeOpacity="0.6" />
      </svg>
      {/* Right side nodes */}
      <div className="absolute right-0 top-0 bottom-0 w-10 flex flex-col justify-center space-y-4">
        <div className="h-10 bg-indigo-600 rounded-md flex items-center">
          <span className="absolute right-12 text-xs text-white">
            $10,245.68
          </span>
        </div>
        <div className="h-10 bg-purple-600 rounded-md flex items-center">
          <span className="absolute right-12 text-xs text-white">
            $16,433.73
          </span>
        </div>
        <div className="h-10 bg-pink-600 rounded-md flex items-center">
          <span className="absolute right-12 text-xs text-white">
            $29,901.05
          </span>
        </div>
      </div>
      {/* Legends */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-4">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-indigo-600 mr-1"></div>
          <span className="text-xs text-gray-400">Accounts</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-purple-600 mr-1"></div>
          <span className="text-xs text-gray-400">Transfers</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-pink-600 mr-1"></div>
          <span className="text-xs text-gray-400">Travel</span>
        </div>
      </div>
    </div>;
};
