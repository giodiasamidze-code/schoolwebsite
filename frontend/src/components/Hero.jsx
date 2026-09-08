import React from 'react';
import { Users, Newspaper, DollarSign, Image, FileEdit, ChevronDown, ArrowRight } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function Hero() {
  const { navigate } = useAuth();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: '700px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
        background: '#090507',
        backgroundImage: `linear-gradient(180deg, rgba(12, 6, 8, 0.35) 0%, rgba(12, 6, 8, 0.4) 50%, rgba(12, 6, 8, 0.85) 100%), url(/assets/palace-exterior.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        paddingTop: '100px',
        paddingBottom: '24px',
        paddingLeft: '30px',
        paddingRight: '30px',
        color: '#ffffff'
      }}
    >
      {/* Soft Vignette Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 30%, rgba(212, 175, 55, 0.06) 0%, transparent 65%)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ width: '100%' }} />

      {/* Hero Central Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          width: '92%',
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        {/* Main Grand Title: სოლომონ აკადემია */}
        <h1
          style={{
            fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
            fontSize: 'clamp(2.8rem, 6.2vw, 4.8rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            textShadow: '0 4px 30px rgba(0, 0, 0, 0.85)',
            marginBottom: '12px'
          }}
        >
          სოლომონ აკადემია
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: 'var(--font-sans, "Noto Sans Georgian", sans-serif)',
            fontSize: 'clamp(1.1rem, 1.6vw, 1.45rem)',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 400,
            letterSpacing: '0.04em',
            marginBottom: '32px',
            textShadow: '0 2px 12px rgba(0, 0, 0, 0.8)'
          }}
        >
          ცოდნის გზა იწყება აქ
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Primary Solid Gold Button */}
          <button
            onClick={() => scrollToSection('spaces-hub')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '14px 32px',
              borderRadius: '10px',
              background: 'linear-gradient(180deg, #d4af37 0%, #b88628 100%)',
              color: '#1a1104',
              fontFamily: 'var(--font-sans, sans-serif)',
              fontSize: '1.02rem',
              fontWeight: 700,
              letterSpacing: '0.02em',
              border: '1px solid rgba(255, 230, 160, 0.6)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(212, 175, 55, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.4)';
            }}
          >
            <span>შედით აკადემიაში</span>
            <ArrowRight size={18} />
          </button>

          {/* Secondary Translucent Button */}
          <button
            onClick={() => {
              navigate('/gallery');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '14px 28px',
              borderRadius: '10px',
              background: 'rgba(25, 15, 18, 0.55)',
              backdropFilter: 'blur(16px)',
              color: '#ffffff',
              fontFamily: 'var(--font-sans, sans-serif)',
              fontSize: '1.02rem',
              fontWeight: 500,
              border: '1px solid rgba(212, 175, 55, 0.35)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
              transition: 'all 0.25s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(40, 22, 28, 0.75)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.7)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(25, 15, 18, 0.55)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.35)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            სკოლის გალერეა
          </button>
        </div>

        {/* Down Arrow Anchor */}
        <button
          onClick={() => scrollToSection('spaces-hub')}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(212, 175, 55, 0.8)',
            cursor: 'pointer',
            marginTop: '34px',
            animation: 'bounce 2s infinite'
          }}
          aria-label="Scroll down"
        >
          <ChevronDown size={28} />
        </button>
      </div>

      {/* Bottom Dock Bar matching photo 13 (01 / 18) */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          maxWidth: '1240px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        {/* Page counter 01 / 18 */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '20px',
            padding: '5px 14px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#d4af37',
            letterSpacing: '0.08em'
          }}
        >
          01 / 18
        </div>

        {/* Central Floating Quick Dock */}
        <div
          style={{
            background: 'rgba(25, 16, 20, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '16px',
            padding: '8px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6)'
          }}
        >
          {[
            { label: 'პედაგოგები', icon: Users, target: 'teachers' },
            { label: 'სიახლეები', icon: Newspaper, target: 'news' },
            { label: 'საფასური', icon: DollarSign, target: 'admissions' },
            { label: 'გალერეა', icon: Image, action: () => navigate('/gallery') },
            {
              label: 'ონლაინ განაცხადი',
              icon: FileEdit,
              action: () => {
                window.dispatchEvent(new CustomEvent('set-auth-mode', { detail: { mode: 'register' } }));
                scrollToSection('admissions');
              }
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={item.action || (() => scrollToSection(item.target))}
                style={{
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
                  e.currentTarget.style.color = '#d4af37';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Brand Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.85 }}>
          <span
            style={{
              fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: '#d4af37'
            }}
          >
            SOLOMON ACADEMY
          </span>
        </div>
      </div>
    </section>
  );
}
