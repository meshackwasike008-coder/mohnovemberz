export interface Flagship {
  id: number;
  title: string;
  description: string;
  lead_directorate: string;
  progress_pct: number;
  risk_level: 'Low' | 'Medium' | 'High' | 'Severe';
  priority_tier: 'Critical' | 'High' | 'Medium' | 'Low';
  allocated_budget: number;
  utilized_budget: number;
  lead_officer: string;
  team_name: string;
  start_date: string;
  target_date: string;
  status: string;
}

export interface Project {
  id: number;
  programme_title: string;
  sub_programme: string;
  description: string;
  remarks: string;
  category: 'Directorate' | 'Saga' | 'Division';
  directorate_name?: string;
  saga_name?: string;
  division_name?: string;
  delivery_unit?: string;
  flagship_id?: number;
  flagship_title?: string;
  start_date: string;
  end_date: string;
  status: string;
  progress_status: string;
  monthly_progress?: { [yearMonth: string]: number };
  progress_calculation_mode?: 'kpi_derived' | 'manual';
  linked_sub_kpi_codes?: string[];
  total_budget: number;
  funds_disbursed: number;
  funds_utilized: number;
  milestones_completed?: number;
  milestones_total?: number;
  tasks_on_track?: number;
  tasks_total?: number;
  gantt_task_name?: string;
}

export interface ActionPoint {
  id: number;
  ref_no: string;
  date: string;
  meeting_title: string;
  issue: string;
  person_responsible: string;
  timeline: string;
  status: 'ON TRACK' | 'NOT STARTED' | 'DELAYED' | 'STALLED' | 'COMPLETED' | 'CANCELLED';
  action: string;
  resolution_notes?: string;
}

export interface Meeting {
  id: number;
  date: string;
  title: string;
  description: string;
  financier: string;
  venue: string;
  attendees: string;
  agenda: string;
  decisions: string;
  document: string;
}

export interface EventItem {
  id: number;
  title: string;
  description: string;
  event_type: string;
  event_date: string;
  event_time: string;
  location: string;
  host: string;
  attendees: string;
  status: string;
}

export interface ReportItem {
  id: number;
  report_code: string;
  title: string;
  module: string;
  project_name: string;
  project_code: string;
  description: string;
  report_date: string;
  created_at: string;
  file_name: string;
  visibility: 'Public' | 'Restricted' | 'Confidential';
  status: 'Pending' | 'Approved' | 'Rejected';
  uploaded_by: string;
}

export interface PerformanceKPI {
  id: number;
  code: string;
  category: 'Financial Stewardship' | 'Service Delivery' | 'Core Mandate' | 'Implementation of Presidential Directives' | 'Affirmative Action in Procurement' | 'Cross-Cutting';
  parent_kpi_name: string;
  parent_kpi_code: string;
  category_weight: number;
  sub_kpi_weight: number;
  delivery_unit: string;
  programme: string;
  key_outputs: string;
  kpi_name: string;
  baseline_score: string;
  target_2025_26: string;
  actual_2025_26: string;
  target_baseline_2026_27: string;
  target_2027_28: string;
  current_achievement: number;
  status: 'Approved' | 'Reviewed' | 'Submitted' | 'Draft';
  financial_year: string;
  variance_comment: string;
  q1_score?: number;
  q2_score?: number;
  q3_score?: number;
  q4_score?: number;
  linked_project_ids?: number[];
}


export interface SystemUser {
  id: number;
  full_name: string;
  email: string;
  role: string;
  directorate: string;
  is_active: boolean;
  can_upload: boolean;
  can_edit: boolean;
  can_approve: boolean;
  can_download: boolean;
  is_admin: boolean;
  last_login: string;
}

