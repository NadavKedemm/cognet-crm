CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  status TEXT DEFAULT 'חדש' CHECK (status IN ('חדש', 'בטיפול', 'הומר', 'אבוד')),
  source TEXT DEFAULT 'דף נחיתה',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  page_source TEXT,
  device_type TEXT,
  browser TEXT,
  country TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  section TEXT,
  value NUMERIC,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_session_id ON events(session_id);
CREATE INDEX idx_events_created_at ON events(created_at);
CREATE INDEX idx_events_section ON events(section);
CREATE INDEX idx_sessions_last_seen ON sessions(last_seen);
CREATE INDEX idx_leads_created_at ON leads(created_at);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert events" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can upsert sessions" ON sessions FOR ALL WITH CHECK (true);
CREATE POLICY "Service can read leads" ON leads FOR SELECT USING (auth.role() = 'service_role');
CREATE POLICY "Service can update leads" ON leads FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service can read events" ON events FOR SELECT USING (auth.role() = 'service_role');
CREATE POLICY "Service can read sessions" ON sessions FOR SELECT USING (auth.role() = 'service_role');
