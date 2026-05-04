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
