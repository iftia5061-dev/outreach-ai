'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Toast from '@/components/Toast';

type Message = {
  id: number;
  sender: 'prospect' | 'ai';
  text: string;
  time: string;
};

type Conversation = {
  id: number;
  name: string;
  phone: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  messages: Message[];
};

export default function WhatsAppPage() {
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([
    { 
      id: 1, 
      name: "Capt. Marco Bellini", 
      phone: "+39 123 456 7890", 
      lastMessage: "Yes, we are interested", 
      time: "2m ago", 
      unread: true,
      messages: [
        { id: 1, sender: "prospect", text: "Hello, I'm interested in yacht refit services", time: "10:00 AM" },
        { id: 2, sender: "ai", text: "Hello! We offer comprehensive yacht refit services. What type of refit are you looking for?", time: "10:01 AM" },
        { id: 3, sender: "prospect", text: "Yes, we are interested", time: "10:05 AM" },
      ]
    },
    { 
      id: 2, 
      name: "James Whitfield", 
      phone: "+30 987 654 3210", 
      lastMessage: "Can you send details?", 
      time: "15m ago", 
      unread: true,
      messages: [
        { id: 1, sender: "prospect", text: "Can you send more details about Malta services?", time: "9:30 AM" },
      ]
    },
    { 
      id: 3, 
      name: "Eng. Nikos P.", 
      phone: "+356 555 123 4567", 
      lastMessage: "Thank you", 
      time: "1h ago", 
      unread: false,
      messages: [
        { id: 1, sender: "ai", text: "Thank you for reaching out!", time: "8:00 AM" },
        { id: 2, sender: "prospect", text: "Thank you", time: "8:30 AM" },
      ]
    },
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const aiMessage: Message = {
        id: selectedConversation.messages.length + 1,
        sender: 'ai',
        text: newMessage,
        time: new Date().toLocaleTimeString()
      };

      const updatedConversations: Conversation[] = conversations.map(c =>
        c.id === selectedConversation.id
          ? {
              ...c,
              messages: [...c.messages, aiMessage],
              lastMessage: newMessage,
              time: 'Just now',
              unread: false
            }
          : c
      );

      setConversations(updatedConversations);
      setSelectedConversation(updatedConversations.find(c => c.id === selectedConversation.id) ?? null);
      setNewMessage('');
      setToast({ message: 'Message sent successfully', type: 'success' });
    }
  };

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

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
      <h2 className="text-base font-semibold text-white mb-6">WhatsApp Inbox</h2>
      
      {!selectedConversation ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white placeholder-gray-500"
            />
          </div>
          <p className="text-sm font-medium text-white mb-4">WhatsApp Conversations</p>
          <div className="space-y-3">
            {filteredConversations.map((c) => (
              <div 
                key={c.id} 
                onClick={() => setSelectedConversation(c)}
                className="flex items-center gap-3 p-3 border border-gray-700 rounded-lg hover:bg-gray-700 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-medium text-sm">
                  WA
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-sm text-white font-medium">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.time}</p>
                  </div>
                  <p className="text-xs text-gray-400">{c.phone}</p>
                  <p className="text-xs text-gray-400 truncate">{c.lastMessage}</p>
                </div>
                {c.unread && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <div>
              <button 
                onClick={() => setSelectedConversation(null)}
                className="text-xs text-gray-400 hover:text-white mb-1"
              >
                ← Back to conversations
              </button>
              <p className="text-sm font-medium text-white">{selectedConversation.name}</p>
              <p className="text-xs text-gray-400">{selectedConversation.phone}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${selectedConversation.unread ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
              {selectedConversation.unread ? 'Unread' : 'Read'}
            </span>
          </div>
          
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {selectedConversation.messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'ai' ? 'justify-end' : 'justify-start'}`}>
                <div className={`${msg.sender === 'ai' ? 'bg-gray-700' : 'bg-green-600'} text-white rounded-lg px-4 py-2 max-w-md`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'ai' ? 'text-gray-300' : 'text-green-200'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white placeholder-gray-500"
              />
              <Button 
                onClick={handleSendMessage}
                variant="primary"
              >
                Send
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
