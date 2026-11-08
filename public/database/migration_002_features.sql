-- =========================================================================
-- PP-SDOMS — Migration 002: Feature Additions
-- Adds: action points, meetings, events, audit logs, notifications,
--       pending changes (approval workflow), and users.last_login.
-- Safe to run after database/schema.sql. Idempotent where possible.
-- =========================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -------------------------------------------------------------------------
-- USERS: track last login (shown in the sticky header)
-- -------------------------------------------------------------------------
SET @col_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'last_login'
);
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE users ADD COLUMN last_login DATETIME NULL AFTER is_admin',
  'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE users SET last_login = '2026-02-14 06:58:02' WHERE id = 1 AND last_login IS NULL;
UPDATE users SET last_login = '2026-02-14 07:45:10' WHERE id = 2 AND last_login IS NULL;
UPDATE users SET last_login = '2026-02-14 08:12:45' WHERE id = 3 AND last_login IS NULL;
UPDATE users SET last_login = '2026-02-14 07:45:10' WHERE id = 4 AND last_login IS NULL;

-- -------------------------------------------------------------------------
-- PROJECTS: explicit "funds outstanding" figure for the Finance Records tab
-- -------------------------------------------------------------------------
SET @fo_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'projects' AND COLUMN_NAME = 'funds_outstanding'
);
SET @ddl2 := IF(@fo_exists = 0,
  'ALTER TABLE projects ADD COLUMN funds_outstanding DECIMAL(15,2) NULL AFTER funds_utilized',
  'SELECT 1');
PREPARE stmt2 FROM @ddl2; EXECUTE stmt2; DEALLOCATE PREPARE stmt2;

UPDATE projects SET funds_outstanding = GREATEST(total_budget - funds_disbursed, 0) WHERE funds_outstanding IS NULL;

