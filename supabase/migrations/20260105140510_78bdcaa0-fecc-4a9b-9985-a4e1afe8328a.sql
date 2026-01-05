-- Create buyer_preferences table for storing buyer-specific preferences
CREATE TABLE public.buyer_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  budget_min NUMERIC,
  budget_max NUMERIC,
  preferred_cities TEXT[] DEFAULT '{}'::TEXT[],
  preferred_areas TEXT[] DEFAULT '{}'::TEXT[],
  property_types TEXT[] DEFAULT '{}'::TEXT[],
  bedrooms_min INTEGER,
  bedrooms_max INTEGER,
  bathrooms_min INTEGER,
  must_have_amenities TEXT[] DEFAULT '{}'::TEXT[],
  move_in_timeline TEXT,
  financing_status TEXT DEFAULT 'exploring',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create investor_preferences table for storing investor-specific preferences
CREATE TABLE public.investor_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  investment_budget_min NUMERIC,
  investment_budget_max NUMERIC,
  target_roi_min NUMERIC,
  target_rental_yield_min NUMERIC,
  preferred_cities TEXT[] DEFAULT '{}'::TEXT[],
  property_types TEXT[] DEFAULT '{}'::TEXT[],
  risk_tolerance TEXT DEFAULT 'medium',
  investment_horizon TEXT,
  portfolio_size INTEGER DEFAULT 0,
  interested_in_off_plan BOOLEAN DEFAULT false,
  financing_preference TEXT DEFAULT 'mixed',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create developers table for developer-specific profile data
CREATE TABLE public.developers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  registration_number TEXT,
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  established_year INTEGER,
  total_projects INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  contact_email TEXT,
  contact_phone TEXT,
  headquarters_city TEXT,
  operating_cities TEXT[] DEFAULT '{}'::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table for grouping properties under a project
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  developer_id UUID REFERENCES public.developers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  project_type TEXT DEFAULT 'residential',
  status TEXT DEFAULT 'upcoming',
  city TEXT NOT NULL,
  area TEXT,
  address TEXT,
  total_units INTEGER,
  available_units INTEGER,
  price_range_min NUMERIC,
  price_range_max NUMERIC,
  expected_completion DATE,
  amenities TEXT[] DEFAULT '{}'::TEXT[],
  images TEXT[] DEFAULT '{}'::TEXT[],
  documents TEXT[] DEFAULT '{}'::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appointments table for scheduling
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  appointment_type TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.buyer_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- RLS policies for buyer_preferences
CREATE POLICY "Users can view own buyer preferences" ON public.buyer_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own buyer preferences" ON public.buyer_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own buyer preferences" ON public.buyer_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all buyer preferences" ON public.buyer_preferences FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for investor_preferences
CREATE POLICY "Users can view own investor preferences" ON public.investor_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own investor preferences" ON public.investor_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own investor preferences" ON public.investor_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all investor preferences" ON public.investor_preferences FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for developers
CREATE POLICY "Anyone can view verified developers" ON public.developers FOR SELECT USING (verified = true);
CREATE POLICY "Developers can view own profile" ON public.developers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Developers can insert own profile" ON public.developers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Developers can update own profile" ON public.developers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all developers" ON public.developers FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for projects
CREATE POLICY "Anyone can view projects from verified developers" ON public.projects FOR SELECT USING (
  developer_id IN (SELECT id FROM public.developers WHERE verified = true)
);
CREATE POLICY "Developers can view own projects" ON public.projects FOR SELECT USING (
  developer_id IN (SELECT id FROM public.developers WHERE user_id = auth.uid())
);
CREATE POLICY "Developers can insert own projects" ON public.projects FOR INSERT WITH CHECK (
  developer_id IN (SELECT id FROM public.developers WHERE user_id = auth.uid())
);
CREATE POLICY "Developers can update own projects" ON public.projects FOR UPDATE USING (
  developer_id IN (SELECT id FROM public.developers WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage all projects" ON public.projects FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for appointments
CREATE POLICY "Users can view own appointments" ON public.appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create appointments" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own appointments" ON public.appointments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Agents can view assigned appointments" ON public.appointments FOR SELECT USING (
  agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage all appointments" ON public.appointments FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at triggers
CREATE TRIGGER update_buyer_preferences_updated_at BEFORE UPDATE ON public.buyer_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_investor_preferences_updated_at BEFORE UPDATE ON public.investor_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_developers_updated_at BEFORE UPDATE ON public.developers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();