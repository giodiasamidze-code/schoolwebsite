import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  User,
  Edit,
  Bell,
  Settings,
  ArrowLeft,
  Camera,
  Check,
  Calendar,
  Clock,
  BookOpen,
  Users,
  Award,
  Mail,
  Phone,
  Shield,
  Lock,
  ChevronRight,
  Send,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from './AuthContext';

const INITIAL_PROFILE = {
  name: 'გიორგი დავითაშვილი',
  subject: 'მათემატიკა & ალგორითმები',
  education: 'თბილისის სახელმწიფო უნივერსიტეტი (დოქტორანტურა), ოქსფორდის მიწვეული მკვლევარი',
  experience: '16 წლიანი პედაგოგიური და სამეცნიერო გამოცდილება წამყვან აკადემიურ დაწესებულებებში',
  approach: 'პრაქტიკულ ამოცანებზე დაფუძნებული სწავლება, ლოგიკური ანალიზი და ოლიმპიადებისთვის მომზადება',
  phone: '+995 599 12 34 56',
  email: 'g.davitashvili@solomon.edu.ge',
  room: 'აუდიტორია #302'
};

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'აკადემიური დირექცია',
    category: 'ადმინისტრაცია',
    subject: 'პედაგოგიური საბჭოს საორგანიზაციო სხდომა',
    preview: 'პარასკევს, 15:00 საათზე მთავარ სააქტო დარბაზში გაიმართება სასწავლო გეგმის დამტკიცების სხდომა.',
    date: 'დღეს, 10:20',
    unread: true
  },
  {
    id: 2,
    sender: 'ქეთევან ბერიძე (X-A მოსწავლის მშობელი)',
    category: 'მშობლები',
    subject: 'მოსწავლის დამატებითი კონსულტაცია',
    preview: 'გამარჯობა ბატონო გიორგი, გთხოვთ შემატყობინოთ როდის შეძლებს ნიკოლოზი მათემატიკის ოლიმპიადის საკითხებზე კონსულტაციის გავლას.',
    date: 'გუშინ, 16:45',
    unread: true
  },
  {
    id: 3,
    sender: 'სასწავლო ნაწილი',
    category: 'სისტემური',
    subject: 'I სემესტრის სილაბუსების შეთანხმება',
    preview: 'შეგახსენებთ, რომ ელექტრონულ ჟურნალში თემატური გეგმების ატვირთვა დასრულდება 18 სექტემბერს.',
    date: '08 სექ, 12:00',
    unread: false
  },
  {
    id: 4,
    sender: 'ციფრული ბიბლიოთეკა',
    category: 'სისტემური',
    subject: 'ახალი სამეცნიერო რესურსების ხელმისაწვდომობა',
    preview: 'აკადემიის პორტალს დაემატა საერთაშორისო STEM ჟურნალების წვდომა პედაგოგებისთვის.',
    date: '05 სექ, 14:15',
    unread: false
  }
];

