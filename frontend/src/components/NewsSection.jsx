import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, X, Sparkles, Calendar, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function NewsSection() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const stickyRef = useRef(null);

  const projects = [
    {
      id: 'project-1',
      title: 'აკადემიის ინოვაციური პროექტები',
      tags: ['[ STEM ]', '[ კვლევები ]', '[ ინოვაციები ]'],
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
      date: '24 მაისი, 2026',
      author: 'დავით გიორგაძე',
      description: 'აკადემიის ახალი პროექტები აერთიანებს ინტერდისციპლინურ კვლევებსა და თანამედროვე სასწავლო მეთოდოლოგიას. მოსწავლეები მუშაობენ რეალურ სამეცნიერო და ჰუმანიტარულ ქეისებზე, რაც ავითარებს კრიტიკულ აზროვნებას, გუნდურ მუშაობასა და კვლევით უნარ-ჩვევებს.',
      bullets: [
        'საერთაშორისო აკადემიური გაცვლითი პროექტები პარტნიორ უნივერსიტეტებთან',
        'სტუდენტური დებატების ლიგა და დიპლომატიური სიმულაციები',
        'საზოგადოებრივი ინიციატივები და ადგილობრივი თემის მხარდაჭერა'
      ]
    },
    {
      id: 'project-2',
      title: 'ეკოლოგიური კვლევა & STEM',
      tags: ['[ ეკოლოგია ]', '[ ბიოტექნოლოგია ]', '[ რობოტიკა ]'],
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1200',
      date: '18 მაისი, 2026',
      author: 'ანა კაპანაძე',
      description: 'ეკოლოგიური კვლევის ლაბორატორია ატარებს კომპლექსურ კვლევებს ბუნებრივი ეკოსისტემების მდგრადობისა და თანამედროვე რობოტოტექნიკის გამოყენებით. მოსწავლეები ქმნიან ავტონომიურ სენსორულ სისტემებს ნიადაგისა და ჰაერის მონიტორინგისთვის.',
      bullets: [
        'ახალი მცენარეების კლასიფიკაცია და გენეტიკური დახასიათება',
        'ნიადაგის ჯანმრთელობისა და ტენიანობის სენსორული მონიტორინგი',
        'ეკოსისტემის დაცვის ინიციატივები და ურბანული ეკოლოგია',
        'ბიოლოგიური ნიმუშების სპექტრომეტრული ანალიზი'
      ]
    },
    {
      id: 'project-3',
      title: 'საერთაშორისო ოლიმპიადის ტრიუმფი',
      tags: ['[ მათემატიკა ]', '[ AI & ALGORITHMS ]'],
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
      date: '10 მაისი, 2026',
      author: 'ნიკოლოზ წერეთელი & ალექსანდრე ჩხეიძე',
      description: 'სოლომონ აკადემიის გუნდმა ევროპის ახალგაზრდულ ოლიმპიადაზე მათემატიკასა და ალგორითმულ პროგრამირებაში 3 ოქროსა და 2 ვერცხლის მედალი მოიპოვა. ეს გამარჯვება აკადემიის მაღალი სტანდარტების დასტურია.',
      bullets: [
        'მათემატიკური ანალიზისა და ალგორითმების ტურში უმაღლესი ქულები',
        'მსოფლიოს 42 ქვეყნის წარმომადგენელთა შორის პირველი გუნდური ადგილი',
        'სრული სტიპენდიები წამყვანი უნივერსიტეტების მოსამზადებელ კურსებზე'
      ]
    },
    {
      id: 'project-4',
      title: 'ასტროფიზიკის ობსერვატორია & AI',
      tags: ['[ ასტრონომია ]', '[ კოსმოსური კვლევა ]'],
      image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=1200',
      date: '2 მაისი, 2026',
      author: 'ალექსანდრე ჩხეიძე',
      description: 'აკადემიის ახალი ციფრული ტელესკოპის მეშვეობით მოსწავლეებმა პლანეტარული ნისლეულებისა და მთვარის კრატერების მაღალი გარჩევადობის ფოტომასალა მოიპოვეს, რომელიც საერთაშორისო ასტრონომიულ ბაზაში განთავსდა.',
      bullets: [
        'ღამის ასტრონომიული დაკვირვებები და სპექტროსკოპია',
        'კოსმოსური მონაცემების ციფრული დამუშავება Python-ის გამოყენებით',
        'ღია ლექციები ასტროფიზიკისა და კოსმოლოგიის მიმართულებით'
      ]
    }
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 900);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleScroll = () => {
      if (window.innerWidth < 900) return;
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollableDistance = rect.height - windowHeight;

      if (totalScrollableDistance <= 0) return;

      const progress = Math.min(1, Math.max(0, -rect.top / totalScrollableDistance));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      id="news"
      ref={sectionRef}
      style={{
        position: 'relative',
        background: '#0c0608',
        height: isMobile ? 'auto' : '350vh',
        padding: isMobile ? 'clamp(36px, 6vh, 60px) 0' : 0,
        color: '#f0ece8'
      }}
    >
      {/* Subtle Chalkboard Math Background */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: 0.1
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <text x="2%" y="15%" fill="#d4af37" fontSize="24" fontFamily="serif" fontStyle="italic">f = ∫₀^∞ f(x)dx</text>
        <text x="92%" y="18%" fill="#d4af37" fontSize="24" fontFamily="serif" fontStyle="italic">∫ x dx</text>
        <text x="90%" y="45%" fill="#d4af37" fontSize="24" fontFamily="serif" fontStyle="italic">√a² + b²</text>
      </svg>

      {/* ========================================================================= */}
      {/* 1. MOBILE & TABLET LAYOUT: 2-Column Grid matching Fraxbit Mobile Photo    */}
      {/* ========================================================================= */}
      {isMobile ? (
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '92%',
            maxWidth: '900px',
            margin: '0 auto'
          }}
        >
          {/* Mobile Section Title */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#d4af37',
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '4px'
              }}
            >
              <Sparkles size={13} color="#d4af37" />
              აქტივობების ქრონიკა
            </span>
            <h2
              style={{
                fontFamily: "'Noto Serif Georgian', Georgia, serif",
                fontSize: '2rem',
                fontWeight: 600,
                color: '#ffffff',
                margin: 0
              }}
            >
              სიახლეები
            </h2>
          </div>

          {/* 2-Column Responsive Grid (Photo Match) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '16px'
            }}
          >
            {projects.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedArticle(item)}
                style={{
                  position: 'relative',
                  height: '280px',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  background: '#161311',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.7)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '18px',
                  boxSizing: 'border-box',
                  transition: 'transform 0.2s ease'
                }}
              >
                {/* Background Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0
                  }}
                />

                {/* Dark Gradient Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(14, 10, 12, 0.1) 0%, rgba(14, 10, 12, 0.6) 40%, rgba(10, 6, 8, 0.95) 100%)',
                    zIndex: 1
                  }}
                />

                {/* Date Tag */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'rgba(18, 12, 14, 0.8)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    padding: '3px 10px',
                    borderRadius: '100px',
                    fontSize: '0.68rem',
                    color: '#f5e2a3'
                  }}
                >
                  <Calendar size={11} color="#d4af37" />
                  <span>{item.date}</span>
                </div>

                {/* Content: Title + Bracket Tags */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <h3
                    style={{
                      fontFamily: "'Noto Serif Georgian', Georgia, serif",
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      textTransform: 'uppercase',
                      letterSpacing: '0.02em',
                      margin: '0 0 6px',
                      lineHeight: 1.25,
                      textShadow: '0 2px 8px rgba(0,0,0,0.9)'
                    }}
                  >
                    {item.title}
                  </h3>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      color: 'rgba(212, 175, 55, 0.9)',
                      textTransform: 'uppercase'
                    }}
                  >
                    {item.tags.map((tag, tIdx) => (
                      <span key={tIdx}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Bottom Full-Width "VIEW MORE PROJECTS" Card (Photo 2 Match) */}
            <div
              onClick={() => setSelectedArticle(projects[0])}
              style={{
                gridColumn: '1 / -1',
                height: '180px',
                borderRadius: '20px',
                background: 'linear-gradient(180deg, #1a1412 0%, #120e10 100%)',
                border: '1.5px solid rgba(212, 175, 55, 0.4)',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.7), inset 0 0 25px rgba(212, 175, 55, 0.05)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '18px',
                boxSizing: 'border-box'
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: '2px solid #d4af37',
                  background: 'rgba(212, 175, 55, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                  boxShadow: '0 0 16px rgba(212, 175, 55, 0.3)',
                  color: '#f5e2a3'
                }}
              >
                <ArrowRight size={22} color="#f5e2a3" />
              </div>

              <span
                style={{
                  fontFamily: "'Noto Serif Georgian', Georgia, serif",
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}
              >
                სრულად ნახვა
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  color: '#d4af37',
                  marginTop: '4px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}
              >
                [ VIEW MORE PROJECTS ]
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. DESKTOP LAYOUT: Sticky Fullscreen Horizontal Scroll Track (Fraxbit)    */
        /* ========================================================================= */
        <div
          ref={stickyRef}
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            width: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            boxSizing: 'border-box',
            padding: 'clamp(20px, 3vh, 40px) 0'
          }}
        >
          {/* Section Heading at Top */}
          <div
            style={{
              position: 'relative',
              zIndex: 3,
              width: '92%',
              maxWidth: '1380px',
              margin: '0 auto clamp(16px, 2.5vh, 28px)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#d4af37',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: '4px'
                }}
              >
                <Sparkles size={14} color="#d4af37" />
                აქტივობების ქრონიკა & ინოვაციები
              </span>
              <h2
                style={{
                  fontFamily: "'Noto Serif Georgian', Georgia, serif",
                  fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                  fontWeight: 600,
                  color: '#ffffff',
                  letterSpacing: '0.01em',
                  margin: 0
                }}
              >
                სიახლეები
              </h2>
            </div>

            {/* Progress Indicator Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'monospace' }}>
                {Math.min(projects.length, Math.floor(scrollProgress * (projects.length + 0.99)) + 1)} / {projects.length}
              </span>
              <div
                style={{
                  width: '120px',
                  height: '3px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  borderRadius: '100px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${Math.max(5, scrollProgress * 100)}%`,
                    background: 'linear-gradient(90deg, #b88628, #f5e2a3)',
                    borderRadius: '100px',
                    transition: 'width 0.1s ease-out'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Horizontal Sliding Cards Track (Fraxbit Desktop Style) */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              width: '100%',
              overflow: 'visible'
            }}
          >
            <div
              ref={trackRef}
              style={{
                display: 'flex',
                gap: 'clamp(24px, 3vw, 44px)',
                paddingLeft: 'max(4vw, calc((100vw - 1380px) / 2 + 40px))',
                paddingRight: '12vw',
                transform: `translate3d(-${scrollProgress * (projects.length * 560 + 300 - (typeof window !== 'undefined' ? window.innerWidth : 1200) * 0.55)}px, 0, 0)`,
                willChange: 'transform',
                transition: 'transform 0.08s linear'
              }}
            >
              {projects.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedArticle(item)}
                  style={{
                    flex: '0 0 clamp(380px, 38vw, 560px)',
                    height: 'clamp(360px, 54vh, 480px)',
                    borderRadius: '26px',
                    overflow: 'hidden',
                    position: 'relative',
                    background: '#161311',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 25px rgba(212, 175, 55, 0.05)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: 'clamp(22px, 3vw, 32px)',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px) scale(1.015)';
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.7)';
                    e.currentTarget.style.boxShadow = '0 25px 60px rgba(0,0,0,0.9), 0 0 35px rgba(212,175,55,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.25)';
                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 25px rgba(212, 175, 55, 0.05)';
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      zIndex: 0,
                      transition: 'transform 0.5s ease'
                    }}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(14, 10, 12, 0.2) 0%, rgba(14, 10, 12, 0.6) 45%, rgba(10, 6, 8, 0.95) 100%)',
                      zIndex: 1
                    }}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      top: '20px',
                      left: '20px',
                      zIndex: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(18, 12, 14, 0.75)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      padding: '4px 12px',
                      borderRadius: '100px',
                      fontSize: '0.72rem',
                      color: '#f5e2a3'
                    }}
                  >
                    <Calendar size={12} color="#d4af37" />
                    <span>{item.date}</span>
                  </div>

                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <h3
                      style={{
                        fontFamily: "'Noto Serif Georgian', Georgia, serif",
                        fontSize: 'clamp(1.2rem, 1.8vw, 1.55rem)',
                        fontWeight: 700,
                        color: '#ffffff',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                        margin: '0 0 8px',
                        lineHeight: 1.25,
                        textShadow: '0 2px 10px rgba(0,0,0,0.9)'
                      }}
                    >
                      {item.title}
                    </h3>

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'rgba(212, 175, 55, 0.9)',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase'
                      }}
                    >
                      {item.tags.map((tag, tIdx) => (
                        <span key={tIdx}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Dedicated "VIEW MORE PROJECTS" Card */}
              <div
                onClick={() => setSelectedArticle(projects[0])}
                style={{
                  flex: '0 0 clamp(220px, 18vw, 280px)',
                  height: 'clamp(360px, 54vh, 480px)',
                  borderRadius: '26px',
                  background: 'linear-gradient(180deg, #1a1412 0%, #120e10 100%)',
                  border: '1.5px solid rgba(212, 175, 55, 0.4)',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), inset 0 0 30px rgba(212, 175, 55, 0.05)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '24px',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                  e.currentTarget.style.borderColor = '#d4af37';
                  e.currentTarget.style.boxShadow = '0 25px 60px rgba(0,0,0,0.9), 0 0 35px rgba(212,175,55,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.8), inset 0 0 30px rgba(212, 175, 55, 0.05)';
                }}
              >
                <div
                  style={{
                    width: '58px',
                    height: '58px',
                    borderRadius: '50%',
                    border: '2px solid #d4af37',
                    background: 'rgba(212, 175, 55, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    boxShadow: '0 0 20px rgba(212, 175, 55, 0.35)',
                    color: '#f5e2a3'
                  }}
                >
                  <ArrowRight size={26} color="#f5e2a3" />
                </div>

                <span
                  style={{
                    fontFamily: "'Noto Serif Georgian', Georgia, serif",
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    lineHeight: 1.3
                  }}
                >
                  სრულად ნახვა
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: '#d4af37',
                    marginTop: '6px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase'
                  }}
                >
                  [ VIEW MORE ]
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Article Detail Reading Modal */}
      {selectedArticle && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedArticle(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#161311',
              border: '1.5px solid rgba(212, 175, 55, 0.75)',
              borderRadius: '24px',
              maxWidth: '720px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 'clamp(24px, 4vw, 36px)',
              boxShadow: '0 24px 70px rgba(0,0,0,0.85)',
              position: 'relative',
              color: '#ffffff'
            }}
          >
            <button
              onClick={() => setSelectedArticle(null)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ borderRadius: '16px', overflow: 'hidden', height: '240px', marginBottom: '20px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span
                style={{
                  background: '#b88628',
                  color: '#ffffff',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  padding: '3px 12px',
                  borderRadius: '100px'
                }}
              >
                {selectedArticle.tags[0]}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#c4a66a', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} color="#d4af37" />
                {selectedArticle.date}
              </span>
            </div>

            <h2
              style={{
                fontFamily: "'Noto Serif Georgian', serif",
                fontSize: 'clamp(1.4rem, 2.2vw, 1.8rem)',
                color: '#f5e2a3',
                marginBottom: '14px',
                lineHeight: 1.3
              }}
            >
              {selectedArticle.title}
            </h2>

            <p style={{ fontSize: '0.94rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.85)', marginBottom: '18px' }}>
              {selectedArticle.description}
            </p>

            {selectedArticle.bullets && selectedArticle.bullets.length > 0 && (
              <div style={{ background: 'rgba(20, 16, 14, 0.8)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '14px', padding: '18px 22px' }}>
                <h4 style={{ color: '#d4af37', fontSize: '0.94rem', margin: '0 0 12px' }}>
                  ძირითადი მიმართულებები და შედეგები:
                </h4>
                <ul style={{ paddingLeft: '0', listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: '#ded7cd', lineHeight: 1.5 }}>
                  {selectedArticle.bullets.map((b, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <CheckCircle2 size={15} color="#d4af37" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
