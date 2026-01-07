import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  UserCheck, 
  ArrowLeft, 
  Building, 
  DollarSign, 
  MapPin, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Sparkles,
  MessageSquare,
  Home,
  Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HandoffForm from '@/components/HandoffForm';
import { useAuth } from '@/hooks/useAuth';
import { useHandoff, HandoffContext, AssignedAgent } from '@/hooks/useHandoff';
import { supabase } from '@/integrations/supabase/client';

interface PropertyInfo {
  id: string;
  title: string;
  price: number;
  city: string;
  area: string;
  property_type: string;
}

interface ConversationData {
  id: string;
  title: string;
  context: Record<string, any>;
  messages: Array<{ role: string; content: string }>;
}

interface AIGeneratedSummary {
  userIntent: string;
  budget: string;
  preferredLocation: string;
  selectedProperties: string[];
  financingNeeds: string;
  topRisks: string[];
  nextSteps: string[];
}

const Handoff = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { generateAISummary } = useHandoff();
  const [searchParams] = useSearchParams();
  
  const [property, setProperty] = useState<PropertyInfo | null>(null);
  const [conversation, setConversation] = useState<ConversationData | null>(null);
  const [aiSummary, setAiSummary] = useState<AIGeneratedSummary | null>(null);
  const [shortlist, setShortlist] = useState<PropertyInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [leadCreated, setLeadCreated] = useState(false);
  const [createdLeadId, setCreatedLeadId] = useState<string | null>(null);
  const [assignedAgent, setAssignedAgent] = useState<AssignedAgent | null>(null);
  
  const propertyId = searchParams.get('propertyId');
  const conversationId = searchParams.get('conversationId');
  const trigger = searchParams.get('trigger') || 'userRequested';
  const shortlistParam = searchParams.get('shortlist');

  // Load property context
  useEffect(() => {
    const loadProperty = async () => {
      if (!propertyId) return;

      try {
        const { data, error } = await supabase
          .from('properties')
          .select('id, title, price, city, area, property_type')
          .eq('id', propertyId)
          .single();

        if (!error && data) {
          setProperty(data);
        }
      } catch (error) {
        console.error('Error loading property:', error);
      }
    };

    loadProperty();
  }, [propertyId]);

  // Load conversation and generate AI summary
  useEffect(() => {
    const loadConversation = async () => {
      if (!conversationId || !user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        // Load conversation
        const { data: convData, error: convError } = await supabase
          .from('conversations')
          .select('id, title, context')
          .eq('id', conversationId)
          .eq('user_id', user.id)
          .single();

        if (convError) throw convError;

        // Load messages
        const { data: msgData, error: msgError } = await supabase
          .from('messages')
          .select('role, content')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (msgError) throw msgError;

        const conversationData: ConversationData = {
          id: convData.id,
          title: convData.title || 'Chat Session',
          context: (convData.context as Record<string, any>) || {},
          messages: msgData || [],
        };

        setConversation(conversationData);

        // Generate AI summary from conversation
        const summary = generateEnhancedSummary(conversationData);
        setAiSummary(summary);
      } catch (error) {
        console.error('Error loading conversation:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversation();
  }, [conversationId, user?.id]);

  // Load shortlist properties
  useEffect(() => {
    const loadShortlist = async () => {
      if (!shortlistParam) return;

      try {
        const ids = shortlistParam.split(',');
        const { data, error } = await supabase
          .from('properties')
          .select('id, title, price, city, area, property_type')
          .in('id', ids);

        if (!error && data) {
          setShortlist(data);
        }
      } catch (error) {
        console.error('Error loading shortlist:', error);
      }
    };

    loadShortlist();
  }, [shortlistParam]);

  // Generate enhanced AI summary from conversation
  const generateEnhancedSummary = (conv: ConversationData): AIGeneratedSummary => {
    const messages = conv.messages || [];
    const userMessages = messages.filter(m => m.role === 'user').map(m => m.content);
    const allText = userMessages.join(' ').toLowerCase();

    // Extract user intent
    let userIntent = 'Property inquiry';
    if (allText.includes('invest') || allText.includes('roi') || allText.includes('rental')) {
      userIntent = 'Investment opportunity assessment';
    } else if (allText.includes('buy') || allText.includes('purchase') || allText.includes('home')) {
      userIntent = 'Home purchase for personal use';
    } else if (allText.includes('rent') && !allText.includes('rental yield')) {
      userIntent = 'Rental property search';
    } else if (allText.includes('viewing') || allText.includes('visit')) {
      userIntent = 'Property site visit request';
    } else if (allText.includes('negotiat')) {
      userIntent = 'Price negotiation assistance';
    } else if (allText.includes('mortgage') || allText.includes('loan') || allText.includes('financing')) {
      userIntent = 'Mortgage/financing consultation';
    }

    // Extract budget
    let budget = 'Not specified';
    const budgetPatterns = [
      /(?:budget|afford|spend|looking for|range)[:\s]*(?:pkr|rs\.?|₨)?[\s]*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:to|-)\s*(?:pkr|rs\.?)?[\s]*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:lac|lakh|crore|cr|million|m)?/gi,
      /(?:budget|afford|spend)[:\s]*(?:pkr|rs\.?|₨)?[\s]*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:lac|lakh|crore|cr|million|m)?/gi,
      /(\d+(?:,\d+)*)\s*(?:lac|lakh|crore|cr)\s*(?:to|-)\s*(\d+(?:,\d+)*)\s*(?:lac|lakh|crore|cr)?/gi,
    ];
    for (const pattern of budgetPatterns) {
      const match = pattern.exec(allText);
      if (match) {
        budget = match[0].replace(/budget|afford|spend|looking for|range/gi, '').trim();
        break;
      }
    }

    // Extract preferred location
    const cities = ['karachi', 'lahore', 'islamabad', 'rawalpindi', 'faisalabad', 'multan'];
    const areas = ['dha', 'bahria', 'gulberg', 'clifton', 'defence', 'f-7', 'f-8', 'e-11', 'bahria town'];
    const foundLocations: string[] = [];
    
    for (const city of cities) {
      if (allText.includes(city)) {
        foundLocations.push(city.charAt(0).toUpperCase() + city.slice(1));
      }
    }
    for (const area of areas) {
      if (allText.includes(area)) {
        foundLocations.push(area.toUpperCase());
      }
    }
    const preferredLocation = foundLocations.length > 0 ? foundLocations.join(', ') : 'Not specified';

    // Extract financing needs
    let financingNeeds = 'Not discussed';
    if (allText.includes('cash') && !allText.includes('mortgage')) {
      financingNeeds = 'Cash purchase - no financing needed';
    } else if (allText.includes('mortgage') || allText.includes('home loan') || allText.includes('bank loan')) {
      financingNeeds = 'Requires mortgage/bank financing';
    } else if (allText.includes('emi') || allText.includes('installment')) {
      financingNeeds = 'Prefers installment plan';
    } else if (allText.includes('pre-approv')) {
      financingNeeds = 'Seeking pre-approval';
    } else if (allText.includes('islamic') || allText.includes('shariah')) {
      financingNeeds = 'Prefers Islamic/Shariah-compliant financing';
    }

    // Extract risks mentioned
    const topRisks: string[] = [];
    if (allText.includes('delay') || allText.includes('construction')) {
      topRisks.push('Construction/delivery timeline concerns');
    }
    if (allText.includes('developer') && (allText.includes('trust') || allText.includes('reliable'))) {
      topRisks.push('Developer credibility verification needed');
    }
    if (allText.includes('legal') || allText.includes('title') || allText.includes('documentation')) {
      topRisks.push('Legal/documentation verification required');
    }
    if (allText.includes('market') && (allText.includes('down') || allText.includes('crash') || allText.includes('risk'))) {
      topRisks.push('Market volatility concerns');
    }
    if (allText.includes('first time') || allText.includes('never bought')) {
      topRisks.push('First-time buyer - needs guidance');
    }
    if (allText.includes('urgent') || allText.includes('asap') || allText.includes('quickly')) {
      topRisks.push('Urgent timeline - may need expedited process');
    }
    if (topRisks.length === 0) {
      topRisks.push('Standard due diligence recommended');
    }

    // Determine next steps
    const nextSteps: string[] = [];
    if (userIntent.includes('site visit')) {
      nextSteps.push('Schedule property viewing');
    }
    if (userIntent.includes('negotiation')) {
      nextSteps.push('Prepare negotiation strategy');
      nextSteps.push('Get latest market comparables');
    }
    if (financingNeeds.includes('mortgage') || financingNeeds.includes('financing')) {
      nextSteps.push('Connect with mortgage partner for pre-approval');
    }
    if (topRisks.some(r => r.includes('Legal'))) {
      nextSteps.push('Verify property documentation');
    }
    nextSteps.push('Assign dedicated agent');
    nextSteps.push('Follow up within 24 hours');

    return {
      userIntent,
      budget,
      preferredLocation,
      selectedProperties: property ? [property.title] : [],
      financingNeeds,
      topRisks,
      nextSteps,
    };
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `PKR ${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `PKR ${(price / 100000).toFixed(2)} Lac`;
    }
    return `PKR ${price.toLocaleString()}`;
  };

  const getHandoffContext = (): HandoffContext => {
    const chatHistory = conversation?.messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })) || [];

    return {
      conversationHistory: chatHistory,
      propertyId: property?.id,
      propertyTitle: property?.title,
      propertyLocation: property ? `${property.area}, ${property.city}` : undefined,
      propertyType: property?.property_type,
      propertyArea: property?.area,
      shortlistIds: shortlist.map(p => p.id),
    };
  };

  const getFullAISummary = (): string => {
    if (!aiSummary) return 'User requested human assistance';

    const parts: string[] = [];
    
    parts.push(`**User Intent:** ${aiSummary.userIntent}`);
    parts.push(`**Budget:** ${aiSummary.budget}`);
    parts.push(`**Preferred Location:** ${aiSummary.preferredLocation}`);
    
    if (aiSummary.selectedProperties.length > 0 || shortlist.length > 0) {
      const properties = [...aiSummary.selectedProperties, ...shortlist.map(p => p.title)];
      parts.push(`**Selected Properties:** ${properties.join(', ')}`);
    }
    
    parts.push(`**Financing Needs:** ${aiSummary.financingNeeds}`);
    
    if (aiSummary.topRisks.length > 0) {
      parts.push(`**Risk Flags:**\n${aiSummary.topRisks.map(r => `• ${r}`).join('\n')}`);
    }
    
    if (aiSummary.nextSteps.length > 0) {
      parts.push(`**Recommended Next Steps:**\n${aiSummary.nextSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`);
    }

    return parts.join('\n\n');
  };

  const handleSuccess = (leadId: string, agent?: AssignedAgent) => {
    setLeadCreated(true);
    setCreatedLeadId(leadId);
    setAssignedAgent(agent || null);
  };

  if (leadCreated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
            <CardContent className="py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">Request Submitted Successfully!</h2>
              
              {/* Assigned Agent Info */}
              {assignedAgent && (
                <div className="bg-muted/50 rounded-lg p-4 mb-6 mx-auto max-w-sm">
                  <p className="text-sm text-muted-foreground mb-3">Your assigned agent:</p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCheck className="h-7 w-7 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-lg">{assignedAgent.name || 'Property Expert'}</p>
                      {assignedAgent.agencyName && (
                        <p className="text-sm text-muted-foreground">{assignedAgent.agencyName}</p>
                      )}
                      {assignedAgent.rating && (
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{assignedAgent.rating.toFixed(1)}</span>
                          <span className="text-muted-foreground">rating</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <p className="text-muted-foreground mb-2">
                {assignedAgent?.name 
                  ? `${assignedAgent.name} will contact you within 24 hours via your preferred channel.`
                  : 'Your request has been assigned to a verified agent who specializes in your area of interest.'}
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Reference: <span className="font-mono font-medium">{createdLeadId?.slice(0, 8)}</span>
              </p>
              
              <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-semibold mb-2">What happens next?</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{assignedAgent?.name || 'An agent'} will contact you within 24 hours via your preferred channel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>They'll have full context of your conversation and requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Continue exploring properties or chat with PropertyX anytime</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate('/properties')}>
                  <Building className="w-4 h-4 mr-2" />
                  Browse Properties
                </Button>
                <Button onClick={() => navigate('/chat')}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Continue Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: AI Summary & Context */}
          <div className="lg:col-span-1 space-y-4">
            {/* AI Summary Card */}
            {aiSummary && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    AI-Generated Summary
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Based on your conversation with PropertyX
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">User Intent</p>
                    <Badge variant="secondary">{aiSummary.userIntent}</Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span><strong>Budget:</strong> {aiSummary.budget}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span><strong>Location:</strong> {aiSummary.preferredLocation}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span><strong>Financing:</strong> {aiSummary.financingNeeds}</span>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Risk Flags
                    </p>
                    <ul className="text-sm space-y-1">
                      {aiSummary.topRisks.map((risk, i) => (
                        <li key={i} className="text-muted-foreground text-xs">• {risk}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Next Steps</p>
                    <ul className="text-sm space-y-1">
                      {aiSummary.nextSteps.slice(0, 3).map((step, i) => (
                        <li key={i} className="text-muted-foreground text-xs">{i + 1}. {step}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Property Context */}
            {property && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Property of Interest
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">{property.title}</h4>
                    <p className="text-xs text-muted-foreground">{property.area}, {property.city}</p>
                    <p className="text-primary font-bold">{formatPrice(property.price)}</p>
                    <Badge variant="outline" className="text-xs capitalize">{property.property_type}</Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Shortlist */}
            {shortlist.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Shortlisted Properties ({shortlist.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-40">
                    <div className="space-y-3">
                      {shortlist.map((prop) => (
                        <div key={prop.id} className="border-b pb-2 last:border-0">
                          <p className="font-medium text-sm">{prop.title}</p>
                          <p className="text-xs text-muted-foreground">{prop.area}, {prop.city}</p>
                          <p className="text-xs text-primary font-medium">{formatPrice(prop.price)}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* No context message */}
            {!property && !conversation && !isLoading && (
              <Card className="bg-muted/50">
                <CardContent className="py-6 text-center">
                  <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No conversation context available. Start a chat with PropertyX to get personalized recommendations.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => navigate('/chat')}
                  >
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Handoff Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-primary" />
                  Connect with a Verified Agent
                </CardTitle>
                <CardDescription>
                  Our experts will review your requirements and contact you shortly
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isAuthenticated ? (
                  <div className="text-center py-8">
                    <UserCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Sign in Required</h3>
                    <p className="text-muted-foreground mb-4">
                      Please sign in to request agent assistance
                    </p>
                    <Button onClick={() => navigate('/auth')}>
                      Sign In
                    </Button>
                  </div>
                ) : (
                  <HandoffForm
                    context={{
                      ...getHandoffContext(),
                      // Override the AI summary with our enhanced version
                    }}
                    triggerReason={trigger}
                    onSuccess={handleSuccess}
                    onCancel={() => navigate(-1)}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Handoff;
