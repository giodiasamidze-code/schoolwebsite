import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Share2, Bookmark, ExternalLink } from 'lucide-react';

export default function NewsSection() {
  const [activeCategory, setActiveCategory] = useState('ყველა');
  const [detailedNewsId, setDetailedNewsId] = useState(null);

  const categories = ['ყველა', 'STEM', 'კვლევა', 'ღონისძიებები'];

  const newsItems = [
    {
      id: 1,
      title: 'აკადემიის ინოვაციური პროექტები',
      category: 'STEM',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
      description: 'სოლომონ აკადემიის მოსწავლეებმა წარმოადგინეს რობოტოტექნიკისა და ხელოვნური ინტელექტის ინოვაციური პროტოტიპები.',
      details: 'პროექტის ფარგლებში მოსწავლეები ქმნიან ავტონომიურ რობოტულ სისტემებს, შეისწავლიან მიკროკონტროლერების დაპროგრამებას და ავითარებენ საინჟინრო უნარებს.',
      tags: ['კვლევა', 'ტექნოლოგია', 'ინოვაცია']
    },
    {
      id: 2,
      title: 'ეკოლოგიური კვლევა & STEM',
      category: 'კვლევა',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
      description: 'ბიოლოგიისა და ეკოლოგიის საველე ლაბორატორიის მიღწევები და პრაქტიკული ექსპედიციები.',
      details: 'სოლომონ აკადემიის ეკო-კლუბის მიერ ჩატარებული გარემოსდაცვითი მონიტორინგი და ბიომრავალფეროვნების ანალიზი.',
      tags: ['ეკოლოგია', 'ბიოლოგია', 'კვლევა']
    },
    {
      id: 3,
      title: 'საერთაშორისო ოლიმპიადა',
      category: 'ღონისძიებები',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
      description: 'აკადემიის გუნდის მომზადება საერთაშორისო სამეცნიერო ფორუმებისა და ოლიმპიადებისთვის.',
      details: 'მოსწავლეთა ინტენსიური ვორქშოფები და მენტორობა წამყვანი უცხოელი პროფესორების მონაწილეობით.',
      tags: ['ოლიმპიადა', 'STEM', 'გლობალური']
    },
    {
      id: 4,
      title: 'საერთაშორისო ოლიმპიადის ტრიუმფი',
      category: 'ღონისძიებები',
      image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80',
      description: 'ოქროსა და ვერცხლის მედლები მათემატიკისა და ფიზიკის ევროპულ ოლიმპიადაზე.',
      details: 'აკადემიის წარმატებული დელეგაციის შედეგები და საზეიმო მიღება აკადემიის ცენტრალურ დარბაზში.',
      tags: ['გამარჯვება', 'მედლები', 'სიამაყე']
    },
    {
      id: 5,
      title: 'ასტროფიზიკის ობსერვატორია & AI',
      category: 'კვლევა',
      image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
      description: 'კოსმოსური მონაცემების დამუშავება ნეირონული ქსელებით და ღამის დაკვირვებები.',
      details: 'ტელესკოპური დაკვირვებების ციფრული დამუშავება და ასტრონომიული აღმოჩენების მოდელირება.',
      tags: ['ასტროფიზიკა', 'AI', 'კოსმოსი']
    }
  ];

  const filteredNews = newsItems.filter(
    (item) => activeCategory === 'ყველა' || item.category === activeCategory
  );

  const activeNewsDetail = newsItems.find((n) => n.id === detailedNewsId);

  const scrollToSpaces = () => {
    const el = document.getElementById('spaces-hub');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // If in Single News View mode (06 / 18)
  if (detailedNewsId && activeNewsDetail) {
    return (
      <section
        id="news-detail"
        style={{
          position: 'relative',
          minHeight: '100vh',
          backgroundImage: `linear-gradient(180deg, rgba(12, 6, 8, 0.45) 0%, rgba(12, 6, 8, 0.65) 100%), url(/assets/palace-interior.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '100px 40px 30px',
          color: '#ffffff',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: '1180px', width: '100%', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {/* Main Card (Photo 2 - 06/18) */}
          <div
            style={{
              background: 'rgba(235, 230, 225, 0.92)',
              backdropFilter: 'blur(25px)',
              WebkitBackdropFilter: 'blur(25px)',
              borderRadius: '24px',
              padding: '36px',
              color: '#1a1215',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.65)'
            }}
          >
            {/* Breadcrumb */}
            <div style={{ fontSize: '0.9rem', color: '#6b5c5e', fontWeight: 600, marginBottom: '20px' }}>
              სიახლეები / {activeNewsDetail.category}
            </div>

            {/* Content Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '36px', alignItems: 'center' }}>
              {/* Left Image */}
              <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '360px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
                <img
                  src={activeNewsDetail.image}
                  alt={activeNewsDetail.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    background: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    fontSize: '0.72rem',
                    padding: '3px 8px',
                    borderRadius: '4px'
                  }}
                >
                  საილუსტრაციო გამოსახულება
                </span>
              </div>

              {/* Right Details */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span
                      style={{
                        background: 'rgba(212, 175, 55, 0.25)',
                        color: '#8b6914',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        padding: '4px 12px',
                        borderRadius: '6px'
                      }}
                    >
                      {activeNewsDetail.category}
                    </span>

                    <div style={{ display: 'flex', gap: '10px', color: '#6b5c5e' }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
                        <Share2 size={18} />
                      </button>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
                        <Bookmark size={18} />
                      </button>
                    </div>
                  </div>

                  <h2
                    style={{
                      fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                      fontSize: 'clamp(1.8rem, 2.5vw, 2.3rem)',
                      fontWeight: 700,
                      color: '#1a1215',
                      lineHeight: 1.2,
                      marginBottom: '16px'
                    }}
                  >
                    {activeNewsDetail.title}
                  </h2>

                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#332225', marginBottom: '6px' }}>
                      პროექტის შესახებ
                    </h4>
                    <p style={{ fontSize: '0.92rem', color: '#554245', lineHeight: 1.5 }}>
                      {activeNewsDetail.details}
                    </p>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#332225', marginBottom: '8px' }}>
                      მიმართულებები
                    </h4>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {activeNewsDetail.tags.map((tag, i) => (
                        <span
                          key={i}
                          style={{
                            background: '#e4dcd6',
                            color: '#443236',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            padding: '4px 12px',
                            borderRadius: '20px'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Back to All News Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                  <button
                    onClick={() => setDetailedNewsId(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#1a1215',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#8b6914')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#1a1215')}
                  >
                    <span>ყველა სიახლე</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar matching Photo 2 */}
          <div
            style={{
              marginTop: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 24px',
              background: 'rgba(235, 230, 225, 0.85)',
              backdropFilter: 'blur(16px)',
              borderRadius: '16px',
              color: '#1a1215',
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            <div>მსგავსი სიახლეები</div>
            <div style={{ display: 'flex', gap: '24px', fontSize: '0.85rem', color: '#554245' }}>
              <span
                onClick={() => setDetailedNewsId(2)}
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                ეკოლოგიური კვლევა & STEM
              </span>
              <span
                onClick={() => setDetailedNewsId(5)}
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                ასტროფიზიკის ობსერვატორია & AI
              </span>
            </div>
          </div>
        </div>

        {/* Counter bottom left */}
        <div style={{ maxWidth: '1180px', width: '100%', margin: '14px auto 0' }}>
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '20px',
              padding: '4px 14px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#d4af37',
              width: 'fit-content'
            }}
          >
            06 / 18
          </div>
        </div>
      </section>
    );
  }

  // Mode 1: Chronicle Listing View (Photo 7 - 01 / 02)
  return (
    <section
      id="news"
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundImage: `linear-gradient(180deg, rgba(12, 6, 8, 0.45) 0%, rgba(12, 6, 8, 0.6) 100%), url(/assets/palace-interior.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '110px 40px 30px',
        color: '#ffffff',
        overflow: 'hidden'
      }}
    >
      <div style={{ maxWidth: '1240px', width: '100%', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Title & Filters */}
        <div style={{ marginBottom: '24px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
              fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '6px'
            }}
          >
            სკოლის სიახლეები
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '1.05rem', marginBottom: '18px' }}>
            აქტივობების ქრონიკა
          </p>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: activeCategory === cat ? 'rgba(212, 175, 55, 0.25)' : 'rgba(30, 20, 24, 0.65)',
                  border: `1px solid ${activeCategory === cat ? '#d4af37' : 'rgba(212, 175, 55, 0.2)'}`,
                  color: activeCategory === cat ? '#d4af37' : 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '10px',
                  padding: '8px 22px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Chronicle Grid Layout: Left Featured + Right 2x2 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 1fr',
            gap: '24px',
            alignItems: 'stretch'
          }}
        >
          {/* Left Big Featured Card (Photo 7) */}
          <div
            onClick={() => setDetailedNewsId(1)}
            style={{
              background: 'rgba(20, 12, 15, 0.65)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '20px',
              overflow: 'hidden',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.5)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#d4af37';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ height: '320px', overflow: 'hidden', position: 'relative' }}>
              <img
                src={newsItems[0].image}
                alt={newsItems[0].title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
              <h3
                style={{
                  fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  marginBottom: '16px'
                }}
              >
                {newsItems[0].title}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    background: 'rgba(212, 175, 55, 0.2)',
                    color: '#d4af37',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}
                >
                  {newsItems[0].category}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.88rem' }}>
                  <span>სრულად ნახვა</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </div>

          {/* Right 2x2 Grid of News Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px' }}>
            {newsItems.slice(1, 5).map((item) => (
              <div
                key={item.id}
                onClick={() => setDetailedNewsId(item.id)}
                style={{
                  background: 'rgba(20, 12, 15, 0.65)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#d4af37';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.25)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ height: '140px', overflow: 'hidden' }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                  <h4
                    style={{
                      fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                      fontSize: '0.98rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      marginBottom: '10px',
                      lineHeight: 1.3
                    }}
                  >
                    {item.title}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      style={{
                        background: 'rgba(212, 175, 55, 0.15)',
                        color: '#d4af37',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 600
                      }}
                    >
                      {item.category}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.78rem' }}>
                      <span>სრულად ნახვა</span>
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar matching Photo 7 (01 / 02) */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1240px',
          width: '100%',
          margin: '30px auto 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          background: 'rgba(20, 12, 14, 0.65)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '14px'
        }}
      >
        <button
          onClick={scrollToSpaces}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.85)',
            fontSize: '0.9rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: '8px',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#d4af37')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)')}
        >
          <ArrowLeft size={16} />
          <span>ეზოში დაბრუნება</span>
        </button>

        {/* Pagination 01 / 02 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button style={{ background: 'none', border: 'none', color: '#d4af37', cursor: 'pointer' }}>
            <ArrowLeft size={16} />
          </button>
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.45)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '20px',
              padding: '4px 14px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#d4af37',
              letterSpacing: '0.08em'
            }}
          >
            01 / 02
          </div>
          <button style={{ background: 'none', border: 'none', color: '#d4af37', cursor: 'pointer' }}>
            <ArrowRight size={16} />
          </button>
        </div>

        <div style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.85rem' }}>
          ვიზუალური კონცეფცია
        </div>
      </div>
    </section>
  );
}
