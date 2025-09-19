-- Phase 1: Database Schema Updates for File Mapping & Task Management Enhancement

-- 1. Add soft delete to todos table
ALTER TABLE todos ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE NULL;

-- 2. Add file categorization to files table
ALTER TABLE files ADD COLUMN category_id UUID NULL;
ALTER TABLE files ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;

-- 3. Create document_categories table for user-defined document categories
CREATE TABLE document_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT 'gray',
    icon TEXT DEFAULT 'folder',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for document_categories
ALTER TABLE document_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their business document categories" 
ON document_categories 
FOR ALL 
USING (business_id IN (
    SELECT id FROM businesses WHERE user_id = auth.uid()
));

-- 4. Create function to update file impact area when mapped to tasks
CREATE OR REPLACE FUNCTION update_file_impact_area()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- 5. Create trigger to automatically update file impact areas
CREATE TRIGGER update_file_impact_area_trigger
    AFTER INSERT OR DELETE ON task_file_mappings
    FOR EACH ROW
    EXECUTE FUNCTION update_file_impact_area();

-- 6. Add unique constraint to prevent duplicate file-task mappings
ALTER TABLE task_file_mappings 
ADD CONSTRAINT unique_task_file_mapping 
UNIQUE (task_id, file_id);

-- 7. Create indexes for better performance
CREATE INDEX idx_todos_deleted_at ON todos(deleted_at);
CREATE INDEX idx_files_category_id ON files(category_id);
CREATE INDEX idx_files_is_deleted ON files(is_deleted);
CREATE INDEX idx_document_categories_business_id ON document_categories(business_id);

-- 8. Update existing files to fix impact areas based on current mappings
UPDATE files 
SET impact_area = subquery.impact
FROM (
    SELECT 
        f.id as file_id,
        t.impact
    FROM files f
    JOIN task_file_mappings tfm ON f.id = tfm.file_id
    JOIN todos t ON tfm.task_id = t.id
    WHERE f.impact_area = 'Other'
    ORDER BY tfm.created_at DESC
) as subquery
WHERE files.id = subquery.file_id;