-- Create Supabase Storage Buckets for B Corp document management
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES 
  ('business-documents', 'business-documents', false, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/markdown', 'application/json']),
  ('knowledge-base', 'knowledge-base', false, 52428800, ARRAY['application/pdf', 'text/plain', 'text/markdown', 'application/json']);

-- Create Storage RLS Policies for tenant isolation
CREATE POLICY "Users can upload business documents to their own folder"
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'business-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own business documents"
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'business-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own business documents"
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'business-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own business documents"
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'business-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Knowledge base policies (authenticated users can read)
CREATE POLICY "Authenticated users can view knowledge base"
ON storage.objects FOR SELECT 
USING (bucket_id = 'knowledge-base' AND auth.uid() IS NOT NULL);

-- Admins can manage knowledge base (will be refined later)
CREATE POLICY "Admins can manage knowledge base"
ON storage.objects FOR ALL 
USING (bucket_id = 'knowledge-base' AND auth.uid() IS NOT NULL);

-- Enhanced database schema for AI processing
-- Add extracted_text capability to existing structure
CREATE TABLE IF NOT EXISTS public.datarooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(business_id)
);

-- Document chunks for AI embeddings and processing
CREATE TABLE IF NOT EXISTS public.document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID NOT NULL,
  dataroom_id UUID NOT NULL REFERENCES public.datarooms(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  text_content TEXT NOT NULL,
  embedding vector(1536), -- OpenAI ada-002 embedding dimension
  page_number INTEGER,
  token_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(file_id, chunk_index)
);

-- Analysis jobs for async processing
CREATE TABLE IF NOT EXISTS public.analysis_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  dataroom_id UUID NOT NULL REFERENCES public.datarooms(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')) DEFAULT 'pending',
  job_type TEXT CHECK (job_type IN ('document_extraction', 'ai_analysis', 'task_generation')) NOT NULL,
  progress_pct INTEGER DEFAULT 0 CHECK (progress_pct >= 0 AND progress_pct <= 100),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced files table (extending existing DataFile concept)
CREATE TABLE IF NOT EXISTS public.files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dataroom_id UUID NOT NULL REFERENCES public.datarooms(id) ON DELETE CASCADE,
  storage_bucket TEXT NOT NULL DEFAULT 'business-documents',
  storage_path TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_kind TEXT CHECK (file_kind IN ('business_plan', 'articles_of_association', 'certificate_of_incorp', 'employee_handbook', 'hr_policy', 'di_policy', 'env_policy', 'supplier_code', 'privacy_policy', 'impact_report', 'other')) DEFAULT 'other',
  content_type TEXT,
  file_size_bytes BIGINT,
  impact_area TEXT CHECK (impact_area IN ('Governance', 'Workers', 'Community', 'Environment', 'Customers', 'Other')),
  extracted_text TEXT, -- AI-extracted text content
  extraction_status TEXT CHECK (extraction_status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  extraction_method TEXT, -- 'pdf_text', 'ocr', 'docx', 'plain_text'
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(storage_bucket, storage_path)
);

-- Document categorization by AI
CREATE TABLE IF NOT EXISTS public.document_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID NOT NULL REFERENCES public.files(id) ON DELETE CASCADE,
  impact_area TEXT CHECK (impact_area IN ('Governance', 'Workers', 'Community', 'Environment', 'Customers', 'Other')) NOT NULL,
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  ai_reasoning TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(file_id)
);

-- Enable RLS on all tables
ALTER TABLE public.datarooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for datarooms
CREATE POLICY "Users can manage their business datarooms"
ON public.datarooms FOR ALL 
USING (
  business_id IN (
    SELECT id FROM public.businesses WHERE user_id = auth.uid()
  )
);

-- RLS Policies for document_chunks
CREATE POLICY "Users can access chunks from their datarooms"
ON public.document_chunks FOR ALL 
USING (
  dataroom_id IN (
    SELECT d.id FROM public.datarooms d
    JOIN public.businesses b ON d.business_id = b.id
    WHERE b.user_id = auth.uid()
  )
);

-- RLS Policies for analysis_jobs
CREATE POLICY "Users can manage their analysis jobs"
ON public.analysis_jobs FOR ALL 
USING (
  business_id IN (
    SELECT id FROM public.businesses WHERE user_id = auth.uid()
  )
);

-- RLS Policies for files
CREATE POLICY "Users can manage files in their datarooms"
ON public.files FOR ALL 
USING (
  dataroom_id IN (
    SELECT d.id FROM public.datarooms d
    JOIN public.businesses b ON d.business_id = b.id
    WHERE b.user_id = auth.uid()
  )
);

-- RLS Policies for document_categories
CREATE POLICY "Users can view categories for their files"
ON public.document_categories FOR ALL 
USING (
  file_id IN (
    SELECT f.id FROM public.files f
    JOIN public.datarooms d ON f.dataroom_id = d.id
    JOIN public.businesses b ON d.business_id = b.id
    WHERE b.user_id = auth.uid()
  )
);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_datarooms_updated_at
  BEFORE UPDATE ON public.datarooms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_analysis_jobs_updated_at
  BEFORE UPDATE ON public.analysis_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_files_updated_at
  BEFORE UPDATE ON public.files
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_files_dataroom_id ON public.files(dataroom_id);
CREATE INDEX idx_files_impact_area ON public.files(impact_area);
CREATE INDEX idx_files_extraction_status ON public.files(extraction_status);
CREATE INDEX idx_document_chunks_file_id ON public.document_chunks(file_id);
CREATE INDEX idx_document_chunks_dataroom_id ON public.document_chunks(dataroom_id);
CREATE INDEX idx_analysis_jobs_business_id ON public.analysis_jobs(business_id);
CREATE INDEX idx_analysis_jobs_status ON public.analysis_jobs(status);