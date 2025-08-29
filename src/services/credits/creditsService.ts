import { supabase } from '../../../supabase/client';

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'purchase' | 'usage' | 'refund' | 'bonus';
  description: string;
  reference_id?: string;
  stripe_payment_intent_id?: string;
  created_at: string;
}

export interface CreditsInfo {
  balance: number;
  transactions: CreditTransaction[];
  lastPurchase?: string;
}

export interface CreditOperationResult {
  success: boolean;
  credits?: number;
  error?: string;
  message?: string;
}

class CreditsService {
  /**
   * Fetch user's credit balance and transaction history
   */
  async getUserCredits(): Promise<CreditsInfo> {
    try {
      const { data, error } = await supabase.functions.invoke('manage-credits', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to fetch credits');
      }

      // Calculate last purchase date
      let lastPurchase: string | undefined;
      if (data?.transactions && data.transactions.length > 0) {
        const purchaseTransactions = data.transactions.filter(
          (tx: CreditTransaction) => tx.type === 'purchase'
        );
        if (purchaseTransactions.length > 0) {
          lastPurchase = this.formatTimeAgo(new Date(purchaseTransactions[0].created_at));
        }
      }

      return {
        balance: data?.credits || 0,
        transactions: data?.transactions || [],
        lastPurchase
      };
    } catch (error: any) {
      console.error('Error fetching user credits:', error);
      throw new Error(error.message || 'Failed to fetch credits');
    }
  }

  /**
   * Add credits to user's account
   */
  async addCredits(amount: number, description?: string, referenceId?: string): Promise<CreditOperationResult> {
    try {
      const { data, error } = await supabase.functions.invoke('manage-credits', {
        method: 'POST',
        body: {
          action: 'add',
          amount,
          description: description || 'Credit purchase',
          reference_id: referenceId
        },
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to add credits');
      }

      return {
        success: true,
        credits: data?.credits,
        message: 'Credits added successfully'
      };
    } catch (error: any) {
      console.error('Error adding credits:', error);
      return {
        success: false,
        error: error.message || 'Failed to add credits'
      };
    }
  }

  /**
   * Deduct credits from user's account
   */
  async deductCredits(amount: number, description?: string): Promise<CreditOperationResult> {
    try {
      const { data, error } = await supabase.functions.invoke('manage-credits', {
        method: 'POST',
        body: {
          action: 'deduct',
          amount,
          description: description || 'Credit deduction'
        },
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to deduct credits');
      }

      return {
        success: true,
        credits: data?.credits,
        message: 'Credits deducted successfully'
      };
    } catch (error: any) {
      console.error('Error deducting credits:', error);
      return {
        success: false,
        error: error.message || 'Failed to deduct credits'
      };
    }
  }

  /**
   * Format time ago for display
   */
  private formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
  }

  /**
   * Check if user has sufficient credits
   */
  async hasSufficientCredits(requiredAmount: number): Promise<boolean> {
    try {
      const creditsInfo = await this.getUserCredits();
      return creditsInfo.balance >= requiredAmount;
    } catch (error) {
      console.error('Error checking credit balance:', error);
      return false;
    }
  }

  /**
   * Charge user a given amount of credits for AI usage.
   * Returns true if deduction succeeded or false if insufficient credits / error.
   */
  async chargeForAI(amount: number = 1, description: string = 'AI content generation'): Promise<boolean> {
    try {
      const hasCredits = await this.hasSufficientCredits(amount);
      if (!hasCredits) {
        return false;
      }
      const result = await this.deductCredits(amount, description);
      return result.success;
    } catch (error) {
      console.error('Error charging credits for AI:', error);
      return false;
    }
  }

  /**
   * Get credit transaction history
   */
  async getTransactionHistory(limit: number = 50): Promise<CreditTransaction[]> {
    try {
      const creditsInfo = await this.getUserCredits();
      return creditsInfo.transactions.slice(0, limit);
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return [];
    }
  }
}

export const creditsService = new CreditsService();
