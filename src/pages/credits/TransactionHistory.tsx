import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ChevronLeftIcon, DownloadIcon, ArrowUpRightIcon, ArrowDownLeftIcon, FilterIcon, SearchIcon, DollarSignIcon, PlusCircleIcon, TrendingUpIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { transactionService, Transaction } from '../../services/transactions/transactionService';
import { toast } from 'sonner';

export const TransactionHistory = () => {
  const [dateRange, setDateRange] = useState('last30days');
  const [transactionType, setTransactionType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await transactionService.getTransactions();
        setTransactions(data.transactions);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        toast.error('Failed to load transaction history');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);
  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by type
    if (transactionType !== 'all' && transaction.type !== transactionType) {
      return false;
    }
    // Filter by search query
    if (searchQuery && !transaction.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });
  return <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 mb-2">
            <ChevronLeftIcon size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Transaction History
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            View all your credit purchases and usage history
          </p>
        </div>
        <div>
          <Button variant="primary" leftIcon={<PlusCircleIcon size={16} />} as={Link} to="/credits/add">
            Add Credits
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1 p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-900/30">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Credits Balance
              </h2>
              <DollarSignIcon size={20} className="text-green-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">
                  Current Balance:
                </span>
                <span className="text-xl font-bold text-green-600 dark:text-green-400">
                  120
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">
                  Total Purchased:
                </span>
                <span className="text-lg font-medium text-blue-600 dark:text-blue-400">
                  800
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">
                  Total Used:
                </span>
                <span className="text-lg font-medium text-amber-600 dark:text-amber-400">
                  680
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link to="/credits/usage" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-center gap-1">
                <TrendingUpIcon size={14} />
                <span>View Usage Analytics</span>
              </Link>
            </div>
          </div>
        </Card>
        <div className="md:col-span-3 space-y-6">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <div className="relative flex-grow md:flex-grow-0">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon size={16} className="text-gray-400" />
                  </div>
                  <input type="text" placeholder="Search transactions..." className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 text-sm w-full" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <select value={transactionType} onChange={e => setTransactionType(e.target.value)} className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 text-sm">
                  <option value="all">All Types</option>
                  <option value="purchase">Purchases</option>
                  <option value="usage">Usage</option>
                  <option value="refund">Refunds</option>
                </select>
                <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 text-sm">
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last90days">Last 90 Days</option>
                  <option value="alltime">All Time</option>
                </select>
              </div>
              <Button variant="outline" leftIcon={<DownloadIcon size={16} />} className="whitespace-nowrap">
                Export CSV
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Credits
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTransactions.map(transaction => <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {transaction.date} at {transaction.time}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
                            ${transaction.type === 'purchase' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : transaction.type === 'usage' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                            {transaction.type === 'purchase' ? <PlusCircleIcon size={16} /> : transaction.type === 'usage' ? <ArrowUpRightIcon size={16} /> : <ArrowDownLeftIcon size={16} />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {transaction.description}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                              {transaction.type}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {transaction.amount !== null ? <span className="text-sm font-medium text-gray-900 dark:text-white">
                            ${transaction.amount.toFixed(2)}
                          </span> : <span className="text-sm text-gray-500 dark:text-gray-400">
                            —
                          </span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`text-sm font-medium ${transaction.credits > 0 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                          {transaction.credits > 0 ? '+' : ''}
                          {transaction.credits}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 capitalize">
                          {transaction.status}
                        </span>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
            {filteredTransactions.length === 0 && <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No transactions found matching your filters.
                </p>
              </div>}
          </Card>
        </div>
      </div>
    </div>;
};