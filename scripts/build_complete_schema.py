#!/usr/bin/env python3
"""Build a complete, self-contained PP-SDOMS MySQL schema from the partial schema.sql.

Adds:
  - users.last_login column + values
  - Missing tables that were dropped but never created:
      performance_kpis, action_points, meetings, events, reports, audit_logs
  - New tables for the enhanced notification/approval workflow:
      notifications, pending_changes
"""
import re
import pathlib

SRC = pathlib.Path("public/database/schema.sql")
OUT = pathlib.Path("public/database/pp_sdoms_complete_schema.sql")

sql = SRC.read_text(encoding="utf-8")

# ---------------------------------------------------------------------------
# 1. Add last_login to users table definition
# ---------------------------------------------------------------------------
sql = sql.replace(
    "  is_admin BOOLEAN DEFAULT FALSE,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    "  is_admin BOOLEAN DEFAULT FALSE,\n  last_login DATETIME NULL,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
)

# 2. Add last_login values to the users INSERT
sql = sql.replace(
    "INSERT INTO users (id, full_name, email, role, directorate, is_active, can_upload, can_edit, can_approve, can_download, is_admin) VALUES\n"
    "(1, 'Dr. Harry Kimtai', 'harry.kimtai@health.go.ke', 'Principal Secretary - SDMS', 'Executive Office', 1, 1, 1, 1, 1, 1),\n"
    "(2, 'Dr. Patrick Amoth', 'patrick.amoth@health.go.ke', 'Director General for Health', 'Directorate General', 1, 1, 1, 1, 1, 1),\n"
    "(3, 'Dr. Rose Njeru', 'rose.njeru@health.go.ke', 'Head of Health Informatics', 'Health Informatics Directorate', 1, 1, 1, 1, 1, 0),\n"
    "(4, 'CPA Evanson Kamuri', 'evanson.kamuri@knh.or.ke', 'Chief Executive Officer', 'Kenyatta National Hospital', 1, 1, 1, 0, 1, 0);",
    "INSERT INTO users (id, full_name, email, role, directorate, is_active, can_upload, can_edit, can_approve, can_download, is_admin, last_login) VALUES\n"
    "(1, 'Dr. Harry Kimtai', 'harry.kimtai@health.go.ke', 'Principal Secretary - SDMS', 'Executive Office', 1, 1, 1, 1, 1, 1, '2026-02-14 06:58:02'),\n"
    "(2, 'Dr. Patrick Amoth', 'patrick.amoth@health.go.ke', 'Director General for Health', 'Directorate General', 1, 1, 1, 1, 1, 1, '2026-02-14 07:45:10'),\n"
    "(3, 'Dr. Rose Njeru', 'rose.njeru@health.go.ke', 'Head of Health Informatics', 'Health Informatics Directorate', 1, 1, 1, 1, 1, 0, '2026-02-14 08:12:45'),\n"
    "(4, 'CPA Evanson Kamuri', 'evanson.kamuri@knh.or.ke', 'Chief Executive Officer', 'Kenyatta National Hospital', 1, 1, 1, 0, 1, 0, '2026-02-14 07:45:10');",
)

# 2b. Fix projects INSERT: sub_programme is NOT NULL but was omitted
sql = sql.replace(
    "INSERT INTO projects (project_code, programme_title, description,",
    "INSERT INTO projects (project_code, programme_title, sub_programme, description,",
)
sql = re.sub(
    r"\('(MOCK-2026-\d+)', '([^']*)', ",
    lambda m: f"('{m.group(1)}', '{m.group(2)}', '{m.group(2)}', ",
    sql,
)

# 3. Add DROP statements for new tables at the top block
sql = sql.replace(
    "DROP TABLE IF EXISTS project_monthly_progress;",
    "DROP TABLE IF EXISTS pending_changes;\nDROP TABLE IF EXISTS notifications;\nDROP TABLE IF EXISTS audit_logs;\nDROP TABLE IF EXISTS reports;\nDROP TABLE IF EXISTS events;\nDROP TABLE IF EXISTS meetings;\nDROP TABLE IF EXISTS action_points;\nDROP TABLE IF EXISTS performance_kpis;\nDROP TABLE IF EXISTS project_monthly_progress;",
)

# ---------------------------------------------------------------------------
# 4. Append the missing + new tables
# ---------------------------------------------------------------------------
EXTRA = r"""

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
"""

sql = sql.rstrip() + EXTRA
OUT.write_text(sql, encoding="utf-8")
print(f"Wrote {OUT} ({len(sql)} bytes)")
