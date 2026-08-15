import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function NewsSection() {
  const [news, setNews] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    async function loadNews() {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false });

        if (!error && data) {
          setNews(data);
        }
      } catch (err) {
        console.error('Error fetching news:', err);
      }
    }
    loadNews();
  }, []);

  // Default fallback news items if database has no items yet
  const displayNews = news.length > 0 ? news : [
    {
      id: 'default-1',
      title: 'სოლომონ აკადემიაში თანამედროვე STEM ლაბორატორია გაიხსნა',
      content: 'მოხარულები ვართ გაუწყოთ, რომ სკოლაში ფუნქციონირება დაიწყო უახლესი ტექნოლოგიებით აღჭურვილმა STEM ლაბორატორიამ. მოსწავლეებს ექნებათ შესაძლებლობა ჩაატარონ ფიზიკის, ქიმიისა და რობოტოტექნიკის ექსპერიმენტები.',
      published_at: new Date().toISOString(),
      image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'default-2',
      title: 'ეროვნულ სასწავლო ოლიმპიადაში სკოლის მოსწავლეების ბრწყინვალე გამარჯვება',
      content: 'ჩვენმა მოსწავლეებმა მათემატიკასა და ინგლისურ ენაში ეროვნულ ოლიმპიადაზე საპრიზო ადგილები დაიკავეს. ვულოცავთ მოსწავლეებსა და მათ პედაგოგებს ამ დიდ წარმატებას!',
      published_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <section className="news-section" id="news" style={{ padding: '90px 0 60px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Luxury Background Watermark */}
      <div className="section-watermark">
        DISPATCHES
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2, width: '92%', maxWidth: '1360px', margin: '0 auto' }}>
        <span className="section-eyebrow">სიახლეები</span>
        <h2 className="section-title">სკოლის აკადემიური სიახლეები & განცხადებები</h2>
        <p className="section-desc">
          გაეცანით სოლომონ აკადემიის უახლეს ამბებს, მიღწევებსა და მნიშვნელოვან ღონისძიებებს.
        </p>

        <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
          {displayNews.map((item) => (
            <div
              key={item.id}
              className="card spotlight-card fade-in"
              style={{
                background: 'linear-gradient(145deg, rgba(32, 11, 15, 0.9), rgba(18, 6, 8, 0.98))',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                cursor: 'pointer',
                backdropFilter: 'blur(16px)'
              }}
              onClick={() => setSelectedArticle(item)}
            >
              {item.image_url && (
                <div style={{ height: '220px', overflow: 'hidden', background: '#000', position: 'relative', zIndex: 2 }}>
                  <img
                    src={item.image_url}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
              )}

              <div style={{ padding: '26px', display: 'flex', flexDirection: 'column', flexGrow: 1, position: 'relative', zIndex: 2 }}>
                <span style={{ fontSize: '0.82rem', color: '#ff8598', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontWeight: 600 }}>
                  <Calendar size={14} />
                  {new Date(item.published_at).toLocaleDateString('ka-GE', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>

                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#ffffff', marginBottom: '12px', lineHeight: 1.4, fontWeight: 700 }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: '0.92rem', color: 'rgba(255, 255, 255, 0.72)', lineHeight: 1.65, flexGrow: 1, marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.content}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-secondary, #d4af37)', fontWeight: 700, fontSize: '0.9rem', marginTop: 'auto' }}>
                  <span>სრულად წაკითხვა</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Luxury Gold Divider */}
      <div className="luxury-divider" style={{ marginTop: '50px' }}>
        <div className="luxury-divider-line" />
        <span className="luxury-divider-star">✦</span>
        <div className="luxury-divider-line" />
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="modal-overlay" onClick={() => setSelectedArticle(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(24, 9, 11, 0.98)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '24px',
              maxWidth: '720px',
              padding: '36px',
              boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
              backdropFilter: 'blur(24px)'
            }}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedArticle(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            {selectedArticle.image_url && (
              <div style={{ borderRadius: '16px', overflow: 'hidden', maxHeight: '320px', marginBottom: '24px', background: '#000' }}>
                <img
                  src={selectedArticle.image_url}
                  alt={selectedArticle.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}

            <span style={{ fontSize: '0.85rem', color: '#ff8598', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', fontWeight: 600 }}>
              <Calendar size={14} />
              {new Date(selectedArticle.published_at).toLocaleDateString('ka-GE', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#ffffff', marginBottom: '16px', lineHeight: 1.3, fontWeight: 700 }}>
              {selectedArticle.title}
            </h2>

            <div style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {selectedArticle.content}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
