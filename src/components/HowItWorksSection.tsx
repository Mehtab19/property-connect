/**
 * How It Works Section Component
 * Shows the 3-step process: Ask → Analyze → Connect
 */

import { MessageSquare, BarChart3, Handshake, ArrowRight } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      icon: MessageSquare,
      title: 'Ask',
      description: 'Tell PropertyX what you are looking for - budget, location, goals. Chat naturally or answer quick questions.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      number: 2,
      icon: BarChart3,
      title: 'Analyze',
      description: 'Get instant AI analysis: investment scores, risk levels, affordability estimates, and comparable properties.',
      color: 'from-green-500 to-green-600',
    },
    {
      number: 3,
      icon: Handshake,
      title: 'Connect',
      description: 'Ready to move forward? PropertyX connects you with verified agents, developers, or mortgage partners.',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4">
            How PropertyX Works
          </h2>
          <p className="text-lg text-muted-foreground">
            From question to action in three simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-border -translate-y-1/2 z-0" />
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Arrow between steps (Mobile/Tablet) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex lg:hidden absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                    <ArrowRight className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
                
                <div className="bg-card rounded-2xl p-8 shadow-card hover:shadow-elegant transition-all duration-300 text-center border border-border h-full">
                  {/* Step Number & Icon */}
                  <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* Step Label */}
                  <div className="inline-flex items-center gap-2 bg-muted px-3 py-1 rounded-full mb-4">
                    <span className="text-sm font-bold text-primary">Step {step.number}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-4">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;