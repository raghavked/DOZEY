# DOZEY (Community)

## Overview
A vaccination record tracking and medical document management application for immigrants, international students, and global workers moving between countries. Helps users translate, parse, and manage vaccination/medical records across borders, with EHR/EMR integration support.

## Tech Stack
- **Frontend**: React 18 + TypeScript, Vite 6, Tailwind CSS v4, shadcn/ui (Radix primitives), Lucide React icons, React Router, TanStack React Query
- **Backend**: Express.js with TypeScript (tsx runner)
- **Database**: PostgreSQL (Neon) with Drizzle ORM + Supabase (comprehensive schema)
- **Auth**: Supabase Auth (email/password with email verification via SMTP)
- **File Uploads**: multer (PDF, images, docs up to 10MB)

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
      use-auth.ts         # Auth hook (Supabase Auth)
      use-api.ts          # API hooks for CRUD operations
    lib/
      supabase.ts         # Supabase client (lazy init from /api/config)
    pages/
      LandingPage.tsx     # Public landing page with sections
      LoginPage.tsx       # Email/password login
      RegisterPage.tsx    # Registration with email verification
      DashboardLayout.tsx # Protected dashboard wrapper
    components/           # Dashboard feature components
      Navigation.tsx      # App navigation with user info
      Dashboard.tsx       # Main dashboard view
      ProfileSection.tsx  # User profile management
      CountryHistory.tsx  # Residence history tracking
      DocumentUpload.tsx  # Document management with file upload
      VaccinationTimeline.tsx  # Vaccination timeline
      ShareRecords.tsx    # Record sharing
      Alerts.tsx          # Compliance alerts
      ui/                 # shadcn/ui components
    assets/               # Images/logos
  vite.config.ts          # Vite config with Tailwind plugin
  index.html              # HTML entry
server/                    # Express backend
  index.ts                # Server entry, Vite middleware, /api/config endpoint
  db.ts                   # Drizzle DB connection
  routes.ts               # API routes (CRUD + file upload)
  auth.ts                 # Supabase JWT verification middleware
  supabase.ts             # Server-side Supabase client (lazy init)
shared/                    # Shared between client/server
  schema.ts               # Schema exports
  models/
    auth.ts               # Users table (Supabase-compatible)
    records.ts            # Profiles, vaccinations, documents, country_history tables
docs/                      # Documentation
  supabase-email-templates.html  # 5 branded email templates for Supabase
  ai-agent-recommendations.md   # AI agent/API guide for document processing
  supabase-database-sql.sql     # Full Supabase schema (18 tables, RLS, triggers)
```

## Running
- `npm run dev` starts Express server with Vite middleware on port 5000
- `npm run build` builds the client for production
- `npm run db:push` pushes schema changes to database

## Auth Flow
- Supabase Auth with email/password
- Email verification required (via Supabase SMTP)
- JWT tokens passed via Authorization Bearer header
- Server validates tokens using Supabase service role key
- /api/config endpoint provides Supabase URL/key to frontend

## Environment Variables
- `SUPABASE_URL` - Supabase project URL (secret)
- `SUPABASE_ANON_KEY` - Supabase anonymous key (secret)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (secret)
- `DATABASE_URL` - PostgreSQL connection string

## DOZEY Brand Colors
- Brand Blue: #1051a5
- Brand Light Green: #97bf2d
- Brand Green: #26844f
- Brand Off-Black: #22283a
- Brand White: #fefefe

## Domain
- Production domain: dozeyrecords.com

## Recent Changes
- 2026-02-23: Added Supabase email templates (5 types), AI agent recommendations doc, comprehensive Supabase SQL schema (18 tables with RLS)
- 2026-02-23: Replaced Replit Auth with Supabase Auth (email/password + email verification)
- 2026-02-23: Added file upload support with multer
- 2026-02-23: Full-stack restructure with Express backend, PostgreSQL, landing page, dashboard
