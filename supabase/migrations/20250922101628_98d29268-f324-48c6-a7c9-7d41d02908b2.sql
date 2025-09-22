-- Add is_impact_locked column to todos table
ALTER TABLE public.todos 
ADD COLUMN is_impact_locked BOOLEAN NOT NULL DEFAULT false;