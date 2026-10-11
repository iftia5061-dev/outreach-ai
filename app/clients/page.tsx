'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Toast from '@/components/Toast';
import { getProspects } from '@/lib/api';

export default function ClientsPage() {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getProspects();
        if (data.error) {
          console.error('API error:', data.error);
          setClients([]);
        } else {
          // Filter prospects with status 'Qualified' (these are clients)
          const qualifiedProspects = Array.isArray(data) ? data.filter((p: any) => p.status === 'Qualified') : [];
          setClients(qualifiedProspects);
        }
      } catch (error) {
        console.error('Failed to fetch clients:', error);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-semibold text-white">Clients</h2>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-800">
              <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Name</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Company</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Email</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="border-b border-gray-700 last:border-0 hover:bg-gray-700">
                <td className="px-4 py-3 text-white font-medium">{c.name}</td>
                <td className="px-4 py-3 text-gray-400">{c.company}</td>
                <td className="px-4 py-3 text-gray-400">{c.email}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-green-600 text-white">
                    Qualified
                  </span>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  No clients yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
