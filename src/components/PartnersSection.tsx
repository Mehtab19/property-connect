/**
 * Partners Section Component
 * Shows partner developers and builders
 */

const PartnersSection = () => {
  const partners = [
    {
      name: 'Elite Developers',
      description: 'Specializing in luxury residential properties with over 20 years of industry experience.',
      logo: 'ED',
    },
    {
      name: 'Urban Builders Co',
      description: 'Leading commercial real estate developer with award-winning sustainable projects.',
      logo: 'UB',
    },
    {
      name: 'Prime Properties',
      description: 'Trusted name in residential developments across major metropolitan areas.',
      logo: 'PP',
    },
    {
      name: 'Skyline Group',
      description: 'Innovative mixed-use development experts known for landmark buildings.',
      logo: 'SG',
    },
  ];

  return (
    <section id="partners" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="section-title">
          <h2>Our Partners</h2>
          <p>
            We work exclusively with developers and builders who have passed our comprehensive due diligence process
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-8 shadow-card text-center hover:-translate-y-2 transition-all duration-300 border border-border"
            >
              <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">{partner.logo}</span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">{partner.name}</h3>
              <p className="text-muted-foreground text-sm">{partner.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
