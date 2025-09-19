-- Fix Security Warning: Function Search Path Mutable
-- Update all functions to have immutable search_path

-- Fix log_file_operation function
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

-- Fix audit_task_file_mapping function
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

-- Fix seed_default_sub_areas function
CREATE OR REPLACE FUNCTION public.seed_default_sub_areas(p_business_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Governance sub-areas
  INSERT INTO public.impact_sub_areas (business_id, impact_area, title, description, sort_order, is_user_created) VALUES
  (p_business_id, 'Governance', 'Mission & Purpose', 'Legal mission lock and stakeholder governance', 1, false),
  (p_business_id, 'Governance', 'Board Structure', 'Board composition and oversight', 2, false),
  (p_business_id, 'Governance', 'Legal Compliance', 'Articles of Association and legal requirements', 3, false),
  (p_business_id, 'Governance', 'Transparency', 'Reporting and stakeholder communication', 4, false),
  
  -- Workers sub-areas
  (p_business_id, 'Workers', 'Compensation & Benefits', 'Fair wages, benefits, and financial security', 1, false),
  (p_business_id, 'Workers', 'Worker Ownership', 'Employee ownership and profit-sharing', 2, false),
  (p_business_id, 'Workers', 'Work Environment', 'Health, safety, and workplace culture', 3, false),
  (p_business_id, 'Workers', 'Career Development', 'Training, advancement, and professional growth', 4, false),
  
  -- Community sub-areas
  (p_business_id, 'Community', 'Local Community', 'Local economic development and community engagement', 1, false),
  (p_business_id, 'Community', 'Supply Chain', 'Supplier diversity and ethical sourcing', 2, false),
  (p_business_id, 'Community', 'Civic Engagement', 'Community service and civic participation', 3, false),
  (p_business_id, 'Community', 'Charitable Giving', 'Donations and community support', 4, false),
  
  -- Environment sub-areas
  (p_business_id, 'Environment', 'Environmental Management', 'Environmental policies and monitoring', 1, false),
  (p_business_id, 'Environment', 'Resource Conservation', 'Energy, water, and material efficiency', 2, false),
  (p_business_id, 'Environment', 'Pollution & Waste', 'Waste reduction and pollution prevention', 3, false),
  (p_business_id, 'Environment', 'Climate Action', 'Carbon footprint and climate initiatives', 4, false),
  
  -- Customers sub-areas
  (p_business_id, 'Customers', 'Product Quality', 'Product safety, quality, and customer satisfaction', 1, false),
  (p_business_id, 'Customers', 'Customer Service', 'Support, responsiveness, and customer experience', 2, false),
  (p_business_id, 'Customers', 'Data Protection', 'Privacy, security, and data handling practices', 3, false),
  (p_business_id, 'Customers', 'Customer Impact', 'Beneficial outcomes for customers and society', 4, false);
END;
$$;

-- Fix update_file_impact_area function
CREATE OR REPLACE FUNCTION public.update_file_impact_area()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    -- On INSERT (new mapping)
    IF TG_OP = 'INSERT' THEN
        -- Get the task's impact area and update the file
        UPDATE files 
        SET impact_area = (
            SELECT impact FROM todos WHERE id = NEW.task_id
        ),
        updated_at = now()
        WHERE id = NEW.file_id;
        
        RETURN NEW;
    END IF;
    
    -- On DELETE (unmapping)
    IF TG_OP = 'DELETE' THEN
        -- Check if file is mapped to other tasks
        IF NOT EXISTS (
            SELECT 1 FROM task_file_mappings 
            WHERE file_id = OLD.file_id AND task_id != OLD.task_id
        ) THEN
            -- Reset to 'Other' if no other mappings exist
            UPDATE files 
            SET impact_area = 'Other',
            updated_at = now()
            WHERE id = OLD.file_id;
        ELSE
            -- Set to the impact area of the most recent remaining mapping
            UPDATE files 
            SET impact_area = (
                SELECT t.impact 
                FROM task_file_mappings tfm
                JOIN todos t ON tfm.task_id = t.id
                WHERE tfm.file_id = OLD.file_id
                ORDER BY tfm.created_at DESC
                LIMIT 1
            ),
            updated_at = now()
            WHERE id = OLD.file_id;
        END IF;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$;