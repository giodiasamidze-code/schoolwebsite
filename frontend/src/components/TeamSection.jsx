import React, { useState, useEffect } from 'react';
import { X, Briefcase, GraduationCap, Award, Calendar, Quote } from 'lucide-react';
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
      subject: 'მათემატიკა, ალგებრა-გეომეტრია, კომპიუტერული მეცნიერებები',
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
      certifications: 'CELTA (Certificate in English Language Teaching to Adults), DELTA Module 1.',
      yearsAtSchool: '6 წელი'
    },
    {
      id: 3,
      name: 'დავით კოპალეიშვილი',
      role: 'ფიზიკისა და ბუნებისმეტყველების პედაგოგი',
      subject: 'ფიზიკა, ბუნებისმეტყველება, STEM ლაბორატორია',
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
      subject: 'ქართული ენა და ლიტერატურა, აკადემიური წერა (EE)',
      category: 'languages',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'თსუ ფილოლოგიის ფაკულტეტი (ბაკალავრი, მაგისტრი).',
      experience: '14 წელი ქართული ენისა და აკადემიური წერის სწავლებაში.',
      certifications: 'ეროვნული გამოცდების შემფასებელი, IB Extended Essay (EE) კოორდინატორი.',
      yearsAtSchool: '7 წელი'
    },
    {
      id: 5,
      name: 'ლევან გორგაძე',
      role: 'ისტორიისა და გლობალური პოლიტიკის პედაგოგი',
      subject: 'მსოფლიო ისტორია, გლობალური პოლიტიკა, შემეცნების თეორია (TOK)',
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
      subject: 'ქიმია, ბიოლოგია, გარემოსდაცვითი მეცნიერებები',
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
      subject: 'სახვითი ხელოვნება, მძლეოსნობა, სპორტის სექციები',
      category: 'arts-sports',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=400',
      education: 'თბილისის სახელმწიფო სამხატვრო აკადემია (ბაკალავრი), ფიზიკური აღზრდისა და სპორტის სახელმწიფო სასწავლო უნივერსიტეტი.',
      experience: '10 წელი სპორტული და შემოქმედებითი მიმართულებით.',
      certifications: 'ლიცენზირებული მწვრთნელი კალათბურთსა და სახვით ხელოვნებაში.',
      yearsAtSchool: '5 წელი'
    },
    {
      id: 8,
      name: 'ანა მებურიშვილი',
      role: 'ეკონომიკისა და გეოგრაფიის პედაგოგი',
      subject: 'ეკონომიკა და ბიზნესი, გეოგრაფია, გლობალური პერსპექტივები',
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
            image: t.photo_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400',
            education: t.education || 'უმაღლესი განათლება',
            experience: t.experience_years || 'მრავალწლიანი გამოცდილება',
            certifications: t.certifications || 'სერტიფიცირებული პედაგოგი',
            yearsAtSchool: t.years_at_school || '1 წელი'
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
    <section className="team-section" id="teachers" style={{ position: 'relative', overflow: 'hidden', padding: '90px 0 60px' }}>
      
      {/* Luxury Background Watermark */}
      <div className="section-watermark">
        FACULTY
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2, width: '92%', maxWidth: '1360px', margin: '0 auto' }}>
        <span className="section-eyebrow">ჩვენი გუნდი</span>
        <h2 className="section-title">აკადემიური ლიდერები და მასწავლებლები</h2>
        <p className="section-desc">
          სკოლის წარმატებას განაპირობებენ მაღალი კვალიფიკაციის მქონე პროფესიონალები, რომლებიც მუდმივად ზრუნავენ სწავლების ხარისხის განვითარებაზე.
        </p>

        {/* Director Spotlight Section with Border Beam */}
        <div className="border-beam-container" style={{ borderRadius: '24px', margin: '0 auto 48px', maxWidth: '1000px' }}>
          <div className="border-beam" />
          <div className="director-card spotlight-card" style={{ position: 'relative', zIndex: 1, margin: 0, width: '100%' }}>
            <div className="director-image-wrapper">
              <img src={director.image} alt={director.name} className="director-headshot" />
            </div>
            <div className="director-content">
              <Quote className="quote-icon text-gold" size={32} />
              <p className="director-quote">{director.quote}</p>
              <h3 className="director-name">{director.name}</h3>
              <span className="director-role">{director.role}</span>
              <button 
                className="btn btn-outline btn-sm mt-4"
                onClick={() => setSelectedTeacher(director)}
              >
                სრული რეზიუმე
              </button>
            </div>
          </div>
        </div>

        {/* Subject Filter pills */}
        <div className="filters-container">
          {subjectCategories.map((sub) => (
            <button
              key={sub.id}
              className={`filter-pill ${activeSubject === sub.id ? 'active' : ''}`}
              onClick={() => setActiveSubject(sub.id)}
            >
              {sub.label}
            </button>
          ))}
        </div>

        {/* Teachers Grid with Spotlight Cards */}
        <div className="card-grid">
          {filteredTeachers.map((teacher) => (
            <div key={teacher.id} className="card teacher-card spotlight-card fade-in">
              <div className="teacher-avatar">
                <img src={teacher.image} alt={teacher.name} className="teacher-headshot" />
              </div>
              <h3 className="teacher-name">{teacher.name}</h3>
              <span className="teacher-role">{teacher.role}</span>
              <span className="teacher-subject-tag">{teacher.subject}</span>
              <button 
                className="teacher-details-btn"
                onClick={() => setSelectedTeacher(teacher)}
              >
                დეტალურად &rarr;
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Luxury Gold Divider */}
      <div className="luxury-divider" style={{ marginTop: '50px' }}>
        <div className="luxury-divider-line" />
        <span className="luxury-divider-star">✦ ✦ ✦</span>
        <div className="luxury-divider-line" />
      </div>

      {/* CV Modal Overlay */}
      {selectedTeacher && (
        <div className="modal-overlay" onClick={() => setSelectedTeacher(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedTeacher(null)}>
              <X size={20} />
            </button>
            
            <div className="modal-header">
              <div className="modal-avatar">
                <img src={selectedTeacher.image} alt={selectedTeacher.name} className="modal-headshot" />
              </div>
              <div>
                <h3 className="modal-teacher-name">{selectedTeacher.name}</h3>
                <span className="modal-teacher-role">{selectedTeacher.role}</span>
              </div>
            </div>

            <div className="modal-body">
              <div className="cv-item">
                <GraduationCap className="cv-icon" />
                <div>
                  <h4>განათლება</h4>
                  <p>{selectedTeacher.education}</p>
                </div>
              </div>
              
              <div className="cv-item">
                <Briefcase className="cv-icon" />
                <div>
                  <h4>გამოცდილება</h4>
                  <p>{selectedTeacher.experience}</p>
                </div>
              </div>

              <div className="cv-item">
                <Award className="cv-icon" />
                <div>
                  <h4>სერტიფიკატები</h4>
                  <p>{selectedTeacher.certifications}</p>
                </div>
              </div>

              <div className="cv-item">
                <Calendar className="cv-icon" />
                <div>
                  <h4>აკადემიაში მუშაობის პერიოდი</h4>
                  <p>{selectedTeacher.yearsAtSchool}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
