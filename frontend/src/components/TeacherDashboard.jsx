import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';
import { GraduationCap, Briefcase, Award, Calendar, Upload, Save, ArrowLeft, Clock, AlertCircle } from 'lucide-react';

export default function TeacherDashboard() {
  const { user, role, teacherProfile, navigate } = useAuth();

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
    } catch (err) {
      console.error('Photo upload error:', err);
      alert('ფოტოს ატვირთვა ვერ მოხერხდა.');
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
    } catch (err) {
      console.error('Profile edit submit error:', err);
      setProfileStatus({
        loading: false,
        success: false,
        message: 'შეცდომა: ' + (err.message || JSON.stringify(err))
      });
    }
  };

  if (!user || role !== 'teacher') {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '16px' }}>
          წვდომა შეზღუდულია
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          ეს გვერდი განკუთვნილია მხოლოდ ავტორიზებული მასწავლებლებისთვის.
        </p>
        <button onClick={() => navigate('/register')} className="btn btn-primary">
          ავტორიზაცია / შესვლა
        </button>
      </div>
    );
  }

  return (
    <div className="teacher-dashboard-wrapper fade-in" style={{ padding: '40px 0 80px', background: 'var(--bg-primary)' }}>
      <div className="container">
        
        {/* Header bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
          <div>
            <button className="back-link-btn" onClick={() => navigate('/')} style={{ marginBottom: '8px' }}>
              <ArrowLeft size={16} className="icon-mr" />
              მთავარ გვერდზე დაბრუნება
            </button>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--text-dark)' }}>
              მასწავლებლის პირადი კაბინეტი
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              სალამი, {teacherProfile?.full_name || user?.name}! მართეთ თქვენი პროფილის ინფორმაცია.
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '12px 20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>საგანი:</span>
            <strong style={{ fontSize: '1rem', color: 'var(--accent-primary)' }}>{teacherProfile?.subject || 'პედაგოგი'}</strong>
          </div>
        </div>

        {/* Pending Moderation Alert */}
        {latestPendingEdit && latestPendingEdit.status === 'pending' && (
          <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '8px', padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: '#92400e' }}>
            <Clock size={20} className="flex-shrink-0" />
            <div>
              <strong>მოდერაციის სტატუსი: განხილვის პროცესშია</strong>
              <p style={{ margin: '2px 0 0', fontSize: '0.88rem' }}>
                თქვენი ბოლო ცვლილებები გაგზავნილია ადმინისტრაციასთან. დადასტურების შემდეგ ცვლილებები აისახება საჯარო პროფილზე.
              </p>
            </div>
          </div>
        )}

        {latestPendingEdit && latestPendingEdit.status === 'rejected' && (
          <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: '#991b1b' }}>
            <AlertCircle size={20} className="flex-shrink-0" />
            <div>
              <strong>მოდერაციის სტატუსი: უარყოფილია</strong>
              <p style={{ margin: '2px 0 0', fontSize: '0.88rem' }}>
                ადმინისტრაციამ არ დაამტკიცა ბოლო ცვლილება. {latestPendingEdit.rejection_note && `შენიშვნა: "${latestPendingEdit.rejection_note}"`}
              </p>
            </div>
          </div>
        )}

        {/* EDIT PROFILE & LIVE PREVIEW */}
        <div className="profile-tab-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          
          {/* Form */}
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '28px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '8px', color: 'var(--text-dark)' }}>
              რეზიუმეს რედაქტირება
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
              შენახული ცვლილებები გადაეგზავნება სკოლის ადმინისტრაციას დადასტურებისათვის.
            </p>

            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label className="form-label">სახელი და გვარი *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={profileForm.full_name}
                  onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">საგანი / მიმართულება *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="მაგ: მათემატიკა, STEM"
                  value={profileForm.subject}
                  onChange={(e) => setProfileForm({ ...profileForm, subject: e.target.value })}
                />
              </div>

              {/* Photo Upload */}
              <div className="form-group">
                <label className="form-label">პროფილის ფოტოსურათი</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ფოტოს URL ან ატვირთეთ..."
                    value={profileForm.photo_url}
                    onChange={(e) => setProfileForm({ ...profileForm, photo_url: e.target.value })}
                  />
                  <label className="btn btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Upload size={16} />
                    {photoUploading ? 'ატვირთვა...' : 'ფაილი'}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">მოკლე ბიოგრაფია / ქვესათაური</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="მოკლე აღწერა..."
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">განათლება</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="მაგ: თსუ (ბაკალავრი, მაგისტრი)..."
                  value={profileForm.education}
                  onChange={(e) => setProfileForm({ ...profileForm, education: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">გამოცდილება</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="მაგ: 10 წელი სწავლების მიმართულებით..."
                  value={profileForm.experience_years}
                  onChange={(e) => setProfileForm({ ...profileForm, experience_years: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">სერტიფიკატები</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="მაგ: Google Certified Educator, IB Trainer..."
                  value={profileForm.certifications}
                  onChange={(e) => setProfileForm({ ...profileForm, certifications: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">აკადემიაში მუშაობის პერიოდი</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="მაგ: 4 წელი"
                  value={profileForm.years_at_school}
                  onChange={(e) => setProfileForm({ ...profileForm, years_at_school: e.target.value })}
                />
              </div>

              <button type="submit" disabled={profileStatus.loading} className="btn btn-primary w-full mt-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Save size={18} />
                {profileStatus.loading ? 'გაგზავნა...' : 'ცვლილებების გაგზავნა მოდერაციაზე'}
              </button>

              {profileStatus.message && (
                <div className={`form-feedback ${profileStatus.success ? 'success' : 'error'}`} style={{ marginTop: '12px' }}>
                  {profileStatus.message}
                </div>
              )}
            </form>
          </div>

          {/* Live Card Preview */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '20px', color: 'var(--text-dark)' }}>
              სავარაუდო პროფილის წინასწარი გადახედვა
            </h3>

            <div className="modal-content" style={{ position: 'relative', margin: 0, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', borderRadius: '8px' }}>
              <div className="modal-header">
                <div className="modal-avatar">
                  <img
                    src={profileForm.photo_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400'}
                    alt={profileForm.full_name}
                    className="modal-headshot"
                  />
                </div>
                <div>
                  <h3 className="modal-teacher-name">{profileForm.full_name || 'სახელი გვარი'}</h3>
                  <span className="modal-teacher-role">{profileForm.subject || 'საგანი'}</span>
                </div>
              </div>

              <div className="modal-body">
                <div className="cv-item">
                  <GraduationCap className="cv-icon" />
                  <div>
                    <h4>განათლება</h4>
                    <p>{profileForm.education || 'არ არის მითითებული'}</p>
                  </div>
                </div>
                
                <div className="cv-item">
                  <Briefcase className="cv-icon" />
                  <div>
                    <h4>გამოცდილება</h4>
                    <p>{profileForm.experience_years || 'არ არის მითითებული'}</p>
                  </div>
                </div>

                <div className="cv-item">
                  <Award className="cv-icon" />
                  <div>
                    <h4>სერტიფიკატები</h4>
                    <p>{profileForm.certifications || 'არ არის მითითებული'}</p>
                  </div>
                </div>

                <div className="cv-item">
                  <Calendar className="cv-icon" />
                  <div>
                    <h4>აკადემიაში მუშაობის პერიოდი</h4>
                    <p>{profileForm.years_at_school || 'არ არის მითითებული'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
