-- =========================================================================
-- MIGRATION 001: PROJECTS & KPIs MODULE ENRICHMENT
-- State Department for Medical Services (Vote 1082) - PP-SDOMS
-- Sources: MOH_PROJECTS_and_PROGRAMMES.xlsx, KPI_s_and_SUB_KPI_s.xlsx
--
-- Run AFTER schema.sql. Safe to re-run (idempotent).
-- Budget figures are KSh MILLIONS. Performance Contract KPIs are remapped
-- from the 2023/24 sheet to FY 2025/26 (see section 4).
-- NOTE: schema.sql drops tables on re-import. If you re-run schema.sql,
-- run this migration again afterwards (or merge the new tables into it).
-- =========================================================================

SET NAMES utf8mb4;

-- -------------------------------------------------------------------------
-- 0. HELPER: add a column only if it does not already exist
--    (works on both MySQL and MariaDB)
-- -------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS add_col_if_missing;
DELIMITER $$
CREATE PROCEDURE add_col_if_missing(IN tbl VARCHAR(64), IN col VARCHAR(64), IN def VARCHAR(255))
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS
                 WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = tbl AND COLUMN_NAME = col) THEN
    SET @ddl = CONCAT('ALTER TABLE `', tbl, '` ADD COLUMN `', col, '` ', def);
    PREPARE st FROM @ddl;
    EXECUTE st;
    DEALLOCATE PREPARE st;
  END IF;
END$$
DELIMITER ;

-- -------------------------------------------------------------------------
-- 1. NEW TABLES
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS programmes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  programme_code VARCHAR(20) NOT NULL UNIQUE,
  programme_name VARCHAR(250) NOT NULL,
  programme_outcome TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sub_programmes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  programme_id INT NOT NULL,
  sp_code VARCHAR(20) NOT NULL UNIQUE,
  sp_name VARCHAR(250) NOT NULL,
  approved_budget_2025_26_m DECIMAL(15,2),
  actual_expenditure_2025_26_m DECIMAL(15,2),
  baseline_2026_27_m DECIMAL(15,2),
  estimate_2027_28_m DECIMAL(15,2) NULL,
  estimate_2028_29_m DECIMAL(15,2) NULL,
  estimate_2029_30_m DECIMAL(15,2) NULL,
  FOREIGN KEY (programme_id) REFERENCES programmes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Delivery-unit (SAGA / directorate) KPIs with six-year targets
-- (the 'project_kpis' table dropped in schema.sql but never created)
CREATE TABLE IF NOT EXISTS project_kpis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kpi_code VARCHAR(40) NOT NULL UNIQUE,
  sub_programme_id INT,
  saga_id INT,
  project_id INT,
  delivery_unit VARCHAR(150),
  key_output VARCHAR(250),
  kpi_name VARCHAR(300) NOT NULL,
  unit VARCHAR(30),
  direction VARCHAR(20) DEFAULT 'HIGHER_BETTER',  -- or LOWER_BETTER
  target_2025_26 DECIMAL(15,2) NULL,
  actual_2025_26 DECIMAL(15,2) NULL,
  target_baseline_2026_27 DECIMAL(15,2) NULL,
  target_2027_28 DECIMAL(15,2) NULL,
  target_2028_29 DECIMAL(15,2) NULL,
  target_2029_30 DECIMAL(15,2) NULL,
  file_name VARCHAR(250),
  updated_by VARCHAR(150),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sub_programme_id) REFERENCES sub_programmes(id) ON DELETE SET NULL,
  FOREIGN KEY (saga_id) REFERENCES sagas(id) ON DELETE SET NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------------------
-- 2. ALTER EXISTING TABLES
-- -------------------------------------------------------------------------
CALL add_col_if_missing('performance_kpis', 'target_2028_29', 'VARCHAR(100) NULL');
CALL add_col_if_missing('performance_kpis', 'target_2029_30', 'VARCHAR(100) NULL');
CALL add_col_if_missing('performance_kpis', 'unit', 'VARCHAR(30) NULL');
CALL add_col_if_missing('performance_kpis', 'direction', "VARCHAR(20) DEFAULT 'HIGHER_BETTER'");
CALL add_col_if_missing('projects', 'programme_id', 'INT NULL');
CALL add_col_if_missing('projects', 'sub_programme_id', 'INT NULL');

DROP PROCEDURE IF EXISTS add_col_if_missing;

