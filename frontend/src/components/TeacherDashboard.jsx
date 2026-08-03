import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';
import { User, GraduationCap, Briefcase, Award, Calendar, Upload, Plus, Trash2, Edit3, Save, X, ArrowLeft, Image as ImageIcon, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function TeacherDashboard() {
  const { user, role, teacherProfile, refreshTeacherProfile, navigate } = useAuth();
  
  // Dashboard active tab: 'profile' or 'activities'
  const [activeTab, setActiveTab] = useState('profile');

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

  // --- Activities State ---
  const [activities, setActivities] = useState([]);
  const [activityForm, setActivityForm] = useState({
    id: null,
    title: '',
    description: '',
    class_stage: 'basic',
    class_section: '',
    media_url: ''
  });
  const [activityStatus, setActivityStatus] = useState({ loading: false, success: null, message: '' });
  const [activityMediaUploading, setActivityMediaUploading] = useState(false);
  const [isEditingActivity, setIsEditingActivity] = useState(false);

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

  // Load teacher's activities
  const fetchMyActivities = async () => {
    if (!teacherProfile?.id) return;
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('teacher_id', teacherProfile.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setActivities(data);
      }
    } catch (err) {
      console.error('Error loading activities:', err);
    }
  };

  useEffect(() => {
    if (teacherProfile?.id) {
      fetchMyActivities();
    }
  }, [teacherProfile]);

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
        message: 'ცვლილებების გაგზავნა ვერ მოხერხდა.'
      });
    }
  };

  // Upload activity image to Supabase Storage
  const handleActivityMediaUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setActivityMediaUploading(true);
    try {
      const filePath = `activities/${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('activity-media')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('activity-media')
        .getPublicUrl(filePath);

      const mediaUrl = publicUrlData?.publicUrl || filePath;
      setActivityForm((prev) => ({ ...prev, media_url: mediaUrl }));
    } catch (err) {
      console.error('Activity media upload error:', err);
      alert('მედია ფაილის ატვირთვა ვერ მოხერხდა.');
    } finally {
      setActivityMediaUploading(false);
    }
  };

  // Save (Create or Update) Activity
  const handleActivitySubmit = async (e) => {
    e.preventDefault();
    if (!teacherProfile?.id) return;

    setActivityStatus({ loading: true, success: null, message: '' });
    try {
      if (isEditingActivity && activityForm.id) {
        const { error } = await supabase
          .from('activities')
          .update({
            title: activityForm.title,
            description: activityForm.description,
            class_stage: activityForm.class_stage,
            class_section: activityForm.class_section,
            category: activityForm.class_stage,
            media_url: activityForm.media_url
          })
          .eq('id', activityForm.id)
          .eq('teacher_id', teacherProfile.id);

        if (error) throw error;
        setActivityStatus({ loading: false, success: true, message: 'აქტივობა წარმატებით განახლდა!' });
      } else {
        const { error } = await supabase
          .from('activities')
          .insert([
            {
              teacher_id: teacherProfile.id,
              title: activityForm.title,
              description: activityForm.description,
              class_stage: activityForm.class_stage,
              class_section: activityForm.class_section,
              category: activityForm.class_stage,
              media_url: activityForm.media_url,
              likes: 0
            }
          ]);

        if (error) throw error;
        setActivityStatus({ loading: false, success: true, message: 'ახალი აქტივობა წარმატებით დაემატა!' });
      }

      setActivityForm({ id: null, title: '', description: '', class_stage: 'basic', class_section: '', media_url: '' });
      setIsEditingActivity(false);
      await fetchMyActivities();
    } catch (err) {
      console.error('Save activity error:', err);
      setActivityStatus({ loading: false, success: false, message: err.message || 'აქტივობის შენახვა ვერ მოხერხდა.' });
    }
  };

  // Delete Activity
  const handleDeleteActivity = async (id) => {
    if (!window.confirm('ნამდვილად გსურთ ამ აქტივობის წაშლა?')) return;

    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id)
        .eq('teacher_id', teacherProfile.id);

      if (error) throw error;

      await fetchMyActivities();
    } catch (err) {
      console.error('Delete activity error:', err);
      alert('აქტივობის წაშლა ვერ მოხერხდა.');
    }
  };

  // Edit Activity button handler
  const handleStartEditActivity = (act) => {
    setActivityForm({
      id: act.id,
      title: act.title,
      description: act.description,
      class_stage: act.class_stage || 'basic',
      class_section: act.class_section || '',
      media_url: act.media_url || ''
    });
    setIsEditingActivity(true);
    setActivityStatus({ loading: false, success: null, message: '' });
    window.scrollTo({ top: 300, behavior: 'smooth' });
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
              სალამი, {teacherProfile?.full_name || user?.name}! მართეთ თქვენი პროფილი და გამოაქვეყნეთ სიახლეები.
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

        {/* Dashboard Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <button
            type="button"
            className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            პროფილის ცვლილება (მოდერაციით)
          </button>
          <button
            type="button"
            className={`btn ${activeTab === 'activities' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => setActiveTab('activities')}
          >
            <Plus size={18} />
            აქტივობის დამატება & მართვა ({activities.length})
          </button>
        </div>

        {/* TAB 1: EDIT PROFILE */}
        {activeTab === 'profile' && (
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
        )}

        {/* TAB 2: POST & MANAGE ACTIVITIES */}
        {activeTab === 'activities' && (
          <div className="activities-tab-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            
            {/* Create / Edit Form */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-dark)', margin: 0 }}>
                  {isEditingActivity ? 'აქტივობის რედაქტირება' : 'ახალი აქტივობის დამატება'}
                </h3>
                {isEditingActivity && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setIsEditingActivity(false);
                      setActivityForm({ id: null, title: '', description: '', class_stage: 'basic', class_section: '', media_url: '' });
                    }}
                  >
                    <X size={14} className="icon-mr" />
                    გაუქმება
                  </button>
                )}
              </div>

              <form onSubmit={handleActivitySubmit}>
                <div className="form-group">
                  <label className="form-label">აქტივობის სათაური *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="მაგ: ინტელექტუალური თამაში..."
                    value={activityForm.title}
                    onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">სასწავლო საფეხური *</label>
                    <select
                      className="form-control"
                      value={activityForm.class_stage}
                      onChange={(e) => setActivityForm({ ...activityForm, class_stage: e.target.value })}
                    >
                      <option value="basic">საბაზო საფეხური</option>
                      <option value="high">საშუალო საფეხური</option>
                      <option value="kindergarten">დაწყებითი / საბავშვო</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">კლასი / სექცია</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="მაგ: მე-8 ბ კლასი"
                      value={activityForm.class_section}
                      onChange={(e) => setActivityForm({ ...activityForm, class_section: e.target.value })}
                    />
                  </div>
                </div>

                {/* Media Upload */}
                <div className="form-group">
                  <label className="form-label">ფოტო / ემოჯი / მედია URL</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ემოჯი (🚀, 🧠) ან ფოტოს URL..."
                      value={activityForm.media_url}
                      onChange={(e) => setActivityForm({ ...activityForm, media_url: e.target.value })}
                    />
                    <label className="btn btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Upload size={16} />
                      {activityMediaUploading ? 'ატვირთვა...' : 'ფოტო'}
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleActivityMediaUpload} />
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">აქტივობის აღწერა *</label>
                  <textarea
                    required
                    rows="4"
                    className="form-control"
                    placeholder="დეტალური ინფორმაცია აქტივობის შესახებ..."
                    value={activityForm.description}
                    onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                  />
                </div>

                <button type="submit" disabled={activityStatus.loading} className="btn btn-primary w-full mt-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Save size={18} />
                  {activityStatus.loading ? 'ინახება...' : isEditingActivity ? 'ცვლილებების შენახვა' : 'გამოქვეყნება'}
                </button>

                {activityStatus.message && (
                  <div className={`form-feedback ${activityStatus.success ? 'success' : 'error'}`} style={{ marginTop: '12px' }}>
                    {activityStatus.message}
                  </div>
                )}
              </form>
            </div>

            {/* Previously Posted Activities List */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '20px', color: 'var(--text-dark)' }}>
                ჩემი გამოქვეყნებული აქტივობები
              </h3>

              {activities.length === 0 ? (
                <div style={{ padding: '32px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <ImageIcon size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                  <p>ჯერჯერობით აქტივობები არ გაქვთ გამოქვეყნებული.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {activities.map((act) => (
                    <div key={act.id} style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: '12px', background: 'rgba(128,0,32,0.08)', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                            {act.class_stage} {act.class_section && `• ${act.class_section}`}
                          </span>
                          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--text-dark)', marginTop: '4px' }}>
                            {act.title}
                          </h4>
                        </div>

                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => handleStartEditActivity(act)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)', padding: '4px' }}
                            title="რედაქტირება"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteActivity(act.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                            title="წაშლა"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: '0 0 8px' }}>
                        {act.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
