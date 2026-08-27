import React, { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
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

  // Standalone portals — dedicated executive header/navigation
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

  return (
    <div className="app-wrapper" style={{ position: 'relative', minHeight: '100vh' }}>
      <DynamicBackground />
      <SmoothScroll />
      <CustomCursor />
      {path === '/parent-account' ? (
        <ParentAccountPage />
      ) : (
        <main style={{ position: 'relative', zIndex: 1 }}>
          {path === '/gallery' ? (
            <GalleryPage />
          ) : (
            <>
              <Hero />
              <div className="page-overlap-content" style={{ position: 'relative', zIndex: 2, background: '#0c0608', boxShadow: '0 -25px 60px rgba(0, 0, 0, 0.9)', borderTop: '1px solid rgba(212, 175, 55, 0.25)' }}>
                <TeamSection />
                <NewsSection />
                <AdmissionsSection />
                <Footer />
              </div>
            </>
          )}
        </main>
      )}
      {path === '/parent-account' || path === '/gallery' ? <Footer /> : null}
    </div>
  );
}
