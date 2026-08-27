import React, { useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const { navigate } = useAuth();
  const heroSectionRef = useRef(null);
  const leftDoorRef = useRef(null);
  const rightDoorRef = useRef(null);
  const heroContentRef = useRef(null);
  const revealBoxRef = useRef(null);

  useEffect(() => {
    // Respect user's accessibility setting
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Only run pinned split animation on tablet & desktop (>= 768px)
      mm.add('(min-width: 768px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: 'top top',
            end: '+=1100',
            pin: true,
            scrub: 1,
            anticipatePin: 1
          }
        });

        // 1. Initial Hero Text/CTA fades out smoothly
        tl.to(heroContentRef.current, {
          opacity: 0,
          y: -50,
          scale: 0.95,
          duration: 0.3,
          ease: 'power1.out'
        }, 0);

        // 2. The building photo splits into two halves (Left moves left, Right moves right)
        tl.to(leftDoorRef.current, {
          xPercent: -102,
          opacity: 0.2,
          duration: 0.75,
          ease: 'power2.inOut'
        }, 0.12);

        tl.to(rightDoorRef.current, {
          xPercent: 102,
          opacity: 0.2,
          duration: 0.75,
          ease: 'power2.inOut'
        }, 0.12);

        // 3. Center transitional quote is revealed in the gap
        tl.fromTo(revealBoxRef.current,
          { opacity: 0, scale: 0.88, y: 35 },
          { opacity: 1, scale: 1.02, y: 0, duration: 0.6, ease: 'power2.out' },
          0.25
        );

        // 4. Settle before releasing pin to the next section
        tl.to(revealBoxRef.current, {
          opacity: 0.95,
          scale: 1,
          duration: 0.15
        }, 0.85);
      });
    }, heroSectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={heroSectionRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#090507'
      }}
    >
      {/* ======================================================== */}
      {/* LAYER 1: REVEALED INSPIRATIONAL QUOTE (Behind the Split) */}
      {/* ======================================================== */}
      <div
        ref={revealBoxRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 24px',
          background: 'radial-gradient(ellipse at 50% 50%, #1e0910 0%, #120408 50%, #080204 100%)',
          pointerEvents: 'none',
          opacity: 0
        }}
      >
        {/* Ambient Gold Glow */}
        <div
          style={{
            position: 'absolute',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.18) 0%, rgba(196, 30, 58, 0.1) 50%, transparent 75%)',
            filter: 'blur(50px)',
            pointerEvents: 'none'
          }}
        />

        {/* Revealed Classical Emblem */}
        <div
          style={{
            marginBottom: '20px',
            filter: 'drop-shadow(0 4px 16px rgba(212, 175, 55, 0.5))',
            position: 'relative',
            zIndex: 2
          }}
        >
          <svg width="60" height="60" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="30" stroke="#d4af37" strokeWidth="1.2" strokeDasharray="3 3" />
            <circle cx="32" cy="32" r="26" stroke="#f5e2a3" strokeWidth="1.6" />
            <polygon points="32,14 17,24 47,24" fill="#d4af37" />
            <rect x="19" y="24" width="26" height="2.5" fill="#f5e2a3" />
            <rect x="22" y="27" width="3" height="13" fill="#d4af37" rx="0.5" />
            <rect x="28.5" y="27" width="3" height="13" fill="#d4af37" rx="0.5" />
            <rect x="35" y="27" width="3" height="13" fill="#d4af37" rx="0.5" />
            <rect x="41.5" y="27" width="3" height="13" fill="#d4af37" rx="0.5" />
            <rect x="17" y="41" width="30" height="2" fill="#f5e2a3" />
            <rect x="15" y="43" width="34" height="3" fill="#d4af37" rx="0.5" />
          </svg>
        </div>

        {/* Eyebrow */}
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#ff8598',
            marginBottom: '14px',
            position: 'relative',
            zIndex: 2
          }}
        >
          სოლომონ აკადემია
        </span>

        {/* Main Inspirational Quote */}
        <h2
          style={{
            fontFamily: "'Noto Serif Georgian', Georgia, serif",
            fontSize: 'clamp(1.8rem, 4.2vw, 3.4rem)',
            fontWeight: 700,
            lineHeight: 1.3,
            color: '#ffffff',
            maxWidth: '840px',
            margin: '0 auto 16px',
            textShadow: '0 4px 25px rgba(0, 0, 0, 0.9), 0 0 35px rgba(196, 30, 58, 0.4)',
            letterSpacing: '0.01em',
            position: 'relative',
            zIndex: 2
          }}
        >
          „სკოლა, სადაც ცოდნა ძალაა და ყოველი ნაბიჯი — წარმატება“
        </h2>

        {/* Flanked Subtitle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            width: '100%',
            maxWidth: '520px',
            marginTop: '10px',
            position: 'relative',
            zIndex: 2
          }}
        >
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.6))' }} />
          <p
            style={{
              fontSize: 'clamp(0.85rem, 1.1vw, 0.98rem)',
              color: 'rgba(255, 230, 160, 0.85)',
              margin: 0,
              letterSpacing: '0.06em',
              fontWeight: 500
            }}
          >
            აკადემიური სრულყოფილება · ინოვაცია · მომავალი
          </p>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.6), transparent)' }} />
        </div>
      </div>

      {/* ======================================================== */}
      {/* LAYER 2: SPLIT DOORS (Left & Right Halves of Palace Bg)  */}
      {/* ======================================================== */}
      
      {/* Left Door */}
      <div
        ref={leftDoorRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 3,
          borderRight: '1px solid rgba(212, 175, 55, 0.35)',
          boxShadow: '4px 0 25px rgba(0, 0, 0, 0.6)'
        }}
      >
        <img
          src="/images/hero_building_bg.jpg"
          alt="Solomon Academy Architecture Left"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 45%',
            filter: 'brightness(0.95) contrast(1.04)'
          }}
        />
        {/* Soft Vignette Overlay for Left Door */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 25%, rgba(10, 6, 8, 0.4) 0%, rgba(10, 6, 8, 0.2) 40%, rgba(10, 6, 8, 0.85) 100%)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '180px',
            background: 'linear-gradient(to bottom, transparent, rgba(15, 15, 17, 0.95))'
          }}
        />
      </div>

      {/* Right Door */}
      <div
        ref={rightDoorRef}
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          width: '50%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 3,
          borderLeft: '1px solid rgba(212, 175, 55, 0.35)',
          boxShadow: '-4px 0 25px rgba(0, 0, 0, 0.6)'
        }}
      >
        <img
          src="/images/hero_building_bg.jpg"
          alt="Solomon Academy Architecture Right"
          style={{
            position: 'absolute',
            top: 0,
            left: '-50vw',
            width: '100vw',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 45%',
            filter: 'brightness(0.95) contrast(1.04)'
          }}
        />
        {/* Soft Vignette Overlay for Right Door */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 25%, rgba(10, 6, 8, 0.4) 0%, rgba(10, 6, 8, 0.2) 40%, rgba(10, 6, 8, 0.85) 100%)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '180px',
            background: 'linear-gradient(to bottom, transparent, rgba(15, 15, 17, 0.95))'
          }}
        />
      </div>

      {/* ======================================================== */}
      {/* LAYER 3: HERO CENTRAL CONTENT (Crest, Title, CTA Button) */}
      {/* ======================================================== */}
      <div
        ref={heroContentRef}
        style={{
          position: 'relative',
          zIndex: 5,
          width: '92%',
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          paddingTop: 'clamp(40px, 6vh, 80px)',
          paddingBottom: '40px'
        }}
      >
        {/* Golden Classical Temple Crest with Horizontal Wings */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            width: '100%',
            maxWidth: '620px',
            marginBottom: '16px'
          }}
        >
          <div
            style={{
              flex: 1,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.65))'
            }}
          />
          
          {/* Central Golden Crest Icon */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              filter: 'drop-shadow(0 4px 12px rgba(212, 175, 55, 0.45))'
            }}
          >
            <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="29" stroke="#d4af37" strokeWidth="1.2" strokeDasharray="2 2" />
              <circle cx="32" cy="32" r="26" stroke="#e8c86d" strokeWidth="1.5" />
              
              <polygon points="32,15 18,24 46,24" fill="#d4af37" />
              <rect x="20" y="24" width="24" height="2" fill="#f5e2a3" />
              
              <rect x="22" y="27" width="3" height="13" fill="#d4af37" rx="0.5" />
              <rect x="28.5" y="27" width="3" height="13" fill="#d4af37" rx="0.5" />
              <rect x="35" y="27" width="3" height="13" fill="#d4af37" rx="0.5" />
              <rect x="41.5" y="27" width="3" height="13" fill="#d4af37" rx="0.5" />
              
              <rect x="18" y="41" width="28" height="2" fill="#f5e2a3" />
              <rect x="16" y="43" width="32" height="3" fill="#d4af37" rx="0.5" />
              
              <path d="M12 36 C10 30 14 24 18 20" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M52 36 C54 30 50 24 46 20" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>

          <div
            style={{
              flex: 1,
              height: '1px',
              background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.65), transparent)'
            }}
          />
        </div>

        {/* Main Grand Title: სოლომონ აკადემია */}
        <h1
          style={{
            fontFamily: "'Noto Serif Georgian', 'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2.8rem, 6.2vw, 4.9rem)',
            fontWeight: 400,
            lineHeight: 1.15,
            color: '#f6f4ee',
            letterSpacing: '0.02em',
            textShadow: '0 4px 24px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 0, 0, 0.6)',
            marginBottom: '18px'
          }}
        >
          სოლომონ აკადემია
        </h1>

        {/* Subtitle with Flanking Gold Lines */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '18px',
            width: '100%',
            maxWidth: '520px',
            marginBottom: '36px'
          }}
        >
          <div
            style={{
              flex: 1,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.7))'
            }}
          />
          <p
            style={{
              fontFamily: "'Noto Serif Georgian', Georgia, serif",
              fontSize: 'clamp(1rem, 1.4vw, 1.25rem)',
              color: '#d6c8b0',
              fontWeight: 400,
              letterSpacing: '0.04em',
              margin: 0,
              textShadow: '0 2px 10px rgba(0,0,0,0.8)'
            }}
          >
            ცოდნის გზა იწყება აქ
          </p>
          <div
            style={{
              flex: 1,
              height: '1px',
              background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.7), transparent)'
            }}
          />
        </div>

        {/* Primary CTA Button: შეიტყვეთ მეტი → */}
        <a
          href="/gallery"
          onClick={(e) => {
            e.preventDefault();
            navigate('/gallery');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '13px 36px',
            borderRadius: '10px',
            background: 'linear-gradient(180deg, #b88628 0%, #9e6f1a 100%)',
            color: '#1a1104',
            fontFamily: "'Noto Sans Georgian', sans-serif",
            fontSize: '1rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
            textDecoration: 'none',
            border: '1px solid rgba(255, 230, 160, 0.45)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.35)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(180deg, #ca9530 0%, #ad7c1f 100%)';
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(184, 134, 40, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(180deg, #b88628 0%, #9e6f1a 100%)';
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.35)';
          }}
        >
          <span>შეიტყვეთ მეტი</span>
          <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>→</span>
        </a>
      </div>
    </section>
  );
}
