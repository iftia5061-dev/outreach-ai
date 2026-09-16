'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Toast from '@/components/Toast';

export default function AISettingsPage() {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [aiConfig, setAiConfig] = useState({
    systemPrompt: "You are a helpful AI assistant for a yacht refit company. You help prospects understand our services and schedule meetings.",
    tone: "Professional",
    responseLength: "Medium",
    autoResponse: true,
    humanTakeover: false,
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleSave = () => {
    console.log('Saving AI config:', aiConfig);
    setToast({ message: 'AI settings saved!', type: 'success' });
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
      <h2 className="text-base font-semibold text-white mb-6">AI Agent Settings</h2>
      
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
        <p className="text-sm font-medium text-white mb-4">System Prompt</p>
        <textarea
          rows={6}
          value={aiConfig.systemPrompt}
          onChange={(e) => setAiConfig({...aiConfig, systemPrompt: e.target.value})}
          className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white resize-none"
        />
      </div>

      <div className="mt-6 bg-gray-800 border border-gray-700 rounded-xl p-4">
        <p className="text-sm font-medium text-white mb-4">Behavior Settings</p>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Tone</label>
            <select 
              value={aiConfig.tone}
              onChange={(e) => setAiConfig({...aiConfig, tone: e.target.value})}
              className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white"
            >
              <option>Professional</option>
              <option>Friendly</option>
              <option>Formal</option>
              <option>Casual</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Response Length</label>
            <select 
              value={aiConfig.responseLength}
              onChange={(e) => setAiConfig({...aiConfig, responseLength: e.target.value})}
              className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white"
            >
              <option>Short</option>
              <option>Medium</option>
              <option>Long</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={aiConfig.autoResponse}
              onChange={(e) => setAiConfig({...aiConfig, autoResponse: e.target.checked})}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-400">Auto-respond to new messages</span>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={aiConfig.humanTakeover}
              onChange={(e) => setAiConfig({...aiConfig, humanTakeover: e.target.checked})}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-400">Require human approval for meeting scheduling</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button 
          onClick={handleSave}
          variant="primary"
        >
          Save AI Settings
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
