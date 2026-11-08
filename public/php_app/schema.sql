-- =========================================================================
-- STATE DEPARTMENT FOR MEDICAL SERVICES - PP-SDOMS
-- STANDALONE PHP & MYSQL DATABASE SCHEMA & DEMO DATA (cPANEL DEPLOYMENT)
-- FY 2026/27 Live Schema with Migration 002 Mock Data
-- =========================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS pending_changes;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS meetings;
DROP TABLE IF EXISTS action_points;
DROP TABLE IF EXISTS performance_kpis;
DROP TABLE IF EXISTS project_monthly_progress;
DROP TABLE IF EXISTS project_kpis;
DROP TABLE IF EXISTS sub_programmes;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS action_points;
DROP TABLE IF EXISTS meetings;
DROP TABLE IF EXISTS performance_contracts;
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
  last_login DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO users (id, full_name, email, role, directorate, is_active, can_upload, can_edit, can_approve, can_download, is_admin, last_login) VALUES
(1, 'Dr. Harry Kimtai', 'harry.kimtai@health.go.ke', 'Principal Secretary - SDMS', 'Executive Office', 1, 1, 1, 1, 1, 1, '2026-02-14 06:58:02'),
(2, 'Dr. Patrick Amoth', 'patrick.amoth@health.go.ke', 'Director General for Health', 'Directorate General', 1, 1, 1, 1, 1, 1, '2026-02-14 07:45:10'),
(3, 'Dr. Rose Njeru', 'rose.njeru@health.go.ke', 'Head of Health Informatics', 'Health Informatics Directorate', 1, 1, 1, 1, 1, 0, '2026-02-14 08:12:45'),
(4, 'CPA Evanson Kamuri', 'evanson.kamuri@knh.or.ke', 'Chief Executive Officer', 'Kenyatta National Hospital', 1, 1, 1, 0, 1, 0, '2026-02-14 07:45:10');

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
(4, 'KUTRRH', 'Kenyatta University Teaching, Referral & Research Hospital', 'Dr. Ahmed Dagane', 8200000000.00),
(8, 'JOOTRH', 'Jaramogi Oginga Odinga Teaching and Referral Hospital', 'Dr. Richard Olwande', 6500000000.00);

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
(4, 'DIR_HI', 'Health Informatics & Digital Health Directorate', 'Dr. Rose Njeru', 8500000000.00),
(5, 'DIR_NBTS', 'Directorate for Kenya National Blood Tissues & Transfusion Services', 'Dr. Winifred Ndagi', 4500000000.00);

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
  project_code VARCHAR(50) UNIQUE,
  programme_title VARCHAR(250) NOT NULL,
  sub_programme VARCHAR(250) NOT NULL,
  description TEXT,
  remarks TEXT,
  location VARCHAR(150),
  type VARCHAR(50) DEFAULT 'Project',
  category VARCHAR(50) DEFAULT 'Directorate',
  directorate_id INT,
  saga_id INT,
  division_id INT,
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
  progress_calculation_mode VARCHAR(50) DEFAULT 'manual',
  linked_sub_kpi_codes VARCHAR(255),
  milestones_completed INT DEFAULT 0,
  milestones_total INT DEFAULT 5,
  tasks_on_track INT DEFAULT 3,
  tasks_total INT DEFAULT 4,
  gantt_task_name VARCHAR(250),
  priority_tier VARCHAR(50) DEFAULT 'High',
  created_by INT DEFAULT 1,
  mock_2026_27 TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (flagship_id) REFERENCES flagships(id) ON DELETE SET NULL,
  FOREIGN KEY (directorate_id) REFERENCES directorates(id) ON DELETE SET NULL,
  FOREIGN KEY (saga_id) REFERENCES sagas(id) ON DELETE SET NULL,
  FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. PERFORMANCE CONTRACTS TABLE
