import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Award, GraduationCap, Users, BookOpen, ChevronRight } from 'lucide-react';
import GoldenParticles from './GoldenParticles';
import AnimatedCounter from './AnimatedCounter';

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
      padding: 'clamp(110px, 14vw, 140px) 0 60px',
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
        
        {/* Cinematic Ambient Golden Particles Layer */}
        <GoldenParticles />

        {/* Glow Spheres */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(196, 30, 58, 0.15)',
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
          background: 'rgba(212, 175, 55, 0.1)',
          filter: 'blur(120px)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* Background Luxury Watermark */}
      <div className="section-watermark">
        SOLOMON ACADEMY
      </div>

      {/* Main Container: Modern Split Layout */}
      <div className="container" style={{ position: 'relative', zIndex: 2, width: '92%', maxWidth: '1360px', margin: '0 auto' }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '40px',
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
              background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.4), rgba(212, 175, 55, 0.2))',
              border: '1px solid rgba(212, 175, 55, 0.5)',
              borderRadius: '30px',
              marginBottom: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 15px rgba(212, 175, 55, 0.2)'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 10px #22c55e'
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
              letterSpacing: '-0.02em',
              textShadow: '0 4px 24px rgba(0,0,0,0.6)'
            }}>
              სოლომონ <br />
              <span style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #ff8598 45%, var(--accent-secondary, #d4af37) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}>
                აკადემია
              </span>
            </h1>

            {/* Description Tagline */}
            <p style={{
              fontSize: '1.12rem',
              color: 'rgba(255, 255, 255, 0.82)',
              lineHeight: 1.75,
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
                  boxShadow: '0 8px 24px rgba(196, 30, 58, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
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
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(12px)',
                  transition: 'all 0.25s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.borderColor = 'var(--accent-secondary, #d4af37)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>პროგრამების ნახვა</span>
              </a>
            </div>

            {/* Quick Metrics Ticker with Live Counters */}
            <div style={{
              display: 'flex',
              gap: '28px',
              marginTop: '40px',
              paddingTop: '28px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              flexWrap: 'wrap'
            }}>
              <div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--accent-secondary, #d4af37)', fontFamily: 'var(--font-serif)' }}>
                  IB & Cambridge
                </div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  აკრედიტირებული სასწავლო გეგმა
                </div>
              </div>
              <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
              <div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-serif)' }}>
                  1 : <AnimatedCounter end={8} duration={1200} />
                </div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  პედაგოგ-მოსწავლის თანაფარდობა
                </div>
              </div>
              <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
              <div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ff8598', fontFamily: 'var(--font-serif)' }}>
                  <AnimatedCounter end={100} duration={1800} suffix="%" />
                </div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  გრანტის მოპოვება
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Academy Feature Card (Admin Style Bento) */}
          <div
            className="spotlight-card"
            style={{
              background: 'rgba(28, 10, 14, 0.96)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(20px)'
            }}
          >
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #8b0000, #c41e3a)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 20px rgba(139, 0, 0, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.18)'
                  }}>
                    <GraduationCap size={24} color="#ffffff" />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#fff', margin: 0, fontWeight: 700 }}>
                      აკადემიური ბრწყინვალება
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--accent-secondary, #d4af37)', fontWeight: 600 }}>
                      სოლომონის უპირატესობები
                    </span>
                  </div>
                </div>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '8px',
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  color: 'var(--accent-secondary, #d4af37)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  აკრედიტებული
                </span>
              </div>

              {/* Feature Spotlight Mini Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                <div className="spotlight-card" style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px'
                }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'rgba(196, 30, 58, 0.18)',
                    border: '1px solid rgba(196, 30, 58, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ff8598',
                    flexShrink: 0
                  }}>
                    <BookOpen size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#fff' }}>ორენოვანი სწავლება</div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '2px' }}>
                      ქართული და ინგლისური ენების ინტეგრირებული კურსები
                    </div>
                  </div>
                </div>

                <div className="spotlight-card" style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px'
                }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'rgba(212, 175, 55, 0.18)',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-secondary, #d4af37)',
                    flexShrink: 0
                  }}>
                    <Sparkles size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#fff' }}>STEM & რობოტოტექნიკა</div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '2px' }}>
                      პრაქტიკული ექსპერიმენტები ულტრათანამედროვე ლაბორატორიაში
                    </div>
                  </div>
                </div>

                <div className="spotlight-card" style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px'
                }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'rgba(34, 197, 94, 0.18)',
                    border: '1px solid rgba(34, 197, 94, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#86efac',
                    flexShrink: 0
                  }}>
                    <ShieldCheck size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#fff' }}>100% უსაფრთხო გარემო</div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '2px' }}>
                      24/7 დაცვა, ეკოლოგიური კვება და ინდივიდუალური მზრუნველობა
                    </div>
                  </div>
                </div>

              </div>

              {/* Direct Link to Teachers */}
              <div style={{ marginTop: '22px', paddingTop: '18px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
                <a
                  href="#teachers"
                  onClick={(e) => handleScrollTo(e, '#teachers')}
                  style={{
                    fontSize: '0.88rem',
                    color: '#ff8598',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.transform = 'translateX(3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#ff8598';
                    e.currentTarget.style.transform = 'translateX(0)';
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
