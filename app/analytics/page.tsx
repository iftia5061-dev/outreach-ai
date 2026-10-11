'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Toast from '@/components/Toast';
import { getAnalytics } from '@/lib/api';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await getAnalytics();
      if (response.error) {
        setError(response.error);
        setToast({ message: response.error, type: 'error' });
      } else {
        setData(response);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
      setToast({ message: err.message || 'Failed to load analytics', type: 'error' });
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
      <h2 className="text-base font-semibold text-white mb-6">Analytics</h2>

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {!data && !error ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
          <p className="text-sm text-gray-400">No data yet</p>
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Total Prospects</p>
              <p className="text-2xl font-semibold text-white">{data.totalProspects || 0}</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Total Leads</p>
              <p className="text-2xl font-semibold text-white">{data.totalLeads || 0}</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Total Meetings</p>
              <p className="text-2xl font-semibold text-white">{data.totalMeetings || 0}</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Sent Emails</p>
              <p className="text-2xl font-semibold text-white">{data.totalSentEmails || 0}</p>
            </div>
          </div>

          {/* Email Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-900/20 border border-green-700 rounded-xl p-4">
              <p className="text-xs text-green-400 mb-1">Successful Emails</p>
              <p className="text-2xl font-semibold text-green-400">{data.successfulEmails || 0}</p>
            </div>
            <div className="bg-red-900/20 border border-red-700 rounded-xl p-4">
              <p className="text-xs text-red-400 mb-1">Failed Emails</p>
              <p className="text-2xl font-semibold text-red-400">{data.failedEmails || 0}</p>
            </div>
          </div>

          {/* Prospects by Status */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-sm font-medium text-white mb-4">Prospects by Status</h3>
            {data.prospectsByStatus && data.prospectsByStatus.length > 0 ? (
              <div className="space-y-3">
                {data.prospectsByStatus.map((item: any) => (
                  <div key={item.status} className="flex items-center gap-3">
                    <span className="text-sm text-gray-400 w-32">{item.status}</span>
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${(item.count / data.totalProspects) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-white">{item.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No prospect status data</p>
            )}
          </div>

          {/* Daily New Prospects */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-sm font-medium text-white mb-4">New Prospects (Last 30 Days)</h3>
            {data.dailyProspects && data.dailyProspects.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-end gap-1 h-40 overflow-x-auto pb-2">
                  {data.dailyProspects.map((item: any, index: number) => {
                    const maxCount = Math.max(...data.dailyProspects.map((d: any) => d.count));
                    const isToday = index === data.dailyProspects.length - 1;
                    const barHeight = item.count > 0
                      ? Math.max((item.count / maxCount) * 100, 15)
                      : 2;
                    const date = new Date(item.date);
                    const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    const showLabel = index % 5 === 0 || isToday;
                    return (
                      <div
                        key={item.date}
                        className="flex flex-col items-center gap-1 flex-shrink-0 w-10 group relative"
                      >
                        <div
                          className={`w-6 rounded-t transition-colors ${
                            item.count > 0
                              ? isToday
                                ? 'bg-blue-400 hover:bg-blue-300'
                                : 'bg-blue-500/50 hover:bg-blue-500'
                              : 'bg-gray-600'
                          }`}
                          style={{ height: `${barHeight}%` }}
                        />
                        {showLabel && (
                          <span className="text-[10px] text-gray-500 whitespace-nowrap">{dateLabel}</span>
                        )}
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {item.count} prospects
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No daily prospect data</p>
            )}
          </div>

          {/* Daily Sent Emails */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-sm font-medium text-white mb-4">Sent Emails (Last 30 Days)</h3>
            {data.dailyEmails && data.dailyEmails.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-end gap-1 h-40 overflow-x-auto pb-2">
                  {data.dailyEmails.map((item: any, index: number) => {
                    const maxCount = Math.max(...data.dailyEmails.map((d: any) => d.count));
                    const isToday = index === data.dailyEmails.length - 1;
                    const barHeight = item.count > 0
                      ? Math.max((item.count / maxCount) * 100, 15)
                      : 2;
                    const date = new Date(item.date);
                    const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    const showLabel = index % 5 === 0 || isToday;
                    return (
                      <div
                        key={item.date}
                        className="flex flex-col items-center gap-1 flex-shrink-0 w-10 group relative"
                      >
                        <div
                          className={`w-6 rounded-t transition-colors ${
                            item.count > 0
                              ? isToday
                                ? 'bg-green-400 hover:bg-green-300'
                                : 'bg-green-500/50 hover:bg-green-500'
                              : 'bg-gray-600'
                          }`}
                          style={{ height: `${barHeight}%` }}
                        />
                        {showLabel && (
                          <span className="text-[10px] text-gray-500 whitespace-nowrap">{dateLabel}</span>
                        )}
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {item.count} emails
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No daily email data</p>
            )}
          </div>
        </div>
      ) : null}

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
