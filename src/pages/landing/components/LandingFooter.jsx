import React from 'react';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

export default function LandingFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'FAQ', href: '#faq' },
    ],
    Company: [
      { label: 'About Us', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Disclaimer', href: '/disclaimer' },
    ],
    Connect: [
      { label: 'Twitter', href: 'https://twitter.com' },
      { label: 'Facebook', href: 'https://facebook.com' },
      { label: 'LinkedIn', href: 'https://linkedin.com' },
      { label: 'Instagram', href: 'https://instagram.com' },
    ],
  };

  return (
    <footer id="contact" className="bg-secondary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Content */}
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold">AgriBuddy</span>
            </div>
            <p className="text-sm opacity-80 mb-4">
              Empowering farmers with AI-driven insights and community wisdom.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 opacity-80">
                <MapPin size={16} />
                <span>Uganda, East Africa</span>
              </div>
              <div className="flex items-center gap-2 opacity-80">
                <Mail size={16} />
                <span>hello@agribuddy.com</span>
              </div>
              <div className="flex items-center gap-2 opacity-80">
                <Phone size={16} />
                <span>+256 XXX XXX XXX</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-bold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 my-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-80">
          <p>&copy; {currentYear} AgriBuddy. All rights reserved.</p>
          <p>Transforming Agriculture Through Technology</p>
        </div>
      </div>
    </footer>
  );
}
