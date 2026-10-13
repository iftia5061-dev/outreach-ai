'use client';

export default function TelephoneAIPage() {
  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4"
      >
        ← Back
      </button>
      <h2 className="text-base font-semibold text-white mb-6">Telephone AI</h2>

      {/* Coming Soon Card */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700 rounded-full mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 20 20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Coming Soon</h3>
        <p className="text-sm text-gray-400 max-w-md mx-auto">
          AI-powered phone call features are under development. This will enable automated outreach and follow-up calls with intelligent conversation handling.
        </p>
      </div>
    </div>
  );
}