-- ============================================================
-- DOZEY - Complete Supabase Database Schema
-- ============================================================
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- This creates all tables needed for the full DOZEY application
-- ============================================================
--
-- NOTE: This schema is designed for Supabase (uses auth.users,
-- UUID primary keys, RLS policies, and storage buckets).
-- It is separate from the app's current Drizzle ORM models.
-- When integrating, update the app's Drizzle schema to match
-- these table structures, or use Supabase client SDK directly.
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- SCHEMA: public (default)
-- Core application tables
-- ============================================================

-- 1. USER PROFILES
-- Extends Supabase auth.users with app-specific profile data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR,
  full_name VARCHAR,
  date_of_birth DATE,
  gender VARCHAR(20),
  phone VARCHAR(30),
  profile_image_url TEXT,
  current_country VARCHAR(100),
  current_state VARCHAR(100),
  current_city VARCHAR(100),
  country_of_origin VARCHAR(100),
  citizenships TEXT[], -- array of country codes
  languages TEXT[], -- array of language codes user speaks
  primary_provider VARCHAR(255),
  insurance_provider VARCHAR(255),
  insurance_policy_number VARCHAR(100),
  blood_type VARCHAR(10),
  allergies TEXT,
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(30),
  emergency_contact_relation VARCHAR(100),
  target_country VARCHAR(100), -- country user is moving to
  onboarding_completed BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. COUNTRY RESIDENCE HISTORY
-- Tracks where the user has lived and when
CREATE TABLE IF NOT EXISTS public.country_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  country VARCHAR(100) NOT NULL,
  country_code VARCHAR(3),
  state VARCHAR(100),
  city VARCHAR(100),
  start_date DATE,
  end_date DATE,
  start_year INTEGER NOT NULL,
  end_year VARCHAR(10) NOT NULL, -- "Present" or a year
  visa_type VARCHAR(100),
  purpose VARCHAR(100), -- work, study, immigration, travel
  is_current BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. VACCINATION RECORDS
-- Core vaccination data
CREATE TABLE IF NOT EXISTS public.vaccinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vaccine_name VARCHAR(255) NOT NULL,
  vaccine_code VARCHAR(50), -- CVX code or other standard code
  disease_target VARCHAR(255), -- what disease it protects against
  manufacturer VARCHAR(255),
  lot_number VARCHAR(100),
  date_administered DATE NOT NULL,
  date_text VARCHAR(50), -- original date text before parsing
  dose_number INTEGER NOT NULL DEFAULT 1,
  total_doses_in_series INTEGER,
  route VARCHAR(50), -- IM, SC, oral, etc.
  site VARCHAR(50), -- left arm, right thigh, etc.
  dose_amount VARCHAR(50), -- 0.5mL, etc.
  location VARCHAR(255), -- clinic/hospital name
  provider VARCHAR(255), -- administering provider name
  provider_npi VARCHAR(20), -- National Provider Identifier
  country_given VARCHAR(100),
  country_code VARCHAR(3),
  state_given VARCHAR(100),
  verified BOOLEAN DEFAULT FALSE,
  verification_method VARCHAR(50), -- manual, ocr, ehr_import, provider_confirmed
  verification_date TIMESTAMPTZ,
  source_document_id UUID, -- FK added after documents table creation
  expiration_date DATE, -- for vaccines that expire (e.g., yellow fever)
  next_dose_due DATE,
  is_booster BOOLEAN DEFAULT FALSE,
  batch_id UUID, -- for grouping records imported together (no FK, generated per import batch)
  notes TEXT,
  original_language VARCHAR(10), -- language of the source record
  translated_from TEXT, -- original text before translation
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DOCUMENTS (uploaded files)
-- Stores metadata about uploaded documents
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL, -- vaccination_card, lab_report, prescription, medical_record, insurance_card, passport_health_page, travel_certificate, other
  category VARCHAR(50), -- medical, travel, insurance, identification
  country VARCHAR(100), -- country where document was issued
  country_code VARCHAR(3),
  language VARCHAR(10), -- original language of document
  file_name VARCHAR(500),
  file_path TEXT,
  file_url TEXT, -- Supabase Storage URL
  storage_bucket VARCHAR(100), -- Supabase storage bucket name
  storage_path TEXT, -- path within the bucket
  mime_type VARCHAR(100),
  file_size INTEGER,
  page_count INTEGER,
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  issue_date DATE, -- when the document was originally issued
  expiry_date DATE, -- when the document expires
  issuing_authority VARCHAR(255),
  is_processed BOOLEAN DEFAULT FALSE, -- has OCR/AI been run
  processing_status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
  processing_error TEXT,
  tags TEXT[], -- searchable tags
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add deferred FK from vaccinations to documents
ALTER TABLE public.vaccinations 
  ADD CONSTRAINT fk_vaccinations_source_document 
  FOREIGN KEY (source_document_id) REFERENCES public.documents(id) ON DELETE SET NULL;

