'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';

export default function EmailPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
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
      <h2 className="text-base font-semibold text-white mb-6">Email Inbox</h2>

      {/* Info Banner */}
      <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 20 20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-400">Feature Not Yet Implemented</p>
            <p className="text-xs text-blue-300/70 mt-1">
              This page requires email inbox integration to display received emails.
            </p>
            <div className="mt-3 text-xs text-blue-300/70">
              <p className="font-medium mb-1">Required for implementation:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>IMAP server connection (e.g., Gmail IMAP, Outlook IMAP)</li>
                <li>OR Resend inbound webhook integration</li>
                <li>Database table to store received emails</li>
                <li>Backend API to fetch and sync emails</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
        <p className="text-sm text-gray-400">No emails to display. Email inbox integration is required.</p>
      </div>
    </div>
  );
}