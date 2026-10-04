'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCheckoutSession } from '@/lib/api';

interface Plan {
  name: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  limits: {
    clients: number;
    prospects: number;
    channels: string[];
  };
}

// Static plans - no API call needed to view
const STATIC_PLANS: Record<string, Plan> = {
  free: {
    name: 'Free',
    price_monthly: 0,
    price_yearly: 0,
    features: ['Up to 3 prospects', 'Email outreach', 'Basic analytics'],
    limits: { clients: 1, prospects: 3, channels: ['email'] },
  },
  monthly: {
    name: 'Monthly',
    price_monthly: 99,
    price_yearly: 990,
    features: ['Unlimited prospects', 'Email + WhatsApp', 'AI assistant', 'Meeting booking'],
    limits: { clients: 5, prospects: Infinity, channels: ['email', 'whatsapp'] },
  },
  yearly: {
    name: 'Yearly',
    price_monthly: 74,
    price_yearly: 890,
    features: ['Unlimited prospects', 'Email + WhatsApp + LinkedIn', 'AI assistant', 'Telephone AI'],
    limits: { clients: Infinity, prospects: Infinity, channels: ['email', 'whatsapp', 'linkedin', 'telephone'] },
  },
};

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const plans = STATIC_PLANS;
  const isTestMode = process.env.NEXT_PUBLIC_ENV !== 'production';

  const handleSelectPlan = async (planType: string) => {
    setSelectedPlan(planType);

    // Free plan - no payment needed
    if (planType === 'free') {
      alert('You are already on the Free plan!');
      setSelectedPlan(null);
      return;
    }

    try {
      const data = await createCheckoutSession({
        plan_type: 'professional',
        billing_cycle: planType === 'yearly' ? 'yearly' : 'monthly',
      });

      if (data.error) {
        if (data.error.includes('Unauthorized') || data.error.includes('401')) {
          alert('Session expired. Please login again.');
          router.push('/login');
        } else {
          alert(data.error || 'Failed to create checkout session');
        }
        return;
      }

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        alert('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout process. Please try again.');
    } finally {
      setSelectedPlan(null);
    }
  };

  const planTypes = ['free', 'monthly', 'yearly'] as const;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 mb-8">
            Scale your outreach with our flexible pricing plans
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'font-semibold' : 'text-gray-600'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === 'yearly' ? 'font-semibold' : 'text-gray-600'}`}>
              Yearly <span className="text-green-600 text-xs">(Save 25%)</span>
            </span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {planTypes.map((planType) => {
            const plan = plans[planType];
            if (!plan) return null;

            const price = planType === 'free' ? 0 : (billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly);
            const period = planType === 'free' ? 'Forever' : (billingCycle === 'monthly' ? '/month' : '/year');

            return (
              <div
                key={planType}
                className={`bg-white rounded-2xl shadow-lg p-8 border-2 transition-all hover:shadow-xl ${
                  planType === 'monthly' ? 'border-blue-500 relative' : 'border-gray-200'
                }`}
              >
                {planType === 'monthly' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-sm px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">${price}</span>
                  <span className="text-gray-600">{period}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(planType)}
                  disabled={selectedPlan === planType}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    planType === 'monthly'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  } ${selectedPlan === planType ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {selectedPlan === planType ? 'Processing...' : planType === 'free' ? 'Current Plan' : 'Subscribe'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Pricing Policy */}
        <div className="mt-12 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-start">
            <svg
              className="w-6 h-6 text-gray-600 mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Pricing & Refund Policy</h4>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• All prices are in USD</li>
                <li>• Monthly billing: charges recur every month</li>
                <li>• Yearly billing: save 17% with annual commitment</li>
                <li>• Cancel anytime: access continues until billing period ends</li>
                <li>• Refunds available within 7 days of purchase</li>
                <li>• Taxes may apply based on your location</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