-- -------------------------------------------------------------------------
-- ACTION POINTS (drives the read-only Action Board)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS action_points (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ref_no VARCHAR(50) NOT NULL UNIQUE,
  project_id INT NULL,
  title VARCHAR(250) NOT NULL,
  description TEXT,
  person_responsible VARCHAR(150),
  timeline VARCHAR(100),
  status VARCHAR(50) DEFAULT 'ON TRACK',
  resolution_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO action_points (id, ref_no, project_id, title, description, person_responsible, timeline, status, resolution_notes) VALUES
(1, 'NASCOP-APT-202602', (SELECT id FROM projects WHERE project_code='MOCK-2026-001' LIMIT 1), 'Emergency procurement pipeline activated', 'Emergency procurement pipeline activated; 250,000 cartridges cleared at Port of Mombasa.', 'Dr. Ruth Masha (NASCOP Lead)', '2 weeks', 'ON TRACK', 'Cartridges cleared and distributed to regional hubs.'),
(2, 'APT-010', (SELECT id FROM projects WHERE project_code='MOCK-2026-001' LIMIT 1), 'KNRA inspection scheduled', 'KNRA inspection scheduled for 05 Feb 2026.', 'Dr. Mary Wangari', '3 weeks', 'ON TRACK', 'Inspection checklist shared with facility team.'),
(3, 'APT-008', (SELECT id FROM projects WHERE project_code='MOCK-2026-001' LIMIT 1), 'API integration specification finalized', 'API integration specification finalized; pilot in 3 counties underway.', 'Dr. Joseph Mburu', '6 weeks', 'ON TRACK', 'Pilot counties onboarded.'),
(4, 'APT-20260120-327', (SELECT id FROM projects WHERE project_code='MOCK-2026-003' LIMIT 1), 'Contract renegotiation meeting', 'Contract renegotiation meeting scheduled; legal review of sub-contract clause ongoing.', 'Eng. Peter Mutua (Health Infrastructure)', '4 weeks', 'STALLED', 'Awaiting legal opinion on sub-contract clause.'),
(5, 'APT-009', (SELECT id FROM projects WHERE project_code='MOCK-2026-002' LIMIT 1), 'Manufacturer engineer sign-off', 'Manufacturer engineer completed sign-off on 20 Jan 2026; equipment commissioned.', 'Dr. Evans Kimani', 'Completed', 'COMPLETED', 'Equipment commissioned and handed over.');

-- -------------------------------------------------------------------------
-- MEETINGS (Official Diary)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS meetings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(250) NOT NULL,
  meeting_date DATE,
  meeting_time VARCHAR(20),
  venue VARCHAR(200),
  chairperson VARCHAR(150),
  attendees TEXT,
  agenda TEXT,
  decisions TEXT,
  linked_project_id INT NULL,
  FOREIGN KEY (linked_project_id) REFERENCES projects(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO meetings (id, title, meeting_date, meeting_time, venue, chairperson, attendees, agenda, decisions, linked_project_id) VALUES
(1, 'NASCOP Quarterly Review Meeting', '2026-01-25', '09:00', 'NASCOP Boardroom, Nairobi', 'Dr. Ruth Masha', 'NASCOP leads, programme managers, M&E officers', 'Review Q2 performance, procurement pipeline, viral load suppression.', 'Accelerate cartridge distribution; submit revised procurement plan.', (SELECT id FROM projects WHERE project_code='MOCK-2026-007' LIMIT 1)),
(2, 'Kisumu Hospital Project Deliverables Meeting', '2026-01-20', '11:00', 'JOOTRH, Kisumu', 'Dr. Evans Kimani', 'Hospital management, contractor, equipment vendor', 'Dialysis equipment delivery, water treatment plant installation.', 'Vendor to deliver by end of Q3; site works to continue.', (SELECT id FROM projects WHERE project_code='MOCK-2026-002' LIMIT 1)),
(3, 'KNH Burns ICU Equipment Handover', '2026-01-12', '10:00', 'KNH, Nairobi', 'Dr. Harry Kimtai', 'KNH CEO, biomedical engineers, contractor', 'Handover of commissioned burns ICU equipment.', 'Equipment accepted; commissioning report signed.', (SELECT id FROM projects WHERE project_code='MOCK-2026-001' LIMIT 1));

-- -------------------------------------------------------------------------
-- EVENTS (Official Diary)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(250) NOT NULL,
  event_date DATE,
  event_time VARCHAR(20),
  location VARCHAR(200),
  host VARCHAR(150),
  category VARCHAR(50) DEFAULT 'Event',
  description TEXT,
  linked_project_id INT NULL,
  FOREIGN KEY (linked_project_id) REFERENCES projects(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO events (id, title, event_date, event_time, location, host, category, description, linked_project_id) VALUES
(1, 'Afya Care EHR Go-Live - Level 5 Hospitals', '2026-02-20', '08:00', 'Countrywide', 'Health Informatics Directorate', 'Milestone', 'Go-live of EHR system in 9 Level 5 hospitals.', (SELECT id FROM projects WHERE project_code='MOCK-2026-006' LIMIT 1)),
(2, 'National UHC Launch - Phase II', '2026-03-01', '09:00', 'Counties', 'Executive Office', 'Launch', 'Phase II national rollout of Universal Health Coverage.', (SELECT id FROM projects WHERE project_code='MOCK-2026-005' LIMIT 1)),
(3, 'Quarterly Performance Contract Review', '2026-04-15', '10:00', 'Afya House, Nairobi', 'Directorate of Planning', 'Review', 'Quarterly review of performance contract targets.', NULL);

-- -------------------------------------------------------------------------
-- AUDIT LOGS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(150),
  email VARCHAR(150),
  action VARCHAR(50),
  module VARCHAR(100),
  record_id VARCHAR(50),
  details TEXT,
  ip_address VARCHAR(50),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO audit_logs (id, user_name, email, action, module, record_id, details, ip_address, timestamp) VALUES
(1, 'Dr. Rose Njeru', 'rose.njeru@health.go.ke', 'login', 'Authentication', NULL, 'User logged in successfully.', '196.201.214.18', '2026-02-14 08:12:45'),
(2, 'Dr. Rose Njeru', 'rose.njeru@health.go.ke', 'update', 'Finance Records', '1', 'Updated financing for KNH Cardiothoracic Theatre: Allocated 420.00M, Disbursed 168.00M, Utilised 92.00M, Outstanding 328.00M', '196.201.214.18', '2026-02-14 08:05:10'),
(3, 'Eng. Peter Mutua', 'peter.mutua@health.go.ke', 'update', 'Action Points Tracker', '1', 'Change requested on NASCOP-APT-202602: Status "ON TRACK" -> "COMPLETED". Reason: All deliverables verified. Status: PENDING APPROVAL.', '196.201.214.20', '2026-02-14 08:02:11'),
(4, 'Dr. Harry Kimtai', 'harry.kimtai@health.go.ke', 'approve', 'Action Points Tracker', '1', 'Approved change on NASCOP-APT-202602. Approved by Dr. Harry Kimtai (PS-SDMS).', '196.201.214.15', '2026-02-14 07:58:02'),
(5, 'Dr. Rose Njeru', 'rose.njeru@health.go.ke', 'create', 'Users', '5', 'New user account created: Faith Chebet (M&E Officer).', '196.201.214.18', '2026-02-13 16:30:00');

-- -------------------------------------------------------------------------
-- NOTIFICATIONS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(250) NOT NULL,
  message TEXT,
  module VARCHAR(100),
  severity VARCHAR(50) DEFAULT 'info',
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  related_log_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO notifications (id, title, message, module, severity, is_read, related_log_id, created_at) VALUES
(1, 'Action change pending approval', 'Eng. Peter Mutua requested a change to NASCOP-APT-202602 (Status: ON TRACK -> COMPLETED). Reason: All deliverables verified.', 'Action Points Tracker', 'approval', 0, 3, '2026-02-14 08:02:11'),
(2, 'Finance figures updated', 'Budget allocation and disbursement for KNH Cardiothoracic Theatre were updated.', 'Finance Records', 'info', 0, 2, '2026-02-14 08:05:10'),
(3, 'Performance Contract indicator reviewed', 'Sub-KPI C3.1 achievement was reviewed and updated.', 'Performance Contract', 'info', 1, NULL, '2026-02-13 14:20:00'),
(4, 'New user account created', 'A new M&E Officer account was created for Faith Chebet.', 'Users', 'success', 1, 5, '2026-02-13 16:30:00');

-- -------------------------------------------------------------------------
-- PENDING CHANGES (action change approval workflow)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pending_changes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  action_id INT NOT NULL,
  ref_no VARCHAR(50) NOT NULL,
  field VARCHAR(100) NOT NULL,
  old_value TEXT,
  new_value TEXT,
  reason TEXT NOT NULL,
  requested_by VARCHAR(150) NOT NULL,
  requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'Pending',
  approved_by VARCHAR(150) NULL,
  approved_at DATETIME NULL,
  FOREIGN KEY (action_id) REFERENCES action_points(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO pending_changes (id, action_id, ref_no, field, old_value, new_value, reason, requested_by, requested_at, status, approved_by, approved_at) VALUES
(1, 1, 'NASCOP-APT-202602', 'Status', 'ON TRACK', 'COMPLETED', 'All deliverables for the KNH Burns ICU commissioning were verified and handed over.', 'Eng. Peter Mutua', '2026-02-14 08:02:11', 'Pending', NULL, NULL);

SET FOREIGN_KEY_CHECKS = 1;
-- END OF MIGRATION 002
