/**
 * Solutions Section Component
 * Tabbed solutions for Buyers, Investors, and Developers
 */

import { useState } from 'react';
import { Check, X } from 'lucide-react';

const SolutionsSection = () => {
  const [activeTab, setActiveTab] = useState('investors');

  const tabs = [
    { id: 'buyers', label: 'For Buyers' },
    { id: 'investors', label: 'For Investors' },
    { id: 'developers', label: 'For Developers' },
  ];

  const solutions = {
    buyers: {
      title: 'Home Buying Made Simple & Secure',
      description: "Whether you're a first-time homebuyer or looking for your dream property, PrimeX Estates provides the guidance, data, and connections you need.",
      features: [
        'Access to pre-vetted properties with complete transparency',
        'AI-powered property valuation and market analysis',
        'Guidance through the entire home buying process',
        'Connection to trusted developers and legal professionals',
        'Property comparison tools and neighborhood insights',
      ],
      cta: 'Find Your Home',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1170&q=80',
    },
    investors: {
      title: 'Data-Driven Investment Advisory',
      description: 'PrimeX Estates empowers investors with comprehensive data, AI-driven analytics, and verified property opportunities to make informed decisions.',
      features: [
        'Access to verified projects with complete due-diligence documentation',
        'AI-powered ROI projections and risk assessment',
        'Personalized property recommendations based on your preferences',
        'Secure digital document management and e-signatures',
        'Direct communication with trusted developers',
      ],
      cta: 'Start Investing',
      image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=1073&q=80',
    },
    developers: {
      title: 'Partner With PrimeX Estates',
      description: 'Showcase your projects to a network of qualified investors and benefit from our rigorous due-diligence process and AI-powered analytics.',
      features: [
        'Access to a network of verified, serious investors',
        'Professional due-diligence review and certification',
        'AI-powered analytics for your projects',
        'Transparent communication with potential investors',
        'Enhanced credibility through PrimeX verification',
      ],
      cta: 'Submit Your Project',
      image: 'https://images.unsplash.com/photo-1541976590-713941681591?auto=format&fit=crop&w=1074&q=80',
    },
  };

  const whatWeDo = [
    'Provide data-driven property insights and analytics',
    'Connect buyers with verified developers and projects',
    'Offer educational resources for informed decision-making',
    'Facilitate transparent communication between parties',
    'Provide due-diligence reports and risk assessments',
    'Offer AI-powered property valuation and ROI projections',
  ];

  const whatWeDont = [
    'Act as traditional real estate brokers',
    'Directly sell properties or receive sales commissions',
    'Provide legal or financial advice (we connect you with experts)',
    'Pressure buyers into quick decisions',
    'List unverified or high-risk properties',
    'Charge hidden fees or unexpected costs',
  ];

  const currentSolution = solutions[activeTab as keyof typeof solutions];

  return (
    <section id="solutions" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="section-title">
          <h2>Our Solutions</h2>
          <p>
            Tailored approaches for investors, buyers, and developers to navigate the real estate market with confidence.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center border-b border-border mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-4 font-semibold text-lg transition-colors relative ${
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent" />
              )}
            </button>
          ))}
        </div>

        {/* Solution Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-6">{currentSolution.title}</h3>
            <p className="text-muted-foreground text-lg mb-6">{currentSolution.description}</p>
            
            <ul className="space-y-3 mb-8">
              {currentSolution.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <a href="#" className="btn-primary">{currentSolution.cta}</a>
          </div>

          <div className="rounded-xl overflow-hidden shadow-elegant">
            <img
              src={currentSolution.image}
              alt={currentSolution.title}
              className="w-full h-80 object-cover"
            />
          </div>
        </div>

        {/* What We Do / Don't Section (for Buyers tab) */}
        {activeTab === 'buyers' && (
          <div className="bg-white rounded-2xl p-10 shadow-card">
            <div className="grid md:grid-cols-2 gap-12">
              {/* What We Do */}
              <div className="p-8 bg-green-50 rounded-xl border-l-4 border-l-green-500">
                <div className="flex items-center gap-3 mb-6">
                  <Check className="w-8 h-8 text-green-500" />
                  <h4 className="text-xl font-bold text-foreground">What We Do</h4>
                </div>
                <ul className="space-y-4">
                  {whatWeDo.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What We Don't */}
              <div className="p-8 bg-red-50 rounded-xl border-l-4 border-l-red-500">
                <div className="flex items-center gap-3 mb-6">
                  <X className="w-8 h-8 text-red-500" />
                  <h4 className="text-xl font-bold text-foreground">What We Don't Do</h4>
                </div>
                <ul className="space-y-4">
                  {whatWeDont.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <X className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SolutionsSection;
