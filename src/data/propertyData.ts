/**
 * Property Data Types and Sample Data
 * This file contains the property data structure and sample properties
 * Properties can be loaded from Excel or used directly from here
 */

export interface Property {
  id: string;
  name: string;
  title: string;
  price: string;
  location: string;
  city: string;
  country: string;
  address: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  type: 'residential' | 'commercial' | 'luxury' | 'construction';
  status: string;
  description: string;
  features: string[];
  amenities: {
    electricity: boolean;
    water: boolean;
    gas: boolean;
    security: boolean;
    internet: boolean;
    backupPower: boolean;
  };
  legalInfo: {
    ownershipStatus: string;
    approvalAuthority: string;
    possessionStatus: string;
  };
  agent: {
    name: string;
    phone: string;
    email: string;
    whatsapp: string;
  };
  developer: string;
  imageUrl: string;
  floorPlanUrl?: string;
  gallery: string[];
  aiScore: number;
  expectedRoi: string;
  completionMonths: number;
  // Additional investment metrics
  rentalYield?: string;
  pricePerSqft?: number;
  investmentType?: 'Buy' | 'Off-plan' | 'Resale';
  appreciationForecast?: string;
  riskLevel?: 'Low' | 'Medium' | 'High';
}

// Dubai-focused sample property data
export const SAMPLE_PROPERTIES: Property[] = [
  {
    id: "1",
    name: "Burj Vista Tower",
    title: "Luxury Living at Burj Khalifa Views",
    price: "AED 3.2M",
    location: "Downtown Dubai",
    city: "Dubai",
    country: "UAE",
    address: "Burj Vista, Downtown Dubai, Dubai",
    area: "1,850 sq ft",
    bedrooms: 2,
    bathrooms: 3,
    parking: 2,
    type: "luxury",
    status: "Ready to Move",
    description: "Experience unparalleled luxury living with stunning Burj Khalifa views from this premium 2-bedroom apartment in Burj Vista. Features include floor-to-ceiling windows, Italian marble finishes, and access to world-class amenities including infinity pool, gym, and 24/7 concierge services.",
    features: ["Burj Khalifa View", "Italian Marble", "Smart Home", "Infinity Pool", "Gym", "Concierge"],
    amenities: {
      electricity: true,
      water: true,
      gas: true,
      security: true,
      internet: true,
      backupPower: true
    },
    legalInfo: {
      ownershipStatus: "Freehold",
      approvalAuthority: "Dubai Land Department",
      possessionStatus: "Immediate"
    },
    agent: {
      name: "Ahmed Al-Rashid",
      phone: "+971 50 123 4567",
      email: "ahmed.r@propertyx.ae",
      whatsapp: "+971501234567"
    },
    developer: "Emaar Properties",
    imageUrl: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800"
    ],
    aiScore: 9.4,
    expectedRoi: "14.5%",
    completionMonths: 0,
    rentalYield: "7.2%",
    pricePerSqft: 1730,
    investmentType: "Buy",
    appreciationForecast: "8-12%",
    riskLevel: "Low"
  },
  {
    id: "2",
    name: "Marina Gate Residences",
    title: "Premium Waterfront Living",
    price: "AED 2.8M",
    location: "Dubai Marina",
    city: "Dubai",
    country: "UAE",
    address: "Marina Gate Tower 2, Dubai Marina, Dubai",
    area: "1,650 sq ft",
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    type: "residential",
    status: "Ready to Move",
    description: "Stunning marina views from this beautifully appointed apartment in the iconic Marina Gate development. Enjoy direct access to Dubai Marina Walk, world-class dining, and the beach. Premium finishes throughout with built-in wardrobes and integrated appliances.",
    features: ["Marina View", "Beach Access", "Walk to Metro", "Gym", "Pool", "Covered Parking"],
    amenities: {
      electricity: true,
      water: true,
      gas: true,
      security: true,
      internet: true,
      backupPower: true
    },
    legalInfo: {
      ownershipStatus: "Freehold",
      approvalAuthority: "Dubai Land Department",
      possessionStatus: "Immediate"
    },
    agent: {
      name: "Sarah Khan",
      phone: "+971 55 234 5678",
      email: "sarah.k@propertyx.ae",
      whatsapp: "+971552345678"
    },
    developer: "Select Group",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800"
    ],
    aiScore: 8.9,
    expectedRoi: "12.8%",
    completionMonths: 0,
    rentalYield: "6.8%",
    pricePerSqft: 1697,
    investmentType: "Buy",
    appreciationForecast: "6-9%",
    riskLevel: "Low"
  },
  {
    id: "3",
    name: "Creek Harbour Tower",
    title: "Next-Gen Waterfront Development",
    price: "AED 1.9M",
    location: "Dubai Creek Harbour",
    city: "Dubai",
    country: "UAE",
    address: "Creek Harbour Tower A, Dubai Creek Harbour, Dubai",
    area: "1,200 sq ft",
    bedrooms: 1,
    bathrooms: 2,
    parking: 1,
    type: "construction",
    status: "Under Construction",
    description: "Be part of Dubai's next iconic destination at Creek Harbour. This off-plan 1BR offers excellent capital appreciation potential with views of the upcoming Creek Tower. Modern design with premium specifications and resort-style amenities.",
    features: ["Creek View", "Smart Home", "Rooftop Pool", "Landscaped Gardens", "Kids Play Area", "Retail Podium"],
    amenities: {
      electricity: true,
      water: true,
      gas: false,
      security: true,
      internet: true,
      backupPower: true
    },
    legalInfo: {
      ownershipStatus: "Freehold",
      approvalAuthority: "Dubai Land Department",
      possessionStatus: "Q4 2026"
    },
    agent: {
      name: "Mohammed Hassan",
      phone: "+971 50 345 6789",
      email: "mohammed.h@propertyx.ae",
      whatsapp: "+971503456789"
    },
    developer: "Emaar Properties",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
    ],
    aiScore: 9.1,
    expectedRoi: "16.2%",
    completionMonths: 24,
    rentalYield: "8.5%",
    pricePerSqft: 1583,
    investmentType: "Off-plan",
    appreciationForecast: "12-18%",
    riskLevel: "Medium"
  },
  {
    id: "4",
    name: "Palm Jumeirah Villa",
    title: "Exclusive Beachfront Living",
    price: "AED 18.5M",
    location: "Palm Jumeirah",
    city: "Dubai",
    country: "UAE",
    address: "Frond N, Palm Jumeirah, Dubai",
    area: "6,500 sq ft",
    bedrooms: 5,
    bathrooms: 6,
    parking: 4,
    type: "luxury",
    status: "Ready to Move",
    description: "Ultra-luxury beachfront villa on Palm Jumeirah with private beach access, infinity pool, and panoramic sea views. This signature residence features premium marble finishes, home automation, cinema room, and landscaped gardens. The epitome of Dubai luxury living.",
    features: ["Private Beach", "Infinity Pool", "Cinema Room", "Maid's Room", "Garden", "Skyline View"],
    amenities: {
      electricity: true,
      water: true,
      gas: true,
      security: true,
      internet: true,
      backupPower: true
    },
    legalInfo: {
      ownershipStatus: "Freehold",
      approvalAuthority: "Dubai Land Department",
      possessionStatus: "Immediate"
    },
    agent: {
      name: "James Mitchell",
      phone: "+971 55 456 7890",
      email: "james.m@propertyx.ae",
      whatsapp: "+971554567890"
    },
    developer: "Nakheel",
    imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800"
    ],
    aiScore: 9.6,
    expectedRoi: "11.5%",
    completionMonths: 0,
    rentalYield: "5.2%",
    pricePerSqft: 2846,
    investmentType: "Buy",
    appreciationForecast: "6-10%",
    riskLevel: "Low"
  },
  {
    id: "5",
    name: "Business Bay Executive",
    title: "Prime Commercial Investment",
    price: "AED 4.2M",
    location: "Business Bay",
    city: "Dubai",
    country: "UAE",
    address: "Executive Tower K, Business Bay, Dubai",
    area: "2,800 sq ft",
    bedrooms: 0,
    bathrooms: 3,
    parking: 4,
    type: "commercial",
    status: "Ready to Move",
    description: "Premium Grade A office space in the heart of Business Bay with stunning canal views. This fully fitted office offers an open floor plan, meeting rooms, and executive facilities. Perfect for corporate headquarters or investment with strong rental demand.",
    features: ["Canal View", "Fitted Office", "Meeting Rooms", "24/7 Security", "Metro Access", "Pantry"],
    amenities: {
      electricity: true,
      water: true,
      gas: false,
      security: true,
      internet: true,
      backupPower: true
    },
    legalInfo: {
      ownershipStatus: "Freehold",
      approvalAuthority: "Dubai Land Department",
      possessionStatus: "Immediate"
    },
    agent: {
      name: "Fatima Al-Sayed",
      phone: "+971 50 567 8901",
      email: "fatima.s@propertyx.ae",
      whatsapp: "+971505678901"
    },
    developer: "DAMAC Properties",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800"
    ],
    aiScore: 8.7,
    expectedRoi: "13.2%",
    completionMonths: 0,
    rentalYield: "9.5%",
    pricePerSqft: 1500,
    investmentType: "Buy",
    appreciationForecast: "5-8%",
    riskLevel: "Medium"
  },
  {
    id: "6",
    name: "JVC Smart Living",
    title: "High-Yield Investment",
    price: "AED 850K",
    location: "Jumeirah Village Circle",
    city: "Dubai",
    country: "UAE",
    address: "Bloom Heights, JVC, Dubai",
    area: "750 sq ft",
    bedrooms: 1,
    bathrooms: 1,
    parking: 1,
    type: "residential",
    status: "Ready to Move",
    description: "Excellent investment opportunity in the popular JVC community. This modern 1BR apartment offers high rental yields with strong tenant demand. Features smart home technology, quality finishes, and access to community amenities including pool and gym.",
    features: ["Smart Home", "Pool", "Gym", "Kids Area", "BBQ Area", "Covered Parking"],
    amenities: {
      electricity: true,
      water: true,
      gas: true,
      security: true,
      internet: true,
      backupPower: false
    },
    legalInfo: {
      ownershipStatus: "Freehold",
      approvalAuthority: "Dubai Land Department",
      possessionStatus: "Immediate"
    },
    agent: {
      name: "Omar Saeed",
      phone: "+971 55 678 9012",
      email: "omar.s@propertyx.ae",
      whatsapp: "+971556789012"
    },
    developer: "Bloom Holding",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800"
    ],
    aiScore: 8.4,
    expectedRoi: "15.8%",
    completionMonths: 0,
    rentalYield: "8.9%",
    pricePerSqft: 1133,
    investmentType: "Buy",
    appreciationForecast: "8-12%",
    riskLevel: "Low"
  },
  {
    id: "7",
    name: "DIFC Gate Avenue",
    title: "Premium DIFC Location",
    price: "AED 5.8M",
    location: "DIFC",
    city: "Dubai",
    country: "UAE",
    address: "Gate Avenue, DIFC, Dubai",
    area: "2,100 sq ft",
    bedrooms: 3,
    bathrooms: 4,
    parking: 2,
    type: "luxury",
    status: "Ready to Move",
    description: "Exclusive 3BR residence in Dubai's premier financial district. This sophisticated apartment offers direct access to Gate Avenue lifestyle destination, premium retail, and fine dining. Features high-end finishes, large windows, and exceptional city views.",
    features: ["DIFC Views", "Gate Avenue Access", "Premium Finishes", "Concierge", "Valet Parking", "Rooftop Lounge"],
    amenities: {
      electricity: true,
      water: true,
      gas: true,
      security: true,
      internet: true,
      backupPower: true
    },
    legalInfo: {
      ownershipStatus: "Freehold",
      approvalAuthority: "Dubai Land Department",
      possessionStatus: "Immediate"
    },
    agent: {
      name: "Nadia Ahmed",
      phone: "+971 50 789 0123",
      email: "nadia.a@propertyx.ae",
      whatsapp: "+971507890123"
    },
    developer: "Brookfield Properties",
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600573472591-ee6981cf81f0?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800"
    ],
    aiScore: 9.3,
    expectedRoi: "12.5%",
    completionMonths: 0,
    rentalYield: "6.5%",
    pricePerSqft: 2762,
    investmentType: "Buy",
    appreciationForecast: "7-10%",
    riskLevel: "Low"
  },
  {
    id: "8",
    name: "Dubai Hills Mansion",
    title: "Golf Course Living",
    price: "AED 12.5M",
    location: "Dubai Hills Estate",
    city: "Dubai",
    country: "UAE",
    address: "Fairway Vistas, Dubai Hills Estate, Dubai",
    area: "8,200 sq ft",
    bedrooms: 6,
    bathrooms: 7,
    parking: 3,
    type: "luxury",
    status: "Under Construction",
    description: "Magnificent golf course mansion in the prestigious Dubai Hills Estate. This grand residence offers unobstructed golf course and skyline views, private pool, landscaped gardens, and premium specifications. Off-plan opportunity with excellent payment plan.",
    features: ["Golf Course View", "Private Pool", "Landscaped Garden", "Maid's Quarters", "Driver's Room", "Smart Home"],
    amenities: {
      electricity: true,
      water: true,
      gas: true,
      security: true,
      internet: true,
      backupPower: true
    },
    legalInfo: {
      ownershipStatus: "Freehold",
      approvalAuthority: "Dubai Land Department",
      possessionStatus: "Q2 2026"
    },
    agent: {
      name: "Rashid Al-Maktoum",
      phone: "+971 55 890 1234",
      email: "rashid.m@propertyx.ae",
      whatsapp: "+971558901234"
    },
    developer: "Emaar Properties",
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800"
    ],
    aiScore: 9.5,
    expectedRoi: "14.8%",
    completionMonths: 18,
    rentalYield: "5.8%",
    pricePerSqft: 1524,
    investmentType: "Off-plan",
    appreciationForecast: "10-15%",
    riskLevel: "Medium"
  },
  {
    id: "9",
    name: "Sobha Hartland Greens",
    title: "Serene Community Living",
    price: "AED 2.1M",
    location: "Mohammed Bin Rashid City",
    city: "Dubai",
    country: "UAE",
    address: "Hartland Greens, MBR City, Dubai",
    area: "1,450 sq ft",
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    type: "residential",
    status: "Ready to Move",
    description: "Beautiful 2BR apartment in the award-winning Sobha Hartland development. Surrounded by lush green landscapes and lagoons, this residence offers a peaceful retreat while being minutes from Downtown Dubai. Premium Sobha quality throughout.",
    features: ["Lagoon View", "Crystal Lagoon", "Jogging Track", "Tennis Courts", "Kids Pool", "BBQ Deck"],
    amenities: {
      electricity: true,
      water: true,
      gas: true,
      security: true,
      internet: true,
      backupPower: true
    },
    legalInfo: {
      ownershipStatus: "Freehold",
      approvalAuthority: "Dubai Land Department",
      possessionStatus: "Immediate"
    },
    agent: {
      name: "Priya Sharma",
      phone: "+971 50 901 2345",
      email: "priya.s@propertyx.ae",
      whatsapp: "+971509012345"
    },
    developer: "Sobha Realty",
    imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800"
    ],
    aiScore: 8.8,
    expectedRoi: "13.5%",
    completionMonths: 0,
    rentalYield: "7.1%",
    pricePerSqft: 1448,
    investmentType: "Buy",
    appreciationForecast: "7-11%",
    riskLevel: "Low"
  },
  {
    id: "10",
    name: "Bluewaters Residences",
    title: "Island Lifestyle at Ain Dubai",
    price: "AED 4.5M",
    location: "Bluewaters Island",
    city: "Dubai",
    country: "UAE",
    address: "Bluewaters Residences, Bluewaters Island, Dubai",
    area: "2,000 sq ft",
    bedrooms: 3,
    bathrooms: 3,
    parking: 2,
    type: "luxury",
    status: "Ready to Move",
    description: "Exceptional island living at Bluewaters with Ain Dubai and sea views. This premium 3BR apartment offers resort-style amenities, direct beach access, and a vibrant retail and dining scene. Limited availability in this exclusive development.",
    features: ["Ain Dubai View", "Beach Access", "Sea View", "Island Lifestyle", "Premium Retail", "Fine Dining"],
    amenities: {
      electricity: true,
      water: true,
      gas: true,
      security: true,
      internet: true,
      backupPower: true
    },
    legalInfo: {
      ownershipStatus: "Freehold",
      approvalAuthority: "Dubai Land Department",
      possessionStatus: "Immediate"
    },
    agent: {
      name: "Alexandra Smith",
      phone: "+971 55 012 3456",
      email: "alexandra.s@propertyx.ae",
      whatsapp: "+971550123456"
    },
    developer: "Meraas",
    imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800"
    ],
    aiScore: 9.2,
    expectedRoi: "12.2%",
    completionMonths: 0,
    rentalYield: "6.3%",
    pricePerSqft: 2250,
    investmentType: "Buy",
    appreciationForecast: "6-9%",
    riskLevel: "Low"
  }
];

// Function to get property by ID
export const getPropertyById = (id: string): Property | undefined => {
  return SAMPLE_PROPERTIES.find(property => property.id === id);
};

// Function to filter properties by type
export const filterPropertiesByType = (type: string): Property[] => {
  if (type === 'all') return SAMPLE_PROPERTIES;
  return SAMPLE_PROPERTIES.filter(property => property.type === type);
};

// Function to get properties by investment type
export const filterPropertiesByInvestmentType = (type: 'Buy' | 'Off-plan' | 'Resale'): Property[] => {
  return SAMPLE_PROPERTIES.filter(property => property.investmentType === type);
};

// Function to get high ROI properties
export const getHighRoiProperties = (minRoi: number = 12): Property[] => {
  return SAMPLE_PROPERTIES.filter(property => {
    const roiValue = parseFloat(property.expectedRoi.replace('%', ''));
    return roiValue >= minRoi;
  });
};