-- 5. DOCUMENT PROCESSING RESULTS
-- Stores OCR/AI extraction results for each document
CREATE TABLE IF NOT EXISTS public.document_processing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  processing_type VARCHAR(50) NOT NULL, -- ocr, translation, parsing, structuring
  agent_used VARCHAR(100), -- mistral_ocr, gpt4_vision, deepl, etc.
  model_version VARCHAR(50),
  status VARCHAR(30) DEFAULT 'pending', -- pending, processing, completed, failed
  raw_extracted_text TEXT, -- raw OCR output
  translated_text TEXT, -- translated output
  structured_data JSONB, -- parsed/structured JSON output
  confidence_score DECIMAL(5,4), -- 0.0000 to 1.0000
  language_detected VARCHAR(10),
  language_translated_to VARCHAR(10) DEFAULT 'en',
  processing_time_ms INTEGER,
  token_count INTEGER, -- API tokens used
  cost_usd DECIMAL(10,6), -- estimated API cost
  error_message TEXT,
  metadata JSONB, -- any extra metadata from the API
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. COMPLIANCE REQUIREMENTS
-- Stores vaccination requirements per country
CREATE TABLE IF NOT EXISTS public.compliance_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country VARCHAR(100) NOT NULL,
  country_code VARCHAR(3) NOT NULL,
  state VARCHAR(100), -- some requirements are state-specific
  requirement_type VARCHAR(50) NOT NULL, -- entry, student, worker, resident, all
  vaccine_name VARCHAR(255) NOT NULL,
  vaccine_code VARCHAR(50),
  required_doses INTEGER DEFAULT 1,
  min_age INTEGER, -- minimum age in months
  max_age INTEGER, -- maximum age in months (null = no max)
  validity_period_months INTEGER, -- how long the vaccine is valid
  is_mandatory BOOLEAN DEFAULT TRUE,
  is_recommended BOOLEAN DEFAULT FALSE,
  exemptions_allowed BOOLEAN DEFAULT FALSE,
  exemption_types TEXT[], -- medical, religious, philosophical
  notes TEXT,
  source_url TEXT, -- link to official government requirement page
  last_verified DATE, -- when this data was last checked
  effective_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. USER COMPLIANCE STATUS
-- Tracks each user's compliance with their target country's requirements
CREATE TABLE IF NOT EXISTS public.user_compliance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requirement_id UUID NOT NULL REFERENCES public.compliance_requirements(id) ON DELETE CASCADE,
  vaccination_id UUID REFERENCES public.vaccinations(id) ON DELETE SET NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'missing', -- compliant, partial, missing, expired, exempt
  doses_completed INTEGER DEFAULT 0,
  doses_required INTEGER DEFAULT 1,
  next_dose_due DATE,
  expiry_date DATE,
  exemption_type VARCHAR(50),
  exemption_document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
  notes TEXT,
  last_checked TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, requirement_id)
);

-- 8. SHARED RECORDS
-- Manages sharing vaccination records with providers or others
CREATE TABLE IF NOT EXISTS public.shared_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  share_type VARCHAR(30) NOT NULL, -- link, email, provider
  share_token VARCHAR(255) UNIQUE, -- unique token for link-based sharing
  recipient_email VARCHAR(255),
  recipient_name VARCHAR(255),
  recipient_organization VARCHAR(255),
  shared_items JSONB NOT NULL, -- array of { type: "vaccination"|"document", id: "uuid" }
  permissions VARCHAR(30) DEFAULT 'view', -- view, download
  include_documents BOOLEAN DEFAULT FALSE,
  message TEXT, -- personal message to recipient
  password_hash TEXT, -- optional password protection
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  access_count INTEGER DEFAULT 0,
  max_access_count INTEGER, -- null = unlimited
  last_accessed_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SHARE ACCESS LOG
