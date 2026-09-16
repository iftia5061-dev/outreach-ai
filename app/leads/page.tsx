'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Toast from '@/components/Toast';

export default function LeadsPage() {
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [leads, setLeads] = useState([
    { id: 1, name: "James Whitfield", company: "Yacht Mgr", source: "AI Inbox", date: "Sep 15, 2026", value: "€50,000", status: "Talking", email: "james@yachtmgr.com", phone: "+30 987 654 3210" },
    { id: 2, name: "Capt. Marco Bellini", company: "MV Serenity", source: "Campaign", date: "Sep 14, 2026", value: "€75,000", status: "Qualified", email: "capt.marco@mvserenity.com", phone: "+39 123 456 7890" },
    { id: 3, name: "Sophie Laurent", company: "Shipyard Mgr", source: "LinkedIn", date: "Sep 13, 2026", value: "€100,000", status: "New", email: "sophie@shipyard.com", phone: "+356 555 123 4567" },
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusColor: Record<string, string> = {
    New: "bg-blue-900 text-blue-400",
    Talking: "bg-yellow-900 text-yellow-400",
    Qualified: "bg-green-900 text-green-400",
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

  return (
    <div className="p-6">
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
            {filteredLeads.map((lead) => (
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
