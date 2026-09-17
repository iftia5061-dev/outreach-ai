'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Toast from '@/components/Toast';

export default function LinkedInPage() {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [connections, setConnections] = useState([
    { id: 1, name: "Capt. Marco Bellini", position: "Captain at MV Serenity", status: "Connected" },
    { id: 2, name: "James Whitfield", position: "Yacht Manager", status: "Pending" },
    { id: 3, name: "Sophie Laurent", position: "Shipyard Manager", status: "Connected" },
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleToggleConnection = (id: number) => {
    setConnections(connections.map(c => 
      c.id === id 
        ? { ...c, status: c.status === 'Connected' ? 'Pending' : 'Connected' }
        : c
    ));
    setToast({ message: 'Connection status updated', type: 'success' });
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
      <h2 className="text-base font-semibold text-white mb-6">LinkedIn Connections</h2>
      
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
        <p className="text-sm font-medium text-white mb-4">LinkedIn Network</p>
        <div className="space-y-3">
          {connections.map((c) => (
            <div key={c.id} className="flex items-center gap-3 p-3 border border-gray-700 rounded-lg hover:bg-gray-700">
              <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white font-medium text-sm">
                LI
              </div>
              <div className="flex-1">
                <p className="text-sm text-white font-medium">{c.name}</p>
                <p className="text-xs text-gray-400">{c.position}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${c.status === 'Connected' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'}`}>
                  {c.status}
                </span>
              </div>
              <Button 
                onClick={() => handleToggleConnection(c.id)}
                variant="outline"
                size="sm"
              >
                {c.status === 'Connected' ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          ))}
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
