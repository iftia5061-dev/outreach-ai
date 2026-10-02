'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProspects, getLeads, getMeetings } from '@/lib/api';
import { mockConversations } from '@/lib/mockData';
import Toast from '@/components/Toast';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';

export default function DashboardPage() {
  const [recentConversations] = useState(mockConversations.slice(0, 5));
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    prospects: 0,
    leads: 0,
    meetings: 0,
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const [prospects, leads, meetings] = await Promise.all([
        getProspects(),
        getLeads(),
        getMeetings(),
      ]);
      setStats({
        prospects: prospects.length,
        leads: leads.length,
        meetings: meetings.length,
      });
      setLoading(false);
      setToast({ message: 'Dashboard loaded!', type: 'success' });
    };
    fetchStats();
  }, []);

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-semibold text-white">Dashboard</h2>
        <div className="flex gap-2">
          <Button variant="primary" onClick={async () => {
            try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/outreach/run`, { method: 'POST' });
              const data = await res.json();
              setToast({ message: data.message, type: 'success' });
            } catch (error) {
              setToast({ message: 'Outreach failed', type: 'error' });
            }
          }}>
            🚀 Run Auto Outreach
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/prospects'}>
            + Add prospect
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Prospects", value: stats.prospects, sub: "from database" },
          { label: "Qualified Leads", value: stats.leads, sub: "from database" },
          { label: "Meetings Scheduled", value: stats.meetings, sub: "from database" },
          { label: "Follow-ups Pending", value: 0, sub: "coming soon" },
        ].map((s) => (
          <div key={s.label} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-2xl font-semibold text-white">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
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

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-sm font-medium text-white mb-3">Campaign Performance</p>
          {[
            { name: "Email Campaign - Greece", sent: "143", open: "89", reply: "34", status: "Active" },
            { name: "WhatsApp Outreach - Malta", sent: "89", open: "67", reply: "23", status: "Active" },
            { name: "LinkedIn Pilot - Italy", sent: "—", open: "—", reply: "—", status: "Optional" },
          ].map((c) => (
            <div key={c.name} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
              <div className="flex-1">
                <p className="text-sm text-white">{c.name}</p>
                <p className="text-xs text-gray-400">Sent: {c.sent} | Open: {c.open} | Reply: {c.reply}</p>
              </div>
              <p className="text-xs text-gray-400">{c.status}</p>
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