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
    <section className="news-section" id="news" style={{ padding: '80px 0' }}>
      <div className="container">
        <span className="section-eyebrow">სიახლეები</span>
        <h2 className="section-title">სკოლის აკადემიური სიახლეები & განცხადებები</h2>
        <p className="section-desc">
          გაეცანით სოლომონ აკადემიის უახლეს ამბებს, მიღწევებსა და მნიშვნელოვან ღონისძიებებს.
        </p>

        <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
          {displayNews.map((item) => (
            <div
              key={item.id}
              className="card fade-in"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 16px 36px rgba(0,0,0,0.35)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                backdropFilter: 'blur(12px)'
              }}
              onClick={() => setSelectedArticle(item)}
            >
              {item.image_url && (
                <div style={{ height: '200px', overflow: 'hidden', background: '#000' }}>
                  <img
                    src={item.image_url}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}

              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <span style={{ fontSize: '0.82rem', color: '#ff8598', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontWeight: 600 }}>
                  <Calendar size={14} />
                  {new Date(item.published_at).toLocaleDateString('ka-GE', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>

                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#ffffff', marginBottom: '12px', lineHeight: 1.4, fontWeight: 700 }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, flexGrow: 1, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.content}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-secondary)', fontWeight: 700, fontSize: '0.9rem' }}>
                  <span>სრულად წაკითხვა</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="modal-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px', background: '#1c0a0d', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '20px' }}>
            <button className="modal-close" onClick={() => setSelectedArticle(null)}>
              <X size={20} />
            </button>

            {selectedArticle.image_url && (
              <img
                src={selectedArticle.image_url}
                alt={selectedArticle.title}
                style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '16px 16px 0 0', marginBottom: '20px' }}
              />
            )}

            <div style={{ padding: '0 8px 16px' }}>
              <span style={{ fontSize: '0.85rem', color: '#ff8598', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Calendar size={14} />
                {new Date(selectedArticle.published_at).toLocaleDateString('ka-GE', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>

              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#ffffff', marginBottom: '16px', lineHeight: 1.3 }}>
                {selectedArticle.title}
              </h2>

              <div style={{ fontSize: '1rem', color: 'var(--text-dark)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {selectedArticle.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
