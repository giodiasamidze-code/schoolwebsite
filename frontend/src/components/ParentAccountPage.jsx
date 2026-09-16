import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';
import { FileText, ArrowLeft, Clock, CheckCircle2, XCircle, RefreshCw, Plus } from 'lucide-react';

export default function ParentAccountPage() {
  const { user, navigate } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleNewApplication = () => {
    navigate('/');
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('open-admissions-modal'));
      const el = document.getElementById('admissions');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const fetchParentData = async () => {
    if (!user) return;
    setLoading(true);
    let apps = [];
    try {
      if (user.id && !user.id.toString().startsWith('parent-') && !user.id.toString().startsWith('local-')) {
        const { data: appData } = await supabase
          .from('applications')
          .select('*, application_documents(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (Array.isArray(appData)) apps = appData;
      }
    } catch (err) {
      console.warn('Error fetching parent account data from supabase:', err);
    }

    // Merge with local applications from academy_applications
    try {
      const localApps = JSON.parse(localStorage.getItem('academy_applications') || '[]');
      if (Array.isArray(localApps)) {
        const cleanUserEmail = (user.email || '').toLowerCase().trim();
        const cleanUserPhone = (user.phone || '').replace(/\D+/g, '');
        const cleanUserName = (user.name || user.fullName || '').toLowerCase().trim();

        const matching = localApps.filter((a) => {
          const aEmail = (a.email || '').toLowerCase().trim();
          const aPhone = (a.phone || '').replace(/\D+/g, '');
          const aName = (a.parentName || '').toLowerCase().trim();
          return (
            (cleanUserEmail && aEmail && cleanUserEmail === aEmail) ||
            (cleanUserPhone && aPhone && cleanUserPhone === aPhone) ||
            (cleanUserName && aName && (cleanUserName.includes(aName) || aName.includes(cleanUserName)))
          );
        });

        const listToMerge = matching.length > 0 ? matching : localApps;
        listToMerge.forEach((local) => {
          if (!apps.some((a) => a.id === local.id)) {
            apps.push({
              id: local.id,
              status: local.status === 'ახალი განაცხადი' ? 'submitted' : (local.status || 'submitted'),
              student_full_name: local.studentFullName || local.studentName || 'მოსწავლე',
              grade_stage: local.studentGrade || local.package || 'დაწყებითი საფეხური',
              created_at: local.date || new Date().toISOString(),
              ...local
            });
          }
        });
      }
    } catch { }

    setApplications(apps);
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchParentData();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '16px' }}>
          ავტორიზაცია აუცილებელია
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          პირადი ანგარიშის სანახავად გთხოვთ გაიაროთ ავტორიზაცია.
        </p>
        <button onClick={() => { navigate('/'); setTimeout(() => { const el = document.querySelector('#admissions'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 100); }} className="btn btn-primary">
          ავტორიზაცია / შესვლა
        </button>
      </div>
    );
  }

  const appStatusText = (status) => {
    switch (status) {
      case 'submitted':
        return { label: 'შემოსულია (მიღებულია)', color: '#b45309', bg: '#fef3c7', icon: Clock };
      case 'under_review':
        return { label: 'განხილვის პროცესშია', color: '#1d4ed8', bg: '#dbeafe', icon: RefreshCw };
      case 'accepted':
        return { label: 'დადასტურებულია / მიღებულია', color: '#15803d', bg: '#dcfce7', icon: CheckCircle2 };
      case 'rejected':
        return { label: 'უარყოფილია', color: '#b91c1c', bg: '#fee2e2', icon: XCircle };
      default:
        return { label: status, color: '#475569', bg: '#f1f5f9', icon: Clock };
    }
  };

  return (
    <div className="parent-account-wrapper fade-in" style={{ padding: '40px 0 80px', background: 'var(--bg-primary)' }}>
      <div className="container">
        
        <div className="parent-account-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
          <div>
            <button className="back-link-btn" onClick={() => navigate('/')} style={{ marginBottom: '8px' }}>
              <ArrowLeft size={16} className="icon-mr" />
              მთავარ გვერდზე დაბრუნება
            </button>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--text-dark)' }}>
              მშობლის პირადი ანგარიში
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              სალამი, {user.name}! ადევნეთ თვალი თქვენი ონლაინ განაცხადების სტატუსს real-time რეჟიმში.
            </p>
          </div>

          <div className="parent-account-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={handleNewApplication}
              style={{
                background: 'linear-gradient(135deg, #f6d56d 0%, #d4af37 100%)',
                border: 'none',
                color: '#1a1014',
                fontWeight: 700,
                fontSize: '0.88rem',
                padding: '10px 18px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 15px rgba(212, 175, 55, 0.25)'
              }}
            >
              <Plus size={16} />
              <span>+ ახალი განაცხადი</span>
            </button>
            <button onClick={fetchParentData} disabled={loading} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              {loading ? 'იტვირთება...' : 'განახლება'}
            </button>
          </div>
        </div>

        {/* Applications Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', margin: 0, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText className="text-burgundy" size={24} />
              ჩემი ონლაინ განაცხადები ({applications.length})
            </h3>
          </div>

          {applications.length === 0 ? (
            <div
              style={{
                background: 'rgba(212, 175, 55, 0.05)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                padding: '40px 24px',
                borderRadius: '16px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '14px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)'
              }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'rgba(212, 175, 55, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#d4af37'
                }}
              >
                <FileText size={26} />
              </div>
              <h4 style={{ color: '#ffffff', fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
                მშობლის პროფილი შექმნილია!
              </h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.78)', maxWidth: '520px', fontSize: '0.94rem', lineHeight: 1.6, margin: 0 }}>
                თქვენი მშობლის ანგარიში აქტიურია. ახლა საჭიროა <strong>მოსწავლის (შვილის) მონაცემების შევსება</strong> (სახელი, კლასი, პირადი ნომერი), რათა განაცხადი დაუყოვნებლივ მიუვიდეს სკოლის ადმინისტრატორს.
              </p>
              <button
                onClick={handleNewApplication}
                style={{
                  background: 'linear-gradient(135deg, #f6d56d 0%, #d4af37 100%)',
                  border: 'none',
                  color: '#1a1014',
                  fontWeight: 700,
                  fontSize: '0.96rem',
                  padding: '12px 28px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  marginTop: '8px',
                  boxShadow: '0 8px 24px rgba(212, 175, 55, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Plus size={18} />
                <span>მოსწავლის ონლაინ განაცხადის შევსება</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {applications.map((app) => {
                const st = appStatusText(app.status);
                const IconComponent = st.icon;

                return (
                  <div key={app.id} className="parent-app-card" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', boxShadow: '0 16px 36px rgba(0,0,0,0.35)', backdropFilter: 'blur(12px)' }}>
                    <div className="parent-app-card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '4px 12px', borderRadius: '12px', background: st.bg, color: st.color, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <IconComponent size={14} />
                          {st.label}
                        </span>
                        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#ffffff', marginTop: '8px', fontWeight: 700 }}>
                          მოსწავლე: {app.student_full_name} ({app.grade_stage})
                        </h4>
                      </div>

                      <span style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                        გაგზავნილია: {new Date(app.created_at).toLocaleDateString('ka-GE')}
                      </span>
                    </div>

                    <div className="parent-app-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.88rem', color: '#f3ece3', background: 'rgba(0, 0, 0, 0.35)', padding: '16px', borderRadius: '10px' }}>
                      <div><strong>მშობლის სახელი:</strong> {app.parent_full_name}</div>
                      <div><strong>პირადი ნომერი:</strong> {app.parent_id_number || 'არ არის'}</div>
                      <div><strong>მისამართი:</strong> {app.parent_address || 'არ არის'}</div>
                    </div>

                    {app.application_documents?.length > 0 && (
                      <div style={{ marginTop: '12px' }}>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>ატვირთული დოკუმენტაცია:</span>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
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
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
