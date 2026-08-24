import React, { useState } from 'react';
import { Menu, X, GraduationCap, ArrowRight, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { path, navigate, user, role, logout } = useAuth();

  const navItems = [
    { label: 'მასწავლებლები', href: '#teachers' },
    { label: 'სიახლეები', href: '#news' },
    { label: 'გალერეა', href: '/gallery' },
    { label: 'მიღება & ტარიფები', href: '#admissions' },
    { label: 'კონტაქტი', href: '#contact' }
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
        if (href === '#') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        const element = document.querySelector(href);
        if (element) {
          scrollToElement(element);
        }
      }, 150);
    } else {
      if (href === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const element = document.querySelector(href);
      if (element) {
        scrollToElement(element);
      }
    }
  };

  const scrollToElement = (element) => {
    const offset = 90;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  return (
    <header className="header">
      <div className="header-container">
        
        {/* Brand / Logo */}
      <a href="#" className="logo" onClick={(e) => handleNavClick(e, '#')}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: '#c41e3a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <GraduationCap size={19} color="#ffffff" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
            <span style={{
              fontFamily: 'var(--font-serif, Georgia, serif)',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.01em'
            }}>
              სოლომონ
            </span>
            <span style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.92rem',
              fontWeight: 400
            }}>აკადემია</span>
          </div>
        </a>

        {/* Desktop Nav Items (Strictly Hidden on Mobile via CSS) */}
        <nav className="desktop-nav">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-link"
              onClick={(e) => handleNavClick(e, item.href)}
            >
              {item.label}
            </a>
          ))}

          {/* User Auth Profile */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {role === 'admin' && (
                <button
                  onClick={() => navigate('/admin-dashboard')}
                  style={{
                    padding: '6px 14px',
                    background: 'linear-gradient(135deg, #8b0000, #c41e3a)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Shield size={14} />
                  ადმინ პანელი
                </button>
              )}
              {role === 'teacher' && (
                <button
                  onClick={() => navigate('/teacher-dashboard')}
                  style={{
                    padding: '6px 14px',
                    background: 'rgba(212, 175, 55, 0.15)',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                    color: 'var(--accent-secondary, #d4af37)',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  მასწავლებლის კაბინეტი
                </button>
              )}
              {role === 'parent' && (
                <button
                  onClick={() => navigate('/parent-account')}
                  style={{
                    padding: '6px 14px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  ჩემი ანგარიში
                </button>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px 4px 6px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '30px'
              }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8b0000, #c41e3a)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {(user.name || user.email || 'U')[0].toUpperCase()}
                </div>
                <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>
                  {(user.name || user.email || '').split(' ')[0]}
                </span>
                <button
                  onClick={logout}
                  title="გამოსვლა"
                  style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate('/register')}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '6px 12px'
              }}
            >
              შესვლა
            </button>
          )}

          {/* Online Application CTA Button */}
          <a
            href="#admissions"
            onClick={(e) => handleNavClick(e, '#admissions')}
            style={{
              padding: '8px 18px',
              background: '#c41e3a',
              color: '#ffffff',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.88rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid transparent',
              transition: 'background 0.2s',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#dc2445'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#c41e3a'}
          >
            <span>რეგისტრაცია</span>
            <ArrowRight size={14} />
          </a>
        </nav>

        {/* Mobile Toggle Button (Visible only on Mobile) */}
        <button
          className="mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} color="#ffffff" /> : <Menu size={24} color="#ffffff" />}
        </button>

      </div>

      {/* Mobile Drawer (Dropdown) */}
      <div className={`mobile-drawer ${isOpen ? 'active' : ''}`}>
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => handleNavClick(e, item.href)}
            style={{
              textDecoration: 'none',
              color: '#ffffff',
              fontSize: '1.05rem',
              fontWeight: 600,
              padding: '12px 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'block'
            }}
          >
            {item.label}
          </a>
        ))}

        {user ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', fontWeight: 600 }}>
                სალამი, {user.name || user.email}
              </span>
              {role === 'admin' && (
                <button
                  onClick={() => { setIsOpen(false); navigate('/admin-dashboard'); }}
                  style={{
                    padding: '6px 12px',
                    background: 'linear-gradient(135deg, #8b0000, #c41e3a)',
                    color: '#fff',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}
                >
                  ადმინ პანელი
                </button>
              )}
            </div>
            <button
              onClick={() => { setIsOpen(false); logout(); }}
              style={{
                padding: '10px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                borderRadius: '10px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              გამოსვლა
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setIsOpen(false); navigate('/register'); }}
            style={{
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#fff',
              borderRadius: '10px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '4px'
            }}
          >
            რეგისტრაცია / შესვლა
          </button>
        )}

        <a
          href="#admissions"
          onClick={(e) => handleNavClick(e, '#admissions')}
          style={{
            padding: '14px',
            background: 'linear-gradient(135deg, #8b0000 0%, #c41e3a 100%)',
            color: '#fff',
            borderRadius: '12px',
            fontWeight: 700,
            textAlign: 'center',
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(139, 0, 0, 0.45)',
            marginTop: '4px'
          }}
        >
          ონლაინ რეგისტრაცია
        </a>
      </div>
    </header>
  );
}