START TRANSACTION;

-- -------------------------------------------------------------------------
-- 3. PROGRAMMES & SUB-PROGRAMMES (Vote 1082, KSh millions)
-- -------------------------------------------------------------------------

INSERT INTO programmes (programme_code, programme_name, programme_outcome) VALUES
('P1', 'National Referral Facilities and Specialized Services', 'Increased access and range of quality specialized health care services'),
('P2', 'Curative and RMNCAH', NULL),
('P3', 'Health Research and Innovations', NULL),
('P4', 'General Administration, Planning and Support Services', NULL)
ON DUPLICATE KEY UPDATE programme_name=VALUES(programme_name), programme_outcome=VALUES(programme_outcome);

INSERT INTO sub_programmes (programme_id, sp_code, sp_name, approved_budget_2025_26_m, actual_expenditure_2025_26_m, baseline_2026_27_m) VALUES
((SELECT id FROM programmes WHERE programme_code='P1'), 'SP.1.1', 'National Referral Services', 48895, 48682, 49867),
((SELECT id FROM programmes WHERE programme_code='P1'), 'SP.1.2', 'Health Infrastructure and Equipment', 4107, 3847, 2971),
((SELECT id FROM programmes WHERE programme_code='P1'), 'SP.1.3', 'National Blood Transfusion Service', 1153, 1120, 853),
((SELECT id FROM programmes WHERE programme_code='P1'), 'SP.1.4', 'Health Products and Technologies', 5638, 5618, 21908),
((SELECT id FROM programmes WHERE programme_code='P2'), 'SP.2.1', 'Communicable disease prevention & control', 8626, 8188, 5222),
((SELECT id FROM programmes WHERE programme_code='P2'), 'SP.2.2', 'Non-Communicable Disease Control', 763, 721, 1558),
((SELECT id FROM programmes WHERE programme_code='P2'), 'SP.2.3', 'Reproductive Maternal and Newborn Child and Adolescent Health', 4754, 4295, 5740),
((SELECT id FROM programmes WHERE programme_code='P2'), 'SP.2.4', 'Immunization Management', 15598, 12961, 6426),
((SELECT id FROM programmes WHERE programme_code='P3'), 'SP.3.1', 'Medical Research', 2949, 2949, 3397),
((SELECT id FROM programmes WHERE programme_code='P3'), 'SP.3.2', 'Health Innovations', 384, 384, 512),
((SELECT id FROM programmes WHERE programme_code='P4'), 'SP.4.1', 'General Administration & Human Resource Management', 3002, 2953, 3977),
((SELECT id FROM programmes WHERE programme_code='P4'), 'SP.4.2', 'Finance and Planning', 62, 59, 89),
((SELECT id FROM programmes WHERE programme_code='P4'), 'SP.4.3', 'Social Protection in Health', 31264, 31285, 30898)
ON DUPLICATE KEY UPDATE sp_name=VALUES(sp_name), approved_budget_2025_26_m=VALUES(approved_budget_2025_26_m),
  actual_expenditure_2025_26_m=VALUES(actual_expenditure_2025_26_m), baseline_2026_27_m=VALUES(baseline_2026_27_m);

-- Delivery units that appear in the workbook but not in sagas
INSERT INTO sagas (saga_code, saga_name, head_name, budget_allocated) VALUES
('JOOTRH', 'Jaramogi Oginga Odinga Teaching and Referral Hospital', NULL, NULL),
('MNTRH', 'Mathari National Teaching and Referral Hospital', NULL, NULL)
ON DUPLICATE KEY UPDATE saga_name=VALUES(saga_name);

