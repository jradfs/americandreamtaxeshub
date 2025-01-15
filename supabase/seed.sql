-- Seed data for development
BEGIN;

-- Insert test clients
INSERT INTO clients (
    id,
    contact_email,
    full_name,
    status,
    business_type,
    company_name,
    ein,
    tax_year,
    service_config,
    document_requirements,
    onboarding_progress
) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'acme@example.com',
    'John Smith',
    'active',
    'llc',
    'ACME Corp LLC',
    '12-3456789',
    2024,
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
    '[
        {"type": "tax_return", "required": true},
        {"type": "financial_statement", "required": true}
    ]',
    '{
        "status": "in_progress",
        "completed_steps": ["initial_contact", "service_selection"],
        "next_steps": ["document_collection"],
        "documents_received": []
    }'
),
(
    '22222222-2222-2222-2222-222222222222',
    'tech@example.com',
    'Sarah Johnson',
    'active',
    's_corporation',
    'Tech Solutions Inc',
    '98-7654321',
    2024,
    '{
        "tax_preparation": {
            "type": "business",
            "frequency": "annual",
            "last_filed": "2023"
        },
        "advisory": {
            "frequency": "quarterly",
            "start_date": "2024-01-01"
        }
    }',
    '[
        {"type": "tax_return", "required": true},
        {"type": "corporate_docs", "required": true}
    ]',
    '{
        "status": "pending",
        "completed_steps": ["initial_contact"],
        "next_steps": ["service_selection", "document_collection"],
        "documents_received": []
    }'
);

-- Insert project templates
INSERT INTO project_templates (
    id,
    name,
    service_type,
    business_type,
    required_documents,
    task_template
) VALUES
(
    '33333333-3333-3333-3333-333333333333',
    'LLC Tax Return Template',
    'tax_preparation',
    'llc',
    '[
        {"category": "tax_return", "required": true},
        {"category": "financial_statement", "required": true}
    ]',
    '[
        {
            "title": "Initial Document Collection",
            "description": "Collect all required tax documents",
            "duration": 7,
            "order": 1
        },
        {
            "title": "Financial Review",
            "description": "Review financial statements",
            "duration": 3,
            "order": 2
        },
        {
            "title": "Tax Return Preparation",
            "description": "Prepare tax return",
            "duration": 5,
            "order": 3
        }
    ]'
),
(
    '44444444-4444-4444-4444-444444444444',
    'S-Corp Tax Return Template',
    'tax_preparation',
    's_corporation',
    '[
        {"category": "tax_return", "required": true},
        {"category": "financial_statement", "required": true},
        {"category": "corporate", "required": true}
    ]',
    '[
        {
            "title": "Document Collection",
            "description": "Collect corporate documents",
            "duration": 7,
            "order": 1
        },
        {
            "title": "Shareholder Review",
            "description": "Review shareholder information",
            "duration": 3,
            "order": 2
        },
        {
            "title": "Return Preparation",
            "description": "Prepare Form 1120S",
            "duration": 7,
            "order": 3
        }
    ]'
);

-- Insert workflow templates
INSERT INTO workflow_templates (
    id,
    name,
    service_type,
    steps,
    estimated_duration,
    required_roles
) VALUES
(
    '55555555-5555-5555-5555-555555555555',
    'Standard Tax Return Process',
    'tax_preparation',
    '[
        {
            "name": "document_collection",
            "title": "Document Collection",
            "duration": 7,
            "required_docs": ["tax_return", "financial_statement"]
        },
        {
            "name": "initial_review",
            "title": "Initial Review",
            "duration": 3,
            "dependencies": ["document_collection"]
        },
        {
            "name": "preparation",
            "title": "Return Preparation",
            "duration": 5,
            "dependencies": ["initial_review"]
        },
        {
            "name": "final_review",
            "title": "Final Review",
            "duration": 2,
            "dependencies": ["preparation"]
        }
    ]',
    17,
    ARRAY['preparer', 'reviewer']
),
(
    '66666666-6666-6666-6666-666666666666',
    'Monthly Bookkeeping Process',
    'bookkeeping',
    '[
        {
            "name": "document_gathering",
            "title": "Gather Monthly Documents",
            "duration": 3,
            "required_docs": ["financial_statement"]
        },
        {
            "name": "transaction_coding",
            "title": "Code Transactions",
            "duration": 2,
            "dependencies": ["document_gathering"]
        },
        {
            "name": "reconciliation",
            "title": "Account Reconciliation",
            "duration": 2,
            "dependencies": ["transaction_coding"]
        },
        {
            "name": "financial_review",
            "title": "Review Financial Statements",
            "duration": 1,
            "dependencies": ["reconciliation"]
        }
    ]',
    8,
    ARRAY['bookkeeper', 'reviewer']
);

-- Insert document templates
INSERT INTO document_templates (
    id,
    name,
    category,
    required_for,
    business_types,
    validation_rules
) VALUES
(
    '77777777-7777-7777-7777-777777777777',
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
),
(
    '88888888-8888-8888-8888-888888888888',
    'Form 1065 Template',
    'tax_return',
    ARRAY['tax_preparation']::service_type[],
    ARRAY['partnership', 'llc']::business_type[],
    '{
        "required_fields": ["ein", "tax_year", "partnership_name"],
        "validations": {
            "ein": {"pattern": "^\\d{2}-\\d{7}$"},
            "tax_year": {"min": 2020, "max": 2024}
        }
    }'
);

-- Create test projects
INSERT INTO projects (
    id,
    name,
    client_id,
    template_id,
    service_type,
    status,
    priority,
    workflow_state
) VALUES
(
    '99999999-9999-9999-9999-999999999999',
    '2024 Tax Return - ACME Corp',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    'tax_preparation',
    'in_progress',
    'high',
    '{
        "current_step": "document_collection",
        "steps_completed": ["initial_contact"],
        "next_steps": ["initial_review"],
        "blockers": []
    }'
),
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '2024 Tax Return - Tech Solutions',
    '22222222-2222-2222-2222-222222222222',
    '44444444-4444-4444-4444-444444444444',
    'tax_preparation',
    'not_started',
    'medium',
    '{
        "current_step": null,
        "steps_completed": [],
        "next_steps": ["document_collection"],
        "blockers": []
    }'
);

COMMIT; 