import { apiClient } from '../api/apiClient';
import { PAYMENT_ENDPOINTS, ENV_CONFIG } from '../api/config';
export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  isPopular?: boolean;
}
export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}
export interface Invoice {
  id: string;
  amount: number;
  status: string;
  date: string;
  pdfUrl?: string;
}
/**
 * Stripe payment service for handling subscriptions and payments
 */
export const stripeService = {
  /**
   * Get available subscription plans
   */
  async getPlans(): Promise<Plan[]> {
    try {
      return await apiClient.get(PAYMENT_ENDPOINTS.PLANS);
    } catch (error) {
      console.error('Get plans error:', error);
      throw error;
    }
  },
  /**
   * Subscribe to a plan
   */
  async subscribeToPlan(planId: string): Promise<{
    sessionId: string;
    url: string;
  }> {
    try {
      return await apiClient.post(PAYMENT_ENDPOINTS.SUBSCRIBE, {
        planId
      });
    } catch (error) {
      console.error('Subscribe to plan error:', error);
      throw error;
    }
  },
  /**
   * Get Stripe billing portal URL
   */
  async getBillingPortalUrl(returnUrl: string): Promise<{
    url: string;
  }> {
    try {
      return await apiClient.post(PAYMENT_ENDPOINTS.BILLING_PORTAL, {
        returnUrl
      });
    } catch (error) {
      console.error('Get billing portal URL error:', error);
      throw error;
    }
  },
  /**
   * Get payment methods
   */
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      return await apiClient.get(PAYMENT_ENDPOINTS.PAYMENT_METHODS);
    } catch (error) {
      console.error('Get payment methods error:', error);
      throw error;
    }
  },
  /**
   * Get invoices
   */
  async getInvoices(): Promise<Invoice[]> {
    try {
      return await apiClient.get(PAYMENT_ENDPOINTS.INVOICES);
    } catch (error) {
      console.error('Get invoices error:', error);
      throw error;
    }
  },
  /**
   * Get Stripe public key
   */
  getStripePublicKey(): string {
    return ENV_CONFIG.STRIPE_PUBLIC_KEY;
  }
};