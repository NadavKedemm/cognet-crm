-- migration: יישור טבלת leads למה שהקוד מצפה
-- בטוח להרצה: הטבלה ריקה, אין סיכון לאיבוד נתונים

-- 1. הוספת עמודות חסרות
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'דף נחיתה';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_source TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_medium TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_campaign TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. תיקון ערך ברירת מחדל וערכי status (מאנגלית לעברית)
-- הסרת constraint ישן אם קיים
DO $$
DECLARE
  c RECORD;
BEGIN
  FOR c IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'leads'::regclass AND contype = 'c'
  LOOP
    EXECUTE format('ALTER TABLE leads DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;

-- מיפוי ערכים קיימים מאנגלית לעברית (אם קיימים)
UPDATE leads SET status = 'חדש'    WHERE status = 'new';
UPDATE leads SET status = 'בטיפול' WHERE status IN ('in_progress','contacted','working');
UPDATE leads SET status = 'הומר'   WHERE status IN ('converted','won');
UPDATE leads SET status = 'אבוד'   WHERE status IN ('lost','closed');

-- שינוי ברירת המחדל
ALTER TABLE leads ALTER COLUMN status SET DEFAULT 'חדש';

-- הוספת constraint חדש
ALTER TABLE leads ADD CONSTRAINT leads_status_check
  CHECK (status IN ('חדש', 'בטיפול', 'הומר', 'אבוד'));

-- 3. trigger לעדכון אוטומטי של updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS leads_updated_at ON leads;
CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
