import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-primary via-secondary to-primary rounded-3xl p-12 sm:p-16 text-white text-center relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Transform Your Farm?
            </h2>

            <p className="text-lg sm:text-xl mb-8 opacity-95 max-w-2xl mx-auto">
              Join thousands of farmers who are already growing smarter, earning better, and building sustainable futures with AgriBuddy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/signup')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-lg hover:bg-muted transition-colors shadow-lg"
              >
                Start Your Free Trial
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
              >
                Already have an account?
              </button>
            </div>

            {/* Benefits List */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div>
                <p className="font-bold text-lg mb-2">✓ No Credit Card</p>
                <p className="text-sm opacity-90">Start free with full access</p>
              </div>
              <div>
                <p className="font-bold text-lg mb-2">✓ 24/7 Support</p>
                <p className="text-sm opacity-90">Expert help when you need it</p>
              </div>
              <div>
                <p className="font-bold text-lg mb-2">✓ USSD + Web</p>
                <p className="text-sm opacity-90">Access however you want</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
