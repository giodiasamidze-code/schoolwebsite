import React from 'react';
import { ArrowRight, ChevronDown, Globe, FlaskConical, BookOpen, ShieldCheck, Users, Award } from 'lucide-react';

const features = [
  { icon: Globe,         label: 'Cambridge International' },
  { icon: BookOpen,      label: 'IB Curriculum' },
  { icon: FlaskConical,  label: 'STEM & Robotics' },
  { icon: ShieldCheck,   label: '100% Safe Campus' },
  { icon: Users,         label: '1:8 Teacher Ratio' },
  { icon: Award,         label: '98% University Entry' },
];

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
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '90%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(50px, 8vh, 100px) 0 90px'
        }}
      >
        {/* Top pill badge */}
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

        {/* Two-column layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) minmax(0,auto)',
          gap: 'clamp(40px, 6vw, 100px)',
          alignItems: 'center'
        }}>

          {/* LEFT — Headline + CTA */}
          <div>
            {/* School type label */}
            <p style={{
              fontSize: '0.82rem',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '14px'
            }}>
              კერძო საერთაშორისო სკოლა · თბილისი, საქართველო
            </p>

            {/* Main heading */}
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(3rem, 6.5vw, 5.2rem)',
              fontWeight: 700,
              lineHeight: 1.06,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              marginBottom: '24px'
            }}>
              სოლომონ<br />
              <span style={{ color: '#c41e3a' }}>აკადემია</span>
            </h1>

            {/* Tagline */}
            <p style={{
              fontSize: 'clamp(0.95rem, 1.5vw, 1.12rem)',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.75,
              marginBottom: '40px',
              maxWidth: '480px'
            }}>
              სადაც Cambridge–IB კურიკულუმი, STEM ლაბორატორიები
              და ინდივიდუალური მიდგომა ერთ სკოლად ერთიანდება.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
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

              <a
                href="#teachers"
                onClick={(e) => { e.preventDefault(); scrollTo('#teachers'); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '13px 26px',
                  background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)',
                  borderRadius: '10px', fontWeight: 500, fontSize: '0.92rem',
                  textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'background 0.2s, transform 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                გაიცანით გუნდი
              </a>
            </div>

            {/* Stats strip */}
            <div style={{
              display: 'flex', gap: '0', flexWrap: 'wrap',
              marginTop: '52px', paddingTop: '28px',
              borderTop: '1px solid rgba(255,255,255,0.07)'
            }}>
              {[
                { value: '450+', label: 'მოსწავლე' },
                { value: '15+',  label: 'წელი გამოცდ.' },
                { value: '4',    label: 'აკრედიტაცია' },
                { value: '98%',  label: 'ჩარიცხვა' },
              ].map((s, i, arr) => (
                <div key={i} style={{
                  paddingRight: i < arr.length - 1 ? '32px' : '0',
                  marginRight: i < arr.length - 1 ? '32px' : '0',
                  borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none'
                }}>
                  <div style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: '5px' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Feature cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            minWidth: '280px',
            maxWidth: '360px'
          }}>
            {features.map(({ icon: Icon, label }, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  padding: '16px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(12px)',
                  transition: 'background 0.2s, border-color 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(196,30,58,0.08)'; e.currentTarget.style.borderColor = 'rgba(196,30,58,0.25)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
              >
                <Icon size={18} color="rgba(255,255,255,0.5)" strokeWidth={1.5} />
                <span style={{
                  fontSize: '0.76rem',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.3
                }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

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
        @media (max-width: 820px) {
          #hero-inner-grid {
            grid-template-columns: 1fr !important;
          }
          #hero-feature-grid {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
