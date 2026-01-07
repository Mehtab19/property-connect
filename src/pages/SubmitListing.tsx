import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Building2, Home, Upload, CheckCircle2, ArrowLeft, X } from 'lucide-react';

type ListingType = 'project' | 'property';

interface ProjectFormData {
  name: string;
  city: string;
  area: string;
  description: string;
  amenities: string;
  expected_completion: string;
  payment_plan: string;
  price_range_min: string;
  price_range_max: string;
  total_units: string;
}

interface PropertyFormData {
  title: string;
  city: string;
  area: string;
  address: string;
  property_type: string;
  bedrooms: string;
  bathrooms: string;
  size: string;
  price: string;
  status: 'ready' | 'off_plan';
  expected_rent: string;
}

const SubmitListing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [listingType, setListingType] = useState<ListingType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // File uploads
  const [brochureFile, setBrochureFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  
  // Project form
  const [projectData, setProjectData] = useState<ProjectFormData>({
    name: '',
    city: '',
    area: '',
    description: '',
    amenities: '',
    expected_completion: '',
    payment_plan: '',
    price_range_min: '',
    price_range_max: '',
    total_units: '',
  });
  
  // Property form
  const [propertyData, setPropertyData] = useState<PropertyFormData>({
    title: '',
    city: '',
    area: '',
    address: '',
    property_type: 'residential',
    bedrooms: '',
    bathrooms: '',
    size: '',
    price: '',
    status: 'ready',
    expected_rent: '',
  });

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    if (!user) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('listing-uploads')
      .upload(fileName, file);
    
    if (error) {
      console.error('Upload error:', error);
      return null;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('listing-uploads')
      .getPublicUrl(fileName);
    
    return publicUrl;
  };

  const handleSubmitProject = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Get developer profile
      const { data: developer } = await supabase
        .from('developers')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      // Upload brochure if exists
      let brochureUrl: string | null = null;
      if (brochureFile) {
        brochureUrl = await uploadFile(brochureFile, 'brochures');
      }
      
      // Parse amenities
      const amenitiesArray = projectData.amenities
        .split(',')
        .map(a => a.trim())
        .filter(a => a.length > 0);
      
      // Parse payment plan JSON
      let paymentPlanData = null;
      if (projectData.payment_plan) {
        try {
          paymentPlanData = JSON.parse(projectData.payment_plan);
        } catch {
          paymentPlanData = { notes: projectData.payment_plan };
        }
      }
      
      // Create project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          name: projectData.name,
          city: projectData.city,
          area: projectData.area || null,
          description: projectData.description || null,
          amenities: amenitiesArray,
          expected_completion: projectData.expected_completion || null,
          price_range_min: projectData.price_range_min ? parseFloat(projectData.price_range_min) : null,
          price_range_max: projectData.price_range_max ? parseFloat(projectData.price_range_max) : null,
          total_units: projectData.total_units ? parseInt(projectData.total_units) : null,
          developer_id: developer?.id || null,
          status: 'upcoming',
          documents: brochureUrl ? [brochureUrl] : [],
        })
        .select()
        .single();
      
      if (projectError) throw projectError;
      
      // Create audit event
      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action: 'listing_submitted',
        entity_type: 'project',
        entity_id: project.id,
        details: {
          listing_type: 'project',
          name: projectData.name,
          city: projectData.city,
          payment_plan: paymentPlanData,
        },
      });
      
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Error submitting project:', error);
      toast({
        title: 'Submission Failed',
        description: error.message || 'Failed to submit listing. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitProperty = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Upload images
      const imageUrls: string[] = [];
      for (const file of imageFiles) {
        const url = await uploadFile(file, 'images');
        if (url) imageUrls.push(url);
      }
      
      // Upload documents
      const documentUrls: string[] = [];
      for (const file of documentFiles) {
        const url = await uploadFile(file, 'documents');
        if (url) documentUrls.push(url);
      }
      
      // Create property
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert({
          user_id: user.id,
          title: propertyData.title,
          city: propertyData.city,
          area: propertyData.size || '0',
          address: propertyData.address,
          property_type: propertyData.property_type,
          bedrooms: parseInt(propertyData.bedrooms) || 0,
          bathrooms: parseInt(propertyData.bathrooms) || 0,
          price: parseFloat(propertyData.price) || 0,
          status: 'pending',
          images: imageUrls,
          documents: documentUrls,
        })
        .select()
        .single();
      
      if (propertyError) throw propertyError;
      
      // Create audit event
      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action: 'listing_submitted',
        entity_type: 'property',
        entity_id: property.id,
        details: {
          listing_type: 'property',
          title: propertyData.title,
          city: propertyData.city,
          property_type: propertyData.property_type,
          ready_status: propertyData.status,
          expected_rent: propertyData.expected_rent || null,
        },
      });
      
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Error submitting property:', error);
      toast({
        title: 'Submission Failed',
        description: error.message || 'Failed to submit listing. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (listingType === 'project') {
      handleSubmitProject();
    } else {
      handleSubmitProperty();
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeDocument = (index: number) => {
    setDocumentFiles(prev => prev.filter((_, i) => i !== index));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Submitted for Approval</CardTitle>
            <CardDescription>
              Your {listingType} listing has been submitted and is pending review by our team.
              You'll be notified once it's approved.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => navigate('/')} className="w-full">
              Return to Home
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsSubmitted(false);
                setListingType(null);
              }}
              className="w-full"
            >
              Submit Another Listing
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Submit New Listing</h1>
          <p className="text-muted-foreground">
            Create a new project or property listing for approval
          </p>
        </div>

        {!listingType ? (
          <div className="grid md:grid-cols-2 gap-6">
            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => setListingType('project')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Project</CardTitle>
                <CardDescription>
                  Submit a new development project with multiple units, amenities, and payment plans
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => setListingType('property')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Home className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Property</CardTitle>
                <CardDescription>
                  Submit an individual property listing with details, images, and documents
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {listingType === 'project' ? (
                      <Building2 className="h-6 w-6 text-primary" />
                    ) : (
                      <Home className="h-6 w-6 text-primary" />
                    )}
                    <CardTitle>
                      {listingType === 'project' ? 'Project Details' : 'Property Details'}
                    </CardTitle>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setListingType(null)}
                  >
                    Change Type
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {listingType === 'project' ? (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Project Name *</Label>
                        <Input
                          id="name"
                          value={projectData.name}
                          onChange={(e) => setProjectData(p => ({ ...p, name: e.target.value }))}
                          placeholder="e.g., Skyline Residences"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={projectData.city}
                          onChange={(e) => setProjectData(p => ({ ...p, city: e.target.value }))}
                          placeholder="e.g., Dubai"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="area">Area</Label>
                      <Input
                        id="area"
                        value={projectData.area}
                        onChange={(e) => setProjectData(p => ({ ...p, area: e.target.value }))}
                        placeholder="e.g., Downtown"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={projectData.description}
                        onChange={(e) => setProjectData(p => ({ ...p, description: e.target.value }))}
                        placeholder="Describe the project..."
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                      <Input
                        id="amenities"
                        value={projectData.amenities}
                        onChange={(e) => setProjectData(p => ({ ...p, amenities: e.target.value }))}
                        placeholder="e.g., Pool, Gym, Parking, Security"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expected_completion">Handover Date</Label>
                        <Input
                          id="expected_completion"
                          type="date"
                          value={projectData.expected_completion}
                          onChange={(e) => setProjectData(p => ({ ...p, expected_completion: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="total_units">Total Units</Label>
                        <Input
                          id="total_units"
                          type="number"
                          value={projectData.total_units}
                          onChange={(e) => setProjectData(p => ({ ...p, total_units: e.target.value }))}
                          placeholder="e.g., 200"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price_range_min">Price Range Min</Label>
                        <Input
                          id="price_range_min"
                          type="number"
                          value={projectData.price_range_min}
                          onChange={(e) => setProjectData(p => ({ ...p, price_range_min: e.target.value }))}
                          placeholder="e.g., 500000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price_range_max">Price Range Max</Label>
                        <Input
                          id="price_range_max"
                          type="number"
                          value={projectData.price_range_max}
                          onChange={(e) => setProjectData(p => ({ ...p, price_range_max: e.target.value }))}
                          placeholder="e.g., 2000000"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payment_plan">Payment Plan (JSON or description)</Label>
                      <Textarea
                        id="payment_plan"
                        value={projectData.payment_plan}
                        onChange={(e) => setProjectData(p => ({ ...p, payment_plan: e.target.value }))}
                        placeholder='e.g., {"booking": "10%", "construction": "50%", "handover": "40%"}'
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Brochure Upload</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setBrochureFile(e.target.files?.[0] || null)}
                          className="hidden"
                          id="brochure-upload"
                        />
                        <label htmlFor="brochure-upload" className="cursor-pointer">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            {brochureFile ? brochureFile.name : 'Click to upload brochure (PDF, DOC)'}
                          </p>
                        </label>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={propertyData.title}
                        onChange={(e) => setPropertyData(p => ({ ...p, title: e.target.value }))}
                        placeholder="e.g., Luxury 3BR Apartment in Marina"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="prop-city">City *</Label>
                        <Input
                          id="prop-city"
                          value={propertyData.city}
                          onChange={(e) => setPropertyData(p => ({ ...p, city: e.target.value }))}
                          placeholder="e.g., Dubai"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prop-area">Area *</Label>
                        <Input
                          id="prop-area"
                          value={propertyData.area}
                          onChange={(e) => setPropertyData(p => ({ ...p, area: e.target.value }))}
                          placeholder="e.g., Marina"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        value={propertyData.address}
                        onChange={(e) => setPropertyData(p => ({ ...p, address: e.target.value }))}
                        placeholder="Full property address"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="property_type">Property Type</Label>
                        <Select
                          value={propertyData.property_type}
                          onValueChange={(value) => setPropertyData(p => ({ ...p, property_type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="residential">Residential</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                            <SelectItem value="villa">Villa</SelectItem>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="penthouse">Penthouse</SelectItem>
                            <SelectItem value="townhouse">Townhouse</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={propertyData.status}
                          onValueChange={(value: 'ready' | 'off_plan') => setPropertyData(p => ({ ...p, status: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ready">Ready</SelectItem>
                            <SelectItem value="off_plan">Off-Plan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <Input
                          id="bedrooms"
                          type="number"
                          value={propertyData.bedrooms}
                          onChange={(e) => setPropertyData(p => ({ ...p, bedrooms: e.target.value }))}
                          placeholder="e.g., 3"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bathrooms">Bathrooms</Label>
                        <Input
                          id="bathrooms"
                          type="number"
                          value={propertyData.bathrooms}
                          onChange={(e) => setPropertyData(p => ({ ...p, bathrooms: e.target.value }))}
                          placeholder="e.g., 2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="size">Size (sqft)</Label>
                        <Input
                          id="size"
                          type="number"
                          value={propertyData.size}
                          onChange={(e) => setPropertyData(p => ({ ...p, size: e.target.value }))}
                          placeholder="e.g., 1500"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={propertyData.price}
                          onChange={(e) => setPropertyData(p => ({ ...p, price: e.target.value }))}
                          placeholder="e.g., 1500000"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expected_rent">Expected Rent (optional)</Label>
                        <Input
                          id="expected_rent"
                          type="number"
                          value={propertyData.expected_rent}
                          onChange={(e) => setPropertyData(p => ({ ...p, expected_rent: e.target.value }))}
                          placeholder="e.g., 8000"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Images Upload</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => setImageFiles(prev => [...prev, ...Array.from(e.target.files || [])])}
                          className="hidden"
                          id="images-upload"
                        />
                        <label htmlFor="images-upload" className="cursor-pointer">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload images
                          </p>
                        </label>
                      </div>
                      {imageFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {imageFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm">
                              {file.name}
                              <button type="button" onClick={() => removeImage(index)}>
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Documents Upload</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          multiple
                          onChange={(e) => setDocumentFiles(prev => [...prev, ...Array.from(e.target.files || [])])}
                          className="hidden"
                          id="docs-upload"
                        />
                        <label htmlFor="docs-upload" className="cursor-pointer">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload documents (PDF, DOC)
                          </p>
                        </label>
                      </div>
                      {documentFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {documentFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm">
                              {file.name}
                              <button type="button" onClick={() => removeDocument(index)}>
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
                </Button>
              </CardContent>
            </Card>
          </form>
        )}
      </div>
    </div>
  );
};

export default SubmitListing;
