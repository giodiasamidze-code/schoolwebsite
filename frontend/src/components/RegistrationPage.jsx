import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { User, Phone, Mail, Lock, ArrowLeft, Info, LogIn, UserPlus, Key, BookOpen, ShieldCheck } from 'lucide-react';

export default function RegistrationPage() {
  const auth = useAuth();
  
  // Detect if query or state requested specific mode
  const [authMode, setAuthMode] = useState('parent_register'); // 'parent_register', 'teacher_register', 'admin_login', 'login'

  useEffect(() => {
    if (window.location.hash === '#admin' || window.location.search.includes('mode=admin')) {
      setAuthMode('admin_login');
    }
  }, []);

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subject, setSubject] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  // Status & Error
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isFromForm = !!auth.pendingFormSubmit;

  const handlePostAuthNavigation = () => {
    if (auth.pendingFormSubmit) {
      auth.navigate('/');
      setTimeout(() => {
        const targetId = '#admissions';
        const element = document.querySelector(targetId);
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 150);
    } else {
      auth.navigate('/');
    }
  };

  const handleParentRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name || !phone || !email || !password) {
      setErrorMessage('გთხოვთ შეავსოთ ყველა სავალდებულო ველები.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს.');
      return;
    }

    setLoading(true);
    try {
      const result = await auth.register({ email, password, fullName: name, phone });
      
      // If session is null, Supabase requires email confirmation
      if (!result?.session) {
        setSuccessMessage('✅ რეგისტრაცია მიღებულია! გთხოვთ შეამოწმოთ თქვენი ელ-ფოსტა (' + email + ') და დაადასტუროთ ანგარიში.');
        return;
      }

      setSuccessMessage('მშობლის რეგისტრაცია წარმატებით დასრულდა!');
      setTimeout(() => {
        handlePostAuthNavigation();
      }, 800);
    } catch (err) {
      console.error('Registration error full:', err);
      let message = 'შეცდომა: ' + (err.message || 'უცნობი შეცდომა');
      if (err.message?.includes('already registered') || err.message?.includes('User already registered')) {
        message = 'ეს ელ-ფოსტა უკვე რეგისტრირებულია. სცადეთ "შესვლა" tab-ი.';
      } else if (err.message?.includes('invalid') || err.message?.includes('Invalid')) {
        message = 'არასწორი ელ-ფოსტის ან პაროლის ფორმატი.';
      } else if (err.message?.includes('rate limit') || err.message?.includes('over_email_send_rate_limit')) {
        message = 'ძალიან ბევრი მცდელობა. გთხოვთ 1 საათის შემდეგ სცადოთ ხელახლა.';
      } else if (err.message?.includes('already been registered')) {
        message = 'ეს ელ-ფოსტა უკვე რეგისტრირებულია. სცადეთ "შესვლა" tab-ი.';
      }
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name || !email || !password || !subject || !inviteCode) {
      setErrorMessage('გთხოვთ შეავსოთ ყველა სავალდებულო ველები (სახელი, საგანი, ელ-ფოსტა, პაროლი, მოწვევის კოდი).');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს.');
      return;
    }

    setLoading(true);
    try {
      await auth.registerTeacher({
        email,
        password,
        fullName: name,
        phone,
        subject,
        inviteCode
      });
      setSuccessMessage('მასწავლებლის რეგისტრაცია წარმატებულია! გადამისამართება...');
    } catch (err) {
      console.error('Teacher registration error:', err);
      let message = err.message || err.msg || (typeof err === 'string' ? err : JSON.stringify(err, Object.getOwnPropertyNames(err)));
      if (err.message?.includes('already registered') || err.message?.includes('User already registered')) {
        message = 'ეს ელ-ფოსტა უკვე გამოყენებულია. სხვა email სცადეთ ან "შესვლა" tab-ი.';
      } else if (!message || message === '{}') {
        message = 'Supabase-ის შეცდომა. შეამოწმეთ კონსოლი (F12) ან სცადეთ სხვა email-ით.';
      }
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('გთხოვთ შეიყვანოთ ელ-ფოსტა და პაროლი.');
      return;
    }

    setLoading(true);
    try {
      await auth.login(email, password);
      setSuccessMessage('ავტორიზაცია წარმატებულია!');
      setTimeout(() => {
        if (auth.role === 'admin') {
          auth.navigate('/admin-dashboard');
        } else if (auth.role === 'teacher') {
          auth.navigate('/teacher-dashboard');
        } else {
          handlePostAuthNavigation();
        }
      }, 800);
    } catch (err) {
      console.error('Login error:', err);
      let message = 'ავტორიზაციის შეცდომა. შეამოწმეთ ელ-ფოსტა და პაროლი.';
      if (err.message?.includes('Invalid login credentials')) {
        message = 'არასწორი ელ-ფოსტა ან პაროლი.';
      }
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container fade-in">
      <div className="registration-card" style={{ maxWidth: '480px' }}>
        <button className="back-link-btn" onClick={() => auth.navigate('/')}>
          <ArrowLeft size={16} className="icon-mr" />
          მთავარ გვერდზე დაბრუნება
        </button>

        {/* Tab switchers */}
        <div className="auth-tabs" style={{ display: 'flex', gap: '6px', marginBottom: '24px', borderBottom: '2px solid var(--border-color, #e2e8f0)', paddingBottom: '12px' }}>
          <button
            type="button"
            className={`btn ${authMode === 'parent_register' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, fontSize: '0.8rem', padding: '8px 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
            onClick={() => { setAuthMode('parent_register'); setErrorMessage(''); setSuccessMessage(''); }}
          >
            <UserPlus size={14} />
            მშობელი
          </button>
          <button
            type="button"
            className={`btn ${authMode === 'teacher_register' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, fontSize: '0.8rem', padding: '8px 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
            onClick={() => { setAuthMode('teacher_register'); setErrorMessage(''); setSuccessMessage(''); }}
          >
            <BookOpen size={14} />
            მასწავლებელი
          </button>
          <button
            type="button"
            className={`btn ${authMode === 'login' || authMode === 'admin_login' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, fontSize: '0.8rem', padding: '8px 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
            onClick={() => { setAuthMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
          >
            <LogIn size={14} />
            შესვლა
          </button>
        </div>

        <span className="section-eyebrow text-center w-full block">
          {authMode === 'admin_login'
            ? 'ადმინისტრაციის შესვლა'
            : authMode === 'login'
            ? 'ავტორიზაცია'
            : authMode === 'teacher_register'
            ? 'მასწავლებლის რეგისტრაცია'
            : 'მშობლის რეგისტრაცია'}
        </span>

        <h2 className="registration-title text-center" style={{ fontSize: '1.5rem', marginBottom: '16px' }}>
          {authMode === 'admin_login'
            ? 'სკოლის დირექციის შესვლა'
            : authMode === 'login'
            ? 'შედით თქვენს პროფილში'
            : authMode === 'teacher_register'
            ? 'მასწავლებლის ანგარიშის შექმნა'
            : 'შექმენით მშობლის პროფილი'}
        </h2>

        {authMode === 'admin_login' && (
          <div className="auth-alert-message" style={{ marginBottom: '16px', background: 'rgba(128,0,32,0.08)', borderLeft: '3px solid var(--accent-primary)' }}>
            <ShieldCheck size={18} className="text-burgundy flex-shrink-0" />
            <p style={{ fontSize: '0.85rem' }}>
              ადმინისტრაციული ანგარიშით შესვლა. ადმინ მომხმარებელი იქმნება მონაცემთა ბაზაში.
            </p>
          </div>
        )}

        {authMode === 'teacher_register' && (
          <div className="auth-alert-message" style={{ marginBottom: '16px', background: 'rgba(201, 117, 29, 0.08)', borderLeft: '3px solid var(--accent-gold, #c9751d)' }}>
            <Key size={18} style={{ color: '#c9751d' }} className="flex-shrink-0" />
            <p style={{ fontSize: '0.85rem' }}>
              მასწავლებლის რეგისტრაციისთვის საჭიროა სკოლის მიერ მოწოდებული **მოწვევის კოდი (Invite Code)**.
            </p>
          </div>
        )}

        {isFromForm && authMode === 'parent_register' && (
          <div className="auth-alert-message" style={{ marginBottom: '16px' }}>
            <Info size={18} className="text-burgundy flex-shrink-0" />
            <p style={{ fontSize: '0.85rem' }}>განაცხადის გასაგზავნად საჭიროა ავტორიზაცია/რეგისტრაცია.</p>
          </div>
        )}

        {errorMessage && (
          <div className="form-feedback error" style={{ marginBottom: '16px', padding: '12px', borderRadius: '8px', background: '#fee2e2', color: '#991b1b', fontSize: '0.9rem' }}>
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="form-feedback success" style={{ marginBottom: '16px', padding: '12px', borderRadius: '8px', background: '#dcfce7', color: '#166534', fontSize: '0.9rem' }}>
            {successMessage}
          </div>
        )}

        {/* 1. PARENT REGISTRATION FORM */}
        {authMode === 'parent_register' && (
          <form onSubmit={handleParentRegister} className="registration-form">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">სახელი და გვარი *</label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input
                  id="reg-name"
                  type="text"
                  required
                  className="form-control"
                  placeholder="თქვენი სახელი და გვარი..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-phone">ტელეფონი *</label>
              <div className="input-with-icon">
                <Phone size={16} className="input-icon" />
                <input
                  id="reg-phone"
                  type="tel"
                  required
                  className="form-control"
                  placeholder="მაგ: 599 12 34 56"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">ელ-ფოსტა *</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  id="reg-email"
                  type="email"
                  required
                  className="form-control"
                  placeholder="mail@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">პაროლი *</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  id="reg-password"
                  type="password"
                  required
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-4">
              {loading ? 'რეგისტრაცია...' : 'მშობლის პროფილის შექმნა'}
            </button>
          </form>
        )}

        {/* 2. TEACHER REGISTRATION FORM WITH INVITE CODE */}
        {authMode === 'teacher_register' && (
          <form onSubmit={handleTeacherRegister} className="registration-form">
            <div className="form-group">
              <label className="form-label" htmlFor="teacher-invite-code">მოწვევის კოდი (Invite Code) *</label>
              <div className="input-with-icon">
                <Key size={16} className="input-icon" style={{ color: '#c9751d' }} />
                <input
                  id="teacher-invite-code"
                  type="text"
                  required
                  className="form-control"
                  placeholder="მაგ: TEACHER2026"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="teacher-name">სახელი და გვარი *</label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input
                  id="teacher-name"
                  type="text"
                  required
                  className="form-control"
                  placeholder="პედაგოგის სახელი და გვარი..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="teacher-subject">საგანი / მიმართულება *</label>
              <div className="input-with-icon">
                <BookOpen size={16} className="input-icon" />
                <input
                  id="teacher-subject"
                  type="text"
                  required
                  className="form-control"
                  placeholder="მაგ: მათემატიკა, ფიზიკა..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="teacher-phone">ტელეფონი</label>
              <div className="input-with-icon">
                <Phone size={16} className="input-icon" />
                <input
                  id="teacher-phone"
                  type="tel"
                  className="form-control"
                  placeholder="მაგ: 599 12 34 56"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="teacher-email">ელ-ფოსტა *</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  id="teacher-email"
                  type="email"
                  required
                  className="form-control"
                  placeholder="teacher@solomon.ge"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="teacher-password">პაროლი *</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  id="teacher-password"
                  type="password"
                  required
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-4">
              {loading ? 'მოწმება...' : 'მასწავლებლის რეგისტრაცია'}
            </button>
          </form>
        )}

        {/* 3. LOGIN FORM (Supports parent, teacher, admin) */}
        {(authMode === 'login' || authMode === 'admin_login') && (
          <form onSubmit={handleLogin} className="registration-form">
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">ელ-ფოსტა *</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  id="login-email"
                  type="email"
                  required
                  className="form-control"
                  placeholder="mail@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">პაროლი *</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  id="login-password"
                  type="password"
                  required
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-4">
              {loading ? 'შესვლა...' : authMode === 'admin_login' ? 'ადმინისტრატორის შესვლა' : 'სისტემაში შესვლა'}
            </button>

            {authMode !== 'admin_login' && (
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setAuthMode('admin_login')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  ადმინისტრაციის შესვლა (დირექცია)
                </button>
              </div>
            )}
          </form>
        )}


      </div>
    </div>
  );
}
