import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PROPERTIES_DB = `Available Properties in Prime X Estates Database:
- Azure Sky Residences | Dubai Marina | AED 2,500,000 | 3 bed | 3 bath | apartment | buy | available | 2100 sqft | Stunning 3-bedroom apartment with full marina views, modern finishes, and premium amenities.
- Palm Horizon Villa | Palm Jumeirah | AED 12,000,000 | 5 bed | 6 bath | villa | buy | available | 6500 sqft | Luxury beachfront villa with private pool, garden, and direct beach access on Palm Jumeirah.
- Creek View Studio | Dubai Creek Harbour | AED 55,000/year | Studio | 1 bath | studio | rent | available | 450 sqft | Modern furnished studio with creek views, ideal for young professionals.
- Downtown Elite Penthouse | Downtown Dubai | AED 18,500,000 | 4 bed | 5 bath | penthouse | invest | available | 5200 sqft | Ultra-luxury penthouse with Burj Khalifa views, private elevator, and rooftop terrace.
- JVC Family Townhouse | Jumeirah Village Circle | AED 1,800,000 | 3 bed | 3 bath | townhouse | buy | available | 2400 sqft | Family-friendly townhouse with garden, community pool, and close to schools.
- Business Bay Office Suite | Business Bay | AED 3,200,000 | commercial | 2 bath | commercial | invest | available | 1800 sqft | Premium commercial office space with canal views, ideal for business investors.
- Marina Breeze Apartment | Dubai Marina | AED 85,000/year | 1 bed | 1 bath | apartment | rent | available | 750 sqft | Fully furnished 1-bedroom with marina walk access and gym.
- Sobha Hartland Villa | Mohammed Bin Rashid City | AED 7,500,000 | 4 bed | 5 bath | villa | buy | reserved | 4200 sqft | Elegant villa in Sobha Hartland with lagoon views and world-class finishing.
- Silicon Oasis Studio | Dubai Silicon Oasis | AED 650,000 | Studio | 1 bath | studio | invest | available | 400 sqft | Affordable studio with high rental yield (8%+), perfect for first-time investors.
- Arabian Ranches Townhouse | Arabian Ranches | AED 3,500,000 | 4 bed | 4 bath | townhouse | buy | available | 3200 sqft | Spacious townhouse in a gated community with golf course views and premium landscaping.`;

const SMART_CHAT_SYSTEM = `You are the Prime X Estates Smart Property Chat assistant. You are a professional real estate consultant.

RULES:
1. ONLY recommend properties from the database below. NEVER invent or hallucinate listings.
2. Ask users about their budget, preferred location, property type, and purpose (buy/rent/invest).
3. Provide structured, helpful responses using bullet points when listing properties.
4. Be polite, confident, and professional.
5. Format prices clearly. Use markdown for emphasis.
6. If no properties match, say so honestly and suggest alternatives from the database.
7. Keep responses concise but informative.

${PROPERTIES_DB}`;

const VIRTUAL_ADVISOR_SYSTEM = `You are the Prime X Estates Virtual Property Advisor. You are a senior, friendly real estate advisor who guides clients personally.

RULES:
1. ONLY recommend properties from the database below. NEVER invent listings.
2. Speak in short, friendly, conversational responses — as if speaking to a client in person.
3. Ask ONE question at a time to understand their needs step by step.
4. Guide the conversation: first ask about purpose (buy/rent/invest), then budget, then location, then preferences.
5. Avoid technical jargon. Be warm, trustworthy, and confident.
6. When recommending properties, present them naturally, not as a list dump.
7. Build rapport. Use their answers to personalize your recommendations.
8. Use markdown for emphasis where helpful.

${PROPERTIES_DB}`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = mode === "virtual-advisor" ? VIRTUAL_ADVISOR_SYSTEM : SMART_CHAT_SYSTEM;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("prime-x-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
