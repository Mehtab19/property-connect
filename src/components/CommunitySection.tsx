/**
 * Community Section Component
 * Global Investment Community section
 */

import { Users, MessageSquare, Handshake, GraduationCap } from 'lucide-react';

const CommunitySection = () => {
  const stats = [
    { value: '25K+', label: 'Active Investors' },
    { value: '$4.2B+', label: 'Total Transactions' },
    { value: '120+', label: 'Countries' },
    { value: '98%', label: 'Satisfaction Rate' },
  ];

  const features = [
    {
      icon: Users,
      title: 'Networking Events',
      description: 'Connect with industry leaders and fellow investors at exclusive virtual and in-person events.',
    },
    {
      icon: MessageSquare,
      title: 'Expert Discussions',
      description: 'Participate in forums and discussions with real estate experts and market analysts.',
    },
    {
      icon: Handshake,
      title: 'Deal Syndication',
      description: 'Collaborate with other investors on larger deals through our syndication platform.',
    },
    {
      icon: GraduationCap,
      title: 'Knowledge Sharing',
      description: 'Access shared insights, market research, and investment strategies from our community.',
    },
  ];

  return (
    <section id="community" className="py-20 gradient-primary text-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold mb-4 relative inline-block">
            Global Investment Community
            <span className="absolute w-20 h-1 bg-accent -bottom-4 left-1/2 -translate-x-1/2 rounded" />
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto text-lg mt-6">
            Join thousands of investors, developers, and real estate professionals in our exclusive network
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-12 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold mb-2">{stat.value}</div>
              <div className="text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-8 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-300 hover:-translate-y-2 hover:bg-white/15"
            >
              <feature.icon className="w-10 h-10 text-accent mx-auto mb-5" />
              <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
              <p className="text-white/80 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
