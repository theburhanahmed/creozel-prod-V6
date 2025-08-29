import React from 'react';
interface Transaction {
  id: string;
  name: string;
  date: string;
  amount: number;
  icon: string;
  isIncome: boolean;
}
export const RecentTransactions = () => {
  const transactions: Transaction[] = [{
    id: '1',
    name: 'Google Drive',
    date: '02 Mar, 02:00 PM',
    amount: 5.0,
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Google_Drive_logo.png/768px-Google_Drive_logo.png',
    isIncome: false
  }, {
    id: '2',
    name: 'Ryan Foster',
    date: '02 Mar, 10:00 AM',
    amount: 200.0,
    icon: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
    isIncome: true
  }, {
    id: '3',
    name: 'Amazon',
    date: '02 Mar, 10:00 AM',
    amount: 120.25,
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Amazon_icon.svg/2500px-Amazon_icon.svg.png',
    isIncome: false
  }];
  return <div className="space-y-4">
      {transactions.map(transaction => <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
              <img src={transaction.icon} alt={transaction.name} className="w-6 h-6 object-contain" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-white">
                {transaction.name}
              </h4>
              <p className="text-xs text-gray-400">{transaction.date}</p>
            </div>
          </div>
          <div className={`text-sm font-medium ${transaction.isIncome ? 'text-green-500' : 'text-red-500'}`}>
            {transaction.isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
          </div>
        </div>)}
    </div>;
};
