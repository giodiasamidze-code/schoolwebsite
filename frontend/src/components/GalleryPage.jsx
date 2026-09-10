import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function GalleryPage() {
  const { navigate } = useAuth();
  const [activeIndex, setActiveIndex] = useState(1); // 0-indexed, 1 is 02/06

  const galleryItems = [
    {
      id: 1,
      title: 'აკადემიის მთავარი ფასადი',
      subtitle: 'ექსტერიერის არქიტექტურული ხედი',
      image: '/assets/palace-exterior.jpg',
      icon: null
    },
    {
      id: 2,
      title: 'ცენტრალური დარბაზი',
      subtitle: 'ინტერიერის ვიზუალური კონცეფცია',
      image: '/assets/palace-interior.jpg',
      icon: null
    },
    {
      id: 3,
      title: 'სამეცნიერო STEM ლაბორატორია',
      subtitle: 'ინოვაციური ექსპერიმენტული სივრცე',
      image: '/images/news_stem_robotics.jpg',
      icon: null
    },
    {
      id: 4,
      title: 'აკადემიური ბიბლიოთეკა & სამკითხველო',
      subtitle: 'ინტელექტუალური მუშაობის გარემო',
      image: '/images/news_olympiad_prep.jpg',
      icon: null
    },
    {
      id: 5,
      title: 'ასტროფიზიკის ობსერვატორია',
      subtitle: 'კოსმოსური დაკვირვებების ცენტრი',
      image: '/images/news_robotics_arm.jpg',
      icon: null
    },
    {
      id: 6,
      title: 'ბიო-ეკოლოგიური ლაბორატორია',
      subtitle: 'ბუნებისმეტყველებისა და კვლევების სივრცე',
      image: '/images/news_eco_science.jpg',
      icon: null
    }
  ];

  const currentItem = galleryItems[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: '#090507',
        color: '#ffffff'
      }}
    >
      {/* Active Fullscreen Image or Icon Placeholder */}
      {currentItem.image ? (
        <img
          src={currentItem.image}
          alt={currentItem.title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'all 0.5s ease-in-out'
          }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(20, 10, 14, 0.9) 0%, rgba(35, 20, 25, 0.85) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '24px'
          }}
        >
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'rgba(212, 175, 55, 0.12)',
            border: '2px solid rgba(212, 175, 55, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <p style={{ color: 'rgba(212, 175, 55, 0.8)', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            ფოტო მალე დაემატება
          </p>
        </div>
      )}

      {/* Luxury Vignette Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(10, 6, 8, 0.4) 0%, rgba(10, 6, 8, 0.1) 40%, rgba(10, 6, 8, 0.8) 100%)',
          pointerEvents: 'none'
        }}
      />

      {/* Top Bar with Close X */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '40px',
          right: '40px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end'
        }}
      >

        <button
          onClick={() => navigate('/')}
          style={{
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#d4af37';
            e.currentTarget.style.color = '#d4af37';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.color = '#ffffff';
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Left Navigation Arrow */}
      <button
        onClick={handlePrev}
        style={{
          position: 'absolute',
          left: '30px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          background: 'rgba(20, 12, 15, 0.6)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '14px',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(40, 24, 30, 0.85)';
          e.currentTarget.style.borderColor = '#d4af37';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(20, 12, 15, 0.6)';
          e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
        }}
      >
        <ArrowLeft size={22} />
      </button>

      {/* Right Navigation Arrow */}
      <button
        onClick={handleNext}
        style={{
          position: 'absolute',
          right: '30px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          background: 'rgba(20, 12, 15, 0.6)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '14px',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(40, 24, 30, 0.85)';
          e.currentTarget.style.borderColor = '#d4af37';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(20, 12, 15, 0.6)';
          e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
        }}
      >
        <ArrowRight size={22} />
      </button>

      {/* Bottom Bar matching Photo 5 */}
      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '40px',
          right: '40px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between'
        }}
      >
        {/* Caption bottom left */}
        <div style={{ textShadow: '0 4px 15px rgba(0,0,0,0.8)' }}>
          <h2
            style={{
              fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
              fontSize: 'clamp(1.6rem, 2.4vw, 2.2rem)',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '4px'
            }}
          >
            {currentItem.title}
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.75)' }}>
            {currentItem.subtitle}
          </p>
        </div>

        {/* Center Thumbnails Reel (Photo 5) */}
        <div
          style={{
            background: 'rgba(20, 12, 15, 0.65)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: '16px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {galleryItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setActiveIndex(idx)}
              style={{
                width: '64px',
                height: '44px',
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: activeIndex === idx ? '2px solid #d4af37' : '1px solid rgba(255, 255, 255, 0.15)',
                opacity: activeIndex === idx ? 1 : 0.6,
                transition: 'all 0.2s ease'
              }}
            >
              {item.image ? (
                <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'rgba(212,175,55,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Counter bottom right: 02 / 06 */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '20px',
            padding: '6px 16px',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: '#d4af37',
            letterSpacing: '0.08em'
          }}
        >
          0{activeIndex + 1} / 0{galleryItems.length}
        </div>
      </div>
    </div>
  );
}
