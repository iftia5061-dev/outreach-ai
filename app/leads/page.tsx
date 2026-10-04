'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import { getLeads } from '@/lib/api';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Toast from '@/components/Toast';

export default function LeadsPage() {
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await getLeads();
        if (data.error) {
          console.error('API error:', data.error);
          setLeads([]);
        } else {
          setLeads(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Failed to fetch leads:', error);
        setLeads([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const filteredLeads = Array.isArray(leads) ? leads.filter(lead => {
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  }) : [];

  const statusColor: Record<string, string> = {
    New: "bg-blue-900 text-blue-400",
    Talking: "bg-yellow-900 text-yellow-400",
    Qualified: "bg-green-900 text-green-400",
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
      <h2 className="text-base font-semibold text-white mb-6">Qualified Leads</h2>
      
      <div className="mb-4 flex gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Search leads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-48 border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white placeholder-gray-500"
        />
        {['All', 'New', 'Talking', 'Qualified'].map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(status)}
          >
            {status}
          </Button>
        ))}
      </div>
      
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-800">
              <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Name</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Company</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Source</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredLeads) && filteredLeads.map((lead) => (
              <tr 
                key={lead.id} 
                onClick={() => setSelectedLead(lead)}
                className="border-b border-gray-700 last:border-0 hover:bg-gray-700 cursor-pointer"
              >
                <td className="px-4 py-3 text-white font-medium">{lead.name}</td>
                <td className="px-4 py-3 text-gray-400">{lead.company}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColor[lead.status]}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">{lead.source}</td>
                <td className="px-4 py-3 text-green-400 font-medium">{lead.value}</td>
              </tr>
            ))}
            {!Array.isArray(filteredLeads) || filteredLeads.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  No leads found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedLead(null)}>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-4">{selectedLead.name}</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-gray-400">Company</p>
                <p className="text-white">{selectedLead.company}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-white">{selectedLead.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-white">{selectedLead.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Status</p>
                <span className={`text-xs px-2 py-1 rounded-full ${statusColor[selectedLead.status]}`}>
                  {selectedLead.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-400">Source</p>
                <p className="text-white">{selectedLead.source}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Estimated Value</p>
                <p className="text-white">{selectedLead.value}</p>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button 
                variant="primary"
                onClick={() => {
                  setToast({ message: 'Action completed', type: 'success' });
                  setSelectedLead(null);
                }}
              >
                Close
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
