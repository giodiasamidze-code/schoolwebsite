import React, { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SpacesHub from './components/SpacesHub';
import TeamSection from './components/TeamSection';
import NewsSection from './components/NewsSection';
import AdmissionsSection from './components/AdmissionsSection';
import GalleryPage from './components/GalleryPage';
import Footer from './components/Footer';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginPage from './components/AdminLoginPage';
import ParentAccountPage from './components/ParentAccountPage';
import CustomCursor from './components/CustomCursor';
import SmoothScroll from './components/SmoothScroll';
import DynamicBackground from './components/DynamicBackground';
import { useAuth } from './components/AuthContext';

export default function App() {
  const { path } = useAuth();

  // Mouse Spotlight Effect on cards
  useEffect(() => {
    const handleMouseMove = (e) => {
      const cards = document.querySelectorAll('.spotlight-card');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Standalone portals & full page views
  if (path === '/admin') {
    return (
      <>
        <CustomCursor />
        <AdminLoginPage />
      </>
    );
  }

  if (path === '/admin-dashboard') {
    return (
      <>
        <CustomCursor />
        <AdminDashboard />
      </>
    );
  }

  if (path === '/teacher-dashboard') {
    return (
      <>
        <CustomCursor />
        <TeacherDashboard />
      </>
    );
  }

  if (path === '/gallery') {
    return (
      <>
        <CustomCursor />
        <Header />
        <GalleryPage />
      </>
    );
  }

  if (path === '/parent-account') {
    return (
      <>
        <CustomCursor />
        <Header />
        <ParentAccountPage />
        <Footer />
      </>
    );
  }

  return (
    <div className="app-wrapper" style={{ position: 'relative', minHeight: '100vh', background: 'transparent' }}>
      {/* Fixed palace-interior background — shown clearly behind all sections */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          backgroundImage: `linear-gradient(rgba(10,5,6,0.08), rgba(10,5,6,0.08)), url(/assets/palace-interior.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <DynamicBackground />
      <SmoothScroll />
      <CustomCursor />
      <Header />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <SpacesHub />
        <TeamSection />
        <NewsSection />
        <AdmissionsSection />
      </main>
      <Footer />
    </div>
  );
}
