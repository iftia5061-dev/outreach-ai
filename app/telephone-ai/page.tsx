'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Toast from '@/components/Toast';
import { mockCalls } from '@/lib/mockData';

const calls = mockCalls;

const statusColor: Record<string, string> = {
  Interested: "bg-green-900 text-green-400",
  Qualified: "bg-blue-900 text-blue-400",
  "Not Interested": "bg-red-900 text-red-400",
  Talking: "bg-yellow-900 text-yellow-400",
};

export default function TelephoneAIPage() {
  const [callHistory, setCallHistory] = useState(calls);
  const [loading, setLoading] = useState(true);
  const [aiConfig, setAiConfig] = useState({
    phoneNumber: '',
    accountSid: '',
    authToken: '',
    apiKey: '',
    voiceModel: 'GPT-4o',
    ttsVoice: 'Alloy',
    enabled: false,
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleSaveConfig = () => {
    console.log('Saving AI config:', aiConfig);
    setToast({ message: 'Configuration saved!', type: 'success' });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-base font-semibold text-white mb-6">Telephone AI</h2>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-sm font-medium text-white mb-4">AI Configuration</p>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Twilio Phone Number</label>
              <input
                type="tel"
                placeholder="+1 234 567 8900"
                value={aiConfig.phoneNumber}
                onChange={(e) => setAiConfig({...aiConfig, phoneNumber: e.target.value})}
                className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Twilio Account SID</label>
              <input
                type="text"
                placeholder="Enter Twilio Account SID"
                value={aiConfig.accountSid}
                onChange={(e) => setAiConfig({...aiConfig, accountSid: e.target.value})}
                className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Twilio Auth Token</label>
              <input
                type="password"
                placeholder="Enter Twilio Auth Token"
                value={aiConfig.authToken}
                onChange={(e) => setAiConfig({...aiConfig, authToken: e.target.value})}
                className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">OpenAI API Key</label>
              <input
                type="password"
                placeholder="Enter OpenAI API Key"
                value={aiConfig.apiKey}
                onChange={(e) => setAiConfig({...aiConfig, apiKey: e.target.value})}
                className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Voice Model</label>
              <select
                value={aiConfig.voiceModel}
                onChange={(e) => setAiConfig({...aiConfig, voiceModel: e.target.value})}
                className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm text-white outline-none"
              >
                <option>GPT-4o</option>
                <option>GPT-4</option>
                <option>GPT-3.5 Turbo</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">TTS Voice</label>
              <select
                value={aiConfig.ttsVoice}
                onChange={(e) => setAiConfig({...aiConfig, ttsVoice: e.target.value})}
                className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm text-white outline-none"
              >
                <option>Alloy</option>
                <option>Echo</option>
                <option>Fable</option>
                <option>Onyx</option>
                <option>Nova</option>
                <option>Shimmer</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={aiConfig.enabled}
                onChange={(e) => setAiConfig({...aiConfig, enabled: e.target.checked})}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-400">Enable AI phone reception</span>
            </div>
            <Button
              onClick={handleSaveConfig}
              variant="primary"
              className="w-full"
            >
              Save Configuration
            </Button>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-sm font-medium text-white mb-4">Recent Call Activity</p>
          <div className="space-y-2">
            {callHistory.map((c) => (
              <div key={c.id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
                <div>
                  <p className="text-sm text-white">{c.caller}</p>
                  <p className="text-xs text-gray-400">{c.phone} · {c.duration}</p>
                  <p className="text-xs text-gray-500">{c.result}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[c.status]}`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
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