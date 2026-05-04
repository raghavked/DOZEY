-- ============================================================
-- Migration: add_rls_policies
-- Adds supplemental RLS policies to existing DOZEY tables.
-- The main schema already enables RLS on all core tables.
-- This migration adds admin-override policies for moderation.
-- ============================================================

-- NOTE: public.profiles uses user_id UUID (not id).
-- The base policies (view/insert/update own profile) already exist
-- in the main schema. This adds an admin read-all policy.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles'
    AND policyname = 'Admins can view all profiles'
  ) THEN
    CREATE POLICY "Admins can view all profiles"
      ON public.profiles
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.user_roles
          WHERE user_id = auth.uid()
          AND role = 'admin'
        )
      );
  END IF;
END $$;

-- Admin read policy for vaccinations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'vaccinations'
    AND policyname = 'Admins can view all vaccinations'
  ) THEN
    CREATE POLICY "Admins can view all vaccinations"
      ON public.vaccinations
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.user_roles
          WHERE user_id = auth.uid()
          AND role = 'admin'
        )
      );
  END IF;
END $$;

-- Admin read policy for documents
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'documents'
    AND policyname = 'Admins can view all documents'
  ) THEN
    CREATE POLICY "Admins can view all documents"
      ON public.documents
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.user_roles
          WHERE user_id = auth.uid()
          AND role = 'admin'
        )
      );
  END IF;
END $$;
