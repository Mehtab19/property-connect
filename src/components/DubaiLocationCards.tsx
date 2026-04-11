/**
 * UAE State Strip Cards Component
 * Vertical strip cards for UAE states with hover effects
 */

import { useNavigate } from 'react-router-dom';

interface StateCard {
  name: string;
  slug: string;
  image: string;
  propertyCount: number;
}

const uaeStates: StateCard[] = [
  {
    name: 'Dubai',
    slug: 'dubai',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    propertyCount: 8,
  },
  {
    name: 'Abu Dhabi',
    slug: 'abu-dhabi',
    image: 'https://images.unsplash.com/photo-1611605645802-c21be743c321?auto=format&fit=crop&w=800&q=80',
    propertyCount: 6,
  },
  {
    name: 'Sharjah',
    slug: 'sharjah',
    image: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=800&q=80',
    propertyCount: 5,
  },
  {
    name: 'Ajman',
    slug: 'ajman',
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80',
    propertyCount: 5,
  },
  {
    name: 'Ras Al Khaimah',
    slug: 'ras-al-khaimah',
    image: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=800&q=80',
    propertyCount: 5,
  },
  {
    name: 'Fujairah',
    slug: 'fujairah',
    image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80',
    propertyCount: 5,
  },
  {
    name: 'Umm Al Quwain',
    slug: 'umm-al-quwain',
    image: 'https://images.unsplash.com/photo-1559599746-8823b38544c6?auto=format&fit=crop&w=800&q=80',
    propertyCount: 5,
  },
];

const DubaiLocationCards = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Explore the UAE</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover premium properties across all seven emirates
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="container mx-auto px-4 pb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-5">
        {uaeStates.map((state) => (
          <button
            key={state.slug}
            onClick={() => navigate(`/state/${state.slug}`)}
            className="group relative rounded-2xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-500 hover:shadow-2xl hover:scale-[1.03] h-[420px]"
            aria-label={`View properties in ${state.name}`}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
              style={{ backgroundImage: `url(${state.image})` }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500" />

            {/* State Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 transition-transform duration-500 group-hover:-translate-y-2">
              <h3 className="text-2xl font-bold text-white tracking-wide mb-1">
                {state.name}
              </h3>
              <p className="text-white/70 text-sm">
                {state.propertyCount} Properties
              </p>
            </div>
          </button>
        ))}
      </div>
      </div>
    </section>
  );
};

export default DubaiLocationCards;
