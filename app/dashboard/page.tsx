'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockProspects, mockConversations, mockStats } from '@/lib/mockData';
import Toast from '@/components/Toast';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';

export default function DashboardPage() {
  const [stats, setStats] = useState(mockStats);
  const [recentConversations, setRecentConversations] = useState(mockConversations.slice(0, 5));
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      setToast({ message: 'Dashboard loaded successfully!', type: 'success' });
    }, 500);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <LoadingSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="p-6">

      {/* Top bar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-semibold text-white">Dashboard</h2>
        <Button variant="primary">+ Add prospect</Button>
      </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Prospects", value: stats.totalProspects, sub: "+12 this week" },
            { label: "New Leads", value: stats.newLeads, sub: "+8 today" },
            { label: "Contacted", value: stats.contacted, sub: "+15 this week" },
            { label: "Responded", value: stats.responded, sub: "+12 this week" },
            { label: "Interested", value: stats.interested, sub: "+5 this week" },
            { label: "Qualified Leads", value: stats.qualified, sub: "+3 this week" },
            { label: "Meetings Scheduled", value: stats.meetingsScheduled, sub: "+3 this week" },
            { label: "Follow-ups Pending", value: stats.followupsPending, sub: "-8 this week" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">{s.label}</p>
              <p className="text-2xl font-semibold text-white">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-2 gap-4">

          {/* Recent Conversations */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-sm font-medium text-white mb-3">Recent Conversations</p>
            {recentConversations.map((l) => (
              <div key={l.id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
                <div>
                  <p className="text-sm text-white">{l.name}</p>
                  <p className="text-xs text-gray-400">{l.company}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full font-medium bg-gray-700 text-gray-300">{l.status}</span>
              </div>
            ))}
          </div>

          {/* Campaign Performance */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-sm font-medium text-white mb-3">Campaign Performance</p>
            {[
              { name: "Email Campaign - Greece", sent: "143", open: "89", reply: "34", status: "Active", color: "text-gray-400" },
              { name: "WhatsApp Outreach - Malta", sent: "89", open: "67", reply: "23", status: "Active", color: "text-gray-400" },
              { name: "LinkedIn Pilot - Italy", sent: "—", open: "—", reply: "—", status: "Optional", color: "text-gray-500" },
            ].map((c) => (
              <div key={c.name} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
                <div className="flex-1">
                  <p className="text-sm text-white">{c.name}</p>
                  <p className="text-xs text-gray-400">Sent: {c.sent} | Open: {c.open} | Reply: {c.reply}</p>
                </div>
                <p className={`text-xs ${c.color}`}>{c.status}</p>
              </div>
            ))}
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