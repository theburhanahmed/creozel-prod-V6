import { SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { 
  Wallet, 
  Transaction, 
  AppError, 
  InsufficientCreditsError,
  AsyncResult
} from '../types';

/**
 * WalletManager handles all wallet and credit-related operations
 */
export class WalletManager {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  /**
   * Get the user's wallet balance
   */
  public async getWallet(userId: string): Promise<Wallet | null> {
    const { data, error } = await this.supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error?.code === 'PGRST116') return null; // No rows
    if (error) throw this.handleError('Failed to get wallet', error, { userId });
    
    return this.mapWalletFromDb(data);
  }

  /**
   * Reserve credits for a transaction
   */
  public async reserveCredits(
    userId: string, 
    amount: number, 
    reference?: string
  ): Promise<string> {
    this.validateAmount(amount);
    
    const { data: transaction, error } = await this.supabase.rpc('reserve_credits', {
      p_user_id: userId,
      p_amount: amount,
      p_reference: reference || null
    });

    if (error) {
      if (error.message?.includes('insufficient_credits')) {
        throw new InsufficientCreditsError(
          parseFloat(error.details?.available || '0'),
          amount
        );
      }
      throw this.handleError('Failed to reserve credits', error, { userId, amount });
    }

    return transaction.reservation_id;
  }

  /**
   * Confirm a credit deduction
   */
  public async confirmDeduction(
    reservationId: string, 
    actualAmount: number
  ): Promise<Transaction> {
    this.validateAmount(actualAmount);
    
    const { data: transaction, error } = await this.supabase.rpc('confirm_credit_deduction', {
      p_reservation_id: reservationId,
      p_actual_amount: actualAmount
    });

    if (error) throw this.handleError('Failed to confirm deduction', error, { 
      reservationId, 
      actualAmount 
    });

    return this.mapTransactionFromDb(transaction);
  }

  /**
   * Release a reservation
   */
  public async releaseReservation(
    reservationId: string, 
    amount?: number
  ): Promise<Transaction> {
    const { data: transaction, error } = await this.supabase.rpc('release_credits', {
      p_reservation_id: reservationId,
      p_amount: amount || null
    });

    if (error) throw this.handleError('Failed to release reservation', error, { 
      reservationId, 
      amount 
    });

    return this.mapTransactionFromDb(transaction);
  }

  /**
   * Add credits to a wallet
   */
  public async addCredits(
    userId: string, 
    amount: number, 
    reference?: string
  ): Promise<Transaction> {
    this.validateAmount(amount);
    
    const { data: transaction, error } = await this.supabase.rpc('add_credits', {
      p_user_id: userId,
      p_amount: amount,
      p_reference: reference || null
    });

    if (error) throw this.handleError('Failed to add credits', error, { 
      userId, 
      amount 
    });

    return this.mapTransactionFromDb(transaction);
  }

  // Helper methods
  private validateAmount(amount: number): void {
    if (amount <= 0) {
      throw new AppError('Amount must be greater than zero', 400, 'INVALID_AMOUNT');
    }
  }

  private mapWalletFromDb(data: any): Wallet {
    return {
      id: data.id,
      userId: data.user_id,
      creditsAvailable: parseFloat(data.credits_available),
      creditsUsed: parseFloat(data.credits_used),
      updatedAt: new Date(data.updated_at)
    };
  }

  private mapTransactionFromDb(data: any): Transaction {
    return {
      id: data.id,
      walletId: data.wallet_id,
      amount: parseFloat(data.amount),
      type: data.type,
      status: data.status,
      referenceId: data.reference_id,
      metadata: data.metadata,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  private handleError(
    message: string, 
    error: any, 
    context: Record<string, any> = {}
  ): AppError {
    console.error(message, { ...context, error });
    return new AppError(
      `${message}: ${error.message}`,
      error.status || 500,
      error.code || 'WALLET_ERROR',
      { ...context, error: error.details || error }
    );
  }
}
