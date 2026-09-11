import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Landmark } from 'lucide-react';
import { useAuth } from './AuthContext';

const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'ცენტრალური დარბაზი',
    subtitle: 'საკლასო სივრცე',
    category: 'შენობა',
    image: '/assets/palace-interior.jpg'
  },
  {
    id: 2,
    title: 'აკადემიის ფასადი',
    subtitle: 'ექსტერიერი & კამპუსი',
    category: 'შენობა',
    image: '/assets/palace-exterior.jpg'
  },
  {
    id: 3,
    title: 'საკლასო ოთახი',
    subtitle: 'სასწავლო აუდიტორია',
    category: 'საკლასო ოთახები',
    image: '/assets/gallery_classroom.jpg'
  },
  {
    id: 4,
    title: 'სასადილო დარბაზი',
    subtitle: 'საზეიმო სივრცე',
    category: 'ღონისძიებები',
    image: '/assets/gallery_dining.jpg'
  },
  {
    id: 5,
    title: 'აკადემიის ბაღი',
    subtitle: 'კამპუსის რეკრეაცია',
    category: 'შენობა',
    image: '/assets/gallery_garden.jpg'
  },
  {
    id: 6,
    title: 'აკადემიური ბიბლიოთეკა',
    subtitle: 'სამკითხველო სივრცე',
    category: 'მოსწავლეები',
    image: '/images/news_olympiad_prep.jpg'
  }
];

const CATEGORIES = [
  { id: 'ყველა', label: 'ყველა' },
  { id: 'შენობა', label: 'შენობა' },
  { id: 'საკლასო ოთახები', label: 'საკლასო ოთახები' },
  { id: 'ღონისძიებები', label: 'ღონისძიებები' },
  { id: 'მოსწავლეები', label: 'მოსწავლეები' }
];

