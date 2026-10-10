-- =========================================================================
-- STATE DEPARTMENT FOR MEDICAL SERVICES - PP-SDOMS
-- REVISED MYSQL DATABASE SCHEMA & DEMO DATASET FOR cPANEL DEPLOYMENT
-- =========================================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS action_points;
DROP TABLE IF EXISTS meetings;
DROP TABLE IF EXISTS project_kpis;
DROP TABLE IF EXISTS performance_kpis;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS flagships;
DROP TABLE IF EXISTS divisions;
DROP TABLE IF EXISTS directorates;
DROP TABLE IF EXISTS sagas;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. USERS & RBAC TABLE
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  role VARCHAR(100) NOT NULL,
  directorate VARCHAR(150) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  can_upload BOOLEAN DEFAULT TRUE,
  can_edit BOOLEAN DEFAULT TRUE,
  can_approve BOOLEAN DEFAULT FALSE,
  can_download BOOLEAN DEFAULT TRUE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO users (id, full_name, email, role, directorate, is_active, can_upload, can_edit, can_approve, can_download, is_admin) VALUES
(1, 'Dr. Harry Kimtai', 'harry.kimtai@health.go.ke', 'Principal Secretary - SDMS', 'Executive Office', 1, 1, 1, 1, 1, 1),
(2, 'Dr. Patrick Amoth', 'patrick.amoth@health.go.ke', 'Director General for Health', 'Directorate General', 1, 1, 1, 1, 1, 1),
(3, 'Dr. Rose Njeru', 'rose.njeru@health.go.ke', 'Head of Health Informatics', 'Health Informatics Directorate', 1, 1, 1, 1, 1, 0),
(4, 'CPA Evanson Kamuri', 'evanson.kamuri@knh.or.ke', 'Chief Executive Officer', 'Kenyatta National Hospital (SAGA)', 1, 1, 1, 0, 1, 0);

