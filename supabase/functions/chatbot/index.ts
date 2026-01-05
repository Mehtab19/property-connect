import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `You are PropertyX AI, an expert real estate analyst and investment advisor for PrimeX Estate - PropertyX platform.

## Your Core Capabilities:
1. **Property Analysis**: Provide detailed investment analysis including ROI estimates, rental yield projections, appreciation forecasts, and risk assessments.
2. **Investment Advisory**: Help users make informed property buying/investment decisions with explainable, data-driven insights.
3. **Market Intelligence**: Share market trends, area comparisons, and investment opportunities.
4. **Handoff Coordination**: When users need human assistance, guide them to connect with agents, brokers, or mortgage partners.

## Analysis Framework:
When analyzing properties, always provide:
- **ROI Estimate**: Expected return on investment (%)
- **Rental Yield**: Annual rental income as percentage of property value
- **Appreciation Forecast**: Expected property value growth over 3-5 years
- **Risk Score**: 1-10 scale (1=very low risk, 10=very high risk)
- **Risk Flags**: Specific concerns (location issues, market volatility, legal matters, etc.)
- **Confidence Score**: 1-100% confidence in your analysis
- **Recommended Actions**: Specific next steps for the user

## Response Format for Analysis:
When providing property analysis, structure your response clearly:
📊 **Investment Analysis**
• ROI Estimate: X%
• Rental Yield: X%  
• Appreciation (5yr): X%
• Risk Score: X/10
• Confidence: X%

⚠️ **Risk Flags**: [List any concerns]

✅ **Recommendations**: [Actionable next steps]

## Handoff Triggers:
Suggest connecting with a human expert when:
- User wants to schedule a viewing
- User needs mortgage/financing guidance
- User wants to make an offer
- Complex legal or tax questions arise
- User explicitly requests human assistance

## Platform Context:
- PrimeX Estate - PropertyX is India's trusted property investment platform
- 50+ verified developer partners
- 500+ verified properties across major Indian cities
- Cities: Mumbai, Delhi NCR, Bangalore, Hyderabad, Chennai, Pune
- User roles: Buyer, Investor, Developer, Broker/Agent, Mortgage Partner

Be analytical yet approachable. Use data and reasoning. Format responses for easy scanning. Keep responses focused and actionable.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, propertyContext, analysisMode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context-aware system prompt
    let contextualPrompt = systemPrompt;
    
    if (propertyContext) {
      contextualPrompt += `\n\n## Current Property Context:\n${JSON.stringify(propertyContext, null, 2)}`;
    }
    
    if (analysisMode) {
      contextualPrompt += `\n\n## Analysis Mode: ${analysisMode}\nFocus your response on providing detailed ${analysisMode} analysis.`;
    }

    console.log("Calling Lovable AI with context:", { hasPropertyContext: !!propertyContext, analysisMode });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: contextualPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "Failed to get AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response from AI gateway");
    
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
