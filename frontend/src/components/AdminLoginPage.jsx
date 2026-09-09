import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function AdminLoginPage() {
  const { login, navigate } = useAuth();
  const [roleTab, setRoleTab] = useState('მშობელი'); // 'მშობელი' | 'პედაგოგი' | 'ადმინისტრაცია'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('გთხოვთ შეავსოთ ყველა ველი');
      return;
    }

    if (roleTab === 'ადმინისტრაცია') {
      login({ email, name: 'ადმინისტრატორი', role: 'admin' });
      navigate('/admin-dashboard');
    } else if (roleTab === 'პედაგოგი') {
      login({ email, name: 'პედაგოგი', role: 'teacher' });
      navigate('/teacher-dashboard');
    } else {
      login({ email, name: 'მშობელი', role: 'parent' });
      navigate('/parent-account');
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundImage: `linear-gradient(180deg, rgba(12, 6, 8, 0.45) 0%, rgba(12, 6, 8, 0.65) 100%), url(/assets/palace-interior.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        color: '#ffffff'
      }}
    >
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1180px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1.1fr 440px',
          gap: '50px',
          alignItems: 'center'
        }}
      >
        {/* Left Side (Photo 6) */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', minHeight: '440px' }}>
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                fontSize: 'clamp(2.5rem, 4.5vw, 4rem)',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.18,
                marginBottom: '16px',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.6)'
              }}
            >
              კეთილი იყოს<br />თქვენი დაბრუნება
            </h1>
            <p
              style={{
                fontSize: 'clamp(1rem, 1.4vw, 1.25rem)',
                color: 'rgba(255, 255, 255, 0.8)',
                letterSpacing: '0.02em'
              }}
            >
              მოემზადეთ მომავალი, ღირსეულად.
            </p>
          </div>

          {/* Bottom Left: მთავარი -> */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

            <button
              onClick={() => navigate('/')}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '0.92rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#d4af37')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)')}
            >
              <span>მთავარი</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Right Glassmorphic Login Card (Photo 6) */}
        <div
          style={{
            background: 'rgba(240, 235, 230, 0.88)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            borderRadius: '24px',
            padding: '36px 32px',
            color: '#1a1215',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)'
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
              fontSize: '2rem',
              fontWeight: 700,
              color: '#1a1215',
              textAlign: 'center',
              marginBottom: '20px'
            }}
          >
            შესვლა
          </h2>

          {/* Role Tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              background: 'rgba(0, 0, 0, 0.08)',
              borderRadius: '12px',
              padding: '4px',
              marginBottom: '24px'
            }}
          >
            {['მშობელი', 'პედაგოგი', 'ადმინისტრაცია'].map((tab) => (
              <button
                key={tab}
                onClick={() => setRoleTab(tab)}
                style={{
                  background: roleTab === tab ? '#d4af37' : 'transparent',
                  color: roleTab === tab ? '#1a1104' : '#554245',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 0',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ color: '#dc2626', fontSize: '0.82rem', marginBottom: '14px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                color="#786669"
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="email"
                placeholder="ელ-ფოსტა"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.65)',
                  border: '1px solid #d4c8be',
                  borderRadius: '12px',
                  padding: '13px 16px 13px 46px',
                  color: '#1a1215',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                color="#786669"
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="პაროლი"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.65)',
                  border: '1px solid #d4c8be',
                  borderRadius: '12px',
                  padding: '13px 46px 13px 46px',
                  color: '#1a1215',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#786669',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', color: '#554245' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#d4af37' }}
                />
                <span>დამიმახსოვრე</span>
              </label>

              <a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#554245', textDecoration: 'none' }}>
                დაგავიწყდათ პაროლი?
              </a>
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                marginTop: '10px',
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(180deg, #d4af37 0%, #b88628 100%)',
                color: '#1a1104',
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: '1rem',
                fontWeight: 700,
                border: 'none',
                boxShadow: '0 8px 25px rgba(184, 134, 40, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            >
              შესვლა
            </button>

            {/* Registration Footer */}
            <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#554245', marginTop: '10px' }}>
              არ გაქვთ ანგარიში?{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('set-auth-mode', { detail: { mode: 'register' } }));
                    const el = document.getElementById('admissions');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                style={{ color: '#b88628', fontWeight: 700, textDecoration: 'underline' }}
              >
                რეგისტრაცია
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
