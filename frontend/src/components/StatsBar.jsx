import React from 'react';
import { Users, Award, Globe, GraduationCap, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

export default function StatsBar() {
  const stats = [
    {
      endVal: 450,
      suffix: '+',
      label: 'აქტიური მოსწავლე',
      detail: 'დაწყებითი, საბაზო და საშუალო',
      badge: 'ლიდერი სკოლა',
      icon: Users,
      iconBg: 'linear-gradient(135deg, #8b0000, #c41e3a)',
      iconColor: '#ffffff'
    },
    {
      endVal: 15,
      suffix: '+',
      label: 'წლიანი გამოცდილება',
      detail: 'საგანმანათლებლო ტრადიცია',
      badge: 'დაარსდა 2011',
      icon: GraduationCap,
      iconBg: 'rgba(212, 175, 55, 0.15)',
      iconColor: 'var(--accent-secondary, #d4af37)'
    },
    {
      endVal: 4,
      suffix: '',
      label: 'საერთაშორისო აკრედიტაცია',
      detail: 'Cambridge, IB, AdvancED',
      badge: 'გლობალური ხარისხი',
      icon: Globe,
      iconBg: 'rgba(34, 197, 94, 0.15)',
      iconColor: '#86efac'
    },
    {
      endVal: 98,
      suffix: '%',
      label: 'უნივერსიტეტებში ჩარიცხვა',
      detail: '100% სახელმწიფო & საერთაშორისო გრანტი',
      badge: 'უმაღლესი შედეგი',
      icon: Award,
      iconBg: 'rgba(59, 130, 246, 0.15)',
      iconColor: '#93c5fd'
    }
  ];

  return (
    <>
      {/* Luxury Gold Divider */}
      <div className="luxury-divider">
        <div className="luxury-divider-line" />
        <span className="luxury-divider-star">✦ ✦ ✦</span>
        <div className="luxury-divider-line" />
      </div>

      <section className="stats-bar" style={{
        padding: '30px 0 50px',
        background: 'transparent',
        position: 'relative'
      }}>
        <div style={{ width: '92%', maxWidth: '1360px', margin: '0 auto' }}>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="spotlight-card"
                  style={{
                    background: 'linear-gradient(145deg, rgba(32, 11, 15, 0.85), rgba(18, 6, 8, 0.95))',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '26px',
                    boxShadow: '0 16px 36px rgba(0,0,0,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backdropFilter: 'blur(16px)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', position: 'relative', zIndex: 2 }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: stat.iconBg,
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stat.iconColor,
                      boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
                    }}>
                      <Icon size={22} />
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '20px',
                      background: 'rgba(212, 175, 55, 0.1)',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      color: 'var(--accent-secondary, #d4af37)',
                      letterSpacing: '0.04em'
                    }}>
                      {stat.badge}
                    </span>
                  </div>

                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{
                      fontSize: '2.5rem',
                      fontWeight: 800,
                      color: '#ffffff',
                      fontFamily: 'var(--font-serif, Georgia, serif)',
                      lineHeight: 1.1,
                      marginBottom: '6px',
                      textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                    }}>
                      <AnimatedCounter end={stat.endVal} suffix={stat.suffix} />
                    </div>
                    <div style={{ fontSize: '0.96rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.92)' }}>
                      {stat.label}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.55)', marginTop: '4px' }}>
                      {stat.detail}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Luxury Gold Divider */}
      <div className="luxury-divider">
        <div className="luxury-divider-line" />
        <span className="luxury-divider-star">✦</span>
        <div className="luxury-divider-line" />
      </div>
    </>
  );
}
