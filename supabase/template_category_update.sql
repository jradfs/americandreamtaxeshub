-- Template Category and Project Template Update Script

-- Step 1: Add missing template categories
DO $$
BEGIN
    -- Insert categories if they don't exist
    IF NOT EXISTS (SELECT 1 FROM template_categories WHERE name = 'Tax Planning') THEN
        INSERT INTO template_categories (name, description) 
        VALUES ('Tax Planning', 'Templates for comprehensive tax planning');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM template_categories WHERE name = 'Bookkeeping') THEN
        INSERT INTO template_categories (name, description) 
        VALUES ('Bookkeeping', 'Templates for monthly and quarterly bookkeeping');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM template_categories WHERE name = 'Business Services') THEN
        INSERT INTO template_categories (name, description) 
        VALUES ('Business Services', 'Templates for business-related tax and financial services');
    END IF;
END $$;

-- Step 2: Update existing project templates to link with categories
UPDATE project_templates pt
SET category_id = (
    SELECT id 
    FROM template_categories tc 
    WHERE LOWER(tc.name) = LOWER(pt.category)
)
WHERE pt.category_id IS NULL;

-- Step 3: Verify the updates
SELECT 
    pt.id, 
    pt.title, 
    pt.category, 
    tc.name as category_name,
    tc.id as category_id
FROM 
    project_templates pt
LEFT JOIN 
    template_categories tc ON pt.category_id = tc.id;

-- Optional: Create a view for easy template-category relationship tracking
CREATE OR REPLACE VIEW v_template_categories AS
SELECT 
    pt.id as template_id,
    pt.title as template_title,
    pt.description as template_description,
    tc.id as category_id,
    tc.name as category_name,
    tc.description as category_description
FROM 
    project_templates pt
LEFT JOIN 
    template_categories tc ON pt.category_id = tc.id;

-- Additional helper function for category management
CREATE OR REPLACE FUNCTION create_or_update_template_category(
    p_name TEXT, 
    p_description TEXT
) RETURNS UUID AS $$
DECLARE
    existing_category_id UUID;
    new_category_id UUID;
BEGIN
    -- Check if category already exists
    SELECT id INTO existing_category_id 
    FROM template_categories 
    WHERE LOWER(name) = LOWER(p_name);

    IF existing_category_id IS NOT NULL THEN
        -- Update existing category
        UPDATE template_categories
        SET description = p_description,
            updated_at = NOW()
        WHERE id = existing_category_id;
        
        RETURN existing_category_id;
    ELSE
        -- Insert new category
        INSERT INTO template_categories (name, description)
        VALUES (p_name, p_description)
        RETURNING id INTO new_category_id;
        
        RETURN new_category_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Example usage of the helper function
-- SELECT create_or_update_template_category('New Category', 'Description of new category');
