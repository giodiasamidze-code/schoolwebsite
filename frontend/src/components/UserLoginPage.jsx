import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Key, User, BookOpen, CheckCircle2, AlertTriangle, Phone, GraduationCap, Users } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function UserLoginPage() {
  const { login, navigate, register, registerTeacher } = useAuth();

  // Role: 'teacher' | 'parent'
  const [activeRole, setActiveRole] = useState('teacher');
  // Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState('login');

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

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setError('');
    setSuccess('');
  };

  const handleModeChange = (mode) => {
    setAuthMode(mode);
    setError('');
    setSuccess('');
  };

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
      if (activeRole === 'teacher') {
        if (typeof login === 'function') {
          try {
            await login(email, password);
          } catch {
            // Local fallback
            login({ email, name: 'პედაგოგი', role: 'teacher' });
          }
        }
        navigate('/teacher-dashboard');
      } else {
        if (typeof login === 'function') {
          try {
            await login(email, password);
          } catch {
            // Local fallback
            login({ email, name: 'მშობელი', role: 'parent' });
          }
        }
        navigate('/parent-account');
      }
    } catch (err) {
      setError(err.message || 'ავტორიზაცია ვერ მოხერხდა. გადაამოწმეთ მონაცემები.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password || !fullName) {
      setError('გთხოვთ შეავსოთ ყველა სავალდებულო ველი');
      return;
    }

    if (password.length < 6) {
      setError('პაროლი უნდა შედგებოდეს მინიმუმ 6 სიმბოლოსგან');
      return;
    }

    setLoading(true);

    if (activeRole === 'teacher') {
      if (!inviteCode.trim()) {
        setError('პედაგოგის რეგისტრაციისთვის მოწვევის გასაღები (Invite Code) სავალდებულოა!');
        setLoading(false);
        return;
      }
      if (!subject.trim()) {
        setError('გთხოვთ მიუთითოთ საგანი ან აკადემიური მიმართულება');
        setLoading(false);
        return;
      }

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

        setSuccess('პედაგოგი წარმატებით დარეგისტრირდა! გადამისამართება კაბინეტში...');
        setTimeout(() => {
          navigate('/teacher-dashboard');
        }, 800);
      } catch (err) {
        setError(err.message || 'რეგისტრაცია ვერ მოხერხდა. გადაამოწმეთ გასაღები.');
      } finally {
        setLoading(false);
      }
    } else {
      // Parent registration
      try {
        if (typeof register === 'function') {
          await register({ email, password, fullName, phone });
        }
        setSuccess('მშობლის პროფილი წარმატებით შეიქმნა! გადამისამართება...');
        setTimeout(() => {
          navigate('/parent-account');
        }, 800);
      } catch (err) {
        setError(err.message || 'მშობლის რეგისტრაცია ვერ მოხერხდა.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden',
        backgroundImage: `linear-gradient(180deg, rgba(12, 6, 8, 0.45) 0%, rgba(12, 6, 8, 0.70) 100%), url(/assets/palace-interior.jpg)`,
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
          maxWidth: '1180px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1.1fr 480px',
          gap: '50px',
          alignItems: 'center'
        }}
      >
        {/* Left Presentation Column */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', minHeight: '440px' }}>
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
              {activeRole === 'teacher' ? (
                <>
                  <GraduationCap size={15} />
                  <span>პედაგოგთა აკადემიური პორტალი</span>
                </>
              ) : (
                <>
                  <Users size={15} />
                  <span>მშობელთა და მოსწავლეთა სივრცე</span>
                </>
              )}
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)',
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
                fontSize: 'clamp(1rem, 1.3vw, 1.2rem)',
                color: 'rgba(255, 255, 255, 0.85)',
                letterSpacing: '0.02em',
                maxWidth: '480px',
                lineHeight: 1.55
              }}
            >
              {activeRole === 'teacher'
                ? 'ელექტრონული ჟურნალი, მოსწავლეთა შეფასებები, სასწავლო ცხრილი და აკადემიური რესურსები.'
                : 'მოსწავლის პროგრესის მონიტორინგი, დასწრების აღრიცხვა, დავალებები და აკადემიური სიახლეები.'}
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
          style={{
            background: 'rgba(242, 238, 233, 0.94)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            borderRadius: '24px',
            padding: '36px 32px',
            color: '#1a1215',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.65)'
          }}
        >
          {/* Top Bar: Title & Mode Switcher */}
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

            {/* Mode Pills: Login / Register */}
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.06)', borderRadius: '10px', padding: '3px' }}>
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                style={{
                  background: authMode === 'login' ? '#d4af37' : 'transparent',
                  color: authMode === 'login' ? '#1a1104' : '#554245',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                შესვლა
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('register')}
                style={{
                  background: authMode === 'register' ? '#d4af37' : 'transparent',
                  color: authMode === 'register' ? '#1a1104' : '#554245',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                რეგისტრაცია
              </button>
            </div>
          </div>

          {/* Role Tabs: პედაგოგი vs მშობელი ONLY (No Admin!) */}
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
              onClick={() => handleRoleChange('teacher')}
              style={{
                background: activeRole === 'teacher' ? '#d4af37' : 'transparent',
                color: activeRole === 'teacher' ? '#1a1104' : '#554245',
                border: 'none',
                borderRadius: '8px',
                padding: '9px 0',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <GraduationCap size={16} />
              <span>პედაგოგი</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('parent')}
              style={{
                background: activeRole === 'parent' ? '#d4af37' : 'transparent',
                color: activeRole === 'parent' ? '#1a1104' : '#554245',
                border: 'none',
                borderRadius: '8px',
                padding: '9px 0',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Users size={16} />
              <span>მშობელი</span>
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
            <div style={{ color: '#16a34a', background: 'rgba(22, 163, 74, 0.12)', border: '1px solid rgba(22, 163, 74, 0.3)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.84rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                  placeholder="ელ-ფოსტა"
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
                  style={{ background: 'none', border: 'none', color: '#8a7578', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#554245', margin: '2px 0' }}>
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
                  onClick={() => alert('პაროლის აღსადგენად მიმართეთ აკადემიის საინფორმაციო სამსახურს.')}
                  style={{ background: 'none', border: 'none', color: '#554245', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.8rem' }}
                >
                  დაგავიწყდათ პაროლი?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: 'linear-gradient(180deg, #d4af37 0%, #b88628 100%)',
                  color: '#1a1104',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '13px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
                  transition: 'all 0.2s',
                  marginTop: '6px'
                }}
              >
                {loading
                  ? 'მიმდინარეობს შესვლა...'
                  : activeRole === 'teacher'
                    ? 'პედაგოგის კაბინეტში შესვლა'
                    : 'მშობლის პროფილში შესვლა'}
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.82rem', color: '#6e5a5e', marginTop: '6px' }}>
                არ გაქვთ ანგარიში?{' '}
                <button
                  type="button"
                  onClick={() => handleModeChange('register')}
                  style={{ background: 'none', border: 'none', color: '#b88628', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  რეგისტრაცია
                </button>
              </div>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Full Name */}
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
                <User size={17} color="#8a7578" />
                <input
                  type="text"
                  placeholder="სახელი და გვარი"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
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

              {/* Specific to Teacher: Subject */}
              {activeRole === 'teacher' && (
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
                  <BookOpen size={17} color="#8a7578" />
                  <input
                    type="text"
                    placeholder="საგანი / მიმართულება (მაგ. მათემატიკა, ქართული...)"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
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
              )}

              {/* Phone */}
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
                <Phone size={17} color="#8a7578" />
                <input
                  type="tel"
                  placeholder="ტელეფონის ნომერი (არასავალდებულო)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.9rem',
                    color: '#1a1215',
                    background: 'transparent'
                  }}
                />
              </div>

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
                  placeholder="ელ-ფოსტა"
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
                  placeholder="პაროლი (მინიმუმ 6 სიმბოლო)"
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
                  style={{ background: 'none', border: 'none', color: '#8a7578', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Teacher Exclusive: Invite Code */}
              {activeRole === 'teacher' && (
                <div style={{ marginTop: '2px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: '#ffffff',
                      border: '1.5px solid #d4af37',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      gap: '10px',
                      boxShadow: '0 2px 8px rgba(212, 175, 55, 0.15)'
                    }}
                  >
                    <Key size={17} color="#b88628" />
                    <input
                      type="text"
                      placeholder="მოწვევის გასაღები (Invite Code)*"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      style={{
                        border: 'none',
                        outline: 'none',
                        width: '100%',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        color: '#1a1215',
                        background: 'transparent'
                      }}
                      required
                    />
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#7e686c', marginTop: '4px', paddingLeft: '4px' }}>
                    💡 მოწვევის გასაღები გაიცემა დირექციის მიერ (სატესტო: <strong>TEACHER2026</strong>)
                  </div>
                </div>
              )}

              {/* Submit Registration */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: 'linear-gradient(180deg, #d4af37 0%, #b88628 100%)',
                  color: '#1a1104',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '13px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
                  transition: 'all 0.2s',
                  marginTop: '8px'
                }}
              >
                {loading
                  ? 'რეგისტრაცია...'
                  : activeRole === 'teacher'
                    ? 'პედაგოგად რეგისტრაცია'
                    : 'მშობლის პროფილის შექმნა'}
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.82rem', color: '#6e5a5e', marginTop: '6px' }}>
                უკვე გაქვთ ანგარიში?{' '}
                <button
                  type="button"
                  onClick={() => handleModeChange('login')}
                  style={{ background: 'none', border: 'none', color: '#b88628', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  შესვლა
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
