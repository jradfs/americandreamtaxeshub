# American Dream Taxes Hub

A comprehensive practice management tool for tax professionals and accounting firms.

## Features

### Client Management
- Client database with tax information
- Project and task association
- Document management
- Communication history

### Project Management
- Template-based project creation
- Task tracking and assignment
- Real-time status updates
- Progress monitoring

### Task System
- Task creation and organization
- Status tracking
- Template integration
- Real-time collaboration

### Template System
- Pre-defined workflows
- Customizable templates
- Category organization
- Automated task creation

## Font Guidelines

The application uses a system font stack for consistent, beautiful rendering across platforms:

```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
             "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", 
             "Segoe UI Emoji", "Segoe UI Symbol";
```

### Key Points:
- Always use Tailwind's `font-sans` utility class
- Never declare `font-family` directly in CSS
- Font configuration is centralized in `tailwind.config.ts`
- Changes require team discussion

## Technology Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components

### Backend
- Supabase
- PostgreSQL
- Real-time subscriptions
- Row Level Security

### Testing
- Playwright (E2E)
- Jest (Unit)
- MSW (API Mocking)
- Supertest (API Testing)

## Quick Start

```bash
# Clone repository
git clone https://github.com/yourusername/american-dream-taxes-hub.git
cd american-dream-taxes-hub

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# Start development server
npm run dev

# Run tests
npm run test        # Unit tests
npm run test:e2e    # E2E tests
```

## Documentation

- [Project Guide](./project-guide.md) - Development standards and practices
- [Testing Guide](./docs/testing/testing-guide.md) - Testing documentation
- [Development Plan](./plan.md) - Current progress and roadmap

### Additional Documentation
- [Architecture Overview](./docs/architecture/overview.md)
- [Database Schema](./docs/database/schema.md)
- [API Documentation](./docs/api/overview.md)
- [Component Library](./docs/components/overview.md)

## Development

### Prerequisites
- Node.js 18+
- npm 9+
- Git

### Development Workflow
1. Create feature branch
2. Implement changes
3. Add tests
4. Submit pull request

### Testing
- Run tests before commits
- Add tests for new features
- Maintain test coverage
- Follow testing guide

## Contributing

1. Fork the repository
2. Create your feature branch
3. Follow coding standards
4. Add tests for new features
5. Submit pull request

## Support

- Review documentation in `/docs`
- Check [FAQ](./docs/guides/faq.md)
- Open GitHub issues
- Contact team leads

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
