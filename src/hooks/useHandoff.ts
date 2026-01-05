import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

// Keywords that trigger handoff
const HANDOFF_TRIGGERS = {
  siteVisit: ['site visit', 'property visit', 'see the property', 'visit the property', 'physical visit', 'schedule visit', 'book viewing'],
  negotiation: ['negotiate', 'negotiation', 'price negotiation', 'make an offer', 'bargain', 'counter offer'],
  legal: ['legal', 'lawyer', 'documentation', 'registry', 'title deed', 'sale deed', 'agreement', 'contract'],
  financing: ['loan', 'mortgage', 'financing', 'home loan', 'bank loan', 'emi', 'down payment', 'pre-approval'],
};

export interface HandoffContext {
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  propertyId?: string;
  propertyTitle?: string;
  propertyLocation?: string;
  confidenceScore?: number;
}

export interface HandoffFormData {
  name: string;
  email: string;
  phone: string;
  preferredTime: string;
  preferredChannel: 'phone' | 'whatsapp' | 'email';
  message?: string;
}

interface AgentMatchCriteria {
  location?: string;
  propertyType?: string;
  language?: string;
}

export const useHandoff = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if message contains handoff triggers
  const detectHandoffTrigger = useCallback((message: string): string | null => {
    const lowerMessage = message.toLowerCase();
    
    for (const [triggerType, keywords] of Object.entries(HANDOFF_TRIGGERS)) {
      for (const keyword of keywords) {
        if (lowerMessage.includes(keyword)) {
          return triggerType;
        }
      }
    }
    
    return null;
  }, []);

  // Check if confidence score is low
  const shouldTriggerLowConfidence = useCallback((score?: number): boolean => {
    return score !== undefined && score < 0.65;
  }, []);

  // Generate AI summary from conversation
  const generateAISummary = useCallback((context: HandoffContext): string => {
    const { conversationHistory, propertyTitle, propertyLocation } = context;
    
    // Extract key information from conversation
    const userMessages = conversationHistory
      .filter(m => m.role === 'user')
      .map(m => m.content);
    
    // Build summary
    const summaryParts: string[] = [];
    
    // Buyer intent
    const intents: string[] = [];
    for (const [triggerType, keywords] of Object.entries(HANDOFF_TRIGGERS)) {
      for (const keyword of keywords) {
        if (userMessages.some(m => m.toLowerCase().includes(keyword))) {
          intents.push(triggerType);
          break;
        }
      }
    }
    if (intents.length > 0) {
      summaryParts.push(`**Buyer Intent:** ${intents.join(', ')}`);
    }
    
    // Property interest
    if (propertyTitle || propertyLocation) {
      summaryParts.push(`**Property of Interest:** ${propertyTitle || 'Not specified'} ${propertyLocation ? `in ${propertyLocation}` : ''}`);
    }
    
    // Budget extraction (simple pattern matching)
    const budgetPatterns = /(?:budget|afford|spend|price range|looking for)[:\s]*(?:rs\.?|pkr|₨)?[\s]*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:lac|lakh|crore|cr|million|m|k)?/gi;
    for (const msg of userMessages) {
      const match = budgetPatterns.exec(msg);
      if (match) {
        summaryParts.push(`**Budget Mentioned:** ${match[0]}`);
        break;
      }
    }
    
    // Financing need
    if (userMessages.some(m => HANDOFF_TRIGGERS.financing.some(k => m.toLowerCase().includes(k)))) {
      summaryParts.push(`**Financing Need:** Yes - User inquired about mortgage/loan options`);
    }
    
    // Risk flags
    const riskFlags: string[] = [];
    if (userMessages.some(m => m.toLowerCase().includes('urgent') || m.toLowerCase().includes('asap'))) {
      riskFlags.push('Urgent timeline');
    }
    if (userMessages.some(m => m.toLowerCase().includes('first time') || m.toLowerCase().includes('never bought'))) {
      riskFlags.push('First-time buyer');
    }
    if (riskFlags.length > 0) {
      summaryParts.push(`**Risk Flags:** ${riskFlags.join(', ')}`);
    }
    
    // Confidence
    if (context.confidenceScore !== undefined) {
      summaryParts.push(`**AI Confidence Score:** ${(context.confidenceScore * 100).toFixed(0)}%`);
    }
    
    // Conversation summary
    if (userMessages.length > 0) {
      const recentMessages = userMessages.slice(-3).join(' | ');
      summaryParts.push(`**Recent Queries:** ${recentMessages.slice(0, 200)}...`);
    }
    
    return summaryParts.join('\n') || 'User requested human assistance';
  }, []);

  // Find best matching agent based on criteria
  const findMatchingAgent = useCallback(async (criteria: AgentMatchCriteria): Promise<string | null> => {
    try {
      let query = supabase
        .from('agents')
        .select('id, areas_served, specialization')
        .eq('verified', true);
      
      const { data: agents, error } = await query;
      
      if (error || !agents || agents.length === 0) {
        console.log('No verified agents found');
        return null;
      }
      
      // Score agents based on matching criteria
      const scoredAgents = agents.map(agent => {
        let score = 0;
        
        // Location match
        if (criteria.location && agent.areas_served) {
          const locationLower = criteria.location.toLowerCase();
          if (agent.areas_served.some((area: string) => 
            area.toLowerCase().includes(locationLower) || 
            locationLower.includes(area.toLowerCase())
          )) {
            score += 10;
          }
        }
        
        // Property type match
        if (criteria.propertyType && agent.specialization) {
          if (agent.specialization.some((spec: string) => 
            spec.toLowerCase().includes(criteria.propertyType!.toLowerCase())
          )) {
            score += 5;
          }
        }
        
        return { ...agent, score };
      });
      
      // Sort by score and return best match
      scoredAgents.sort((a, b) => b.score - a.score);
      return scoredAgents[0]?.id || null;
    } catch (error) {
      console.error('Error finding matching agent:', error);
      return null;
    }
  }, []);

  // Log audit event
  const logAuditEvent = useCallback(async (
    action: string,
    entityType: string,
    entityId: string,
    details: Record<string, any>
  ) => {
    try {
      if (!user?.id) return;
      
      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action,
        entity_type: entityType,
        entity_id: entityId,
        details,
      });
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  }, [user?.id]);

  // Main handoff function
  const initiateHandoff = useCallback(async (
    formData: HandoffFormData,
    context: HandoffContext,
    triggerReason: string
  ): Promise<{ success: boolean; leadId?: string }> => {
    if (!user?.id) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please sign in to request agent assistance.',
      });
      return { success: false };
    }

    setIsProcessing(true);

    try {
      // Generate AI summary
      const aiSummary = generateAISummary(context);
      
      // Find matching agent
      const agentId = await findMatchingAgent({
        location: context.propertyLocation,
      });

      // Create lead
      const leadData = {
        user_id: user.id,
        lead_type: triggerReason,
        status: 'new',
        priority: context.confidenceScore && context.confidenceScore < 0.5 ? 'high' : 'medium',
        property_id: context.propertyId || null,
        agent_id: agentId,
        ai_summary: aiSummary,
        notes: `**Contact:** ${formData.name}
**Phone:** ${formData.phone}
**Email:** ${formData.email}
**Preferred Time:** ${formData.preferredTime}
**Preferred Channel:** ${formData.preferredChannel}
${formData.message ? `**Message:** ${formData.message}` : ''}`,
      };

      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .insert(leadData)
        .select('id')
        .single();

      if (leadError) throw leadError;

      // Log audit event
      await logAuditEvent(
        'ai_handoff',
        'lead',
        lead.id,
        {
          trigger_reason: triggerReason,
          confidence_score: context.confidenceScore,
          ai_summary: aiSummary,
          assigned_agent: agentId,
          property_id: context.propertyId,
        }
      );

      toast({
        title: 'Request Submitted!',
        description: agentId 
          ? 'An agent has been assigned and will contact you shortly.'
          : 'Your request has been submitted. An agent will be assigned soon.',
      });

      return { success: true, leadId: lead.id };
    } catch (error) {
      console.error('Handoff error:', error);
      toast({
        variant: 'destructive',
        title: 'Request Failed',
        description: 'Unable to process your request. Please try again.',
      });
      return { success: false };
    } finally {
      setIsProcessing(false);
    }
  }, [user?.id, generateAISummary, findMatchingAgent, logAuditEvent, toast]);

  return {
    detectHandoffTrigger,
    shouldTriggerLowConfidence,
    initiateHandoff,
    generateAISummary,
    isProcessing,
  };
};
