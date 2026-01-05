import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Plus, X, TrendingUp, AlertTriangle, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SAMPLE_PROPERTIES } from '@/data/propertyData';

interface ComparisonMetric {
  label: string;
  key: string;
  format: (value: any) => string;
  better: 'higher' | 'lower' | 'none';
}

const comparisonMetrics: ComparisonMetric[] = [
  { label: 'Price', key: 'price', format: (v) => v, better: 'lower' },
  { label: 'Bedrooms', key: 'bedrooms', format: (v) => `${v} BHK`, better: 'higher' },
  { label: 'Bathrooms', key: 'bathrooms', format: (v) => `${v}`, better: 'higher' },
  { label: 'Area', key: 'area', format: (v) => v, better: 'higher' },
  { label: 'Location', key: 'location', format: (v) => v, better: 'none' },
  { label: 'Type', key: 'type', format: (v) => v, better: 'none' },
  { label: 'AI Score', key: 'aiScore', format: (v) => `${v}/10`, better: 'higher' },
  { label: 'Expected ROI', key: 'expectedRoi', format: (v) => v, better: 'higher' },
];

const CompareProperties = () => {
  const navigate = useNavigate();
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const selectedPropertyData = selectedProperties
    .map(id => SAMPLE_PROPERTIES.find(p => p.id === id))
    .filter(Boolean);

  const addProperty = (propertyId: string) => {
    if (selectedProperties.length < 4 && !selectedProperties.includes(propertyId)) {
      setSelectedProperties([...selectedProperties, propertyId]);
    }
  };

  const removeProperty = (propertyId: string) => {
    setSelectedProperties(selectedProperties.filter(id => id !== propertyId));
    setAiAnalysis(null);
  };

  const availableProperties = SAMPLE_PROPERTIES.filter(
    p => !selectedProperties.includes(p.id)
  );

  const getComparisonClass = (metric: ComparisonMetric, value: any, allValues: any[]) => {
    if (metric.better === 'none' || allValues.length < 2) return '';
    
    const numericValues = allValues.map(v => {
      if (typeof v === 'string') {
        const match = v.match(/[\d.]+/);
        return match ? parseFloat(match[0]) : 0;
      }
      return v;
    });
    
    const currentNumeric = typeof value === 'string' 
      ? parseFloat(value.match(/[\d.]+/)?.[0] || '0') 
      : value;
    
    const isBest = metric.better === 'higher' 
      ? currentNumeric === Math.max(...numericValues)
      : currentNumeric === Math.min(...numericValues);
    
    return isBest ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : '';
  };

  const requestAiComparison = async () => {
    if (selectedPropertyData.length < 2) return;
    
    setIsAnalyzing(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Compare these properties and provide investment analysis:\n${JSON.stringify(selectedPropertyData, null, 2)}\n\nProvide ROI estimates, risk assessment, and a clear recommendation on which property offers the best value.`
          }],
          analysisMode: 'comparison'
        }),
      });

      if (!resp.ok || !resp.body) throw new Error('Failed to get analysis');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let analysis = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const parsed = JSON.parse(line.slice(6));
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                analysis += content;
                setAiAnalysis(analysis);
              }
            } catch {}
          }
        }
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setAiAnalysis('Unable to generate analysis at this time. Please try again later.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Scale className="h-8 w-8 text-primary" />
              Compare Properties
            </h1>
            <p className="text-muted-foreground mt-1">
              Select up to 4 properties to compare side-by-side with AI-powered analysis
            </p>
          </div>
        </div>

        {/* Property Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Properties to Compare ({selectedProperties.length}/4)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              onValueChange={addProperty}
              disabled={selectedProperties.length >= 4}
            >
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Select a property to add..." />
              </SelectTrigger>
              <SelectContent>
                {availableProperties.map(property => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.title} - {property.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Comparison Table */}
        {selectedPropertyData.length > 0 ? (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Property Comparison</CardTitle>
                <Button 
                  onClick={requestAiComparison}
                  disabled={selectedPropertyData.length < 2 || isAnalyzing}
                  className="bg-primary hover:bg-primary/90"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {isAnalyzing ? 'Analyzing...' : 'Get AI Analysis'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <div className="min-w-[600px]">
                  {/* Property Headers */}
                  <div className="grid gap-4" style={{ gridTemplateColumns: `150px repeat(${selectedPropertyData.length}, 1fr)` }}>
                    <div className="font-semibold text-muted-foreground p-3">Property</div>
                    {selectedPropertyData.map(property => (
                      <div key={property!.id} className="relative">
                        <Card className="p-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => removeProperty(property!.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <img 
                            src={property!.imageUrl} 
                            alt={property!.title}
                            className="w-full h-24 object-cover rounded-md mb-2"
                          />
                          <h4 className="font-semibold text-sm truncate">{property!.title}</h4>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {property!.type}
                          </Badge>
                        </Card>
                      </div>
                    ))}
                  </div>

                  {/* Comparison Rows */}
                  {comparisonMetrics.map(metric => {
                    const allValues = selectedPropertyData.map(p => p![metric.key as keyof typeof p]);
                    
                    return (
                      <div 
                        key={metric.key}
                        className="grid gap-4 border-t border-border"
                        style={{ gridTemplateColumns: `150px repeat(${selectedPropertyData.length}, 1fr)` }}
                      >
                        <div className="font-medium text-muted-foreground p-3 flex items-center">
                          {metric.label}
                        </div>
                        {selectedPropertyData.map(property => {
                          const value = property![metric.key as keyof typeof property];
                          return (
                            <div 
                              key={property!.id}
                              className={`p-3 flex items-center justify-center text-center rounded-md ${getComparisonClass(metric, value, allValues)}`}
                            >
                              <span className="font-medium">{metric.format(value)}</span>
                              {getComparisonClass(metric, value, allValues).includes('green') && (
                                <Check className="h-4 w-4 text-green-600 ml-2" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardContent className="py-12 text-center">
              <Scale className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Properties Selected</h3>
              <p className="text-muted-foreground">
                Use the selector above to add properties for comparison
              </p>
            </CardContent>
          </Card>
        )}

        {/* AI Analysis */}
        {aiAnalysis && (
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                PropertyX AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                {aiAnalysis}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CompareProperties;
