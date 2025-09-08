-- Create knowledge base tables for AI NLP processing
CREATE TABLE IF NOT EXISTS public.knowledge_base_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  document_type TEXT NOT NULL,
  impact_area TEXT,
  requirement_codes TEXT[], 
  embedding VECTOR(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analysis results table
CREATE TABLE IF NOT EXISTS public.analysis_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL,
  file_id UUID,
  analysis_type TEXT NOT NULL DEFAULT 'document_analysis',
  confidence_score REAL,
  findings JSONB DEFAULT '{}',
  recommendations JSONB DEFAULT '{}',
  impact_area TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat sessions table for AI analysis
CREATE TABLE IF NOT EXISTS public.ai_chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL,
  impact_area TEXT NOT NULL,
  session_name TEXT,
  messages JSONB DEFAULT '[]',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_knowledge_base_impact_area ON public.knowledge_base_documents(impact_area);
CREATE INDEX IF NOT EXISTS idx_analysis_results_business_id ON public.analysis_results(business_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_impact_area ON public.analysis_results(impact_area);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_business_impact ON public.ai_chat_sessions(business_id, impact_area);

-- Enable Row Level Security
ALTER TABLE public.knowledge_base_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for knowledge base (public read, admin write)
CREATE POLICY "Knowledge base documents are viewable by everyone"
ON public.knowledge_base_documents FOR SELECT
USING (true);

-- Analysis results - users can only see their own business data
CREATE POLICY "Users can view their own analysis results"
ON public.analysis_results FOR SELECT
USING (business_id IN (
  SELECT id FROM public.businesses WHERE account_id = auth.uid()
));

CREATE POLICY "Users can insert their own analysis results"
ON public.analysis_results FOR INSERT
WITH CHECK (business_id IN (
  SELECT id FROM public.businesses WHERE account_id = auth.uid()
));

-- Chat sessions - users can only access their own business chats
CREATE POLICY "Users can view their own chat sessions"
ON public.ai_chat_sessions FOR SELECT
USING (business_id IN (
  SELECT id FROM public.businesses WHERE account_id = auth.uid()
));

CREATE POLICY "Users can create their own chat sessions"
ON public.ai_chat_sessions FOR INSERT
WITH CHECK (business_id IN (
  SELECT id FROM public.businesses WHERE account_id = auth.uid()
));

CREATE POLICY "Users can update their own chat sessions"
ON public.ai_chat_sessions FOR UPDATE
USING (business_id IN (
  SELECT id FROM public.businesses WHERE account_id = auth.uid()
));

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_knowledge_base_documents_updated_at
  BEFORE UPDATE ON public.knowledge_base_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_analysis_results_updated_at
  BEFORE UPDATE ON public.analysis_results
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_chat_sessions_updated_at
  BEFORE UPDATE ON public.ai_chat_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();