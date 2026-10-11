'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';

export default function ConversationsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

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
      <h2 className="text-base font-semibold text-white mb-6">Conversations</h2>

      {/* Coming Soon Banner */}
      <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 20 20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-400">Coming Soon</p>
            <p className="text-xs text-blue-300/70 mt-1">
              Unified conversation inbox is under development. This will aggregate conversations from Email, WhatsApp, and LinkedIn in one place.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
        <p className="text-sm text-gray-400">Unified conversations will be available soon.</p>
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
      <h2 className="text-base font-semibold text-white mb-6">All Conversations</h2>
      
      <div className="mb-4 flex gap-2">
        {['All', 'WhatsApp', 'Email', 'LinkedIn'].map((channel) => (
          <Button
            key={channel}
            variant={channelFilter === channel ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setChannelFilter(channel)}
          >
            {channel}
          </Button>
        ))}
      </div>
      
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-800">
              <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Name</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Channel</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Last Message</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredConversations.map((c) => (
              <tr key={c.id} className="border-b border-gray-700 last:border-0 hover:bg-gray-700">
                <td className="px-4 py-3 text-white font-medium">{c.name}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    c.channel === 'WhatsApp' ? 'bg-green-600 text-white' :
                    c.channel === 'Email' ? 'bg-blue-600 text-white' :
                    'bg-blue-700 text-white'
                  }`}>
                    {c.channel}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">{c.lastMessage}</td>
                <td className="px-4 py-3 text-gray-400">{c.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
