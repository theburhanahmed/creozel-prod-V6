import { supabase } from '../../../supabase/client';

export interface PaymentRequest {
  amount: number;
  currency: string;
  userId: string;
  creditAmount: number;
  description?: string;
}

export interface RazorpayVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  userId: string;
  creditAmount: number;
}

export interface PaymentHistory {
  id: string;
  amount: number;
  currency: string;
  credit_amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  description?: string;
}

export const paymentService = {
  // Create Stripe payment intent
  async createStripePayment(request: PaymentRequest) {
    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-payment', {
        body: request,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Stripe payment creation error:', error);
      return { data: null, error };
    }
  },

  // Create Razorpay order
  async createRazorpayPayment(request: PaymentRequest) {
    try {
      const { data, error } = await supabase.functions.invoke('razorpay-payment', {
        body: {
          action: 'create_order',
          ...request,
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Razorpay payment creation error:', error);
      return { data: null, error };
    }
  },

  // Verify Razorpay payment
  async verifyRazorpayPayment(verification: RazorpayVerification) {
    try {
      const { data, error } = await supabase.functions.invoke('razorpay-payment', {
        body: {
          action: 'verify_payment',
          ...verification,
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Razorpay payment verification error:', error);
      return { data: null, error };
    }
  },

  // Get payment history for a user
  async getPurchaseHistory(userId: string): Promise<{ data: PaymentHistory[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const history: PaymentHistory[] = data.map((transaction: any) => ({
        id: transaction.id,
        amount: transaction.amount,
        currency: transaction.currency,
        credit_amount: transaction.credit_amount,
        payment_method: transaction.payment_method,
        status: transaction.status,
        created_at: transaction.created_at,
        description: transaction.description,
      }));

      return { data: history, error: null };
    } catch (error: any) {
      console.error('Failed to fetch payment history:', error);
      return { data: null, error };
    }
  },

  // Get transaction details by ID
  async getTransactionById(transactionId: string): Promise<{ data: any | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', transactionId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Failed to fetch transaction:', error);
      return { data: null, error };
    }
  },

  // Cancel pending transaction
  async cancelTransaction(transactionId: string): Promise<{ data: any | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update({
          status: 'canceled',
          updated_at: new Date().toISOString(),
        })
        .eq('id', transactionId)
        .eq('status', 'pending')
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Failed to cancel transaction:', error);
      return { data: null, error };
    }
  },

  // Get payment statistics for a user
  async getPaymentStats(userId: string): Promise<{ data: any | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('amount, currency, credit_amount, status, created_at')
        .eq('user_id', userId);

      if (error) throw error;

      const stats = {
        totalSpent: 0,
        totalCredits: 0,
        successfulPayments: 0,
        failedPayments: 0,
        currency: 'USD',
      };

      data.forEach((transaction: any) => {
        if (transaction.status === 'completed') {
          stats.totalSpent += transaction.amount;
          stats.totalCredits += transaction.credit_amount;
          stats.successfulPayments += 1;
        } else if (transaction.status === 'failed') {
          stats.failedPayments += 1;
        }
        stats.currency = transaction.currency;
      });

      return { data: stats, error: null };
    } catch (error: any) {
      console.error('Failed to fetch payment stats:', error);
      return { data: null, error };
    }
  },

  // Validate payment amount and credits
  validatePaymentRequest(request: PaymentRequest): { isValid: boolean; error?: string } {
    if (!request.amount || request.amount <= 0) {
      return { isValid: false, error: 'Amount must be greater than 0' };
    }

    if (!request.creditAmount || request.creditAmount <= 0) {
      return { isValid: false, error: 'Credit amount must be greater than 0' };
    }

    if (!request.currency || !['USD', 'EUR', 'INR'].includes(request.currency.toUpperCase())) {
      return { isValid: false, error: 'Invalid currency' };
    }

    if (!request.userId) {
      return { isValid: false, error: 'User ID is required' };
    }

    return { isValid: true };
  },

  // Format currency for display
  formatCurrency(amount: number, currency: string): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    });
    return formatter.format(amount);
  },

  // Get supported currencies
  getSupportedCurrencies(): Array<{ code: string; name: string; symbol: string }> {
    return [
      { code: 'USD', name: 'US Dollar', symbol: '$' },
      { code: 'EUR', name: 'Euro', symbol: '€' },
      { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    ];
  },

  // Get payment method details
  getPaymentMethodDetails(method: string): { name: string; description: string; icon: string } {
    const methods: { [key: string]: { name: string; description: string; icon: string } } = {
      stripe: {
        name: 'Credit/Debit Card',
        description: 'Secure payment via Stripe',
        icon: 'credit-card',
      },
      razorpay: {
        name: 'UPI & Cards (India)',
        description: 'Pay via UPI, cards, or net banking',
        icon: 'credit-card',
      },
    };

    return methods[method] || {
      name: 'Unknown Method',
      description: 'Payment method not recognized',
      icon: 'help-circle',
    };
  },
};
