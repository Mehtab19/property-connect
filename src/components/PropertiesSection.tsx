/**
 * Properties Section Component
 * Displays the grid of properties with filtering
 */

import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, X, AlertCircle } from 'lucide-react';
import PropertyCard from './PropertyCard';
import { SAMPLE_PROPERTIES, Property } from '@/data/propertyData';
import { parseExcelFile } from '@/utils/excelParser';
import { useToast } from '@/hooks/use-toast';
const PropertiesSection = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [properties, setProperties] = useState<Property[]>(SAMPLE_PROPERTIES);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    toast
  } = useToast();
  const filters = [{
    value: 'all',
    label: 'All Projects'
  }, {
    value: 'residential',
    label: 'Residential'
  }, {
    value: 'commercial',
    label: 'Commercial'
  }, {
    value: 'luxury',
    label: 'Luxury'
  }, {
    value: 'construction',
    label: 'Under Construction'
  }];

  // Filter properties based on active filter
  const filteredProperties = activeFilter === 'all' ? properties : properties.filter(p => p.type === activeFilter);

  // Handle Excel file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', '.xlsx', '.xls'];
    const isValidType = validTypes.some(type => file.type === type || file.name.endsWith('.xlsx') || file.name.endsWith('.xls'));
    if (!isValidType) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an Excel file (.xlsx or .xls)",
        variant: "destructive"
      });
      return;
    }
    setIsUploading(true);
    try {
      const parsedProperties = await parseExcelFile(file);
      if (parsedProperties.length === 0) {
        throw new Error('No properties found in the Excel file.');
      }
      setProperties(parsedProperties);
      setUploadedFileName(file.name);
      toast({
        title: "Success!",
        description: `Loaded ${parsedProperties.length} properties from ${file.name}`
      });
    } catch (error) {
      toast({
        title: "Error Loading File",
        description: error instanceof Error ? error.message : "Failed to parse Excel file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Reset to sample data
  const resetToSampleData = () => {
    setProperties(SAMPLE_PROPERTIES);
    setUploadedFileName(null);
    toast({
      title: "Data Reset",
      description: "Showing sample property data"
    });
  };
  return <section id="properties" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="section-title">
          <h2>Verified Projects</h2>
          <p>
            Explore our curated selection of investment-grade properties that have passed our rigorous due-diligence process.
          </p>
        </div>

        {/* Excel Upload Section */}
        

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {filters.map(filter => <button key={filter.value} onClick={() => setActiveFilter(filter.value)} className={`filter-btn ${activeFilter === filter.value ? 'active' : ''}`}>
              {filter.label}
            </button>)}
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map(property => <PropertyCard key={property.id} property={property} />)}
          </div> : <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary mb-2">No Properties Found</h3>
            <p className="text-muted-foreground">
              No properties match the selected filter. Try selecting a different category.
            </p>
          </div>}
      </div>
    </section>;
};
export default PropertiesSection;