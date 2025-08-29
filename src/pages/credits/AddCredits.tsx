import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ChevronLeftIcon, CheckIcon, CreditCardIcon, DollarSignIcon, InfoIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../../../supabase/client';
export const AddCredits = () => {
  const [creditsAmount, setCreditsAmount] = useState<number>(100);
  const [isProcessing, setIsProcessing] = useState(false);
  // Pricing: 1 credit = ₹1 (100 paise)
  const pricePerCredit = 100; // in paise
  const minCredits = 10;
  const maxCredits = 100000;

  // Razorpay handler
  const handlePurchase = async () => {
    if (!creditsAmount || creditsAmount < minCredits) {
      toast.error(`Please enter at least ${minCredits} credits`);
      return;
    }
    setIsProcessing(true);
    try {
      const amountPaise = creditsAmount * pricePerCredit;
      // Call Edge Function to create Razorpay order
      const { data, error } = await supabase.functions.invoke('razorpay-payment', {
        body: { amount: amountPaise, currency: 'INR' },
      });
      if (error || !data?.order) throw new Error(error?.message || 'Failed to create payment order');
      // Load Razorpay script if not loaded
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }
      // Get user info
      const user = (await supabase.auth.getUser()).data.user;
      // Open Razorpay checkout
      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amountPaise,
        currency: 'INR',
        name: 'Creozel',
        description: `${creditsAmount} Credits Purchase`,
        order_id: data.order.id,
        handler: function (response: any) {
          toast.success('Payment successful! Credits will be added shortly.');
          setIsProcessing(false);
        },
        prefill: {
          email: user?.email || '',
          name: user?.user_metadata?.name || '',
        },
        notes: {
          user_id: user?.id || '',
        },
        theme: {
          color: '#10b981',
        },
      });
      rzp.open();
    } catch (err: any) {
      toast.error('Payment failed', { description: err.message || 'Unknown error' });
      setIsProcessing(false);
    }
  };
  return <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 mb-2">
            <ChevronLeftIcon size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add Credits
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Purchase credits to use for content generation and other features
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Enter Credits Amount
            </h2>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min={minCredits}
                max={maxCredits}
                value={creditsAmount}
                onChange={e => setCreditsAmount(Math.max(minCredits, Math.min(maxCredits, Number(e.target.value))))}
                className="w-40 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
              />
              <span className="text-gray-700 dark:text-gray-300">credits</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Minimum {minCredits} credits. 1 credit = ₹1
            </p>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Payment Method
            </h2>
            <div className="text-center py-6">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                  <CreditCardIcon size={24} className="text-gray-500 dark:text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                Pay securely with Razorpay
                </p>
            </div>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    Credits:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {creditsAmount}
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Total:
                    </span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      ₹{creditsAmount}
                    </span>
                  </div>
                  <Button variant="primary" className="w-full" onClick={handlePurchase} isLoading={isProcessing} loadingText="Processing..." disabled={!creditsAmount || isProcessing}>
                    Complete Purchase
                  </Button>
                </div>
                <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg">
                  <div className="flex gap-2">
                    <InfoIcon size={16} className="text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800 dark:text-blue-300">
                      Credits never expire and can be used for all AI-powered
                      features including text, image, video, and audio
                      generation.
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>;
};
