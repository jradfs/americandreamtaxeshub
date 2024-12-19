# Supabase CLI Setup Guide

## Prerequisites
1. Your Supabase project credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://fnjkkmwmpxqvezqextxg.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_ACCESS_TOKEN=sbp_829505ecb6492198977d14392b9272cf9723c08f
   SUPABASE_PROJECT_ID=fnjkkmwmpxqvezqextxg
   ```
2. Database password: `QBQmOUyqqgJXCpSo`

## Steps to Access Supabase

### 1. Initialize Supabase Project
```bash
npx supabase init --force
```
This creates the necessary Supabase configuration files in your project.

### 2. Environment Variables
Set environment variables in WSL:
```bash
export SUPABASE_ACCESS_TOKEN='sbp_829505ecb6492198977d14392b9272cf9723c08f'
export SUPABASE_DB_PASSWORD='QBQmOUyqqgJXCpSo'
```

### 3. Link Project
```bash
npx supabase link --project-ref fnjkkmwmpxqvezqextxg
```
This command:
- Connects to your remote Supabase project
- Pulls the configuration
- Creates a diff between local and remote configs
- Establishes the link for future operations

### 4. Generate Types
```bash
export SUPABASE_ACCESS_TOKEN='sbp_829505ecb6492198977d14392b9272cf9723c08f' && \
npx supabase gen types typescript --project-id fnjkkmwmpxqvezqextxg > src/types/database.types.ts
```

## Important Notes
1. **Environment Variables**: 
   - `SUPABASE_ACCESS_TOKEN`: Required for authentication with Supabase
   - `SUPABASE_DB_PASSWORD`: Required for database operations

2. **WSL Environment**:
   - Use `export VARIABLE_NAME='value'` to set environment variables
   - Variables can be added to `~/.bashrc` for persistence
   - Use `source ~/.bashrc` to reload environment variables

3. **Common Issues We Solved**:
   - Token format errors were resolved by setting the environment variable directly in WSL
   - Database access was simplified by setting `SUPABASE_DB_PASSWORD`
   - Using `--force` with init ensures clean configuration

4. **Configuration Files**:
   - `supabase/config.toml`: Contains your project configuration
   - `.env.local`: Stores your environment variables
   - `src/types/database.types.ts`: Generated TypeScript types

## Schema Management

### Using Supabase MCP Server
For quick schema updates and queries, you can use the Supabase MCP server:
```typescript
// Example: Adding a new column
<use_mcp_tool>
<server_name>supabase-server</server_name>
<tool_name>query</tool_name>
<arguments>
{
  "sql": "ALTER TABLE your_table ADD COLUMN new_column type;"
}
</arguments>
</use_mcp_tool>
```

### Schema Update Process
1. Make changes using either:
   - Supabase MCP server for quick updates
   - Migration files for complex changes
2. Update types:
   ```bash
   # Set access token and generate types
   export SUPABASE_ACCESS_TOKEN='sbp_829505ecb6492198977d14392b9272cf9723c08f' && \
   npx supabase gen types typescript --project-id fnjkkmwmpxqvezqextxg > src/types/database.types.ts
   ```
3. Test the changes in your application

## For Future Reference
To access Supabase in a new environment:
1. Set environment variables in WSL using `export`
2. Initialize Supabase if needed
3. Link your project
4. Generate types
