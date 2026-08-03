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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
          role: 'parent'
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .upsert({
          id: data.user.id,
          full_name: fullName,
          phone: phone,
          email: email,
          role: 'parent'
        });

      if (profileError) {
        console.error('Error creating user profile:', profileError);
      }

      await fetchProfile(data.user);
    }
    return data;
  };

  const registerTeacher = async ({ email, password, fullName, phone, subject, inviteCode }) => {
    const cleanCode = inviteCode.trim();
    const { data: codeData, error: codeError } = await supabase
      .from('invite_codes')
      .select('*')
      .eq('code', cleanCode)
      .eq('is_active', true)
      .is('used_by', null)
      .maybeSingle();

    if (codeError || !codeData) {
      throw new Error('მოწოდებული მოწვევის კოდი (Invite Code) არასწორია ან უკვე გამოყენებულია.');
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone || '',
          role: 'teacher'
        }
      }
    });

    if (authError) throw authError;

    if (authData.user) {
      const userId = authData.user.id;

      await supabase.from('users').upsert({
        id: userId,
        full_name: fullName,
        phone: phone || '',
        email: email,
        role: 'teacher'
      });

      const { data: newTeacher, error: teacherError } = await supabase
        .from('teachers')
        .insert([
          {
            user_id: userId,
            full_name: fullName,
            subject: subject,
            bio: '',
            photo_url: '',
            education: '',
            experience_years: '',
            certifications: '',
            years_at_school: ''
          }
        ])
        .select()
        .single();

      if (teacherError) {
        console.error('Teacher profile creation error:', teacherError);
        throw teacherError;
      }

      await supabase
        .from('invite_codes')
        .update({
          is_active: false,
          used_by: newTeacher.id
        })
        .eq('id', codeData.id);

      await fetchProfile(authData.user);
      navigate('/teacher-dashboard');
    }

    return authData;
  };

  // TEMPORARY DEV-ONLY — DELETE THIS ENTIRE BLOCK BEFORE PRODUCTION LAUNCH
  const devQuickLogin = async (targetRole) => {
    if (!import.meta.env.DEV) return;

    const credentialsMap = {
      parent: { email: 'test-parent@dev.local', password: 'TestPassword123!', fullName: 'ტესტ მშობელი', phone: '599111222' },
      teacher: { email: 'test-teacher@dev.local', password: 'TestPassword123!', fullName: 'გიორგი პედაგოგი (Test)', phone: '599333444', subject: 'მათემატიკა' },
      admin: { email: 'test-admin@dev.local', password: 'TestPassword123!', fullName: 'ელენე დირექტორი (Test)', phone: '599555666' }
    };

    const credentials = credentialsMap[targetRole];
    if (!credentials) return;

    try {
      // 1. Try signing in first
      let { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      // 2. If user doesn't exist, sign up
      if (error && (error.message.includes('Invalid login credentials') || error.message.includes('User not found'))) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: credentials.email,
          password: credentials.password,
          options: {
            data: {
              full_name: credentials.fullName,
              phone: credentials.phone,
              role: targetRole
            }
          }
        });
        if (!signUpError) data = signUpData;
      }

      if (data?.user) {
        const userId = data.user.id;

        await supabase.from('users').upsert({
          id: userId,
          full_name: credentials.fullName,
          phone: credentials.phone,
          email: credentials.email,
          role: targetRole
        });

        if (targetRole === 'teacher') {
          await supabase.from('teachers').upsert({
            user_id: userId,
            full_name: credentials.fullName,
            subject: credentials.subject,
            bio: 'ტესტ მასწავლებლის ბიოგრაფია (Dev test account)',
            education: 'თბილისის სახელმწიფო უნივერსიტეტი (მაგისტრი)',
            experience_years: '7 წელი',
            certifications: 'სერტიფიცირებული პედაგოგი',
            years_at_school: '3 წელი'
          }, { onConflict: 'user_id' });
        }

        await fetchProfile(data.user);

        if (targetRole === 'admin') navigate('/admin-dashboard');
        else if (targetRole === 'teacher') navigate('/teacher-dashboard');
        else navigate('/parent-account');
        return;
      }
    } catch (err) {
      console.warn('Supabase fetch unavailable, applying instant dev state fallback:', err);
    }

    // Dev Fallback for instant UI review without live Supabase backend
    setUser({
      id: `dev-test-${targetRole}-id`,
      email: credentials.email,
      name: credentials.fullName,
      phone: credentials.phone,
      role: targetRole
    });
    setRole(targetRole);

    if (targetRole === 'teacher') {
      setTeacherProfile({
        id: 'dev-test-teacher-id',
        user_id: 'dev-test-teacher-id',
        full_name: credentials.fullName,
        subject: credentials.subject,
        bio: 'ტესტ მასწავლებლის ბიოგრაფია (Dev test account)',
        education: 'თბილისის სახელმწიფო უნივერსიტეტი (მაგისტრი)',
        experience_years: '7 წელი',
        certifications: 'სერტიფიცირებული პედაგოგი',
        years_at_school: '3 წელი'
      });
    }

    if (targetRole === 'admin') navigate('/admin-dashboard');
    else if (targetRole === 'teacher') navigate('/teacher-dashboard');
    else navigate('/parent-account');
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
      navigate('/register');
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
      devQuickLogin,
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
