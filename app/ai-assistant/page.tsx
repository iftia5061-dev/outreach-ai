'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Toast from '@/components/Toast';
export default function AIAssistantPage() {
  const [loading, setLoading] = useState(true);
  const [selectedProspect, setSelectedProspect] = useState<any>(null);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{sender: 'user' | 'ai', text: string, time: string}>>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [prospects] = useState([
    { id: 1, name: "Capt. Marco Bellini", company: "MV Serenity", yacht: "Serenity" },
    { id: 2, name: "James Whitfield", company: "Yacht Manager", yacht: "None" },
    { id: 3, name: "Sophie Laurent", company: "Shipyard Manager", yacht: "Azure" },
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleSendMessage = () => {
    if (question.trim() && selectedProspect) {
      const userMessage = { sender: 'user' as const, text: question, time: new Date().toLocaleTimeString() };
      setChatHistory([...chatHistory, userMessage]);
      
      setTimeout(() => {
        const aiResponse = { 
          sender: 'ai' as const, 
          text: `Based on ${selectedProspect.name}'s profile (${selectedProspect.company}, ${selectedProspect.yacht}): High interest level. Recent activity shows strong engagement. Recommended action: Schedule a call.`, 
          time: new Date().toLocaleTimeString() 
        };
        setChatHistory(prev => [...prev, aiResponse]);
      }, 1000);
      
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
          <p className="text-sm font-medium text-white mb-4">Select Prospect</p>
          <select
            value={selectedProspect?.id || ''}
            onChange={(e) => setSelectedProspect(prospects.find(p => p.id === parseInt(e.target.value)))}
            className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white"
          >
            <option value="">Select a prospect...</option>
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
              <p className="text-xs text-gray-400 text-center py-4">No messages yet. Ask AI about the selected prospect.</p>
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
              placeholder="Ask AI about this prospect..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={!selectedProspect}
              className="flex-1 border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white placeholder-gray-500 disabled:opacity-50"
            />
            <Button 
              onClick={handleSendMessage}
              variant="primary"
              disabled={!selectedProspect}
            >
              Send
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