export default function GalleryPage() {
  const { navigate } = useAuth();
  const [activeCategory, setActiveCategory] = useState('ყველა');
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredItems = activeCategory === 'ყველა'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  // Ensure active index is within bounds of filtered items
  const safeIndex = activeIndex < filteredItems.length ? activeIndex : 0;
  const currentItem = filteredItems[safeIndex] || GALLERY_ITEMS[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1));
  };

  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    setActiveIndex(0);
  };

  // Find index in current filtered list for display
  const currentItemIndex = safeIndex + 1;
  const totalItemCount = filteredItems.length;

  const padZero = (n) => (n < 10 ? `0${n}` : `${n}`);

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        backgroundImage: `linear-gradient(180deg, rgba(12, 6, 8, 0.72) 0%, rgba(12, 6, 8, 0.88) 100%), url(/assets/palace-interior.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: '#ffffff',
        paddingTop: '88px',
        paddingBottom: '36px',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          width: '94%',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        {/* Top Header Row: Breadcrumb & Title on Left, Categories on Right */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '18px',
            marginTop: '10px'
          }}
        >
          {/* Left: Breadcrumbs & Title */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.86rem',
                color: 'rgba(255, 255, 255, 0.55)',
                marginBottom: '8px'
              }}
            >
              <span
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#d4af37')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.55)')}
              >
                მთავარი
              </span>
              <span style={{ color: 'rgba(212, 175, 55, 0.6)' }}>›</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>გალერეა</span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                fontSize: 'clamp(2.2rem, 3.6vw, 3.2rem)',
                fontWeight: 700,
                color: '#ffffff',
                margin: '0 0 6px 0',
                letterSpacing: '-0.02em',
                lineHeight: 1.15
              }}
            >
              სკოლის გალერეა
            </h1>

            <p
              style={{
                fontSize: 'clamp(0.92rem, 1.2vw, 1.05rem)',
                color: 'rgba(255, 255, 255, 0.72)',
                margin: 0,
                fontWeight: 400
              }}
            >
              აღმოაჩინეთ Solomon Academy-ის სივრცეები და გარემო
            </p>
          </div>

          {/* Right: Filter Category Pills */}
          <div
            className="horizontal-pill-row gallery-category-pills"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              overflowX: 'auto',
              flexWrap: 'nowrap',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              paddingBottom: '4px',
              maxWidth: '100%'
            }}
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  style={{
                    background: isActive ? 'rgba(212, 175, 55, 0.16)' : 'rgba(0, 0, 0, 0.45)',
                    border: `1.2px solid ${isActive ? '#d4af37' : 'rgba(255, 255, 255, 0.12)'}`,
                    color: isActive ? '#f5d97a' : 'rgba(255, 255, 255, 0.75)',
                    padding: '8px 20px',
                    borderRadius: '24px',
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? '0 0 16px rgba(212, 175, 55, 0.25)' : 'none',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.45)';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)';
                    }
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Main Stage Frame */}
        <div
          className="gallery-main-stage"
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(320px, 56vh, 660px)',
            borderRadius: '24px',
            border: '1.5px solid rgba(212, 175, 55, 0.4)',
            boxShadow: '0 24px 70px rgba(0, 0, 0, 0.85), inset 0 0 60px rgba(0, 0, 0, 0.35)',
            overflow: 'hidden',
            background: '#0e0709'
          }}
        >
          {/* Main Photo */}
          <img
            key={currentItem.id}
            src={currentItem.image}
            alt={currentItem.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'opacity 0.35s ease, transform 0.4s ease'
            }}
          />

          {/* Vignette Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.0) 50%, rgba(10, 5, 8, 0.75) 100%)',
              pointerEvents: 'none'
            }}
          />

          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous photo"
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 3,
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(15, 8, 12, 0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.3)';
              e.currentTarget.style.borderColor = '#d4af37';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(15, 8, 12, 0.7)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            aria-label="Next photo"
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 3,
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(15, 8, 12, 0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.3)';
              e.currentTarget.style.borderColor = '#d4af37';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(15, 8, 12, 0.7)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronRight size={24} />
          </button>

          {/* Bottom Left Overlay Badge */}
          <div
            className="gallery-overlay-badge"
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              zIndex: 3,
              background: 'rgba(18, 10, 14, 0.82)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '16px',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)'
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(212, 175, 55, 0.16)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d4af37'
              }}
            >
              <Landmark size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.25 }}>
                {currentItem.title}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.65)', marginTop: '2px' }}>
                {currentItem.subtitle}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Thumbnail Strip & Counter Bar */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            marginTop: '4px'
          }}
        >
          {/* Thumbnails Row with Arrows */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              maxWidth: '85%',
              overflowX: 'auto',
              padding: '6px 4px'
            }}
          >
            {/* Small Left Arrow */}
            <button
              onClick={handlePrev}
              aria-label="Previous"
              style={{
                width: '38px',
                height: '38px',
                flexShrink: 0,
                borderRadius: '50%',
                background: 'rgba(18, 10, 14, 0.75)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#d4af37';
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                e.currentTarget.style.background = 'rgba(18, 10, 14, 0.75)';
              }}
            >
              <ChevronLeft size={18} />
            </button>

            {/* Individual Thumbnails */}
            {filteredItems.map((item, idx) => {
              const isThumbActive = safeIndex === idx;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveIndex(idx)}
                  style={{
                    width: '104px',
                    height: '64px',
                    flexShrink: 0,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: isThumbActive ? '2.5px solid #d4af37' : '1px solid rgba(255, 255, 255, 0.15)',
                    opacity: isThumbActive ? 1 : 0.65,
                    transform: isThumbActive ? 'scale(1.04)' : 'scale(1)',
                    boxShadow: isThumbActive ? '0 0 16px rgba(212, 175, 55, 0.5)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isThumbActive) {
                      e.currentTarget.style.opacity = '0.9';
                      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isThumbActive) {
                      e.currentTarget.style.opacity = '0.65';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    }
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </div>
              );
            })}

            {/* Small Right Arrow */}
            <button
              onClick={handleNext}
              aria-label="Next"
              style={{
                width: '38px',
                height: '38px',
                flexShrink: 0,
                borderRadius: '50%',
                background: 'rgba(18, 10, 14, 0.75)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#d4af37';
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                e.currentTarget.style.background = 'rgba(18, 10, 14, 0.75)';
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Far Right Counter Pill */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(18, 10, 14, 0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '24px',
              padding: '7px 18px',
              color: '#d4af37',
              fontSize: '0.88rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)'
            }}
          >
            {padZero(currentItemIndex)} / {padZero(totalItemCount)}
          </div>
        </div>
      </div>
    </div>
  );
}
