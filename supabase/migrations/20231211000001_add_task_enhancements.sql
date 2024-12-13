-- Add time estimate and dependency tracking to tasks
ALTER TABLE tasks
ADD COLUMN estimated_minutes integer,
ADD COLUMN actual_minutes integer,
ADD COLUMN dependencies uuid[] DEFAULT ARRAY[]::uuid[],
ADD COLUMN template_id uuid REFERENCES project_templates(id),
ADD COLUMN category text,
ADD COLUMN tags text[];

-- Create an index for faster dependency lookups
CREATE INDEX idx_task_dependencies ON tasks USING gin(dependencies);

-- Add a function to validate task dependencies (prevent circular dependencies)
CREATE OR REPLACE FUNCTION check_task_dependencies()
RETURNS TRIGGER AS $$
DECLARE
    dependency_path uuid[];
    current_task uuid;
BEGIN
    IF NEW.dependencies IS NULL OR array_length(NEW.dependencies, 1) = 0 THEN
        RETURN NEW;
    END IF;
    
    -- Check each dependency
    FOR current_task IN SELECT unnest(NEW.dependencies) LOOP
        -- Check if the dependency exists
        IF NOT EXISTS (SELECT 1 FROM tasks WHERE id = current_task) THEN
            RAISE EXCEPTION 'Task dependency % does not exist', current_task;
        END IF;
        
        -- Check for circular dependencies
        WITH RECURSIVE dependency_check AS (
            SELECT id, dependencies, ARRAY[id] as path
            FROM tasks
            WHERE id = current_task
            UNION ALL
            SELECT t.id, t.dependencies, dc.path || t.id
            FROM tasks t
            INNER JOIN dependency_check dc ON t.id = ANY(dc.dependencies)
            WHERE NOT t.id = ANY(dc.path)
        )
        SELECT path INTO dependency_path
        FROM dependency_check
        WHERE NEW.id = ANY(dependencies)
        LIMIT 1;
        
        IF FOUND THEN
            RAISE EXCEPTION 'Circular dependency detected: %', dependency_path;
        END IF;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for dependency validation
CREATE TRIGGER validate_task_dependencies
    BEFORE INSERT OR UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION check_task_dependencies();

-- Add comments for documentation
COMMENT ON COLUMN tasks.estimated_minutes IS 'Estimated time to complete the task in minutes';
COMMENT ON COLUMN tasks.actual_minutes IS 'Actual time spent on the task in minutes';
COMMENT ON COLUMN tasks.dependencies IS 'Array of task IDs that must be completed before this task';
COMMENT ON COLUMN tasks.template_id IS 'Reference to the project template this task was created from';
COMMENT ON COLUMN tasks.category IS 'Task category (e.g., Bookkeeping, Tax Return, Payroll)';
COMMENT ON COLUMN tasks.tags IS 'Array of tags for better task organization and filtering';
