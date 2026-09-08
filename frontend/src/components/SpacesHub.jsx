import React from 'react';
import { Users, Newspaper, Camera, Tag, FileText, Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function SpacesHub({ onNavigate }) {
  const { navigate } = useAuth();

  const spaces = [
    {
      id: 'teachers',
      title: 'პედაგოგები და გუნდი',
      subtitle: 'გაიცანით ჩვენი მასწავლებლები',
      icon: Users,
      action: () => onNavigate ? onNavigate('teachers') : scrollToId('teachers')
    },
    {
      id: 'news',
      title: 'სკოლის სიახლეები',
      subtitle: 'უახლესი ინფორმაცია და ღონისძიებები',
      icon: Newspaper,
      action: () => onNavigate ? onNavigate('news') : scrollToId('news')
    },
    {
      id: 'gallery',
      title: 'სკოლის გალერეა',
      subtitle: 'ფოტო და ვიდეო არქივი',
      icon: Camera,
      action: () => navigate('/gallery')
    },
    {
      id: 'admissions',
      title: 'საფასური და პაკეტები',
      subtitle: 'სწავლის საფასურის დეტალები',
      icon: Tag,
      action: () => onNavigate ? onNavigate('admissions') : scrollToId('admissions')
    },
    {
      id: 'apply',
      title: 'ონლაინ განაცხადი',
      subtitle: 'რეგისტრაციის ფორმა',
      icon: FileText,
      action: () => {
        window.dispatchEvent(new CustomEvent('set-auth-mode', { detail: { mode: 'register' } }));
        scrollToId('admissions');
      }
    },
    {
      id: 'contact',
      title: 'კონტაქტი',
      subtitle: 'დაგვიკავშირდით კითხვებით',
      icon: Mail,
      action: () => scrollToId('footer-contact')
    }
  ];

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReturnToHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      id="spaces-hub"
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundImage: `linear-gradient(180deg, rgba(12, 6, 8, 0.45) 0%, rgba(12, 6, 8, 0.6) 100%), url(/assets/palace-interior.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '110px 40px 30px',
        color: '#ffffff',
        overflow: 'hidden'
      }}
    >
      {/* Background Soft Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 30%, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Top Heading */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, marginBottom: '30px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
            fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: '8px',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.6)'
          }}
        >
          აკადემიის სივრცეები
        </h2>
        <p
          style={{
            fontSize: 'clamp(0.95rem, 1.3vw, 1.15rem)',
            color: 'rgba(255, 255, 255, 0.85)',
            fontWeight: 400,
            letterSpacing: '0.02em'
          }}
        >
          აირჩიეთ თქვენთვის საინტერესო მიმართულება
        </p>
      </div>

      {/* Central 2-Column Grid (3 items each) */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1180px',
          width: '100%',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '20px 40px',
          alignItems: 'center'
        }}
      >
        {/* Left Column (3 items) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {spaces.slice(0, 3).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                style={{
                  width: '100%',
                  background: 'rgba(30, 20, 22, 0.55)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  borderRadius: '16px',
                  padding: '22px 26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: '#ffffff',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(45, 28, 32, 0.75)';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.65)';
                  e.currentTarget.style.transform = 'translateX(6px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(212, 175, 55, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(30, 20, 22, 0.55)';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.25)';
                  e.currentTarget.style.transform = 'translateX(0px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      marginBottom: '4px'
                    }}
                  >
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                    {item.subtitle}
                  </div>
                </div>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(212, 175, 55, 0.12)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#d4af37',
                    flexShrink: 0
                  }}
                >
                  <Icon size={20} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column (3 items) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {spaces.slice(3, 6).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                style={{
                  width: '100%',
                  background: 'rgba(30, 20, 22, 0.55)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  borderRadius: '16px',
                  padding: '22px 26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: '#ffffff',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(45, 28, 32, 0.75)';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.65)';
                  e.currentTarget.style.transform = 'translateX(6px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(212, 175, 55, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(30, 20, 22, 0.55)';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.25)';
                  e.currentTarget.style.transform = 'translateX(0px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      marginBottom: '4px'
                    }}
                  >
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                    {item.subtitle}
                  </div>
                </div>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(212, 175, 55, 0.12)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#d4af37',
                    flexShrink: 0
                  }}
                >
                  <Icon size={20} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Bar matching design (02 / 18) */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1240px',
          width: '100%',
          margin: '30px auto 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          background: 'rgba(20, 12, 14, 0.65)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '14px'
        }}
      >
        <button
          onClick={handleReturnToHero}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.85)',
            fontSize: '0.9rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: '8px',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)'}
        >
          <ArrowLeft size={16} />
          <span>ეზოში დაბრუნება</span>
        </button>

        <div
          style={{
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '20px',
            padding: '4px 14px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#d4af37',
            letterSpacing: '0.08em'
          }}
        >
          02 / 18
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/teacher-dashboard')}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
          >
            პედაგოგის პორტალი
          </button>
          <span style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '0.8rem' }}>·</span>
          <button
            onClick={() => navigate('/admin-dashboard')}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
          >
            ადმინისტრაცია
          </button>
        </div>
      </div>
    </section>
  );
}
