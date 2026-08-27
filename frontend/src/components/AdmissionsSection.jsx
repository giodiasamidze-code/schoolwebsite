import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle2, Info, Upload, FileCheck, X, User, Lock, Mail, Phone, LogIn, UserPlus, LogOut, ArrowRight, ShieldCheck, BookOpen, GraduationCap, Calendar, Truck, Star, Package, Percent } from 'lucide-react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';

export default function AdmissionsSection() {
  const { user, role, login, register, logout, navigate, pendingFormSubmit, setPendingFormSubmit, requireAuth } = useAuth();

  // Application Form State
  const [appForm, setAppForm] = useState({
    studentName: '',
    studentDob: '',
    parentName: '',
    parentIdNumber: '',
    parentAddress: '',
    phone: '',
    email: '',
    grade: '',
    additionalInfo: ''
  });
  const [appStatus, setAppStatus] = useState({ loading: false, success: null, message: '' });
  const [gradeDropdownOpen, setGradeDropdownOpen] = useState(false);

  // Right-column Inline Auth State (for guests)
  const [authMode, setAuthMode] = useState('register'); // 'register' | 'login'
  const [authForm, setAuthForm] = useState({ name: '', phone: '', email: '', password: '' });
  const [authStatus, setAuthStatus] = useState({ loading: false, error: '', success: '' });

  // Document files state
  const [documents, setDocuments] = useState({
    parent_id: { file: null, progress: 0, status: 'idle', url: '', fileName: '' },
    student_birth_certificate: { file: null, progress: 0, status: 'idle', url: '', fileName: '' },
    residence_permit: { file: null, progress: 0, status: 'idle', url: '', fileName: '' }
  });

  // Pre-fill form with logged-in user profile info
  useEffect(() => {
    if (user) {
      setAppForm((prev) => ({
        ...prev,
        parentName: prev.parentName || user.name || user.full_name || '',
        phone: prev.phone || user.phone || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user]);

  // Listen for authMode trigger from Header (e.g. clicking 'შესვლა' or 'რეგისტრაცია')
  useEffect(() => {
    const handleSetAuthMode = (e) => {
      if (e.detail?.mode) {
        setAuthMode(e.detail.mode);
        setAuthStatus({ loading: false, error: '', success: '' });
      }
    };
    window.addEventListener('set-auth-mode', handleSetAuthMode);
    return () => window.removeEventListener('set-auth-mode', handleSetAuthMode);
  }, []);

  // Handle document file selection
  const handleFileSelect = (docType, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('ფაილის ზომა არ უნდა აღემატებოდეს 10MB-ს');
      return;
    }

    setDocuments((prev) => ({
      ...prev,
      [docType]: {
        file,
        progress: 0,
        status: 'ready',
        url: '',
        fileName: file.name
      }
    }));
  };

  // Remove selected document
  const handleRemoveFile = (docType) => {
    setDocuments((prev) => ({
      ...prev,
      [docType]: { file: null, progress: 0, status: 'idle', url: '', fileName: '' }
    }));
  };

  // Submit online application to Supabase + Storage
  const submitAppData = async (formData) => {
    setAppStatus({ loading: true, success: null, message: '' });
    try {
      if (!user) {
        throw new Error('განაცხადის გასაგზავნად გთხოვთ მარჯვენა ბლოკიდან გაიაროთ რეგისტრაცია ან შესვლა.');
      }

      // 1. Insert into applications table
      const { data: appData, error: appError } = await supabase
        .from('applications')
        .insert([
          {
            user_id: user.id,
            parent_full_name: formData.parentName,
            parent_address: formData.parentAddress || null,
            parent_id_number: formData.parentIdNumber || null,
            student_full_name: formData.studentName,
            student_date_of_birth: formData.studentDob || null,
            grade_stage: formData.grade,
            additional_notes: formData.additionalInfo || null,
            status: 'submitted'
          }
        ])
        .select()
        .single();

      if (appError) {
        console.error('Application creation error:', appError);
        throw appError;
      }

      const applicationId = appData.id;

      // 2. Upload selected documents to Supabase Storage and record in application_documents
      const docEntries = Object.entries(documents).filter(([_, item]) => item.file !== null);

      for (const [docType, docItem] of docEntries) {
        const file = docItem.file;
        const fileExt = file.name.split('.').pop();
        const filePath = `${user.id}/${applicationId}/${docType}_${Date.now()}.${fileExt}`;

        setDocuments((prev) => ({
          ...prev,
          [docType]: { ...prev[docType], status: 'uploading', progress: 40 }
        }));

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error(`Document upload error (${docType}):`, uploadError);
          setDocuments((prev) => ({
            ...prev,
            [docType]: { ...prev[docType], status: 'error' }
          }));
          continue;
        }

        const { data: urlData } = supabase.storage.from('documents').getPublicUrl(filePath);
        const publicUrl = urlData?.publicUrl || '';

        await supabase.from('application_documents').insert([
          {
            application_id: applicationId,
            document_type: docType,
            file_url: publicUrl,
            file_name: file.name
          }
        ]);

        setDocuments((prev) => ({
          ...prev,
          [docType]: { ...prev[docType], status: 'success', progress: 100, url: publicUrl }
        }));
      }

      setAppStatus({
        loading: false,
        success: true,
        message: 'განაცხადი და დოკუმენტაცია წარმატებით გაიგზავნა! ადმინისტრაცია მალე დაგიკავშირდებათ.'
      });

      // Clear form
      setAppForm({
        studentName: '',
        studentDob: '',
        parentName: user.name || user.full_name || '',
        parentIdNumber: '',
        parentAddress: '',
        phone: user.phone || '',
        email: user.email || '',
        grade: '',
        additionalInfo: ''
      });
    } catch (err) {
      console.error('Submit app error:', err);
      setAppStatus({
        loading: false,
        success: false,
        message: err.message || 'დაფიქსირდა შეცდომა. გთხოვთ სცადოთ ხელახლა.'
      });
    }
  };

  const handleAppSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      setPendingFormSubmit({ ...appForm });
      const guestRegistered = requireAuth('განაცხადის გასაგზავნად გთხოვთ გაიაროთ რეგისტრაცია');
      if (!guestRegistered) {
        document.getElementById('auth-card-panel')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    submitAppData(appForm);
  };

  const handleInlineAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthStatus({ loading: true, error: '', success: '' });

    if (authMode === 'register') {
      if (!authForm.name || !authForm.email || !authForm.password) {
        setAuthStatus({ loading: false, error: 'გთხოვთ შეავსოთ ყველა სავალდებულო ველი.', success: '' });
        return;
      }
      const res = await register(authForm.email, authForm.password, authForm.name, authForm.phone);
      if (res.success) {
        setAuthStatus({ loading: false, error: '', success: 'რეგისტრაცია წარმატებით დასრულდა!' });
        if (pendingFormSubmit) {
          submitAppData(pendingFormSubmit);
          setPendingFormSubmit(null);
        }
      } else {
        setAuthStatus({ loading: false, error: res.message || 'რეგისტრაცია ვერ მოხერხდა.', success: '' });
      }
    } else {
      if (!authForm.email || !authForm.password) {
        setAuthStatus({ loading: false, error: 'გთხოვთ მიუთითოთ ელ-ფოსტა და პაროლი.', success: '' });
        return;
      }
      const res = await login(authForm.email, authForm.password);
      if (res.success) {
        setAuthStatus({ loading: false, error: '', success: 'ავტორიზაცია წარმატებულია!' });
        if (pendingFormSubmit) {
          submitAppData(pendingFormSubmit);
          setPendingFormSubmit(null);
        }
      } else {
        setAuthStatus({ loading: false, error: res.message || 'ავტორიზაცია ვერ მოხერხდა.', success: '' });
      }
    }
  };

  const docLabels = {
    parent_id: {
      title: 'მშობლის პირადობის ასლი *',
      desc: 'პირადობის მოწმობა ან პასპორტი (PDF/JPG)'
    },
    student_birth_certificate: {
      title: 'დაბადების მოწმობის ასლი *',
      desc: 'მოსწავლის დაბადების მოწმობა (PDF/JPG)'
    },
    residence_permit: {
      title: 'ბინადრობის ნებართვის ასლი',
      desc: 'სავალდებულოა უცხო ქვეყნის მოქალაქეებისთვის (PDF/JPG)'
    }
  };

  return (
    <section className="admissions-section" id="admissions" style={{ position: 'relative', padding: 'clamp(40px, 6vh, 70px) 0 80px', background: '#0e0c0e' }}>
      <div className="container" style={{ position: 'relative', zIndex: 2, width: '92%', maxWidth: '1360px', margin: '0 auto' }}>

        {/* ======================================================== */}
        {/* MOCKUP 5: LUXURY PRICING & TUITION DASHBOARD             */}
        {/* ======================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* 1. TOP SUMMARY HEADER CARD (Mockup 5 Top Box) */}
          <div
            style={{
              background: 'rgba(24, 18, 20, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: 'clamp(20px, 3vw, 32px)',
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)',
              gap: '24px',
              alignItems: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
            }}
            className="tuition-header-box"
          >
            {/* Left Col: Document Icon + Bars + 4 Pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Crimson Rounded Document Icon Badge */}
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #7c1a2c 0%, #4a0d17 100%)',
                    border: '1px solid rgba(255, 133, 152, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 20px rgba(124, 26, 44, 0.45)',
                    flexShrink: 0
                  }}
                >
                  <FileText size={28} color="#ffffff" />
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3
                    style={{
                      fontFamily: "'Noto Serif Georgian', Georgia, serif",
                      fontSize: 'clamp(1.2rem, 2vw, 1.45rem)',
                      color: '#ffffff',
                      margin: 0,
                      fontWeight: 600
                    }}
                  >
                    სასკოლო საფასური და პაკეტები
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.6)', margin: '4px 0 0' }}>
                    გამჭვირვალე ფინანსური პოლიტიკა და 10-თვიანი მოქნილი გადახდა
                  </p>
                </div>
              </div>

              {/* 4 Feature Indicator Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {[
                  { icon: GraduationCap, text: 'აკადემიური პროგრამა' },
                  { icon: Calendar, text: '10-თვიანი გრაფიკი' },
                  { icon: ShieldCheck, text: 'სრული უსაფრთხოება' },
                  { icon: BookOpen, text: 'სასწავლო რესურსები' }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 14px',
                        borderRadius: '100px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        fontSize: '0.78rem',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontWeight: 500
                      }}
                    >
                      <Icon size={14} color="#ff8598" />
                      <span>{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Col: Academic Standard Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                minHeight: '120px'
              }}
            >
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  background: 'rgba(12, 8, 10, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '16px 22px'
                }}
              >
                <div style={{ fontSize: '2.4rem', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.8))' }}>
                  🎓
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f5e2a3' }}>
                    Solomon Academic Standard
                  </span>
                  <span style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.6)' }}>
                    ყველა პაკეტი მოიცავს საერთაშორისო სასკოლო ბაზას
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. THREE TIER PRICING CARDS (01 Purple, 02 Gold Featured, 03 Green) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}
          >
            {/* Card 01 - Purple Theme */}
            <div
              style={{
                background: 'rgba(22, 16, 24, 0.95)',
                border: '1px solid rgba(192, 132, 252, 0.25)',
                borderRadius: '18px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 16px 40px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ padding: '26px 24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flexGrow: 1 }}>
                {/* 01 Pill Badge */}
                <span
                  style={{
                    background: '#381c44',
                    color: '#e9a6ff',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    padding: '3px 14px',
                    borderRadius: '100px',
                    marginBottom: '16px'
                  }}
                >
                  01
                </span>

                {/* Purple Outlined Icon */}
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    border: '1.5px solid rgba(192, 132, 252, 0.45)',
                    background: 'rgba(192, 132, 252, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '18px',
                    boxShadow: '0 0 20px rgba(192, 132, 252, 0.2)'
                  }}
                >
                  <BookOpen size={30} color="#c084fc" />
                </div>

                <h4 style={{ fontFamily: "'Noto Serif Georgian', serif", fontSize: '1.18rem', color: '#ffffff', margin: '0 0 6px' }}>
                  დაწყებითი საფეხური
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.55)', margin: 0 }}>
                  I – VI კლასები · საბაზისო კურიკულუმი
                </p>
              </div>

              {/* Bottom Solid Purple Container */}
              <div
                style={{
                  background: '#34153c',
                  borderTop: '1px solid rgba(192, 132, 252, 0.2)',
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', fontFamily: "'Noto Serif Georgian', serif", letterSpacing: '-0.02em' }}>
                  8,200 ₾
                </div>
                <span
                  style={{
                    background: 'rgba(0, 0, 0, 0.35)',
                    color: '#e9a6ff',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    padding: '2px 12px',
                    borderRadius: '100px'
                  }}
                >
                  820 ₾ (X10)
                </span>
              </div>
            </div>

            {/* Card 02 - Gold Theme (Featured with Ribbon Star ★) */}
            <div
              style={{
                background: 'rgba(28, 22, 14, 0.98)',
                border: '2px solid #d4af37',
                borderRadius: '18px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 0 30px rgba(212, 175, 55, 0.25), 0 20px 50px rgba(0,0,0,0.6)',
                transform: 'scale(1.02)',
                zIndex: 2
              }}
            >
              {/* Star Bookmark Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: '24px',
                  background: 'linear-gradient(180deg, #d4af37 0%, #b88628 100%)',
                  color: '#1a1104',
                  padding: '6px 10px 10px',
                  borderRadius: '0 0 6px 6px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ★
              </div>

              <div style={{ padding: '26px 24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flexGrow: 1 }}>
                {/* 02 Pill Badge */}
                <span
                  style={{
                    background: '#4e380e',
                    color: '#fde047',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    padding: '3px 14px',
                    borderRadius: '100px',
                    marginBottom: '16px'
                  }}
                >
                  02
                </span>

                {/* Gold Outlined Icon */}
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    border: '1.5px solid rgba(212, 175, 55, 0.65)',
                    background: 'rgba(212, 175, 55, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '18px',
                    boxShadow: '0 0 24px rgba(212, 175, 55, 0.3)'
                  }}
                >
                  <Package size={30} color="#eab308" />
                </div>

                <h4 style={{ fontFamily: "'Noto Serif Georgian', serif", fontSize: '1.18rem', color: '#f5e2a3', margin: '0 0 6px' }}>
                  საბაზო საფეხური
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)', margin: 0 }}>
                  VII – IX კლასები · გაღრმავებული STEM
                </p>
              </div>

              {/* Bottom Solid Gold Container */}
              <div
                style={{
                  background: '#4a330a',
                  borderTop: '1px solid rgba(212, 175, 55, 0.4)',
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fde047', fontFamily: "'Noto Serif Georgian', serif", letterSpacing: '-0.02em' }}>
                  9,500 ₾
                </div>
                <span
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    color: '#fde047',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    padding: '2px 12px',
                    borderRadius: '100px'
                  }}
                >
                  950 ₾ (X10)
                </span>
              </div>
            </div>

            {/* Card 03 - Green Theme */}
            <div
              style={{
                background: 'rgba(16, 24, 18, 0.95)',
                border: '1px solid rgba(74, 222, 128, 0.25)',
                borderRadius: '18px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 16px 40px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ padding: '26px 24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flexGrow: 1 }}>
                {/* 03 Pill Badge */}
                <span
                  style={{
                    background: '#193b22',
                    color: '#86efac',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    padding: '3px 14px',
                    borderRadius: '100px',
                    marginBottom: '16px'
                  }}
                >
                  03
                </span>

                {/* Green Outlined Icon */}
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    border: '1.5px solid rgba(74, 222, 128, 0.45)',
                    background: 'rgba(74, 222, 128, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '18px',
                    boxShadow: '0 0 20px rgba(74, 222, 128, 0.2)'
                  }}
                >
                  <GraduationCap size={30} color="#4ade80" />
                </div>

                <h4 style={{ fontFamily: "'Noto Serif Georgian', serif", fontSize: '1.18rem', color: '#ffffff', margin: '0 0 6px' }}>
                  საშუალო საფეხური
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.55)', margin: 0 }}>
                  X – XII კლასები · IB & AP პროგრამები
                </p>
              </div>

              {/* Bottom Solid Green Container */}
              <div
                style={{
                  background: '#14331b',
                  borderTop: '1px solid rgba(74, 222, 128, 0.2)',
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', fontFamily: "'Noto Serif Georgian', serif", letterSpacing: '-0.02em' }}>
                  11,000 ₾
                </div>
                <span
                  style={{
                    background: 'rgba(0, 0, 0, 0.35)',
                    color: '#86efac',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    padding: '2px 12px',
                    borderRadius: '100px'
                  }}
                >
                  1,100 ₾ (X10)
                </span>
              </div>
            </div>
          </div>

          {/* 3. BOTTOM ROW: Extra Services (Left) + Discounts / Perks (Right) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px'
            }}
          >
            {/* Left Card: Additional Services List */}
            <div
              style={{
                background: 'rgba(20, 16, 18, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '18px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ffffff', margin: '0 0 4px' }}>
                დამატებითი სერვისები
              </h4>

              {/* Service Row 1 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(244, 114, 182, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={18} color="#f472b6" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.86rem', color: '#ffffff', fontWeight: 600 }}>სამჯერადი კვება</div>
                    <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.45)' }}>დაბალანსებული მენიუ</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                  180 ₾ <span style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>/ თვეში</span>
                </div>
              </div>

              {/* Service Row 2 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(192, 132, 252, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={18} color="#c084fc" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.86rem', color: '#ffffff', fontWeight: 600 }}>სამედიცინო დაზღვევა</div>
                    <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.45)' }}>24/7 სამედიცინო პუნქტი</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                  150 ₾ <span style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>/ თვეში</span>
                </div>
              </div>

              {/* Service Row 3 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(96, 165, 250, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Truck size={18} color="#60a5fa" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.86rem', color: '#ffffff', fontWeight: 600 }}>ორმხრივი ტრანსპორტირება</div>
                    <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.45)' }}>კარიდან კარამდე სერვისი</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                  400 ₾ <span style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>/ წლიური</span>
                </div>
              </div>
            </div>

            {/* Right Card: Discounts / Scholarship Perks Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(42, 14, 18, 0.95), rgba(24, 8, 12, 0.98))',
                border: '1px solid rgba(255, 133, 152, 0.2)',
                borderRadius: '18px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                boxShadow: '0 16px 40px rgba(0,0,0,0.5)'
              }}
            >
              {/* 3D Glowing Percentage Stamp Badge */}
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '22px',
                  background: 'linear-gradient(135deg, #a11e38 0%, #680f20 100%)',
                  border: '1.5px solid rgba(255, 180, 195, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.4rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  boxShadow: '0 10px 25px rgba(161, 30, 56, 0.5), inset 0 2px 4px rgba(255,255,255,0.4)',
                  flexShrink: 0,
                  transform: 'rotate(-5deg)'
                }}
              >
                %
              </div>

              <div>
                <h4 style={{ fontFamily: "'Noto Serif Georgian', serif", fontSize: '1.12rem', color: '#ffb4c3', margin: '0 0 6px' }}>
                  სასკოლო სტიპენდიები და შეღავათები
                </h4>
                <p style={{ fontSize: '0.82rem', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                  10%-დან 50%-მდე შეღავათი ოლიმპიადის გამარჯვებულებისთვის, დედმამიშვილებისთვის და მაღალი აკადემიური მოსწრების მოსწავლეებისთვის.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* ONLINE APPLICATION FORM (MOCKUP REDESIGN)                */}
        {/* ======================================================== */}
        <div
          id="application-form"
          style={{
            maxWidth: '1000px',
            margin: '40px auto 0',
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid rgba(212, 175, 55, 0.22)',
            background: 'linear-gradient(180deg, rgba(20, 15, 17, 0.98) 0%, rgba(12, 9, 11, 0.99) 100%)',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212, 175, 55, 0.08)'
          }}
        >
          {/* Top Academy Architecture Background Header */}
          <div
            style={{
              position: 'relative',
              padding: '60px 24px 45px',
              textAlign: 'center',
              overflow: 'hidden',
              borderBottom: '1px solid rgba(212, 175, 55, 0.18)',
              backgroundImage: 'url(/images/hero_building_bg.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center 35%'
            }}
          >
            {/* Dark Vignette Gradient Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(10, 6, 8, 0.75) 0%, rgba(14, 10, 12, 0.92) 70%, #120d0f 100%)',
                zIndex: 1
              }}
            />

            {/* Glowing Golden Ambient Backlight */}
            <div
              style={{
                position: 'absolute',
                top: '20%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '400px',
                height: '250px',
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.22) 0%, transparent 70%)',
                filter: 'blur(40px)',
                zIndex: 1,
                pointerEvents: 'none'
              }}
            />

            {/* Header Content */}
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Golden Classical Crest */}
              <div style={{ marginBottom: '14px', filter: 'drop-shadow(0 4px 14px rgba(212, 175, 55, 0.45))' }}>
                <svg width="48" height="48" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M30 4L8 18H52L30 4Z" stroke="#d4af37" strokeWidth="2.2" strokeLinejoin="round" fill="rgba(212, 175, 55, 0.1)" />
                  <line x1="14" y1="22" x2="14" y2="44" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" />
                  <line x1="22" y1="22" x2="22" y2="44" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" />
                  <line x1="30" y1="22" x2="30" y2="44" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" />
                  <line x1="38" y1="22" x2="38" y2="44" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" />
                  <line x1="46" y1="22" x2="46" y2="44" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" />
                  <line x1="6" y1="46" x2="54" y2="46" stroke="#d4af37" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="4" y1="52" x2="56" y2="52" stroke="#d4af37" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>

              {/* Title */}
              <h2
                style={{
                  fontFamily: "'Noto Serif Georgian', Georgia, serif",
                  fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                  color: '#ffffff',
                  margin: '0 0 10px',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 0 25px rgba(212, 175, 55, 0.35)'
                }}
              >
                ონლაინ განაცხადი
              </h2>

              {/* Subtitle */}
              <p
                style={{
                  fontSize: 'clamp(0.88rem, 1.2vw, 1.02rem)',
                  color: 'rgba(255, 255, 255, 0.75)',
                  margin: 0,
                  maxWidth: '560px',
                  lineHeight: 1.6
                }}
              >
                შეავსეთ მოსწავლის მონაცემები და ატვირთეთ საჭირო დოკუმენტები.
              </p>

              {/* User Session Quick Badge / Guest Sign in Switcher */}
              <div style={{ marginTop: '16px' }}>
                {user ? (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 16px',
                      borderRadius: '100px',
                      background: 'rgba(34, 197, 94, 0.12)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      color: '#86efac',
                      fontSize: '0.82rem',
                      fontWeight: 600
                    }}
                  >
                    <ShieldCheck size={16} color="#4ade80" />
                    <span>ავტორიზებული ხართ როგორც: {user.name || user.email}</span>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '6px 14px',
                      borderRadius: '100px',
                      background: 'rgba(212, 175, 55, 0.08)',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      color: '#f5e2a3',
                      fontSize: '0.8rem'
                    }}
                  >
                    <span>განაცხადის გასაგზავნად საჭიროა ანგარიში</span>
                    <button
                      type="button"
                      onClick={() => {
                        const panel = document.getElementById('auth-modal-panel');
                        if (panel) panel.scrollIntoView({ behavior: 'smooth' });
                      }}
                      style={{
                        background: '#d4af37',
                        color: '#1a1104',
                        border: 'none',
                        borderRadius: '100px',
                        padding: '3px 12px',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      შესვლა / რეგისტრაცია
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Body Container */}
          <div style={{ padding: 'clamp(20px, 4vw, 40px)' }}>
            <form onSubmit={handleAppSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              
              {/* ======================================================== */}
              {/* SECTION 1: მოსწავლის ინფორმაცია                          */}
              {/* ======================================================== */}
              <div
                style={{
                  background: 'rgba(24, 19, 21, 0.85)',
                  border: '1px solid rgba(212, 175, 55, 0.18)',
                  borderRadius: '20px',
                  padding: 'clamp(20px, 3vw, 30px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                  position: 'relative'
                }}
              >
                {/* Section Header & Solomon Academy Plaque */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: '24px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  {/* Left: Icon + Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'rgba(212, 175, 55, 0.12)',
                        border: '1px solid rgba(212, 175, 55, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#d4af37'
                      }}
                    >
                      <User size={18} />
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Noto Serif Georgian', Georgia, serif",
                        fontSize: '1.22rem',
                        color: '#ffffff',
                        margin: 0,
                        fontWeight: 600
                      }}
                    >
                      მოსწავლის ინფორმაცია
                    </h3>
                  </div>

                  {/* Right: Embossed Solomon Academy Plaque */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '7px 14px',
                      borderRadius: '10px',
                      background: 'rgba(18, 13, 15, 0.9)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M30 4L8 18H52L30 4Z" stroke="#d4af37" strokeWidth="2.5" fill="rgba(212, 175, 55, 0.2)" />
                      <line x1="16" y1="22" x2="16" y2="44" stroke="#d4af37" strokeWidth="2.5" />
                      <line x1="30" y1="22" x2="30" y2="44" stroke="#d4af37" strokeWidth="2.5" />
                      <line x1="44" y1="22" x2="44" y2="44" stroke="#d4af37" strokeWidth="2.5" />
                      <line x1="6" y1="46" x2="54" y2="46" stroke="#d4af37" strokeWidth="3" />
                    </svg>
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', color: '#d4af37' }}>
                        SOLOMON
                      </span>
                      <span style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(212, 175, 55, 0.75)' }}>
                        ACADEMY
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2-Column Fields Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px'
                  }}
                >
                  {/* Field 1: მოსწავლის სახელი და გვარი */}
                  <div>
                    <label
                      htmlFor="app-student-name"
                      style={{ display: 'block', fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '8px', fontWeight: 500 }}
                    >
                      მოსწავლის სახელი და გვარი *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User
                        size={17}
                        style={{
                          position: 'absolute',
                          left: '14px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'rgba(255, 255, 255, 0.35)',
                          pointerEvents: 'none'
                        }}
                      />
                      <input
                        id="app-student-name"
                        type="text"
                        required
                        placeholder="მოსწავლის სახელი..."
                        value={appForm.studentName}
                        onChange={(e) => setAppForm({ ...appForm, studentName: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 42px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '12px',
                          color: '#ffffff',
                          fontSize: '0.92rem',
                          outline: 'none',
                          transition: 'all 0.2s',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#d4af37';
                          e.target.style.background = 'rgba(212, 175, 55, 0.05)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                          e.target.style.background = 'rgba(255, 255, 255, 0.04)';
                        }}
                      />
                    </div>
                  </div>

                  {/* Field 2: დაბადების თარიღი */}
                  <div>
                    <label
                      htmlFor="app-student-dob"
                      style={{ display: 'block', fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '8px', fontWeight: 500 }}
                    >
                      დაბადების თარიღი
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        id="app-student-dob"
                        type="date"
                        value={appForm.studentDob}
                        onChange={(e) => setAppForm({ ...appForm, studentDob: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 42px 12px 14px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '12px',
                          color: '#ffffff',
                          fontSize: '0.92rem',
                          outline: 'none',
                          transition: 'all 0.2s',
                          boxSizing: 'border-box',
                          colorScheme: 'dark'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#d4af37';
                          e.target.style.background = 'rgba(212, 175, 55, 0.05)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                          e.target.style.background = 'rgba(255, 255, 255, 0.04)';
                        }}
                      />
                      <Calendar
                        size={17}
                        style={{
                          position: 'absolute',
                          right: '14px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'rgba(255, 255, 255, 0.45)',
                          pointerEvents: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Field 3: მშობლის სახელი და გვარი */}
                  <div>
                    <label
                      htmlFor="app-parent-name"
                      style={{ display: 'block', fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '8px', fontWeight: 500 }}
                    >
                      მშობლის სახელი და გვარი *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User
                        size={17}
                        style={{
                          position: 'absolute',
                          left: '14px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'rgba(255, 255, 255, 0.35)',
                          pointerEvents: 'none'
                        }}
                      />
                      <input
                        id="app-parent-name"
                        type="text"
                        required
                        placeholder="მშობლის სახელი..."
                        value={appForm.parentName}
                        onChange={(e) => setAppForm({ ...appForm, parentName: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 42px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '12px',
                          color: '#ffffff',
                          fontSize: '0.92rem',
                          outline: 'none',
                          transition: 'all 0.2s',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#d4af37';
                          e.target.style.background = 'rgba(212, 175, 55, 0.05)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                          e.target.style.background = 'rgba(255, 255, 255, 0.04)';
                        }}
                      />
                    </div>
                  </div>

                  {/* Field 4: მშობლის პირადი ნომერი */}
                  <div>
                    <label
                      htmlFor="app-parent-id-num"
                      style={{ display: 'block', fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '8px', fontWeight: 500 }}
                    >
                      მშობლის პირადი ნომერი
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        id="app-parent-id-num"
                        type="text"
                        placeholder="მაგ: 01019012345"
                        value={appForm.parentIdNumber}
                        onChange={(e) => setAppForm({ ...appForm, parentIdNumber: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 42px 12px 14px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '12px',
                          color: '#ffffff',
                          fontSize: '0.92rem',
                          outline: 'none',
                          transition: 'all 0.2s',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#d4af37';
                          e.target.style.background = 'rgba(212, 175, 55, 0.05)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                          e.target.style.background = 'rgba(255, 255, 255, 0.04)';
                        }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          right: '14px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '0.8rem',
                          color: 'rgba(255, 255, 255, 0.4)',
                          pointerEvents: 'none'
                        }}
                      >
                        🪪
                      </span>
                    </div>
                  </div>

                  {/* Field 5: ტელეფონი */}
                  <div>
                    <label
                      htmlFor="app-phone"
                      style={{ display: 'block', fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '8px', fontWeight: 500 }}
                    >
                      ტელეფონი *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone
                        size={17}
                        style={{
                          position: 'absolute',
                          left: '14px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'rgba(255, 255, 255, 0.35)',
                          pointerEvents: 'none'
                        }}
                      />
                      <input
                        id="app-phone"
                        type="tel"
                        required
                        placeholder="მაგ: 599 12 34 56"
                        value={appForm.phone}
                        onChange={(e) => setAppForm({ ...appForm, phone: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 42px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '12px',
                          color: '#ffffff',
                          fontSize: '0.92rem',
                          outline: 'none',
                          transition: 'all 0.2s',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#d4af37';
                          e.target.style.background = 'rgba(212, 175, 55, 0.05)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                          e.target.style.background = 'rgba(255, 255, 255, 0.04)';
                        }}
                      />
                    </div>
                  </div>

                  {/* Field 6: ელ-ფოსტა */}
                  <div>
                    <label
                      htmlFor="app-email"
                      style={{ display: 'block', fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '8px', fontWeight: 500 }}
                    >
                      ელ-ფოსტა
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail
                        size={17}
                        style={{
                          position: 'absolute',
                          left: '14px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'rgba(255, 255, 255, 0.35)',
                          pointerEvents: 'none'
                        }}
                      />
                      <input
                        id="app-email"
                        type="email"
                        placeholder="mail@example.com"
                        value={appForm.email}
                        onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 42px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '12px',
                          color: '#ffffff',
                          fontSize: '0.92rem',
                          outline: 'none',
                          transition: 'all 0.2s',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#d4af37';
                          e.target.style.background = 'rgba(212, 175, 55, 0.05)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                          e.target.style.background = 'rgba(255, 255, 255, 0.04)';
                        }}
                      />
                    </div>
                  </div>

                  {/* Field 7: კლასი, სადაც სურს სწავლა */}
                  <div style={{ position: 'relative' }}>
                    <label
                      htmlFor="app-grade"
                      style={{ display: 'block', fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '8px', fontWeight: 500 }}
                    >
                      კლასი, სადაც სურს სწავლა *
                    </label>

                    {/* Custom Grade Dropdown Selector */}
                    <div
                      onClick={() => setGradeDropdownOpen(!gradeDropdownOpen)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: gradeDropdownOpen ? '1px solid #d4af37' : '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '12px',
                        color: appForm.grade ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                        fontSize: '0.92rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        userSelect: 'none',
                        transition: 'all 0.2s',
                        boxSizing: 'border-box'
                      }}
                    >
                      <span>{appForm.grade || 'აირჩიეთ კლასი...'}</span>
                      <span
                        style={{
                          transform: gradeDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s',
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontSize: '0.8rem'
                        }}
                      >
                        ▼
                      </span>
                    </div>

                    {/* Dropdown Options Box */}
                    {gradeDropdownOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '105%',
                          left: 0,
                          right: 0,
                          zIndex: 100,
                          background: '#181215',
                          border: '1px solid rgba(212, 175, 55, 0.3)',
                          borderRadius: '14px',
                          padding: '14px',
                          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9)',
                          backdropFilter: 'blur(20px)'
                        }}
                      >
                        {/* Primary Stage */}
                        <div style={{ marginBottom: '10px' }}>
                          <div style={{ fontSize: '0.74rem', color: '#d4af37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                            დაწყებითი საფეხური (I – IV)
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                            {[1, 2, 3, 4].map((num) => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => {
                                  setAppForm({ ...appForm, grade: `${num} კლასი` });
                                  setGradeDropdownOpen(false);
                                }}
                                style={{
                                  padding: '7px 4px',
                                  borderRadius: '8px',
                                  border: '1px solid',
                                  borderColor: appForm.grade === `${num} კლასი` ? '#d4af37' : 'rgba(255, 255, 255, 0.08)',
                                  background: appForm.grade === `${num} კლასი` ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                                  color: appForm.grade === `${num} კლასი` ? '#fde047' : '#ffffff',
                                  fontSize: '0.84rem',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
                                {num} კლასი
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Basic Stage */}
                        <div style={{ marginBottom: '10px' }}>
                          <div style={{ fontSize: '0.74rem', color: '#ff8598', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                            საბაზო საფეხური (V – IX)
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                            {[5, 6, 7, 8, 9].map((num) => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => {
                                  setAppForm({ ...appForm, grade: `${num} კლასი` });
                                  setGradeDropdownOpen(false);
                                }}
                                style={{
                                  padding: '7px 2px',
                                  borderRadius: '8px',
                                  border: '1px solid',
                                  borderColor: appForm.grade === `${num} კლასი` ? '#d4af37' : 'rgba(255, 255, 255, 0.08)',
                                  background: appForm.grade === `${num} კლასი` ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                                  color: appForm.grade === `${num} კლასი` ? '#fde047' : '#ffffff',
                                  fontSize: '0.82rem',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
                                {num} კლასი
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* High School Stage */}
                        <div>
                          <div style={{ fontSize: '0.74rem', color: '#86efac', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                            საშუალო საფეხური (X – XII)
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                            {[10, 11, 12].map((num) => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => {
                                  setAppForm({ ...appForm, grade: `${num} კლასი` });
                                  setGradeDropdownOpen(false);
                                }}
                                style={{
                                  padding: '7px 4px',
                                  borderRadius: '8px',
                                  border: '1px solid',
                                  borderColor: appForm.grade === `${num} კლასი` ? '#d4af37' : 'rgba(255, 255, 255, 0.08)',
                                  background: appForm.grade === `${num} კლასი` ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                                  color: appForm.grade === `${num} კლასი` ? '#fde047' : '#ffffff',
                                  fontSize: '0.84rem',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
                                {num} კლასი
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Hidden input for form validation */}
                    <input
                      type="text"
                      required
                      value={appForm.grade}
                      onChange={() => {}}
                      style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, width: 0 }}
                    />
                  </div>

                  {/* Field 8: საცხოვრებელი მისამართი */}
                  <div>
                    <label
                      htmlFor="app-parent-address"
                      style={{ display: 'block', fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '8px', fontWeight: 500 }}
                    >
                      საცხოვრებელი მისამართი
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span
                        style={{
                          position: 'absolute',
                          left: '14px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '0.9rem',
                          color: 'rgba(255, 255, 255, 0.35)',
                          pointerEvents: 'none'
                        }}
                      >
                        📍
                      </span>
                      <input
                        id="app-parent-address"
                        type="text"
                        placeholder="ქალაქი, ქუჩა, ბინა..."
                        value={appForm.parentAddress}
                        onChange={(e) => setAppForm({ ...appForm, parentAddress: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 42px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '12px',
                          color: '#ffffff',
                          fontSize: '0.92rem',
                          outline: 'none',
                          transition: 'all 0.2s',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#d4af37';
                          e.target.style.background = 'rgba(212, 175, 55, 0.05)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                          e.target.style.background = 'rgba(255, 255, 255, 0.04)';
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* SECTION 2: სავალდებულო დოკუმენტები                        */}
              {/* ======================================================== */}
              <div
                style={{
                  background: 'rgba(24, 19, 21, 0.85)',
                  border: '1px solid rgba(212, 175, 55, 0.18)',
                  borderRadius: '20px',
                  padding: 'clamp(20px, 3vw, 30px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
                }}
              >
                {/* Section Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '22px',
                    paddingBottom: '14px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(212, 175, 55, 0.12)',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#d4af37'
                    }}
                  >
                    <BookOpen size={18} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Noto Serif Georgian', Georgia, serif",
                      fontSize: '1.22rem',
                      color: '#ffffff',
                      margin: 0,
                      fontWeight: 600
                    }}
                  >
                    სავალდებულო დოკუმენტები
                  </h3>
                </div>

                {/* 3 Upload Cards Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '18px'
                  }}
                >
                  {[
                    {
                      key: 'parent_id',
                      title: 'მშობლის პირადობის ასლი *',
                      desc: 'მშობლის/მეურვის პირადობის მოწმობის ასლი (PDF/JPG)'
                    },
                    {
                      key: 'student_birth_certificate',
                      title: 'დაბადების მოწმობის ასლი *',
                      desc: 'მოსწავლის დაბადების მოწმობა (PDF/JPG)'
                    },
                    {
                      key: 'residence_permit',
                      title: 'ბინადრობის ნებართვის ასლი',
                      desc: 'საცხოვრებელი ადგილის ცნობა (PDF/JPG)'
                    }
                  ].map((doc) => {
                    const docState = documents[doc.key];
                    const hasFile = docState && docState.fileName;

                    return (
                      <div
                        key={doc.key}
                        style={{
                          background: 'rgba(16, 12, 14, 0.65)',
                          border: '1px dashed rgba(212, 175, 55, 0.35)',
                          borderRadius: '16px',
                          padding: '20px 18px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '14px',
                          transition: 'all 0.2s'
                        }}
                      >
                        {/* Title & Desc */}
                        <div>
                          <h4
                            style={{
                              fontFamily: "'Noto Serif Georgian', Georgia, serif",
                              fontSize: '0.96rem',
                              color: '#ffffff',
                              margin: '0 0 6px',
                              fontWeight: 600
                            }}
                          >
                            {doc.title}
                          </h4>
                          <p style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.55)', margin: 0, lineHeight: 1.4 }}>
                            {doc.desc}
                          </p>
                        </div>

                        {/* File Upload Box or File Preview */}
                        {hasFile ? (
                          <div
                            style={{
                              background: 'rgba(212, 175, 55, 0.08)',
                              border: '1px solid rgba(212, 175, 55, 0.3)',
                              borderRadius: '12px',
                              padding: '12px 14px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                              <CheckCircle2 size={16} color="#4ade80" style={{ flexShrink: 0 }} />
                              <span style={{ fontSize: '0.82rem', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {docState.fileName}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(doc.key)}
                              style={{
                                background: 'rgba(239, 68, 68, 0.15)',
                                border: 'none',
                                color: '#f87171',
                                borderRadius: '6px',
                                padding: '4px 6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div>
                            <label
                              htmlFor={`upload-${doc.key}`}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                padding: '16px 12px',
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(212, 175, 55, 0.2)',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.08)';
                                e.currentTarget.style.borderColor = '#d4af37';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)';
                              }}
                            >
                              <span style={{ fontSize: '1.4rem', color: '#d4af37', filter: 'drop-shadow(0 2px 6px rgba(212, 175, 55, 0.4))' }}>
                                ☁️
                              </span>
                              <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#f5e2a3' }}>
                                ფაილის ატვირთვა
                              </span>
                              <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.45)' }}>
                                PDF ან JPG
                              </span>
                            </label>
                            <input
                              id={`upload-${doc.key}`}
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              style={{ display: 'none' }}
                              onChange={(e) => handleFileSelect(doc.key, e)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ======================================================== */}
              {/* SECTION 3: დამატებითი ინფორმაცია / კომენტარი             */}
              {/* ======================================================== */}
              <div
                style={{
                  background: 'rgba(24, 19, 21, 0.85)',
                  border: '1px solid rgba(212, 175, 55, 0.18)',
                  borderRadius: '20px',
                  padding: 'clamp(20px, 3vw, 30px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
                }}
              >
                {/* Section Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '18px',
                    paddingBottom: '14px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(212, 175, 55, 0.12)',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#d4af37'
                    }}
                  >
                    <FileText size={18} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Noto Serif Georgian', Georgia, serif",
                      fontSize: '1.22rem',
                      color: '#ffffff',
                      margin: 0,
                      fontWeight: 600
                    }}
                  >
                    დამატებითი ინფორმაცია / კომენტარი
                  </h3>
                </div>

                <textarea
                  id="app-info"
                  rows={4}
                  placeholder="დამატებითი სპეციფიკური ინფორმაცია..."
                  value={appForm.additionalInfo}
                  onChange={(e) => setAppForm({ ...appForm, additionalInfo: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '14px',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#d4af37';
                    e.target.style.background = 'rgba(212, 175, 55, 0.05)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.04)';
                  }}
                />
              </div>

              {/* ======================================================== */}
              {/* SUBMIT BUTTON: განაცხადის & დოკუმენტების გაგზავნა        */}
              {/* ======================================================== */}
              <button
                type="submit"
                disabled={appStatus.loading}
                style={{
                  width: '100%',
                  padding: '18px 24px',
                  background: 'linear-gradient(135deg, #d4af37 0%, #c4962c 50%, #9a6f1d 100%)',
                  color: '#1a1104',
                  border: 'none',
                  borderRadius: '16px',
                  fontWeight: 800,
                  fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
                  fontFamily: "'Noto Serif Georgian', Georgia, serif",
                  cursor: appStatus.loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow: '0 12px 35px rgba(212, 175, 55, 0.35), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.25s',
                  letterSpacing: '0.02em'
                }}
                onMouseEnter={(e) => {
                  if (!appStatus.loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 16px 45px rgba(212, 175, 55, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!appStatus.loading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(212, 175, 55, 0.35), inset 0 2px 4px rgba(255, 255, 255, 0.3)';
                  }
                }}
              >
                <span style={{ fontSize: '1.2rem', transform: 'rotate(-25deg)' }}>✈️</span>
                <span>{appStatus.loading ? 'იგზავნება...' : 'განაცხადის & დოკუმენტების გაგზავნა'}</span>
              </button>

              {/* Status & Feedback Message */}
              {appStatus.message && (
                <div
                  style={{
                    padding: '16px 20px',
                    borderRadius: '14px',
                    background: appStatus.success ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    border: `1px solid ${appStatus.success ? 'rgba(34, 197, 94, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
                    color: appStatus.success ? '#86efac' : '#fca5a5',
                    fontSize: '0.92rem',
                    textAlign: 'center',
                    fontWeight: 500
                  }}
                >
                  {appStatus.message}
                </div>
              )}
            </form>

            {/* ======================================================== */}
            {/* INLINE AUTH PANEL (FOR GUESTS / MODAL HELPER)            */}
            {/* ======================================================== */}
            {!user && (
              <div
                id="auth-modal-panel"
                style={{
                  marginTop: '40px',
                  padding: '28px',
                  background: 'rgba(16, 12, 14, 0.95)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '20px',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.6)'
                }}
              >
                {/* Tabs Switcher */}
                <div
                  style={{
                    display: 'flex',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '4px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    maxWidth: '400px',
                    margin: '0 auto 20px'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); setAuthStatus({ loading: false, error: '', success: '' }); }}
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: 'none',
                      borderRadius: '8px',
                      background: authMode === 'register' ? 'linear-gradient(135deg, #d4af37 0%, #b88628 100%)' : 'transparent',
                      color: authMode === 'register' ? '#1a1104' : 'rgba(255,255,255,0.6)',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <UserPlus size={15} /> რეგისტრაცია
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setAuthStatus({ loading: false, error: '', success: '' }); }}
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: 'none',
                      borderRadius: '8px',
                      background: authMode === 'login' ? 'linear-gradient(135deg, #d4af37 0%, #b88628 100%)' : 'transparent',
                      color: authMode === 'login' ? '#1a1104' : 'rgba(255,255,255,0.6)',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <LogIn size={15} /> შესვლა
                  </button>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <h4 style={{ fontFamily: "'Noto Serif Georgian', Georgia, serif", fontSize: '1.25rem', color: '#fff', margin: 0, fontWeight: 700 }}>
                    {authMode === 'register' ? 'მშობლის რეგისტრაცია' : 'ანგარიშზე შესვლა'}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.55)', marginTop: '4px' }}>
                    {authMode === 'register'
                      ? 'შექმენით ანგარიში განაცხადის სტატუსის თვალყურის სადევნებლად.'
                      : 'თუ უკვე დარეგისტრირებული ხართ, შედით თქვენი მონაცემებით.'}
                  </p>
                </div>

                <form onSubmit={handleInlineAuthSubmit} style={{ maxWidth: '440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {authMode === 'register' && (
                    <>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '4px' }}>სახელი და გვარი *</label>
                        <input
                          type="text"
                          required
                          placeholder="მშობლის სახელი..."
                          value={authForm.name}
                          onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '10px',
                            color: '#ffffff',
                            fontSize: '0.9rem',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '4px' }}>ტელეფონი *</label>
                        <input
                          type="tel"
                          required
                          placeholder="599 00 00 00"
                          value={authForm.phone}
                          onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '10px',
                            color: '#ffffff',
                            fontSize: '0.9rem',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '4px' }}>ელ-ფოსტა *</label>
                    <input
                      type="email"
                      required
                      placeholder="parent@example.com"
                      value={authForm.email}
                      onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '10px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '4px' }}>პაროლი *</label>
                    <input
                      type="password"
                      required
                      placeholder="მინიმუმ 6 სიმბოლო"
                      value={authForm.password}
                      onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '10px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {authStatus.error && (
                    <div style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#fca5a5', fontSize: '0.82rem', textAlign: 'center' }}>
                      {authStatus.error}
                    </div>
                  )}

                  {authStatus.success && (
                    <div style={{ padding: '8px 12px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '8px', color: '#86efac', fontSize: '0.82rem', textAlign: 'center' }}>
                      {authStatus.success}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={authStatus.loading}
                    style={{
                      marginTop: '6px',
                      padding: '12px',
                      background: 'linear-gradient(135deg, #d4af37 0%, #b88628 100%)',
                      color: '#1a1104',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      cursor: authStatus.loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 6px 20px rgba(212, 175, 55, 0.3)'
                    }}
                  >
                    {authStatus.loading
                      ? 'მუშავდება...'
                      : authMode === 'register'
                      ? 'რეგისტრაცია & დაკავშირება'
                      : 'შესვლა'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
