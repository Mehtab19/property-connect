/**
 * Hero Section Component
 * Main hero banner for the homepage
 */

import { Building, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const stats = [
    { value: '$2.5B+', label: 'Property Value' },
    { value: '200+', label: 'Verified Partners' },
    { value: '4,200+', label: 'Successful Connections' },
    { value: '98%', label: 'Client Satisfaction' },
  ];

  return (
    <section 
      id="home" 
      className="relative min-h-[90vh] flex items-center justify-center text-white overflow-hidden"
      style={{
        background: `linear-gradient(135deg, rgba(26, 54, 93, 0.92) 0%, rgba(15, 118, 110, 0.88) 100%), 
                     url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1973&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Decorative Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}
      />

      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight animate-slide-up">
          Connecting You to Premium Properties
        </h2>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 opacity-90 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          PrimeX Estates carefully selects property partners through rigorous due diligence, 
          connecting you directly with project developers and builders for your dream property. 
          Powered by PropertyX Intelligence AI engine.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <a href="#properties" className="btn-secondary">
            <Building className="w-5 h-5" />
            Explore Properties
          </a>
          <a href="#ai-advisory" className="btn-accent">
            <Bot className="w-5 h-5" />
            Try AI Advisor
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold mb-2">{stat.value}</div>
              <div className="text-sm md:text-base opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
