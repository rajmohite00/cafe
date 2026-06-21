# Project Structure

## Root Directory Organization
```
cafe/
├── admin/                    # Admin panel application
├── .kiro/                   # Kiro configuration and steering
└── .git/                    # Git repository
```

## Admin Panel Structure (`admin/`)
```
admin/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── globals.css     # Global styles and design system
│   │   ├── admin.globals.css # Admin-specific global styles
│   │   ├── layout.tsx      # Root layout component
│   │   └── page.tsx        # Admin dashboard main page
│   └── components/          # Reusable UI components
│       ├── About/          # Component with module CSS
│       ├── Hero/
│       ├── Menu/
│       ├── Navbar/
│       └── [ComponentName]/ # Each component in its own folder
├── public/                  # Static assets
│   ├── coffee-frames/      # Animation frame images
│   ├── *.png              # Product and UI images
│   └── *.svg              # Icons and graphics
├── package.json            # Dependencies and scripts
├── next.config.ts         # Next.js configuration
├── eslint.config.mjs      # ESLint configuration
└── README.md              # Project documentation
```

## File Naming Conventions

### Components
- **Directory per component**: Each component gets its own folder
- **Index file**: Main component in `index.tsx`
- **Styles**: Matching `.module.css` file for component-specific styles
- **PascalCase**: Component folders and files use PascalCase (`About/`, `Hero/`)

### Styling
- **Global styles**: `globals.css` for design system and utilities
- **Module CSS**: `ComponentName.module.css` for component-specific styles
- **Admin styles**: `admin.globals.css` and `admin.module.css` for admin-specific styling

### API Routes
- **RESTful structure**: `/api/[resource]/route.ts`
- **Nested resources**: `/api/[resource]/[id]/route.ts`
- **Clear naming**: `contact`, `reservation` for main resources

## Key Architectural Patterns

### Component Organization
- **Atomic design**: Small, reusable components in dedicated folders
- **Feature-based**: Components grouped by functionality (Menu, About, etc.)
- **Clear separation**: UI components separate from business logic

### Styling Architecture
- **Design tokens**: CSS custom properties in `:root` for consistent theming
- **Module isolation**: CSS Modules prevent style conflicts
- **Mobile-first**: Responsive design with mobile considerations

### State Management
- **React hooks**: useState, useEffect for local component state
- **API integration**: Fetch-based data management with real-time polling
- **Type safety**: TypeScript interfaces for all data structures

## Asset Management
- **Images**: Organized by purpose in `/public`
- **Animations**: Frame-based animations in dedicated folders
- **Icons**: Lucide React for consistent iconography
- **Static files**: Direct access via public URL paths