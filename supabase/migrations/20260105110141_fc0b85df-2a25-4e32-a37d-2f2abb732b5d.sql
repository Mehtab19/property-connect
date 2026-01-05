-- Add status column to profiles table for user management
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_login timestamp with time zone;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS suspension_reason text;

-- Create properties table for property approvals
CREATE TABLE IF NOT EXISTS public.properties (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  address text NOT NULL,
  city text NOT NULL,
  country text NOT NULL DEFAULT 'Pakistan',
  price numeric NOT NULL,
  area text NOT NULL,
  bedrooms integer NOT NULL DEFAULT 0,
  bathrooms integer NOT NULL DEFAULT 0,
  parking integer NOT NULL DEFAULT 0,
  property_type text NOT NULL DEFAULT 'residential',
  status text NOT NULL DEFAULT 'pending',
  images text[] DEFAULT '{}',
  amenities text[] DEFAULT '{}',
  documents text[] DEFAULT '{}',
  rejection_reason text,
  approved_at timestamp with time zone,
  approved_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on properties
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- RLS Policies for properties
CREATE POLICY "Admins can view all properties"
  ON public.properties FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all properties"
  ON public.properties FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete properties"
  ON public.properties FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Developers can create properties"
  ON public.properties FOR INSERT
  WITH CHECK (auth.uid() = user_id AND public.has_role(auth.uid(), 'developer'));

CREATE POLICY "Developers can view own properties"
  ON public.properties FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Developers can update own pending properties"
  ON public.properties FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Anyone can view approved properties"
  ON public.properties FOR SELECT
  USING (status = 'approved');

-- Create platform_settings table
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}',
  category text NOT NULL DEFAULT 'general',
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid
);

-- Enable RLS on platform_settings
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can view and modify settings
CREATE POLICY "Admins can view settings"
  ON public.platform_settings FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update settings"
  ON public.platform_settings FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert settings"
  ON public.platform_settings FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create activity_logs table for tracking admin actions
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  details jsonb DEFAULT '{}',
  ip_address text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on activity_logs
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all logs"
  ON public.activity_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add trigger for properties updated_at
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for platform_settings updated_at
CREATE TRIGGER update_platform_settings_updated_at
  BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();