export const INITIAL_FLAGSHIPS: Flagship[] = [
  {
    id: 1,
    title: "Afya Care UHC Digitization & Electronic Health Records (EHR)",
    description: "Deployment of standardized enterprise EHR software across Level 4, 5, and 6 referral facilities in all 47 counties.",
    lead_directorate: "Health Informatics & Digital Health",
    progress_pct: 68,
    risk_level: "Medium",
    priority_tier: "Critical",
    allocated_budget: 4500000000,
    utilized_budget: 3120000000,
    lead_officer: "Dr. Rose Njeru",
    team_name: "UHC Digital Steering Taskforce",
    start_date: "2024-07-01",
    target_date: "2026-12-31",
    status: "In Progress"
  },
  {
    id: 2,
    title: "National Emergency Medical Services & Critical Care Fund (EMS)",
    description: "Institutionalization of ambulance network and critical trauma care fund.",
    lead_directorate: "Emergency Medical Care Directorate",
    progress_pct: 42,
    risk_level: "High",
    priority_tier: "High",
    allocated_budget: 2800000000,
    utilized_budget: 1190000000,
    lead_officer: "Dr. Evans Kimani",
    team_name: "EMS National Board",
    start_date: "2024-09-01",
    target_date: "2027-06-30",
    status: "In Progress"
  },
  {
    id: 3,
    title: "KEMSA Supply Chain Overhaul & End-to-End Traceability (ERP)",
    description: "Automated warehouse management and barcode tracking from central supply to dispensary.",
    lead_directorate: "Health Products and Technologies (HPT)",
    progress_pct: 85,
    risk_level: "Low",
    priority_tier: "Critical",
    allocated_budget: 1650000000,
    utilized_budget: 1420000000,
    lead_officer: "Dr. Joseph Mburu",
    team_name: "HPT Modernization Taskforce",
    start_date: "2024-01-15",
    target_date: "2026-06-30",
    status: "In Progress"
  },
  {
    id: 4,
    title: "Primary Healthcare Networks (PCNs) Operationalization",
    description: "Setting up 315 Primary Care Networks anchoring Primary Health Care facilities.",
    lead_directorate: "Primary Healthcare Directorate",
    progress_pct: 54,
    risk_level: "Medium",
    priority_tier: "High",
    allocated_budget: 3200000000,
    utilized_budget: 1800000000,
    lead_officer: "Dr. David Kariuki",
    team_name: "PCN Secretariat",
    start_date: "2024-08-01",
    target_date: "2027-06-30",
    status: "In Progress"
  },
  {
    id: 5,
    title: "Specialized Regional Cancer Centers of Excellence Network",
    description: "Regional bunkers and modern radiotherapy infrastructure across Coast, Western, and Mount Kenya.",
    lead_directorate: "Health Infrastructure & Referral Facilities",
    progress_pct: 79,
    risk_level: "Low",
    priority_tier: "Critical",
    allocated_budget: 5100000000,
    utilized_budget: 4230000000,
    lead_officer: "Eng. Peter Mutua",
    team_name: "Oncology Infrastructure Directorate",
    start_date: "2023-11-01",
    target_date: "2026-10-31",
    status: "In Progress"
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    programme_title: "Specialized Regional Cancer & Clinical Infrastructure Programme",
    sub_programme: "Kenyatta National Hospital (KNH) Modern Burns ICU & Plastic Surgery Center",
    description: "State-of-the-art 82-bed specialized burns unit with hyperbaric chambers and dedicated surgical suites.",
    remarks: "Mechanical and medical gas piping ongoing; theaters undergoing validation.",
    category: "Saga",
    saga_name: "Kenyatta National Hospital",
    delivery_unit: "Kenyatta National Hospital",
    flagship_id: 5,
    flagship_title: "Specialized Regional Cancer Centers of Excellence Network",
    start_date: "2024-02-01",
    end_date: "2026-08-31",
    status: "In Progress",
    progress_status: "91%",
    monthly_progress: { "2026-01": 70, "2026-02": 76, "2026-03": 82, "2026-04": 87, "2026-05": 90, "2026-06": 91 },
    progress_calculation_mode: "kpi_derived",
    linked_sub_kpi_codes: ["C3.1", "C3.3"],
    total_budget: 2850000000,
    funds_disbursed: 2350000000,
    funds_utilized: 2180000000
  },
  {
    id: 2,
    programme_title: "Specialized Regional Cancer & Clinical Infrastructure Programme",
    sub_programme: "Moi Teaching and Referral Hospital (MTRH) 62-Bed Multi-Organ Transplant Center",
    description: "Specialized organ harvesting, kidney and liver transplant suites with tissue matching labs.",
    remarks: "Structural works completed; clean room HVAC testing commenced.",
    category: "Saga",
    saga_name: "Kenyatta National Hospital",
    delivery_unit: "Kenyatta National Hospital",
    flagship_id: 5,
    flagship_title: "Specialized Regional Cancer Centers of Excellence Network",
    start_date: "2023-09-15",
    end_date: "2026-12-15",
    status: "In Progress",
    progress_status: "91%",
    monthly_progress: { "2026-01": 72, "2026-02": 78, "2026-03": 83, "2026-04": 86, "2026-05": 89, "2026-06": 91 },
    progress_calculation_mode: "kpi_derived",
    linked_sub_kpi_codes: ["C3.2"],
    total_budget: 3400000000,
    funds_disbursed: 2700000000,
    funds_utilized: 2510000000
  },
  {
    id: 3,
    programme_title: "Health Products, Technologies & Supply Chain Programme",
    sub_programme: "KEMSA National Automated Cold-Chain Logistics Hub (Warehouse Modernization)",
    description: "Automated cold room storage, RFID stock batch tracking and warehouse telematics for essential commodities.",
    remarks: "Commissioning scheduled for next quarter; ERP order fill rate exceeding targets.",
    category: "Saga",
    saga_name: "Kenyatta National Hospital",
    delivery_unit: "Kenyatta National Hospital",
    flagship_id: 3,
    flagship_title: "KEMSA Supply Chain Overhaul & End-to-End Traceability (ERP)",
    start_date: "2024-01-10",
    end_date: "2026-05-30",
    status: "In Progress",
    progress_status: "87%",
    monthly_progress: { "2026-01": 65, "2026-02": 71, "2026-03": 77, "2026-04": 82, "2026-05": 85, "2026-06": 87 },
    progress_calculation_mode: "kpi_derived",
    linked_sub_kpi_codes: ["C2.1", "C2.2"],
    total_budget: 1200000000,
    funds_disbursed: 1100000000,
    funds_utilized: 1040000000
  },
  {
    id: 4,
    programme_title: "Emergency Medical Services & Critical Care Programme",
    sub_programme: "National Emergency Medical Services Dispatch & Telemetry Command Center",
    description: "Unified national 999/112 ambulance dispatch system with GPS ambulance telemetry and hospital ER linkage.",
    remarks: "Software integration complete; automated incident dispatch operational in pilot counties.",
    category: "Directorate",
    directorate_name: "Emergency Medical Care Directorate",
    delivery_unit: "Emergency Medical Care Directorate",
    flagship_id: 2,
    flagship_title: "National Emergency Medical Services & Critical Care Fund (EMS)",
    start_date: "2024-04-01",
    end_date: "2026-09-30",
    status: "In Progress",
    progress_status: "82%",
    monthly_progress: { "2026-01": 60, "2026-02": 66, "2026-03": 72, "2026-04": 78, "2026-05": 80, "2026-06": 82 },
    progress_calculation_mode: "kpi_derived",
    linked_sub_kpi_codes: ["B2", "C1.1"],
    total_budget: 850000000,
    funds_disbursed: 600000000,
    funds_utilized: 540000000
  },
  {
    id: 5,
    programme_title: "Specialized Regional Cancer & Clinical Infrastructure Programme",
    sub_programme: "Mama Margaret Kenyatta Children's Hospital Specialized Pediatric ICU Wing",
    description: "Pediatric critical care expansion with 40-bed neonatology, pediatric cardiac ICU and ECMO capacity.",
    remarks: "Medical gas certification achieved; specialized pediatric surgical team deployed.",
    category: "Directorate",
    directorate_name: "Health Infrastructure & Referral Facilities",
    delivery_unit: "Health Infrastructure & Referral Facilities",
    flagship_id: 5,
    flagship_title: "Specialized Regional Cancer Centers of Excellence Network",
    start_date: "2024-06-01",
    end_date: "2026-11-30",
    status: "In Progress",
    progress_status: "91%",
    monthly_progress: { "2026-01": 70, "2026-02": 76, "2026-03": 82, "2026-04": 87, "2026-05": 90, "2026-06": 91 },
    progress_calculation_mode: "kpi_derived",
    linked_sub_kpi_codes: ["C3.1"],
    total_budget: 1450000000,
    funds_disbursed: 1200000000,
    funds_utilized: 1120000000
  },
  {
    id: 6,
    programme_title: "Specialized Regional Cancer & Clinical Infrastructure Programme",
    sub_programme: "Kisumu Regional Hospital Maternal & Child Health Complex",
    description: "150-bed specialized maternal health center with neonatal intensive care and surgical theaters.",
    remarks: "Civil works 78% complete; drainage contractor cleared and installation underway.",
    category: "Directorate",
    directorate_name: "Health Infrastructure & Referral Facilities",
    delivery_unit: "Health Infrastructure & Referral Facilities",
    flagship_id: 5,
    flagship_title: "Specialized Regional Cancer Centers of Excellence Network",
    start_date: "2024-01-01",
    end_date: "2026-07-31",
    status: "In Progress",
    progress_status: "87%",
    monthly_progress: { "2026-01": 65, "2026-02": 71, "2026-03": 77, "2026-04": 82, "2026-05": 85, "2026-06": 87 },
    progress_calculation_mode: "kpi_derived",
    linked_sub_kpi_codes: ["C1.1", "A1"],
    total_budget: 1750000000,
    funds_disbursed: 1050000000,
    funds_utilized: 980000000
  },
  {
    id: 7,
    programme_title: "Afya Care UHC Digitization & EHR Programme",
    sub_programme: "Afya Care UHC Digitization & Electronic Health Records (EHR)",
    description: "Standardized EHR software rollout and National Health Information Exchange across Level 4, 5, and 6 referral facilities.",
    remarks: "Digital health highway integrated with SHA claims processor across 68 hospitals.",
    category: "Directorate",
    directorate_name: "Directorate of Health Informatics & Digital Health",
    delivery_unit: "Directorate of Health Informatics & Digital Health",
    flagship_id: 1,
    flagship_title: "Afya Care UHC Digitization & Electronic Health Records (EHR)",
    start_date: "2024-07-01",
    end_date: "2026-12-31",
    status: "In Progress",
    progress_status: "77%",
    monthly_progress: { "2026-01": 55, "2026-02": 62, "2026-03": 68, "2026-04": 72, "2026-05": 75, "2026-06": 77 },
    progress_calculation_mode: "kpi_derived",
    linked_sub_kpi_codes: ["C1.2", "B2"],
    total_budget: 4500000000,
    funds_disbursed: 3120000000,
    funds_utilized: 2890000000
  },
  {
    id: 8,
    programme_title: "Specialized Regional Cancer & Clinical Infrastructure Programme",
    sub_programme: "KUTRRH CyberKnife & Advanced Oncology Radiotherapy Center",
    description: "Strengthening robotic stereotactic radiosurgery, PET-CT diagnostic staging and regional oncology referrals.",
    remarks: "Operating on 2 shifts; patient throughput subsidized through Social Health Authority oncology benefit.",
    category: "Saga",
    saga_name: "Kenyatta National Hospital",
    delivery_unit: "Kenyatta National Hospital",
    flagship_id: 5,
    flagship_title: "Specialized Regional Cancer Centers of Excellence Network",
    start_date: "2023-01-01",
    end_date: "2026-12-31",
    status: "In Progress",
    progress_status: "88%",
    monthly_progress: { "2026-01": 68, "2026-02": 74, "2026-03": 80, "2026-04": 84, "2026-05": 86, "2026-06": 88 },
    progress_calculation_mode: "kpi_derived",
    linked_sub_kpi_codes: ["C3.4"],
    total_budget: 1850000000,
    funds_disbursed: 1450000000,
    funds_utilized: 1390000000
  },
  {
    id: 9,
    programme_title: "National AIDS & STI Control Programme (NASCOP)",
    sub_programme: "National HIV Prevention, Treatment & Viral Suppression Sub-Programme",
    description: "National program for HIV/AIDS and STI prevention, treatment, and control. Key indicators include: People Living with HIV, On ART, and With Viral Load Suppression.",
    remarks: "Demo programme for Directorate of Family Health showing key HIV indicators.",
    category: "Directorate",
    directorate_name: "Directorate for Family Health",
    delivery_unit: "Directorate for Family Health",
    flagship_id: 1,
    flagship_title: "Afya Care UHC Digitization & Electronic Health Records (EHR)",
    start_date: "2026-01-01",
    end_date: "2028-12-31",
    status: "In Progress",
    progress_status: "94%",
    monthly_progress: { "2026-01": 80, "2026-02": 85, "2026-03": 89, "2026-04": 91, "2026-05": 93, "2026-06": 94 },
    progress_calculation_mode: "kpi_derived",
    linked_sub_kpi_codes: ["C4.1", "A3"],
    total_budget: 500000000,
    funds_disbursed: 350000000,
    funds_utilized: 310000000,
    milestones_completed: 2,
    milestones_total: 3,
    tasks_on_track: 0,
    tasks_total: 1,
    gantt_task_name: "Improve Viral Load Suppression Rate"
  },
  {
    id: 10,
    programme_title: "National Equipment Service Programme (NESP)",
    sub_programme: "Biomedical Equipment Maintenance & Uptime Assurance Sub-Programme",
    description: "Fee-for-service PPP medical equipment arrangement for all Level 4 & 5 county referral hospitals with guaranteed uptime.",
    remarks: "Transition roadmap active; uptime SLAs enforced by regional biomedical engineering units.",
    category: "Directorate",
    directorate_name: "Health Infrastructure & Referral Facilities",
    delivery_unit: "Health Infrastructure & Referral Facilities",
    flagship_id: 5,
    flagship_title: "Specialized Regional Cancer Centers of Excellence Network",
    start_date: "2024-07-01",
    end_date: "2030-06-30",
    status: "In Progress",
    progress_status: "86%",
    monthly_progress: { "2026-01": 68, "2026-02": 73, "2026-03": 78, "2026-04": 82, "2026-05": 84, "2026-06": 86 },
    progress_calculation_mode: "kpi_derived",
    linked_sub_kpi_codes: ["D1"],
    total_budget: 18000000000,
    funds_disbursed: 7500000000,
    funds_utilized: 6900000000
  },
  {
    id: 11,
    programme_title: "Primary Healthcare Networks & CHP Programme",
    sub_programme: "Community Health Promoters Kits & Smart Digital Registry Sub-Programme",
    description: "Provision of diagnostic kits, glucometers, digital smartphones, and monthly stipends for 100,000 Promoters.",
    remarks: "Full distribution achieved; 98,500 CHPs active on e-CHIS weekly disease surveillance.",
    category: "Directorate",
    directorate_name: "Primary Healthcare Directorate",
    delivery_unit: "Primary Healthcare Directorate",
    flagship_id: 4,
    flagship_title: "Primary Healthcare Networks (PCNs) Operationalization",
    start_date: "2024-01-01",
    end_date: "2027-06-30",
    status: "In Progress",
    progress_status: "93%",
    monthly_progress: { "2026-01": 75, "2026-02": 81, "2026-03": 86, "2026-04": 89, "2026-05": 91, "2026-06": 93 },
    progress_calculation_mode: "kpi_derived",
    linked_sub_kpi_codes: ["C1.3"],
    total_budget: 6500000000,
    funds_disbursed: 4800000000,
    funds_utilized: 4500000000
  },
  {
    id: 12,
    programme_title: "National Blood Transfusion & Damu-KE Programme",
    sub_programme: "Damu-KE Digital Voluntary Donor Registry & Cold-Chain Sub-Programme",
    description: "Automated blood screening, cold-chain fractionation, and Damu-KE digital voluntary donor registry.",
    remarks: "Mobile collection centers active; blood buffer reserves reached 385,000 units.",
    category: "Saga",
    saga_name: "Kenyatta National Hospital",
    delivery_unit: "Kenyatta National Hospital",
    flagship_id: 2,
    flagship_title: "National Emergency Medical Services & Critical Care Fund (EMS)",
    start_date: "2024-02-01",
    end_date: "2027-06-30",
    status: "In Progress",
    progress_status: "86%",
    monthly_progress: { "2026-01": 62, "2026-02": 68, "2026-03": 74, "2026-04": 79, "2026-05": 83, "2026-06": 85 },
    progress_calculation_mode: "kpi_derived",
    linked_sub_kpi_codes: ["C4.2"],
    total_budget: 2400000000,
    funds_disbursed: 1800000000,
    funds_utilized: 1650000000
  },
  {
    id: 13,
    programme_title: "Health Research and Innovations",
    sub_programme: "KEMRI Genomic Surveillance & Vaccine Clinical Trials Hub",
    description: "Advanced genomic sequencing laboratory and clinical trial infrastructure for infectious disease pathogens.",
    remarks: "Active sequencing of variant strains; clinical trial cohorts expanded.",
    category: "Saga",
    saga_name: "Kenyatta National Hospital",
    delivery_unit: "Kenyatta National Hospital",
    flagship_id: 3,
    flagship_title: "KEMSA Supply Chain Overhaul & End-to-End Traceability (ERP)",
    start_date: "2024-03-01",
    end_date: "2027-12-31",
    status: "In Progress",
    progress_status: "80%",
    monthly_progress: { "2026-01": 65, "2026-02": 70, "2026-03": 75, "2026-04": 78, "2026-05": 79, "2026-06": 80 },
    progress_calculation_mode: "kpi_derived",
    linked_sub_kpi_codes: ["C3.1"],
    total_budget: 1950000000,
    funds_disbursed: 1400000000,
    funds_utilized: 1320000000
  },
  {
    id: 14,
    programme_title: "National Referral Facilities and Specialized Services",
    sub_programme: "Mathari National Teaching and Referral Hospital (MNTRH) Modern Psychiatric Wards & Forensic Unit",
    description: "Comprehensive infrastructural rehabilitation and equipping of psychiatric care wards, adolescent mental health units, and forensic assessment center.",
    remarks: "Ahead of schedule at 70% completion rate against 2025/26 target.",
    category: "Saga",
    saga_name: "Kenyatta National Hospital",
    delivery_unit: "Kenyatta National Hospital",
    flagship_id: 2,
    flagship_title: "National Emergency Medical Services & Critical Care Fund (EMS)",
    start_date: "2025-07-01",
    end_date: "2030-06-30",
    status: "In Progress",
    progress_status: "70%",
    monthly_progress: { "2026-01": 55, "2026-02": 60, "2026-03": 64, "2026-04": 67, "2026-05": 69, "2026-06": 70 },
    progress_calculation_mode: "kpi_derived",
    linked_sub_kpi_codes: ["MNTRH-MH-14"],
    total_budget: 1500000000,
    funds_disbursed: 1100000000,
    funds_utilized: 1050000000
  },
  {
    id: 15,
    programme_title: "Specialized Regional Cancer & Clinical Infrastructure Programme",
    sub_programme: "Mwai Kibaki Referral Hospital (MKRH) Advanced Trauma & Diagnostic Center",
    description: "State-of-the-art trauma center with emergency operating theaters and MRI diagnostic suites.",
    remarks: "Equipment calibration ongoing; trauma surgeons and emergency triage staff deployed.",
    category: "Saga",
    saga_name: "Kenyatta National Hospital",
    delivery_unit: "Kenyatta National Hospital",
    flagship_id: 2,
    flagship_title: "National Emergency Medical Services & Critical Care Fund (EMS)",
    start_date: "2024-05-01",
    end_date: "2026-11-30",
    status: "In Progress",
    progress_status: "82%",
    monthly_progress: { "2026-01": 65, "2026-02": 71, "2026-03": 76, "2026-04": 79, "2026-05": 81, "2026-06": 82 },
    progress_calculation_mode: "kpi_derived",
    linked_sub_kpi_codes: ["C1.1"],
    total_budget: 2200000000,
    funds_disbursed: 1650000000,
    funds_utilized: 1540000000
  },
  {
    id: 16,
    programme_title: "Specialized Regional Cancer & Clinical Infrastructure Programme",
    sub_programme: "Jaramogi Oginga Odinga Teaching and Referral Hospital (JOOTRH) Regional Oncology & Cardiothoracic Complex",
    description: "Specialized cancer treatment center, cardiac catheterization laboratory, and apheresis units for Western region.",
    remarks: "Dialysis sessions and chemotherapy patient volumes exceeding targets.",
    category: "Saga",
    saga_name: "Kenyatta National Hospital",
    delivery_unit: "Kenyatta National Hospital",
    flagship_id: 5,
    flagship_title: "Specialized Regional Cancer Centers of Excellence Network",
    start_date: "2024-02-15",
    end_date: "2026-10-31",
    status: "In Progress",
    progress_status: "85%",
    monthly_progress: { "2026-01": 70, "2026-02": 75, "2026-03": 79, "2026-04": 82, "2026-05": 84, "2026-06": 85 },
    progress_calculation_mode: "kpi_derived",
    linked_sub_kpi_codes: ["JOOTRH-SSC-01", "JOOTRH-SSC-10"],
    total_budget: 2600000000,
    funds_disbursed: 2000000000,
    funds_utilized: 1880000000
  },
  {
    id: 17,
    programme_title: "Curative and RMNCAH",
    sub_programme: "National Cancer Institute Kenya (NCIK) Cancer Registry & Treatment Guidelines Modernization",
    description: "Digital population-based cancer registry, pathology network integration, and standardized national treatment protocols.",
    remarks: "County registry nodes expanded to 35 counties; clinical audit dashboards active.",
    category: "Saga",
    saga_name: "Kenyatta National Hospital",
    delivery_unit: "Kenyatta National Hospital",
    flagship_id: 5,
    flagship_title: "Specialized Regional Cancer Centers of Excellence Network",
    start_date: "2024-01-01",
    end_date: "2027-06-30",
    status: "In Progress",
    progress_status: "78%",
    monthly_progress: { "2026-01": 60, "2026-02": 66, "2026-03": 71, "2026-04": 74, "2026-05": 76, "2026-06": 78 },
    progress_calculation_mode: "kpi_derived",
    linked_sub_kpi_codes: ["C3.3"],
    total_budget: 950000000,
    funds_disbursed: 700000000,
    funds_utilized: 650000000
  },
  {
    id: 18,
    programme_title: "Communicable & Non-Communicable Disease Prevention",
    sub_programme: "National Syndemic Diseases Control Council (NSDCC) Multi-Sectoral HIV/AIDS & NCD Prevention Campaign",
    description: "National multi-sectoral behavior change communication, youth engagement, and syndemic disease prevention strategy.",
    remarks: "Community outreach campaigns conducted in 40 high-burden sub-counties.",
    category: "Saga",
    saga_name: "Kenyatta National Hospital",
    delivery_unit: "Kenyatta National Hospital",
    flagship_id: 1,
    flagship_title: "Afya Care UHC Digitization & Electronic Health Records (EHR)",
    start_date: "2024-04-01",
    end_date: "2027-03-31",
    status: "In Progress",
    progress_status: "83%",
    monthly_progress: { "2026-01": 68, "2026-02": 73, "2026-03": 77, "2026-04": 80, "2026-05": 82, "2026-06": 83 },
    progress_calculation_mode: "kpi_derived",
    linked_sub_kpi_codes: ["C4.1"],
    total_budget: 1100000000,
    funds_disbursed: 850000000,
    funds_utilized: 800000000
  },
  {
    id: 19,
    programme_title: "National Referral Facilities and Specialized Services",
    sub_programme: "National Spinal Injury Referral Hospital (NSIRH) Rehabilitation & Spinal Care Expansion",
    description: "Specialized spinal cord injury rehabilitation facilities, physiotherapy robotics, and occupational therapy suites.",
    remarks: "Therapy equipment installed; patient mobility recovery metrics tracked quarterly.",
    category: "Saga",
    saga_name: "Kenyatta National Hospital",
    delivery_unit: "Kenyatta National Hospital",
    flagship_id: 2,
    flagship_title: "National Emergency Medical Services & Critical Care Fund (EMS)",
    start_date: "2024-06-01",
    end_date: "2027-05-31",
    status: "In Progress",
    progress_status: "79%",
    monthly_progress: { "2026-01": 64, "2026-02": 69, "2026-03": 73, "2026-04": 76, "2026-05": 78, "2026-06": 79 },
    progress_calculation_mode: "kpi_derived",
    linked_sub_kpi_codes: ["C1.1"],
    total_budget: 850000000,
    funds_disbursed: 620000000,
    funds_utilized: 580000000
  }
];

