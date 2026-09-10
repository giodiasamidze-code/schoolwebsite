import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, X, Check, Utensils, Shield, Bus, User, Calendar, Phone, Mail, MapPin, GraduationCap, HeartPulse, Sparkles, BookOpen, Clock } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function AdmissionsSection() {
  const { navigate } = useAuth();
  const [selectedTier, setSelectedTier] = useState(1);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [applicantForm, setApplicantForm] = useState({
    // Student Info
    studentFullName: '',
    studentPin: '',
    studentDob: '',
    studentGender: 'ვაჟი',
    studentGrade: 'I კლასი',
    previousSchool: '',

    // Parent Info
    parentName: '',
    parentPin: '',
    phone: '',
    email: '',
    address: '',

    // Package & Services
    package: 'დაწყებითი საფეხური',
    serviceTransport: false,
    serviceMeals: true,
    serviceExtendedDay: false,
    serviceStem: false,

    // Medical & Special Notes
    medicalNotes: ''
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
    const pkg = tierName || activeTierObj.name;
    let defaultGrade = 'I კლასი';
    if (pkg.includes('საბაზო')) defaultGrade = 'VII კლასი';
    if (pkg.includes('საშუალო')) defaultGrade = 'X კლასი';

    setApplicantForm((prev) => ({
      ...prev,
      package: pkg,
      studentGrade: defaultGrade
    }));
    setIsApplicationOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const newApp = {
        id: Date.now(),
        // Student
        studentFullName: applicantForm.studentFullName,
        studentName: applicantForm.studentFullName, // compatibility
        studentPin: applicantForm.studentPin,
        studentDob: applicantForm.studentDob,
        studentGender: applicantForm.studentGender,
        studentGrade: applicantForm.studentGrade,
        previousSchool: applicantForm.previousSchool,

        // Parent
        parentName: applicantForm.parentName,
        parentPin: applicantForm.parentPin,
        phone: applicantForm.phone,
        email: applicantForm.email,
        address: applicantForm.address,

        // Package & Services
        package: applicantForm.package || activeTierObj.name,
        services: [
          applicantForm.serviceTransport && 'სასკოლო ტრანსპორტირება',
          applicantForm.serviceMeals && '3-ჯერადი ეკო-კვება',
          applicantForm.serviceExtendedDay && 'გახანგრძლივებული ჯგუფი',
          applicantForm.serviceStem && 'STEM & რობოტიკა'
        ].filter(Boolean),
        medicalNotes: applicantForm.medicalNotes,
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
      setApplicantForm({
        studentFullName: '',
        studentPin: '',
        studentDob: '',
        studentGender: 'ვაჟი',
        studentGrade: 'I კლასი',
        previousSchool: '',
        parentName: '',
        parentPin: '',
        phone: '',
        email: '',
        address: '',
        package: activeTierObj.name,
        serviceTransport: false,
        serviceMeals: true,
        serviceExtendedDay: false,
        serviceStem: false,
        medicalNotes: ''
      });
    }, 2800);
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
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(14px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsApplicationOpen(false)}
        >
          <div
            style={{
              background: 'rgba(22, 13, 17, 0.97)',
              border: '1.5px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '24px',
              padding: '36px 32px',
              maxWidth: '760px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.85)',
              position: 'relative',
              color: '#ffffff'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsApplicationOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.borderColor = '#d4af37'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; }}
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  padding: '5px 12px',
                  borderRadius: '16px',
                  color: '#d4af37',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  marginBottom: '10px'
                }}
              >
                <Sparkles size={13} />
                <span>სოლომონ აკადემია • მიმღები კომისია 2026–2027</span>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                  fontSize: '1.75rem',
                  color: '#ffffff',
                  margin: '0 0 6px 0',
                  fontWeight: 700
                }}
              >
                მოსწავლის ონლაინ რეგისტრაცია
              </h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.86rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  არჩეული აკადემიური საფეხური:
                </span>
                <span
                  style={{
                    background: 'rgba(212, 175, 55, 0.15)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    color: '#d4af37',
                    fontSize: '0.84rem',
                    fontWeight: 700
                  }}
                >
                  {applicantForm.package}
                </span>
              </div>
            </div>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    background: 'rgba(34, 197, 94, 0.18)',
                    border: '1.5px solid #22c55e',
                    color: '#4ade80',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}
                >
                  <Check size={34} />
                </div>
                <h4
                  style={{
                    fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                    color: '#ffffff',
                    fontSize: '1.5rem',
                    marginBottom: '10px'
                  }}
                >
                  განაცხადი წარმატებით დარეგისტრირდა!
                </h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.95rem', maxWidth: '440px', margin: '0 auto 24px', lineHeight: 1.5 }}>
                  მადლობას გიხდით სოლომონ აკადემიით დაინტერესებისთვის. მიმღები კომისია 24 საათში დაგიკავშირდებათ გასაუბრების ეტაპისთვის.
                </p>

                {/* Summary Card */}
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    maxWidth: '420px',
                    margin: '0 auto',
                    textAlign: 'left',
                    fontSize: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>მოსწავლე:</span>
                    <strong style={{ color: '#fff' }}>{applicantForm.studentFullName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>კლასი:</span>
                    <strong style={{ color: '#d4af37' }}>{applicantForm.studentGrade}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>მშობელი:</span>
                    <strong style={{ color: '#fff' }}>{applicantForm.parentName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>ტელეფონი:</span>
                    <strong style={{ color: '#fff' }}>{applicantForm.phone}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                
                {/* SECTION 1: STUDENT INFORMATION */}
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px' }}>
                    <GraduationCap size={18} color="#d4af37" />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#d4af37' }}>
                      1. მოსწავლის პერსონალური მონაცემები
                    </span>
                  </div>

                  {/* Student Name & PIN */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: '5px' }}>
                        მოსწავლის სრული სახელი და გვარი *
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '10px', padding: '9px 12px', gap: '8px' }}>
                        <User size={15} color="#d4af37" />
                        <input
                          type="text"
                          required
                          placeholder="მაგ: ნიკოლოზ ბერიძე"
                          value={applicantForm.studentFullName}
                          onChange={(e) => setApplicantForm({ ...applicantForm, studentFullName: e.target.value })}
                          style={{
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            color: '#fff',
                            fontSize: '0.88rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: '5px' }}>
                        მოსწავლის პირადი ნომერი (11 ნიშნა) *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={11}
                        placeholder="010XXXXXXXX"
                        value={applicantForm.studentPin}
                        onChange={(e) => setApplicantForm({ ...applicantForm, studentPin: e.target.value.replace(/\D/g, '') })}
                        style={{
                          width: '100%',
                          background: 'rgba(0,0,0,0.5)',
                          border: '1px solid rgba(212, 175, 55, 0.25)',
                          borderRadius: '10px',
                          padding: '9px 12px',
                          color: '#fff',
                          fontSize: '0.88rem',
                          outline: 'none',
                          letterSpacing: '0.04em'
                        }}
                      />
                    </div>
                  </div>

                  {/* DOB, Gender & Grade */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.9fr 1.1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: '5px' }}>
                        დაბადების თარიღი *
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '10px', padding: '9px 12px', gap: '8px' }}>
                        <Calendar size={15} color="#d4af37" />
                        <input
                          type="date"
                          required
                          value={applicantForm.studentDob}
                          onChange={(e) => setApplicantForm({ ...applicantForm, studentDob: e.target.value })}
                          style={{
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            color: '#fff',
                            fontSize: '0.88rem',
                            outline: 'none',
                            colorScheme: 'dark'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: '5px' }}>
                        სქესი *
                      </label>
                      <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', borderRadius: '10px', border: '1px solid rgba(212, 175, 55, 0.25)', padding: '3px' }}>
                        {['ვაჟი', 'გოგონა'].map((gender) => (
                          <button
                            key={gender}
                            type="button"
                            onClick={() => setApplicantForm({ ...applicantForm, studentGender: gender })}
                            style={{
                              flex: 1,
                              background: applicantForm.studentGender === gender ? '#d4af37' : 'transparent',
                              color: applicantForm.studentGender === gender ? '#1a1104' : 'rgba(255,255,255,0.7)',
                              border: 'none',
                              borderRadius: '7px',
                              padding: '6px 0',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'all 0.15s'
                            }}
                          >
                            {gender}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: '5px' }}>
                        სასურველი კლასი *
                      </label>
                      <select
                        value={applicantForm.studentGrade}
                        onChange={(e) => setApplicantForm({ ...applicantForm, studentGrade: e.target.value })}
                        style={{
                          width: '100%',
                          background: 'rgba(0,0,0,0.5)',
                          border: '1px solid rgba(212, 175, 55, 0.25)',
                          borderRadius: '10px',
                          padding: '9px 12px',
                          color: '#fff',
                          fontSize: '0.88rem',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        {[
                          'I კლასი', 'II კლასი', 'III კლასი', 'IV კლასი', 'V კლასი', 'VI კლასი',
                          'VII კლასი', 'VIII კლასი', 'IX კლასი', 'X კლასი', 'XI კლასი', 'XII კლასი'
                        ].map((g) => (
                          <option key={g} value={g} style={{ background: '#1a1014', color: '#fff' }}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Previous School */}
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: '5px' }}>
                      წინა სკოლა ან საბავშვო ბაღი (თუ გადმოდის)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '10px', padding: '9px 12px', gap: '8px' }}>
                      <BookOpen size={15} color="#d4af37" />
                      <input
                        type="text"
                        placeholder="მაგ: №53 საჯარო სკოლა / კერძო ბაღი"
                        value={applicantForm.previousSchool}
                        onChange={(e) => setApplicantForm({ ...applicantForm, previousSchool: e.target.value })}
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: 'none',
                          color: '#fff',
                          fontSize: '0.88rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: PARENT INFORMATION */}
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px' }}>
                    <User size={18} color="#d4af37" />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#d4af37' }}>
                      2. მშობლის / კანონიერი წარმომადგენლის მონაცემები
                    </span>
                  </div>

                  {/* Parent Full Name & PIN */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: '5px' }}>
                        მშობლის სრული სახელი და გვარი *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="მაგ: დავით ბერიძე"
                        value={applicantForm.parentName}
                        onChange={(e) => setApplicantForm({ ...applicantForm, parentName: e.target.value })}
                        style={{
                          width: '100%',
                          background: 'rgba(0,0,0,0.5)',
                          border: '1px solid rgba(212, 175, 55, 0.25)',
                          borderRadius: '10px',
                          padding: '9px 12px',
                          color: '#fff',
                          fontSize: '0.88rem',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: '5px' }}>
                        მშობლის პირადი ნომერი (11 ნიშნა)
                      </label>
                      <input
                        type="text"
                        maxLength={11}
                        placeholder="010XXXXXXXX"
                        value={applicantForm.parentPin}
                        onChange={(e) => setApplicantForm({ ...applicantForm, parentPin: e.target.value.replace(/\D/g, '') })}
                        style={{
                          width: '100%',
                          background: 'rgba(0,0,0,0.5)',
                          border: '1px solid rgba(212, 175, 55, 0.25)',
                          borderRadius: '10px',
                          padding: '9px 12px',
                          color: '#fff',
                          fontSize: '0.88rem',
                          outline: 'none',
                          letterSpacing: '0.04em'
                        }}
                      />
                    </div>
                  </div>

                  {/* Phone & Email */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: '5px' }}>
                        ტელეფონის ნომერი *
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '10px', padding: '9px 12px', gap: '8px' }}>
                        <Phone size={15} color="#d4af37" />
                        <input
                          type="tel"
                          required
                          placeholder="+995 5XX XX XX XX"
                          value={applicantForm.phone}
                          onChange={(e) => setApplicantForm({ ...applicantForm, phone: e.target.value })}
                          style={{
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            color: '#fff',
                            fontSize: '0.88rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: '5px' }}>
                        ელ-ფოსტის მისამართი *
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '10px', padding: '9px 12px', gap: '8px' }}>
                        <Mail size={15} color="#d4af37" />
                        <input
                          type="email"
                          required
                          placeholder="parent@example.ge"
                          value={applicantForm.email}
                          onChange={(e) => setApplicantForm({ ...applicantForm, email: e.target.value })}
                          style={{
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            color: '#fff',
                            fontSize: '0.88rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: '5px' }}>
                      ფაქტობრივი საცხოვრებელი მისამართი
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '10px', padding: '9px 12px', gap: '8px' }}>
                      <MapPin size={15} color="#d4af37" />
                      <input
                        type="text"
                        placeholder="ქალაქი, ქუჩა, ბინა / სახლის ნომერი"
                        value={applicantForm.address}
                        onChange={(e) => setApplicantForm({ ...applicantForm, address: e.target.value })}
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: 'none',
                          color: '#fff',
                          fontSize: '0.88rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 3: SERVICES & SPECIAL NOTES */}
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px' }}>
                    <Sparkles size={18} color="#d4af37" />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#d4af37' }}>
                      3. დამატებითი სერვისები და სამედიცინო შენიშვნა
                    </span>
                  </div>

                  {/* Services Checkboxes */}
                  <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: '2px' }}>
                    სურვილისამებრ აირჩიეთ სასკოლო სერვისები:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: applicantForm.serviceTransport ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0,0,0,0.3)',
                        border: `1px solid ${applicantForm.serviceTransport ? '#d4af37' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: '10px',
                        padding: '10px 12px',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={applicantForm.serviceTransport}
                        onChange={(e) => setApplicantForm({ ...applicantForm, serviceTransport: e.target.checked })}
                        style={{ accentColor: '#d4af37' }}
                      />
                      <div style={{ fontSize: '0.84rem' }}>
                        <div style={{ fontWeight: 600, color: '#fff' }}>🚌 სასკოლო ტრანსპორტი</div>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}>კარდაკარ უსაფრთხო გადაყვანა</div>
                      </div>
                    </label>

                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: applicantForm.serviceMeals ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0,0,0,0.3)',
                        border: `1px solid ${applicantForm.serviceMeals ? '#d4af37' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: '10px',
                        padding: '10px 12px',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={applicantForm.serviceMeals}
                        onChange={(e) => setApplicantForm({ ...applicantForm, serviceMeals: e.target.checked })}
                        style={{ accentColor: '#d4af37' }}
                      />
                      <div style={{ fontSize: '0.84rem' }}>
                        <div style={{ fontWeight: 600, color: '#fff' }}>🍲 3-ჯერადი ეკო-კვება</div>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}>დაბალანსებული ჯანსაღი რაციონი</div>
                      </div>
                    </label>

                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: applicantForm.serviceExtendedDay ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0,0,0,0.3)',
                        border: `1px solid ${applicantForm.serviceExtendedDay ? '#d4af37' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: '10px',
                        padding: '10px 12px',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={applicantForm.serviceExtendedDay}
                        onChange={(e) => setApplicantForm({ ...applicantForm, serviceExtendedDay: e.target.checked })}
                        style={{ accentColor: '#d4af37' }}
                      />
                      <div style={{ fontSize: '0.84rem' }}>
                        <div style={{ fontWeight: 600, color: '#fff' }}>📚 გახანგრძლივებული დღე</div>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}>დავალებების მომზადება და წრეები</div>
                      </div>
                    </label>

                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: applicantForm.serviceStem ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0,0,0,0.3)',
                        border: `1px solid ${applicantForm.serviceStem ? '#d4af37' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: '10px',
                        padding: '10px 12px',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={applicantForm.serviceStem}
                        onChange={(e) => setApplicantForm({ ...applicantForm, serviceStem: e.target.checked })}
                        style={{ accentColor: '#d4af37' }}
                      />
                      <div style={{ fontSize: '0.84rem' }}>
                        <div style={{ fontWeight: 600, color: '#fff' }}>🤖 STEM & რობოტიკა</div>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}>AI და სამეცნიერო ლაბორატორიები</div>
                      </div>
                    </label>
                  </div>

                  {/* Medical & Dietary Notes */}
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                      <HeartPulse size={14} color="#f87171" />
                      <span>სამედიცინო შენიშვნა / განსაკუთრებული საჭიროებები (არასავალდებულო)</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="ალერგიები, დიეტური თავისებურებები ან ნებისმიერი სხვა ინფორმაცია, რაც პედაგოგებმა უნდა იცოდნენ..."
                      value={applicantForm.medicalNotes}
                      onChange={(e) => setApplicantForm({ ...applicantForm, medicalNotes: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(212, 175, 55, 0.25)',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        color: '#fff',
                        fontSize: '0.86rem',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div>
                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      background: 'linear-gradient(180deg, #d4af37 0%, #b88628 100%)',
                      color: '#1a1104',
                      fontFamily: 'var(--font-sans, sans-serif)',
                      fontSize: '1rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4)',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>განაცხადის გაგზავნა მიმღებ კომისიაში</span>
                    <ArrowRight size={18} />
                  </button>

                  <div style={{ textAlign: 'center', fontSize: '0.74rem', color: 'rgba(255,255,255,0.55)', marginTop: '8px', lineHeight: 1.4 }}>
                    🔒 თქვენი პერსონალური მონაცემები დაცულია. განაცხადის მიღების შემდეგ აკადემიის ადმინისტრაცია 24 საათში დაგიკავშირდებათ.
                  </div>
                </div>

              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
