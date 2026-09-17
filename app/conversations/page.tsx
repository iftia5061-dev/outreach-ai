'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';

export default function ConversationsPage() {
  const [loading, setLoading] = useState(true);
  const [channelFilter, setChannelFilter] = useState('All');
  const [conversations, setConversations] = useState([
    { id: 1, name: "Capt. Marco Bellini", channel: "WhatsApp", lastMessage: "Yes, interested", time: "2m ago" },
    { id: 2, name: "James Whitfield", channel: "Email", lastMessage: "Send details", time: "15m ago" },
    { id: 3, name: "Sophie Laurent", channel: "LinkedIn", lastMessage: "Thanks", time: "1h ago" },
    { id: 4, name: "Eng. Nikos P.", channel: "WhatsApp", lastMessage: "Interested", time: "30m ago" },
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const filteredConversations = channelFilter === 'All' 
    ? conversations 
    : conversations.filter(c => c.channel === channelFilter);

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
