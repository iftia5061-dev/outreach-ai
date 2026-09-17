'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockProspects } from '@/lib/mockData';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Toast from '@/components/Toast';

export default function ProspectsPage() {
  const [prospects, setProspects] = useState(mockProspects);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [interestFilter, setInterestFilter] = useState('All Interest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const filteredProspects = prospects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || p.status === statusFilter;
    const matchesInterest = interestFilter === 'All Interest' || p.interest === interestFilter;
    return matchesSearch && matchesStatus && matchesInterest;
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleDelete = (id: number) => {
    setProspects(prospects.filter(p => p.id !== id));
    setToast({ message: 'Prospect deleted successfully', type: 'success' });
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setProspects(prospects.map(p => p.id === id ? { ...p, status: newStatus } : p));
    setToast({ message: 'Status updated successfully', type: 'success' });
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

  const statusColor: Record<string, string> = {
    New: "bg-gray-700 text-gray-300",
    Contacted: "bg-gray-700 text-gray-300",
    Responded: "bg-gray-700 text-gray-300",
    Interested: "bg-gray-700 text-gray-300",
    Qualified: "bg-gray-700 text-gray-300",
    "Meeting Scheduled": "bg-gray-700 text-gray-300",
    "Follow-up Required": "bg-gray-700 text-gray-300",
    "Not Interested": "bg-gray-700 text-gray-300",
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4"
      >
        ← Back
      </button>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-semibold text-white">Prospects</h2>
        <Button variant="primary">+ Add prospect</Button>
      </div>

        {/* Search and Filter */}
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Search prospects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-700 bg-gray-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white placeholder-gray-500"
          />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-700 bg-gray-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white"
          >
            <option>All Status</option>
            <option>New</option>
            <option>Contacted</option>
            <option>Responded</option>
            <option>Interested</option>
            <option>Qualified</option>
            <option>Meeting Scheduled</option>
            <option>Follow-up Required</option>
            <option>Not Interested</option>
          </select>
          <select 
            value={interestFilter}
            onChange={(e) => setInterestFilter(e.target.value)}
            className="border border-gray-700 bg-gray-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white"
          >
            <option>All Interest</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Very High</option>
          </select>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800">
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Name</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Position</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Company</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Yacht</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Email</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Phone</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Country</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Interest</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Last Contact</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Next Follow-up</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProspects.map((p) => (
                <tr key={p.id} className="border-b border-gray-700 last:border-0 hover:bg-gray-700 cursor-pointer">
                  <td className="px-4 py-3 text-white font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-gray-400">{p.position}</td>
                  <td className="px-4 py-3 text-gray-500">{p.company}</td>
                  <td className="px-4 py-3 text-gray-500">{p.yacht}</td>
                  <td className="px-4 py-3 text-gray-500">{p.email}</td>
                  <td className="px-4 py-3 text-gray-500">{p.phone}</td>
                  <td className="px-4 py-3 text-gray-500">{p.country}</td>
                  <td className="px-4 py-3">
                    <select 
                      value={p.status}
                      onChange={(e) => handleStatusChange(p.id, e.target.value)}
                      className="text-xs px-2 py-1 rounded-full font-medium bg-gray-700 text-gray-300 border-0 outline-none cursor-pointer"
                    >
                      <option>New</option>
                      <option>Contacted</option>
                      <option>Responded</option>
                      <option>Interested</option>
                      <option>Qualified</option>
                      <option>Meeting Scheduled</option>
                      <option>Follow-up Required</option>
                      <option>Not Interested</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.interest}</td>
                  <td className="px-4 py-3 text-gray-500">{p.lastContact}</td>
                  <td className="px-4 py-3 text-gray-500">{p.nextFollowup}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                      <button 
                        onClick={() => {
                          setProspects(prospects.filter(pr => pr.id !== p.id));
                          setToast({ message: `${p.name} converted to lead!`, type: 'success' });
                        }}
                        className="text-xs text-green-400 hover:text-green-300"
                      >
                        Convert to Lead
                      </button>
                    </div>
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
