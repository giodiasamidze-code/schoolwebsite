import React from 'react';

export default function Hero() {
  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const element = document.querySelector(id);
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
  };

  return (
    <section className="hero-section" id="hero">
      <div className="hero-overlay"></div>
      <div className="hero-background-container">
        <img 
          src="/images/school_hero.png" 
          alt="Solomon Academy Building Facade" 
          className="hero-background-image"
        />
      </div>
      <div className="hero-content container">
        <span className="hero-eyebrow">კლასიკური განათლება & მომავალი</span>
        <h1 className="hero-title">სოლომონ აკადემია</h1>
        <p className="hero-tagline">
          ჩვენ ვქმნით პირობებს ინტელექტუალური, შემოქმედებითი და პიროვნული განვითარებისთვის, სადაც თითოეული მოსწავლე ლიდერად ყალიბდება.
        </p>
        <div className="hero-actions">
          <a 
            href="#booking-section" 
            className="btn btn-primary"
            onClick={(e) => handleScrollTo(e, '#booking-section')}
          >
            ვიზიტის დაჯავშნა
          </a>
          <a 
            href="#programs" 
            className="btn btn-gold-outline"
            onClick={(e) => handleScrollTo(e, '#programs')}
          >
            საკლასო პროგრამები
          </a>
        </div>
      </div>
    </section>
  );
}
