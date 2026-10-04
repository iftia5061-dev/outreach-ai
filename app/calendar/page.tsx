'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMeetings, deleteMeeting } from '@/lib/api';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Toast from '@/components/Toast';

export default function CalendarPage() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

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

  const handleDeleteMeeting = async (id: number) => {
    try {
      const data = await deleteMeeting(id);
      
      if (data.error) {
        setToast({ message: data.error, type: 'error' });
      } else {
        setMeetings(meetings.filter(m => m.id !== id));
        setToast({ message: 'Meeting deleted', type: 'success' });
      }
    } catch (error) {
      setToast({ message: 'Failed to delete meeting', type: 'error' });
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

  const statusColor: Record<string, string> = {
    Confirmed: "bg-gray-700 text-gray-300",
    Pending: "bg-gray-700 text-gray-300",
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
        <h2 className="text-base font-semibold text-white">Calendar</h2>
        <Link href="/meetings">
          <Button variant="primary">+ Schedule Meeting</Button>
        </Link>
      </div>

      {/* Upcoming Meetings */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
        <p className="text-sm font-medium text-white mb-3">Upcoming Meetings</p>
        {meetings.length === 0 ? (
          <p className="text-sm text-gray-400">No meetings scheduled</p>
        ) : (
          <div className="space-y-3">
            {meetings.map((m) => (
              <div key={m.id} className="border border-gray-700 rounded-lg p-3 hover:bg-gray-700 cursor-pointer relative">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-medium text-white">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[m.status]}`}>
                      {m.status}
                    </span>
                    <button
                      onClick={() => handleDeleteMeeting(m.id)}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className="flex gap-4 text-xs text-gray-400">
                  <span>{m.date}</span>
                  <span>{m.time}</span>
                  <span>{m.duration}</span>
                </div>
              </div>
            ))}
          </div>
        )}
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