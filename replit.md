# DOZEY

## Overview
DOZEY is a vaccination record tracking and medical document management application designed for immigrants, international students, and global workers. It aims to simplify the process of translating, parsing, and managing vaccination and medical records across international borders, including support for EHR/EMR integration. The project's vision is to provide a seamless and compliant solution for individuals navigating complex cross-border health requirements.

## User Preferences
- I prefer simple language.
- I want iterative development.
- Ask before making major changes.
- I prefer detailed explanations.

## System Architecture
The application uses a full-stack architecture with React 18 and TypeScript for the frontend, built with Vite 6 and styled using Tailwind CSS v4 and shadcn/ui. The backend is an Express.js server with TypeScript, connecting to a PostgreSQL database (Neon) via Drizzle ORM and Supabase. Supabase handles authentication (email/password with verification) and provides a comprehensive schema including RLS and triggers. File uploads (PDF, images, docs up to 10MB) are managed using `multer`.

**Key Features:**
- **User Authentication:** Supabase Auth with email/password, email verification, and JWT token management.
- **Document Management:** Users can upload medical documents. An AI-powered pipeline (Mistral OCR, DeepL, OpenAI) extracts text, translates to English, and parses structured vaccination data. Users can review and import processed data.
- **Compliance Engine:** An AI-powered engine uses OpenAI (gpt-4o-mini) to look up and check compliance against institution, employer, and country/visa vaccination requirements. It supports vaccine alias matching and generates context-aware, formatted reports.
- **Internationalization:** Full i18n support across all dashboard components for 7 languages (en, es, fr, hi, zh, pt, ar).
- **UI/UX Design:** Inspired by Apple iPhone 17 Pro, featuring a muted color palette (blues, greens, grays), light theme with no dark backgrounds, borderless cards, rounded inputs, massive typography for hero sections, and generous spacing.
- **HIPAA Compliance:** Comprehensive security measures including detailed Terms of Service and Privacy Policy, mandatory acceptance during registration, security headers (HSTS, CSP), PHI cache control, rate limiting, audit logging, session auto-timeout, strong password requirements, database encryption, input validation, and secure file handling.
- **Data Flow:** Processed document data (patient info, countries, providers) can auto-fill user profiles and suggest insights.
- **Profile Auto-Save:** Profile form auto-saves after 3 seconds of inactivity, with unsaved changes warning on page unload. React Query cache clears on sign-out and invalidates on sign-in.
- **Dashboard:** Features an interactive immunization globe, chronological timeline, and comprehensive filtering for vaccination records.

**Project Structure:**
- `client/`: React frontend.
- `server/`: Express backend.
- `shared/`: Shared TypeScript schemas and models.
- `docs/`: Documentation including Supabase email templates and AI agent recommendations.

## External Dependencies
- **Frontend:** React 18, TypeScript, Vite 6, Tailwind CSS v4, shadcn/ui, Lucide React, React Router, TanStack React Query, react-simple-maps.
- **Backend:** Express.js, TypeScript, tsx.
- **Database:** PostgreSQL (Neon), Drizzle ORM, Supabase (for database, authentication, and storage).
- **Authentication:** Supabase Auth.
- **File Uploads:** `multer`.
- **AI/ML Services:**
    - **Mistral OCR:** `@mistralai/mistralai` for text extraction from PDFs/images.
    - **DeepL:** `deepl-node` for language detection and translation.
    - **OpenAI:** `openai` (gpt-4o-mini) for parsing structured data and powering the AI chatbot and compliance engine.