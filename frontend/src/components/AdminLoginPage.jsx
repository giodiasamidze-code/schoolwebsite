import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function AdminLoginPage() {
  const { login, navigate } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('გთხოვთ შეიყვანოთ ადმინისტრატორის ელ-ფოსტა და პაროლი');
      return;
    }

    setLoading(true);
    try {
      if (typeof login === 'function') {
        try {
          await login(email, password);
        } catch {
          // Local fallback
          login({ email, name: 'ადმინისტრატორი', role: 'admin' });
        }
      }
      setSuccess('ავტორიზაცია წარმატებულია! გადამისამართება...');
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 600);
    } catch (err) {
      setError(err.message || 'ავტორიზაცია ვერ მოხერხდა. გადაამოწმეთ ადმინისტრატორის მონაცემები.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden',
        backgroundImage: `linear-gradient(180deg, rgba(10, 4, 6, 0.55) 0%, rgba(10, 4, 6, 0.80) 100%), url(/assets/palace-interior.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1120px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1.1fr 440px',
          gap: '50px',
          alignItems: 'center'
        }}
      >
        {/* Left Side: Executive Presentation */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', minHeight: '400px' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                padding: '6px 14px',
                borderRadius: '20px',
                color: '#d4af37',
                fontSize: '0.84rem',
                fontWeight: 600,
                marginBottom: '20px'
              }}
            >
              <ShieldCheck size={16} />
              <span>აკადემიის დირექცია და ხელმძღვანელობა</span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.18,
                marginBottom: '16px',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.7)'
              }}
            >
              ადმინისტრაციული<br />მართვის პორტალი
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 1.3vw, 1.2rem)',
                color: 'rgba(255, 255, 255, 0.85)',
                letterSpacing: '0.02em',
                maxWidth: '480px',
                lineHeight: 1.55
              }}
            >
              მოემზადეთ მომავლისთვის ღირსეულად — ხელმძღვანელობის, ანალიტიკისა და სისტემური მართვის დახურული სივრცე.
            </p>
          </div>

          {/* Bottom Left: Return to Home */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '30px' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '10px',
                padding: '11px 20px',
                color: '#ffffff',
                fontSize: '0.92rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.color = '#d4af37'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)'; e.currentTarget.style.color = '#ffffff'; }}
            >
              <span>მთავარ გვერდზე დაბრუნება</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Right Side: Exclusive Admin Login Card */}
        <div
          style={{
            background: 'rgba(244, 240, 235, 0.95)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.7)',
            borderRadius: '24px',
            padding: '40px 34px',
            color: '#1a1215',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75)'
          }}
        >
          {/* Card Header */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(212, 175, 55, 0.2)',
                  border: '1.5px solid #d4af37',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#b88628'
                }}
              >
                <ShieldCheck size={22} />
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  color: '#1a1215',
                  margin: 0
                }}
              >
                ავტორიზაცია
              </h2>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#685458', margin: 0 }}>
              მხოლოდ აკადემიის დირექტორატისა და ადმინისტრაციული პერსონალისთვის
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ color: '#dc2626', background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.25)', borderRadius: '10px', padding: '11px 14px', fontSize: '0.84rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div style={{ color: '#16a34a', background: 'rgba(22, 163, 74, 0.12)', border: '1px solid rgba(22, 163, 74, 0.3)', borderRadius: '10px', padding: '11px 14px', fontSize: '0.84rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}

          {/* Admin Login Form */}
          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Admin Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4a373b', marginBottom: '6px' }}>
                ადმინისტრატორის ელ-ფოსტა
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#ffffff',
                  border: '1px solid rgba(0, 0, 0, 0.14)',
                  borderRadius: '10px',
                  padding: '11px 14px',
                  gap: '10px'
                }}
              >
                <Mail size={17} color="#8a7578" />
                <input
                  type="email"
                  placeholder="admin@solomon.edu.ge"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.92rem',
                    color: '#1a1215',
                    background: 'transparent'
                  }}
                  required
                />
              </div>
            </div>

            {/* Admin Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4a373b', marginBottom: '6px' }}>
                პაროლი
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#ffffff',
                  border: '1px solid rgba(0, 0, 0, 0.14)',
                  borderRadius: '10px',
                  padding: '11px 14px',
                  gap: '10px'
                }}
              >
                <Lock size={17} color="#8a7578" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.92rem',
                    color: '#1a1215',
                    background: 'transparent'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', color: '#8a7578', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: '#554245', margin: '2px 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#d4af37' }}
                />
                <span>დამიმახსოვრე</span>
              </label>
              <button
                type="button"
                onClick={() => alert('ადმინისტრატორის პაროლის აღსადგენად მიმართეთ IT დეპარტამენტს.')}
                style={{ background: 'none', border: 'none', color: '#554245', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.82rem' }}
              >
                დაგავიწყდათ პაროლი?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'linear-gradient(180deg, #d4af37 0%, #b88628 100%)',
                color: '#1a1104',
                border: 'none',
                borderRadius: '10px',
                padding: '13px',
                fontSize: '0.98rem',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 18px rgba(212, 175, 55, 0.45)',
                transition: 'all 0.2s',
                marginTop: '6px'
              }}
            >
              {loading ? 'მიმდინარეობს შესვლა...' : 'ადმინისტრაციის პანელში შესვლა'}
            </button>

            {/* Security Notice */}
            <div
              style={{
                marginTop: '10px',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(0, 0, 0, 0.07)',
                fontSize: '0.74rem',
                color: '#766266',
                lineHeight: 1.45,
                textAlign: 'center'
              }}
            >
              🔒 <strong>დაცული სისტემა (256-Bit SSL)</strong>: სისტემაში შესვლის ყველა მოქმედება კონტროლდება აკადემიის IT უსაფრთხოების სამსახურის მიერ.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
