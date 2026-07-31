import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { User, Phone, Mail, Lock, ArrowLeft, Info } from 'lucide-react';

export default function RegistrationPage() {
  const auth = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isFromForm = !!auth.pendingFormSubmit;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !email || !password) return;

    // Simulate registration saving to context
    auth.register({ name, phone, email });

    // Navigate back to the home page; AdmissionsSection will capture the pending form and auto-submit
    if (auth.pendingFormSubmit) {
      auth.navigate('/');
      
      // Delay slightly to allow the DOM to mount before scrolling
      setTimeout(() => {
        const targetId = auth.pendingFormSubmit?.formType === 'booking' ? '#booking-section' : '#admissions';
        const element = document.querySelector(targetId);
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 150);
    } else {
      auth.navigate('/');
    }
  };

  return (
    <div className="registration-container fade-in">
      <div className="registration-card">
        <button className="back-link-btn" onClick={() => auth.navigate('/')}>
          <ArrowLeft size={16} className="icon-mr" />
          მთავარ გვერდზე დაბრუნება
        </button>

        <span className="section-eyebrow text-center w-full block">რეგისტრაცია</span>
        <h2 className="registration-title text-center">შექმენით მშობლის პროფილი</h2>

        {isFromForm && (
          <div className="auth-alert-message">
            <Info size={18} className="text-burgundy flex-shrink-0" />
            <p>განაცხადის გასაგზავნად საჭიროა რეგისტრაცია — შეავსეთ მოკლე ფორმა, რომ გავაგრძელოთ.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">სახელი და გვარი *</label>
            <div className="input-with-icon">
              <User size={16} className="input-icon" />
              <input
                id="reg-name"
                type="text"
                required
                className="form-control"
                placeholder="თქვენი სახელი და გვარი..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-phone">ტელეფონი *</label>
            <div className="input-with-icon">
              <Phone size={16} className="input-icon" />
              <input
                id="reg-phone"
                type="tel"
                required
                className="form-control"
                placeholder="მაგ: 599 12 34 56"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">ელ-ფოსტა *</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input
                id="reg-email"
                type="email"
                required
                className="form-control"
                placeholder="mail@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">პაროლი *</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                id="reg-password"
                type="password"
                required
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full mt-4">
            პროფილის შექმნა
          </button>
        </form>
      </div>
    </div>
  );
}
