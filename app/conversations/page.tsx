'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getConversations, getConversationById } from '@/lib/api';
import Button from '@/components/Button';
import Toast from '@/components/Toast';

export default function ConversationsPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState<'all' | 'email' | 'whatsapp' | 'linkedin'>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations();
        if (data.error) {
          console.error('API error:', data.error);
          setConversations([]);
        } else {
          setConversations(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  const handleSelectConversation = async (conversation: any) => {
    setSelectedConversation(conversation);
    setMessages([]);
    setLoadingMessages(true);

    try {
      const data = await getConversationById(conversation.prospect_id);
      if (data.error) {
        console.error('Failed to load messages:', data.error);
        setToast({ message: 'Failed to load messages', type: 'error' });
      } else {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      setToast({ message: 'Failed to load messages', type: 'error' });
    } finally {
      setLoadingMessages(false);
    }
  };

  // Filter conversations based on search and channel
  const filteredConversations = conversations.filter((conv: any) => {
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = (conv.name || '').toLowerCase().includes(searchLower);
    const emailMatch = (conv.email || '').toLowerCase().includes(searchLower);
    const companyMatch = (conv.company || '').toLowerCase().includes(searchLower);
    const messageMatch = (conv.last_message_preview || '').toLowerCase().includes(searchLower);

    const matchesSearch = nameMatch || emailMatch || companyMatch || messageMatch;
    const matchesChannel = channelFilter === 'all' || conv.last_channel === channelFilter;

    return matchesSearch && matchesChannel;
  });

  const formatTime = (time: string) => {
    if (!time) return '';
    const date = new Date(time);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getChannelIcon = (channel: string) => {
    if (channel === 'email') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    }
    if (channel === 'whatsapp') {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      );
    }
    if (channel === 'linkedin') {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 p-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            <div className="h-8 bg-gray-700 rounded w-1/2"></div>
            <div className="h-8 bg-gray-700 rounded w-3/4"></div>
          </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Conversation List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white placeholder-gray-500"
            />
          </div>

          {/* Channel Filter */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setChannelFilter('all')}
                className={`px-3 py-2 text-xs rounded-lg ${
                  channelFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setChannelFilter('email')}
                className={`px-3 py-2 text-xs rounded-lg ${
                  channelFilter === 'email'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                Email
              </button>
              <button
                onClick={() => setChannelFilter('whatsapp')}
                className={`px-3 py-2 text-xs rounded-lg ${
                  channelFilter === 'whatsapp'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                WhatsApp
              </button>
              <button
                onClick={() => setChannelFilter('linkedin')}
                className={`px-3 py-2 text-xs rounded-lg ${
                  channelFilter === 'linkedin'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                LinkedIn
              </button>
            </div>
          </div>

          {/* Conversation List */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 max-h-[600px] overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-8">
                {searchQuery || channelFilter !== 'all'
                  ? 'No conversations match your filters'
                  : 'No conversations yet'}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredConversations.map((conv: any) => (
                  <div
                    key={conv.prospect_id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation?.prospect_id === conv.prospect_id
                        ? 'bg-blue-600'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium">{conv.name}</span>
                        <div className="text-gray-400 flex items-center gap-1">
                          {getChannelIcon(conv.last_channel)}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{formatTime(conv.last_message_time)}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate mb-1">
                      {conv.last_message_preview || 'No message'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{conv.company || ''}</span>
                      <span className="text-xs text-gray-500">{conv.total_messages} messages</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Message History */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 h-[600px] flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
                <div>
                  <h3 className="text-sm font-medium text-white">{selectedConversation.name}</h3>
                  <p className="text-xs text-gray-400">
                    {selectedConversation.email && <span>{selectedConversation.email}</span>}
                    {selectedConversation.email && selectedConversation.whatsapp && <span> • </span>}
                    {selectedConversation.whatsapp && <span>{selectedConversation.whatsapp}</span>}
                  </p>
                </div>
                <span className="text-xs text-gray-500">{messages.length} messages</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3">
                {loadingMessages ? (
                  <div className="text-center text-gray-400 text-sm py-8">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm py-8">
                    No messages yet
                  </div>
                ) : (
                  messages.map((msg: any) => (
                    <div
                      key={`${msg.channel}-${msg.id}`}
                      className={`flex ${
                        msg.direction === 'sent' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 text-sm ${
                          msg.direction === 'sent'
                            ? 'bg-blue-600 text-white'
                            : msg.status === 'failed'
                            ? 'bg-red-900 text-red-400'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {getChannelIcon(msg.channel)}
                          <span className="text-xs opacity-70 capitalize">{msg.channel}</span>
                        </div>
                        <p className="mb-1">{msg.message_body}</p>
                        <div className="flex items-center justify-between text-xs opacity-70">
                          <span>{formatTime(msg.message_time)}</span>
                          <span className="capitalize">{msg.status}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
              <p className="text-sm text-gray-400">Select a conversation to view message history</p>
            </div>
          )}
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
