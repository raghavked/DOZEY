# DOZEY (Community)

## Overview
A vaccination record tracking and medical document management application for immigrants, international students, and global workers moving between countries. Helps users translate, parse, and manage vaccination/medical records across borders, with EHR/EMR integration support.

## Tech Stack
- **Frontend**: React 18 + TypeScript, Vite 6, Tailwind CSS v4, shadcn/ui (Radix primitives), Lucide React icons, React Router, TanStack React Query
- **Backend**: Express.js with TypeScript (tsx runner)
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Auth**: Replit Auth (OpenID Connect) - supports Google, GitHub, Apple, email/password

## Project Structure
```
client/                    # React frontend
  src/
    App.tsx               # Root app with auth routing
    types.ts              # Shared TypeScript interfaces
    main.tsx              # Entry point with QueryClientProvider
    index.css             # Tailwind imports
    styles/globals.css    # Theme variables (DOZEY brand)
    hooks/
      use-auth.ts         # Auth hook (Replit Auth)
      use-api.ts          # API hooks for CRUD operations
    lib/
      auth-utils.ts       # Auth error handling
    pages/
      LandingPage.tsx     # Public landing page with sections
      DashboardLayout.tsx # Protected dashboard wrapper
    components/           # Dashboard feature components
      Navigation.tsx      # App navigation with user info
      Dashboard.tsx       # Main dashboard view
      ProfileSection.tsx  # User profile management
      CountryHistory.tsx  # Residence history tracking
      DocumentUpload.tsx  # Document management
      VaccinationTimeline.tsx  # Vaccination timeline
      ShareRecords.tsx    # Record sharing
      Alerts.tsx          # Compliance alerts
      ui/                 # shadcn/ui components
    assets/               # Images/logos
  vite.config.ts          # Vite config with Tailwind plugin
  index.html              # HTML entry
server/                    # Express backend
  index.ts                # Server entry, Vite middleware
  db.ts                   # Drizzle DB connection
  routes.ts               # API routes (CRUD)
  replit_integrations/
    auth/                 # Replit Auth module (DO NOT MODIFY)
shared/                    # Shared between client/server
  schema.ts               # Schema exports
  models/
    auth.ts               # Users/sessions tables
    records.ts            # Profiles, vaccinations, documents, country_history tables
```

## Running
- `npm run dev` starts Express server with Vite middleware on port 5000
- `npm run build` builds the client for production
- `npm run db:push` pushes schema changes to database

## Auth Flow
- Unauthenticated users see the landing page with Sign In button
- Sign In links to /api/login (Replit OIDC)
- Authenticated users are redirected to /app (dashboard)
- Sign Out via /api/logout

## DOZEY Brand Colors
- Brand Blue: #1051a5
- Brand Light Green: #97bf2d
- Brand Green: #26844f
- Brand Off-Black: #22283a
- Brand White: #fefefe

## Recent Changes
- 2026-02-23: Full-stack restructure with Express backend, Replit Auth, PostgreSQL, landing page, dashboard with API-backed data
