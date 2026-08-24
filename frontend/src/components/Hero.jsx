import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

export default function Hero() {
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img
          src="/images/school_hero.png"
          alt="Solomon Academy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 30%',
            filter: 'brightness(0.18) saturate(0.7)'
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(12,6,8,0.4) 0%, rgba(12,6,8,0.0) 50%, rgba(12,6,8,0.9) 100%)'
        }} />
      </div>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '90%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'clamp(50px, 8vh, 100px) 0 90px'
      }}>

        {/* Live status badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '100px',
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(8px)',
          marginBottom: '36px'
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: '#4ade80', boxShadow: '0 0 6px rgba(74,222,128,0.8)'
          }} />
          <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            2026–2027 სასწავლო წლის მიღება ღიაა
          </span>
        </div>

        {/* Location label */}
        <p style={{
          fontSize: '0.8rem',
          fontWeight: 500,
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '14px'
        }}>
          კერძო საერთაშორისო სკოლა · თბილისი, საქართველო
        </p>

        {/* Main heading */}
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(3rem, 7vw, 5.5rem)',
          fontWeight: 700,
          lineHeight: 1.06,
          color: '#ffffff',
          letterSpacing: '-0.03em',
          marginBottom: '24px',
          maxWidth: '800px'
        }}>
          სოლომონ<br />
          <span style={{ color: '#c41e3a' }}>აკადემია</span>
        </h1>

        {/* Tagline */}
        <p style={{
          fontSize: 'clamp(0.95rem, 1.5vw, 1.12rem)',
          color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.75,
          marginBottom: '44px',
          maxWidth: '520px'
        }}>
          სადაც Cambridge–IB კურიკულუმი, STEM ლაბორატორიები
          და ინდივიდუალური მიდგომა ერთ სკოლად ერთიანდება.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '56px' }}>
          <a
            href="#admissions"
            onClick={(e) => { e.preventDefault(); scrollTo('#admissions'); }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 26px',
              background: '#c41e3a', color: '#fff',
              borderRadius: '10px', fontWeight: 600, fontSize: '0.92rem',
              textDecoration: 'none', border: '1px solid transparent',
              transition: 'background 0.2s, transform 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#dc2445'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#c41e3a'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            ონლაინ რეგისტრაცია <ArrowRight size={16} />
          </a>
        </div>

        {/* Stats strip */}
        <div style={{
          display: 'flex', gap: '0', flexWrap: 'wrap',
          paddingTop: '28px',
          borderTop: '1px solid rgba(255,255,255,0.07)'
        }}>
          {[
            { value: '450+', label: 'მოსწავლე' },
            { value: '15+',  label: 'წლიანი გამოცდილება' },
            { value: '1:8',  label: 'პედაგოგ-მოსწავლე' },
            { value: '98%',  label: 'ჩარიცხვის მაჩვენებელი' },
          ].map((s, i, arr) => (
            <div key={i} style={{
              paddingRight: i < arr.length - 1 ? '36px' : '0',
              marginRight: i < arr.length - 1 ? '36px' : '0',
              borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              marginBottom: '12px'
            }}>
              <div style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: '5px' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Scroll cue */}
      <div style={{
        position: 'absolute', bottom: '28px', left: '50%',
        transform: 'translateX(-50%)', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
        animation: 'heroScrollBob 2.5s ease-in-out infinite'
      }}>
        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>scroll</span>
        <ChevronDown size={14} color="rgba(255,255,255,0.2)" />
      </div>

      <style>{`
        @keyframes heroScrollBob {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(6px); }
        }
      `}</style>
    </section>
  );
}