export default function TeacherDashboard() {
  const { navigate, logout } = useAuth();
  const [activeNav, setActiveNav] = useState('profile');
  const [savedAlert, setSavedAlert] = useState(false);

  // Profile state with local persistence
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('solomon_teacher_profile');
      return saved ? JSON.parse(saved) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  // Messages state
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [messageFilter, setMessageFilter] = useState('all');

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifs: true,
    smsNotifs: false,
    parentMessages: true,
    publicProfileVisible: true,
    phoneVisible: true
  });
  const [passwords, setPasswords] = useState({ current: '', next: '', repeat: '' });
  const [passwordFeedback, setPasswordFeedback] = useState('');

  const handleSave = () => {
    try {
      localStorage.setItem('solomon_teacher_profile', JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const handleToggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.next) {
      setPasswordFeedback('გთხოვთ შეავსოთ ყველა ველი');
      return;
    }
    if (passwords.next !== passwords.repeat) {
      setPasswordFeedback('ახალი პაროლები არ ემთხვევა ერთმანეთს');
      return;
    }
    setPasswordFeedback('პაროლი წარმატებით შეიცვალა!');
    setPasswords({ current: '', next: '', repeat: '' });
    setTimeout(() => setPasswordFeedback(''), 3000);
  };

  const unreadCount = messages.filter((m) => m.unread).length;

  const filteredMessages = messages.filter((m) => {
    if (messageFilter === 'all') return true;
    if (messageFilter === 'admin') return m.category === 'ადმინისტრაცია';
    if (messageFilter === 'parents') return m.category === 'მშობლები';
    if (messageFilter === 'system') return m.category === 'სისტემური';
    return true;
  });

  const handleMarkAsRead = (id) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, unread: false } : m))
    );
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundImage: `linear-gradient(180deg, rgba(12, 6, 8, 0.45) 0%, rgba(12, 6, 8, 0.65) 100%), url(/assets/palace-interior.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '0 0 24px 0'
      }}
    >
      {/* Top Header */}
      <header
        style={{
          height: '70px',
          background: 'rgba(20, 12, 15, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 36px',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <span
              style={{
                fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                fontSize: '1rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#d4af37'
              }}
            >
              SOLOMON ACADEMY
            </span>
          </div>
          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.15)' }} />
          <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff' }}>
            პედაგოგის პორტალი
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            საიტზე დაბრუნება
          </button>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#d4af37'
            }}
          >
            <User size={18} />
          </div>
          <button
            onClick={logout}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            გასვლა
          </button>
        </div>
      </header>

      {/* Main 3-Column Layout */}
      <div
        style={{
          maxWidth: '1360px',
          width: '100%',
          margin: '24px auto 0',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: '240px 1fr 280px',
          gap: '24px',
          alignItems: 'start'
        }}
      >
        {/* Left Sidebar Menu */}
        <div
          style={{
            background: 'rgba(25, 16, 20, 0.75)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: '16px',
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '460px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { id: 'overview', label: 'მიმოხილვა', icon: LayoutDashboard },
              { id: 'profile', label: 'ჩემი პროფილი', icon: User },
              { id: 'edit', label: 'რედაქტირება', icon: Edit },
              { id: 'messages', label: 'შეტყობინებები', icon: Bell, badge: unreadCount },
              { id: 'settings', label: 'პარამეტრები', icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    setSelectedMessage(null);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    background: isActive ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(212, 175, 55, 0.4)' : 'transparent'}`,
                    color: isActive ? '#d4af37' : 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span
                      style={{
                        background: '#d4af37',
                        color: '#1a1104',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: '10px',
                        lineHeight: 1
                      }}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.45)', textAlign: 'center', marginBottom: '10px' }}>
              პედაგოგის პორტალი · აკადემია
            </div>
            <button
              onClick={() => navigate('/')}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: '8px',
                padding: '8px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={14} />
              <span>მთავარზე დაბრუნება</span>
            </button>
          </div>
        </div>

        {/* Center Dynamic Content Area */}
        <div
          style={{
            background: 'rgba(25, 16, 20, 0.75)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: '20px',
            padding: '28px 32px',
            minHeight: '520px'
          }}
        >
          {/* TAB 1: OVERVIEW (მიმოხილვა) */}
          {activeNav === 'overview' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
                <div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                      fontSize: '1.6rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      marginBottom: '4px'
                    }}
                  >
                    აკადემიური მიმოხილვა
                  </h2>
                  <p style={{ fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                    2026-2027 სასწავლო წლის I სემესტრის დატვირთვა და აქტივობები
                  </p>
                </div>
                <span
                  style={{
                    background: 'rgba(212, 175, 55, 0.15)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    color: '#d4af37',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    padding: '4px 12px',
                    borderRadius: '6px'
                  }}
                >
                  აქტიური პედაგოგი
                </span>
              </div>

              {/* KPI Metrics */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '12px',
                  marginBottom: '26px'
                }}
              >
                {[
                  { label: 'საათობრივი დატვირთვა', value: '18 სთ/კვ', icon: Clock, note: 'სრული განაკვეთი' },
                  { label: 'მიმაგრებული კლასები', value: '3 კლასი', icon: BookOpen, note: 'X-A, XI-A, XII-B' },
                  { label: 'მოსწავლეთა სულ რაოდენობა', value: '64', icon: Users, note: 'აქტიური მოსწავლე' },
                  { label: 'საშუალო მოსწრება', value: '9.3 / 10', icon: Award, note: 'მაღალი აკადემიური დონე' }
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(0, 0, 0, 0.35)',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                        borderRadius: '12px',
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.65)' }}>{stat.label}</span>
                        <Icon size={16} color="#d4af37" />
                      </div>
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f5e4b5' }}>{stat.value}</div>
                        <div style={{ fontSize: '0.7rem', color: '#d4af37', marginTop: '2px' }}>{stat.note}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Today's Schedule */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={18} color="#d4af37" />
                    დღის გაკვეთილების განრიგი
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)' }}>დღეს: ხუთშაბათი</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { time: '09:00 - 10:30', title: 'მათემატიკური ანალიზი', classRoom: 'X-A კლასი · აუდიტორია 302', status: 'დასრულებული' },
                    { time: '11:00 - 12:30', title: 'ალგორითმები & პროგრამირება', classRoom: 'XI-A კლასი · კომპიუტერული ლაბი', status: 'მიმდინარე', active: true },
                    { time: '13:30 - 15:00', title: 'ოლიმპიური მომზადება', classRoom: 'XII-B კლასი · მცირე დარბაზი', status: 'დაგეგმილი' }
                  ].map((lesson, i) => (
                    <div
                      key={i}
                      style={{
                        background: lesson.active ? 'rgba(212, 175, 55, 0.12)' : 'rgba(0, 0, 0, 0.3)',
                        border: `1px solid ${lesson.active ? 'rgba(212, 175, 55, 0.45)' : 'rgba(212, 175, 55, 0.15)'}`,
                        borderRadius: '10px',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.88rem', color: '#d4af37', fontWeight: 600 }}>
                          {lesson.time}
                        </span>
                        <div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff' }}>{lesson.title}</div>
                          <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.6)' }}>{lesson.classRoom}</div>
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: lesson.active ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                          color: lesson.active ? '#f5e4b5' : 'rgba(255, 255, 255, 0.6)'
                        }}
                      >
                        {lesson.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Academic Notice */}
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <AlertCircle size={20} color="#d4af37" />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>შუალედური შეფასებების პერიოდი</div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                      გთხოვთ შეავსოთ ელექტრონული ჟურნალი X-A კლასის საკონტროლო სამუშაოსთვის.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveNav('messages')}
                  style={{
                    background: 'rgba(212, 175, 55, 0.2)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    color: '#d4af37',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  შეტყობინებების ნახვა
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE VIEW (ჩემი პროფილი) */}
          {activeNav === 'profile' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2
                  style={{
                    fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                    fontSize: '1.6rem',
                    fontWeight: 700,
                    color: '#ffffff'
                  }}
                >
                  ჩემი პროფილი
                </h2>
                <button
                  onClick={() => setActiveNav('edit')}
                  style={{
                    background: 'linear-gradient(180deg, #d4af37 0%, #b88628 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 18px',
                    color: '#1a1104',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Edit size={15} />
                  <span>პროფილის რედაქტირება</span>
                </button>
              </div>

              {/* Profile Card Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '22px'
                }}
              >
                <div
                  style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '50%',
                    background: 'rgba(212, 175, 55, 0.2)',
                    border: '2px solid rgba(212, 175, 55, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#d4af37'
                  }}
                >
                  <User size={38} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                    {profile.name}
                  </h3>
                  <div style={{ fontSize: '0.92rem', color: '#d4af37', fontWeight: 600, marginBottom: '6px' }}>
                    {profile.subject}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Mail size={13} color="#d4af37" /> {profile.email}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={13} color="#d4af37" /> {profile.phone}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <BookOpen size={13} color="#d4af37" /> {profile.room}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details sections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(212, 175, 55, 0.15)',
                    borderRadius: '12px',
                    padding: '16px'
                  }}
                >
                  <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#d4af37', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '6px' }}>
                    განათლება & აკადემიური ხარისხი
                  </div>
                  <div style={{ fontSize: '0.92rem', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.5 }}>
                    {profile.education}
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(212, 175, 55, 0.15)',
                    borderRadius: '12px',
                    padding: '16px'
                  }}
                >
                  <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#d4af37', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '6px' }}>
                    პედაგოგიური და სამეცნიერო გამოცდილება
                  </div>
                  <div style={{ fontSize: '0.92rem', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.5 }}>
                    {profile.experience}
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(212, 175, 55, 0.15)',
                    borderRadius: '12px',
                    padding: '16px'
                  }}
                >
                  <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#d4af37', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '6px' }}>
                    სწავლების მეთოდოლოგია & მიდგომა
                  </div>
                  <div style={{ fontSize: '0.92rem', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.5 }}>
                    {profile.approach}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EDIT PROFILE (რედაქტირება) */}
          {activeNav === 'edit' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
                <div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                      fontSize: '1.6rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      marginBottom: '4px'
                    }}
                  >
                    პროფილის რედაქტირება
                  </h2>
                  <p style={{ fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                    განაახლეთ თქვენი პედაგოგიური დოსიე და საკონტაქტო ინფორმაცია
                  </p>
                </div>
                <span
                  style={{
                    background: 'rgba(212, 175, 55, 0.15)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    color: '#d4af37',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    padding: '4px 12px',
                    borderRadius: '6px'
                  }}
                >
                  რედაქტორი
                </span>
              </div>

              {/* Avatar Upload Preview */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#d4af37'
                  }}
                >
                  <User size={32} />
                </div>
                <div>
                  <button
                    onClick={() => alert('ფოტოს ატვირთვის ფუნქცია: გთხოვთ აირჩიოთ სურათი თქვენი მოწყობილობიდან')}
                    style={{
                      background: 'rgba(212, 175, 55, 0.15)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      color: '#f5e4b5',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      padding: '6px 14px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Camera size={14} />
                    <span>ახალი ფოტოს ატვირთვა</span>
                  </button>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.45)', marginTop: '4px' }}>
                    რეკომენდებული ზომა: 400x400 JPG/PNG
                  </div>
                </div>
              </div>

              {/* Inputs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)', marginBottom: '4px' }}>
                      სახელი და გვარი
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'rgba(0, 0, 0, 0.35)',
                        border: '1px solid rgba(212, 175, 55, 0.25)',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)', marginBottom: '4px' }}>
                      საგანი და მიმართულება
                    </label>
                    <input
                      type="text"
                      value={profile.subject}
                      onChange={(e) => setProfile({ ...profile, subject: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'rgba(0, 0, 0, 0.35)',
                        border: '1px solid rgba(212, 175, 55, 0.25)',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)', marginBottom: '4px' }}>
                      ელ-ფოსტა
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'rgba(0, 0, 0, 0.35)',
                        border: '1px solid rgba(212, 175, 55, 0.25)',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        color: '#ffffff',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)', marginBottom: '4px' }}>
                      ტელეფონი
                    </label>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'rgba(0, 0, 0, 0.35)',
                        border: '1px solid rgba(212, 175, 55, 0.25)',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        color: '#ffffff',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)', marginBottom: '4px' }}>
                      კაბინეტის ნომერი
                    </label>
                    <input
                      type="text"
                      value={profile.room}
                      onChange={(e) => setProfile({ ...profile, room: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'rgba(0, 0, 0, 0.35)',
                        border: '1px solid rgba(212, 175, 55, 0.25)',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        color: '#ffffff',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)', marginBottom: '4px' }}>
                    განათლება
                  </label>
                  <textarea
                    rows={2}
                    value={profile.education}
                    onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(0, 0, 0, 0.35)',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)', marginBottom: '4px' }}>
                    გამოცდილება
                  </label>
                  <textarea
                    rows={2}
                    value={profile.experience}
                    onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(0, 0, 0, 0.35)',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)', marginBottom: '4px' }}>
                    სწავლების მიდგომა
                  </label>
                  <textarea
                    rows={2}
                    value={profile.approach}
                    onChange={(e) => setProfile({ ...profile, approach: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(0, 0, 0, 0.35)',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleSave}
                  style={{
                    background: 'linear-gradient(180deg, #d4af37 0%, #b88628 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '11px 28px',
                    color: '#1a1104',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {savedAlert ? <Check size={18} /> : null}
                  <span>{savedAlert ? 'შენახულია!' : 'ცვლილებების შენახვა'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: MESSAGES (შეტყობინებები) */}
          {activeNav === 'messages' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                      fontSize: '1.6rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      marginBottom: '4px'
                    }}
                  >
                    შეტყობინებები
                  </h2>
                  <p style={{ fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                    აკადემიის ადმინისტრაციისა და მშობლების ოფიციალური უწყებები
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[
                    { id: 'all', label: 'ყველა' },
                    { id: 'admin', label: 'ადმინისტრაცია' },
                    { id: 'parents', label: 'მშობლები' },
                    { id: 'system', label: 'სისტემური' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setMessageFilter(f.id)}
                      style={{
                        background: messageFilter === f.id ? 'rgba(212, 175, 55, 0.25)' : 'rgba(0, 0, 0, 0.3)',
                        border: `1px solid ${messageFilter === f.id ? 'rgba(212, 175, 55, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                        borderRadius: '8px',
                        padding: '5px 12px',
                        color: messageFilter === f.id ? '#d4af37' : 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {selectedMessage ? (
                /* Single message detail */
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    borderRadius: '14px',
                    padding: '20px'
                  }}
                >
                  <button
                    onClick={() => setSelectedMessage(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#d4af37',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      marginBottom: '14px'
                    }}
                  >
                    <ArrowLeft size={14} /> სიაში დაბრუნება
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                      {selectedMessage.subject}
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                      {selectedMessage.date}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.82rem', color: '#d4af37', fontWeight: 600 }}>გამომგზავნი:</span>
                    <span style={{ fontSize: '0.84rem', color: '#ffffff' }}>{selectedMessage.sender}</span>
                    <span
                      style={{
                        marginLeft: 'auto',
                        fontSize: '0.72rem',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'rgba(212, 175, 55, 0.15)',
                        color: '#d4af37'
                      }}
                    >
                      {selectedMessage.category}
                    </span>
                  </div>

                  <div
                    style={{
                      background: 'rgba(25, 16, 20, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '10px',
                      padding: '16px',
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      color: 'rgba(255, 255, 255, 0.9)',
                      marginBottom: '20px'
                    }}
                  >
                    {selectedMessage.preview}
                  </div>

                  {/* Reply box */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '6px' }}>
                      საპასუხო შეტყობინების გაგზავნა
                    </label>
                    <textarea
                      rows={3}
                      placeholder="დაწერეთ თქვენი პასუხი..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(212, 175, 55, 0.25)',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        color: '#ffffff',
                        fontSize: '0.88rem',
                        outline: 'none',
                        resize: 'none',
                        marginBottom: '10px'
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => {
                          if (!replyText.trim()) return;
                          alert('პასუხი წარმატებით გაიგზავნა!');
                          setReplyText('');
                        }}
                        style={{
                          background: 'linear-gradient(180deg, #d4af37 0%, #b88628 100%)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 20px',
                          color: '#1a1104',
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Send size={14} />
                        <span>გაგზავნა</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Message list */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filteredMessages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255, 255, 255, 0.5)' }}>
                      შეტყობინებები არ მოიძებნა
                    </div>
                  ) : (
                    filteredMessages.map((msg) => (
                      <div
                        key={msg.id}
                        onClick={() => {
                          setSelectedMessage(msg);
                          handleMarkAsRead(msg.id);
                        }}
                        style={{
                          background: msg.unread ? 'rgba(212, 175, 55, 0.12)' : 'rgba(0, 0, 0, 0.25)',
                          border: `1px solid ${msg.unread ? 'rgba(212, 175, 55, 0.4)' : 'rgba(212, 175, 55, 0.12)'}`,
                          borderRadius: '12px',
                          padding: '14px 18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: msg.unread ? '#d4af37' : 'transparent',
                              border: `1px solid ${msg.unread ? '#d4af37' : 'rgba(255,255,255,0.2)'}`,
                              flexShrink: 0
                            }}
                          />
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: msg.unread ? '#f5e4b5' : '#ffffff' }}>
                                {msg.sender}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.7rem',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  background: 'rgba(212, 175, 55, 0.15)',
                                  color: '#d4af37'
                                }}
                              >
                                {msg.category}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.9rem', fontWeight: msg.unread ? 600 : 400, color: '#ffffff', marginBottom: '3px' }}>
                              {msg.subject}
                            </div>
                            <div
                              style={{
                                fontSize: '0.78rem',
                                color: 'rgba(255, 255, 255, 0.55)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {msg.preview}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, marginLeft: '12px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.45)' }}>{msg.date}</span>
                          <ChevronRight size={16} color="rgba(212, 175, 55, 0.6)" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SETTINGS (პარამეტრები) */}
          {activeNav === 'settings' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
                <div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                      fontSize: '1.6rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      marginBottom: '4px'
                    }}
                  >
                    პარამეტრები & უსაფრთხოება
                  </h2>
                  <p style={{ fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                    მართეთ თქვენი ანგარიშის შეტყობინებები და უსაფრთხოების პარამეტრები
                  </p>
                </div>
                <span
                  style={{
                    background: 'rgba(212, 175, 55, 0.15)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    color: '#d4af37',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    padding: '4px 12px',
                    borderRadius: '6px'
                  }}
                >
                  კონფიგურაცია
                </span>
              </div>

              {/* Toggles */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#d4af37', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bell size={16} /> შეტყობინებების მიღება
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { key: 'emailNotifs', label: 'ელ-ფოსტის შეტყობინებები', desc: 'მიიღეთ უწყებები და სკოლის სიახლეები ელ-ფოსტაზე' },
                    { key: 'smsNotifs', label: 'SMS შეტყობინებები', desc: 'სასწრაფო აკადემიური შეტყობინებები მობილურზე' },
                    { key: 'parentMessages', label: 'მშობელთა შეტყობინებები', desc: 'დაუშვით მშობლების მიერ პირდაპირი შეტყობინებების გამოგზავნა' }
                  ].map((item) => (
                    <div
                      key={item.key}
                      onClick={() => handleToggleSetting(item.key)}
                      style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(212, 175, 55, 0.15)',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>{item.label}</div>
                        <div style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.55)' }}>{item.desc}</div>
                      </div>
                      <div
                        style={{
                          width: '44px',
                          height: '24px',
                          borderRadius: '12px',
                          background: settings[item.key] ? '#d4af37' : 'rgba(255, 255, 255, 0.2)',
                          position: 'relative',
                          transition: 'background 0.2s'
                        }}
                      >
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: '#1a1104',
                            position: 'absolute',
                            top: '3px',
                            left: settings[item.key] ? '22px' : '3px',
                            transition: 'left 0.2s'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Password update section */}
              <div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#d4af37', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lock size={16} /> პაროლის შეცვლა
                </h3>
                <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.65)', marginBottom: '4px' }}>
                      მიმდინარე პაროლი
                    </label>
                    <input
                      type="password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      placeholder="••••••••"
                      style={{
                        width: '100%',
                        background: 'rgba(0, 0, 0, 0.35)',
                        border: '1px solid rgba(212, 175, 55, 0.25)',
                        borderRadius: '8px',
                        padding: '9px 12px',
                        color: '#ffffff',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.65)', marginBottom: '4px' }}>
                        ახალი პაროლი
                      </label>
                      <input
                        type="password"
                        value={passwords.next}
                        onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                        placeholder="••••••••"
                        style={{
                          width: '100%',
                          background: 'rgba(0, 0, 0, 0.35)',
                          border: '1px solid rgba(212, 175, 55, 0.25)',
                          borderRadius: '8px',
                          padding: '9px 12px',
                          color: '#ffffff',
                          fontSize: '0.88rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.65)', marginBottom: '4px' }}>
                        გაიმეორეთ ახალი პაროლი
                      </label>
                      <input
                        type="password"
                        value={passwords.repeat}
                        onChange={(e) => setPasswords({ ...passwords, repeat: e.target.value })}
                        placeholder="••••••••"
                        style={{
                          width: '100%',
                          background: 'rgba(0, 0, 0, 0.35)',
                          border: '1px solid rgba(212, 175, 55, 0.25)',
                          borderRadius: '8px',
                          padding: '9px 12px',
                          color: '#ffffff',
                          fontSize: '0.88rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {passwordFeedback && (
                    <div
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        background: passwordFeedback.includes('წარმატებით') ? 'rgba(74, 222, 128, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        border: `1px solid ${passwordFeedback.includes('წარმატებით') ? 'rgba(74, 222, 128, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                        color: passwordFeedback.includes('წარმატებით') ? '#86efac' : '#fca5a5'
                      }}
                    >
                      {passwordFeedback}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                    <button
                      type="submit"
                      style={{
                        background: 'linear-gradient(180deg, #d4af37 0%, #b88628 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '9px 22px',
                        color: '#1a1104',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      პაროლის განახლება
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Public Profile Preview */}
        <div
          style={{
            background: 'rgba(25, 16, 20, 0.75)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: '20px',
            padding: '24px',
            textAlign: 'center'
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
              fontSize: '1.05rem',
              color: '#ffffff',
              marginBottom: '24px'
            }}
          >
            საჯარო პროფილის<br />გადახედვა
          </h3>

          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.15)',
              border: '2px solid rgba(212, 175, 55, 0.4)',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#d4af37'
            }}
          >
            <User size={44} />
          </div>

          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
            {profile.name || 'პედაგოგის სახელი'}
          </div>

          <div style={{ fontSize: '0.82rem', color: '#d4af37', marginBottom: '18px' }}>
            {profile.subject}
          </div>

          <button
            onClick={() => setActiveNav('profile')}
            style={{
              width: '100%',
              padding: '10px',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '10px',
              color: '#d4af37',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            პროფილის ნახვა
          </button>
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div
        style={{
          maxWidth: '1360px',
          width: '100%',
          margin: '20px auto 0',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => {
              try {
                localStorage.setItem('solomon_teacher_draft', JSON.stringify(profile));
                alert('მონახაზი წარმატებით შეინახა');
              } catch (e) {
                alert('მონახაზი შენახულია');
              }
            }}
            style={{
              background: 'rgba(30, 20, 24, 0.7)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '10px',
              padding: '10px 20px',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            მონახაზი
          </button>
          <button
            onClick={() => setActiveNav('profile')}
            style={{
              background: 'rgba(30, 20, 24, 0.7)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '10px',
              padding: '10px 20px',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            გადახედვა
          </button>
          <button
            onClick={handleSave}
            style={{
              background: 'linear-gradient(180deg, #d4af37 0%, #b88628 100%)',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 24px',
              color: '#1a1104',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {savedAlert ? <Check size={16} /> : null}
            <span>{savedAlert ? 'შენახულია!' : 'ცვლილებების შენახვა'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
