-- Drop the function if it exists to avoid conflicts during migrations
DROP FUNCTION IF EXISTS public.get_tax_return_status();

-- Create the function to get tax return status counts
CREATE OR REPLACE FUNCTION public.get_tax_return_status()
RETURNS TABLE (
    status text,
    count bigint
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Verify that the user is authenticated
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Return aggregated counts of tax returns by status
    -- Only returns data for tax returns associated with the authenticated user
    RETURN QUERY
    SELECT 
        tr.status,
        COUNT(*)::bigint
    FROM tax_returns tr
    WHERE tr.user_id = auth.uid()
    GROUP BY tr.status
    ORDER BY tr.status;
END;
$$;

-- Set proper permissions
ALTER FUNCTION public.get_tax_return_status() OWNER TO postgres;
REVOKE ALL ON FUNCTION public.get_tax_return_status() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_tax_return_status() TO authenticated;

-- Add function comment
COMMENT ON FUNCTION public.get_tax_return_status() IS 'Retrieves aggregated counts of tax returns by status for the authenticated user';