-- 2. SAGAS TABLE
CREATE TABLE sagas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  saga_code VARCHAR(50) NOT NULL UNIQUE,
  saga_name VARCHAR(200) NOT NULL,
  head_name VARCHAR(150),
  budget_allocated DECIMAL(15,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO sagas (id, saga_code, saga_name, head_name, budget_allocated) VALUES
(1, 'KNH', 'Kenyatta National Hospital', 'Dr. Evanson Kamuri', 12500000000.00),
(2, 'MTRH', 'Moi Teaching and Referral Hospital', 'Dr. Wilson Aruasa', 9800000000.00),
(3, 'KEMSA', 'Kenya Medical Supplies Authority', 'Dr. Andrew Mulwa', 7500000000.00),
(4, 'NHIF', 'National Health Insurance Fund / SHA', 'Dr. Elijah Wachira', 18000000000.00);

-- 3. DIRECTORATES TABLE
CREATE TABLE directorates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  directorate_code VARCHAR(50) NOT NULL UNIQUE,
  directorate_name VARCHAR(200) NOT NULL,
  lead_officer VARCHAR(150),
  allocated_budget DECIMAL(15,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO directorates (id, directorate_code, directorate_name, lead_officer, allocated_budget) VALUES
(1, 'DIR_FH', 'Directorate for Family Health', 'Dr. Ruth Masha', 14200000000.00),
(2, 'DIR_PC', 'Directorate for Preventive & Promotive Health', 'Dr. Sultani Matendechero', 16800000000.00),
(3, 'DIR_CS', 'Directorate for Curative & Rehabilitation Services', 'Dr. Simon Kibias', 22100000000.00),
(4, 'DIR_HI', 'Health Informatics & Digital Health Directorate', 'Dr. Rose Njeru', 8500000000.00);

-- 4. DIVISIONS TABLE
CREATE TABLE divisions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  directorate_id INT,
  division_code VARCHAR(50) NOT NULL UNIQUE,
  division_name VARCHAR(200) NOT NULL,
  head_officer VARCHAR(150),
  FOREIGN KEY (directorate_id) REFERENCES directorates(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO divisions (id, directorate_id, division_code, division_name, head_officer) VALUES
(1, 1, 'DIV_PHC', 'Division of Primary Health Care', 'Dr. Purity Ndegwa'),
(2, 1, 'DIV_RMH', 'Division of Reproductive and Maternal Health', 'Dr. Edward Serem'),
(3, 2, 'DIV_DSR', 'Division of Disease Surveillance and Response', 'Dr. Sultani Matendechero'),
(4, 4, 'DIV_HIM', 'Division of Health Informatics and m-Health', 'Dr. Rose Njeru'),
(5, 3, 'DIV_LBS', 'Division of Laboratory Services and Blood Safety', 'Dr. Kiptoo Korir');

-- 5. FLAGSHIPS TABLE
CREATE TABLE flagships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(250) NOT NULL,
  description TEXT,
  lead_directorate VARCHAR(150),
  progress_pct INT DEFAULT 0,
  risk_level VARCHAR(50),
  priority_tier VARCHAR(50),
  allocated_budget DECIMAL(15,2),
  utilized_budget DECIMAL(15,2),
  lead_officer VARCHAR(150),
  team_name VARCHAR(150),
  start_date DATE,
  target_date DATE,
  status VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO flagships (id, title, description, lead_directorate, progress_pct, risk_level, priority_tier, allocated_budget, utilized_budget, lead_officer, team_name, start_date, target_date, status) VALUES
(1, 'Afya Care UHC Digitization & Electronic Health Records (EHR)', 'Deployment of standardized enterprise EHR software across Level 4, 5, and 6 referral facilities in all 47 counties.', 'Health Informatics & Digital Health', 68, 'Medium', 'Critical', 4500000000.00, 3120000000.00, 'Dr. Rose Njeru', 'UHC Digital Steering Taskforce', '2024-07-01', '2026-12-31', 'In Progress'),
(2, 'National Emergency Medical Services & Critical Care Fund (EMS)', 'Institutionalization of ambulance network and critical trauma care fund.', 'Emergency Medical Care Directorate', 42, 'High', 'High', 2800000000.00, 1190000000.00, 'Dr. Evans Kimani', 'EMS National Board', '2024-09-01', '2027-06-30', 'In Progress');

-- 6. PROJECTS TABLE
CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  programme_title VARCHAR(250) NOT NULL,
  sub_programme VARCHAR(250) NOT NULL,
  description TEXT,
  remarks TEXT,
  category VARCHAR(50) DEFAULT 'Directorate',
  directorate_name VARCHAR(150),
  saga_name VARCHAR(150),
  division_name VARCHAR(150),
  delivery_unit VARCHAR(150),
  flagship_id INT,
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'In Progress',
  progress_status VARCHAR(50) DEFAULT '50%',
  total_budget DECIMAL(15,2),
  funds_disbursed DECIMAL(15,2),
  funds_utilized DECIMAL(15,2),
  milestones_completed INT DEFAULT 2,
  milestones_total INT DEFAULT 3,
  tasks_on_track INT DEFAULT 1,
  tasks_total INT DEFAULT 1,
  gantt_task_name VARCHAR(250),
  FOREIGN KEY (flagship_id) REFERENCES flagships(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO projects (id, programme_title, sub_programme, description, remarks, category, directorate_name, saga_name, division_name, delivery_unit, flagship_id, start_date, end_date, status, progress_status, total_budget, funds_disbursed, funds_utilized, milestones_completed, milestones_total, tasks_on_track, tasks_total, gantt_task_name) VALUES
(1, 'Specialized Regional Cancer & Clinical Infrastructure Programme', 'Modernization of Kenyatta National Hospital Burns Unit & ICU', 'Official ribbon-cutting and technical handover of the modernized Burns ICU at Kenyatta National Hospital.', 'Completed successfully on schedule.', 'Saga', NULL, 'Kenyatta National Hospital', NULL, 'Kenyatta National Hospital', 1, '2026-01-01', '2026-12-31', 'In Progress', '75%', 750000000.00, 600000000.00, 520000000.00, 3, 3, 1, 1, 'KNH Burns Unit & ICU Modernization'),
(2, 'Preventive & Promotive Health Services Programme', 'National HIV/AIDS, STI and Viral Load Suppression Scale-Up', 'National program for HIV/AIDS and STI prevention, treatment, and control. Key indicators include: PLHIV, On ART, and Viral Load Suppression.', 'On track with county health teams.', 'Directorate', 'Directorate for Family Health', NULL, 'Division of Primary Health Care', 'Directorate for Family Health', 2, '2026-01-01', '2028-12-31', 'In Progress', '65%', 500000000.00, 350000000.00, 310000000.00, 2, 3, 1, 1, 'Improve Viral Load Suppression Rate');

-- 7. PERFORMANCE KPIS TABLE
CREATE TABLE performance_kpis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL,
  parent_kpi_name VARCHAR(250),
  parent_kpi_code VARCHAR(50),
  category_weight DECIMAL(5,2) DEFAULT 0.00,
  sub_kpi_weight DECIMAL(5,2) DEFAULT 0.00,
  delivery_unit VARCHAR(150),
  programme VARCHAR(250),
  key_outputs TEXT,
  kpi_name VARCHAR(250) NOT NULL,
  baseline_score VARCHAR(100),
  target_2025_26 VARCHAR(100),
  actual_2025_26 VARCHAR(100),
  target_baseline_2026_27 VARCHAR(100),
  target_2027_28 VARCHAR(100),
  current_achievement INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Approved',
  financial_year VARCHAR(50) DEFAULT '2025/2026',
  variance_comment TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO performance_kpis (id, code, category, parent_kpi_name, parent_kpi_code, category_weight, sub_kpi_weight, delivery_unit, programme, key_outputs, kpi_name, baseline_score, target_2025_26, actual_2025_26, target_baseline_2026_27, target_2027_28, current_achievement, status, financial_year, variance_comment) VALUES
(1, 'A-01', 'Financial Stewardship', 'Absorption of Exchequer Allocations', 'A', 10.00, 5.00, 'Directorate of Administration', 'General Administration & Planning', 'Budget absorption reports', 'Percentage absorption of development & recurrent votes', '88%', '100%', '92%', '100%', '100%', 92, 'Approved', '2025/2026', 'High absorption rate across major infrastructure projects.'),
(2, 'B-01', 'Service Delivery', 'UHC Primary Healthcare Network Rollout', 'B', 15.00, 7.50, 'Directorate for Family Health', 'UHC Programme', 'Operational PCNs established', 'Number of functional Primary Care Networks (PCNs) established', '210', '315', '290', '350', '400', 90, 'Approved', '2025/2026', 'Progress on track with county health departments.');

-- 8. MONTHLY KPI PROGRESS MODULE TABLE
CREATE TABLE monthly_kpi_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kpi_id INT NOT NULL,
  project_id INT,
  year_month VARCHAR(20) NOT NULL, -- e.g. '2026-01', '2026-02'
  progress_percentage INT NOT NULL,
  remarks TEXT,
  recorded_by VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (kpi_id) REFERENCES performance_kpis(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO monthly_kpi_progress (id, kpi_id, project_id, year_month, progress_percentage, remarks, recorded_by) VALUES
(1, 1, 1, '2026-01', 25, 'Initial mobilization and procurement of equipment.', 'Dr. Harry Kimtai'),
(2, 1, 1, '2026-02', 45, 'Installation of ICU monitoring telemetry systems.', 'Dr. Harry Kimtai'),
(3, 1, 1, '2026-03', 60, 'Staff training and calibration.', 'Dr. Harry Kimtai'),
(4, 1, 1, '2026-04', 70, 'Pre-commissioning safety audits.', 'Dr. Harry Kimtai'),
(5, 1, 1, '2026-05', 85, 'Final interior finishes and oxygen piping.', 'Dr. Harry Kimtai'),
(6, 1, 1, '2026-06', 95, 'Commissioning and handover ready.', 'Dr. Harry Kimtai');

-- 9. MEETINGS TABLE
CREATE TABLE meetings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  title VARCHAR(250) NOT NULL,
  description TEXT,
  financier VARCHAR(150),
  venue VARCHAR(150),
  attendees TEXT,
  agenda TEXT,
  decisions TEXT,
  document VARCHAR(250)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO meetings (id, date, title, description, financier, venue, attendees, agenda, decisions, document) VALUES
(1, '2026-02-10', 'World Bank Health Sector Support Review', 'Biannual review of IDA funded health infrastructure projects.', 'World Bank (IDA)', 'Afya House Boardroom A', 'PS-SDMS, World Bank Delegation, Director General', '1. UHC Digitization\n2. Equipment Maintenance', 'Agreed to disburse tranche 3 upon milestone verification.', 'WB_Health_Review_Feb_2026.pdf');

-- 10. ACTION POINTS TABLE
CREATE TABLE action_points (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ref_no VARCHAR(50) NOT NULL UNIQUE,
  date DATE NOT NULL,
  meeting_title VARCHAR(250),
  issue TEXT,
  person_responsible VARCHAR(150),
  timeline VARCHAR(100),
  status VARCHAR(50),
  action TEXT,
  resolution_notes TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO action_points (id, ref_no, date, meeting_title, issue, person_responsible, timeline, status, action, resolution_notes) VALUES
(1, 'AP-2026-001', '2026-02-12', 'World Bank Health Sector Support Review', 'Delay in county EHR fiber optic connectivity', 'Dr. Rose Njeru', '2026-03-30', 'ON TRACK', 'Engage ICT Authority for priority broadband allocation.', 'Fiber procurement underway with Telkom Kenya.');

-- 11. EVENTS TABLE
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(250) NOT NULL,
  description TEXT,
  event_type VARCHAR(100),
  event_date DATE,
  event_time VARCHAR(50),
  location VARCHAR(250),
  host VARCHAR(150),
  attendees TEXT,
  status VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO events (id, title, description, event_type, event_date, event_time, location, host, attendees, status) VALUES
(1, 'Commissioning of KNH Modern Burns ICU', 'Official ribbon-cutting and technical handover of the modernized Burns ICU at Kenyatta National Hospital.', 'Event', '2026-02-15', '09:30', 'Kenyatta National Hospital, Nairobi', 'Cabinet Secretary & PS-SDMS', 'Dr. Harry Kimtai, Dr. Evanson Kamuri, Parliamentary Committee', 'Upcoming');

-- 12. REPORTS TABLE
CREATE TABLE reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  report_code VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(250) NOT NULL,
  module VARCHAR(100),
  project_name VARCHAR(250),
  project_code VARCHAR(50),
  description TEXT,
  report_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  file_name VARCHAR(250),
  visibility VARCHAR(50) DEFAULT 'Public',
  status VARCHAR(50) DEFAULT 'Approved',
  uploaded_by VARCHAR(150)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO reports (id, report_code, title, module, project_name, project_code, description, report_date, file_name, visibility, status, uploaded_by) VALUES
(1, 'REP-2026-01', 'Q3 Performance Contract Progress Report', 'Performance Contract', 'National HIV/AIDS Control', 'PC-01', 'Comprehensive Q3 score report for State Department for Medical Services.', '2026-03-31', 'Q3_PC_Progress_Report_2026.pdf', 'Public', 'Approved', 'Dr. Harry Kimtai');

-- 13. AUDIT LOGS TABLE
CREATE TABLE audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  action_type VARCHAR(50) NOT NULL,
  module VARCHAR(100) NOT NULL,
  user_name VARCHAR(150) NOT NULL,
  user_role VARCHAR(100) NOT NULL,
  ip_address VARCHAR(50) DEFAULT '192.168.1.50',
  details TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO audit_logs (id, action_type, module, user_name, user_role, ip_address, details) VALUES
(1, 'LOGIN', 'Authentication', 'Dr. Harry Kimtai', 'Principal Secretary - SDMS', '192.168.1.10', 'Successful secure login via Ministry LDAP gateway.');

COMMIT;
