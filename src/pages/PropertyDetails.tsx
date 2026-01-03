/**
 * Property Details Page
 * Displays comprehensive information about a specific property
 */

import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Calendar, Bed, Bath, Car, Ruler, 
  Check, X, Phone, Mail, MessageCircle, Shield, Building,
  Zap, Droplets, Flame, Wifi, BatteryCharging
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getPropertyById, SAMPLE_PROPERTIES } from '@/data/propertyData';
import { useState } from 'react';

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);

  // Get property data
  const property = id ? getPropertyById(id) : undefined;

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
            <Link to="/" className="btn-primary">
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Amenity icons mapping
  const amenityIcons = {
    electricity: { icon: Zap, label: 'Electricity' },
    water: { icon: Droplets, label: 'Water' },
    gas: { icon: Flame, label: 'Gas' },
    security: { icon: Shield, label: 'Security' },
    internet: { icon: Wifi, label: 'Internet' },
    backupPower: { icon: BatteryCharging, label: 'Backup Power' }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section 
        className="relative py-20 text-white"
        style={{
          background: `linear-gradient(135deg, rgba(26, 54, 93, 0.92) 0%, rgba(15, 118, 110, 0.88) 100%)`,
        }}
      >
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Properties
          </button>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{property.name}</h1>
          <div className="flex items-center gap-2 text-xl opacity-90">
            <MapPin className="w-5 h-5" />
            {property.location}, {property.country}
          </div>
        </div>
      </section>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-card">
                <div className="relative h-96">
                  <img
                    src={property.gallery[activeImage]}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {property.gallery.length > 1 && (
                  <div className="flex gap-2 p-4 overflow-x-auto">
                    {property.gallery.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          activeImage === index ? 'border-secondary' : 'border-transparent opacity-70'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 rounded-xl bg-muted">
                    <div className="text-2xl font-bold text-primary">{property.price}</div>
                    <div className="text-sm text-muted-foreground">Price</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted">
                    <div className="text-2xl font-bold text-primary">{property.developer}</div>
                    <div className="text-sm text-muted-foreground">Developer</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted">
                    <div className="text-2xl font-bold text-primary">{property.status}</div>
                    <div className="text-sm text-muted-foreground">Status</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted">
                    <div className="text-2xl font-bold text-primary capitalize">{property.type}</div>
                    <div className="text-sm text-muted-foreground">Type</div>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h3 className="text-xl font-bold text-primary mb-6">Specifications</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
                      <Ruler className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-primary">{property.area}</div>
                      <div className="text-sm text-muted-foreground">Area</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
                      <Bed className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-primary">{property.bedrooms}</div>
                      <div className="text-sm text-muted-foreground">Bedrooms</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
                      <Bath className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-primary">{property.bathrooms}</div>
                      <div className="text-sm text-muted-foreground">Bathrooms</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
                      <Car className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-primary">{property.parking}</div>
                      <div className="text-sm text-muted-foreground">Parking</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h3 className="text-xl font-bold text-primary mb-4">About this Property</h3>
                <p className="text-foreground leading-relaxed">{property.description}</p>

                {/* Features */}
                <h4 className="text-lg font-semibold text-primary mt-6 mb-4">Key Features</h4>
                <div className="flex flex-wrap gap-3">
                  {property.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h3 className="text-xl font-bold text-primary mb-6">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(property.amenities).map(([key, value]) => {
                    const amenity = amenityIcons[key as keyof typeof amenityIcons];
                    return (
                      <div
                        key={key}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          value ? 'bg-green-50' : 'bg-red-50'
                        }`}
                      >
                        <amenity.icon className={`w-5 h-5 ${value ? 'text-green-600' : 'text-red-400'}`} />
                        <span className={value ? 'text-green-700' : 'text-red-400'}>
                          {amenity.label}
                        </span>
                        {value ? (
                          <Check className="w-4 h-4 text-green-600 ml-auto" />
                        ) : (
                          <X className="w-4 h-4 text-red-400 ml-auto" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legal Information */}
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h3 className="text-xl font-bold text-primary mb-6">Legal Information</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Ownership Status</div>
                    <div className="font-semibold text-primary">{property.legalInfo.ownershipStatus}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Approval Authority</div>
                    <div className="font-semibold text-primary">{property.legalInfo.approvalAuthority}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Possession Status</div>
                    <div className="font-semibold text-primary">{property.legalInfo.possessionStatus}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Right Column */}
            <div className="space-y-6">
              {/* AI Score Card */}
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h3 className="text-lg font-bold text-primary mb-4">Investment Score</h3>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-4xl font-extrabold text-secondary">{property.aiScore}</div>
                    <div className="text-sm text-muted-foreground">AI Score</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{property.expectedRoi}</div>
                    <div className="text-sm text-muted-foreground">Expected ROI</div>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="gradient-primary h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(property.aiScore / 10) * 100}%` }}
                  />
                </div>
              </div>

              {/* Agent Info */}
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h3 className="text-lg font-bold text-primary mb-4">Agent Information</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {property.agent.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-primary">{property.agent.name}</div>
                    <div className="text-sm text-muted-foreground">Property Agent</div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="flex items-center gap-3 text-foreground hover:text-secondary transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {property.agent.phone}
                  </a>
                  <a
                    href={`mailto:${property.agent.email}`}
                    className="flex items-center gap-3 text-foreground hover:text-secondary transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {property.agent.email}
                  </a>
                </div>

                <a
                  href={`https://wa.me/${property.agent.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>
              </div>

              {/* Schedule Meeting CTA */}
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h3 className="text-lg font-bold text-primary mb-4">Interested in this Property?</h3>
                <p className="text-muted-foreground mb-6 text-sm">
                  Schedule a meeting to learn more about this property and discuss your investment options.
                </p>
                <Link
                  to={`/schedule?propertyId=${property.id}&propertyName=${encodeURIComponent(property.name)}&propertyLocation=${encodeURIComponent(property.location)}`}
                  className="btn-primary w-full justify-center"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule Meeting
                </Link>
              </div>

              {/* Location */}
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h3 className="text-lg font-bold text-primary mb-4">Location</h3>
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <div className="text-foreground">{property.address}</div>
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
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetails;
