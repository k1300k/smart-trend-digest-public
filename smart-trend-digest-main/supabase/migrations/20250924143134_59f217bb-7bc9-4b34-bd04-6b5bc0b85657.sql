-- Create profiles table for user metadata
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create profiles policies
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add user_id to all business tables
ALTER TABLE public.keywords ADD COLUMN user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.sources ADD COLUMN user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.persons ADD COLUMN user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.collected_trends ADD COLUMN user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.settings ADD COLUMN user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Drop all existing overly permissive policies
DROP POLICY IF EXISTS "Allow public read access to keywords" ON public.keywords;
DROP POLICY IF EXISTS "Allow public insert to keywords" ON public.keywords;
DROP POLICY IF EXISTS "Allow public update to keywords" ON public.keywords;
DROP POLICY IF EXISTS "Allow public delete from keywords" ON public.keywords;

DROP POLICY IF EXISTS "Allow public read access to sources" ON public.sources;
DROP POLICY IF EXISTS "Allow public insert to sources" ON public.sources;
DROP POLICY IF EXISTS "Allow public update to sources" ON public.sources;
DROP POLICY IF EXISTS "Allow public delete from sources" ON public.sources;

DROP POLICY IF EXISTS "Allow public read access to persons" ON public.persons;
DROP POLICY IF EXISTS "Allow public insert to persons" ON public.persons;
DROP POLICY IF EXISTS "Allow public update to persons" ON public.persons;
DROP POLICY IF EXISTS "Allow public delete from persons" ON public.persons;

DROP POLICY IF EXISTS "Allow public read access to collected_trends" ON public.collected_trends;
DROP POLICY IF EXISTS "Allow public insert to collected_trends" ON public.collected_trends;
DROP POLICY IF EXISTS "Allow public update to collected_trends" ON public.collected_trends;
DROP POLICY IF EXISTS "Allow public delete from collected_trends" ON public.collected_trends;

DROP POLICY IF EXISTS "Restrict settings access" ON public.settings;

-- Create secure RLS policies for keywords
CREATE POLICY "Users can view own keywords" 
ON public.keywords FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own keywords" 
ON public.keywords FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own keywords" 
ON public.keywords FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own keywords" 
ON public.keywords FOR DELETE 
USING (auth.uid() = user_id);

-- Create secure RLS policies for sources
CREATE POLICY "Users can view own sources" 
ON public.sources FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sources" 
ON public.sources FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sources" 
ON public.sources FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sources" 
ON public.sources FOR DELETE 
USING (auth.uid() = user_id);

-- Create secure RLS policies for persons
CREATE POLICY "Users can view own persons" 
ON public.persons FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own persons" 
ON public.persons FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own persons" 
ON public.persons FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own persons" 
ON public.persons FOR DELETE 
USING (auth.uid() = user_id);

-- Create secure RLS policies for collected_trends
CREATE POLICY "Users can view own trends" 
ON public.collected_trends FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trends" 
ON public.collected_trends FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trends" 
ON public.collected_trends FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trends" 
ON public.collected_trends FOR DELETE 
USING (auth.uid() = user_id);

-- Create secure RLS policies for settings
CREATE POLICY "Users can view own settings" 
ON public.settings FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" 
ON public.settings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" 
ON public.settings FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own settings" 
ON public.settings FOR DELETE 
USING (auth.uid() = user_id);

-- Add unique constraint on settings user_id to ensure one settings row per user
ALTER TABLE public.settings ADD CONSTRAINT settings_user_id_unique UNIQUE (user_id);