'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProspects, generateLinkedInDraft, getLinkedInMessages, markLinkedInAsSent, markLinkedInAsReplied } from '@/lib/api';
import Button from '@/components/Button';
import Toast from '@/components/Toast';

export default function LinkedInPage() {
  const router = useRouter();
  const [prospects, setProspects] = useState<any[]>([]);
  const [selectedProspect, setSelectedProspect] = useState<any>(null);
  const [messageType, setMessageType] = useState<'connection_note' | 'message'>('message');
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const fetchProspects = async () => {
      try {
        const data = await getProspects();
        if (data.error) {
          console.error('API error:', data.error);
          setProspects([]);
        } else {
          // Filter prospects that have LinkedIn URL
          const linkedinProspects = Array.isArray(data) ? data.filter((p: any) => p.linkedin) : [];
          setProspects(linkedinProspects);
        }
      } catch (error) {
        console.error('Failed to fetch prospects:', error);
        setProspects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProspects();
  }, []);

  const handleSelectProspect = async (prospect: any) => {
    setSelectedProspect(prospect);
    setDraft('');
    setMessages([]);

    // Load message history
    try {
      const data = await getLinkedInMessages(prospect.id);
      if (data.error) {
        console.error('Failed to load messages:', data.error);
      } else {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleGenerateDraft = async () => {
    if (!selectedProspect) {
      setToast({ message: 'Please select a prospect', type: 'error' });
      return;
    }

    setGenerating(true);
    try {
      const data = await generateLinkedInDraft({
        prospect_id: selectedProspect.id,
        message_type: messageType,
      });

      if (data.error) {
        if (data.error.includes('Consent')) {
          setToast({ message: 'LinkedIn consent has not been granted for this prospect. Enable it in Prospects.', type: 'error' });
        } else {
          setToast({ message: data.error, type: 'error' });
        }
      } else {
        setDraft(data.draft || '');
        setToast({ message: 'Draft generated successfully', type: 'success' });

        // Reload messages
        const messagesData = await getLinkedInMessages(selectedProspect.id);
        if (!messagesData.error) {
          setMessages(messagesData.messages || []);
        }
      }
    } catch (error) {
      console.error('Failed to generate draft:', error);
      setToast({ message: 'Failed to generate draft', type: 'error' });
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draft);
    setToast({ message: 'Copied to clipboard', type: 'success' });
  };

  const handleMarkAsSent = async (id: number) => {
    try {
      const data = await markLinkedInAsSent(id);
      if (data.error) {
        setToast({ message: data.error, type: 'error' });
      } else {
        setToast({ message: 'Marked as sent', type: 'success' });

        // Reload messages
        const messagesData = await getLinkedInMessages(selectedProspect.id);
        if (!messagesData.error) {
          setMessages(messagesData.messages || []);
        }
      }
    } catch (error) {
      console.error('Failed to mark as sent:', error);
      setToast({ message: 'Failed to mark as sent', type: 'error' });
    }
  };

  const handleMarkAsReplied = async (id: number) => {
    try {
      const data = await markLinkedInAsReplied(id);
      if (data.error) {
        setToast({ message: data.error, type: 'error' });
      } else {
        setToast({ message: 'Marked as replied', type: 'success' });

        // Reload messages
        const messagesData = await getLinkedInMessages(selectedProspect.id);
        if (!messagesData.error) {
          setMessages(messagesData.messages || []);
        }
      }
    } catch (error) {
      console.error('Failed to mark as replied:', error);
      setToast({ message: 'Failed to mark as replied', type: 'error' });
    }
  };

  const isValidLinkedInUrl = (url: string) => {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      const validHosts = ['linkedin.com', 'www.linkedin.com'];
      return parsed.protocol === 'https:' && validHosts.some(host => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`));
    } catch {
      return false;
    }
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
      <h2 className="text-base font-semibold text-white mb-6">LinkedIn</h2>

      {/* Assisted Mode Banner */}
      <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-blue-300 font-medium">Assisted mode</p>
            <p className="text-xs text-blue-400 mt-1">
              Drafts are generated here and sent by you on LinkedIn. Direct sending is not available yet.
            </p>
          </div>
        </div>
      </div>

      {/* API Connection Card */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-white">API connection</h3>
            <p className="text-xs text-gray-400 mt-1">Not connected</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span className="text-xs text-gray-400">Offline</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Prospect Selection & Draft */}
        <div className="lg:col-span-1 space-y-4">
          {/* Prospect Selection */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <label className="text-xs text-gray-400 mb-2 block">Select Prospect</label>
            <select
              value={selectedProspect?.id || ''}
              onChange={(e) => {
                const prospect = prospects.find((p: any) => p.id === parseInt(e.target.value));
                if (prospect) handleSelectProspect(prospect);
              }}
              className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white"
            >
              <option value="">Select a prospect...</option>
              {prospects.map((prospect: any) => (
                <option key={prospect.id} value={prospect.id}>
                  {prospect.name}
                </option>
              ))}
            </select>
          </div>

          {/* Message Type */}
          {selectedProspect && (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <label className="text-xs text-gray-400 mb-2 block">Message Type</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setMessageType('connection_note')}
                  className={`flex-1 px-3 py-2 text-xs rounded-lg ${
                    messageType === 'connection_note'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  Connection Note
                </button>
                <button
                  onClick={() => setMessageType('message')}
                  className={`flex-1 px-3 py-2 text-xs rounded-lg ${
                    messageType === 'message'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  Message
                </button>
              </div>
            </div>
          )}

          {/* Draft Generation */}
          {selectedProspect && (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <Button
                onClick={handleGenerateDraft}
                disabled={generating}
                variant="primary"
                className="w-full"
              >
                {generating ? 'Generating...' : 'Generate draft'}
              </Button>
            </div>
          )}

          {/* Draft Editor */}
          {draft && (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <label className="text-xs text-gray-400 mb-2 block">Draft</label>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={6}
                className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white placeholder-gray-500 resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-gray-500">
                  {draft.length} / {messageType === 'connection_note' ? 200 : 3000} characters
                </div>
                <Button
                  onClick={handleCopy}
                  variant="secondary"
                  className="text-xs"
                >
                  Copy
                </Button>
              </div>
              {isValidLinkedInUrl(selectedProspect.linkedin) && (
                <a
                  href={selectedProspect.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-3 text-center text-xs text-blue-400 hover:text-blue-300"
                >
                  Open LinkedIn profile →
                </a>
              )}
            </div>
          )}

          {!selectedProspect && (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center text-gray-400 text-sm">
              Select a prospect to start
            </div>
          )}
        </div>

        {/* Right Panel: Message History */}
        <div className="lg:col-span-2">
          {selectedProspect ? (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 h-[600px] flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
                <div>
                  <h3 className="text-sm font-medium text-white">{selectedProspect.name}</h3>
                  <p className="text-xs text-gray-400">{selectedProspect.company || ''}</p>
                </div>
                <span className="text-xs text-gray-500">{messages.length} messages</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm py-8">
                    No messages yet
                  </div>
                ) : (
                  messages.map((msg: any) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.direction === 'sent' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 text-sm ${
                          msg.direction === 'sent'
                            ? 'bg-blue-600 text-white'
                            : msg.status === 'replied'
                            ? 'bg-green-900 text-green-400'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        <p className="mb-1">{msg.message_body}</p>
                        <div className="flex items-center justify-between text-xs opacity-70">
                          <span>{new Date(msg.message_time || msg.created_at).toLocaleString()}</span>
                          <span className={`capitalize ${msg.status === 'drafted' ? 'text-yellow-400' : ''}`}>{msg.status}</span>
                        </div>
                        {msg.status === 'drafted' && (
                          <div className="flex gap-2 mt-2">
                            <Button
                              onClick={() => handleMarkAsSent(msg.id)}
                              variant="primary"
                              className="text-xs"
                            >
                              Mark as sent
                            </Button>
                          </div>
                        )}
                        {msg.status === 'sent' && (
                          <div className="flex gap-2 mt-2">
                            <Button
                              onClick={() => handleMarkAsReplied(msg.id)}
                              variant="secondary"
                              className="text-xs"
                            >
                              Mark as replied
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
              <p className="text-sm text-gray-400">Select a prospect to view message history</p>
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
