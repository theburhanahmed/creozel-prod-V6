import { supabase } from '../../../supabase/client';

export interface Transaction {
  id: number;
  date: string;
  time: string;
  type: 'purchase' | 'usage' | 'refund' | 'bonus';
  description: string;
  amount: number | null;
  credits: number;
  status: 'completed' | 'pending' | 'failed';
}

export interface TransactionData {
  transactions: Transaction[];
}

export const transactionService = {
  async getTransactions(): Promise<TransactionData> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No active session');
    }

    const response = await fetch(`${process.env.VITE_SUPABASE_DATABASE_URL}/functions/v1/get-transactions`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }

    return await response.json();
  },

  async getTransactionStats(): Promise<{
    totalSpent: number;
    totalEarned: number;
    totalCreditsUsed: number;
    totalCreditsPurchased: number;
  }> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No active session');
    }

    const { data, error } = await supabase
      .from('credit_transactions')
      .select('amount, credit_amount, transaction_type')
      .eq('user_id', session.user.id);

    if (error) {
      throw new Error('Failed to fetch transaction stats');
    }

    const stats = {
      totalSpent: 0,
      totalEarned: 0,
      totalCreditsUsed: 0,
      totalCreditsPurchased: 0
    };

    data.forEach(transaction => {
      if (transaction.transaction_type === 'purchase') {
        stats.totalSpent += transaction.amount || 0;
        stats.totalCreditsPurchased += transaction.credit_amount;
      } else if (transaction.transaction_type === 'usage') {
        stats.totalCreditsUsed += Math.abs(transaction.credit_amount);
      } else if (transaction.transaction_type === 'bonus') {
        stats.totalEarned += transaction.amount || 0;
      }
    });

    return stats;
  }
};
