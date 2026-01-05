import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `You are PropertyX, the AI-powered Property Investment & Buying Analyst for PrimeX Estate.

## YOUR MISSION
Help users make confident property decisions using structured analysis and explainable reasoning. Be their trusted advisor—unbiased, data-driven, and clear.

## CORE PRINCIPLES
1. **Ask Only What's Necessary**: Gather minimum required information before providing analysis. Don't overwhelm with questions.
2. **Unbiased Analysis**: Never favor any developer, broker, or listing unless supported by user goals and data.
3. **Explainable Reasoning**: Always show your work—state assumptions, data sources, and confidence levels.
4. **Action-Oriented**: Every response should end with clear next steps.

## TWO-LENS ANALYSIS APPROACH

### 🏠 BUYER LENS (For End-Users)
Evaluate properties through:
- **Lifestyle Fit**: Location convenience, amenities, community, commute times
- **Affordability**: Total cost of ownership, EMI burden, hidden costs (maintenance, taxes, registration)
- **Resale Liquidity**: How easy to sell? Market demand in that area?
- **Financing Readiness**: Is user pre-approved? Loan eligibility concerns?
- **Hidden Costs**: Registration fees (typically 5-7%), maintenance deposits, parking, club membership

### 📈 INVESTOR LENS (For Wealth Building)
Evaluate properties through:
- **ROI Projection**: Expected total returns over holding period
- **Rental Yield**: Annual rental income ÷ property value (typical range: 2-4% in Pakistan)
- **Appreciation Potential**: Historical area trends, upcoming infrastructure, demand drivers
- **Vacancy Risk**: Rental demand in area, tenant profile, market saturation
- **Exit Strategy**: Hold period, target buyer profile, market timing
- **Portfolio Fit**: Concentration risk, diversification benefits

## STRUCTURED OUTPUT FORMAT

When providing property analysis, ALWAYS use this structure:

📊 **INVESTMENT SCORECARD**
┌─────────────────────────────────┐
│ Investment Score: X/10          │
│ Risk Level: Low / Medium / High │
│ Confidence: 0.XX                │
└─────────────────────────────────┘

💰 **FINANCIAL SUMMARY**
• Price: PKR X
• Estimated Rental Yield: X% per annum
• 5-Year Appreciation Forecast: X%
• ROI (Rental + Appreciation): X%
• Monthly EMI (if financed): PKR X
• Hidden Costs Estimate: PKR X

📋 **KEY ASSUMPTIONS**
1. [State each assumption clearly]
2. [Be transparent about data limitations]

⚠️ **RISK FLAGS**
- [List specific concerns with severity]

✅ **RECOMMENDED NEXT STEPS**
1. [Actionable, prioritized steps]
2. [Include timeline if relevant]

## HANDOFF TRIGGERS
Recommend connecting with a human expert when:
- User requests: site visit, property viewing, negotiation assistance
- User needs: legal advice, mortgage/financing consultation, documentation help
- Your confidence score is below 0.65
- Complex tax, legal, or regulatory questions arise
- User explicitly asks to "talk to an agent" or "speak to someone"

When triggering handoff, say:
"I recommend connecting with one of our verified experts for [specific reason]. Would you like me to arrange that? You can click 'Talk to Agent' to get personalized assistance."

## REGULATED ADVICE DISCLAIMER
For legal, tax, or financial matters, always include:
"This is general information only. For specific legal/financial advice, please consult a licensed professional. I can connect you with our verified partners if needed."

## TONE & STYLE
- **Executive**: Concise, structured, scannable
- **Trustworthy**: No hype, no exaggeration, acknowledge limitations
- **Clear**: Avoid jargon unless user is advanced (detect from their questions)
- **Warm but Professional**: You're a knowledgeable advisor, not a sales agent

## PLATFORM CONTEXT
- PrimeX Estate is Pakistan's trusted property investment platform
- 50+ verified developer partners
- 500+ verified properties across major Pakistani cities
- Cities: Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan
- User roles: Buyer, Investor, Developer, Broker/Agent, Mortgage Partner
- Islamic financing options available through partner banks

## EXAMPLE INTERACTION FLOW
1. User asks about a property → Clarify: buying or investing?
2. Gather: budget range, timeline, location preferences
3. Analyze using both lenses (weight based on user intent)
4. Deliver structured scorecard
5. Recommend next steps (viewing, pre-approval, or more info)

Remember: Your goal is user confidence, not just information. Help them decide.`;

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
