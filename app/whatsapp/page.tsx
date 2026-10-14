'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProspects, getWhatsAppMessages, sendWhatsAppMessage } from '@/lib/api';
import Button from '@/components/Button';
import Toast from '@/components/Toast';

export default function WhatsAppPage() {
  const router = useRouter();
  const [prospects, setProspects] = useState<any[]>([]);
  const [selectedProspect, setSelectedProspect] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isTemplateRequired, setIsTemplateRequired] = useState(false);

  useEffect(() => {
    const fetchProspects = async () => {
      try {
        const data = await getProspects();
        if (data.error) {
          console.error('API error:', data.error);
          setProspects([]);
        } else {
          // Filter prospects that have WhatsApp number
          const whatsappProspects = Array.isArray(data) ? data.filter((p: any) => p.whatsapp) : [];
          setProspects(whatsappProspects);
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
    setMessage('');
    setMessages([]);
    setIsTemplateRequired(false);

    // Load message history
    try {
      const data = await getWhatsAppMessages(prospect.id);
      if (data.error) {
        console.error('Failed to load messages:', data.error);
      } else {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedProspect || !message.trim()) {
      setToast({ message: 'Please select a prospect and enter a message', type: 'error' });
      return;
    }

    setSending(true);
    try {
      const to = selectedProspect.whatsapp?.replace(/\D/g, '');
      const result = await sendWhatsAppMessage({
        to,
        message: message,
        prospect_id: selectedProspect.id,
      });

      if (result.error) {
        if (result.error.includes('Consent')) {
          setToast({ message: 'WhatsApp consent has not been granted for this prospect. Enable it in Prospects.', type: 'error' });
        } else if (result.error.includes('Template')) {
          setToast({ message: 'Template message is required (outside 24-hour window)', type: 'error' });
        } else if (result.error.includes('number') || result.error.includes('WhatsApp')) {
          setToast({ message: 'Prospect does not have a valid WhatsApp number', type: 'error' });
        } else {
          setToast({ message: result.error, type: 'error' });
        }
      } else {
        setToast({ message: 'Message sent successfully!', type: 'success' });
        setMessage('');

        // Reload messages
        const messagesData = await getWhatsAppMessages(selectedProspect.id);
        if (!messagesData.error) {
          setMessages(messagesData.messages || []);
        }

        if (result.isTemplateRequired) {
          setToast({
            message: 'Template message was sent (outside 24-hour window)',
            type: 'info'
          });
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setToast({ message: 'Failed to send message', type: 'error' });
    } finally {
      setSending(false);
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
      <h2 className="text-base font-semibold text-white mb-6">WhatsApp</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Prospect Selection & Message */}
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
                  {prospect.name} ({prospect.whatsapp})
                </option>
              ))}
            </select>
          </div>

          {/* Message Input */}
          {selectedProspect && (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <label className="text-xs text-gray-400 mb-2 block">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
                className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white placeholder-gray-500 resize-none"
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {message.length} / 4096 characters
              </div>
              {isTemplateRequired && (
                <div className="text-xs text-yellow-400 mt-2">
                  ⚠️ Template message will be sent (outside 24-hour window)
                </div>
              )}
              <Button
                onClick={handleSendMessage}
                disabled={sending || !message.trim()}
                variant="primary"
                className="mt-4 w-full"
              >
                {sending ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          )}

          {!selectedProspect && (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center text-gray-400 text-sm">
              Select a prospect to start messaging
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
                  <p className="text-xs text-gray-400">{selectedProspect.whatsapp}</p>
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
                            : msg.status === 'failed'
                            ? 'bg-red-900 text-red-400'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        <p className="mb-1">{msg.message_body}</p>
                        <div className="flex items-center justify-between text-xs opacity-70">
                          <span>{new Date(msg.sent_at || msg.received_at).toLocaleString()}</span>
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
