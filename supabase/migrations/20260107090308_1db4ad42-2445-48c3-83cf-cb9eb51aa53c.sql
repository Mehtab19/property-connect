-- Create saved_searches table for storing user search filters
CREATE TABLE public.saved_searches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  filters JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own saved searches"
ON public.saved_searches FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create saved searches"
ON public.saved_searches FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved searches"
ON public.saved_searches FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved searches"
ON public.saved_searches FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all saved searches"
ON public.saved_searches FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Update trigger for updated_at
CREATE TRIGGER update_saved_searches_updated_at
BEFORE UPDATE ON public.saved_searches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();