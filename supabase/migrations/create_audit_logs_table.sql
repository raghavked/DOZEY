-- Create audit logs table for security tracking
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'critical')) DEFAULT 'low',
  ip_address TEXT,
  
  -- Metadata
  request_id TEXT UNIQUE,
  session_id TEXT,
  user_agent TEXT
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_audit_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON public.audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_risk_level ON public.audit_logs(risk_level);
CREATE INDEX IF NOT EXISTS idx_audit_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON public.audit_logs(resource);

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_audit_user_time ON public.audit_logs(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_risk_time ON public.audit_logs(risk_level, timestamp DESC);

-- Enable Row Level Security
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Authenticated users can view their own audit logs
CREATE POLICY "Users can view their own audit logs"
  ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

-- RLS Policy: Only admins can view all audit logs
CREATE POLICY "Admins can view all audit logs"
  ON public.audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()::text
      AND role = 'admin'
    )
  );

-- RLS Policy: Service role can insert logs
CREATE POLICY "Service role can insert audit logs"
  ON public.audit_logs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Grant permissions
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.audit_logs TO service_role;

-- Create function to automatically set timestamp
CREATE OR REPLACE FUNCTION set_audit_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.timestamp = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER audit_logs_timestamp_trigger
BEFORE INSERT ON public.audit_logs
FOR EACH ROW
EXECUTE FUNCTION set_audit_timestamp();
