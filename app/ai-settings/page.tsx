'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Toast from '@/components/Toast';
import { getAISettings, updateAISettings } from '@/lib/api';

export default function AISettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    business_name: '',
    business_description: '',
    services: '',
    tone: 'professional',
    signature: '',
    language: 'en',
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getAISettings();
      if (data.error) {
        setToast({ message: data.error, type: 'error' });
      } else {
        setSettings({
          business_name: data.business_name || '',
          business_description: data.business_description || '',
          services: data.services || '',
          tone: data.tone || 'professional',
          signature: data.signature || '',
          language: data.language || 'en',
        });
      }
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to load settings', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await updateAISettings(settings);
      if (data.error) {
        setToast({ message: data.error, type: 'error' });
      } else {
        setToast({ message: 'Settings saved successfully', type: 'success' });
      }
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to save settings', type: 'error' });
    } finally {
      setSaving(false);
    }
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
      <h2 className="text-base font-semibold text-white mb-6">AI Settings</h2>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-xs text-gray-400 mb-1 block">Business Name</label>
            <input
              type="text"
              value={settings.business_name}
              onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
              placeholder="Your Company Name"
              className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-gray-600"
            />
          </div>

          <div className="col-span-2">
            <label className="text-xs text-gray-400 mb-1 block">Business Description</label>
            <textarea
              value={settings.business_description}
              onChange={(e) => setSettings({ ...settings, business_description: e.target.value })}
              placeholder="Describe your business and what you do"
              rows={3}
              className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-gray-600"
            />
          </div>

          <div className="col-span-2">
            <label className="text-xs text-gray-400 mb-1 block">Services</label>
            <textarea
              value={settings.services}
              onChange={(e) => setSettings({ ...settings, services: e.target.value })}
              placeholder="List your services (e.g., consulting, sales, support)"
              rows={2}
              className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-gray-600"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Tone</label>
            <select
              value={settings.tone}
              onChange={(e) => setSettings({ ...settings, tone: e.target.value })}
              className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-gray-600"
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-gray-600"
            >
              <option value="en">English</option>
              <option value="bn">Bengali</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="text-xs text-gray-400 mb-1 block">Email Signature</label>
            <textarea
              value={settings.signature}
              onChange={(e) => setSettings({ ...settings, signature: e.target.value })}
              placeholder="Your email signature (e.g., Best regards, John Doe)"
              rows={2}
              className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-gray-600"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
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
