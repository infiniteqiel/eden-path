-- Fix security warning: Set search_path for the seed function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;