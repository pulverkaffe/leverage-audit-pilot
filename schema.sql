CREATE TABLE IF NOT EXISTS audit_submissions (
  submission_id TEXT PRIMARY KEY,
  participant_id TEXT NOT NULL,
  audit_version TEXT NOT NULL,
  started_at TEXT,
  completed_at TEXT NOT NULL,
  duration_seconds INTEGER,
  answers_json TEXT NOT NULL,
  timings_json TEXT NOT NULL,
  diagnostic_json TEXT NOT NULL,
  analysis_status TEXT NOT NULL DEFAULT 'not_requested',
  analysis_json TEXT,
  analysis_updated_at TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_submissions_participant
  ON audit_submissions(participant_id);

CREATE INDEX IF NOT EXISTS idx_audit_submissions_completed
  ON audit_submissions(completed_at);

CREATE INDEX IF NOT EXISTS idx_audit_submissions_analysis_status
  ON audit_submissions(analysis_status);
