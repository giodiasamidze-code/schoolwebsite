import React, { useState } from 'react';
import {
  LayoutDashboard,
  DollarSign,
  Layers,
  GitPullRequest,
  Database,
  Settings,
  Bell,
  User,
  ArrowRight,
  ChevronDown,
  RotateCcw,
  Send,
  Sliders,
  CheckCircle2,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useAuth } from './AuthContext';

export default function AdminDashboard() {
  const { navigate, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('decisions'); // 'decisions' (Photo 10) | 'scenarios' (Photo 12) | 'overview'

  // Scenario Simulator State (Photo 12)
  const [studentsGrowth, setStudentsGrowth] = useState(5);
  const [feeChange, setFeeChange] = useState(2);
  const [expenseChange, setExpenseChange] = useState(10);
  const [paymentDelay, setPaymentDelay] = useState(15);
  const [useLoan, setUseLoan] = useState(false);

  // Decision Tree active branch state (Photo 10)
  const [selectedBranch, setSelectedBranch] = useState('immediate'); // 'immediate' | 'phased' | 'delay'
  const [ownerName, setOwnerName] = useState('აკადემიის საბჭო');
  const [submittedMessage, setSubmittedMessage] = useState('');

  const handleSendToReview = () => {
    setSubmittedMessage('გაგზავნილია განხილვაზე!');
    setTimeout(() => setSubmittedMessage(''), 3000);
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundImage: `linear-gradient(180deg, rgba(12, 6, 8, 0.5) 0%, rgba(12, 6, 8, 0.7) 100%), url(/assets/palace-interior.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '0 0 20px 0'
      }}
    >
      {/* Top Bar matching Photo 10 & Photo 12 */}
      <header
        style={{
          height: '70px',
          background: 'rgba(20, 12, 15, 0.88)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 36px',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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
          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.15)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff' }}>
              {activeTab === 'scenarios' ? 'სცენარების ლაბორატორია' : 'გადაწყვეტილების სივრცე'}
            </span>
            <span
              style={{
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                color: '#d4af37',
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: '6px'
              }}
            >
              {activeTab === 'scenarios' ? 'მხოლოდ სიმულაცია · Actual უცვლელია' : 'სადემონსტრაციო სამუშაო გარემო'}
            </span>
          </div>
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
            საიტის ნახვა
          </button>
          <Bell size={18} color="rgba(255,255,255,0.8)" style={{ cursor: 'pointer' }} />
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

      {/* Main Workspace Layout */}
      <div
        style={{
          maxWidth: '1440px',
          width: '100%',
          margin: '20px auto 0',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: '220px 1fr',
          gap: '24px',
          alignItems: 'start'
        }}
      >
        {/* Left Navigation Menu */}
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
            minHeight: '480px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { id: 'overview', label: 'მიმოხილვა', icon: LayoutDashboard },
              { id: 'finance', label: 'ფინანსები', icon: DollarSign },
              { id: 'scenarios', label: 'სცენარები', icon: Layers },
              { id: 'decisions', label: 'გადაწყვეტილებები', icon: GitPullRequest },
              { id: 'sources', label: 'წყაროები', icon: Database }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '11px 14px',
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

          <button
            onClick={() => setActiveTab('settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.65)',
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            <Settings size={18} />
            <span>პარამეტრები</span>
          </button>
        </div>

        {/* Content Area: Photo 10 (Decision Space) or Photo 12 (Scenario Lab) */}
        {activeTab === 'scenarios' ? (
          /* ======================================================= */
          /* Scenario Simulator (Photo 12)                           */
          /* ======================================================= */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Filter Badges Top Bar */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {['აკადემია', '2026–2027', 'GEL', 'Model v1'].map((badge, idx) => (
                <span
                  key={idx}
                  style={{
                    background: 'rgba(30, 20, 24, 0.7)',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    borderRadius: '8px',
                    padding: '5px 14px',
                    fontSize: '0.82rem',
                    color: '#ffffff'
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* 3-Column Simulator Grid (Photo 12) */}
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 260px', gap: '20px' }}>
              {/* Column 1: დაშვებები */}
              <div
                style={{
                  background: 'rgba(25, 16, 20, 0.65)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  borderRadius: '16px',
                  padding: '20px'
                }}
              >
                <h3 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.15rem', color: '#fff', marginBottom: '18px' }}>
                  დაშვებები
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>
                      <span>მოსწავლეთა რაოდენობა</span>
                      <span style={{ color: '#d4af37', fontWeight: 600 }}>+{studentsGrowth}%</span>
                    </div>
                    <input
                      type="range"
                      min="-10"
                      max="25"
                      value={studentsGrowth}
                      onChange={(e) => setStudentsGrowth(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#d4af37' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>
                      <span>საშუალო საფასური</span>
                      <span style={{ color: '#d4af37', fontWeight: 600 }}>+{feeChange}%</span>
                    </div>
                    <input
                      type="range"
                      min="-5"
                      max="20"
                      value={feeChange}
                      onChange={(e) => setFeeChange(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#d4af37' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>
                      <span>ხარჯის ცვლილება</span>
                      <span style={{ color: '#d4af37', fontWeight: 600 }}>+{expenseChange}%</span>
                    </div>
                    <input
                      type="range"
                      min="-5"
                      max="30"
                      value={expenseChange}
                      onChange={(e) => setExpenseChange(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#d4af37' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>
                      <span>გადახდის დაყოვნება</span>
                      <span style={{ color: '#d4af37', fontWeight: 600 }}>{paymentDelay} დღე</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="45"
                      value={paymentDelay}
                      onChange={(e) => setPaymentDelay(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#d4af37' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>სესხის გარეშე / სესხით</span>
                    <button
                      type="button"
                      onClick={() => setUseLoan(!useLoan)}
                      style={{
                        width: '42px',
                        height: '22px',
                        borderRadius: '20px',
                        background: useLoan ? '#d4af37' : 'rgba(255,255,255,0.2)',
                        border: 'none',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                    >
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          background: '#fff',
                          position: 'absolute',
                          top: '3px',
                          left: useLoan ? '23px' : '3px',
                          transition: 'left 0.2s'
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Column 2: სამი შესაძლო გზა (Chart + Badges) */}
              <div
                style={{
                  background: 'rgba(25, 16, 20, 0.65)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.15rem', color: '#fff', marginBottom: '2px' }}>
                    სამი შესაძლო გზა
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', marginBottom: '16px' }}>
                    ფულადი ნაშთის პროგნოზი
                  </p>

                  {/* Multi-line Forecast SVG Chart (Upside, Base, Baseline, Downside) */}
                  <div style={{ position: 'relative', width: '100%', height: '200px', marginBottom: '16px' }}>
                    <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none">
                      {/* Baseline */}
                      <line x1="20" y1="120" x2="480" y2="120" stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" strokeWidth="1.5" />
                      <text x="410" y="115" fill="rgba(255,255,255,0.5)" fontSize="11">baseline</text>

                      {/* Upside Green */}
                      <path d="M 20 130 Q 180 110 320 60 T 480 30" fill="none" stroke="#22c55e" strokeWidth="2.5" />
                      <text x="410" y="35" fill="#22c55e" fontSize="11" fontWeight="600">Upside</text>

                      {/* Base Gold */}
                      <path d="M 20 130 Q 180 120 320 95 T 480 85" fill="none" stroke="#d4af37" strokeWidth="2" />
                      <text x="410" y="80" fill="#d4af37" fontSize="11" fontWeight="600">Base</text>

                      {/* Downside Red */}
                      <path d="M 20 130 Q 180 140 320 160 T 480 180" fill="none" stroke="#ef4444" strokeWidth="2" />
                      <text x="410" y="175" fill="#ef4444" fontSize="11" fontWeight="600">Downside</text>
                    </svg>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', padding: '0 10px' }}>
                      <span>Jan.</span>
                      <span>Feb.</span>
                      <span>Mar.</span>
                      <span>Apr.</span>
                      <span>May</span>
                      <span>June</span>
                      <span>July</span>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '14px' }}>
                    ⓘ შედეგი დამოკიდებულია დაშვებებზე
                  </div>
                </div>

                {/* 3 Metric Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>საბაზო</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#d4af37' }}>+DEMO 150K GEL</div>
                  </div>
                  <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: '#4ade80' }}>ზრდა</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#22c55e' }}>+DEMO 320K GEL</div>
                  </div>
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: '#f87171' }}>სტრესი</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ef4444' }}>-DEMO 180K GEL</div>
                  </div>
                </div>
              </div>

              {/* Column 3: გადაწყვეტილების საზღვრები */}
              <div
                style={{
                  background: 'rgba(25, 16, 20, 0.65)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <h3 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.15rem', color: '#fff', marginBottom: '6px' }}>
                  გადაწყვეტილების საზღვრები
                </h3>

                {[
                  { title: 'Break-even', desc: 'გადაწყვეტილების საზღვარი - ფულადი ნაკადების საზღვრები' },
                  { title: 'მიზნობრივი შედეგი', desc: 'მიზნობრივი შედეგი - გადაწყვეტილების მიზნობრივი ეფექტი' },
                  { title: 'კაპიტალის ალტერნატივა', desc: 'კაპიტალის ალტერნატივა - საინვესტიციო საზღვრები' }
                ].map((box, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      borderRadius: '10px',
                      padding: '12px'
                    }}
                  >
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>
                      {box.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.4 }}>
                      {box.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions Bar (Photo 12) */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-start' }}>
              <button
                onClick={() => alert('სცენარის განშტოება შექმნილია')}
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
                სცენარის განშტოება
              </button>
              <button
                onClick={() => alert('შედარების რეჟიმი აქტიურია')}
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
                შედარება
              </button>
              <button
                onClick={handleSendToReview}
                style={{
                  background: 'linear-gradient(180deg, #d4af37 0%, #b88628 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 24px',
                  color: '#1a1104',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {submittedMessage || 'განხილვაზე გაგზავნა'}
              </button>
            </div>
          </div>
        ) : (
          /* ======================================================= */
          /* Decision Space (Photo 10)                               */
          /* ======================================================= */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
            {/* Center Canvas: Interactive Decision Tree Graph */}
            <div
              style={{
                background: 'rgba(25, 16, 20, 0.65)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                borderRadius: '20px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '520px'
              }}
            >
              {/* Decision Tree SVG / HTML Nodes Layout */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '360px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
                  {/* Root Node */}
                  <div
                    style={{
                      background: 'rgba(38, 24, 28, 0.85)',
                      border: '1px solid #d4af37',
                      borderRadius: '12px',
                      padding: '20px',
                      width: '180px',
                      textAlign: 'center',
                      boxShadow: '0 8px 25px rgba(212, 175, 55, 0.2)'
                    }}
                  >
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.3 }}>
                      STEM ლაბორატორიის განახლება
                    </div>
                  </div>

                  {/* Branches */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {[
                      { id: 'immediate', title: 'ახლავე დაფინანსება', criteria: ['კაპიტალი', 'ვადა', 'სასწავლო ეფექტი'] },
                      { id: 'phased', title: 'ეტაპობრივად შესყიდვა', criteria: ['კაპიტალი', 'ვადა', 'სასწავლო ეფექტი'] },
                      { id: 'delay', title: 'გადავადება მიღება', criteria: ['კაპიტალი', 'ვადა', 'სასწავლო ეფექტი'] }
                    ].map((branch) => {
                      const isSelected = selectedBranch === branch.id;
                      return (
                        <div key={branch.id} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                          <button
                            onClick={() => setSelectedBranch(branch.id)}
                            style={{
                              background: isSelected ? 'rgba(212, 175, 55, 0.25)' : 'rgba(30, 20, 24, 0.7)',
                              border: `1px solid ${isSelected ? '#d4af37' : 'rgba(212, 175, 55, 0.25)'}`,
                              borderRadius: '10px',
                              padding: '12px 18px',
                              color: isSelected ? '#d4af37' : '#ffffff',
                              fontSize: '0.88rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              width: '170px',
                              textAlign: 'center',
                              transition: 'all 0.2s'
                            }}
                          >
                            {branch.title}
                          </button>

                          {/* Sub criteria tags */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {branch.criteria.map((crit, idx) => (
                              <span
                                key={idx}
                                style={{
                                  background: 'rgba(0, 0, 0, 0.4)',
                                  border: '1px solid rgba(212, 175, 55, 0.2)',
                                  borderRadius: '6px',
                                  padding: '3px 10px',
                                  fontSize: '0.75rem',
                                  color: 'rgba(255, 255, 255, 0.8)'
                                }}
                              >
                                {crit}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Canvas Controls & Tracker (Photo 10) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['გრაფი', 'შეფასების მატრიცა', 'ისტორია'].map((tab, idx) => (
                    <button
                      key={idx}
                      style={{
                        background: idx === 0 ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                        border: 'none',
                        color: idx === 0 ? '#d4af37' : 'rgba(255,255,255,0.6)',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>
                  <span>მონახაზი</span>
                  <span>→</span>
                  <span>შედარება</span>
                  <span>→</span>
                  <span>განხილვა</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
                  <button style={{ background: 'none', border: 'none', color: '#d4af37', fontSize: '0.82rem', cursor: 'pointer' }}>
                    ისტორიის ნახვა
                  </button>
                </div>
              </div>
            </div>

            {/* Right Panel: 28% [მონახაზი] დასაბუთება და კონტროლი (Photo 10) */}
            <div
              style={{
                background: 'rgba(25, 16, 20, 0.65)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                borderRadius: '20px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '520px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#d4af37' }}>28%</span>
                  <span
                    style={{
                      background: 'rgba(212, 175, 55, 0.15)',
                      color: '#d4af37',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: '4px'
                    }}
                  >
                    მონახაზი
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                    fontSize: '1.15rem',
                    color: '#ffffff',
                    marginBottom: '18px'
                  }}
                >
                  დასაბუთება და კონტროლი
                </h3>

                {/* Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', marginBottom: '4px' }}>
                      მფლობელი
                    </label>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.35)',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: '#fff',
                        fontSize: '0.85rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {['დაშვებები', 'წყაროები', 'დამოკიდებულებები'].map((item, idx) => (
                    <button
                      key={idx}
                      style={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.35)',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        color: 'rgba(255,255,255,0.85)',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <span>{item}</span>
                      <ChevronDown size={14} color="rgba(255,255,255,0.5)" />
                    </button>
                  ))}
                </div>

                {/* Progress bar */}
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>
                    მონაცემების სისრულე
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden', marginBottom: '6px' }}>
                    <div style={{ width: '28%', height: '100%', background: '#d4af37' }} />
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>
                    არ არის წარმატების ალბათობა
                  </div>
                </div>
              </div>

              <button
                onClick={handleSendToReview}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'rgba(45, 30, 35, 0.85)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  color: '#d4af37',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: '20px'
                }}
              >
                {submittedMessage || 'განხილვაზე გაგზავნა'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
