import React from 'react';

export default function StatsSection() {
  const stats = [
    {
      value: '10,000+',
      label: 'Active Farmers',
      description: 'Growing across Uganda and beyond',
    },
    {
      value: '500K+',
      label: 'Crop Diagnoses',
      description: 'Successful plant disease detections',
    },
    {
      value: '35%',
      label: 'Yield Increase',
      description: 'Average improvement on first season',
    },
    {
      value: '98%',
      label: 'Satisfaction Rate',
      description: 'Farmers love using AgriBuddy',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-4xl sm:text-5xl font-bold text-primary mb-2">{stat.value}</p>
              <p className="text-lg font-semibold text-foreground mb-1">{stat.label}</p>
              <p className="text-muted-foreground text-sm">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
