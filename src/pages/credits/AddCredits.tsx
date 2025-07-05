import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ChevronLeftIcon, CheckIcon, CreditCardIcon, DollarSignIcon, InfoIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
export const AddCredits = () => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  // Mock credit packages
  const creditPackages = [{
    id: 'basic',
    name: 'Basic',
    credits: 100,
    price: 9.99,
    popular: false
  }, {
    id: 'standard',
    name: 'Standard',
    credits: 500,
    price: 39.99,
    popular: true
  }, {
    id: 'premium',
    name: 'Premium',
    credits: 1500,
    price: 99.99,
    popular: false
  }, {
    id: 'enterprise',
    name: 'Enterprise',
    credits: 5000,
    price: 299.99,
    popular: false
  }];
  // Mock payment methods
  const paymentMethods = [{
    id: 'card_1',
    type: 'visa',
    last4: '4242',
    expMonth: 12,
    expYear: 2025
  }];
  const handlePurchase = () => {
    if (!selectedPackage) {
      toast.error('Please select a credit package');
      return;
    }
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Credits added successfully!');
      // In a real app, we would update the user's credit balance here
    }, 2000);
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
              Select Credit Package
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creditPackages.map(pkg => <div key={pkg.id} className={`relative p-4 border rounded-lg cursor-pointer transition-all ${selectedPackage === pkg.id ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700'}`} onClick={() => setSelectedPackage(pkg.id)}>
                  {pkg.popular && <div className="absolute -top-3 -right-1">
                      <span className="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-medium rounded-full">
                        Popular
                      </span>
                    </div>}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {pkg.name}
                      </h3>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {pkg.credits}{' '}
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                          credits
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Price
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        ${pkg.price}
                      </p>
                    </div>
                  </div>
                  {selectedPackage === pkg.id && <div className="absolute top-2 right-2">
                      <CheckIcon size={18} className="text-green-500 dark:text-green-400" />
                    </div>}
                </div>)}
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Payment Method
            </h2>
            {paymentMethods.length > 0 ? <div className="space-y-4">
                {paymentMethods.map(method => <div key={method.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 dark:text-blue-400">
                        <CreditCardIcon size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white capitalize">
                          {method.type} •••• {method.last4}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Expires {method.expMonth}/{method.expYear}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Default
                      </span>
                    </div>
                  </div>)}
                <Button variant="outline" leftIcon={<CreditCardIcon size={16} />}>
                  Add New Payment Method
                </Button>
              </div> : <div className="text-center py-6">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                  <CreditCardIcon size={24} className="text-gray-500 dark:text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No payment methods found
                </p>
                <Button variant="outline" leftIcon={<CreditCardIcon size={16} />}>
                  Add Payment Method
                </Button>
              </div>}
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
                    Selected Package:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {selectedPackage ? creditPackages.find(pkg => pkg.id === selectedPackage)?.name : 'None selected'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    Credits:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {selectedPackage ? creditPackages.find(pkg => pkg.id === selectedPackage)?.credits : '0'}
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Total:
                    </span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      $
                      {selectedPackage ? creditPackages.find(pkg => pkg.id === selectedPackage)?.price.toFixed(2) : '0.00'}
                    </span>
                  </div>
                  <Button variant="primary" className="w-full" onClick={handlePurchase} isLoading={isProcessing} loadingText="Processing..." disabled={!selectedPackage || isProcessing}>
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