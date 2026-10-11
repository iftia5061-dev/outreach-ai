'use client';

import { useState, useEffect } from 'react';
import { getProspects } from '@/lib/api';
import { aiChat } from '@/lib/api';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Toast from '@/components/Toast';

export default function AIAssistantPage() {
  const [loading, setLoading] = useState(true);
  const [selectedProspect, setSelectedProspect] = useState<any>(null);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{sender: 'user' | 'ai', text: string, time: string}>>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [prospects, setProspects] = useState<any[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchProspects = async () => {
      try {
        const data = await getProspects();
        if (data.error) {
          console.error('API error:', data.error);
          setToast({ message: data.error, type: 'error' });
          setProspects([]);
        } else {
          setProspects(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Failed to fetch prospects:', error);
        setToast({ message: 'Failed to load prospects', type: 'error' });
        setProspects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProspects();
  }, []);

  const handleSendMessage = async () => {
    if (!question.trim()) return;

    const userMessage = { sender: 'user' as const, text: question, time: new Date().toLocaleTimeString() };
    setChatHistory([...chatHistory, userMessage]);
    setSending(true);

    try {
      // Get company info from localStorage or use empty string
      const companyInfo = localStorage.getItem('companyInfo') || '';

      const response = await aiChat(question, selectedProspect || undefined, companyInfo);

      if (response.error) {
        setToast({ message: response.error, type: 'error' });
        const errorMessage = { sender: 'ai' as const, text: response.error, time: new Date().toLocaleTimeString() };
        setChatHistory(prev => [...prev, errorMessage]);
      } else {
        const aiResponse = { sender: 'ai' as const, text: response.response, time: new Date().toLocaleTimeString() };
        setChatHistory(prev => [...prev, aiResponse]);
      }
    } catch (error: any) {
      console.error('AI chat error:', error);
      const errorMsg = error.message || 'Failed to get AI response';
      setToast({ message: errorMsg, type: 'error' });
      const errorMessage = { sender: 'ai' as const, text: errorMsg, time: new Date().toLocaleTimeString() };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setSending(false);
      setQuestion('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 p-6">
        <button
  onClick={() => window.history.back()}
  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4"
>
  ← Back
</button>
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
      <h2 className="text-base font-semibold text-white mb-6">AI Assistant</h2>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-sm font-medium text-white mb-4">Select Prospect (Optional)</p>
          <select
            value={selectedProspect?.id || ''}
            onChange={(e) => setSelectedProspect(prospects.find(p => p.id === parseInt(e.target.value)) || null)}
            className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white"
          >
            <option value="">None (General Chat)</option>
            {prospects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {selectedProspect && (
            <div className="mt-4 p-3 bg-gray-900 border border-gray-700 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Selected: {selectedProspect.name}</p>
              <p className="text-xs text-gray-400">{selectedProspect.company} · {selectedProspect.yacht}</p>
            </div>
          )}
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-sm font-medium text-white mb-4">Chat with AI</p>
          <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
            {chatHistory.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No messages yet. Ask AI anything or select a prospect for context.</p>
            ) : (
              chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`${msg.sender === 'ai' ? 'bg-gray-700' : 'bg-blue-600'} text-white rounded-lg px-3 py-2 max-w-md`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'ai' ? 'text-gray-300' : 'text-blue-200'}`}>{msg.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask AI anything..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !sending && handleSendMessage()}
              disabled={sending}
              className="flex-1 border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white placeholder-gray-500 disabled:opacity-50"
            />
            <Button
              onClick={handleSendMessage}
              variant="primary"
              disabled={sending || !question.trim()}
            >
              {sending ? 'Sending...' : 'Send'}
            </Button>
          </div>
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
