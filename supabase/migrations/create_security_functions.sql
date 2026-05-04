-- Function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
  p_user_id TEXT,
  p_action TEXT,
  p_resource TEXT,
  p_risk_level TEXT,
  p_details JSONB DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.audit_logs (user_id, action, resource, risk_level, details, ip_address)
  VALUES (p_user_id, p_action, p_resource, p_risk_level, COALESCE(p_details, '{}'::jsonb), p_ip_address);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has permission
CREATE OR REPLACE FUNCTION has_permission(
  p_user_id TEXT,
  p_permission TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = p_user_id
    AND permissions @> jsonb_build_array(p_permission)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(p_user_id TEXT)
RETURNS TEXT AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT role INTO v_role FROM public.user_roles WHERE user_id = p_user_id;
  RETURN COALESCE(v_role, 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
