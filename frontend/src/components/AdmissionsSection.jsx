import React, { useState, useEffect } from 'react';
import { Calendar, FileText, CheckCircle2, ChevronDown, ChevronUp, Clock, Info } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function AdmissionsSection() {
  const { user, pendingFormSubmit, setPendingFormSubmit, requireAuth } = useAuth();
  // Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    grade: ''
  });
  const [bookingStatus, setBookingStatus] = useState({ loading: false, success: null, message: '' });

  // Application Form State
  const [appForm, setAppForm] = useState({
    studentName: '',
    parentName: '',
    phone: '',
    email: '',
    grade: '',
    additionalInfo: ''
  });
  const [appStatus, setAppStatus] = useState({ loading: false, success: null, message: '' });

  // FAQ Data
  const faqs = [
    {
      q: 'როდის იწყება რეგისტრაცია ახალი სასწავლო წლისთვის?',
      a: 'რეგისტრაცია იწყება ყოველი წლის 1 აპრილიდან და გრძელდება 15 მაისამდე. ადგილები შეზღუდულია, ამიტომ გირჩევთ განაცხადი დროულად შეავსოთ.'
    },
    {
      q: 'არის თუ არა შესაძლებელი სწავლის საფასურის ეტაპობრივი გადახდა?',
      a: 'დიახ, სკოლა ხელს უწყობს მშობლებს და სწავლის საფასურის გადახდა შესაძლებელია 10 თანაბარ ყოველთვიურ ნაწილად ან ორ ეტაპად (სემესტრულად).'
    },
    {
      q: 'რა ენებზე მიმდინარეობს სწავლება?',
      a: 'სასწავლო პროცესი მიმდინარეობს ქართულ ენაზე ეროვნული სასწავლო გეგმის შესაბამისად, თუმცა ინგლისური ენის სწავლება გაძლიერებულია პირველივე კლასიდან. საშუალო საფეხურზე (IB) საგნების ნაწილი ინგლისურ ენაზე ისწავლება.'
    },
    {
      q: 'სთავაზობს თუ არა სკოლა მოსწავლეებს ტრანსპორტირებას და კვებას?',
      a: 'დიახ, სკოლას ემსახურება თანამედროვე სტანდარტების მქონე ტრანსპორტირების ქსელი. მოსწავლეებს ასევე ვთავაზობთ ეკოლოგიურად სუფთა პროდუქტებისგან მომზადებულ სამჯერად ბალანსირებულ კვებას.'
    }
  ];

  // Timeline Data
  const steps = [
    { num: '01', title: 'განაცხადის შევსება', desc: 'ონლაინ სარეგისტრაციო ფორმის შევსება ჩვენს ვებგვერდზე.', deadline: '15 მაისი, 2026' },
    { num: '02', title: 'საბუთების წარდგენა', desc: 'საჭირო დოკუმენტაციის წარდგენა სკოლის საინფორმაციო ცენტრში.', deadline: '30 მაისი, 2026' },
    { num: '03', title: 'გასაუბრება & შეფასება', desc: 'მოსწავლის აკადემიური და ფსიქო-ემოციური მზაობის შეფასება.', deadline: '15 ივნისი, 2026' },
    { num: '04', title: 'შედეგების გამოცხადება', desc: 'მიღების შესახებ გადაწყვეტილების მშობლისთვის შეტყობინება.', deadline: '1 ივლისი, 2026' },
    { num: '05', title: 'ხელშეკრულების გაფორმება', desc: 'სწავლის ხელშეკრულების გაფორმება და პირველი შენატანის განხორციელება.', deadline: '15 ივლისი, 2026' }
  ];

  const checklist = [
    'მოსწავლის დაბადების მოწმობის ნოტარიულად დამოწმებული ასლი',
    'მშობლების/მეურვეების პირადობის მოწმობის ასლები',
    'მოსწავლის ჯანმრთელობის ცნობა (ფორმა IV-100ა)',
    'წინა სკოლის აკადემიური მოსწრების ფურცელი (ასეთის არსებობის შემთხვევაში)',
    '2 ფოტოსურათი (ზომით 3x4)'
  ];

  const tuitionRates = [
    { grade: 'დაწყებითი (1-6 კლასი)', yearly: '8,200 ₾', monthly: '820 ₾' },
    { grade: 'საბაზო (7-9 კლასი)', yearly: '9,500 ₾', monthly: '950 ₾' },
    { grade: 'საშუალო (10-12 კლასი)', yearly: '11,000 ₾', monthly: '1,100 ₾' }
  ];

  const extraCosts = [
    { item: 'სამჯერადი კვება', price: '180 ₾ / თვეში' },
    { item: 'ორმხრივი ტრანსპორტირება', price: '150 ₾ / თვეში' },
    { item: 'სასკოლო ფორმა და სახელმძღვანელოები', price: '400 ₾ / წლიური (ერთჯერადი)' }
  ];

  const submitBookingData = async (formData) => {
    setBookingStatus({ loading: true, success: null, message: '' });
    try {
      const response = await fetch('http://localhost:5001/api/visit-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setBookingStatus({ loading: false, success: true, message: data.message });
        setBookingForm({ name: '', phone: '', email: '', date: '', grade: '' });
      } else {
        setBookingStatus({ loading: false, success: false, message: data.message || 'სისტემური შეცდომა' });
      }
    } catch (err) {
      setBookingStatus({ loading: false, success: false, message: 'კავშირის შეცდომა. გთხოვთ შეამოწმოთ, რომ ბეკენდ სერვერი ჩართულია.' });
    }
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    requireAuth('booking', bookingForm, () => {
      submitBookingData(bookingForm);
    });
  };

  const submitAppData = async (formData) => {
    setAppStatus({ loading: true, success: null, message: '' });
    try {
      const response = await fetch('http://localhost:5001/api/application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setAppStatus({ loading: false, success: true, message: data.message });
        setAppForm({ studentName: '', parentName: '', phone: '', email: '', grade: '', additionalInfo: '' });
      } else {
        setAppStatus({ loading: false, success: false, message: data.message || 'სისტემური შეცდომა' });
      }
    } catch (err) {
      setAppStatus({ loading: false, success: false, message: 'კავშირის შეცდომა. გთხოვთ შეამოწმოთ, რომ ბეკენდ სერვერი ჩართულია.' });
    }
  };

  const handleAppSubmit = (e) => {
    e.preventDefault();
    requireAuth('application', appForm, () => {
      submitAppData(appForm);
    });
  };

  useEffect(() => {
    if (user && pendingFormSubmit) {
      const { formType, data } = pendingFormSubmit;
      if (formType === 'booking') {
        setBookingForm(data);
        setPendingFormSubmit(null);
        submitBookingData(data);
      } else if (formType === 'application') {
        setAppForm(data);
        setPendingFormSubmit(null);
        submitAppData(data);
      }
    }
  }, [user, pendingFormSubmit, setPendingFormSubmit]);

  return (
    <section className="admissions-section" id="admissions">
      <div className="container">
        <span className="section-eyebrow">მიღება სკოლაში</span>
        <h2 className="section-title">მისაღები პროცედურა და რეგისტრაცია</h2>
        <p className="section-desc">
          გაეცანით მისაღები პროცესის ეტაპებს, სწავლის ღირებულებას და შემოგვიერთდით ახალი სასწავლო წლისთვის.
        </p>

        {/* 1. Timeline */}
        <h3 className="sub-section-title">მიღების ეტაპები</h3>
        <div className="timeline-grid">
          {steps.map((step) => (
            <div key={step.num} className="timeline-step">
              <span className="timeline-num">{step.num}</span>
              <h4 className="timeline-step-title">{step.title}</h4>
              <p className="timeline-step-desc">{step.desc}</p>
              <span className="timeline-deadline">
                <Clock size={12} className="icon-mr" />
                {step.deadline}
              </span>
            </div>
          ))}
        </div>

        {/* 2. Documents & Pricing Layout */}
        <div className="doc-price-grid">
          {/* Document Checklist */}
          <div className="checklist-card">
            <h3 className="card-sub-title">
              <FileText className="text-burgundy" size={24} />
              საჭირო დოკუმენტაცია
            </h3>
            <ul className="checklist-list">
              {checklist.map((item, idx) => (
                <li key={idx} className="checklist-item">
                  <CheckCircle2 size={18} className="text-burgundy flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tuition Table */}
          <div className="pricing-card">
            <h3 className="card-sub-title">სწავლის საფასური</h3>
            <table className="pricing-table">
              <thead>
                <tr>
                  <th>საფეხური</th>
                  <th>წლიური</th>
                  <th>თვიური (x10)</th>
                </tr>
              </thead>
              <tbody>
                {tuitionRates.map((rate, idx) => (
                  <tr key={idx}>
                    <td>{rate.grade}</td>
                    <td className="font-semibold">{rate.yearly}</td>
                    <td>{rate.monthly}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Extra Costs */}
            <div className="extra-costs">
              <h4>დამატებითი მომსახურება:</h4>
              <ul className="extra-costs-list">
                {extraCosts.map((cost, idx) => (
                  <li key={idx}>
                    <span className="extra-item-name">{cost.item}:</span>
                    <span className="extra-item-price font-semibold">{cost.price}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Scholarship info */}
            <div className="scholarship-alert">
              <Info size={16} className="text-gold flex-shrink-0" />
              <p>
                <strong>სტიპენდიები:</strong> გვაქვს 10%-დან 50%-მდე შეღავათები ოლიმპიადების გამარჯვებულებისთვის, დედმამიშვილებისთვის და მაღალი აკადემიური მოსწრების მოსწავლეებისთვის.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Forms Layout */}
        <div className="forms-grid" id="booking-section">
          {/* Visit Booking Form */}
          <div className="form-card-container">
            <h3 className="form-card-heading">ვიზიტის დაჯავშნა</h3>
            <p className="form-card-subheading">დაგეგმეთ ინდივიდუალური ტური სკოლაში და გაესაუბრეთ ადმინისტრაციას.</p>
            
            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="booking-name">სახელი და გვარი *</label>
                <input
                  id="booking-name"
                  type="text"
                  required
                  className="form-control"
                  placeholder="თქვენი სახელი..."
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="booking-phone">ტელეფონი *</label>
                  <input
                    id="booking-phone"
                    type="tel"
                    required
                    className="form-control"
                    placeholder="მაგ: 599 12 34 56"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="booking-email">ელ-ფოსტა</label>
                  <input
                    id="booking-email"
                    type="email"
                    className="form-control"
                    placeholder="mail@example.com"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="booking-date">ვიზიტის თარიღი *</label>
                  <input
                    id="booking-date"
                    type="date"
                    required
                    className="form-control"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="booking-grade">კლასი / საფეხური</label>
                  <select
                    id="booking-grade"
                    className="form-control"
                    value={bookingForm.grade}
                    onChange={(e) => setBookingForm({ ...bookingForm, grade: e.target.value })}
                  >
                    <option value="">აირჩიეთ...</option>
                    <option value="დაწყებითი">დაწყებითი სკოლა</option>
                    <option value="საბაზო">საბაზო სკოლა</option>
                    <option value="საშუალო">საშუალო სკოლა</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={bookingStatus.loading} className="btn btn-primary w-full">
                {bookingStatus.loading ? 'იგზავნება...' : 'ჯავშნის გაგზავნა'}
              </button>

              {bookingStatus.message && (
                <div className={`form-feedback ${bookingStatus.success ? 'success' : 'error'}`}>
                  {bookingStatus.message}
                </div>
              )}
            </form>
          </div>

          {/* Online Application Form */}
          <div className="form-card-container">
            <h3 className="form-card-heading">ონლაინ განაცხადი</h3>
            <p className="form-card-subheading">დაიწყეთ რეგისტრაციის პროცესი ონლაინ განაცხადის შევსებით.</p>
            
            <form onSubmit={handleAppSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="app-student-name">მოსწავლის სახელი და გვარი *</label>
                  <input
                    id="app-student-name"
                    type="text"
                    required
                    className="form-control"
                    placeholder="მოსწავლის სახელი..."
                    value={appForm.studentName}
                    onChange={(e) => setAppForm({ ...appForm, studentName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="app-parent-name">მშობლის სახელი და გვარი *</label>
                  <input
                    id="app-parent-name"
                    type="text"
                    required
                    className="form-control"
                    placeholder="მშობლის სახელი..."
                    value={appForm.parentName}
                    onChange={(e) => setAppForm({ ...appForm, parentName: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="app-phone">ტელეფონი *</label>
                  <input
                    id="app-phone"
                    type="tel"
                    required
                    className="form-control"
                    placeholder="მაგ: 599 12 34 56"
                    value={appForm.phone}
                    onChange={(e) => setAppForm({ ...appForm, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="app-email">ელ-ფოსტა</label>
                  <input
                    id="app-email"
                    type="email"
                    className="form-control"
                    placeholder="mail@example.com"
                    value={appForm.email}
                    onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="app-grade">კლასი, სადაც სურს სწავლა *</label>
                <select
                  id="app-grade"
                  required
                  className="form-control"
                  value={appForm.grade}
                  onChange={(e) => setAppForm({ ...appForm, grade: e.target.value })}
                >
                  <option value="">აირჩიეთ კლასი...</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i+1} value={`${i+1} კლასი`}>{`${i+1} კლასი`}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="app-info">დამატებითი ინფორმაცია / კითხვები</label>
                <textarea
                  id="app-info"
                  className="form-control"
                  placeholder="დაწერეთ სასურველი ინფორმაცია..."
                  value={appForm.additionalInfo}
                  onChange={(e) => setAppForm({ ...appForm, additionalInfo: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" disabled={appStatus.loading} className="btn btn-primary w-full">
                {appStatus.loading ? 'იგზავნება...' : 'განაცხადის გაგზავნა'}
              </button>

              {appStatus.message && (
                <div className={`form-feedback ${appStatus.success ? 'success' : 'error'}`}>
                  {appStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* 4. FAQ Section */}
        <div className="faq-section-wrapper">
          <h3 className="faq-main-title text-center">ხშირად დასმული კითხვები</h3>
          <div className="faq-accordion">
            {faqs.map((faq, idx) => (
              <div key={idx} className="faq-item">
                <button
                  className="faq-question-btn"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span className="faq-question">{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                <div className={`faq-answer-container ${openFaq === idx ? 'open' : ''}`}>
                  <p className="faq-answer">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
