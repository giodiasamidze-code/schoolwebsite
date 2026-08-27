import React, { useState, useEffect, useRef } from 'react';
import { X, Award, GraduationCap, Briefcase, Calendar, Info, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function TeamSection() {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [activeTeacherIndex, setActiveTeacherIndex] = useState(0);
  const [dynamicTeachers, setDynamicTeachers] = useState([]);
  const carouselRef = useRef(null);

  const defaultTeachers = [
    {
      id: 1,
      name: 'დავით გიორგაძე',
      latinName: 'David Giorgadze',
      role: 'ისტორიის პედაგოგი',
      subject: 'მსოფლიო ისტორია და დიპლომატია',
      badge: 'ისტორია',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'თბილისის სახელმწიფო უნივერსიტეტი (ისტორიის დოქტორი), CEU მაგისტრი.',
      experience: '14 წელი საზოგადოებრივი მეცნიერებების სწავლებაში.',
      certifications: 'IB Global Politics & History Certified Examiner.',
      yearsAtSchool: '5 წელი (Solomon Institutions)'
    },
    {
      id: 2,
      name: 'ლუკა გიორგაძე',
      latinName: 'Luka Giorgadze',
      role: 'კომპიუტერული მეცნიერებები',
      subject: 'ინფორმატიკა, რობოტოტექნიკა და AI',
      badge: 'IT & AI',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'მიუნხენის ტექნიკური უნივერსიტეტი (MSc Computer Science).',
      experience: '9 წელი კოდირებისა და ალგორითმების პრაქტიკაში.',
      certifications: 'Google Certified Educator Level 2, Cambridge ICT Trainer.',
      yearsAtSchool: '4 წელი (Solomon Institutions)'
    },
    {
      id: 3,
      name: 'მარიამ კალანდაძე',
      latinName: 'Mariam Kalandadze',
      role: 'ინგლისური ენის პედაგოგი',
      subject: 'ინგლისური ენა და ლიტერატურა',
      badge: 'ინგლისური',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'ლონდონის საუნივერსიტეტო კოლეჯი (UCL, MA Applied Linguistics).',
      experience: '11 წელი საერთაშორისო პროგრამებში სწავლება.',
      certifications: 'CELTA, DELTA Module 1, Cambridge IGCSE Examiner.',
      yearsAtSchool: '6 წელი (Solomon Institutions)'
    },
    {
      id: 4,
      name: 'დავით ცეცხლაძე',
      latinName: 'David Tsetskhladze',
      role: 'ფიზიკის პედაგოგი',
      subject: 'თეორიული და ექსპერიმენტული ფიზიკა',
      badge: 'ფიზიკა',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'თსუ ზუსტ და საბუნებისმეტყველო მეცნიერებათა ფაკულტეტი (PhD).',
      experience: '12 წელი STEM და ოლიმპიადების მომზადებაში.',
      certifications: 'AP Physics Certified Master Teacher.',
      yearsAtSchool: '5 წელი (Solomon Institutions)'
    },
    {
      id: 5,
      name: 'ელენე ბერიძე',
      latinName: 'Elene Beridze',
      role: 'მათემატიკის პედაგოგი',
      subject: 'მათემატიკა, უმაღლესი ალგებრა და ანალიზი',
      badge: 'მათემატიკა',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'მათემატიკის დოქტორი (თსუ), ოქსფორდის უნივერსიტეტის პოსტდოქტორი.',
      experience: '15 წელი მათემატიკური დისციპლინების სწავლებაში.',
      certifications: 'Cambridge International Diploma, IB HL Mathematics Trainer.',
      yearsAtSchool: '7 წელი (Solomon Institutions)'
    },
    {
      id: 6,
      name: 'გიორგი მახარაძე',
      latinName: 'Giorgi Makharadze',
      role: 'ქიმიის პედაგოგი',
      subject: 'ზოგადი და ორგანული ქიმია',
      badge: 'ქიმია',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'თბილისის სახელმწიფო სამედიცინო უნივერსიტეტი (MSc).',
      experience: '8 წელი ქიმიისა და ლაბორატორიული კვლევების ხელმძღვანელობაში.',
      certifications: 'Cambridge IGCSE Chemistry Certified Educator.',
      yearsAtSchool: '4 წელი (Solomon Institutions)'
    },
    {
      id: 7,
      name: 'ელენე ღრიანდაძე',
      latinName: 'Elene Griandadze',
      role: 'ბიოლოგიის პედაგოგი',
      subject: 'გენეტიკა და მოლეკულური ბიოლოგია',
      badge: 'ბიოლოგია',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'ილიას სახელმწიფო უნივერსიტეტი (ბიოლოგიის მაგისტრი).',
      experience: '10 წელი საბუნებისმეტყველო მეცნიერებათა სწავლებაში.',
      certifications: 'IB Biology Diploma Programme Category 2.',
      yearsAtSchool: '5 წელი (Solomon Institutions)'
    },
    {
      id: 8,
      name: 'სალომე ჯაფარიძე',
      latinName: 'Salome Japaridze',
      role: 'გეოგრაფიისა და ეკონომიკის პედაგოგი',
      subject: 'გლობალური ეკონომიკა და გეოპოლიტიკა',
      badge: 'ეკონომიკა',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'თსუ ეკონომიკისა და ბიზნესის ფაკულტეტი (მაგისტრი).',
      experience: '7 წელი ეკონომიკისა და გეოგრაფიის სწავლებაში.',
      certifications: 'AP Economics & Cambridge Global Perspectives.',
      yearsAtSchool: '3 წელი (Solomon Institutions)'
    },
    {
      id: 9,
      name: 'ნინო კვარაცხელია',
      latinName: 'Nino Kvaratskhelia',
      role: 'ქართული ენისა და ლიტერატურის პედაგოგი',
      subject: 'ქართული ენა და აკადემიური წერა',
      badge: 'ქართული',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'თსუ ფილოლოგიის ფაკულტეტი (ბაკალავრი, მაგისტრი).',
      experience: '13 წელი ქართული ენისა და ლიტერატურის სწავლებაში.',
      certifications: 'ეროვნული სასწავლო გამოცდების ექსპერტი, IB EE კოორდინატორი.',
      yearsAtSchool: '6 წელი (Solomon Institutions)'
    },
    {
      id: 10,
      name: 'ალექსანდრე ჩხეიძე',
      latinName: 'Alexandre Chkheidze',
      role: 'ასტრონომიისა და STEM პედაგოგი',
      subject: 'ასტროფიზიკა და კოსმოსური კვლევები',
      badge: 'ასტრონომია',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'ჰაიდელბერგის უნივერსიტეტი (MSc Astrophysics).',
      experience: '8 წელი ასტრონომიული ობსერვატორიისა და კლუბის ხელმძღვანელობაში.',
      certifications: 'International Astronomy Olympiad Trainer.',
      yearsAtSchool: '4 წელი (Solomon Institutions)'
    },
    {
      id: 11,
      name: 'თამარ აბაშიძე',
      latinName: 'Tamar Abashidze',
      role: 'ფრანგული ენის პედაგოგი',
      subject: 'ფრანგული ენა და ევროპული კულტურა',
      badge: 'ფრანგული',
      image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'სორბონის უნივერსიტეტი (Paris-Sorbonne, MA FLE).',
      experience: '11 წელი უცხო ენების სწავლებაში.',
      certifications: 'DALF C2 Examiner, CIEP Accredited.',
      yearsAtSchool: '5 წელი (Solomon Institutions)'
    },
    {
      id: 12,
      name: 'ნიკოლოზ წერეთელი',
      latinName: 'Nikoloz Tsereteli',
      role: 'ხელოვნებისა და არქიტექტურის პედაგოგი',
      subject: 'აკადემიური ხატვა, დიზაინი და არქიტექტურა',
      badge: 'ხელოვნება',
      image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'თბილისის სამხატვრო აკადემია (MFA Architecture).',
      experience: '10 წელი დიზაინისა და პორტფოლიოს მომზადებაში.',
      certifications: 'AP Art and Design Studio Educator.',
      yearsAtSchool: '4 წელი (Solomon Institutions)'
    },
    {
      id: 13,
      name: 'ანა მესხი',
      latinName: 'Ana Meskhi',
      role: 'გერმანული ენის პედაგოგი',
      subject: 'გერმანული ენა (DaF / DSD)',
      badge: 'გერმანული',
      image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'ბერლინის ჰუმბოლდტის უნივერსიტეტი (MA DaF).',
      experience: '9 წელი გოეთეს ინსტიტუტისა და DSD პროგრამებში.',
      certifications: 'Goethe-Zertifikat C2 Prüferin, DSD II Trainer.',
      yearsAtSchool: '3 წელი (Solomon Institutions)'
    },
    {
      id: 14,
      name: 'ირაკლი ვაჩნაძე',
      latinName: 'Irakli Vachnadze',
      role: 'რობოტოტექნიკისა და ინჟინერიის პედაგოგი',
      subject: 'მიკროკონტროლერები, Arduino და Mechatronics',
      badge: 'ინჟინერია',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'საქართველოს ტექნიკური უნივერსიტეტი (ავტომატიზაცია & რობოტიქსი).',
      experience: '7 წელი First LEGO League & VEX Robotics მენტორობაში.',
      certifications: 'Certified Robotics Educator, FLL Coach.',
      yearsAtSchool: '3 წელი (Solomon Institutions)'
    },
    {
      id: 15,
      name: 'ქეთევან დოლიძე',
      latinName: 'Ketevan Dolidze',
      role: 'მუსიკისა და აუდიო ხელოვნების პედაგოგი',
      subject: 'კლასიკური მუსიკა და აკუსტიკური დიზაინი',
      badge: 'მუსიკა',
      image: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'თბილისის სახელმწიფო კონსერვატორია (საფორტეპიანო ხელოვნება, PhD).',
      experience: '12 წელი მუსიკალურ განათლებასა და ანსამბლში.',
      certifications: 'ABRSM Music Theory and Practical Examiner.',
      yearsAtSchool: '5 წელი (Solomon Institutions)'
    },
    {
      id: 16,
      name: 'მიხეილ ამირეჯიბი',
      latinName: 'Mikheil Amirejibi',
      role: 'ფილოსოფიისა და დებატების პედაგოგი',
      subject: 'კრიტიკული აზროვნება, ეთიკა და დებატები',
      badge: 'დებატები',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'კემბრიჯის უნივერსიტეტი (MPhil Philosophy).',
      experience: '10 წელი დებატებისა და ორატორული ხელოვნების კლუბის ხელმძღვანელობაში.',
      certifications: 'Karl Popper Debate Association Certified Judge.',
      yearsAtSchool: '4 წელი (Solomon Institutions)'
    }
  ];

  useEffect(() => {
    async function loadTeachers() {
      try {
        const { data, error } = await supabase.from('teachers').select('*');
        if (!error && data && data.length > 0) {
          const mapped = data.map((t, idx) => ({
            id: t.id || idx + 1,
            name: t.full_name,
            latinName: t.full_name,
            role: `${t.subject} პედაგოგი`,
            subject: t.subject,
            badge: t.subject,
            image: t.photo_url || defaultTeachers[idx % defaultTeachers.length].image,
            education: t.education || 'უმაღლესი აკადემიური განათლება',
            experience: t.experience_years ? `${t.experience_years} წელი` : 'მრავალწლიანი გამოცდილება',
            certifications: t.certifications || 'სერტიფიცირებული პედაგოგი',
            yearsAtSchool: t.years_at_school ? `${t.years_at_school} (Solomon Institutions)` : 'Solomon Institutions'
          }));
          setDynamicTeachers(mapped);
        }
      } catch (err) {
        console.error('Error fetching teachers:', err);
      }
    }
    loadTeachers();
  }, []);

  const teachersList = dynamicTeachers.length > 0
    ? [...dynamicTeachers, ...defaultTeachers.slice(dynamicTeachers.length)]
    : defaultTeachers;
  const activeTeacher = teachersList[activeTeacherIndex] || teachersList[0];

  // Infinite physics carousel engine
  const posRef = useRef(0);
  const velocityRef = useRef(0);
  const isInteractingRef = useRef(false);
  const lastMouseXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const rAFRef = useRef(null);
  const activeIdxRef = useRef(0);         // mirror — keeps rAF closure fresh
  const [isDragging, setIsDragging] = useState(false);

  // keep ref mirror in sync with React state
  useEffect(() => { activeIdxRef.current = activeTeacherIndex; }, [activeTeacherIndex]);

  // Tripled list for seamless infinite wrapping (a / b / c copies)
  const infiniteList = [
    ...teachersList.map((t, idx) => ({ ...t, _origIdx: idx, _key: `a-${idx}-${t.id}` })),
    ...teachersList.map((t, idx) => ({ ...t, _origIdx: idx, _key: `b-${idx}-${t.id}` })),
    ...teachersList.map((t, idx) => ({ ...t, _origIdx: idx, _key: `c-${idx}-${t.id}` }))
  ];

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const ITEM_W = 112;                              // 100px card + 12px gap
    const N = teachersList.length;
    const singleSetW = N * ITEM_W;

    // Jump to middle copy — both wrap directions are available
    posRef.current = singleSetW;
    el.scrollLeft = singleSetW;

    const frame = () => {
      // ── Physics ─────────────────────────────────────────────────────────
      if (!isInteractingRef.current) {
        if (Math.abs(velocityRef.current) > 0.05) {
          posRef.current += velocityRef.current;
          velocityRef.current *= 0.93;               // flywheel friction
        } else {
          velocityRef.current = 0;
        }
      }

      // ── Seamless modulo — keep posRef in [singleSetW, singleSetW*2) ────
      // Jumping between copies is invisible because they are identical.
      while (posRef.current >= singleSetW * 2) posRef.current -= singleSetW;
      while (posRef.current < singleSetW)       posRef.current += singleSetW;

      el.scrollLeft = posRef.current;

      // ── 3-D cylindrical transform ────────────────────────────────────────
      const cRect = el.getBoundingClientRect();
      const cx = cRect.left + cRect.width / 2;
      const cards = el.querySelectorAll('.twc');

      let bestIdx = activeIdxRef.current;
      let bestDist = Infinity;

      cards.forEach((card) => {
        const r = card.getBoundingClientRect();
        const dx = r.left + r.width / 2 - cx;
        const norm = Math.max(-1.4, Math.min(1.4, dx / (cRect.width * 0.42)));
        const rotY  = norm * -36;
        const sc    = Math.max(0.78, 1 - Math.abs(norm) * 0.22);
        const tz    = (1 - Math.abs(norm)) * 22;
        const alpha = Math.max(0.4, 1 - Math.abs(norm) * 0.58);
        card.style.transform = `perspective(900px) translateZ(${tz}px) rotateY(${rotY}deg) scale(${sc})`;
        card.style.opacity   = alpha;

        if (Math.abs(dx) < bestDist) {
          bestDist = Math.abs(dx);
          const oi = parseInt(card.dataset.origIdx, 10);
          if (!isNaN(oi)) bestIdx = oi;
        }
      });

      if (bestIdx !== activeIdxRef.current && bestDist < 58) {
        setActiveTeacherIndex(bestIdx);
      }

      rAFRef.current = requestAnimationFrame(frame);
    };

    rAFRef.current = requestAnimationFrame(frame);

    // ── Wheel → gentle per-tick impulse ──────────────────────────────────────
    // Physics: total displacement = SNAP_VEL / (1 - friction) = 2.5 / 0.07 ≈ 36px
    // One card = 112px → 3 wheel ticks ≈ 1 card change (as user requested)
    const SNAP_VEL = 2.5;
    const onWheel = (e) => {
      e.preventDefault();
      const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      const dir = d > 0 ? 1 : -1;
      // Cap at 3 ticks worth so fast spinning stays predictable
      velocityRef.current = Math.max(-SNAP_VEL * 3, Math.min(SNAP_VEL * 3, velocityRef.current + dir * SNAP_VEL));
    };
    el.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(rAFRef.current);
      el.removeEventListener('wheel', onWheel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teachersList.length]); // intentionally NO activeTeacherIndex dep — loop must never restart

  // ── Pointer / Touch drag ─────────────────────────────────────────────────
  const handlePointerDown = (e) => {
    isInteractingRef.current = true;
    setIsDragging(true);
    lastMouseXRef.current = e.touches ? e.touches[0].clientX : e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  const handlePointerMove = (e) => {
    if (!isInteractingRef.current) return;
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const now = performance.now();
    const dx = lastMouseXRef.current - cx;
    const dt = Math.max(1, now - lastTimeRef.current);
    posRef.current += dx;
    velocityRef.current = (dx / dt) * 16;
    lastMouseXRef.current = cx;
    lastTimeRef.current = now;
  };

  const handlePointerUp = () => {
    isInteractingRef.current = false;
    setIsDragging(false);
  };

  // Animate wheel toward a clicked card
  const centerOnTeacher = (targetIdx) => {
    setActiveTeacherIndex(targetIdx);
    const el = carouselRef.current;
    if (!el) return;
    const cx = el.getBoundingClientRect().left + el.clientWidth / 2;
    let bestDelta = 0, minD = Infinity;
    el.querySelectorAll(`.twc[data-orig-idx="${targetIdx}"]`).forEach((card) => {
      const d = card.getBoundingClientRect().left + card.offsetWidth / 2 - cx;
      if (Math.abs(d) < minD) { minD = Math.abs(d); bestDelta = d; }
    });
    velocityRef.current = bestDelta * 0.22;
  };

  return (
    <section
      id="teachers"
      style={{
        position: 'relative',
        background: '#121214',
        minHeight: '100vh',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxSizing: 'border-box',
        padding: '16px 0 12px',
        overflow: 'hidden',
        color: '#f0ece8'
      }}
    >
      {/* Chalkboard Math Formulas Background Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.18,
          pointerEvents: 'none',
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(212, 175, 55, 0.08) 0%, transparent 40%)
          `
        }}
      />

      {/* SVG Math & Geometric Formulas Decorative Chalkboard Engravings */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: 0.22
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <style>{`
            .formula-text { font-family: 'Times New Roman', Times, serif; font-style: italic; fill: #d4af37; font-size: 26px; }
            .formula-text-sm { font-family: 'Times New Roman', Times, serif; font-style: italic; fill: #d4af37; font-size: 19px; }
          `}</style>
        </defs>

        {/* Left Side Formulas */}
        <text x="3%" y="18%" className="formula-text">∫ f(x) dx</text>
        <text x="2%" y="45%" className="formula-text">∫ x dx</text>
        <text x="4%" y="58%" className="formula-text">√a² + b²</text>
        <text x="3%" y="72%" className="formula-text-sm">ₙCᵣ</text>
        
        {/* Left 3D Wireframe Cone */}
        <g transform="translate(60, 680) scale(0.65)">
          <ellipse cx="60" cy="110" rx="55" ry="18" fill="none" stroke="#d4af37" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="60" y1="10" x2="5" y2="110" stroke="#d4af37" strokeWidth="1.2" />
          <line x1="60" y1="10" x2="115" y2="110" stroke="#d4af37" strokeWidth="1.2" />
          <line x1="60" y1="10" x2="60" y2="110" stroke="#d4af37" strokeWidth="1" strokeDasharray="2 2" />
        </g>

        {/* Right Side Formulas */}
        <text x="90%" y="22%" className="formula-text">∫ x dx</text>
        <text x="88%" y="42%" className="formula-text">√a² + b²</text>
        <text x="92%" y="56%" className="formula-text-sm">ₙCᵣ</text>

        {/* Right 3D Wireframe Cone */}
        <g transform="translate(1320, 680) scale(0.65)">
          <ellipse cx="60" cy="110" rx="55" ry="18" fill="none" stroke="#d4af37" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="60" y1="10" x2="5" y2="110" stroke="#d4af37" strokeWidth="1.2" />
          <line x1="60" y1="10" x2="115" y2="110" stroke="#d4af37" strokeWidth="1.2" />
          <line x1="60" y1="10" x2="60" y2="110" stroke="#d4af37" strokeWidth="1" strokeDasharray="2 2" />
          <text x="75" y="65" className="formula-text-sm" style={{ fontSize: '14px' }}>h</text>
        </g>
      </svg>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '94%',
          maxWidth: '1280px',
          margin: '0 auto'
        }}
      >
        {/* Ornate Gold Crown & Filigree Top Border */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '10px'
          }}
        >
          {/* Top Filigree Flourish with Crown and Shield */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              width: '100%',
              maxWidth: '560px'
            }}
          >
            {/* Left flourish line */}
            <div
              style={{
                flex: 1,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.7))'
              }}
            />

            {/* Shield & Crown Crest Icon */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0 2px 8px rgba(212, 175, 55, 0.4))'
              }}
            >
              <svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Crown */}
                <path
                  d="M22 20 L26 26 L32 18 L38 26 L42 20 L40 28 L24 28 Z"
                  fill="#d4af37"
                  stroke="#f5e2a3"
                  strokeWidth="1"
                />
                <circle cx="32" cy="16" r="2" fill="#f5e2a3" />
                <circle cx="22" cy="18" r="1.5" fill="#f5e2a3" />
                <circle cx="42" cy="18" r="1.5" fill="#f5e2a3" />

                {/* Shield */}
                <path
                  d="M20 28 C20 28 32 30 32 30 C32 30 44 28 44 28 C44 42 32 50 32 50 C32 50 20 42 20 28 Z"
                  fill="rgba(24, 18, 12, 0.9)"
                  stroke="#d4af37"
                  strokeWidth="1.8"
                />
                <path
                  d="M24 32 C24 32 32 33.5 32 33.5 C32 33.5 40 32 40 32 C40 40 32 46 32 46 C32 46 24 40 24 32 Z"
                  fill="none"
                  stroke="rgba(212, 175, 55, 0.5)"
                  strokeWidth="1"
                />

                {/* Crest Emblems: 'S' inside Shield */}
                <text x="27" y="42" fill="#e8c86d" fontSize="13" fontWeight="bold" fontFamily="serif">
                  S
                </text>
              </svg>
            </div>

            {/* Right flourish line */}
            <div
              style={{
                flex: 1,
                height: '1px',
                background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.7), transparent)'
              }}
            />
          </div>
        </div>

        {/* Central Spotlight Teacher Showcase Card (Exact Mockup 2 Center Card) */}
        <div
          style={{
            maxWidth: '780px',
            margin: '0 auto 12px',
            background: 'rgba(22, 20, 18, 0.95)',
            border: '1.5px solid rgba(212, 175, 55, 0.75)',
            borderRadius: '16px',
            padding: 'clamp(12px, 1.8vh, 18px) clamp(16px, 2.2vw, 24px)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75), inset 0 0 25px rgba(212, 175, 55, 0.08)',
            display: 'grid',
            gridTemplateColumns: 'minmax(110px, 140px) 1fr',
            gap: 'clamp(14px, 2vw, 24px)',
            alignItems: 'center',
            transition: 'all 0.35s ease'
          }}
        >
          {/* Left: Portrait in Golden Rounded Frame */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1 / 1.15',
              borderRadius: '12px',
              border: '1.5px solid rgba(212, 175, 55, 0.65)',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)'
            }}
          >
            <img
              src={activeTeacher.image}
              alt={activeTeacher.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* Right: Teacher Credentials & Bio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* Header: Quote + Name */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'serif',
                  fontSize: '2.2rem',
                  lineHeight: 0.9,
                  color: 'rgba(212, 175, 55, 0.85)'
                }}
              >
                ”
              </span>
              <div>
                <h3
                  style={{
                    fontFamily: "'Noto Serif Georgian', Georgia, serif",
                    fontSize: 'clamp(1.25rem, 1.9vw, 1.55rem)',
                    fontWeight: 600,
                    color: '#ffffff',
                    lineHeight: 1.15,
                    margin: 0
                  }}
                >
                  {activeTeacher.name}
                </h3>
                <p
                  style={{
                    fontFamily: "'Noto Sans Georgian', sans-serif",
                    fontSize: '0.86rem',
                    color: '#c4a66a',
                    fontWeight: 500,
                    marginTop: '2px',
                    marginBottom: '6px'
                  }}
                >
                  {activeTeacher.role}
                </p>
              </div>
            </div>

            {/* Metadata Rows (Matches Mockup 2 format) */}
            <div style={{ fontSize: '0.82rem', lineHeight: 1.5, color: '#ded7cd' }}>
              <p style={{ margin: '2px 0' }}>
                <strong style={{ color: '#c4a66a', fontWeight: 600 }}>განათლება: </strong>
                <span>{activeTeacher.education}</span>
              </p>
              <p style={{ margin: '2px 0' }}>
                <strong style={{ color: '#c4a66a', fontWeight: 600 }}>გამოცდილება: </strong>
                <span>{activeTeacher.experience}</span>
              </p>
              <p style={{ margin: '2px 0' }}>
                <strong style={{ color: '#c4a66a', fontWeight: 600 }}>სერტიფიკატი: </strong>
                <span>{activeTeacher.certifications}</span>
              </p>
              <p style={{ margin: '2px 0' }}>
                <strong style={{ color: '#c4a66a', fontWeight: 600 }}>მუშაობის პერიოდი: </strong>
                <span>{activeTeacher.yearsAtSchool}</span>
              </p>
            </div>

          </div>
        </div>

        {/* Bottom 3D Infinite Cylindrical Rotary Physics Wheel */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            background: 'linear-gradient(180deg, rgba(24, 18, 16, 0.75) 0%, rgba(14, 10, 12, 0.9) 100%)',
            borderTop: '1.5px solid rgba(212, 175, 55, 0.45)',
            borderBottom: '1.5px solid rgba(212, 175, 55, 0.45)',
            borderRadius: '16px',
            padding: '8px 8px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7), inset 0 0 25px rgba(212, 175, 55, 0.06)',
            perspective: '1000px',
            overflow: 'hidden'
          }}
        >
          {/* Scroll Track with Infinite 3D Inertia Physics */}
          <div
            ref={carouselRef}
            onMouseDown={handlePointerDown}
            onMouseLeave={handlePointerUp}
            onMouseUp={handlePointerUp}
            onMouseMove={handlePointerMove}
            onTouchStart={handlePointerDown}
            onTouchEnd={handlePointerUp}
            onTouchMove={handlePointerMove}
            style={{
              display: 'flex',
              gap: '12px',
              overflowX: 'hidden',
              padding: '6px 4px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              willChange: 'scroll-position, transform'
            }}
          >
            {infiniteList.map((t) => {
              const isCenterActive = t._origIdx === activeTeacherIndex;
              return (
                <div
                  key={t._key}
                  data-orig-idx={t._origIdx}
                  className="twc"
                  onClick={() => centerOnTeacher(t._origIdx)}
                  style={{
                    flex: '0 0 100px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    transition: 'none',
                    transformStyle: 'preserve-3d',
                    willChange: 'transform, opacity'
                  }}
                >
                  {/* Portrait Card */}
                  <div
                    style={{
                      width: '88px',
                      height: '102px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: isCenterActive
                        ? '2px solid #d4af37'
                        : '1px solid rgba(212, 175, 55, 0.35)',
                      boxShadow: isCenterActive
                        ? '0 0 18px rgba(212, 175, 55, 0.7), 0 8px 16px rgba(0,0,0,0.8)'
                        : '0 4px 12px rgba(0,0,0,0.5)',
                      background: '#1a1412',
                      marginBottom: '4px'
                    }}
                  >
                    <img
                      src={t.image}
                      alt={t.name}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400';
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        pointerEvents: 'none'
                      }}
                    />
                  </div>

                  {/* Name and Subject Badge */}
                  <span
                    style={{
                      fontFamily: "'Noto Serif Georgian', Georgia, serif",
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      color: isCenterActive ? '#f5e2a3' : 'rgba(255, 255, 255, 0.85)',
                      lineHeight: 1.15,
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      maxWidth: '96px'
                    }}
                  >
                    {t.name}
                  </span>
                  <span
                    style={{
                      fontSize: '0.64rem',
                      color: isCenterActive ? '#d4af37' : 'rgba(212, 175, 55, 0.65)',
                      marginTop: '1px',
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      maxWidth: '96px'
                    }}
                  >
                    {t.badge || t.role}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>


      {/* Detailed Modal Profile for Teacher */}
      {selectedTeacher && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedTeacher(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.82)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#161311',
              border: '1.5px solid rgba(212, 175, 55, 0.7)',
              borderRadius: '20px',
              maxWidth: '650px',
              width: '100%',
              padding: '36px 32px',
              boxShadow: '0 24px 70px rgba(0,0,0,0.85)',
              position: 'relative',
              color: '#ffffff'
            }}
          >
            <button
              onClick={() => setSelectedTeacher(null)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '24px' }}>
              <div
                style={{
                  width: '110px',
                  height: '125px',
                  borderRadius: '12px',
                  border: '1.5px solid #d4af37',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                <img
                  src={selectedTeacher.image}
                  alt={selectedTeacher.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <h2
                  style={{
                    fontFamily: "'Noto Serif Georgian', serif",
                    fontSize: '1.6rem',
                    color: '#f5e2a3',
                    marginBottom: '4px'
                  }}
                >
                  {selectedTeacher.name}
                </h2>
                <p style={{ color: '#d4af37', fontSize: '0.95rem', fontWeight: 600 }}>
                  {selectedTeacher.role}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                  {selectedTeacher.subject}
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                fontSize: '0.92rem',
                lineHeight: 1.7,
                borderTop: '1px solid rgba(212, 175, 55, 0.2)',
                paddingTop: '20px'
              }}
            >
              <div style={{ display: 'flex', gap: '10px' }}>
                <GraduationCap size={20} color="#d4af37" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#f5e2a3' }}>განათლება: </strong>
                  <span style={{ color: 'rgba(255,255,255,0.85)' }}>{selectedTeacher.education}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Briefcase size={20} color="#d4af37" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#f5e2a3' }}>გამოცდილება: </strong>
                  <span style={{ color: 'rgba(255,255,255,0.85)' }}>{selectedTeacher.experience}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Award size={20} color="#d4af37" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#f5e2a3' }}>სერტიფიკატები: </strong>
                  <span style={{ color: 'rgba(255,255,255,0.85)' }}>{selectedTeacher.certifications}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Calendar size={20} color="#d4af37" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#f5e2a3' }}>მუშაობის პერიოდი: </strong>
                  <span style={{ color: 'rgba(255,255,255,0.85)' }}>{selectedTeacher.yearsAtSchool}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
