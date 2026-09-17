'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Toast from '@/components/Toast';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    companyName: 'Aegean Yacht Group',
    email: 'admin@aegeanyacht.com',
    timezone: 'UTC+2 (Athens)',
    aiModel: 'GPT-4o',
    aiTemperature: 0.7,
    emailSmtp: 'smtp.gmail.com',
    emailPort: 587,
    whatsappEnabled: true,
    linkedinEnabled: false,
    calendarStartTime: '09:00',
    calendarEndTime: '17:00',
    calendarUrl: 'https://calendly.com/yourname',
    campaignFrequency: 3,
    telephoneEnabled: false,
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleSave = () => {
    console.log('Saving settings:', settings);
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
          {/* Account Settings */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-sm font-medium text-white mb-4">Account Settings</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Company Name</label>
                <input 
                  type="text" 
                  value={settings.companyName}
                  onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                  className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white" 
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Email</label>
                <input 
                  type="email" 
                  value={settings.email}
                  onChange={(e) => setSettings({...settings, email: e.target.value})}
                  className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white" 
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Timezone</label>
                <select 
                  value={settings.timezone}
                  onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                  className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white"
                >
                  <option>UTC+2 (Athens)</option>
                  <option>UTC+1 (Central Europe)</option>
                  <option>UTC+0 (GMT)</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI Settings */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-sm font-medium text-white mb-4">AI Settings</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">AI Tone</label>
                <select className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white">
                  <option>Professional</option>
                  <option>Friendly</option>
                  <option>Formal</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">AI Response Time</label>
                <select className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white">
                  <option>Immediate</option>
                  <option>1 minute</option>
                  <option>5 minutes</option>
                  <option>15 minutes</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Auto-response Enabled</label>
                <div className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm text-gray-400">Enable automatic AI responses</span>
                </div>
              </div>
            </div>
          </div>

          {/* Email Settings */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-sm font-medium text-white mb-4">Email Settings</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">SMTP Server</label>
                <input type="text" placeholder="smtp.example.com" className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white placeholder-gray-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">SMTP Port</label>
                <input type="text" placeholder="587" className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white placeholder-gray-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">From Email</label>
                <input type="email" placeholder="noreply@aegeanyacht.com" className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white placeholder-gray-500" />
              </div>
            </div>
          </div>

          {/* WhatsApp Settings */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-sm font-medium text-white mb-4">WhatsApp Settings</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">WhatsApp Business API Key</label>
                <input type="password" placeholder="Enter API key" className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white placeholder-gray-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">WhatsApp Phone Number</label>
                <input type="tel" placeholder="+30 210 123 4567" className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white placeholder-gray-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">WhatsApp Enabled</label>
                <div className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm text-gray-400">Enable WhatsApp outreach</span>
                </div>
              </div>
            </div>
          </div>

          {/* LinkedIn Integration Settings */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-sm font-medium text-white mb-4">LinkedIn Integration Settings</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">LinkedIn Client ID</label>
                <input type="text" placeholder="Enter Client ID" className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white placeholder-gray-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">LinkedIn Client Secret</label>
                <input type="password" placeholder="Enter Client Secret" className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white placeholder-gray-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">LinkedIn Enabled</label>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm text-gray-400">Enable LinkedIn outreach</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Settings */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-sm font-medium text-white mb-4">Calendar Settings</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Meeting Duration</label>
                <select className="w-full border border-gray-700 rounded-lg px-3 py-2 text-sm bg-gray-900 text-white">
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>45 minutes</option>
                  <option>60 minutes</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Available Hours</label>
                <div className="flex gap-2">
                  <input type="time" defaultValue="09:00" className="w-full border border-gray-700 rounded-lg px-3 py-2 text-sm bg-gray-900 text-white" />
                  <span className="text-sm text-gray-400 self-center">to</span>
                  <input type="time" defaultValue="17:00" className="w-full border border-gray-700 rounded-lg px-3 py-2 text-sm bg-gray-900 text-white" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Booking Link (Calendly)</label>
                <input type="text" placeholder="https://calendly.com/yourname" className="w-full border border-gray-700 rounded-lg px-3 py-2 text-sm bg-gray-900 text-white" />
              </div>
            </div>
          </div>

          {/* Campaign Settings */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-800 mb-4">Campaign Settings</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Default Follow-up Sequence</label>
                <select className="w-full border border-gray-700 rounded-lg px-3 py-2 text-sm bg-gray-900 text-white">
                  <option>Single message</option>
                  <option>2-message sequence</option>
                  <option>3-message sequence</option>
                  <option>Custom sequence</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Follow-up Interval</label>
                <select className="w-full border border-gray-700 rounded-lg px-3 py-2 text-sm bg-gray-900 text-white">
                  <option>1 day</option>
                  <option>2 days</option>
                  <option>3 days</option>
                  <option>5 days</option>
                  <option>7 days</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Max Follow-ups</label>
                <input type="number" defaultValue="3" className="w-full border border-gray-700 rounded-lg px-3 py-2 text-sm bg-gray-900 text-white" />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-800 mb-4">Notification Settings</p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-sm text-gray-400">Email notifications for new leads</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-sm text-gray-400">Email notifications for responses</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-sm text-gray-400">Email notifications for meetings</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm text-gray-400">WhatsApp notifications for urgent responses</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-sm text-gray-400">Daily summary reports</span>
              </div>
            </div>
          </div>

          {/* Telephone AI Settings */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-800 mb-4">Telephone AI Settings</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Twilio Phone Number</label>
                <input type="tel" placeholder="+1 234 567 8900" className="w-full border border-gray-700 rounded-lg px-3 py-2 text-sm bg-gray-900 text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Twilio Account SID</label>
                <input type="text" placeholder="Enter Twilio Account SID" className="w-full border border-gray-700 rounded-lg px-3 py-2 text-sm bg-gray-900 text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Twilio Auth Token</label>
                <input type="password" placeholder="Enter Twilio Auth Token" className="w-full border border-gray-700 rounded-lg px-3 py-2 text-sm bg-gray-900 text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">OpenAI API Key</label>
                <input type="password" placeholder="Enter OpenAI API Key" className="w-full border border-gray-700 rounded-lg px-3 py-2 text-sm bg-gray-900 text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Voice Model</label>
                <select className="w-full border border-gray-700 rounded-lg px-3 py-2 text-sm bg-gray-900 text-white">
                  <option>GPT-4o</option>
                  <option>GPT-4</option>
                  <option>GPT-3.5 Turbo</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">TTS Voice</label>
                <select className="w-full border border-gray-700 rounded-lg px-3 py-2 text-sm bg-gray-900 text-white">
                  <option>Alloy</option>
                  <option>Echo</option>
                  <option>Fable</option>
                  <option>Onyx</option>
                  <option>Nova</option>
                  <option>Shimmer</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Telephone AI Enabled</label>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm text-gray-400">Enable AI phone reception</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">How it works:</p>
                <p className="text-xs text-gray-400">Phone call → Twilio receives → Whisper (voice to text) → GPT-4o generates response → TTS speaks response → Auto-booking if interested → Lead added to dashboard</p>
              </div>
            </div>
          </div>
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
