-- =============================================================================
-- DOZEY Security Migrations - Combined File
-- Run this entire file in Supabase SQL Editor (once, in order)
-- =============================================================================


-- =============================================================================
-- MIGRATION 1: Create user_roles table
-- Must be created BEFORE audit_logs (audit_logs policies reference it)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.user_roles (
  id           BIGSERIAL PRIMARY KEY,
  user_id      UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role         TEXT NOT NULL DEFAULT 'user',
  permissions  JSONB DEFAULT '[]'::jsonb,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role    ON public.user_roles(role);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'user_roles'
      AND policyname = 'Users can view their own role'
  ) THEN
    CREATE POLICY "Users can view their own role"
      ON public.user_roles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'user_roles'
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


-- =============================================================================
-- MIGRATION 2: Create audit_logs table (enhanced, separate from existing audit_log)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id          BIGSERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  timestamp   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  resource    TEXT NOT NULL,
  details     JSONB DEFAULT '{}'::jsonb,
  risk_level  TEXT DEFAULT 'low'
                CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  ip_address  TEXT,
  request_id  TEXT UNIQUE,
  session_id  TEXT,
  user_agent  TEXT
);

-- Individual indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id    ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp  ON public.audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_risk_level ON public.audit_logs(risk_level);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action     ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource   ON public.audit_logs(resource);

-- Composite indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_time  ON public.audit_logs(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_risk_time  ON public.audit_logs(risk_level, timestamp DESC);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Trigger function to keep timestamp in sync
CREATE OR REPLACE FUNCTION public.set_audit_logs_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.timestamp = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS audit_logs_timestamp_trigger ON public.audit_logs;
CREATE TRIGGER audit_logs_timestamp_trigger
  BEFORE INSERT ON public.audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.set_audit_logs_timestamp();

-- RLS policies (idempotent via DO blocks)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'audit_logs'
      AND policyname = 'Users can view their own audit logs'
  ) THEN
    CREATE POLICY "Users can view their own audit logs"
      ON public.audit_logs
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'audit_logs'
      AND policyname = 'Admins can view all audit logs'
  ) THEN
    CREATE POLICY "Admins can view all audit logs"
      ON public.audit_logs
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.user_roles
          WHERE user_id = auth.uid()
            AND role = 'admin'
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'audit_logs'
      AND policyname = 'Service role can insert audit logs'
  ) THEN
    CREATE POLICY "Service role can insert audit logs"
      ON public.audit_logs
      FOR INSERT
      TO service_role
      WITH CHECK (true);
  END IF;
END $$;

GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.audit_logs TO service_role;


-- =============================================================================
-- MIGRATION 3: Add admin-level RLS policies to existing profiles table
-- (profiles already has basic user policies; these add admin visibility)
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'profiles'
      AND policyname = 'Admins can view all profiles'
  ) THEN
    CREATE POLICY "Admins can view all profiles"
      ON public.profiles
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.user_roles
          WHERE user_id = auth.uid()
            AND role = 'admin'
        )
      );
  END IF;
END $$;


-- =============================================================================
-- MIGRATION 4: Security helper functions
-- =============================================================================

-- Log a security event into audit_logs
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_user_id   UUID,
  p_action    TEXT,
  p_resource  TEXT,
  p_risk_level TEXT,
  p_details   JSONB    DEFAULT NULL,
  p_ip_address TEXT   DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.audit_logs
    (user_id, action, resource, risk_level, details, ip_address)
  VALUES
    (p_user_id, p_action, p_resource, p_risk_level,
     COALESCE(p_details, '{}'::jsonb), p_ip_address);
END;
$$;

-- Check whether a user holds a specific permission
CREATE OR REPLACE FUNCTION public.has_permission(
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

-- Return the role of a given user (defaults to 'user' if no row found)
CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id UUID)
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

-- =============================================================================
-- END OF MIGRATIONS
-- =============================================================================
