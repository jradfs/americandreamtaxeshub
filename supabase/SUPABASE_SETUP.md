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

## IMPORTANT: Database Changes Process

ALL database changes MUST follow this process:

1. NEVER make changes directly in the Supabase dashboard
2. ALWAYS create and use migration files
3. Apply migrations to remote database
4. Generate fresh TypeScript types
5. Commit all changes

## Steps for Making Database Changes

### 1. Create Migration File

```bash
npx supabase migration new your_migration_name
```

### 2. Edit Migration File

Edit the newly created SQL file in `supabase/migrations/` with your changes

### 3. Apply Migration to Remote

```bash
# First ensure you're linked to the project
npx supabase link --project-ref fnjkkmwmpxqvezqextxg

# Then push migrations
npx supabase db push
```

### 4. Generate Fresh Types

After migrations are applied, ALWAYS regenerate types:

```powershell
# Windows (PowerShell)
$env:SUPABASE_ACCESS_TOKEN="sbp_829505ecb6492198977d14392b9272cf9723c08f"; npx supabase gen types typescript --project-id fnjkkmwmpxqvezqextxg | Out-File -Encoding UTF8 src/types/database.types.ts
```

```bash
# Linux/MacOS
export SUPABASE_ACCESS_TOKEN='sbp_829505ecb6492198977d14392b9272cf9723c08f'
npx supabase gen types typescript --project-id fnjkkmwmpxqvezqextxg > src/types/database.types.ts
```

### 5. Commit Changes

Commit both the migration file and the updated types file.

## Environment Setup

### Windows (PowerShell)

```powershell
$env:SUPABASE_ACCESS_TOKEN="sbp_829505ecb6492198977d14392b9272cf9723c08f"
$env:SUPABASE_DB_PASSWORD="QBQmOUyqqgJXCpSo"
```

### Linux/MacOS (Bash)

```bash
export SUPABASE_ACCESS_TOKEN='sbp_829505ecb6492198977d14392b9272cf9723c08f'
export SUPABASE_DB_PASSWORD='QBQmOUyqqgJXCpSo'
```

## Troubleshooting

### Migration Issues

If migrations are out of sync:

```bash
# Check status
npx supabase migration list

# Repair if needed
npx supabase migration repair --status reverted TIMESTAMP_migration_name

# Pull current schema
npx supabase db pull
```

## Common Mistakes to Avoid

1. ❌ NEVER modify database.types.ts directly
2. ❌ NEVER make changes in Supabase dashboard
3. ❌ NEVER skip generating fresh types after migrations
4. ✅ ALWAYS use migration files for ALL database changes
5. ✅ ALWAYS generate fresh types after applying migrations
6. ✅ ALWAYS commit both migration and updated types files
