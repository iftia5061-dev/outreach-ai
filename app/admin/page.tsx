'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdminOverview, getSupportTickets, setUserSuspension, updateSupportTicketStatus } from '@/lib/api';

type User = { id: number; name: string; email: string; created_at: string; plan_type: string | null; status: string | null; current_period_end: string | null; suspended: boolean };
type Ticket = { id: number; name: string; email: string; subject: string; message: string; status: string; created_at: string };
type Overview = { totals: { users: number; active: number; trials: number; past_due: number; expired_trials: number }; users: User[] };

export default function AdminPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingUser, setSavingUser] = useState<number | null>(null);
  const [savingTicket, setSavingTicket] = useState<number | null>(null);
  const refresh = async () => {
    const [overview, ticketData] = await Promise.all([getAdminOverview(), getSupportTickets()]);
    if (overview.error) setError(overview.error); else setData(overview);
    if (!ticketData.error) setTickets(ticketData.tickets || []);
  };
  useEffect(() => { refresh().catch(() => setError('Unable to load the admin overview.')).finally(() => setLoading(false)); }, []);
  const toggleSuspension = async (user: User) => {
    const suspended = !user.suspended;
    const reason = suspended ? window.prompt('Optional suspension reason:') || '' : '';
    setSavingUser(user.id);
    const response = await setUserSuspension(user.id, suspended, reason);
    setSavingUser(null);
    if (response.error) setError(response.error); else refresh();
  };
  const changeTicketStatus = async (ticketId: number, status: string) => {
    setSavingTicket(ticketId);
    const response = await updateSupportTicketStatus(ticketId, status);
    setSavingTicket(null);
    if (response.error) setError(response.error); else refresh();
  };
  const totals = data?.totals ?? { users: 0, active: 0, trials: 0, past_due: 0, expired_trials: 0 };
  return <main className="min-h-screen bg-slate-950 p-6 text-white sm:p-10"><div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[.2em] text-blue-300">Private administration</p><h1 className="mt-2 text-3xl font-bold">Account overview</h1></div><Link href="/dashboard" className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10">Back to workspace</Link></div>{loading && <p className="mt-10 text-slate-300">Loading secure account data…</p>}{error && <div className="mt-8 rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 text-rose-100"><p className="font-semibold">Access unavailable</p><p className="mt-1 text-sm">{error}. Add your Gmail to <code>ADMIN_EMAILS</code> on the backend server, then sign in again.</p></div>}{data && <><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{[['Total users', totals.users], ['Paid active', totals.active], ['Active trials', totals.trials], ['Past due', totals.past_due], ['Expired trials', totals.expired_trials]].map(([label, value]) => <div key={String(label)} className="rounded-xl border border-white/10 bg-white/5 p-5"><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-3xl font-bold">{String(value)}</p></div>)}</div><section className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-white/5"><div className="border-b border-white/10 p-5"><h2 className="font-semibold">Recent user accounts</h2><p className="mt-1 text-sm text-slate-400">Suspend blocks website access without changing Stripe billing.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[860px] text-left text-sm"><thead className="bg-slate-900/70 text-slate-400"><tr><th className="px-5 py-3">User</th><th className="px-5 py-3">Plan</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Period ends</th><th className="px-5 py-3">Access</th><th className="px-5 py-3">Joined</th></tr></thead><tbody>{data.users.map((user) => <tr key={user.id} className="border-t border-white/10"><td className="px-5 py-4"><p>{user.name}</p><p className="text-xs text-slate-400">{user.email}</p></td><td className="px-5 py-4 capitalize">{user.plan_type || 'No plan'}</td><td className="px-5 py-4 capitalize">{user.status || 'Not started'}</td><td className="px-5 py-4">{user.current_period_end ? new Date(user.current_period_end).toLocaleDateString() : '—'}</td><td className="px-5 py-4"><button disabled={savingUser === user.id} onClick={() => toggleSuspension(user)} className={`rounded px-3 py-1.5 text-xs font-medium disabled:opacity-50 ${user.suspended ? 'bg-emerald-500/20 text-emerald-200' : 'bg-rose-500/20 text-rose-200'}`}>{savingUser === user.id ? 'Saving…' : user.suspended ? 'Restore access' : 'Suspend access'}</button></td><td className="px-5 py-4">{new Date(user.created_at).toLocaleDateString()}</td></tr>)}</tbody></table></div></section><section className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-white/5"><div className="border-b border-white/10 p-5"><h2 className="font-semibold">Support tickets</h2><p className="mt-1 text-sm text-slate-400">Customer requests are stored in the database and can be triaged here.</p></div><div className="divide-y divide-white/10">{tickets.length === 0 ? <p className="p-5 text-sm text-slate-400">No support tickets.</p> : tickets.map((ticket) => <article key={ticket.id} className="p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-medium">{ticket.subject}</p><p className="mt-1 text-xs text-slate-400">{ticket.name} · {ticket.email} · {new Date(ticket.created_at).toLocaleString()}</p></div><select disabled={savingTicket === ticket.id} value={ticket.status} onChange={(event) => changeTicketStatus(ticket.id, event.target.value)} className="rounded border border-white/20 bg-slate-900 px-2 py-1 text-xs capitalize"><option value="open">Open</option><option value="in_progress">In progress</option><option value="resolved">Resolved</option><option value="closed">Closed</option></select></div><p className="mt-3 whitespace-pre-wrap text-sm text-slate-300">{ticket.message}</p></article>)}</div></section></>}</div></main>;
}
