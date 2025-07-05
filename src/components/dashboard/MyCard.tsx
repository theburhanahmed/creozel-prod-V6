import React from 'react';
import { ArrowUpRightIcon, ArrowDownLeftIcon } from 'lucide-react';
interface MyCardProps {
  type: string;
  cardType: string;
  balance: number;
}
export const MyCard = ({
  type,
  cardType,
  balance
}: MyCardProps) => {
  return <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 to-purple-600 p-6">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
      <div className="flex flex-col h-full justify-between">
        <div className="flex justify-between">
          <h3 className="text-xl font-bold text-white">{type}</h3>
          <span className="text-sm text-white/80">{cardType}</span>
        </div>
        <div className="mt-8">
          <p className="text-sm text-white/80 mb-1">Balance</p>
          <p className="text-2xl font-bold text-white">
            $
            {balance.toLocaleString('en-US', {
            minimumFractionDigits: 2
          })}
          </p>
        </div>
        <div className="flex mt-6 space-x-2">
          <button className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-full py-2 flex items-center justify-center space-x-1">
            <ArrowUpRightIcon size={14} />
            <span>Transfer</span>
          </button>
          <button className="flex-1 bg-gray-800/50 hover:bg-gray-800 text-white rounded-full py-2 flex items-center justify-center space-x-1">
            <ArrowDownLeftIcon size={14} />
            <span>Request</span>
          </button>
        </div>
      </div>
    </div>;
};