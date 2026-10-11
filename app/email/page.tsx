'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { getSentEmails } from '@/lib/api';

export default function EmailPage() {
  const [loading, setLoading] = useState(true);
  const [emails, setEmails] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const data = await getSentEmails();
      if (data.error) {
        setError(data.error || 'Failed to load emails');
      } else if (data.emails) {
        setEmails(data.emails);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load emails');
    } finally {
      setLoading(false);
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
      <h2 className="text-base font-semibold text-white mb-6">Sent Emails</h2>

      {/* Incoming Email Coming Soon */}
      <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 20 20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-yellow-400">Incoming Emails - Coming Soon</p>
            <p className="text-xs text-yellow-300/70 mt-1">
              Replies from prospects will appear here soon.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Sent Emails Table */}
      {emails.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
          <p className="text-sm text-gray-400">No emails sent yet</p>
        </div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Recipient</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {emails.map((email) => (
                <tr key={email.id} className="hover:bg-gray-700/30">
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {email.prospect_name || email.to_email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300 truncate max-w-xs">
                    {email.subject}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {new Date(email.sent_at).toLocaleDateString('en-US')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      email.status === 'sent'
                        ? 'bg-green-900/30 text-green-400 border border-green-700'
                        : 'bg-red-900/30 text-red-400 border border-red-700'
                    }`}>
                      {email.status === 'sent' ? 'Sent' : 'Failed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}