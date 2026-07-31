import React, { useState, useEffect } from 'react';
import { Menu, X, GraduationCap } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { path, navigate, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'პროგრამები', href: '#programs' },
    { label: 'მასწავლებლები', href: '#teachers' },
    { label: 'სკოლის ცხოვრება', href: '#school-life' },
    { label: 'მიღება', href: '#admissions' },
    { label: 'კონტაქტი', href: '#contact' }
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);

    if (path === '/register') {
      navigate('/');
      setTimeout(() => {
        if (href === '#') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        const element = document.querySelector(href);
        if (element) {
          scrollToElement(element);
        }
      }, 150);
    } else {
      if (href === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const element = document.querySelector(href);
      if (element) {
        scrollToElement(element);
      }
    }
  };

  const scrollToElement = (element) => {
    const offset = 80; // height of sticky header
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">
        {/* Logo */}
        <a href="#" className="logo" onClick={(e) => handleNavClick(e, '#')}>
          <GraduationCap className="logo-icon" />
          <span className="logo-text">სოლომონ <span className="logo-sub">აკადემია</span></span>
        </a>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-link"
              onClick={(e) => handleNavClick(e, item.href)}
            >
              {item.label}
            </a>
          ))}

          {user ? (
            <div className="auth-profile-nav">
              <span className="user-welcome">სალამი, {user.name.split(' ')[0]}</span>
              <button onClick={logout} className="btn-logout-link">გამოსვლა</button>
            </div>
          ) : (
            <button onClick={() => navigate('/register')} className="nav-link btn-login-link">შესვლა</button>
          )}

          <a
            href="#booking-section"
            className="btn btn-primary btn-sm"
            onClick={(e) => handleNavClick(e, '#booking-section')}
          >
            ვიზიტის დაჯავშნა
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${isOpen ? 'active' : ''}`}>
        <nav className="mobile-nav">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="mobile-nav-link"
              onClick={(e) => handleNavClick(e, item.href)}
            >
              {item.label}
            </a>
          ))}

          {user ? (
            <div className="mobile-auth-profile">
              <span className="mobile-user-welcome">სალამი, {user.name}</span>
              <button onClick={() => { setIsOpen(false); logout(); }} className="mobile-logout-btn">გამოსვლა</button>
            </div>
          ) : (
            <button onClick={() => { setIsOpen(false); navigate('/register'); }} className="mobile-login-btn">რეგისტრაცია</button>
          )}

          <a
            href="#booking-section"
            className="btn btn-primary mobile-cta"
            onClick={(e) => handleNavClick(e, '#booking-section')}
          >
            ვიზიტის დაჯავშნა
          </a>
        </nav>
      </div>
    </header>
  );
}
