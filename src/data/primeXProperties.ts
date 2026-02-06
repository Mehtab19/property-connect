export interface PrimeXProperty {
  id: string;
  name: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: 'apartment' | 'villa' | 'townhouse' | 'penthouse' | 'commercial' | 'studio';
  purpose: 'buy' | 'rent' | 'invest';
  availability: 'available' | 'reserved' | 'sold';
  description: string;
  area_sqft: number;
}

export const primeXProperties: PrimeXProperty[] = [
  {
    id: "px-001",
    name: "Azure Sky Residences",
    location: "Dubai Marina",
    price: 2500000,
    bedrooms: 3,
    bathrooms: 3,
    propertyType: "apartment",
    purpose: "buy",
    availability: "available",
    description: "Stunning 3-bedroom apartment with full marina views, modern finishes, and premium amenities.",
    area_sqft: 2100,
  },
  {
    id: "px-002",
    name: "Palm Horizon Villa",
    location: "Palm Jumeirah",
    price: 12000000,
    bedrooms: 5,
    bathrooms: 6,
    propertyType: "villa",
    purpose: "buy",
    availability: "available",
    description: "Luxury beachfront villa with private pool, garden, and direct beach access on Palm Jumeirah.",
    area_sqft: 6500,
  },
  {
    id: "px-003",
    name: "Creek View Studio",
    location: "Dubai Creek Harbour",
    price: 55000,
    bedrooms: 0,
    bathrooms: 1,
    propertyType: "studio",
    purpose: "rent",
    availability: "available",
    description: "Modern furnished studio with creek views, ideal for young professionals. Monthly rent.",
    area_sqft: 450,
  },
  {
    id: "px-004",
    name: "Downtown Elite Penthouse",
    location: "Downtown Dubai",
    price: 18500000,
    bedrooms: 4,
    bathrooms: 5,
    propertyType: "penthouse",
    purpose: "invest",
    availability: "available",
    description: "Ultra-luxury penthouse with Burj Khalifa views, private elevator, and rooftop terrace.",
    area_sqft: 5200,
  },
  {
    id: "px-005",
    name: "JVC Family Townhouse",
    location: "Jumeirah Village Circle",
    price: 1800000,
    bedrooms: 3,
    bathrooms: 3,
    propertyType: "townhouse",
    purpose: "buy",
    availability: "available",
    description: "Family-friendly townhouse with garden, community pool, and close to schools.",
    area_sqft: 2400,
  },
  {
    id: "px-006",
    name: "Business Bay Office Suite",
    location: "Business Bay",
    price: 3200000,
    bedrooms: 0,
    bathrooms: 2,
    propertyType: "commercial",
    purpose: "invest",
    availability: "available",
    description: "Premium commercial office space with canal views, ideal for business investors.",
    area_sqft: 1800,
  },
  {
    id: "px-007",
    name: "Marina Breeze Apartment",
    location: "Dubai Marina",
    price: 85000,
    bedrooms: 1,
    bathrooms: 1,
    propertyType: "apartment",
    purpose: "rent",
    availability: "available",
    description: "Fully furnished 1-bedroom with marina walk access and gym. Annual rent.",
    area_sqft: 750,
  },
  {
    id: "px-008",
    name: "Sobha Hartland Villa",
    location: "Mohammed Bin Rashid City",
    price: 7500000,
    bedrooms: 4,
    bathrooms: 5,
    propertyType: "villa",
    purpose: "buy",
    availability: "reserved",
    description: "Elegant villa in Sobha Hartland with lagoon views and world-class finishing.",
    area_sqft: 4200,
  },
  {
    id: "px-009",
    name: "Silicon Oasis Studio",
    location: "Dubai Silicon Oasis",
    price: 650000,
    bedrooms: 0,
    bathrooms: 1,
    propertyType: "studio",
    purpose: "invest",
    availability: "available",
    description: "Affordable studio with high rental yield (8%+), perfect for first-time investors.",
    area_sqft: 400,
  },
  {
    id: "px-010",
    name: "Arabian Ranches Townhouse",
    location: "Arabian Ranches",
    price: 3500000,
    bedrooms: 4,
    bathrooms: 4,
    propertyType: "townhouse",
    purpose: "buy",
    availability: "available",
    description: "Spacious townhouse in a gated community with golf course views and premium landscaping.",
    area_sqft: 3200,
  },
];

export function formatPrice(price: number, purpose: string): string {
  if (purpose === 'rent') {
    return `AED ${price.toLocaleString()}/year`;
  }
  return `AED ${price.toLocaleString()}`;
}

export function getPropertiesContext(): string {
  return primeXProperties
    .map(p => `- ${p.name} | ${p.location} | ${formatPrice(p.price, p.purpose)} | ${p.bedrooms > 0 ? p.bedrooms + ' bed' : 'Studio'} | ${p.bathrooms} bath | ${p.propertyType} | For: ${p.purpose} | ${p.availability} | ${p.area_sqft} sqft | ${p.description}`)
    .join('\n');
}
