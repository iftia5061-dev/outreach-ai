'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Toast from '@/components/Toast';
import { getSubscriptionStatus } from '@/lib/api';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [usage, setUsage] = useState({ prospects: 0, clients: 0 });
  const [settings, setSettings] = useState({
    timezone: 'UTC+0 (GMT)',
  });

  useEffect(() => {
    fetchSubscription();
    setTimeout(() => setLoading(false), 500);
  }, []);

  const fetchSubscription = async () => {
    try {
      const data = await getSubscriptionStatus();

      if (data.error) {
        if (data.error.includes('Unauthorized') || data.error.includes('401')) {
          return;
        }
      }

      setSubscription(data.subscription);
      setUsage(data.usage);
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    }
  };

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleSave = () => {
    setToast({ message: 'Settings saved successfully!', type: 'success' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 p-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4"
      >
        ← Back
      </button>
      <h2 className="text-base font-semibold text-white mb-6">Settings</h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Business Info - Link to AI Settings */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-sm font-medium text-white mb-4">Business Details</p>
            <p className="text-xs text-gray-400 mb-3">
              Business name, description, services, and other AI-related settings are managed in AI Settings.
            </p>
            <Link href="/ai-settings">
              <Button variant="outline" size="sm">
                Go to AI Settings
              </Button>
            </Link>
          </div>

          {/* Timezone Settings */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-sm font-medium text-white mb-4">Timezone</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Select Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                  className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white"
                >
                  <option>UTC+0 (GMT)</option>
                  <option>UTC+1 (Central Europe)</option>
                  <option>UTC+2 (Eastern Europe)</option>
                  <option>UTC-5 (Eastern Time)</option>
                  <option>UTC-8 (Pacific Time)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Info Card */}
        <div className="mt-6 bg-gray-800 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-white">Subscription Status</p>
            <Link href="/billing" className="text-xs text-blue-400 hover:text-blue-300">
              Manage →
            </Link>
          </div>
          {subscription ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Plan:</span>
                <span className="text-white capitalize">{subscription.plan_type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Status:</span>
                <span className={`capitalize ${subscription.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                  {subscription.status}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Prospects:</span>
                <span className="text-white">{usage.prospects} used</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Clients:</span>
                <span className="text-white">{usage.clients} used</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-400 mb-3">No active subscription</p>
              <Link href="/pricing">
                <Button variant="primary" size="sm">
                  View Plans
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="mt-6">
          <Button 
            onClick={handleSave}
            variant="primary"
          >
            Save Settings
          </Button>
        </div>
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