-- -------------------------------------------------------------------------
-- 4. PERFORMANCE CONTRACT KPIs - REMAPPED TO FY 2025/26
--    Source sheet is labelled 2023/24 (Previous Year / Target Year).
--    Remap rule: baseline_score = previous-year value,
--                target_2025_26  = target-year value carried forward,
--                actual_2025_26  = NULL (not in source), achievement = 0.
--    'N/A' in the source is stored as NULL.
--    Weights stored exactly as in the source (sub-KPI weights sum to 98, not 100:
--    category E is weighted 4 but its only sub-KPI E1 is weighted 2).
--    A2 baseline fixed from malformed '12924100000.0 0' to 12924100000.00.
-- -------------------------------------------------------------------------
INSERT INTO performance_kpis (code, category, parent_kpi_name, parent_kpi_code, category_weight, sub_kpi_weight, kpi_name, unit, direction, baseline_score, target_2025_26, actual_2025_26, current_achievement, status, financial_year, variance_comment) VALUES
('A1', 'Financial Stewardship', 'Financial Stewardship', 'A', 10, 2, 'Absorption of Allocated Funds (GoK)', '%', 'HIGHER_BETTER', '96.94', '100', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('A2', 'Financial Stewardship', 'Financial Stewardship', 'A', 10, 2, 'Appropriation-in-Aid', 'KSh', 'HIGHER_BETTER', '12924100000.00', '11564333334', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('A3', 'Financial Stewardship', 'Financial Stewardship', 'A', 10, 3, 'Absorption of Externally Mobilized Funds', '%', 'HIGHER_BETTER', '100', '100', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('A4', 'Financial Stewardship', 'Financial Stewardship', 'A', 10, 3, 'Pending Bills Ratio', '%', 'LOWER_BETTER', '4', '1', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('B1', 'Service Delivery', 'Service Delivery', 'B', 15, 4, 'Implementation of Citizens'' Service Delivery Charter', '%', 'HIGHER_BETTER', '65', '100', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('B2', 'Service Delivery', 'Service Delivery', 'B', 15, 7, 'Digitalization of Government Services', '%', 'HIGHER_BETTER', '100', '100', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('B3', 'Service Delivery', 'Service Delivery', 'B', 15, 4, 'Resolution of Public Complaints', '%', 'HIGHER_BETTER', '80', '100', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('C9_2', 'Core Mandate', 'Core Mandate', 'C', 65, 6, 'Universal Health Coverage in Counties Rolled Out', '%', 'HIGHER_BETTER', '65', '100', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('C9_3', 'Core Mandate', 'Core Mandate', 'C', 65, 2, 'Access to Health Products and Technologies Enhanced', '%', 'HIGHER_BETTER', '100', '100', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('C9_4', 'Core Mandate', 'Core Mandate', 'C', 65, 3, 'Strategic Plan for the Local Manufacture of HPTs Developed', 'count', 'HIGHER_BETTER', '0', '1', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('C9_5', 'Core Mandate', 'Core Mandate', 'C', 65, 3, 'Kenya Health Sector Strategic Plan Developed', 'count', 'HIGHER_BETTER', '0', '1', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('C9_6', 'Core Mandate', 'Core Mandate', 'C', 65, 3, 'Proportion of Deliveries Performed by Skilled Birth Attendants Increased', '%', 'HIGHER_BETTER', '72', '75', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('C9_7', 'Core Mandate', 'Core Mandate', 'C', 65, 4, 'Mother to Child Transmission of HIV Rate Halted and Reversed', '%', 'LOWER_BETTER', '7.4', '6.5', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('C9_8', 'Core Mandate', 'Core Mandate', 'C', 65, 3, 'Number of HIV Patients on Anti-Retroviral Therapy Increased', 'count', 'HIGHER_BETTER', '1342000', '1365000', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('C9_9', 'Core Mandate', 'Core Mandate', 'C', 65, 4, 'STEPS Survey for NCD Risk Factors Conducted', '%', 'HIGHER_BETTER', NULL, '100', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('C9_10', 'Core Mandate', 'Core Mandate', 'C', 65, 3, 'Number of Blood and Blood Components for Transfusion Availed', 'count', 'HIGHER_BETTER', '449689', '400000', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('C9_11', 'Core Mandate', 'Core Mandate', 'C', 65, 4, 'Percentage of Health Facilities Offering Adolescent and Youth Friendly Services Increased', '%', 'HIGHER_BETTER', '63', '75', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('C9_13', 'Core Mandate', 'Core Mandate', 'C', 65, 4, 'Total Confirmed Malaria Cases (Per 1000 Population) Reduced', 'per 1000', 'LOWER_BETTER', '104', '80', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('C9_14', 'Core Mandate', 'Core Mandate', 'C', 65, 3, 'Number of People Diagnosed with Drug Susceptible TB (All forms) and Put on Treatment Increased', 'count', 'HIGHER_BETTER', '97126', '100000', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('C9_15', 'Core Mandate', 'Core Mandate', 'C', 65, 3, 'Number of Patients with Drug Resistant Tuberculosis Started on Treatment Increased', 'count', 'HIGHER_BETTER', '703', '970', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('C9_16', 'Core Mandate', 'Core Mandate', 'C', 65, 3, 'Percentage of Eligible School Age Children Dewormed Annually Increased', '%', 'HIGHER_BETTER', '85', '90', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('C9_17', 'Core Mandate', 'Core Mandate', 'C', 65, 3, 'Regional Cancer Centre at Kisii Level 5 Hospital Constructed', '%', 'HIGHER_BETTER', NULL, '100', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('C9_18', 'Core Mandate', 'Core Mandate', 'C', 65, 2, 'Science, Technology and Innovation Mainstreaming', '%', 'HIGHER_BETTER', '100', '100', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('C9_19', 'Core Mandate', 'Core Mandate', 'C', 65, 3, 'Productivity Improvement', '%', 'HIGHER_BETTER', NULL, '100', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('C9_20', 'Core Mandate', 'Core Mandate', 'C', 65, 2, 'Typhoid Conjugate Vaccine to Children Aged 9 Months Introduced', 'doses', 'HIGHER_BETTER', NULL, '15000000', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('C9_23', 'Core Mandate', 'Core Mandate', 'C', 65, 2, 'Internship Opportunities to Medical Trainees Availed', 'count', 'HIGHER_BETTER', NULL, '3947', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('C9_24', 'Core Mandate', 'Core Mandate', 'C', 65, 3, 'New Structure for the Acquisition of Medical Equipment Designed', 'count', 'HIGHER_BETTER', NULL, '1', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('C9_25', 'Core Mandate', 'Core Mandate', 'C', 65, 2, 'Project Completion Rate', '%', 'HIGHER_BETTER', NULL, '100', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('D1', 'Implementation of Presidential Directives', 'Implementation of Presidential Directives', 'D', 2, 2, 'Implementation of Presidential Directives', '%', 'HIGHER_BETTER', '26', '100', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('E1', 'Affirmative Action in Procurement', 'Affirmative Action in Procurement', 'E', 4, 2, 'Access to Government Procurement Opportunities', 'KSh', 'HIGHER_BETTER', '102208808', '485807496', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('F1', 'Cross-Cutting', 'Cross-Cutting', 'F', 4, 1, 'Asset Management', '%', 'HIGHER_BETTER', '100', '100', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('F2', 'Cross-Cutting', 'Cross-Cutting', 'F', 4, 1, 'Youth Internships / Industrial Attachments / Apprenticeships', 'count', 'HIGHER_BETTER', '62', '506', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('F3', 'Cross-Cutting', 'Cross-Cutting', 'F', 4, 1, 'Competence Development', '%', 'HIGHER_BETTER', '45', '100', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.'),
('F4', 'Cross-Cutting', 'Cross-Cutting', 'F', 4, 1, 'National Values and Principles of Governance', '%', 'HIGHER_BETTER', '70', '100', NULL, 0, 'Pending Actuals', '2025/2026', 'Remapped from 2023/24 Performance Contract sheet: baseline = previous-year value; target carried forward. 2025/26 actual not yet reported.')
ON DUPLICATE KEY UPDATE category=VALUES(category), parent_kpi_name=VALUES(parent_kpi_name), category_weight=VALUES(category_weight),
  sub_kpi_weight=VALUES(sub_kpi_weight), kpi_name=VALUES(kpi_name), unit=VALUES(unit), direction=VALUES(direction),
  baseline_score=VALUES(baseline_score), target_2025_26=VALUES(target_2025_26), variance_comment=VALUES(variance_comment);

-- -------------------------------------------------------------------------
-- 5. DELIVERY-UNIT KPIs (Sheet2) - 43 KPIs, targets 2025/26 to 2029/30
--    'N/A' stored as NULL. direction = LOWER_BETTER for waiting times,
--    length of stay, re-admission rate.
-- -------------------------------------------------------------------------
INSERT INTO project_kpis (kpi_code, sub_programme_id, saga_id, delivery_unit, key_output, kpi_name, unit, direction, target_2025_26, actual_2025_26, target_baseline_2026_27, target_2027_28, target_2028_29, target_2029_30) VALUES
('KNH-SSC-01', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='KNH'), 'Kenyatta National Hospital', 'Specialized health care services', 'Number of Heart surgeries done', 'count', 'HIGHER_BETTER', 784, 630, 784, 815, 863, 889),
('KNH-SSC-02', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='KNH'), 'Kenyatta National Hospital', 'Specialized health care services', 'Number of other cardiothoracic surgeries conducted', 'count', 'HIGHER_BETTER', 1519, 1023, 1519, 1261, 1266, 1281),
('KNH-SSC-03', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='KNH'), 'Kenyatta National Hospital', 'Specialized health care services', 'Number of Kidney Transplants conducted', 'count', 'HIGHER_BETTER', 24, 22, 24, 29, 31, 32),
('KNH-SSC-04', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='KNH'), 'Kenyatta National Hospital', 'Specialized health care services', 'Number of minimally invasive surgeries done', 'count', 'HIGHER_BETTER', 10716, 9852, 10784, 11539, 11986, 12346),
('KNH-SSC-05', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='KNH'), 'Kenyatta National Hospital', 'Specialized health care services', 'Number of patients undergoing specialized Burns treatment (OBD)', 'count', 'HIGHER_BETTER', 649, 439, 649, 595, 598, 604),
('KNH-SSC-06', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='KNH'), 'Kenyatta National Hospital', 'Specialized health care services', 'Number of oncology sessions (Chemotherapy and radiotherapy)', 'count', 'HIGHER_BETTER', 47646, 11545, 47646, 40600, 40637, 41450),
('KNH-RES-01', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='KNH'), 'Kenyatta National Hospital', 'Health Research disseminated', 'Number of new research projects disseminated', 'count', 'HIGHER_BETTER', 5, 3, 5, 8, 9, 9),
('KNH-WT-01', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='KNH'), 'Kenyatta National Hospital', 'Average waiting time for specialized diagnostic and treatment services reduced', 'Average Length of Stay (ALOS) for trauma patients (days)', 'days', 'LOWER_BETTER', 35, 40.9, 34.2, 33.5, 33.2, 32.8),
('KNH-WT-02', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='KNH'), 'Kenyatta National Hospital', 'Average waiting time for specialized diagnostic and treatment services reduced', 'Average waiting time (days) for radiotherapy', 'days', 'LOWER_BETTER', 17, 57, 16.5, 16, 15.5, 15),
('KNH-WT-03', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='KNH'), 'Kenyatta National Hospital', 'Average waiting time for specialized diagnostic and treatment services reduced', 'Average waiting time (days) for chemotherapy', 'days', 'LOWER_BETTER', 3, 2.1, 2, 2, 1.5, 2),
('KNH-OUT-01', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='KNH'), 'Kenyatta National Hospital', 'Multidisciplinary Outreaches Conducted', 'Number of Multi-disciplinary Outreaches with Counties', 'count', 'HIGHER_BETTER', 390, 376, 421, 428, 431, 440),
('JOOTRH-SSC-01', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='JOOTRH'), 'Jaramogi Oginga Odinga Teaching and Referral Hospital', 'Specialized health care services', 'Number of apheresis procedures conducted', 'count', 'HIGHER_BETTER', 100, 38, 101, 110, 121, 133),
('JOOTRH-SSC-02', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='JOOTRH'), 'Jaramogi Oginga Odinga Teaching and Referral Hospital', 'Specialized health care services', 'Number of Minimally Invasive surgeries conducted', 'count', 'HIGHER_BETTER', 100, 200, 312, 350, 400, 450),
('JOOTRH-SSC-03', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='JOOTRH'), 'Jaramogi Oginga Odinga Teaching and Referral Hospital', 'Specialized health care services', 'Number of cardiothoracic procedures performed', 'count', 'HIGHER_BETTER', 100, 88, 121, 110, 121, 133),
('JOOTRH-SSC-04', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='JOOTRH'), 'Jaramogi Oginga Odinga Teaching and Referral Hospital', 'Specialized health care services', 'Number of maxillofacial surgeries performed', 'count', 'HIGHER_BETTER', 300, 226, 251, 275, 303, 333),
('JOOTRH-SSC-05', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='JOOTRH'), 'Jaramogi Oginga Odinga Teaching and Referral Hospital', 'Specialized health care services', 'Number of Neuro surgeries conducted', 'count', 'HIGHER_BETTER', 500, 533, 552, 650, 650, 700),
('JOOTRH-SSC-06', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='JOOTRH'), 'Jaramogi Oginga Odinga Teaching and Referral Hospital', 'Specialized health care services', 'Number of gynae oncological surgeries conducted', 'count', 'HIGHER_BETTER', NULL, 96, 176, 193, 212, 234),
('JOOTRH-SSC-07', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='JOOTRH'), 'Jaramogi Oginga Odinga Teaching and Referral Hospital', 'Specialized health care services', 'Number of urogyn surgeries conducted', 'count', 'HIGHER_BETTER', NULL, 93, 162, 176, 193, 212),
('JOOTRH-SSC-08', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='JOOTRH'), 'Jaramogi Oginga Odinga Teaching and Referral Hospital', 'Specialized health care services', 'Number of orthopedic surgeries performed', 'count', 'HIGHER_BETTER', 1000, 829, 913, 1000, 1100, 1200),
('JOOTRH-SSC-09', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='JOOTRH'), 'Jaramogi Oginga Odinga Teaching and Referral Hospital', 'Specialized health care services', 'Number of Plastic and reconstruction procedures performed', 'count', 'HIGHER_BETTER', 100, 79, 112, 118, 121, 133),
('JOOTRH-SSC-10', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='JOOTRH'), 'Jaramogi Oginga Odinga Teaching and Referral Hospital', 'Specialized health care services', 'Number of oncology patients receiving chemotherapy treatment', 'count', 'HIGHER_BETTER', 3653, 2976, 3512, 4180, 4598, 5057),
('JOOTRH-SSC-11', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='JOOTRH'), 'Jaramogi Oginga Odinga Teaching and Referral Hospital', 'Specialized health care services', 'Specialised clinic attendance', 'count', 'HIGHER_BETTER', 100000, 136162, 149778, 164756, 181232, 199355),
('JOOTRH-SSC-12', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='JOOTRH'), 'Jaramogi Oginga Odinga Teaching and Referral Hospital', 'Specialized health care services', 'Number of dialysis sessions done', 'count', 'HIGHER_BETTER', 5500, 6257, 6883, 7571, 8328, 9161),
('JOOTRH-SSC-13', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='JOOTRH'), 'Jaramogi Oginga Odinga Teaching and Referral Hospital', 'Specialized health care services', 'Average length of stay (days)', 'days', 'LOWER_BETTER', 7, 9, 8, 8, 7, 6),
('JOOTRH-RTT-01', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='JOOTRH'), 'Jaramogi Oginga Odinga Teaching and Referral Hospital', 'Research Teaching and Training Services', 'Research protocols approved', 'count', 'HIGHER_BETTER', 60, 87, 90, 95, 100, 105),
('JOOTRH-RTT-02', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='JOOTRH'), 'Jaramogi Oginga Odinga Teaching and Referral Hospital', 'Research Teaching and Training Services', 'Peer-reviewed articles published', 'count', 'HIGHER_BETTER', NULL, NULL, 5, 8, 10, 12),
('JOOTRH-RTT-03', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='JOOTRH'), 'Jaramogi Oginga Odinga Teaching and Referral Hospital', 'Research Teaching and Training Services', 'Postgraduate residents (MMed/Fellows), medical students, and allied health interns trained', 'count', 'HIGHER_BETTER', NULL, NULL, 150, 200, 250, 300),
('JOOTRH-RTT-04', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='JOOTRH'), 'Jaramogi Oginga Odinga Teaching and Referral Hospital', 'Research Teaching and Training Services', 'Number of grants attracted', 'count', 'HIGHER_BETTER', NULL, NULL, 4, 6, 8, 10),
('MNTRH-MH-01', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='MNTRH'), 'Mathari National Teaching and Referral Hospital', 'Mental health services', 'Number of patients receiving inpatient and outpatient mental health care services', 'count', 'HIGHER_BETTER', 240135, 207729, 213961, 220380, 226991, 233801),
('MNTRH-MH-02', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='MNTRH'), 'Mathari National Teaching and Referral Hospital', 'Mental health services', 'Number of Electroconvulsive Therapy (ECT) sessions done', 'count', 'HIGHER_BETTER', 1016, 1230, 1267, 1305, 1344, 1384),
('MNTRH-MH-03', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='MNTRH'), 'Mathari National Teaching and Referral Hospital', 'Mental health services', 'Number of patients accessing child and adolescent services', 'count', 'HIGHER_BETTER', 3390, 3189, 3559, 3737, 3924, 4316),
('MNTRH-MH-04', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='MNTRH'), 'Mathari National Teaching and Referral Hospital', 'Mental health services', 'Number of patients with drug/substance and alcohol addiction receiving rehabilitative mental health care services', 'count', 'HIGHER_BETTER', 1330, 1133, 1397, 1467, 1540, 1694),
('MNTRH-MH-05', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='MNTRH'), 'Mathari National Teaching and Referral Hospital', 'Mental health services', 'Number of patients receiving outpatient mental healthcare services', 'count', 'HIGHER_BETTER', 190273, 179116, 199786, 209776, 220264, 242290),
('MNTRH-MH-06', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='MNTRH'), 'Mathari National Teaching and Referral Hospital', 'Mental health services', 'Average Length of Stay for civil psychiatric inpatients (days)', 'days', 'LOWER_BETTER', 46, 59, 45, 44, 43, 43),
('MNTRH-MH-07', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='MNTRH'), 'Mathari National Teaching and Referral Hospital', 'Mental health services', 'Re-admission Rate (proportion of patients readmitted in a year)', '%', 'LOWER_BETTER', 32, 42, 32, 32, 32, 32),
('MNTRH-MH-08', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='MNTRH'), 'Mathari National Teaching and Referral Hospital', 'Mental health services', 'Percentage of patients in need of forensic services attended to', '%', 'HIGHER_BETTER', 100, 100, 100, 100, 100, 100),
('MNTRH-MH-09', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='MNTRH'), 'Mathari National Teaching and Referral Hospital', 'Mental health services', 'Percentage of psychiatric medical drugs acquired', '%', 'HIGHER_BETTER', 80, 71, 85, 90, 95, 100),
('MNTRH-MH-10', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='MNTRH'), 'Mathari National Teaching and Referral Hospital', 'Mental health services', 'Percentage of patients reintegrated into the community', '%', 'HIGHER_BETTER', 80, 75, 85, 90, 100, 100),
('MNTRH-MH-11', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='MNTRH'), 'Mathari National Teaching and Referral Hospital', 'Mental health services', 'Number of MNTRH Health Practitioners trained in sub-specialty', 'count', 'HIGHER_BETTER', 3, 1, 4, 5, 5, 5),
('MNTRH-MH-12', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='MNTRH'), 'Mathari National Teaching and Referral Hospital', 'Mental health services', 'Number of new research conducted on mental health and disseminated', 'count', 'HIGHER_BETTER', 4, 0, 4, 4, 4, 4),
('MNTRH-MH-13', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='MNTRH'), 'Mathari National Teaching and Referral Hospital', 'Mental health services', 'Number of mental health outreaches conducted', 'count', 'HIGHER_BETTER', 59, 40, 65, 71, 79, 82),
('MNTRH-MH-14', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='MNTRH'), 'Mathari National Teaching and Referral Hospital', 'Mental health services', 'Percentage of completion of the Renovation/Equipping Buildings - Mathari Teaching & Referral Hospital', '%', 'HIGHER_BETTER', 60, 70, 80, 85, 90, 100),
('MNTRH-INT-01', (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1'), (SELECT id FROM sagas WHERE saga_code='MNTRH'), 'Mathari National Teaching and Referral Hospital', 'Integrated services', 'Number of patients accessing integrated outpatient, rehabilitative, and diagnostic services', 'count', 'HIGHER_BETTER', 66214, 61866, 69525, 73001, 76651, 84316)
ON DUPLICATE KEY UPDATE kpi_name=VALUES(kpi_name), key_output=VALUES(key_output), unit=VALUES(unit), direction=VALUES(direction),
  target_2025_26=VALUES(target_2025_26), actual_2025_26=VALUES(actual_2025_26), target_baseline_2026_27=VALUES(target_baseline_2026_27),
  target_2027_28=VALUES(target_2027_28), target_2028_29=VALUES(target_2028_29), target_2029_30=VALUES(target_2029_30);

-- -------------------------------------------------------------------------
-- 6. PROJECTS
--    6a. Align the two existing demo projects to the official programme
--        structure (links only; budgets/dates untouched).
--    6b. Add three projects that are named outputs in the workbooks.
--        Budgets are NULL because the sources give none. Milestone/task
--        counters are set to 0 (not the schema defaults of 2/3).
--        Directorate assignment for 6b rows is a best-fit assumption - confirm.
-- -------------------------------------------------------------------------
UPDATE projects SET
  programme_title = 'National Referral Facilities and Specialized Services',
  programme_id = (SELECT id FROM programmes WHERE programme_code='P1'),
  sub_programme_id = (SELECT id FROM sub_programmes WHERE sp_code='SP.1.2')
WHERE id = 1;

UPDATE projects SET
  programme_title = 'Curative and RMNCAH',
  programme_id = (SELECT id FROM programmes WHERE programme_code='P2'),
  sub_programme_id = (SELECT id FROM sub_programmes WHERE sp_code='SP.2.1')
WHERE id = 2;

INSERT INTO projects (programme_title, sub_programme, description, remarks, category, directorate_name, saga_name, delivery_unit, start_date, end_date, status, progress_status, total_budget, funds_disbursed, funds_utilized, milestones_completed, milestones_total, tasks_on_track, tasks_total, gantt_task_name, programme_id, sub_programme_id)
SELECT 'National Referral Facilities and Specialized Services', 'Regional Cancer Centre at Kisii Level 5 Hospital', 'Construction of the Regional Cancer Centre at Kisii Level 5 Hospital (Performance Contract KPI C9_17).', 'Not reported in source workbook; update actuals.', 'Directorate', 'Directorate for Curative & Rehabilitation Services', NULL, 'Directorate for Curative & Rehabilitation Services', '2025-07-01', '2026-06-30', 'In Progress', '0%', NULL, NULL, NULL, 0, 0, 0, 0, 'Construct Kisii Regional Cancer Centre',
  (SELECT id FROM programmes WHERE programme_code='P1'), (SELECT id FROM sub_programmes WHERE sp_code='SP.1.2')
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM projects WHERE sub_programme = 'Regional Cancer Centre at Kisii Level 5 Hospital');

INSERT INTO projects (programme_title, sub_programme, description, remarks, category, directorate_name, saga_name, delivery_unit, start_date, end_date, status, progress_status, total_budget, funds_disbursed, funds_utilized, milestones_completed, milestones_total, tasks_on_track, tasks_total, gantt_task_name, programme_id, sub_programme_id)
SELECT 'National Referral Facilities and Specialized Services', 'Renovation and Equipping of Mathari Teaching & Referral Hospital Buildings', 'Renovation/equipping of buildings at MNTRH. Completion 70% against a 60% target in 2025/26; 100% targeted by 2029/30.', 'Ahead of 2025/26 target (70% vs 60%).', 'Saga', NULL, 'Mathari National Teaching and Referral Hospital', 'Mathari National Teaching and Referral Hospital', '2025-07-01', '2030-06-30', 'In Progress', '70%', NULL, NULL, NULL, 0, 0, 0, 0, 'Mathari buildings renovation & equipping',
  (SELECT id FROM programmes WHERE programme_code='P1'), (SELECT id FROM sub_programmes WHERE sp_code='SP.1.1')
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM projects WHERE sub_programme = 'Renovation and Equipping of Mathari Teaching & Referral Hospital Buildings');

