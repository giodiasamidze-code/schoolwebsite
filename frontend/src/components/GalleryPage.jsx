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
      image: '/assets/palace-exterior.jpg'
    },
    {
      id: 2,
      title: 'ცენტრალური დარბაზი',
      subtitle: 'ინტერიერის ვიზუალური კონცეფცია',
      image: '/assets/palace-interior.jpg'
    },
    {
      id: 3,
      title: 'სამეცნიერო STEM ლაბორატორია',
      subtitle: 'ინოვაციური ექსპერიმენტული სივრცე',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1600&auto=format&fit=crop&q=80'
    },
    {
      id: 4,
      title: 'აკადემიური ბიბლიოთეკა & სამკითხველო',
      subtitle: 'ინტელექტუალური მუშაობის გარემო',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1600&auto=format&fit=crop&q=80'
    },
    {
      id: 5,
      title: 'ასტროფიზიკის ობსერვატორია',
      subtitle: 'კოსმოსური დაკვირვებების ცენტრი',
      image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&auto=format&fit=crop&q=80'
    },
    {
      id: 6,
      title: 'საზეიმო დარბაზი & ამფითეატრი',
      subtitle: 'ღონისძიებებისა და დებატების დარბაზი',
      image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1600&auto=format&fit=crop&q=80'
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
      {/* Active Fullscreen Image */}
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

      {/* Top Bar with 09 / 18 Counter and Close X */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '40px',
          right: '40px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '20px',
            padding: '5px 16px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#d4af37',
            letterSpacing: '0.08em'
          }}
        >
          09 / 18
        </div>

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
              <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
