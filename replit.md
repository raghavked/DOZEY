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
      RegisterPage.tsx    # Registration with TOS checkbox + email verification
      DashboardLayout.tsx # Protected dashboard wrapper
      TermsOfService.tsx  # Full Terms of Service (19 sections, HIPAA compliance)
      PrivacyPolicy.tsx   # Privacy Policy & HIPAA Notice of Privacy Practices
    components/           # Dashboard feature components
      Navigation.tsx      # App navigation with user info + LanguageSelector
      Dashboard.tsx       # Main dashboard view
      ProfileSection.tsx  # User profile management
      CountryHistory.tsx  # Residence history tracking
      DocumentUpload.tsx  # Document management with file upload + inline rename
      VaccinationTimeline.tsx  # Vaccination timeline
      ShareRecords.tsx    # Record sharing
      Alerts.tsx          # Compliance alerts
      DozeChat.tsx        # AI chatbot widget (OpenAI-powered)
      LanguageSelector.tsx # 7-language selector dropdown
      AutocompleteInput.tsx # Smart autocomplete for forms
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

## HIPAA Compliance
- Terms of Service with comprehensive HIPAA sections (24 sections covering PHI handling, safeguards, breach notification, user rights, sanctions, de-identification, audit trails, incident response, contingency planning, AI data processing BAAs)
- Privacy Policy & HIPAA Notice of Privacy Practices (13 sections including AI processing details and complaint filing rights)
- Registration requires mandatory acceptance of ToS + Privacy Policy + HIPAA Notice
- TOS acceptance timestamp stored in users table (tos_accepted_at column)
- Footer links to Terms and Privacy on all public pages
- **Security Headers**: HSTS, CSP (production), X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy
- **PHI Cache Control**: API responses include no-store/no-cache headers to prevent PHI caching
- **Rate Limiting**: Auth (10/min), Chat (20/min), General API (100/min) with automatic cleanup
- **Audit Logging**: All authenticated API access logged with timestamp, method, path, IP, userId, and action type (PHI_ACCESS, AUTH_FAILED, etc.)
- **Session Auto-Timeout**: 15 minutes of inactivity triggers automatic sign-out (HIPAA requirement)
- **Password Requirements**: Minimum 8 characters with uppercase, lowercase, number, and special character required

## AI Document Processing Pipeline
- **Mistral OCR** (`@mistralai/mistralai`): Extracts text from uploaded PDFs and images
- **DeepL** (`deepl-node`): Detects language and translates to English
- **OpenAI** (`openai`, gpt-4o-mini): Parses extracted text into structured vaccination data (JSON)
- Pipeline: Upload -> OCR extract -> Translate -> Parse -> Import to timeline
- Server endpoints: `/api/documents/:id/process`, `/api/documents/:id/import-vaccinations`
- Document schema includes: extractedText, translatedText, parsedData, originalLanguage, processingStatus

## Environment Variables
- `MISTRAL_API_KEY` - Mistral AI API key for OCR (secret)
- `DEEPL_API_KEY` - DeepL API key for translation (secret)
- `OPENAI_API_KEY` - OpenAI API key for parsing and chatbot (secret)

## Compliance Engine
- AI-powered requirements lookup using OpenAI (gpt-4o-mini) with 3 lookup types:
  - **Institution/School**: University/college vaccination requirements for enrollment
  - **Employer**: Occupational health requirements (healthcare, military, NGOs, etc.)
  - **Country/Visa**: Immigration and visa vaccination requirements
- Server: `server/compliance-engine.ts` - lookupInstitutionRequirements, lookupEmployerRequirements, lookupCountryRequirements, checkCompliance, generateFormattedReport
- Endpoints: `/api/compliance/lookup` (accepts `lookupType` param), `/api/compliance/report`
- Vaccine alias matching with 15 categories including Indian vaccine brands (Covishield, Covaxin, Pentavac, etc.)
- Context-aware formatted downloadable reports (titles/labels change per lookup type)
- ComplianceReport component: 3-tab selector, popular suggestions per type, requirement-by-requirement status, gap analysis, export
- Profile includes `targetInstitution`, `targetEmployment`, and `targetCountry` fields

