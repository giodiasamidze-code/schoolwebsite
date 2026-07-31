import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('school_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [path, setPath] = useState(window.location.pathname);
  const [pendingFormSubmit, setPendingFormSubmit] = useState(null);

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (toPath) => {
    window.history.pushState({}, '', toPath);
    setPath(toPath);
    // Scroll to top on navigation
    window.scrollTo({ top: 0 });
  };

  const login = (userData) => {
    localStorage.setItem('school_user', JSON.stringify(userData));
    setUser(userData);
  };

  const register = (userData) => {
    localStorage.setItem('school_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('school_user');
    setUser(null);
    navigate('/');
  };

  const requireAuth = (formType, data, onSuccess) => {
    if (user) {
      onSuccess();
    } else {
      setPendingFormSubmit({ formType, data });
      navigate('/register');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      path,
      navigate,
      pendingFormSubmit,
      setPendingFormSubmit,
      login,
      register,
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