export const INITIAL_ACTIONS: ActionPoint[] = [
  {
    id: 1,
    ref_no: "NASCOP-APT-202602",
    date: "2026-01-25",
    meeting_title: "NASCOP Quarterly Review Meeting",
    issue: "Ensure procurement of viral load testing cartridges is expedited with Global Fund prior to stockout threshold.",
    person_responsible: "Dr. Ruth Masha (NASCOP Lead)",
    timeline: "2 weeks",
    status: "ON TRACK",
    action: "Emergency procurement pipeline activated; 250,000 cartridges cleared at Port of Mombasa.",
    resolution_notes: "Distribution manifest signed with KEMSA logistics."
  },
  {
    id: 2,
    ref_no: "APT-20260120-327",
    date: "2026-01-20",
    meeting_title: "Kisumu Hospital Project Deliverables Meeting",
    issue: "Civil works delayed by 6 weeks due to contractor dispute on electrical sub-contracting.",
    person_responsible: "Eng. Peter Mutua (Health Infrastructure)",
    timeline: "10 days",
    status: "STALLED",
    action: "Formal arbitration convened by State Department legal counsel.",
    resolution_notes: "Replacement MEP contractor approved by Ministerial Tender Committee."
  },
  {
    id: 3,
    ref_no: "APT-010",
    date: "2026-01-18",
    meeting_title: "Cancer Awareness & Radiotherapy Status Meeting",
    issue: "Bunker shielding certification for Garissa Regional Oncology Unit awaiting Kenya Nuclear Regulatory Authority clearance.",
    person_responsible: "Dr. Mary Wangari",
    timeline: "3 weeks",
    status: "ON TRACK",
    action: "KNRA radiation protection officers concluded on-site dosimetry verification.",
    resolution_notes: "Permit for source loading issued."
  },
  {
    id: 4,
    ref_no: "APT-009",
    date: "2026-01-12",
    meeting_title: "KNH Burns ICU Equipment Handover",
    issue: "Hyperbaric chamber technical installation manuals require manufacturer engineer sign-off.",
    person_responsible: "Dr. Evans Kimani",
    timeline: "1 week",
    status: "COMPLETED",
    action: "Manufacturer engineers from Germany arrived and signed off testing certificates.",
    resolution_notes: "Commissioning protocol approved."
  },
  {
    id: 5,
    ref_no: "APT-008",
    date: "2026-01-05",
    meeting_title: "KEMSA Supply Chain Overhaul Steering Committee",
    issue: "Integration between KEMSA ERP and County Government Health Management Information Systems (HMIS).",
    person_responsible: "Dr. Joseph Mburu",
    timeline: "1 month",
    status: "ON TRACK",
    action: "API middleware deployed across 24 pilot counties; automated ordering tested successfully.",
    resolution_notes: "Rollout to remaining 23 counties queued."
  }
];

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 1,
    date: "2026-01-25",
    title: "NASCOP Quarterly Review Meeting",
    description: "Review of ART client retention, viral suppression rates, and Global Fund counterpart financing.",
    financier: "The Global Fund & PEPFAR",
    venue: "Afya House 6th Floor Boardroom",
    attendees: "PS Medical Services, NASCOP Directorate, Global Fund Mission Team",
    agenda: "1. Review of Q2 Performance\n2. Cartridge supply continuity\n3. FY 2026/2027 grant allocation",
    decisions: "Approved accelerated procurement of 250,000 viral load kits. Signed off on counterpart contribution.",
    document: "NASCOP_Quarterly_Minutes_Jan2026.pdf"
  },
  {
    id: 2,
    date: "2026-01-20",
    title: "Kisumu Hospital Project Deliverables Meeting",
    description: "Detailed progress evaluation of the Maternal & Child Health Complex civil works.",
    financier: "Government of Kenya (Exchequer) & AFD",
    venue: "Kisumu County Headquarters",
    attendees: "Principal Secretary, Governor Kisumu, Project Manager, Lead Contractor",
    agenda: "1. Contractor progress status\n2. Dispute resolution\n3. revised completion milestones",
    decisions: "Issued formal warning notice to contractor; agreed upon weekly site inspections.",
    document: "Kisumu_Project_Minutes_Jan2026.pdf"
  },
  {
    id: 3,
    date: "2026-01-05",
    title: "Cancer Awareness & Radiotherapy Status Meeting",
    description: "Steering committee for regional oncology expansion and LINAC installation timelines.",
    financier: "OPEC Fund & World Bank",
    venue: "Afya House Boardroom",
    attendees: "Director Health Infrastructure, National Cancer Institute, Chief Radiologist",
    agenda: "1. Bunker construction updates\n2. Nuclear regulatory licensing\n3. Medical physicist staffing",
    decisions: "KNRA inspections approved; 6 medical physicists seconded to Garissa and Nakuru centers.",
    document: "Cancer_Status_Minutes_Jan2026.pdf"
  },
  {
    id: 4,
    date: "2025-12-22",
    title: "Annual General Meeting & Performance Contract Review 2025",
    description: "State Department for Medical Services annual strategic evaluation and KPI sign-off.",
    financier: "Government of Kenya",
    venue: "Kenyatta National Hospital Amphitheater",
    attendees: "Cabinet Secretary, Principal Secretary, all Directorate Heads and SAGA CEOs",
    agenda: "1. Ministerial Scorecard 2024/2025\n2. Performance Contract Targets 2026/2027\n3. Flagship budget allocations",
    decisions: "Adopted performance scorecards; mandated all SAGA projects to connect to priority flagships.",
    document: "AGM_PC_Review_Minutes_Dec2025.pdf"
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 1,
    title: "KNH Modern Burns ICU Commissioning Ceremony",
    description: "Official ministerial opening of the 82-bed specialized burns unit and hyperbaric suite.",
    event_type: "Ministerial Event",
    event_date: "2026-02-15",
    event_time: "09:30",
    location: "KNH Grounds, Nairobi",
    host: "Cabinet Secretary for Health",
    attendees: "PS Medical Services, KNH Board, WHO Country Representative",
    status: "Upcoming"
  },
  {
    id: 2,
    title: "Garissa Regional Oncology Center Bunker Inspection",
    description: "Technical radiation safety inspection with Kenya Nuclear Regulatory Authority.",
    event_type: "Executive Inspection",
    event_date: "2026-02-20",
    event_time: "10:00",
    location: "Garissa Regional Referral Hospital",
    host: "Principal Secretary, Medical Services",
    attendees: "KNRA Inspectors, County Health Executive, Infrastructure Engineers",
    status: "Upcoming"
  },
  {
    id: 3,
    title: "MTRH Multi-Organ Transplant Clean Room Testing Review",
    description: "Handover protocol review with biomedical engineering consortium.",
    event_type: "Field Visit",
    event_date: "2026-02-28",
    event_time: "11:00",
    location: "MTRH, Eldoret",
    host: "CEO, Moi Teaching & Referral Hospital",
    attendees: "Surgical Team, HVAC Engineers, MOH Quality Assurance Officers",
    status: "Upcoming"
  },
  {
    id: 4,
    title: "World Health Assembly Preparatory Delegation Meeting",
    description: "Harmonization of Kenya position paper on global pandemic accord and local pharma manufacturing.",
    event_type: "Meeting",
    event_date: "2026-03-05",
    event_time: "14:00",
    location: "Afya House 7th Floor Executive Wing",
    host: "Principal Secretary",
    attendees: "Director Policy, Legal Counsel, Pharmacy and Poisons Board",
    status: "Upcoming"
  }
];

