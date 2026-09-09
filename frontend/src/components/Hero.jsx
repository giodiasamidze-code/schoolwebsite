import React from 'react';
import { Users, Newspaper, DollarSign, Image as ImageIcon, FileText, ChevronDown, ArrowRight } from 'lucide-react';
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
        zIndex: 2,
        height: '100vh',
        minHeight: '720px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
        background: '#090507',
        backgroundImage: `linear-gradient(180deg, rgba(12, 6, 8, 0.12) 0%, rgba(12, 6, 8, 0.05) 35%, rgba(12, 6, 8, 0.65) 100%), url(/assets/palace-exterior.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 50%',
        backgroundRepeat: 'no-repeat',
        paddingTop: '0',
        paddingBottom: '32px',
        paddingLeft: '40px',
        paddingRight: '40px',
        color: '#ffffff'
      }}
    >
      {/* Top spacer (header height) */}
      <div style={{ height: '70px', width: '100%', flexShrink: 0 }} />

      {/* Hero Central Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          maxWidth: '1000px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          flex: 1,
          justifyContent: 'center'
        }}
      >
        {/* Main Title */}
        <h1
          style={{
            fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
            fontSize: 'clamp(2.8rem, 6vw, 4.8rem)',
            fontWeight: 700,
            lineHeight: 1.12,
            color: '#ffffff',
            letterSpacing: '-0.01em',
            textShadow: '0 2px 20px rgba(0, 0, 0, 0.8)',
            marginBottom: '10px'
          }}
        >
          სოლომონ აკადემია
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: 'var(--font-sans, "Noto Sans Georgian", sans-serif)',
            fontSize: 'clamp(1rem, 1.6vw, 1.35rem)',
            color: 'rgba(255, 255, 255, 0.92)',
            fontWeight: 400,
            letterSpacing: '0.03em',
            marginBottom: '32px',
            textShadow: '0 1px 10px rgba(0, 0, 0, 0.8)'
          }}
        >
          ცოდნის გზა იწყება აქ
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => scrollToSection('spaces-hub')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '13px 30px',
              borderRadius: '8px',
              background: 'linear-gradient(180deg, #c9a227 0%, #a8841c 100%)',
              color: '#1a1104',
              fontFamily: 'var(--font-sans, sans-serif)',
              fontSize: '0.98rem',
              fontWeight: 700,
              border: '1px solid rgba(220, 195, 100, 0.6)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(180, 140, 30, 0.45)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)'; }}
          >
            <span>შევიდეთ აკადემიაში</span>
            <ArrowRight size={17} />
          </button>

          <button
            onClick={() => { navigate('/gallery'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '13px 26px',
              borderRadius: '8px',
              background: 'rgba(220, 205, 175, 0.18)',
              backdropFilter: 'blur(12px)',
              color: '#f0e5cc',
              fontFamily: 'var(--font-sans, sans-serif)',
              fontSize: '0.98rem',
              fontWeight: 500,
              border: '1px solid rgba(210, 190, 140, 0.5)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(220, 205, 175, 0.3)'; e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.8)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(220, 205, 175, 0.18)'; e.currentTarget.style.borderColor = 'rgba(210, 190, 140, 0.5)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            სკოლის გალერეა
          </button>
        </div>

        {/* Down arrow */}
        <button
          onClick={() => scrollToSection('spaces-hub')}
          style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.7)', cursor: 'pointer', marginTop: '28px' }}
          aria-label="Scroll down"
        >
          <ChevronDown size={26} />
        </button>
      </div>

      {/* Bottom Dock Bar */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {/* Central navigation dock */}
        <div
          style={{
            background: 'rgba(20, 12, 15, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(200, 175, 120, 0.22)',
            borderRadius: '16px',
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)'
          }}
        >
          {[
            { label: 'პედაგოგები', icon: Users, target: 'teachers' },
            { label: 'სიახლეები', icon: Newspaper, target: 'news' },
            { label: 'საფასური', icon: DollarSign, target: 'admissions' },
            { label: 'გალერეა', icon: ImageIcon, action: () => navigate('/gallery') },
            { label: 'ონლაინ განაცხადი', icon: FileText, action: () => { window.dispatchEvent(new CustomEvent('set-auth-mode', { detail: { mode: 'register' } })); scrollToSection('admissions'); } }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={item.action || (() => scrollToSection(item.target))}
                style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', padding: '7px 16px', borderRadius: '10px', color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)'; e.currentTarget.style.color = '#d4af37'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
