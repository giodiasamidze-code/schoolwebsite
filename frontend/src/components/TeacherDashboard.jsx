import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';
import {
  GraduationCap,
  Briefcase,
  Award,
  Calendar,
  Upload,
  Save,
  ArrowLeft,
  Clock,
  AlertCircle,
  CheckCircle2,
  LogOut,
  ExternalLink,
  Sparkles,
  User,
  BookOpen,
  ShieldCheck
} from 'lucide-react';

export default function TeacherDashboard() {
  const { user, role, teacherProfile, navigate, logout } = useAuth();

  // --- Profile Edit State ---
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    subject: '',
    bio: '',
    photo_url: '',
    education: '',
    experience_years: '',
    certifications: '',
    years_at_school: ''
  });
  const [profileStatus, setProfileStatus] = useState({ loading: false, success: null, message: '' });
  const [photoUploading, setPhotoUploading] = useState(false);
  const [latestPendingEdit, setLatestPendingEdit] = useState(null);

  // Toast Notification
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load teacher profile & pending edit submissions
  const fetchPendingEdits = async (teacherId) => {
    if (!teacherId) return;
    try {
      const { data, error } = await supabase
        .from('teacher_profile_edits')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setLatestPendingEdit(data);
      }
    } catch (err) {
      console.error('Error fetching pending edits:', err);
    }
  };

  useEffect(() => {
    if (teacherProfile) {
      setProfileForm({
        full_name: teacherProfile.full_name || user?.name || '',
        subject: teacherProfile.subject || '',
        bio: teacherProfile.bio || '',
        photo_url: teacherProfile.photo_url || '',
        education: teacherProfile.education || '',
        experience_years: teacherProfile.experience_years || '',
        certifications: teacherProfile.certifications || '',
        years_at_school: teacherProfile.years_at_school || ''
      });

      fetchPendingEdits(teacherProfile.id);
    }
  }, [teacherProfile, user]);

  // Upload teacher photo to Supabase Storage
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !teacherProfile?.id) return;

    setPhotoUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `teachers/${teacherProfile.id}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('teacher-photos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('teacher-photos')
        .getPublicUrl(filePath);

      const photoUrl = publicUrlData?.publicUrl || filePath;
      setProfileForm((prev) => ({ ...prev, photo_url: photoUrl }));
      showToast('ფოტოსურათი წარმატებით აიტვირთა!', 'success');
    } catch (err) {
      console.error('Photo upload error:', err);
      showToast('ფოტოს ატვირთვა ვერ მოხერხდა. სცადეთ პირდაპირი URL.', 'error');
    } finally {
      setPhotoUploading(false);
    }
  };

  // Submit profile edits for ADMIN APPROVAL
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!teacherProfile?.id) return;

    setProfileStatus({ loading: true, success: null, message: '' });
    try {
      const { data: editData, error } = await supabase
        .from('teacher_profile_edits')
        .insert([
          {
            teacher_id: teacherProfile.id,
            proposed_data: profileForm,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setLatestPendingEdit(editData);
      setProfileStatus({
        loading: false,
        success: true,
        message: 'ცვლილებები წარმატებით გაეგზავნა ადმინისტრაციას დადასტურებისათვის.'
      });
      showToast('ცვლილებები გაიგზავნა მოდერაციაზე!', 'success');
    } catch (err) {
      console.error('Profile edit submit error:', err);
      setProfileStatus({
        loading: false,
        success: false,
        message: 'შეცდომა: ' + (err.message || JSON.stringify(err))
      });
      showToast('ცვლილების გაგზავნა ვერ მოხერხდა.', 'error');
    }
  };

  if (!user || role !== 'teacher') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-primary, #FAF6F0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <div style={{
          background: '#ffffff',
          border: '1px solid var(--border-color, #E2DACF)',
          borderRadius: '20px',
          padding: '48px 36px',
          maxWidth: '480px',
          textAlign: 'center',
          color: 'var(--text-dark, #2C2825)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.06)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'rgba(128, 0, 32, 0.08)',
            border: '1px solid rgba(128, 0, 32, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: 'var(--accent-primary, #800020)'
          }}>
            <GraduationCap size={32} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)', fontSize: '1.75rem', marginBottom: '12px', color: 'var(--text-dark, #2C2825)' }}>
            ავტორიზაცია საჭიროა
          </h2>
          <p style={{ color: 'var(--text-muted, #6B625B)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '28px' }}>
            ეს გვერდი განკუთვნილია მხოლოდ სოლომონ აკადემიის ავტორიზებული პედაგოგებისთვის.
          </p>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '12px 28px',
              background: 'var(--accent-primary, #800020)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            შესვლა / რეგისტრაცია
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary, #FAF6F0)',
      color: 'var(--text-dark, #2C2825)',
      fontFamily: 'var(--font-sans, "Noto Sans Georgian", Inter, sans-serif)',
      display: 'flex',
      flexDirection: 'column'
    }}>

      {/* TOAST POPUP */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          background: toast.type === 'error' ? '#991b1b' : '#166534',
          color: '#ffffff',
          padding: '14px 22px',
          borderRadius: '12px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.92rem',
          fontWeight: 500,
          border: '1px solid rgba(255,255,255,0.2)',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          {toast.message}
        </div>
      )}

      {/* TOP HEADER BAR */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid var(--border-color, #E2DACF)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}>

          {/* Left: Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'var(--accent-primary, #800020)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(128, 0, 32, 0.25)'
            }}>
              <GraduationCap size={22} color="#FAF6F0" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  color: 'var(--text-dark, #2C2825)'
                }}>
                  სოლომონ აკადემია
                </span>
                <span style={{
                  background: 'rgba(128, 0, 32, 0.08)',
                  border: '1px solid rgba(128, 0, 32, 0.2)',
                  color: 'var(--accent-primary, #800020)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  textTransform: 'uppercase'
                }}>
                  პედაგოგის კაბინეტი
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted, #6B625B)' }}>
                მართეთ თქვენი საჯარო პედაგოგიური პროფილი
              </div>
            </div>
          </div>

          {/* Right: User Info & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: 'var(--bg-secondary, #F3ECE3)',
                border: '1px solid var(--border-color, #E2DACF)',
                borderRadius: '8px',
                color: 'var(--text-dark, #2C2825)',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#E8DFD3'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-secondary, #F3ECE3)'}
            >
              <ExternalLink size={14} />
              მთავარ გვერდზე
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 14px 6px 6px',
              background: 'var(--bg-secondary, #F3ECE3)',
              border: '1px solid var(--border-color, #E2DACF)',
              borderRadius: '30px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: teacherProfile?.photo_url ? `url(${teacherProfile.photo_url}) center/cover` : 'var(--accent-primary, #800020)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#fff'
              }}>
                {!teacherProfile?.photo_url && (teacherProfile?.full_name?.[0] || 'T')}
              </div>
              <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-dark, #2C2825)' }}>
                  {teacherProfile?.full_name || user?.name || 'პედაგოგი'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--accent-primary, #800020)', fontWeight: 500 }}>
                  {teacherProfile?.subject || 'მასწავლებელი'}
                </div>
              </div>
            </div>

            <button
              onClick={() => logout()}
              title="სისტემიდან გამოსვლა"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                background: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                color: '#b91c1c',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ef4444';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fee2e2';
                e.currentTarget.style.color = '#b91c1c';
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '36px 24px 80px', flex: 1 }}>

        {/* MODERATION STATUS BANNER */}
        {latestPendingEdit && latestPendingEdit.status === 'pending' ? (
          <div style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '14px',
            padding: '16px 20px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.05)'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#b45309',
              flexShrink: 0
            }}>
              <Clock size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#92400e', fontSize: '0.95rem' }}>
                ცვლილებები განხილვის პროცესშია
              </div>
              <div style={{ fontSize: '0.85rem', color: '#b45309', marginTop: '2px' }}>
                თქვენ მიერ შეტანილი მონაცემები გადაეგზავნა ადმინისტრაციას. დადასტურებისთანავე განახლდება თქვენი საჯარო ბარათი.
              </div>
            </div>
          </div>
        ) : latestPendingEdit && latestPendingEdit.status === 'rejected' ? (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '14px',
            padding: '16px 20px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.05)'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#dc2626',
              flexShrink: 0
            }}>
              <AlertCircle size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.95rem' }}>
                ადმინისტრაციის შენიშვნა
              </div>
              <div style={{ fontSize: '0.85rem', color: '#b91c1c', marginTop: '2px' }}>
                {latestPendingEdit.rejection_note || 'გთხოვთ გადახედოთ მონაცემების სისწორეს და თავიდან გამოაგზავნოთ.'}
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '14px',
            padding: '14px 20px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            boxShadow: '0 2px 8px rgba(34, 197, 94, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldCheck size={20} color="#16a34a" />
              <div>
                <span style={{ fontWeight: 600, color: '#15803d', fontSize: '0.9rem' }}>
                  პროფილი აქტიურია
                </span>
                <span style={{ fontSize: '0.85rem', color: '#166534', marginLeft: '8px' }}>
                  — თქვენი ინფორმაცია საჯაროდ ჩანს სკოლის ვებსაიტზე
                </span>
              </div>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--accent-primary, #800020)', fontWeight: 600 }}>
              საგანი: {profileForm.subject || 'მითითებული არ არის'}
            </div>
          </div>
        )}

        {/* 2-COLUMN BALANCED WORKSPACE */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '32px',
          alignItems: 'start'
        }}>

          {/* LEFT COLUMN: EDIT FORM */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border-color, #E2DACF)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.04)'
          }}>
            <div style={{ marginBottom: '22px' }}>
              <h2 style={{
                fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                fontSize: '1.45rem',
                color: 'var(--text-dark, #2C2825)',
                margin: 0
              }}>
                პროფილის რედაქტირება
              </h2>
              <p style={{ color: 'var(--text-muted, #6B625B)', fontSize: '0.86rem', marginTop: '4px' }}>
                განაახლეთ თქვენი პედაგოგიური რეზიუმე და გამოცდილება
              </p>
            </div>

            <form onSubmit={handleProfileSubmit}>
              
              {/* Name & Subject (2 columns) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-dark, #2C2825)', marginBottom: '6px' }}>
                    სახელი და გვარი *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      background: 'var(--bg-primary, #FAF6F0)',
                      border: '1px solid var(--border-color, #E2DACF)',
                      borderRadius: '10px',
                      color: 'var(--text-dark, #2C2825)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-dark, #2C2825)', marginBottom: '6px' }}>
                    საგანი / მიმართულება *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="მაგ: მათემატიკა, ფიზიკა"
                    value={profileForm.subject}
                    onChange={(e) => setProfileForm({ ...profileForm, subject: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      background: 'var(--bg-primary, #FAF6F0)',
                      border: '1px solid var(--border-color, #E2DACF)',
                      borderRadius: '10px',
                      color: 'var(--text-dark, #2C2825)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Photo URL & Upload Button */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-dark, #2C2825)', marginBottom: '6px' }}>
                  პროფილის ფოტოსურათი
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="ფოტოს URL ან ატვირთეთ ფაილი..."
                    value={profileForm.photo_url}
                    onChange={(e) => setProfileForm({ ...profileForm, photo_url: e.target.value })}
                    style={{
                      flex: 1,
                      padding: '11px 14px',
                      background: 'var(--bg-primary, #FAF6F0)',
                      border: '1px solid var(--border-color, #E2DACF)',
                      borderRadius: '10px',
                      color: 'var(--text-dark, #2C2825)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                  <label style={{
                    padding: '10px 16px',
                    background: 'var(--bg-secondary, #F3ECE3)',
                    border: '1px solid var(--border-color, #E2DACF)',
                    borderRadius: '10px',
                    color: 'var(--accent-primary, #800020)',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}>
                    <Upload size={15} />
                    {photoUploading ? 'იტვირთება...' : 'ატვირთვა'}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
                  </label>
                </div>
              </div>

              {/* Bio */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-dark, #2C2825)', marginBottom: '6px' }}>
                  მოკლე ბიოგრაფია & მოტივაცია
                </label>
                <textarea
                  rows={2}
                  placeholder="მოკლე შესავალი..."
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    background: 'var(--bg-primary, #FAF6F0)',
                    border: '1px solid var(--border-color, #E2DACF)',
                    borderRadius: '10px',
                    color: 'var(--text-dark, #2C2825)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Education */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-dark, #2C2825)', marginBottom: '6px' }}>
                  განათლება (უნივერსიტეტი, ხარისხი)
                </label>
                <textarea
                  rows={2}
                  placeholder="მაგ: თბილისის სახელმწიფო უნივერსიტეტი (მაგისტრი)..."
                  value={profileForm.education}
                  onChange={(e) => setProfileForm({ ...profileForm, education: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    background: 'var(--bg-primary, #FAF6F0)',
                    border: '1px solid var(--border-color, #E2DACF)',
                    borderRadius: '10px',
                    color: 'var(--text-dark, #2C2825)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Experience & Certifications (2 columns) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-dark, #2C2825)', marginBottom: '6px' }}>
                    პედაგოგიური გამოცდილება
                  </label>
                  <input
                    type="text"
                    placeholder="მაგ: 10 წელი"
                    value={profileForm.experience_years}
                    onChange={(e) => setProfileForm({ ...profileForm, experience_years: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      background: 'var(--bg-primary, #FAF6F0)',
                      border: '1px solid var(--border-color, #E2DACF)',
                      borderRadius: '10px',
                      color: 'var(--text-dark, #2C2825)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-dark, #2C2825)', marginBottom: '6px' }}>
                    სტაჟი აკადემიაში
                  </label>
                  <input
                    type="text"
                    placeholder="მაგ: 3 წელი"
                    value={profileForm.years_at_school}
                    onChange={(e) => setProfileForm({ ...profileForm, years_at_school: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      background: 'var(--bg-primary, #FAF6F0)',
                      border: '1px solid var(--border-color, #E2DACF)',
                      borderRadius: '10px',
                      color: 'var(--text-dark, #2C2825)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Certifications */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-dark, #2C2825)', marginBottom: '6px' }}>
                  სერტიფიკატები და ჯილდოები
                </label>
                <textarea
                  rows={2}
                  placeholder="მაგ: IB Trainer, Google Certified Educator..."
                  value={profileForm.certifications}
                  onChange={(e) => setProfileForm({ ...profileForm, certifications: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    background: 'var(--bg-primary, #FAF6F0)',
                    border: '1px solid var(--border-color, #E2DACF)',
                    borderRadius: '10px',
                    color: 'var(--text-dark, #2C2825)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={profileStatus.loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'var(--accent-primary, #800020)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: profileStatus.loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(128, 0, 32, 0.25)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-primary-hover, #600018)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent-primary, #800020)'}
              >
                <Save size={18} />
                {profileStatus.loading ? 'იგზავნება...' : 'ცვლილებების გაგზავნა მოდერაციაზე'}
              </button>

            </form>
          </div>

          {/* RIGHT COLUMN: LIVE PUBLIC PREVIEW CARD */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="var(--accent-primary, #800020)" />
                <h3 style={{
                  fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                  fontSize: '1.25rem',
                  color: 'var(--text-dark, #2C2825)',
                  margin: 0
                }}>
                  საჯარო ბარათის გადახედვა
                </h3>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted, #6B625B)', fontWeight: 500 }}>
                Live Preview
              </span>
            </div>

            {/* CARD (Matches the elegant school modal / card) */}
            <div style={{
              background: '#ffffff',
              border: '1px solid var(--border-color, #E2DACF)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 12px 36px rgba(0,0,0,0.06)'
            }}>
              
              {/* Card Header with Photo */}
              <div style={{
                padding: '28px 24px 22px',
                background: 'linear-gradient(180deg, var(--bg-secondary, #F3ECE3) 0%, #ffffff 100%)',
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                borderBottom: '1px solid var(--border-color, #E2DACF)'
              }}>
                <div style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '18px',
                  background: profileForm.photo_url ? `url(${profileForm.photo_url}) center/cover` : 'var(--accent-primary, #800020)',
                  border: '2px solid var(--accent-secondary, #C5A059)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1.6rem',
                  flexShrink: 0
                }}>
                  {!profileForm.photo_url && (profileForm.full_name?.[0] || 'T')}
                </div>
                <div>
                  <h4 style={{
                    fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                    fontSize: '1.35rem',
                    color: 'var(--text-dark, #2C2825)',
                    margin: '0 0 4px',
                    fontWeight: 700
                  }}>
                    {profileForm.full_name || 'პედაგოგის სახელი და გვარი'}
                  </h4>
                  <div style={{
                    display: 'inline-block',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    background: 'rgba(128, 0, 32, 0.08)',
                    border: '1px solid rgba(128, 0, 32, 0.2)',
                    color: 'var(--accent-primary, #800020)',
                    fontSize: '0.82rem',
                    fontWeight: 600
                  }}>
                    {profileForm.subject || 'საგანი / მიმართულება'}
                  </div>
                </div>
              </div>

              {/* Card Body Details */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {profileForm.bio && (
                  <p style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-dark, #2C2825)',
                    lineHeight: '1.6',
                    fontStyle: 'italic',
                    margin: 0,
                    padding: '10px 14px',
                    background: 'var(--bg-primary, #FAF6F0)',
                    borderRadius: '10px',
                    borderLeft: '3px solid var(--accent-primary, #800020)'
                  }}>
                    "{profileForm.bio}"
                  </p>
                )}

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-secondary, #F3ECE3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary, #800020)', flexShrink: 0 }}>
                    <GraduationCap size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #6B625B)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>განათლება</div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-dark, #2C2825)', marginTop: '2px' }}>
                      {profileForm.education || 'არ არის მითითებული'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-secondary, #F3ECE3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary, #800020)', flexShrink: 0 }}>
                    <Briefcase size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #6B625B)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>პედაგოგიური გამოცდილება</div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-dark, #2C2825)', marginTop: '2px' }}>
                      {profileForm.experience_years || 'არ არის მითითებული'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-secondary, #F3ECE3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary, #800020)', flexShrink: 0 }}>
                    <Award size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #6B625B)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>სერტიფიკატები & კვალიფიკაცია</div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-dark, #2C2825)', marginTop: '2px' }}>
                      {profileForm.certifications || 'არ არის მითითებული'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-secondary, #F3ECE3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary, #800020)', flexShrink: 0 }}>
                    <Calendar size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #6B625B)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>აკადემიაში მუშაობის პერიოდი</div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-dark, #2C2825)', marginTop: '2px' }}>
                      {profileForm.years_at_school || 'არ არის მითითებული'}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </main>

    </div>
  );
}
