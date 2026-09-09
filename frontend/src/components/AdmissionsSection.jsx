import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, X, Check, Utensils, Shield, Bus } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function AdmissionsSection() {
  const { navigate } = useAuth();
  const [selectedTier, setSelectedTier] = useState(1);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [applicantForm, setApplicantForm] = useState({
    parentName: '',
    phone: '',
    email: '',
    studentName: '',
    grade: 'I-VI',
    package: 'დაწყებითი საფეხური'
  });
  const [submitted, setSubmitted] = useState(false);

  const tiers = [
    {
      id: 1,
      number: '01',
      name: 'დაწყებითი საფეხური',
      grades: 'I–VI კლასები',
      annualPrice: '8 200 ₾',
      monthlyPrice: '820 ₾ × 10',
      features: ['ინგლისური და STEM ინტენსივი', 'ინდივიდუალური მენტორობა', 'გახანგრძლივებული დღე']
    },
    {
      id: 2,
      number: '02',
      name: 'საბაზო საფეხური',
      grades: 'VII–IX კლასები',
      annualPrice: '9 500 ₾',
      monthlyPrice: '950 ₾ × 10',
      features: ['საბუნებისმეტყველო ლაბორატორიები', 'დებატები და კრიტიკული აზროვნება', 'მეორე უცხო ენა']
    },
    {
      id: 3,
      number: '03',
      name: 'საშუალო საფეხური',
      grades: 'X–XII კლასები',
      annualPrice: '11 000 ₾',
      monthlyPrice: '1 100 ₾ × 10',
      features: ['საერთაშორისო საუნივერსიტეტო მომზადება', 'AI და სამეცნიერო პროექტები', 'SAT / IELTS მზადება']
    }
  ];

  const activeTierObj = tiers.find((t) => t.id === selectedTier) || tiers[0];

  const handleApplyClick = (tierName) => {
    setApplicantForm((prev) => ({ ...prev, package: tierName || activeTierObj.name }));
    setIsApplicationOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const newApp = {
        id: Date.now(),
        parentName: applicantForm.parentName,
        phone: applicantForm.phone,
        studentName: applicantForm.studentName,
        package: applicantForm.package || activeTierObj.name,
        date: new Date().toISOString().split('T')[0],
        status: 'განხილვაში'
      };
      const existing = JSON.parse(localStorage.getItem('academy_applications') || '[]');
      localStorage.setItem('academy_applications', JSON.stringify([newApp, ...existing]));
      window.dispatchEvent(new CustomEvent('new-application-submitted', { detail: newApp }));
    } catch (err) {
      console.error(err);
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsApplicationOpen(false);
      setApplicantForm({ parentName: '', phone: '', studentName: '', package: activeTierObj.name });
    }, 2000);
  };

  const scrollToSpaces = () => {
    const el = document.getElementById('spaces-hub');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="admissions"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '110px 40px 30px',
        color: '#ffffff',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1240px',
          width: '100%',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '36px',
          alignItems: 'center'
        }}
      >
        {/* Left / Center Main View (Photo 3) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {/* Main Tier Highlight Card */}
          <div
            style={{
              background: 'rgba(30, 20, 24, 0.65)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '20px',
              padding: '36px 48px',
              width: '100%',
              maxWidth: '560px',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
              marginBottom: '28px'
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#d4af37',
                marginBottom: '6px'
              }}
            >
              {activeTierObj.number}
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                fontSize: '1.6rem',
                fontWeight: 600,
                color: '#ffffff',
                marginBottom: '4px'
              }}
            >
              {activeTierObj.name}
            </h3>

            <div style={{ fontSize: '0.92rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '16px' }}>
              {activeTierObj.grades}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginRight: '12px'
                }}
              >
                {activeTierObj.annualPrice}
              </span>
              <span style={{ fontSize: '0.95rem', color: '#d4af37' }}>{activeTierObj.monthlyPrice}</span>
            </div>

            <button
              onClick={() => handleApplyClick(activeTierObj.name)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                background: 'linear-gradient(180deg, #d4af37 0%, #b88628 100%)',
                color: '#1a1104',
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: '1rem',
                fontWeight: 700,
                border: '1px solid rgba(255, 230, 160, 0.6)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(212, 175, 55, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.5)';
              }}
            >
              ონლაინ განაცხადი
            </button>
          </div>

          {/* Additional Services Bar (Photo 3) */}
          <div
            style={{
              background: 'rgba(20, 12, 15, 0.65)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '16px',
              padding: '16px 28px',
              width: '100%',
              maxWidth: '560px'
            }}
          >
            <div
              style={{
                textAlign: 'center',
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.65)',
                marginBottom: '10px',
                fontWeight: 500
              }}
            >
              დამატებითი სერვისები
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>კვება</div>
                <div style={{ fontSize: '0.82rem', color: '#d4af37' }}>180 ₾ / თვე</div>
              </div>
              <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>დაზღვევა</div>
                <div style={{ fontSize: '0.82rem', color: '#d4af37' }}>150 ₾ / თვე</div>
              </div>
              <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>ტრანსპორტი</div>
                <div style={{ fontSize: '0.82rem', color: '#d4af37' }}>400 ₾ / წელი</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Drawer / Overview Panel (Photo 3 & Photo 4) */}
        <div
          style={{
            background: 'rgba(235, 230, 225, 0.88)',
            backdropFilter: 'blur(25px)',
            WebkitBackdropFilter: 'blur(25px)',
            borderRadius: '24px',
            padding: '28px',
            color: '#1a1215',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.65)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '480px'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: '#6b5c5e', fontWeight: 600 }}>მიღება</span>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                fontSize: '1.45rem',
                fontWeight: 700,
                color: '#1a1215',
                lineHeight: 1.25,
                marginBottom: '4px'
              }}
            >
              სასკოლო საფასური და პაკეტები
            </h3>

            <p style={{ fontSize: '0.86rem', color: '#554245', marginBottom: '20px' }}>
              10-თვიანი მოქნილი გადახდა
            </p>

            {/* 3 Tiers List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {tiers.map((t) => {
                const isActive = selectedTier === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTier(t.id)}
                    style={{
                      background: isActive ? 'rgba(212, 175, 55, 0.25)' : '#ede7e1',
                      border: `1px solid ${isActive ? '#b88628' : '#e0d6cd'}`,
                      borderRadius: '12px',
                      padding: '12px 16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-serif, Georgia, serif)',
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          color: isActive ? '#8b6914' : '#6b5c5e'
                        }}
                      >
                        {t.number}
                      </span>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a1215' }}>{t.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b5c5e' }}>{t.grades}</div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1a1215' }}>{t.annualPrice}</div>
                      <div style={{ fontSize: '0.72rem', color: '#8b6914' }}>{t.monthlyPrice}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#6b5c5e', marginBottom: '8px' }}>
              დამატებითი სერვისები
            </div>

            <button
              onClick={() => handleApplyClick(activeTierObj.name)}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '10px',
                background: 'linear-gradient(180deg, #d4af37 0%, #b88628 100%)',
                color: '#1a1104',
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: '0.95rem',
                fontWeight: 700,
                border: 'none',
                boxShadow: '0 6px 20px rgba(184, 134, 40, 0.35)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>ონლაინ განაცხადი</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>


      {/* Online Application Modal Form */}
      {isApplicationOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsApplicationOpen(false)}
        >
          <div
            style={{
              background: '#1a1014',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '20px',
              padding: '36px',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsApplicationOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.6)',
                cursor: 'pointer'
              }}
            >
              <X size={22} />
            </button>

            <h3
              style={{
                fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                fontSize: '1.5rem',
                color: '#ffffff',
                marginBottom: '6px'
              }}
            >
              ონლაინ რეგისტრაცია
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#d4af37', marginBottom: '24px' }}>
              არჩეული პაკეტი: {applicantForm.package}
            </p>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'rgba(34, 197, 94, 0.2)',
                    color: '#4ade80',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}
                >
                  <Check size={28} />
                </div>
                <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '6px' }}>
                  განაცხადი მიღებულია!
                </h4>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                  აკადემიის მიმღები კომისია მალე დაგიკავშირდებათ.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '4px' }}>
                    მშობლის სახელი და გვარი
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="მაგ: დავით ბერიძე"
                    value={applicantForm.parentName}
                    onChange={(e) => setApplicantForm({ ...applicantForm, parentName: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '4px' }}>
                      ტელეფონი
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+995 5XX XX XX XX"
                      value={applicantForm.phone}
                      onChange={(e) => setApplicantForm({ ...applicantForm, phone: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid rgba(212, 175, 55, 0.25)',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '4px' }}>
                      მოსწავლის სახელი
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="მაგ: ნიკოლოზი"
                      value={applicantForm.studentName}
                      onChange={(e) => setApplicantForm({ ...applicantForm, studentName: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid rgba(212, 175, 55, 0.25)',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    marginTop: '10px',
                    padding: '14px',
                    borderRadius: '10px',
                    background: 'linear-gradient(180deg, #d4af37 0%, #b88628 100%)',
                    color: '#1a1104',
                    fontFamily: 'var(--font-sans, sans-serif)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  განაცხადის გაგზავნა
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