-- Audit trail of who accessed shared records
CREATE TABLE IF NOT EXISTS public.share_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shared_record_id UUID NOT NULL REFERENCES public.shared_records(id) ON DELETE CASCADE,
  accessor_ip VARCHAR(50),
  accessor_user_agent TEXT,
  accessor_email VARCHAR(255),
  action VARCHAR(30) NOT NULL, -- viewed, downloaded, printed
  accessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. NOTIFICATIONS / ALERTS
-- System alerts for compliance deadlines, upcoming doses, etc.
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- compliance_alert, dose_reminder, document_expiry, share_accessed, system
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  severity VARCHAR(20) DEFAULT 'info', -- info, warning, urgent, success
  related_entity_type VARCHAR(50), -- vaccination, document, compliance, shared_record
  related_entity_id UUID,
  action_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  is_dismissed BOOLEAN DEFAULT FALSE,
  scheduled_for TIMESTAMPTZ, -- for future notifications
  sent_via_email BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. MEDICAL PROVIDERS
-- Directory of healthcare providers the user has visited
CREATE TABLE IF NOT EXISTS public.medical_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50), -- hospital, clinic, pharmacy, public_health, doctor_office
  specialty VARCHAR(100),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  country_code VARCHAR(3),
  phone VARCHAR(30),
  email VARCHAR(255),
  website TEXT,
  npi VARCHAR(20), -- National Provider Identifier (US)
  fhir_endpoint TEXT, -- FHIR API endpoint for EHR integration
  ehr_system VARCHAR(100), -- Epic, Cerner, etc.
  is_primary BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. EHR INTEGRATION CONNECTIONS
-- Stores user connections to electronic health record systems
CREATE TABLE IF NOT EXISTS public.ehr_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.medical_providers(id) ON DELETE SET NULL,
  ehr_system VARCHAR(100) NOT NULL, -- Epic, Cerner, Allscripts, etc.
  fhir_endpoint TEXT NOT NULL,
  patient_id_external VARCHAR(255), -- patient ID in the EHR
  access_token_encrypted TEXT,
  refresh_token_encrypted TEXT,
  token_expires_at TIMESTAMPTZ,
  scopes TEXT[],
  status VARCHAR(30) DEFAULT 'pending', -- pending, connected, disconnected, error
  last_sync_at TIMESTAMPTZ,
  sync_frequency VARCHAR(20) DEFAULT 'manual', -- manual, daily, weekly
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. EHR SYNC LOG
-- Audit trail of data synced from EHR systems
CREATE TABLE IF NOT EXISTS public.ehr_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES public.ehr_connections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sync_type VARCHAR(30) NOT NULL, -- full, incremental, manual
  status VARCHAR(30) NOT NULL, -- started, completed, failed, partial
  records_fetched INTEGER DEFAULT 0,
  records_created INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_skipped INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  metadata JSONB
);

-- 14. VACCINE CATALOG
-- Reference data: standard vaccine names, codes, schedules
CREATE TABLE IF NOT EXISTS public.vaccine_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vaccine_name VARCHAR(255) NOT NULL,
  vaccine_name_short VARCHAR(50),
  cvx_code VARCHAR(10), -- CDC CVX code
  vaccine_group VARCHAR(100), -- grouping (e.g., "COVID-19", "Influenza")
  disease_targets TEXT[], -- diseases it prevents
  manufacturers TEXT[], -- known manufacturers
  standard_doses INTEGER DEFAULT 1,
  dose_schedule_description TEXT, -- human-readable schedule
  dose_intervals_days INTEGER[], -- days between doses
  minimum_age_months INTEGER,
  contraindications TEXT,
  common_names JSONB, -- { "es": "Vacuna COVID", "fr": "Vaccin COVID", ... }
  is_travel_vaccine BOOLEAN DEFAULT FALSE,
  is_routine BOOLEAN DEFAULT TRUE,
  requires_booster BOOLEAN DEFAULT FALSE,
  booster_interval_months INTEGER,
  validity_period_months INTEGER, -- null = lifetime
  storage_requirements TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. TRANSLATION GLOSSARY
-- Custom medical translation glossary for AI agents
CREATE TABLE IF NOT EXISTS public.translation_glossary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_language VARCHAR(10) NOT NULL,
  target_language VARCHAR(10) NOT NULL DEFAULT 'en',
  source_term VARCHAR(500) NOT NULL,
  target_term VARCHAR(500) NOT NULL,
  category VARCHAR(50), -- vaccine, disease, procedure, body_part, provider_type
  context TEXT, -- usage context
  verified BOOLEAN DEFAULT FALSE,
  verified_by VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. AUDIT LOG
