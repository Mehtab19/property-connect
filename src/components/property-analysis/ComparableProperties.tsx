import { MapPin, Bed, Bath, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface ComparableProperty {
  id: string;
  title: string;
  location: string;
  price: string;
  pricePerSqft?: string;
  bedrooms: number;
  bathrooms: number;
  imageUrl: string;
  matchScore?: number; // 0-100 similarity score
  status?: 'sold' | 'available' | 'pending';
}

interface ComparablePropertiesProps {
  properties: ComparableProperty[];
  currentPropertyId?: string;
  className?: string;
}

const getStatusBadge = (status?: string) => {
  switch (status) {
    case 'sold':
      return <Badge variant="secondary" className="bg-muted text-muted-foreground">Sold</Badge>;
    case 'pending':
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400">Pending</Badge>;
    case 'available':
    default:
      return <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">Available</Badge>;
  }
};

const ComparableProperties = ({
  properties,
  currentPropertyId,
  className,
}: ComparablePropertiesProps) => {
  const navigate = useNavigate();
  
  const filteredProperties = properties.filter(p => p.id !== currentPropertyId).slice(0, 4);

  if (filteredProperties.length === 0) {
    return null;
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-primary" />
            Comparable Properties
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/compare')}
            className="text-primary hover:text-primary/80"
          >
            Compare All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="flex gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
              onClick={() => navigate(`/property/${property.id}`)}
            >
              {/* Image */}
              <div className="relative w-20 h-20 flex-shrink-0">
                <img
                  src={property.imageUrl}
                  alt={property.title}
                  className="w-full h-full object-cover rounded-lg"
                />
                {property.matchScore && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {property.matchScore}%
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                    {property.title}
                  </h4>
                  {getStatusBadge(property.status)}
                </div>
                
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3" />
                  {property.location}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Bed className="h-3 w-3" /> {property.bedrooms}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-3 w-3" /> {property.bathrooms}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-primary">{property.price}</p>
                    {property.pricePerSqft && (
                      <p className="text-xs text-muted-foreground">{property.pricePerSqft}/sqft</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparableProperties;
