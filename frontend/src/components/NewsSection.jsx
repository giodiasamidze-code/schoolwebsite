import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Calculator, Atom, BookText, Telescope, Microscope, Cpu, Monitor, Info, X, ChevronLeft, ChevronRight, Sparkles, Calendar, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function NewsSection() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedSubjectByCard, setSelectedSubjectByCard] = useState({});
  const [dbNews, setDbNews] = useState([]);
  const carouselContainerRef = useRef(null);

  const defaultStories = [
    // Story 1: აკადემიის ახალი პროექტები და ინიციატივები
    {
      id: 'story-projects',
      stage: 'საშუალო',
      category: 'projects',
      categoryLabel: 'პროექტები & ინიციატივები',
      badgeNum: '99',
      date: '24 მაისი, 2026',
      title: 'აკადემიის ახალი პროექტები და ინიციატივები',
      presenter: {
        name: 'დავით გიორგაძე',
        subject: 'ისტორია',
        geoSubject: 'ისტორია',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300'
      },
      mentor: {
        name: 'ელენე ბერიძე',
        geoName: 'ელენე ბერიძე',
        education: 'Gnatleba: PhD Mathematics (Oxford / TSU)',
        experience: 'Gamotsdileba: 15 წელი აკადემიურ სივრცეში',
        period: 'Mushavokis Period: Solomon Institutions',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200'
      },
      categories: [
        { id: 'hist', geoLabel: 'ისტორია', icon: BookOpen },
        { id: 'math', geoLabel: 'მათემატიკა', icon: Calculator },
        { id: 'phys', geoLabel: 'ფიზიკა', icon: Atom },
        { id: 'lit', geoLabel: 'ლიტერატურა', icon: BookText }
      ],
      labImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
      description: 'აკადემიის ახალი პროექტები და ინიციატივები აერთიანებს ინტერდისციპლინურ კვლევებსა და ინოვაციურ სასწავლო მეთოდებს. მოსწავლეები მუშაობენ რეალურ სამეცნიერო და ჰუმანიტარულ ქეისებზე, რაც ავითარებს კრიტიკულ აზროვნებას, გუნდურ მუშაობასა და კვლევით უნარ-ჩვევებს.',
      bullets: [
        'საერთაშორისო აკადემიური გაცვლითი პროექტები პარტნიორ უნივერსიტეტებთან',
        'სტუდენტური დებატების ლიგა და დიპლომატიური სიმულაციები',
        'საზოგადოებრივი ინიციატივები და ადგილობრივი თემის მხარდაჭერა'
      ]
    },
    // Story 2: ეკოლოგიური კვლევა და STEM ინოვაციები
    {
      id: 'story-stem',
      stage: 'საბაზო',
      category: 'stem',
      categoryLabel: 'ეკოლოგიური კვლევა & STEM',
      badgeNum: '03',
      date: '18 მაისი, 2026',
      title: 'ეკოლოგიური კვლევა & STEM ინოვაციები',
      presenter: {
        name: 'ანა კაპანაძე',
        subject: 'ქიმია და ბიოტექნოლოგია',
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
        { id: 'astro', geoLabel: 'ასტრონომია', icon: Telescope },
        { id: 'bio', geoLabel: 'ბიოლოგია', icon: Microscope },
        { id: 'eng', geoLabel: 'ინჟინერია', icon: Cpu },
        { id: 'cs', geoLabel: 'IT & AI', icon: Monitor }
      ],
      labImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
      description: 'ეკოლოგიური კვლევის ლაბორატორია ატარებს კომპლექსურ კვლევებს ბუნებრივი ეკოსისტემების მდგრადობისა და თანამედროვე რობოტოტექნიკის გამოყენებით.',
      bullets: [
        'ახალი მცენარეების კლასიფიკაცია და გენეტიკური დახასიათება',
        'ნიადაგის ჯანმრთელობისა და ტენიანობის სენსორული მონიტორინგი',
        'ეკოსისტემის დაცვის ინიციატივები და ურბანული ეკოლოგია',
        'მრავალფეროვანი ველური ბუნების კონსერვაცია',
        'ბიოლოგიური ნიმუშების სპექტრომეტრული ანალიზი',
        'ახალი კვლევის მეთოდები და ავტონომიური რობოტული ზონდები'
      ]
    },
    // Story 3: საერთაშორისო ოლიმპიადის გამარჯვება
    {
      id: 'story-olympiad',
      stage: 'საშუალო',
      category: 'stem',
      categoryLabel: 'აკადემიური ოლიმპიადები',
      badgeNum: '07',
      date: '10 მაისი, 2026',
      title: 'აკადემიის მოსწავლეთა ტრიუმფი საერთაშორისო ოლიმპიადაზე',
      presenter: {
        name: 'ნიკოლოზ წერეთელი',
        subject: 'მათემატიკა & ალგორითმები',
        geoSubject: 'მათემატიკა & AI',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300'
      },
      mentor: {
        name: 'ალექსანდრე ჩხეიძე',
        geoName: 'ალექსანდრე ჩხეიძე',
        education: 'განათლება: ჰარვარდის უნივერსიტეტი, ფიზიკა',
        experience: 'აკადემიური მენტორი 12 წლის განმავლობაში',
        period: 'მუშაობის პერიოდი: Solomon Institutions',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200'
      },
      categories: [
        { id: 'math', geoLabel: 'მათემატიკა', icon: Calculator },
        { id: 'phys', geoLabel: 'ფიზიკა', icon: Atom },
        { id: 'cs', geoLabel: 'IT & AI', icon: Monitor },
        { id: 'eng', geoLabel: 'ინჟინერია', icon: Cpu }
      ],
      labImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
      description: 'სოლომონ აკადემიის გუნდმა ევროპის ახალგაზრდულ ოლიმპიადაზე მათემატიკასა და ალგორითმულ პროგრამირებაში 3 ოქროსა და 2 ვერცხლის მედალი მოიპოვა.',
      bullets: [
        'მათემატიკური ანალიზისა და ალგორითმების ტურში უმაღლესი ქულები',
        'მსოფლიოს 42 ქვეყნის წარმომადგენელთა შორის პირველი გუნდური ადგილი',
        'სრული სტიპენდიები წამყვანი უნივერსიტეტების მოსამზადებელ კურსებზე'
      ]
    },
    // Story 4: დაწყებითი საფეხურის რობოტოტექნიკა და შემოქმედება
    {
      id: 'story-junior',
      stage: 'დაწყებითი',
      category: 'projects',
      categoryLabel: 'დაწყებითი საფეხურის პროექტები',
      badgeNum: '12',
      date: '2 მაისი, 2026',
      title: 'პატარა მკვლევარები: დაწყებითი საფეხურის STEM ლაბორატორია',
      presenter: {
        name: 'სალომე ჯაფარიძე',
        subject: 'დაწყებითი STEM განათლება',
        geoSubject: 'STEM & ხელოვნება',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300'
      },
      mentor: {
        name: 'ქეთევან დოლიძე',
        geoName: 'ქეთევან დოლიძე',
        education: 'განათლება: თსუ, პედაგოგიკა და ფსიქოლოგია',
        experience: 'დაწყებითი განათლების ექსპერტი',
        period: 'მუშაობის პერიოდი: Solomon Institutions',
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200&h=200'
      },
      categories: [
        { id: 'bio', geoLabel: 'ბუნებისმეტყველება', icon: Microscope },
        { id: 'lit', geoLabel: 'შემოქმედება', icon: BookText },
        { id: 'math', geoLabel: 'ლოგიკა', icon: Calculator },
        { id: 'eng', geoLabel: 'რობოტიქსი', icon: Cpu }
      ],
      labImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
      description: 'დაწყებითი კლასების მოსწავლეები თამაშისა და პრაქტიკული ექსპერიმენტების გზით ეცნობიან რობოტიკის, ბუნებისმეტყველებისა და ხელოვნების საფუძვლებს.',
      bullets: [
        'ინტერაქციული რობოტული კონსტრუქტორების აწყობა და პროგრამირება',
        'სასკოლო მინი-ბოტანიკური ბაღის ეკო-დაკვირვებები',
        'შემოქმედებითი გამოფენა და მშობელთა ღია კარის დღე'
      ]
    }
  ];

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

  const filterTabs = [
    { id: 'all', label: 'ყველა სიახლე' },
    { id: 'დაწყებითი', label: 'დაწყებითი' },
    { id: 'საბაზო', label: 'საბაზო' },
    { id: 'საშუალო', label: 'საშუალო' },
    { id: 'სკოლის სიახლე', label: 'სკოლის სიახლე' }
  ];

  const filteredStories = selectedFilter === 'all'
    ? defaultStories
    : defaultStories.filter((s) => s.stage === selectedFilter || s.categoryLabel.includes(selectedFilter));

  // Wheel horizontal scroll integration with data-lenis-prevent
  useEffect(() => {
    const el = carouselContainerRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      // If horizontal delta or vertical wheel over the carousel, scroll carousel horizontally
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) > 4) {
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        el.scrollBy({
          left: delta * 2.2,
          behavior: 'smooth'
        });
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Update activeCardIndex on scroll
  const handleScroll = () => {
    const el = carouselContainerRef.current;
    if (!el) return;
    const cards = el.querySelectorAll('.news-carousel-card');
    const containerCenter = el.getBoundingClientRect().left + el.clientWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    cards.forEach((card, idx) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const dist = Math.abs(cardCenter - containerCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }
    });

    if (closestIndex !== activeCardIndex) {
      setActiveCardIndex(closestIndex);
    }
  };

  const scrollToIndex = (idx) => {
    const el = carouselContainerRef.current;
    if (!el) return;
    const cards = el.querySelectorAll('.news-carousel-card');
    if (cards[idx]) {
      cards[idx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      setActiveCardIndex(idx);
    }
  };

  const handleNext = () => {
    const nextIdx = Math.min(filteredStories.length - 1, activeCardIndex + 1);
    scrollToIndex(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = Math.max(0, activeCardIndex - 1);
    scrollToIndex(prevIdx);
  };

  const handleSubjectClick = (cardId, subjectId) => {
    setSelectedSubjectByCard((prev) => ({
      ...prev,
      [cardId]: prev[cardId] === subjectId ? null : subjectId
    }));
  };

  return (
    <section
      id="news"
      style={{
        position: 'relative',
        background: '#121214',
        minHeight: '100vh',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxSizing: 'border-box',
        padding: '20px 0',
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
          opacity: 0.2
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
        <g transform="translate(40, 640) scale(0.6)">
          <ellipse cx="60" cy="110" rx="55" ry="18" fill="none" stroke="#d4af37" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="60" y1="10" x2="5" y2="110" stroke="#d4af37" strokeWidth="1.2" />
          <line x1="60" y1="10" x2="115" y2="110" stroke="#d4af37" strokeWidth="1.2" />
        </g>

        {/* Wireframe Torus / Cone Bottom Right */}
        <g transform="translate(1340, 640) scale(0.6)">
          <ellipse cx="60" cy="110" rx="55" ry="18" fill="none" stroke="#d4af37" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="60" y1="10" x2="5" y2="110" stroke="#d4af37" strokeWidth="1.2" />
          <line x1="60" y1="10" x2="115" y2="110" stroke="#d4af37" strokeWidth="1.2" />
        </g>
      </svg>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Section Header: Title & Stage Filter Pills */}
        <div style={{ textAlign: 'center', marginBottom: '14px', width: '92%', maxWidth: '1240px' }}>
          <h2
            style={{
              fontFamily: "'Noto Serif Georgian', Georgia, serif",
              fontSize: 'clamp(1.9rem, 3.2vw, 2.7rem)',
              fontWeight: 400,
              color: '#f6f4ee',
              letterSpacing: '0.02em',
              margin: '0 0 10px',
              textShadow: '0 2px 14px rgba(0,0,0,0.8)'
            }}
          >
            აქტივობების ქრონიკა და სიახლეები
          </h2>

          {/* Stage Filter Pills */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            {filterTabs.map((tab) => {
              const isActive = selectedFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setSelectedFilter(tab.id);
                    setActiveCardIndex(0);
                    if (carouselContainerRef.current) {
                      carouselContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                    }
                  }}
                  style={{
                    padding: '6px 18px',
                    borderRadius: '100px',
                    border: isActive ? '1.5px solid #d4af37' : '1px solid rgba(212, 175, 55, 0.3)',
                    background: isActive ? 'rgba(212, 175, 55, 0.22)' : 'rgba(20, 16, 14, 0.65)',
                    color: isActive ? '#f5e2a3' : 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 0 14px rgba(212, 175, 55, 0.35)' : 'none',
                    transition: 'all 0.22s ease',
                    backdropFilter: 'blur(8px)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.7)';
                      e.currentTarget.style.color = '#f5e2a3';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                    }
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Carousel Wrapper with Left / Right Nav Arrows */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Left Nav Arrow */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={activeCardIndex === 0}
            title="წინა ბარათი"
            style={{
              position: 'absolute',
              left: 'clamp(8px, 2.5vw, 32px)',
              zIndex: 10,
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(32, 24, 20, 0.95) 0%, rgba(16, 12, 14, 0.95) 100%)',
              border: '1.5px solid rgba(212, 175, 55, 0.7)',
              color: '#f5e2a3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: activeCardIndex === 0 ? 'default' : 'pointer',
              opacity: activeCardIndex === 0 ? 0.3 : 1,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.7), 0 0 14px rgba(212, 175, 55, 0.3)',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={(e) => {
              if (activeCardIndex !== 0) {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.borderColor = '#f5e2a3';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.7)';
            }}
          >
            <ChevronLeft size={22} color="#f5e2a3" />
          </button>

          {/* Right Nav Arrow */}
          <button
            type="button"
            onClick={handleNext}
            disabled={activeCardIndex === filteredStories.length - 1}
            title="შემდეგი ბარათი"
            style={{
              position: 'absolute',
              right: 'clamp(8px, 2.5vw, 32px)',
              zIndex: 10,
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(32, 24, 20, 0.95) 0%, rgba(16, 12, 14, 0.95) 100%)',
              border: '1.5px solid rgba(212, 175, 55, 0.7)',
              color: '#f5e2a3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: activeCardIndex === filteredStories.length - 1 ? 'default' : 'pointer',
              opacity: activeCardIndex === filteredStories.length - 1 ? 0.3 : 1,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.7), 0 0 14px rgba(212, 175, 55, 0.3)',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={(e) => {
              if (activeCardIndex !== filteredStories.length - 1) {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.borderColor = '#f5e2a3';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.7)';
            }}
          >
            <ChevronRight size={22} color="#f5e2a3" />
          </button>

          {/* Horizontal Scroll Track */}
          <div
            ref={carouselContainerRef}
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
            onScroll={handleScroll}
            style={{
              display: 'flex',
              gap: 'clamp(20px, 3.5vw, 44px)',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              padding: '24px calc(50vw - min(570px, 44vw))',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-x',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            {filteredStories.map((story, idx) => {
              const isFocused = idx === activeCardIndex;
              const selectedSub = selectedSubjectByCard[story.id];

              return (
                <div
                  key={story.id}
                  className="news-carousel-card"
                  onClick={() => scrollToIndex(idx)}
                  style={{
                    flex: '0 0 min(1140px, 88vw)',
                    scrollSnapAlign: 'center',
                    background: 'rgba(22, 20, 18, 0.95)',
                    border: isFocused ? '1.5px solid rgba(212, 175, 55, 0.85)' : '1px solid rgba(212, 175, 55, 0.35)',
                    borderRadius: '20px',
                    padding: 'clamp(18px, 3vw, 32px)',
                    boxShadow: isFocused
                      ? '0 24px 70px rgba(0, 0, 0, 0.9), 0 0 35px rgba(212, 175, 55, 0.18)'
                      : '0 12px 35px rgba(0, 0, 0, 0.6)',
                    opacity: isFocused ? 1 : 0.6,
                    transform: isFocused ? 'scale(1)' : 'scale(0.95)',
                    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.35fr)',
                    gap: 'clamp(18px, 2.5vw, 32px)',
                    alignItems: 'stretch',
                    cursor: isFocused ? 'default' : 'pointer'
                  }}
                >
                  {/* LEFT SIDE: Presenter Card + 2x2 Subject Buttons + Lab Photo */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* Top row of Left Side: Presenter Card + 2x2 Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '12px' }}>
                      {/* Presenter Card */}
                      <div
                        style={{
                          background: 'rgba(18, 15, 14, 0.9)',
                          border: '1px solid rgba(212, 175, 55, 0.5)',
                          borderRadius: '12px',
                          padding: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          position: 'relative'
                        }}
                      >
                        <div
                          style={{
                            position: 'relative',
                            width: '74px',
                            height: '80px',
                            borderRadius: '10px',
                            border: '1.5px solid rgba(212, 175, 55, 0.65)',
                            overflow: 'hidden',
                            marginBottom: '6px'
                          }}
                        >
                          <img
                            src={story.presenter.image}
                            alt={story.presenter.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <span
                            style={{
                              position: 'absolute',
                              bottom: '2px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              background: '#b88628',
                              color: '#ffffff',
                              fontSize: '0.66rem',
                              fontWeight: 800,
                              padding: '1px 8px',
                              borderRadius: '100px',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.6)'
                            }}
                          >
                            {story.badgeNum}
                          </span>
                        </div>

                        <span
                          style={{
                            fontFamily: "'Noto Serif Georgian', Georgia, serif",
                            fontSize: '0.84rem',
                            fontWeight: 600,
                            color: '#ffffff',
                            lineHeight: 1.2
                          }}
                        >
                          {story.presenter.name}
                        </span>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            color: '#c4a66a',
                            marginTop: '2px'
                          }}
                        >
                          {story.presenter.geoSubject}
                        </span>
                      </div>

                      {/* 2x2 Subject Selector Buttons */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {story.categories.map((cat) => {
                          const IconComponent = cat.icon;
                          const isSelected = selectedSub === cat.id;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSubjectClick(story.id, cat.id);
                              }}
                              style={{
                                background: isSelected ? 'rgba(212, 175, 55, 0.22)' : 'rgba(18, 15, 14, 0.8)',
                                border: isSelected ? '1.5px solid #d4af37' : '1px solid rgba(212, 175, 55, 0.35)',
                                borderRadius: '10px',
                                padding: '8px 4px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px',
                                color: isSelected ? '#f5e2a3' : '#d4af37',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: isSelected ? '0 0 10px rgba(212, 175, 55, 0.3)' : 'none'
                              }}
                            >
                              <IconComponent size={18} />
                              <span style={{ fontSize: '0.66rem', fontWeight: 600, color: '#f0ece8' }}>
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
                        height: '175px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
                      }}
                    >
                      <img
                        src={story.labImage}
                        alt={story.title}
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

                  {/* RIGHT SIDE: Mentor Profile + Headline + Description / Bullets + Action Button */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '14px'
                    }}
                  >
                    {/* Mentor Profile */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: 'rgba(18, 15, 14, 0.8)',
                        border: '1px solid rgba(212, 175, 55, 0.4)',
                        borderRadius: '12px',
                        padding: '10px 14px'
                      }}
                    >
                      <div
                        style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '10px',
                          border: '1.5px solid rgba(212, 175, 55, 0.6)',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}
                      >
                        <img
                          src={story.mentor.image}
                          alt={story.mentor.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>

                      <div style={{ fontSize: '0.78rem', lineHeight: 1.4, color: '#ded7cd' }}>
                        <h4
                          style={{
                            fontFamily: "'Noto Serif Georgian', Georgia, serif",
                            fontSize: '0.98rem',
                            color: '#ffffff',
                            margin: '0 0 2px'
                          }}
                        >
                          {story.mentor.geoName}
                        </h4>
                        <p style={{ margin: 0, color: '#c4a66a', fontSize: '0.74rem' }}>
                          {story.mentor.education}
                        </p>
                        <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.72rem' }}>
                          {story.mentor.period}
                        </p>
                      </div>
                    </div>

                    {/* Headline & Description & Bullets */}
                    <div>
                      <h3
                        style={{
                          fontFamily: "'Noto Serif Georgian', Georgia, serif",
                          fontSize: 'clamp(1.15rem, 1.8vw, 1.45rem)',
                          fontWeight: 600,
                          color: '#f5e2a3',
                          lineHeight: 1.3,
                          marginBottom: '8px'
                        }}
                      >
                        {story.title}
                      </h3>

                      <p
                        style={{
                          fontSize: '0.84rem',
                          lineHeight: 1.65,
                          color: 'rgba(255, 255, 255, 0.85)',
                          margin: story.bullets && story.bullets.length > 0 ? '0 0 8px' : '0'
                        }}
                      >
                        {story.description}
                      </p>

                      {/* Bullets (if any) */}
                      {story.bullets && story.bullets.length > 0 && (
                        <ul
                          style={{
                            listStyleType: 'disc',
                            paddingLeft: '18px',
                            margin: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '3px',
                            fontSize: '0.8rem',
                            color: '#ded7cd',
                            lineHeight: 1.45
                          }}
                        >
                          {story.bullets.slice(0, 5).map((bullet, bIdx) => (
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
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedArticle(story);
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 22px',
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
                        <span>სრულად ნახვა</span>
                        <Info size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '14px' }}>
          {filteredStories.map((_, idx) => {
            const isDotActive = idx === activeCardIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToIndex(idx)}
                title={`ბარათი ${idx + 1}`}
                style={{
                  width: isDotActive ? '26px' : '8px',
                  height: '8px',
                  borderRadius: '100px',
                  background: isDotActive ? '#d4af37' : 'rgba(212, 175, 55, 0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isDotActive ? '0 0 10px rgba(212, 175, 55, 0.6)' : 'none'
                }}
              />
            );
          })}
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
            background: 'rgba(0, 0, 0, 0.85)',
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
              border: '1.5px solid rgba(212, 175, 55, 0.75)',
              borderRadius: '20px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '34px 30px',
              boxShadow: '0 24px 70px rgba(0,0,0,0.85)',
              position: 'relative',
              color: '#ffffff'
            }}
          >
            <button
              onClick={() => setSelectedArticle(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
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

            <span
              style={{
                display: 'inline-block',
                background: '#b88628',
                color: '#ffffff',
                fontSize: '0.74rem',
                fontWeight: 700,
                padding: '2px 10px',
                borderRadius: '100px',
                marginBottom: '10px'
              }}
            >
              {selectedArticle.categoryLabel}
            </span>

            <h2
              style={{
                fontFamily: "'Noto Serif Georgian', serif",
                fontSize: '1.55rem',
                color: '#f5e2a3',
                marginBottom: '12px',
                lineHeight: 1.3
              }}
            >
              {selectedArticle.title}
            </h2>

            <p style={{ fontSize: '0.92rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.85)', marginBottom: '16px' }}>
              {selectedArticle.description}
            </p>

            {selectedArticle.bullets && selectedArticle.bullets.length > 0 && (
              <div style={{ background: 'rgba(20, 16, 14, 0.8)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '12px', padding: '16px 20px' }}>
                <h4 style={{ color: '#d4af37', fontSize: '0.92rem', margin: '0 0 10px' }}>
                  დეტალური პუნქტები:
                </h4>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.88rem', color: '#ded7cd' }}>
                  {selectedArticle.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
