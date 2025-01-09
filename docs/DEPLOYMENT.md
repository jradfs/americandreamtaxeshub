# Deployment Guide

## Prerequisites

1. Node.js 18.x or later
2. PostgreSQL 14.x or later
3. Supabase account
4. Sentry account (optional)
5. Vercel account (recommended)

## Environment Setup

### Environment Variables

Create a `.env` file with the following variables:

```bash
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Error Reporting
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_sentry_auth_token
SENTRY_PROJECT=your_sentry_project
SENTRY_ORG=your_sentry_org

# Application
NEXT_PUBLIC_APP_URL=your_app_url
NODE_ENV=production
```

### Database Setup

1. Create a new Supabase project
2. Run the migrations:

```bash
# Install Supabase CLI
npm install -g supabase-cli

# Link to your project
supabase link --project-ref your_project_ref

# Run migrations
supabase db push
```

## Build Process

### Production Build

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start the production server
npm start
```

### Development Build

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Deployment Options

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with these settings:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### Manual Deployment

1. Build the application:

```bash
npm run build
```

2. Start the server:

```bash
# Using PM2
pm2 start npm --name "task-app" -- start

# Using systemd
sudo systemctl start task-app
```

## Database Migration

### Running Migrations

```bash
# Create a new migration
supabase migration new update_task_schema

# Apply migrations
supabase db push

# Reset database (development only)
supabase db reset
```

### Backup and Restore

```bash
# Backup database
supabase db dump -f backup.sql

# Restore database
supabase db restore backup.sql
```

## Error Reporting Setup

### Sentry Configuration

1. Create a new Sentry project
2. Add Sentry to the application:

```bash
# Install Sentry SDK
npm install @sentry/nextjs

# Initialize Sentry
npx @sentry/wizard -i nextjs
```

3. Configure Sentry in `next.config.js`:

```javascript
const { withSentryConfig } = require('@sentry/nextjs')

const nextConfig = {
  // Your Next.js config
}

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT
})
```

## Performance Monitoring

### Setting Up Monitoring

1. Enable Supabase monitoring:

```sql
-- Enable query monitoring
ALTER DATABASE your_database SET track_io_timing = ON;
ALTER DATABASE your_database SET track_functions = ALL;
```

2. Configure application monitoring:

```typescript
// pages/_app.tsx
import { init } from '@sentry/nextjs'

init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0
})
```

## Security Configuration

### Supabase RLS Policies

```sql
-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Tasks are viewable by authenticated users"
  ON tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Tasks are insertable by authenticated users"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (true);
```

### CORS Configuration

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_APP_URL },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' }
        ]
      }
    ]
  }
}
```

## Maintenance

### Health Checks

```typescript
// pages/api/health.ts
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  })
}
```

### Backup Strategy

1. Database backups:
```bash
# Daily backups
0 0 * * * supabase db dump -f backup-$(date +%Y%m%d).sql

# Keep last 7 days
find /backups -name "backup-*.sql" -mtime +7 -delete
```

2. Application state:
```bash
# Backup uploads and config
tar -czf backup-$(date +%Y%m%d).tar.gz ./public/uploads .env
```

## Troubleshooting

### Common Issues

1. Database Connection Issues:
```bash
# Check database connection
supabase db ping

# Check database logs
supabase logs
```

2. Application Errors:
```bash
# Check application logs
pm2 logs task-app

# Check error reporting
sentry-cli issues list
```

### Performance Issues

1. Database:
```sql
-- Check slow queries
SELECT * FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

2. Application:
```bash
# Check memory usage
pm2 monit

# Profile application
NODE_OPTIONS='--prof' npm start
```

## Best Practices

1. Always backup before deploying
2. Use staging environment for testing
3. Monitor error rates and performance
4. Keep dependencies updated
5. Regularly review security policies
6. Implement proper logging
7. Set up automated backups
8. Use CI/CD pipelines
9. Monitor resource usage
10. Document deployment changes 