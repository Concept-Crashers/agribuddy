import React from 'react';
import { ArrowRight, Leaf, Zap, TrendingUp, MessageSquare, Cloud, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LandingHeader from './components/LandingHeader';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorks from './components/HowItWorks';
import StatsSection from './components/StatsSection';
import TestimonialsSection from './components/TestimonialsSection';
import CTASection from './components/CTASection';
import LandingFooter from './components/LandingFooter';

export default function LandingPage() {
  return (
    <div id="home" className="bg-background min-h-screen">
      <LandingHeader />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
