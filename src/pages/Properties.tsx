/**
 * Properties Listing Page
 * Displays filterable property listings with compare functionality
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search, Filter, Grid3X3, List, MapPin, Bed, Bath, Square,
  ChevronDown, X, Scale, Bot, Eye, Building2, SlidersHorizontal,
  Heart, Bookmark, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import FavoriteButton from '@/components/FavoriteButton';
import { useSavedSearches } from '@/hooks/useSavedSearches';
import { useAuth } from '@/hooks/useAuth';

interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  area: string;
  price: number;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  status: string;
  images: string[] | null;
  amenities: string[] | null;
  description: string | null;
  created_at: string;
}

interface Filters {
  search: string;
  city: string;
  propertyType: string[];
  readyStatus: 'all' | 'ready' | 'off-plan';
  priceMin: number;
  priceMax: number;
  bedrooms: string;
  purpose: string;
  sortBy: string;
}

const Properties = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { savedSearches, saveSearch, deleteSearch } = useSavedSearches();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [compareList, setCompareList] = useState<Property[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [saveSearchOpen, setSaveSearchOpen] = useState(false);
  const [savedSearchesOpen, setSavedSearchesOpen] = useState(false);
  const [searchName, setSearchName] = useState('');
  
  // Initialize filters from URL params
  const initialLocation = searchParams.get('location') || '';
  const initialPurpose = searchParams.get('purpose') || 'any';
  
  const [filters, setFilters] = useState<Filters>({
    search: initialLocation,
    city: '',
    propertyType: [],
    readyStatus: 'all',
    priceMin: 0,
    priceMax: 10000000,
    bedrooms: 'any',
    purpose: initialPurpose,
    sortBy: 'newest',
  });

  // Update filters when URL params change
  useEffect(() => {
    const location = searchParams.get('location');
    const purpose = searchParams.get('purpose');
    
    if (location || purpose) {
      setFilters(f => ({
        ...f,
        search: location || f.search,
        purpose: purpose || f.purpose,
      }));
    }
  }, [searchParams]);

  // Fetch properties from database
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProperties(data || []);
      } catch (error: any) {
        console.error('Error fetching properties:', error);
        toast.error('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filter and sort properties
  const filteredProperties = properties.filter(property => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        property.title.toLowerCase().includes(searchLower) ||
        property.city.toLowerCase().includes(searchLower) ||
        property.area.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // City filter
    if (filters.city && property.city.toLowerCase() !== filters.city.toLowerCase()) {
      return false;
    }

    // Property type filter
    if (filters.propertyType.length > 0 && !filters.propertyType.includes(property.property_type)) {
      return false;
    }

    // Price filter
    if (property.price < filters.priceMin || property.price > filters.priceMax) {
      return false;
    }

    // Bedrooms filter
    if (filters.bedrooms !== 'any') {
      const bedsFilter = parseInt(filters.bedrooms);
      if (filters.bedrooms === '4+' && property.bedrooms < 4) return false;
      if (filters.bedrooms !== '4+' && property.bedrooms !== bedsFilter) return false;
    }

    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0;
    }
  });

  // Get unique cities for filter
  const cities = [...new Set(properties.map(p => p.city))].filter(Boolean);

  const toggleCompare = (property: Property) => {
    if (compareList.find(p => p.id === property.id)) {
      setCompareList(compareList.filter(p => p.id !== property.id));
    } else if (compareList.length < 4) {
      setCompareList([...compareList, property]);
    } else {
      toast.error('Maximum 4 properties can be compared');
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    }
    return `$${(price / 1000).toFixed(0)}K`;
  };

  const handleAskPropertyX = (property: Property) => {
    // Store property context and navigate to chat
    localStorage.setItem('propertyx_context', JSON.stringify({
      propertyId: property.id,
      title: property.title,
      price: property.price,
      location: `${property.area}, ${property.city}`,
    }));
    navigate('/chat');
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      city: '',
      propertyType: [],
      readyStatus: 'all',
      priceMin: 0,
      priceMax: 10000000,
      bedrooms: 'any',
      purpose: 'any',
      sortBy: 'newest',
    });
  };

  const handleSaveSearch = async () => {
    if (!searchName.trim()) {
      toast.error('Please enter a name for this search');
      return;
    }
    await saveSearch(searchName, filters);
    setSearchName('');
    setSaveSearchOpen(false);
  };

  const applySearch = (savedFilters: Record<string, any>) => {
    setFilters(savedFilters as Filters);
    setSavedSearchesOpen(false);
    toast.success('Search filters applied');
  };

  const propertyTypes = [
    { value: 'residential', label: 'Apartment' },
    { value: 'villa', label: 'Villa' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'land', label: 'Land' },
  ];

  const FiltersPanel = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label>Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
            placeholder="Search properties..."
            className="pl-10"
          />
        </div>
      </div>

      {/* City */}
      <div className="space-y-2">
        <Label>City / Area</Label>
        <Select
          value={filters.city}
          onValueChange={(v) => setFilters(f => ({ ...f, city: v === 'all' ? '' : v }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities.map(city => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Property Type */}
      <div className="space-y-3">
        <Label>Property Type</Label>
        <div className="space-y-2">
          {propertyTypes.map(type => (
            <div key={type.value} className="flex items-center space-x-2">
              <Checkbox
                id={type.value}
                checked={filters.propertyType.includes(type.value)}
                onCheckedChange={(checked) => {
                  setFilters(f => ({
                    ...f,
                    propertyType: checked
                      ? [...f.propertyType, type.value]
                      : f.propertyType.filter(t => t !== type.value),
                  }));
                }}
              />
              <Label htmlFor={type.value} className="cursor-pointer">{type.label}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Ready vs Off-plan */}
      <div className="space-y-3">
        <Label>Status</Label>
        <RadioGroup
          value={filters.readyStatus}
          onValueChange={(v) => setFilters(f => ({ ...f, readyStatus: v as any }))}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="status-all" />
            <Label htmlFor="status-all" className="cursor-pointer">All</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ready" id="status-ready" />
            <Label htmlFor="status-ready" className="cursor-pointer">Ready</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="off-plan" id="status-offplan" />
            <Label htmlFor="status-offplan" className="cursor-pointer">Off-plan</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <Label>Price Range: {formatPrice(filters.priceMin)} - {formatPrice(filters.priceMax)}</Label>
        <div className="px-2">
          <Slider
            value={[filters.priceMin, filters.priceMax]}
            onValueChange={([min, max]) => setFilters(f => ({ ...f, priceMin: min, priceMax: max }))}
            min={0}
            max={10000000}
            step={50000}
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div className="space-y-3">
        <Label>Bedrooms</Label>
        <div className="flex flex-wrap gap-2">
          {['any', '1', '2', '3', '4+'].map(beds => (
            <Button
              key={beds}
              variant={filters.bedrooms === beds ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilters(f => ({ ...f, bedrooms: beds }))}
              className="min-w-[40px]"
            >
              {beds === 'any' ? 'Any' : beds}
            </Button>
          ))}
        </div>
      </div>

      {/* Purpose */}
      <div className="space-y-3">
        <Label>Purpose</Label>
        <RadioGroup
          value={filters.purpose}
          onValueChange={(v) => setFilters(f => ({ ...f, purpose: v }))}
        >
          {['any', 'live', 'invest', 'mixed'].map(purpose => (
            <div key={purpose} className="flex items-center space-x-2">
              <RadioGroupItem value={purpose} id={`purpose-${purpose}`} />
              <Label htmlFor={`purpose-${purpose}`} className="capitalize cursor-pointer">{purpose}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Clear Filters */}
      <Button variant="outline" onClick={clearFilters} className="w-full">
        Clear All Filters
      </Button>

      {/* Save Search */}
      {isAuthenticated && (
        <Dialog open={saveSearchOpen} onOpenChange={setSaveSearchOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="w-full gap-2">
              <Bookmark className="w-4 h-4" />
              Save This Search
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Search</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="search-name">Search Name</Label>
              <Input
                id="search-name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="e.g., 3BR in Downtown"
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSaveSearchOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSearch}>
                Save Search
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Properties</h1>
            <p className="text-muted-foreground mt-1">
              {filteredProperties.length} properties found
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Saved Searches */}
            {isAuthenticated && savedSearches.length > 0 && (
              <Dialog open={savedSearchesOpen} onOpenChange={setSavedSearchesOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Bookmark className="w-4 h-4" />
                    <span className="hidden sm:inline">Saved ({savedSearches.length})</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Saved Searches</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2 max-h-64 overflow-y-auto py-2">
                    {savedSearches.map((search) => (
                      <div
                        key={search.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <button
                          onClick={() => applySearch(search.filters)}
                          className="flex-1 text-left font-medium"
                        >
                          {search.name}
                        </button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => deleteSearch(search.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Sort */}
            <Select
              value={filters.sortBy}
              onValueChange={(v) => setFilters(f => ({ ...f, sortBy: v }))}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Filter Button */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FiltersPanel />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-card rounded-xl p-6 border border-border sticky top-24">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h3>
              <FiltersPanel />
            </div>
          </aside>

          {/* Properties Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-card rounded-xl overflow-hidden border border-border animate-pulse">
                    <div className="h-48 bg-muted" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                      <div className="h-6 bg-muted rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-16">
                <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">No Properties Found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters to find more properties
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid sm:grid-cols-2 xl:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {filteredProperties.map(property => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    viewMode={viewMode}
                    isComparing={!!compareList.find(p => p.id === property.id)}
                    onToggleCompare={() => toggleCompare(property)}
                    onAskPropertyX={() => handleAskPropertyX(property)}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Compare Tray */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-40 animate-slide-up">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 overflow-x-auto pb-2">
                <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
                  Compare ({compareList.length}/4):
                </span>
                {compareList.map(property => (
                  <div
                    key={property.id}
                    className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 min-w-max"
                  >
                    <img
                      src={property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100'}
                      alt={property.title}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <span className="text-sm font-medium max-w-[120px] truncate">
                      {property.title}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => toggleCompare(property)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCompareList([])}
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    // Store compare list and navigate
                    localStorage.setItem('compare_properties', JSON.stringify(compareList.map(p => p.id)));
                    navigate('/compare');
                  }}
                  disabled={compareList.length < 2}
                >
                  <Scale className="w-4 h-4 mr-2" />
                  Compare
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={compareList.length > 0 ? 'pb-20' : ''}>
        <Footer />
      </div>
    </div>
  );
};

// Property Card Component
interface PropertyCardProps {
  property: Property;
  viewMode: 'grid' | 'list';
  isComparing: boolean;
  onToggleCompare: () => void;
  onAskPropertyX: () => void;
  formatPrice: (price: number) => string;
}

const PropertyCard = ({ 
  property, 
  viewMode, 
  isComparing, 
  onToggleCompare, 
  onAskPropertyX,
  formatPrice 
}: PropertyCardProps) => {
  const imageUrl = property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800';
  
  if (viewMode === 'list') {
    return (
      <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col sm:flex-row hover:shadow-lg transition-shadow">
        <div className="sm:w-64 h-48 sm:h-auto flex-shrink-0">
          <img
            src={imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs capitalize">
                  {property.property_type}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Ready
                </Badge>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">{property.title}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                <MapPin className="w-4 h-4" />
                {property.area}, {property.city}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Bed className="w-4 h-4" /> {property.bedrooms}
                </span>
                <span className="flex items-center gap-1">
                  <Bath className="w-4 h-4" /> {property.bathrooms}
                </span>
                <span className="flex items-center gap-1">
                  <Square className="w-4 h-4" /> {property.area}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{formatPrice(property.price)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-4 border-t border-border">
            <Link to={`/property/${property.id}`}>
              <Button size="sm">
                <Eye className="w-4 h-4 mr-1" /> View
              </Button>
            </Link>
            <Button
              size="sm"
              variant={isComparing ? 'secondary' : 'outline'}
              onClick={onToggleCompare}
            >
              <Scale className="w-4 h-4 mr-1" />
              {isComparing ? 'Added' : 'Compare'}
            </Button>
            <Button size="sm" variant="outline" onClick={onAskPropertyX}>
              <Bot className="w-4 h-4 mr-1" /> Ask PropertyX
            </Button>
            <FavoriteButton propertyId={property.id} size="sm" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={property.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-primary/90 text-primary-foreground text-xs capitalize">
            {property.property_type}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Ready
          </Badge>
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          <FavoriteButton 
            propertyId={property.id} 
            size="sm"
            className="h-8 w-8 bg-white/90 hover:bg-white"
          />
          <Button
            size="icon"
            variant={isComparing ? 'secondary' : 'outline'}
            className="h-8 w-8 bg-white/90 hover:bg-white"
            onClick={onToggleCompare}
          >
            <Scale className={`w-4 h-4 ${isComparing ? 'text-primary' : ''}`} />
          </Button>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1">{property.title}</h3>
        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
          <MapPin className="w-4 h-4" />
          {property.area}, {property.city}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Bed className="w-4 h-4" /> {property.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-4 h-4" /> {property.bathrooms}
          </span>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-xl font-bold text-primary">{formatPrice(property.price)}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={onAskPropertyX} className="h-8 w-8 p-0">
              <Bot className="w-4 h-4" />
            </Button>
            <Link to={`/property/${property.id}`}>
              <Button size="sm" className="h-8">
                <Eye className="w-4 h-4 mr-1" /> View
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;