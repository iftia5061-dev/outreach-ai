'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Toast from '@/components/Toast';

export default function ClientsPage() {
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [newClient, setNewClient] = useState({ name: '', status: 'Active' });
  const [clients, setClients] = useState([
    { id: 1, name: "Aegean Yacht Group", status: "Active", prospects: 45, leads: 28 },
    { id: 2, name: "Mediterranean Marine", status: "Active", prospects: 32, leads: 19 },
    { id: 3, name: "Atlantic Shipping", status: "Trial", prospects: 15, leads: 8 },
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleAddClient = () => {
    if (newClient.name.trim()) {
      setClients([...clients, { 
        id: clients.length + 1, 
        name: newClient.name, 
        status: newClient.status, 
        prospects: 0, 
        leads: 0 
      }]);
      setNewClient({ name: '', status: 'Active' });
      setShowAddForm(false);
      setToast({ message: 'Client added successfully!', type: 'success' });
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-semibold text-white">Client Management</h2>
        <Button 
          variant="primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add Client'}
        </Button>
      </div>
      
      {showAddForm && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-medium text-white mb-4">Add New Client</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Client Name</label>
              <input
                type="text"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white placeholder-gray-500"
                placeholder="Enter client name"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Status</label>
              <select
                value={newClient.status}
                onChange={(e) => setNewClient({ ...newClient, status: e.target.value })}
                className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white"
              >
                <option value="Active">Active</option>
                <option value="Trial">Trial</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <Button 
              variant="primary"
              onClick={handleAddClient}
            >
              Add Client
            </Button>
          </div>
        </div>
      )}
      
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-800">
              <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Client Name</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Prospects</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Leads</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="border-b border-gray-700 last:border-0 hover:bg-gray-700">
                <td className="px-4 py-3 text-white font-medium">{c.name}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    c.status === 'Active' ? 'bg-green-600 text-white' :
                    c.status === 'Trial' ? 'bg-yellow-600 text-white' :
                    'bg-gray-600 text-white'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">{c.prospects}</td>
                <td className="px-4 py-3 text-gray-400">{c.leads}</td>
                <td className="px-4 py-3">
                  <Button variant="outline" size="sm">View Details</Button>
                </td>
              </tr>
            ))}
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