export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 1,
    report_code: "REP-20260203-1604",
    title: "Quarterly Specialized Surgery Output & Waitlist Evaluation",
    module: "Projects & Programmes",
    project_name: "Kenyatta National Hospital (KNH) Modern Burns ICU & Plastic Surgery Center",
    project_code: "MOH-INF-001",
    description: "Analysis of cardiothoracic, neurosurgical and pediatric surgery caseloads and bed turnover rates.",
    report_date: "2026-02-03",
    created_at: "2026-02-03 16:04:12",
    file_name: "KNH_Surgery_Evaluation_Q2.pdf",
    visibility: "Restricted",
    status: "Pending",
    uploaded_by: "Dr. Evans Kimani"
  },
  {
    id: 2,
    report_code: "REP-20260128-8921",
    title: "KEMSA National Stock Fill Rate & Lead Time Audit",
    module: "Priority Flagships",
    project_name: "KEMSA National Automated Cold-Chain Logistics Hub",
    project_code: "MOH-SAGA-003",
    description: "Assessment of order fulfillment for tracer essential medicines across 47 counties.",
    report_date: "2026-01-28",
    created_at: "2026-01-28 11:20:00",
    file_name: "KEMSA_Stock_Fill_Audit_Jan2026.xlsx",
    visibility: "Public",
    status: "Approved",
    uploaded_by: "System Administrator"
  },
  {
    id: 3,
    report_code: "REP-20260115-4420",
    title: "Afya Care UHC Digitization Facility Readiness Assessment",
    module: "Priority Flagships",
    project_name: "Afya Care UHC Digitization & Electronic Health Records",
    project_code: "FLAGSHIP-01",
    description: "Power, LAN cabling, and terminal hardware readiness across 1,200 Level 4 health centers.",
    report_date: "2026-01-15",
    created_at: "2026-01-15 09:15:33",
    file_name: "UHC_Digital_Readiness_Report.pdf",
    visibility: "Public",
    status: "Approved",
    uploaded_by: "Dr. Rose Njeru"
  },
  {
    id: 4,
    report_code: "REP-20260109-7639",
    title: "Financial Audit of Global Fund HIV/TB Counterpart Fund Allocations",
    module: "Finance & Grants",
    project_name: "NASCOP Strategic Programmes",
    project_code: "MOH-PROG-008",
    description: "Internal auditor review on grant compliance and treasury counterpart liquidity.",
    report_date: "2026-01-09",
    created_at: "2026-01-09 14:40:00",
    file_name: "GlobalFund_Audit_Q2_Confidential.pdf",
    visibility: "Confidential",
    status: "Approved",
    uploaded_by: "System Administrator"
  }
];

