'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import { getMeetings } from '@/lib/api';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Toast from '@/components/Toast';

export default function MeetingsPage() {
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [meetings, setMeetings] = useState<any[]>([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const data = await getMeetings();
        if (data.error) {
          console.error('API error:', data.error);
          setMeetings([]);
        } else {
          setMeetings(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Failed to fetch meetings:', error);
        setMeetings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  const handleReschedule = (id: number) => {
    setToast({ message: 'Meeting rescheduled!', type: 'success' });
  };

  const handleCancel = (id: number) => {
    setMeetings(Array.isArray(meetings) ? meetings.map(m => m.id === id ? { ...m, status: 'Cancelled' } : m) : []);
    setToast({ message: 'Meeting cancelled', type: 'info' });
  };

  const filteredMeetings = statusFilter === 'All' 
    ? meetings 
    : Array.isArray(meetings) ? meetings.filter(m => m.status === statusFilter) : [];

  const statusColor: Record<string, string> = {
    Upcoming: "bg-blue-600 text-white",
    Completed: "bg-green-600 text-white",
    Cancelled: "bg-red-600 text-white",
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
      <h2 className="text-base font-semibold text-white mb-6">Scheduled Meetings</h2>
      
      <div className="mb-4 flex gap-2 flex-wrap">
        {['All', 'Upcoming', 'Completed', 'Cancelled'].map((status) => (
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
              <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Date</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Time</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredMeetings) && filteredMeetings.map((m) => (
              <tr key={m.id} className="border-b border-gray-700 last:border-0 hover:bg-gray-700">
                <td className="px-4 py-3 text-white font-medium">{m.name}</td>
                <td className="px-4 py-3 text-gray-400">{m.company}</td>
                <td className="px-4 py-3 text-gray-400">{m.date}</td>
                <td className="px-4 py-3 text-gray-400">{m.time}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColor[m.status]}`}>
                    {m.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {m.status === 'Upcoming' && (
                      <>
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handleReschedule(m.id)}
                        >
                          Reschedule
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancel(m.id)}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!Array.isArray(filteredMeetings) || filteredMeetings.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No meetings found
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
