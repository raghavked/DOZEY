-- ============================================================
-- DOZEY Security Migrations — Combined File
-- Paste this entire file into Supabase SQL Editor and click Run.
-- Safe to re-run: all CREATE statements use IF NOT EXISTS,
-- all policies are wrapped in idempotent DO $$ blocks.
--
-- Run order:
--   1. create_user_roles_table   (no dependencies)
--   2. create_audit_logs_table   (no dependencies)
--   3. add_rls_policies          (depends on user_roles)
--   4. create_security_functions (depends on audit_logs + user_roles)
-- ============================================================


-- ============================================================
-- PART 1: USER ROLES TABLE
-- ============================================================
-- ============================================================
-- Migration: create_user_roles_table
-- Adds a user_roles table for role-based access control.
-- user_id is UUID to match auth.users(id) in the Supabase schema.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_roles (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  permissions JSONB DEFAULT '[]'::jsonb,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role    ON public.user_roles(role);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can view their own role
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_roles'
    AND policyname = 'Users can view their own role'
  ) THEN
    CREATE POLICY "Users can view their own role"
      ON public.user_roles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Admins can view all roles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_roles'
    AND policyname = 'Admins can view all roles'
  ) THEN
    CREATE POLICY "Admins can view all roles"
      ON public.user_roles
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.user_roles ur
          WHERE ur.user_id = auth.uid()
          AND ur.role = 'admin'
        )
      );
  END IF;
END $$;

-- Service role can manage all roles
GRANT SELECT ON public.user_roles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO service_role;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION set_user_roles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_roles_updated_at_trigger ON public.user_roles;
CREATE TRIGGER user_roles_updated_at_trigger
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION set_user_roles_updated_at();

-- ============================================================
-- PART 2: AUDIT LOGS TABLE
-- ============================================================
-- ============================================================
-- Migration: create_audit_logs_table
-- Adds a dedicated audit_logs table for security event tracking.
-- NOTE: The existing schema already has public.audit_log (singular).
-- This creates public.audit_logs (plural) as the new security table.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id            BIGSERIAL PRIMARY KEY,
  created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  timestamp     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action        TEXT NOT NULL,
  resource      TEXT NOT NULL,
  details       JSONB DEFAULT '{}'::jsonb,
  risk_level    TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'critical')) DEFAULT 'low',
  ip_address    TEXT,
  request_id    TEXT,
  session_id    TEXT,
  user_agent    TEXT
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id    ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp  ON public.audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_risk_level ON public.audit_logs(risk_level);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action     ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_time  ON public.audit_logs(user_id, timestamp DESC);

-- Enable Row Level Security
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own audit logs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'audit_logs'
    AND policyname = 'Users can view their own audit logs'
  ) THEN
    CREATE POLICY "Users can view their own audit logs"
      ON public.audit_logs
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Service role can insert logs (used by backend)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'audit_logs'
    AND policyname = 'Service role can insert audit logs'
  ) THEN
    CREATE POLICY "Service role can insert audit logs"
      ON public.audit_logs
      FOR INSERT
      TO service_role
      WITH CHECK (true);
  END IF;
END $$;

-- Grant permissions
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT SELECT, INSERT ON public.audit_logs TO service_role;

-- Auto-update timestamp on insert
CREATE OR REPLACE FUNCTION set_audit_logs_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.timestamp = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS audit_logs_timestamp_trigger ON public.audit_logs;
CREATE TRIGGER audit_logs_timestamp_trigger
  BEFORE INSERT ON public.audit_logs
  FOR EACH ROW EXECUTE FUNCTION set_audit_logs_timestamp();

-- ============================================================
-- PART 3: SUPPLEMENTAL RLS POLICIES
-- ============================================================
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

-- ============================================================
-- PART 4: SECURITY FUNCTIONS
-- ============================================================
-- ============================================================
-- Migration: create_security_functions
-- Adds helper functions for security event logging and RBAC.
-- All user_id parameters are UUID to match auth.users(id).
-- ============================================================

-- Function: log a security event into audit_logs
CREATE OR REPLACE FUNCTION log_security_event(
  p_user_id    UUID,
  p_action     TEXT,
  p_resource   TEXT,
  p_risk_level TEXT,
  p_details    JSONB DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.audit_logs (user_id, action, resource, risk_level, details, ip_address)
  VALUES (
    p_user_id,
    p_action,
    p_resource,
    p_risk_level,
    COALESCE(p_details, '{}'::jsonb),
    p_ip_address
  );
END;
$$;

-- Function: check if a user has a specific permission
CREATE OR REPLACE FUNCTION has_permission(
  p_user_id    UUID,
  p_permission TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = p_user_id
    AND permissions @> jsonb_build_array(p_permission)
  );
END;
$$;

-- Function: get the role for a user (defaults to 'user' if not found)
CREATE OR REPLACE FUNCTION get_user_role(p_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT role INTO v_role
  FROM public.user_roles
  WHERE user_id = p_user_id;
  RETURN COALESCE(v_role, 'user');
END;
$$;
