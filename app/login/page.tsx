'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { googleLoginUser } from '@/lib/api';
import { googleSignInGetToken } from '@/lib/firebase';

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M21.35 12.23c0-.71-.06-1.4-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.52h3.14c1.84-1.7 2.91-4.2 2.91-7.29Z" />
      <path fill="#34A853" d="M12 21.75c2.62 0 4.82-.87 6.43-2.36l-3.14-2.39c-.87.58-1.98.93-3.29.93-2.52 0-4.66-1.7-5.42-3.99H3.34v2.47A9.72 9.72 0 0 0 12 21.75Z" />
      <path fill="#FBBC05" d="M6.58 13.94A5.86 5.86 0 0 1 6.28 12c0-.67.12-1.32.3-1.94V7.59H3.34A9.72 9.72 0 0 0 2.25 12c0 1.57.38 3.06 1.09 4.41l3.24-2.47Z" />
      <path fill="#EA4335" d="M12 6.07c1.43 0 2.7.49 3.71 1.45l2.79-2.79C16.82 3.16 14.62 2.25 12 2.25a9.72 9.72 0 0 0-8.66 5.34l3.24 2.47C7.34 7.77 9.48 6.07 12 6.07Z" />
    </svg>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchParams.get('expired') === 'true') setError('Your session expired. Please sign in again.');
  }, [searchParams]);

  const handleGoogle = async () => {
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      const idToken = await googleSignInGetToken();
      const response = await googleLoginUser(idToken);
      if (!response.user) throw new Error(response.message || 'Google sign-in failed');
      const redirectUrl = response.redirectUrl || '/pricing';
      router.replace(redirectUrl);
    } catch (error: unknown) {
      const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        setError(error instanceof Error ? error.message : 'Google sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-slate-950 px-5 py-10 text-white sm:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(37,99,235,0.34),transparent_33%),radial-gradient(circle_at_85%_85%,rgba(8,145,178,0.25),transparent_31%)]" />
      <div className="absolute left-1/2 top-1/2 -z-10 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/10" />
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] shadow-2xl shadow-blue-950/50 backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border-b border-white/10 p-8 sm:p-12 lg:border-b-0 lg:border-r">
            <div className="mb-12 flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500 text-lg font-black shadow-lg shadow-blue-500/30">O</div><span className="text-xl font-semibold tracking-tight">OutreachAI</span></div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-blue-300">AI-powered outreach</p>
            <h1 className="max-w-lg text-4xl font-semibold tracking-tight sm:text-5xl">Turn thoughtful outreach into real conversations.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">Plan, personalise, and manage your prospect conversations in one workspace. Start with a 30-day trial after choosing your plan.</p>
            <div className="mt-10 grid gap-3 text-sm text-slate-200 sm:grid-cols-2">{['AI-assisted email outreach', 'Consent-aware communication', 'Conversation and campaign tracking', 'Secure Stripe billing'].map((feature) => <div key={feature} className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/30 px-3 py-3"><span className="text-emerald-400">✓</span>{feature}</div>)}</div>
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <p className="text-sm font-medium text-blue-300">WELCOME BACK</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Continue to OutreachAI</h2><p className="mt-3 text-sm leading-6 text-slate-400">Use your Google account to sign in securely. You will choose your subscription plan next.</p>
            {error && <div role="alert" className="mt-6 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</div>}
            <button type="button" onClick={handleGoogle} disabled={loading} className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"><GoogleIcon />{loading ? 'Signing you in…' : 'Continue with Google'}</button>
            <p className="mt-6 text-center text-xs leading-5 text-slate-500">By continuing, you agree to the Terms of Service and Privacy Policy.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-950" />}>
      <LoginPageContent />
    </Suspense>
  );
}
