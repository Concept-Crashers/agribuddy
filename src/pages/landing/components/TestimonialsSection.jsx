import React from 'react';
import { Star } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'James Kipchoge',
      location: 'Kitgum, Uganda',
      role: 'Maize & Bean Farmer',
      image: 'https://images.pexels.com/photos/28100859/pexels-photo-28100859.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      content:
        'AgriBuddy\'s disease detection feature saved my entire maize crop this season. The AI identified early blight before I even noticed symptoms!',
      rating: 5,
    },
    {
      name: 'Sarah Wanjiru',
      location: 'Western Uganda',
      role: 'Vegetable Producer',
      image: 'https://images.pexels.com/photos/33691595/pexels-photo-33691595.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      content:
        'The weather forecasts are incredibly accurate. I now plan my irrigation perfectly, saving water and money. Plus the community tips are gold!',
      rating: 5,
    },
    {
      name: 'Peter Ochieng',
      location: 'Masindi, Uganda',
      role: 'Rice Farmer',
      image: 'https://images.pexels.com/photos/19025090/pexels-photo-19025090.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      content:
        'Access via USSD is a game-changer for us. I don\'t always have internet, but I can still get critical farm updates on my basic phone.',
      rating: 5,
    },
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Loved by Farmers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how AgriBuddy is transforming farms across East Africa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 border border-border hover:border-primary hover:shadow-xl transition-all"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-accent text-accent" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border border-border"
                  loading="lazy"
                />
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
