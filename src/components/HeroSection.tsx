/**
 * Hero Section Component
 * Enhanced hero banner with background video for the homepage
 */

import { useState, useRef, useEffect } from 'react';
import { Bot, Building2, Sparkles, Search, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const HeroSection = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  
  // Search state
  const [propertyType, setPropertyType] = useState('buy');
  const [budget, setBudget] = useState('');
  const [area, setArea] = useState('');

  const stats = [
    { value: '$2.5B+', label: 'Property Value Analyzed' },
    { value: '200+', label: 'Verified Partners' },
    { value: '4,200+', label: 'Successful Connections' },
    { value: '98%', label: 'Client Satisfaction' },
  ];

  const dubaiAreas = [
    'Downtown Dubai',
    'Dubai Marina',
    'Palm Jumeirah',
    'Business Bay',
    'JVC',
    'Dubai Hills',
    'Arabian Ranches',
    'JBR',
    'Al Barsha',
    'Deira',
  ];

  const budgetRanges = [
    { value: '0-500000', label: 'Up to AED 500K' },
    { value: '500000-1000000', label: 'AED 500K - 1M' },
    { value: '1000000-2000000', label: 'AED 1M - 2M' },
    { value: '2000000-5000000', label: 'AED 2M - 5M' },
    { value: '5000000-10000000', label: 'AED 5M - 10M' },
    { value: '10000000+', label: 'AED 10M+' },
  ];

  // Handle reduced motion preference
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleMotionPreference = (e: MediaQueryListEvent | MediaQueryList) => {
      if (videoRef.current) {
        if (e.matches) {
          videoRef.current.pause();
          setVideoPaused(true);
        } else {
          videoRef.current.play();
          setVideoPaused(false);
        }
      }
    };

    handleMotionPreference(prefersReducedMotion);
    prefersReducedMotion.addEventListener('change', handleMotionPreference);
    
    return () => {
      prefersReducedMotion.removeEventListener('change', handleMotionPreference);
    };
  }, [videoLoaded]);

  // Handle low bandwidth detection
  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection?.effectiveType === '2g' || connection?.saveData) {
        setVideoPaused(true);
        if (videoRef.current) {
          videoRef.current.pause();
        }
      }
    }
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (area) params.set('location', area);
    if (budget) params.set('budget', budget);
    if (propertyType) params.set('purpose', propertyType);
    navigate(`/properties${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <section 
      id="home" 
      className="relative min-h-[90vh] flex items-center justify-center text-white overflow-hidden"
    >
      {/* Video Background with Fallback */}
      <div className="absolute inset-0">
        {/* Fallback Image - Always loaded */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        
        {/* Video - Lazy loaded */}
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded && !videoPaused ? 'opacity-100' : 'opacity-0'
          }`}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onLoadedData={() => setVideoLoaded(true)}
          poster="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80"
        >
          {/* Dubai skyline video - using a reliable CDN source */}
          <source 
            src="https://cdn.pixabay.com/video/2020/05/25/40130-424930942_large.mp4" 
            type="video/mp4" 
          />
        </video>
      </div>

      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />

      {/* Decorative Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}
      />

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Product Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-slide-up">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium">AI-Powered Real Estate Intelligence</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight animate-slide-up">
          Discover Premium Properties<br className="hidden md:block" /> Across Dubai
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 opacity-90 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Buy, Invest, or Develop in Dubai's Most Exclusive Locations
        </p>

        {/* Search Bar */}
        <div 
          className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 mb-10 animate-slide-up border border-white/20"
          style={{ animationDelay: '0.15s' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Property Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Property Type</label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white h-12">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="invest">Invest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Budget</label>
              <Select value={budget} onValueChange={setBudget}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white h-12">
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dubai Area */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Dubai Area</label>
              <Select value={area} onValueChange={setArea}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white h-12">
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  {dubaiAreas.map((areaName) => (
                    <SelectItem key={areaName} value={areaName}>
                      {areaName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <Button 
                onClick={handleSearch}
                className="w-full h-12 btn-accent text-lg font-semibold"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Properties
              </Button>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Link to="/onboarding" className="btn-secondary text-lg px-8 py-4">
            <Bot className="w-5 h-5" />
            Start with PropertyX
          </Link>
          <Link to="/properties" className="btn-outline border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4">
            <Building2 className="w-5 h-5" />
            Browse Properties
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold mb-2">{stat.value}</div>
              <div className="text-sm md:text-base opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/60" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
