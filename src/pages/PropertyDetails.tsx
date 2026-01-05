/**
 * Property Details Page
 * Displays comprehensive information about a specific property
 */

import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Calendar, Bed, Bath, Car, Ruler, 
  Check, X, Phone, Mail, MessageCircle, Shield, Building,
  Zap, Droplets, Flame, Wifi, BatteryCharging, ChevronLeft, ChevronRight,
  Bot, Users, Eye, CreditCard, Home, Tag
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getPropertyById, SAMPLE_PROPERTIES, Property } from '@/data/propertyData';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ComparableProperties from '@/components/property-analysis/ComparableProperties';

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);

  // Get property data
  const property = id ? getPropertyById(id) : undefined;

  // Get comparable properties (same type, similar price range, or same location)
  const comparableProperties = useMemo(() => {
    if (!property) return [];
    
    return SAMPLE_PROPERTIES
      .filter(p => p.id !== property.id)
      .filter(p => 
        p.type === property.type || 
        p.location === property.location ||
        p.city === property.city
      )
      .map(p => ({
        id: p.id,
        title: p.name,
        location: `${p.location}, ${p.city}`,
        price: p.price,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        imageUrl: p.imageUrl,
        status: p.status === 'Ready to Move' ? 'available' as const : 
                p.status === 'Under Construction' ? 'pending' as const : 'available' as const,
        matchScore: Math.floor(Math.random() * 20) + 75 // Simulated match score
      }));
  }, [property]);

  // If property not found, show error
  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-3xl font-bold text-primary mb-4">Property Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/properties" className="btn-primary">
              Browse Properties
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Determine if property is off-plan
  const isOffPlan = property.status === 'Under Construction' || property.completionMonths > 0;

  // Amenity icons mapping
  const amenityIcons = {
    electricity: { icon: Zap, label: 'Electricity' },
    water: { icon: Droplets, label: 'Water' },
    gas: { icon: Flame, label: 'Gas' },
    security: { icon: Shield, label: 'Security' },
    internet: { icon: Wifi, label: 'Internet' },
    backupPower: { icon: BatteryCharging, label: 'Backup Power' }
  };

  const handlePrevImage = () => {
    setActiveImage(prev => (prev === 0 ? property.gallery.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImage(prev => (prev === property.gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section 
        className="relative py-16 text-white"
        style={{
          background: `linear-gradient(135deg, hsl(var(--primary) / 0.92) 0%, hsl(var(--secondary) / 0.88) 100%)`,
        }}
      >
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Properties
          </button>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-extrabold">{property.name}</h1>
            <Badge variant={isOffPlan ? "secondary" : "default"} className="text-sm">
              {isOffPlan ? 'Off-Plan' : 'Ready'}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-lg opacity-90">
            <MapPin className="w-5 h-5" />
            {property.location}, {property.city}, {property.country}
          </div>
        </div>
      </section>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Gallery Carousel */}
              <Card className="overflow-hidden">
                <div className="relative h-[400px] md:h-[500px]">
                  <img
                    src={property.gallery[activeImage]}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navigation Arrows */}
                  {property.gallery.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6 text-foreground" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                      >
                        <ChevronRight className="w-6 h-6 text-foreground" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-sm font-medium">
                    {activeImage + 1} / {property.gallery.length}
                  </div>
                </div>

                {/* Thumbnail Strip */}
                {property.gallery.length > 1 && (
                  <div className="flex gap-2 p-4 overflow-x-auto">
                    {property.gallery.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          activeImage === index ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </Card>

              {/* Key Facts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-primary" />
                    Key Facts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="text-center p-4 rounded-xl bg-muted">
                      <Tag className="w-5 h-5 mx-auto mb-2 text-primary" />
                      <div className="text-lg font-bold text-primary">{property.price}</div>
                      <div className="text-xs text-muted-foreground">Price</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-muted">
                      <Building className="w-5 h-5 mx-auto mb-2 text-primary" />
                      <div className="text-lg font-bold text-primary capitalize">{property.type}</div>
                      <div className="text-xs text-muted-foreground">Type</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-muted">
                      <Bed className="w-5 h-5 mx-auto mb-2 text-primary" />
                      <div className="text-lg font-bold text-primary">{property.bedrooms}</div>
                      <div className="text-xs text-muted-foreground">Bedrooms</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-muted">
                      <Bath className="w-5 h-5 mx-auto mb-2 text-primary" />
                      <div className="text-lg font-bold text-primary">{property.bathrooms}</div>
                      <div className="text-xs text-muted-foreground">Bathrooms</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-muted">
                      <Ruler className="w-5 h-5 mx-auto mb-2 text-primary" />
                      <div className="text-lg font-bold text-primary">{property.area}</div>
                      <div className="text-xs text-muted-foreground">Size</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-muted">
                      <Calendar className="w-5 h-5 mx-auto mb-2 text-primary" />
                      <div className="text-lg font-bold text-primary">{isOffPlan ? 'Off-Plan' : 'Ready'}</div>
                      <div className="text-xs text-muted-foreground">Status</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">City / Area</div>
                      <div className="font-semibold">{property.location}, {property.city}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Country</div>
                      <div className="font-semibold">{property.country}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Full Address</div>
                    <div className="font-semibold">{property.address}</div>
                  </div>
                  <div className="h-48 rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(property.address)}`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      title="Property Location"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Developer/Agent Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-primary" />
                    Developer & Agent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Developer</div>
                      <div className="font-semibold text-lg">{property.developer}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Listed By</div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                          {property.agent.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold">{property.agent.name}</div>
                          <div className="text-sm text-muted-foreground">{property.agent.email}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>About this Property</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed mb-6">{property.description}</p>

                  {/* Features */}
                  <h4 className="font-semibold mb-3">Key Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((feature, index) => (
                      <Badge key={index} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(property.amenities).map(([key, value]) => {
                      const amenity = amenityIcons[key as keyof typeof amenityIcons];
                      return (
                        <div
                          key={key}
                          className={`flex items-center gap-3 p-3 rounded-lg ${
                            value ? 'bg-green-50 dark:bg-green-950/30' : 'bg-red-50 dark:bg-red-950/30'
                          }`}
                        >
                          <amenity.icon className={`w-5 h-5 ${value ? 'text-green-600 dark:text-green-400' : 'text-red-400'}`} />
                          <span className={value ? 'text-green-700 dark:text-green-300' : 'text-red-400'}>
                            {amenity.label}
                          </span>
                          {value ? (
                            <Check className="w-4 h-4 text-green-600 dark:text-green-400 ml-auto" />
                          ) : (
                            <X className="w-4 h-4 text-red-400 ml-auto" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Plan (for off-plan properties) */}
              {isOffPlan && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-primary" />
                      Payment Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-primary/10 text-center">
                          <div className="text-2xl font-bold text-primary">20%</div>
                          <div className="text-sm text-muted-foreground">Down Payment</div>
                        </div>
                        <div className="p-4 rounded-lg bg-secondary/10 text-center">
                          <div className="text-2xl font-bold text-secondary">60%</div>
                          <div className="text-sm text-muted-foreground">During Construction</div>
                        </div>
                        <div className="p-4 rounded-lg bg-primary/10 text-center">
                          <div className="text-2xl font-bold text-primary">20%</div>
                          <div className="text-sm text-muted-foreground">On Handover</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                        <div>
                          <div className="font-semibold">Expected Completion</div>
                          <div className="text-sm text-muted-foreground">{property.legalInfo.possessionStatus}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{property.completionMonths} months</div>
                          <div className="text-sm text-muted-foreground">Remaining</div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        * Payment plans may vary. Contact our team for detailed payment schedules and customized options.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Legal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Legal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Ownership Status</div>
                      <div className="font-semibold">{property.legalInfo.ownershipStatus}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Approval Authority</div>
                      <div className="font-semibold">{property.legalInfo.approvalAuthority}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Possession Status</div>
                      <div className="font-semibold">{property.legalInfo.possessionStatus}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comparable Properties */}
              {comparableProperties.length > 0 && (
                <ComparableProperties 
                  properties={comparableProperties}
                  currentPropertyId={property.id}
                />
              )}
            </div>

            {/* Sidebar - Right Column */}
            <div className="space-y-6">
              {/* CTA: Run PropertyX Analysis */}
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Bot className="w-5 h-5 text-primary" />
                    PropertyX AI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Get ROI, risk assessment, and investment insights powered by AI.
                  </p>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background">
                    <div>
                      <div className="text-3xl font-bold text-primary">{property.aiScore}</div>
                      <div className="text-xs text-muted-foreground">AI Score</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-secondary">{property.expectedRoi}</div>
                      <div className="text-xs text-muted-foreground">Expected ROI</div>
                    </div>
                  </div>
                  <Button className="w-full" size="lg">
                    <Bot className="w-4 h-4 mr-2" />
                    Run Full Analysis
                  </Button>
                </CardContent>
              </Card>

              {/* CTA: Chat with PropertyX */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    Ask PropertyX
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Have questions about this property? Chat with our AI advisor.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/chat?propertyId=${property.id}`)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat About This Property
                  </Button>
                </CardContent>
              </Card>

              {/* CTA: Request Viewing / Talk to Human */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="w-5 h-5 text-primary" />
                    Connect with an Agent
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg font-bold">
                      {property.agent.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{property.agent.name}</div>
                      <div className="text-sm text-muted-foreground">Property Agent</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <a
                      href={`tel:${property.agent.phone}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-sm"
                    >
                      <Phone className="w-4 h-4 text-primary" />
                      {property.agent.phone}
                    </a>
                    <a
                      href={`mailto:${property.agent.email}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-sm"
                    >
                      <Mail className="w-4 h-4 text-primary" />
                      {property.agent.email}
                    </a>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Link
                      to={`/schedule?propertyId=${property.id}&propertyName=${encodeURIComponent(property.name)}&propertyLocation=${encodeURIComponent(property.location + ', ' + property.city)}`}
                      className="w-full"
                    >
                      <Button className="w-full" variant="default">
                        <Eye className="w-4 h-4 mr-2" />
                        Request Viewing
                      </Button>
                    </Link>
                    
                    <a
                      href={`https://wa.me/${property.agent.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp Agent
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Investment Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">AI Score</span>
                      <span className="font-semibold">{property.aiScore}/10</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(property.aiScore / 10) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm text-muted-foreground">Expected ROI</span>
                      <span className="font-semibold text-secondary">{property.expectedRoi}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Developer</span>
                      <span className="font-semibold">{property.developer}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Parking Spaces</span>
                      <span className="font-semibold">{property.parking}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetails;