export const INITIAL_KPIS: PerformanceKPI[] = [
  // ==================== CATEGORY A: FINANCIAL STEWARDSHIP (10%) ====================
  {
    id: 1,
    code: "A1",
    category: "Financial Stewardship",
    parent_kpi_name: "Financial Stewardship & Fiscal Discipline",
    parent_kpi_code: "A",
    category_weight: 10,
    sub_kpi_weight: 2,
    delivery_unit: "Directorate of Finance & Accounts",
    programme: "Programme 5: General Administration & Financial Services",
    key_outputs: "100% absorption of exchequer releases for GoK development & recurrent votes",
    kpi_name: "Absorption of Allocated Funds (GoK)",
    baseline_score: "96.94%",
    target_2025_26: "100%",
    actual_2025_26: "96.94%",
    target_baseline_2026_27: "100%",
    target_2027_28: "100%",
    current_achievement: 97.4,
    q1_score: 96.0,
    q2_score: 97.0,
    q3_score: 98.0,
    q4_score: 98.5,
    status: "Approved",
    financial_year: "2026/2027",
    variance_comment: "GoK exchequer releases timely; absorption accelerated in development expenditure votes.",
    linked_project_ids: [6]
  },
  {
    id: 2,
    code: "A2",
    category: "Financial Stewardship",
    parent_kpi_name: "Financial Stewardship & Fiscal Discipline",
    parent_kpi_code: "A",
    category_weight: 10,
    sub_kpi_weight: 2,
    delivery_unit: "SAGAs & National Referral Facilities (KNH, MTRH, KUTRRH)",
    programme: "Programme 5: General Administration & Financial Services",
    key_outputs: "Internal revenue collection generated and absorbed in line with PFM Act",
    kpi_name: "Appropriation-In-Aid (A-in-A) Collection & Absorption",
    baseline_score: "94.50%",
    target_2025_26: "100%",
    actual_2025_26: "94.50%",
    target_baseline_2026_27: "100%",
    target_2027_28: "100%",
    current_achievement: 94.4,
    q1_score: 92.0,
    q2_score: 94.0,
    q3_score: 95.5,
    q4_score: 96.0,
    status: "Approved",
    financial_year: "2026/2027",
    variance_comment: "Revenue streams automated through digital payment gateway integration with e-Citizen.",
    linked_project_ids: [1, 2]
  },
  {
    id: 3,
    code: "A3",
    category: "Financial Stewardship",
    parent_kpi_name: "Financial Stewardship & Fiscal Discipline",
    parent_kpi_code: "A",
    category_weight: 10,
    sub_kpi_weight: 3,
    delivery_unit: "Directorate of Planning & External Health Financing",
    programme: "Programme 5: General Administration & Financial Services",
    key_outputs: "100% absorption of multilateral and bilateral partner health allocations",
    kpi_name: "Absorption of Externally Mobilized Funds (Donor & Partner Grants)",
    baseline_score: "88.20%",
    target_2025_26: "100%",
    actual_2025_26: "88.20%",
    target_baseline_2026_27: "100%",
    target_2027_28: "100%",
    current_achievement: 88.5,
    q1_score: 85.0,
    q2_score: 87.0,
    q3_score: 90.0,
    q4_score: 92.0,
    status: "Approved",
    financial_year: "2026/2027",
    variance_comment: "Grant drawdown accelerated; procurement plans aligned with Global Fund NFM3 cycle.",
    linked_project_ids: [9]
  },
  {
    id: 4,
    code: "A4",
    category: "Financial Stewardship",
    parent_kpi_name: "Financial Stewardship & Fiscal Discipline",
    parent_kpi_code: "A",
    category_weight: 10,
    sub_kpi_weight: 3,
    delivery_unit: "Finance & Accounts, Procurement Division",
    programme: "Programme 5: General Administration & Financial Services",
    key_outputs: "Progressive reduction and clearance of eligible verified supplier & contractor pending bills",
    kpi_name: "Pending Bills Ratio & Historical Debt Settlement",
    baseline_score: "91.00%",
    target_2025_26: "100%",
    actual_2025_26: "91.00%",
    target_baseline_2026_27: "100%",
    target_2027_28: "100%",
    current_achievement: 91.1,
    q1_score: 88.0,
    q2_score: 90.0,
    q3_score: 92.5,
    q4_score: 94.0,
    status: "Approved",
    financial_year: "2026/2027",
    variance_comment: "Dedicated first-in-first-out pending bills liquidation matrix deployed with National Treasury.",
    linked_project_ids: []
  },

  // ==================== CATEGORY B: SERVICE DELIVERY (15%) ====================
  {
    id: 5,
    code: "B1",
    category: "Service Delivery",
    parent_kpi_name: "Service Delivery & Public Engagement",
    parent_kpi_code: "B",
    category_weight: 15,
    sub_kpi_weight: 7.5,
    delivery_unit: "Directorate of Administration & Public Communications",
    programme: "Programme 5: General Administration & Financial Services",
    key_outputs: "Full compliance with published service response timelines and citizen charter standards",
    kpi_name: "Implementation of Citizen Service Delivery Charter",
    baseline_score: "95.00%",
    target_2025_26: "100%",
    actual_2025_26: "95.00%",
    target_baseline_2026_27: "100%",
    target_2027_28: "100%",
    current_achievement: 96.6,
    q1_score: 94.0,
    q2_score: 96.0,
    q3_score: 98.0,
    q4_score: 98.5,
    status: "Approved",
    financial_year: "2026/2027",
    variance_comment: "Customer feedback desks operationalized at Afya House and regional referral hospital entrances.",
    linked_project_ids: []
  },
  {
    id: 6,
    code: "B2",
    category: "Service Delivery",
    parent_kpi_name: "Service Delivery & Public Engagement",
    parent_kpi_code: "B",
    category_weight: 15,
    sub_kpi_weight: 7.5,
    delivery_unit: "Directorate of Health Informatics & Digital Health",
    programme: "Programme 5: General Administration & Financial Services",
    key_outputs: "100% onboarding of ministerial licensing, permits, and correspondence to e-Citizen",
    kpi_name: "Digitalization of Government Services & End-to-End Automation",
    baseline_score: "80.00%",
    target_2025_26: "100%",
    actual_2025_26: "80.00%",
    target_baseline_2026_27: "100%",
    target_2027_28: "100%",
    current_achievement: 87.6,
    q1_score: 82.0,
    q2_score: 86.0,
    q3_score: 90.0,
    q4_score: 92.5,
    status: "Approved",
    financial_year: "2026/2027",
    variance_comment: "Electronic document management system integrated with GOK e-Citizen portal and Taifa Care.",
    linked_project_ids: [4, 7]
  },

  // ==================== CATEGORY C: CORE MANDATE (60%) ====================
  // --- C1: Universal Health Coverage & Primary Care (15%) ---
  {
    id: 7,
    code: "C1.1",
    category: "Core Mandate",
    parent_kpi_name: "Universal Health Coverage & Primary Health Care Networks",
    parent_kpi_code: "C1",
    category_weight: 60,
    sub_kpi_weight: 5,
    delivery_unit: "Primary Healthcare Directorate",
    programme: "Programme 2: Primary Health Care",
    key_outputs: "Established and fully operational Primary Care Networks connecting Level 2/3 to Level 4 hubs",
    kpi_name: "Operationalization of Primary Care Networks (PCNs)",
    baseline_score: "45 PCNs",
    target_2025_26: "150 PCNs",
    actual_2025_26: "120 PCNs",
    target_baseline_2026_27: "315 PCNs",
    target_2027_28: "315 PCNs",
    current_achievement: 76.0,
    q1_score: 70.0,
    q2_score: 74.0,
    q3_score: 78.0,
    q4_score: 82.0,
    status: "Approved",
    financial_year: "2026/2027",
    variance_comment: "185 PCNs currently operational; county health team sensitization underway in high-burden counties.",
    linked_project_ids: [4, 6]
  },
  {
    id: 8,
    code: "C1.2",
    category: "Core Mandate",
    parent_kpi_name: "Universal Health Coverage & Primary Health Care Networks",
    parent_kpi_code: "C1",
    category_weight: 60,
    sub_kpi_weight: 5,
    delivery_unit: "Directorate of Health Informatics & Digital Health",
    programme: "Programme 2: Primary Health Care",
    key_outputs: "Deployment of standardized enterprise EHR software across Level 4, 5, and 6 referral facilities",
    kpi_name: "Afya Care UHC Digitization & Electronic Health Records (EHR)",
    baseline_score: "60 facilities",
    target_2025_26: "80 facilities",
    actual_2025_26: "68 facilities",
    target_baseline_2026_27: "100% Facilities",
    target_2027_28: "100% Facilities",
    current_achievement: 65.8,
    q1_score: 60.0,
    q2_score: 65.0,
    q3_score: 68.0,
    q4_score: 70.0,
    status: "Approved",
    financial_year: "2026/2027",
    variance_comment: "National Health Information Exchange (HIE) integration progressing with SHA claims system.",
    linked_project_ids: [7]
  },
  {
    id: 9,
    code: "C1.3",
    category: "Core Mandate",
    parent_kpi_name: "Universal Health Coverage & Primary Health Care Networks",
    parent_kpi_code: "C1",
    category_weight: 60,
    sub_kpi_weight: 5,
    delivery_unit: "Community Health Directorate",
    programme: "Programme 2: Primary Health Care",
    key_outputs: "100,000 equipped, trained and digitized Community Health Promoters reporting on e-CHIS",
    kpi_name: "Community Health Promoters (CHP) Kits & Digital Registry",
    baseline_score: "80,000 Promoters",
    target_2025_26: "100,000 Promoters",
    actual_2025_26: "98,500 Promoters",
    target_baseline_2026_27: "100,000 Promoters",
    target_2027_28: "100,000 Promoters",
    current_achievement: 92.8,
    q1_score: 90.0,
    q2_score: 92.0,
    q3_score: 94.0,
    q4_score: 95.0,
    status: "Approved",
    financial_year: "2026/2027",
    variance_comment: "Diagnostic kits and smartphones distributed across 47 counties; stipends paid on time.",
    linked_project_ids: [11]
  },

  // --- C2: Access to Health Products and Technologies (15%) ---
  {
    id: 10,
    code: "C2.1",
    category: "Core Mandate",
    parent_kpi_name: "Access to Health Products & Technologies (HPT)",
    parent_kpi_code: "C2",
    category_weight: 60,
    sub_kpi_weight: 6,
    delivery_unit: "Kenya Medical Supplies Authority (KEMSA)",
    programme: "Programme 3: Medical Commodities Security",
    key_outputs: "Timely order fulfillment and turnaround reduction for health facilities nationwide",
    kpi_name: "Percentage Order Fill Rate for Essential Health Packages (KEMSA)",
    baseline_score: "81.0%",
    target_2025_26: "85.0%",
    actual_2025_26: "81.0%",
    target_baseline_2026_27: "90.0%",
    target_2027_28: "95.0%",
    current_achievement: 90.3,
    q1_score: 84.0,
    q2_score: 89.0,
    q3_score: 93.0,
    q4_score: 95.2,
    status: "Approved",
    financial_year: "2026/2027",
    variance_comment: "Turnaround cut from 23 to 10 days; Kisumu and Mombasa regional distribution hubs active.",
    linked_project_ids: [3]
  },
  {
    id: 11,
    code: "C2.2",
    category: "Core Mandate",
    parent_kpi_name: "Access to Health Products & Technologies (HPT)",
    parent_kpi_code: "C2",
    category_weight: 60,
    sub_kpi_weight: 5,
    delivery_unit: "Directorate of Health Products and Technologies (HPT)",
    programme: "Programme 3: Medical Commodities Security",
    key_outputs: "Zero stockouts of critical tracer medicines, EPI vaccines, and emergency trauma kits",
    kpi_name: "Buffer Stock Availability of Vital Commodities & Vaccines",
    baseline_score: "85.0%",
    target_2025_26: "90.0%",
    actual_2025_26: "87.0%",
    target_baseline_2026_27: "95.0%",
    target_2027_28: "98.0%",
    current_achievement: 84.5,
    q1_score: 80.0,
    q2_score: 84.0,
    q3_score: 86.0,
    q4_score: 88.0,
    status: "Approved",
    financial_year: "2026/2027",
    variance_comment: "National vaccine security fund maintained; buffer stocks at 6 months threshold.",
    linked_project_ids: [3]
  },
  {
    id: 12,
    code: "C2.3",
    category: "Core Mandate",
    parent_kpi_name: "Access to Health Products & Technologies (HPT)",
    parent_kpi_code: "C2",
    category_weight: 60,
    sub_kpi_weight: 4,
    delivery_unit: "Directorate of Health Products and Technologies (HPT)",
    programme: "Programme 3: Medical Commodities Security",
    key_outputs: "Promulgation of national essential medicine list and medical device standard regulations",
    kpi_name: "Percentage Completion of National HPT Policies & Formulary Guidelines",
    baseline_score: "40.0%",
    target_2025_26: "60.0%",
    actual_2025_26: "60.0%",
    target_baseline_2026_27: "100.0%",
    target_2027_28: "100.0%",
    current_achievement: 95.8,
    q1_score: 90.0,
    q2_score: 95.0,
    q3_score: 98.0,
    q4_score: 100.0,
    status: "Approved",
    financial_year: "2026/2027",
    variance_comment: "Public stakeholder consultation finalized; awaiting cabinet policy memorandum approval.",
    linked_project_ids: []
  },

  // --- C3: Specialized Healthcare Services & Referral Facilities (15%) ---
  {
    id: 13,
    code: "C3.1",
    category: "Core Mandate",
    parent_kpi_name: "Specialized Healthcare Services & Referral Facilities",
    parent_kpi_code: "C3",
    category_weight: 60,
    sub_kpi_weight: 4,
    delivery_unit: "Kenyatta National Hospital & KUTRRH",
    programme: "Programme 1: National Referral Facilities",
    key_outputs: "Specialized adult and pediatric cardiothoracic and open-heart surgical interventions",
    kpi_name: "Number of Heart and Cardiothoracic Surgeries Conducted",
    baseline_score: "630 Surgeries",
    target_2025_26: "784 Surgeries",
    actual_2025_26: "630 Surgeries",
    target_baseline_2026_27: "850 Surgeries",
    target_2027_28: "920 Surgeries",
    current_achievement: 91.0,
    q1_score: 88.0,
    q2_score: 90.0,
    q3_score: 92.0,
    q4_score: 94.0,
    status: "Approved",
    financial_year: "2026/2027",
    variance_comment: "Surgical suites operating double shifts to reduce national cardiothoracic waitlist.",
    linked_project_ids: [1, 5]
  },
  {
    id: 14,
    code: "C3.2",
    category: "Core Mandate",
    parent_kpi_name: "Specialized Healthcare Services & Referral Facilities",
    parent_kpi_code: "C3",
    category_weight: 60,
    sub_kpi_weight: 4,
    delivery_unit: "Kenyatta National Hospital Renal Center & MTRH",
    programme: "Programme 1: National Referral Facilities",
    key_outputs: "Living donor renal transplants and post-operative immunosuppression management",
    kpi_name: "Number of Kidney Transplants Conducted",
    baseline_score: "22 Transplants",
    target_2025_26: "24 Transplants",
    actual_2025_26: "22 Transplants",
    target_baseline_2026_27: "30 Transplants",
    target_2027_28: "36 Transplants",
    current_achievement: 91.3,
    q1_score: 85.0,
    q2_score: 90.0,
    q3_score: 95.0,
    q4_score: 95.0,
    status: "Approved",
    financial_year: "2026/2027",
    variance_comment: "Tissue matching laboratories calibrated with Kenya Tissue and Transplant Authority.",
    linked_project_ids: [2]
  },
  {
    id: 15,
    code: "C3.3",
    category: "Core Mandate",
    parent_kpi_name: "Specialized Healthcare Services & Referral Facilities",
    parent_kpi_code: "C3",
    category_weight: 60,
    sub_kpi_weight: 4,
    delivery_unit: "KNH, MTRH, JOOTRH",
    programme: "Programme 1: National Referral Facilities",
    key_outputs: "Endoscopic, laparoscopic, and keyhole surgeries reducing patient average stay",
    kpi_name: "Number of Minimally Invasive & Laparoscopic Surgeries",
    baseline_score: "13,370 Surgeries",
    target_2025_26: "13,916 Surgeries",
    actual_2025_26: "13,370 Surgeries",
    target_baseline_2026_27: "14,400 Surgeries",
    target_2027_28: "15,200 Surgeries",
    current_achievement: 95.8,
    q1_score: 92.0,
    q2_score: 95.0,
    q3_score: 98.0,
    q4_score: 98.0,
    status: "Approved",
    financial_year: "2026/2027",
    variance_comment: "Modern theater laparoscopic towers delivered to MTRH and JOOTRH referral facilities.",
    linked_project_ids: [1]
  },
  {
    id: 16,
    code: "C3.4",
    category: "Core Mandate",
    parent_kpi_name: "Specialized Healthcare Services & Referral Facilities",
    parent_kpi_code: "C3",
    category_weight: 60,
    sub_kpi_weight: 3,
    delivery_unit: "KUTRRH Oncology Center & Regional Cancer Centers",
    programme: "Programme 1: National Referral Facilities",
    key_outputs: "High-precision robotic stereotactic radiosurgery and cancer radiotherapy sessions",
    kpi_name: "Oncology CyberKnife, PET-CT and Radiotherapy Sessions",
    baseline_score: "12,685 Sessions",
    target_2025_26: "48,846 Sessions",
    actual_2025_26: "12,685 Sessions",
    target_baseline_2026_27: "48,000 Sessions",
    target_2027_28: "52,000 Sessions",
    current_achievement: 87.5,
    q1_score: 82.0,
    q2_score: 86.0,
    q3_score: 90.0,
    q4_score: 92.0,
    status: "Approved",
    financial_year: "2026/2027",
    variance_comment: "Regional bunker commissioning in Garissa and Nakuru expanding oncology coverage.",
    linked_project_ids: [8]
  },

  // --- C4: Communicable & Non-Communicable Disease Control (15%) ---
  {
    id: 17,
    code: "C4.1",
    category: "Core Mandate",
    parent_kpi_name: "Communicable & Non-Communicable Disease Control",
    parent_kpi_code: "C4",
    category_weight: 60,
    sub_kpi_weight: 8,
    delivery_unit: "NASCOP & NSDCC",
    programme: "Programme 4: Communicable Disease Control",
    key_outputs: "95-95-95 UNAIDS targets: sustained antiretroviral therapy and viral suppression",
    kpi_name: "People Living with HIV Currently Receiving Sustained ART",
    baseline_score: "1,310,000 Clients",
    target_2025_26: "1,325,522 Clients",
    actual_2025_26: "1,310,000 Clients",
    target_baseline_2026_27: "1,350,000 Clients",
    target_2027_28: "1,380,000 Clients",
    current_achievement: 97.5,
    q1_score: 96.0,
    q2_score: 97.0,
    q3_score: 98.0,
    q4_score: 98.8,
    status: "Approved",
    financial_year: "2026/2027",
    variance_comment: "Viral load suppression sustained at 96.2% across all 47 counties.",
    linked_project_ids: [9]
  },
  {
    id: 18,
    code: "C4.2",
    category: "Core Mandate",
    parent_kpi_name: "Communicable & Non-Communicable Disease Control",
    parent_kpi_code: "C4",
    category_weight: 60,
    sub_kpi_weight: 7,
    delivery_unit: "Kenya National Blood Transfusion Service (KNBTS)",
    programme: "Programme 4: Communicable Disease Control",
    key_outputs: "Safe, screened voluntary blood units mobilized and distributed to county blood banks",
    kpi_name: "Units of Whole Blood Collected and Screened via Damu-KE",
    baseline_score: "312,000 Units",
    target_2025_26: "350,000 Units",
    actual_2025_26: "312,000 Units",
    target_baseline_2026_27: "400,000 Units",
    target_2027_28: "450,000 Units",
    current_achievement: 85.5,
    q1_score: 80.0,
    q2_score: 85.0,
    q3_score: 88.0,
    q4_score: 89.1,
    status: "Approved",
    financial_year: "2026/2027",
    variance_comment: "School donation drives and Damu-KE mobile app mobilization launched nationwide.",
    linked_project_ids: [12]
  },

  // ==================== CATEGORY D: IMPLEMENTATION OF PRESIDENTIAL DIRECTIVES (2%) ====================
  {
    id: 19,
    code: "D1",
    category: "Implementation of Presidential Directives",
    parent_kpi_name: "Implementation of Presidential Directives & Cabinet Resolutions",
    parent_kpi_code: "D",
    category_weight: 2,
    sub_kpi_weight: 2,
    delivery_unit: "Office of the Cabinet Secretary & Policy Delivery Unit",
    programme: "Programme 5: General Administration & Infrastructure",
    key_outputs: "100% tracking and execution of executive health sector directives and presidential priority pronouncements",
    kpi_name: "Executive Directives & Cabinet Resolution Tracking",
    baseline_score: "90.0%",
    target_2025_26: "100.0%",
    actual_2025_26: "94.0%",
    target_baseline_2026_27: "100.0%",
    target_2027_28: "100.0%",
    current_achievement: 94.0,
    q1_score: 90.0,
    q2_score: 94.0,
    q3_score: 96.0,
    q4_score: 98.0,
    status: "Approved",
    financial_year: "2026/2027",
    variance_comment: "Weekly monitoring cadence established for all presidential health initiatives.",
    linked_project_ids: []
  },

  // ==================== CATEGORY E: AFFIRMATIVE ACTION IN PROCUREMENT (4%) ====================
  {
    id: 20,
    code: "E1",
    category: "Affirmative Action in Procurement",
    parent_kpi_name: "Affirmative Action in Procurement (AGPO & Local Manufacturing)",
    parent_kpi_code: "E",
    category_weight: 4,
    sub_kpi_weight: 4,
    delivery_unit: "Procurement & Supply Chain Directorate",
    programme: "Programme 5: General Administration & Infrastructure",
    key_outputs: "Access to Government Procurement Opportunities (AGPO) for Youth, Women, and PWDs",
    kpi_name: "AGPO Allocation & Preferential Procurement for Local HPT",
    baseline_score: "30.0%",
    target_2025_26: "30.0%",
    actual_2025_26: "31.2%",
    target_baseline_2026_27: "30.0%",
    target_2027_28: "30.0%",
    current_achievement: 93.5,
    q1_score: 90.0,
    q2_score: 92.0,
    q3_score: 95.0,
    q4_score: 96.0,
    status: "Approved",
    financial_year: "2026/2027",
    variance_comment: "AGPO quotas fully met; preferential procurement list adopted across health agencies.",
    linked_project_ids: []
  },

  // ==================== CATEGORY F: CROSS-CUTTING (4%) ====================
  {
    id: 21,
    code: "F1",
    category: "Cross-Cutting",
    parent_kpi_name: "Cross-Cutting & Institutional Strengthening",
    parent_kpi_code: "F",
    category_weight: 4,
    sub_kpi_weight: 2,
    delivery_unit: "Internal Audit Directorate & Ministerial Ethics Committee",
    programme: "Programme 5: General Administration & Infrastructure",
    key_outputs: "100% implementation of Auditor General recommendations and EACC compliance",
    kpi_name: "Corruption Prevention, Ethical Standards & Statutory Audits",
    baseline_score: "90.0%",
    target_2025_26: "100.0%",
    actual_2025_26: "90.0%",
    target_baseline_2026_27: "100.0%",
    target_2027_28: "100.0%",
    current_achievement: 93.3,
    q1_score: 90.0,
    q2_score: 92.0,
    q3_score: 95.0,
    q4_score: 96.0,
    status: "Approved",
    financial_year: "2026/2027",
    variance_comment: "Quarterly internal audits conducted across all directorates and SAGAs.",
    linked_project_ids: []
  },
  {
    id: 22,
    code: "F2",
    category: "Cross-Cutting",
    parent_kpi_name: "Cross-Cutting & Institutional Strengthening",
    parent_kpi_code: "F",
    category_weight: 4,
    sub_kpi_weight: 2,
    delivery_unit: "Human Resource Management & Social Inclusion Directorate",
    programme: "Programme 5: General Administration & Infrastructure",
    key_outputs: "5% progressive recruitment of PWDs, 30% AGPO procurement compliance, and gender parity",
    kpi_name: "National Cohesion, Disability & Gender Mainstreaming",
    baseline_score: "85.0%",
    target_2025_26: "100.0%",
    actual_2025_26: "85.0%",
    target_baseline_2026_27: "100.0%",
    target_2027_28: "100.0%",
    current_achievement: 91.0,
    q1_score: 88.0,
    q2_score: 90.0,
    q3_score: 92.0,
    q4_score: 94.0,
    status: "Approved",
    financial_year: "2026/2027",
    variance_comment: "AGPO youth and women access to ministerial tenders monitored monthly.",
    linked_project_ids: []
  }
];


