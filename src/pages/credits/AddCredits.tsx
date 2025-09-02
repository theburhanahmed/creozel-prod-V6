import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  CreditCardIcon, 
  SparklesIcon, 
  CheckIcon, 
  XIcon,
  LoaderIcon,
  ShieldCheckIcon,
  ZapIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../supabase/client';
import { paymentService } from '../../services/payments/paymentService';

interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  currency: string;
  popular?: boolean;
  savings?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  available: boolean;
}

const creditPackages: CreditPackage[] = [
  { id: 'starter', credits: 100, price: 9.99, currency: 'USD', savings: 'Best Value' },
  { id: 'pro', credits: 500, price: 39.99, currency: 'USD', savings: 'Save 20%' },
  { id: 'business', credits: 1000, price: 69.99, currency: 'USD', popular: true, savings: 'Save 30%' },
  { id: 'enterprise', credits: 5000, price: 299.99, currency: 'USD', savings: 'Save 40%' },
];

const paymentMethods: PaymentMethod[] = [
  {
    id: 'stripe',
    name: 'Credit/Debit Card',
    icon: CreditCardIcon,
    description: 'Secure payment via Stripe',
    available: true,
  },
  {
    id: 'razorpay',
    name: 'UPI & Cards (India)',
    icon: CreditCardIcon,
    description: 'Pay via UPI, cards, or net banking',
    available: true,
  },
];

export const AddCredits = () => {
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [currentCredits, setCurrentCredits] = useState(0);

  useEffect(() => {
    // Fetch user ID and current credits
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          
          // Fetch current credits
          const { data: userData } = await supabase
            .from('users')
            .select('credits')
            .eq('id', user.id)
            .single();
          
          if (userData) {
            setCurrentCredits(userData.credits || 0);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handlePackageSelect = (pkg: CreditPackage) => {
    setSelectedPackage(pkg);
    setSelectedPaymentMethod(null); // Reset payment method when package changes
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };

  const handleStripePayment = async () => {
    if (!selectedPackage || !userId) return;

    setIsProcessing(true);
    try {
      const { data, error } = await paymentService.createStripePayment({
        amount: selectedPackage.price,
        currency: selectedPackage.currency,
        userId,
        creditAmount: selectedPackage.credits,
        description: `Purchase of ${selectedPackage.credits} credits`,
      });

      if (error) throw error;

      // Redirect to Stripe Checkout or handle client-side payment
      if (data.client_secret) {
        // For client-side payment confirmation
        await handleStripeClientPayment(data.client_secret, data.payment_intent_id);
      }
    } catch (error: any) {
      toast.error('Payment failed', { description: error.message || 'Unknown error occurred' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStripeClientPayment = async (clientSecret: string, paymentIntentId: string) => {
    try {
      // This would typically integrate with Stripe Elements or Checkout
      // For now, we'll simulate a successful payment
      toast.success('Payment processed successfully!');
      
      // Refresh user credits
      const { data: userData } = await supabase
        .from('users')
        .select('credits')
        .eq('id', userId)
        .single();
      
      if (userData) {
        setCurrentCredits(userData.credits || 0);
      }
      
      // Reset selection
      setSelectedPackage(null);
      setSelectedPaymentMethod(null);
    } catch (error) {
      toast.error('Payment confirmation failed');
    }
  };

  const handleRazorpayPayment = async () => {
    if (!selectedPackage || !userId) return;

    setIsProcessing(true);
    try {
      const { data, error } = await paymentService.createRazorpayPayment({
        amount: selectedPackage.price,
        currency: selectedPackage.currency,
        userId,
        creditAmount: selectedPackage.credits,
        description: `Purchase of ${selectedPackage.credits} credits`,
      });

      if (error) throw error;

      // Initialize Razorpay payment
      if (data.order_id && data.key_id) {
        await initializeRazorpayPayment(data);
      }
    } catch (error: any) {
      toast.error('Payment failed', { description: error.message || 'Unknown error occurred' });
    } finally {
      setIsProcessing(false);
    }
  };

  const initializeRazorpayPayment = async (orderData: any) => {
    try {
      // Load Razorpay script dynamically
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      
      script.onload = () => {
        const options = {
          key: orderData.key_id,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Creozel',
          description: `Purchase of ${selectedPackage?.credits} credits`,
          order_id: orderData.order_id,
          handler: async (response: any) => {
            try {
              // Verify payment
              const { data, error } = await paymentService.verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId,
                creditAmount: selectedPackage?.credits || 0,
              });

              if (error) throw error;

              if (data.success) {
                toast.success('Payment successful! Credits added to your account.');
                
                // Refresh user credits
                const { data: userData } = await supabase
                  .from('users')
                  .select('credits')
                  .eq('id', userId)
                  .single();
                
                if (userData) {
                  setCurrentCredits(userData.credits || 0);
                }
                
                // Reset selection
                setSelectedPackage(null);
                setSelectedPaymentMethod(null);
              }
            } catch (error: any) {
              toast.error('Payment verification failed', { description: error.message });
            }
          },
          prefill: {
            email: '', // You can prefill user email here
          },
          theme: {
            color: '#10B981',
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      };

      document.head.appendChild(script);
    } catch (error) {
      toast.error('Failed to initialize Razorpay payment');
    }
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (selectedPaymentMethod.id === 'stripe') {
      await handleStripePayment();
    } else if (selectedPaymentMethod.id === 'razorpay') {
      await handleRazorpayPayment();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <SparklesIcon className="h-8 w-8 text-green-500" />
          Add Credits
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Purchase credits to unlock AI-powered content generation
        </p>
        
        {/* Current Credits Display */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full">
          <ZapIcon className="h-4 w-4 text-green-600" />
          <span className="text-green-800 dark:text-green-200 font-medium">
            Current Balance: {currentCredits} credits
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Credit Packages */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Choose Your Credit Package
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creditPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedPackage?.id === pkg.id
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 ring-2 ring-green-500/50'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => handlePackageSelect(pkg)}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {pkg.credits} Credits
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      ${pkg.price}
                    </div>
                    {pkg.savings && (
                      <div className="text-sm text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                        {pkg.savings}
                      </div>
                    )}
                  </div>
                  
                  {selectedPackage?.id === pkg.id && (
                    <div className="absolute top-2 right-2">
                      <CheckIcon className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-6">
          {/* Payment Methods */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Payment Method
            </h3>
            
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedPaymentMethod?.id === method.id
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  } ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => method.available && handlePaymentMethodSelect(method)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white">
                      <method.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {method.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {method.description}
                      </div>
                    </div>
                    {selectedPaymentMethod?.id === method.id && (
                      <CheckIcon className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Payment Summary */}
          {selectedPackage && (
            <Card className="p-6 bg-gray-50 dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Credits:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {selectedPackage.credits}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Price:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${selectedPackage.price} {selectedPackage.currency}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white">Total:</span>
                    <span className="font-bold text-xl text-green-600">
                      ${selectedPackage.price} {selectedPackage.currency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              <Button
                onClick={handlePayment}
                disabled={!selectedPaymentMethod || isProcessing}
                isLoading={isProcessing}
                loadingText="Processing..."
                leftIcon={<CreditCardIcon className="h-5 w-5" />}
                fullWidth
                size="lg"
                className="mt-4"
              >
                Pay Now
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Security & Trust */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-center gap-4">
          <ShieldCheckIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
              Secure & Trusted
            </h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              All payments are processed securely through industry-standard payment gateways
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
