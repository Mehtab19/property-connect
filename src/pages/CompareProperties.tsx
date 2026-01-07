/**
 * Property Comparison Page
 * Compare 2-4 properties side by side with AI winner recommendation
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Scale, Trophy, ArrowLeft, X, Plus, ChevronRight,
  Bed, Bath, Ruler, MapPin, Calendar, Building2, Bot,
  AlertTriangle, CheckCircle, Sparkles, TrendingUp
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SAMPLE_PROPERTIES, Property } from '@/data/propertyData';
import InvestmentScorecard from '@/components/property-analysis/InvestmentScorecard';
import AnalysisModal, { AnalysisFormData } from '@/components/property-analysis/AnalysisModal';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PropertyAnalysis {
  propertyId: string;
  investmentScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  rentalYield: number;
  appreciationForecast: number;
}

interface WinnerRecommendation {
  winnerId: string;
  reasoning: string;
  keyFactors: string[];
}

const CompareProperties = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [analyses, setAnalyses] = useState<Record<string, PropertyAnalysis>>({});
  const [winner, setWinner] = useState<WinnerRecommendation | null>(null);
  const [isGeneratingWinner, setIsGeneratingWinner] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analysingPropertyId, setAnalysingPropertyId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load properties from URL or localStorage
  useEffect(() => {
    const idsParam = searchParams.get('ids');
    if (idsParam) {
      const ids = idsParam.split(',').filter(id => 
        SAMPLE_PROPERTIES.some(p => p.id === id)
      ).slice(0, 4);
      setSelectedIds(ids);
    } else {
      const stored = localStorage.getItem('compareProperties');
      if (stored) {
        const ids = JSON.parse(stored).filter((id: string) => 
          SAMPLE_PROPERTIES.some(p => p.id === id)
        ).slice(0, 4);
        setSelectedIds(ids);
      }
    }
  }, [searchParams]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('compareProperties', JSON.stringify(selectedIds));
  }, [selectedIds]);

  // Get selected property data
  const selectedProperties = selectedIds
    .map(id => SAMPLE_PROPERTIES.find(p => p.id === id))
    .filter(Boolean) as Property[];

  const availableProperties = SAMPLE_PROPERTIES.filter(
    p => !selectedIds.includes(p.id)
  );

  const addProperty = (id: string) => {
    if (selectedIds.length < 4 && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
      setWinner(null);
    }
  };

  const removeProperty = (id: string) => {
    setSelectedIds(selectedIds.filter(i => i !== id));
    setWinner(null);
    // Remove analysis too
    const newAnalyses = { ...analyses };
    delete newAnalyses[id];
    setAnalyses(newAnalyses);
  };

  const handleRunAnalysis = (propertyId: string) => {
    setAnalysingPropertyId(propertyId);
    setShowAnalysisModal(true);
  };

  const handleAnalysisSubmit = async (formData: AnalysisFormData) => {
    if (!analysingPropertyId) return;
    
    const property = SAMPLE_PROPERTIES.find(p => p.id === analysingPropertyId);
    if (!property) return;

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('property-analysis', {
        body: {
          property: {
            id: property.id,
            name: property.name,
            price: property.price,
            location: property.location,
            city: property.city,
            country: property.country,
            type: property.type,
            status: property.status,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            area: property.area,
            developer: property.developer,
            aiScore: property.aiScore,
            expectedRoi: property.expectedRoi,
            features: property.features,
            amenities: property.amenities,
          },
          userContext: formData,
        },
      });

      if (error) throw error;

      const analysis: PropertyAnalysis = {
        propertyId: property.id,
        investmentScore: data.investmentScore || Math.round(property.aiScore * 10),
        riskLevel: (data.riskLevel?.toLowerCase() || 'medium') as 'low' | 'medium' | 'high',
        confidence: data.confidence || 0.75,
        rentalYield: data.rentalYield || 3.5,
        appreciationForecast: data.appreciationForecast || 8,
      };

      setAnalyses(prev => ({ ...prev, [property.id]: analysis }));
      setShowAnalysisModal(false);
      toast.success(`Analysis complete for ${property.name}`);

    } catch (err) {
      console.error('Analysis error:', err);
      toast.error('Failed to generate analysis');
    } finally {
      setIsAnalyzing(false);
      setAnalysingPropertyId(null);
    }
  };

  const generateWinnerRecommendation = async () => {
    if (selectedProperties.length < 2) {
      toast.error('Select at least 2 properties to compare');
      return;
    }

    setIsGeneratingWinner(true);

    try {
      // Build comparison data
      const comparisonData = selectedProperties.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        location: `${p.location}, ${p.city}`,
        type: p.type,
        status: p.status,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        area: p.area,
        aiScore: p.aiScore,
        expectedRoi: p.expectedRoi,
        analysis: analyses[p.id] || null,
      }));

      // Use edge function for AI comparison
      const { data, error } = await supabase.functions.invoke('property-analysis', {
        body: {
          comparisonMode: true,
          properties: comparisonData,
        },
      });

      if (error) throw error;

      // Determine winner based on analysis or AI response
      let winnerId = data.winnerId;
      let reasoning = data.reasoning;
      let keyFactors = data.keyFactors;

      // Fallback: use highest AI score if no response
      if (!winnerId) {
        const sortedByScore = [...selectedProperties].sort((a, b) => b.aiScore - a.aiScore);
        winnerId = sortedByScore[0].id;
        reasoning = `Based on our AI analysis, ${sortedByScore[0].name} offers the best overall value with an AI score of ${sortedByScore[0].aiScore}/10 and expected ROI of ${sortedByScore[0].expectedRoi}.`;
        keyFactors = [
          'Highest investment score',
          'Best projected returns',
          'Location advantages'
        ];
      }

      setWinner({
        winnerId,
        reasoning: reasoning || 'This property offers the best combination of value, location, and investment potential.',
        keyFactors: keyFactors || ['Best value proposition', 'Strong market position', 'Growth potential'],
      });

      // Save comparison to database if authenticated
      if (isAuthenticated && user) {
        try {
          await supabase.from('property_comparisons').insert([{
            user_id: user.id,
            property_ids: selectedIds,
            comparison_data: JSON.parse(JSON.stringify({
              winner_id: winnerId,
              reasoning,
              key_factors: keyFactors,
              properties: comparisonData,
            })),
          }]);
        } catch (dbError) {
          console.error('Failed to save comparison:', dbError);
        }
      }

    } catch (err) {
      console.error('Winner generation error:', err);
      // Fallback to simple comparison
      const sortedByScore = [...selectedProperties].sort((a, b) => b.aiScore - a.aiScore);
      setWinner({
        winnerId: sortedByScore[0].id,
        reasoning: `${sortedByScore[0].name} has the highest AI score (${sortedByScore[0].aiScore}/10) among the compared properties.`,
        keyFactors: ['Highest AI score', 'Best expected ROI', 'Market positioning'],
      });
    } finally {
      setIsGeneratingWinner(false);
    }
  };

  const winnerProperty = winner ? selectedProperties.find(p => p.id === winner.winnerId) : null;

  const isOffPlan = (property: Property) => 
    property.status === 'Under Construction' || property.completionMonths > 0;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Scale className="w-8 h-8 text-primary" />
              Compare Properties
            </h1>
            <p className="text-muted-foreground mt-1">
              Select 2-4 properties to compare side by side
            </p>
          </div>

          {selectedProperties.length >= 2 && (
            <Button
              onClick={generateWinnerRecommendation}
              disabled={isGeneratingWinner}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {isGeneratingWinner ? 'Analyzing...' : 'Find Winner'}
            </Button>
          )}
        </div>

        {/* Winner Recommendation Panel */}
        {winner && winnerProperty && (
          <Card className="mb-8 border-2 border-primary bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-primary">
                <Trophy className="w-6 h-6 text-yellow-500" />
                PropertyX Winner Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={winnerProperty.imageUrl}
                    alt={winnerProperty.name}
                    className="w-full md:w-48 h-32 rounded-lg object-cover ring-4 ring-primary/30"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-foreground">{winnerProperty.name}</h3>
                    <Badge variant="default" className="bg-yellow-500 text-yellow-950">
                      <Trophy className="w-3 h-3 mr-1" />
                      Winner
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">{winner.reasoning}</p>
                  <div className="flex flex-wrap gap-2">
                    {winner.keyFactors.map((factor, i) => (
                      <Badge key={i} variant="secondary" className="gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <Button
                  onClick={() => navigate(`/handoff?propertyId=${winner.winnerId}`)}
                  className="gap-2"
                >
                  Request Viewing for Winner
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Property Selector */}
        {selectedIds.length < 4 && (
          <Card className="mb-6">
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <Plus className="w-5 h-5 text-muted-foreground" />
                <Select onValueChange={addProperty}>
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Add property to compare" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProperties.map(property => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.name} - {property.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">
                  {selectedIds.length}/4 properties selected
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comparison Grid */}
        {selectedProperties.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Scale className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">No Properties Selected</h3>
              <p className="text-muted-foreground mb-6">
                Select properties from the dropdown above to start comparing
              </p>
              <Button onClick={() => navigate('/properties')}>
                Browse Properties
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <div className={cn(
              'grid gap-4 min-w-max',
              selectedProperties.length === 2 && 'grid-cols-2',
              selectedProperties.length === 3 && 'grid-cols-3',
              selectedProperties.length === 4 && 'grid-cols-4',
            )}>
              {selectedProperties.map(property => (
                <Card
                  key={property.id}
                  className={cn(
                    'relative transition-all',
                    winner?.winnerId === property.id && 'ring-2 ring-primary'
                  )}
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => removeProperty(property.id)}
                    className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Winner Badge */}
                  {winner?.winnerId === property.id && (
                    <div className="absolute top-2 left-2 z-10">
                      <Badge className="bg-yellow-500 text-yellow-950">
                        <Trophy className="w-3 h-3 mr-1" />
                        Winner
                      </Badge>
                    </div>
                  )}

                  {/* Property Image */}
                  <div className="h-40 overflow-hidden">
                    <img
                      src={property.imageUrl}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <CardContent className="p-4 space-y-4">
                    {/* Name & Price */}
                    <div>
                      <h3 className="font-bold text-foreground truncate">{property.name}</h3>
                      <p className="text-lg font-semibold text-primary">{property.price}</p>
                    </div>

                    {/* Key Metrics */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="w-4 h-4" />
                        <span className="capitalize">{property.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Bed className="w-4 h-4" />
                        <span>{property.bedrooms} beds</span>
                        <Bath className="w-4 h-4 ml-2" />
                        <span>{property.bathrooms} baths</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Ruler className="w-4 h-4" />
                        <span>{property.area}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{property.location}, {property.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <Badge variant={isOffPlan(property) ? 'secondary' : 'default'} className="text-xs">
                          {isOffPlan(property) ? 'Off-Plan' : 'Ready'}
                        </Badge>
                      </div>
                    </div>

                    {/* Amenities Highlights */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Amenities</p>
                      <div className="flex flex-wrap gap-1">
                        {property.features.slice(0, 3).map((feature, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {property.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{property.features.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Analysis Scorecard or Run Button */}
                    {analyses[property.id] ? (
                      <InvestmentScorecard
                        investmentScore={analyses[property.id].investmentScore}
                        rentalYield={analyses[property.id].rentalYield}
                        appreciationForecast={analyses[property.id].appreciationForecast}
                        riskLevel={analyses[property.id].riskLevel}
                        confidenceScore={Math.round(analyses[property.id].confidence * 100)}
                        className="mt-4"
                      />
                    ) : (
                      <div className="mt-4 p-4 rounded-lg bg-muted/50 text-center">
                        <Bot className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-3">
                          No analysis available
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRunAnalysis(property.id)}
                          className="gap-2"
                        >
                          <TrendingUp className="w-4 h-4" />
                          Run PropertyX Analysis
                        </Button>
                      </div>
                    )}

                    {/* Quick Stats from Sample Data */}
                    <div className="pt-4 border-t border-border">
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <p className="text-xs text-muted-foreground">AI Score</p>
                          <p className="font-bold text-primary">{property.aiScore}/10</p>
                        </div>
                        <div className="p-2 rounded-lg bg-secondary/10">
                          <p className="text-xs text-muted-foreground">Expected ROI</p>
                          <p className="font-bold text-secondary-foreground">{property.expectedRoi}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Analysis Modal */}
      <AnalysisModal
        open={showAnalysisModal}
        onOpenChange={(open) => {
          setShowAnalysisModal(open);
          if (!open) setAnalysingPropertyId(null);
        }}
        onSubmit={handleAnalysisSubmit}
        isLoading={isAnalyzing}
      />
    </div>
  );
};

export default CompareProperties;
