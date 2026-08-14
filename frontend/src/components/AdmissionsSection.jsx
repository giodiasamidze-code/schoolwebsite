import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle2, Info, Upload, FileCheck, X } from 'lucide-react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';

export default function AdmissionsSection() {
  const { user, pendingFormSubmit, setPendingFormSubmit, requireAuth } = useAuth();

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

  // Document files state
  // docTypes: parent_id, student_birth_certificate, residence_permit
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

    // Check size limit (10MB)
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
        throw new Error('განაცხადის გასაგზავნად გთხოვთ გაიაროთ ავტორიზაცია.');
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

        // Update document upload progress UI state
        setDocuments((prev) => ({
          ...prev,
          [docType]: { ...prev[docType], status: 'uploading', progress: 40 }
        }));

        const { error: uploadError } = await supabase.storage
          .from('application-documents')
          .upload(filePath, file, { upsert: true });

        if (uploadError) {
          console.error(`Error uploading document ${docType}:`, uploadError);
          setDocuments((prev) => ({
            ...prev,
            [docType]: { ...prev[docType], status: 'error' }
          }));
          throw new Error(`დოკუმენტის (${file.name}) ატვირთვა ვერ მოხერხდა.`);
        }

        // Get public URL or path
        const { data: publicUrlData } = supabase.storage
          .from('application-documents')
          .getPublicUrl(filePath);

        const fileUrl = publicUrlData?.publicUrl || filePath;

        // Save into application_documents table
        const { error: docTableError } = await supabase
          .from('application_documents')
          .insert([
            {
              application_id: applicationId,
              document_type: docType,
              file_url: fileUrl
            }
          ]);

        if (docTableError) {
          console.error(`Error inserting doc record for ${docType}:`, docTableError);
        }

        setDocuments((prev) => ({
          ...prev,
          [docType]: { ...prev[docType], status: 'completed', progress: 100, url: fileUrl }
        }));
      }

      setAppStatus({
        loading: false,
        success: true,
        message: 'ონლაინ განაცხადი და დოკუმენტები წარმატებით გაიგზავნა! მადლობას გიხდით.'
      });

      // Reset form & document inputs
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
    requireAuth('application', appForm, () => {
      submitAppData(appForm);
    });
  };

  useEffect(() => {
    if (user && pendingFormSubmit) {
      const { formType, data } = pendingFormSubmit;
      if (formType === 'application') {
        setAppForm(data);
        setPendingFormSubmit(null);
        submitAppData(data);
      }
    }
  }, [user, pendingFormSubmit, setPendingFormSubmit]);

  // Labels for uploaded documents
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
    <section className="admissions-section" id="admissions">
      <div className="container">
        <span className="section-eyebrow">მიღება სკოლაში</span>
        <h2 className="section-title">მისაღები პროცედურა და რეგისტრაცია</h2>
        <p className="section-desc">
          გაეცანით საბუთების ჩამონათვალს, სწავლის ღირებულებას და შემოგვიერთდით ახალი სასწავლო წლისთვის.
        </p>

        {/* 1. Documents & Pricing Layout */}
        <div className="doc-price-grid">
          {/* Document Checklist */}
          <div className="checklist-card">
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
          <div className="pricing-card">
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

        {/* 2. Online Application Form */}
        <div className="single-form-container">
          <div className="form-card-container">
            <h3 className="form-card-heading">ონლაინ განაცხადი & დოკუმენტების ატვირთვა</h3>
            <p className="form-card-subheading">დაიწყეთ რეგისტრაციის პროცესი ონლაინ განაცხადის შევსებით და დოკუმენტაციის ატვირთვით.</p>
            
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

              {/* Supabase Storage File Uploads */}
              <div className="file-uploads-container" style={{ marginTop: '24px', marginBottom: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color, #e2e8f0)' }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '12px', color: 'var(--text-dark)' }}>
                  სავალდებულო დოკუმენტაცია (Supabase Storage)
                </h4>

                {['parent_id', 'student_birth_certificate', 'residence_permit'].map((docType) => {
                  const docInfo = docLabels[docType];
                  const docState = documents[docType];

                  return (
                    <div
                      key={docType}
                      className="doc-upload-card"
                      style={{
                        background: 'var(--bg-secondary, #f8fafc)',
                        border: '1px dashed var(--border-color, #cbd5e1)',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        marginBottom: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ fontSize: '0.95rem', color: 'var(--text-dark)' }}>{docInfo.title}</strong>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>{docInfo.desc}</p>
                        </div>
                      </div>

                      {/* Upload status / file preview */}
                      {docState.file ? (
                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.06)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                            <FileCheck size={18} className="text-burgundy" />
                            <span style={{ fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px', color: '#fff' }}>
                              {docState.fileName}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                              ({(docState.file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <label htmlFor={`upload-${docType}`} style={{ cursor: 'pointer', fontSize: '0.8rem', color: 'var(--accent-secondary)', textDecoration: 'underline' }}>
                              შეცვლა
                            </label>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(docType)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '2px' }}
                              title="წაშლა"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ marginTop: '8px' }}>
                          <label
                            htmlFor={`upload-${docType}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '8px 14px',
                              fontSize: '0.85rem',
                              background: 'rgba(255, 255, 255, 0.08)',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              color: '#ffffff',
                              fontWeight: 500,
                              transition: 'all 0.2s'
                            }}
                          >
                            <Upload size={14} />
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

                      {/* Progress bar during upload */}
                      {docState.status === 'uploading' && (
                        <div style={{ marginTop: '8px', height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
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
                  placeholder="დაწერეთ სასურველი ინფორმაცია..."
                  value={appForm.additionalInfo}
                  onChange={(e) => setAppForm({ ...appForm, additionalInfo: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" disabled={appStatus.loading} className="btn btn-primary w-full">
                {appStatus.loading ? 'იგზავნება Supabase-ში...' : 'განაცხადის & დოკუმენტების გაგზავნა'}
              </button>

              {appStatus.message && (
                <div className={`form-feedback ${appStatus.success ? 'success' : 'error'}`}>
                  {appStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}
