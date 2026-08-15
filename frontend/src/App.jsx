import React, { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import StatsBar from './components/StatsBar';
import TeamSection from './components/TeamSection';
import NewsSection from './components/NewsSection';
import AdmissionsSection from './components/AdmissionsSection';
import Footer from './components/Footer';
import RegistrationPage from './components/RegistrationPage';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginPage from './components/AdminLoginPage';
import ParentAccountPage from './components/ParentAccountPage';
import CustomCursor from './components/CustomCursor';
import FloatingDock from './components/FloatingDock';
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
    <div className="app-wrapper">
      <CustomCursor />
      <Header />
      {path === '/register' ? (
        <RegistrationPage />
      ) : path === '/parent-account' ? (
        <ParentAccountPage />
      ) : (
        <main>
          <Hero />
          <StatsBar />
          <TeamSection />
          <NewsSection />
          <AdmissionsSection />
        </main>
      )}
      <Footer />
      <FloatingDock />
    </div>
  );
}
