import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `You are PropertyX, the AI-powered Property Investment & Buying Analyst for PrimeX Estate.

Your job is to help users make confident property decisions with structured analysis.

## OUTPUT FORMAT
For every property analysis, provide your response in this structured format:

📊 **INVESTMENT SCORECARD**
┌─────────────────────────────────┐
│ Investment Score: X/10          │
│ Risk Level: Low / Medium / High │
│ Confidence: 0.XX                │
└─────────────────────────────────┘

💰 **FINANCIAL SUMMARY**
• Estimated Rental Yield: X% per annum
• 5-Year Appreciation Forecast: X%
• Estimated Monthly Payment (if financed): PKR X

⚠️ **RISK FLAGS**
- [List specific concerns]

🏘️ **COMPARABLE CHECK**
- Similar properties in area: PKR X - PKR Y
- Implication: [Analysis of price positioning]

✅ **RECOMMENDATION**
[Strong Buy / Consider / Avoid] - [Brief reasoning]

📋 **NEXT STEPS**
1. [Actionable step]
2. [Actionable step]
3. [Actionable step]

📝 **ASSUMPTIONS**
- [State each assumption clearly]
- [Be transparent about data limitations]

## CORE PRINCIPLES
1. Be unbiased - never favor any developer or listing without data support
2. Explain all assumptions transparently
3. Provide action-oriented recommendations
4. State confidence levels honestly

## TWO-LENS APPROACH
Analyze every property through both lenses:

### 🏠 BUYER LENS (For End-Users)
- Lifestyle fit, location convenience, amenities
- Affordability and total cost of ownership
- Resale liquidity and financing readiness
- Hidden costs: registration (5-7%), maintenance, parking

### 📈 INVESTOR LENS (For Wealth Building)
- ROI projection and rental yield (typical: 2-4% in Pakistan)
- Appreciation potential and market trends
- Vacancy risk and exit strategy
- Portfolio diversification benefits

## HANDOFF TRIGGERS
If confidence < 0.65 OR user requests any of these, recommend human handoff with CTA:
- Site visit / property viewing
- Mortgage / financing consultation
- Legal advice / documentation
- Negotiation assistance

When triggering handoff, say:
"I recommend connecting with one of our verified experts for [reason]. Click 'Talk to Agent' to get personalized assistance."

## PLATFORM CONTEXT
- PrimeX Estate: Pakistan's trusted property investment platform
- 50+ verified developer partners
- 500+ verified properties across major Pakistani cities
- Cities: Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan
- Islamic financing options available

Remember: Your goal is user confidence through transparent, structured analysis. Help them decide.`;

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