export const INITIAL_USERS: SystemUser[] = [
  {
    id: 1,
    full_name: "Dr. Rose Njeru",
    email: "admin@health.go.ke",
    role: "System Administrator",
    directorate: "Executive Office of the Principal Secretary",
    is_active: true,
    can_upload: true,
    can_edit: true,
    can_approve: true,
    can_download: true,
    is_admin: true,
    last_login: "2026-02-14 08:12:45"
  },
  {
    id: 2,
    full_name: "Eng. Peter Mutua",
    email: "p.mutua@health.go.ke",
    role: "Director Infrastructure",
    directorate: "Health Infrastructure & Referral Facilities",
    is_active: true,
    can_upload: true,
    can_edit: true,
    can_approve: true,
    can_download: true,
    is_admin: false,
    last_login: "2026-02-14 07:45:10"
  },
  {
    id: 3,
    full_name: "Dr. Evans Kimani",
    email: "e.kimani@health.go.ke",
    role: "Chief Health Officer",
    directorate: "Emergency Medical Care Directorate",
    is_active: true,
    can_upload: true,
    can_edit: true,
    can_approve: false,
    can_download: true,
    is_admin: false,
    last_login: "2026-02-14 07:45:10"
  },
  {
    id: 4,
    full_name: "Faith Chebet",
    email: "f.chebet@health.go.ke",
    role: "M&E Officer",
    directorate: "Planning, Policy and Healthcare Financing",
    is_active: true,
    can_upload: true,
    can_edit: false,
    can_approve: false,
    can_download: true,
    is_admin: false,
    last_login: "2026-02-14 07:45:10"
  }
  ,
  {
    id: 5,
    full_name: "Dr. Harry Kimtai",
    email: "ps@health.go.ke",
    role: "Principal Secretary (PS-SDMS)",
    directorate: "Executive Office of the Principal Secretary",
    is_active: true,
    can_upload: true,
    can_edit: true,
    can_approve: true,
    can_download: true,
    is_admin: true,
    last_login: "2026-02-14 06:58:02"
  }
];

