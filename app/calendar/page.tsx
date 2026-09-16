'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockMeetings } from '@/lib/mockData';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Toast from '@/components/Toast';

export default function CalendarPage() {
  const [meetings, setMeetings] = useState(mockMeetings);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('Sep 18, 2026');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const availableSlots = [
    "9:00 AM", "9:15 AM", "9:30 AM", "9:45 AM", "10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM",
    "11:00 AM", "11:15 AM", "11:30 AM", "11:45 AM", "12:00 PM", "12:15 PM", "12:30 PM", "12:45 PM",
    "1:00 PM", "1:15 PM", "1:30 PM", "1:45 PM", "2:00 PM", "2:15 PM", "2:30 PM", "2:45 PM",
    "3:00 PM", "3:15 PM", "3:30 PM", "3:45 PM", "4:00 PM", "4:15 PM", "4:30 PM", "4:45 PM"
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleBookMeeting = () => {
    if (selectedSlot) {
      const newMeeting = {
        id: meetings.length + 1,
        name: "New Prospect",
        company: "TBD",
        date: selectedDate,
        time: selectedSlot,
        duration: "15 min",
        status: "Pending"
      };
      setMeetings([...meetings, newMeeting]);
      setShowBookingForm(false);
      setSelectedSlot(null);
    }
  };

  const handleDeleteMeeting = (id: number) => {
    setMeetings(meetings.filter(m => m.id !== id));
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

  const statusColor: Record<string, string> = {
    Confirmed: "bg-gray-700 text-gray-300",
    Pending: "bg-gray-700 text-gray-300",
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-semibold text-white">Calendar</h2>
        <Button variant="primary">+ Schedule Meeting</Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Upcoming Meetings */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-sm font-medium text-white mb-3">Upcoming Meetings</p>
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
        </div>

        {/* Available Time Slots */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-sm font-medium text-white mb-3">Available Time Slots - {selectedDate}</p>
          <div className="grid grid-cols-4 gap-2">
            {availableSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`text-xs px-2 py-1 border rounded hover:bg-gray-700 ${
                  selectedSlot === slot
                    ? 'border-blue-500 bg-blue-900 text-white'
                    : 'border-gray-600 text-gray-300'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
          {selectedSlot && (
            <div className="mt-4">
              <button
                onClick={() => setShowBookingForm(true)}
                className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Book {selectedSlot} on {selectedDate}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Meeting Booking Form */}
      {showBookingForm && (
        <div className="mt-6 bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-sm font-medium text-white mb-3">Schedule a Meeting</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Prospect</label>
              <select className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white">
                <option>Select prospect</option>
                <option>Capt. Marco Bellini</option>
                <option>James Whitfield</option>
                <option>Eng. Nikos P.</option>
                <option>Sophie Laurent</option>
                <option>Capt. Ahmed Al-Rashid</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Date</label>
              <input type="date" className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Time</label>
              <select className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white">
                <option>Select time</option>
                <option>9:00 AM</option>
                <option>9:15 AM</option>
                <option>9:30 AM</option>
                <option>9:45 AM</option>
                <option>10:00 AM</option>
                <option>10:15 AM</option>
                <option>10:30 AM</option>
                <option>10:45 AM</option>
                <option>11:00 AM</option>
                <option>11:15 AM</option>
                <option>11:30 AM</option>
                <option>11:45 AM</option>
                <option>12:00 PM</option>
                <option>12:15 PM</option>
                <option>12:30 PM</option>
                <option>12:45 PM</option>
                <option>1:00 PM</option>
                <option>1:15 PM</option>
                <option>1:30 PM</option>
                <option>1:45 PM</option>
                <option>2:00 PM</option>
                <option>2:15 PM</option>
                <option>2:30 PM</option>
                <option>2:45 PM</option>
                <option>3:00 PM</option>
                <option>3:15 PM</option>
                <option>3:30 PM</option>
                <option>3:45 PM</option>
                <option>4:00 PM</option>
                <option>4:15 PM</option>
                <option>4:30 PM</option>
                <option>4:45 PM</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="text-xs text-gray-400 mb-1 block">Duration</label>
            <select className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white">
              <option>15 minutes</option>
              <option>30 minutes</option>
              <option>45 minutes</option>
              <option>60 minutes</option>
            </select>
          </div>
          <div className="mt-4">
            <label className="text-xs text-gray-400 mb-1 block">Notes</label>
            <textarea rows={3} placeholder="Add meeting notes..." className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white placeholder-gray-500 resize-none" />
          </div>
          <div className="mt-4">
            <button
              onClick={handleBookMeeting}
              className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Schedule Meeting
            </button>
            <button
              onClick={() => setShowBookingForm(false)}
              className="ml-2 border border-gray-600 text-gray-300 text-sm px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}