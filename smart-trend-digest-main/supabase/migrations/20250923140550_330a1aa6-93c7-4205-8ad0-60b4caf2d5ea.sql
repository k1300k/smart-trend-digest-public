-- Create keywords table
CREATE TABLE public.keywords (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  value TEXT NOT NULL,
  weight INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.keywords ENABLE ROW LEVEL SECURITY;

-- Create policies for keywords (public access for now, will need auth later)
CREATE POLICY "Allow public read access to keywords" 
ON public.keywords 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert to keywords" 
ON public.keywords 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update to keywords" 
ON public.keywords 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete from keywords" 
ON public.keywords 
FOR DELETE 
USING (true);

-- Create persons table
CREATE TABLE public.persons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  platform TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.persons ENABLE ROW LEVEL SECURITY;

-- Create policies for persons
CREATE POLICY "Allow public read access to persons" 
ON public.persons 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert to persons" 
ON public.persons 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update to persons" 
ON public.persons 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete from persons" 
ON public.persons 
FOR DELETE 
USING (true);

-- Create sources table
CREATE TABLE public.sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('blog', 'news', 'social')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;

-- Create policies for sources
CREATE POLICY "Allow public read access to sources" 
ON public.sources 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert to sources" 
ON public.sources 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update to sources" 
ON public.sources 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete from sources" 
ON public.sources 
FOR DELETE 
USING (true);

-- Create settings table
CREATE TABLE public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  send_time TEXT DEFAULT '09:00',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create policies for settings
CREATE POLICY "Allow public read access to settings" 
ON public.settings 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert to settings" 
ON public.settings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update to settings" 
ON public.settings 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete from settings" 
ON public.settings 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_keywords_updated_at
BEFORE UPDATE ON public.keywords
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_persons_updated_at
BEFORE UPDATE ON public.persons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sources_updated_at
BEFORE UPDATE ON public.sources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON public.settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();