export interface AuditLogItem {
  id: number;
  user_name: string;
  email: string;
  action: 'login' | 'create' | 'update' | 'delete' | 'approve' | 'backup' | 'export';
  module: string;
  record_id?: number | string;
  details: string;
  ip_address: string;
  timestamp: string;
}

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 1,
    user_name: "Dr. Rose Njeru",
    email: "admin@health.go.ke",
    action: "login",
    module: "Authentication",
    record_id: 1,
    details: "User admin authenticated successfully via Afya House perimeter proxy.",
    ip_address: "196.201.214.18",
    timestamp: "2026-03-24 07:15:22"
  },
  {
    id: 2,
    user_name: "Dr. Rose Njeru",
    email: "admin@health.go.ke",
    action: "create",
    module: "Projects & Programmes",
    record_id: 146,
    details: "Registered new programme: National Equipment Service Programme (NESP) - KES 150B PPP.",
    ip_address: "196.201.214.18",
    timestamp: "2026-03-24 08:30:10"
  },
  {
    id: 3,
    user_name: "Eng. Peter Mutua",
    email: "p.mutua@health.go.ke",
    action: "update",
    module: "Projects & Programmes",
    record_id: 132,
    details: "Updated progress status of KNH Burns and Pediatrics Centre to 43% with slab completion.",
    ip_address: "102.219.208.5",
    timestamp: "2026-03-24 09:12:44"
  },
  {
    id: 4,
    user_name: "Dr. Rose Njeru",
    email: "admin@health.go.ke",
    action: "approve",
    module: "Reports",
    record_id: 2,
    details: "Executive approval granted for Global Fund HIV Grant NFM3 Performance Submission (REP-20260203-1604).",
    ip_address: "196.201.214.18",
    timestamp: "2026-03-24 10:05:18"
  },
  {
    id: 5,
    user_name: "Faith Chebet",
    email: "f.chebet@health.go.ke",
    action: "update",
    module: "Performance Contract",
    record_id: 1,
    details: "Updated KNH cardiothoracic surgeries Q3 score to 89% and current achievement to 88.5%.",
    ip_address: "196.201.214.22",
    timestamp: "2026-03-24 11:20:00"
  },
  {
    id: 6,
    user_name: "Dr. Evans Kimani",
    email: "e.kimani@health.go.ke",
    action: "update",
    module: "Action Points",
    record_id: 4,
    details: "Marked Action Point APT-004 as COMPLETED with procurement confirmation notes.",
    ip_address: "102.219.208.5",
    timestamp: "2026-03-24 12:45:33"
  },
  {
    id: 7,
    user_name: "Dr. Rose Njeru",
    email: "admin@health.go.ke",
    action: "backup",
    module: "cPanel & Backup",
    record_id: 1,
    details: "Triggered full transactional SQL backup dump: ppsdms_backup_2026-03-24_13-00.sql",
    ip_address: "196.201.214.18",
    timestamp: "2026-03-24 13:00:15"
  },
  {
    id: 8,
    user_name: "Dr. Rose Njeru",
    email: "admin@health.go.ke",
    action: "export",
    module: "Audit Logs",
    record_id: 0,
    details: "Exported 250 audit log events to CSV for ministerial oversight inspection.",
    ip_address: "196.201.214.18",
    timestamp: "2026-03-24 13:10:02"
  }
];

