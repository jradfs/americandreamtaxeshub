# American Dream Taxes Hub

A modern, collaborative platform for tax preparation and client management.

## Features

- 🔐 **Simple Authentication**: Just sign in to access everything
- 🤝 **Full Team Collaboration**: All authenticated users have complete access
- 📊 **Client Management**: Track and manage client information
- 📋 **Tax Returns**: Process and manage tax returns efficiently
- 👥 **User Management**: Simple user system with full access
- 📁 **Project Tracking**: Comprehensive project management

## Database Access

All authenticated users have full access to:

- Clients
- Tax Returns
- Users
- Projects
- All future tables

No complex permissions or restrictions - just authenticate and start working!

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run development server: `npm run dev`

## Development Guidelines

- All team members have full access to all tables
- Focus on feature development, not access control
- Keep authentication simple
- Build with collaboration in mind

## Tech Stack

- Next.js 14
- Supabase (Authentication & Database)
- TypeScript
- React Server Components
- Tailwind CSS

## Contributing

1. Sign in to get full access
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Environment Setup

```bash
# Required environment variables
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Database Access Policy

Simple policy for maximum collaboration:

- ✅ All authenticated users have full CRUD access
- ✅ No role restrictions
- ✅ Access all tables freely
- ✅ Focus on building features
