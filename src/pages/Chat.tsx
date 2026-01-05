import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  UserCheck, 
  Sparkles,
  Target,
  TrendingUp,
  AlertTriangle,
  Calculator,
  Building,
  User,
  MapPin,
  DollarSign,
  Home,
  X,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useHandoff, HandoffContext } from '@/hooks/useHandoff';
import HandoffForm from '@/components/HandoffForm';
import HandoffCTA from '@/components/chat/HandoffCTA';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  confidenceScore?: number;
  metadata?: Record<string, any>;
  handoffTrigger?: string;
}

interface PropertyContext {
  id: string;
  title: string;
  price: number;
  city: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  property_type: string;
  status: string;
  description?: string;
  amenities?: string[];
}

interface UserPreferences {
  role: string;
  budget_min?: number;
  budget_max?: number;
  preferred_cities?: string[];
  property_types?: string[];
  target_roi_min?: number;
  risk_tolerance?: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chatbot`;

const QUICK_ACTIONS = [
  { id: 'summarize', label: 'Summarize my goal', icon: Target, prompt: 'Based on our conversation, summarize my property goals and what I\'m looking for.' },
  { id: 'recommend', label: 'Recommend top 5 properties', icon: Building, prompt: 'Based on my preferences and goals, recommend the top 5 properties I should consider and explain why.' },
  { id: 'risks', label: 'Explain risks', icon: AlertTriangle, prompt: 'What are the key risks I should be aware of in my current property search? Consider market conditions, financing, and property-specific factors.' },
  { id: 'roi', label: 'Build ROI scenario', icon: Calculator, prompt: 'Help me build an ROI scenario. Calculate potential returns considering rental yield, appreciation, and total cost of ownership.' },
  { id: 'agent', label: 'Request human agent', icon: UserCheck, prompt: null },
];

const Chat = () => {
  const { toast } = useToast();
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { detectHandoffTrigger, shouldTriggerLowConfidence, initiateHandoff } = useHandoff();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showHandoffForm, setShowHandoffForm] = useState(false);
  const [handoffTrigger, setHandoffTrigger] = useState<string>('userRequested');
  
  const [propertyContext, setPropertyContext] = useState<PropertyContext | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  const propertyId = searchParams.get('propertyId');

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load property context if propertyId is in URL
  useEffect(() => {
    const loadPropertyContext = async () => {
      if (!propertyId) return;

      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .single();

        if (error) throw error;
        
        if (data) {
          setPropertyContext({
            id: data.id,
            title: data.title,
            price: data.price,
            city: data.city,
            area: data.area,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            property_type: data.property_type,
            status: data.status,
            description: data.description || undefined,
            amenities: data.amenities || undefined,
          });

          // Add initial context message
          const welcomeMsg: Message = {
            id: 'welcome',
            content: `Hello! 👋 I'm PropertyX, your AI property advisor. I see you're interested in **${data.title}** in ${data.area}, ${data.city}. 

I can help you analyze this property, understand the financials, compare with alternatives, or answer any questions. What would you like to know?`,
            role: 'assistant',
            timestamp: new Date(),
          };
          setMessages([welcomeMsg]);
        }
      } catch (error) {
        console.error('Error loading property:', error);
      }
    };

    loadPropertyContext();
  }, [propertyId]);

  // Load user preferences
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (!user?.id) return;

      try {
        // Set role
        const prefs: UserPreferences = { role: role || 'buyer' };

        // Load buyer preferences
        if (role === 'buyer') {
          const { data: buyerPrefs } = await supabase
            .from('buyer_preferences')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (buyerPrefs) {
            prefs.budget_min = buyerPrefs.budget_min || undefined;
            prefs.budget_max = buyerPrefs.budget_max || undefined;
            prefs.preferred_cities = buyerPrefs.preferred_cities || undefined;
            prefs.property_types = buyerPrefs.property_types || undefined;
          }
        }

        // Load investor preferences
        if (role === 'investor') {
          const { data: investorPrefs } = await supabase
            .from('investor_preferences')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (investorPrefs) {
            prefs.budget_min = investorPrefs.investment_budget_min || undefined;
            prefs.budget_max = investorPrefs.investment_budget_max || undefined;
            prefs.preferred_cities = investorPrefs.preferred_cities || undefined;
            prefs.property_types = investorPrefs.property_types || undefined;
            prefs.target_roi_min = investorPrefs.target_roi_min || undefined;
            prefs.risk_tolerance = investorPrefs.risk_tolerance || undefined;
          }
        }

        setUserPreferences(prefs);
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    };

    loadUserPreferences();
  }, [user?.id, role]);

  // Create/load conversation
  useEffect(() => {
    const initConversation = async () => {
      if (!user?.id) return;

      try {
        // Create new conversation
        const { data: conv, error } = await supabase
          .from('conversations')
          .insert([{
            user_id: user.id,
            property_id: propertyId || null,
            title: propertyContext?.title || 'New Chat',
            context: propertyContext ? JSON.parse(JSON.stringify({ property: propertyContext, userPreferences })) : {},
          }])
          .select('id')
          .single();

        if (error) throw error;
        setConversationId(conv.id);
      } catch (error) {
        console.error('Error creating conversation:', error);
      }
    };

    if (!conversationId && user?.id) {
      initConversation();
    }
  }, [user?.id, propertyContext, userPreferences, conversationId, propertyId]);

  // Add welcome message if no property context
  useEffect(() => {
    if (!propertyId && messages.length === 0) {
      const welcomeMsg: Message = {
        id: 'welcome',
        content: `Hello! 👋 I'm PropertyX, your AI property advisor. 

I can help you:
• Find properties that match your goals
• Analyze investment potential and risks
• Calculate ROI scenarios
• Compare properties side-by-side
• Connect you with verified agents

What would you like to explore today?`,
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages([welcomeMsg]);
    }
  }, [propertyId, messages.length]);

  // Save message to database
  const saveMessage = async (message: Message) => {
    if (!conversationId) return;

    try {
      await supabase.from('messages').insert({
        conversation_id: conversationId,
        role: message.role,
        content: message.content,
        metadata: message.metadata || {},
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  // Stream chat with AI
  const streamChat = useCallback(async (
    chatMessages: { role: 'user' | 'assistant'; content: string }[],
    onDelta: (text: string) => void,
    onDone: (confidence?: number) => void
  ) => {
    const resp = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ 
        messages: chatMessages,
        propertyContext,
        userPreferences,
      }),
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      if (resp.status === 429) {
        throw new Error(errorData.error || 'Rate limit exceeded. Please wait and try again.');
      }
      if (resp.status === 402) {
        throw new Error(errorData.error || 'AI service temporarily unavailable.');
      }
      throw new Error(errorData.error || 'Failed to get response');
    }

    if (!resp.body) throw new Error('No response body');

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith('\r')) line = line.slice(0, -1);
        if (line.startsWith(':') || line.trim() === '') continue;
        if (!line.startsWith('data: ')) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') {
          onDone();
          return;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + '\n' + textBuffer;
          break;
        }
      }
    }

    onDone();
  }, [propertyContext, userPreferences]);

  // Send message
  const sendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Save user message
    await saveMessage(userMessage);

    // Check for handoff triggers
    const trigger = detectHandoffTrigger(text);
    if (trigger) {
      setHandoffTrigger(trigger);
    }

    // Build conversation history
    const chatHistory = messages
      .filter(m => m.id !== 'welcome')
      .map(m => ({
        role: m.role,
        content: m.content,
      }));
    
    chatHistory.push({ role: 'user', content: text });

    let assistantText = '';
    const botMessageId = (Date.now() + 1).toString();

    // Add empty bot message
    setMessages((prev) => [...prev, {
      id: botMessageId,
      content: '',
      role: 'assistant',
      timestamp: new Date(),
    }]);

    try {
      await streamChat(
        chatHistory,
        (chunk) => {
          assistantText += chunk;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMessageId ? { ...m, content: assistantText } : m
            )
          );
        },
        async () => {
          setIsLoading(false);
          
          // Save assistant message
          const assistantMessage: Message = {
            id: botMessageId,
            content: assistantText,
            role: 'assistant',
            timestamp: new Date(),
          };
          await saveMessage(assistantMessage);

          // Check if response contains analysis - save to property_analyses
          if (assistantText.includes('Investment Score') && propertyId && user?.id) {
            try {
              // Extract score from response (simple pattern match)
              const scoreMatch = assistantText.match(/Investment Score:\s*(\d+)/);
              const yieldMatch = assistantText.match(/Rental Yield:\s*(\d+\.?\d*)%/);
              const riskMatch = assistantText.match(/Risk Level:\s*(Low|Medium|High)/i);

              await supabase.from('property_analyses').insert({
                property_id: propertyId,
                user_id: user.id,
                roi_estimate: scoreMatch ? parseInt(scoreMatch[1]) * 10 : null,
                rental_yield: yieldMatch ? parseFloat(yieldMatch[1]) : null,
                risk_score: riskMatch ? (riskMatch[1].toLowerCase() === 'low' ? 3 : riskMatch[1].toLowerCase() === 'medium' ? 5 : 8) : null,
                ai_summary: assistantText.slice(0, 1000),
              });
            } catch (error) {
              console.error('Error saving analysis:', error);
            }
          }
          
          // If trigger was detected, add handoff CTA message
          if (trigger) {
            setTimeout(() => {
              setMessages((prev) => [...prev, {
                id: `handoff-cta-${Date.now()}`,
                content: '',
                role: 'assistant',
                timestamp: new Date(),
                handoffTrigger: trigger,
              }]);
            }, 500);
          }
        }
      );
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMessageId
            ? { ...m, content: error instanceof Error ? error.message : 'Sorry, I encountered an error. Please try again.' }
            : m
        )
      );
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to get AI response',
      });
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickAction = (action: typeof QUICK_ACTIONS[0]) => {
    if (action.id === 'agent') {
      setHandoffTrigger('userRequested');
      setShowHandoffForm(true);
    } else if (action.prompt) {
      sendMessage(action.prompt);
    }
  };

  const getHandoffContext = useCallback((): HandoffContext => {
    const chatHistory = messages
      .filter(m => m.id !== 'welcome')
      .map(m => ({
        role: m.role,
        content: m.content,
      }));
    
    return {
      conversationHistory: chatHistory,
      propertyId: propertyContext?.id,
      propertyTitle: propertyContext?.title,
      propertyLocation: propertyContext ? `${propertyContext.area}, ${propertyContext.city}` : undefined,
    };
  }, [messages, propertyContext]);

  const handleHandoffSuccess = (leadId: string) => {
    setMessages((prev) => [...prev, {
      id: `handoff-success-${Date.now()}`,
      content: `Great! I've connected you with an agent. They'll reach out to you shortly. Your request reference: ${leadId.slice(0, 8)}`,
      role: 'assistant',
      timestamp: new Date(),
    }]);
    setShowHandoffForm(false);
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.onstop = () => {
          stream.getTracks().forEach((track) => track.stop());
          toast({
            title: '🎤 Voice recorded',
            description: 'Voice-to-text integration coming soon. Please type your message for now.',
          });
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Microphone access denied',
          description: 'Please allow microphone access to use voice input.',
        });
      }
    }
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `PKR ${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `PKR ${(price / 100000).toFixed(2)} Lac`;
    }
    return `PKR ${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex gap-6 h-[calc(100vh-200px)] min-h-[600px]">
          {/* Left: Chat Thread */}
          <div className="flex-1 flex flex-col bg-card rounded-2xl border shadow-sm overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-primary to-secondary p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">PropertyX AI</h3>
                  <p className="text-white/80 text-xs">
                    {isLoading ? 'Thinking...' : 'Your intelligent property advisor'}
                  </p>
                </div>
              </div>
              {propertyContext && (
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  Analyzing: {propertyContext.title}
                </Badge>
              )}
            </div>

            {/* Quick Actions */}
            <div className="p-3 border-b bg-muted/30 flex gap-2 overflow-x-auto">
              {QUICK_ACTIONS.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action)}
                  disabled={isLoading}
                  className="flex-shrink-0 text-xs"
                >
                  <action.icon className="w-3.5 h-3.5 mr-1.5" />
                  {action.label}
                </Button>
              ))}
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {showHandoffForm ? (
                <HandoffForm
                  context={getHandoffContext()}
                  triggerReason={handoffTrigger}
                  onSuccess={handleHandoffSuccess}
                  onCancel={() => setShowHandoffForm(false)}
                />
              ) : (
                <div className="flex flex-col gap-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300',
                        message.role === 'user' ? 'ml-auto' : 'mr-auto',
                        message.handoffTrigger && 'max-w-full'
                      )}
                    >
                      {/* Handoff CTA Card */}
                      {message.handoffTrigger ? (
                        <HandoffCTA
                          trigger={message.handoffTrigger}
                          conversationId={conversationId}
                          propertyId={propertyContext?.id}
                        />
                      ) : (
                        <>
                          <div
                            className={cn(
                              'p-4 rounded-2xl',
                              message.role === 'user'
                                ? 'bg-primary text-primary-foreground rounded-br-md'
                                : 'bg-muted text-foreground rounded-bl-md'
                            )}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                          </div>
                          {message.role === 'assistant' && message.content && (
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => speakMessage(message.content)}
                                className="p-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-all hover:scale-110"
                                title={isSpeaking ? 'Stop speaking' : 'Listen to message'}
                              >
                                {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && messages[messages.length - 1]?.content === '' && (
                    <div className="mr-auto">
                      <div className="bg-muted p-4 rounded-2xl rounded-bl-md flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Input */}
            {!showHandoffForm && (
              <div className="p-4 border-t bg-background flex items-center gap-3">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about properties, investments, financing..."
                  className="flex-1 rounded-full"
                  disabled={isLoading}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleRecording}
                  disabled={isLoading}
                  className={cn(
                    'rounded-full',
                    isRecording && 'bg-destructive text-destructive-foreground'
                  )}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Button
                  onClick={() => sendMessage()}
                  size="icon"
                  disabled={isLoading || !inputValue.trim()}
                  className="rounded-full"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Right: Context Panel */}
          <div className="w-80 flex flex-col gap-4">
            {/* User Context */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {userPreferences?.role || role || 'Guest'}
                      </Badge>
                    </div>
                    {userPreferences?.budget_max && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Budget: {formatPrice(userPreferences.budget_min || 0)} - {formatPrice(userPreferences.budget_max)}</span>
                      </div>
                    )}
                    {userPreferences?.preferred_cities && userPreferences.preferred_cities.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{userPreferences.preferred_cities.join(', ')}</span>
                      </div>
                    )}
                    {userPreferences?.target_roi_min && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Target ROI: {userPreferences.target_roi_min}%+</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    <p>Sign in to personalize recommendations</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => navigate('/auth')}
                    >
                      Sign In
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Property Context */}
            {propertyContext && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Property Context
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm">{propertyContext.title}</h4>
                    <p className="text-xs text-muted-foreground">{propertyContext.area}, {propertyContext.city}</p>
                  </div>
                  
                  <div className="text-lg font-bold text-primary">
                    {formatPrice(propertyContext.price)}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      {propertyContext.bedrooms} Beds
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {propertyContext.bathrooms} Baths
                    </Badge>
                    <Badge 
                      variant={propertyContext.status === 'approved' ? 'default' : 'secondary'}
                      className="text-xs capitalize"
                    >
                      {propertyContext.property_type}
                    </Badge>
                  </div>

                  <Separator />

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/property/${propertyContext.id}`)}
                  >
                    View Full Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-muted-foreground"
                    onClick={() => {
                      setPropertyContext(null);
                      navigate('/chat', { replace: true });
                    }}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear Context
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* No Property Selected */}
            {!propertyContext && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    No Property Selected
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-3">
                    Browse properties and click "Ask PropertyX" to get personalized analysis.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate('/properties')}
                  >
                    Browse Properties
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Disclaimer */}
            <Card className="bg-muted/50 border-dashed">
              <CardContent className="p-3">
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  PropertyX provides general information only. For specific legal, tax, or financial advice, 
                  consult a licensed professional. Investment decisions should be made with proper due diligence.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Chat;
