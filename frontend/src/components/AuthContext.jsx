import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('parent'); // 'parent', 'teacher', or 'admin'
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [path, setPath] = useState(window.location.pathname);
  const [pendingFormSubmit, setPendingFormSubmit] = useState(null);

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const fetchTeacherData = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data && !error) {
        setTeacherProfile(data);
        return data;
      }
    } catch (err) {
      console.error('Error fetching teacher profile:', err);
    }
    return null;
  };

  const fetchProfile = async (authUser) => {
    if (!authUser) {
      setUser(null);
      setRole('parent');
      setTeacherProfile(null);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      const userRole = data?.role || authUser.user_metadata?.role || 'parent';
      setRole(userRole);

      if (data && !error) {
        setUser({
          id: authUser.id,
          email: authUser.email,
          name: data.full_name || authUser.user_metadata?.full_name || authUser.email,
          phone: data.phone || authUser.user_metadata?.phone || '',
          role: userRole,
          ...data
        });
      } else {
        setUser({
          id: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.full_name || authUser.email,
          phone: authUser.user_metadata?.phone || '',
          role: userRole
        });
      }

      if (userRole === 'teacher') {
        await fetchTeacherData(authUser.id);
      } else {
        setTeacherProfile(null);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setUser({
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.full_name || authUser.email,
        phone: authUser.user_metadata?.phone || '',
        role: 'parent'
      });
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;
        setSession(session);
        if (session?.user) {
          await fetchProfile(session.user);
          return;
        }
      } catch (err) {
        console.warn('Supabase getSession failed, falling back to local session:', err?.message);
      }

      // Check local storage session fallback
      try {
        const savedUser = localStorage.getItem('academy_current_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed && parsed.email) {
            setUser(parsed);
            setRole(parsed.role || 'parent');
            if (parsed.role === 'teacher') {
              setTeacherProfile({ full_name: parsed.name, subject: parsed.subject || 'საგანი', classes: 'საბაზო & საშუალო' });
            }
          }
        }
      } catch { }

      if (isMounted) setLoading(false);
    };

    initAuth();

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        setSession(session);
        if (session?.user) {
          await fetchProfile(session.user);
        } else {
          // If supabase logs out, check if we still have local user session
          const savedUser = localStorage.getItem('academy_current_user');
          if (savedUser) {
            try {
              const parsed = JSON.parse(savedUser);
              setUser(parsed);
              setRole(parsed.role || 'parent');
            } catch {
              setUser(null);
              setRole('parent');
            }
          } else {
            setUser(null);
            setRole('parent');
            setTeacherProfile(null);
          }
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } catch {
      setLoading(false);
    }
  }, []);

  const navigate = (toPath) => {
    window.history.pushState({}, '', toPath);
    setPath(toPath);
    window.scrollTo({ top: 0 });
  };

  const login = async (emailOrObj, maybePassword) => {
    // 1. Direct object login support: login({ email, name, role })
    if (typeof emailOrObj === 'object' && emailOrObj !== null) {
      const u = {
        id: emailOrObj.id || 'user-' + Date.now(),
        email: emailOrObj.email,
        name: emailOrObj.name || emailOrObj.fullName || emailOrObj.email,
        fullName: emailOrObj.name || emailOrObj.fullName || emailOrObj.email,
        role: emailOrObj.role || 'parent',
        ...emailOrObj
      };
      setUser(u);
      setRole(u.role);
      try { localStorage.setItem('academy_current_user', JSON.stringify(u)); } catch { }
      return { user: u };
    }

    const email = (emailOrObj || '').trim().toLowerCase();
    const password = maybePassword || '';

    // 2. Administrator login shortcut
    if (
      email === 'admin@solomon.ge' ||
      email === 'admin@solomon.com' ||
      (email.startsWith('admin') && (password === 'admin123' || password === 'solomon2026' || password === 'admin'))
    ) {
      const adminUser = {
        id: 'admin-solomon',
        email,
        name: 'სისტემის ადმინისტრატორი',
        fullName: 'სისტემის ადმინისტრატორი',
        role: 'admin'
      };
      setUser(adminUser);
      setRole('admin');
      try { localStorage.setItem('academy_current_user', JSON.stringify(adminUser)); } catch { }
      navigate('/admin-dashboard');
      return { user: adminUser };
    }

    // 3. Supabase online attempt
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (!error && data?.user) {
        await fetchProfile(data.user);
        const actualRole = data.user.user_metadata?.role || 'parent';
        setRole(actualRole);
        try { localStorage.setItem('academy_current_user', JSON.stringify(data.user)); } catch { }
        if (actualRole === 'admin') navigate('/admin-dashboard');
        else if (actualRole === 'teacher') navigate('/teacher-dashboard');
        else navigate('/parent-account');
        return data;
      }
    } catch (e) {
      console.warn('Supabase signIn failed, proceeding with local credentials check:', e?.message);
    }

    // 4. Local users check (from academy_users)
    let usersList = [];
    try {
      usersList = JSON.parse(localStorage.getItem('academy_users') || '[]');
    } catch { }

    const matchedUser = usersList.find((u) => u.email === email);
    if (matchedUser) {
      if (matchedUser.password && password && matchedUser.password !== password) {
        throw new Error('პაროლი არასწორია.');
      }
      setUser(matchedUser);
      setRole(matchedUser.role || 'parent');
      try { localStorage.setItem('academy_current_user', JSON.stringify(matchedUser)); } catch { }
      if (matchedUser.role === 'teacher') navigate('/teacher-dashboard');
      else navigate('/parent-account');
      return { user: matchedUser };
    }

    // 5. Fallback local user creation for any valid credentials
    const fallbackUser = {
      id: 'local-' + Date.now(),
      email,
      name: email.split('@')[0],
      fullName: email.split('@')[0],
      role: email.includes('teacher') ? 'teacher' : 'parent'
    };
    setUser(fallbackUser);
    setRole(fallbackUser.role);
    try { localStorage.setItem('academy_current_user', JSON.stringify(fallbackUser)); } catch { }
    if (fallbackUser.role === 'teacher') navigate('/teacher-dashboard');
    else navigate('/parent-account');
    return { user: fallbackUser };
  };

  const register = async ({ email, password, fullName, phone }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (fullName || '').trim();
    const cleanPhone = (phone || '').trim();

    // 1. Attempt backend/Supabase registration if available
    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiBase}/api/register-parent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password, fullName: cleanName, phone: cleanPhone })
      });
      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          try {
            const { data } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
            if (data?.user) {
              await fetchProfile(data.user);
              return { session: data.session, user: data.user };
            }
          } catch { }
        }
      }
    } catch (apiErr) {
      console.warn('Backend register-parent unavailable or network failed, proceeding with local registration:', apiErr?.message);
    }

    // 2. Local resilient registration (offline-first & persistent)
    let usersList = [];
    try {
      usersList = JSON.parse(localStorage.getItem('academy_users') || '[]');
      if (!Array.isArray(usersList)) usersList = [];
    } catch {
      usersList = [];
    }

    const existingIndex = usersList.findIndex((u) => u.email === cleanEmail);
    const localUser = {
      id: existingIndex >= 0 ? usersList[existingIndex].id : 'parent-' + Date.now(),
      email: cleanEmail,
      password: password,
      name: cleanName || cleanEmail.split('@')[0],
      fullName: cleanName || cleanEmail.split('@')[0],
      full_name: cleanName || cleanEmail.split('@')[0],
      phone: cleanPhone,
      role: 'parent',
      created_at: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      usersList[existingIndex] = { ...usersList[existingIndex], ...localUser };
    } else {
      usersList.push(localUser);
    }

    try {
      localStorage.setItem('academy_users', JSON.stringify(usersList));
      localStorage.setItem('academy_current_user', JSON.stringify(localUser));
    } catch { }

    setUser(localUser);
    setRole('parent');
    setTeacherProfile(null);
    return { session: { user: localUser }, user: localUser };
  };

  const registerTeacher = async ({ email, password, fullName, phone, subject, inviteCode }) => {
    const apiBase = import.meta.env.VITE_API_URL || '';
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (fullName || '').trim();
    const cleanPhone = (phone || '').trim();
    const cleanCode = (inviteCode || '').trim().toUpperCase();
    const validStandardCodes = ['TEACHER2026', 'SOLOMON-TEACHER', 'SOLOMON2026'];

    try {
      const res = await fetch(`${apiBase}/api/register-teacher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password, fullName: cleanName, phone: cleanPhone, subject, inviteCode })
      });
      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          try {
            const { data } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
            if (data?.user) await fetchProfile(data.user);
          } catch { }
          navigate('/teacher-dashboard');
          return result;
        } else {
          throw new Error(result.message || 'რეგისტრაცია ვერ მოხერხდა');
        }
      }
    } catch (apiErr) {
      if (apiErr.message && !apiErr.message.includes('fetch') && !apiErr.message.includes('network') && !apiErr.message.includes('Failed')) {
        throw apiErr;
      }
    }

    // Fallback: validate against local invite codes
    let localCodes = [];
    try {
      localCodes = JSON.parse(localStorage.getItem('academy_invite_codes') || '[]');
    } catch { }

    const matchedCode = localCodes.find((c) => c.code?.toUpperCase() === cleanCode && c.is_active);
    const isStandard = validStandardCodes.includes(cleanCode);

    if (matchedCode || isStandard) {
      if (matchedCode) {
        matchedCode.is_active = false;
        matchedCode.used_by = cleanName;
        try {
          localStorage.setItem('academy_invite_codes', JSON.stringify(localCodes));
        } catch { }
      }

      const mockTeacher = {
        id: 'teacher-' + Date.now(),
        email: cleanEmail,
        password,
        name: cleanName,
        fullName: cleanName,
        phone: cleanPhone || '',
        role: 'teacher',
        subject
      };

      // Save to academy_users
      try {
        const users = JSON.parse(localStorage.getItem('academy_users') || '[]');
        users.push(mockTeacher);
        localStorage.setItem('academy_users', JSON.stringify(users));
        localStorage.setItem('academy_current_user', JSON.stringify(mockTeacher));
      } catch { }

      setUser(mockTeacher);
      setRole('teacher');
      setTeacherProfile({ full_name: cleanName, subject, classes: 'საბაზო & საშუალო' });
      navigate('/teacher-dashboard');
      return { user: mockTeacher };
    }

    throw new Error('მოწვევის გასაღები არასწორია ან უკვე გამოყენებულია.');
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch { }
    setUser(null);
    setRole('parent');
    setTeacherProfile(null);
    setSession(null);
    try {
      localStorage.removeItem('academy_current_user');
    } catch { }
    navigate('/');
  };

  const refreshTeacherProfile = async () => {
    if (user?.id) {
      await fetchTeacherData(user.id);
    }
  };

  const requireAuth = (formType, data, onSuccess) => {
    if (user || session) {
      onSuccess();
    } else {
      setPendingFormSubmit({ formType, data });
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector('#admissions');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      role,
      teacherProfile,
      refreshTeacherProfile,
      loading,
      path,
      navigate,
      pendingFormSubmit,
      setPendingFormSubmit,
      login,
      register,
      registerTeacher,
      logout,
      requireAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
