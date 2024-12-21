# Frequently Asked Questions (FAQ)

## Development

### Q: How do I start developing?
A: Follow the [Getting Started Guide](./getting-started.md) for complete setup instructions.

### Q: What's the recommended IDE setup?
A: VS Code with the following extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

### Q: How do I add a new component?
A: Follow the component structure in the [Project Guide](../../project-guide.md) and use our established patterns.

## Database

### Q: How do I connect to the database?
A: Use the Supabase client initialized in `lib/supabase/client.ts`.

### Q: How do I add a new table?
A: Update the schema in Supabase and add corresponding TypeScript types in `types/`.

### Q: How do I handle JSONB fields?
A: Use TypeScript types and proper serialization/deserialization methods.

## Architecture

### Q: Where should I put new code?
A: Follow our directory structure:
- Components in `/components`
- Pages in `/app`
- Utilities in `/lib`
- Hooks in `/hooks`

### Q: How do I handle state management?
A: Use React hooks for local state and Supabase real-time for global state.

### Q: How do I add new routes?
A: Add new directories/files in the `/app` directory following Next.js App Router conventions.

## Testing

### Q: How do I test my changes?
A: Currently, we focus on manual testing. Test all features thoroughly before submitting PRs.

### Q: What should I test?
A: Test:
- Feature functionality
- Error handling
- Edge cases
- Mobile responsiveness

## Deployment

### Q: How do I deploy changes?
A: Merges to main branch automatically deploy through our CI/CD pipeline.

### Q: How do I handle environment variables?
A: Add them to `.env.local` for development and configure in deployment settings.

## Common Issues

### Q: Why aren't my imports working?
A: Check path aliases in `tsconfig.json` and use `@/*` for imports.

### Q: Why isn't my component updating?
A: Check:
- React state management
- Supabase subscriptions
- Component props
- useEffect dependencies

### Q: How do I debug database issues?
A: Use Supabase dashboard and check console logs for errors.

## Best Practices

### Q: What's our Git workflow?
A: 
1. Create feature branch
2. Make changes
3. Submit PR
4. Get review
5. Merge to main

### Q: How should I name things?
A: Follow conventions:
- Components: PascalCase
- Files: kebab-case
- Functions: camelCase
- Types: PascalCase

### Q: How do I document my code?
A: 
- Add JSDoc comments
- Update relevant documentation
- Include type definitions
- Write clear commit messages