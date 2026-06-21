# Technology Stack

## Framework & Runtime
- **Next.js 16.2.1**: React-based full-stack framework with App Router
- **React 19.2.4**: Component-based UI library
- **TypeScript 5**: Static typing for JavaScript
- **Node.js**: Server-side runtime

## Development Tools
- **ESLint 9**: Code linting with Next.js configuration
- **npm**: Package management

## UI & Styling
- **CSS Modules**: Component-scoped styling (`.module.css` files)
- **Lucide React**: Icon library for consistent iconography
- **Custom Design System**: CSS variables and tokens in `globals.css`

## Key Dependencies
```json
{
  "lucide-react": "^1.7.0",
  "next": "16.2.1",
  "react": "19.2.4",
  "react-dom": "19.2.4"
}
```

## Common Commands

### Development
```bash
# Start development server (runs on port 3001)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Port Configuration
- Admin panel runs on port 3001 (configured in package.json)
- API endpoints expected on port 5000 (configurable via NEXT_PUBLIC_API_URL)

## Build Configuration
- **Image Optimization**: Configured for Unsplash remote images
- **Static Assets**: Located in `/public` directory
- **Environment Variables**: Use `.env.local` for local development

## Code Quality Standards
- ESLint with Next.js and TypeScript configurations
- Strict TypeScript compilation
- CSS Modules for component isolation
- Component-based architecture with clear separation of concerns