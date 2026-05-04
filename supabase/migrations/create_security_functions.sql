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
