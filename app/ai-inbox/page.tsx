'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockConversations } from '@/lib/mockData';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Toast from '@/components/Toast';

export default function AIInboxPage() {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const updatedConversations = conversations.map(c =>
        c.id === selectedConversation.id
          ? {
              ...c,
              messages: [
                ...c.messages,
                { id: c.messages.length + 1, sender: 'ai', text: newMessage, time: new Date().toLocaleTimeString() }
              ],
              lastMessage: newMessage,
              time: 'Just now'
            }
          : c
      );
      setConversations(updatedConversations);
      setSelectedConversation(updatedConversations.find(c => c.id === selectedConversation.id)!);
      setNewMessage('');
      setToast({ message: 'Message sent successfully', type: 'success' });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    New: "bg-gray-700 text-gray-300",
    Talking: "bg-gray-700 text-gray-300",
    Qualified: "bg-gray-700 text-gray-300",
  };

  return (
    <div className="flex">

      {/* Left Panel - Conversation List */}
      <div className="w-80 border-r border-gray-700 bg-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white placeholder-gray-500"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((c) => (
              <div 
                key={c.id} 
                onClick={() => setSelectedConversation(c)}
                className={`flex items-center gap-3 px-4 py-3 border-b border-gray-700 hover:bg-gray-700 cursor-pointer ${selectedConversation.id === c.id ? 'bg-gray-700' : ''}`}
              >
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 font-medium text-sm flex-shrink-0">
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className={`text-sm font-medium ${c.unread ? "text-white" : "text-gray-400"}`}>{c.name}</p>
                    <p className="text-xs text-gray-400">{c.time}</p>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{c.lastMessage}</p>
                </div>
                {c.unread && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Conversation View */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-700 bg-gray-800 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-white">{selectedConversation.name}</h3>
              <p className="text-xs text-gray-400">{selectedConversation.company}</p>
            </div>
            <div className="flex gap-2">
              <button className="text-xs px-3 py-1 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700">Mark as Interested</button>
              <button className="text-xs px-3 py-1 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700">Mark as Qualified</button>
              <button className="text-xs px-3 py-1 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700">Schedule Meeting</button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-800">
            <div className="space-y-4">
              {selectedConversation.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'ai' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`${msg.sender === 'ai' ? 'bg-gray-700' : 'bg-blue-600'} text-white rounded-lg px-4 py-2 max-w-md`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'ai' ? 'text-gray-300' : 'text-blue-200'}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Suggestion */}
          <div className="p-4 border-t border-gray-700 bg-gray-800">
            <div className="mb-3">
              <p className="text-xs text-gray-400 mb-2">AI Suggested Response:</p>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                <p className="text-sm text-gray-300">Excellent! I'd love to schedule a 15-minute call to discuss your specific requirements. Would tomorrow at 10 AM work for you?</p>
              </div>
            </div>
            <div className="flex gap-2 mb-2">
              <Button 
                variant="primary"
                size="sm"
                onClick={() => {
                  setNewMessage("Excellent! I'd love to schedule a 15-minute call to discuss your specific requirements. Would tomorrow at 10 AM work for you?");
                  handleSendMessage();
                }}
              >
                Approve & Send
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => {
                  setNewMessage("Excellent! I'd love to schedule a 15-minute call to discuss your specific requirements. Would tomorrow at 10 AM work for you?");
                }}
              >
                Edit
              </Button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 border border-gray-600 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-500 text-white placeholder-gray-500"
              />
              <Button 
                onClick={handleSendMessage}
                variant="primary"
              >
                Send
              </Button>
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
      </div>
  );
}