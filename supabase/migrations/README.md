# Database Migrations for American Dream Taxes Hub

## Phase 1 Schema Implementation

This directory contains the database migrations for implementing Phase 1 of the American Dream Taxes Hub. The migrations follow a sequential order and should be applied in the order of their timestamps.

### Latest Migration: 20250110110000_implement_phase1_schema.sql

This migration implements core functionality for:

1. Project Templates & Automation
   - Template-based project creation
   - Workflow state tracking
   - Automation configuration

2. Enhanced Client Service Tracking
   - Service configuration
   - Document requirements
   - Onboarding progress tracking

3. Document Management
   - Document processing status
   - Verification workflow
   - Document relationships
   - Timeline tracking

4. Template Systems
   - Document templates
   - Workflow templates
   - Validation rules

### How to Apply Migrations

1. Ensure you have Supabase CLI installed:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. Apply migrations:
   ```bash
   supabase db push
   ```

4. Run tests:
   ```bash
   psql -f supabase/tests/20250110110000_test_phase1_schema.sql
   ```

### Schema Changes

The migration adds:

1. New Tables:
   - `document_templates`
   - `workflow_templates`

2. New Columns to Existing Tables:
   - Projects:
     - `automation_config`
     - `template_data`
     - `workflow_state`
   
   - Clients:
     - `service_config`
     - `document_requirements`
     - `onboarding_progress`
   
   - Documents:
     - `processing_status`
     - `verification_status`
     - `extracted_data`
     - `related_documents`
     - `document_timeline`

3. New Functions:
   - `clone_project_template`
   - `validate_document_requirements`

### Rollback Plan

To rollback this migration:

1. Create a rollback migration:
   ```sql
   -- Drop new tables
   DROP TABLE IF EXISTS document_templates;
   DROP TABLE IF EXISTS workflow_templates;

   -- Remove new columns
   ALTER TABLE projects 
   DROP COLUMN IF EXISTS automation_config,
   DROP COLUMN IF EXISTS template_data,
   DROP COLUMN IF EXISTS workflow_state;

   -- ... similar for other tables
   ```

2. Apply the rollback:
   ```bash
   supabase db reset
   ```

### Testing

The migration includes comprehensive tests in `supabase/tests/20250110110000_test_phase1_schema.sql` that verify:

1. Project template creation and cloning
2. Workflow template functionality
3. Document template system
4. Client service tracking
5. Document validation rules

Run tests after migration to ensure everything is working as expected. 