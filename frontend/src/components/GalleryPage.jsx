import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, ImagePlus, ChevronLeft, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

/*
  SUPABASE SETUP (run once in SQL editor):

  CREATE TABLE gallery_photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT,
    category TEXT NOT NULL DEFAULT 'სხვა',
    image_url TEXT NOT NULL,
    uploaded_by UUID REFERENCES profiles(id),
    uploader_name TEXT,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Anyone can view approved photos" ON gallery_photos
    FOR SELECT USING (is_approved = true);
  CREATE POLICY "Teachers can insert" ON gallery_photos
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  CREATE POLICY "Teachers can delete own" ON gallery_photos
    FOR DELETE USING (uploaded_by = auth.uid());

  Also create a Supabase Storage bucket named "gallery" with public access.
*/

const CATEGORIES = [
  { id: 'all',     label: 'ყველა' },
  { id: 'class',   label: 'კლასსაათები' },
  { id: 'campus',  label: 'სკოლის გარემო' },
  { id: 'sport',   label: 'სპორტი' },
  { id: 'event',   label: 'ღონისძიებები' },
];

const CATEGORY_OPTIONS = CATEGORIES.filter(c => c.id !== 'all');

// ─── Placeholder photos shown when DB is empty ─────────────────────────────
const PLACEHOLDERS = [
  { id: 'p1', title: 'STEM ლაბორატორია', category: 'class',  image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800', uploader_name: 'სოლომონ აკადემია', created_at: new Date().toISOString() },
  { id: 'p2', title: 'სკოლის ეზო',       category: 'campus', image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800', uploader_name: 'სოლომონ აკადემია', created_at: new Date().toISOString() },
  { id: 'p3', title: 'მათემატიკის გაკვეთილი', category: 'class', image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800', uploader_name: 'სოლომონ აკადემია', created_at: new Date().toISOString() },
  { id: 'p4', title: 'სპორტული ვარჯიში', category: 'sport',  image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800', uploader_name: 'სოლომონ აკადემია', created_at: new Date().toISOString() },
  { id: 'p5', title: 'ბიბლიოთეკა',       category: 'campus', image_url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800', uploader_name: 'სოლომონ აკადემია', created_at: new Date().toISOString() },
  { id: 'p6', title: 'კულტურული ღონისძიება', category: 'event', image_url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800', uploader_name: 'სოლომონ აკადემია', created_at: new Date().toISOString() },
  { id: 'p7', title: 'კომპიუტერული კლასი', category: 'class', image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800', uploader_name: 'სოლომონ აკადემია', created_at: new Date().toISOString() },
  { id: 'p8', title: 'სასკოლო ეზო',      category: 'campus', image_url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800', uploader_name: 'სოლომონ აკადემია', created_at: new Date().toISOString() },
];

export default function GalleryPage() {
  const { user, role } = useAuth();
  const [photos, setPhotos]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeCategory, setCategory] = useState('all');
  const [lightbox, setLightbox]       = useState(null); // index in filtered list
  const [showUpload, setShowUpload]   = useState(false);
  const fileRef = useRef(null);

  // Upload state
  const [uploadForm, setUploadForm]   = useState({ title: '', category: 'class' });
  const [uploadFile, setUploadFile]   = useState(null);
  const [uploading, setUploading]     = useState(false);
  const [uploadDone, setUploadDone]   = useState(false);
  const [uploadError, setUploadError] = useState('');

  // ── Load photos ─────────────────────────────────────────────────────────
  async function loadPhotos() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('gallery_photos')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      if (!error && data) {
        setPhotos(data.length > 0 ? data : PLACEHOLDERS);
      } else {
        setPhotos(PLACEHOLDERS);
      }
    } catch {
      setPhotos(PLACEHOLDERS);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadPhotos(); }, []);

  // Keyboard nav for lightbox
  useEffect(() => {
    const handler = (e) => {
      if (lightbox === null) return;
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox(i => Math.min(i + 1, filtered.length - 1));
      if (e.key === 'ArrowLeft')  setLightbox(i => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  // ── Filtered list ────────────────────────────────────────────────────────
  const filtered = activeCategory === 'all'
    ? photos
    : photos.filter(p => p.category === activeCategory);

  // ── Upload handler ───────────────────────────────────────────────────────
  async function handleUpload(e) {
    e.preventDefault();
    if (!uploadFile) { setUploadError('გთხოვთ ფოტო აირჩიოთ'); return; }
    if (!uploadForm.title.trim()) { setUploadError('გთხოვთ სათაური შეიყვანოთ'); return; }
    setUploading(true);
    setUploadError('');
    try {
      // 1. Upload to storage
      const ext  = uploadFile.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: storageErr } = await supabase.storage
        .from('gallery')
        .upload(path, uploadFile, { contentType: uploadFile.type });
      if (storageErr) throw storageErr;

      // 2. Get public URL
      const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(path);

      // 3. Insert row
      const { error: dbErr } = await supabase.from('gallery_photos').insert({
        title:         uploadForm.title.trim(),
        category:      uploadForm.category,
        image_url:     urlData.publicUrl,
        uploaded_by:   user?.id || null,
        uploader_name: user?.name || user?.email || 'მასწავლებელი',
        is_approved:   true,
      });
      if (dbErr) throw dbErr;

      setUploadDone(true);
      setTimeout(() => {
        setShowUpload(false);
        setUploadDone(false);
        setUploadForm({ title: '', category: 'class' });
        setUploadFile(null);
        loadPhotos();
      }, 1500);
    } catch (err) {
      setUploadError('შეცდომა ატვირთვისას. სცადეთ ახლიდან.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────
  const isTeacherOrAdmin = role === 'teacher' || role === 'admin';

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px', paddingBottom: '80px' }}>
      
      {/* ── Page Header ── */}
      <div style={{
        width: '90%', maxWidth: '1200px', margin: '0 auto',
        paddingTop: '48px', marginBottom: '40px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>
              სოლომონ აკადემია
            </p>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>
              გალერეა
            </h1>
            <p style={{ marginTop: '10px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.45)' }}>
              სკოლის ცხოვრება — კლასები, ეზო, ღონისძიებები
            </p>
          </div>
          {isTeacherOrAdmin && (
            <button
              onClick={() => { setShowUpload(true); setUploadError(''); setUploadDone(false); }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '11px 22px',
                background: '#c41e3a', color: '#fff',
                border: 'none', borderRadius: '10px',
                fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#dc2445'}
              onMouseLeave={e => e.currentTarget.style.background = '#c41e3a'}
            >
              <ImagePlus size={17} /> ფოტოს ატვირთვა
            </button>
          )}
        </div>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '32px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              style={{
                padding: '7px 18px',
                borderRadius: '100px',
                border: '1px solid',
                borderColor: activeCategory === cat.id ? '#c41e3a' : 'rgba(255,255,255,0.1)',
                background: activeCategory === cat.id ? 'rgba(196,30,58,0.12)' : 'transparent',
                color: activeCategory === cat.id ? '#fff' : 'rgba(255,255,255,0.5)',
                fontSize: '0.84rem', fontWeight: 500, cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Photo Grid ── */}
      <div style={{ width: '90%', maxWidth: '1200px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.3)' }}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '12px', fontSize: '0.9rem' }}>ფოტოები იტვირთება...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.3)' }}>
            <p style={{ fontSize: '1rem' }}>ამ კატეგორიაში ფოტოები არ არის</p>
          </div>
        ) : (
          <div style={{
            columns: 'auto 280px',
            columnGap: '14px',
            gap: '14px'
          }}>
            {filtered.map((photo, idx) => (
              <div
                key={photo.id}
                onClick={() => setLightbox(idx)}
                style={{
                  breakInside: 'avoid',
                  marginBottom: '14px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'block',
                  border: '1px solid rgba(255,255,255,0.06)',
                  transition: 'transform 0.22s, border-color 0.22s'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(196,30,58,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
              >
                <img
                  src={photo.image_url}
                  alt={photo.title || ''}
                  style={{ width: '100%', display: 'block', objectFit: 'cover' }}
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(12,6,8,0.85) 0%, transparent 60%)',
                  opacity: 0, transition: 'opacity 0.22s',
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '14px'
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                >
                  {photo.title && (
                    <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.88rem', margin: 0 }}>{photo.title}</p>
                  )}
                  {photo.uploader_name && (
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', margin: '3px 0 0' }}>{photo.uploader_name}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightbox !== null && filtered[lightbox] && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
          }}
        >
          {/* Prev */}
          {lightbox > 0 && (
            <button onClick={e => { e.stopPropagation(); setLightbox(i => i - 1); }}
              style={{ position: 'absolute', left: '16px', background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
              <ChevronLeft size={22} />
            </button>
          )}
          {/* Next */}
          {lightbox < filtered.length - 1 && (
            <button onClick={e => { e.stopPropagation(); setLightbox(i => i + 1); }}
              style={{ position: 'absolute', right: '16px', background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
              <ChevronRight size={22} />
            </button>
          )}
          {/* Image */}
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '90vh', textAlign: 'center', position: 'relative' }}>
            <img
              src={filtered[lightbox].image_url}
              alt={filtered[lightbox].title || ''}
              style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '14px', objectFit: 'contain', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}
            />
            {filtered[lightbox].title && (
              <p style={{ color: '#fff', fontWeight: 600, marginTop: '14px', fontSize: '1.05rem', letterSpacing: '-0.01em' }}>
                {filtered[lightbox].title}
              </p>
            )}
            {filtered[lightbox].uploader_name && (
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', marginTop: '4px' }}>
                ატვირთა: {filtered[lightbox].uploader_name}
              </p>
            )}
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', marginTop: '6px' }}>
              {lightbox + 1} / {filtered.length}
            </p>
          </div>
        </div>
      )}

      {/* ── Upload Modal ── */}
      {showUpload && (
        <div
          onClick={() => setShowUpload(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#14070a',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '20px',
              padding: '32px',
              width: '100%',
              maxWidth: '480px',
              position: 'relative',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)'
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowUpload(false);
              }}
              aria-label="დახურვა"
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#c41e3a';
                e.currentTarget.style.borderColor = '#c41e3a';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <X size={18} strokeWidth={2} />
            </button>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
              ფოტოს ატვირთვა
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginBottom: '24px' }}>
              კლასის ან სკოლის გარემოს ფოტო
            </p>

            {uploadDone ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#4ade80', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={40} />
                <p style={{ fontWeight: 600 }}>ფოტო წარმატებით აიტვირთა!</p>
              </div>
            ) : (
              <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Title */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
                    სათაური
                  </label>
                  <input
                    type="text" required
                    placeholder="მაგ. STEM ლაბორატორია"
                    value={uploadForm.title}
                    onChange={e => setUploadForm(p => ({ ...p, title: e.target.value }))}
                    style={{
                      width: '100%', padding: '10px 14px',
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px', color: '#fff', fontSize: '0.92rem', outline: 'none',
                      fontFamily: 'var(--font-sans)', boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Category */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
                    კატეგორია
                  </label>
                  <select
                    value={uploadForm.category}
                    onChange={e => setUploadForm(p => ({ ...p, category: e.target.value }))}
                    style={{
                      width: '100%', padding: '10px 14px',
                      background: '#1a0a0d', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px', color: '#fff', fontSize: '0.92rem', outline: 'none',
                      fontFamily: 'var(--font-sans)', boxSizing: 'border-box', cursor: 'pointer'
                    }}
                  >
                    {CATEGORY_OPTIONS.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* File picker */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
                    ფოტო (მაქს. 10MB)
                  </label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    style={{
                      padding: '24px', border: '1px dashed rgba(255,255,255,0.15)',
                      borderRadius: '10px', textAlign: 'center', cursor: 'pointer',
                      transition: 'border-color 0.2s',
                      background: uploadFile ? 'rgba(196,30,58,0.06)' : 'rgba(255,255,255,0.02)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(196,30,58,0.4)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
                  >
                    {uploadFile ? (
                      <p style={{ color: '#fff', fontSize: '0.88rem', margin: 0 }}>✓ {uploadFile.name}</p>
                    ) : (
                      <>
                        <Upload size={22} color="rgba(255,255,255,0.3)" />
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', margin: '8px 0 0' }}>
                          დააჭირეთ ფოტოს ასარჩევად
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f && f.size > 10 * 1024 * 1024) { setUploadError('ფოტო 10MB-ზე მეტია'); return; }
                      setUploadFile(f || null);
                      setUploadError('');
                    }}
                  />
                </div>

                {uploadError && (
                  <p style={{ fontSize: '0.84rem', color: '#f87171', margin: 0 }}>{uploadError}</p>
                )}

                <button
                  type="submit" disabled={uploading}
                  style={{
                    padding: '12px', background: uploading ? 'rgba(196,30,58,0.5)' : '#c41e3a',
                    color: '#fff', border: 'none', borderRadius: '10px',
                    fontWeight: 600, fontSize: '0.92rem', cursor: uploading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    transition: 'background 0.2s'
                  }}
                >
                  {uploading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> იტვირთება...</> : 'ატვირთვა'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
