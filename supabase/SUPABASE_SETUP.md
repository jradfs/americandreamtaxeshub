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
The key to success was using PowerShell to set environment variables in the same session as the commands:
```powershell
$env:SUPABASE_ACCESS_TOKEN='sbp_829505ecb6492198977d14392b9272cf9723c08f'
$env:SUPABASE_DB_PASSWORD='QBQmOUyqqgJXCpSo'
```

### 3. Link Project
```powershell
npx supabase link --project-ref fnjkkmwmpxqvezqextxg
```
This command:
- Connects to your remote Supabase project
- Pulls the configuration
- Creates a diff between local and remote configs
- Establishes the link for future operations

### 4. Generate Types
```powershell
$env:SUPABASE_ACCESS_TOKEN='sbp_829505ecb6492198977d14392b9272cf9723c08f'
npx supabase gen types typescript --project-id fnjkkmwmpxqvezqextxg > src/types/database.types.ts
```

## Important Notes
1. **Environment Variables**: 
   - `SUPABASE_ACCESS_TOKEN`: Required for authentication with Supabase
   - `SUPABASE_DB_PASSWORD`: Required for database operations

2. **PowerShell vs CMD**:
   - PowerShell worked better for setting environment variables in the same session
   - The syntax `$env:VARIABLE_NAME='value'` is PowerShell-specific

3. **Common Issues We Solved**:
   - Token format errors were resolved by setting the environment variable directly in PowerShell
   - Database access was simplified by setting `SUPABASE_DB_PASSWORD`
   - Using `--force` with init ensures clean configuration

4. **Configuration Files**:
   - `supabase/config.toml`: Contains your project configuration
   - `.env.local`: Stores your environment variables
   - `src/types/database.types.ts`: Generated TypeScript types

## For Future Reference
To access Supabase in a new environment:
1. Set environment variables in PowerShell
2. Initialize Supabase if needed
3. Link your project
4. Generate types
