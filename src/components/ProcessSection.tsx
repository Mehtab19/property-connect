/**
 * Process Section Component
 * Shows the step-by-step process
 */

const ProcessSection = () => {
  const steps = [
    {
      number: 1,
      title: 'Property Identification',
      description: 'We identify promising properties from our network of developers and builders.',
    },
    {
      number: 2,
      title: 'Due Diligence',
      description: 'Each property and developer undergoes our rigorous vetting process.',
    },
    {
      number: 3,
      title: 'Client Matching',
      description: 'We match qualified clients with properties that meet their specific requirements.',
    },
    {
      number: 4,
      title: 'Direct Introduction',
      description: 'We facilitate direct meetings between clients and developers.',
    },
  ];

  return (
    <section id="process" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="section-title">
          <h2>Our Process</h2>
          <p>
            Simple, transparent steps to connect you with the right property partners
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