INSERT INTO projects (programme_title, sub_programme, description, remarks, category, directorate_name, saga_name, delivery_unit, start_date, end_date, status, progress_status, total_budget, funds_disbursed, funds_utilized, milestones_completed, milestones_total, tasks_on_track, tasks_total, gantt_task_name, programme_id, sub_programme_id)
SELECT 'Curative and RMNCAH', 'Introduction of Typhoid Conjugate Vaccine for Children Aged 9 Months', 'Introduce typhoid conjugate vaccine to children aged 9 months; target 15,000,000 doses (Performance Contract KPI C9_20).', 'Not reported in source workbook; update actuals.', 'Directorate', 'Directorate for Preventive & Promotive Health', NULL, 'Directorate for Preventive & Promotive Health', '2025-07-01', '2026-06-30', 'In Progress', '0%', NULL, NULL, NULL, 0, 0, 0, 0, 'Roll out typhoid conjugate vaccine',
  (SELECT id FROM programmes WHERE programme_code='P2'), (SELECT id FROM sub_programmes WHERE sp_code='SP.2.4')
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM projects WHERE sub_programme = 'Introduction of Typhoid Conjugate Vaccine for Children Aged 9 Months');

-- Link the Mathari renovation KPI to its project
UPDATE project_kpis SET project_id = (SELECT id FROM (SELECT id FROM projects WHERE sub_programme = 'Renovation and Equipping of Mathari Teaching & Referral Hospital Buildings' LIMIT 1) p)
WHERE kpi_code = 'MNTRH-MH-14';

COMMIT;
