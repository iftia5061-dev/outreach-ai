'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import { getMeetings, createMeeting, updateMeeting, deleteMeeting, getProspects } from '@/lib/api';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Toast from '@/components/Toast';

export default function MeetingsPage() {
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [prospects, setProspects] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    prospect_id: '',
    name: '',
    company: '',
    date: '',
    time: '',
    duration: '15',
    notes: '',
    status: 'Upcoming',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meetingsData, prospectsData] = await Promise.all([
          getMeetings(),
          getProspects(),
        ]);
        if (meetingsData.error) {
          console.error('API error:', meetingsData.error);
          setMeetings([]);
        } else {
          setMeetings(Array.isArray(meetingsData) ? meetingsData : []);
        }
        if (prospectsData.error) {
          console.error('API error:', prospectsData.error);
          setProspects([]);
        } else {
          setProspects(Array.isArray(prospectsData) ? prospectsData : []);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setMeetings([]);
        setProspects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedProspect = prospects.find(p => p.id === parseInt(formData.prospect_id));
      const data = await createMeeting({
        name: formData.name || (selectedProspect?.name || ''),
        company: formData.company || (selectedProspect?.company || ''),
        date: formData.date,
        time: formData.time,
        duration: `${formData.duration} min`,
        status: formData.status,
        prospect_id: formData.prospect_id ? parseInt(formData.prospect_id) : null,
      });
      if (data.error) {
        setToast({ message: data.error, type: 'error' });
      } else {
        setToast({ message: 'Meeting created successfully', type: 'success' });
        setShowAddForm(false);
        setFormData({
          prospect_id: '',
          name: '',
          company: '',
          date: '',
          time: '',
          duration: '15',
          notes: '',
          status: 'Upcoming',
        });
        // Refresh meetings
        const meetingsData = await getMeetings();
        setMeetings(Array.isArray(meetingsData) ? meetingsData : []);
      }
    } catch (error: any) {
      console.error('Create meeting error:', error);
      setToast({ message: error.message || 'Failed to create meeting', type: 'error' });
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const data = await updateMeeting(id, { status: newStatus });
      if (data.error) {
        setToast({ message: data.error, type: 'error' });
      } else {
        setToast({ message: 'Meeting status updated', type: 'success' });
        setMeetings(meetings.map(m => m.id === id ? { ...m, status: newStatus } : m));
      }
    } catch (error: any) {
      console.error('Update meeting error:', error);
      setToast({ message: error.message || 'Failed to update meeting', type: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this meeting?')) return;
    try {
      const data = await deleteMeeting(id);
      if (data.error) {
        setToast({ message: data.error, type: 'error' });
      } else {
        setToast({ message: 'Meeting deleted successfully', type: 'success' });
        setMeetings(meetings.filter(m => m.id !== id));
      }
    } catch (error: any) {
      console.error('Delete meeting error:', error);
      setToast({ message: error.message || 'Failed to delete meeting', type: 'error' });
    }
  };

  const filteredMeetings = statusFilter === 'All'
    ? meetings
    : Array.isArray(meetings) ? meetings.filter(m => (m.status ?? '').toString() === statusFilter) : [];

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-semibold text-white">Scheduled Meetings</h2>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          + Add Meeting
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
          <h3 className="text-sm font-semibold text-white mb-4">Create New Meeting</h3>
          <form onSubmit={handleCreateMeeting} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Prospect</label>
                <select
                  value={formData.prospect_id}
                  onChange={(e) => {
                    const prospect = prospects.find(p => p.id === parseInt(e.target.value));
                    setFormData({
                      ...formData,
                      prospect_id: e.target.value,
                      name: prospect?.name || '',
                      company: prospect?.company || '',
                    });
                  }}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white"
                >
                  <option value="">Select prospect</option>
                  {Array.isArray(prospects) && prospects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {p.company}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white"
                  min="5"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white"
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="primary" size="sm">
                Create Meeting
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

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
              <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Duration</th>
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
                <td className="px-4 py-3 text-gray-400">{m.duration}</td>
                <td className="px-4 py-3">
                  <select
                    value={m.status}
                    onChange={(e) => handleStatusChange(m.id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded-full ${statusColor[m.status]} bg-transparent border-0 cursor-pointer`}
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(m.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {!Array.isArray(filteredMeetings) || filteredMeetings.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
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
