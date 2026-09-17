'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockCampaigns } from '@/lib/mockData';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Toast from '@/components/Toast';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    audience: '',
    channel: 'Email',
    message: '',
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleCreateCampaign = () => {
    if (!newCampaign.name.trim()) {
      setToast({ message: 'Campaign name is required', type: 'error' });
      return;
    }
    if (!newCampaign.audience.trim()) {
      setToast({ message: 'Target audience is required', type: 'error' });
      return;
    }
    if (!newCampaign.message.trim()) {
      setToast({ message: 'Message template is required', type: 'error' });
      return;
    }
    
    const campaign = {
      id: campaigns.length + 1,
      name: newCampaign.name,
      audience: newCampaign.audience,
      channel: newCampaign.channel,
      status: 'Active',
      sent: 0,
      open: 0,
      reply: 0,
      conversion: '0%',
    };
    setCampaigns([...campaigns, campaign]);
    setShowCreateForm(false);
    setNewCampaign({ name: '', audience: '', channel: 'Email', message: '' });
    setToast({ message: 'Campaign created successfully!', type: 'success' });
  };

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleToggleStatus = (id: number) => {
    setCampaigns(campaigns.map(c => 
      c.id === id 
        ? { ...c, status: c.status === 'Active' ? 'Paused' : 'Active' }
        : c
    ));
    setToast({ message: 'Campaign status updated', type: 'success' });
  };

  const handleDelete = (id: number) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
    setToast({ message: 'Campaign deleted', type: 'success' });
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

  const statusColor: Record<string, string> = {
    Active: "bg-gray-700 text-gray-300",
    Paused: "bg-gray-700 text-gray-300",
    Stopped: "bg-gray-700 text-gray-300",
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4"
      >
        ← Back
      </button>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-semibold text-white">Campaigns</h2>
        <Button variant="primary">+ Create Campaign</Button>
      </div>

        {/* Campaign Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Campaigns", value: "3" },
            { label: "Active Campaigns", value: "2" },
            { label: "Total Sent", value: "232" },
            { label: "Total Replies", value: "57" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">{s.label}</p>
              <p className="text-2xl font-semibold text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Campaign List */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800">
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Campaign Name</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Target Audience</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Channel</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Sent</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Open</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Reply</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Conversion</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b border-gray-700 last:border-0 hover:bg-gray-700">
                  <td className="px-4 py-3 text-white font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-gray-400">{c.audience}</td>
                  <td className="px-4 py-3 text-gray-400">{c.channel}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{c.sent}</td>
                  <td className="px-4 py-3 text-gray-400">{c.open}</td>
                  <td className="px-4 py-3 text-gray-400">{c.reply}</td>
                  <td className="px-4 py-3 text-gray-400">{c.conversion}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleToggleStatus(c.id)}
                        className="text-xs px-2 py-1 border border-gray-600 text-gray-300 rounded hover:bg-gray-700"
                      >
                        {c.status === "Active" ? "Pause" : "Resume"}
                      </button>
                      <button 
                        onClick={() => handleDelete(c.id)}
                        className="text-xs px-2 py-1 border border-gray-600 text-gray-300 rounded hover:bg-gray-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create Campaign Form */}
        <div className="mt-6 bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-sm font-medium text-white mb-4">Create New Campaign</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Campaign Name</label>
              <input 
                type="text" 
                placeholder="e.g. Email Campaign - France"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white placeholder-gray-500" 
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Target Audience</label>
              <input 
                type="text" 
                placeholder="e.g. Yacht owners in France"
                value={newCampaign.audience}
                onChange={(e) => setNewCampaign({...newCampaign, audience: e.target.value})}
                className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white placeholder-gray-500" 
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Channel</label>
              <select 
                value={newCampaign.channel}
                onChange={(e) => setNewCampaign({...newCampaign, channel: e.target.value})}
                className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white"
              >
                <option>Email</option>
                <option>WhatsApp</option>
                <option>LinkedIn</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Follow-up Sequence</label>
              <select className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white">
                <option>Single message</option>
                <option>2-message sequence</option>
                <option>3-message sequence</option>
                <option>Custom sequence</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="text-xs text-gray-400 mb-1 block">Message Template</label>
            <textarea 
              rows={4} 
              placeholder="Write your message template here..."
              value={newCampaign.message}
              onChange={(e) => setNewCampaign({...newCampaign, message: e.target.value})}
              className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white placeholder-gray-500 resize-none" 
            />
          </div>
          <div className="mt-4 flex gap-2">
            <Button 
              onClick={handleCreateCampaign}
              variant="primary"
            >
              Start Campaign
            </Button>
            <Button variant="outline">Save as Draft</Button>
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
