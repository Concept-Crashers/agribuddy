import React, { useState } from 'react';
import { Leaf, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-foreground">AgriBuddy</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex gap-4">
            <button
              onClick={handleSignIn}
              className="px-6 py-2 text-primary font-semibold hover:bg-muted rounded-lg transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={handleSignUp}
              className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition-colors"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            <nav className="flex flex-col gap-4 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-foreground hover:text-primary transition-colors font-medium px-4"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-2 px-4 pt-2">
                <button
                  onClick={handleSignIn}
                  className="flex-1 px-4 py-2 text-primary font-semibold hover:bg-muted rounded-lg transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={handleSignUp}
                  className="flex-1 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition-colors"
                >
                  Get Started
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
