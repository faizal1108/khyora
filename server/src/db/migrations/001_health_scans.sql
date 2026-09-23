CREATE TABLE IF NOT EXISTS health_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(128) NOT NULL,
  image_data TEXT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_name VARCHAR(255),
  file_size INTEGER NOT NULL,
  flow_level VARCHAR(50),
  infection_risk VARCHAR(50),
  analysis_result JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_health_scans_user_id ON health_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_health_scans_user_created ON health_scans(user_id, created_at DESC);
