import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Award, GraduationCap, Users, BookOpen, ChevronRight } from 'lucide-react';

export default function Hero() {
  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="hero-section" id="hero" style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      padding: '120px 0 80px',
      overflow: 'hidden'
    }}>
      
      {/* Background Image with Ambient Glow Overlays */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <img
          src="/images/school_hero.png"
          alt="Solomon Academy Building"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.25) contrast(1.1)' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(42, 14, 18, 0.6) 0%, rgba(24, 9, 11, 0.96) 80%, #18090b 100%)'
        }} />
        {/* Glow Spheres */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(196, 30, 58, 0.12)',
          filter: 'blur(100px)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'rgba(212, 175, 55, 0.08)',
          filter: 'blur(120px)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* Main Container: Modern Split Layout */}
      <div className="container" style={{ position: 'relative', zIndex: 2, width: '92%', maxWidth: '1360px', margin: '0 auto' }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '48px',
          alignItems: 'center'
        }}>

          {/* Left Column: Heading, Badges, CTAs */}
          <div>
            {/* Live Admission Status Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 16px',
              background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.35), rgba(212, 175, 55, 0.15))',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '30px',
              marginBottom: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 8px #22c55e'
              }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-secondary, #d4af37)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                2026–2027 სასწავლო წლის მიღება ღიაა
              </span>
            </div>

            {/* Main Title */}
            <h1 style={{
              fontFamily: 'var(--font-serif, Georgia, serif)',
              fontSize: 'clamp(2.6rem, 5vw, 4.2rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: '#ffffff',
              marginBottom: '20px',
              letterSpacing: '-0.02em'
            }}>
              სოლომონ <br />
              <span style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #ff8598 50%, var(--accent-secondary, #d4af37) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                აკადემია
              </span>
            </h1>

            {/* Description Tagline */}
            <p style={{
              fontSize: '1.15rem',
              color: 'rgba(255, 255, 255, 0.78)',
              lineHeight: 1.7,
              marginBottom: '36px',
              maxWidth: '560px'
            }}>
              უმაღლესი საერთაშორისო სტანდარტების კერძო სკოლა თბილისში — სადაც კლასიკური აკადემიური სიღრმე, STEM ინოვაციები და ლიდერული აღზრდა ერთიანდება.
            </p>

            {/* Action CTAs */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <a
                href="#admissions"
                onClick={(e) => handleScrollTo(e, '#admissions')}
                style={{
                  padding: '14px 28px',
                  background: 'linear-gradient(135deg, #8b0000 0%, #c41e3a 100%)',
                  color: '#ffffff',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 24px rgba(196, 30, 58, 0.45)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  transition: 'all 0.25s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span>ონლაინ რეგისტრაცია</span>
                <ArrowRight size={18} />
              </a>

              <a
                href="#programs"
                onClick={(e) => handleScrollTo(e, '#programs')}
                style={{
                  padding: '14px 26px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.25s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.borderColor = 'var(--accent-secondary, #d4af37)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                }}
              >
                <span>პროგრამების ნახვა</span>
              </a>
            </div>

            {/* Quick Metrics Ticker */}
            <div style={{
              display: 'flex',
              gap: '24px',
              marginTop: '40px',
              paddingTop: '28px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              flexWrap: 'wrap'
            }}>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-secondary, #d4af37)', fontFamily: 'var(--font-serif)' }}>IB & Cambridge</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.55)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>აკრედიტირებული სასწავლო გეგმა</div>
              </div>
              <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-serif)' }}>1:8</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.55)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>პედაგოგ-მოსწავლის თანაფარდობა</div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Academy Feature Card (Admin Style Bento) */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(36, 14, 18, 0.7), rgba(20, 7, 9, 0.85))',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(20px)',
            position: 'relative'
          }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #8b0000, #c41e3a)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 18px rgba(139, 0, 0, 0.4)'
                }}>
                  <GraduationCap size={22} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#fff', margin: 0, fontWeight: 700 }}>
                    აკადემიური ბრწყინვალება
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--accent-secondary, #d4af37)', fontWeight: 600 }}>
                    სოლომონის უპირატესობები
                  </span>
                </div>
              </div>
              <span style={{
                padding: '4px 10px',
                borderRadius: '8px',
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                color: 'var(--accent-secondary, #d4af37)',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                აკრედიტებული
              </span>
            </div>

            {/* Feature Mini Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                transition: 'all 0.2s'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(196, 30, 58, 0.15)',
                  border: '1px solid rgba(196, 30, 58, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ff8598',
                  flexShrink: 0
                }}>
                  <BookOpen size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff' }}>ორენოვანი სწავლება</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.55)', marginTop: '2px' }}>
                    ქართული და ინგლისური ენების ინტეგრირებული კურსები
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                transition: 'all 0.2s'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-secondary, #d4af37)',
                  flexShrink: 0
                }}>
                  <Sparkles size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff' }}>STEM & რობოტოტექნიკა</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.55)', marginTop: '2px' }}>
                    პრაქტიკული ექსპერიმენტები ულტრათანამედროვე ლაბორატორიაში
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                transition: 'all 0.2s'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#86efac',
                  flexShrink: 0
                }}>
                  <ShieldCheck size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff' }}>100% უსაფრთხო გარემო</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.55)', marginTop: '2px' }}>
                    24/7 დაცვა, ეკოლოგიური კვება და ინდივიდუალური მზრუნველობა
                  </div>
                </div>
              </div>

            </div>

            {/* Direct Link to Teachers */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
              <a
                href="#teachers"
                onClick={(e) => handleScrollTo(e, '#teachers')}
                style={{
                  fontSize: '0.86rem',
                  color: '#ff8598',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                გაიცანით ჩვენი პედაგოგები <ChevronRight size={14} />
              </a>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
