-- Create a function to fetch all workspace data efficiently
BEGIN;

CREATE OR REPLACE FUNCTION get_workspace_data()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result json;
BEGIN
    WITH project_data AS (
        SELECT * FROM projects
        ORDER BY created_at DESC
    ),
    task_data AS (
        SELECT 
            t.*,
            json_build_object(
                'id', p.id,
                'name', p.name
            ) as project
        FROM tasks t
        LEFT JOIN projects p ON t.project_id = p.id
        ORDER BY t.created_at DESC
    )
    SELECT json_build_object(
        'projects', COALESCE((SELECT json_agg(p.*) FROM project_data p), '[]'),
        'tasks', COALESCE((SELECT json_agg(t.*) FROM task_data t), '[]')
    ) INTO result;

    RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_workspace_data TO authenticated;

COMMIT;
