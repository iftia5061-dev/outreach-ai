'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { getSubscriptionStatus } from '@/lib/api';

function PaymentProcessingContent() {
  const router = useRouter();
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      let attempts = 0;
      const maxAttempts = 10;
      const interval = setInterval(async () => {
        attempts++;
        try {
          const sub = await getSubscriptionStatus();

          // Check if response has error
          if (sub.error) {
            console.error('Subscription status error:', sub.error);
            if (attempts >= maxAttempts) {
              setStatus('failed');
              setMessage('Payment verification failed. Please contact support.');
              clearInterval(interval);
            }
            return;
          }

          // Check subscription status from correct path
          const subscriptionStatus = sub.subscription?.status;

          if (subscriptionStatus === 'active' || subscriptionStatus === 'trialing') {
            setStatus('success');
            setMessage('Payment successful! Redirecting to dashboard...');
            clearInterval(interval);
            setTimeout(() => router.push('/dashboard'), 2000);
          } else if (attempts >= maxAttempts) {
            setStatus('failed');
            setMessage('Payment verification timed out. Please contact support.');
            clearInterval(interval);
          }
        } catch (error) {
          console.error('Failed to check payment status:', error);
          if (attempts >= maxAttempts) {
            setStatus('failed');
            setMessage('Payment verification failed. Please contact support.');
            clearInterval(interval);
          }
        }
      }, 2000);

      return () => clearInterval(interval);
    };

    checkPaymentStatus();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-white mb-2">Processing Payment</h2>
            <p className="text-gray-400">{message}</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Payment Successful</h2>
            <p className="text-gray-400">{message}</p>
          </>
        )}
        
        {status === 'failed' && (
          <>
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Payment Failed</h2>
            <p className="text-gray-400 mb-4">{message}</p>
            <button
              onClick={() => router.push('/billing')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Return to Billing
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentProcessingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading...</h2>
        </div>
      </div>
    }>
      <PaymentProcessingContent />
    </Suspense>
  );
}
