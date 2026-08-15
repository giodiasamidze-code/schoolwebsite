import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Edit3, ArrowUp, MessageCircle } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function FloatingDock() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { path, navigate } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    if (path !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.querySelector(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } else {
      const el = document.querySelector(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 900,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 14px',
        background: 'rgba(28, 10, 14, 0.92)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '40px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 20px rgba(196, 30, 58, 0.25)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className="floating-velvet-dock"
    >
      {/* Quick Call */}
      <a
        href="tel:+995555123456"
        title="დარეკვა"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 12px',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '30px',
          color: '#ffffff',
          textDecoration: 'none',
          fontSize: '0.82rem',
          fontWeight: 600,
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
          e.currentTarget.style.borderColor = '#d4af37';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <Phone size={14} color="#d4af37" />
        <span className="dock-label">ზარი</span>
      </a>

      {/* Location */}
      <button
        onClick={() => scrollToSection('#contact')}
        title="სკოლის ლოკაცია & კონტაქტი"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 12px',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '30px',
          color: '#ffffff',
          fontSize: '0.82rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
          e.currentTarget.style.borderColor = '#d4af37';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <MapPin size={14} color="#ff8598" />
        <span className="dock-label">მისამართი</span>
      </button>

      {/* Online Application CTA Pill */}
      <button
        onClick={() => scrollToSection('#admissions')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 16px',
          background: 'linear-gradient(135deg, #8b0000 0%, #c41e3a 100%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '30px',
          color: '#ffffff',
          fontSize: '0.85rem',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(139, 0, 0, 0.5)',
          transition: 'all 0.2s',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
          e.currentTarget.style.boxShadow = '0 6px 22px rgba(196, 30, 58, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(139, 0, 0, 0.5)';
        }}
      >
        <Edit3 size={14} />
        <span>მიღება 2026</span>
      </button>

      {/* Scroll to Top (Appears after scrolling down) */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          title="ზემოთ ასვლა"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '34px',
            height: '34px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
            color: '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#c41e3a';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <ArrowUp size={14} />
        </button>
      )}
    </div>
  );
}
