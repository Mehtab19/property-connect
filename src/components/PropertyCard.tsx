/**
 * Property Card Component
 * Displays a single property in the grid view
 */

import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Property } from '@/data/propertyData';
import FavoriteButton from '@/components/FavoriteButton';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  // Get badge class based on property type
  const getBadgeClass = (type: string) => {
    switch (type) {
      case 'residential':
        return 'residential-badge';
      case 'commercial':
        return 'commercial-badge';
      case 'luxury':
        return 'luxury-badge';
      case 'construction':
        return 'construction-badge';
      default:
        return 'residential-badge';
    }
  };

  // Format type label
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'construction':
        return 'Under Construction';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div className="project-card group">
      {/* Image Container */}
      <div className="h-56 overflow-hidden relative">
        <img
          src={property.imageUrl}
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        {/* Favorite Button */}
        <div className="absolute top-3 right-3">
          <FavoriteButton 
            propertyId={property.id} 
            className="bg-background/80 backdrop-blur-sm hover:bg-background"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Badge */}
        <span className={`project-badge ${getBadgeClass(property.type)}`}>
          {getTypeLabel(property.type)}
        </span>

        {/* Title */}
        <h3 className="text-xl font-bold text-primary mb-3">{property.name}</h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-muted-foreground mb-5">
          <MapPin className="w-4 h-4 text-accent" />
          <span className="text-sm">{property.location}</span>
        </div>

        {/* Features */}
        <div className="flex justify-between mb-5 pb-5 border-b border-border">
          <div className="feature">
            <span className="feature-value">{property.aiScore}</span>
            <span className="feature-label">AI Score</span>
          </div>
          <div className="feature">
            <span className="feature-value">{property.expectedRoi}</span>
            <span className="feature-label">Expected ROI</span>
          </div>
          <div className="feature">
            <span className="feature-value">{property.completionMonths || 'Ready'}</span>
            <span className="feature-label">{property.completionMonths ? 'Months' : 'Status'}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-primary">{property.price}</div>
          <Link
            to={`/property/${property.id}`}
            className="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-secondary hover:-translate-y-0.5"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
