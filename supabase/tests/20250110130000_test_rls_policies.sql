-- Begin transaction
BEGIN;

-- Test setup
DO $$
DECLARE
    test_user_id UUID;
    test_client_id UUID;
    test_project_id UUID;
    test_document_id UUID;
    test_template_id UUID;
BEGIN
    -- Create test user
    INSERT INTO auth.users (id, email)
    VALUES ('00000000-0000-0000-0000-000000000001', 'test@example.com')
    RETURNING id INTO test_user_id;

    -- Set authenticated role
    SET LOCAL ROLE authenticated;

    -- Test client access
    INSERT INTO clients (
        id,
        contact_email,
        full_name,
        status,
        business_type
    )
    VALUES (
        '00000000-0000-0000-0000-000000000002',
        'client@example.com',
        'Test Client',
        'active',
        'llc'
    )
    RETURNING id INTO test_client_id;

    -- Verify client read access
    ASSERT EXISTS (
        SELECT 1 FROM clients WHERE id = test_client_id
    ), 'Client read access failed';

    -- Test project access
    INSERT INTO projects (
        id,
        name,
        client_id,
        status,
        priority
    )
    VALUES (
        '00000000-0000-0000-0000-000000000003',
        'Test Project',
        test_client_id,
        'not_started',
        'high'
    )
    RETURNING id INTO test_project_id;

    -- Verify project read access
    ASSERT EXISTS (
        SELECT 1 FROM projects WHERE id = test_project_id
    ), 'Project read access failed';

    -- Test document access
    INSERT INTO documents (
        id,
        client_id,
        project_id,
        category,
        file_name,
        file_path
    )
    VALUES (
        '00000000-0000-0000-0000-000000000004',
        test_client_id,
        test_project_id,
        'tax_return',
        'test.pdf',
        '/test/path.pdf'
    )
    RETURNING id INTO test_document_id;

    -- Verify document read access
    ASSERT EXISTS (
        SELECT 1 FROM documents WHERE id = test_document_id
    ), 'Document read access failed';

    -- Test template access
    INSERT INTO project_templates (
        id,
        name,
        service_type,
        business_type
    )
    VALUES (
        '00000000-0000-0000-0000-000000000005',
        'Test Template',
        'tax_preparation',
        'llc'
    )
    RETURNING id INTO test_template_id;

    -- Verify template read access
    ASSERT EXISTS (
        SELECT 1 FROM project_templates WHERE id = test_template_id
    ), 'Template read access failed';

    -- Test update operations
    UPDATE clients
    SET full_name = 'Updated Client Name'
    WHERE id = test_client_id;

    UPDATE projects
    SET name = 'Updated Project Name'
    WHERE id = test_project_id;

    UPDATE documents
    SET file_name = 'updated.pdf'
    WHERE id = test_document_id;

    -- Verify updates
    ASSERT EXISTS (
        SELECT 1 FROM clients 
        WHERE id = test_client_id AND full_name = 'Updated Client Name'
    ), 'Client update failed';

    ASSERT EXISTS (
        SELECT 1 FROM projects 
        WHERE id = test_project_id AND name = 'Updated Project Name'
    ), 'Project update failed';

    ASSERT EXISTS (
        SELECT 1 FROM documents 
        WHERE id = test_document_id AND file_name = 'updated.pdf'
    ), 'Document update failed';

    -- Test delete operations
    DELETE FROM documents WHERE id = test_document_id;
    DELETE FROM projects WHERE id = test_project_id;
    DELETE FROM clients WHERE id = test_client_id;
    DELETE FROM project_templates WHERE id = test_template_id;

    -- Verify deletes
    ASSERT NOT EXISTS (
        SELECT 1 FROM documents WHERE id = test_document_id
    ), 'Document delete failed';

    ASSERT NOT EXISTS (
        SELECT 1 FROM projects WHERE id = test_project_id
    ), 'Project delete failed';

    ASSERT NOT EXISTS (
        SELECT 1 FROM clients WHERE id = test_client_id
    ), 'Client delete failed';

    ASSERT NOT EXISTS (
        SELECT 1 FROM project_templates WHERE id = test_template_id
    ), 'Template delete failed';

END;
$$;

-- Test unauthenticated access (should fail)
DO $$
BEGIN
    SET LOCAL ROLE anon;

    -- Attempt to read clients (should fail)
    ASSERT NOT EXISTS (
        SELECT 1 FROM clients LIMIT 1
    ), 'Unauthenticated client access should fail';

    -- Attempt to read projects (should fail)
    ASSERT NOT EXISTS (
        SELECT 1 FROM projects LIMIT 1
    ), 'Unauthenticated project access should fail';

    -- Attempt to read documents (should fail)
    ASSERT NOT EXISTS (
        SELECT 1 FROM documents LIMIT 1
    ), 'Unauthenticated document access should fail';

    -- Attempt to read templates (should fail)
    ASSERT NOT EXISTS (
        SELECT 1 FROM project_templates LIMIT 1
    ), 'Unauthenticated template access should fail';
END;
$$;

ROLLBACK; 