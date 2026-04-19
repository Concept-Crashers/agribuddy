import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Create Your Account',
      description: 'Sign up in seconds and set up your farm profile with location and crop preferences.',
    },
    {
      number: '02',
      title: 'Get Real-Time Insights',
      description: 'Receive personalized weather forecasts, disease alerts, and market price updates daily.',
    },
    {
      number: '03',
      title: 'Diagnose & Optimize',
      description: 'Use AI to identify crop issues, get treatment recommendations, and improve yields.',
    },
    {
      number: '04',
      title: 'Connect & Learn',
      description: 'Join our community, share experiences, and access expert agricultural guidance.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How AgriBuddy Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes and transform your farming journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 left-full w-8 h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
              )}

              <div className="bg-white rounded-2xl p-8 border border-border hover:border-primary transition-colors h-full">
                {/* Number Badge */}
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-4">
                  {step.number}
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground mb-4">{step.description}</p>

                {/* Check Icon */}
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <CheckCircle size={20} />
                  <span>Easy & Intuitive</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
