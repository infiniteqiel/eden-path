-- Create impact_sub_areas table for customizable sub-areas
CREATE TABLE public.impact_sub_areas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL,
  impact_area TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon_type TEXT DEFAULT 'default',
  sort_order INTEGER DEFAULT 0,
  is_user_created BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on impact_sub_areas
ALTER TABLE public.impact_sub_areas ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their business sub-areas
CREATE POLICY "Users can manage their business sub-areas" 
ON public.impact_sub_areas 
FOR ALL 
USING (business_id IN (
  SELECT businesses.id 
  FROM businesses 
  WHERE businesses.user_id = auth.uid()
));

-- Add sub_area_id to todos table for explicit assignment
ALTER TABLE public.todos ADD COLUMN sub_area_id UUID REFERENCES public.impact_sub_areas(id);

-- Create trigger for updated_at on impact_sub_areas
CREATE TRIGGER update_impact_sub_areas_updated_at
  BEFORE UPDATE ON public.impact_sub_areas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default sub-areas for each impact area
-- Note: These will be inserted per business when they're created, but here are the templates

-- Create function to seed default sub-areas for a business
CREATE OR REPLACE FUNCTION public.seed_default_sub_areas(p_business_id UUID)
RETURNS VOID AS $$
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
$$ LANGUAGE plpgsql;