CREATE TABLE performance_contracts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL,
  category_weight DECIMAL(5,2) DEFAULT 0.00,
  delivery_unit VARCHAR(150),
  programme VARCHAR(250),
  kpi_name VARCHAR(250) NOT NULL,
  target_baseline_2026_27 VARCHAR(100),
  baseline_score VARCHAR(100),
  actual_2025_26 VARCHAR(100),
  target_2025_26 VARCHAR(100),
  current_achievement INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Approved',
  financial_year VARCHAR(50) DEFAULT '2026/2027',
  actual_2026_27 VARCHAR(100) NULL,
  achievement_2026_27 INT NULL,
  actual_2026_27_asof DATE NULL,
  mock_2026_27 TINYINT(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO performance_contracts (id, code, category, category_weight, delivery_unit, programme, kpi_name, target_baseline_2026_27, baseline_score, actual_2025_26, target_2025_26, current_achievement, status, financial_year, actual_2026_27, achievement_2026_27, actual_2026_27_asof, mock_2026_27) VALUES
(1, 'A1', 'Financial Stewardship', 10.00, 'Directorate of Administration', 'General Administration & Planning', 'Percentage absorption of development & recurrent votes', '100%', '92%', '91%', '100%', 92, 'Approved', '2026/2027', '28.6', 29, '2026-09-30', 1),
(2, 'A3', 'Financial Stewardship', 10.00, 'Directorate of Administration', 'General Administration & Planning', 'Pending bills settlement ratio', '100%', '88%', '85%', '100%', 89, 'Approved', '2026/2027', '27.9', 28, '2026-09-30', 1),
(3, 'B1', 'Service Delivery', 15.00, 'Directorate for Family Health', 'UHC Programme', 'Number of functional Primary Care Networks (PCNs) established', '315', '260', '250', '300', 90, 'Approved', '2026/2027', '100', 100, '2026-09-30', 1),
(4, 'B2', 'Service Delivery', 15.00, 'Directorate for Family Health', 'UHC Programme', 'Citizen Charter compliance rate', '100%', '95%', '94%', '100%', 96, 'Approved', '2026/2027', '100', 100, '2026-09-30', 1),
(5, 'C1.1', 'Core Mandate', 65.00, 'Health Infrastructure & Referral', 'Specialized Referral Services', 'Specialized healthcare bed capacity and critical care expansion', '95%', '90%', '88%', '92%', 91, 'Approved', '2026/2027', NULL, NULL, NULL, 0),
(6, 'C1.2', 'Core Mandate', 65.00, 'Health Informatics & Digital Health', 'Digital Health', 'Afya Care UHC Digitization & EHR Coverage', '85%', '70%', '65%', '80%', 77, 'Approved', '2026/2027', NULL, NULL, NULL, 0),
(7, 'C3.1', 'Core Mandate', 65.00, 'Kenyatta National Hospital', 'Specialized Services', 'Heart and Cardiothoracic Surgeries Conducted', '300', '250', '240', '280', 91, 'Approved', '2026/2027', NULL, NULL, NULL, 0),
(8, 'C3.2', 'Core Mandate', 65.00, 'Moi Teaching and Referral Hospital', 'Transplant Services', 'Number of Kidney Transplants Conducted', '50', '40', '38', '45', 91, 'Approved', '2026/2027', NULL, NULL, NULL, 0),
(9, 'C4.1', 'Core Mandate', 65.00, 'Directorate for Family Health', 'NASCOP', 'Viral Load Suppression Rate', '95%', '94%', '93%', '95%', 94, 'Approved', '2026/2027', NULL, NULL, NULL, 0),
(10, 'C4.2', 'Core Mandate', 65.00, 'Directorate for Kenya National Blood Services', 'Blood Safety', 'Units of Whole Blood Collected and Screened', '450000', '400000', '390000', '420000', 88, 'Approved', '2026/2027', NULL, NULL, NULL, 0),
(11, 'D1', 'Implementation of Presidential Directives', 2.00, 'Executive Office', 'Presidential Flagship Delivery', 'Adherence to UHC & Afya Care presidential rollout milestones', '100%', '95%', '93%', '100%', 95, 'Approved', '2026/2027', '30.9', 31, '2026-09-30', 1),
(12, 'E1', 'Affirmative Action in Procurement', 4.00, 'Supply Chain Directorate', 'Procurement Stewardship', 'AGPO (Youth, Women, PWD) public procurement allocation ratio', '500381721', '30%', '31%', '30%', 95, 'Approved', '2026/2027', '119341420', 24, '2026-09-30', 1),
(13, 'F1', 'Cross - Cutting', 4.00, 'All Directorates', 'Cross-Cutting Operations', 'Clean audit reports, anti-corruption compliance and public service delivery', '100%', '90%', '88%', '100%', 90, 'Approved', '2026/2027', '100', 100, '2026-09-30', 1),
(14, 'F3', 'Cross - Cutting', 4.00, 'All Directorates', 'Institutional Capacity', 'Staff productivity and capacity building index', '90%', '82%', '80%', '88%', 85, 'Approved', '2026/2027', '21.7', 22, '2026-09-30', 1),
(15, 'F4', 'Cross - Cutting', 4.00, 'All Directorates', 'Monitoring & Evaluation', 'M&E quarterly reporting compliance rate', '100%', '95%', '92%', '100%', 96, 'Approved', '2026/2027', '96', 96, '2026-09-30', 1);

-- 8. SUB PROGRAMMES TABLE
CREATE TABLE sub_programmes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sp_code VARCHAR(50) NOT NULL UNIQUE,
  sp_name VARCHAR(250) NOT NULL,
  approved_budget_2026_27_m DECIMAL(15,2) NULL,
  actual_expenditure_ytd_2026_27_m DECIMAL(15,2) NULL,
  ytd_as_of DATE NULL,
  mock_2026_27 TINYINT(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO sub_programmes (id, sp_code, sp_name, approved_budget_2026_27_m, actual_expenditure_ytd_2026_27_m, ytd_as_of, mock_2026_27) VALUES
(1, 'SP.1.1', 'Curative Health Services Sub-Programme', 50607.00, 11042.00, '2026-09-30', 1),
(2, 'SP.1.2', 'Maternal and Child Health Sub-Programme', 3024.00, 766.00, '2026-09-30', 1),
(3, 'SP.1.3', 'Emergency Medical Services Sub-Programme', 874.00, 198.00, '2026-09-30', 1),
(4, 'SP.1.4', 'Specialized Referral Services Sub-Programme', 21618.00, 4523.00, '2026-09-30', 1),
(5, 'SP.2.1', 'Preventive & Promotive Health Sub-Programme', 5295.00, 1167.00, '2026-09-30', 1),
(6, 'SP.2.2', 'Immunization & Vaccine Logistics Sub-Programme', 1588.00, 433.00, '2026-09-30', 1),
(7, 'SP.2.3', 'Communicable Disease Control Sub-Programme', 5802.00, 1575.00, '2026-09-30', 1),
(8, 'SP.2.4', 'Non-Communicable Diseases Sub-Programme', 6596.00, 1718.00, '2026-09-30', 1),
(9, 'SP.3.1', 'Health Products & Technologies Sub-Programme', 3512.00, 718.00, '2026-09-30', 1),
(10, 'SP.3.2', 'Blood Transfusion Services Sub-Programme', 506.00, 127.00, '2026-09-30', 1),
(11, 'SP.4.1', 'Health Policy, Planning & M&E Sub-Programme', 3949.00, 971.00, '2026-09-30', 1),
(12, 'SP.4.2', 'Health Regulatory Services Sub-Programme', 91.00, 22.00, '2026-09-30', 1),
(13, 'SP.4.3', 'Digital Health & Health Informatics Sub-Programme', 30849.00, 8579.00, '2026-09-30', 1);

-- 9. PROJECT KPIS TABLE
CREATE TABLE project_kpis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kpi_code VARCHAR(50) NOT NULL UNIQUE,
  kpi_name VARCHAR(250) NOT NULL,
  actual_2026_27 DECIMAL(15,2) NULL,
  achievement_2026_27 INT NULL,
  actual_2026_27_asof DATE NULL,
  mock_2026_27 TINYINT(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO project_kpis (id, kpi_code, kpi_name, actual_2026_27, achievement_2026_27, actual_2026_27_asof, mock_2026_27) VALUES
(1, 'KNH-SSC-01', 'Cardiothoracic Procedures', 194.00, 25, '2026-09-30', 1),
(2, 'KNH-SSC-02', 'Neurosurgery Operations', 362.00, 24, '2026-09-30', 1),
(3, 'KNH-SSC-03', 'Renal Transplants', 5.00, 21, '2026-09-30', 1),
(4, 'KNH-SSC-04', 'Oncology Radiotherapy Sessions', 3187.00, 30, '2026-09-30', 1),
(5, 'KNH-SSC-05', 'ICU Patient Admissions', 180.00, 28, '2026-09-30', 1),
(6, 'KNH-SSC-06', 'Specialist Outpatient Visits', 11925.00, 25, '2026-09-30', 1),
(7, 'KNH-RES-01', 'Medical Research Papers Published', 1.00, 20, '2026-09-30', 1),
(8, 'KNH-WT-01', 'Theatre Equipment Uptime Rate', 41.10, 83, '2026-09-30', 1),
(9, 'KNH-WT-02', 'ICU Ventilator Availability Rate', 17.20, 96, '2026-09-30', 1),
(10, 'KNH-WT-03', 'Laboratory Reagent Stock Availability', 2.20, 91, '2026-09-30', 1),
(11, 'KNH-OUT-01', 'Patient Satisfaction Score Index', 112.00, 27, '2026-09-30', 1),
(12, 'JOOTRH-SSC-01', 'General Surgeries Conducted', 27.00, 27, '2026-09-30', 1),
(13, 'JOOTRH-SSC-02', 'Orthopedic Surgeries', 76.00, 24, '2026-09-30', 1),
(14, 'JOOTRH-SSC-03', 'Paediatric Ward Admissions', 34.00, 28, '2026-09-30', 1),
(15, 'JOOTRH-SSC-04', 'Maternal Deliveries Managed', 55.00, 22, '2026-09-30', 1),
(16, 'JOOTRH-SSC-05', 'Emergency Trauma Interventions', 124.00, 22, '2026-09-30', 1),
(17, 'JOOTRH-SSC-06', 'Dialysis Sessions Rendered', 45.00, 26, '2026-09-30', 1),
(18, 'JOOTRH-SSC-07', 'ICU / Critical Care Admissions', 37.00, 23, '2026-09-30', 1),
(19, 'JOOTRH-SSC-08', 'Blood Transfusion Units Issued', 196.00, 21, '2026-09-30', 1),
(20, 'JOOTRH-SSC-09', 'Radiology & X-Ray Scans', 27.00, 24, '2026-09-30', 1),
(21, 'JOOTRH-SSC-10', 'Physiotherapy & Rehabilitation', 760.00, 22, '2026-09-30', 1),
(22, 'JOOTRH-SSC-11', 'Outpatient Consultations', 34492.00, 23, '2026-09-30', 1),
(23, 'JOOTRH-SSC-12', 'Laboratory Diagnostic Tests', 2037.00, 30, '2026-09-30', 1),
(24, 'JOOTRH-SSC-13', 'Equipment Uptime Rate', 9.00, 89, '2026-09-30', 1),
(25, 'JOOTRH-RTT-01', 'Community Health Unit Linkages', 19.00, 21, '2026-09-30', 1),
(26, 'JOOTRH-RTT-02', 'Specialized Medical Camps', 1.00, 20, '2026-09-30', 1),
(27, 'JOOTRH-RTT-03', 'Continuous Medical Education (CME)', 45.00, 30, '2026-09-30', 1),
(28, 'JOOTRH-RTT-04', 'Referral Network Feedback Audits', 1.00, 25, '2026-09-30', 1),
(29, 'MNTRH-MH-01', 'Maternal Health Visits', 55144.00, 26, '2026-09-30', 1),
(30, 'MNTRH-MH-02', 'Skilled Birth Deliveries', 384.00, 30, '2026-09-30', 1),
(31, 'MNTRH-MH-03', 'Antenatal Care (ANC) 4th Visit', 1071.00, 30, '2026-09-30', 1),
(32, 'MNTRH-MH-04', 'Postnatal Care Consultations', 378.00, 27, '2026-09-30', 1),
(33, 'MNTRH-MH-05', 'Immunization Coverage (Fully Immunized)', 57521.00, 29, '2026-09-30', 1),
(34, 'MNTRH-MH-06', 'Newborn Resuscitation Success', 44.80, 100, '2026-09-30', 1),
(35, 'MNTRH-MH-07', 'Child Nutrition Screening & Support', 38.30, 84, '2026-09-30', 1),
(36, 'MNTRH-MH-08', 'Maternal Mortality Audit Compliance', 97.30, 97, '2026-09-30', 1),
(37, 'MNTRH-MH-09', 'EmONC Functional Facility Rate', 78.10, 92, '2026-09-30', 1),
(38, 'MNTRH-MH-10', 'Family Planning Acceptance Rate', 83.70, 98, '2026-09-30', 1),
(39, 'MNTRH-MH-11', 'Adolescent Reproductive Health Clinics', 1.00, 25, '2026-09-30', 1),
(40, 'MNTRH-MH-12', 'Community Health Promoters (CHP) Reports', 1.00, 25, '2026-09-30', 1),
(41, 'MNTRH-MH-13', 'Gynaecological Surgeries', 17.00, 26, '2026-09-30', 1),
(42, 'MNTRH-MH-14', 'Maternal Satisfaction Index', 74.00, 92, '2026-09-30', 1),
(43, 'MNTRH-INT-01', 'Integrated Outreach Health Services', 19100.00, 27, '2026-09-30', 1);

-- 10. INSERT 8 MOCK PROJECTS STARTING IN FY 2026/27
INSERT INTO projects (project_code, programme_title, sub_programme, description, remarks, location, type, category, directorate_id, saga_id, division_id, delivery_unit, flagship_id, start_date, end_date, status, progress_status, total_budget, funds_disbursed, funds_utilized, progress_calculation_mode, linked_sub_kpi_codes, milestones_completed, milestones_total, tasks_on_track, tasks_total, gantt_task_name, priority_tier, created_by, mock_2026_27) VALUES
('MOCK-2026-001', 'Kenyatta National Hospital Cardiothoracic Theatre Expansion', 'Kenyatta National Hospital Cardiothoracic Theatre Expansion', '[MOCK] Construction and equipping of two additional cardiothoracic theatres at KNH to reduce the surgical backlog.', 'On track; civil works at foundation stage.', 'Nairobi County', 'Project', 'Saga', NULL, 1, NULL, 'Kenyatta National Hospital', NULL, '2026-07-01', '2027-12-31', 'In Progress', '22%', 420000000, 168000000, 92000000, 'manual', 'C3.1', 1, 5, 2, 3, 'KNH cardiothoracic theatre expansion', 'High', 1, 1),
('MOCK-2026-002', 'JOOTRH Renal and Dialysis Centre Equipping', 'JOOTRH Renal and Dialysis Centre Equipping', '[MOCK] Procurement and installation of dialysis machines and water treatment plant at JOOTRH.', 'Equipment tender evaluated; delivery expected Q3.', 'Kisumu County', 'Project', 'Saga', NULL, 1, NULL, 'Kenyatta National Hospital', NULL, '2026-08-01', '2027-09-30', 'In Progress', '18%', 280000000, 112000000, 48000000, 'manual', 'C3.2', 1, 4, 2, 3, 'JOOTRH renal centre equipping', 'High', 1, 1),
('MOCK-2026-003', 'National Blood Transfusion Service Regional Centres Upgrade', 'National Blood Transfusion Service Regional Centres Upgrade', '[MOCK] Upgrade of regional blood transfusion centres: cold chain, testing equipment and donor facilities.', 'Delayed: procurement of cold chain equipment re-advertised.', 'Countrywide', 'Project', 'Directorate', 5, NULL, 5, 'Directorate for Kenya National Blood Tissues & Transfusion Services', NULL, '2026-07-01', '2028-06-30', 'Delayed', '12%', 310000000, 120000000, 31000000, 'manual', 'C4.2', 1, 5, 1, 3, 'NBTS regional centres upgrade', 'High', 1, 1),
('MOCK-2026-004', 'National EMS Ambulance Dispatch Centres', 'National EMS Ambulance Dispatch Centres', '[MOCK] Establishment of regional ambulance dispatch and coordination centres under the EMS flagship.', 'Site surveys complete in 6 counties.', 'Countrywide', 'Project', 'Directorate', 1, NULL, NULL, 'Directorate for Curative Services', NULL, '2026-09-01', '2027-12-31', 'In Progress', '15%', 600000000, 240000000, 70000000, 'manual', '', 1, 4, 3, 4, 'EMS dispatch centres setup', 'High', 1, 1),
('MOCK-2026-005', 'Primary Care Networks (PCN) Rollout Phase II', 'Primary Care Networks (PCN) Rollout Phase II', '[MOCK] Establishment of an additional 60 functional Primary Care Networks in partnership with county health departments.', 'Good uptake in 14 counties; staffing gaps in arid counties.', 'Various Counties', 'Project', 'Directorate', 2, NULL, 1, 'Division of Primary Health Care', NULL, '2026-07-01', '2028-06-30', 'In Progress', '28%', 520000000, 300000000, 140000000, 'manual', 'C1.1', 2, 5, 3, 4, 'PCN rollout phase II', 'High', 1, 1),
('MOCK-2026-006', 'Electronic Health Records Rollout to Level 5 Hospitals', 'Electronic Health Records Rollout to Level 5 Hospitals', '[MOCK] Deployment of the standardized EHR system to Level 5 referral hospitals under the UHC digitization flagship.', 'Go-live completed in 9 of 22 hospitals.', 'Countrywide', 'Project', 'Directorate', 4, NULL, 4, 'Division of Health Informatics and m-Health', 1, '2026-07-01', '2027-03-31', 'In Progress', '40%', 900000000, 540000000, 372000000, 'manual', 'C1.2', 2, 4, 3, 4, 'EHR rollout to Level 5 hospitals', 'Critical', 1, 1),
('MOCK-2026-007', 'National TB and Malaria Case Detection Scale-Up', 'National TB and Malaria Case Detection Scale-Up', '[MOCK] Expansion of community case finding, GeneXpert coverage and malaria rapid diagnostic testing.', 'Case notification trending upward.', 'Countrywide', 'Project', 'Directorate', 1, NULL, 3, 'Division of Disease Surveillance and Response', NULL, '2026-07-01', '2029-06-30', 'In Progress', '24%', 450000000, 180000000, 95000000, 'manual', '', 1, 4, 2, 3, 'TB and malaria case detection scale-up', 'Medium', 1, 1),
('MOCK-2026-008', 'National Health Research Data Repository', 'National Health Research Data Repository', '[MOCK] Establishment of a national repository for health research data and protocols.', 'Awaiting approval of concept note and budget release.', 'Nairobi County', 'Project', 'Directorate', 4, NULL, 4, 'Division of Health Informatics and m-Health', NULL, '2026-11-01', '2028-06-30', 'Planning', '0%', 150000000, 0, 0, 'manual', '', 0, 3, 0, 2, 'Health research data repository', 'Medium', 1, 1);

-- 11. MONTHLY KPI PERFORMANCE TABLE
CREATE TABLE project_monthly_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT,
  period_month VARCHAR(20) NOT NULL,
  target_pct DECIMAL(5,2) DEFAULT 0.00,
  achieved_pct DECIMAL(5,2) DEFAULT 0.00,
  kpi_code VARCHAR(50) NULL,
  kpi_name VARCHAR(250) NULL,
  kpi_target DECIMAL(15,2) NULL,
  kpi_achieved DECIMAL(15,2) NULL,
  kpi_unit VARCHAR(50) NULL,
  progress_percentage INT NOT NULL DEFAULT 0,
  remarks TEXT,
  recorded_by VARCHAR(150),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO project_monthly_progress (project_id, period_month, target_pct, achieved_pct, kpi_code, kpi_name, kpi_target, kpi_achieved, kpi_unit, progress_percentage, remarks, recorded_by) VALUES
((SELECT id FROM projects WHERE project_code='MOCK-2026-001' LIMIT 1), 'Jul 2026', 10, 8, 'C3.1', 'Heart and Cardiothoracic Surgeries Conducted', 71, 68, 'Surgeries', 8, '[MOCK] Site mobilization and contractor on site.', 'Dr. Harry Kimtai'),
((SELECT id FROM projects WHERE project_code='MOCK-2026-001' LIMIT 1), 'Aug 2026', 17, 15, 'C3.1', 'Heart and Cardiothoracic Surgeries Conducted', 142, 141, 'Surgeries', 15, '[MOCK] Excavation and piling works.', 'Dr. Harry Kimtai'),
((SELECT id FROM projects WHERE project_code='MOCK-2026-001' LIMIT 1), 'Sep 2026', 24, 22, 'C3.1', 'Heart and Cardiothoracic Surgeries Conducted', 213, 212, 'Surgeries', 22, '[MOCK] Foundation works under way.', 'Dr. Harry Kimtai'),
((SELECT id FROM projects WHERE project_code='MOCK-2026-002' LIMIT 1), 'Aug 2026', 8, 6, 'C3.2', 'Number of Kidney Transplants Conducted', 5, 4, 'Transplants', 6, '[MOCK] Equipment tender evaluated.', 'Dr. Harry Kimtai'),
((SELECT id FROM projects WHERE project_code='MOCK-2026-002' LIMIT 1), 'Sep 2026', 20, 18, 'C3.2', 'Number of Kidney Transplants Conducted', 8, 7, 'Transplants', 18, '[MOCK] Contract award; site preparation for water treatment plant.', 'Dr. Harry Kimtai'),
((SELECT id FROM projects WHERE project_code='MOCK-2026-003' LIMIT 1), 'Jul 2026', 8, 5, 'C4.2', 'Units of Whole Blood Collected and Screened', 33333, 30900, 'Units', 5, '[MOCK] Needs assessment of regional centres.', 'Dr. Harry Kimtai'),
((SELECT id FROM projects WHERE project_code='MOCK-2026-003' LIMIT 1), 'Aug 2026', 14, 8, 'C4.2', 'Units of Whole Blood Collected and Screened', 66667, 64200, 'Units', 8, '[MOCK] Cold chain tender re-advertised.', 'Dr. Harry Kimtai'),
((SELECT id FROM projects WHERE project_code='MOCK-2026-003' LIMIT 1), 'Sep 2026', 20, 12, 'C4.2', 'Units of Whole Blood Collected and Screened', 100000, 97500, 'Units', 12, '[MOCK] Procurement delay; donor facility designs approved.', 'Dr. Harry Kimtai'),
((SELECT id FROM projects WHERE project_code='MOCK-2026-004' LIMIT 1), 'Sep 2026', 16, 15, NULL, NULL, NULL, NULL, NULL, 15, '[MOCK] Site surveys complete in 6 counties.', 'Dr. Harry Kimtai'),
((SELECT id FROM projects WHERE project_code='MOCK-2026-005' LIMIT 1), 'Jul 2026', 10, 9, 'C1.1', 'Operationalization of Primary Care Networks (PCNs)', 26, 24, 'PCNs', 9, '[MOCK] County sensitization and facility readiness assessments.', 'Dr. Harry Kimtai'),
((SELECT id FROM projects WHERE project_code='MOCK-2026-005' LIMIT 1), 'Aug 2026', 20, 18, 'C1.1', 'Operationalization of Primary Care Networks (PCNs)', 53, 50, 'PCNs', 18, '[MOCK] Hub facilities designated in 9 counties.', 'Dr. Harry Kimtai'),
((SELECT id FROM projects WHERE project_code='MOCK-2026-005' LIMIT 1), 'Sep 2026', 30, 28, 'C1.1', 'Operationalization of Primary Care Networks (PCNs)', 79, 76, 'PCNs', 28, '[MOCK] Uptake in 14 counties; staffing gaps in arid counties.', 'Dr. Harry Kimtai'),
((SELECT id FROM projects WHERE project_code='MOCK-2026-006' LIMIT 1), 'Jul 2026', 12, 12, 'C1.2', 'Afya Care UHC Digitization & EHR Coverage', 70, 66, '% facilities', 12, '[MOCK] Hospital readiness assessments completed.', 'Dr. Harry Kimtai'),
((SELECT id FROM projects WHERE project_code='MOCK-2026-006' LIMIT 1), 'Aug 2026', 25, 26, 'C1.2', 'Afya Care UHC Digitization & EHR Coverage', 72, 68, '% facilities', 26, '[MOCK] Go-live in 5 hospitals.', 'Dr. Harry Kimtai'),
((SELECT id FROM projects WHERE project_code='MOCK-2026-006' LIMIT 1), 'Sep 2026', 38, 40, 'C1.2', 'Afya Care UHC Digitization & EHR Coverage', 74, 69.8, '% facilities', 40, '[MOCK] Go-live completed in 9 of 22 hospitals.', 'Dr. Harry Kimtai'),
((SELECT id FROM projects WHERE project_code='MOCK-2026-007' LIMIT 1), 'Jul 2026', 8, 7, NULL, NULL, NULL, NULL, NULL, 7, '[MOCK] Community case-finding teams trained.', 'Dr. Harry Kimtai'),
((SELECT id FROM projects WHERE project_code='MOCK-2026-007' LIMIT 1), 'Aug 2026', 16, 15, NULL, NULL, NULL, NULL, NULL, 15, '[MOCK] GeneXpert coverage extended to additional sub-counties.', 'Dr. Harry Kimtai'),
((SELECT id FROM projects WHERE project_code='MOCK-2026-007' LIMIT 1), 'Sep 2026', 25, 24, NULL, NULL, NULL, NULL, NULL, 24, '[MOCK] Case notification trending upward.', 'Dr. Harry Kimtai');

-- =========================================================================
-- 12. PERFORMANCE KPIs (Performance Contract sub-KPIs)
-- =========================================================================
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
  financial_year VARCHAR(50) DEFAULT '2026/2027',
  variance_comment TEXT,
  q1_score DECIMAL(5,2) NULL,
  q2_score DECIMAL(5,2) NULL,
  q3_score DECIMAL(5,2) NULL,
  q4_score DECIMAL(5,2) NULL,
  linked_project_ids VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO performance_kpis (code, category, parent_kpi_name, parent_kpi_code, category_weight, sub_kpi_weight, delivery_unit, programme, key_outputs, kpi_name, baseline_score, target_2025_26, actual_2025_26, target_baseline_2026_27, target_2027_28, current_achievement, status, financial_year) VALUES
('A1.1', 'Financial Stewardship', 'Financial Stewardship & Fiscal Discipline', 'A', 10.00, 5.00, 'Directorate of Administration', 'General Administration & Planning', 'Timely absorption of development and recurrent votes', 'Percentage absorption of development & recurrent votes', '92%', '100%', '91%', '100%', '100%', 92, 'Approved', '2026/2027'),
('A3.1', 'Financial Stewardship', 'Financial Stewardship & Fiscal Discipline', 'A', 10.00, 5.00, 'Directorate of Administration', 'General Administration & Planning', 'Reduction of pending bills', 'Pending bills settlement ratio', '88%', '100%', '85%', '100%', '100%', 89, 'Approved', '2026/2027'),
('B1.1', 'Service Delivery', 'Service Delivery Excellence', 'B', 15.00, 7.50, 'Directorate for Family Health', 'UHC Programme', 'Functional Primary Care Networks established', 'Number of functional Primary Care Networks (PCNs) established', '260', '300', '250', '315', '350', 90, 'Approved', '2026/2027'),
('B2.1', 'Service Delivery', 'Service Delivery Excellence', 'B', 15.00, 7.50, 'Directorate for Family Health', 'UHC Programme', 'Citizen charter compliance', 'Citizen Charter compliance rate', '95%', '100%', '94%', '100%', '100%', 96, 'Approved', '2026/2027'),
('C1.1', 'Core Mandate', 'Core Mandate Delivery', 'C', 65.00, 10.83, 'Health Infrastructure & Referral', 'Specialized Referral Services', 'Specialized healthcare bed capacity expanded', 'Specialized healthcare bed capacity and critical care expansion', '90%', '92%', '88%', '95%', '97%', 91, 'Approved', '2026/2027'),
('C1.2', 'Core Mandate', 'Core Mandate Delivery', 'C', 65.00, 10.83, 'Health Informatics & Digital Health', 'Digital Health', 'EHR deployment across facilities', 'Afya Care UHC Digitization & EHR Coverage', '70%', '80%', '65%', '85%', '95%', 77, 'Approved', '2026/2027'),
('C3.1', 'Core Mandate', 'Core Mandate Delivery', 'C', 65.00, 10.83, 'Kenyatta National Hospital', 'Specialized Services', 'Cardiothoracic surgeries conducted', 'Heart and Cardiothoracic Surgeries Conducted', '250', '280', '240', '300', '320', 91, 'Approved', '2026/2027'),
('C3.2', 'Core Mandate', 'Core Mandate Delivery', 'C', 65.00, 10.83, 'Moi Teaching and Referral Hospital', 'Transplant Services', 'Kidney transplants conducted', 'Number of Kidney Transplants Conducted', '40', '45', '38', '50', '55', 91, 'Approved', '2026/2027'),
('C4.1', 'Core Mandate', 'Core Mandate Delivery', 'C', 65.00, 10.83, 'Directorate for Family Health', 'NASCOP', 'Viral load suppression rate', 'Viral Load Suppression Rate', '94%', '95%', '93%', '95%', '96%', 94, 'Approved', '2026/2027'),
('C4.2', 'Core Mandate', 'Core Mandate Delivery', 'C', 65.00, 10.83, 'Directorate for Kenya National Blood Services', 'Blood Safety', 'Units of whole blood collected and screened', 'Units of Whole Blood Collected and Screened', '400000', '420000', '390000', '450000', '480000', 88, 'Approved', '2026/2027'),
('D1.1', 'Implementation of Presidential Directives', 'Presidential Directives', 'D', 2.00, 2.00, 'Executive Office', 'Presidential Flagship Delivery', 'UHC & Afya Care rollout milestones', 'Adherence to UHC & Afya Care presidential rollout milestones', '95%', '100%', '93%', '100%', '100%', 95, 'Approved', '2026/2027'),
('E1.1', 'Affirmative Action in Procurement', 'Affirmative Action', 'E', 4.00, 4.00, 'Supply Chain Directorate', 'Procurement Stewardship', 'AGPO procurement allocation', 'AGPO (Youth, Women, PWD) public procurement allocation ratio', '30%', '30%', '31%', '30%', '30%', 95, 'Approved', '2026/2027'),
('F1.1', 'Cross-Cutting', 'Cross-Cutting Operations', 'F', 4.00, 2.00, 'All Directorates', 'Cross-Cutting Operations', 'Clean audit reports and compliance', 'Clean audit reports, anti-corruption compliance and public service delivery', '90%', '100%', '88%', '100%', '100%', 90, 'Approved', '2026/2027'),
('F3.1', 'Cross-Cutting', 'Cross-Cutting Operations', 'F', 4.00, 1.00, 'All Directorates', 'Institutional Capacity', 'Staff productivity and capacity building', 'Staff productivity and capacity building index', '82%', '88%', '80%', '90%', '92%', 85, 'Approved', '2026/2027'),
('F4.1', 'Cross-Cutting', 'Cross-Cutting Operations', 'F', 4.00, 1.00, 'All Directorates', 'Monitoring & Evaluation', 'M&E quarterly reporting compliance', 'M&E quarterly reporting compliance rate', '95%', '100%', '92%', '100%', '100%', 96, 'Approved', '2026/2027');

-- =========================================================================
-- 13. ACTION POINTS
-- =========================================================================
CREATE TABLE action_points (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ref_no VARCHAR(50) NOT NULL UNIQUE,
  date DATE,
  meeting_title VARCHAR(250),
  issue TEXT,
  person_responsible VARCHAR(150),
  timeline VARCHAR(100),
  status VARCHAR(50) DEFAULT 'ON TRACK',
  action TEXT,
  resolution_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO action_points (ref_no, date, meeting_title, issue, person_responsible, timeline, status, action, resolution_notes) VALUES
('NASCOP-APT-202602', '2026-01-25', 'NASCOP Quarterly Review Meeting', 'Ensure procurement of viral load testing cartridges is expedited with Global Fund prior to stockout threshold.', 'Dr. Ruth Masha (NASCOP Lead)', '2 weeks', 'ON TRACK', 'Emergency procurement pipeline activated; 250,000 cartridges cleared at Port of Mombasa.', 'Distribution manifest signed with KEMSA logistics.'),
('APT-20260120-327', '2026-01-20', 'Kisumu Hospital Project Deliverables Meeting', 'Civil works delayed by 6 weeks due to contractor dispute on electrical sub-contracting.', 'Eng. Peter Mutua (Health Infrastructure)', '4 weeks', 'STALLED', 'Contract renegotiation meeting scheduled; legal review of sub-contract clause ongoing.', NULL),
('APT-010', '2026-01-18', 'Cancer Awareness & Radiotherapy Status Meeting', 'Bunker shielding certification for Garissa Regional Oncology Unit awaiting Kenya Nuclear Regulatory Authority clearance.', 'Dr. Mary Wangari', '3 weeks', 'ON TRACK', 'KNRA inspection scheduled for 05 Feb 2026.', NULL),
('APT-009', '2026-01-12', 'KNH Burns ICU Equipment Handover', 'Hyperbaric chamber technical installation manuals require manufacturer engineer sign-off.', 'Dr. Evans Kimani', 'Completed', 'COMPLETED', 'Manufacturer engineer completed sign-off on 20 Jan 2026; equipment commissioned.', 'Handover certificate issued.'),
('APT-008', '2026-01-05', 'KEMSA Supply Chain Overhaul Steering Committee', 'Integration between KEMSA ERP and County Government Health Management Information Systems (HMIS).', 'Dr. Joseph Mburu', '6 weeks', 'ON TRACK', 'API integration specification finalized; pilot in 3 counties underway.', NULL);

-- =========================================================================
-- 14. MEETINGS
-- =========================================================================
CREATE TABLE meetings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE,
  title VARCHAR(250) NOT NULL,
  description TEXT,
  financier VARCHAR(150),
  venue VARCHAR(150),
  attendees TEXT,
  agenda TEXT,
  decisions TEXT,
  document VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO meetings (date, title, description, financier, venue, attendees, agenda, decisions, document) VALUES
('2026-01-25', 'NASCOP Quarterly Review Meeting', 'Quarterly review of HIV/AIDS programme performance and commodity security.', 'Global Fund', 'NASCOP Boardroom, Nairobi', 'Dr. Ruth Masha, Dr. Harry Kimtai, Programme Officers', 'Commodity security; viral load coverage; ART uptake', 'Expedite cartridge procurement; expand viral load sites', 'NASCOP_Q1_2026_Minutes.pdf'),
('2026-01-20', 'Kisumu Hospital Project Deliverables Meeting', 'Review of JOOTRH renal centre construction deliverables.', 'World Bank', 'JOOTRH, Kisumu', 'Eng. Peter Mutua, County Health Team', 'Civil works progress; equipment delivery', 'Resolve contractor dispute; fast-track electrical works', 'Kisumu_Deliverables_Jan2026.pdf'),
('2026-01-12', 'KNH Burns ICU Equipment Handover', 'Handover of burns ICU and hyperbaric equipment.', 'Ministry of Health', 'KNH, Nairobi', 'Dr. Evans Kimani, KNH Biomedical Team', 'Equipment commissioning; training', 'Equipment accepted; staff training scheduled', 'KNH_BurnsICU_Handover.pdf');

-- =========================================================================
-- 15. EVENTS
-- =========================================================================
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(250) NOT NULL,
  description TEXT,
  event_type VARCHAR(100),
  event_date DATE,
  event_time VARCHAR(50),
  location VARCHAR(150),
  host VARCHAR(150),
  attendees TEXT,
  status VARCHAR(50) DEFAULT 'Upcoming',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO events (title, description, event_type, event_date, event_time, location, host, attendees, status) VALUES
('National UHC Launch - Phase II Counties', 'Rollout of Universal Health Coverage to 12 additional counties.', 'Launch', '2026-03-01', '09:00', 'Nairobi', 'State Department for Medical Services', 'County Governors, Partners', 'Upcoming'),
('Afya Care EHR Go-Live - Level 5 Hospitals', 'Go-live of EHR system in 9 Level 5 hospitals.', 'Milestone', '2026-02-20', '08:00', 'Countrywide', 'Health Informatics Directorate', 'Hospital CEOs, ICT Officers', 'Upcoming'),
('Quarterly Performance Contract Review', 'Q3 performance contract review with all delivery units.', 'Review', '2026-04-15', '10:00', 'Afya House, Nairobi', 'Principal Secretary', 'All Directors, M&E Officers', 'Upcoming');

-- =========================================================================
-- 16. REPORTS
-- =========================================================================
CREATE TABLE reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  report_code VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(250) NOT NULL,
  module VARCHAR(100),
  project_name VARCHAR(250),
  project_code VARCHAR(50),
  description TEXT,
  report_date DATE,
  file_name VARCHAR(255),
  visibility VARCHAR(50) DEFAULT 'Public',
  status VARCHAR(50) DEFAULT 'Pending',
  uploaded_by VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO reports (report_code, title, module, project_name, project_code, description, report_date, file_name, visibility, status, uploaded_by) VALUES
('RPT-2026-001', 'Q1 FY2026/27 Performance Report', 'Performance Contract', 'All Programmes', NULL, 'Quarterly performance contract progress report.', '2026-01-15', 'Q1_Performance_Report.pdf', 'Public', 'Approved', 'Dr. Rose Njeru'),
('RPT-2026-002', 'KNH Cardiothoracic Theatre Progress', 'Projects', 'KNH Cardiothoracic Theatre Expansion', 'MOCK-2026-001', 'Construction progress report for cardiothoracic theatres.', '2026-01-20', 'KNH_Cardio_Progress.pdf', 'Restricted', 'Approved', 'Eng. Peter Mutua'),
('RPT-2026-003', 'NASCOP Commodity Security Report', 'Projects', 'NASCOP Programme', NULL, 'Viral load cartridge stock and procurement status.', '2026-01-25', 'NASCOP_Commodity.pdf', 'Restricted', 'Pending', 'Dr. Ruth Masha');

-- =========================================================================
-- 17. AUDIT LOGS
-- =========================================================================
CREATE TABLE audit_logs (
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

INSERT INTO audit_logs (user_name, email, action, module, record_id, details, ip_address, timestamp) VALUES
('Dr. Rose Njeru', 'rose.njeru@health.go.ke', 'login', 'Authentication', NULL, 'User logged in successfully.', '196.201.214.18', '2026-02-14 08:12:45'),
('Dr. Rose Njeru', 'rose.njeru@health.go.ke', 'update', 'Finance Records', '1', 'Updated financing for KNH Cardiothoracic Theatre: Allocated 420.00M, Disbursed 168.00M, Utilised 92.00M, Outstanding 328.00M', '196.201.214.18', '2026-02-14 08:05:10'),
('Eng. Peter Mutua', 'peter.mutua@health.go.ke', 'update', 'Action Points Tracker', '1', 'Change requested on NASCOP-APT-202602: Status "ON TRACK" -> "COMPLETED". Reason: All deliverables verified. Status: PENDING APPROVAL.', '196.201.214.20', '2026-02-14 08:02:11'),
('Dr. Harry Kimtai', 'harry.kimtai@health.go.ke', 'approve', 'Action Points Tracker', '1', 'Approved change on NASCOP-APT-202602. Approved by Dr. Harry Kimtai (PS-SDMS).', '196.201.214.15', '2026-02-14 07:58:02'),
('Dr. Rose Njeru', 'rose.njeru@health.go.ke', 'create', 'Users', '5', 'New user account created: Faith Chebet (M&E Officer).', '196.201.214.18', '2026-02-13 16:30:00'),
('System', 'system@health.go.ke', 'backup', 'System', NULL, 'Nightly database backup completed successfully.', '127.0.0.1', '2026-02-14 02:00:00');

-- =========================================================================
-- 18. NOTIFICATIONS (enhanced notification module)
-- =========================================================================
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(250) NOT NULL,
  message TEXT,
  module VARCHAR(100),
  severity VARCHAR(50) DEFAULT 'info',
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  related_log_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO notifications (title, message, module, severity, is_read, related_log_id, created_at) VALUES
('Action change pending approval', 'Eng. Peter Mutua requested a change to NASCOP-APT-202602 (Status: ON TRACK -> COMPLETED). Reason: All deliverables verified.', 'Action Points Tracker', 'approval', 0, 3, '2026-02-14 08:02:11'),
('Finance figures updated', 'Budget allocation and disbursement for KNH Cardiothoracic Theatre were updated.', 'Finance Records', 'info', 0, 2, '2026-02-14 08:05:10'),
('Performance Contract indicator reviewed', 'Sub-KPI C3.1 achievement was reviewed and updated.', 'Performance Contract', 'info', 1, NULL, '2026-02-13 14:20:00'),
('New user account created', 'A new M&E Officer account was created for Faith Chebet.', 'Users', 'success', 1, 5, '2026-02-13 16:30:00'),
('Nightly database backup completed', 'The scheduled MySQL backup completed successfully.', 'System', 'success', 1, 6, '2026-02-14 02:00:00');

-- =========================================================================
-- 19. PENDING CHANGES (action change approval workflow)
-- =========================================================================
CREATE TABLE pending_changes (
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

INSERT INTO pending_changes (action_id, ref_no, field, old_value, new_value, reason, requested_by, requested_at, status, approved_by, approved_at) VALUES
(1, 'NASCOP-APT-202602', 'Status', 'ON TRACK', 'COMPLETED', 'All deliverables for the KNH Burns ICU commissioning were verified and handed over.', 'Eng. Peter Mutua', '2026-02-14 08:02:11', 'Pending', NULL, NULL);

-- =========================================================================
-- END OF SCHEMA
-- =========================================================================
SET FOREIGN_KEY_CHECKS = 1;
