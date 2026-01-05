/**
 * Who Is It For Section Component
 * Shows the four target audience cards
 */

import { Home, TrendingUp, Building2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const WhoIsItForSection = () => {
  const audiences = [
    {
      icon: Home,
      title: 'Buyer',
      description: 'Find your dream home with AI-powered insights on affordability, neighborhood trends, and hidden costs.',
      color: 'bg-blue-500',
    },
    {
      icon: TrendingUp,
      title: 'Investor',
      description: 'Maximize returns with data-driven ROI analysis, rental yield forecasts, and risk assessments.',
      color: 'bg-green-500',
    },
    {
      icon: Building2,
      title: 'Developer / Owner',
      description: 'List your properties, reach verified buyers, and manage leads with intelligent matching.',
      color: 'bg-purple-500',
    },
    {
      icon: Users,
      title: 'Broker / Agency',
      description: 'Grow your business with qualified leads, market analytics, and streamlined client management.',
      color: 'bg-orange-500',
    },
  ];

  return (
    <section id="who-is-it-for" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4">
            Who is PropertyX for?
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you're buying your first home or building a portfolio, PropertyX adapts to your goals.
          </p>
        </div>

        {/* Audience Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((audience, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border border-border"
            >
              <div className={`w-14 h-14 ${audience.color} rounded-xl flex items-center justify-center mb-5`}>
                <audience.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{audience.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {audience.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/onboarding" className="btn-primary">
            Get Started — It's Free
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhoIsItForSection;