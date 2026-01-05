-- Add new roles to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'broker';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'mortgage_partner';

-- Create agents table for broker/agent profiles
CREATE TABLE public.agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  agency_name text,
  license_number text,
  specialization text[] DEFAULT '{}'::text[],
  areas_served text[] DEFAULT '{}'::text[],
  bio text,
  rating numeric(3,2) DEFAULT 0,
  total_reviews integer DEFAULT 0,
  verified boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create mortgage partners table
CREATE TABLE public.mortgage_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  bank_name text NOT NULL,
  logo_url text,
  interest_rate_min numeric(5,2),
  interest_rate_max numeric(5,2),
  max_loan_amount numeric(15,2),
  max_tenure_years integer DEFAULT 25,
  processing_fee_percent numeric(4,2),
  features text[] DEFAULT '{}'::text[],
  contact_email text,
  contact_phone text,
  website_url text,
  verified boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create property analyses table for AI-generated reports
CREATE TABLE public.property_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  roi_estimate numeric(5,2),
  rental_yield numeric(5,2),
  appreciation_forecast numeric(5,2),
  risk_score integer CHECK (risk_score >= 1 AND risk_score <= 10),
  risk_flags text[] DEFAULT '{}'::text[],
  confidence_score integer CHECK (confidence_score >= 1 AND confidence_score <= 100),
  market_trends jsonb DEFAULT '{}'::jsonb,
  recommended_actions text[] DEFAULT '{}'::text[],
  ai_summary text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create property comparisons table
CREATE TABLE public.property_comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text,
  property_ids uuid[] NOT NULL,
  comparison_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create leads table for handoff workflow
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  agent_id uuid REFERENCES public.agents(id) ON DELETE SET NULL,
  mortgage_partner_id uuid REFERENCES public.mortgage_partners(id) ON DELETE SET NULL,
  lead_type text NOT NULL CHECK (lead_type IN ('viewing', 'callback', 'mortgage', 'inquiry')),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed')),
  ai_summary text,
  notes text,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create conversations table for chat history with context
CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  title text,
  context jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mortgage_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for agents
CREATE POLICY "Anyone can view verified agents" ON public.agents FOR SELECT USING (verified = true);
CREATE POLICY "Agents can view own profile" ON public.agents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Agents can update own profile" ON public.agents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Agents can insert own profile" ON public.agents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all agents" ON public.agents FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for mortgage_partners
CREATE POLICY "Anyone can view verified partners" ON public.mortgage_partners FOR SELECT USING (verified = true);
CREATE POLICY "Partners can view own profile" ON public.mortgage_partners FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Partners can update own profile" ON public.mortgage_partners FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Partners can insert own profile" ON public.mortgage_partners FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all partners" ON public.mortgage_partners FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for property_analyses
CREATE POLICY "Users can view own analyses" ON public.property_analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create analyses" ON public.property_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all analyses" ON public.property_analyses FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for property_comparisons
CREATE POLICY "Users can manage own comparisons" ON public.property_comparisons FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all comparisons" ON public.property_comparisons FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for leads
CREATE POLICY "Users can view own leads" ON public.leads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create leads" ON public.leads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Agents can view assigned leads" ON public.leads FOR SELECT USING (agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid()));
CREATE POLICY "Agents can update assigned leads" ON public.leads FOR UPDATE USING (agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid()));
CREATE POLICY "Partners can view assigned leads" ON public.leads FOR SELECT USING (mortgage_partner_id IN (SELECT id FROM public.mortgage_partners WHERE user_id = auth.uid()));
CREATE POLICY "Admins can manage all leads" ON public.leads FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for conversations
CREATE POLICY "Users can manage own conversations" ON public.conversations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all conversations" ON public.conversations FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for messages
CREATE POLICY "Users can view messages in own conversations" ON public.messages FOR SELECT 
  USING (conversation_id IN (SELECT id FROM public.conversations WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert messages in own conversations" ON public.messages FOR INSERT 
  WITH CHECK (conversation_id IN (SELECT id FROM public.conversations WHERE user_id = auth.uid()));
CREATE POLICY "Admins can view all messages" ON public.messages FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updated_at
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.agents 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mortgage_partners_updated_at BEFORE UPDATE ON public.mortgage_partners 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_property_comparisons_updated_at BEFORE UPDATE ON public.property_comparisons 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();