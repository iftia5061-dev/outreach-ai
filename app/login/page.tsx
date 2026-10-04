'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { googleLoginUser } from '@/lib/api';
import { googleSignInGetToken } from '@/lib/firebase';

const cards = [
  { icon: "✉️", title: "Email Outreach", desc: "AI sends personalized emails to captains & managers" },
  { icon: "💬", title: "WhatsApp AI", desc: "Automated conversations that feel human" },
  { icon: "📅", title: "Meeting Booking", desc: "Auto-schedules 15-min calls with interested leads" },
  { icon: "📊", title: "Analytics", desc: "Track every prospect from contact to conversion" },
];

const primaryBtnStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '10px',
  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
  color: '#fff',
  fontSize: '14px',
  fontWeight: 600,
  border: 'none',
  boxShadow: '0 4px 20px rgba(37,99,235,0.4)',
};

const planCardStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '16px',
  padding: '24px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const selectedPlanStyle = {
  background: 'rgba(37,99,235,0.15)',
  border: '2px solid #3b82f6',
};

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'monthly' | 'yearly' | null>(null);

  const handleGoogle = async () => {
    if (loading) return;
    if (!selectedPlan) {
      alert('Please select a plan to continue');
      return;
    }
    setLoading(true);
    try {
      const idToken = await googleSignInGetToken();
      const res = await googleLoginUser(idToken);
      if (res.user) {
        // Save selected plan in localStorage for post-login redirect
        if (selectedPlan && selectedPlan !== 'free') {
          localStorage.setItem('selectedPlan', selectedPlan);
        }
        router.push('/dashboard');
        return;
      }
      alert(res.message || 'Google login failed');
    } catch (e: any) {
      if (e?.code !== 'auth/popup-closed-by-user' && e?.code !== 'auth/cancelled-popup-request') {
        alert(e?.message || 'Google login failed');
      }
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #020818 0%, #0a1628 40%, #0d1f3c 70%, #091525 100%)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'sans-serif',
    }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 24px rgba(59,130,246,0.25); }
          50% { box-shadow: 0 0 48px rgba(59,130,246,0.5), 0 0 80px rgba(37,99,235,0.2); }
        }
        .fade-in { animation: fadeInUp 0.7s ease forwards; }
        .plan-card:hover { transform: translateY(-6px); }
      `}</style>

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
          <p style={{ fontSize: '18px', color: '#93c5fd', marginBottom: '32px' }}>
            Choose your plan to get started
          </p>
        </div>

        {/* Feature Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', width: '100%', marginBottom: '32px' }}>
          {cards.map((card, i) => (
            <div key={i} className="fade-in" style={{
              animationDelay: `${i * 0.12}s`,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '24px 20px',
              backdropFilter: 'blur(12px)',
            }}>
              <div style={{ fontSize: '26px', marginBottom: '10px' }}>{card.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>{card.title}</div>
              <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>{card.desc}</div>
            </div>
          ))}
        </div>

        {/* Plan Selection */}
        <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', width: '100%', marginBottom: '32px' }}>
          {/* Free Plan */}
          <div 
            onClick={() => setSelectedPlan('free')}
            style={{
              ...planCardStyle,
              ...(selectedPlan === 'free' ? selectedPlanStyle : {}),
            }}
            className="plan-card"
          >
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>🆓</div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>Free</h3>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#22c55e', marginBottom: '8px' }}>$0</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>Forever</div>
            <ul style={{ fontSize: '13px', color: '#cbd5e1', listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>✓ Up to 3 prospects</li>
              <li style={{ marginBottom: '8px' }}>✓ Email outreach</li>
              <li style={{ marginBottom: '8px' }}>✓ Basic analytics</li>
            </ul>
          </div>

          {/* Monthly Plan */}
          <div 
            onClick={() => setSelectedPlan('monthly')}
            style={{
              ...planCardStyle,
              ...(selectedPlan === 'monthly' ? selectedPlanStyle : {}),
            }}
            className="plan-card"
          >
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>⭐</div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>Monthly</h3>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#3b82f6', marginBottom: '8px' }}>$99</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>per month</div>
            <ul style={{ fontSize: '13px', color: '#cbd5e1', listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>✓ Unlimited prospects</li>
              <li style={{ marginBottom: '8px' }}>✓ Email + WhatsApp</li>
              <li style={{ marginBottom: '8px' }}>✓ AI assistant</li>
              <li style={{ marginBottom: '8px' }}>✓ Meeting booking</li>
            </ul>
          </div>

          {/* Yearly Plan */}
          <div 
            onClick={() => setSelectedPlan('yearly')}
            style={{
              ...planCardStyle,
              ...(selectedPlan === 'yearly' ? selectedPlanStyle : {}),
            }}
            className="plan-card"
          >
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>🏆</div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>Yearly</h3>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#8b5cf6', marginBottom: '8px' }}>$890</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>per year (Save 25%)</div>
            <ul style={{ fontSize: '13px', color: '#cbd5e1', listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>✓ Unlimited prospects</li>
              <li style={{ marginBottom: '8px' }}>✓ Email + WhatsApp + LinkedIn</li>
              <li style={{ marginBottom: '8px' }}>✓ AI assistant</li>
              <li style={{ marginBottom: '8px' }}>✓ Telephone AI</li>
            </ul>
          </div>
        </div>

        {/* Continue with Google */}
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
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '24px', textAlign: 'center' }}>
            Get Started
          </h2>

          <button 
            onClick={handleGoogle} 
            disabled={loading || !selectedPlan}
            style={{
              ...primaryBtnStyle,
              cursor: (loading || !selectedPlan) ? 'not-allowed' : 'pointer',
              opacity: (loading || !selectedPlan) ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <span style={{ fontSize: '18px' }}>🇬</span> {loading ? 'Please wait...' : 'Continue with Google'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#475569', marginTop: '16px' }}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
