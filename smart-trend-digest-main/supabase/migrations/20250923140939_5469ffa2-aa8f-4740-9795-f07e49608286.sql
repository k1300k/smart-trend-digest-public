-- Create collected_trends table for storing collected trend data
CREATE TABLE public.collected_trends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  source TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('high-value', 'normal')),
  author TEXT,
  url TEXT,
  keywords TEXT[] DEFAULT '{}',
  collected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.collected_trends ENABLE ROW LEVEL SECURITY;

-- Create policies for collected_trends
CREATE POLICY "Allow public read access to collected_trends" 
ON public.collected_trends 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert to collected_trends" 
ON public.collected_trends 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update to collected_trends" 
ON public.collected_trends 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete from collected_trends" 
ON public.collected_trends 
FOR DELETE 
USING (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_collected_trends_updated_at
BEFORE UPDATE ON public.collected_trends
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();