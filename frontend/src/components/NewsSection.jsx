import React, { useState, useEffect } from 'react';
import { BookOpen, Calculator, Atom, BookText, Telescope, Microscope, Cpu, Monitor, Info, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function NewsSection() {
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [dbNews, setDbNews] = useState([]);

  useEffect(() => {
    async function loadNews() {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setDbNews(data);
        }
      } catch (err) {
        console.error('Error fetching news:', err);
      }
    }
    loadNews();
  }, []);

  const stories = [
    // Story 1 - Mockup 3: აკადემიის ახალი პროექტები და ინიციატივები
    {
      id: 'mockup-story-1',
      title: 'აკადემიის ახალი პროექტები და ინიციატივები',
      badgeNum: '99',
      presenter: {
        name: 'David Giorgadze',
        geoName: 'დავით გიორგაძე',
        subject: 'History',
        geoSubject: 'ისტორია',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300'
      },
      mentor: {
        name: 'Elene Beridze',
        geoName: 'ელენე ბერიძე',
        education: 'Gnatleba: PhD Mathematics (Oxford / TSU)',
        experience: 'Gamotsdileba: 15 წელი აკადემიურ სივრცეში',
        period: 'Mushavokis Period: Solomon Institutions',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200'
      },
      categories: [
        { id: 'hist', label: 'History', geoLabel: 'ისტორია', icon: BookOpen },
        { id: 'math', label: 'Math', geoLabel: 'მათემატიკა', icon: Calculator },
        { id: 'phys', label: 'Physics', geoLabel: 'ფიზიკა', icon: Atom },
        { id: 'lit', label: 'Literature', geoLabel: 'ლიტერატურა', icon: BookText }
      ],
      labImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
      description: `აკადემიის ახალი პროექტები და ინიციატივები აერთიანებს ინტერდისციპლინურ კვლევებსა და ინოვაციურ სასწავლო მეთოდებს. მოსწავლეები მუშაობენ რეალურ სამეცნიერო და ჰუმანიტარულ ქეისებზე, რაც ავითარებს კრიტიკულ აზროვნებას, გუნდურ მუშაობასა და კვლევით უნარ-ჩვევებს.`,
      bullets: []
    },
    // Story 2 - Mockup 4: ეკოლოგიური კვლევა და STEM ინოვაციები
    {
      id: 'mockup-story-2',
      title: 'ეკოლოგიური კვლევა & STEM ინოვაციები',
      badgeNum: '03',
      presenter: {
        name: 'Ana Kapanadze',
        geoName: 'ანა კაპანაძე',
        subject: 'ქიმია',
        geoSubject: 'ქიმია და ბიოტექნოლოგია',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300&h=300'
      },
      mentor: {
        name: 'ლევან მაისურაძე',
        geoName: 'ლევან მაისურაძე',
        education: "განათლება: K'embridzhis Universit'eti, Biologia",
        experience: "პუბლიკაციები: 'Nature', 'Journal of Biological Chemistry'",
        period: "მუშაობის პერიოდი: K'embridzhis Universit'eti & Solomon",
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200'
      },
      categories: [
        { id: 'astro', label: 'ასტრონომია', geoLabel: 'ასტრონომია', icon: Telescope },
        { id: 'bio', label: 'ბიოლოგია', geoLabel: 'ბიოლოგია', icon: Microscope },
        { id: 'eng', label: 'ინჟინერია', geoLabel: 'ინჟინერია', icon: Cpu },
        { id: 'cs', label: 'კომპიუტერული მეცნიერება', geoLabel: 'IT & AI', icon: Monitor }
      ],
      labImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
      description: `ეკოლოგიური კვლევის ლაბორატორია ატარებს კომპლექსურ კვლევებს ბუნებრივი ეკოსისტემების მდგრადობისა და თანამედროვე რობოტოტექნიკის გამოყენებით.`,
      bullets: [
        'ახალი მცენარეების კლასიფიკაცია და გენეტიკური დახასიათება',
        'ნიადაგის ჯანმრთელობისა და ტენიანობის სენსორული მონიტორინგი',
        'ეკოსისტემის დაცვის ინიციატივები და ურბანული ეკოლოგია',
        'მრავალფეროვანი ველური ბუნების კონსერვაცია',
        'ბიოლოგიური ნიმუშების სპექტრომეტრული ანალიზი',
        'ახალი კვლევის მეთოდები და ავტონომიური რობოტული ზონდები'
      ]
    }
  ];

  const currentStory = stories[activeStoryIndex] || stories[0];

  return (
    <section
      id="news"
      style={{
        position: 'relative',
        background: '#121214',
        padding: 'clamp(80px, 10vh, 120px) 0 90px',
        overflow: 'hidden',
        color: '#f0ece8'
      }}
    >
      {/* Chalkboard Math Formulas Background Overlay */}
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
            .formula-chalk { font-family: 'Times New Roman', Times, serif; font-style: italic; fill: #d4af37; font-size: 26px; }
            .formula-chalk-sm { font-family: 'Times New Roman', Times, serif; font-style: italic; fill: #d4af37; font-size: 20px; }
          `}</style>
        </defs>

        <text x="2%" y="15%" className="formula-chalk">f = ∫₀^∞ f(x)(x+)dx</text>
        <text x="3%" y="42%" className="formula-chalk">∫ x dx</text>
        <text x="2%" y="60%" className="formula-chalk">ₙCᵣ</text>

        <text x="91%" y="18%" className="formula-chalk">∫ x dx</text>
        <text x="89%" y="38%" className="formula-chalk">√a² + b²</text>
        <text x="92%" y="54%" className="formula-chalk-sm">ₙCᵣ</text>
        <text x="90%" y="66%" className="formula-chalk-sm">√</text>

        {/* Wireframe Geometric Cone Bottom Left */}
        <g transform="translate(50, 640) scale(0.6)">
          <ellipse cx="60" cy="110" rx="55" ry="18" fill="none" stroke="#d4af37" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="60" y1="10" x2="5" y2="110" stroke="#d4af37" strokeWidth="1.2" />
          <line x1="60" y1="10" x2="115" y2="110" stroke="#d4af37" strokeWidth="1.2" />
        </g>

        {/* Wireframe Torus / Cone Bottom Right */}
        <g transform="translate(1330, 640) scale(0.6)">
          <ellipse cx="60" cy="110" rx="55" ry="18" fill="none" stroke="#d4af37" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="60" y1="10" x2="5" y2="110" stroke="#d4af37" strokeWidth="1.2" />
          <line x1="60" y1="10" x2="115" y2="110" stroke="#d4af37" strokeWidth="1.2" />
        </g>
      </svg>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '92%',
          maxWidth: '1240px',
          margin: '0 auto'
        }}
      >
        {/* Section Heading: სიახლეები */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2
            style={{
              fontFamily: "'Noto Serif Georgian', Georgia, serif",
              fontSize: 'clamp(2.4rem, 4.2vw, 3.4rem)',
              fontWeight: 400,
              color: '#f6f4ee',
              letterSpacing: '0.02em',
              margin: '0 0 10px',
              textShadow: '0 2px 14px rgba(0,0,0,0.8)'
            }}
          >
            სიახლეები
          </h2>

          {/* Story Switcher Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '12px' }}>
            {stories.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveStoryIndex(idx)}
                style={{
                  padding: '7px 20px',
                  borderRadius: '100px',
                  border: idx === activeStoryIndex ? '1px solid #d4af37' : '1px solid rgba(212, 175, 55, 0.25)',
                  background: idx === activeStoryIndex ? 'rgba(212, 175, 55, 0.18)' : 'rgba(20, 16, 14, 0.6)',
                  color: idx === activeStoryIndex ? '#f5e2a3' : 'rgba(255, 255, 255, 0.65)',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(8px)'
                }}
              >
                {idx === 0 ? 'პროექტები & ინიციატივები' : 'ეკოლოგიური კვლევა & STEM'}
              </button>
            ))}
          </div>
        </div>

        {/* Ornate Gold Framed Container (Exact Mockups 3 & 4 Layout) */}
        <div
          style={{
            position: 'relative',
            background: 'rgba(22, 20, 18, 0.94)',
            border: '1.5px solid rgba(212, 175, 55, 0.75)',
            borderRadius: '18px',
            padding: 'clamp(20px, 3.5vw, 36px)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), inset 0 0 30px rgba(212, 175, 55, 0.06)',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1.35fr)',
            gap: 'clamp(20px, 3vw, 36px)',
            alignItems: 'stretch'
          }}
          className="news-showcase-grid"
        >
          {/* LEFT SIDE: Presenter Card + 2x2 Subject Buttons + Lab Photo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Top row of Left Side: Presenter Card + 2x2 Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '14px' }}>
              
              {/* Presenter / Author Card with Quote/Badge */}
              <div
                style={{
                  background: 'rgba(18, 15, 14, 0.9)',
                  border: '1px solid rgba(212, 175, 55, 0.5)',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative'
                }}
              >
                {/* Photo in Gold Frame */}
                <div
                  style={{
                    position: 'relative',
                    width: '78px',
                    height: '84px',
                    borderRadius: '10px',
                    border: '1.5px solid rgba(212, 175, 55, 0.65)',
                    overflow: 'hidden',
                    marginBottom: '8px'
                  }}
                >
                  <img
                    src={currentStory.presenter.image}
                    alt={currentStory.presenter.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Badge Number Pill (e.g. 99 or 03) */}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '2px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#b88628',
                      color: '#ffffff',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '1px 8px',
                      borderRadius: '100px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.6)'
                    }}
                  >
                    {currentStory.badgeNum}
                  </span>
                </div>

                {/* Presenter Name & Role */}
                <span
                  style={{
                    fontFamily: "'Noto Serif Georgian', Georgia, serif",
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    lineHeight: 1.2
                  }}
                >
                  {currentStory.presenter.geoName}
                </span>
                <span
                  style={{
                    fontSize: '0.74rem',
                    color: '#c4a66a',
                    marginTop: '2px'
                  }}
                >
                  {currentStory.presenter.geoSubject}
                </span>
              </div>

              {/* 2x2 Category / Subject Selector Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {currentStory.categories.map((cat) => {
                  const IconComponent = cat.icon;
                  const isSelected = selectedSubject === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedSubject(isSelected ? null : cat.id)}
                      style={{
                        background: isSelected ? 'rgba(212, 175, 55, 0.22)' : 'rgba(18, 15, 14, 0.8)',
                        border: isSelected ? '1.5px solid #d4af37' : '1px solid rgba(212, 175, 55, 0.35)',
                        borderRadius: '10px',
                        padding: '10px 6px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                        color: isSelected ? '#f5e2a3' : '#d4af37',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: isSelected ? '0 0 10px rgba(212, 175, 55, 0.3)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.7)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.35)';
                      }}
                    >
                      <IconComponent size={20} />
                      <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#f0ece8' }}>
                        {cat.geoLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Lab Photography Banner */}
            <div
              style={{
                position: 'relative',
                borderRadius: '12px',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                overflow: 'hidden',
                height: '190px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
              }}
            >
              <img
                src={currentStory.labImage}
                alt="Research Laboratory"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(10, 6, 8, 0.7) 0%, transparent 60%)'
                }}
              />
            </div>
          </div>

          {/* RIGHT SIDE: Mentor Mini Profile + Project Headline + Content + Shesaxeb Meti Button */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px'
            }}
          >
            {/* Top Mentor Mini Profile */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                background: 'rgba(18, 15, 14, 0.8)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                borderRadius: '12px',
                padding: '12px 16px'
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '10px',
                  border: '1.5px solid rgba(212, 175, 55, 0.6)',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                <img
                  src={currentStory.mentor.image}
                  alt={currentStory.mentor.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ fontSize: '0.8rem', lineHeight: 1.45, color: '#ded7cd' }}>
                <h4
                  style={{
                    fontFamily: "'Noto Serif Georgian', Georgia, serif",
                    fontSize: '1.05rem',
                    color: '#ffffff',
                    margin: '0 0 2px'
                  }}
                >
                  {currentStory.mentor.geoName}
                </h4>
                <p style={{ margin: 0, color: '#c4a66a', fontSize: '0.76rem' }}>
                  {currentStory.mentor.education}
                </p>
                <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.74rem' }}>
                  {currentStory.mentor.period}
                </p>
              </div>
            </div>

            {/* Main Headline & Description */}
            <div>
              <h3
                style={{
                  fontFamily: "'Noto Serif Georgian', Georgia, serif",
                  fontSize: 'clamp(1.25rem, 2vw, 1.55rem)',
                  fontWeight: 600,
                  color: '#f5e2a3',
                  lineHeight: 1.3,
                  marginBottom: '12px'
                }}
              >
                {currentStory.title}
              </h3>

              <p
                style={{
                  fontSize: '0.88rem',
                  lineHeight: 1.7,
                  color: 'rgba(255, 255, 255, 0.85)',
                  marginBottom: currentStory.bullets.length > 0 ? '12px' : '0'
                }}
              >
                {currentStory.description}
              </p>

              {/* Bullets (Mockup 4 style) */}
              {currentStory.bullets.length > 0 && (
                <ul
                  style={{
                    listStyleType: 'disc',
                    paddingLeft: '20px',
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    fontSize: '0.84rem',
                    color: '#ded7cd',
                    lineHeight: 1.5
                  }}
                >
                  {currentStory.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} style={{ color: 'rgba(255, 255, 255, 0.82)' }}>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Action Button: Shesaxeb Meti ⓘ */}
            <div>
              <button
                type="button"
                onClick={() => setSelectedArticle(currentStory)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 24px',
                  borderRadius: '8px',
                  background: 'linear-gradient(180deg, #9e7526 0%, #7d5b1b 100%)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 230, 160, 0.4)',
                  fontSize: '0.88rem',
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
                <Info size={14} />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedArticle(null)}
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
              maxWidth: '680px',
              width: '100%',
              padding: '36px 32px',
              boxShadow: '0 24px 70px rgba(0,0,0,0.85)',
              position: 'relative',
              color: '#ffffff'
            }}
          >
            <button
              onClick={() => setSelectedArticle(null)}
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

            <div style={{ borderRadius: '12px', overflow: 'hidden', height: '220px', marginBottom: '20px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
              <img
                src={selectedArticle.labImage}
                alt={selectedArticle.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <h2
              style={{
                fontFamily: "'Noto Serif Georgian', serif",
                fontSize: '1.6rem',
                color: '#f5e2a3',
                marginBottom: '12px'
              }}
            >
              {selectedArticle.title}
            </h2>

            <p style={{ fontSize: '0.94rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.85)', marginBottom: '16px' }}>
              {selectedArticle.description}
            </p>

            {selectedArticle.bullets && selectedArticle.bullets.length > 0 && (
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem', color: '#ded7cd' }}>
                {selectedArticle.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
