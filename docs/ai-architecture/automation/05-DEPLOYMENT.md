# Deployment and Infrastructure Guide

## Overview
Comprehensive deployment and infrastructure setup for the tax practice automation system.

## Infrastructure Setup

### Docker Configuration
```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
```

## CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/main.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Build and push Docker image
        run: |
          docker build -t tax-practice-app .
          docker push ${{ secrets.ECR_REGISTRY }}/tax-practice-app:latest
```

## Infrastructure as Code

### Terraform Configuration
```hcl
# main.tf
provider "aws" {
  region = "us-east-1"
}

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  name   = "tax-practice-vpc"
  cidr   = "10.0.0.0/16"
  
  azs             = ["us-east-1a", "us-east-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]
}

module "ecs" {
  source = "terraform-aws-modules/ecs/aws"
  
  cluster_name = "tax-practice-cluster"
  
  fargate_capacity_providers = {
    FARGATE = {
      default_capacity_provider_strategy = {
        weight = 100
      }
    }
  }
}
```

## Monitoring Setup

### Application Monitoring
```typescript
// src/lib/monitoring.ts
import { init as initApm } from '@elastic/apm-rum'

export function setupMonitoring() {
  if (process.env.NODE_ENV === 'production') {
    initApm({
      serviceName: 'tax-practice-app',
      serverUrl: process.env.APM_SERVER_URL,
      environment: process.env.NODE_ENV
    })
  }
}
```

### Health Checks
```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from('health_check').select('*')
    
    if (error) throw error
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: error.message },
      { status: 500 }
    )
  }
}
```

## Security Configuration

### Security Headers
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'"
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          }
        ]
      }
    ]
  }
}
```

## Environment Variables

### Production Environment
```bash
# .env.production
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=your_production_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_key
APM_SERVER_URL=your_apm_url
```

## Backup Strategy

### Database Backups
```bash
#!/bin/bash
# scripts/backup-db.sh

TODAY=$(date +"%Y%m%d")
BACKUP_DIR="/backups/database"

# Create backup
pg_dump $DATABASE_URL > "$BACKUP_DIR/backup-$TODAY.sql"

# Cleanup old backups (keep last 7 days)
find $BACKUP_DIR -type f -mtime +7 -delete
```

## Deployment Steps

1. Prepare Environment
```bash
# Install dependencies
npm ci

# Build application
npm run build
```

2. Run Database Migrations
```bash
# Apply migrations
supabase db push

# Verify migrations
supabase db verify
```

3. Deploy Infrastructure
```bash
# Initialize Terraform
terraform init

# Apply infrastructure changes
terraform apply
```

4. Deploy Application
```bash
# Build and push Docker image
docker build -t tax-practice-app .
docker push your-registry/tax-practice-app:latest

# Deploy to ECS
aws ecs update-service --cluster tax-practice --service web --force-new-deployment
```

## Post-Deployment Verification

1. Health Check
```bash
curl https://your-domain.com/api/health
```

2. Monitor Logs
```bash
# View application logs
aws logs get-log-events \
  --log-group-name /aws/ecs/tax-practice \
  --log-stream-name web
```

3. Performance Verification
```bash
# Run performance tests
npm run test:performance
```

## Rollback Procedure

1. Identify Issue
```bash
# Check logs for errors
aws logs get-log-events \
  --log-group-name /aws/ecs/tax-practice \
  --log-stream-name web
```

2. Rollback Deployment
```bash
# Rollback to previous version
aws ecs update-service \
  --cluster tax-practice \
  --service web \
  --task-definition tax-practice:previous
```

3. Verify Rollback
```bash
# Check health endpoint
curl https://your-domain.com/api/health
```

## Next Steps
1. Set up monitoring alerts
2. Configure automatic scaling
3. Implement disaster recovery plan