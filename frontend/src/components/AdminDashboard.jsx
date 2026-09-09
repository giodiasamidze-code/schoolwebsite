import React, { useState } from 'react';
import {
  FileText,
  Users,
  GraduationCap,
  DollarSign,
  Layers,
  Sliders,
  Compass,
  Settings,
  Bell,
  Search,
  Plus,
  Trash2,
  Check,
  X,
  Phone,
  Mail,
  Calendar,
  Filter,
  ExternalLink,
  Award,
  BookOpen,
  Building2,
  AlertTriangle,
  Clock,
  Send,
  Download,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from './AuthContext';

export default function AdminDashboard() {
  const { navigate, logout } = useAuth();

  // Active Tab: Defaulting to 'admissions' since Overview is excluded
  const [activeTab, setActiveTab] = useState('admissions'); // 'admissions' | 'students' | 'finance' | 'teachers' | 'facilities' | 'scenarios' | 'settings'

  // =========================================================================
  // 1. CANDIDATES & ADMISSIONS (დეტალური მიღება & გასაუბრების მონაცემები)
  // =========================================================================
  const initialCandidates = [
    {
      id: 101,
      studentName: 'ნიკოლოზ ბერიძე',
      gradeApplied: 'X კლასი (საშუალო საფეხური)',
      parentName: 'დავით ბერიძე',
      phone: '+995 599 12 34 56',
      email: 'd.beridze@gmail.com',
      date: '2026-09-08',
      mathScore: 94,
      englishScore: 92,
      logicScore: 88,
      interviewNotes: 'მაღალი ანალიტიკური უნარები, STEM ოლიმპიადის მონაწილე.',
      scholarshipRequest: '25% ნიჭიერთა სტიპენდია',
      status: 'გასაუბრება გავლილი' // 'ახალი განაცხადი' | 'გასაუბრება დანიშნული' | 'გასაუბრება გავლილი' | 'ჩარიცხული' | 'უარყოფილი'
    },
    {
      id: 102,
      studentName: 'მარიამ მაისურაძე',
      gradeApplied: 'VIII კლასი (საბაზო საფეხური)',
      parentName: 'ნინო კაპანაძე',
      phone: '+995 595 44 22 11',
      email: 'n.kapanadze@yahoo.com',
      date: '2026-09-07',
      mathScore: 98,
      englishScore: 96,
      logicScore: 95,
      interviewNotes: 'გამორჩეული ლინგვისტური და მათემატიკური ნიჭი. რეკომენდებულია უპირობო ჩარიცხვა.',
      scholarshipRequest: 'სტანდარტული',
      status: 'ჩარიცხული'
    },
    {
      id: 103,
      studentName: 'გიორგი გელაშვილი',
      gradeApplied: 'III კლასი (დაწყებითი საფეხური)',
      parentName: 'ლევან გელაშვილი',
      phone: '+995 577 98 76 54',
      email: 'l.gelashvili@caucasus.net',
      date: '2026-09-06',
      mathScore: 82,
      englishScore: 85,
      logicScore: 80,
      interviewNotes: 'საჭიროებს ინგლისურ ენაში საბაზისო ადაპტაციას.',
      scholarshipRequest: 'სტანდარტული',
      status: 'ახალი განაცხადი'
    },
    {
      id: 104,
      studentName: 'ანასტასია წიკლაური',
      gradeApplied: 'XI კლასი (საშუალო საფეხური - IB/AP)',
      parentName: 'თამარ ჩხეიძე',
      phone: '+995 591 33 55 77',
      email: 't.chkheidze@tbc.ge',
      date: '2026-09-05',
      mathScore: 99,
      englishScore: 98,
      logicScore: 96,
      interviewNotes: 'საერთაშორისო დებატ-კლუბის პრიზიორი. ინგლისური C1 სრულყოფილად.',
      scholarshipRequest: '50% აკადემიური გრანტი',
      status: 'ჩარიცხული'
    },
    {
      id: 105,
      studentName: 'ლუკა ჯავახიშვილი',
      gradeApplied: 'VII კლასი (საბაზო საფეხური)',
      parentName: 'გიორგი ჯავახიშვილი',
      phone: '+995 558 71 82 93',
      email: 'g.javakhishvili@mail.com',
      date: '2026-09-04',
      mathScore: 65,
      englishScore: 70,
      logicScore: 68,
      interviewNotes: 'ქულები ვერ აკმაყოფილებს აკადემიის მინიმალურ 75%-იან ბარიერს.',
      scholarshipRequest: 'სტანდარტული',
      status: 'უარყოფილი'
    },
    {
      id: 106,
      studentName: 'სალომე ასათიანი',
      gradeApplied: 'V კლასი (დაწყებითი საფეხური)',
      parentName: 'ეკატერინე დადიანი',
      phone: '+995 599 88 77 66',
      email: 'e.dadiani@art.ge',
      date: '2026-09-03',
      mathScore: 90,
      englishScore: 94,
      logicScore: 89,
      interviewNotes: 'დანიშნულია აკადემიური გასაუბრება ფსიქოლოგთან 12 სექტემბერს.',
      scholarshipRequest: 'სტანდარტული',
      status: 'გასაუბრება დანიშნული'
    }
  ];

  const [candidates, setCandidates] = useState(() => {
    try {
      const saved = localStorage.getItem('academy_detailed_candidates');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialCandidates;
  });

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidateFilter, setCandidateFilter] = useState('ყველა');
  const [candidateSearch, setCandidateSearch] = useState('');

  const saveCandidates = (data) => {
    setCandidates(data);
    try {
      localStorage.setItem('academy_detailed_candidates', JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateCandidateStatus = (id, newStatus) => {
    const updated = candidates.map((c) => (c.id === id ? { ...c, status: newStatus } : c));
    saveCandidates(updated);
    if (selectedCandidate && selectedCandidate.id === id) {
      setSelectedCandidate({ ...selectedCandidate, status: newStatus });
    }
  };

  // =========================================================================
  // 2. ENROLLED STUDENTS REGISTRY (აქტიური მოსწავლეების რეესტრი)
  // =========================================================================
  const initialStudents = [
    {
      id: 'SA-2024-001',
      name: 'საბა ყიფიანი',
      grade: 'X-A STEM',
      level: 'საშუალო',
      gpa: '9.85',
      attendance: '99.4%',
      tuitionPaid: '100%',
      mentor: 'დოქტ. ალექსანდრე მიქაძე',
      achievements: 'ფიზიკის ეროვნული ოლიმპიადის ოქროს მედალი',
      healthNotes: 'ალერგია არ აღენიშნება'
    },
    {
      id: 'SA-2024-002',
      name: 'ელენე ბაგრატიონი',
      grade: 'XI-B ჰუმანიტარული',
      level: 'საშუალო',
      gpa: '9.92',
      attendance: '98.8%',
      tuitionPaid: '100%',
      mentor: 'ქეთევან ჩხეიძე',
      achievements: 'ახალგაზრდა დიპლომატთა ფორუმის გამარჯვებული',
      healthNotes: 'მხედველობის კორექცია'
    },
    {
      id: 'SA-2024-003',
      name: 'დაჩი მესხი',
      grade: 'VIII-A საბაზო',
      level: 'საბაზო',
      gpa: '9.40',
      attendance: '96.5%',
      tuitionPaid: '70%',
      mentor: 'დავით ყიფიანი',
      achievements: 'რობოტიკის ჩემპიონატი RoboCup 2025',
      healthNotes: 'სპორტული ჯგუფი: სრული'
    },
    {
      id: 'SA-2024-004',
      name: 'ნატალია წერეთელი',
      grade: 'IV-B დაწყებითი',
      level: 'დაწყებითი',
      gpa: '9.95',
      attendance: '100%',
      tuitionPaid: '100%',
      mentor: 'მარიამ ჯაფარიძე',
      achievements: 'სასკოლო ჭადრაკის ტურნირის I ადგილი',
      healthNotes: 'ჯანმრთელი'
    },
    {
      id: 'SA-2024-005',
      name: 'ირაკლი გორგასალი',
      grade: 'IX-B საბაზო',
      level: 'საბაზო',
      gpa: '8.95',
      attendance: '93.2%',
      tuitionPaid: '50%',
      mentor: 'გიორგი ანდრონიკაშვილი',
      achievements: 'ისტორიული დებატების ფინალისტი',
      healthNotes: 'ასთმური ალერგია'
    },
    {
      id: 'SA-2024-006',
      name: 'მარიამ ორბელიანი',
      grade: 'XII-A საერთაშორისო',
      level: 'საშუალო',
      gpa: '10.0',
      attendance: '99.8%',
      tuitionPaid: '100%',
      mentor: 'სოფიო ერისთავი',
      achievements: 'SAT 1540/1600 · Harvard Summer School სტიპენდია',
      healthNotes: 'ჯანმრთელი'
    }
  ];

  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('academy_students_registry');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialStudents;
  });

  const [studentLevelFilter, setStudentLevelFilter] = useState('ყველა');
  const [studentSearch, setStudentSearch] = useState('');

  // =========================================================================
  // 3. TUITION & FINANCIAL LEDGER (ფინანსური რეესტრი & გადახდები)
  // =========================================================================
  const initialTuitionRecords = [
    {
      id: 'INV-2026-081',
      studentName: 'საბა ყიფიანი',
      grade: 'X-A',
      annualFee: 11000,
      paidAmount: 11000,
      dueAmount: 0,
      nextDueDate: 'სრულად დაფარულია',
      plan: 'წლიური (1 გადახდა)',
      status: 'დაფარული',
      scholarship: 'არ აქვს'
    },
    {
      id: 'INV-2026-082',
      studentName: 'ელენე ბაგრატიონი',
      grade: 'XI-B',
      annualFee: 11000,
      paidAmount: 11000,
      dueAmount: 0,
      nextDueDate: 'სრულად დაფარულია',
      plan: 'წლიური (1 გადახდა)',
      status: 'დაფარული',
      scholarship: '20% აკადემიური'
    },
    {
      id: 'INV-2026-083',
      studentName: 'დაჩი მესხი',
      grade: 'VIII-A',
      annualFee: 9500,
      paidAmount: 6650,
      dueAmount: 2850,
      nextDueDate: '2026-10-15',
      plan: '10-თვიანი განვადება',
      status: 'მოლოდინში',
      scholarship: 'არ აქვს'
    },
    {
      id: 'INV-2026-084',
      studentName: 'ირაკლი გორგასალი',
      grade: 'IX-B',
      annualFee: 9500,
      paidAmount: 4750,
      dueAmount: 4750,
      nextDueDate: '2026-09-01 (ვადაგასული)',
      plan: '10-თვიანი განვადება',
      status: 'ვადაგადაცილებული',
      scholarship: 'არ აქვს'
    },
    {
      id: 'INV-2026-085',
      studentName: 'მარიამ ორბელიანი',
      grade: 'XII-A',
      annualFee: 11000,
      paidAmount: 0,
      dueAmount: 0,
      nextDueDate: 'გრანტით დაფარული',
      plan: 'სრული სტიპენდია',
      status: 'სტიპენდია',
      scholarship: '100% აკადემიის საბჭო'
    }
  ];

  const [tuitionRecords, setTuitionRecords] = useState(initialTuitionRecords);
  const [tuitionFilter, setTuitionFilter] = useState('ყველა');
  const [reminderAlert, setReminderAlert] = useState('');

  const handleSendReminder = (studentName) => {
    setReminderAlert(`შეხსენება წარმატებით გაიგზავნა: ${studentName}`);
    setTimeout(() => setReminderAlert(''), 3000);
  };

  // =========================================================================
  // 4. FACULTY & WORKLOAD (პედაგოგიური დატვირთვა & კათედრები)
  // =========================================================================
  const initialFaculty = [
    {
      id: 201,
      name: 'დოქტ. ალექსანდრე მიქაძე',
      title: 'აკადემიური დოქტორი (MIT Alumnus)',
      dept: 'STEM & რობოტიკა',
      weeklyHours: 20,
      classes: 'X-A, XI-A, XII-A (STEM ლიგა)',
      advisoryClass: 'X-A STEM',
      rating: '4.98 / 5.0',
      research: 'AI ალგორითმები სასკოლო განათლებაში',
      email: 'a.mikadze@solomon.ge',
      phone: '+995 599 01 02 03'
    },
    {
      id: 202,
      name: 'ქეთევან ჩხეიძე',
      title: 'ფილოლოგიის მეცნიერებათა დოქტორი',
      dept: 'ქართული ფილოლოგია & რიტორიკა',
      weeklyHours: 18,
      classes: 'IX-B, XI-B, XII-A',
      advisoryClass: 'XI-B ჰუმანიტარული',
      rating: '4.95 / 5.0',
      research: 'სასამართლო და აკადემიური რიტორიკა',
      email: 'k.chkheidze@solomon.ge',
      phone: '+995 599 04 05 06'
    },
    {
      id: 203,
      name: 'დავით ყიფიანი',
      title: 'მათემატიკის პროფესორი',
      dept: 'უმაღლესი მათემატიკა',
      weeklyHours: 22,
      classes: 'VIII-A, IX-A, X-A, XI-A',
      advisoryClass: 'IX-A მათემატიკა',
      rating: '4.92 / 5.0',
      research: 'ოლიმპიური კომბინატორიკა და ალგორითმები',
      email: 'd.qipiani@solomon.ge',
      phone: '+995 599 07 08 09'
    },
    {
      id: 204,
      name: 'სოფიო ერისთავი',
      title: 'MA in Applied Linguistics (Oxford)',
      dept: 'უცხო ენები & Debate Union',
      weeklyHours: 16,
      classes: 'X-A, XI-B, XII-A',
      advisoryClass: 'XII-A საერთაშორისო',
      rating: '4.99 / 5.0',
      research: 'C2 Proficiency & Model UN მომზადება',
      email: 's.eristavi@solomon.ge',
      phone: '+995 599 10 11 12'
    },
    {
      id: 205,
      name: 'გიორგი ანდრონიკაშვილი',
      title: 'ისტორიის დოქტორი, დიპლომატი',
      dept: 'სოციალური მეცნიერებები',
      weeklyHours: 18,
      classes: 'VIII-B, IX-B, XI-B',
      advisoryClass: 'არ ჰყავს',
      rating: '4.90 / 5.0',
      research: 'საქართველოს დიპლომატიური ისტორია',
      email: 'g.andronikashvili@solomon.ge',
      phone: '+995 599 13 14 15'
    }
  ];

  const [faculty] = useState(initialFaculty);
  const [facultyDeptFilter, setFacultyDeptFilter] = useState('ყველა');

  // =========================================================================
  // 5. FACILITIES & CAMPUS MONITORING (სივრცეები & აღჭურვილობა)
  // =========================================================================
  const campusFacilities = [
    {
      name: 'STEM ინოვაციური ლაბორატორია',
      capacity: '28 სამუშაო სადგური',
      equipment: 'Dell Precision სამუშაო სადგურები, 3D პრინტერები Formlabs, რობოტიკის ნაკრებები VEX V5',
      dailyLoad: '86% (დატვირთულია 10:00 - 17:30)',
      curator: 'დოქტ. ალექსანდრე მიქაძე',
      status: 'იდეალური',
      maintenanceDate: '2026-08-25 (შემოწმებული)'
    },
    {
      name: 'აკადემიის ასტრონომიული ობსერვატორია',
      capacity: '15 მოსწავლე ერთდროულად',
      equipment: 'Celestron EdgeHD 1400 ტელესკოპი, მზის ფილტრები, ასტროგრაფიული კამერები',
      dailyLoad: 'ღამის ციკლები: სამშაბათი & ხუთშაბათი',
      curator: 'პროფ. რატი ამირეჯიბი',
      status: 'იდეალური',
      maintenanceDate: '2026-08-30 (კალიბრირებული)'
    },
    {
      name: 'ისტორიული სამეფო ბიბლიოთეკა & ციფრული დარბაზი',
      capacity: '60 სამკითხველო ადგილი',
      equipment: '14,500 ფიზიკური ტომი, JSTOR & Britannica Institutional წვდომა, 20 iPad Pro სადგური',
      dailyLoad: '72% (მუდმივი გამოყენება)',
      curator: 'მარიამ ჩოლოყაშვილი',
      status: 'იდეალური',
      maintenanceDate: '2026-09-01'
    },
    {
      name: 'აკადემიური დარბაზი (Grand Assembly Hall)',
      capacity: '320 ადგილი',
      equipment: 'აკუსტიკური სისტემა Bose Professional, 4K ლაზერული პროექცია, საკონცერტო როიალი Steinway',
      dailyLoad: 'დაჯავშნილია 15 სექტემბერს (სასწავლო წლის გახსნა)',
      curator: 'სცენის ტექნიკური ჯგუფი',
      status: 'მზადყოფნაში',
      maintenanceDate: '2026-09-05'
    }
  ];

  // =========================================================================
  // 6. SCENARIO SIMULATOR (სტრატეგიული ფინანსური სიმულატორი)
  // =========================================================================
  const [studentsGrowth, setStudentsGrowth] = useState(8);
  const [feeChange, setFeeChange] = useState(3);
  const [expenseChange, setExpenseChange] = useState(9);
  const [paymentDelay, setPaymentDelay] = useState(12);
  const [useLoan, setUseLoan] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('immediate');
  const [submittedMessage, setSubmittedMessage] = useState('');

  const handleSendToReview = () => {
    setSubmittedMessage('სტრატეგიული მოდელი გადაგზავნილია სამეთვალყურეო საბჭოში!');
    setTimeout(() => setSubmittedMessage(''), 3000);
  };

  // =========================================================================
  // 7. SETTINGS
  // =========================================================================
  const [settings, setSettings] = useState({
    academicYear: '2026–2027',
    intakeQuotaTotal: 520,
    currentEnrolled: 482,
    admissionsOpen: true,
    accreditationStatus: 'ავტორიზებული (უმაღლესი 6-წლიანი სტატუსი)',
    contactPhone: '+995 32 2 10 20 30',
    contactEmail: 'admissions@solomon.ge',
    address: 'თბილისი, ჩოლოყაშვილის გამზ. 48'
  });
  const [settingsSavedAlert, setSettingsSavedAlert] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundImage: `linear-gradient(180deg, rgba(12, 6, 8, 0.78) 0%, rgba(12, 6, 8, 0.92) 100%), url(/assets/palace-interior.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* Top Header Bar */}
      <header
        style={{
          height: '70px',
          background: 'rgba(20, 12, 15, 0.92)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            onClick={() => navigate('/')}
            style={{
              fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
              fontSize: '1.05rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#d4af37',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>SOLOMON ACADEMY</span>
          </div>
          <div style={{ width: '1px', height: '22px', background: 'rgba(255,255,255,0.15)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.98rem', fontWeight: 600, color: '#ffffff' }}>
              აკადემიის მართვის სისტემა
            </span>
            <span
              style={{
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                color: '#d4af37',
                fontSize: '0.74rem',
                fontWeight: 600,
                padding: '2px 10px',
                borderRadius: '6px'
              }}
            >
              სასწავლო წელი 2026–2027
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              padding: '6px 14px',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <ExternalLink size={14} />
            <span>საიტის ნახვა</span>
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(0,0,0,0.35)',
              padding: '4px 14px 4px 6px',
              borderRadius: '24px',
              border: '1px solid rgba(212, 175, 55, 0.25)'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(212, 175, 55, 0.25)',
                color: '#d4af37',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
            >
              A
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>ადმინისტრაცია</span>
              <span style={{ fontSize: '0.68rem', color: '#d4af37' }}>სრული წვდომა</span>
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.65)',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)')}
          >
            გასვლა
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div
        style={{
          maxWidth: '1540px',
          width: '100%',
          margin: '24px auto',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '24px',
          alignItems: 'start',
          flex: 1
        }}
      >
        {/* Left Sidebar Navigation */}
        <div
          style={{
            background: 'rgba(25, 16, 20, 0.75)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: '16px',
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            position: 'sticky',
            top: '94px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.45)'
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '6px 12px' }}>
            აკადემიური მართვა
          </div>

          {[
            { id: 'admissions', label: 'მიღება & კანდიდატები', icon: FileText, badge: candidates.filter((c) => c.status !== 'ჩარიცხული' && c.status !== 'უარყოფილი').length },
            { id: 'students', label: 'მოსწავლეთა რეესტრი', icon: GraduationCap, badge: students.length },
            { id: 'finance', label: 'საფასური & ფინანსები', icon: DollarSign },
            { id: 'teachers', label: 'პედაგოგები & დატვირთვა', icon: Users, badge: faculty.length },
            { id: 'facilities', label: 'სივრცეები & ლაბორატორიები', icon: Building2 },
            { id: 'scenarios', label: 'სტრატეგიული სცენარები', icon: Sliders },
            { id: 'settings', label: 'სისტემის პარამეტრები', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: isActive ? 'rgba(212, 175, 55, 0.22)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(212, 175, 55, 0.5)' : 'transparent'}`,
                  color: isActive ? '#d4af37' : 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    style={{
                      background: isActive ? '#d4af37' : 'rgba(255,255,255,0.15)',
                      color: isActive ? '#1a1014' : '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div
            style={{
              marginTop: '20px',
              padding: '14px',
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '10px',
              border: '1px solid rgba(212, 175, 55, 0.15)',
              fontSize: '0.76rem',
              color: 'rgba(255, 255, 255, 0.7)'
            }}
          >
            <div style={{ color: '#d4af37', fontWeight: 600, marginBottom: '4px' }}>
              ავტორიზაციის სტატუსი
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="#4ade80" />
              <span>უმაღლესი კატეგორია</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
          {/* ========================================================================= */}
          {/* TAB 1: CANDIDATES & ADMISSIONS (მიღება & კანდიდატები)                       */}
          {/* ========================================================================= */}
          {activeTab === 'admissions' && (
            <div
              style={{
                background: 'rgba(25, 16, 20, 0.72)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                borderRadius: '16px',
                padding: '26px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                    მიღება & კანდიდატების დოსიე (2026–2027)
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)' }}>
                    ტესტირების ქულები, გასაუბრების შედეგები და მიმღები კომისიის გადაწყვეტილებები
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {['ყველა', 'ახალი განაცხადი', 'გასაუბრება დანიშნული', 'გასაუბრება გავლილი', 'ჩარიცხული', 'უარყოფილი'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setCandidateFilter(filter)}
                      style={{
                        background: candidateFilter === filter ? 'rgba(212, 175, 55, 0.25)' : 'rgba(0, 0, 0, 0.35)',
                        border: `1px solid ${candidateFilter === filter ? '#d4af37' : 'rgba(255, 255, 255, 0.12)'}`,
                        color: candidateFilter === filter ? '#d4af37' : 'rgba(255, 255, 255, 0.75)',
                        borderRadius: '20px',
                        padding: '6px 14px',
                        fontSize: '0.78rem',
                        fontWeight: candidateFilter === filter ? 700 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '380px' }}>
                <Search size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="ძიება კანდიდატის ან მშობლის სახელით..."
                  value={candidateSearch}
                  onChange={(e) => setCandidateSearch(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '10px',
                    padding: '8px 14px 8px 36px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Candidates Table with Detailed Academic Data */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.25)', color: 'rgba(255,255,255,0.6)' }}>
                      <th style={{ padding: '12px 14px' }}>კანდიდატი</th>
                      <th style={{ padding: '12px 14px' }}>კლასი / საფეხური</th>
                      <th style={{ padding: '12px 14px' }}>გამოცდების ქულები</th>
                      <th style={{ padding: '12px 14px' }}>სტიპენდია</th>
                      <th style={{ padding: '12px 14px' }}>სტატუსი</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>მოქმედება</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates
                      .filter((c) => (candidateFilter === 'ყველა' ? true : c.status === candidateFilter))
                      .filter((c) => c.studentName.toLowerCase().includes(candidateSearch.toLowerCase()) || c.parentName.toLowerCase().includes(candidateSearch.toLowerCase()))
                      .map((candidate) => (
                        <tr
                          key={candidate.id}
                          style={{
                            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                            transition: 'background 0.2s',
                            cursor: 'pointer'
                          }}
                          onClick={() => setSelectedCandidate(candidate)}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <td style={{ padding: '14px' }}>
                            <div style={{ fontWeight: 700, color: '#fff' }}>{candidate.studentName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>მშობელი: {candidate.parentName} · {candidate.phone}</div>
                          </td>
                          <td style={{ padding: '14px', color: '#d4af37' }}>{candidate.gradeApplied}</td>
                          <td style={{ padding: '14px' }}>
                            <div style={{ display: 'flex', gap: '8px', fontSize: '0.78rem' }}>
                              <span style={{ background: 'rgba(96, 165, 250, 0.15)', color: '#60a5fa', padding: '2px 6px', borderRadius: '4px' }}>მათ: {candidate.mathScore}</span>
                              <span style={{ background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', padding: '2px 6px', borderRadius: '4px' }}>ინგლ: {candidate.englishScore}</span>
                              <span style={{ background: 'rgba(212, 175, 55, 0.15)', color: '#d4af37', padding: '2px 6px', borderRadius: '4px' }}>ლოგ: {candidate.logicScore}</span>
                            </div>
                          </td>
                          <td style={{ padding: '14px', color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem' }}>{candidate.scholarshipRequest}</td>
                          <td style={{ padding: '14px' }}>
                            <span
                              style={{
                                fontSize: '0.74rem',
                                fontWeight: 600,
                                padding: '4px 10px',
                                borderRadius: '20px',
                                background:
                                  candidate.status === 'ჩარიცხული'
                                    ? 'rgba(34, 197, 94, 0.2)'
                                    : candidate.status === 'უარყოფილი'
                                    ? 'rgba(239, 68, 68, 0.2)'
                                    : 'rgba(212, 175, 55, 0.2)',
                                color:
                                  candidate.status === 'ჩარიცხული'
                                    ? '#4ade80'
                                    : candidate.status === 'უარყოფილი'
                                    ? '#f87171'
                                    : '#d4af37'
                              }}
                            >
                              {candidate.status}
                            </span>
                          </td>
                          <td style={{ padding: '14px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                              {candidate.status !== 'ჩარიცხული' && (
                                <button
                                  onClick={() => handleUpdateCandidateStatus(candidate.id, 'ჩარიცხული')}
                                  title="ჩარიცხვა"
                                  style={{
                                    background: 'rgba(34, 197, 94, 0.2)',
                                    border: '1px solid rgba(34, 197, 94, 0.4)',
                                    color: '#4ade80',
                                    borderRadius: '6px',
                                    padding: '5px 10px',
                                    fontSize: '0.78rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                >
                                  <Check size={13} />
                                  <span>ჩარიცხვა</span>
                                </button>
                              )}
                              {candidate.status !== 'უარყოფილი' && (
                                <button
                                  onClick={() => handleUpdateCandidateStatus(candidate.id, 'უარყოფილი')}
                                  title="უარყოფა"
                                  style={{
                                    background: 'rgba(239, 68, 68, 0.15)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    color: '#f87171',
                                    borderRadius: '6px',
                                    padding: '5px 8px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <X size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Detailed Candidate Dossier Modal */}
              {selectedCandidate && (
                <div
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(14px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                  }}
                  onClick={() => setSelectedCandidate(null)}
                >
                  <div
                    style={{
                      background: '#1a1014',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                      borderRadius: '20px',
                      padding: '32px',
                      maxWidth: '560px',
                      width: '100%',
                      boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>{selectedCandidate.studentName}</h3>
                        <span style={{ fontSize: '0.85rem', color: '#d4af37' }}>{selectedCandidate.gradeApplied}</span>
                      </div>
                      <button onClick={() => setSelectedCandidate(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
                        <X size={20} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem' }}>
                      <div style={{ background: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '10px' }}>
                        <div style={{ color: '#d4af37', fontWeight: 600, marginBottom: '6px' }}>საგამოცდო შედეგები</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                          <div>მათემატიკა: <strong>{selectedCandidate.mathScore} / 100</strong></div>
                          <div>ინგლისური: <strong>{selectedCandidate.englishScore} / 100</strong></div>
                          <div>ლოგიკა: <strong>{selectedCandidate.logicScore} / 100</strong></div>
                        </div>
                      </div>

                      <div style={{ background: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '10px' }}>
                        <div style={{ color: '#d4af37', fontWeight: 600, marginBottom: '6px' }}>მიმღები კომისიის დასკვნა</div>
                        <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>{selectedCandidate.interviewNotes}</p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <span>მშობლის კონტაქტი:</span>
                        <strong>{selectedCandidate.parentName} ({selectedCandidate.phone})</strong>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <span>სტიპენდიის მოთხოვნა:</span>
                        <strong style={{ color: '#d4af37' }}>{selectedCandidate.scholarshipRequest}</strong>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                        <button
                          onClick={() => handleUpdateCandidateStatus(selectedCandidate.id, 'ჩარიცხული')}
                          style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '10px',
                            background: '#22c55e',
                            border: 'none',
                            color: '#fff',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          ჩარიცხვის ბრძანება
                        </button>
                        <button
                          onClick={() => handleUpdateCandidateStatus(selectedCandidate.id, 'უარყოფილი')}
                          style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '10px',
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            color: '#f87171',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          განაცხადის უარყოფა
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: ENROLLED STUDENTS (მოსწავლეთა რეესტრი)                              */}
          {/* ========================================================================= */}
          {activeTab === 'students' && (
            <div
              style={{
                background: 'rgba(25, 16, 20, 0.72)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                borderRadius: '16px',
                padding: '26px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                    მოსწავლეთა აკადემიური რეესტრი
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)' }}>
                    სრული რეესტრი: კლასები, GPA, დასწრება, მენტორები და ოლიმპიური მიღწევები
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {['ყველა', 'დაწყებითი', 'საბაზო', 'საშუალო'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setStudentLevelFilter(lvl)}
                      style={{
                        background: studentLevelFilter === lvl ? 'rgba(212, 175, 55, 0.25)' : 'rgba(0, 0, 0, 0.35)',
                        border: `1px solid ${studentLevelFilter === lvl ? '#d4af37' : 'rgba(255, 255, 255, 0.12)'}`,
                        color: studentLevelFilter === lvl ? '#d4af37' : 'rgba(255, 255, 255, 0.75)',
                        borderRadius: '20px',
                        padding: '6px 14px',
                        fontSize: '0.78rem',
                        fontWeight: studentLevelFilter === lvl ? 700 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '380px' }}>
                <Search size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="ძიება მოსწავლის სახელით ან კლასით..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '10px',
                    padding: '8px 14px 8px 36px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.25)', color: 'rgba(255,255,255,0.6)' }}>
                      <th style={{ padding: '12px 14px' }}>მოსწავლე & ID</th>
                      <th style={{ padding: '12px 14px' }}>კლასი</th>
                      <th style={{ padding: '12px 14px' }}>GPA / ქულა</th>
                      <th style={{ padding: '12px 14px' }}>დასწრება</th>
                      <th style={{ padding: '12px 14px' }}>მენტორი</th>
                      <th style={{ padding: '12px 14px' }}>მიღწევები</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students
                      .filter((s) => (studentLevelFilter === 'ყველა' ? true : s.level === studentLevelFilter))
                      .filter((s) => s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.grade.toLowerCase().includes(studentSearch.toLowerCase()))
                      .map((student) => (
                        <tr
                          key={student.id}
                          style={{
                            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <td style={{ padding: '14px' }}>
                            <div style={{ fontWeight: 700, color: '#fff' }}>{student.name}</div>
                            <div style={{ fontSize: '0.72rem', color: '#d4af37' }}>{student.id}</div>
                          </td>
                          <td style={{ padding: '14px', color: '#fff', fontWeight: 600 }}>{student.grade}</td>
                          <td style={{ padding: '14px' }}>
                            <span style={{ background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                              {student.gpa}
                            </span>
                          </td>
                          <td style={{ padding: '14px', color: 'rgba(255,255,255,0.85)' }}>{student.attendance}</td>
                          <td style={{ padding: '14px', color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem' }}>{student.mentor}</td>
                          <td style={{ padding: '14px', color: '#d4af37', fontSize: '0.82rem' }}>{student.achievements}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: TUITION & BILLING LEDGER (საფასური & ფინანსები)                     */}
          {/* ========================================================================= */}
          {activeTab === 'finance' && (
            <div
              style={{
                background: 'rgba(25, 16, 20, 0.72)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                borderRadius: '16px',
                padding: '26px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                    საფასურის & გადახდების რეესტრი
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)' }}>
                    სწავლის საფასურის გადახდის გრაფიკი, დავალიანებები და სტიპენდიები
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {['ყველა', 'დაფარული', 'მოლოდინში', 'ვადაგადაცილებული', 'სტიპენდია'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setTuitionFilter(st)}
                      style={{
                        background: tuitionFilter === st ? 'rgba(212, 175, 55, 0.25)' : 'rgba(0, 0, 0, 0.35)',
                        border: `1px solid ${tuitionFilter === st ? '#d4af37' : 'rgba(255, 255, 255, 0.12)'}`,
                        color: tuitionFilter === st ? '#d4af37' : 'rgba(255, 255, 255, 0.75)',
                        borderRadius: '20px',
                        padding: '6px 14px',
                        fontSize: '0.78rem',
                        fontWeight: tuitionFilter === st ? 700 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {reminderAlert && (
                <div style={{ padding: '12px 18px', background: 'rgba(34, 197, 94, 0.2)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: '10px', color: '#4ade80', marginBottom: '18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} />
                  <span>{reminderAlert}</span>
                </div>
              )}

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.25)', color: 'rgba(255,255,255,0.6)' }}>
                      <th style={{ padding: '12px 14px' }}>მოსწავლე & კლასი</th>
                      <th style={{ padding: '12px 14px' }}>წლიური საფასური</th>
                      <th style={{ padding: '12px 14px' }}>გადახდილი</th>
                      <th style={{ padding: '12px 14px' }}>დარჩენილი</th>
                      <th style={{ padding: '12px 14px' }}>მომდევნო ვადა</th>
                      <th style={{ padding: '12px 14px' }}>სტატუსი</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>მოქმედება</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tuitionRecords
                      .filter((r) => (tuitionFilter === 'ყველა' ? true : r.status === tuitionFilter))
                      .map((rec) => (
                        <tr
                          key={rec.id}
                          style={{
                            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <td style={{ padding: '14px' }}>
                            <div style={{ fontWeight: 700, color: '#fff' }}>{rec.studentName}</div>
                            <div style={{ fontSize: '0.74rem', color: '#d4af37' }}>{rec.grade} · {rec.plan}</div>
                          </td>
                          <td style={{ padding: '14px', color: '#fff', fontWeight: 600 }}>₾ {rec.annualFee.toLocaleString()}</td>
                          <td style={{ padding: '14px', color: '#4ade80', fontWeight: 700 }}>₾ {rec.paidAmount.toLocaleString()}</td>
                          <td style={{ padding: '14px', color: rec.dueAmount > 0 ? '#f87171' : 'rgba(255,255,255,0.5)' }}>
                            ₾ {rec.dueAmount.toLocaleString()}
                          </td>
                          <td style={{ padding: '14px', color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem' }}>{rec.nextDueDate}</td>
                          <td style={{ padding: '14px' }}>
                            <span
                              style={{
                                fontSize: '0.74rem',
                                fontWeight: 600,
                                padding: '4px 10px',
                                borderRadius: '20px',
                                background:
                                  rec.status === 'დაფარული'
                                    ? 'rgba(34, 197, 94, 0.2)'
                                    : rec.status === 'ვადაგადაცილებული'
                                    ? 'rgba(239, 68, 68, 0.2)'
                                    : 'rgba(212, 175, 55, 0.2)',
                                color:
                                  rec.status === 'დაფარული'
                                    ? '#4ade80'
                                    : rec.status === 'ვადაგადაცილებული'
                                    ? '#f87171'
                                    : '#d4af37'
                              }}
                            >
                              {rec.status}
                            </span>
                          </td>
                          <td style={{ padding: '14px', textAlign: 'right' }}>
                            {rec.dueAmount > 0 && (
                              <button
                                onClick={() => handleSendReminder(rec.studentName)}
                                style={{
                                  background: 'rgba(212, 175, 55, 0.15)',
                                  border: '1px solid rgba(212, 175, 55, 0.35)',
                                  color: '#d4af37',
                                  borderRadius: '6px',
                                  padding: '6px 12px',
                                  fontSize: '0.78rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                <Send size={13} />
                                <span>შეხსენება</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: FACULTY & WORKLOAD (პედაგოგები & დატვირთვა)                         */}
          {/* ========================================================================= */}
          {activeTab === 'teachers' && (
            <div
              style={{
                background: 'rgba(25, 16, 20, 0.72)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                borderRadius: '16px',
                padding: '26px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                    პედაგოგიური პერსონალი & აკადემიური დატვირთვა
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)' }}>
                    კათედრები, საათობრივი დატვირთვა, კლას-ხელმძღვანელობა და რეიტინგი
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {['ყველა', 'STEM & რობოტიკა', 'ქართული ფილოლოგია & რიტორიკა', 'უმაღლესი მათემატიკა'].map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setFacultyDeptFilter(dept)}
                      style={{
                        background: facultyDeptFilter === dept ? 'rgba(212, 175, 55, 0.25)' : 'rgba(0, 0, 0, 0.35)',
                        border: `1px solid ${facultyDeptFilter === dept ? '#d4af37' : 'rgba(255, 255, 255, 0.12)'}`,
                        color: facultyDeptFilter === dept ? '#d4af37' : 'rgba(255, 255, 255, 0.75)',
                        borderRadius: '20px',
                        padding: '6px 14px',
                        fontSize: '0.78rem',
                        fontWeight: facultyDeptFilter === dept ? 700 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
                {faculty
                  .filter((f) => (facultyDeptFilter === 'ყველა' ? true : f.dept === facultyDeptFilter))
                  .map((teacher) => (
                    <div
                      key={teacher.id}
                      style={{
                        background: 'rgba(0, 0, 0, 0.35)',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                        borderRadius: '14px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '14px'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>{teacher.name}</h4>
                            <span style={{ fontSize: '0.78rem', color: '#d4af37' }}>{teacher.title}</span>
                          </div>
                          <span style={{ background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', padding: '3px 8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                            ★ {teacher.rating}
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', marginTop: '12px' }}>
                          <div>კათედრა: <strong style={{ color: '#fff' }}>{teacher.dept}</strong></div>
                          <div>საათობრივი დატვირთვა: <strong style={{ color: '#d4af37' }}>{teacher.weeklyHours} სთ/კვირაში</strong></div>
                          <div>სასწავლო კლასები: <span>{teacher.classes}</span></div>
                          <div>კურატორობა: <span>{teacher.advisoryClass}</span></div>
                          <div>კვლევა: <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.6)' }}>{teacher.research}</span></div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.76rem', color: 'rgba(255,255,255,0.6)' }}>
                        <span>{teacher.phone}</span>
                        <span>{teacher.email}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: CAMPUS FACILITIES & LABS (სივრცეები & ლაბორატორიები)                  */}
          {/* ========================================================================= */}
          {activeTab === 'facilities' && (
            <div
              style={{
                background: 'rgba(25, 16, 20, 0.72)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                borderRadius: '16px',
                padding: '26px'
              }}
            >
              <div style={{ marginBottom: '22px' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                  აკადემიის სივრცეები & ლაბორატორიული ინფრასტრუქტურა
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)' }}>
                  მატერიალურ-ტექნიკური ბაზის, ობსერვატორიისა და ლაბორატორიების მონიტორინგი
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
                {campusFacilities.map((facility, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(0, 0, 0, 0.35)',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      borderRadius: '14px',
                      padding: '22px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{facility.name}</h4>
                      <span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', fontSize: '0.74rem', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                        {facility.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: 'rgba(255,255,255,0.8)' }}>
                      <div>ტევადობა: <strong style={{ color: '#d4af37' }}>{facility.capacity}</strong></div>
                      <div>აღჭურვილობა: <span style={{ color: 'rgba(255,255,255,0.7)' }}>{facility.equipment}</span></div>
                      <div>დატვირთვა: <strong style={{ color: '#fff' }}>{facility.dailyLoad}</strong></div>
                      <div>კურატორი: <span style={{ color: '#d4af37' }}>{facility.curator}</span></div>
                    </div>

                    <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                      ბოლო ტექნიკური აუდიტი: {facility.maintenanceDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: STRATEGIC SCENARIOS (სტრატეგიული სცენარები)                          */}
          {/* ========================================================================= */}
          {activeTab === 'scenarios' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['აკადემია', '2026–2027', 'GEL', 'Model v2.4'].map((badge, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: 'rgba(30, 20, 24, 0.7)',
                        border: '1px solid rgba(212, 175, 55, 0.25)',
                        borderRadius: '8px',
                        padding: '5px 14px',
                        fontSize: '0.82rem',
                        color: '#ffffff'
                      }}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                <span style={{ fontSize: '0.85rem', color: '#d4af37' }}>
                  სტრატეგიული სიმულაციური გარემო · სამეთვალყურეო საბჭოს მოდელი
                </span>
              </div>

              {/* 3-Column Simulator Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 280px', gap: '20px' }}>
                {/* Column 1: Assumptions */}
                <div
                  style={{
                    background: 'rgba(25, 16, 20, 0.65)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    borderRadius: '16px',
                    padding: '20px'
                  }}
                >
                  <h3 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.15rem', color: '#fff', marginBottom: '18px' }}>
                    დაშვებები & ფაქტორები
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>
                        <span>მოსწავლეთა ზრდა</span>
                        <span style={{ color: '#d4af37', fontWeight: 600 }}>+{studentsGrowth}%</span>
                      </div>
                      <input
                        type="range"
                        min="-5"
                        max="25"
                        value={studentsGrowth}
                        onChange={(e) => setStudentsGrowth(Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#d4af37' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>
                        <span>საშუალო საფასურის კორექცია</span>
                        <span style={{ color: '#d4af37', fontWeight: 600 }}>+{feeChange}%</span>
                      </div>
                      <input
                        type="range"
                        min="-5"
                        max="15"
                        value={feeChange}
                        onChange={(e) => setFeeChange(Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#d4af37' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>
                        <span>ოპერაციული ხარჯები (ინფლაცია)</span>
                        <span style={{ color: '#ef4444', fontWeight: 600 }}>+{expenseChange}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="25"
                        value={expenseChange}
                        onChange={(e) => setExpenseChange(Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#ef4444' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>
                        <span>სწავლის საფასურის გადახდის ვადა</span>
                        <span style={{ color: '#facc15', fontWeight: 600 }}>{paymentDelay} დღე</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="45"
                        value={paymentDelay}
                        onChange={(e) => setPaymentDelay(Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#facc15' }}
                      />
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>საბანკო საკრედიტო ხაზი</div>
                          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>₾ 600,000 დაზღვევა</div>
                        </div>
                        <button
                          onClick={() => setUseLoan(!useLoan)}
                          style={{
                            width: '44px',
                            height: '24px',
                            borderRadius: '12px',
                            background: useLoan ? '#d4af37' : 'rgba(255,255,255,0.2)',
                            border: 'none',
                            position: 'relative',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                        >
                          <div
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              background: '#fff',
                              position: 'absolute',
                              top: '3px',
                              left: useLoan ? '23px' : '3px',
                              transition: 'left 0.2s'
                            }}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: 12-Month Cashflow Graph */}
                <div
                  style={{
                    background: 'rgba(25, 16, 20, 0.65)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.15rem', color: '#fff' }}>
                      ფულადი ნაშთის 12-თვიანი ციკლი
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                      მოდელი: 12 თვე (სექტემბერი–აგვისტო)
                    </div>
                  </div>

                  <div
                    style={{
                      height: '220px',
                      background: 'rgba(10, 6, 8, 0.4)',
                      borderRadius: '12px',
                      border: '1px solid rgba(212, 175, 55, 0.15)',
                      padding: '20px',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      gap: '8px'
                    }}
                  >
                    {[
                      { m: 'სექ', h: 85 },
                      { m: 'ოქტ', h: 72 },
                      { m: 'ნოე', h: 70 },
                      { m: 'დეკ', h: 76 },
                      { m: 'იან', h: 62 },
                      { m: 'თებ', h: 78 },
                      { m: 'მარ', h: 82 },
                      { m: 'აპრ', h: 88 },
                      { m: 'მაი', h: 92 },
                      { m: 'ივნ', h: 95 },
                      { m: 'ივლ', h: 60 },
                      { m: 'აგვ', h: 65 }
                    ].map((bar, i) => {
                      const dynamicHeight = Math.min(100, Math.max(20, bar.h + (studentsGrowth * 0.7) - (expenseChange * 0.3)));
                      return (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1, height: '100%', justifyContent: 'flex-end' }}>
                          <div
                            style={{
                              width: '100%',
                              height: `${dynamicHeight}%`,
                              background: i >= 8 ? 'linear-gradient(180deg, #d4af37 0%, rgba(212, 175, 55, 0.3) 100%)' : 'rgba(255, 255, 255, 0.25)',
                              borderRadius: '4px',
                              transition: 'height 0.3s ease'
                            }}
                          />
                          <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)' }}>{bar.m}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>სავარაუდო შემოსავალი</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#4ade80' }}>
                        ₾ {(5100000 * (1 + (studentsGrowth + feeChange) / 100)).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>საოპერაციო ხარჯები</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f87171' }}>
                        ₾ {(3300000 * (1 + expenseChange / 100)).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>საინვესტიციო ნაშთი</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#d4af37' }}>
                        ₾ {(5100000 * (1 + (studentsGrowth + feeChange) / 100) - 3300000 * (1 + expenseChange / 100)).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 3: Strategic Branches */}
                <div
                  style={{
                    background: 'rgba(25, 16, 20, 0.65)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.15rem', color: '#fff', marginBottom: '16px' }}>
                      სტრატეგიული შტო
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {[
                        { id: 'immediate', label: 'AI ლაბის & კოსმოსური ცენტრის გაფართოება', impact: 'მაღალი ROI & აკრედიტაცია' },
                        { id: 'phased', label: 'ეტაპობრივი 2-წლიანი ინფრასტრუქტურა', impact: 'დაბალი რისკი' },
                        { id: 'delay', label: 'გადაწყვეტილების გადავადება Q3-მდე', impact: 'რეზერვის შენარჩუნება' }
                      ].map((branch) => (
                        <button
                          key={branch.id}
                          onClick={() => setSelectedBranch(branch.id)}
                          style={{
                            background: selectedBranch === branch.id ? 'rgba(212, 175, 55, 0.25)' : 'rgba(0,0,0,0.3)',
                            border: `1px solid ${selectedBranch === branch.id ? '#d4af37' : 'rgba(255,255,255,0.1)'}`,
                            borderRadius: '10px',
                            padding: '12px',
                            textAlign: 'left',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
                            {branch.label}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#d4af37' }}>{branch.impact}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleSendToReview}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      background: 'rgba(45, 30, 35, 0.85)',
                      border: '1px solid rgba(212, 175, 55, 0.35)',
                      color: '#d4af37',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      marginTop: '20px'
                    }}
                  >
                    {submittedMessage || 'საბჭოსთვის გაგზავნა'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: SETTINGS & POLICIES (სისტემის პარამეტრები)                          */}
          {/* ========================================================================= */}
          {activeTab === 'settings' && (
            <div
              style={{
                background: 'rgba(25, 16, 20, 0.72)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                borderRadius: '16px',
                padding: '28px',
                maxWidth: '850px'
              }}
            >
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                აკადემიის ადმინისტრაციული პარამეტრები
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', marginBottom: '24px' }}>
                კვოტები, ავტორიზაცია, საკონტაქტო რეკვიზიტები და მიღების რეჟიმი
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSettingsSavedAlert(true);
                  setTimeout(() => setSettingsSavedAlert(false), 2500);
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
                      სასწავლო წელი
                    </label>
                    <input
                      type="text"
                      value={settings.academicYear}
                      onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
                      style={{ width: '100%', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '10px', padding: '10px 14px', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
                      მოსწავლეთა მაქსიმალური კვოტა
                    </label>
                    <input
                      type="number"
                      value={settings.intakeQuotaTotal}
                      onChange={(e) => setSettings({ ...settings, intakeQuotaTotal: Number(e.target.value) })}
                      style={{ width: '100%', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '10px', padding: '10px 14px', color: '#fff' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.15)' }}>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fff' }}>ონლაინ რეგისტრაციის მიღება</div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)' }}>
                      ჩართულია თუ არა საიტზე ონლაინ განაცხადის შევსების ფორმა
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, admissionsOpen: !settings.admissionsOpen })}
                    style={{
                      width: '50px',
                      height: '26px',
                      borderRadius: '14px',
                      background: settings.admissionsOpen ? '#22c55e' : 'rgba(255,255,255,0.2)',
                      border: 'none',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                  >
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#fff',
                        position: 'absolute',
                        top: '3px',
                        left: settings.admissionsOpen ? '27px' : '3px',
                        transition: 'left 0.2s'
                      }}
                    />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
                      საკონტაქტო ტელეფონი
                    </label>
                    <input
                      type="text"
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                      style={{ width: '100%', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '10px', padding: '10px 14px', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
                      მიმღები კომისიის ელ-ფოსტა
                    </label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      style={{ width: '100%', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '10px', padding: '10px 14px', color: '#fff' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
                    აკადემიის იურიდიული მისამართი
                  </label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '10px', padding: '10px 14px', color: '#fff' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '10px' }}>
                  <button
                    type="submit"
                    style={{
                      background: 'linear-gradient(135deg, #d4af37 0%, #aa820a 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px 28px',
                      color: '#1a1014',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    პარამეტრების შენახვა
                  </button>
                  {settingsSavedAlert && (
                    <span style={{ color: '#4ade80', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Check size={16} />
                      <span>პარამეტრები წარმატებით განახლდა!</span>
                    </span>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
