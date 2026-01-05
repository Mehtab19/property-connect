/**
 * PropertyX Intelligence Section Component
 * AI-powered analytics features
 */

import { TrendingUp, AlertTriangle, UserCheck, MapPin } from 'lucide-react';

const IntelligenceSection = () => {
  const features = [
    {
      icon: TrendingUp,
      title: 'ROI Projections',
      description: 'Advanced algorithms predict potential returns based on historical data and market trends.',
    },
    {
      icon: AlertTriangle,
      title: 'Risk Assessment',
      description: 'Comprehensive risk analysis covering legal, financial, and market factors.',
    },
    {
      icon: UserCheck,
      title: 'Builder Credibility',
      description: 'Evaluate developer track records and financial stability for secure investments.',
    },
    {
      icon: MapPin,
      title: 'Location Analytics',
      description: 'Detailed neighborhood analysis including infrastructure, amenities, and growth potential.',
    },
  ];

  return (
    <section id="intelligence" className="py-20 gradient-primary text-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold mb-4 relative inline-block">
            PropertyX Intelligence
            <span className="absolute w-20 h-1 bg-accent -bottom-4 left-1/2 -translate-x-1/2 rounded" />
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto text-lg mt-6">
            Our AI-powered engine analyzes market data, builder performance, and risk factors to provide unparalleled investment insights.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-8 bg-white/10 rounded-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2"
            >
              <feature.icon className="w-12 h-12 text-accent mx-auto mb-5" />
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-white/80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntelligenceSection;
