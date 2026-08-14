import React from 'react';
import { Users, Award, Globe, GraduationCap, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';

export default function StatsBar() {
  const stats = [
    {
      number: '450+',
      label: 'აქტიური მოსწავლე',
      detail: 'დაწყებითი, საბაზო და საშუალო',
      badge: 'ლიდერი სკოლა',
      icon: Users,
      iconBg: 'linear-gradient(135deg, #8b0000, #c41e3a)',
      iconColor: '#ffffff'
    },
    {
      number: '15+',
      label: 'წლიანი გამოცდილება',
      detail: 'საგანმანათლებლო ტრადიცია',
      badge: 'დაარსდა 2011',
      icon: GraduationCap,
      iconBg: 'rgba(212, 175, 55, 0.15)',
      iconColor: 'var(--accent-secondary, #d4af37)'
    },
    {
      number: '4',
      label: 'საერთაშორისო აკრედიტაცია',
      detail: 'Cambridge, IB, AdvancED',
      badge: 'გლობალური ხარისხი',
      icon: Globe,
      iconBg: 'rgba(34, 197, 94, 0.15)',
      iconColor: '#86efac'
    },
    {
      number: '98%',
      label: 'უნივერსიტეტებში ჩარიცხვა',
      detail: '100% სახელმწიფო & საერთაშორისო გრანტი',
      badge: 'უმაღლესი შედეგი',
      icon: Award,
      iconBg: 'rgba(59, 130, 246, 0.15)',
      iconColor: '#93c5fd'
    }
  ];

  return (
    <section className="stats-bar" style={{
      padding: '40px 0',
      background: 'rgba(16, 5, 7, 0.85)',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(20px)'
    }}>
      <div style={{ width: '92%', maxWidth: '1360px', margin: '0 auto' }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '18px',
                  padding: '24px',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(196, 30, 58, 0.4)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(139, 0, 0, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: stat.iconBg,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stat.iconColor
                  }}>
                    <Icon size={22} />
                  </div>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--accent-secondary, #d4af37)'
                  }}>
                    {stat.badge}
                  </span>
                </div>

                <div>
                  <div style={{
                    fontSize: '2.4rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    fontFamily: 'var(--font-serif, Georgia, serif)',
                    lineHeight: 1.1,
                    marginBottom: '4px'
                  }}>
                    {stat.number}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)' }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '4px' }}>
                    {stat.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
