import React, { useState, useEffect, useRef } from 'react';
import { X, Award, GraduationCap, Briefcase, Calendar, Info, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function TeamSection() {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [activeTeacherIndex, setActiveTeacherIndex] = useState(0);
  const [dynamicTeachers, setDynamicTeachers] = useState([]);
  const carouselRef = useRef(null);

  const defaultTeachers = [
    {
      id: 1,
      name: 'დავით გიორგაძე',
      latinName: 'David Giorgadze',
      role: 'ისტორიის პედაგოგი',
      subject: 'მსოფლიო ისტორია და დიპლომატია',
      badge: 'Kasha',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'თბილისის სახელმწიფო უნივერსიტეტი (ისტორიის დოქტორი), CEU მაგისტრი.',
      experience: '14 წელი საზოგადოებრივი მეცნიერებების სწავლებაში.',
      certifications: 'IB Global Politics & History Certified Examiner.',
      yearsAtSchool: '5 წელი (Solomon Institutions)'
    },
    {
      id: 2,
      name: 'ლუკა გიორგაძე',
      latinName: 'Luka Giorgadze',
      role: 'კომპიუტერული მეცნიერებები',
      subject: 'ინფორმატიკა, რობოტოტექნიკა და AI',
      badge: 'Istaka',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'მიუნხენის ტექნიკური უნივერსიტეტი (MSc Computer Science).',
      experience: '9 წელი კოდირებისა და ალგორითმების პრაქტიკაში.',
      certifications: 'Google Certified Educator Level 2, Cambridge ICT Trainer.',
      yearsAtSchool: '4 წელი (Solomon Institutions)'
    },
    {
      id: 3,
      name: 'მარიამ კალანდაძე',
      latinName: 'Mariam Kalandadze',
      role: 'ინგლისური ენის პედაგოგი',
      subject: 'ინგლისური ენა და ლიტერატურა',
      badge: 'Uzerziana',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'ლონდონის საუნივერსიტეტო კოლეჯი (UCL, MA Applied Linguistics).',
      experience: '11 წელი საერთაშორისო პროგრამებში სწავლება.',
      certifications: 'CELTA, DELTA Module 1, Cambridge IGCSE Examiner.',
      yearsAtSchool: '6 წელი (Solomon Institutions)'
    },
    {
      id: 4,
      name: 'დავით ცეცხლაძე',
      latinName: 'David Tsetskhladze',
      role: 'ფიზიკის პედაგოგი',
      subject: 'თეორიული და ექსპერიმენტული ფიზიკა',
      badge: 'Fiziky',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'თსu ზუსტ და საბუნებისმეტყველო მეცნიერებათა ფაკულტეტი (PhD).',
      experience: '12 წელი STEM და ოლიმპიადების მომზადებაში.',
      certifications: 'AP Physics Certified Master Teacher.',
      yearsAtSchool: '5 წელი (Solomon Institutions)'
    },
    {
      id: 5,
      name: 'ელენე ბერიძე',
      latinName: 'Elene Beridze',
      role: 'მათემატიკის პედაგოგი',
      subject: 'მათემატიკა, უმაღლესი ალგებრა და ანალიზი',
      badge: 'stoira',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'მათემატიკის დოქტორი (თსუ), ოქსფორდის უნივერსიტეტის პოსტდოქტორი.',
      experience: '15 წელი მათემატიკური დისციპლინების სწავლებაში.',
      certifications: 'Cambridge International Diploma, IB HL Mathematics Trainer.',
      yearsAtSchool: '7 წელი (Solomon Institutions)'
    },
    {
      id: 6,
      name: 'დავით ცეცხლაძე',
      latinName: 'David Tsetskhladze',
      role: 'ქიმიის პედაგოგი',
      subject: 'ზოგადი და ორგანული ქიმია',
      badge: 'Fizika',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'თბილისის სახელმწიფო სამედიცინო უნივერსიტეტი (MSc).',
      experience: '8 წელი ქიმიისა და ლაბორატორიული კვლევების ხელმძღვანელობაში.',
      certifications: 'Cambridge IGCSE Chemistry Certified Educator.',
      yearsAtSchool: '4 წელი (Solomon Institutions)'
    },
    {
      id: 7,
      name: 'ელენე ღრიანდაძე',
      latinName: 'Elene Griandadze',
      role: 'ბიოლოგიის პედაგოგი',
      subject: 'გენეტიკა და მოლეკულური ბიოლოგია',
      badge: 'Uzerziana',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'ილიას სახელმწიფო უნივერსიტეტი (ბიოლოგიის მაგისტრი).',
      experience: '10 წელი საბუნებისმეტყველო მეცნიერებათა სწავლებაში.',
      certifications: 'IB Biology Diploma Programme Category 2.',
      yearsAtSchool: '5 წელი (Solomon Institutions)'
    },
    {
      id: 8,
      name: 'ლუკა გიორგაძე',
      latinName: 'Luka Giorgadze',
      role: 'გეოგრაფიისა და ეკონომიკის პედაგოგი',
      subject: 'გლობალური ეკონომიკა და გეოპოლიტიკა',
      badge: 'S1772',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'თსუ ეკონომიკისა და ბიზნესის ფაკულტეტი (მაგისტრი).',
      experience: '7 წელი ეკონომიკისა და გეოგრაფიის სწავლებაში.',
      certifications: 'AP Economics & Cambridge Global Perspectives.',
      yearsAtSchool: '3 წელი (Solomon Institutions)'
    },
    {
      id: 9,
      name: 'მარიამ კალანდაძე',
      latinName: 'Mariam Kalandadze',
      role: 'ქართული ენისა და ლიტერატურის პედაგოგი',
      subject: 'ქართული ენა და აკადემიური წერა',
      badge: 'Utrrziana',
      image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'თსუ ფილოლოგიის ფაკულტეტი (ბაკალავრი, მაგისტრი).',
      experience: '13 წელი ქართული ენისა და ლიტერატურის სწავლებაში.',
      certifications: 'ეროვნული სასწავლო გამოცდების ექსპერტი, IB EE კოორდინატორი.',
      yearsAtSchool: '6 წელი (Solomon Institutions)'
    }
  ];

  useEffect(() => {
    async function loadTeachers() {
      try {
        const { data, error } = await supabase.from('teachers').select('*');
        if (!error && data && data.length > 0) {
          const mapped = data.map((t, idx) => ({
            id: t.id || idx + 1,
            name: t.full_name,
            latinName: t.full_name,
            role: `${t.subject} პედაგოგი`,
            subject: t.subject,
            badge: t.subject,
            image: t.photo_url || defaultTeachers[idx % defaultTeachers.length].image,
            education: t.education || 'უმაღლესი აკადემიური განათლება',
            experience: t.experience_years ? `${t.experience_years} წელი` : 'მრავალწლიანი გამოცდილება',
            certifications: t.certifications || 'სერტიფიცირებული პედაგოგი',
            yearsAtSchool: t.years_at_school ? `${t.years_at_school} (Solomon Institutions)` : 'Solomon Institutions'
          }));
          setDynamicTeachers(mapped);
        }
      } catch (err) {
        console.error('Error fetching teachers:', err);
      }
    }
    loadTeachers();
  }, []);

  const teachersList = dynamicTeachers.length > 0
    ? [...dynamicTeachers, ...defaultTeachers.slice(dynamicTeachers.length)]
    : defaultTeachers;
  const activeTeacher = teachersList[activeTeacherIndex] || teachersList[0];

  const scrollCarousel = (dir) => {
    if (carouselRef.current) {
      const scrollAmount = dir === 'left' ? -260 : 260;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="teachers"
      style={{
        position: 'relative',
        background: '#121214',
        minHeight: '100vh',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxSizing: 'border-box',
        padding: '16px 0 12px',
        overflow: 'hidden',
        color: '#f0ece8'
      }}
    >
      {/* Chalkboard Math Formulas Background Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.18,
          pointerEvents: 'none',
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(212, 175, 55, 0.08) 0%, transparent 40%)
          `
        }}
      />

      {/* SVG Math & Geometric Formulas Decorative Chalkboard Engravings */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: 0.22
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <style>{`
            .formula-text { font-family: 'Times New Roman', Times, serif; font-style: italic; fill: #d4af37; font-size: 26px; }
            .formula-text-sm { font-family: 'Times New Roman', Times, serif; font-style: italic; fill: #d4af37; font-size: 19px; }
          `}</style>
        </defs>

        {/* Left Side Formulas */}
        <text x="3%" y="18%" className="formula-text">∫ f(x) dx</text>
        <text x="2%" y="45%" className="formula-text">∫ x dx</text>
        <text x="4%" y="58%" className="formula-text">√a² + b²</text>
        <text x="3%" y="72%" className="formula-text-sm">ₙCᵣ</text>
        
        {/* Left 3D Wireframe Cone */}
        <g transform="translate(60, 680) scale(0.65)">
          <ellipse cx="60" cy="110" rx="55" ry="18" fill="none" stroke="#d4af37" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="60" y1="10" x2="5" y2="110" stroke="#d4af37" strokeWidth="1.2" />
          <line x1="60" y1="10" x2="115" y2="110" stroke="#d4af37" strokeWidth="1.2" />
          <line x1="60" y1="10" x2="60" y2="110" stroke="#d4af37" strokeWidth="1" strokeDasharray="2 2" />
        </g>

        {/* Right Side Formulas */}
        <text x="90%" y="22%" className="formula-text">∫ x dx</text>
        <text x="88%" y="42%" className="formula-text">√a² + b²</text>
        <text x="92%" y="56%" className="formula-text-sm">ₙCᵣ</text>

        {/* Right 3D Wireframe Cone */}
        <g transform="translate(1320, 680) scale(0.65)">
          <ellipse cx="60" cy="110" rx="55" ry="18" fill="none" stroke="#d4af37" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="60" y1="10" x2="5" y2="110" stroke="#d4af37" strokeWidth="1.2" />
          <line x1="60" y1="10" x2="115" y2="110" stroke="#d4af37" strokeWidth="1.2" />
          <line x1="60" y1="10" x2="60" y2="110" stroke="#d4af37" strokeWidth="1" strokeDasharray="2 2" />
          <text x="75" y="65" className="formula-text-sm" style={{ fontSize: '14px' }}>h</text>
        </g>
      </svg>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '94%',
          maxWidth: '1280px',
          margin: '0 auto'
        }}
      >
        {/* Ornate Gold Crown & Filigree Top Border */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '10px'
          }}
        >
          {/* Top Filigree Flourish with Crown and Shield */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              width: '100%',
              maxWidth: '560px'
            }}
          >
            {/* Left flourish line */}
            <div
              style={{
                flex: 1,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.7))'
              }}
            />

            {/* Shield & Crown Crest Icon */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0 2px 8px rgba(212, 175, 55, 0.4))'
              }}
            >
              <svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Crown */}
                <path
                  d="M22 20 L26 26 L32 18 L38 26 L42 20 L40 28 L24 28 Z"
                  fill="#d4af37"
                  stroke="#f5e2a3"
                  strokeWidth="1"
                />
                <circle cx="32" cy="16" r="2" fill="#f5e2a3" />
                <circle cx="22" cy="18" r="1.5" fill="#f5e2a3" />
                <circle cx="42" cy="18" r="1.5" fill="#f5e2a3" />

                {/* Shield */}
                <path
                  d="M20 28 C20 28 32 30 32 30 C32 30 44 28 44 28 C44 42 32 50 32 50 C32 50 20 42 20 28 Z"
                  fill="rgba(24, 18, 12, 0.9)"
                  stroke="#d4af37"
                  strokeWidth="1.8"
                />
                <path
                  d="M24 32 C24 32 32 33.5 32 33.5 C32 33.5 40 32 40 32 C40 40 32 46 32 46 C32 46 24 40 24 32 Z"
                  fill="none"
                  stroke="rgba(212, 175, 55, 0.5)"
                  strokeWidth="1"
                />

                {/* Crest Emblems: 'S' inside Shield */}
                <text x="27" y="42" fill="#e8c86d" fontSize="13" fontWeight="bold" fontFamily="serif">
                  S
                </text>
              </svg>
            </div>

            {/* Right flourish line */}
            <div
              style={{
                flex: 1,
                height: '1px',
                background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.7), transparent)'
              }}
            />
          </div>
        </div>

        {/* Central Spotlight Teacher Showcase Card (Exact Mockup 2 Center Card) */}
        <div
          style={{
            maxWidth: '780px',
            margin: '0 auto 12px',
            background: 'rgba(22, 20, 18, 0.95)',
            border: '1.5px solid rgba(212, 175, 55, 0.75)',
            borderRadius: '16px',
            padding: 'clamp(12px, 1.8vh, 18px) clamp(16px, 2.2vw, 24px)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75), inset 0 0 25px rgba(212, 175, 55, 0.08)',
            display: 'grid',
            gridTemplateColumns: 'minmax(110px, 140px) 1fr',
            gap: 'clamp(14px, 2vw, 24px)',
            alignItems: 'center',
            transition: 'all 0.35s ease'
          }}
        >
          {/* Left: Portrait in Golden Rounded Frame */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1 / 1.15',
              borderRadius: '12px',
              border: '1.5px solid rgba(212, 175, 55, 0.65)',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)'
            }}
          >
            <img
              src={activeTeacher.image}
              alt={activeTeacher.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* Right: Teacher Credentials & Bio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* Header: Quote + Name */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'serif',
                  fontSize: '2.2rem',
                  lineHeight: 0.9,
                  color: 'rgba(212, 175, 55, 0.85)'
                }}
              >
                ”
              </span>
              <div>
                <h3
                  style={{
                    fontFamily: "'Noto Serif Georgian', Georgia, serif",
                    fontSize: 'clamp(1.25rem, 1.9vw, 1.55rem)',
                    fontWeight: 600,
                    color: '#ffffff',
                    lineHeight: 1.15,
                    margin: 0
                  }}
                >
                  {activeTeacher.name}
                </h3>
                <p
                  style={{
                    fontFamily: "'Noto Sans Georgian', sans-serif",
                    fontSize: '0.86rem',
                    color: '#c4a66a',
                    fontWeight: 500,
                    marginTop: '2px',
                    marginBottom: '6px'
                  }}
                >
                  {activeTeacher.role}
                </p>
              </div>
            </div>

            {/* Metadata Rows (Matches Mockup 2 format) */}
            <div style={{ fontSize: '0.82rem', lineHeight: 1.5, color: '#ded7cd' }}>
              <p style={{ margin: '2px 0' }}>
                <strong style={{ color: '#c4a66a', fontWeight: 600 }}>განათლება: </strong>
                <span>{activeTeacher.education}</span>
              </p>
              <p style={{ margin: '2px 0' }}>
                <strong style={{ color: '#c4a66a', fontWeight: 600 }}>გამოცდილება: </strong>
                <span>{activeTeacher.experience}</span>
              </p>
              <p style={{ margin: '2px 0' }}>
                <strong style={{ color: '#c4a66a', fontWeight: 600 }}>სერტიფიკატი: </strong>
                <span>{activeTeacher.certifications}</span>
              </p>
              <p style={{ margin: '2px 0' }}>
                <strong style={{ color: '#c4a66a', fontWeight: 600 }}>მუშაობის პერიოდი: </strong>
                <span>{activeTeacher.yearsAtSchool}</span>
              </p>
            </div>

            {/* Gold Action Button: Shesaxeb Meti ⓘ */}
            <div style={{ marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setSelectedTeacher(activeTeacher)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 20px',
                  borderRadius: '8px',
                  background: 'linear-gradient(180deg, #9e7526 0%, #7d5b1b 100%)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 230, 160, 0.4)',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, #b88628 0%, #8f671f 100%)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, #9e7526 0%, #7d5b1b 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>შესახებ მეტი</span>
                <Info size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom 3D Curved Gallery Carousel Strip (Mockup 2) */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            background: 'linear-gradient(180deg, rgba(24, 18, 16, 0.7) 0%, rgba(16, 12, 14, 0.85) 100%)',
            borderTop: '1.5px solid rgba(212, 175, 55, 0.45)',
            borderBottom: '1.5px solid rgba(212, 175, 55, 0.45)',
            borderRadius: '16px',
            padding: '8px 12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7), inset 0 0 20px rgba(212, 175, 55, 0.05)'
          }}
        >
          {/* Navigation arrow buttons */}
          <button
            type="button"
            onClick={() => scrollCarousel('left')}
            style={{
              position: 'absolute',
              left: '-14px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'rgba(24, 20, 16, 0.95)',
              border: '1.5px solid rgba(212, 175, 55, 0.65)',
              color: '#d4af37',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.8)'
            }}
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={() => scrollCarousel('right')}
            style={{
              position: 'absolute',
              right: '-14px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'rgba(24, 20, 16, 0.95)',
              border: '1.5px solid rgba(212, 175, 55, 0.65)',
              color: '#d4af37',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.8)'
            }}
          >
            <ChevronRight size={18} />
          </button>

          {/* Carousel Scroll Track */}
          <div
            ref={carouselRef}
            style={{
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              padding: '6px 4px',
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {teachersList.map((t, idx) => {
              const isActive = idx === activeTeacherIndex;
              return (
                <div
                  key={t.id || idx}
                  onClick={() => setActiveTeacherIndex(idx)}
                  style={{
                    flex: '0 0 100px',
                    cursor: 'pointer',
                    scrollSnapAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    transition: 'all 0.25s ease',
                    transform: isActive ? 'scale(1.06) translateY(-2px)' : 'scale(0.95)',
                    opacity: isActive ? 1 : 0.75
                  }}
                >
                  {/* Portrait Card */}
                  <div
                    style={{
                      width: '88px',
                      height: '102px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: isActive
                        ? '2px solid #d4af37'
                        : '1px solid rgba(212, 175, 55, 0.35)',
                      boxShadow: isActive
                        ? '0 0 16px rgba(212, 175, 55, 0.6), 0 8px 16px rgba(0,0,0,0.8)'
                        : '0 4px 12px rgba(0,0,0,0.5)',
                      background: '#1a1412',
                      marginBottom: '4px'
                    }}
                  >
                    <img
                      src={t.image}
                      alt={t.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>

                  {/* Name and Subject Badge */}
                  <span
                    style={{
                      fontFamily: "'Noto Serif Georgian', Georgia, serif",
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      color: isActive ? '#f5e2a3' : 'rgba(255, 255, 255, 0.85)',
                      lineHeight: 1.15,
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      maxWidth: '96px'
                    }}
                  >
                    {t.name}
                  </span>
                  <span
                    style={{
                      fontSize: '0.64rem',
                      color: isActive ? '#d4af37' : 'rgba(212, 175, 55, 0.65)',
                      marginTop: '1px',
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      maxWidth: '96px'
                    }}
                  >
                    {t.badge || t.role}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Centered Down Navigation Button (D icon in user's drawing) */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
          <a
            href="#news"
            onClick={(e) => {
              e.preventDefault();
              const el = document.querySelector('#news');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            title="შემდეგი სექცია"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(42, 30, 20, 0.95) 0%, rgba(20, 14, 12, 0.95) 100%)',
              border: '1.5px solid rgba(212, 175, 55, 0.75)',
              color: '#f5e2a3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.7), 0 0 14px rgba(212,175,55,0.35)',
              transition: 'all 0.25s ease',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(3px) scale(1.1)';
              e.currentTarget.style.borderColor = '#f5e2a3';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.75)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.7), 0 0 14px rgba(212,175,55,0.35)';
            }}
          >
            <ChevronDown size={20} color="#f5e2a3" />
          </a>
        </div>
      </div>

      {/* Detailed Modal Profile for Teacher */}
      {selectedTeacher && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedTeacher(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.82)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#161311',
              border: '1.5px solid rgba(212, 175, 55, 0.7)',
              borderRadius: '20px',
              maxWidth: '650px',
              width: '100%',
              padding: '36px 32px',
              boxShadow: '0 24px 70px rgba(0,0,0,0.85)',
              position: 'relative',
              color: '#ffffff'
            }}
          >
            <button
              onClick={() => setSelectedTeacher(null)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '24px' }}>
              <div
                style={{
                  width: '110px',
                  height: '125px',
                  borderRadius: '12px',
                  border: '1.5px solid #d4af37',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                <img
                  src={selectedTeacher.image}
                  alt={selectedTeacher.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <h2
                  style={{
                    fontFamily: "'Noto Serif Georgian', serif",
                    fontSize: '1.6rem',
                    color: '#f5e2a3',
                    marginBottom: '4px'
                  }}
                >
                  {selectedTeacher.name}
                </h2>
                <p style={{ color: '#d4af37', fontSize: '0.95rem', fontWeight: 600 }}>
                  {selectedTeacher.role}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                  {selectedTeacher.subject}
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                fontSize: '0.92rem',
                lineHeight: 1.7,
                borderTop: '1px solid rgba(212, 175, 55, 0.2)',
                paddingTop: '20px'
              }}
            >
              <div style={{ display: 'flex', gap: '10px' }}>
                <GraduationCap size={20} color="#d4af37" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#f5e2a3' }}>განათლება: </strong>
                  <span style={{ color: 'rgba(255,255,255,0.85)' }}>{selectedTeacher.education}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Briefcase size={20} color="#d4af37" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#f5e2a3' }}>გამოცდილება: </strong>
                  <span style={{ color: 'rgba(255,255,255,0.85)' }}>{selectedTeacher.experience}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Award size={20} color="#d4af37" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#f5e2a3' }}>სერტიფიკატები: </strong>
                  <span style={{ color: 'rgba(255,255,255,0.85)' }}>{selectedTeacher.certifications}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Calendar size={20} color="#d4af37" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#f5e2a3' }}>მუშაობის პერიოდი: </strong>
                  <span style={{ color: 'rgba(255,255,255,0.85)' }}>{selectedTeacher.yearsAtSchool}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
