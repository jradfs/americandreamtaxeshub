-- Begin transaction
BEGIN;

-- Test project template creation and cloning
DO $$
DECLARE
    template_id UUID;
    client_id UUID;
    project_id UUID;
BEGIN
    -- Create a test client
    INSERT INTO clients (name, email, business_type)
    VALUES ('Test Client', 'test@example.com', 'llc')
    RETURNING id INTO client_id;

    -- Create a test project template
    INSERT INTO project_templates (
        name,
        service_type,
        business_type,
        required_documents,
        task_template
    )
    VALUES (
        'LLC Tax Return Template',
        'tax_preparation',
        'llc',
        '[{"category": "tax_return", "required": true}, {"category": "financial_statement", "required": true}]',
        '[{"title": "Collect Documents", "order": 1}, {"title": "Review Financials", "order": 2}]'
    )
    RETURNING id INTO template_id;

    -- Test template cloning
    project_id := clone_project_template(
        template_id,
        client_id,
        '{"assignee": "test-user", "priority": "high"}'
    );

    -- Verify project creation
    ASSERT EXISTS (
        SELECT 1 FROM projects 
        WHERE id = project_id 
        AND template_id = template_id 
        AND client_id = client_id
    ), 'Project creation failed';

    -- Test document requirements validation
    ASSERT (
        SELECT validate_document_requirements(project_id) -> 'missing' 
        IS NOT NULL
    ), 'Document validation failed';

    -- Clean up test data
    DELETE FROM projects WHERE id = project_id;
    DELETE FROM project_templates WHERE id = template_id;
    DELETE FROM clients WHERE id = client_id;
END;
$$;

-- Test workflow templates
DO $$
DECLARE
    workflow_id UUID;
BEGIN
    -- Create test workflow template
    INSERT INTO workflow_templates (
        name,
        service_type,
        steps,
        estimated_duration,
        required_roles
    )
    VALUES (
        'Standard Tax Return Process',
        'tax_preparation',
        '[
            {"step": "document_collection", "duration": 7},
            {"step": "initial_review", "duration": 3},
            {"step": "preparation", "duration": 5},
            {"step": "final_review", "duration": 2}
        ]',
        17,
        ARRAY['preparer', 'reviewer']
    )
    RETURNING id INTO workflow_id;

    -- Verify workflow creation
    ASSERT EXISTS (
        SELECT 1 FROM workflow_templates 
        WHERE id = workflow_id
    ), 'Workflow template creation failed';

    -- Clean up
    DELETE FROM workflow_templates WHERE id = workflow_id;
END;
$$;

-- Test document templates
DO $$
DECLARE
    template_id UUID;
BEGIN
    -- Create test document template
    INSERT INTO document_templates (
        name,
        category,
        required_for,
        business_types,
        validation_rules
    )
    VALUES (
        'Form 1120S Template',
        'tax_return',
        ARRAY['tax_preparation']::service_type[],
        ARRAY['s_corporation']::business_type[],
        '{
            "required_fields": ["ein", "tax_year", "company_name"],
            "validations": {
                "ein": {"pattern": "^\\d{2}-\\d{7}$"},
                "tax_year": {"min": 2020, "max": 2024}
            }
        }'
    )
    RETURNING id INTO template_id;

    -- Verify template creation
    ASSERT EXISTS (
        SELECT 1 FROM document_templates 
        WHERE id = template_id
    ), 'Document template creation failed';

    -- Clean up
    DELETE FROM document_templates WHERE id = template_id;
END;
$$;

-- Test client service tracking
DO $$
DECLARE
    client_id UUID;
BEGIN
    -- Create test client with service config
    INSERT INTO clients (
        name,
        email,
        business_type,
        service_config,
        onboarding_progress
    )
    VALUES (
        'Test Service Client',
        'service@example.com',
        'llc',
        '{
            "tax_preparation": {
                "type": "business",
                "frequency": "annual",
                "last_filed": "2023"
            },
            "bookkeeping": {
                "frequency": "monthly",
                "start_date": "2024-01-01"
            }
        }',
        '{
            "status": "in_progress",
            "completed_steps": ["initial_contact", "service_selection"],
            "next_steps": ["document_collection"],
            "documents_received": []
        }'
    )
    RETURNING id INTO client_id;

    -- Verify client creation with service tracking
    ASSERT EXISTS (
        SELECT 1 FROM clients 
        WHERE id = client_id 
        AND service_config->>'tax_preparation' IS NOT NULL
    ), 'Client service tracking failed';

    -- Clean up
    DELETE FROM clients WHERE id = client_id;
END;
$$;

COMMIT; 