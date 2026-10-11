-- =========================================================================
-- STATE DEPARTMENT FOR MEDICAL SERVICES - PP-SDOMS
-- STANDALONE PHP & MYSQL DATABASE SCHEMA (cPANEL DEPLOYMENT)
-- =========================================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS monthly_kpi_progress;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS action_points;
DROP TABLE IF EXISTS meetings;
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
(4, 'CPA Evanson Kamuri', 'evanson.kamuri@knh.or.ke', 'Chief Executive Officer', 'Kenyatta National Hospital', 1, 1, 1, 0, 1, 0);

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
(4, 'KUTRRH', 'Kenyatta University Teaching, Referral & Research Hospital', 'Dr. Ahmed Dagane', 8200000000.00);

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
  priority_tier VARCHAR(50),
  allocated_budget DECIMAL(15,2),
  utilized_budget DECIMAL(15,2),
  lead_officer VARCHAR(150),
  team_name VARCHAR(150),
  start_date DATE,
  target_date DATE,
  status VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO flagships (id, title, description, lead_directorate, progress_pct, priority_tier, allocated_budget, utilized_budget, lead_officer, team_name, start_date, target_date, status) VALUES
(1, 'Afya Care UHC Digitization & Electronic Health Records (EHR)', 'Deployment of standardized enterprise EHR software across Level 4, 5, and 6 referral facilities in all 47 counties.', 'Health Informatics & Digital Health', 68, 'Critical', 4500000000.00, 3120000000.00, 'Dr. Rose Njeru', 'UHC Digital Steering Taskforce', '2024-07-01', '2026-12-31', 'In Progress'),
(2, 'National Emergency Medical Services & Critical Care Fund (EMS)', 'Institutionalization of ambulance network and critical trauma care fund.', 'Emergency Medical Care Directorate', 42, 'High', 2800000000.00, 1190000000.00, 'Dr. Evans Kimani', 'EMS National Board', '2024-09-01', '2027-06-30', 'In Progress');

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
  gantt_task_name VARCHAR(250),
  FOREIGN KEY (flagship_id) REFERENCES flagships(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO projects (id, programme_title, sub_programme, description, remarks, category, directorate_name, saga_name, division_name, delivery_unit, flagship_id, start_date, end_date, status, progress_status, total_budget, funds_disbursed, funds_utilized, gantt_task_name) VALUES
(1, 'Specialized Regional Cancer & Clinical Infrastructure Programme', 'Kenyatta National Hospital (KNH) Modern Burns ICU & Plastic Surgery Center', 'State-of-the-art 82-bed specialized burns unit with hyperbaric chambers and dedicated surgical suites.', 'Mechanical and medical gas piping ongoing; theaters undergoing validation.', 'Saga', NULL, 'Kenyatta National Hospital', NULL, 'Kenyatta National Hospital', 1, '2024-02-01', '2026-08-31', 'In Progress', '91%', 2850000000.00, 2350000000.00, 2180000000.00, 'KNH Burns Unit & ICU Modernization'),
(2, 'Specialized Regional Cancer & Clinical Infrastructure Programme', 'Moi Teaching and Referral Hospital (MTRH) 62-Bed Multi-Organ Transplant Center', 'Specialized organ harvesting, kidney and liver transplant suites with tissue matching labs.', 'Structural works completed; clean room HVAC testing commenced.', 'Saga', NULL, 'Moi Teaching and Referral Hospital', NULL, 'Moi Teaching & Referral Hospital', 1, '2023-09-15', '2026-12-15', 'In Progress', '91%', 3400000000.00, 2700000000.00, 2510000000.00, 'MTRH Transplant Center');

-- 7. PERFORMANCE KPIS TABLE (6 Categories A-F summing to 100)
CREATE TABLE performance_kpis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL,
  category_weight DECIMAL(5,2) DEFAULT 0.00,
  delivery_unit VARCHAR(150),
  programme VARCHAR(250),
  kpi_name VARCHAR(250) NOT NULL,
  target_score VARCHAR(100),
  actual_score VARCHAR(100),
  current_achievement INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Approved',
  financial_year VARCHAR(50) DEFAULT '2026/2027'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO performance_kpis (id, code, category, category_weight, delivery_unit, programme, kpi_name, target_score, actual_score, current_achievement, status, financial_year) VALUES
(1, 'A-01', 'Financial Stewardship', 10.00, 'Directorate of Administration', 'General Administration & Planning', 'Percentage absorption of development & recurrent votes', '100%', '92%', 92, 'Approved', '2026/2027'),
(2, 'B-01', 'Service Delivery', 15.00, 'Directorate for Family Health', 'UHC Programme', 'Number of functional Primary Care Networks (PCNs) established', '315', '290', 90, 'Approved', '2026/2027'),
(3, 'C-01', 'Core Mandate', 65.00, 'Health Infrastructure & Referral', 'Specialized Referral Services', 'Specialized healthcare bed capacity and critical care expansion', '95%', '91%', 91, 'Approved', '2026/2027'),
(4, 'D-01', 'Implementation of Presidential Directives', 2.00, 'Executive Office', 'Presidential Flagship Delivery', 'Adherence to UHC & Afya Care presidential rollout milestones', '100%', '95%', 95, 'Approved', '2026/2027'),
(5, 'E-01', 'Affirmative Action in Procurement', 4.00, 'Supply Chain Directorate', 'Procurement Stewardship', 'AGPO (Youth, Women, PWD) public procurement allocation ratio', '30%', '32%', 95, 'Approved', '2026/2027'),
(6, 'F-01', 'Cross - Cutting', 4.00, 'All Directorates', 'Cross-Cutting Operations', 'Clean audit reports, anti-corruption compliance and public service delivery', '100%', '90%', 90, 'Approved', '2026/2027');

-- 8. MONTHLY KPI PROGRESS TABLE (6 Months Demo Data)
CREATE TABLE monthly_kpi_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT,
  period_month VARCHAR(20) NOT NULL,
  progress_percentage INT NOT NULL,
  remarks TEXT,
  recorded_by VARCHAR(150),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO monthly_kpi_progress (id, project_id, period_month, progress_percentage, remarks, recorded_by) VALUES
(1, 1, '2026-01', 70, 'Initial civil and mechanical groundwork.', 'Dr. Harry Kimtai'),
(2, 1, '2026-02', 76, 'Medical gas piping and surgical theater framing.', 'Dr. Harry Kimtai'),
(3, 1, '2026-03', 82, 'Installation of ICU monitoring telemetry systems.', 'Dr. Harry Kimtai'),
(4, 1, '2026-04', 87, 'Staff training and biomedical calibration.', 'Dr. Harry Kimtai'),
(5, 1, '2026-05', 90, 'Pre-commissioning safety audits.', 'Dr. Harry Kimtai'),
(6, 1, '2026-06', 91, 'Commissioning and handover ready.', 'Dr. Harry Kimtai');