-- Tracks important user actions for security
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL, -- login, logout, upload_document, delete_record, share_records, etc.
  entity_type VARCHAR(50), -- profile, vaccination, document, shared_record
  entity_id UUID,
  details JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. USER PREFERENCES
-- App settings and notification preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_language VARCHAR(10) DEFAULT 'en',
  date_format VARCHAR(20) DEFAULT 'YYYY-MM-DD',
  timezone VARCHAR(50) DEFAULT 'UTC',
  email_notifications BOOLEAN DEFAULT TRUE,
  compliance_alerts BOOLEAN DEFAULT TRUE,
  dose_reminders BOOLEAN DEFAULT TRUE,
  document_expiry_alerts BOOLEAN DEFAULT TRUE,
  share_access_alerts BOOLEAN DEFAULT TRUE,
  reminder_days_before INTEGER DEFAULT 30, -- days before due date to remind
  theme VARCHAR(10) DEFAULT 'light', -- light, dark, system
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. FAMILY MEMBERS
-- Users can manage records for dependents/family
CREATE TABLE IF NOT EXISTS public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- parent account
  full_name VARCHAR(255) NOT NULL,
  relationship VARCHAR(50) NOT NULL, -- child, spouse, parent, sibling, dependent
  date_of_birth DATE,
  gender VARCHAR(20),
  profile_image_url TEXT,
  country_of_origin VARCHAR(100),
  current_country VARCHAR(100),
  blood_type VARCHAR(10),
  allergies TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- INDEXES for performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_country_history_user_id ON public.country_history(user_id);
CREATE INDEX IF NOT EXISTS idx_vaccinations_user_id ON public.vaccinations(user_id);
CREATE INDEX IF NOT EXISTS idx_vaccinations_vaccine_name ON public.vaccinations(vaccine_name);
CREATE INDEX IF NOT EXISTS idx_vaccinations_date ON public.vaccinations(date_administered);
CREATE INDEX IF NOT EXISTS idx_vaccinations_country ON public.vaccinations(country_given);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON public.documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_processing_status ON public.documents(processing_status);
CREATE INDEX IF NOT EXISTS idx_document_processing_doc_id ON public.document_processing(document_id);
CREATE INDEX IF NOT EXISTS idx_compliance_requirements_country ON public.compliance_requirements(country_code);
CREATE INDEX IF NOT EXISTS idx_compliance_requirements_vaccine ON public.compliance_requirements(vaccine_name);
CREATE INDEX IF NOT EXISTS idx_user_compliance_user_id ON public.user_compliance(user_id);
CREATE INDEX IF NOT EXISTS idx_user_compliance_status ON public.user_compliance(status);
CREATE INDEX IF NOT EXISTS idx_shared_records_user_id ON public.shared_records(user_id);
CREATE INDEX IF NOT EXISTS idx_shared_records_token ON public.shared_records(share_token);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_medical_providers_user_id ON public.medical_providers(user_id);
CREATE INDEX IF NOT EXISTS idx_ehr_connections_user_id ON public.ehr_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_vaccine_catalog_cvx ON public.vaccine_catalog(cvx_code);
CREATE INDEX IF NOT EXISTS idx_vaccine_catalog_group ON public.vaccine_catalog(vaccine_group);
CREATE INDEX IF NOT EXISTS idx_translation_glossary_langs ON public.translation_glossary(source_language, target_language);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON public.audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON public.audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON public.family_members(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);


-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
-- These ensure users can only access their own data

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.country_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_processing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.share_access_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ehr_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ehr_sync_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Country History
CREATE POLICY "Users can view own country history" ON public.country_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own country history" ON public.country_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own country history" ON public.country_history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own country history" ON public.country_history FOR DELETE USING (auth.uid() = user_id);

-- Vaccinations
CREATE POLICY "Users can view own vaccinations" ON public.vaccinations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own vaccinations" ON public.vaccinations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vaccinations" ON public.vaccinations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own vaccinations" ON public.vaccinations FOR DELETE USING (auth.uid() = user_id);

-- Documents
CREATE POLICY "Users can view own documents" ON public.documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own documents" ON public.documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own documents" ON public.documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own documents" ON public.documents FOR DELETE USING (auth.uid() = user_id);

-- Document Processing
CREATE POLICY "Users can view own processing" ON public.document_processing FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own processing" ON public.document_processing FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Compliance
CREATE POLICY "Users can view own compliance" ON public.user_compliance FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own compliance" ON public.user_compliance FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own compliance" ON public.user_compliance FOR UPDATE USING (auth.uid() = user_id);

