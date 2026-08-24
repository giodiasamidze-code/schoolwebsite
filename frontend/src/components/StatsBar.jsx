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
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0'
      }}
    >
      <div style={{
        width: '90%',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)'
      }}>
        {stats.map((stat, i) => (
          <div
            key={i}
            style={{
              padding: '36px 24px',
              textAlign: 'center',
              borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none'
            }}
          >
            <div style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: 700,
              color: '#ffffff',
              fontFamily: 'var(--font-serif)',
              lineHeight: 1,
              letterSpacing: '-0.03em',
              marginBottom: '8px'
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: '0.78rem',
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: 2x2 grid */}
      <style>{`
        @media (max-width: 640px) {
          .stats-grid-inner {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
