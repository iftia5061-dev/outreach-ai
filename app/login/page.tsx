'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const typingTexts = [
  "AI contacts every yacht manager automatically...",
  "Qualifies leads and books meetings for you...",
  "Works 24/7 across Email, WhatsApp & LinkedIn...",
  "Turns prospects into confirmed meetings...",
];

const cards = [
  { icon: "✉️", title: "Email Outreach", desc: "AI sends personalized emails to captains & managers" },
  { icon: "💬", title: "WhatsApp AI", desc: "Automated conversations that feel human" },
  { icon: "📅", title: "Meeting Booking", desc: "Auto-schedules 15-min calls with interested leads" },
  { icon: "📊", title: "Analytics", desc: "Track every prospect from contact to conversion" },
];

const GOOGLE_ACCOUNTS = [
  { name: "John Smith", email: "john.smith@gmail.com", avatar: "JS" },
  { name: "Marco Bellini", email: "marco.bellini@gmail.com", avatar: "MB" },
  { name: "Sophie Laurent", email: "sophie.laurent@gmail.com", avatar: "SL" },
];

const BUBBLE_DATA = [
  { id: 0, size: 12, left: 5, duration: 14, delay: 0, opacity: 0.15 },
  { id: 1, size: 8, left: 12, duration: 11, delay: 2, opacity: 0.1 },
  { id: 2, size: 18, left: 20, duration: 16, delay: 1, opacity: 0.12 },
  { id: 3, size: 7, left: 28, duration: 13, delay: 4, opacity: 0.18 },
  { id: 4, size: 14, left: 35, duration: 10, delay: 0.5, opacity: 0.08 },
  { id: 5, size: 10, left: 42, duration: 15, delay: 3, opacity: 0.14 },
  { id: 6, size: 20, left: 50, duration: 12, delay: 1.5, opacity: 0.1 },
  { id: 7, size: 9, left: 58, duration: 17, delay: 2.5, opacity: 0.16 },
  { id: 8, size: 15, left: 65, duration: 11, delay: 0, opacity: 0.12 },
  { id: 9, size: 6, left: 72, duration: 14, delay: 3.5, opacity: 0.2 },
  { id: 10, size: 11, left: 78, duration: 13, delay: 1, opacity: 0.1 },
  { id: 11, size: 16, left: 85, duration: 16, delay: 2, opacity: 0.14 },
  { id: 12, size: 8, left: 90, duration: 10, delay: 4.5, opacity: 0.18 },
  { id: 13, size: 13, left: 95, duration: 15, delay: 0.5, opacity: 0.1 },
  { id: 14, size: 19, left: 8, duration: 12, delay: 3, opacity: 0.08 },
  { id: 15, size: 7, left: 55, duration: 18, delay: 1.5, opacity: 0.15 },
  { id: 16, size: 12, left: 33, duration: 11, delay: 5, opacity: 0.12 },
  { id: 17, size: 10, left: 68, duration: 14, delay: 2, opacity: 0.16 },
];

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'main' | 'google' | 'create'>('main');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const cursor = setInterval(() => setCursorVisible(v => !v), 500);
    return () => clearInterval(cursor);
  }, []);

  useEffect(() => {
    const current = typingTexts[typingIndex];
    const speed = isDeleting ? 25 : 55;
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(current.slice(0, charIndex + 1));
        if (charIndex + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), 2500);
        } else {
          setCharIndex(c => c + 1);
        }
      } else {
        setDisplayText(current.slice(0, charIndex - 1));
        if (charIndex === 0) {
          setIsDeleting(false);
          setTypingIndex(i => (i + 1) % typingTexts.length);
        } else {
          setCharIndex(c => c - 1);
        }
      }
    }, speed);
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, typingIndex]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #020818 0%, #0a1628 40%, #0d1f3c 70%, #091525 100%)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'sans-serif',
    }}>
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(100vh) scale(0.6); opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 0.5; }
          100% { transform: translateY(-120px) scale(1); opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 24px rgba(59,130,246,0.25); }
          50% { box-shadow: 0 0 48px rgba(59,130,246,0.5), 0 0 80px rgba(37,99,235,0.2); }
        }
        .fade-in { animation: fadeInUp 0.7s ease forwards; }
        .card-hover:hover { transform: translateY(-6px) scale(1.02); transition: all 0.3s ease; }
        .google-btn:hover { background: rgba(255,255,255,0.1) !important; }
        .account-row:hover { background: rgba(255,255,255,0.08) !important; }
      `}</style>

      {/* Bubbles */}
      {BUBBLE_DATA.map(b => (
        <div key={b.id} style={{
          position: 'absolute',
          bottom: '-60px',
          left: `${b.left}%`,
          width: `${b.size}px`,
          height: `${b.size}px`,
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, rgba(147,197,253,${b.opacity * 2.5}), rgba(59,130,246,${b.opacity}))`,
          border: `1.5px solid rgba(147,197,253,${b.opacity * 2})`,
          animation: `floatUp ${b.duration}s ${b.delay}s infinite linear`,
          pointerEvents: 'none',
        }} />
      ))}

      {/* Glow orbs */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '5%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1100px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', justifyContent: 'center', gap: '40px' }}>

        {/* Header */}
        <div className="fade-in" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#60a5fa', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '12px' }}>
            AI-Powered Yacht Outreach
          </div>
          <h1 style={{ fontSize: '52px', fontWeight: 700, color: '#ffffff', lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-1px' }}>
            OutreachAI
          </h1>
          <div style={{ fontSize: '18px', color: '#93c5fd', minHeight: '28px', fontWeight: 400 }}>
            {displayText}<span style={{ opacity: cursorVisible ? 1 : 0, color: '#60a5fa' }}>|</span>
          </div>
        </div>

        {/* Feature Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', width: '100%' }}>
          {cards.map((card, i) => (
            <div key={i} className="card-hover fade-in" style={{
              animationDelay: `${i * 0.12}s`,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '24px 20px',
              backdropFilter: 'blur(12px)',
              cursor: 'default',
            }}>
              <div style={{ fontSize: '26px', marginBottom: '10px' }}>{card.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>{card.title}</div>
              <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>{card.desc}</div>
            </div>
          ))}
        </div>

        {/* Login Box */}
        <div className="fade-in" style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '36px',
          width: '100%',
          maxWidth: '420px',
          backdropFilter: 'blur(20px)',
          animation: 'glow 3s ease-in-out infinite',
        }}>

          {/* MAIN MODE */}
          {mode === 'main' && (
            <>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '6px', textAlign: 'center' }}>Welcome back</h2>
              <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', marginBottom: '24px' }}>Sign in to OutreachAI</p>

              {/* Continue with Google */}
              <button className="google-btn" onClick={() => setMode('google')} style={{
                width: '100%', padding: '12px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px',
              }}>
                <span style={{ fontSize: '18px' }}>🇬</span> Continue with Google
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '16px 0' }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                <span style={{ fontSize: '12px', color: '#475569' }}>or</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Email</label>
                <input type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Password</label>
                <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && router.push('/dashboard')}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <button onClick={() => router.push('/dashboard')} style={{
                width: '100%', padding: '12px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#fff', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(37,99,235,0.4)', marginBottom: '16px',
              }}>
                Sign in →
              </button>

              <p style={{ textAlign: 'center', fontSize: '13px', color: '#475569' }}>
                No account?{' '}
                <span onClick={() => setMode('create')} style={{ color: '#60a5fa', cursor: 'pointer' }}>Create one</span>
              </p>
            </>
          )}

          {/* GOOGLE ACCOUNTS MODE */}
          {mode === 'google' && (
            <>
              <button onClick={() => setMode('main')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px', marginBottom: '16px' }}>← Back</button>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>Choose an account</h2>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>to continue to OutreachAI</p>

              {GOOGLE_ACCOUNTS.map((acc, i) => (
                <div key={i} className="account-row" onClick={() => router.push('/dashboard')} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '12px 14px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                  cursor: 'pointer', marginBottom: '10px',
                }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600, color: '#fff', flexShrink: 0 }}>
                    {acc.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#e2e8f0' }}>{acc.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{acc.email}</div>
                  </div>
                </div>
              ))}

              <div onClick={() => router.push('/dashboard')} className="account-row" style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '12px 14px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                cursor: 'pointer', marginTop: '4px',
              }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>+</div>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>Use another account</div>
              </div>
            </>
          )}

          {/* CREATE ACCOUNT MODE */}
          {mode === 'create' && (
            <>
              <button onClick={() => setMode('main')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px', marginBottom: '16px' }}>← Back</button>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>Create account</h2>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Start your OutreachAI journey</p>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Full Name</label>
                <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Email</label>
                <input type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Password</label>
                <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <button onClick={() => router.push('/dashboard')} style={{
                width: '100%', padding: '12px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#fff', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(37,99,235,0.4)',
              }}>
                Create Account →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}