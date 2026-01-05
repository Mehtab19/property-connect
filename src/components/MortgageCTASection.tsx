/**
 * Mortgage CTA Section Component
 * Promotes the Mortgage & Leasing Hub with disclaimer
 */

import { Landmark, Calculator, FileCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MortgageCTASection = () => {
  const features = [
    {
      icon: Landmark,
      title: 'Partner Banks',
      description: 'Browse verified mortgage providers and leasing firms.',
    },
    {
      icon: Calculator,
      title: 'Affordability Calculator',
      description: 'Estimate monthly payments based on income and down payment.',
    },
    {
      icon: FileCheck,
      title: 'Pre-Approval',
      description: 'Request pre-approval directly from your chosen partner.',
    },
  ];

  return (
    <section id="mortgage-cta" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                Mortgage & Leasing Hub
              </h2>
              <p className="text-lg text-white/90">
                Explore financing options, calculate affordability, and connect with trusted partners—all in one place.
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                >
                  <feature.icon className="w-10 h-10 text-accent mb-4" />
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-white/80 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Link
                to="/mortgage"
                className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-lg hover:bg-white/90 transition-colors shadow-lg"
              >
                Explore Mortgage Hub
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Disclaimer */}
            <div className="mt-10 flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-2xl mx-auto">
              <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-sm text-white/80">
                <strong className="text-white">Disclaimer:</strong> All calculations and estimates provided are for informational purposes only. 
                Actual rates, terms, and eligibility depend on the financial provider. Please consult licensed professionals for financial advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MortgageCTASection;