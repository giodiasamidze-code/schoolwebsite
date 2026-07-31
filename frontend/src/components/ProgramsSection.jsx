import React, { useState } from 'react';
import { ArrowRight, BookOpen, Award, Compass, Heart } from 'lucide-react';

export default function ProgramsSection() {
  const [activeFilter, setActiveFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'ყველა საფეხური' },
    { id: 'primary', label: 'დაწყებითი' },
    { id: 'basic', label: 'საბაზო' },
    { id: 'high', label: 'საშუალო' }
  ];

  const programs = [
    {
      id: 'primary',
      category: 'primary',
      title: 'დაწყებითი სკოლა',
      age: '6 - 10 წელი',
      track: 'კემბრიჯის საერთაშორისო პროგრამა (Cambridge Primary)',
      icon: <BookOpen className="program-icon" />,
      description: 'აკადემიური საფუძვლების ჩამოყალიბება. კრიტიკული აზროვნებისა და წერა-კითხვის უნარების განვითარება ინტეგრირებული სასწავლო გეგმით.',
      subjects: ['მათემატიკა და კოდირება', 'ქართული და ინგლისური ენები', 'ბუნებისმეტყველება', 'ხელოვნება და სპორტი']
    },
    {
      id: 'basic',
      category: 'basic',
      title: 'საბაზო სკოლა',
      age: '10 - 15 წელი',
      track: 'გაძლიერებული STEM და ორენოვანი სწავლება',
      icon: <Compass className="program-icon" />,
      description: 'მოსწავლეები იწყებენ საგნების სიღრმისეულ შესწავლას. ხელს ვუწყობთ კვლევითი უნარებისა და გუნდური მუშაობის განვითარებას.',
      subjects: ['ფიზიკა, ქიმია, ბიოლოგია', 'ალგებრა და გეომეტრია', 'მსოფლიო ისტორია და გეოგრაფია', 'მეორე უცხო ენა (გერმანული/ფრანგული)']
    },
    {
      id: 'high',
      category: 'high',
      title: 'საშუალო სკოლა',
      age: '15 - 18 წელი',
      track: 'საერთაშორისო ბაკალავრიატი (IB Diploma Programme)',
      icon: <Award className="program-icon" />,
      description: 'საუნივერსიტეტო მომზადების უმაღლესი სტანდარტი. მოსწავლეები ირჩევენ საგნებს ინტერესების მიხედვით და ემზადებიან გლობალური განათლებისთვის.',
      subjects: ['აკადემიური წერა (EE)', 'შემეცნების თეორია (TOK)', 'ეკონომიკა და ბიზნესი', 'გლობალური პოლიტიკა']
    }
  ];

  const filteredPrograms = activeFilter === 'all' 
    ? programs 
    : programs.filter(p => p.category === activeFilter);

  return (
    <section className="programs-section container" id="programs">
      <span className="section-eyebrow">აკადემიური პროგრამები</span>
      <h2 className="section-title">განათლება ასაკობრივი საფეხურების მიხედვით</h2>
      <p className="section-desc">
        ჩვენი სასწავლო პროგრამები მორგებულია თითოეული ასაკობრივი ჯგუფის განვითარების ეტაპებსა და ინდივიდუალურ საჭიროებებს.
      </p>

      {/* Pill Filter buttons */}
      <div className="filters-container">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`filter-pill ${activeFilter === cat.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Program Grid */}
      <div className="programs-grid">
        {filteredPrograms.map((program) => (
          <div key={program.id} className="program-card fade-in">
            <div className="program-card-header">
              <div className="program-icon-wrapper">
                {program.icon}
              </div>
              <span className="program-age">{program.age}</span>
            </div>
            <h3 className="program-card-title">{program.title}</h3>
            <span className="program-track">{program.track}</span>
            <p className="program-description">{program.description}</p>
            <div className="program-subjects-container">
              <span className="subjects-label">ძირითადი საგნები:</span>
              <ul className="program-subjects-list">
                {program.subjects.map((sub, i) => (
                  <li key={i} className="program-subject-item">
                    <span className="subject-dot"></span>
                    {sub}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
