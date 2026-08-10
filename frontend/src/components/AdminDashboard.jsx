import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';
import { UserCheck, FileText, Newspaper, CheckCircle2, XCircle, Edit3, Trash2, Save, Upload, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function AdminDashboard() {
  const { user, role, navigate } = useAuth();
  
  // Dashboard Active Tab: 'edits', 'queue', 'news'
  const [activeTab, setActiveTab] = useState('edits');

  // --- 1. Teacher Profile Edits State ---
  const [pendingEdits, setPendingEdits] = useState([]);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const [rejectionNote, setRejectionNote] = useState('');
  const [editsStatus, setEditsStatus] = useState({ loading: false, message: '' });

  // --- 2. Applications State ---
  const [applications, setApplications] = useState([]);

  // --- 3. News State ---
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

  // 2. Fetch Applications
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

  // 3. News Management
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
        const { error } = await supabase
          .from('news')
          .insert([
            {
              title: newsForm.title,
              content: newsForm.content,
              image_url: newsForm.image_url,
              is_published: newsForm.is_published,
              author_id: user.id
            }
          ]);

        if (error) throw error;
        setNewsStatus({ loading: false, message: 'ახალი სიახლე წარმატებით დაემატა!' });
      }

      setNewsForm({ id: null, title: '', content: '', image_url: '', is_published: true });
      setIsEditingNews(false);
      await fetchNews();
    } catch (err) {
      console.error('Save news error:', err);
      setNewsStatus({ loading: false, message: 'სიახლის შენახვა ვერ მოხერხდა.' });
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

  if (!user || role !== 'admin') {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <ShieldAlert size={48} className="text-burgundy" style={{ margin: '0 auto 16px' }} />
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '16px' }}>
          წვდომა შეზღუდულია
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          ეს გვერდი განკუთვნილია მხოლოდ სკოლის ადმინისტრატორებისთვის.
        </p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          მთავარ გვერდზე დაბრუნება
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
              მართეთ მასწავლებელთა მოდერაცია, ონლაინ განაცხადები და სკოლის სიახლეები.
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
            ონლაინ განაცხადები ({applications.length})
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
              <div style={{ background: 'var(--bg-secondary)', padding: '32px', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)' }}>
                მოდერაციისთვის განაცხადები არ არის.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {pendingEdits.map((edit) => {
                  const teacher = edit.teachers;
                  const proposed = edit.proposed_data;
                  const isPending = edit.status === 'pending';

                  return (
                    <div
                      key={edit.id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '24px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '3px 10px', borderRadius: '12px', background: isPending ? '#fef3c7' : edit.status === 'approved' ? '#dcfce7' : '#fee2e2', color: isPending ? '#b45309' : edit.status === 'approved' ? '#15803d' : '#b91c1c', textTransform: 'uppercase' }}>
                            სტატუსი: {isPending ? 'განხილვის მოლოდინში' : edit.status === 'approved' ? 'დადასტურებულია' : 'უარყოფილია'}
                          </span>
                          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--text-dark)', marginTop: '8px' }}>
                            {teacher?.full_name} ({teacher?.subject})
                          </h4>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            გამოგზავნილია: {new Date(edit.submitted_at).toLocaleString('ka-GE')}
                          </span>
                        </div>

                        {isPending && (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleApproveEdit(edit)}
                              disabled={editsStatus.loading}
                              className="btn btn-primary btn-sm"
                              style={{ background: '#16a34a', borderColor: '#16a34a', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                              <CheckCircle2 size={16} />
                              დადასტურება
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedEdit(edit)}
                              disabled={editsStatus.loading}
                              className="btn btn-secondary btn-sm"
                              style={{ color: '#dc2626', borderColor: '#fca5a5', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                              <XCircle size={16} />
                              უარყოფა
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Comparison: Current vs Proposed */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', fontSize: '0.88rem' }}>
                        <div>
                          <strong style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
                            მიმდინარე მონაცემები:
                          </strong>
                          <p><strong>სახელი:</strong> {teacher?.full_name}</p>
                          <p><strong>საგანი:</strong> {teacher?.subject}</p>
                          <p><strong>ბიო:</strong> {teacher?.bio || '—'}</p>
                          <p><strong>განათლება:</strong> {teacher?.education || '—'}</p>
                          <p><strong>გამოცდილება:</strong> {teacher?.experience_years || '—'}</p>
                          <p><strong>სერტიფიკატები:</strong> {teacher?.certifications || '—'}</p>
                          <p><strong>სტაჟი სკოლაში:</strong> {teacher?.years_at_school || '—'}</p>
                        </div>

                        <div>
                          <strong style={{ color: 'var(--accent-primary)', display: 'block', marginBottom: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
                            შემოთავაზებული ახალი ცვლილებები:
                          </strong>
                          <p style={{ color: proposed?.full_name !== teacher?.full_name ? 'var(--accent-primary)' : 'inherit' }}>
                            <strong>სახელი:</strong> {proposed?.full_name}
                          </p>
                          <p style={{ color: proposed?.subject !== teacher?.subject ? 'var(--accent-primary)' : 'inherit' }}>
                            <strong>საგანი:</strong> {proposed?.subject}
                          </p>
                          <p style={{ color: proposed?.bio !== teacher?.bio ? 'var(--accent-primary)' : 'inherit' }}>
                            <strong>ბიო:</strong> {proposed?.bio || '—'}
                          </p>
                          <p style={{ color: proposed?.education !== teacher?.education ? 'var(--accent-primary)' : 'inherit' }}>
                            <strong>განათლება:</strong> {proposed?.education || '—'}
                          </p>
                          <p style={{ color: proposed?.experience_years !== teacher?.experience_years ? 'var(--accent-primary)' : 'inherit' }}>
                            <strong>გამოცდილება:</strong> {proposed?.experience_years || '—'}
                          </p>
                          <p style={{ color: proposed?.certifications !== teacher?.certifications ? 'var(--accent-primary)' : 'inherit' }}>
                            <strong>სერტიფიკატები:</strong> {proposed?.certifications || '—'}
                          </p>
                          <p style={{ color: proposed?.years_at_school !== teacher?.years_at_school ? 'var(--accent-primary)' : 'inherit' }}>
                            <strong>სტაჟი სკოლაში:</strong> {proposed?.years_at_school || '—'}
                          </p>
                        </div>
                      </div>

                      {/* Rejection Note input if clicked */}
                      {selectedEdit?.id === edit.id && (
                        <div style={{ marginTop: '16px', padding: '16px', background: '#fee2e2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                          <label className="form-label" style={{ color: '#991b1b', fontWeight: 600 }}>
                            უარყოფის მიზეზი (შენიშვნა მასწავლებლისთვის):
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="მაგ: გთხოვთ მიუთითოთ ზუსტი დიპლომის მონაცემები..."
                            value={rejectionNote}
                            onChange={(e) => setRejectionNote(e.target.value)}
                            style={{ marginBottom: '12px' }}
                          />
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleRejectEdit(edit)}
                              className="btn btn-primary btn-sm"
                              style={{ background: '#dc2626', borderColor: '#dc2626' }}
                            >
                              უარყოფის დადასტურება
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedEdit(null)}
                              className="btn btn-secondary btn-sm"
                            >
                              გაუქმება
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: ONLINE APPLICATIONS QUEUE */}
        {activeTab === 'queue' && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '20px', color: 'var(--text-dark)' }}>
              შემოსული ონლაინ განაცხადები
            </h3>

            {applications.length === 0 ? (
              <div style={{ background: 'var(--bg-secondary)', padding: '32px', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)' }}>
                განაცხადები ჯერ არ არის შემოსული.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {applications.map((app) => (
                  <div key={app.id} style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '12px', background: app.status === 'accepted' ? '#dcfce7' : app.status === 'rejected' ? '#fee2e2' : '#fef3c7', color: app.status === 'accepted' ? '#15803d' : app.status === 'rejected' ? '#b91c1c' : '#b45309' }}>
                          სტატუსი: {app.status === 'submitted' ? 'შემოსულია' : app.status === 'under_review' ? 'განხილვაშია' : app.status === 'accepted' ? 'მიღებულია' : 'უარყოფილია'}
                        </span>
                        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-dark)', marginTop: '6px' }}>
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
                        <div style={{ display: 'flex', gap: '12px', marginTop: '6px', flexWrap: 'wrap' }}>
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

        {/* SECTION 3: NEWS MANAGEMENT */}
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