export interface ProjectMonthlyProgress {
  id: number;
  project_id: number;
  year_month: string;
  target_pct: number;
  achieved_pct: number;
  kpi_code?: string;
  kpi_name?: string;
  kpi_target?: number;
  kpi_achieved?: number;
  kpi_unit?: string;
  remarks?: string;
}

export const INITIAL_MONTHLY_PROGRESS: ProjectMonthlyProgress[] = [
  { id: 1, project_id: 9, year_month: 'Jan 2026', target_pct: 38.0, achieved_pct: 37.7, kpi_code: 'A,B,C,D', kpi_name: 'Composite KPI Contribution', remarks: 'Jan 2026 baseline evaluation' },
  { id: 2, project_id: 9, year_month: 'Feb 2026', target_pct: 39.0, achieved_pct: 38.3, kpi_code: 'A,B,C,D', kpi_name: 'Composite KPI Contribution', remarks: 'Feb 2026 progress update' },
  { id: 3, project_id: 9, year_month: 'Mar 2026', target_pct: 40.0, achieved_pct: 39.0, kpi_code: 'A,B,C,D', kpi_name: 'Composite KPI Contribution', remarks: 'Q3 audit verification' },
  { id: 4, project_id: 9, year_month: 'Apr 2026', target_pct: 40.5, achieved_pct: 39.5, kpi_code: 'A,B,C,D', kpi_name: 'Composite KPI Contribution', remarks: 'April milestone review' },
  { id: 5, project_id: 9, year_month: 'May 2026', target_pct: 41.0, achieved_pct: 40.0, kpi_code: 'A,B,C,D', kpi_name: 'Composite KPI Contribution', remarks: 'May progress check' },
  { id: 6, project_id: 9, year_month: 'Jun 2026', target_pct: 41.5, achieved_pct: 40.5, kpi_code: 'A,B,C,D', kpi_name: 'Composite KPI Contribution', remarks: 'Mid-year performance evaluation' },
  { id: 7, project_id: 9, year_month: 'Jul 2026', target_pct: 42.0, achieved_pct: 40.9, kpi_code: 'A,B,C,D', kpi_name: 'Composite KPI Contribution', remarks: 'Q1 2026/27 review' },
  { id: 8, project_id: 9, year_month: 'Aug 2026', target_pct: 42.5, achieved_pct: 41.3, kpi_code: 'A,B,C,D', kpi_name: 'Composite KPI Contribution', remarks: 'August monitoring report' },
  { id: 9, project_id: 9, year_month: 'Sep 2026', target_pct: 43.0, achieved_pct: 41.8, kpi_code: 'A,B,C,D', kpi_name: 'Composite KPI Contribution', remarks: 'September update' },
  { id: 10, project_id: 9, year_month: 'Oct 2026', target_pct: 43.5, achieved_pct: 41.9, kpi_code: 'A,B,C,D', kpi_name: 'Composite KPI Contribution', remarks: 'October active cycle' },
];
