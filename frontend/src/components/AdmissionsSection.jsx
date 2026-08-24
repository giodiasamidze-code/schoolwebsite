import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle2, Info, Upload, FileCheck, X, User, Lock, Mail, Phone, LogIn, UserPlus, LogOut, ArrowRight, ShieldCheck } from 'lucide-react';
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

  const checklist = [
    'მოსწავლის დაბადების მოწმობის ნოტარიულად დამოწმებული ასლი',
    'მშობლების/მეურვეების პირადობის მოწმობის ასლები',
    'მოსწავლის ჯანმრთელობის ცნობა (ფორმა IV-100ა)',
    'წინა სკოლის აკადემიური მოსწრების ფურცელი (ასეთის არსებობის შემთხვევაში)',
    '2 ფოტოსურათი (ზომით 3x4)'
  ];

  const tuitionRates = [
    { grade: 'დაწყებითი (1-6 კლასი)', yearly: '8,200 ₾', monthly: '820 ₾' },
    { grade: 'საბაზო (7-9 კლასი)', yearly: '9,500 ₾', monthly: '950 ₾' },
    { grade: 'საშუალო (10-12 კლასი)', yearly: '11,000 ₾', monthly: '1,100 ₾' }
  ];

  const extraCosts = [
    { item: 'სამჯერადი კვება', price: '180 ₾ / თვეში' },
    { item: 'ორმხრივი ტრანსპორტირება', price: '150 ₾ / თვეში' },
    { item: 'სასკოლო ფორმა და სახელმძღვანელოები', price: '400 ₾ / წლიური (ერთჯერადი)' }
  ];

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
          console.error(`Document upload error for ${docType}:`, uploadError);
          setDocuments((prev) => ({
            ...prev,
            [docType]: { ...prev[docType], status: 'error' }
          }));
          continue;
        }

        const { data: publicUrlData } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath);

        const fileUrl = publicUrlData?.publicUrl || filePath;

        await supabase.from('application_documents').insert([
          {
            application_id: applicationId,
            document_type: docType,
            file_url: fileUrl,
            file_name: file.name
          }
        ]);

        setDocuments((prev) => ({
          ...prev,
          [docType]: {
            ...prev[docType],
            status: 'uploaded',
            progress: 100,
            url: fileUrl
          }
        }));
      }

      setAppStatus({
        loading: false,
        success: true,
        message: 'თქვენი ონლაინ განაცხადი და დოკუმენტები წარმატებით გაიგზავნა! ადმინისტრაცია მალე დაგიკავშირდებათ.'
      });

      setAppForm({
        studentName: '',
        studentDob: '',
        parentName: user?.name || user?.full_name || '',
        parentIdNumber: '',
        parentAddress: '',
        phone: user?.phone || '',
        email: user?.email || '',
        grade: '',
        additionalInfo: ''
      });

      setDocuments({
        parent_id: { file: null, progress: 0, status: 'idle', url: '', fileName: '' },
        student_birth_certificate: { file: null, progress: 0, status: 'idle', url: '', fileName: '' },
        residence_permit: { file: null, progress: 0, status: 'idle', url: '', fileName: '' }
      });
    } catch (err) {
      setAppStatus({
        loading: false,
        success: false,
        message: err.message || 'განაცხადის გაგზავნისას დაფიქსირდა შეცდომა.'
      });
    }
  };

  const handleAppSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      setAppStatus({
        loading: false,
        success: false,
        message: 'განაცხადის გასაგზავნად გთხოვთ ჯერ გაიაროთ რეგისტრაცია ან ავტორიზაცია მარჯვენა ბლოკში.'
      });
      return;
    }
    submitAppData(appForm);
  };

  // Inline Auth Handler (Register / Sign In right next to the form)
  const handleInlineAuth = async (e) => {
    e.preventDefault();
    setAuthStatus({ loading: true, error: '', success: '' });

    try {
      if (authMode === 'register') {
        if (!authForm.name || !authForm.phone || !authForm.email || !authForm.password) {
          throw new Error('გთხოვთ შეავსოთ ყველა ველი.');
        }
        if (authForm.password.length < 6) {
          throw new Error('პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს.');
        }
        const result = await register({
          email: authForm.email,
          password: authForm.password,
          fullName: authForm.name,
          phone: authForm.phone
        });

        if (!result?.session) {
          setAuthStatus({
            loading: false,
            error: '',
            success: '✅ რეგისტრაცია მიღებულია! გთხოვთ დაადასტუროთ ელ-ფოსტა ან შეხვიდეთ სისტემაში.'
          });
          return;
        }

        setAuthStatus({ loading: false, error: '', success: 'მშობლის ანგარიში შეიქმნა!' });
      } else {
        // Login mode
        if (!authForm.email || !authForm.password) {
          throw new Error('გთხოვთ შეიყვანოთ ელ-ფოსტა და პაროლი.');
        }
        await login(authForm.email, authForm.password);
        setAuthStatus({ loading: false, error: '', success: 'ავტორიზაცია წარმატებულია!' });
      }
    } catch (err) {
      console.error('Inline auth error:', err);
      let msg = err.message || 'შეცდომა';
      if (err.message?.includes('already registered') || err.message?.includes('User already registered')) {
        msg = 'ეს ელ-ფოსტა უკვე რეგისტრირებულია. გადადით "შესვლა" რეჟიმში.';
      } else if (err.message?.includes('Invalid login credentials')) {
        msg = 'არასწორი ელ-ფოსტა ან პაროლი.';
      }
      setAuthStatus({ loading: false, error: msg, success: '' });
    }
  };

  const docLabels = {
    parent_id: {
      title: 'მშობლის პირადობის ასლი *',
      desc: 'მშობლის/მეურვის პირადობის მოწმობა ან პასპორტი (PDF/JPG)'
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
    <section className="admissions-section" id="admissions" style={{ position: 'relative', overflow: 'hidden', padding: '90px 0 60px' }}>
      <div className="container" style={{ position: 'relative', zIndex: 2, width: '92%', maxWidth: '1360px', margin: '0 auto' }}>
        <span className="section-eyebrow">მიღება სკოლაში</span>
        <h2 className="section-title">მისაღები პროცედურა და რეგისტრაცია</h2>
        <p className="section-desc">
          გაეცანით საბუთების ჩამონათვალს, სწავლის ღირებულებას და შემოგვიერთდით ახალი სასწავლო წლისთვის.
        </p>

        {/* 1. Documents & Pricing Layout */}
        <div className="doc-price-grid">
          {/* Document Checklist */}
          <div className="checklist-card spotlight-card">
            <h3 className="card-sub-title">
              <FileText className="text-burgundy" size={24} />
              საჭირო დოკუმენტაცია
            </h3>
            <ul className="checklist-list">
              {checklist.map((item, idx) => (
                <li key={idx} className="checklist-item">
                  <CheckCircle2 size={18} className="text-burgundy flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tuition Table */}
          <div className="pricing-card spotlight-card">
            <h3 className="card-sub-title">სწავლის საფასური</h3>
            <table className="pricing-table">
              <thead>
                <tr>
                  <th>საფეხური</th>
                  <th>წლიური</th>
                  <th>თვიური (x10)</th>
                </tr>
              </thead>
              <tbody>
                {tuitionRates.map((rate, idx) => (
                  <tr key={idx}>
                    <td>{rate.grade}</td>
                    <td className="font-semibold">{rate.yearly}</td>
                    <td>{rate.monthly}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Extra Costs */}
            <div className="extra-costs">
              <h4>დამატებითი მომსახურება:</h4>
              <ul className="extra-costs-list">
                {extraCosts.map((cost, idx) => (
                  <li key={idx}>
                    <span className="extra-item-name">{cost.item}:</span>
                    <span className="extra-item-price font-semibold">{cost.price}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Scholarship info */}
            <div className="scholarship-alert">
              <Info size={16} className="text-gold flex-shrink-0" />
              <p>
                <strong>სტიპენდიები:</strong> გვაქვს 10%-დან 50%-მდე შეღავათები ოლიმპიადების გამარჯვებულებისთვის, დედმამიშვილებისთვის და მაღალი აკადემიური მოსწრების მოსწავლეებისთვის.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Side-by-Side: Online Application Form + Registration / Account Panel */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: '32px',
          alignItems: 'flex-start',
          marginTop: '20px'
        }}
        className="admissions-two-col"
        >
          
          {/* LEFT: Online Application Form */}
          <div className="form-card-container spotlight-card" style={{ padding: '36px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'rgba(196, 30, 58, 0.15)', border: '1px solid rgba(196, 30, 58, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff8598'
              }}>
                <FileText size={18} />
              </div>
              <h3 className="form-card-heading" style={{ margin: 0, fontSize: '1.45rem' }}>
                ონლაინ განაცხადი
              </h3>
            </div>
            <p className="form-card-subheading" style={{ marginBottom: '24px', fontSize: '0.88rem' }}>
              შეავსეთ მოსწავლის მონაცემები და ატვირთეთ საჭირო დოკუმენტაცია.
            </p>
            
            <form onSubmit={handleAppSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="app-student-name">მოსწავლის სახელი და გვარი *</label>
                  <input
                    id="app-student-name"
                    type="text"
                    required
                    className="form-control"
                    placeholder="მოსწავლის სახელი..."
                    value={appForm.studentName}
                    onChange={(e) => setAppForm({ ...appForm, studentName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="app-student-dob">მოსწავლის დაბადების თარიღი</label>
                  <input
                    id="app-student-dob"
                    type="date"
                    className="form-control"
                    value={appForm.studentDob}
                    onChange={(e) => setAppForm({ ...appForm, studentDob: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="app-parent-name">მშობლის სახელი და გვარი *</label>
                  <input
                    id="app-parent-name"
                    type="text"
                    required
                    className="form-control"
                    placeholder="მშობლის სახელი..."
                    value={appForm.parentName}
                    onChange={(e) => setAppForm({ ...appForm, parentName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="app-parent-id-num">მშობლის პირადი ნომერი</label>
                  <input
                    id="app-parent-id-num"
                    type="text"
                    className="form-control"
                    placeholder="მაგ: 01019012345"
                    value={appForm.parentIdNumber}
                    onChange={(e) => setAppForm({ ...appForm, parentIdNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="app-phone">ტელეფონი *</label>
                  <input
                    id="app-phone"
                    type="tel"
                    required
                    className="form-control"
                    placeholder="მაგ: 599 12 34 56"
                    value={appForm.phone}
                    onChange={(e) => setAppForm({ ...appForm, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="app-email">ელ-ფოსტა</label>
                  <input
                    id="app-email"
                    type="email"
                    className="form-control"
                    placeholder="mail@example.com"
                    value={appForm.email}
                    onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="app-grade">კლასი, სადაც სურს სწავლა *</label>
                  <select
                    id="app-grade"
                    required
                    className="form-control"
                    value={appForm.grade}
                    onChange={(e) => setAppForm({ ...appForm, grade: e.target.value })}
                  >
                    <option value="">აირჩიეთ კლასი...</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i+1} value={`${i+1} კლასი`}>{`${i+1} კლასი`}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="app-parent-address">საცხოვრებელი მისამართი</label>
                  <input
                    id="app-parent-address"
                    type="text"
                    className="form-control"
                    placeholder="ქალაქი, ქუჩა, ბინა..."
                    value={appForm.parentAddress}
                    onChange={(e) => setAppForm({ ...appForm, parentAddress: e.target.value })}
                  />
                </div>
              </div>

              {/* Supabase Storage File Uploads */}
              <div className="file-uploads-container" style={{ marginTop: '20px', marginBottom: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.08rem', marginBottom: '14px', color: '#ffffff' }}>
                  სავალდებულო დოკუმენტაცია
                </h4>

                {['parent_id', 'student_birth_certificate', 'residence_permit'].map((docType) => {
                  const docInfo = docLabels[docType];
                  const docState = documents[docType];

                  return (
                    <div key={docType} style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '12px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>{docInfo.title}</div>
                          <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '2px' }}>{docInfo.desc}</div>
                        </div>

                        {docState.status === 'uploaded' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#4ade80', fontSize: '0.8rem', fontWeight: 600 }}>
                            <FileCheck size={16} /> ატვირთულია
                          </span>
                        ) : null}
                      </div>

                      {docState.fileName ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', background: 'rgba(255, 255, 255, 0.06)', padding: '6px 12px', borderRadius: '8px' }}>
                          <span style={{ fontSize: '0.82rem', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px' }}>
                            📄 {docState.fileName}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(docType)}
                            style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div style={{ marginTop: '10px' }}>
                          <label
                            htmlFor={`upload-${docType}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '7px 14px',
                              fontSize: '0.82rem',
                              background: 'rgba(255, 255, 255, 0.08)',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              color: '#ffffff',
                              fontWeight: 500,
                              transition: 'all 0.2s'
                            }}
                          >
                            <Upload size={13} />
                            ფაილის არჩევა
                          </label>
                        </div>
                      )}

                      <input
                        id={`upload-${docType}`}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileSelect(docType, e)}
                      />

                      {docState.status === 'uploading' && (
                        <div style={{ marginTop: '8px', height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${docState.progress}%`, background: 'var(--accent-primary)', transition: 'width 0.3s' }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="app-info">დამატებითი ინფორმაცია / კითხვები</label>
                <textarea
                  id="app-info"
                  className="form-control"
                  rows={3}
                  placeholder="დაწერეთ სასურველი ინფორმაცია..."
                  value={appForm.additionalInfo}
                  onChange={(e) => setAppForm({ ...appForm, additionalInfo: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" disabled={appStatus.loading} className="btn btn-primary w-full" style={{ padding: '13px', fontWeight: 700 }}>
                {appStatus.loading ? 'იგზავნება...' : 'განაცხადის & დოკუმენტების გაგზავნა'}
              </button>

              {appStatus.message && (
                <div className={`form-feedback ${appStatus.success ? 'success' : 'error'}`} style={{ marginTop: '16px' }}>
                  {appStatus.message}
                </div>
              )}
            </form>
          </div>

          {/* RIGHT: Registration & Parent Account Panel */}
          <div className="form-card-container spotlight-card" style={{ padding: '36px 30px', position: 'sticky', top: '90px' }}>
            
            {user ? (
              // LOGGED IN STATE
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '18px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{
                    width: '46px', height: '46px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8b0000, #c41e3a)',
                    color: '#ffffff', fontSize: '1.2rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {(user.name || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>
                      {user.name || user.full_name || 'მომხმარებელი'}
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                      {user.email}
                    </span>
                  </div>
                </div>

                <div style={{
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.25)',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <ShieldCheck size={20} color="#4ade80" />
                  <span style={{ fontSize: '0.86rem', color: '#86efac', fontWeight: 600 }}>
                    ავტორიზებული ხართ ({role === 'admin' ? 'ადმინისტრატორი' : role === 'teacher' ? 'მასწავლებელი' : 'მშობელი'})
                  </span>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.6, marginBottom: '24px' }}>
                  თქვენი საკონტაქტო მონაცემები ავტომატურად დაკავშირებულია განაცხადთან. გაგზავნის შემდეგ სტატუსის ნახვა შეგეძლებათ თქვენს პირად კაბინეტში.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {role === 'parent' && (
                    <button
                      onClick={() => navigate('/parent-account')}
                      style={{
                        padding: '12px',
                        background: 'linear-gradient(135deg, #8b0000, #c41e3a)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      ჩემი ანგარიშის გახსნა <ArrowRight size={16} />
                    </button>
                  )}

                  {role === 'teacher' && (
                    <button
                      onClick={() => navigate('/teacher-dashboard')}
                      style={{
                        padding: '12px',
                        background: 'linear-gradient(135deg, #8b0000, #c41e3a)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      მასწავლებლის კაბინეტი <ArrowRight size={16} />
                    </button>
                  )}

                  <button
                    onClick={logout}
                    style={{
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.7)',
                      borderRadius: '10px',
                      fontWeight: 500,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <LogOut size={14} /> გამოსვლა
                  </button>
                </div>
              </div>
            ) : (
              // GUEST: REGISTRATION & LOGIN FORM
              <div>
                {/* Tabs Switcher */}
                <div style={{
                  display: 'flex',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '4px',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); setAuthStatus({ loading: false, error: '', success: '' }); }}
                    style={{
                      flex: 1,
                      padding: '8px',
                      border: 'none',
                      borderRadius: '8px',
                      background: authMode === 'register' ? '#c41e3a' : 'transparent',
                      color: authMode === 'register' ? '#fff' : 'rgba(255,255,255,0.6)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
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
                      padding: '8px',
                      border: 'none',
                      borderRadius: '8px',
                      background: authMode === 'login' ? '#c41e3a' : 'transparent',
                      color: authMode === 'login' ? '#fff' : 'rgba(255,255,255,0.6)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
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

                <div style={{ marginBottom: '18px' }}>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#fff', margin: 0, fontWeight: 700 }}>
                    {authMode === 'register' ? 'მშობლის რეგისტრაცია' : 'ანგარიშზე შესვლა'}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '4px' }}>
                    {authMode === 'register'
                      ? 'შექმენით ანგარიში განაცხადის სტატუსის თვალყურის სადევნებლად.'
                      : 'თუ უკვე დარეგისტრირებული ხართ, შედით თქვენი მონაცემებით.'}
                  </p>
                </div>

                <form onSubmit={handleInlineAuth} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {authMode === 'register' && (
                    <>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '4px' }}>სახელი და გვარი *</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            required
                            placeholder="მშობლის სახელი..."
                            value={authForm.name}
                            onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                            className="form-control"
                            style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '4px' }}>ტელეფონი *</label>
                        <input
                          type="tel"
                          required
                          placeholder="599 00 00 00"
                          value={authForm.phone}
                          onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                          className="form-control"
                          style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '4px' }}>ელ-ფოსტა *</label>
                    <input
                      type="email"
                      required
                      placeholder="parent@example.com"
                      value={authForm.email}
                      onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                      className="form-control"
                      style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '4px' }}>პაროლი *</label>
                    <input
                      type="password"
                      required
                      placeholder="მინიმუმ 6 სიმბოლო"
                      value={authForm.password}
                      onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                      className="form-control"
                      style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                    />
                  </div>

                  {authStatus.error && (
                    <div style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#fca5a5', fontSize: '0.8rem' }}>
                      {authStatus.error}
                    </div>
                  )}

                  {authStatus.success && (
                    <div style={{ padding: '8px 12px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '8px', color: '#86efac', fontSize: '0.8rem' }}>
                      {authStatus.success}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={authStatus.loading}
                    style={{
                      marginTop: '6px',
                      padding: '11px',
                      background: authStatus.loading ? 'rgba(196, 30, 58, 0.5)' : '#c41e3a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: authStatus.loading ? 'not-allowed' : 'pointer',
                      transition: 'background 0.2s'
                    }}
                  >
                    {authStatus.loading
                      ? 'მუშავდება...'
                      : authMode === 'register'
                      ? 'რეგისტრაცია & დაკავშირება'
                      : 'შესვლა'}
                  </button>
                </form>

                {/* Benefits mini list */}
                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255, 255, 255, 0.4)', marginBottom: '10px' }}>
                    რატომ უნდა დარეგისტრირდეთ?
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                      <CheckCircle2 size={14} color="#4ade80" /> განაცხადის სტატუსის ონლაინ მონიტორინგი
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                      <CheckCircle2 size={14} color="#4ade80" /> შედეგებისა და შეტყობინებების მიღება
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                      <CheckCircle2 size={14} color="#4ade80" /> 100% დაცული პერსონალური საბუთები
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .admissions-two-col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
