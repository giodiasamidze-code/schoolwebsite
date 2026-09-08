import React, { useState } from 'react';
import { Menu, X, ArrowRight, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { path, navigate, user, role, logout } = useAuth();

  const navItems = [
    { label: 'მთავარი', href: '#hero' },
    { label: 'პედაგოგები', href: '#teachers' },
    { label: 'სიახლეები', href: '#news' },
    { label: 'საფასური', href: '#admissions' },
    { label: 'გალერეა', href: '/gallery' },
    { label: 'კონტაქტი', href: '#footer-contact' }
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);

    if (href.startsWith('/')) {
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (path !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAuthClick = (e, mode = 'login') => {
    e.preventDefault();
    setIsOpen(false);
    navigate('/admin');
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    setIsOpen(false);
    if (path !== '/') {
      navigate('/');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('set-auth-mode', { detail: { mode: 'register' } }));
        const el = document.getElementById('admissions');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      window.dispatchEvent(new CustomEvent('set-auth-mode', { detail: { mode: 'register' } }));
      const el = document.getElementById('admissions');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: '18px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 60px)',
        maxWidth: '1360px',
        height: '62px',
        background: 'rgba(25, 15, 18, 0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '16px',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        boxShadow: '0 10px 35px rgba(0, 0, 0, 0.5)'
      }}
    >
      {/* Brand / Logo matching Photos */}
      <a
        href="#"
        onClick={(e) => handleNavClick(e, '#hero')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textDecoration: 'none',
          color: '#ffffff'
        }}
      >
        {/* Classical Temple Gold Emblem */}
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, rgba(25, 15, 18, 0.6) 100%)',
            border: '1px solid #d4af37',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#d4af37'
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 2l9 6H3l9-6z"/>
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
              fontSize: '0.95rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#d4af37',
              lineHeight: 1.1
            }}
          >
            SOLOMON
          </span>
          <span
            style={{
              fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              color: '#ffffff',
              lineHeight: 1.1
            }}
          >
            ACADEMY
          </span>
        </div>
      </a>

      {/* Desktop Navigation Links */}
      <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => handleNavClick(e, item.href)}
            style={{
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: '0.92rem',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'all 0.2s',
              position: 'relative',
              padding: '6px 0'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#d4af37';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Right Side CTAs matching Photos */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => {
                if (role === 'admin') navigate('/admin-dashboard');
                else if (role === 'teacher') navigate('/teacher-dashboard');
                else navigate('/parent-account');
              }}
              style={{
                padding: '6px 14px',
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                color: '#d4af37',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {role === 'admin' ? 'ადმინ პანელი' : role === 'teacher' ? 'პედაგოგის კაბინეტი' : 'ჩემი ანგარიში'}
            </button>
            <button
              onClick={logout}
              title="გამოსვლა"
              style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => handleAuthClick(e, 'login')}
            style={{
              background: 'rgba(40, 24, 28, 0.7)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '8px',
              padding: '7px 18px',
              color: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#d4af37';
              e.currentTarget.style.color = '#d4af37';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
              e.currentTarget.style.color = '#ffffff';
            }}
          >
            შესვლა
          </button>
        )}

        <button
          onClick={handleRegisterClick}
          style={{
            padding: '8px 20px',
            background: 'linear-gradient(180deg, #d4af37 0%, #b88628 100%)',
            color: '#1a1104',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.88rem',
            border: '1px solid rgba(255, 230, 160, 0.5)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.4)';
          }}
        >
          ონლაინ განაცხადი
        </button>

        {/* Mobile menu toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer'
          }}
          aria-label="Toggle Navigation"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}
