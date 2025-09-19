-- Create task-file mappings table for many-to-many relationship
CREATE TABLE public.task_file_mappings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL,
  file_id UUID NOT NULL,
  mapped_by UUID REFERENCES auth.users(id),
  mapped_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure unique mapping per task-file pair
  UNIQUE(task_id, file_id)
);

-- Enable RLS
ALTER TABLE public.task_file_mappings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for task file mappings
CREATE POLICY "Users can manage task file mappings for their businesses"
ON public.task_file_mappings
FOR ALL
USING (
  task_id IN (
    SELECT t.id 
    FROM todos t 
    WHERE t.user_id = auth.uid()
  )
);

-- Create indexes for better performance
CREATE INDEX idx_task_file_mappings_task_id ON public.task_file_mappings(task_id);
CREATE INDEX idx_task_file_mappings_file_id ON public.task_file_mappings(file_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_task_file_mappings_updated_at
BEFORE UPDATE ON public.task_file_mappings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();