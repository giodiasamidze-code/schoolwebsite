import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3,
  PieChart,
  FileText,
  Users,
  DollarSign,
  Settings,
  Key,
  Plus,
  Trash2,
  Check,
  X,
  Search,
  Send,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Copy,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Award,
  ChevronRight
} from 'lucide-react';
import { useAuth } from './AuthContext';

const API = import.meta.env.VITE_API_URL || '';

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE INTERACTIVE SVG CHARTS & DIAGRAMS
// ─────────────────────────────────────────────────────────────────────────────

// 1. Donut Chart for Payment Statuses (Brand Gold & Bronze Palette)
function DonutChart({ paid, pending, overdue, scholarship }) {
  const total = paid + pending + overdue + scholarship;
  if (total === 0) return null;
  const R = 46, cx = 56, cy = 56, stroke = 16;
  const segments = [
    { value: paid, color: '#d4af37', label: 'დაფარული' },
    { value: pending, color: '#f3d368', label: 'მოლოდინში' },
    { value: overdue, color: '#c25e5e', label: 'ვადაგადაცილებული' },
    { value: scholarship, color: '#8a5a2b', label: 'სტიპენდია' }
  ];
  let cumulative = 0;
  const slices = segments.map((seg) => {
    if (seg.value === 0) return null;
    const startAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    cumulative += seg.value;
    const endAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + R * Math.cos(startAngle);
    const y1 = cy + R * Math.sin(startAngle);
    const x2 = cx + R * Math.cos(endAngle);
    const y2 = cy + R * Math.sin(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    return (
      <path
        key={seg.label}
        d={`M ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2}`}
        fill="none"
        stroke={seg.color}
        strokeWidth={stroke}
        strokeLinecap="butt"
      />
    );
  });
  return (
    <svg width="112" height="112" viewBox="0 0 112 112">
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(212,175,55,0.12)" strokeWidth={stroke} />
      {slices}
      <text x={cx} y={cy - 5} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">{total}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="8.5">სულ</text>
    </svg>
  );
}

// 2. Admissions Conversion Funnel Chart (Monochromatic Gold Gradients)
function AdmissionsFunnelChart() {
  const steps = [
    { label: 'შემოსული განაცხადები', count: 142, pct: 100, color: '#f6d56d' },
    { label: 'საგამოცდო ტესტირებაზე გასული', count: 118, pct: 83.1, color: '#e5c158' },
    { label: 'გასაუბრებაზე მიწვეული', count: 74, pct: 52.1, color: '#d4af37' },
    { label: 'ჩარიცხვის შეთავაზება', count: 48, pct: 33.8, color: '#aa820a' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {steps.map((step, idx) => (
        <div key={step.label} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
              <strong style={{ color: step.color, marginRight: '8px' }}>#{idx + 1}</strong>
              {step.label}
            </span>
            <span style={{ fontWeight: 700, color: '#fff' }}>
              {step.count} <span style={{ color: step.color, fontSize: '0.74rem', marginLeft: '4px' }}>({step.pct}%)</span>
            </span>
          </div>
          <div style={{ height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${step.pct}%`,
                background: `linear-gradient(90deg, ${step.color}88 0%, ${step.color} 100%)`,
                borderRadius: '6px',
                transition: 'width 0.8s ease'
              }}
            />
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(212,175,55,0.15)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' }}>
        <span>საბოლოო კონვერსია: <strong style={{ color: '#d4af37' }}>33.8%</strong></span>
        <span>საშ. საკონკურსო კოეფიციენტი: <strong style={{ color: '#f3d368' }}>2.95 აპლიკანტი / ადგილი</strong></span>
      </div>
    </div>
  );
}

// 3. Monthly Revenue Interactive Bar Chart (Single Master Executive Diagram)
function MonthlyBarChart() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const data = [
    { month: 'თებ', fact: 42000, plan: 40000 },
    { month: 'მარ', fact: 48500, plan: 45000 },
    { month: 'აპრ', fact: 51000, plan: 48000 },
    { month: 'მაი', fact: 53500, plan: 50000 },
    { month: 'ივნ', fact: 56000, plan: 52000 },
    { month: 'ივლ', fact: 38000, plan: 35000 },
    { month: 'აგვ', fact: 44000, plan: 42000 },
    { month: 'სექ', fact: 59000, plan: 55000 }
  ];
  const maxVal = 65000;
  const chartHeight = 210;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '20px', fontSize: '0.82rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'linear-gradient(180deg, #f6d56d 0%, #d4af37 100%)' }} />
            <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>ფაქტობრივი გადახდები</span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.35)' }} />
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>საპროგნოზო გეგმა</span>
          </span>
        </div>
        <div style={{ fontSize: '0.82rem', color: '#d4af37', fontWeight: 600, background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)', padding: '4px 12px', borderRadius: '16px' }}>
          საშუალო ზრდა: +14.2%
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: `${chartHeight}px`, gap: '14px', paddingBottom: '8px', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
        {data.map((item, idx) => {
          const factH = Math.round((item.fact / maxVal) * chartHeight);
          const planH = Math.round((item.plan / maxVal) * chartHeight);
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={item.month}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', position: 'relative', cursor: 'pointer' }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip on hover */}
              {isHovered && (
                <div style={{ position: 'absolute', bottom: `${Math.max(factH, planH) + 14}px`, background: '#1c1016', border: '1px solid #d4af37', borderRadius: '8px', padding: '8px 12px', fontSize: '0.76rem', whiteSpace: 'nowrap', zIndex: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.85)', pointerEvents: 'none' }}>
                  <div style={{ fontWeight: 700, color: '#f3d368' }}>{item.month}: ₾ {item.fact.toLocaleString()}</div>
                  <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.7rem', marginTop: '2px' }}>გეგმა: ₾ {item.plan.toLocaleString()}</div>
                </div>
              )}

              {/* Bars side by side */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', width: '100%', justifyContent: 'center' }}>
                {/* Plan bar */}
                <div
                  style={{
                    width: '36%',
                    maxWidth: '16px',
                    height: `${planH}px`,
                    background: 'rgba(212,175,55,0.2)',
                    border: '1px solid rgba(212,175,55,0.3)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'all 0.2s ease'
                  }}
                />
                {/* Fact bar */}
                <div
                  style={{
                    width: '44%',
                    maxWidth: '22px',
                    height: `${factH}px`,
                    background: isHovered
                      ? 'linear-gradient(180deg, #ffe89e 0%, #d4af37 100%)'
                      : 'linear-gradient(180deg, #f6d56d 0%, #aa820a 100%)',
                    borderRadius: '4px 4px 0 0',
                    boxShadow: isHovered ? '0 0 16px rgba(212,175,55,0.65)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>

              {/* Month label */}
              <div style={{ fontSize: '0.78rem', color: isHovered ? '#d4af37' : 'rgba(255,255,255,0.65)', marginTop: '10px', fontWeight: isHovered ? 700 : 500 }}>
                {item.month}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 4. Department Hours Distribution (Warm Gold Spectrum)
function DepartmentDistributionChart() {
  const depts = [
    { name: 'STEM & რობოტიკა', hours: 38, pct: 32, color: '#f6d56d' },
    { name: 'უცხო ენები & Debate', hours: 30, pct: 25, color: '#e5c158' },
    { name: 'ქართული ფილოლოგია', hours: 26, pct: 22, color: '#d4af37' },
    { name: 'უმაღლესი მათემატიკა', hours: 25, pct: 21, color: '#aa820a' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* Segmented gold progress bar */}
      <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', gap: '2px', background: 'rgba(255,255,255,0.06)' }}>
        {depts.map((d) => (
          <div key={d.name} style={{ width: `${d.pct}%`, background: d.color }} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {depts.map((d) => (
          <div key={d.name} style={{ background: 'rgba(0,0,0,0.35)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: d.color }} />
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)' }}>{d.name}</span>
            </div>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: d.color }}>{d.hours} სთ</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ADMIN DASHBOARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { navigate, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');

  // ── CANDIDATES ───────────────────────────────────────────────────────────────
  const initialCandidates = [
    { id: 101, studentName: 'ნიკოლოზ ბერიძე', gradeApplied: 'X კლასი', parentName: 'დავით ბერიძე', phone: '+995 599 12 34 56', email: 'd.beridze@gmail.com', date: '2026-09-08', mathScore: 94, englishScore: 92, logicScore: 88, interviewNotes: 'მაღალი ანალიტიკური უნარები, STEM ოლიმპიადის მონაწილე.', scholarshipRequest: '25% ნიჭიერთა სტიპენდია', status: 'გასაუბრება გავლილი' },
    { id: 102, studentName: 'მარიამ მაისურაძე', gradeApplied: 'VIII კლასი', parentName: 'ნინო კაპანაძე', phone: '+995 595 44 22 11', email: 'n.kapanadze@yahoo.com', date: '2026-09-07', mathScore: 98, englishScore: 96, logicScore: 95, interviewNotes: 'გამორჩეული ლინგვისტური და მათემატიკური ნიჭი. რეკომენდებულია.', scholarshipRequest: 'სტანდარტული', status: 'ჩარიცხული' },
    { id: 103, studentName: 'გიორგი გელაშვილი', gradeApplied: 'III კლასი', parentName: 'ლევან გელაშვილი', phone: '+995 577 98 76 54', email: 'l.gelashvili@caucasus.net', date: '2026-09-06', mathScore: 82, englishScore: 85, logicScore: 80, interviewNotes: 'საჭიროებს ინგლისურ ენაში საბაზისო ადაპტაციას.', scholarshipRequest: 'სტანდარტული', status: 'ახალი განაცხადი' },
    { id: 104, studentName: 'ანასტასია წიკლაური', gradeApplied: 'XI კლასი', parentName: 'თამარ ჩხეიძე', phone: '+995 591 33 55 77', email: 't.chkheidze@tbc.ge', date: '2026-09-05', mathScore: 99, englishScore: 98, logicScore: 96, interviewNotes: 'საერთაშორისო დებატ-კლუბის პრიზიორი. ინგლისური C1 სრულყოფილად.', scholarshipRequest: '50% აკადემიური გრანტი', status: 'ჩარიცხული' },
    { id: 105, studentName: 'ლუკა ჯავახიშვილი', gradeApplied: 'VII კლასი', parentName: 'გიორგი ჯავახიშვილი', phone: '+995 558 71 82 93', email: 'g.javakhishvili@mail.com', date: '2026-09-04', mathScore: 65, englishScore: 70, logicScore: 68, interviewNotes: 'ქულები ვერ აკმაყოფილებს 75%-იან ბარიერს.', scholarshipRequest: 'სტანდარტული', status: 'უარყოფილი' },
    { id: 106, studentName: 'სალომე ასათიანი', gradeApplied: 'V კლასი', parentName: 'ეკატერინე დადიანი', phone: '+995 599 88 77 66', email: 'e.dadiani@art.ge', date: '2026-09-03', mathScore: 90, englishScore: 94, logicScore: 89, interviewNotes: 'დანიშნულია გასაუბრება ფსიქოლოგთან 12 სექტემბერს.', scholarshipRequest: 'სტანდარტული', status: 'გასაუბრება დანიშნული' }
  ];
  const [candidates, setCandidates] = useState(() => { try { const s = localStorage.getItem('academy_detailed_candidates'); return s ? JSON.parse(s) : initialCandidates; } catch { return initialCandidates; } });
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidateFilter, setCandidateFilter] = useState('ყველა');
  const [candidateSearch, setCandidateSearch] = useState('');

  const saveCandidates = (data) => { setCandidates(data); try { localStorage.setItem('academy_detailed_candidates', JSON.stringify(data)); } catch { } };
  const handleUpdateCandidateStatus = (id, status) => {
    const updated = candidates.map((c) => c.id === id ? { ...c, status } : c);
    saveCandidates(updated);
    if (selectedCandidate?.id === id) setSelectedCandidate({ ...selectedCandidate, status });
  };

  // ── TUITION ──────────────────────────────────────────────────────────────────
  const initialTuition = [
    { id: 'INV-081', studentName: 'საბა ყიფიანი', grade: 'X-A', annualFee: 11000, paidAmount: 11000, dueAmount: 0, nextDueDate: 'სრულად დაფარულია', plan: 'წლიური', status: 'დაფარული', scholarship: 'არ აქვს' },
    { id: 'INV-082', studentName: 'ელენე ბაგრატიონი', grade: 'XI-B', annualFee: 11000, paidAmount: 11000, dueAmount: 0, nextDueDate: 'სრულად დაფარულია', plan: 'წლიური', status: 'დაფარული', scholarship: '20% აკადემიური' },
    { id: 'INV-083', studentName: 'დაჩი მესხი', grade: 'VIII-A', annualFee: 9500, paidAmount: 6650, dueAmount: 2850, nextDueDate: '2026-10-15', plan: '10-თვიანი', status: 'მოლოდინში', scholarship: 'არ აქვს' },
    { id: 'INV-084', studentName: 'ირაკლი გორგასალი', grade: 'IX-B', annualFee: 9500, paidAmount: 4750, dueAmount: 4750, nextDueDate: '2026-09-01 (ვადაგასული)', plan: '10-თვიანი', status: 'ვადაგადაცილებული', scholarship: 'არ აქვს' },
    { id: 'INV-085', studentName: 'მარიამ ორბელიანი', grade: 'XII-A', annualFee: 11000, paidAmount: 0, dueAmount: 0, nextDueDate: 'გრანტით დაფარული', plan: 'სრული სტიპენდია', status: 'სტიპენდია', scholarship: '100% საბჭო' },
    { id: 'INV-086', studentName: 'ნატალია წერეთელი', grade: 'IV-B', annualFee: 8000, paidAmount: 8000, dueAmount: 0, nextDueDate: 'სრულად დაფარულია', plan: 'წლიური', status: 'დაფარული', scholarship: 'არ აქვს' }
  ];
  const [tuitionRecords] = useState(initialTuition);
  const [tuitionFilter, setTuitionFilter] = useState('ყველა');
  const [reminderAlert, setReminderAlert] = useState('');
  const handleSendReminder = (name) => { setReminderAlert(`შეხსენება გაიგზავნა: ${name}`); setTimeout(() => setReminderAlert(''), 3000); };

  // ── FACULTY ───────────────────────────────────────────────────────────────────
  const faculty = [
    { id: 201, name: 'დოქტ. ალექსანდრე მიქაძე', title: 'აკადემიური დოქტორი (MIT)', dept: 'STEM & რობოტიკა', weeklyHours: 20, classes: 'X-A, XI-A, XII-A', advisoryClass: 'X-A STEM', rating: '4.98', email: 'a.mikadze@solomon.ge', phone: '+995 599 01 02 03' },
    { id: 202, name: 'ქეთევან ჩხეიძე', title: 'ფილოლოგიის მეცნიერებათა დოქტორი', dept: 'ქართული ფილოლოგია', weeklyHours: 18, classes: 'IX-B, XI-B, XII-A', advisoryClass: 'XI-B ჰუმანიტარული', rating: '4.95', email: 'k.chkheidze@solomon.ge', phone: '+995 599 04 05 06' },
    { id: 203, name: 'დავით ყიფიანი', title: 'მათემატიკის პროფესორი', dept: 'უმაღლესი მათემატიკა', weeklyHours: 22, classes: 'VIII-A, IX-A, X-A, XI-A', advisoryClass: 'IX-A', rating: '4.92', email: 'd.qipiani@solomon.ge', phone: '+995 599 07 08 09' },
    { id: 204, name: 'სოფიო ერისთავი', title: 'MA Applied Linguistics (Oxford)', dept: 'უცხო ენები & Debate', weeklyHours: 16, classes: 'X-A, XI-B, XII-A', advisoryClass: 'XII-A საერთაშორისო', rating: '4.99', email: 's.eristavi@solomon.ge', phone: '+995 599 10 11 12' },
    { id: 205, name: 'გიორგი ანდრონიკაშვილი', title: 'ისტორიის დოქტორი, დიპლომატი', dept: 'სოციალური მეცნიერებები', weeklyHours: 18, classes: 'VIII-B, IX-B, XI-B', advisoryClass: 'არ ჰყავს', rating: '4.90', email: 'g.andronikashvili@solomon.ge', phone: '+995 599 13 14 15' }
  ];

  // ── INVITE CODES ──────────────────────────────────────────────────────────────
  const defaultCodes = [
    { id: 'sol-code-1', code: 'SOL-2026-TEACH', is_active: true, created_at: new Date().toISOString() },
    { id: 'sol-code-2', code: 'SOL-2026-STEM9', is_active: true, created_at: new Date().toISOString() },
    { id: 'sol-code-3', code: 'SOL-2026-MATH4', is_active: true, created_at: new Date().toISOString() }
  ];

  const [inviteCodes, setInviteCodes] = useState(() => {
    try {
      const saved = localStorage.getItem('academy_invite_codes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch { }
    try { localStorage.setItem('academy_invite_codes', JSON.stringify(defaultCodes)); } catch { }
    return defaultCodes;
  });

  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [batchCount, setBatchCount] = useState(1);
  const [customCodeInput, setCustomCodeInput] = useState('');
  const [inviteFilter, setInviteFilter] = useState('ყველა');
  const [copiedId, setCopiedId] = useState(null);

  const saveInviteCodes = (codes) => {
    setInviteCodes(codes);
    try {
      localStorage.setItem('academy_invite_codes', JSON.stringify(codes));
    } catch { }
  };

  const fetchInviteCodes = useCallback(async () => {
    setInviteLoading(true);
    setInviteError('');
    try {
      const res = await fetch(`${API}/api/create-invite-code`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.codes) && data.codes.length > 0) {
          saveInviteCodes(data.codes);
          setInviteLoading(false);
          return;
        }
      }
    } catch {
      // Backend not running, smoothly keep localStorage data
    }
    try {
      const saved = localStorage.getItem('academy_invite_codes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setInviteCodes(parsed);
          setInviteLoading(false);
          return;
        }
      }
    } catch { }
    setInviteLoading(false);
  }, []);

  useEffect(() => { if (activeTab === 'invites') fetchInviteCodes(); }, [activeTab, fetchInviteCodes]);

  const handleGenerateCodes = async () => {
    setInviteLoading(true);
    setInviteError('');
    setInviteSuccess('');

    const count = Math.min(Math.max(batchCount || 1, 1), 50);
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const year = new Date().getFullYear();
    const newGenerated = [];

    for (let i = 0; i < count; i++) {
      const rand = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      newGenerated.push({
        id: 'code-' + Date.now() + '-' + i + '-' + Math.random().toString(36).substring(2, 6),
        code: `SOL-${year}-${rand}`,
        is_active: true,
        created_at: new Date().toISOString()
      });
    }

    // Always update client-side immediately
    const updated = [...newGenerated, ...inviteCodes];
    saveInviteCodes(updated);
    setInviteSuccess(`${count} გასაღები წარმატებით შეიქმნა!`);
    setTimeout(() => setInviteSuccess(''), 3500);

    // Also attempt backend creation in background
    try {
      await fetch(`${API}/api/create-invite-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generateBatch: count })
      });
    } catch {
      // Silent catch - local copy is already securely saved
    } finally {
      setInviteLoading(false);
    }
  };

  const handleAddCustomCode = () => {
    if (!customCodeInput.trim()) return;
    const clean = customCodeInput.trim().toUpperCase();
    if (inviteCodes.some((c) => c.code === clean)) {
      setInviteError(`გასაღები "${clean}" უკვე არსებობს.`);
      setTimeout(() => setInviteError(''), 3000);
      return;
    }
    const newCode = {
      id: 'code-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      code: clean,
      is_active: true,
      created_at: new Date().toISOString()
    };
    const updated = [newCode, ...inviteCodes];
    saveInviteCodes(updated);
    setCustomCodeInput('');
    setInviteSuccess(`გასაღები "${clean}" წარმატებით დაემატა!`);
    setTimeout(() => setInviteSuccess(''), 3000);
  };

  const handleDeleteCode = async (id) => {
    setInviteError('');
    const updated = inviteCodes.filter((c) => c.id !== id);
    saveInviteCodes(updated);
    setInviteSuccess('გასაღები წაიშალა');
    setTimeout(() => setInviteSuccess(''), 2000);

    try {
      await fetch(`${API}/api/create-invite-code`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    } catch { }
  };

  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    });
  };

  const handleCopyAllActive = () => {
    const activeList = inviteCodes.filter((c) => c.is_active).map((c) => c.code).join('\n');
    if (!activeList) return;
    navigator.clipboard.writeText(activeList).then(() => {
      setInviteSuccess('ყველა აქტიური გასაღები დაკოპირდა ბუფერში!');
      setTimeout(() => setInviteSuccess(''), 2500);
    });
  };

  // ── SETTINGS ──────────────────────────────────────────────────────────────────
  const [settings, setSettings] = useState({ academicYear: '2026–2027', intakeQuotaTotal: 520, currentEnrolled: 482, admissionsOpen: true, contactPhone: '+995 32 2 10 20 30', contactEmail: 'admissions@solomon.ge', address: 'თბილისი, ჩოლოყაშვილის გამზ. 48' });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // ── derived stats ─────────────────────────────────────────────────────────────
  const totalPaidGel = tuitionRecords.reduce((s, r) => s + r.paidAmount, 0);
  const totalDueGel = tuitionRecords.reduce((s, r) => s + r.dueAmount, 0);
  const paidCount = tuitionRecords.filter((r) => r.status === 'დაფარული').length;
  const pendingCount = tuitionRecords.filter((r) => r.status === 'მოლოდინში').length;
  const overdueCount = tuitionRecords.filter((r) => r.status === 'ვადაგადაცილებული').length;
  const scholarshipCount = tuitionRecords.filter((r) => r.status === 'სტიპენდია').length;
  const pendingCandidates = candidates.filter((c) => c.status !== 'ჩარიცხული' && c.status !== 'უარყოფილი').length;

  const S = {
    card: { background: 'rgba(25,16,20,0.76)', backdropFilter: 'blur(24px)', border: '1px solid rgba(212,175,55,0.22)', borderRadius: '16px', padding: '24px', boxShadow: '0 12px 36px rgba(0,0,0,0.35)' },
    title: { fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' },
    sub: { fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' },
    pill: (active) => ({ background: active ? 'rgba(212,175,55,0.25)' : 'rgba(0,0,0,0.35)', border: `1px solid ${active ? '#d4af37' : 'rgba(255,255,255,0.12)'}`, color: active ? '#d4af37' : 'rgba(255,255,255,0.75)', borderRadius: '20px', padding: '6px 14px', fontSize: '0.78rem', fontWeight: active ? 700 : 500, cursor: 'pointer', transition: 'all 0.15s' }),
    statusBadge: (st) => {
      const map = {
        'ჩარიცხული': ['rgba(212,175,55,0.2)', '#d4af37'],
        'დაფარული': ['rgba(212,175,55,0.2)', '#d4af37'],
        'უარყოფილი': ['rgba(194,94,94,0.18)', '#c25e5e'],
        'ვადაგადაცილებული': ['rgba(194,94,94,0.18)', '#c25e5e'],
        'სტიპენდია': ['rgba(184,134,40,0.2)', '#e5c158'],
        'გასაუბრება დანიშნული': ['rgba(243,211,104,0.18)', '#f3d368'],
        'გასაუბრება გავლილი': ['rgba(212,175,55,0.25)', '#d4af37'],
        'ახალი განაცხადი': ['rgba(243,211,104,0.15)', '#f3d368'],
        'მოლოდინში': ['rgba(229,169,59,0.18)', '#e5a93b']
      };
      const [bg, color] = map[st] || ['rgba(212,175,55,0.2)', '#d4af37'];
      return { fontSize: '0.74rem', fontWeight: 600, padding: '4px 10px', borderRadius: '20px', background: bg, color };
    }
  };

  const navItems = [
    { id: 'analytics', label: 'ანალიტიკა & KPI', icon: BarChart3 },
    { id: 'admissions', label: 'მიღება & კანდიდატები', icon: FileText, badge: pendingCandidates },
    { id: 'finance', label: 'საფასური & ფინანსები', icon: DollarSign },
    { id: 'teachers', label: 'პედაგოგები & დატვირთვა', icon: Users, badge: faculty.length },
    { id: 'invites', label: 'მოსაწვევი გასაღებები', icon: Key, badge: inviteCodes.filter(c => c.is_active).length || undefined },
    { id: 'settings', label: 'სისტემის პარამეტრები', icon: Settings }
  ];

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundImage: `linear-gradient(180deg, rgba(12,6,8,0.85) 0%, rgba(12,6,8,0.96) 100%), url(/assets/palace-interior.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', color: '#fff', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* ── HEADER ── */}
      <header className="admin-header" style={{ height: '70px', background: 'rgba(20,12,15,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(212,175,55,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 50 }}>
        {/* Left: Academy Brand */}
        <div className="admin-brand-block" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div onClick={() => navigate('/')} style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.05rem', fontWeight: 700, letterSpacing: '0.08em', color: '#d4af37', cursor: 'pointer', whiteSpace: 'nowrap' }}>SOLOMON ACADEMY</div>
          <div className="admin-brand-sep" style={{ width: '1px', height: '22px', background: 'rgba(212,175,55,0.25)' }} />
          <span className="admin-brand-title" style={{ fontSize: '0.98rem', fontWeight: 600, whiteSpace: 'nowrap' }}>მართვის პანელი</span>
          <span className="admin-year-badge" style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)', color: '#d4af37', fontSize: '0.74rem', fontWeight: 600, padding: '3px 10px', borderRadius: '6px', whiteSpace: 'nowrap' }}>{settings.academicYear}</span>
        </div>

        {/* Right: Prominent Top Stats Ticker + Site Button */}
        <div className="admin-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Executive Stats Bar */}
          <div className="admin-ticker-bar" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            background: 'rgba(28, 16, 22, 0.85)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: '10px',
            padding: '7px 14px',
            fontSize: '0.8rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
          }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', display: 'inline-flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
              მოსწავლეები: <strong style={{ color: '#ffffff', fontWeight: 700 }}>{settings.currentEnrolled}</strong>
            </span>
            <span style={{ width: '1px', height: '14px', background: 'rgba(212,175,55,0.25)' }} />
            <span style={{ color: 'rgba(255,255,255,0.7)', display: 'inline-flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
              შემოსავალი: <strong style={{ color: '#d4af37', fontWeight: 700 }}>₾ {totalPaidGel.toLocaleString()}</strong>
            </span>
          </div>

          {/* Site Navigation Button */}
          <button
            onClick={() => navigate('/')}
            className="admin-site-btn"
            style={{
              background: 'rgba(212,175,55,0.12)',
              border: '1px solid rgba(212,175,55,0.32)',
              borderRadius: '8px',
              padding: '7px 14px',
              color: '#d4af37',
              fontSize: '0.84rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,175,55,0.22)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(212,175,55,0.12)'; }}
          >
            <ExternalLink size={14} />
            <span>საიტი</span>
          </button>

          {/* Minimal Exit */}
          <button
            onClick={logout}
            title="სისტემიდან გასვლა"
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              padding: '7px 12px',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#e5a93b'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
          >
            გასვლა
          </button>
        </div>
      </header>

      {/* ── LAYOUT ── */}
      <div className="admin-layout-grid" style={{ maxWidth: '1540px', width: '100%', margin: '20px auto', padding: '0 20px', display: 'grid', gap: '24px', alignItems: 'start', flex: 1, boxSizing: 'border-box' }}>

        {/* SIDEBAR */}
        <div className="admin-sidebar-nav" style={{ background: 'rgba(25,16,20,0.78)', backdropFilter: 'blur(24px)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '16px', padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: '6px', position: 'sticky', top: '86px', boxShadow: '0 15px 35px rgba(0,0,0,0.45)', zIndex: 30 }}>
          <div className="admin-sidebar-title" style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '6px 12px', marginBottom: '4px' }}>მართვის პანელი</div>
          <div className="admin-nav-tabs" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {navItems.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="admin-nav-tab-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', borderRadius: '10px', background: isActive ? 'rgba(212,175,55,0.22)' : 'transparent', border: `1px solid ${isActive ? 'rgba(212,175,55,0.5)' : 'transparent'}`, color: isActive ? '#d4af37' : 'rgba(255,255,255,0.8)', fontSize: '0.86rem', fontWeight: isActive ? 700 : 500, cursor: 'pointer', transition: 'all 0.18s', textAlign: 'left', whiteSpace: 'nowrap' }} onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }} onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Icon size={16} /><span>{tab.label}</span></div>
                  {tab.badge > 0 && <span style={{ background: isActive ? '#d4af37' : 'rgba(255,255,255,0.15)', color: isActive ? '#1a1014' : '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '12px' }}>{tab.badge}</span>}
                </button>
              );
            })}
          </div>

          <div className="admin-sidebar-accreditation" style={{ marginTop: '16px', padding: '12px', background: 'rgba(0,0,0,0.4)', borderRadius: '10px', border: '1px solid rgba(212,175,55,0.15)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
            <div style={{ color: '#d4af37', fontWeight: 600, marginBottom: '4px' }}>აკრედიტაცია & ხარისხი</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={14} color="#d4af37" /><span>უმაღლესი ეროვნული ავტორიზაცია</span></div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="admin-content-area" style={{ display: 'flex', flexDirection: 'column', gap: '22px', minWidth: 0 }}>

          {/* ══════════════════════════════════════════════════════════════════════════
              0. EXECUTIVE ANALYTICS (თითო გვერდზე ერთი დიაგრამა - მშვიდი და ელეგანტური)
              ══════════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'analytics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

              {/* TOP KPI CARDS (Brand Gold Palette) */}
              <div className="admin-kpi-grid" style={{ display: 'grid', gap: '16px' }}>
                {[
                  { label: 'სულ გადახდილი', val: `₾ ${totalPaidGel.toLocaleString()}`, sub: '91.4% აკრეფილი (+14.2% ზრდა)', color: '#d4af37', Icon: TrendingUp },
                  { label: 'მოსწავლეთა შევსება', val: `${settings.currentEnrolled} / ${settings.intakeQuotaTotal}`, sub: '92.7% კვოტის შევსება (38 დარჩენილი)', color: '#f3d368', Icon: Users },
                  { label: 'მიღების კონვერსია', val: '33.8%', sub: '142 განაცხადიდან 48 ჩარიცხული', color: '#e5c158', Icon: Activity },
                  { label: 'საგამოცდო საშუალო', val: '92.4 / 100', sub: 'მათემ. 91.2 · ინგლ. 93.8 · ლოგ. 88.5', color: '#c59b27', Icon: Award }
                ].map((k) => (
                  <div key={k.label} style={{ ...S.card, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)' }}>{k.label}</span>
                      <k.Icon size={18} color={k.color} />
                    </div>
                    <div style={{ fontSize: '1.45rem', fontWeight: 800, color: k.color, letterSpacing: '-0.02em' }}>{k.val}</div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)' }}>{k.sub}</div>
                  </div>
                ))}
              </div>

              {/* THE ONE SINGLE MASTER DIAGRAM FOR ANALYTICS */}
              <div style={S.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={S.title}><DollarSign size={18} color="#d4af37" />შემოსავლების თვიური დინამიკა (ფაქტი vs გეგმა)</h3>
                    <p style={S.sub}>სწავლის საფასურის ფაქტობრივი გადახდები და ბიუჯეტის შესრულება თვეების მიხედვით</p>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem' }}>
                    <div style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '8px', padding: '6px 14px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.65)' }}>საშუალო თვეში: </span>
                      <strong style={{ color: '#f3d368' }}>₾ 49,000</strong>
                    </div>
                    <div style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '8px', padding: '6px 14px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.65)' }}>წლიური პროგნოზი: </span>
                      <strong style={{ color: '#d4af37' }}>₾ 580,000</strong>
                    </div>
                  </div>
                </div>
                <MonthlyBarChart />
              </div>

            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════════
              1. CANDIDATES & ADMISSIONS (ერთი დიაგრამა + დოსიეების რეესტრი)
              ══════════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'admissions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              
              {/* Admissions Summary Status Pills */}
              <div className="admin-status-grid" style={{ display: 'grid', gap: '14px' }}>
                {[
                  { label: 'ახალი განაცხადები', count: candidates.filter(c => c.status === 'ახალი განაცხადი').length, color: '#d4af37' },
                  { label: 'გასაუბრება დანიშნული', count: candidates.filter(c => c.status === 'გასაუბრება დანიშნული').length, color: '#f3d368' },
                  { label: 'ჩარიცხული', count: candidates.filter(c => c.status === 'ჩარიცხული').length, color: '#e5c158' },
                  { label: 'უარყოფილი', count: candidates.filter(c => c.status === 'უარყოფილი').length, color: '#c25e5e' }
                ].map((s) => (
                  <div key={s.label} style={{ background: 'rgba(25,16,20,0.78)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)' }}>{s.label}</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color, marginTop: '4px' }}>{s.count}</div>
                    </div>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.color, boxShadow: `0 0 8px ${s.color}66` }} />
                  </div>
                ))}
              </div>

              {/* THE ONE SINGLE DIAGRAM FOR ADMISSIONS */}
              <div style={S.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={S.title}><TrendingUp size={18} color="#d4af37" />მიღების ძაბრი & კონვერსია</h3>
                    <p style={S.sub}>განაცხადიდან ჩარიცხვამდე — აპლიკანტთა მოძრაობის დინამიკა (2026–2027 ნაკადი)</p>
                  </div>
                  <span style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: '#d4af37', padding: '4px 12px', borderRadius: '20px', fontSize: '0.74rem', fontWeight: 600 }}>
                    2026–2027 ნაკადი
                  </span>
                </div>
                <AdmissionsFunnelChart />
              </div>

              {/* Candidate Dossier Table */}
              <div style={S.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <h2 style={S.title}><FileText size={20} color="#d4af37" />მიღება & კანდიდატების დოსიე (2026–2027)</h2>
                    <p style={S.sub}>ტესტირების ქულები, გასაუბრების შედეგები, კომისიის გადაწყვეტილებები</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['ყველა', 'ახალი განაცხადი', 'გასაუბრება დანიშნული', 'გასაუბრება გავლილი', 'ჩარიცხული', 'უარყოფილი'].map((f) => (
                      <button key={f} onClick={() => setCandidateFilter(f)} style={S.pill(candidateFilter === f)}>{f}</button>
                    ))}
                  </div>
                </div>
                <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '360px' }}>
                  <Search size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="text" placeholder="ძიება კანდიდატის სახელით..." value={candidateSearch} onChange={(e) => setCandidateSearch(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '10px', padding: '8px 14px 8px 36px', color: '#fff', fontSize: '0.85rem', outline: 'none' }} />
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.25)', color: 'rgba(255,255,255,0.6)' }}>
                        <th style={{ padding: '12px 14px', textAlign: 'left' }}>კანდიდატი</th>
                        <th style={{ padding: '12px 14px', textAlign: 'left' }}>კლასი</th>
                        <th style={{ padding: '12px 14px', textAlign: 'left' }}>ქულები</th>
                        <th style={{ padding: '12px 14px', textAlign: 'left' }}>სტიპენდია</th>
                        <th style={{ padding: '12px 14px', textAlign: 'left' }}>სტატუსი</th>
                        <th style={{ padding: '12px 14px', textAlign: 'right' }}>მოქმედება</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidates.filter((c) => candidateFilter === 'ყველა' || c.status === candidateFilter).filter((c) => c.studentName.toLowerCase().includes(candidateSearch.toLowerCase()) || c.parentName.toLowerCase().includes(candidateSearch.toLowerCase())).map((c) => (
                        <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }} onClick={() => setSelectedCandidate(c)} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '14px' }}><div style={{ fontWeight: 700 }}>{c.studentName}</div><div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>მშობელი: {c.parentName} · {c.phone}</div></td>
                          <td style={{ padding: '14px', color: '#d4af37' }}>{c.gradeApplied}</td>
                          <td style={{ padding: '14px' }}>
                            <div style={{ display: 'flex', gap: '6px', fontSize: '0.78rem' }}>
                              <span style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37', padding: '2px 6px', borderRadius: '4px' }}>მათ: {c.mathScore}</span>
                              <span style={{ background: 'rgba(243,211,104,0.15)', color: '#f3d368', padding: '2px 6px', borderRadius: '4px' }}>ინგლ: {c.englishScore}</span>
                              <span style={{ background: 'rgba(170,130,10,0.15)', color: '#aa820a', padding: '2px 6px', borderRadius: '4px' }}>ლოგ: {c.logicScore}</span>
                            </div>
                          </td>
                          <td style={{ padding: '14px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)' }}>{c.scholarshipRequest}</td>
                          <td style={{ padding: '14px' }}><span style={S.statusBadge(c.status)}>{c.status}</span></td>
                          <td style={{ padding: '14px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                              {c.status !== 'ჩარიცხული' && <button onClick={() => handleUpdateCandidateStatus(c.id, 'ჩარიცხული')} style={{ background: 'rgba(212,175,55,0.18)', border: '1px solid rgba(212,175,55,0.35)', color: '#d4af37', borderRadius: '6px', padding: '5px 10px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={13} /><span>ჩარიცხვა</span></button>}
                              {c.status !== 'უარყოფილი' && <button onClick={() => handleUpdateCandidateStatus(c.id, 'უარყოფილი')} style={{ background: 'rgba(194,94,94,0.15)', border: '1px solid rgba(194,94,94,0.3)', color: '#c25e5e', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer' }}><X size={14} /></button>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedCandidate && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setSelectedCandidate(null)}>
                  <div style={{ background: '#1a1014', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '20px', padding: '32px', maxWidth: '560px', width: '100%', boxShadow: '0 25px 60px rgba(0,0,0,0.8)' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <div><h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{selectedCandidate.studentName}</h3><span style={{ color: '#d4af37' }}>{selectedCandidate.gradeApplied}</span></div>
                      <button onClick={() => setSelectedCandidate(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}><X size={20} /></button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem' }}>
                      <div style={{ background: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '10px' }}>
                        <div style={{ color: '#d4af37', fontWeight: 600, marginBottom: '8px' }}>საგამოცდო შედეგები</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
                          <div>მათემატიკა: <strong style={{ color: '#d4af37' }}>{selectedCandidate.mathScore}/100</strong></div>
                          <div>ინგლისური: <strong style={{ color: '#f3d368' }}>{selectedCandidate.englishScore}/100</strong></div>
                          <div>ლოგიკა: <strong style={{ color: '#aa820a' }}>{selectedCandidate.logicScore}/100</strong></div>
                        </div>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '10px' }}>
                        <div style={{ color: '#d4af37', fontWeight: 600, marginBottom: '6px' }}>კომისიის დასკვნა</div>
                        <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: 0 }}>{selectedCandidate.interviewNotes}</p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <span>მშობლის კონტაქტი:</span><strong>{selectedCandidate.parentName} ({selectedCandidate.phone})</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <span>სტიპენდიის მოთხოვნა:</span><strong style={{ color: '#d4af37' }}>{selectedCandidate.scholarshipRequest}</strong>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                        <button onClick={() => handleUpdateCandidateStatus(selectedCandidate.id, 'ჩარიცხული')} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'linear-gradient(135deg, #f6d56d 0%, #d4af37 100%)', border: 'none', color: '#1a1014', fontWeight: 700, cursor: 'pointer' }}>ჩარიცხვის ბრძანება</button>
                        <button onClick={() => handleUpdateCandidateStatus(selectedCandidate.id, 'უარყოფილი')} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'rgba(194,94,94,0.15)', border: '1px solid rgba(194,94,94,0.3)', color: '#c25e5e', fontWeight: 700, cursor: 'pointer' }}>განაცხადის უარყოფა</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════════
              2. TUITION & FINANCE (ერთი დიაგრამა - DonutChart + რეესტრი)
              ══════════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'finance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              
              {/* Finance Overview Cards + Donut Chart */}
              <div className="admin-finance-overview-grid" style={{ display: 'grid', gap: '16px', alignItems: 'stretch' }}>
                {[
                  { label: 'სულ გადახდილი', value: `₾ ${totalPaidGel.toLocaleString()}`, color: '#d4af37', Icon: TrendingUp },
                  { label: 'სულ დავალიანება', value: `₾ ${totalDueGel.toLocaleString()}`, color: '#e5a93b', Icon: TrendingDown },
                  { label: 'ვადაგადაცილებული', value: `${overdueCount} მოსწავლე`, color: '#c25e5e', Icon: AlertTriangle }
                ].map((item) => (
                  <div key={item.label} style={{ background: 'rgba(25,16,20,0.76)', backdropFilter: 'blur(20px)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <item.Icon size={28} color={item.color} />
                    <div><div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', marginBottom: '4px' }}>{item.label}</div><div style={{ fontSize: '1.25rem', fontWeight: 700, color: item.color }}>{item.value}</div></div>
                  </div>
                ))}
                {/* THE ONE SINGLE DIAGRAM FOR FINANCE */}
                <div style={{ background: 'rgba(25,16,20,0.76)', backdropFilter: 'blur(20px)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <DonutChart paid={paidCount} pending={pendingCount} overdue={overdueCount} scholarship={scholarshipCount} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem' }}>
                    {[['#d4af37', 'დაფარული', paidCount], ['#f3d368', 'მოლოდინში', pendingCount], ['#c25e5e', 'ვადაგადაც.', overdueCount], ['#8a5a2b', 'სტიპენდია', scholarshipCount]].map(([color, label, count]) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: color, flexShrink: 0 }} />
                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>{label}:</span>
                        <span style={{ fontWeight: 700, color }}>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress per Grade Level */}
              <div style={S.card}>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#d4af37', marginBottom: '14px' }}>საფასურის ამოღება კლასების მიხედვით</h4>
                <div className="admin-grade-progress-grid" style={{ display: 'grid', gap: '18px' }}>
                  {[
                    { grade: 'დაწყებითი (I–IV კლასი)', rate: 96, collected: '₾ 21,500', due: '₾ 900', color: '#f3d368' },
                    { grade: 'საბაზო (V–IX კლასი)', rate: 88, collected: '₾ 18,200', due: '₾ 2,500', color: '#d4af37' },
                    { grade: 'საშუალო (X–XII კლასი)', rate: 94, collected: '₾ 13,700', due: '₾ 850', color: '#aa820a' }
                  ].map((g) => (
                    <div key={g.grade} style={{ background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.12)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 600 }}>{g.grade}</span>
                        <strong style={{ color: g.color }}>{g.rate}%</strong>
                      </div>
                      <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
                        <div style={{ height: '100%', width: `${g.rate}%`, background: g.color, borderRadius: '4px' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'rgba(255,255,255,0.65)' }}>
                        <span>აკრეფილი: <strong style={{ color: '#fff' }}>{g.collected}</strong></span>
                        <span>დარჩენილი: <strong style={{ color: '#e5a93b' }}>{g.due}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tuition Registry Table */}
              <div style={S.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                  <div><h2 style={S.title}><DollarSign size={20} color="#d4af37" />საფასურის & გადახდების რეესტრი</h2><p style={S.sub}>სწავლის საფასური, გადახდის გრაფიკი, დავალიანებები</p></div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['ყველა', 'დაფარული', 'მოლოდინში', 'ვადაგადაცილებული', 'სტიპენდია'].map((f) => (
                      <button key={f} onClick={() => setTuitionFilter(f)} style={S.pill(tuitionFilter === f)}>{f}</button>
                    ))}
                  </div>
                </div>
                {reminderAlert && <div style={{ padding: '12px 18px', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.35)', borderRadius: '10px', color: '#d4af37', marginBottom: '18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} /><span>{reminderAlert}</span></div>}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.25)', color: 'rgba(255,255,255,0.6)' }}>
                        <th style={{ padding: '12px 14px', textAlign: 'left' }}>მოსწავლე</th>
                        <th style={{ padding: '12px 14px', textAlign: 'left' }}>წლიური საფასური</th>
                        <th style={{ padding: '12px 14px', textAlign: 'left' }}>გადახდილი</th>
                        <th style={{ padding: '12px 14px', textAlign: 'left' }}>დარჩენილი</th>
                        <th style={{ padding: '12px 14px', textAlign: 'left' }}>სტატუსი</th>
                        <th style={{ padding: '12px 14px', textAlign: 'right' }}>შეხსენება</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tuitionRecords.filter((r) => tuitionFilter === 'ყველა' || r.status === tuitionFilter).map((r) => (
                        <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '14px' }}><div style={{ fontWeight: 700 }}>{r.studentName}</div><div style={{ fontSize: '0.74rem', color: '#d4af37' }}>{r.grade} · {r.plan}</div></td>
                          <td style={{ padding: '14px', fontWeight: 600 }}>₾ {r.annualFee.toLocaleString()}</td>
                          <td style={{ padding: '14px', color: '#d4af37', fontWeight: 700 }}>₾ {r.paidAmount.toLocaleString()}</td>
                          <td style={{ padding: '14px', color: r.dueAmount > 0 ? '#e5a93b' : 'rgba(255,255,255,0.45)' }}>₾ {r.dueAmount.toLocaleString()}</td>
                          <td style={{ padding: '14px' }}><span style={S.statusBadge(r.status)}>{r.status}</span></td>
                          <td style={{ padding: '14px', textAlign: 'right' }}>
                            {r.dueAmount > 0 && <button onClick={() => handleSendReminder(r.studentName)} style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.35)', color: '#d4af37', borderRadius: '6px', padding: '6px 12px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Send size={13} /><span>შეხსენება</span></button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════════
              3. TEACHERS & WORKLOAD (ერთი დიაგრამა - DepartmentDistributionChart + კადრები)
              ══════════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'teachers' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              
              {/* Department Overview Banner */}
              <div className="admin-dept-overview-grid" style={{ display: 'grid', gap: '16px' }}>
                <div style={{ ...S.card, padding: '18px 20px' }}>
                  <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.65)', marginBottom: '4px' }}>კვირეული აკადემიური საათები</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#d4af37' }}>94 საათი/კვ.</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>საშუალოდ 18.8 სთ / პედაგოგზე</div>
                </div>
                <div style={{ ...S.card, padding: '18px 20px' }}>
                  <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.65)', marginBottom: '4px' }}>პედაგოგთა საშუალო რეიტინგი</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f3d368' }}>★ 4.95 / 5.0</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>მოსწავლეთა და მშობელთა შეფასებით</div>
                </div>
                <div style={{ ...S.card, padding: '18px 20px' }}>
                  <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.65)', marginBottom: '4px' }}>აკადემიური ხარისხი</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#aa820a' }}>80% დოქტორი</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>MIT, Oxford, თსუ კურსდამთავრებულები</div>
                </div>
              </div>

              {/* THE ONE SINGLE DIAGRAM FOR TEACHERS */}
              <div style={S.card}>
                <div style={{ marginBottom: '18px' }}>
                  <h3 style={S.title}><Users size={18} color="#d4af37" />კათედრების საათობრივი განაწილება</h3>
                  <p style={S.sub}>პედაგოგიური დატვირთვა საგნობრივი მიმართულებების მიხედვით</p>
                </div>
                <DepartmentDistributionChart />
                <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid rgba(212,175,55,0.15)', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' }}>
                  <span>სულ საათები: <strong style={{ color: '#fff' }}>119 სთ/კვირაში</strong></span>
                  <span>საშუალო რეიტინგი: <strong style={{ color: '#f3d368' }}>★ 4.95 / 5.0</strong></span>
                </div>
              </div>

              {/* Faculty Members Grid */}
              <div style={S.card}>
                <div style={{ marginBottom: '22px' }}>
                  <h2 style={S.title}><Users size={20} color="#d4af37" />პედაგოგიური პერსონალი & დატვირთვა</h2>
                  <p style={S.sub}>კათედრები, საათობრივი დატვირთვა, კლას-ხელმძღვანელობა, რეიტინგი</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
                  {faculty.map((t) => (
                    <div key={t.id} style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div><h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{t.name}</h4><span style={{ fontSize: '0.78rem', color: '#d4af37' }}>{t.title}</span></div>
                        <span style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37', padding: '3px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>★ {t.rating}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)' }}>
                        <div>კათედრა: <strong style={{ color: '#fff' }}>{t.dept}</strong></div>
                        <div>დატვირთვა: <strong style={{ color: '#d4af37' }}>{t.weeklyHours} სთ/კვ.</strong></div>
                        <div>კლასები: <span>{t.classes}</span></div>
                        <div>კურატორობა: <span>{t.advisoryClass}</span></div>
                      </div>
                      <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                        <span>{t.phone}</span><span>{t.email}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════════
              4. INVITE CODES
              ══════════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'invites' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '14px', padding: '18px 22px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <ShieldCheck size={22} color="#d4af37" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, color: '#d4af37', marginBottom: '4px' }}>როგორ მუშაობს მოსაწვევი სისტემა?</div>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: 0 }}>
                    პედაგოგი ვებსაიტზე რეგისტრაციისას ვალდებულია შეიყვანოს ეს გასაღები. გასაღების გარეშე
                    სისტემაში შესვლა შეუძლებელია — ასე მხოლოდ თქვენ მიერ მოწვეული მასწავლებლები
                    ახერხებენ რეგისტრაციას. ყოველ გასაღებს ერთჯერადი გამოყენება აქვს.
                  </p>
                </div>
              </div>
              <div style={S.card}>
                {/* Header & Main Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <h2 style={S.title}><Key size={20} color="#d4af37" />მოსაწვევი გასაღებები</h2>
                    <p style={S.sub}>გენერირება, კოპირება, ფილტრაცია · SOL-XXXXX ფორმატი</p>
                  </div>
                  
                  {/* Actions Right */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <button onClick={fetchInviteCodes} disabled={inviteLoading} title="განახლება" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '8px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
                      <RefreshCw size={15} />
                    </button>
                    
                    <button onClick={handleCopyAllActive} title="ყველა აქტიური გასაღების კოპირება" style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', padding: '8px 14px', color: '#d4af37', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Copy size={14} /><span>აქტიურების კოპირება</span>
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '10px', padding: '6px 12px' }}>
                      <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>რაოდენობა:</span>
                      <select value={batchCount} onChange={(e) => setBatchCount(Number(e.target.value))} style={{ background: 'transparent', border: 'none', color: '#d4af37', fontWeight: 700, cursor: 'pointer', outline: 'none', fontSize: '0.9rem' }}>
                        {[1, 3, 5, 10, 20].map((n) => <option key={n} value={n} style={{ background: '#1a1014' }}>{n}</option>)}
                      </select>
                    </div>

                    <button onClick={handleGenerateCodes} disabled={inviteLoading} style={{ background: 'linear-gradient(135deg,#d4af37 0%,#aa820a 100%)', border: 'none', borderRadius: '10px', padding: '10px 18px', color: '#1a1014', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: inviteLoading ? 0.6 : 1 }}>
                      <Plus size={16} />{inviteLoading ? 'იქმნება...' : 'ავტომატური გენერირება'}
                    </button>
                  </div>
                </div>

                {/* Sub-bar: Custom code creation & Filters */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap', gap: '14px' }}>
                  {/* Left: Custom code form */}
                  <div className="admin-custom-code-box" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      placeholder="საკუთარი კოდი (მაგ: SOL-2026-MATH)"
                      value={customCodeInput}
                      onChange={(e) => setCustomCodeInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomCode(); } }}
                      className="admin-custom-code-input"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '8px', padding: '7px 12px', color: '#d4af37', fontFamily: 'monospace', fontSize: '0.85rem', width: '250px', outline: 'none' }}
                    />
                    <button onClick={handleAddCustomCode} style={{ background: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '8px', padding: '7px 14px', color: '#d4af37', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      + დამატება
                    </button>
                  </div>

                  {/* Right: Filters & Status counts */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {['ყველა', 'აქტიური', 'გამოყენებული'].map((f) => (
                        <button key={f} onClick={() => setInviteFilter(f)} style={S.pill(inviteFilter === f)}>
                          {f}
                        </button>
                      ))}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.6)', paddingLeft: '8px', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                      აქტიური: <strong style={{ color: '#d4af37' }}>{inviteCodes.filter(c => c.is_active).length}</strong> / {inviteCodes.length}
                    </div>
                  </div>
                </div>

                {inviteSuccess && <div style={{ padding: '12px 16px', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '10px', color: '#d4af37', marginBottom: '16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} />{inviteSuccess}</div>}
                {inviteError && <div style={{ padding: '12px 16px', background: 'rgba(194,94,94,0.15)', border: '1px solid rgba(194,94,94,0.4)', borderRadius: '10px', color: '#c25e5e', marginBottom: '16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={16} />{inviteError}</div>}

                {inviteLoading && inviteCodes.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>იტვირთება...</div>
                ) : inviteCodes.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.4)' }}>
                    <Key size={36} style={{ marginBottom: '12px', opacity: 0.4, display: 'block', margin: '0 auto 12px' }} />
                    <div style={{ fontSize: '0.95rem' }}>გასაღებები არ არის. შექმენით პირველი!</div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '12px' }}>
                    {inviteCodes
                      .filter((c) => {
                        if (inviteFilter === 'აქტიური') return c.is_active;
                        if (inviteFilter === 'გამოყენებული') return !c.is_active;
                        return true;
                      })
                      .map((code) => (
                        <div key={code.id} style={{ background: code.is_active ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)', border: `1px solid ${code.is_active ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '12px', padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', opacity: code.is_active ? 1 : 0.65 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Key size={18} color={code.is_active ? '#d4af37' : 'rgba(255,255,255,0.3)'} />
                            <div>
                              <div style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.06em', color: code.is_active ? '#d4af37' : 'rgba(255,255,255,0.4)' }}>{code.code}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: code.is_active ? '#d4af37' : 'rgba(255,255,255,0.3)' }} />
                                <span style={{ fontSize: '0.7rem', color: code.is_active ? '#d4af37' : 'rgba(255,255,255,0.4)' }}>{code.is_active ? 'აქტიური' : 'გამოყენებული'}</span>
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {code.is_active && (
                              <button onClick={() => handleCopyCode(code.code, code.id)} title="კოპირება" style={{ background: copiedId === code.id ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.06)', border: `1px solid ${copiedId === code.id ? '#d4af37' : 'rgba(255,255,255,0.1)'}`, borderRadius: '7px', padding: '6px 8px', color: copiedId === code.id ? '#d4af37' : 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: 'all 0.15s' }}>
                                {copiedId === code.id ? <Check size={14} /> : <Copy size={14} />}
                              </button>
                            )}
                            <button onClick={() => handleDeleteCode(code.id)} title="წაშლა" style={{ background: 'rgba(194,94,94,0.1)', border: '1px solid rgba(194,94,94,0.25)', borderRadius: '7px', padding: '6px 8px', color: '#c25e5e', cursor: 'pointer' }}>
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

          {/* ══════════════════════════════════════════════════════════════════════════
              5. SETTINGS
              ══════════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'settings' && (
            <div style={{ ...S.card, maxWidth: '820px' }}>
              <h2 style={S.title}><Settings size={20} color="#d4af37" />სისტემის პარამეტრები</h2>
              <p style={{ ...S.sub, marginBottom: '24px' }}>კვოტები, ავტორიზაცია, საკონტაქტო რეკვიზიტები, მიღების რეჟიმი</p>
              <form onSubmit={(e) => { e.preventDefault(); setSettingsSaved(true); setTimeout(() => setSettingsSaved(false), 2500); }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="admin-settings-grid" style={{ display: 'grid', gap: '16px' }}>
                  {[['სასწავლო წელი', 'academicYear', 'text'], ['მოსწავლეთა მაქს. კვოტა', 'intakeQuotaTotal', 'number'], ['ამჟამად ჩარიცხული', 'currentEnrolled', 'number']].map(([label, key, type]) => (
                    <div key={key}>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>{label}</label>
                      <input type={type} value={settings[key]} onChange={(e) => setSettings({ ...settings, [key]: type === 'number' ? Number(e.target.value) : e.target.value })} style={{ width: '100%', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '10px', padding: '10px 14px', color: '#fff', outline: 'none' }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.15)' }}>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>ონლაინ რეგისტრაციის მიღება</div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)' }}>ჩართულია თუ არა ონლაინ განაცხადის ფორმა</div>
                  </div>
                  <button type="button" onClick={() => setSettings({ ...settings, admissionsOpen: !settings.admissionsOpen })} style={{ width: '50px', height: '26px', borderRadius: '14px', background: settings.admissionsOpen ? 'linear-gradient(135deg, #f6d56d 0%, #d4af37 100%)' : 'rgba(255,255,255,0.2)', border: 'none', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#1a1014', position: 'absolute', top: '3px', left: settings.admissionsOpen ? '27px' : '3px', transition: 'left 0.2s' }} />
                  </button>
                </div>
                <div className="admin-settings-grid" style={{ display: 'grid', gap: '16px' }}>
                  {[['საკონტაქტო ტელეფონი', 'contactPhone', 'text'], ['მიმღები კომისიის ელ-ფოსტა', 'contactEmail', 'email']].map(([label, key, type]) => (
                    <div key={key}>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>{label}</label>
                      <input type={type} value={settings[key]} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} style={{ width: '100%', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '10px', padding: '10px 14px', color: '#fff', outline: 'none' }} />
                    </div>
                  ))}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>აკადემიის მისამართი</label>
                  <input type="text" value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} style={{ width: '100%', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '10px', padding: '10px 14px', color: '#fff', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <button type="submit" style={{ background: 'linear-gradient(135deg,#d4af37 0%,#aa820a 100%)', border: 'none', borderRadius: '10px', padding: '12px 28px', color: '#1a1014', fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer' }}>პარამეტრების შენახვა</button>
                  {settingsSaved && <span style={{ color: '#d4af37', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={16} /><span>შენახულია!</span></span>}
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
