import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import StatsBar from './components/StatsBar';
import ProgramsSection from './components/ProgramsSection';
import TeamSection from './components/TeamSection';
import ActivitiesFeed from './components/ActivitiesFeed';
import AdmissionsSection from './components/AdmissionsSection';
import Footer from './components/Footer';
import RegistrationPage from './components/RegistrationPage';
import { useAuth } from './components/AuthContext';

export default function App() {
  const { path } = useAuth();

  return (
    <div className="app-wrapper">
      <Header />
      {path === '/register' ? (
        <RegistrationPage />
      ) : (
        <main>
          <Hero />
          <StatsBar />
          <ProgramsSection />
          <TeamSection />
          <ActivitiesFeed />
          <AdmissionsSection />
        </main>
      )}
      <Footer />
    </div>
  );
}