-- Shared Records
CREATE POLICY "Users can view own shared records" ON public.shared_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own shared records" ON public.shared_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own shared records" ON public.shared_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own shared records" ON public.shared_records FOR DELETE USING (auth.uid() = user_id);

-- Share Access Log (owner of the shared record can view)
CREATE POLICY "Users can view access logs for own shares" ON public.share_access_log FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.shared_records sr WHERE sr.id = shared_record_id AND sr.user_id = auth.uid()));

-- Notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Medical Providers
CREATE POLICY "Users can view own providers" ON public.medical_providers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own providers" ON public.medical_providers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own providers" ON public.medical_providers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own providers" ON public.medical_providers FOR DELETE USING (auth.uid() = user_id);

-- EHR Connections
CREATE POLICY "Users can view own ehr connections" ON public.ehr_connections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ehr connections" ON public.ehr_connections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ehr connections" ON public.ehr_connections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ehr connections" ON public.ehr_connections FOR DELETE USING (auth.uid() = user_id);

-- EHR Sync Log
CREATE POLICY "Users can view own sync logs" ON public.ehr_sync_log FOR SELECT USING (auth.uid() = user_id);

-- Audit Log (users can only view their own)
CREATE POLICY "Users can view own audit log" ON public.audit_log FOR SELECT USING (auth.uid() = user_id);

-- User Preferences
CREATE POLICY "Users can view own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);

-- Family Members
CREATE POLICY "Users can view own family members" ON public.family_members FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own family members" ON public.family_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own family members" ON public.family_members FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own family members" ON public.family_members FOR DELETE USING (auth.uid() = user_id);

-- Compliance Requirements (public read for all authenticated users)
CREATE POLICY "Authenticated users can view requirements" ON public.compliance_requirements FOR SELECT USING (auth.role() = 'authenticated');

-- Vaccine Catalog (public read for all authenticated users)
CREATE POLICY "Authenticated users can view vaccine catalog" ON public.vaccine_catalog FOR SELECT USING (auth.role() = 'authenticated');

-- Translation Glossary (public read for all authenticated users)
CREATE POLICY "Authenticated users can view glossary" ON public.translation_glossary FOR SELECT USING (auth.role() = 'authenticated');


-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_country_history_updated_at BEFORE UPDATE ON public.country_history FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_vaccinations_updated_at BEFORE UPDATE ON public.vaccinations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_document_processing_updated_at BEFORE UPDATE ON public.document_processing FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_user_compliance_updated_at BEFORE UPDATE ON public.user_compliance FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_shared_records_updated_at BEFORE UPDATE ON public.shared_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_medical_providers_updated_at BEFORE UPDATE ON public.medical_providers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_ehr_connections_updated_at BEFORE UPDATE ON public.ehr_connections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_family_members_updated_at BEFORE UPDATE ON public.family_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-create profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, email_verified)
  VALUES (NEW.id, NEW.email, NEW.email_confirmed_at IS NOT NULL);
  
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- STORAGE BUCKETS (run in SQL Editor)
-- ============================================================
-- Create a storage bucket for document uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  FALSE,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
) ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
CREATE POLICY "Users can upload own documents" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own documents" ON storage.objects FOR SELECT
  USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own documents" ON storage.objects FOR DELETE
  USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);


-- ============================================================
-- SUMMARY
-- ============================================================
-- Tables created: 18
--   1.  profiles              - Extended user profiles
--   2.  country_history       - Residence history
--   3.  vaccinations          - Vaccination records
--   4.  documents             - Uploaded document metadata
--   5.  document_processing   - OCR/AI processing results
--   6.  compliance_requirements - Country vaccine requirements
--   7.  user_compliance       - User compliance status
--   8.  shared_records        - Record sharing management
--   9.  share_access_log      - Sharing audit trail
--   10. notifications         - Alerts and reminders
--   11. medical_providers     - Healthcare provider directory
--   12. ehr_connections       - EHR system connections
--   13. ehr_sync_log          - EHR sync audit trail
--   14. vaccine_catalog       - Reference vaccine data
--   15. translation_glossary  - Medical translation terms
--   16. audit_log             - Security audit trail
--   17. user_preferences      - User settings
--   18. family_members        - Dependent/family records
--
-- Plus: Indexes, RLS policies, triggers, storage bucket
-- ============================================================
