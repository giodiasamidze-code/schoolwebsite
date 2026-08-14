import React, { useState } from 'react';
import { ArrowRight, BookOpen, Award, Compass, Sparkles, CheckCircle2, ChevronRight, Layers, Star, Clock } from 'lucide-react';

export default function ProgramsSection() {
  const [activeFilter, setActiveFilter] = useState('primary');

  const categories = [
    { id: 'primary', label: 'დაწყებითი (I - IV)' },
    { id: 'basic', label: 'საბაზო (V - IX)' },
    { id: 'high', label: 'საშუალო (X - XII)' }
  ];

  const programsData = {
    primary: {
      id: 'primary',
      title: 'დაწყებითი სკოლა (Primary Academy)',
      age: '6 – 10 წელი',
      track: 'კემბრიჯის საერთაშორისო პროგრამა (Cambridge Primary)',
      icon: BookOpen,
      iconColor: '#ff8598',
      description: 'ფუნდამენტური აკადემიური საფუძვლების ჩამოყალიბება. კრიტიკული აზროვნების, წერა-კითხვის, ლოგიკისა და კვლევითი უნარების განვითარება ინტერაქციული სასწავლო მეთოდოლოგიით.',
      highlights: [
        'ორენოვანი გარემო (ქართული & ინგლისური)',
        'მათემატიკისა და ლოგიკური აზროვნების გაძლიერებული მოდული',
        'საბავშვო STEM და რობოტოტექნიკის პირველი ნაბიჯები',
        'შემოქმედებითი ხელოვნება, მუსიკა და ყოველდღიური ფიზიკური აქტივობა'
      ],
      subjects: ['მათემატიკა & კოდირება', 'ქართული ენა & ლიტერატურა', 'Cambridge English', 'ბუნებისმეტყველება', 'სახვითი ხელოვნება', 'ჭადრაკი & სპორტი'],
      schedule: '09:00 – 16:30 (სამჯერადი ეკოლოგიური კვებით)'
    },
    basic: {
      id: 'basic',
      title: 'საბაზო სკოლა (Middle Academy)',
      age: '10 – 15 წელი',
      track: 'გაძლიერებული STEM და საერთაშორისო IGCSE პროგრამა',
      icon: Compass,
      iconColor: 'var(--accent-secondary, #d4af37)',
      description: 'საგნების სიღრმისეული და ინტერდისციპლინური შესწავლა. ლაბორატორიული კვლევები, გუნდური პროექტები და დებატების კულტურა, რაც მოსწავლეს დამოუკიდებელ მკვლევრად აყალიბებს.',
      highlights: [
        'ფიზიკის, ქიმიისა და ბიოლოგიის პრაქტიკული ლაბორატორიები',
        'ალგებრისა და გეომეტრიის ოლიმპიური მომზადების კურსები',
        'მეორე უცხო ენა არჩევით: გერმანული ან ფრანგული',
        'საპროექტო სწავლება (PBL) და ლიდერობის კლუბი'
      ],
      subjects: ['ფიზიკა & ქიმია', 'ალგებრა & გეომეტრია', 'ბიოლოგია & ეკოლოგია', 'მსოფლიო ისტორია & გეოგრაფია', 'English Literature', 'მეორე ენა (DE/FR)', 'კომპიუტერული მეცნიერება'],
      schedule: '09:00 – 17:00 (გახანგრძლივებული საოლიმპიადო ჯგუფებით)'
    },
    high: {
      id: 'high',
      title: 'საშუალო სკოლა (High School & IB DP)',
      age: '15 – 18 წელი',
      track: 'საერთაშორისო ბაკალავრიატი (IB Diploma Programme)',
      icon: Award,
      iconColor: '#86efac',
      description: 'საუნივერსიტეტო მომზადების უმაღლესი გლობალური სტანდარტი. მოსწავლეები ქმნიან საკუთარ საგანმანათლებლო პროფილს და წარმატებით აბარებენ წამყვან ქართულ და მსოფლიო უნივერსიტეტებში.',
      highlights: [
        '100% სახელმწიფო და საერთაშორისო საუნივერსიტეტო გრანტები',
        'აკადემიური კვლევითი ნაშრომი (Extended Essay)',
        'შემეცნების თეორია (Theory of Knowledge - TOK)',
        'CAS პროგრამა (Creativity, Activity, Service) - სოციალური პასუხისმგებლობა'
      ],
      subjects: ['Higher Level Mathematics', 'AP / IB Physics & Chemistry', 'Economics & Global Politics', 'Academic Writing (EE)', 'TOK Seminar', 'World Literature', 'Advanced Computer Science'],
      schedule: '09:00 – 16:30 (ინდივიდუალური საუნივერსიტეტო მენტორინგით)'
    }
  };

  const selected = programsData[activeFilter] || programsData.primary;
  const SelectedIcon = selected.icon;

  return (
    <section className="programs-section" id="programs" style={{ padding: '80px 0', position: 'relative' }}>
      <div className="container" style={{ width: '92%', maxWidth: '1360px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="section-eyebrow">აკადემიური საფეხურები</span>
          <h2 className="section-title">საერთაშორისო პროგრამები და კურიკულუმი</h2>
          <p className="section-desc">
            სასწავლო პროგრამები დაფუძნებულია Cambridge-ისა და IB-ის სტანდარტებზე, რაც უზრუნველყოფს მოსწავლის ჰარმონიულ და უწყვეტ განვითარებას.
          </p>
        </div>

        {/* Interactive Segmented Selector Tabs (Admin Style) */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '8px',
          maxWidth: '680px',
          margin: '0 auto 48px',
          flexWrap: 'wrap'
        }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              style={{
                flex: 1,
                minWidth: '160px',
                padding: '12px 20px',
                borderRadius: '12px',
                border: 'none',
                background: activeFilter === cat.id ? 'linear-gradient(135deg, #8b0000, #c41e3a)' : 'transparent',
                color: activeFilter === cat.id ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: activeFilter === cat.id ? '0 4px 20px rgba(139, 0, 0, 0.45)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Layers size={16} />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Master Showcase Bento Card */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(38, 14, 19, 0.75), rgba(20, 7, 9, 0.9))',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(20px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '40px',
          alignItems: 'center'
        }}>
          
          {/* Left Details */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #8b0000, #c41e3a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 18px rgba(139, 0, 0, 0.4)'
              }}>
                <SelectedIcon size={24} color="#ffffff" />
              </div>
              <div>
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '20px',
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  color: 'var(--accent-secondary, #d4af37)',
                  fontSize: '0.78rem',
                  fontWeight: 700
                }}>
                  ასაკი: {selected.age}
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: '#fff', margin: '4px 0 0', fontWeight: 700 }}>
                  {selected.title}
                </h3>
              </div>
            </div>

            <div style={{ color: '#ff8598', fontWeight: 600, fontSize: '0.95rem', marginBottom: '16px' }}>
              {selected.track}
            </div>

            <p style={{ fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.7, marginBottom: '24px' }}>
              {selected.description}
            </p>

            {/* Curriculum Highlights with Checkmarks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {selected.highlights.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--accent-secondary, #d4af37)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.92rem', color: '#f3ece3' }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.85rem',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              <Clock size={16} color="#ff8598" />
              <span>განრიგი: <strong>{selected.schedule}</strong></span>
            </div>
          </div>

          {/* Right: Subject Chips & Apply CTA */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-secondary, #d4af37)', marginBottom: '14px' }}>
                ძირითადი საგნობრივი მოდულები:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selected.subjects.map((sub, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '8px 14px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      fontWeight: 500
                    }}
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            <div style={{
              padding: '16px',
              background: 'rgba(196, 30, 58, 0.12)',
              border: '1px solid rgba(196, 30, 58, 0.3)',
              borderRadius: '14px'
            }}>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: '4px' }}>
                გსურთ ამ საფეხურზე რეგისტრაცია?
              </div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '14px' }}>
                შეავსეთ ონლაინ განაცხადი 2 წუთში და დაჯავშნეთ გასაუბრება დირექციასთან.
              </div>
              <a
                href="#admissions"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #8b0000, #c41e3a)',
                  color: '#fff',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(139, 0, 0, 0.4)'
                }}
              >
                <span>განაცხადის შევსება</span>
                <ArrowRight size={16} />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
