import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';
import {
  UserCheck,
  FileText,
  Newspaper,
  CheckCircle2,
  XCircle,
  Edit3,
  Trash2,
  Save,
  Upload,
  ArrowLeft,
  ShieldAlert,
  Key,
  Search,
  Filter,
  Users,
  GraduationCap,
  LogOut,
  ExternalLink,
  Clock,
  Sparkles,
  RefreshCw,
  Copy,
  Plus,
  Phone,
  Mail,
  Calendar,
  Eye,
  Check,
  Download,
  AlertCircle,
  Layers,
  ChevronRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, role, navigate, logout } = useAuth();

  // Active Tab: 'overview' | 'edits' | 'queue' | 'news' | 'codes' | 'teachers'
  const [activeTab, setActiveTab] = useState('overview');

  // --- Search & Filters ---
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('all');
  const [appGradeFilter, setAppGradeFilter] = useState('all');

  const [editFilter, setEditFilter] = useState('all');
  const [teacherSearch, setTeacherSearch] = useState('');

  // --- 1. Teacher Profile Edits State ---
  const [pendingEdits, setPendingEdits] = useState([]);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const [rejectionNote, setRejectionNote] = useState('');
  const [editsStatus, setEditsStatus] = useState({ loading: false, message: '', type: '' });

  // --- 2. Applications State ---
  const [applications, setApplications] = useState([]);
  const [appUpdatingId, setAppUpdatingId] = useState(null);

  // --- 3. News State ---
  const [newsList, setNewsList] = useState([]);
  const [newsForm, setNewsForm] = useState({
    id: null,
    title: '',
    content: '',
    image_url: '',
    is_published: true
  });
  const [newsStatus, setNewsStatus] = useState({ loading: false, message: '', type: '' });
  const [newsImageUploading, setNewsImageUploading] = useState(false);
  const [isEditingNews, setIsEditingNews] = useState(false);

  // --- 4. Invite Codes State ---
  const [inviteCodes, setInviteCodes] = useState([]);
  const [newCodeInput, setNewCodeInput] = useState('');
  const [codeGenerating, setCodeGenerating] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  // --- 5. Teachers List State ---
  const [teachersList, setTeachersList] = useState([]);

  // --- Toast Notification ---
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // --- Vanta.NET 3D Background Effect ---
  const vantaRef = React.useRef(null);

  useEffect(() => {
    let effect = null;
    let timer = null;

    const initVanta = () => {
      if (!vantaRef.current) return;
      if (effect) {
        try { effect.destroy(); } catch (e) {}
      }
      if (window.VANTA && window.VANTA.NET) {
        try {
          effect = window.VANTA.NET({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 0.5,
            color: 0xc41e3a,
            backgroundColor: 0x140709,
            points: 8.0,
            maxDistance: 16.0,
            spacing: 22.0
          });
        } catch (err) {
          console.warn('Vanta initialization warning:', err);
        }
      }
    };

    const tryInit = () => {
      if (vantaRef.current && window.VANTA && window.VANTA.NET) {
        initVanta();
      } else {
        timer = setInterval(() => {
          if (vantaRef.current && window.VANTA && window.VANTA.NET) {
            initVanta();
            clearInterval(timer);
          }
        }, 80);
      }
    };

    const initTimer = setTimeout(tryInit, 50);

    return () => {
      clearTimeout(initTimer);
      if (timer) clearInterval(timer);
      if (effect) {
        try { effect.destroy(); } catch (e) {}
      }
    };
  }, [user, role]);

  // Real-time Date
  const [currentDateStr, setCurrentDateStr] = useState('');
  useEffect(() => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDateStr(new Date().toLocaleDateString('ka-GE', options));
  }, []);

  // Initial Data Fetching
  useEffect(() => {
    if (role === 'admin') {
      fetchAllData();
    }
  }, [role]);

  const fetchAllData = async () => {
    fetchPendingEdits();
    fetchApplications();
    fetchNews();
    fetchInviteCodes();
    fetchTeachers();
  };

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
    setEditsStatus({ loading: true, message: '', type: '' });
    try {
      const proposed = editItem.proposed_data;

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
      await fetchTeachers();
      showToast('პროფილის ცვლილება წარმატებით დადასტურდა!', 'success');
      setEditsStatus({ loading: false, message: 'პროფილის ცვლილება წარმატებით დადასტურდა!', type: 'success' });
    } catch (err) {
      console.error('Approve edit error:', err);
      showToast('დადასტურებისას დაფიქსირდა შეცდომა.', 'error');
      setEditsStatus({ loading: false, message: 'დადასტურებისას დაფიქსირდა შეცდომა.', type: 'error' });
    }
  };

  const handleRejectEdit = async (editItem) => {
    setEditsStatus({ loading: true, message: '', type: '' });
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
      showToast('პროფილის ცვლილება უარყოფილია.', 'info');
      setEditsStatus({ loading: false, message: 'პროფილის ცვლილება უარყოფილია.', type: 'info' });
    } catch (err) {
      console.error('Reject edit error:', err);
      showToast('უარყოფისას დაფიქსირდა შეცდომა.', 'error');
      setEditsStatus({ loading: false, message: 'უარყოფისას დაფიქსირდა შეცდომა.', type: 'error' });
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
    setAppUpdatingId(appId);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', appId);

      if (error) throw error;
      await fetchApplications();
      showToast('განაცხადის სტატუსი განახლდა!', 'success');
    } catch (err) {
      console.error('Error updating application status:', err);
      showToast('სტატუსის განახლება ვერ მოხერხდა.', 'error');
    } finally {
      setAppUpdatingId(null);
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
      const filePath = `news/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('news-images')
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData?.publicUrl || filePath;
      setNewsForm((prev) => ({ ...prev, image_url: imageUrl }));
      showToast('სურათი წარმატებით აიტვირთა!', 'success');
    } catch (err) {
      console.error('News image upload error:', err);
      showToast('სურათის ატვირთვა ვერ მოხერხდა. მიუთითეთ პირდაპირი URL.', 'error');
    } finally {
      setNewsImageUploading(false);
    }
  };

  const handleSaveNews = async (e) => {
    e.preventDefault();
    setNewsStatus({ loading: true, message: '', type: '' });
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
        showToast('სიახლე წარმატებით განახლდა!', 'success');
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
        showToast('ახალი სიახლე წარმატებით გამოქვეყნდა!', 'success');
      }

      setNewsForm({ id: null, title: '', content: '', image_url: '', is_published: true });
      setIsEditingNews(false);
      await fetchNews();
    } catch (err) {
      console.error('Save news error:', err);
      showToast('სიახლის შენახვა ვერ მოხერხდა.', 'error');
    } finally {
      setNewsStatus({ loading: false, message: '', type: '' });
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
      showToast('სიახლე წაიშალა.', 'info');
    } catch (err) {
      console.error('Delete news error:', err);
      showToast('წაშლა ვერ მოხერხდა.', 'error');
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
      showToast(newsItem.is_published ? 'სიახლე გადავიდა დრაფტებში.' : 'სიახლე გამოქვეყნდა!', 'success');
    } catch (err) {
      console.error('Toggle news publish error:', err);
    }
  };

  // 4. Invite Codes Management
  const fetchInviteCodes = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiBase}/api/create-invite-code`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.codes) {
          setInviteCodes(json.codes);
          return;
        }
      }
    } catch (e) {
      console.warn('API fetch failed, falling back to direct supabase query', e);
    }

    try {
      const { data, error } = await supabase
        .from('invite_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setInviteCodes(data);
      }
    } catch (err) {
      console.error('Error fetching invite codes:', err);
    }
  };

  const handleGenerateCode = async () => {
    setCodeGenerating(true);
    try {
      let codeToInsert = newCodeInput.trim().toUpperCase();
      const apiBase = import.meta.env.VITE_API_URL || '';

      const res = await fetch(`${apiBase}/api/create-invite-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeToInsert })
      });

      let json = {};
      try {
        json = await res.json();
      } catch (parseErr) {
        throw new Error('სერვერის პასუხის დამუშავება ვერ მოხერხდა.');
      }

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'კოდის შექმნა ვერ მოხერხდა.');
      }

      setNewCodeInput('');
      await fetchInviteCodes();
      showToast(json.message || 'კოდი წარმატებით შეიქმნა!', 'success');
    } catch (err) {
      console.error('Generate code error:', err);
      try {
        let codeToInsert = newCodeInput.trim().toUpperCase();
        if (!codeToInsert) {
          const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
          codeToInsert = `SOL-${new Date().getFullYear()}-${rand}`;
        }
        const { error } = await supabase
          .from('invite_codes')
          .insert([{ code: codeToInsert, is_active: true }]);
        if (error) throw error;
        setNewCodeInput('');
        await fetchInviteCodes();
        showToast(`კოდი ${codeToInsert} წარმატებით შეიქმნა!`, 'success');
      } catch (fallbackErr) {
        showToast(err.message || 'კოდის შექმნა ვერ მოხერხდა.', 'error');
      }
    } finally {
      setCodeGenerating(false);
    }
  };

  const handleGenerateBatch50 = async () => {
    if (!window.confirm('ნამდვილად გსურთ 50 ახალი მრავალჯერადი კოდის ერთიანად გენერაცია?')) return;
    setCodeGenerating(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiBase}/api/create-invite-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generateBatch: 50 })
      });
      let json = {};
      try {
        json = await res.json();
      } catch (parseErr) {
        throw new Error('სერვერის პასუხის დამუშავება ვერ მოხერხდა.');
      }
      if (!res.ok || !json.success) throw new Error(json.message);
      await fetchInviteCodes();
      showToast('🎉 50 ახალი კოდი წარმატებით დაემატა!', 'success');
    } catch (err) {
      console.error('Batch generation error:', err);
      showToast(err.message || 'კოდების გენერაცია ვერ მოხერხდა.', 'error');
    } finally {
      setCodeGenerating(false);
    }
  };

  // 5. Teachers Directory
  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('full_name', { ascending: true });

      if (!error && data) {
        setTeachersList(data);
      }
    } catch (err) {
      console.error('Error fetching teachers list:', err);
    }
  };

  const handleDeleteTeacher = async (teacherId, teacherName) => {
    if (!window.confirm(`ნამდვილად გსურთ მასწავლებლის "${teacherName}" წაშლა სისტემიდან?`)) return;

    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiBase}/api/delete-teacher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId })
      });

      let json = {};
      try {
        json = await res.json();
      } catch (parseErr) {
        throw new Error('სერვერის პასუხის დამუშავება ვერ მოხერხდა.');
      }

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'წაშლა ვერ მოხერხდა.');
      }

      await fetchTeachers();
      await fetchPendingEdits();
      showToast(`მასწავლებელი "${teacherName}" წარმატებით წაიშალა!`, 'info');
    } catch (err) {
      console.error('Delete teacher error:', err);
      // Direct client fallback
      try {
        await supabase.from('teacher_profile_edits').delete().eq('teacher_id', teacherId);
        const { error: delErr } = await supabase.from('teachers').delete().eq('id', teacherId);
        if (delErr) throw delErr;
        await fetchTeachers();
        await fetchPendingEdits();
        showToast(`მასწავლებელი "${teacherName}" წაიშალა!`, 'info');
      } catch (fallbackErr) {
        showToast(err.message || 'მასწავლებლის წაშლა ვერ მოხერხდა.', 'error');
      }
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`კოდი "${code}" დაკოპირდა ბუფერში!`, 'success');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Access Control Guard
  if (!user || role !== 'admin') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #18090b 0%, #2a0e12 50%, #140709 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '48px 36px',
          maxWidth: '480px',
          textAlign: 'center',
          color: '#fff',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(16px)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #8b0000, #c41e3a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: '#fff',
            boxShadow: '0 8px 24px rgba(139, 0, 0, 0.4)'
          }}>
            <ShieldAlert size={32} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: '1.75rem', marginBottom: '12px', color: '#fff' }}>
            წვდომა შეზღუდულია
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '28px' }}>
            ეს პანელი განკუთვნილია მხოლოდ სოლომონ აკადემიის ავტორიზებული ადმინისტრატორებისა და დირექციისთვის.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/admin')}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #8b0000, #c41e3a)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.95rem',
                boxShadow: '0 4px 16px rgba(139,0,0,0.4)'
              }}
            >
              ადმინ შესვლა
            </button>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.08)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                fontWeight: 500,
                cursor: 'pointer',
                fontSize: '0.95rem'
              }}
            >
              მთავარ გვერდზე
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculated Stats
  const pendingEditsCount = pendingEdits.filter(e => e.status === 'pending').length;
  const newAppsCount = applications.filter(a => a.status === 'submitted').length;
  const underReviewAppsCount = applications.filter(a => a.status === 'under_review').length;
  const acceptedAppsCount = applications.filter(a => a.status === 'accepted').length;
  const publishedNewsCount = newsList.filter(n => n.is_published).length;
  const activeCodesCount = inviteCodes.filter(c => c.is_active).length;

  // Filtered Applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch =
      (app.student_full_name || '').toLowerCase().includes(appSearch.toLowerCase()) ||
      (app.parent_full_name || '').toLowerCase().includes(appSearch.toLowerCase()) ||
      (app.parent_phone || '').includes(appSearch) ||
      (app.parent_id_number || '').includes(appSearch);

    const matchesStatus = appStatusFilter === 'all' || app.status === appStatusFilter;
    const matchesGrade = appGradeFilter === 'all' || app.grade_stage === appGradeFilter;

    return matchesSearch && matchesStatus && matchesGrade;
  });

  // Filtered Edits
  const filteredEdits = pendingEdits.filter(edit => {
    if (editFilter === 'all') return true;
    return edit.status === editFilter;
  });

  // Filtered Teachers
  const filteredTeachers = teachersList.filter(t =>
    (t.full_name || '').toLowerCase().includes(teacherSearch.toLowerCase()) ||
    (t.subject || '').toLowerCase().includes(teacherSearch.toLowerCase())
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'transparent',
      color: '#f3ece3',
      fontFamily: 'var(--font-sans, "Noto Sans Georgian", Inter, sans-serif)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflowX: 'hidden'
    }}>

      {/* 3D Vanta.NET Interactive Canvas Background (Always below content at zIndex: 0) */}
      <div
        ref={vantaRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden'
        }}
      />

      {/* Content Layer (Always in front of 3D canvas at zIndex: 2) */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%'
      }}>

        {/* TOAST POPUP */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          background: toast.type === 'error' ? '#991b1b' : toast.type === 'info' ? '#1e3a8a' : '#166534',
          color: '#ffffff',
          padding: '14px 22px',
          borderRadius: '12px',
          boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
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

      {/* TOP EXECUTIVE HEADER BAR */}
      <header style={{
        background: 'rgba(32, 11, 15, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}>

          {/* Left: Brand / Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #8b0000, #c41e3a)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(139, 0, 0, 0.45)',
              border: '1px solid rgba(255,255,255,0.15)',
              fontSize: '20px'
            }}>
              🎓
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontFamily: 'var(--font-serif, Georgia, serif)',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  letterSpacing: '0.02em',
                  color: '#fff'
                }}>
                  სოლომონ აკადემია
                </span>
                <span style={{
                  background: 'linear-gradient(135deg, rgba(196, 30, 58, 0.25), rgba(139, 0, 0, 0.15))',
                  border: '1px solid rgba(196, 30, 58, 0.5)',
                  color: '#ff8598',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Executive Portal
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>დირექციისა და ადმინისტრაციის მართვის ცენტრი</span>
                <span>•</span>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>{currentDateStr}</span>
              </div>
            </div>
          </div>

          {/* Right: Actions & User Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                color: 'rgba(255,255,255,0.85)',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            >
              <ExternalLink size={14} />
              საიტის ნახვა
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 14px 6px 6px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '30px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8b0000, #c41e3a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#fff'
              }}>
                A
              </div>
              <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>
                  {user.email || 'admin@school.com'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#ff8598' }}>
                  სრული უფლებამოსილება
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
                background: 'rgba(220, 38, 38, 0.15)',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                borderRadius: '8px',
                color: '#f87171',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#c41e3a';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(220, 38, 38, 0.15)';
                e.currentTarget.style.color = '#f87171';
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main style={{
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto',
        padding: '28px 24px 60px',
        flex: 1,
        position: 'relative',
        zIndex: 10
      }}>

        {/* 1. EXECUTIVE KPI STATS CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>

          {/* Card 1: Teacher Moderation */}
          <div
            onClick={() => setActiveTab('edits')}
            style={{
              background: activeTab === 'edits'
                ? 'linear-gradient(145deg, rgba(139, 0, 0, 0.45), rgba(30, 10, 14, 0.95))'
                : 'rgba(28, 10, 14, 0.88)',
              border: activeTab === 'edits'
                ? '1px solid #c41e3a'
                : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 16px 36px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(16px)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #8b0000, #c41e3a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <UserCheck size={20} />
              </div>
              {pendingEditsCount > 0 ? (
                <span style={{
                  background: 'rgba(239, 68, 68, 0.25)',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  color: '#fca5a5',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '20px'
                }}>
                  {pendingEditsCount} განსახილველი
                </span>
              ) : (
                <span style={{
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  color: '#86efac',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: '20px'
                }}>
                  განხილულია
                </span>
              )}
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>
              {pendingEdits.length}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
              მასწავლებელთა მოდერაცია
            </div>
          </div>

          {/* Card 2: Applications */}
          <div
            onClick={() => setActiveTab('queue')}
            style={{
              background: activeTab === 'queue'
                ? 'linear-gradient(145deg, rgba(139, 0, 0, 0.45), rgba(30, 10, 14, 0.95))'
                : 'rgba(28, 10, 14, 0.88)',
              border: activeTab === 'queue'
                ? '1px solid #c41e3a'
                : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 16px 36px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(16px)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <FileText size={20} />
              </div>
              <span style={{
                background: newAppsCount > 0 ? 'rgba(196, 30, 58, 0.25)' : 'rgba(255,255,255,0.08)',
                border: newAppsCount > 0 ? '1px solid rgba(196, 30, 58, 0.5)' : '1px solid rgba(255,255,255,0.1)',
                color: newAppsCount > 0 ? '#ff8598' : 'rgba(255,255,255,0.6)',
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: '20px'
              }}>
                {newAppsCount} ახალი განაცხადი
              </span>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>
              {applications.length}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
              მიღების განაცხადები
            </div>
          </div>

          {/* Card 3: School News */}
          <div
            onClick={() => setActiveTab('news')}
            style={{
              background: activeTab === 'news'
                ? 'linear-gradient(145deg, rgba(139, 0, 0, 0.45), rgba(30, 10, 14, 0.95))'
                : 'rgba(28, 10, 14, 0.88)',
              border: activeTab === 'news'
                ? '1px solid #c41e3a'
                : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 16px 36px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(16px)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Newspaper size={20} />
              </div>
              <span style={{
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                color: '#86efac',
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: '20px'
              }}>
                {publishedNewsCount} საჯარო
              </span>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>
              {newsList.length}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
              სკოლის სიახლეები & ანონსი
            </div>
          </div>

          {/* Card 4: Invite Codes */}
          <div
            onClick={() => setActiveTab('codes')}
            style={{
              background: activeTab === 'codes'
                ? 'linear-gradient(145deg, rgba(139, 0, 0, 0.45), rgba(30, 10, 14, 0.95))'
                : 'rgba(28, 10, 14, 0.88)',
              border: activeTab === 'codes'
                ? '1px solid #c41e3a'
                : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 16px 36px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(16px)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Key size={20} />
              </div>
              <span style={{
                background: 'rgba(196, 30, 58, 0.2)',
                border: '1px solid rgba(196, 30, 58, 0.4)',
                color: '#ff8598',
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: '20px'
              }}>
                {activeCodesCount} აქტიური
              </span>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>
              {inviteCodes.length || '50+'}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
              მოწვევის კოდები & რეგისტრაცია
            </div>
          </div>

        </div>

        {/* 2. NAVIGATION SEGMENTED PILLS */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(28, 10, 14, 0.9)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '8px',
          marginBottom: '28px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(16px)'
        }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'overview' ? 'linear-gradient(135deg, #8b0000, #c41e3a)' : 'transparent',
              color: activeTab === 'overview' ? '#fff' : 'rgba(255,255,255,0.65)',
              fontWeight: 600,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'overview' ? '0 4px 16px rgba(139,0,0,0.4)' : 'none'
            }}
          >
            <Layers size={16} />
            მიმოხილვა
          </button>

          <button
            onClick={() => setActiveTab('edits')}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'edits' ? 'linear-gradient(135deg, #8b0000, #c41e3a)' : 'transparent',
              color: activeTab === 'edits' ? '#fff' : 'rgba(255,255,255,0.65)',
              fontWeight: 600,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'edits' ? '0 4px 16px rgba(139,0,0,0.4)' : 'none'
            }}
          >
            <UserCheck size={16} />
            პროფილების მოდერაცია
            {pendingEditsCount > 0 && (
              <span style={{
                background: '#ffffff',
                color: '#8b0000',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: '99px'
              }}>
                {pendingEditsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('queue')}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'queue' ? 'linear-gradient(135deg, #8b0000, #c41e3a)' : 'transparent',
              color: activeTab === 'queue' ? '#fff' : 'rgba(255,255,255,0.65)',
              fontWeight: 600,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'queue' ? '0 4px 16px rgba(139,0,0,0.4)' : 'none'
            }}
          >
            <FileText size={16} />
            ონლაინ განაცხადები
            <span style={{
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '2px 7px',
              borderRadius: '99px'
            }}>
              {applications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('news')}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'news' ? 'linear-gradient(135deg, #8b0000, #c41e3a)' : 'transparent',
              color: activeTab === 'news' ? '#fff' : 'rgba(255,255,255,0.65)',
              fontWeight: 600,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'news' ? '0 4px 16px rgba(139,0,0,0.4)' : 'none'
            }}
          >
            <Newspaper size={16} />
            სიახლეების მართვა
            <span style={{
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '2px 7px',
              borderRadius: '99px'
            }}>
              {newsList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('teachers')}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'teachers' ? 'linear-gradient(135deg, #8b0000, #c41e3a)' : 'transparent',
              color: activeTab === 'teachers' ? '#fff' : 'rgba(255,255,255,0.65)',
              fontWeight: 600,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'teachers' ? '0 4px 16px rgba(139,0,0,0.4)' : 'none'
            }}
          >
            <Users size={16} />
            პედაგოგების კორპუსი
            <span style={{
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '2px 7px',
              borderRadius: '99px'
            }}>
              {teachersList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('codes')}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'codes' ? 'linear-gradient(135deg, #8b0000, #c41e3a)' : 'transparent',
              color: activeTab === 'codes' ? '#fff' : 'rgba(255,255,255,0.65)',
              fontWeight: 600,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'codes' ? '0 4px 16px rgba(139,0,0,0.4)' : 'none'
            }}
          >
            <Key size={16} />
            მოწვევის კოდები
          </button>

          <div style={{ marginLeft: 'auto' }}>
            <button
              onClick={() => fetchAllData()}
              title="მონაცემების განახლება"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: 'rgba(255,255,255,0.75)',
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={14} />
              განახლება
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 0: EXECUTIVE OVERVIEW                                      */}
        {/* ============================================================== */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Quick Actions Panel */}
              <div style={{
                background: 'rgba(28, 10, 14, 0.94)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(16px)'
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-serif, Georgia, serif)',
                  fontSize: '1.25rem',
                  color: '#fff',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Sparkles size={18} color="#c41e3a" />
                  სწრაფი ქმედებები
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <button
                    onClick={() => setActiveTab('news')}
                    style={{
                      padding: '14px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      textAlign: 'left'
                    }}
                  >
                    <Plus size={18} color="#c41e3a" />
                    <div>
                      <div>ახალი სიახლე</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>პოსტის გამოქვეყნება</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('codes')}
                    style={{
                      padding: '14px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      textAlign: 'left'
                    }}
                  >
                    <Key size={18} color="#d4af37" />
                    <div>
                      <div>კოდის შექმნა</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>მასწავლებლისთვის</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('queue')}
                    style={{
                      padding: '14px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      textAlign: 'left'
                    }}
                  >
                    <FileText size={18} color="#ffffff" />
                    <div>
                      <div>განაცხადების ნახვა</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>მოსწავლეთა მიღება</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Pending Moderations Preview */}
              <div style={{
                background: 'rgba(28, 10, 14, 0.94)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(16px)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{
                    fontFamily: 'var(--font-serif, Georgia, serif)',
                    fontSize: '1.25rem',
                    color: '#fff',
                    margin: 0
                  }}>
                    მოდერაციის რიგი ({pendingEditsCount})
                  </h3>
                  <button
                    onClick={() => setActiveTab('edits')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ff8598',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    სრულად ნახვა <ChevronRight size={14} />
                  </button>
                </div>

                {pendingEdits.length === 0 ? (
                  <div style={{
                    padding: '32px 20px',
                    textAlign: 'center',
                    background: 'rgba(0,0,0,0.35)',
                    borderRadius: '12px',
                    border: '1px dashed rgba(255,255,255,0.15)',
                    color: 'rgba(255,255,255,0.6)'
                  }}>
                    <ShieldCheck size={32} color="#22c55e" style={{ margin: '0 auto 8px' }} />
                    <div>ყველა მასწავლებლის პროფილი შემოწმებულია და დამტკიცებულია!</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {pendingEdits.slice(0, 3).map((edit) => (
                      <div
                        key={edit.id}
                        style={{
                          background: 'rgba(0,0,0,0.35)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '10px',
                          padding: '14px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem' }}>
                            {edit.teachers?.full_name}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                            {edit.teachers?.subject} • {new Date(edit.submitted_at).toLocaleDateString('ka-GE')}
                          </div>
                        </div>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          background: edit.status === 'pending' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                          color: edit.status === 'pending' ? '#fcd34d' : '#86efac'
                        }}>
                          {edit.status === 'pending' ? 'მოლოდინში' : 'დამტკიცებული'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* System Card */}
              <div style={{
                background: 'linear-gradient(145deg, rgba(139, 0, 0, 0.45), rgba(28, 10, 14, 0.95))',
                border: '1px solid rgba(196, 30, 58, 0.45)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
                backdropFilter: 'blur(16px)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#22c55e',
                    boxShadow: '0 0 10px #22c55e'
                  }} />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>
                    სისტემა აქტიურია (Live Vercel)
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.7' }}>
                  <div><strong>Supabase DB:</strong> დაკავშირებულია ✅</div>
                  <div><strong>Serverless API:</strong> მუშაობს ✅</div>
                  <div><strong>Email/Auth:</strong> გააქტიურებულია ✅</div>
                  <div><strong>Invite Codes:</strong> მრავალჯერადი რეჟიმი ✅</div>
                </div>
              </div>

              {/* Summary Stats */}
              <div style={{
                background: 'rgba(28, 10, 14, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
                backdropFilter: 'blur(16px)'
              }}>
                <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '16px' }}>
                  განაცხადების სტატისტიკა
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>ახალი განაცხადები:</span>
                    <strong style={{ color: '#ff8598' }}>{newAppsCount}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>განხილვაში:</span>
                    <strong style={{ color: '#fbbf24' }}>{underReviewAppsCount}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>მიღებული:</span>
                    <strong style={{ color: '#4ade80' }}>{acceptedAppsCount}</strong>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 1: TEACHER PROFILE MODERATION QUEUE                        */}
        {/* ============================================================== */}
        {activeTab === 'edits' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: '1.6rem', color: '#fff', margin: 0 }}>
                  მასწავლებელთა პროფილების მოდერაცია
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '4px 0 0' }}>
                  პედაგოგების მიერ შეტანილი ცვლილებების განხილვა, შედარება და დამტკიცება
                </p>
              </div>

              {/* Status Filter */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['all', 'pending', 'approved', 'rejected'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setEditFilter(st)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: editFilter === st ? '1px solid #c41e3a' : '1px solid rgba(255,255,255,0.1)',
                      background: editFilter === st ? 'linear-gradient(135deg, #8b0000, #c41e3a)' : 'rgba(28, 10, 14, 0.85)',
                      color: '#ffffff',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    {st === 'all' ? 'ყველა' : st === 'pending' ? 'მოლოდინში' : st === 'approved' ? 'დამტკიცებული' : 'უარყოფილი'}
                  </button>
                ))}
              </div>
            </div>

            {filteredEdits.length === 0 ? (
              <div style={{
                background: 'rgba(28, 10, 14, 0.94)',
                border: '1px dashed rgba(255,255,255,0.15)',
                borderRadius: '16px',
                padding: '60px 20px',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.5)'
              }}>
                <ShieldCheck size={48} color="#22c55e" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '6px' }}>
                  მოდერაციის რიგი ცარიელია
                </h3>
                <p style={{ fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
                  მასწავლებლების მიერ შეტანილი ახალი ცვლილებები აქ გამოჩნდება განსახილველად.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredEdits.map((edit) => {
                  const teacher = edit.teachers;
                  const proposed = edit.proposed_data;
                  const isPending = edit.status === 'pending';

                  return (
                    <div
                      key={edit.id}
                      style={{
                        background: 'rgba(28, 10, 14, 0.94)',
                        border: isPending ? '1px solid rgba(196, 30, 58, 0.5)' : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(16px)',
                        position: 'relative'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '20px',
                        flexWrap: 'wrap',
                        gap: '16px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: proposed?.photo_url ? `url(${proposed.photo_url}) center/cover` : 'linear-gradient(135deg, #8b0000, #c41e3a)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '1.1rem'
                          }}>
                            {!proposed?.photo_url && (teacher?.full_name?.[0] || 'T')}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <h3 style={{ color: '#fff', fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>
                                {teacher?.full_name}
                              </h3>
                              <span style={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                padding: '3px 10px',
                                borderRadius: '12px',
                                background: isPending ? 'rgba(245, 158, 11, 0.2)' : edit.status === 'approved' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                color: isPending ? '#fcd34d' : edit.status === 'approved' ? '#86efac' : '#fca5a5',
                                border: isPending ? '1px solid rgba(245, 158, 11, 0.4)' : edit.status === 'approved' ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)'
                              }}>
                                {isPending ? 'განხილვის მოლოდინში' : edit.status === 'approved' ? 'დადასტურებულია' : 'უარყოფილია'}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', marginTop: '3px' }}>
                              საგანი: <strong style={{ color: '#ff8598' }}>{teacher?.subject}</strong> • გამოგზავნილია: {new Date(edit.submitted_at).toLocaleString('ka-GE')}
                            </div>
                          </div>
                        </div>

                        {/* Approval / Reject Buttons */}
                        {isPending && (
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                              type="button"
                              onClick={() => handleApproveEdit(edit)}
                              disabled={editsStatus.loading}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 18px',
                                background: 'linear-gradient(135deg, #16a34a, #15803d)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '10px',
                                fontWeight: 600,
                                fontSize: '0.88rem',
                                cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)'
                              }}
                            >
                              <CheckCircle2 size={16} />
                              დამტკიცება
                            </button>

                            <button
                              type="button"
                              onClick={() => setSelectedEdit(edit)}
                              disabled={editsStatus.loading}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 18px',
                                background: 'rgba(239, 68, 68, 0.15)',
                                color: '#fca5a5',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '10px',
                                fontWeight: 600,
                                fontSize: '0.88rem',
                                cursor: 'pointer'
                              }}
                            >
                              <XCircle size={16} />
                              უარყოფა
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Visual Side-by-Side Comparison Diff */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '16px',
                        background: 'rgba(0,0,0,0.4)',
                        padding: '18px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.06)',
                        fontSize: '0.86rem'
                      }}>
                        <div>
                          <div style={{
                            color: 'rgba(255,255,255,0.45)',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            fontSize: '0.75rem',
                            letterSpacing: '0.08em',
                            marginBottom: '12px',
                            borderBottom: '1px solid rgba(255,255,255,0.08)',
                            paddingBottom: '6px'
                          }}>
                            მიმდინარე მონაცემები:
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div><span style={{ color: 'rgba(255,255,255,0.45)' }}>სახელი:</span> {teacher?.full_name}</div>
                            <div><span style={{ color: 'rgba(255,255,255,0.45)' }}>საგანი:</span> {teacher?.subject}</div>
                            <div><span style={{ color: 'rgba(255,255,255,0.45)' }}>განათლება:</span> {teacher?.education || '—'}</div>
                            <div><span style={{ color: 'rgba(255,255,255,0.45)' }}>გამოცდილება:</span> {teacher?.experience_years || '—'}</div>
                            <div><span style={{ color: 'rgba(255,255,255,0.45)' }}>სერტიფიკატები:</span> {teacher?.certifications || '—'}</div>
                            <div><span style={{ color: 'rgba(255,255,255,0.45)' }}>სტაჟი:</span> {teacher?.years_at_school || '—'}</div>
                            <div><span style={{ color: 'rgba(255,255,255,0.45)' }}>ბიო:</span> <span style={{ color: 'rgba(255,255,255,0.7)' }}>{teacher?.bio || '—'}</span></div>
                          </div>
                        </div>

                        <div>
                          <div style={{
                            color: '#ff8598',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            fontSize: '0.75rem',
                            letterSpacing: '0.08em',
                            marginBottom: '12px',
                            borderBottom: '1px solid rgba(196, 30, 58, 0.3)',
                            paddingBottom: '6px'
                          }}>
                            ახალი შემოთავაზებული ცვლილებები:
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ color: proposed?.full_name !== teacher?.full_name ? '#4ade80' : 'inherit' }}>
                              <span style={{ color: 'rgba(255,255,255,0.45)' }}>სახელი:</span> {proposed?.full_name}
                            </div>
                            <div style={{ color: proposed?.subject !== teacher?.subject ? '#4ade80' : 'inherit' }}>
                              <span style={{ color: 'rgba(255,255,255,0.45)' }}>საგანი:</span> {proposed?.subject}
                            </div>
                            <div style={{ color: proposed?.education !== teacher?.education ? '#4ade80' : 'inherit' }}>
                              <span style={{ color: 'rgba(255,255,255,0.45)' }}>განათლება:</span> {proposed?.education || '—'}
                            </div>
                            <div style={{ color: proposed?.experience_years !== teacher?.experience_years ? '#4ade80' : 'inherit' }}>
                              <span style={{ color: 'rgba(255,255,255,0.45)' }}>გამოცდილება:</span> {proposed?.experience_years || '—'}
                            </div>
                            <div style={{ color: proposed?.certifications !== teacher?.certifications ? '#4ade80' : 'inherit' }}>
                              <span style={{ color: 'rgba(255,255,255,0.45)' }}>სერტიფიკატები:</span> {proposed?.certifications || '—'}
                            </div>
                            <div style={{ color: proposed?.years_at_school !== teacher?.years_at_school ? '#4ade80' : 'inherit' }}>
                              <span style={{ color: 'rgba(255,255,255,0.45)' }}>სტაჟი:</span> {proposed?.years_at_school || '—'}
                            </div>
                            <div style={{ color: proposed?.bio !== teacher?.bio ? '#4ade80' : 'inherit' }}>
                              <span style={{ color: 'rgba(255,255,255,0.45)' }}>ბიო:</span> {proposed?.bio || '—'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Rejection Prompt Form */}
                      {selectedEdit?.id === edit.id && (
                        <div style={{
                          marginTop: '16px',
                          padding: '16px',
                          background: 'rgba(220, 38, 38, 0.15)',
                          borderRadius: '10px',
                          border: '1px solid rgba(220, 38, 38, 0.4)'
                        }}>
                          <label style={{ display: 'block', color: '#fca5a5', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                            უარყოფის მიზეზი (შეტყობინება მასწავლებელს):
                          </label>
                          <input
                            type="text"
                            placeholder="მაგ: გთხოვთ მიუთითოთ დიპლომის სრული მონაცემები..."
                            value={rejectionNote}
                            onChange={(e) => setRejectionNote(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              background: 'rgba(0,0,0,0.4)',
                              border: '1px solid rgba(220, 38, 38, 0.4)',
                              borderRadius: '8px',
                              color: '#fff',
                              fontSize: '0.9rem',
                              marginBottom: '12px',
                              outline: 'none'
                            }}
                          />
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleRejectEdit(edit)}
                              style={{
                                padding: '8px 16px',
                                background: '#dc2626',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 600,
                                fontSize: '0.82rem',
                                cursor: 'pointer'
                              }}
                            >
                              უარყოფის დადასტურება
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedEdit(null)}
                              style={{
                                padding: '8px 16px',
                                background: 'rgba(255,255,255,0.1)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '0.82rem',
                                cursor: 'pointer'
                              }}
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

        {/* ============================================================== */}
        {/* TAB 2: ONLINE APPLICATIONS CRM                                 */}
        {/* ============================================================== */}
        {activeTab === 'queue' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: '1.6rem', color: '#fff', margin: 0 }}>
                  ონლაინ განაცხადები (მიღება)
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '4px 0 0' }}>
                  სკოლაში მიღების მსურველთა განცხადებები და ატვირთული დოკუმენტები
                </p>
              </div>

              {/* Search & Filter Controls */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                  <input
                    type="text"
                    placeholder="ძებნა: სახელი, ტელეფონი..."
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    style={{
                      padding: '8px 14px 8px 36px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.85rem',
                      outline: 'none',
                      minWidth: '220px'
                    }}
                  />
                </div>

                <select
                  value={appStatusFilter}
                  onChange={(e) => setAppStatusFilter(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    background: '#240d10',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                >
                  <option value="all">ყველა სტატუსი</option>
                  <option value="submitted">შემოსული (Submitted)</option>
                  <option value="under_review">განხილვაში (Under Review)</option>
                  <option value="accepted">მიღებული (Accepted)</option>
                  <option value="rejected">უარყოფილი (Rejected)</option>
                </select>

                <select
                  value={appGradeFilter}
                  onChange={(e) => setAppGradeFilter(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    background: '#240d10',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                >
                  <option value="all">ყველა საფეხური</option>
                  <option value="დაწყებითი (I-IV)">დაწყებითი (I-IV)</option>
                  <option value="საბაზო (V-IX)">საბაზო (V-IX)</option>
                  <option value="საშუალო (X-XII)">საშუალო (X-XII)</option>
                </select>
              </div>
            </div>

            {filteredApplications.length === 0 ? (
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px dashed rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '60px 20px',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.5)'
              }}>
                <FileText size={48} color="rgba(255,255,255,0.2)" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '6px' }}>
                  განაცხადები არ მოიძებნა
                </h3>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredApplications.map((app) => {
                  const statusColors = {
                    submitted: { bg: 'rgba(59, 130, 246, 0.2)', border: 'rgba(59, 130, 246, 0.4)', text: '#93c5fd', label: 'შემოსულია' },
                    under_review: { bg: 'rgba(245, 158, 11, 0.2)', border: 'rgba(245, 158, 11, 0.4)', text: '#fcd34d', label: 'განხილვაშია' },
                    accepted: { bg: 'rgba(34, 197, 94, 0.2)', border: 'rgba(34, 197, 94, 0.4)', text: '#86efac', label: 'მიღებულია' },
                    rejected: { bg: 'rgba(239, 68, 68, 0.2)', border: 'rgba(239, 68, 68, 0.4)', text: '#fca5a5', label: 'უარყოფილია' }
                  };

                  const currentSt = statusColors[app.status] || statusColors.submitted;

                  return (
                    <div
                      key={app.id}
                      style={{
                        background: 'rgba(28, 10, 14, 0.94)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        padding: '22px',
                        boxShadow: '0 16px 36px rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(16px)'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '16px',
                        flexWrap: 'wrap',
                        gap: '12px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #8b0000, #c41e3a)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 700
                          }}>
                            {app.student_full_name?.[0] || 'S'}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>
                                {app.student_full_name}
                              </h3>
                              <span style={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                padding: '2px 8px',
                                borderRadius: '6px',
                                background: 'rgba(255,255,255,0.1)',
                                color: 'rgba(255,255,255,0.85)'
                              }}>
                                {app.grade_stage}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                              რეგისტრაციის თარიღი: {new Date(app.created_at).toLocaleDateString('ka-GE')}
                            </div>
                          </div>
                        </div>

                        {/* Status Dropdown */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: '20px',
                            background: currentSt.bg,
                            border: `1px solid ${currentSt.border}`,
                            color: currentSt.text
                          }}>
                            {currentSt.label}
                          </span>

                          <select
                            disabled={appUpdatingId === app.id}
                            value={app.status}
                            onChange={(e) => handleUpdateAppStatus(app.id, e.target.value)}
                            style={{
                              padding: '6px 10px',
                              background: '#240d10',
                              border: '1px solid rgba(255,255,255,0.15)',
                              borderRadius: '8px',
                              color: '#fff',
                              fontSize: '0.82rem',
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="submitted">შემოსული</option>
                            <option value="under_review">განხილვაში</option>
                            <option value="accepted">მიღებული</option>
                            <option value="rejected">უარყოფილი</option>
                          </select>
                        </div>
                      </div>

                      {/* Detail Grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '12px',
                        background: 'rgba(0,0,0,0.35)',
                        padding: '16px',
                        borderRadius: '10px',
                        fontSize: '0.86rem',
                        marginBottom: '12px'
                      }}>
                        <div>
                          <span style={{ color: 'rgba(255,255,255,0.45)', display: 'block', fontSize: '0.75rem' }}>მშობელი:</span>
                          <strong>{app.parent_full_name}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'rgba(255,255,255,0.45)', display: 'block', fontSize: '0.75rem' }}>პირადი ნომერი:</span>
                          <strong>{app.parent_id_number || '—'}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'rgba(255,255,255,0.45)', display: 'block', fontSize: '0.75rem' }}>ტელეფონი:</span>
                          <a href={`tel:${app.parent_phone}`} style={{ color: '#ff8598', textDecoration: 'none' }}>
                            {app.parent_phone || '—'}
                          </a>
                        </div>
                        <div>
                          <span style={{ color: 'rgba(255,255,255,0.45)', display: 'block', fontSize: '0.75rem' }}>დაბადების თარიღი:</span>
                          <span>{app.student_date_of_birth || '—'}</span>
                        </div>
                        <div>
                          <span style={{ color: 'rgba(255,255,255,0.45)', display: 'block', fontSize: '0.75rem' }}>მისამართი:</span>
                          <span>{app.parent_address || '—'}</span>
                        </div>
                        <div>
                          <span style={{ color: 'rgba(255,255,255,0.45)', display: 'block', fontSize: '0.75rem' }}>დამატებითი შენიშვნა:</span>
                          <span>{app.additional_notes || '—'}</span>
                        </div>
                      </div>

                      {/* Documents */}
                      {app.application_documents && app.application_documents.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>დოკუმენტები:</span>
                          {app.application_documents.map((doc) => (
                            <a
                              key={doc.id}
                              href={doc.file_url}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 10px',
                                background: 'rgba(196, 30, 58, 0.2)',
                                border: '1px solid rgba(196, 30, 58, 0.4)',
                                borderRadius: '6px',
                                color: '#ff8598',
                                fontSize: '0.78rem',
                                textDecoration: 'none'
                              }}
                            >
                              <Download size={12} />
                              {doc.document_type || 'დოკუმენტი'}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: NEWS MANAGEMENT STUDIO                                  */}
        {/* ============================================================== */}
        {activeTab === 'news' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
            
            {/* Left: Composer */}
            <div style={{
              background: 'rgba(28, 10, 14, 0.94)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(16px)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: '1.3rem', color: '#fff', margin: 0 }}>
                  {isEditingNews ? 'სიახლის რედაქტირება' : 'ახალი სიახლის დამატება'}
                </h3>
                {isEditingNews && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingNews(false);
                      setNewsForm({ id: null, title: '', content: '', image_url: '', is_published: true });
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    გაუქმება
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveNews}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>
                    სიახლის სათაური *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="მაგ: STEM ლაბორატორიის გახსნა..."
                    value={newsForm.title}
                    onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '0.92rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* News Image Upload */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>
                    მთავარი ფოტოს URL ან ატვირთვა
                  </label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      placeholder="https://... ან ატვირთეთ ფაილი"
                      value={newsForm.image_url}
                      onChange={(e) => setNewsForm({ ...newsForm, image_url: e.target.value })}
                      style={{
                        flex: '1 1 200px',
                        padding: '10px 14px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                    />
                    <label style={{
                      padding: '10px 16px',
                      background: 'linear-gradient(135deg, #8b0000, #c41e3a)',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap'
                    }}>
                      <Upload size={14} />
                      {newsImageUploading ? 'იტვირთება...' : 'ატვირთვა'}
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleNewsImageUpload} />
                    </label>
                  </div>
                  {newsForm.image_url && (
                    <div style={{ marginTop: '10px', borderRadius: '10px', overflow: 'hidden', height: '140px', background: '#000' }}>
                      <img src={newsForm.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>

                {/* News Content */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>
                    დეტალური შინაარსი *
                  </label>
                  <textarea
                    required
                    rows={6}
                    placeholder="დაწერეთ სიახლის ტექსტი..."
                    value={newsForm.content}
                    onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Public Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <input
                    type="checkbox"
                    id="news-publish-toggle"
                    checked={newsForm.is_published}
                    onChange={(e) => setNewsForm({ ...newsForm, is_published: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#c41e3a', cursor: 'pointer' }}
                  />
                  <label htmlFor="news-publish-toggle" style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.85)', cursor: 'pointer' }}>
                    დაუყოვნებლივ გამოქვეყნება მთავარ გვერდზე
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={newsStatus.loading}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'linear-gradient(135deg, #8b0000, #c41e3a)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: newsStatus.loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 18px rgba(139, 0, 0, 0.45)'
                  }}
                >
                  <Save size={18} />
                  {newsStatus.loading ? 'ინახება...' : isEditingNews ? 'ცვლილებების შენახვა' : 'სიახლის გამოქვეყნება'}
                </button>
              </form>
            </div>

            {/* Right: List */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: '1.3rem', color: '#fff', marginBottom: '16px' }}>
                გამოქვეყნებული სიახლეები ({newsList.length})
              </h3>

              {newsList.length === 0 ? (
                <div style={{
                  background: 'rgba(28, 10, 14, 0.94)',
                  border: '1px dashed rgba(255,255,255,0.15)',
                  borderRadius: '14px',
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: 'rgba(255,255,255,0.6)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.5)'
                }}>
                  სიახლეები ჯერ არ არის დამატებული.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {newsList.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        background: 'rgba(28, 10, 14, 0.94)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '14px',
                        padding: '16px',
                        display: 'flex',
                        gap: '14px',
                        alignItems: 'flex-start',
                        backdropFilter: 'blur(16px)',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.45)'
                      }}
                    >
                      {n.image_url && (
                        <div style={{
                          width: '80px',
                          height: '70px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          flexShrink: 0,
                          background: '#000'
                        }}>
                          <img src={n.image_url} alt={n.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '10px',
                            background: n.is_published ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                            color: n.is_published ? '#86efac' : '#fcd34d'
                          }}>
                            {n.is_published ? 'გამოქვეყნებული' : 'დრაფტი'}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>
                            {new Date(n.published_at).toLocaleDateString('ka-GE')}
                          </span>
                        </div>
                        <h4 style={{ color: '#fff', fontSize: '1rem', margin: '0 0 6px', fontWeight: 600 }}>
                          {n.title}
                        </h4>
                        <p style={{
                          fontSize: '0.82rem',
                          color: 'rgba(255,255,255,0.6)',
                          margin: 0,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {n.content}
                        </p>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <button
                          onClick={() => handleToggleNewsPublish(n)}
                          title={n.is_published ? 'დამალვა' : 'გამოქვეყნება'}
                          style={{
                            padding: '4px 8px',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '6px',
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: '0.72rem',
                            cursor: 'pointer'
                          }}
                        >
                          {n.is_published ? 'დამალვა' : 'გამოქვეყნება'}
                        </button>
                        <button
                          onClick={() => {
                            setNewsForm({ id: n.id, title: n.title, content: n.content, image_url: n.image_url || '', is_published: n.is_published });
                            setIsEditingNews(true);
                          }}
                          style={{
                            padding: '6px',
                            background: 'rgba(196, 30, 58, 0.2)',
                            border: 'none',
                            borderRadius: '6px',
                            color: '#ff8598',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteNews(n.id)}
                          style={{
                            padding: '6px',
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: 'none',
                            borderRadius: '6px',
                            color: '#fca5a5',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: TEACHERS DIRECTORY                                      */}
        {/* ============================================================== */}
        {activeTab === 'teachers' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: '1.6rem', color: '#fff', margin: 0 }}>
                  პედაგოგების კორპუსი ({teachersList.length})
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '4px 0 0' }}>
                  სკოლაში რეგისტრირებული მასწავლებლების სრული სია
                </p>
              </div>

              <div style={{ position: 'relative' }}>
                <Search size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                <input
                  type="text"
                  placeholder="ძებნა: სახელი, საგანი..."
                  value={teacherSearch}
                  onChange={(e) => setTeacherSearch(e.target.value)}
                  style={{
                    padding: '8px 14px 8px 36px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none',
                    minWidth: '240px'
                  }}
                />
              </div>
            </div>

            {filteredTeachers.length === 0 ? (
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px dashed rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '60px 20px',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.5)'
              }}>
                <Users size={48} color="rgba(255,255,255,0.2)" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '6px' }}>
                  მასწავლებლები არ მოიძებნა
                </h3>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {filteredTeachers.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      background: 'rgba(28, 10, 14, 0.88)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '20px',
                      boxShadow: '0 16px 36px rgba(0,0,0,0.45)',
                      backdropFilter: 'blur(16px)',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '54px',
                          height: '54px',
                          borderRadius: '14px',
                          background: t.photo_url ? `url(${t.photo_url}) center/cover` : 'linear-gradient(135deg, #8b0000, #c41e3a)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '1.2rem',
                          flexShrink: 0
                        }}>
                          {!t.photo_url && (t.full_name?.[0] || 'T')}
                        </div>
                        <div>
                          <h4 style={{ color: '#fff', fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>
                            {t.full_name}
                          </h4>
                          <div style={{ color: '#ff8598', fontSize: '0.85rem', fontWeight: 600 }}>
                            {t.subject}
                          </div>
                        </div>
                      </div>

                      {/* Delete Teacher Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteTeacher(t.id, t.full_name)}
                        title="მასწავლებლის წაშლა"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '34px',
                          height: '34px',
                          borderRadius: '8px',
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.35)',
                          color: '#fca5a5',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#dc2626';
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                          e.currentTarget.style.color = '#fca5a5';
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div><strong style={{ color: 'rgba(255,255,255,0.45)' }}>განათლება:</strong> {t.education || '—'}</div>
                      <div><strong style={{ color: 'rgba(255,255,255,0.45)' }}>გამოცდილება:</strong> {t.experience_years || '—'}</div>
                      <div><strong style={{ color: 'rgba(255,255,255,0.45)' }}>სტაჟი სკოლაში:</strong> {t.years_at_school || '—'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: INVITE CODES GENERATOR                                  */}
        {/* ============================================================== */}
        {activeTab === 'codes' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: '1.6rem', color: '#fff', margin: 0 }}>
                  მასწავლებლის მოწვევის კოდები (Invite Codes)
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '4px 0 0' }}>
                  კოდები არის მრავალჯერადი — შეგიძლიათ დაბეჭდოთ ან გაუგზავნოთ პედაგოგებს რეგისტრაციისთვის
                </p>
              </div>

              {/* Quick Generator Box */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="სურვილისამებრ კოდი (მაგ: SOL-MATH-2026)"
                  value={newCodeInput}
                  onChange={(e) => setNewCodeInput(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none',
                    minWidth: '220px'
                  }}
                />
                <button
                  onClick={handleGenerateCode}
                  disabled={codeGenerating}
                  style={{
                    padding: '10px 18px',
                    background: 'linear-gradient(135deg, #8b0000, #c41e3a)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: codeGenerating ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 16px rgba(139,0,0,0.45)'
                  }}
                >
                  <Plus size={16} />
                  {codeGenerating ? 'იქმნება...' : 'ახალი კოდის შექმნა'}
                </button>

                <button
                  onClick={handleGenerateBatch50}
                  disabled={codeGenerating}
                  style={{
                    padding: '10px 16px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    borderRadius: '10px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: codeGenerating ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Sparkles size={16} color="#ff8598" />
                  ⚡ 50 კოდის გენერაცია (Batch)
                </button>
              </div>
            </div>

            {/* Standard Valid Codes Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.35), rgba(255, 255, 255, 0.03))',
              border: '1px solid rgba(196, 30, 58, 0.45)',
              borderRadius: '14px',
              padding: '20px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff8598', fontWeight: 700, fontSize: '0.95rem' }}>
                  <Sparkles size={16} />
                  სტანდარტული აქტიური კოდები:
                </div>
                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
                  ეს კოდები მუდმივად ვალიდურია და ნებისმიერ დროს იმუშავებს რეგისტრაციაზე:
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['TEACHER2026', 'SOLOMON-TEACHER', 'SOLOMON2026'].map((code) => (
                  <div
                    key={code}
                    onClick={() => handleCopyCode(code)}
                    style={{
                      padding: '8px 14px',
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(196, 30, 58, 0.5)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>{code}</span>
                    {copiedCode === code ? <Check size={14} color="#22c55e" /> : <Copy size={14} color="rgba(255,255,255,0.5)" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Codes Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '14px'
            }}>
              {inviteCodes.map((item, idx) => (
                <div
                  key={item.id || idx}
                  style={{
                    background: 'rgba(28, 10, 14, 0.94)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
                  }}
                >
                  <div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.95rem', fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>
                      {item.code}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#22c55e', marginTop: '2px' }}>
                      ● მრავალჯერადი აქტიური
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopyCode(item.code)}
                    title="კოდის კოპირება"
                    style={{
                      padding: '8px',
                      background: copiedCode === item.code ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: copiedCode === item.code ? '#4ade80' : 'rgba(255,255,255,0.8)',
                      cursor: 'pointer'
                    }}
                  >
                    {copiedCode === item.code ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      </div>
    </div>
  );
}
