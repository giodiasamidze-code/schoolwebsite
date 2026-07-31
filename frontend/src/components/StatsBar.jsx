import React from 'react';

export default function StatsBar() {
  const stats = [
    { number: '450+', label: 'აქტიური მოსწავლე' },
    { number: '15', label: 'წლიანი გამოცდილება' },
    { number: '4', label: 'საერთაშორისო აკრედიტაცია' },
    { number: '98%', label: 'უნივერსიტეტებში ჩარიცხვა' }
  ];

  return (
    <section className="stats-bar bg-charcoal">
      <div className="stats-container">
        {stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <span className="stat-number text-gold">{stat.number}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
