-- Phase 1: Database Schema Updates (Skip existing tables)

-- 1. Add soft delete to todos table (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'todos' AND column_name = 'deleted_at') THEN
        ALTER TABLE todos ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE NULL;
    END IF;
END $$;

-- 2. Add file categorization to files table (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'files' AND column_name = 'category_id') THEN
        ALTER TABLE files ADD COLUMN category_id UUID NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'files' AND column_name = 'is_deleted') THEN
        ALTER TABLE files ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- 3. Create function to update file impact area when mapped to tasks
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

-- 4. Create trigger to automatically update file impact areas (drop first if exists)
DROP TRIGGER IF EXISTS update_file_impact_area_trigger ON task_file_mappings;

CREATE TRIGGER update_file_impact_area_trigger
    AFTER INSERT OR DELETE ON task_file_mappings
    FOR EACH ROW
    EXECUTE FUNCTION update_file_impact_area();

-- 5. Add unique constraint to prevent duplicate file-task mappings (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'unique_task_file_mapping' 
        AND table_name = 'task_file_mappings'
    ) THEN
        ALTER TABLE task_file_mappings 
        ADD CONSTRAINT unique_task_file_mapping 
        UNIQUE (task_id, file_id);
    END IF;
END $$;

-- 6. Create indexes for better performance (if not exists)
CREATE INDEX IF NOT EXISTS idx_todos_deleted_at ON todos(deleted_at);
CREATE INDEX IF NOT EXISTS idx_files_category_id ON files(category_id);
CREATE INDEX IF NOT EXISTS idx_files_is_deleted ON files(is_deleted);

-- 7. Update existing files to fix impact areas based on current mappings
UPDATE files 
SET impact_area = subquery.impact
FROM (
    SELECT DISTINCT ON (f.id)
        f.id as file_id,
        t.impact
    FROM files f
    JOIN task_file_mappings tfm ON f.id = tfm.file_id
    JOIN todos t ON tfm.task_id = t.id
    WHERE f.impact_area = 'Other'
    ORDER BY f.id, tfm.created_at DESC
) as subquery
WHERE files.id = subquery.file_id;