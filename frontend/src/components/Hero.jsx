import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

export default function Hero() {
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: '90px'
      }}
    >
      {/* Background: school image, very dark */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img
          src="/images/school_hero.png"
          alt="Solomon Academy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 30%',
            filter: 'brightness(0.18) saturate(0.8)'
          }}
        />
        {/* Subtle gradient overlay — bottom fade */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(12,6,8,0.5) 0%, rgba(12,6,8,0.1) 40%, rgba(12,6,8,0.85) 100%)'
        }} />
      </div>

      {/* Main Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '90%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(60px, 10vh, 120px) 0 80px'
        }}
      >

        {/* Status indicator */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '40px'
        }}>
          <span style={{
            display: 'inline-block',
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#4ade80',
            boxShadow: '0 0 8px rgba(74, 222, 128, 0.7)'
          }} />
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase'
          }}>
            2026–2027 სასწავლო წლის მიღება ღიაა
          </span>
        </div>

        {/* Main Heading */}
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(3rem, 7vw, 5.5rem)',
          fontWeight: 700,
          lineHeight: 1.08,
          color: '#ffffff',
          letterSpacing: '-0.03em',
          marginBottom: '28px',
          maxWidth: '800px'
        }}>
          სოლომონ<br />
          <span style={{ color: '#c41e3a' }}>აკადემია</span>
        </h1>

        {/* Tagline */}
        <p style={{
          fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
          color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.7,
          marginBottom: '48px',
          maxWidth: '560px',
          fontWeight: 400
        }}>
          საერთაშორისო სტანდარტების კერძო სკოლა თბილისში. Cambridge, IB კურიკულუმი — ინდივიდუალური მიდგომა.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '64px' }}>
          <a
            href="#admissions"
            onClick={(e) => { e.preventDefault(); scrollTo('#admissions'); }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              background: '#c41e3a',
              color: '#ffffff',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.95rem',
              textDecoration: 'none',
              border: '1px solid transparent',
              transition: 'background 0.2s, transform 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#dc2445'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#c41e3a'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            ონლაინ რეგისტრაცია
            <ArrowRight size={17} />
          </a>

          <a
            href="#programs"
            onClick={(e) => { e.preventDefault(); scrollTo('#programs'); }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.85)',
              borderRadius: '10px',
              fontWeight: 500,
              fontSize: '0.95rem',
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.12)',
              transition: 'background 0.2s, border-color 0.2s, transform 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            პროგრამები
          </a>
        </div>

        {/* Key Stats — minimal horizontal row */}
        <div style={{
          display: 'flex',
          gap: '0',
          flexWrap: 'wrap',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '32px'
        }}>
          {[
            { value: '450+', label: 'მოსწავლე' },
            { value: '15+', label: 'წლიანი გამოცდილება' },
            { value: '1:8', label: 'პედაგოგ-მოსწავლე' },
            { value: '98%', label: 'ჩარიცხვის მაჩვენებელი' }
          ].map((stat, i, arr) => (
            <div
              key={i}
              style={{
                paddingRight: i < arr.length - 1 ? '40px' : '0',
                marginRight: i < arr.length - 1 ? '40px' : '0',
                borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                marginBottom: '12px'
              }}
            >
              <div style={{
                fontSize: 'clamp(1.6rem, 3vw, 2.1rem)',
                fontWeight: 700,
                color: '#ffffff',
                fontFamily: 'var(--font-serif)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.78rem',
                color: 'rgba(255,255,255,0.45)',
                marginTop: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Scroll Indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          animation: 'heroScrollBob 2.5s ease-in-out infinite'
        }}
      >
        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>scroll</span>
        <ChevronDown size={16} color="rgba(255,255,255,0.25)" />
      </div>

      <style>{`
        @keyframes heroScrollBob {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }
      `}</style>
    </section>
  );
}
