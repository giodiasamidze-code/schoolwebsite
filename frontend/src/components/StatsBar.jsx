import React from 'react';

export default function StatsBar() {
  const stats = [
    { value: '450+', label: 'აქტიური მოსწავლე' },
    { value: '15+',  label: 'წლიანი გამოცდილება' },
    { value: '4',    label: 'საერთ. აკრედიტაცია' },
    { value: '98%',  label: 'ჩარიცხვა უნივერსიტეტში' }
  ];

  return (
    <section
      style={{
        borderTop: '1px solid rgba(212, 175, 55, 0.15)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
        padding: 'clamp(44px, 5.5vh, 60px) 0',
        background: 'linear-gradient(180deg, rgba(14, 10, 12, 0.98) 0%, rgba(18, 12, 14, 0.98) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        className="stats-grid-inner"
        style={{
          width: '90%',
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
          position: 'relative',
          zIndex: 2
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            style={{
              padding: '24px 16px',
              textAlign: 'center',
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div style={{
              fontSize: 'clamp(2.3rem, 3.8vw, 3.2rem)',
              fontWeight: 700,
              color: '#f5e2a3',
              fontFamily: "'Noto Serif Georgian', Georgia, serif",
              lineHeight: 1,
              letterSpacing: '-0.02em',
              marginBottom: '8px',
              textShadow: '0 2px 14px rgba(212, 175, 55, 0.3)'
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: '0.82rem',
              color: 'rgba(255, 255, 255, 0.65)',
              letterSpacing: '0.06em',
              fontWeight: 600
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Responsive adjustments */}
      <style>{`
        @media (max-width: 840px) {
          .stats-grid-inner {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 480px) {
          .stats-grid-inner {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}

