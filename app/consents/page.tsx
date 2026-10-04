'use client';

import { useState, useEffect } from 'react';
import { getUserConsents, grantConsent, revokeConsent } from '@/lib/api';

export default function ConsentsPage() {
  const [consents, setConsents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsents = async () => {
      try {
        const data = await getUserConsents();
        setConsents(data.consents || []);
      } catch (error) {
        console.error('Failed to fetch consents:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConsents();
  }, []);

  const handleGrantConsent = async (consentType: string) => {
    try {
      await grantConsent({ consent_type: consentType, source: 'settings' });
      const data = await getUserConsents();
      setConsents(data.consents || []);
    } catch (error) {
      console.error('Failed to grant consent:', error);
    }
  };

  const handleRevokeConsent = async (consentType: string) => {
    try {
      await revokeConsent({ consent_type: consentType });
      const data = await getUserConsents();
      setConsents(data.consents || []);
    } catch (error) {
      console.error('Failed to revoke consent:', error);
    }
  };

  const consentTypes = [
    { key: 'email', label: 'Email Marketing', description: 'Receive outreach emails via email' },
    { key: 'whatsapp', label: 'WhatsApp Messages', description: 'Receive messages via WhatsApp' },
    { key: 'linkedin', label: 'LinkedIn Outreach', description: 'Receive messages via LinkedIn' },
    { key: 'marketing', label: 'Marketing Communications', description: 'Receive marketing updates' },
    { key: 'analytics', label: 'Analytics Tracking', description: 'Allow usage analytics' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 p-6">
        <div className="text-white">Loading...</div>
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
      <h2 className="text-xl font-semibold text-white mb-6">Consent Preferences</h2>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <p className="text-gray-400 text-sm mb-6">
          Manage your consent preferences for different types of communications. 
          You can grant or revoke consent at any time.
        </p>

        <div className="space-y-4">
          {consentTypes.map((type) => {
            const activeConsent = consents.find(c => c.consent_type === type.key && c.consent_status === 'granted');
            const isActive = !!activeConsent;

            return (
              <div key={type.key} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                <div>
                  <h3 className="text-white font-medium">{type.label}</h3>
                  <p className="text-gray-400 text-sm">{type.description}</p>
                  {isActive && activeConsent.consent_date && (
                    <p className="text-gray-500 text-xs mt-1">
                      Granted on {new Date(activeConsent.consent_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => isActive ? handleRevokeConsent(type.key) : handleGrantConsent(type.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isActive ? 'Revoke' : 'Grant'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-white font-medium mb-2">Privacy Policy</h3>
        <p className="text-gray-400 text-sm mb-4">
          Your data is handled in accordance with our Privacy Policy. You have the right to access, 
          modify, or delete your personal data at any time.
        </p>
        <a href="/privacy" className="text-blue-400 text-sm hover:underline">
          View Privacy Policy →
        </a>
      </div>
    </div>
  );
}
