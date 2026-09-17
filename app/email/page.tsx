'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Toast from '@/components/Toast';

// Message অবজেক্টের টাইপ ডিফাইন করা হলো
interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
}

export default function EmailPage() {
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [emails, setEmails] = useState([
    { 
      id: 1, 
      from: "capt.marco@mvserenity.com", 
      subject: "Refit inquiry", 
      date: "Sep 16, 2026", 
      status: "Unread",
      body: "Hello, I'm interested in yacht refit services for MV Serenity. Can you provide more details about your offerings?",
      messages: [
        { id: 1, sender: "prospect", text: "Hello, I'm interested in yacht refit services for MV Serenity.", time: "Sep 16, 2026" },
      ]
    },
    { 
      id: 2, 
      from: "james@yachtmgr.com", 
      subject: "Follow-up on Malta services", 
      date: "Sep 15, 2026", 
      status: "Read",
      body: "Following up on our previous conversation about Malta shipyard services.",
      messages: [
        { id: 1, sender: "prospect", text: "Following up on Malta services", time: "Sep 15, 2026" },
      ]
    },
    { 
      id: 3, 
      from: "nikos@syazure.com", 
      subject: "Maintenance request", 
      date: "Sep 14, 2026", 
      status: "Replied",
      body: "Requesting maintenance for SY Azure.",
      messages: [
        { id: 1, sender: "prospect", text: "Maintenance request", time: "Sep 14, 2026" },
        { id: 2, sender: "ai", text: "Thank you for your inquiry. We'll be in touch shortly.", time: "Sep 14, 2026" },
      ]
    },
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleReply = () => {
    if (newMessage.trim() && selectedEmail) {
      const updatedEmails = emails.map(e =>
        e.id === selectedEmail.id
          ? {
              ...e,
              messages: [
                ...e.messages,
                { id: e.messages.length + 1, sender: 'ai', text: newMessage, time: new Date().toLocaleDateString() }
              ],
              status: 'Replied'
            }
          : e
      );
      setEmails(updatedEmails);
      setSelectedEmail(updatedEmails.find(e => e.id === selectedEmail.id)!);
      setNewMessage('');
      setToast({ message: 'Reply sent successfully', type: 'success' });
    }
  };

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
      <h2 className="text-base font-semibold text-white mb-6">Email Inbox</h2>
      
      {!selectedEmail ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-sm font-medium text-white mb-4">Email Conversations</p>
          <div className="space-y-3">
            {emails.map((e) => (
              <div 
                key={e.id} 
                onClick={() => setSelectedEmail(e)}
                className="flex items-center gap-3 p-3 border border-gray-700 rounded-lg hover:bg-gray-700 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm">
                  EM
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-sm text-white font-medium">{e.from}</p>
                    <p className="text-xs text-gray-400">{e.date}</p>
                  </div>
                  <p className="text-xs text-gray-400">{e.subject}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${e.status === 'Unread' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                    {e.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <div>
              <button 
                onClick={() => setSelectedEmail(null)}
                className="text-xs text-gray-400 hover:text-white mb-1"
              >
                ← Back to inbox
              </button>
              <p className="text-sm font-medium text-white">{selectedEmail.from}</p>
              <p className="text-xs text-gray-400">{selectedEmail.subject}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${selectedEmail.status === 'Unread' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
              {selectedEmail.status}
            </span>
          </div>
          
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {selectedEmail.messages.map((msg: Message) => (
              <div key={msg.id} className={`flex ${msg.sender === 'ai' ? 'justify-end' : 'justify-start'}`}>
                <div className={`${msg.sender === 'ai' ? 'bg-gray-700' : 'bg-blue-600'} text-white rounded-lg px-4 py-2 max-w-md`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'ai' ? 'text-gray-300' : 'text-blue-200'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your reply..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleReply()}
                className="flex-1 border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white placeholder-gray-500"
              />
              <Button 
                onClick={handleReply}
                variant="primary"
              >
                Send Reply
              </Button>
            </div>
          </div>
        </div>
      )}
      
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