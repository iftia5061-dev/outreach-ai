'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProspects, getLeads, getMeetings, runAutoOutreach } from '@/lib/api';
import Toast from '@/components/Toast';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    prospects: 0,
    leads: 0,
    meetings: 0,
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prospects, leads, meetings] = await Promise.all([
          getProspects(),
          getLeads(),
          getMeetings(),
        ]);
        
        const prospectsData = prospects.error ? [] : (Array.isArray(prospects) ? prospects : []);
        const leadsData = leads.error ? [] : (Array.isArray(leads) ? leads : []);
        const meetingsData = meetings.error ? [] : (Array.isArray(meetings) ? meetings : []);
        
        setStats({
          prospects: prospectsData.length,
          leads: leadsData.length,
          meetings: meetingsData.length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setStats({
          prospects: 0,
          leads: 0,
          meetings: 0,
        });
      } finally {
        setLoading(false);
      }
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
              const data = await runAutoOutreach();
              if (data.error) {
                setToast({ message: data.error, type: 'error' });
              } else {
                setToast({ message: data.message, type: 'success' });
              }
            } catch (error) {
              setToast({ message: 'Outreach failed', type: 'error' });
            }
          }}>
            🚀 Run Auto Outreach
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/prospects'}>
            + Add Prospect
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

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
        <p className="text-sm font-medium text-white mb-3">Quick Actions</p>
        <div className="grid grid-cols-2 gap-2">
          <Link href="/prospects">
            <Button variant="outline" className="w-full">View Prospects</Button>
          </Link>
          <Link href="/campaigns">
            <Button variant="outline" className="w-full">View Campaigns</Button>
          </Link>
          <Link href="/leads">
            <Button variant="outline" className="w-full">View Leads</Button>
          </Link>
          <Link href="/meetings">
            <Button variant="outline" className="w-full">View Meetings</Button>
          </Link>
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