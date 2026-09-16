'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const chartData = [
    { name: 'Mon', contacted: 12, responded: 8, meetings: 1 },
    { name: 'Tue', contacted: 15, responded: 10, meetings: 2 },
    { name: 'Wed', contacted: 18, responded: 12, meetings: 1 },
    { name: 'Thu', contacted: 20, responded: 14, meetings: 3 },
    { name: 'Fri', contacted: 22, responded: 15, meetings: 2 },
    { name: 'Sat', contacted: 10, responded: 7, meetings: 0 },
    { name: 'Sun', contacted: 8, responded: 5, meetings: 0 },
  ];

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-semibold text-white">Analytics</h2>
        <div className="flex gap-2">
          {['7d', '30d', '90d'].map((range) => (
            <Button
              key={range}
              variant={dateRange === range ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setDateRange(range)}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6">
        <p className="text-sm font-medium text-white mb-4">Weekly Activity Overview</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Line type="monotone" dataKey="contacted" stroke="#3B82F6" strokeWidth={2} name="Contacted" />
            <Line type="monotone" dataKey="responded" stroke="#10B981" strokeWidth={2} name="Responded" />
            <Line type="monotone" dataKey="meetings" stroke="#F59E0B" strokeWidth={2} name="Meetings" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Prospects Contacted", value: "248", change: "+12 this week" },
          { label: "Response Rate", value: "67%", change: "+5% this week" },
          { label: "Interested Leads", value: "34", change: "+8 this week" },
          { label: "Qualified Leads", value: "28", change: "+3 this week" },
          { label: "Meetings Booked", value: "17", change: "+3 this week" },
          { label: "Follow-up Activity", value: "89", change: "+15 this week" },
          { label: "Conversion Rate", value: "24%", change: "+2% this week" },
          { label: "AI Response Time", value: "2m", change: "-30s this week" },
        ].map((s) => (
          <div key={s.label} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-2xl font-semibold text-white">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Campaign Performance */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-sm font-medium text-white mb-4">Campaign Performance</p>
          <div className="space-y-4">
            {[
              { name: "Email Campaign - Greece", sent: 143, open: 89, reply: 34, conversion: "24%" },
              { name: "WhatsApp Outreach - Malta", sent: 89, open: 67, reply: 23, conversion: "26%" },
              { name: "LinkedIn Pilot - Italy", sent: 0, open: 0, reply: 0, conversion: "0%" },
            ].map((c) => (
              <div key={c.name} className="border border-gray-700 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-white">{c.name}</p>
                  <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full">{c.conversion}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
                  <div>
                    <p className="text-gray-400">Sent</p>
                    <p className="text-white font-medium">{c.sent}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Open</p>
                    <p className="text-white font-medium">{c.open}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Reply</p>
                    <p className="text-white font-medium">{c.reply}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Follow-up Activity */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-sm font-medium text-white mb-4">Follow-up Activity</p>
          <div className="space-y-3">
            {[
              { type: "Email Follow-ups", count: 45, completed: 38, pending: 7 },
              { type: "WhatsApp Follow-ups", count: 32, completed: 28, pending: 4 },
              { type: "LinkedIn Follow-ups", count: 12, completed: 8, pending: 4 },
            ].map((f) => (
              <div key={f.type} className="border border-gray-700 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-white">{f.type}</p>
                  <p className="text-xs text-gray-400">{f.count} total</p>
                </div>
                <div className="flex gap-4 text-xs">
                  <span className="text-gray-400">Completed: {f.completed}</span>
                  <span className="text-gray-400">Pending: {f.pending}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Response Rate by Channel */}
      <div className="mt-6 bg-gray-800 border border-gray-700 rounded-xl p-4">
        <p className="text-sm font-medium text-white mb-4">Response Rate by Channel</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { channel: "Email", contacted: 143, responded: 89, rate: "62%" },
            { channel: "WhatsApp", contacted: 89, responded: 67, rate: "75%" },
            { channel: "LinkedIn", contacted: 12, responded: 8, rate: "67%" },
          ].map((c) => (
            <div key={c.channel} className="border border-gray-700 rounded-lg p-3">
              <p className="text-sm font-medium text-white mb-2">{c.channel}</p>
              <div className="space-y-1 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Contacted</span>
                  <span className="text-white">{c.contacted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Responded</span>
                  <span className="text-white">{c.responded}</span>
                </div>
                <div className="flex justify-between">
                  <span>Response Rate</span>
                  <span className="text-white font-medium">{c.rate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Quality Breakdown */}
      <div className="mt-6 bg-gray-800 border border-gray-700 rounded-xl p-4">
        <p className="text-sm font-medium text-white mb-4">Lead Quality Breakdown</p>
        <div className="grid grid-cols-4 gap-4">
          {[
            { status: "New", count: 45, percentage: "18%" },
            { status: "Contacted", count: 89, percentage: "36%" },
            { status: "Responded", count: 67, percentage: "27%" },
            { status: "Interested", count: 34, percentage: "14%" },
            { status: "Qualified", count: 28, percentage: "11%" },
            { status: "Meeting Scheduled", count: 17, percentage: "7%" },
            { status: "Follow-up Required", count: 42, percentage: "17%" },
            { status: "Not Interested", count: 12, percentage: "5%" },
          ].map((l) => (
            <div key={l.status} className="border border-gray-700 rounded-lg p-3">
              <p className="text-sm font-medium text-white mb-1">{l.status}</p>
              <div className="flex justify-between items-center">
                <p className="text-2xl font-semibold text-white">{l.count}</p>
                <span className="text-xs text-gray-400">{l.percentage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Time Period Comparison */}
      <div className="mt-6 bg-gray-800 border border-gray-700 rounded-xl p-4">
        <p className="text-sm font-medium text-white mb-4">This Week vs Last Week</p>
        <div className="grid grid-cols-4 gap-4">
          {[
            { metric: "Prospects Contacted", thisWeek: 12, lastWeek: 8, change: "+50%" },
            { metric: "Responses", thisWeek: 8, lastWeek: 5, change: "+60%" },
            { metric: "Meetings Booked", thisWeek: 3, lastWeek: 2, change: "+50%" },
            { metric: "Follow-ups", thisWeek: 15, lastWeek: 10, change: "+50%" },
          ].map((m) => (
            <div key={m.metric} className="border border-gray-700 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-2">{m.metric}</p>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">This Week</span>
                <span className="text-sm font-medium text-white">{m.thisWeek}</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">Last Week</span>
                <span className="text-sm text-gray-400">{m.lastWeek}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Change</span>
                <span className="text-xs font-medium text-white">{m.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
