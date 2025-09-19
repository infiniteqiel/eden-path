-- Phase 1: Complete Database Schema (Final)
-- Create user-defined document categories table
CREATE TABLE IF NOT EXISTS public.user_document_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  icon TEXT NOT NULL DEFAULT 'folder',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_system_category BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_category_name_per_business UNIQUE (business_id, name)
);

-- Enable RLS
ALTER TABLE public.user_document_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_document_categories' 
    AND policyname = 'Users can manage their business document categories'
  ) THEN
    CREATE POLICY "Users can manage their business document categories"
    ON public.user_document_categories
    FOR ALL
    USING (business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    ));
  END IF;
END
$$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_document_categories_business_id ON public.user_document_categories(business_id);
CREATE INDEX IF NOT EXISTS idx_user_document_categories_sort_order ON public.user_document_categories(business_id, sort_order);

-- Create audit trail table for file operations
CREATE TABLE IF NOT EXISTS public.file_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_id UUID NOT NULL,
  business_id UUID NOT NULL,
  operation TEXT NOT NULL, -- 'created', 'deleted', 'mapped', 'unmapped', 'categorized'
  old_values JSONB DEFAULT '{}',
  new_values JSONB DEFAULT '{}',
  user_id UUID NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.file_audit_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for audit log
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'file_audit_log' 
    AND policyname = 'Users can view their business file audit logs'
  ) THEN
    CREATE POLICY "Users can view their business file audit logs"
    ON public.file_audit_log
    FOR SELECT
    USING (business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    ));
  END IF;
END
$$;

-- Add indexes for audit log performance
CREATE INDEX IF NOT EXISTS idx_file_audit_log_file_id ON public.file_audit_log(file_id);
CREATE INDEX IF NOT EXISTS idx_file_audit_log_business_id ON public.file_audit_log(business_id);
CREATE INDEX IF NOT EXISTS idx_file_audit_log_created_at ON public.file_audit_log(created_at DESC);

-- Create index for file categories
CREATE INDEX IF NOT EXISTS idx_files_category_id ON public.files(category_id);

-- Add updated_at trigger to user_document_categories
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_user_document_categories_updated_at'
  ) THEN
    CREATE TRIGGER update_user_document_categories_updated_at
      BEFORE UPDATE ON public.user_document_categories
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END
$$;

-- Function to log file operations
CREATE OR REPLACE FUNCTION public.log_file_operation(
  p_file_id UUID,
  p_business_id UUID,
  p_operation TEXT,
  p_old_values JSONB DEFAULT '{}',
  p_new_values JSONB DEFAULT '{}',
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.file_audit_log (
    file_id,
    business_id,
    operation,
    old_values,
    new_values,
    user_id,
    metadata
  ) VALUES (
    p_file_id,
    p_business_id,
    p_operation,
    p_old_values,
    p_new_values,
    auth.uid(),
    p_metadata
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- Trigger to automatically log file mapping operations
CREATE OR REPLACE FUNCTION public.audit_task_file_mapping()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  business_id_val UUID;
  task_title TEXT;
BEGIN
  -- Get business_id from the associated task
  SELECT t.business_id::UUID, t.title INTO business_id_val, task_title
  FROM todos t 
  WHERE t.id = COALESCE(NEW.task_id, OLD.task_id);
  
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_file_operation(
      NEW.file_id,
      business_id_val,
      'mapped',
      '{}',
      jsonb_build_object('task_id', NEW.task_id, 'task_title', task_title),
      jsonb_build_object('mapped_by', NEW.mapped_by)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.log_file_operation(
      OLD.file_id,
      business_id_val,
      'unmapped',
      jsonb_build_object('task_id', OLD.task_id, 'task_title', task_title),
      '{}',
      jsonb_build_object('unmapped_by', auth.uid())
    );
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Create trigger for task file mapping audit (only if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'audit_task_file_mapping_trigger'
  ) THEN
    CREATE TRIGGER audit_task_file_mapping_trigger
      AFTER INSERT OR DELETE ON public.task_file_mappings
      FOR EACH ROW
      EXECUTE FUNCTION public.audit_task_file_mapping();
  END IF;
END
$$;

-- Performance optimization indexes (without CONCURRENTLY)
CREATE INDEX IF NOT EXISTS idx_files_dataroom_impact_area ON public.files(dataroom_id, impact_area) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS idx_todos_business_status ON public.todos(business_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_task_file_mappings_file_task ON public.task_file_mappings(file_id, task_id);

-- Insert default system categories for each business
INSERT INTO public.user_document_categories (business_id, name, description, color, icon, sort_order, is_system_category)
SELECT 
  b.id,
  'Legal Documents',
  'Articles of Association, certificates, and legal paperwork',
  '#DC2626',
  'scale',
  1,
  true
FROM businesses b
WHERE NOT EXISTS (
  SELECT 1 FROM user_document_categories udc 
  WHERE udc.business_id = b.id AND udc.name = 'Legal Documents'
)
ON CONFLICT (business_id, name) DO NOTHING;

INSERT INTO public.user_document_categories (business_id, name, description, color, icon, sort_order, is_system_category)
SELECT 
  b.id,
  'Financial Documents',
  'Financial statements, invoices, and accounting records',
  '#059669',
  'banknote',
  2,
  true
FROM businesses b
WHERE NOT EXISTS (
  SELECT 1 FROM user_document_categories udc 
  WHERE udc.business_id = b.id AND udc.name = 'Financial Documents'
)
ON CONFLICT (business_id, name) DO NOTHING;

INSERT INTO public.user_document_categories (business_id, name, description, color, icon, sort_order, is_system_category)
SELECT 
  b.id,
  'File Bin',
  'Deleted files awaiting permanent removal',
  '#6B7280',
  'trash-2',
  999,
  true
FROM businesses b
WHERE NOT EXISTS (
  SELECT 1 FROM user_document_categories udc 
  WHERE udc.business_id = b.id AND udc.name = 'File Bin'
)
ON CONFLICT (business_id, name) DO NOTHING;