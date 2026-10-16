'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCheckoutSession, getSubscriptionStatus, startTrial } from '@/lib/api';

type PlanKey = 'starter' | 'professional' | 'enterprise';
const plans: Record<PlanKey, { name: string; monthly: number; yearly: number; description: string; features: string[] }> = {
  starter: { name: 'Starter', monthly: 49, yearly: 490, description: 'For focused outreach', features: ['1 client', '500 prospects', 'Email outreach'] },
  professional: { name: 'Professional', monthly: 99, yearly: 990, description: 'For growing teams', features: ['5 clients', '2,000 prospects', 'Email, WhatsApp and LinkedIn'] },
  enterprise: { name: 'Enterprise', monthly: 249, yearly: 2490, description: 'For high-volume outreach', features: ['Unlimited clients', 'Unlimited prospects', 'All available channels'] },
};

export default function PricingPage() {
  const router = useRouter();
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState<PlanKey | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => { getSubscriptionStatus().then((data) => setSubscription(data.subscription ?? null)); }, []);

  const selectPlan = async (plan: PlanKey) => {
    setLoading(plan); setMessage('');
    try {
      const expiredTrial = subscription?.status === 'trialing' && new Date(subscription.current_period_end) <= new Date();
      if (!subscription) {
        const data = await startTrial(plan);
        if (data.error) throw new Error(data.error);
        router.push('/dashboard');
        return;
      }
      if (subscription.status === 'trialing' && !expiredTrial) {
        router.push('/dashboard');
        return;
      }
      const data = await createCheckoutSession({ plan_type: plan, billing_cycle: cycle });
      if (data.url) { window.location.href = data.url; return; }
      throw new Error(data.error || 'Unable to open secure checkout.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Please try again.');
    } finally { setLoading(null); }
  };

  const trialActive = subscription?.status === 'trialing' && new Date(subscription.current_period_end) > new Date();
  return <main className="min-h-screen bg-slate-950 px-5 py-12 text-white sm:px-8">
    <div className="mx-auto max-w-6xl">
      <div className="text-center"><p className="text-sm font-semibold uppercase tracking-[.2em] text-blue-300">Simple, transparent billing</p><h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Choose the plan for your outreach</h1><p className="mx-auto mt-4 max-w-2xl text-slate-300">There is no permanent free plan. Every new account receives one 30-day card-free trial after selecting a plan.</p></div>
      {message && <p role="alert" className="mx-auto mt-6 max-w-xl rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-center text-sm text-rose-100">{message}</p>}
      {trialActive && <div className="mx-auto mt-6 max-w-xl rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-center text-sm text-emerald-100">Your free trial is active until {new Date(subscription.current_period_end).toLocaleDateString()}. You can continue using OutreachAI.</div>}
      <div className="mt-8 flex justify-center gap-3"><button onClick={() => setCycle('monthly')} className={`rounded-lg px-4 py-2 text-sm ${cycle === 'monthly' ? 'bg-blue-500 font-semibold' : 'bg-slate-800 text-slate-300'}`}>Monthly</button><button onClick={() => setCycle('yearly')} className={`rounded-lg px-4 py-2 text-sm ${cycle === 'yearly' ? 'bg-blue-500 font-semibold' : 'bg-slate-800 text-slate-300'}`}>Yearly — save 17%</button></div>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">{(Object.keys(plans) as PlanKey[]).map((key) => { const plan = plans[key]; const price = cycle === 'monthly' ? plan.monthly : plan.yearly; return <section key={key} className={`rounded-2xl border p-7 ${key === 'professional' ? 'border-blue-400 bg-blue-500/10 shadow-xl shadow-blue-900/20' : 'border-white/10 bg-white/5'}`}><p className="text-sm font-medium text-blue-200">{plan.description}</p><h2 className="mt-2 text-2xl font-bold">{plan.name}</h2><p className="mt-5"><span className="text-4xl font-bold">${price}</span><span className="text-slate-400">/{cycle === 'monthly' ? 'month' : 'year'}</span></p><ul className="my-7 space-y-3 text-sm text-slate-200">{plan.features.map((feature) => <li key={feature}>✓ {feature}</li>)}</ul><button disabled={loading !== null} onClick={() => selectPlan(key)} className="w-full rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold transition hover:bg-blue-400 disabled:opacity-60">{loading === key ? 'Please wait…' : !subscription ? 'Start 30-day free trial' : trialActive ? 'Continue trial' : 'Subscribe securely'}</button></section>; })}</div>
      <p className="mt-8 text-center text-xs text-slate-500">After the trial ends, choose a paid subscription to continue. Payments are processed securely by Stripe.</p>
    </div>
  </main>;
}
