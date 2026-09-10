import React, { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function Header({ activeSection = 'hero' }) {
  const [isOpen, setIsOpen] = useState(false);
  const { path, navigate, user, role, logout } = useAuth();

  const navItems = [
    { id: 'hero', label: 'მთავარი', href: '#hero' },
    { id: 'teachers', label: 'პედაგოგები', href: '#teachers' },
    { id: 'news', label: 'სიახლეები', href: '#news' },
    { id: 'admissions', label: 'საფასური', href: '#admissions' },
    { id: 'gallery', label: 'გალერეა', href: '/gallery' },
    { id: 'contact', label: 'კონტაქტი', href: '#footer-contact' }
  ];

  const handleNavClick = (e, item) => {
    e.preventDefault();
    setIsOpen(false);

    if (item.href.startsWith('/')) {
      navigate(item.href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (path !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(item.href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const element = document.querySelector(item.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAuthClick = (e) => {
    e.preventDefault();
    setIsOpen(false);
    navigate('/login');
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
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '70px',
        background: 'linear-gradient(180deg, rgba(15, 8, 10, 0.75) 0%, rgba(15, 8, 10, 0.0) 100%)',
        backdropFilter: 'none',
        border: 'none',
        borderRadius: 0,
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        boxShadow: 'none'
      }}
    >
      {/* Brand / Logo (Photo 13) */}
      <a
        href="#"
        onClick={(e) => handleNavClick(e, { href: '#hero' })}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textDecoration: 'none',
          color: '#ffffff'
        }}
      >
        {/* Classical Temple Gold Emblem Roundel */}
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, rgba(30, 18, 22, 0.8) 100%)',
            border: '1.2px solid #d4af37',
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
              fontSize: '0.98rem',
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
              fontSize: '0.88rem',
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

      {/* Desktop Navigation Links (Photo 13) */}
      <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        {navItems.map((item) => {
          const isItemActive =
            (item.id === 'gallery' && path === '/gallery') ||
            (path === '/' && ((item.id === 'hero' && activeSection === 'hero') || activeSection === item.id));

          return (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleNavClick(e, item)}
              style={{
                color: isItemActive ? '#ffffff' : 'rgba(255, 255, 255, 0.85)',
                fontSize: '0.95rem',
                fontWeight: isItemActive ? 600 : 500,
                textDecoration: 'none',
                transition: 'all 0.2s',
                position: 'relative',
                padding: '6px 0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#d4af37';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isItemActive ? '#ffffff' : 'rgba(255, 255, 255, 0.85)';
              }}
            >
              <span>{item.label}</span>
              {/* Active Gold Underline Bar */}
              {isItemActive && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: '#d4af37',
                    borderRadius: '2px'
                  }}
                />
              )}
            </a>
          );
        })}
      </nav>

      {/* Right Side Buttons (Photo 13) */}
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
                padding: '7px 16px',
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                color: '#d4af37',
                borderRadius: '8px',
                fontSize: '0.85rem',
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
            onClick={handleAuthClick}
            style={{
              background: 'rgba(45, 28, 32, 0.75)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '8px',
              padding: '8px 20px',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#d4af37';
              e.currentTarget.style.color = '#d4af37';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.35)';
              e.currentTarget.style.color = '#ffffff';
            }}
          >
            შესვლა
          </button>
        )}

        <button
          onClick={handleRegisterClick}
          style={{
            padding: '9px 22px',
            background: 'linear-gradient(180deg, #d4af37 0%, #b88628 100%)',
            color: '#1a1104',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: '1px solid rgba(255, 230, 160, 0.6)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.45)';
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
