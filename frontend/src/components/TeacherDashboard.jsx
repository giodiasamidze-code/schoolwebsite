import React, { useState } from 'react';
import {
  LayoutDashboard,
  User,
  Edit,
  Bell,
  Settings,
  ArrowLeft,
  Camera,
  LogOut,
  Check
} from 'lucide-react';
import { useAuth } from './AuthContext';

export default function TeacherDashboard() {
  const { navigate, logout } = useAuth();
  const [activeNav, setActiveNav] = useState('profile');
  const [savedAlert, setSavedAlert] = useState(false);

  const [profile, setProfile] = useState({
    name: 'გიორგი დავითაშვილი',
    subject: 'მათემატიკა & ალგორითმები',
    education: 'თბილისის სახელმწიფო უნივერსიტეტი (დოქტორანტურა), ოქსფორდის მიწვეული მკვლევარი',
    experience: '16 წლიანი პედაგოგიური და სამეცნიერო გამოცდილება წამყვან აკადემიურ დაწესებულებებში',
    approach: 'პრაქტიკულ ამოცანებზე დაფუძნებული სწავლება, ლოგიკური ანალიზი და ოლიმპიადებისთვის მომზადება'
  });

  const handleSave = () => {
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundImage: `linear-gradient(180deg, rgba(12, 6, 8, 0.45) 0%, rgba(12, 6, 8, 0.65) 100%), url(/assets/palace-interior.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '0 0 20px 0'
      }}
    >
      {/* Top Header (Photo 1) */}
      <header
        style={{
          height: '70px',
          background: 'rgba(20, 12, 15, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 36px',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                fontSize: '1rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#d4af37'
              }}
            >
              SOLOMON ACADEMY
            </span>
          </div>
          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.15)' }} />
          <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff' }}>
            პედაგოგის პორტალი
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            საიტზე დაბრუნება
          </button>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#d4af37'
            }}
          >
            <User size={18} />
          </div>
          <button
            onClick={logout}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            გასვლა
          </button>
        </div>
      </header>

      {/* Main 3-Column Layout (Photo 1) */}
      <div
        style={{
          maxWidth: '1360px',
          width: '100%',
          margin: '24px auto 0',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: '240px 1fr 280px',
          gap: '24px',
          alignItems: 'start'
        }}
      >
        {/* Left Sidebar Menu */}
        <div
          style={{
            background: 'rgba(25, 16, 20, 0.65)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: '16px',
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '440px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { id: 'overview', label: 'მიმოხილვა', icon: LayoutDashboard },
              { id: 'profile', label: 'ჩემი პროფილი', icon: User },
              { id: 'edit', label: 'რედაქტირება', icon: Edit },
              { id: 'messages', label: 'შეტყობინებები', icon: Bell },
              { id: 'settings', label: 'პარამეტრები', icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: isActive ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(212, 175, 55, 0.4)' : 'transparent'}`,
                    color: isActive ? '#d4af37' : 'rgba(255, 255, 255, 0.75)',
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.4)', textAlign: 'center', marginBottom: '10px' }}>
              პედაგოგის პორტალი · ადმინისტრაცია
            </div>
            <button
              onClick={() => navigate('/')}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: '8px',
                padding: '8px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={14} />
              <span>ეზოში დაბრუნება</span>
            </button>
          </div>
        </div>

        {/* Center Card: Profile Form */}
        <div
          style={{
            background: 'rgba(25, 16, 20, 0.65)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: '20px',
            padding: '28px 32px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                fontSize: '1.6rem',
                fontWeight: 700,
                color: '#ffffff'
              }}
            >
              ჩემი პროფილი
            </h2>
            <span
              style={{
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                color: '#d4af37',
                fontSize: '0.78rem',
                fontWeight: 600,
                padding: '4px 12px',
                borderRadius: '6px'
              }}
            >
              სადემონსტრაციო პორტალი
            </span>
          </div>

          {/* Avatar Upload Preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255, 255, 255, 0.8)'
              }}
            >
              <User size={32} />
            </div>
            <button
              onClick={() => alert('ფოტოს ატვირთვის ფუნქცია აქტიურია')}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.75)',
                fontSize: '0.88rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              ფოტოს შეცვლა
            </button>
          </div>

          {/* Inputs matching Photo 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)', marginBottom: '4px' }}>
                სახელი და გვარი
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)', marginBottom: '4px' }}>
                საგანი
              </label>
              <input
                type="text"
                value={profile.subject}
                onChange={(e) => setProfile({ ...profile, subject: e.target.value })}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)', marginBottom: '4px' }}>
                განათლება
              </label>
              <input
                type="text"
                value={profile.education}
                onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)', marginBottom: '4px' }}>
                გამოცდილება
              </label>
              <input
                type="text"
                value={profile.experience}
                onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)', marginBottom: '4px' }}>
                სწავლების მიდგომა
              </label>
              <input
                type="text"
                value={profile.approach}
                onChange={(e) => setProfile({ ...profile, approach: e.target.value })}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Public Profile Preview */}
        <div
          style={{
            background: 'rgba(25, 16, 20, 0.65)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: '20px',
            padding: '24px',
            textAlign: 'center'
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
              fontSize: '1.05rem',
              color: '#ffffff',
              marginBottom: '24px'
            }}
          >
            საჯარო პროფილის<br />გადახედვა
          </h3>

          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.15)',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255, 255, 255, 0.8)'
            }}
          >
            <User size={44} />
          </div>

          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff', marginBottom: '18px' }}>
            {profile.name || 'პედაგოგის სახელი'}
          </div>

          <button
            onClick={() => alert(`პროფილი: ${profile.name}\nსაგანი: ${profile.subject}`)}
            style={{
              width: '100%',
              padding: '10px',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '10px',
              color: '#d4af37',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            პროფილის ნახვა
          </button>
        </div>
      </div>

      {/* Bottom Actions Bar (Photo 1) */}
      <div
        style={{
          maxWidth: '1360px',
          width: '100%',
          margin: '20px auto 0',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => alert('მონახაზი შენახულია')}
            style={{
              background: 'rgba(30, 20, 24, 0.7)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '10px',
              padding: '10px 20px',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            მონახაზი
          </button>
          <button
            onClick={() => alert('გადახედვა აქტიურია')}
            style={{
              background: 'rgba(30, 20, 24, 0.7)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '10px',
              padding: '10px 20px',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            გადახედვა
          </button>
          <button
            onClick={handleSave}
            style={{
              background: 'linear-gradient(180deg, #d4af37 0%, #b88628 100%)',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 24px',
              color: '#1a1104',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {savedAlert ? <Check size={16} /> : null}
            <span>{savedAlert ? 'შენახულია!' : 'ცვლილებების შენახვა'}</span>
          </button>
        </div>

        {/* Counter 17 / 18 */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.55)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '20px',
            padding: '5px 16px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#d4af37',
            letterSpacing: '0.08em'
          }}
        >
          17 / 18
        </div>
      </div>
    </div>
  );
}