## Design System (Apple/Episense-Inspired)
- Sleek minimal aesthetic: centered hero text, font-semibold (not extrabold), clean gradients
- Transparent navbar with frosted glass (backdrop-blur-2xl, bg-white/80) on scroll
- Scroll animations: fadeInUp, fadeIn, scaleIn, slideInLeft, slideInRight via IntersectionObserver
- Rounded-full CTAs (white on hero, brand blue elsewhere), muted text (white/40, gray-400), xs tracking-widest labels
- Dark off-black (#22283a) panels for auth pages, minimal bullet-point trust signals
- Light footer (#fafafa) with border-top, "Actively in development" only in footer
- Dashboard: spacious layout, outline-style buttons, pill-tab navigation, no gradient banners
- Icons use subtle opacity (text-[#22283a]/30) rather than bold colors
- Feature grids use gap-px with bg-gray-200 for Apple-style grid lines
- Cards: bg-white rounded-2xl border border-gray-100 (no shadow-lg)
- Inputs: rounded-xl border-gray-200 focus:ring-[color]/10
- Labels: text-xs text-gray-400 font-medium uppercase tracking-wide
- Dashboard nav: frosted glass (bg-white/80 backdrop-blur-2xl)
- Secondary backgrounds: bg-[#fafafa]
- Description text: text-gray-400 (not text-gray-600)

## Recent Changes
- 2026-02-24: Fuller layout: removed max-w-4xl constraints, 3-column dashboard grid (2-col main + sidebar), 2-column grids for vaccinations/documents/compliance/alerts, reduced spacing (space-y-6/5), 4-column common requirements grid
- 2026-02-24: Applied Apple/Episense design to ALL dashboard components: rounded-2xl cards, border-gray-100, font-semibold, text-gray-400 descriptions, subtler icons (text-[#22283a]/30), frosted glass nav, rounded-full CTAs, bg-[#fafafa] secondary backgrounds
- 2026-02-24: Apple-like refinement: centered heroes, font-semibold, frosted glass navbar, light footer, subtler typography
- 2026-02-24: Removed "Actively in development" from header/hero, kept only in footer
- 2026-02-24: PublicNavbar: slimmer (h-16), frosted glass, smaller text (13px), dark Sign In button
- 2026-02-24: PublicFooter: Changed from dark to light (#fafafa) with border-top
- 2026-02-24: All hero sections centered, gradient-to-b, consistent layout
- 2026-02-24: Login/Register: Dark off-black panels, minimal trust signals, rounded-full buttons
- 2026-02-24: Dashboard/Navigation: Cleaner stat cards, pill-tab nav, outline action buttons
- 2026-02-24: ShareRecords: COVID-19 vaccine card format export option
- 2026-02-23: New user onboarding: redirects to profile page on first sign-up with welcome banner
- 2026-02-23: Made healthcare provider required in profile; added smart autocomplete to all text inputs (countries, vaccines, providers, languages, institutions, employers, states)
- 2026-02-23: Replaced all native select dropdowns with styled CustomSelect component matching app design
- 2026-02-23: Added CustomSelect component, expanded autocomplete-data.ts with providers, states, institutions, employers
- 2026-02-23: Added doctor notes processing UI and medical exemptions display/import in DocumentUpload
- 2026-02-23: Expanded compliance check to 3 types: institution, employer, and country/visa with context-aware reports and tab selector UI
- 2026-02-23: Added institution compliance check system with AI-powered requirements lookup, vaccine alias matching, and formatted export
- 2026-02-23: Wired up AI document processing pipeline (Mistral OCR, DeepL translation, OpenAI parsing) with full frontend UI
- 2026-02-23: Added HIPAA-compliant Terms of Service and Privacy Policy pages with mandatory acceptance on registration
- 2026-02-23: Added Doze AI chatbot, language selector (7 languages), autocomplete data, document rename, chat API endpoint
- 2026-02-23: Added Supabase email templates (5 types), AI agent recommendations doc, comprehensive Supabase SQL schema (18 tables with RLS)
- 2026-02-23: Replaced Replit Auth with Supabase Auth (email/password + email verification)
- 2026-02-23: Added file upload support with multer
- 2026-02-23: Full-stack restructure with Express backend, PostgreSQL, landing page, dashboard
