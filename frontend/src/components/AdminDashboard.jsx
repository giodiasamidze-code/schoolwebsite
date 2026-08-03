import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';
import { UserCheck, FileText, Calendar, Newspaper, CheckCircle2, XCircle, Edit3, Trash2, Save, Upload, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function AdminDashboard() {
  const { user, role, navigate } = useAuth();
  
  // Dashboard Active Tab: 'edits', 'queue', 'timeline', 'news'
  const [activeTab, setActiveTab] = useState('edits');

  // --- 1. Teacher Profile Edits State ---
  const [pendingEdits, setPendingEdits] = useState([]);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const [rejectionNote, setRejectionNote] = useState('');
  const [editsStatus, setEditsStatus] = useState({ loading: false, message: '' });

  // --- 2. Applications & Visit Bookings State ---
  const [queueTab, setQueueTab] = useState('applications'); // 'applications' or 'bookings'
  const [applications, setApplications] = useState([]);
  const [visitBookings, setVisitBookings] = useState([]);

  // --- 3. Admissions Timeline State ---
  const [timelineSteps, setTimelineSteps] = useState([]);
  const [timelineStatus, setTimelineStatus] = useState({ loading: false, message: '' });

  // --- 4. News State ---
  const [newsList, setNewsList] = useState([]);
  const [newsForm, setNewsForm] = useState({
    id: null,
    title: '',
    content: '',
    image_url: '',
    is_published: true
  });
  const [newsStatus, setNewsStatus] = useState({ loading: false, message: '' });
  const [newsImageUploading, setNewsImageUploading] = useState(false);
  const [isEditingNews, setIsEditingNews] = useState(false);

  // Load Data based on active tab
  useEffect(() => {
    if (role === 'admin') {
      fetchPendingEdits();
      fetchApplications();
      fetchVisitBookings();
      fetchTimelineSteps();
      fetchNews();
    }
  }, [role]);

  // 1. Fetch Teacher Edits
  const fetchPendingEdits = async () => {
    try {
      const { data, error } = await supabase
        .from('teacher_profile_edits')
        .select('*, teachers!inner(id, full_name, subject, photo_url, bio, education, experience_years, certifications, years_at_school)')
        .order('submitted_at', { ascending: false });

      if (!error && data) {
        setPendingEdits(data);
      }
    } catch (err) {
      console.error('Error fetching teacher profile edits:', err);
    }
  };

  const handleApproveEdit = async (editItem) => {
    setEditsStatus({ loading: true, message: '' });
    try {
      const proposed = editItem.proposed_data;

      // 1. Update live teachers table
      const { error: teacherError } = await supabase
        .from('teachers')
        .update({
          full_name: proposed.full_name,
          subject: proposed.subject,
          bio: proposed.bio,
          photo_url: proposed.photo_url,
          education: proposed.education,
          experience_years: proposed.experience_years,
          certifications: proposed.certifications,
          years_at_school: proposed.years_at_school
        })
        .eq('id', editItem.teacher_id);

      if (teacherError) throw teacherError;

      // 2. Mark edit record as approved
      const { error: editError } = await supabase
        .from('teacher_profile_edits')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString()
        })
        .eq('id', editItem.id);

      if (editError) throw editError;

      setSelectedEdit(null);
      await fetchPendingEdits();
      setEditsStatus({ loading: false, message: 'პროფილის ცვლილება წარმატებით დადასტურდა!' });
    } catch (err) {
      console.error('Approve edit error:', err);
      setEditsStatus({ loading: false, message: 'დადასტურებისას დაფიქსირდა შეცდომა.' });
    }
  };

  const handleRejectEdit = async (editItem) => {
    setEditsStatus({ loading: true, message: '' });
    try {
      const { error } = await supabase
        .from('teacher_profile_edits')
        .update({
          status: 'rejected',
          rejection_note: rejectionNote || 'ადმინისტრაციის მიერ უარყოფილია.',
          reviewed_at: new Date().toISOString()
        })
        .eq('id', editItem.id);

      if (error) throw error;

      setSelectedEdit(null);
      setRejectionNote('');
      await fetchPendingEdits();
      setEditsStatus({ loading: false, message: 'პროფილის ცვლილება უარყოფილია.' });
    } catch (err) {
      console.error('Reject edit error:', err);
      setEditsStatus({ loading: false, message: 'უარყოფისას დაფიქსირდა შეცდომა.' });
    }
  };

  // 2. Fetch Applications & Visit Bookings
  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*, application_documents(*)')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setApplications(data);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  const fetchVisitBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('visit_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setVisitBookings(data);
      }
    } catch (err) {
      console.error('Error fetching visit bookings:', err);
    }
  };

  const handleUpdateAppStatus = async (appId, newStatus) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', appId);

      if (error) throw error;
      await fetchApplications();
    } catch (err) {
      console.error('Error updating application status:', err);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      const { error } = await supabase
        .from('visit_bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;
      await fetchVisitBookings();
    } catch (err) {
      console.error('Error updating booking status:', err);
    }
  };

  // 3. Fetch & Update Admissions Timeline Steps
  const fetchTimelineSteps = async () => {
    try {
      const { data, error } = await supabase
        .from('admissions_steps')
        .select('*')
        .order('step_number', { ascending: true });

      if (!error && data && data.length > 0) {
        setTimelineSteps(data);
      }
    } catch (err) {
      console.error('Error fetching timeline steps:', err);
    }
  };

  const handleSaveTimelineStep = async (step) => {
    setTimelineStatus({ loading: true, message: '' });
    try {
      const { error } = await supabase
        .from('admissions_steps')
        .update({
          title: step.title,
          description: step.description,
          deadline: step.deadline,
          updated_at: new Date().toISOString()
        })
        .eq('id', step.id);

      if (error) throw error;
      setTimelineStatus({ loading: false, message: `ეტაპი #${step.step_number} წარმატებით განახლდა!` });
      await fetchTimelineSteps();
    } catch (err) {
      console.error('Save timeline step error:', err);
      setTimelineStatus({ loading: false, message: 'ეტაპის შენახვა ვერ მოხერხდა.' });
    }
  };

  // 4. Fetch & Manage News
  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false });

      if (!error && data) {
        setNewsList(data);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
    }
  };

  const handleNewsImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewsImageUploading(true);
    try {
      const filePath = `news/${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('news-images')
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData?.publicUrl || filePath;
      setNewsForm((prev) => ({ ...prev, image_url: imageUrl }));
    } catch (err) {
      console.error('News image upload error:', err);
      alert('სურათის ატვირთვა ვერ მოხერხდა.');
    } finally {
      setNewsImageUploading(false);
    }
  };

  const handleSaveNews = async (e) => {
    e.preventDefault();
    setNewsStatus({ loading: true, message: '' });

    try {
      if (isEditingNews && newsForm.id) {
        // UPDATE news item
        const { error } = await supabase
          .from('news')
          .update({
            title: newsForm.title,
            content: newsForm.content,
            image_url: newsForm.image_url,
            is_published: newsForm.is_published
          })
          .eq('id', newsForm.id);

        if (error) throw error;
        setNewsStatus({ loading: false, message: 'სიახლე წარმატებით განახლდა!' });
      } else {
        // INSERT new news item
        const { error } = await supabase
          .from('news')
          .insert([
            {
              title: newsForm.title,
              content: newsForm.content,
              image_url: newsForm.image_url,
              is_published: newsForm.is_published,
              published_at: new Date().toISOString()
            }
          ]);

        if (error) throw error;
        setNewsStatus({ loading: false, message: 'ახალი სიახლე გამოქვეყნდა!' });
      }

      setNewsForm({ id: null, title: '', content: '', image_url: '', is_published: true });
      setIsEditingNews(false);
      await fetchNews();
    } catch (err) {
      console.error('Save news error:', err);
      setNewsStatus({ loading: false, message: err.message || 'სიახლის შენახვა ვერ მოხერხდა.' });
    }
  };

  const handleToggleNewsPublish = async (newsItem) => {
    try {
      const { error } = await supabase
        .from('news')
        .update({ is_published: !newsItem.is_published })
        .eq('id', newsItem.id);

      if (error) throw error;
      await fetchNews();
    } catch (err) {
      console.error('Toggle news publish error:', err);
    }
  };

  const handleDeleteNews = async (newsId) => {
    if (!window.confirm('ნამდვილად გსურთ ამ სიახლის წაშლა?')) return;

    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', newsId);

      if (error) throw error;
      await fetchNews();
    } catch (err) {
      console.error('Delete news error:', err);
    }
  };

  if (!user || role !== 'admin') {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <ShieldAlert size={48} style={{ color: '#ef4444', margin: '0 auto 16px' }} />
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '16px' }}>
          ადმინისტრაციული წვდომა შეზღუდულია
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          ეს გვერდი განკუთვნილია მხოლოდ სკოლის დირექციისა და ადმინისტრაციისთვის.
        </p>
        <button onClick={() => navigate('/register')} className="btn btn-primary">
          ადმინისტრაციის შესვლა
        </button>
      </div>
    );
  }

  const pendingEditsCount = pendingEdits.filter(e => e.status === 'pending').length;

  return (
    <div className="admin-dashboard-wrapper fade-in" style={{ padding: '40px 0 80px', background: 'var(--bg-primary)' }}>
      <div className="container">
        
        {/* Header bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
          <div>
            <button className="back-link-btn" onClick={() => navigate('/')} style={{ marginBottom: '8px' }}>
              <ArrowLeft size={16} className="icon-mr" />
              მთავარ გვერდზე დაბრუნება
            </button>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--text-dark)' }}>
              სკოლის ადმინისტრაციული პანელი (დირექცია)
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              მართეთ მასწავლებელთა მოდერაცია, განაცხადები, მიღების ეტაპები და სკოლის სიახლეები.
            </p>
          </div>

          <div style={{ background: 'rgba(128,0,32,0.08)', padding: '12px 20px', borderRadius: '8px', border: '1px solid var(--accent-primary)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', display: 'block', fontWeight: 600 }}>როლი:</span>
            <strong style={{ fontSize: '1.05rem', color: 'var(--text-dark)' }}>ადმინისტრატორი / დირექტორი</strong>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '4px' }}>
          <button
            type="button"
            className={`btn ${activeTab === 'edits' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}
            onClick={() => setActiveTab('edits')}
          >
            <UserCheck size={18} />
            პროფილების მოდერაცია
            {pendingEditsCount > 0 && (
              <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', marginLeft: '4px' }}>
                {pendingEditsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className={`btn ${activeTab === 'queue' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => setActiveTab('queue')}
          >
            <FileText size={18} />
            განაცხადები & ვიზიტები ({applications.length + visitBookings.length})
          </button>

          <button
            type="button"
            className={`btn ${activeTab === 'timeline' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => setActiveTab('timeline')}
          >
            <Calendar size={18} />
            მიღების ეტაპების მართვა
          </button>

          <button
            type="button"
            className={`btn ${activeTab === 'news' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => setActiveTab('news')}
          >
            <Newspaper size={18} />
            სიახლეების მართვა ({newsList.length})
          </button>
        </div>

        {/* SECTION 1: TEACHER PROFILE MODERATION QUEUE */}
        {activeTab === 'edits' && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '20px', color: 'var(--text-dark)' }}>
              მასწავლებელთა ცვლილებების მოდერაციის რიგი
            </h3>

            {editsStatus.message && (
              <div className="form-feedback success" style={{ marginBottom: '20px' }}>
                {editsStatus.message}
              </div>
            )}

            {pendingEdits.length === 0 ? (
              <div style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={36} style={{ color: '#16a34a', marginBottom: '8px' }} />
                <p>მოდერაციის რიგი ცარიელია. ყველა ცვლილება განხილულია!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                {pendingEdits.map((editItem) => {
                  const live = editItem.teachers;
                  const prop = editItem.proposed_data;

                  return (
                    <div
                      key={editItem.id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '24px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                        <div>
                          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600, color: editItem.status === 'pending' ? '#c9751d' : editItem.status === 'approved' ? '#16a34a' : '#dc2626' }}>
                            სტატუსი: {editItem.status === 'pending' ? 'განხილვის პროცესში' : editItem.status === 'approved' ? 'დამტკიცებული' : 'უარყოფილი'}
                          </span>
                          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-dark)', margin: '4px 0 0' }}>
                            {live.full_name} ({live.subject})
                          </h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            გაგზავნილია: {new Date(editItem.submitted_at).toLocaleString('ka-GE')}
                          </span>
                        </div>

                        {editItem.status === 'pending' && (
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                              type="button"
                              onClick={() => handleApproveEdit(editItem)}
                              className="btn btn-primary btn-sm"
                              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#16a34a', borderColor: '#16a34a' }}
                            >
                              <CheckCircle2 size={16} />
                              დამტკიცება
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedEdit(selectedEdit === editItem.id ? null : editItem.id)}
                              className="btn btn-secondary btn-sm"
                              style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                            >
                              <XCircle size={16} />
                              უარყოფა
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Rejection input toggle */}
                      {selectedEdit === editItem.id && (
                        <div style={{ background: '#fef2f2', padding: '16px', borderRadius: '6px', marginBottom: '16px' }}>
                          <label className="form-label" style={{ color: '#991b1b' }}>უარყოფის მიზეზი / შენიშვნა პედაგოგს:</label>
                          <textarea
                            className="form-control"
                            rows="2"
                            placeholder="დაწერეთ შენიშვნა..."
                            value={rejectionNote}
                            onChange={(e) => setRejectionNote(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => handleRejectEdit(editItem)}
                            className="btn btn-primary btn-sm mt-2"
                            style={{ background: '#dc2626', borderColor: '#dc2626' }}
                          >
                            უარყოფის დადასტურება
                          </button>
                        </div>
                      )}

                      {/* Side-by-Side Comparison: Current Live vs Proposed */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: '6px' }}>
                        {/* Live */}
                        <div style={{ borderRight: '1px solid var(--border-color)', paddingRight: '12px' }}>
                          <strong style={{ fontSize: '0.9rem', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                            🔴 ამჟამინდელი საჯარო ვერსია:
                          </strong>
                          <p style={{ fontSize: '0.88rem', margin: '4px 0' }}><strong>სახელი:</strong> {live.full_name}</p>
                          <p style={{ fontSize: '0.88rem', margin: '4px 0' }}><strong>საგანი:</strong> {live.subject}</p>
                          <p style={{ fontSize: '0.88rem', margin: '4px 0' }}><strong>განათლება:</strong> {live.education || 'არ არის'}</p>
                          <p style={{ fontSize: '0.88rem', margin: '4px 0' }}><strong>გამოცდილება:</strong> {live.experience_years || 'არ არის'}</p>
                          <p style={{ fontSize: '0.88rem', margin: '4px 0' }}><strong>სერტიფიკატები:</strong> {live.certifications || 'არ არის'}</p>
                        </div>

                        {/* Proposed */}
                        <div>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', display: 'block', marginBottom: '8px' }}>
                            🟢 ახალი მოთხოვნილი ცვლილებები:
                          </strong>
                          <p style={{ fontSize: '0.88rem', margin: '4px 0', color: prop.full_name !== live.full_name ? 'var(--accent-primary)' : 'inherit' }}>
                            <strong>სახელი:</strong> {prop.full_name}
                          </p>
                          <p style={{ fontSize: '0.88rem', margin: '4px 0', color: prop.subject !== live.subject ? 'var(--accent-primary)' : 'inherit' }}>
                            <strong>საგანი:</strong> {prop.subject}
                          </p>
                          <p style={{ fontSize: '0.88rem', margin: '4px 0', color: prop.education !== live.education ? 'var(--accent-primary)' : 'inherit' }}>
                            <strong>განათლება:</strong> {prop.education || 'არ არის'}
                          </p>
                          <p style={{ fontSize: '0.88rem', margin: '4px 0', color: prop.experience_years !== live.experience_years ? 'var(--accent-primary)' : 'inherit' }}>
                            <strong>გამოცდილება:</strong> {prop.experience_years || 'არ არის'}
                          </p>
                          <p style={{ fontSize: '0.88rem', margin: '4px 0', color: prop.certifications !== live.certifications ? 'var(--accent-primary)' : 'inherit' }}>
                            <strong>სერტიფიკატები:</strong> {prop.certifications || 'არ არის'}
                          </p>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: APPLICATIONS & VISIT BOOKINGS QUEUE */}
        {activeTab === 'queue' && (
          <div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button
                type="button"
                className={`btn ${queueTab === 'applications' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setQueueTab('applications')}
              >
                ონლაინ განაცხადები ({applications.length})
              </button>
              <button
                type="button"
                className={`btn ${queueTab === 'bookings' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setQueueTab('bookings')}
              >
                ვიზიტის ჯავშნები ({visitBookings.length})
              </button>
            </div>

            {/* Applications list */}
            {queueTab === 'applications' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '16px', color: 'var(--text-dark)' }}>
                  შემოსული ონლაინ განაცხადები
                </h3>

                {applications.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>განაცხადები ჯერ არ არის შემოსული.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {applications.map((app) => (
                      <div key={app.id} style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '12px', background: app.status === 'accepted' ? '#dcfce7' : app.status === 'rejected' ? '#fee2e2' : '#fef3c7', color: app.status === 'accepted' ? '#15803d' : app.status === 'rejected' ? '#b91c1c' : '#b45309' }}>
                              სტატუსი: {app.status === 'submitted' ? 'შემოსულია' : app.status === 'under_review' ? 'განხილვაშია' : app.status === 'accepted' ? 'მიღებულია' : 'უარყოფილია'}
                            </span>
                            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--text-dark)', marginTop: '6px' }}>
                              მოსწავლე: {app.student_full_name} ({app.grade_stage})
                            </h4>
                          </div>

                          {/* Status Change Selector */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>სტატუსის შეცვლა:</span>
                            <select
                              className="form-control"
                              style={{ padding: '4px 8px', fontSize: '0.85rem' }}
                              value={app.status}
                              onChange={(e) => handleUpdateAppStatus(app.id, e.target.value)}
                            >
                              <option value="submitted">შემოსული (submitted)</option>
                              <option value="under_review">განხილვაში (under_review)</option>
                              <option value="accepted">მიღებული (accepted)</option>
                              <option value="rejected">უარყოფილი (rejected)</option>
                            </select>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '0.9rem', color: 'var(--text-dark)', background: 'var(--bg-secondary)', padding: '12px', borderRadius: '6px' }}>
                          <div><strong>მშობელი:</strong> {app.parent_full_name}</div>
                          <div><strong>პირადი N:</strong> {app.parent_id_number || 'არ არის'}</div>
                          <div><strong>მისამართი:</strong> {app.parent_address || 'არ არის'}</div>
                          <div><strong>თარიღი:</strong> {new Date(app.created_at).toLocaleDateString('ka-GE')}</div>
                          <div><strong>დაბადების თარიღი:</strong> {app.student_date_of_birth || 'არ არის'}</div>
                          <div><strong>შენიშვნა:</strong> {app.additional_notes || 'არ არის'}</div>
                        </div>

                        {/* Documents */}
                        {app.application_documents?.length > 0 && (
                          <div style={{ marginTop: '12px' }}>
                            <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ატვირთული დოკუმენტები:</strong>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                              {app.application_documents.map((doc) => (
                                <a
                                  key={doc.id}
                                  href={doc.file_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{ fontSize: '0.82rem', color: 'var(--accent-primary)', textDecoration: 'underline' }}
                                >
                                  📄 {doc.document_type}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Visit Bookings list */}
            {queueTab === 'bookings' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '16px', color: 'var(--text-dark)' }}>
                  შემოსული ვიზიტის ჯავშნები
                </h3>

                {visitBookings.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>ვიზიტის ჯავშნები ჯერ არ არის შემოსული.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {visitBookings.map((b) => (
                      <div key={b.id} style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '12px', background: b.status === 'confirmed' ? '#dcfce7' : b.status === 'declined' ? '#fee2e2' : '#fef3c7', color: b.status === 'confirmed' ? '#15803d' : b.status === 'declined' ? '#b91c1c' : '#b45309' }}>
                              სტატუსი: {b.status === 'pending' ? 'მოლოდინში' : b.status === 'confirmed' ? 'დადასტურებულია' : 'უარყოფილია'}
                            </span>
                            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--text-dark)', marginTop: '6px' }}>
                              სახელი: {b.child_name} ({b.phone})
                            </h4>
                            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                              სასურველი თარიღი: <strong>{b.preferred_date}</strong> | საფეხური: {b.grade_stage || 'არ არის'}
                            </p>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')}
                              className="btn btn-primary btn-sm"
                              style={{ background: '#16a34a', borderColor: '#16a34a' }}
                            >
                              დადასტურება
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateBookingStatus(b.id, 'declined')}
                              className="btn btn-secondary btn-sm"
                              style={{ color: '#dc2626' }}
                            >
                              უარყოფა
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: ADMISSIONS TIMELINE MANAGEMENT */}
        {activeTab === 'timeline' && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '8px', color: 'var(--text-dark)' }}>
              მიღების ეტაპების მართვა
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
              აქ განახლებული ინფორმაცია დაუყოვნებლივ გამოჩნდება სკოლის მთავარი გვერდის "მიღება" სექციაში.
            </p>

            {timelineStatus.message && (
              <div className="form-feedback success" style={{ marginBottom: '20px' }}>
                {timelineStatus.message}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {timelineSteps.map((step, idx) => (
                <div key={step.id || idx} style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                      0{step.step_number}
                    </span>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--text-dark)', margin: 0 }}>
                      {step.title}
                    </h4>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '16px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">სათაური</label>
                      <input
                        type="text"
                        className="form-control"
                        value={step.title}
                        onChange={(e) => {
                          const updated = [...timelineSteps];
                          updated[idx].title = e.target.value;
                          setTimelineSteps(updated);
                        }}
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">აღწერა</label>
                      <input
                        type="text"
                        className="form-control"
                        value={step.description}
                        onChange={(e) => {
                          const updated = [...timelineSteps];
                          updated[idx].description = e.target.value;
                          setTimelineSteps(updated);
                        }}
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">ვადა / თარიღი</label>
                      <input
                        type="text"
                        className="form-control"
                        value={step.deadline}
                        onChange={(e) => {
                          const updated = [...timelineSteps];
                          updated[idx].deadline = e.target.value;
                          setTimelineSteps(updated);
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSaveTimelineStep(step)}
                    className="btn btn-primary btn-sm mt-3"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Save size={14} />
                    ეტაპის შენახვა
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: NEWS MANAGEMENT */}
        {activeTab === 'news' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            
            {/* Form */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-dark)', margin: 0 }}>
                  {isEditingNews ? 'სიახლის რედაქტირება' : 'ახალი სიახლის დამატება'}
                </h3>
                {isEditingNews && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setIsEditingNews(false);
                      setNewsForm({ id: null, title: '', content: '', image_url: '', is_published: true });
                    }}
                  >
                    <XCircle size={14} className="icon-mr" />
                    გაუქმება
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveNews}>
                <div className="form-group">
                  <label className="form-label">სიახლის სათაური *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="მაგ: STEM ლაბორატორიის გახსნა..."
                    value={newsForm.title}
                    onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  />
                </div>

                {/* News Image Upload */}
                <div className="form-group">
                  <label className="form-label">ილუსტრაცია / ფოტო URL</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ფოტოს URL ან ატვირთეთ..."
                      value={newsForm.image_url}
                      onChange={(e) => setNewsForm({ ...newsForm, image_url: e.target.value })}
                    />
                    <label className="btn btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Upload size={16} />
                      {newsImageUploading ? 'ატვირთვა...' : 'ფაილი'}
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleNewsImageUpload} />
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">სიახლის ტექსტი / შინაარსი *</label>
                  <textarea
                    required
                    rows="6"
                    className="form-control"
                    placeholder="დეტალური ტექსტი..."
                    value={newsForm.content}
                    onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="news-publish-check"
                    checked={newsForm.is_published}
                    onChange={(e) => setNewsForm({ ...newsForm, is_published: e.target.checked })}
                  />
                  <label htmlFor="news-publish-check" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                    დაუყოვნებლივ გამოქვეყნება (საჯარო)
                  </label>
                </div>

                <button type="submit" disabled={newsStatus.loading} className="btn btn-primary w-full mt-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Save size={18} />
                  {newsStatus.loading ? 'ინახება...' : isEditingNews ? 'ცვლილებების შენახვა' : 'სიახლის გამოქვეყნება'}
                </button>

                {newsStatus.message && (
                  <div className={`form-feedback ${newsStatus.loading ? '' : 'success'}`} style={{ marginTop: '12px' }}>
                    {newsStatus.message}
                  </div>
                )}
              </form>
            </div>

            {/* Existing News List */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '20px', color: 'var(--text-dark)' }}>
                გამოქვეყნებული სიახლეები
              </h3>

              {newsList.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>სიახლეები ჯერ არ არის დამატებული.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {newsList.map((n) => (
                    <div key={n.id} style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: '12px', background: n.is_published ? '#dcfce7' : '#fee2e2', color: n.is_published ? '#15803d' : '#b91c1c' }}>
                            {n.is_published ? 'გამოქვეყნებული' : 'დრაფტი'}
                          </span>
                          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--text-dark)', marginTop: '4px' }}>
                            {n.title}
                          </h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {new Date(n.published_at).toLocaleDateString('ka-GE')}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleNewsPublish(n)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.75rem' }}
                          >
                            {n.is_published ? 'დამალვა' : 'გამოქვეყნება'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setNewsForm({ id: n.id, title: n.title, content: n.content, image_url: n.image_url || '', is_published: n.is_published });
                              setIsEditingNews(true);
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)', padding: '4px' }}
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteNews(n.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
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
