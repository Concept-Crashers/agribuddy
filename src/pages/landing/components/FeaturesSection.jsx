import React from 'react';
import { Cloud, Brain, TrendingUp, MessageSquare, Smartphone, AlertCircle } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Cloud,
      title: 'Real-Time Weather',
      description: 'Get hyperlocal weather forecasts and irrigation recommendations tailored to your farm location.',
      color: 'from-primary/20 to-primary/10',
    },
    {
      icon: Brain,
      title: 'AI Plant Diagnosis',
      description: 'Identify crop diseases instantly with our AI-powered plant diagnosis using just a photo.',
      color: 'from-accent/20 to-accent/10',
    },
    {
      icon: TrendingUp,
      title: 'Crop Management',
      description: 'Track crop performance, plan planting schedules, and optimize yields with smart analytics.',
      color: 'from-success/20 to-success/10',
    },
    {
      icon: MessageSquare,
      title: 'Community Forum',
      description: 'Connect with thousands of farmers, share tips, and learn from agricultural experts.',
      color: 'from-primary/20 to-primary/10',
    },
    {
      icon: Smartphone,
      title: 'USSD Access',
      description: 'Use AgriBuddy via USSD on basic phones without internet—farming at your fingertips.',
      color: 'from-secondary/20 to-secondary/10',
    },
    {
      icon: AlertCircle,
      title: 'Smart Alerts',
      description: 'Receive timely alerts for weather changes, disease outbreaks, and market price movements.',
      color: 'from-warning/20 to-warning/10',
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Powerful Features for Modern Farming
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to optimize your farm's performance, from soil to harvest.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 border border-border hover:border-primary hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="text-primary" size={28} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
