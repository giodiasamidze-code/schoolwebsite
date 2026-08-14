import React, { useState } from 'react';
import { Menu, X, GraduationCap, ArrowRight, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { path, navigate, user, role, logout } = useAuth();

  const navItems = [
    { label: 'პროგრამები', href: '#programs' },
    { label: 'მასწავლებლები', href: '#teachers' },
    { label: 'სიახლეები', href: '#news' },
    { label: 'მიღება & ტარიფები', href: '#admissions' },
    { label: 'კონტაქტი', href: '#contact' }
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);

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
    <header className="header" style={{
      position: 'fixed',
      top: '14px',
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'transparent',
      border: 'none',
      boxShadow: 'none',
      padding: '0'
    }}>
      <div style={{
        width: '92%',
        maxWidth: '1360px',
        margin: '0 auto',
        background: 'rgba(28, 10, 14, 0.88)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)'
      }}>
        
        {/* Brand / Logo */}
        <a href="#" className="logo" onClick={(e) => handleNavClick(e, '#')} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #8b0000, #c41e3a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(139, 0, 0, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <GraduationCap size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-serif, Georgia, serif)',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.01em'
              }}>
                სოლომონ
              </span>
              <span style={{
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                color: 'var(--accent-secondary, #d4af37)',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                აკადემია
              </span>
            </div>
          </div>
        </a>

        {/* Desktop Nav Items */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              style={{
                textDecoration: 'none',
                color: 'rgba(255, 255, 255, 0.78)',
                fontSize: '0.88rem',
                fontWeight: 500,
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.78)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {item.label}
            </a>
          ))}

          {/* User Auth Buttons / Portals */}
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
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #8b0000 0%, #c41e3a 100%)',
              color: '#ffffff',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.88rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 16px rgba(139, 0, 0, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <span>რეგისტრაცია</span>
            <ArrowRight size={14} />
          </a>
        </nav>

        {/* Mobile Toggle Button */}
        <button
          className="mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${isOpen ? 'active' : ''}`} style={{
        position: 'fixed',
        top: '80px',
        left: '4%',
        right: '4%',
        background: 'rgba(24, 9, 11, 0.98)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(24px)',
        padding: '24px',
        display: isOpen ? 'flex' : 'none',
        flexDirection: 'column',
        gap: '16px',
        zIndex: 999
      }}>
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
              padding: '10px 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            {item.label}
          </a>
        ))}

        {user ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '10px' }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.88rem' }}>
              სალამი, {user.name || user.email}
            </span>
            <button
              onClick={() => { setIsOpen(false); logout(); }}
              style={{
                padding: '10px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                borderRadius: '8px',
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
              cursor: 'pointer'
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
            borderRadius: '10px',
            fontWeight: 700,
            textAlign: 'center',
            textDecoration: 'none'
          }}
        >
          ონლაინ რეგისტრაცია
        </a>
      </div>
    </header>
  );
}
