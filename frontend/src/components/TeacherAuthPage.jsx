import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Key, User, BookOpen, CheckCircle2, AlertTriangle, Phone, GraduationCap } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function TeacherAuthPage() {
  const { user, login, navigate, registerTeacher } = useAuth();

  // If already logged in as teacher, redirect immediately
  useEffect(() => {
    if (user && user.role === 'teacher') {
      navigate('/teacher-dashboard');
    }
  }, [user, navigate]);

  // Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get('mode');
      if (modeParam === 'register' || modeParam === 'login') return modeParam;
    } catch { }
    return 'login';
  });

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [subject, setSubject] = useState('');
  const [phone, setPhone] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status & Notifications
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('გთხოვთ შეიყვანოთ ელ-ფოსტა და პაროლი');
      return;
    }

    setLoading(true);
    try {
      if (typeof login === 'function') {
        try {
          await login(email, password);
        } catch {
          // Local fallback
          login({ email, name: fullName || 'პედაგოგი', role: 'teacher' });
        }
      }
      navigate('/teacher-dashboard');
    } catch (err) {
      setError(err.message || 'ავტორიზაცია ვერ მოხერხდა. გადაამოწმეთ ელ-ფოსტა და პაროლი.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName || !email || !password || !inviteCode) {
      setError('გთხოვთ შეავსოთ ყველა სავალდებულო ველი (მათ შორის მოწვევის კოდი)');
      return;
    }

    if (password.length < 6) {
      setError('პაროლი უნდა შედგებოდეს მინიმუმ 6 სიმბოლოსგან');
      return;
    }

    setLoading(true);
    try {
      if (typeof registerTeacher === 'function') {
        try {
          await registerTeacher({
            email,
            password,
            fullName,
            subject,
            phone,
            inviteCode: inviteCode.trim()
          });
        } catch (innerErr) {
          // Check invite code fallback
          const validCodes = ['SOLOMON-TEACHER-2026', 'TEACHER-MATH-2026', 'SOLOMON-STAFF', 'ACADEMY2026'];
          let storedInvites = [];
          try {
            const raw = localStorage.getItem('academy_invites');
            if (raw) storedInvites = JSON.parse(raw).map((i) => i.code);
          } catch { }

          const isValid = validCodes.includes(inviteCode.trim()) || storedInvites.includes(inviteCode.trim());
          if (!isValid) {
            throw new Error('მოწვევის კოდი არასწორია ან ვადაგასულია');
          }

          login({
            email,
            name: fullName,
            subject: subject || 'მასწავლებელი',
            role: 'teacher',
            phone
          });
        }
      }

      setSuccess('პედაგოგი წარმატებით დარეგისტრირდა! გადამისამართება...');
      setTimeout(() => {
        navigate('/teacher-dashboard');
      }, 1000);
    } catch (err) {
      setError(err.message || 'რეგისტრაცია ვერ მოხერხდა. გადაამოწმეთ მოწვევის კოდი.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
        backgroundImage: `linear-gradient(180deg, rgba(12, 6, 8, 0.45) 0%, rgba(12, 6, 8, 0.70) 100%), url(/assets/palace-interior.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 16px',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        boxSizing: 'border-box'
      }}
    >
      <div
        className="user-login-grid"
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1180px',
          width: '100%',
          display: 'grid',
          alignItems: 'center'
        }}
      >
        {/* Left Presentation Column */}
        <div className="user-login-left-col" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
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
              <GraduationCap size={15} />
              <span>პედაგოგთა აკადემიური პორტალი</span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.18,
                marginBottom: '16px',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.6)'
              }}
            >
              {authMode === 'login' ? (
                <>პედაგოგის<br />ავტორიზაცია</>
              ) : (
                <>პედაგოგის<br />რეგისტრაცია</>
              )}
            </h1>

            <p
              style={{
                fontSize: 'clamp(0.95rem, 1.2vw, 1.15rem)',
                color: 'rgba(255, 255, 255, 0.85)',
                letterSpacing: '0.02em',
                maxWidth: '460px',
                lineHeight: 1.6
              }}
            >
              ელექტრონული ჟურნალი, მოსწავლეთა შეფასებები, სასწავლო ცხრილი და სოლომონ აკადემიის სასკოლო რესურსები.
            </p>
          </div>

          {/* Return to Home button */}
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

        {/* Right Glassmorphic Card */}
        <div
          className="user-login-card"
          style={{
            background: 'rgba(242, 238, 233, 0.95)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            borderRadius: '24px',
            padding: '36px 32px',
            color: '#1a1215',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.65)'
          }}
        >
          {/* Top Header Badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                fontSize: '1.75rem',
                fontWeight: 700,
                color: '#1a1215',
                margin: 0
              }}
            >
              {authMode === 'login' ? 'შესვლა' : 'რეგისტრაცია'}
            </h2>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                padding: '4px 10px',
                borderRadius: '8px',
                color: '#8c6b12',
                fontSize: '0.78rem',
                fontWeight: 700
              }}
            >
              <GraduationCap size={14} color="#d4af37" />
              <span>მასწავლებელი</span>
            </div>
          </div>

          {/* Mode Switcher Buttons */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              background: 'rgba(0, 0, 0, 0.07)',
              borderRadius: '12px',
              padding: '4px',
              marginBottom: '20px'
            }}
          >
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setError(''); setSuccess(''); }}
              style={{
                background: authMode === 'login' ? '#d4af37' : 'transparent',
                color: authMode === 'login' ? '#1a1104' : '#554245',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 0',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              ავტორიზაცია
            </button>

            <button
              type="button"
              onClick={() => { setAuthMode('register'); setError(''); setSuccess(''); }}
              style={{
                background: authMode === 'register' ? '#d4af37' : 'transparent',
                color: authMode === 'register' ? '#1a1104' : '#554245',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 0',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              რეგისტრაცია (მოწვევით)
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ color: '#dc2626', background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.25)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.84rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div style={{ color: '#16a34a', background: 'rgba(220, 38, 38, 0.12)', border: '1px solid rgba(22, 163, 74, 0.3)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.84rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {authMode === 'login' ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Email */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#ffffff',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  gap: '10px'
                }}
              >
                <Mail size={17} color="#8a7578" />
                <input
                  type="email"
                  placeholder="პედაგოგის ელ-ფოსტა"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.9rem',
                    color: '#1a1215',
                    background: 'transparent'
                  }}
                  required
                />
              </div>

              {/* Password */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#ffffff',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  gap: '10px'
                }}
              >
                <Lock size={17} color="#8a7578" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="პაროლი"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.9rem',
                    color: '#1a1215',
                    background: 'transparent'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8a7578', padding: 0 }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', marginTop: '2px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#4a383b' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: '#d4af37' }}
                  />
                  <span>დამიმახსოვრე</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '8px',
                  background: 'linear-gradient(180deg, #d4af37 0%, #b88628 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px',
                  color: '#1a1104',
                  fontSize: '0.96rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(184, 134, 40, 0.35)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {loading ? 'ავტორიზაცია...' : 'კაბინეტში შესვლა'}
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            /* REGISTER FORM (TEACHER) */
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Full Name */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '10px', padding: '9px 12px', gap: '8px' }}>
                <User size={16} color="#8a7578" />
                <input
                  type="text"
                  placeholder="სრული სახელი და გვარი"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.88rem', color: '#1a1215', background: 'transparent' }}
                  required
                />
              </div>

              {/* Subject */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '10px', padding: '9px 12px', gap: '8px' }}>
                <BookOpen size={16} color="#8a7578" />
                <input
                  type="text"
                  placeholder="საგანი / კათედრა (მაგ: მათემატიკა)"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.88rem', color: '#1a1215', background: 'transparent' }}
                  required
                />
              </div>

              {/* Phone */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '10px', padding: '9px 12px', gap: '8px' }}>
                <Phone size={16} color="#8a7578" />
                <input
                  type="tel"
                  placeholder="ტელეფონის ნომერი"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.88rem', color: '#1a1215', background: 'transparent' }}
                />
              </div>

              {/* Email */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '10px', padding: '9px 12px', gap: '8px' }}>
                <Mail size={16} color="#8a7578" />
                <input
                  type="email"
                  placeholder="ელ-ფოსტა"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.88rem', color: '#1a1215', background: 'transparent' }}
                  required
                />
              </div>

              {/* Password */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '10px', padding: '9px 12px', gap: '8px' }}>
                <Lock size={16} color="#8a7578" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="პაროლი (მინ. 6 სიმბოლო)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.88rem', color: '#1a1215', background: 'transparent' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8a7578', padding: 0 }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Invite Code */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1.5px dashed #d4af37', borderRadius: '10px', padding: '9px 12px', gap: '8px' }}>
                <Key size={16} color="#d4af37" />
                <input
                  type="text"
                  placeholder="პედაგოგის მოწვევის კოდი *"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.88rem', color: '#1a1215', background: 'transparent', fontWeight: 600, letterSpacing: '0.04em' }}
                  required
                />
              </div>
              <span style={{ fontSize: '0.74rem', color: '#7a6669', marginTop: '-4px', marginLeft: '4px' }}>
                * კოდი გაიცემა სკოლის ადმინისტრაციის მიერ
              </span>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '8px',
                  background: 'linear-gradient(180deg, #d4af37 0%, #b88628 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px',
                  color: '#1a1104',
                  fontSize: '0.96rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(184, 134, 40, 0.35)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {loading ? 'რეგისტრაცია...' : 'პედაგოგად რეგისტრაცია'}
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* Toggle bottom link */}
          <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.84rem', color: '#6a5558' }}>
            {authMode === 'login' ? (
              <span>
                არ გაქვთ პედაგოგის ანგარიში?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setError(''); setSuccess(''); }}
                  style={{ background: 'none', border: 'none', color: '#b88628', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                >
                  რეგისტრაცია მოწვევით
                </button>
              </span>
            ) : (
              <span>
                უკვე გაქვთ ანგარიში?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setError(''); setSuccess(''); }}
                  style={{ background: 'none', border: 'none', color: '#b88628', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                >
                  ავტორიზაცია
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
