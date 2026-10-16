'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCampaigns, createCampaign, updateCampaign, deleteCampaign } from '@/lib/api';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Toast from '@/components/Toast';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, sent: 0, reply: 0 });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    audience: '',
    channel: 'Email',
    subject: '',
    message: '',
    scheduledAt: '',
  });

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await getCampaigns();
        if (data.error) {
          console.error('API error:', data.error);
          setCampaigns([]);
        } else {
          setCampaigns(Array.isArray(data) ? data : []);
          // Calculate stats from campaigns data
          const campaignList = Array.isArray(data) ? data : [];
          setStats({
            total: campaignList.length,
            active: campaignList.filter((c: any) => c.status === 'Active').length,
            sent: campaignList.reduce((sum: number, c: any) => sum + (c.sent || 0), 0),
            reply: campaignList.reduce((sum: number, c: any) => sum + (c.reply || 0), 0),
          });
        }
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const handleCreateCampaign = async () => {
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
    if (!newCampaign.subject.trim() || !newCampaign.scheduledAt) {
      setToast({ message: 'Email subject and future scheduled time are required', type: 'error' });
      return;
    }

    const campaign = await createCampaign({
      name: newCampaign.name,
      audience: newCampaign.audience,
      channel: newCampaign.channel,
      subject: newCampaign.subject,
      message: newCampaign.message,
      scheduled_at: new Date(newCampaign.scheduledAt).toISOString(),
    });

    if (campaign.error) {
      setToast({ message: campaign.error, type: 'error' });
    } else {
      setCampaigns([...campaigns, campaign]);
      setShowCreateForm(false);
      setNewCampaign({ name: '', audience: '', channel: 'Email', subject: '', message: '', scheduledAt: '' });
      setToast({ message: 'Email campaign scheduled. It will only send to prospects with recorded email consent.', type: 'success' });
    }
  };

  const handleToggleStatus = async (id: number) => {
    const campaign = campaigns.find(c => c.id === id);
    if (!campaign) return;

    const newStatus = campaign.status === 'Active' ? 'Paused' : 'Active';
    const data = await updateCampaign(id, { status: newStatus });
    
    if (data.error) {
      setToast({ message: data.error, type: 'error' });
    } else {
      setCampaigns(campaigns.map(c => 
        c.id === id ? { ...c, status: newStatus } : c
      ));
      setToast({ message: 'Campaign status updated', type: 'success' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    
    const data = await deleteCampaign(id);
    
    if (data.error) {
      setToast({ message: data.error, type: 'error' });
    } else {
      setCampaigns(campaigns.filter(c => c.id !== id));
      setToast({ message: 'Campaign deleted', type: 'success' });
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
        <Button variant="primary" onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? 'Cancel' : '+ Create Campaign'}
        </Button>
      </div>

        {/* Campaign Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Campaigns", value: stats.total.toString() },
            { label: "Active Campaigns", value: stats.active.toString() },
            { label: "Total Sent", value: stats.sent.toString() },
            { label: "Total Replies", value: stats.reply.toString() },
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
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(campaigns) && campaigns.map((c) => (
                <tr key={c.id} className="border-b border-gray-700 last:border-0 hover:bg-gray-700">
                  <td className="px-4 py-3 text-white font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-gray-400">{c.audience}</td>
                  <td className="px-4 py-3 text-gray-400">{c.channel}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
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
              {!Array.isArray(campaigns) || campaigns.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    No campaigns found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Create Campaign Form */}
        {showCreateForm && <div className="mt-6 bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-sm font-medium text-white mb-4">Create New Campaign</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Campaign Name</label>
              <input 
                type="text" 
                placeholder="e.g. Email Campaign - Region"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white placeholder-gray-500" 
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Target Audience</label>
              <input 
                type="text" 
                placeholder="e.g. Business owners in region"
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
                <option disabled>WhatsApp (manual campaign only)</option>
                <option disabled>LinkedIn (assisted only)</option>
              </select>
            </div>
            <div><label className="text-xs text-gray-400 mb-1 block">Schedule (your local time)</label><input type="datetime-local" value={newCampaign.scheduledAt} onChange={(e) => setNewCampaign({...newCampaign, scheduledAt: e.target.value})} className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white" /></div>
          </div>
          <div className="mt-4"><label className="text-xs text-gray-400 mb-1 block">Email subject</label><input value={newCampaign.subject} onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})} placeholder="A short, relevant subject" className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white placeholder-gray-500" /></div>
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
              Schedule Email Campaign
            </Button>
            <Button variant="outline">Save as Draft</Button>
          </div>
        </div>}
      
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
