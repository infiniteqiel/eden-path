-- Create default document categories for businesses
-- This will be called when a business is created or can be run to add defaults to existing businesses

-- First, let's create a function to seed default categories for a business
CREATE OR REPLACE FUNCTION public.seed_default_document_categories(p_business_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert default document categories only if they don't already exist
  INSERT INTO public.user_document_categories (business_id, name, description, icon, color, sort_order, is_system_category)
  SELECT p_business_id, name, description, icon, color, sort_order, true
  FROM (VALUES 
    ('Business Plan', 'Core business documents and strategy', 'briefcase', '#3B82F6', 1),
    ('Legal Documents', 'Articles, incorporation, and legal files', 'shield', '#059669', 2),
    ('Financial Documents', 'Financial statements, budgets, and projections', 'calculator', '#DC2626', 3),
    ('Product / Service Policies', 'Product guides, service policies, and user manuals', 'settings', '#7C3AED', 4)
  ) AS defaults(name, description, icon, color, sort_order)
  WHERE NOT EXISTS (
    SELECT 1 FROM public.user_document_categories 
    WHERE business_id = p_business_id 
    AND name = defaults.name
    AND is_system_category = true
  );
END;
$$;

-- Add default categories for all existing businesses
DO $$
DECLARE
    business_record RECORD;
BEGIN
    FOR business_record IN SELECT id FROM public.businesses LOOP
        PERFORM public.seed_default_document_categories(business_record.id);
    END LOOP;
END $$;