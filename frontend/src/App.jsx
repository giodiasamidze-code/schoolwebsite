import React from 'react';
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
import { useAuth } from './components/AuthContext';

export default function App() {
  const { path } = useAuth();

  // Admin routes — no Header/Footer
  if (path === '/admin') {
    return <AdminLoginPage />;
  }
  if (path === '/admin-dashboard') {
    return <AdminDashboard />;
  }

  return (
    <div className="app-wrapper">
      <Header />
      {path === '/register' ? (
        <RegistrationPage />
      ) : path === '/teacher-dashboard' ? (
        <TeacherDashboard />
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
    </div>
  );
}

