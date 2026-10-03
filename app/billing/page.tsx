'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Subscription {
  id: number;
  plan_type: string;
  status: string;
  billing_cycle: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  cancelled_at: string | null;
}

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

export default function BillingPage() {
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [usage, setUsage] = useState({ prospects: 0, clients: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    // Check for successful checkout
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');

    if (success === 'true') {
      // Clear URL params
      window.history.replaceState({}, '', '/billing');
    }

    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscriptions/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        setLoading(false);
        return;
      }

      const data = await response.json();
      setSubscription(data.subscription);
      setPlan(data.plan);
      setUsage(data.usage);
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access at the end of the billing period.')) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscriptions/cancel`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        alert('Subscription will be cancelled at the end of the billing period');
        fetchSubscription();
      } else {
        alert('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Cancel error:', error);
      alert('Failed to cancel subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResume = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscriptions/resume`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        alert('Subscription resumed successfully');
        fetchSubscription();
      } else {
        alert('Failed to resume subscription');
      }
    } catch (error) {
      console.error('Resume error:', error);
      alert('Failed to resume subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpgrade = () => {
    router.push('/pricing');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading billing information...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Billing & Subscription</h1>

        {!subscription ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="mb-6">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Active Subscription</h2>
              <p className="text-gray-600 mb-6">
                Subscribe to a plan to unlock all features and start scaling your outreach.
              </p>
            </div>
            <button
              onClick={handleUpgrade}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View Plans
            </button>
          </div>
        ) : (
          <>
            {/* Current Plan Card */}
            <div className="bg-white rounded-lg shadow p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{plan?.name}</h2>
                  <p className="text-gray-600 capitalize">{subscription.billing_cycle} billing</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {subscription.status}
                  </span>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Prospects Used</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {usage.prospects} / {plan?.limits.prospects === Infinity ? '∞' : plan?.limits.prospects}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Clients Used</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {usage.clients} / {plan?.limits.clients === Infinity ? '∞' : plan?.limits.clients}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  <p>Current period: {new Date(subscription.current_period_start).toLocaleDateString()} - {new Date(subscription.current_period_end).toLocaleDateString()}</p>
                  {subscription.cancel_at_period_end && (
                    <p className="text-red-600 mt-2">⚠️ Subscription will be cancelled on {new Date(subscription.current_period_end).toLocaleDateString()}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                {subscription.status === 'active' && !subscription.cancel_at_period_end ? (
                  <>
                    <button
                      onClick={handleCancel}
                      disabled={actionLoading}
                      className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {actionLoading ? 'Processing...' : 'Cancel Subscription'}
                    </button>
                    <button
                      onClick={handleUpgrade}
                      className="flex-1 bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Change Plan
                    </button>
                  </>
                ) : subscription.cancel_at_period_end ? (
                  <button
                    onClick={handleResume}
                    disabled={actionLoading}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : 'Resume Subscription'}
                  </button>
                ) : (
                  <button
                    onClick={handleUpgrade}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Reactivate
                  </button>
                )}
              </div>
            </div>

            {/* Plan Features */}
            <div className="bg-white rounded-lg shadow p-8 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Plan Features</h3>
              <ul className="space-y-3">
                {plan?.features.map((feature, index) => (
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
            </div>

            {/* Available Channels */}
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Available Channels</h3>
              <div className="flex flex-wrap gap-2">
                {plan?.limits.channels.map((channel) => (
                  <span
                    key={channel}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize"
                  >
                    {channel}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Test Mode Notice */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <svg
              className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h4 className="font-semibold text-yellow-900 mb-2">Test Mode Environment</h4>
              <p className="text-yellow-800 text-sm">
                This is a test environment. No real payments are processed. All subscriptions and
                invoices are for demonstration purposes only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
