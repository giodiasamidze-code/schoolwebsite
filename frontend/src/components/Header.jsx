import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function Header({ activeSection = 'hero' }) {
  const [isOpen, setIsOpen] = useState(false);
  const { path, navigate, user, role, logout } = useAuth();

  // Lock body scroll and pause Lenis when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      if (window.__lenis) {
        window.__lenis.stop();
      }
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = prevOverflow;
        if (window.__lenis) {
          window.__lenis.start();
        }
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);

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
      className="site-header"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '70px',
        background: 'linear-gradient(180deg, rgba(15, 8, 10, 0.85) 0%, rgba(15, 8, 10, 0.0) 100%)',
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
        className="header-brand-logo"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
          color: '#ffffff'
        }}
      >
        {/* Classical Temple Gold Emblem Roundel */}
        <div
          className="header-logo-emblem"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, rgba(30, 18, 22, 0.8) 100%)',
            border: '1.2px solid #d4af37',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#d4af37',
            flexShrink: 0
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

      {/* Right Side Buttons */}
      <div className="header-right-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {user ? (
          <div className="header-user-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => {
                if (role === 'admin') navigate('/admin-dashboard');
                else if (role === 'teacher') navigate('/teacher-dashboard');
                else navigate('/parent-account');
              }}
              style={{
                padding: '7px 14px',
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                color: '#d4af37',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {role === 'admin' ? 'ადმინ პანელი' : role === 'teacher' ? 'კაბინეტი' : 'ანგარიში'}
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
            className="header-login-btn"
            style={{
              background: 'rgba(45, 28, 32, 0.75)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '8px',
              padding: '8px 18px',
              color: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
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
          className="header-apply-btn"
          style={{
            padding: '8px 18px',
            background: 'linear-gradient(180deg, #d4af37 0%, #b88628 100%)',
            color: '#1a1104',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.88rem',
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
          <span className="apply-btn-text-full">ონლაინ განაცხადი</span>
          <span className="apply-btn-text-short">განაცხადი</span>
        </button>

        {/* Mobile menu toggle button */}
        <button
          className="mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'rgba(212, 175, 55, 0.12)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '8px',
            padding: '7px',
            color: '#d4af37',
            cursor: 'pointer',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Toggle Navigation"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Luxury Fullscreen Mobile Navigation Drawer mounted directly on document.body */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div
          data-lenis-prevent="true"
          className="mobile-nav-drawer"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: '100vh',
            width: '100vw',
            background: 'rgba(15, 8, 12, 0.98)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px 20px',
            boxSizing: 'border-box',
            overflowY: 'auto'
          }}
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Drawer Top Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(212, 175, 55, 0.2)',
                  border: '1px solid #d4af37',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#d4af37'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 2l9 6H3l9-6z"/>
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-serif)', color: '#d4af37', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.06em' }}>
                SOLOMON ACADEMY
              </span>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer'
              }}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '20px 0' }}>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                style={{
                  fontFamily: 'var(--font-serif, Georgia, serif)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#f5eee8',
                  textDecoration: 'none',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(212, 175, 55, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>{item.label}</span>
                <span style={{ color: '#d4af37', fontSize: '1rem' }}>→</span>
              </a>
            ))}
          </div>

          {/* Drawer Actions & Footer Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '18px' }}>
            <button
              onClick={handleRegisterClick}
              style={{
                width: '100%',
                padding: '13px',
                background: 'linear-gradient(180deg, #d4af37 0%, #b88628 100%)',
                color: '#1a1104',
                fontWeight: 700,
                fontSize: '0.98rem',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              ონლაინ განაცხადი
            </button>

            {user ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (role === 'admin') navigate('/admin-dashboard');
                  else if (role === 'teacher') navigate('/teacher-dashboard');
                  else navigate('/parent-account');
                }}
                style={{
                  width: '100%',
                  padding: '11px',
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  color: '#d4af37',
                  fontWeight: 600,
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              >
                {role === 'admin' ? 'ადმინ პანელი' : role === 'teacher' ? 'პედაგოგის კაბინეტი' : 'ჩემი ანგარიში'}
              </button>
            ) : (
              <button
                onClick={handleAuthClick}
                style={{
                  width: '100%',
                  padding: '11px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  fontWeight: 600,
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              >
                შესვლა პორტალზე
              </button>
            )}

            <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '4px' }}>
              თბილისი, საქართველო • +995 32 200 00 00
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
