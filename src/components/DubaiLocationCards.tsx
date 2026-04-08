/**
 * UAE State Strip Cards Component
 * Vertical strip cards for UAE states with hover effects
 */

import { useNavigate } from 'react-router-dom';

interface StateCard {
  name: string;
  slug: string;
  image: string;
}

const uaeStates: StateCard[] = [
  {
    name: 'Dubai',
    slug: 'dubai',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Abu Dhabi',
    slug: 'abu-dhabi',
    image: 'https://images.unsplash.com/photo-1611605645802-c21be743c321?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Sharjah',
    slug: 'sharjah',
    image: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Ajman',
    slug: 'ajman',
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Ras Al Khaimah',
    slug: 'ras-al-khaimah',
    image: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Fujairah',
    slug: 'fujairah',
    image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Umm Al Quwain',
    slug: 'umm-al-quwain',
    image: 'https://images.unsplash.com/photo-1559599746-8823b38544c6?auto=format&fit=crop&w=800&q=80',
  },
];

const DubaiLocationCards = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="section-title">
          <h2>Explore the UAE</h2>
          <p>Discover premium properties across all seven emirates</p>
        </div>

        {/* Strip Cards Container */}
        <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {uaeStates.map((state) => (
            <button
              key={state.slug}
              onClick={() => navigate(`/properties?location=${encodeURIComponent(state.name)}`)}
              className="group relative flex-shrink-0 w-[200px] sm:w-[220px] lg:w-0 lg:flex-1 h-[500px] rounded-2xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 snap-start transition-all duration-500"
              aria-label={`View properties in ${state.name}`}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                style={{ backgroundImage: `url(${state.image})` }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black/80" />

              {/* State Name */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white tracking-wide transition-transform duration-500 group-hover:-translate-y-2">
                  {state.name}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default DubaiLocationCards;
