/**
 * Dubai Location Cards Component
 * Interactive location discovery cards with hover effects
 */

import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';

interface LocationCard {
  name: string;
  tagline: string;
  image: string;
  areaSlug: string;
}

const dubaiLocations: LocationCard[] = [
  {
    name: 'Downtown Dubai',
    tagline: 'Iconic living near Burj Khalifa & Dubai Mall',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    areaSlug: 'Downtown Dubai',
  },
  {
    name: 'Dubai Marina',
    tagline: 'Waterfront luxury with stunning skyline views',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
    areaSlug: 'Dubai Marina',
  },
  {
    name: 'Palm Jumeirah',
    tagline: 'Exclusive island living on the eighth wonder',
    image: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&w=800&q=80',
    areaSlug: 'Palm Jumeirah',
  },
  {
    name: 'Business Bay',
    tagline: 'Modern urban living in Dubai\'s business hub',
    image: 'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=800&q=80',
    areaSlug: 'Business Bay',
  },
  {
    name: 'Jumeirah Village Circle',
    tagline: 'Family-friendly community with vibrant lifestyle',
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80',
    areaSlug: 'JVC',
  },
  {
    name: 'Dubai Hills Estate',
    tagline: 'Premium golf course living in a green oasis',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    areaSlug: 'Dubai Hills',
  },
  {
    name: 'Arabian Ranches',
    tagline: 'Serene villa community with desert charm',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    areaSlug: 'Arabian Ranches',
  },
  {
    name: 'Jumeirah Beach Residence',
    tagline: 'Beachfront living with The Walk at your doorstep',
    image: 'https://images.unsplash.com/photo-1559599746-8823b38544c6?auto=format&fit=crop&w=800&q=80',
    areaSlug: 'JBR',
  },
];

const DubaiLocationCards = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleLocationClick = (areaSlug: string) => {
    navigate(`/properties?location=${encodeURIComponent(areaSlug)}`);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="section-title">
          <h2>Explore Dubai's Premier Locations</h2>
          <p>Discover exclusive properties in Dubai's most sought-after neighborhoods</p>
        </div>

        {/* Location Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dubaiLocations.map((location, index) => (
            <button
              key={location.areaSlug}
              onClick={() => handleLocationClick(location.areaSlug)}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              style={{ animationDelay: `${index * 0.1}s` }}
              aria-label={`View properties in ${location.name}`}
            >
              {/* Background Image with Lazy Loading */}
              <div 
                className={`absolute inset-0 bg-cover bg-center transition-transform duration-500 ${
                  prefersReducedMotion ? '' : 'group-hover:scale-110'
                }`}
                style={{ backgroundImage: `url(${location.image})` }}
              />
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent transition-opacity duration-300 ${
                prefersReducedMotion ? '' : 'opacity-70 group-hover:opacity-90'
              }`} />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                {/* Location Icon */}
                <div className={`inline-flex items-center gap-2 mb-2 transition-transform duration-300 ${
                  prefersReducedMotion ? '' : 'transform group-hover:-translate-y-2'
                }`}>
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-accent">Dubai, UAE</span>
                </div>

                {/* Title */}
                <h3 className={`text-xl font-bold mb-2 transition-transform duration-300 ${
                  prefersReducedMotion ? '' : 'transform group-hover:-translate-y-2'
                }`}>
                  {location.name}
                </h3>

                {/* Tagline - Shows on hover */}
                <p className={`text-sm text-white/80 transition-all duration-300 ${
                  prefersReducedMotion 
                    ? 'opacity-100' 
                    : 'opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0'
                }`}>
                  {location.tagline}
                </p>

                {/* CTA Arrow - Shows on hover */}
                <div className={`flex items-center gap-2 mt-3 text-accent font-semibold text-sm transition-all duration-300 ${
                  prefersReducedMotion 
                    ? 'opacity-100' 
                    : 'opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0'
                }`}>
                  <span>View Properties</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DubaiLocationCards;
