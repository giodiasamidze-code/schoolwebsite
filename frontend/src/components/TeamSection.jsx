import React, { useState, useEffect } from 'react';
import { X, Briefcase, GraduationCap, Award, Calendar, Quote, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function TeamSection() {
  const [activeSubject, setActiveSubject] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [dynamicTeachers, setDynamicTeachers] = useState([]);

  const subjectCategories = [
    { id: 'all', label: 'ყველა საგანი' },
    { id: 'stem', label: 'მათემატიკა და STEM' },
    { id: 'languages', label: 'ენები და ლიტერატურა' },
    { id: 'social', label: 'საზოგადოებრივი მეცნიერებები' },
    { id: 'arts-sports', label: 'ხელოვნება და სპორტი' }
  ];

  const director = {
    name: 'ელენე ბაქრაძე',
    role: 'სკოლის დირექტორი',
    quote: 'აკადემიაში ჩვენ გვწამს, რომ განათლება არის არა ჭურჭლის ავსება, არამედ ცეცხლის დანთება. ჩვენი მიზანია აღვზარდოთ მოაზროვნე, პასუხისმგებლიანი და თავისუფალი პიროვნებები, რომლებიც შეცვლიან სამყაროს უკეთესობისკენ.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400',
    education: 'PhD განათლების მენეჯმენტში (ჰარვარდის უნივერსიტეტი), თსუ ასოცირებული პროფესორი.',
    experience: '18 წელი საგანმანათლებლო სფეროში, აქედან 8 წელი საერთაშორისო სკოლების მართვაში.',
    certifications: 'IB სკოლების ხელმძღვანელთა საერთაშორისო სერტიფიკატი.',
    yearsAtSchool: '6 წელი'
  };

  const teachers = [
    {
      id: 1,
      name: 'გიორგი მახარაძე',
      role: 'მათემატიკისა და კოდირების პედაგოგი',
      subject: 'მათემატიკა, ალგებრა-გეომეტრია, STEM',
      category: 'stem',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'თბილისის სახელმწიფო უნივერსიტეტი (მათემატიკის ბაკალავრი), მიუნხენის ტექნიკური უნივერსიტეტი (მაგისტრი).',
      experience: '9 წელი მათემატიკისა და კომპიუტერული მეცნიერებების სწავლებაში.',
      certifications: 'Google Certified Educator Level 2, Cambridge Mathematics Trainer.',
      yearsAtSchool: '4 წელი'
    },
    {
      id: 2,
      name: 'ნინო დევდარიანი',
      role: 'ინგლისური ენისა და ლიტერატურის პედაგოგი',
      subject: 'ინგლისური ენა, ბილინგვური კურსები',
      category: 'languages',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'ილიას სახელმწიფო უნივერსიტეტი (ბაკალავრი), ლონდონის საუნივერსიტეტო კოლეჯი (UCL, მაგისტრი).',
      experience: '12 წელი ბილინგვური სწავლების მიმართულებით.',
      certifications: 'CELTA, DELTA Module 1.',
      yearsAtSchool: '6 წელი'
    },
    {
      id: 3,
      name: 'დავით კოპალეიშვილი',
      role: 'ფიზიკისა და ბუნებისმეტყველების პედაგოგი',
      subject: 'ფიზიკა, STEM ლაბორატორია',
      category: 'stem',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'თსუ ფიზიკის ფაკულტეტი (ბაკალავრი, მაგისტრი).',
      experience: '10 წელი ფიზიკისა და STEM დისციპლინების სწავლებაში.',
      certifications: 'ეროვნული სასწავლო ოლიმპიადების მენტორი, AP Physics Certified Teacher.',
      yearsAtSchool: '5 წელი'
    },
    {
      id: 4,
      name: 'თამარ ჩხეიძე',
      role: 'ქართული ენისა და ლიტერატურის პედაგოგი',
      subject: 'ქართული ენა და ლიტერატურა, აკადემიური წერა',
      category: 'languages',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'თსუ ფილოლოგიის ფაკულტეტი (ბაკალავრი, მაგისტრი).',
      experience: '14 წელი ქართული ენისა და აკადემიური წერის სწავლებაში.',
      certifications: 'ეროვნული გამოცდების შემფასებელი, IB EE კოორდინატორი.',
      yearsAtSchool: '7 წელი'
    },
    {
      id: 5,
      name: 'ლევან გორგაძე',
      role: 'ისტორიისა და გლობალური პოლიტიკის პედაგოგი',
      subject: 'მსოფლიო ისტორია, გლობალური პოლიტიკა',
      category: 'social',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'თსუ ისტორიის ფაკულტეტი (ბაკალავრი), ცენტრალური ევროპის უნივერსიტეტი (CEU, მაგისტრი).',
      experience: '11 წელი საზოგადოებრივი მეცნიერებების სწავლებაში.',
      certifications: 'IB TOK და Global Politics სერტიფიცირებული პედაგოგი.',
      yearsAtSchool: '4 წელი'
    },
    {
      id: 6,
      name: 'ქეთევან ტაბატაძე',
      role: 'ბიოლოგიისა და ქიმიის პედაგოგი',
      subject: 'ქიმია, ბიოლოგია, ეკოლოგია',
      category: 'stem',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'თბილისის სახელმწიფო სამედიცინო უნივერსიტეტი (აკადემიური ხარისხი ბიოლოგიაში).',
      experience: '8 წელი ქიმია-ბიოლოგიის მიმართულებით.',
      certifications: 'Cambridge IGCSE Biology & Chemistry Certified Teacher.',
      yearsAtSchool: '3 წელი'
    },
    {
      id: 7,
      name: 'ირაკლი კალანდაძე',
      role: 'ხელოვნებისა და ფიზიკური აღზრდის პედაგოგი',
      subject: 'სახვითი ხელოვნება, სპორტის სექციები',
      category: 'arts-sports',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'თბილისის სახელმწიფო სამხატვრო აკადემია (ბაკალავრი), ფიზიკური აღზრდისა და სპორტის უნივერსიტეტი.',
      experience: '10 წელი სპორტული და შემოქმედებითი მიმართულებით.',
      certifications: 'ლიცენზირებული მწვრთნელი კალათბურთსა და სახვით ხელოვნებაში.',
      yearsAtSchool: '5 წელი'
    },
    {
      id: 8,
      name: 'ანა მებურიშვილი',
      role: 'ეკონომიკისა და გეოგრაფიის პედაგოგი',
      subject: 'ეკონომიკა და ბიზნესი, გეოგრაფია',
      category: 'social',
      image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'თსუ ეკონომიკისა და ბიზნესის ფაკულტეტი (ბაკალავრი, მაგისტრი).',
      experience: '7 წელი ეკონომიკისა და გეოგრაფიის სწავლებაში.',
      certifications: 'AP Economics Certified Educator, Cambridge Global Perspectives Trainer.',
      yearsAtSchool: '3 წელი'
    }
  ];

  useEffect(() => {
    async function loadTeachers() {
      try {
        const { data, error } = await supabase.from('teachers').select('*');
        if (!error && data && data.length > 0) {
          const mapped = data.map((t) => ({
            id: t.id,
            name: t.full_name,
            role: `${t.subject} პედაგოგი`,
            subject: t.subject,
            category: 'stem',
            image: t.photo_url || '',
            education: t.education || 'არ არის მითითებული',
            experience: t.experience_years || 'არ არის მითითებული',
            certifications: t.certifications || 'არ არის მითითებული',
            yearsAtSchool: t.years_at_school || 'არ არის მითითებული'
          }));
          setDynamicTeachers(mapped);
        }
      } catch (err) {
        console.error('Error fetching teachers from Supabase:', err);
      }
    }
    loadTeachers();
  }, []);

  const allTeachersList = [...dynamicTeachers, ...teachers];

  const filteredTeachers = activeSubject === 'all'
    ? allTeachersList
    : allTeachersList.filter(t => t.category === activeSubject);

  return (
    <section className="team-section bg-cream-dark" id="teachers" style={{ padding: '80px 0', background: 'var(--bg-secondary, #F3ECE3)' }}>
      <div className="container">
        <span className="section-eyebrow" style={{ color: 'var(--accent-secondary, #C5A059)' }}>ჩვენი გუნდი</span>
        <h2 className="section-title" style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: '2.5rem', color: 'var(--text-dark, #2C2825)', textAlign: 'center', marginBottom: '12px' }}>
          აკადემიური ლიდერები და მასწავლებლები
        </h2>
        <p className="section-desc" style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 40px', color: 'var(--text-muted, #6B625B)' }}>
          სკოლის წარმატებას განაპირობებენ მაღალი კვალიფიკაციის მქონე პროფესიონალები, რომლებიც მუდმივად ზრუნავენ სწავლების ხარისხის განვითარებაზე.
        </p>

        {/* Director Spotlight Section */}
        <div className="director-card" style={{
          background: '#ffffff',
          border: '1px solid var(--border-color, #E2DACF)',
          borderRadius: '20px',
          padding: '36px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
          alignItems: 'center',
          marginBottom: '48px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.05)'
        }}>
          <div className="director-image-wrapper" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '180px',
              height: '180px',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '3px solid var(--accent-secondary, #C5A059)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              <img src={director.image} alt={director.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
          <div className="director-content">
            <Quote className="quote-icon" size={32} color="var(--accent-secondary, #C5A059)" style={{ marginBottom: '12px' }} />
            <p className="director-quote" style={{ fontStyle: 'italic', fontSize: '1.05rem', color: 'var(--text-dark, #2C2825)', lineHeight: '1.7', marginBottom: '16px' }}>
              "{director.quote}"
            </p>
            <h3 className="director-name" style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: '1.4rem', color: 'var(--text-dark, #2C2825)', margin: '0 0 4px' }}>
              {director.name}
            </h3>
            <span className="director-role" style={{ color: 'var(--accent-primary, #800020)', fontWeight: 600, fontSize: '0.9rem' }}>
              {director.role}
            </span>
          </div>
        </div>

        {/* Subject Filter pills */}
        <div className="filters-container" style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {subjectCategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setActiveSubject(sub.id)}
              style={{
                padding: '8px 18px',
                borderRadius: '30px',
                border: activeSubject === sub.id ? '1px solid var(--accent-primary, #800020)' : '1px solid var(--border-color, #E2DACF)',
                background: activeSubject === sub.id ? 'var(--accent-primary, #800020)' : '#ffffff',
                color: activeSubject === sub.id ? '#ffffff' : 'var(--text-dark, #2C2825)',
                fontWeight: 600,
                fontSize: '0.86rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: activeSubject === sub.id ? '0 4px 14px rgba(128, 0, 32, 0.25)' : 'none'
              }}
            >
              {sub.label}
            </button>
          ))}
        </div>

        {/* Teachers Grid (Identical style to Photo 1) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '24px'
        }}>
          {filteredTeachers.map((teacher) => {
            const hasPhoto = teacher.image && !teacher.image.includes('placeholder') && teacher.image.startsWith('http');
            const initial = teacher.name ? teacher.name.trim()[0] : 'T';

            return (
              <div
                key={teacher.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-color, #E2DACF)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(128, 0, 32, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.04)';
                }}
              >
                {/* 1. Header (Photo 1 exact design) */}
                <div style={{
                  padding: '24px 20px 18px',
                  background: 'linear-gradient(180deg, var(--bg-secondary, #F3ECE3) 0%, #ffffff 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  borderBottom: '1px solid var(--border-color, #E2DACF)'
                }}>
                  <div style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '18px',
                    background: hasPhoto ? `url(${teacher.image}) center/cover` : 'var(--accent-primary, #800020)',
                    border: '2px solid var(--accent-secondary, #C5A059)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '1.6rem',
                    flexShrink: 0
                  }}>
                    {!hasPhoto && initial}
                  </div>

                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
                      fontSize: '1.25rem',
                      color: 'var(--text-dark, #2C2825)',
                      margin: '0 0 4px',
                      fontWeight: 700
                    }}>
                      {teacher.name}
                    </h3>
                    <div style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      borderRadius: '6px',
                      background: 'rgba(128, 0, 32, 0.08)',
                      border: '1px solid rgba(128, 0, 32, 0.2)',
                      color: 'var(--accent-primary, #800020)',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>
                      {teacher.subject}
                    </div>
                  </div>
                </div>

                {/* 2. Body Details (Photo 1 exact icon boxes & layout) */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                  
                  {/* Education */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'var(--bg-secondary, #F3ECE3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-primary, #800020)',
                      flexShrink: 0
                    }}>
                      <GraduationCap size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #6B625B)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                        განათლება
                      </div>
                      <div style={{ fontSize: '0.86rem', color: 'var(--text-dark, #2C2825)', marginTop: '2px', lineHeight: '1.4' }}>
                        {teacher.education || 'არ არის მითითებული'}
                      </div>
                    </div>
                  </div>

                  {/* Experience */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'var(--bg-secondary, #F3ECE3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-primary, #800020)',
                      flexShrink: 0
                    }}>
                      <Briefcase size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #6B625B)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                        პედაგოგიური გამოცდილება
                      </div>
                      <div style={{ fontSize: '0.86rem', color: 'var(--text-dark, #2C2825)', marginTop: '2px', lineHeight: '1.4' }}>
                        {teacher.experience || 'არ არის მითითებული'}
                      </div>
                    </div>
                  </div>

                  {/* Certifications */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'var(--bg-secondary, #F3ECE3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-primary, #800020)',
                      flexShrink: 0
                    }}>
                      <Award size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #6B625B)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                        სერტიფიკატები & კვალიფიკაცია
                      </div>
                      <div style={{ fontSize: '0.86rem', color: 'var(--text-dark, #2C2825)', marginTop: '2px', lineHeight: '1.4' }}>
                        {teacher.certifications || 'არ არის მითითებული'}
                      </div>
                    </div>
                  </div>

                  {/* Years at school */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'var(--bg-secondary, #F3ECE3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-primary, #800020)',
                      flexShrink: 0
                    }}>
                      <Calendar size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #6B625B)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                        აკადემიაში მუშაობის პერიოდი
                      </div>
                      <div style={{ fontSize: '0.86rem', color: 'var(--text-dark, #2C2825)', marginTop: '2px', lineHeight: '1.4' }}>
                        {teacher.yearsAtSchool || 'არ არის მითითებული'}
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
