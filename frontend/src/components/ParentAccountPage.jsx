import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';
import { FileText, Calendar, ArrowLeft, Clock, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

export default function ParentAccountPage() {
  const { user, navigate } = useAuth();
  const [applications, setApplications] = useState([]);
  const [bookings, setBookings] = useState([]);

  const fetchParentData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // 1. Fetch applications
      const { data: appData } = await supabase
        .from('applications')
        .select('*, application_documents(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (appData) setApplications(appData);

      // 2. Fetch visit bookings
      const { data: bookingData } = await supabase
        .from('visit_bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (bookingData) setBookings(bookingData);
    } catch (err) {
      console.error('Error fetching parent account data:', err);
    } finally {
      setLoading(false);
    }
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
        <button onClick={() => navigate('/register')} className="btn btn-primary">
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

  const bookingStatusText = (status) => {
    switch (status) {
      case 'pending':
        return { label: 'მოლოდინშია', color: '#b45309', bg: '#fef3c7', icon: Clock };
      case 'confirmed':
        return { label: 'ვიზიტი დადასტურებულია', color: '#15803d', bg: '#dcfce7', icon: CheckCircle2 };
      case 'declined':
        return { label: 'უარყოფილია', color: '#b91c1c', bg: '#fee2e2', icon: XCircle };
      default:
        return { label: status, color: '#475569', bg: '#f1f5f9', icon: Clock };
    }
  };

  return (
    <div className="parent-account-wrapper fade-in" style={{ padding: '40px 0 80px', background: 'var(--bg-primary)' }}>
      <div className="container">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
          <div>
            <button className="back-link-btn" onClick={() => navigate('/')} style={{ marginBottom: '8px' }}>
              <ArrowLeft size={16} className="icon-mr" />
              მთავარ გვერდზე დაბრუნება
            </button>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--text-dark)' }}>
              მშობლის პირადი ანგარიში
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              სალამი, {user.name}! ადევნეთ თვალი თქვენი განაცხადებისა და ვიზიტების სტატუსს real-time რეჟიმში.
            </p>
          </div>

          <button onClick={fetchParentData} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={14} />
            განახლება
          </button>
        </div>

        {/* 1. Applications Section */}
        <div style={{ marginBottom: '48px' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '20px', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText className="text-burgundy" size={24} />
            ჩემი ონლაინ განაცხადები ({applications.length})
          </h3>

          {applications.length === 0 ? (
            <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)' }}>
              თქვენ ჯერ არ გაქვთ გაგზავნილი ონლაინ განაცხადი.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {applications.map((app) => {
                const st = appStatusText(app.status);
                const IconComponent = st.icon;

                return (
                  <div key={app.id} style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '4px 12px', borderRadius: '12px', background: st.bg, color: st.color, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <IconComponent size={14} />
                          {st.label}
                        </span>
                        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-dark)', marginTop: '8px' }}>
                          მოსწავლე: {app.student_full_name} ({app.grade_stage})
                        </h4>
                      </div>

                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        გაგზავნილია: {new Date(app.created_at).toLocaleDateString('ka-GE')}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '0.9rem', color: 'var(--text-dark)', background: 'var(--bg-secondary)', padding: '12px', borderRadius: '6px' }}>
                      <div><strong>მშობლის სახელი:</strong> {app.parent_full_name}</div>
                      <div><strong>პირადი ნომერი:</strong> {app.parent_id_number || 'არ არის'}</div>
                      <div><strong>მისამართი:</strong> {app.parent_address || 'არ არის'}</div>
                    </div>

                    {app.application_documents?.length > 0 && (
                      <div style={{ marginTop: '12px' }}>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>ატვირთული დოკუმენტაცია:</span>
                        <div style={{ display: 'flex', gap: '12px' }}>
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

        {/* 2. Visit Bookings Section */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '20px', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar className="text-gold" size={24} />
            ჩემი ვიზიტის ჯავშნები ({bookings.length})
          </h3>

          {bookings.length === 0 ? (
            <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)' }}>
              თქვენ ჯერ არ გაქვთ დაჯავშნილი ინდივიდუალური ვიზიტი.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {bookings.map((b) => {
                const st = bookingStatusText(b.status);
                const IconComponent = st.icon;

                return (
                  <div key={b.id} style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '4px 12px', borderRadius: '12px', background: st.bg, color: st.color, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <IconComponent size={14} />
                          {st.label}
                        </span>
                        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--text-dark)', marginTop: '8px' }}>
                          ვიზიტის თარიღი: <strong>{b.preferred_date}</strong> ({b.child_name})
                        </h4>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                          საფეხური: {b.grade_stage || 'არ არის მითითებული'} | ტელეფონი: {b.phone}
                        </p>
                      </div>

                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        დაჯავშნილია: {new Date(b.created_at).toLocaleDateString('ka-GE')}
                      </span>
                    </div>
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
