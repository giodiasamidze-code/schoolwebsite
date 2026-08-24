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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setUser(null);
        setRole('parent');
        setTeacherProfile(null);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchProfile(session.user);
      } else {
        setUser(null);
        setRole('parent');
        setTeacherProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const navigate = (toPath) => {
    window.history.pushState({}, '', toPath);
    setPath(toPath);
    window.scrollTo({ top: 0 });
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    if (data.user) {
      await fetchProfile(data.user);
      
      // Fetch user profile from DB to get actual role
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      const actualRole = profile?.role || data.user.user_metadata?.role || 'parent';
      setRole(actualRole);

      if (actualRole === 'admin') {
        navigate('/admin-dashboard');
      } else if (actualRole === 'teacher') {
        navigate('/teacher-dashboard');
      }
    }
    return data;
  };

  const register = async ({ email, password, fullName, phone }) => {
    // Call backend (service role) → auto-confirms email, no RLS issues
    const apiBase = import.meta.env.VITE_API_URL || '';
    const res = await fetch(`${apiBase}/api/register-parent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName, phone })
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.message);

    // Auto-login after registration
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) await fetchProfile(data.user);
    return { session: data.session, user: data.user };
  };


  const registerTeacher = async ({ email, password, fullName, phone, subject, inviteCode }) => {
    // Call backend (service role) → validates invite code, auto-confirms email, creates teacher profile
    const apiBase = import.meta.env.VITE_API_URL || '';
    const res = await fetch(`${apiBase}/api/register-teacher`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName, phone, subject, inviteCode })
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.message);

    // Auto-login after registration
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) await fetchProfile(data.user);
    navigate('/teacher-dashboard');
    return data;
  };







  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole('parent');
    setTeacherProfile(null);
    setSession(null);
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
