import React, { useState } from 'react';
import { Search, ArrowLeft, ArrowRight, BookOpen, Compass, Award, Cpu, User, UserCheck, X } from 'lucide-react';

export default function TeamSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ყველა');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = ['ყველა', 'STEM', 'ენები', 'ჰუმანიტარული'];

  const teachers = [
    {
      id: 1,
      subject: 'მათემატიკა',
      name: 'გიორგი დავითაშვილი',
      degree: 'მათემატიკის დოქტორი (PhD)',
      category: 'STEM',
      icon: BookOpen,
      experience: '16 წელი',
      education: 'თბილისის სახელმწიფო უნივერსიტეტი, ოქსფორდის მიწვეული მკვლევარი',
      approach: 'ლოგიკური აზროვნებისა და ოლიმპიური ამოცანების ამოხსნის სიღრმისეული მეთოდოლოგია.',
      quote: 'მათემატიკა სამყაროს უნივერსალური ენაა.'
    },
    {
      id: 2,
      subject: 'ფიზიკა',
      name: 'ანა ბერიძე',
      degree: 'ფიზიკა-მათემატიკის მეცნიერებათა კანდიდატი',
      category: 'STEM',
      icon: Compass,
      experience: '14 წელი',
      education: 'მიუნხენის ტექნიკური უნივერსიტეტი (TUM)',
      approach: 'ექსპერიმენტული ლაბორატორიები, კოსმოლოგია და თანამედროვე ფიზიკის პრაქტიკა.',
      quote: 'ბუნების კანონების გაგება საუკეთესო თავგადასავალია.'
    },
    {
      id: 3,
      subject: 'ქიმია',
      name: 'დავით კაპანაძე',
      degree: 'ქიმიის დოქტორი',
      category: 'STEM',
      icon: Award,
      experience: '12 წელი',
      education: 'საქართველოს ტექნიკური უნივერსიტეტი, ჰაიდელბერგის უნივერსიტეტი',
      approach: 'ორგანული სინთეზი, მწვანე ქიმია და ლაბორატორიული კვლევები.',
      quote: 'მეცნიერება იწყება ცნობისმოყვარეობით.'
    },
    {
      id: 4,
      subject: 'IT & AI',
      name: 'ნიკოლოზ ლომიძე',
      degree: 'კომპიუტერული მეცნიერებების მაგისტრი',
      category: 'STEM',
      icon: Cpu,
      experience: '10 წელი',
      education: 'ETH Zurich, MIT Professional Certificate',
      approach: 'ალგორითმები, მანქანური სწავლება, ხელოვნური ინტელექტი და Full-stack ინჟინერია.',
      quote: 'ტექნოლოგიები მომავლის შექმნის ინსტრუმენტია.'
    },
    {
      id: 5,
      subject: 'ქართული',
      name: 'ელენე ჯაფარიძე',
      degree: 'ფილოლოგიის დოქტორი',
      category: 'ჰუმანიტარული',
      icon: User,
      experience: '18 წელი',
      education: 'თბილისის სახელმწიფო უნივერსიტეტი',
      approach: 'კლასიკური ლიტერატურის ანალიზი, რიტორიკა და კრიტიკული წერის კულტურა.',
      quote: 'სიტყვა არის აზროვნების ყველაზე ძლიერი იარაღი.'
    },
    {
      id: 6,
      subject: 'ინგლისური',
      name: 'ალექსანდრე მდივანი',
      degree: 'CELTA & DELTA Certified',
      category: 'ენები',
      icon: UserCheck,
      experience: '15 წელი',
      education: 'კემბრიჯის უნივერსიტეტი (UK)',
      approach: 'აკადემიური ინგლისური, დებატები, საერთაშორისო გამოცდებისთვის მომზადება (IELTS/SAT).',
      quote: 'ენა ხსნის საზღვრებს და აერთიანებს იდეებს.'
    }
  ];

  const filteredTeachers = teachers.filter((t) => {
    const matchesCategory = activeCategory === 'ყველა' || t.category === activeCategory;
    const matchesSearch =
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const scrollToSpaces = () => {
    const el = document.getElementById('spaces-hub');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="teachers"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '110px 40px 40px',
        color: '#ffffff',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1100px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '36px'
        }}
      >
        {/* Top Header Block - Centered */}
        <div style={{ textAlign: 'center', maxWidth: '640px' }}>
          <div
            style={{
              fontSize: '0.95rem',
              color: 'rgba(255, 255, 255, 0.65)',
              marginBottom: '8px',
              fontWeight: 500,
              letterSpacing: '0.04em'
            }}
          >
            ჩვენი გუნდი
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
              fontSize: 'clamp(2.5rem, 4.5vw, 3.6rem)',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.15,
              marginBottom: '12px'
            }}
          >
            პედაგოგები
          </h2>
          <p
            style={{
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: 1.5,
              margin: 0
            }}
          >
            გაიცანით აკადემიის გუნდი
          </p>
        </div>

        {/* Centered Main Frosted Card */}
        <div
          style={{
            width: '100%',
            background: 'rgba(25, 16, 20, 0.6)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
          }}
        >
          {/* Top Search Bar */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              marginBottom: '18px'
            }}
          >
            <Search
              size={18}
              color="rgba(255, 255, 255, 0.5)"
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="მოძებნეთ პედაგოგი"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: '12px',
                padding: '12px 16px 12px 46px',
                color: '#ffffff',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(212, 175, 55, 0.6)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(212, 175, 55, 0.2)')}
            />
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '22px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: activeCategory === cat ? 'rgba(212, 175, 55, 0.25)' : 'rgba(0, 0, 0, 0.3)',
                  border: `1px solid ${activeCategory === cat ? '#d4af37' : 'rgba(255, 255, 255, 0.12)'}`,
                  color: activeCategory === cat ? '#d4af37' : 'rgba(255, 255, 255, 0.75)',
                  borderRadius: '20px',
                  padding: '6px 18px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 3x2 Grid of Teacher Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginBottom: '20px'
            }}
          >
            {filteredTeachers.map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTeacher(t)}
                  style={{
                    background: 'rgba(38, 26, 30, 0.55)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '14px',
                    padding: '18px 14px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(50, 32, 38, 0.75)';
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.6)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(38, 26, 30, 0.55)';
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Emblem Visual */}
                  <div
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '12px',
                      background: 'radial-gradient(circle, rgba(212, 175, 55, 0.18) 0%, rgba(20, 10, 14, 0.4) 100%)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#d4af37',
                      marginBottom: '10px'
                    }}
                  >
                    <Icon size={32} />
                  </div>

                  <span style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.45)', marginBottom: '4px' }}>
                    პროფილის ვიზუალური ნიმუშები
                  </span>

                  <h3
                    style={{
                      fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                      fontSize: '1.15rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      marginBottom: '10px'
                    }}
                  >
                    {t.subject}
                  </h3>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#d4af37',
                      fontSize: '0.82rem',
                      fontWeight: 500
                    }}
                  >
                    <span>პროფილის ნახვა</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Pagination matching Photo 9 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: currentPage === page ? '#d4af37' : 'rgba(255, 255, 255, 0.45)',
                    fontSize: '0.9rem',
                    fontWeight: currentPage === page ? 700 : 500,
                    borderBottom: currentPage === page ? '2px solid #d4af37' : 'none',
                    paddingBottom: '2px',
                    cursor: 'pointer'
                  }}
                >
                  {page < 10 ? `0${page}` : page}
                </button>
              ))}
            </div>

            <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)' }}>
              {filteredTeachers.length} / 16
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Profile Detail Modal */}
      {selectedTeacher && (
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
          onClick={() => setSelectedTeacher(null)}
        >
          <div
            style={{
              background: '#180e12',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '20px',
              padding: '36px',
              maxWidth: '560px',
              width: '100%',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedTeacher(null)}
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '24px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#d4af37'
                }}
              >
                {React.createElement(selectedTeacher.icon, { size: 30 })}
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                    fontSize: '1.4rem',
                    color: '#ffffff',
                    marginBottom: '4px'
                  }}
                >
                  {selectedTeacher.name}
                </h3>
                <p style={{ color: '#d4af37', fontSize: '0.9rem', fontWeight: 600 }}>
                  {selectedTeacher.subject} · {selectedTeacher.degree}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem', color: 'rgba(255, 255, 255, 0.85)' }}>
              <div>
                <span style={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '2px' }}>
                  გამოცდილება
                </span>
                <span>{selectedTeacher.experience}</span>
              </div>

              <div>
                <span style={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '2px' }}>
                  განათლება
                </span>
                <span>{selectedTeacher.education}</span>
              </div>

              <div>
                <span style={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '2px' }}>
                  სწავლების მიდგომა
                </span>
                <span>{selectedTeacher.approach}</span>
              </div>

              <div style={{ fontStyle: 'italic', color: '#d4af37', borderLeft: '2px solid #d4af37', paddingLeft: '12px', marginTop: '6px' }}>
                "{selectedTeacher.quote}"
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
