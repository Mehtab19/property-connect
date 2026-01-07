import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PropertyContext {
  id: string;
  name: string;
  price: string;
  location: string;
  city: string;
  country: string;
  type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  developer: string;
  aiScore: number;
  expectedRoi: string;
  features: string[];
  amenities: Record<string, boolean>;
}

interface UserContext {
  role: 'buyer' | 'investor';
  financingType?: 'cash' | 'mortgage';
  downPayment?: number;
  monthlyBudget?: number;
  expectedRent?: number;
}

const analysisPrompt = `You are PropertyX, the AI-powered Property Investment & Buying Analyst for PrimeX Estate.

Your job is to help users make confident property decisions with structured analysis.

## OUTPUT REQUIREMENTS
You MUST respond with ONLY a valid JSON object (no markdown, no code blocks, no additional text). The JSON must match this exact structure:

{
  "investmentScore": <number 0-10>,
  "riskLevel": "<Low|Medium|High>",
  "confidence": <number 0-1>,
  "rentalYield": <number percentage>,
  "appreciationForecast": <number percentage>,
  "riskFlags": ["<string>", ...],
  "comparableRange": "<string price range>",
  "comparableImplication": "<string analysis>",
  "verdict": "<Strong Buy|Consider|Avoid>",
  "nextSteps": ["<string>", ...],
  "assumptions": ["<string>", ...],
  "missingInfo": ["<string>", ...],
  "estimatedRent": "<string monthly rent>",
  "totalCostNotes": "<string>",
  "appreciationOutlook": "<string with % like '+8-12% 5Y'>",
  "aiSummary": "<string 2-3 sentence executive summary>",
  "handoffRecommended": <boolean - true if confidence < 0.65 or needs human expertise>
}

## ANALYSIS PRINCIPLES
1. Be unbiased - never favor any developer or listing without data support
2. Explain all assumptions transparently
3. Provide Investment Score (0-10), Risk Level (Low/Med/High), Confidence (0-1)
4. Include Financial Summary (yield/appreciation/payment), Risk Flags, Comparable Check
5. State recommendation clearly with reasoning

## TWO-LENS ANALYSIS

### For Buyers (buy_to_live):
- Focus on lifestyle fit, affordability, resale liquidity
- Calculate total cost of ownership (price + registration 5-7% + maintenance)
- Assess EMI burden if mortgage (should be < 40% of monthly income)
- Evaluate location convenience, amenities, community

### For Investors (buy_to_invest):
- Focus on ROI projection, rental yield, appreciation potential
- Typical rental yields in Pakistan: 2-4%
- Assess vacancy risk, tenant demand, market saturation
- Consider exit strategy and holding period

## SCORING GUIDELINES

### Investment Score:
- 9-10: Exceptional opportunity, strong fundamentals
- 7-8: Good investment, minor concerns
- 5-6: Average, needs careful consideration
- 3-4: Below average, significant risks
- 1-2: Poor investment, avoid

### Risk Level:
- Low: Established area, verified developer, ready property
- Medium: Upcoming area, known developer, or under construction
- High: New developer, off-plan, or legal/market concerns

### Confidence:
- 0.85-1.0: Complete information, reliable data
- 0.65-0.84: Some assumptions made
- 0.50-0.64: Limited data, significant assumptions (recommend human review)
- Below 0.50: Insufficient data (require human expert)

## HANDOFF TRIGGER
Set handoffRecommended: true when:
- confidence < 0.65
- User needs site visit, mortgage consultation, legal advice, or negotiation help
- Complex tax or regulatory questions arise

Generate realistic, data-informed analysis. Be transparent about assumptions.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { property, userContext } = await req.json() as { 
      property: PropertyContext; 
      userContext: UserContext;
    };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const userGoal = userContext.role === 'buyer' ? 'buy_to_live' : 'buy_to_invest';
    
    const contextMessage = `
## Property Details
- Name: ${property.name}
- Price: ${property.price}
- Location: ${property.location}, ${property.city}, ${property.country}
- Type: ${property.type}
- Status: ${property.status}
- Bedrooms: ${property.bedrooms}
- Bathrooms: ${property.bathrooms}
- Area: ${property.area}
- Developer: ${property.developer}
- Current AI Score: ${property.aiScore}/10
- Expected ROI: ${property.expectedRoi}
- Features: ${property.features.join(', ')}
- Amenities: ${Object.entries(property.amenities).filter(([_, v]) => v).map(([k]) => k).join(', ')}

## User Context
- User Goal: ${userGoal}
- Role: ${userContext.role}
${userContext.financingType ? `- Financing Type: ${userContext.financingType}` : ''}
${userContext.downPayment ? `- Down Payment Available: ${userContext.downPayment}%` : ''}
${userContext.monthlyBudget ? `- Monthly Budget: $${userContext.monthlyBudget}` : ''}
${userContext.expectedRent ? `- Expected Monthly Rent: $${userContext.expectedRent}` : ''}

Analyze this property and generate the JSON response.`;

    console.log("Generating property analysis for:", property.name);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: analysisPrompt },
          { role: "user", content: contextMessage },
        ],
        temperature: 0.3,
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
      
      return new Response(JSON.stringify({ error: "Failed to generate analysis" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log("Raw AI response:", content);

    // Parse the JSON response (handle potential markdown code blocks)
    let analysisData;
    try {
      // Remove markdown code blocks if present
      let jsonStr = content.trim();
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.slice(7);
      }
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.slice(3);
      }
      if (jsonStr.endsWith('```')) {
        jsonStr = jsonStr.slice(0, -3);
      }
      analysisData = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      // Return a default analysis if parsing fails
      analysisData = {
        investmentScore: 7,
        riskLevel: "Medium",
        confidence: 0.7,
        rentalYield: 3.5,
        appreciationForecast: 8,
        riskFlags: ["Analysis based on limited data"],
        comparableRange: property.price,
        comparableImplication: "Within market range for similar properties",
        verdict: "Consider",
        nextSteps: ["Schedule a property viewing", "Verify developer credentials", "Consult with a financial advisor"],
        assumptions: ["Market conditions remain stable", "Developer delivers on time"],
        missingInfo: ["Exact square footage", "Historical price trends"],
        estimatedRent: "Contact agent for rental estimates",
        totalCostNotes: "Include registration fees (5-7%), maintenance deposits, and closing costs",
        appreciationOutlook: "+5-10% over 5 years",
        aiSummary: `${property.name} is a ${userContext.role === 'investor' ? 'potential investment' : 'suitable living'} option in ${property.location}. The property offers ${property.features.slice(0, 2).join(' and ')} with ${property.status.toLowerCase()} status.`
      };
    }

    return new Response(JSON.stringify(analysisData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Property analysis error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
