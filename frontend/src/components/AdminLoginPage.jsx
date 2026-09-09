import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Key, User, BookOpen, CheckCircle2, AlertTriangle, Phone } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function AdminLoginPage() {
  const { login, navigate, registerTeacher } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [roleTab, setRoleTab] = useState('პედაგოგი'); // 'მშობელი' | 'პედაგოგი' | 'ადმინისტრაცია'

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [subject, setSubject] = useState('');
  const [phone, setPhone] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

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
      if (roleTab === 'ადმინისტრაცია') {
        if (typeof login === 'function') {
          try { await login({ email, name: 'ადმინისტრატორი', role: 'admin' }); } catch { }
        }
        navigate('/admin-dashboard');
      } else if (roleTab === 'პედაგოგი') {
        if (typeof login === 'function') {
          try { await login({ email, name: 'პედაგოგი', role: 'teacher' }); } catch { }
        }
        navigate('/teacher-dashboard');
      } else {
        if (typeof login === 'function') {
          try { await login({ email, name: 'მშობელი', role: 'parent' }); } catch { }
        }
        navigate('/parent-account');
      }
    } catch (err) {
      setError(err.message || 'ავტორიზაცია ვერ მოხერხდა');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (roleTab === 'ადმინისტრაცია') {
      setError('ადმინისტრატორის ანგარიშის რეგისტრაცია დახურულია. გამოიყენეთ „შესვლა“.');
      return;
    }

    if (!email || !password || !fullName) {
      setError('გთხოვთ შეავსოთ ყველა სავალდებულო ველი');
      return;
    }

    if (password.length < 6) {
      setError('პაროლი უნდა შედგებოდეს მინიმუმ 6 სიმბოლოსგან');
      return;
    }

    if (roleTab === 'პედაგოგი') {
      if (!inviteCode.trim()) {
        setError('პედაგოგის რეგისტრაციისთვის მოწვევის გასაღები (Invite Code) სავალდებულოა!');
        return;
      }
      if (!subject.trim()) {
        setError('გთხოვთ მიუთითოთ საგანი / მიმართულება');
        return;
      }

      setLoading(true);
      try {
        if (typeof registerTeacher === 'function') {
          await registerTeacher({ email, password, fullName, phone, subject, inviteCode });
        } else {
          // Local fallback verification
          const cleanCode = inviteCode.trim().toUpperCase();
          const validStandardCodes = ['TEACHER2026', 'SOLOMON-TEACHER', 'SOLOMON2026'];
          let localCodes = [];
          try {
            localCodes = JSON.parse(localStorage.getItem('academy_invite_codes') || '[]');
          } catch { }

          const matched = localCodes.find((c) => c.code?.toUpperCase() === cleanCode && c.is_active);
          const isStandard = validStandardCodes.includes(cleanCode);

          if (!matched && !isStandard) {
            throw new Error('მოწვევის გასაღები არასწორია ან უკვე გამოყენებულია.');
          }

          if (matched) {
            matched.is_active = false;
            matched.used_by = fullName;
            try { localStorage.setItem('academy_invite_codes', JSON.stringify(localCodes)); } catch { }
          }
        }

        setSuccess('პედაგოგი წარმატებით დარეგისტრირდა! გადამისამართება...');
        setTimeout(() => {
          navigate('/teacher-dashboard');
        }, 1000);
      } catch (err) {
        setError(err.message || 'რეგისტრაცია ვერ მოხერხდა');
      } finally {
        setLoading(false);
      }
    } else {
      // Parent registration
      setSuccess('მშობლის პროფილი წარმატებით შეიქმნა!');
      setTimeout(() => {
        navigate('/parent-account');
      }, 1000);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden',
        backgroundImage: `linear-gradient(180deg, rgba(12, 6, 8, 0.45) 0%, rgba(12, 6, 8, 0.65) 100%), url(/assets/palace-interior.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 20px',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif'
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
        {/* Left Side */}
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
              {authMode === 'login' ? (
                <>კეთილი იყოს<br />თქვენი დაბრუნება</>
              ) : (
                <>შემოგვიერთდით<br />სოლომონ აკადემიაში</>
              )}
            </h1>
            <p
              style={{
                fontSize: 'clamp(1rem, 1.4vw, 1.25rem)',
                color: 'rgba(255, 255, 255, 0.85)',
                letterSpacing: '0.02em',
                maxWidth: '480px',
                lineHeight: 1.5
              }}
            >
              {authMode === 'login'
                ? 'მოემზადეთ მომავლისთვის ღირსეულად — აკადემიის ერთიანი საინფორმაციო სივრცე.'
                : 'პედაგოგთა და მშობელთა ერთიანი ციფრული სივრცე და ელექტრონული ჟურნალი.'}
            </p>
          </div>

          {/* Bottom Left: მთავარი -> */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                padding: '10px 18px',
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
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'; e.currentTarget.style.color = '#ffffff'; }}
            >
              <span>მთავარ გვერდზე დაბრუნება</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Right Glassmorphic Card */}
        <div
          style={{
            background: 'rgba(240, 235, 230, 0.92)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '24px',
            padding: '36px 32px',
            color: '#1a1215',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)'
          }}
        >
          {/* Card Header with Title and Mode Switcher */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                fontSize: '1.9rem',
                fontWeight: 700,
                color: '#1a1215',
                margin: 0
              }}
            >
              {authMode === 'login' ? 'შესვლა' : 'რეგისტრაცია'}
            </h2>

            {/* Top Mode Pills */}
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.06)', borderRadius: '10px', padding: '3px' }}>
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setError(''); setSuccess(''); }}
                style={{
                  background: authMode === 'login' ? '#d4af37' : 'transparent',
                  color: authMode === 'login' ? '#1a1104' : '#554245',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '5px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                შესვლა
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setError(''); setSuccess(''); }}
                style={{
                  background: authMode === 'register' ? '#d4af37' : 'transparent',
                  color: authMode === 'register' ? '#1a1104' : '#554245',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '5px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                რეგისტრაცია
              </button>
            </div>
          </div>

          {/* Role Tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              background: 'rgba(0, 0, 0, 0.08)',
              borderRadius: '12px',
              padding: '4px',
              marginBottom: '20px'
            }}
          >
            {['მშობელი', 'პედაგოგი', 'ადმინისტრაცია'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setRoleTab(tab);
                  setError('');
                  setSuccess('');
                  if (tab === 'ადმინისტრაცია' && authMode === 'register') {
                    setAuthMode('login');
                  }
                }}
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
            <div style={{ color: '#dc2626', background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.25)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.82rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{ color: '#16a34a', background: 'rgba(22, 163, 74, 0.12)', border: '1px solid rgba(22, 163, 74, 0.3)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.82rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────────
              1. LOGIN FORM
              ─────────────────────────────────────────────────────────────────── */}
          {authMode === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                    background: 'rgba(255, 255, 255, 0.75)',
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
                    background: 'rgba(255, 255, 255, 0.75)',
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

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  marginTop: '8px',
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
                  transition: 'all 0.25s ease',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'შესვლა...' : 'შესვლა'}
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#554245', marginTop: '8px' }}>
                არ გაქვთ ანგარიში?{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setAuthMode('register');
                    setError('');
                  }}
                  style={{ color: '#b88628', fontWeight: 700, textDecoration: 'underline' }}
                >
                  რეგისტრაცია
                </a>
              </div>
            </form>
          )}

          {/* ───────────────────────────────────────────────────────────────────
              2. REGISTRATION FORM (With Invite Code for Teachers)
              ─────────────────────────────────────────────────────────────────── */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              {/* TEACHER INVITE CODE FIELD (Highlighted with Gold) */}
              {roleTab === 'პედაგოგი' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#8a6207', marginBottom: '5px' }}>
                    მოსაწვევი გასაღები (INVITE CODE) *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Key
                      size={18}
                      color="#b88628"
                      style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <input
                      type="text"
                      required
                      placeholder="მაგ: SOL-2026-XXXXX ან TEACHER2026"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '2px solid #d4af37',
                        borderRadius: '12px',
                        padding: '12px 16px 12px 46px',
                        color: '#1a1215',
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        letterSpacing: '0.04em',
                        outline: 'none',
                        boxShadow: '0 0 12px rgba(212, 175, 55, 0.25)'
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#786669', marginTop: '4px' }}>
                    შეიყვანეთ ადმინისტრაციის მიერ გაცემული ერთჯერადი გასაღები
                  </div>
                </div>
              )}

              {/* Full Name */}
              <div style={{ position: 'relative' }}>
                <User
                  size={18}
                  color="#786669"
                  style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="text"
                  required
                  placeholder={roleTab === 'პედაგოგი' ? 'პედაგოგის სახელი და გვარი' : 'მშობლის სახელი და გვარი'}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.75)',
                    border: '1px solid #d4c8be',
                    borderRadius: '12px',
                    padding: '12px 16px 12px 46px',
                    color: '#1a1215',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Subject (for teacher) */}
              {roleTab === 'პედაგოგი' && (
                <div style={{ position: 'relative' }}>
                  <BookOpen
                    size={18}
                    color="#786669"
                    style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="text"
                    required
                    placeholder="საგანი / მიმართულება (მაგ: მათემატიკა, STEM)"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.75)',
                      border: '1px solid #d4c8be',
                      borderRadius: '12px',
                      padding: '12px 16px 12px 46px',
                      color: '#1a1215',
                      fontSize: '0.92rem',
                      outline: 'none'
                    }}
                  />
                </div>
              )}

              {/* Phone (for parent or teacher) */}
              <div style={{ position: 'relative' }}>
                <Phone
                  size={18}
                  color="#786669"
                  style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="tel"
                  placeholder="საკონტაქტო ტელეფონი"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.75)',
                    border: '1px solid #d4c8be',
                    borderRadius: '12px',
                    padding: '12px 16px 12px 46px',
                    color: '#1a1215',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Email */}
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  color="#786669"
                  style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="email"
                  required
                  placeholder="ელ-ფოსტის მისამართი"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.75)',
                    border: '1px solid #d4c8be',
                    borderRadius: '12px',
                    padding: '12px 16px 12px 46px',
                    color: '#1a1215',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Password */}
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  color="#786669"
                  style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="პაროლი (მინ. 6 სიმბოლო)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.75)',
                    border: '1px solid #d4c8be',
                    borderRadius: '12px',
                    padding: '12px 46px 12px 46px',
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

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  marginTop: '8px',
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
                  transition: 'all 0.25s ease',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'რეგისტრაცია...' : roleTab === 'პედაგოგი' ? 'პედაგოგის რეგისტრაცია' : 'მშობლის რეგისტრაცია'}
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#554245', marginTop: '8px' }}>
                უკვე გაქვთ ანგარიში?{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setAuthMode('login');
                    setError('');
                  }}
                  style={{ color: '#b88628', fontWeight: 700, textDecoration: 'underline' }}
                >
                  შესვლა
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
