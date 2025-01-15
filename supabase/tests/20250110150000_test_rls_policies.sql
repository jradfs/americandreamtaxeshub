-- Test RLS policies
BEGIN;

-- Create test users
INSERT INTO auth.users (id, email)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'team1@example.com'),
    ('00000000-0000-0000-0000-000000000002', 'team2@example.com')
ON CONFLICT (id) DO NOTHING;

-- Test authenticated access
DO $$
DECLARE
    test_client_id UUID;
    test_project_id UUID;
    test_document_id UUID;
    test_task_id UUID;
BEGIN
    -- Set role to authenticated user
    SET LOCAL ROLE authenticated;
    SET LOCAL request.jwt.claim.sub TO '00000000-0000-0000-0000-000000000001';

    -- Test client creation and access
    INSERT INTO clients (
        id,
        contact_email,
        full_name,
        status,
        business_type,
        company_name,
        tax_year
    ) VALUES (
        gen_random_uuid(),
        'test@example.com',
        'Test Client',
        'active',
        'llc',
        'Test LLC',
        2024
    ) RETURNING id INTO test_client_id;

    -- Verify client read access
    ASSERT EXISTS (
        SELECT 1 FROM clients WHERE id = test_client_id
    ), 'Client read access failed';

    -- Test project creation and access
    INSERT INTO projects (
        id,
        name,
        client_id,
        status,
        priority
    ) VALUES (
        gen_random_uuid(),
        'Test Project',
        test_client_id,
        'not_started',
        'high'
    ) RETURNING id INTO test_project_id;

    -- Verify project read access
    ASSERT EXISTS (
        SELECT 1 FROM projects WHERE id = test_project_id
    ), 'Project read access failed';

    -- Test document creation and access
    INSERT INTO documents (
        id,
        client_id,
        project_id,
        category,
        file_name,
        file_path
    ) VALUES (
        gen_random_uuid(),
        test_client_id,
        test_project_id,
        'tax_return',
        'test.pdf',
        '/test/path.pdf'
    ) RETURNING id INTO test_document_id;

    -- Verify document read access
    ASSERT EXISTS (
        SELECT 1 FROM documents WHERE id = test_document_id
    ), 'Document read access failed';

    -- Test task creation and access
    INSERT INTO tasks (
        id,
        title,
        project_id,
        status
    ) VALUES (
        gen_random_uuid(),
        'Test Task',
        test_project_id,
        'not_started'
    ) RETURNING id INTO test_task_id;

    -- Verify task read access
    ASSERT EXISTS (
        SELECT 1 FROM tasks WHERE id = test_task_id
    ), 'Task read access failed';

    -- Test update permissions
    UPDATE clients 
    SET full_name = 'Updated Client Name'
    WHERE id = test_client_id;

    UPDATE projects
    SET name = 'Updated Project Name'
    WHERE id = test_project_id;

    UPDATE documents
    SET file_name = 'updated.pdf'
    WHERE id = test_document_id;

    UPDATE tasks
    SET title = 'Updated Task'
    WHERE id = test_task_id;

    -- Verify updates
    ASSERT EXISTS (
        SELECT 1 FROM clients WHERE id = test_client_id AND full_name = 'Updated Client Name'
    ), 'Client update failed';

    ASSERT EXISTS (
        SELECT 1 FROM projects WHERE id = test_project_id AND name = 'Updated Project Name'
    ), 'Project update failed';

    ASSERT EXISTS (
        SELECT 1 FROM documents WHERE id = test_document_id AND file_name = 'updated.pdf'
    ), 'Document update failed';

    ASSERT EXISTS (
        SELECT 1 FROM tasks WHERE id = test_task_id AND title = 'Updated Task'
    ), 'Task update failed';

    -- Test cross-user access (should succeed for team members)
    SET LOCAL request.jwt.claim.sub TO '00000000-0000-0000-0000-000000000002';

    ASSERT EXISTS (
        SELECT 1 FROM clients WHERE id = test_client_id
    ), 'Cross-user client access failed';

    ASSERT EXISTS (
        SELECT 1 FROM projects WHERE id = test_project_id
    ), 'Cross-user project access failed';

    ASSERT EXISTS (
        SELECT 1 FROM documents WHERE id = test_document_id
    ), 'Cross-user document access failed';

    ASSERT EXISTS (
        SELECT 1 FROM tasks WHERE id = test_task_id
    ), 'Cross-user task access failed';

    -- Test delete permissions
    DELETE FROM tasks WHERE id = test_task_id;
    DELETE FROM documents WHERE id = test_document_id;
    DELETE FROM projects WHERE id = test_project_id;
    DELETE FROM clients WHERE id = test_client_id;

    -- Verify deletes
    ASSERT NOT EXISTS (
        SELECT 1 FROM tasks WHERE id = test_task_id
    ), 'Task delete failed';

    ASSERT NOT EXISTS (
        SELECT 1 FROM documents WHERE id = test_document_id
    ), 'Document delete failed';

    ASSERT NOT EXISTS (
        SELECT 1 FROM projects WHERE id = test_project_id
    ), 'Project delete failed';

    ASSERT NOT EXISTS (
        SELECT 1 FROM clients WHERE id = test_client_id
    ), 'Client delete failed';
END;
$$;

-- Test unauthenticated access (should fail)
DO $$
BEGIN
    SET LOCAL ROLE anon;

    -- Attempt to read data (should fail)
    ASSERT NOT EXISTS (
        SELECT 1 FROM clients LIMIT 1
    ), 'Unauthenticated client access should fail';

    ASSERT NOT EXISTS (
        SELECT 1 FROM projects LIMIT 1
    ), 'Unauthenticated project access should fail';

    ASSERT NOT EXISTS (
        SELECT 1 FROM documents LIMIT 1
    ), 'Unauthenticated document access should fail';

    ASSERT NOT EXISTS (
        SELECT 1 FROM tasks LIMIT 1
    ), 'Unauthenticated task access should fail';

    -- Attempt to insert data (should fail)
    BEGIN
        INSERT INTO clients (contact_email, full_name, status)
        VALUES ('test@example.com', 'Test', 'active');
        ASSERT FALSE, 'Unauthenticated insert should fail';
    EXCEPTION WHEN insufficient_privilege THEN
        -- Expected
    END;

    -- Attempt to update data (should fail)
    BEGIN
        UPDATE clients SET full_name = 'Test' WHERE id = '11111111-1111-1111-1111-111111111111';
        ASSERT FALSE, 'Unauthenticated update should fail';
    EXCEPTION WHEN insufficient_privilege THEN
        -- Expected
    END;

    -- Attempt to delete data (should fail)
    BEGIN
        DELETE FROM clients WHERE id = '11111111-1111-1111-1111-111111111111';
        ASSERT FALSE, 'Unauthenticated delete should fail';
    EXCEPTION WHEN insufficient_privilege THEN
        -- Expected
    END;
END;
$$;

ROLLBACK; 