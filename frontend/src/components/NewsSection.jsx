import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Calculator, Atom, BookText, Telescope, Microscope, Cpu, Monitor, Info, X, Calendar, User, ArrowRight, Sparkles, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function NewsSection() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNewsId, setSelectedNewsId] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [dbNews, setDbNews] = useState([]);
  const carouselRef = useRef(null);

  const defaultNews = [
    {
      id: 'news-1',
      category: 'projects',
      categoryLabel: 'პროექტები & ინიციატივები',
      badgeNum: '01',
      title: 'აკადემიის ახალი პროექტები და ინოვაციური ინიციატივები',
      shortTitle: 'ინოვაციური პროექტები',
      date: '24 მაისი, 2026',
      readTime: '4 წთ საკითხავი',
      presenter: {
        name: 'დავით გიორგაძე',
        role: 'ისტორიისა და საერთაშორისო ურთიერთობების კათედრა',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300'
      },
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1000',
      description: 'აკადემიის ახალი პროექტები აერთიანებს ინტერდისციპლინურ კვლევებსა და თანამედროვე სასწავლო მეთოდოლოგიას. მოსწავლეები მუშაობენ რეალურ სამეცნიერო და ჰუმანიტარულ ქეისებზე, რაც ავითარებს კრიტიკულ აზროვნებას, გუნდურ მუშაობასა და კვლევით უნარ-ჩვევებს.',
      bullets: [
        'საერთაშორისო აკადემიური გაცვლითი პროექტები პარტნიორ უნივერსიტეტებთან',
        'სტუდენტური დებატების ლიგა და დიპლომატიური სიმულაციები',
        'საზოგადოებრივი ინიციატივები და ადგილობრივი თემის მხარდაჭერა'
      ]
    },
    {
      id: 'news-2',
      category: 'stem',
      categoryLabel: 'ეკოლოგიური კვლევა & STEM',
      badgeNum: '02',
      title: 'ეკოლოგიური კვლევა & STEM ინოვაციები ბიოტექნოლოგიაში',
      shortTitle: 'ეკოლოგია & STEM',
      date: '18 მაისი, 2026',
      readTime: '5 წთ საკითხავი',
      presenter: {
        name: 'ანა კაპანაძე',
        role: 'ქიმიისა და ბიოტექნოლოგიის ლაბორატორიის ხელმძღვანელი',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300&h=300'
      },
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000',
      description: 'ეკოლოგიური კვლევის ლაბორატორია ატარებს კომპლექსურ სამუშაოებს ბუნებრივი ეკოსისტემების მდგრადობისა და თანამედროვე რობოტოტექნიკის გამოყენებით. მოსწავლეები ქმნიან ავტონომიურ სენსორულ სისტემებს ნიადაგისა და ჰაერის მონიტორინგისთვის.',
      bullets: [
        'ახალი მცენარეების კლასიფიკაცია და გენეტიკური დახასიათება',
        'ნიადაგის ჯანმრთელობისა და ტენიანობის სენსორული მონიტორინგი',
        'ეკოსისტემის დაცვის ინიციატივები და ურბანული ეკოლოგია',
        'ბიოლოგიური ნიმუშების სპექტრომეტრული ანალიზი'
      ]
    },
    {
      id: 'news-3',
      category: 'achievements',
      categoryLabel: 'აკადემიური მიღწევები',
      badgeNum: '03',
      title: 'აკადემიის მოსწავლეებმა საერთაშორისო ოლიმპიადაზე ოქროს მედლები მოიპოვეს',
      shortTitle: 'საერთაშორისო ოლიმპიადა',
      date: '10 მაისი, 2026',
      readTime: '3 წთ საკითხავი',
      presenter: {
        name: 'ელენე ბერიძე',
        role: 'მათემატიკის დეპარტამენტის ხელმძღვანელი',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300'
      },
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000',
      description: 'აკადემიის მათემატიკისა და კომპიუტერული მეცნიერებების გუნდმა ევროპის ახალგაზრდულ ოლიმპიადაზე 3 ოქროსა და 2 ვერცხლის მედალი მოიპოვა. ეს გამარჯვება აკადემიის მაღალი სტანდარტებისა და მასწავლებელთა თავდაუზოგავი შრომის შედეგია.',
      bullets: [
        'მათემატიკური ანალიზისა და ალგორითმების ტურში უმაღლესი ქულები',
        'მსოფლიოს 42 ქვეყნის წარმომადგენელთა შორის პირველი გუნდური ადგილი',
        'სრული სტიპენდიები წამყვანი უნივერსიტეტების მოსამზადებელ კურსებზე'
      ]
    },
    {
      id: 'news-4',
      category: 'life',
      categoryLabel: 'სასკოლო ცხოვრება',
      badgeNum: '04',
      title: 'საგაზაფხულო ხელოვნებისა და მუსიკის ფესტივალი აკადემიის კამპუსში',
      shortTitle: 'ხელოვნების ფესტივალი',
      date: '2 მაისი, 2026',
      readTime: '4 წთ საკითხავი',
      presenter: {
        name: 'ქეთევან დოლიძე',
        role: 'ხელოვნებისა და მუსიკალური განათლების კურატორი',
        image: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=300&h=300'
      },
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1000',
      description: 'ყოველწლიური საგაზაფხულო ფესტივალი აერთიანებს სახვითი ხელოვნების გამოფენას, კლასიკური მუსიკის ორკესტრის პერფორმანსსა და თეატრალურ დადგმებს. ღონისძიებაზე წარმოდგენილი იყო მოსწავლეთა 80-ზე მეტი ორიგინალური ნამუშევარი.',
      bullets: [
        'მოსწავლეთა საავტორო ნამუშევრების საქველმოქმედო აუქციონი',
        'სიმფონიური ორკესტრისა და გუნდის ერთობლივი კონცერტი',
        'ინტერაქციული ვორქშოფები მოწვეულ მხატვრებთან ერთად'
      ]
    },
    {
      id: 'news-5',
      category: 'stem',
      categoryLabel: 'ეკოლოგიური კვლევა & STEM',
      badgeNum: '05',
      title: 'რობოტოტექნიკისა და ხელოვნური ინტელექტის ჰაკათონი',
      shortTitle: 'AI და რობოტოტექნიკა',
      date: '25 აპრილი, 2026',
      readTime: '5 წთ საკითხავი',
      presenter: {
        name: 'ლუკა გიორგაძე',
        role: 'ინფორმატიკისა და AI კლუბის მენტორი',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300'
      },
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000',
      description: '48-საათიანი სასკოლო ჰაკათონის ფარგლებში მოსწავლეებმა შექმნეს ინოვაციური პროტოტიპები: ჭკვიანი ენერგოდამზოგავი სისტემები, ავტონომიური რობოტები და ხელოვნური ინტელექტის ასისტენტები განათლებისთვის.',
      bullets: [
        '12 გუნდის მიერ შექმნილი ფუნქციური აპარატურული პროტოტიპი',
        'სამრეწველო სენსორებისა და მიკროკონტროლერების ინტეგრაცია',
        'ინვესტორთა და IT ექსპერტთა ჟიურის მიერ გამარჯვებულთა დაჯილდოება'
      ]
    },
    {
      id: 'news-6',
      category: 'projects',
      categoryLabel: 'პროექტები & ინიციატივები',
      badgeNum: '06',
      title: 'ასტროფიზიკის ღია ობსერვატორია და კოსმოსური დაკვირვებები',
      shortTitle: 'კოსმოსური დაკვირვებები',
      date: '15 აპრილი, 2026',
      readTime: '3 წთ საკითხავი',
      presenter: {
        name: 'ალექსანდრე ჩხეიძე',
        role: 'ასტრონომიისა და ფიზიკის პედაგოგი',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300&h=300'
      },
      image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=1000',
      description: 'აკადემიის ახალი ციფრული ტელესკოპის მეშვეობით მოსწავლეებმა პლანეტარული ნისლეულებისა და მთვარის კრატერების მაღალი გარჩევადობის ფოტომასალა მოიპოვეს, რომელიც საერთაშორისო ასტრონომიულ ბაზაში განთავსდა.',
      bullets: [
        'ღამის ასტრონომიული დაკვირვებები და სპექტროსკოპია',
        'კოსმოსური მონაცემების ციფრული დამუშავება Python-ის გამოყენებით',
        'ღია ლექციები ასტროფიზიკისა და კოსმოლოგიის მიმართულებით'
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
          const formatted = data.map((item, idx) => ({
            id: `db-${item.id}`,
            category: item.category || 'projects',
            categoryLabel: item.category || 'სიახლეები',
            badgeNum: String(idx + 1).padStart(2, '0'),
            title: item.title,
            shortTitle: item.title.length > 32 ? `${item.title.substring(0, 32)}...` : item.title,
            date: item.published_at ? new Date(item.published_at).toLocaleDateString('ka-GE') : '2026',
            readTime: '3 წთ საკითხავი',
            presenter: {
              name: item.author_name || 'სოლომონ აკადემია',
              role: 'პედაგოგიური გუნდი',
              image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300'
            },
            image: item.image_url || defaultNews[idx % defaultNews.length].image,
            description: item.content || item.summary || '',
            bullets: item.key_points ? (Array.isArray(item.key_points) ? item.key_points : [item.key_points]) : []
          }));
          setDbNews(formatted);
        }
      } catch (err) {
        console.error('Error fetching news from Supabase:', err);
      }
    }
    loadNews();
  }, []);

  const allNewsList = dbNews.length > 0 ? [...dbNews, ...defaultNews] : defaultNews;

  // Filter categories
  const categories = [
    { id: 'all', label: 'ყველა სიახლე' },
    { id: 'projects', label: 'პროექტები & ინიციატივები' },
    { id: 'stem', label: 'ეკოლოგიური კვლევა & STEM' },
    { id: 'achievements', label: 'აკადემიური მიღწევები' },
    { id: 'life', label: 'სასკოლო ცხოვრება' }
  ];

  const filteredNews = selectedCategory === 'all'
    ? allNewsList
    : allNewsList.filter((item) => item.category === selectedCategory);

  // Initialize selected news if not set or if current selection is filtered out
  const activePost = filteredNews.find((item) => item.id === selectedNewsId) || filteredNews[0] || allNewsList[0];

  const handleSelectNews = (id) => {
    setSelectedNewsId(id);
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    const firstInCat = (catId === 'all' ? allNewsList : allNewsList.filter((item) => item.category === catId))[0];
    if (firstInCat) {
      setSelectedNewsId(firstInCat.id);
    }
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="news"
      style={{
        position: 'relative',
        background: '#f7f4ee',
        color: '#2a1a14',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxSizing: 'border-box',
        padding: 'clamp(32px, 5vh, 60px) 0',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '92%',
          maxWidth: '1280px',
          margin: '0 auto'
        }}
      >
        {/* Section Header: Title & Subtitle */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(18px, 2.5vh, 28px)' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#8b1528',
              fontSize: '0.84rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '6px'
            }}
          >
            <Sparkles size={14} color="#8b1528" />
            აკადემიური ცხოვრება & მიღწევები
          </span>
          <h2
            style={{
              fontFamily: "'Noto Serif Georgian', Georgia, serif",
              fontSize: 'clamp(2rem, 3.4vw, 2.8rem)',
              fontWeight: 600,
              color: '#201014',
              letterSpacing: '-0.01em',
              margin: '0 0 16px'
            }}
          >
            სიახლეები და აქტივობები
          </h2>

          {/* Category Filter Pills (Burgundy Active, Outlined Inactive) */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              maxWidth: '900px',
              margin: '0 auto'
            }}
          >
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '100px',
                    border: isActive
                      ? '1px solid #7a1324'
                      : '1px solid rgba(122, 19, 36, 0.22)',
                    background: isActive ? '#7a1324' : '#ffffff',
                    color: isActive ? '#ffffff' : '#4a2e2b',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: isActive
                      ? '0 4px 14px rgba(122, 19, 36, 0.25)'
                      : '0 2px 6px rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.22s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = '#7a1324';
                      e.currentTarget.style.color = '#7a1324';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = 'rgba(122, 19, 36, 0.22)';
                      e.currentTarget.style.color = '#4a2e2b';
                    }
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Card (Two-Part Split: Left Carousel Thumbnails, Right Detail Area) */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid rgba(122, 19, 36, 0.12)',
            borderRadius: '20px',
            boxShadow: '0 16px 45px rgba(60, 25, 20, 0.07)',
            padding: 'clamp(18px, 2.8vw, 32px)',
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 380px) 1fr',
            gap: 'clamp(20px, 3vw, 36px)',
            alignItems: 'stretch'
          }}
          className="news-split-card"
        >
          {/* LEFT: Horizontal / Scrollable Carousel of Thumbnails */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderRight: '1px solid rgba(0, 0, 0, 0.07)',
              paddingRight: 'clamp(14px, 2vw, 24px)'
            }}
          >
            {/* Header of Left Column with Arrows */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}
            >
              <span
                style={{
                  fontFamily: "'Noto Serif Georgian', Georgia, serif",
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: '#7a1324'
                }}
              >
                სტატიების სია ({filteredNews.length})
              </span>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => scrollCarousel('left')}
                  title="წინა"
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: '1px solid rgba(122, 19, 36, 0.25)',
                    background: '#ffffff',
                    color: '#7a1324',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#7a1324';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.color = '#7a1324';
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCarousel('right')}
                  title="შემდეგი"
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: '1px solid rgba(122, 19, 36, 0.25)',
                    background: '#ffffff',
                    color: '#7a1324',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#7a1324';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.color = '#7a1324';
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Horizontal Scroll-Snap Carousel Container */}
            <div
              ref={carouselRef}
              data-lenis-prevent="true"
              data-lenis-prevent-wheel="true"
              style={{
                display: 'flex',
                gap: '12px',
                overflowX: 'auto',
                padding: '6px 2px 14px',
                scrollSnapType: 'x mandatory',
                scrollbarWidth: 'thin',
                msOverflowStyle: 'auto',
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-x'
              }}
            >
              {filteredNews.map((item) => {
                const isSelected = activePost.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectNews(item.id)}
                    style={{
                      flex: '0 0 160px',
                      scrollSnapAlign: 'start',
                      cursor: 'pointer',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: isSelected ? '#fbf7f0' : '#ffffff',
                      border: isSelected
                        ? '2px solid #7a1324'
                        : '1px solid rgba(0, 0, 0, 0.1)',
                      boxShadow: isSelected
                        ? '0 6px 18px rgba(122, 19, 36, 0.2)'
                        : '0 2px 8px rgba(0, 0, 0, 0.04)',
                      opacity: isSelected ? 1 : 0.65,
                      transform: isSelected ? 'scale(1.02) translateY(-2px)' : 'scale(0.98)',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    {/* Thumbnail Image with Gold Number Badge */}
                    <div style={{ position: 'relative', width: '100%', height: '94px', overflow: 'hidden' }}>
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          top: '6px',
                          left: '6px',
                          background: isSelected ? '#7a1324' : 'rgba(28, 18, 14, 0.75)',
                          color: '#ffffff',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '1px 7px',
                          borderRadius: '6px',
                          backdropFilter: 'blur(4px)'
                        }}
                      >
                        {item.badgeNum}
                      </span>
                    </div>

                    {/* Thumbnail Title & Date */}
                    <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span
                        style={{
                          fontSize: '0.66rem',
                          color: '#8b1528',
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}
                      >
                        {item.categoryLabel}
                      </span>
                      <h4
                        style={{
                          fontFamily: "'Noto Serif Georgian', Georgia, serif",
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: '#201014',
                          lineHeight: 1.25,
                          margin: 0,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {item.title}
                      </h4>
                      <span style={{ fontSize: '0.64rem', color: '#88746c', marginTop: '2px' }}>
                        {item.date}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Category Tag Indicator */}
            <div
              style={{
                marginTop: '10px',
                padding: '8px 12px',
                background: '#fcfaf7',
                borderRadius: '8px',
                border: '1px solid rgba(122, 19, 36, 0.08)',
                fontSize: '0.76rem',
                color: '#6e564c',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Info size={14} color="#7a1324" />
              <span>დააწკაპუნეთ ბარათზე სრული დეტალების სანახავად</span>
            </div>
          </div>

          {/* RIGHT: Detail Area for the Currently Selected Post */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px'
            }}
          >
            {/* Top Row: Author/Teacher Info & Category Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                paddingBottom: '14px',
                borderBottom: '1px solid rgba(0, 0, 0, 0.07)'
              }}
            >
              {/* Author Photo and Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid #8b1528',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(122, 19, 36, 0.15)'
                  }}
                >
                  <img
                    src={activePost.presenter.image}
                    alt={activePost.presenter.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: "'Noto Serif Georgian', Georgia, serif",
                      fontSize: '0.94rem',
                      fontWeight: 600,
                      color: '#201014',
                      margin: 0
                    }}
                  >
                    {activePost.presenter.name}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.76rem', color: '#88746c' }}>
                    {activePost.presenter.role}
                  </p>
                </div>
              </div>

              {/* Date & Category Tag */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.78rem',
                    color: '#6e564c'
                  }}
                >
                  <Calendar size={13} color="#8b1528" />
                  {activePost.date}
                </span>
                <span
                  style={{
                    background: 'rgba(122, 19, 36, 0.08)',
                    color: '#7a1324',
                    border: '1px solid rgba(122, 19, 36, 0.2)',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    padding: '2px 10px',
                    borderRadius: '100px'
                  }}
                >
                  {activePost.categoryLabel}
                </span>
              </div>
            </div>

            {/* Middle: Feature Image & Story Headline */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(140px, 220px) 1fr',
                gap: '18px',
                alignItems: 'start'
              }}
              className="news-detail-content-grid"
            >
              {/* Feature Image */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '160px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.06)'
                }}
              >
                <img
                  src={activePost.image}
                  alt={activePost.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Title & Description */}
              <div>
                <h3
                  style={{
                    fontFamily: "'Noto Serif Georgian', Georgia, serif",
                    fontSize: 'clamp(1.15rem, 1.7vw, 1.45rem)',
                    fontWeight: 600,
                    color: '#201014',
                    lineHeight: 1.3,
                    margin: '0 0 8px'
                  }}
                >
                  {activePost.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Noto Sans Georgian', sans-serif",
                    fontSize: '0.86rem',
                    lineHeight: 1.65,
                    color: '#4e3b33',
                    margin: 0
                  }}
                >
                  {activePost.description}
                </p>
              </div>
            </div>

            {/* Bullet Points of Highlights (if available) */}
            {activePost.bullets && activePost.bullets.length > 0 && (
              <div
                style={{
                  background: '#fcfaf7',
                  border: '1px solid rgba(122, 19, 36, 0.1)',
                  borderRadius: '12px',
                  padding: '12px 16px'
                }}
              >
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#7a1324',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    display: 'block',
                    marginBottom: '6px'
                  }}
                >
                  ძირითადი მიმართულებები და შედეგები:
                </span>
                <ul
                  style={{
                    listStyleType: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px'
                  }}
                >
                  {activePost.bullets.map((point, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        fontSize: '0.82rem',
                        lineHeight: 1.45,
                        color: '#3e2a22'
                      }}
                    >
                      <CheckCircle2 size={14} color="#7a1324" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bottom Actions: Full Article Button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingTop: '6px' }}>
              <button
                type="button"
                onClick={() => setSelectedArticle(activePost)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 24px',
                  borderRadius: '8px',
                  background: 'linear-gradient(180deg, #8b1528 0%, #700f1f 100%)',
                  color: '#ffffff',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(122, 19, 36, 0.25)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, #a31930 0%, #821224 100%)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, #8b1528 0%, #700f1f 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>სრულად ნახვა</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Article Detail Reading Modal */}
      {selectedArticle && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedArticle(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(20, 12, 14, 0.75)',
            backdropFilter: 'blur(8px)',
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
              background: '#fdfbf7',
              border: '1.5px solid rgba(122, 19, 36, 0.25)',
              borderRadius: '20px',
              maxWidth: '720px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 'clamp(24px, 4vw, 36px)',
              boxShadow: '0 24px 70px rgba(40, 15, 20, 0.3)',
              position: 'relative',
              color: '#2b1a14'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedArticle(null)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'rgba(122, 19, 36, 0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7a1324',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#7a1324';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(122, 19, 36, 0.08)';
                e.currentTarget.style.color = '#7a1324';
              }}
            >
              <X size={18} />
            </button>

            {/* Modal Image */}
            <div
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                height: '240px',
                marginBottom: '20px',
                border: '1px solid rgba(122, 19, 36, 0.15)',
                boxShadow: '0 6px 18px rgba(0, 0, 0, 0.06)'
              }}
            >
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Modal Meta Tag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span
                style={{
                  background: '#7a1324',
                  color: '#ffffff',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  padding: '2px 10px',
                  borderRadius: '100px'
                }}
              >
                {selectedArticle.categoryLabel}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#88746c', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} color="#7a1324" />
                {selectedArticle.date}
              </span>
            </div>

            {/* Modal Title */}
            <h2
              style={{
                fontFamily: "'Noto Serif Georgian', Georgia, serif",
                fontSize: 'clamp(1.4rem, 2.2vw, 1.8rem)',
                color: '#201014',
                lineHeight: 1.3,
                marginBottom: '14px'
              }}
            >
              {selectedArticle.title}
            </h2>

            {/* Author Info Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: '#f7f2ea',
                padding: '10px 14px',
                borderRadius: '10px',
                marginBottom: '18px'
              }}
            >
              <img
                src={selectedArticle.presenter.image}
                alt={selectedArticle.presenter.name}
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#201014', display: 'block' }}>
                  {selectedArticle.presenter.name}
                </span>
                <span style={{ fontSize: '0.74rem', color: '#7a1324' }}>
                  {selectedArticle.presenter.role}
                </span>
              </div>
            </div>

            {/* Modal Full Description */}
            <p
              style={{
                fontFamily: "'Noto Sans Georgian', sans-serif",
                fontSize: '0.94rem',
                lineHeight: 1.8,
                color: '#3e2a22',
                marginBottom: '18px'
              }}
            >
              {selectedArticle.description}
            </p>

            {/* Modal Bullets */}
            {selectedArticle.bullets && selectedArticle.bullets.length > 0 && (
              <div style={{ background: '#f8f4ed', borderRadius: '12px', padding: '16px 20px' }}>
                <h4 style={{ fontFamily: "'Noto Serif Georgian', serif", fontSize: '0.94rem', color: '#7a1324', margin: '0 0 10px' }}>
                  დეტალური პუნქტები და შედეგები:
                </h4>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: '#3e2a22', lineHeight: 1.6 }}>
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
