# Ministry of Health — State Department for Medical Services
## Project Performance, Service Delivery & Operational Management System (PP-SDOMS)
### Comprehensive System Documentation & Technical Manual

---

### 1. Executive Summary & Strategic Scope
The **Project Performance, Service Delivery & Operational Management System (PP-SDOMS)** is a ministerial management platform developed for the **State Department for Medical Services, Ministry of Health, Republic of Kenya**.

The system operationalizes executive monitoring, resource tracking, and performance evaluation across:
- Universal Health Coverage (UHC) delivery pillars
- Strategic priority flagship initiatives
- Directorate and Semi-Autonomous Government Agencies (SAGAs) capital project portfolios
- Annual Performance Contracts (PC) and ministerial KPI scorecards
- Executive field visits, multilateral and bilateral donor financing agreements
- Action points tracking, correspondence mail management, and physical visitor registries

---

### 2. Architecture & Tech Stack

#### 2.1 Backend Architecture
- **Language / Runtime:** PHP 8.1+ (Object-oriented & functional standard libraries).
- **Database Engine:** MySQL 5.7+ / MariaDB 10.3+ using native `PDO` with prepared statements and transactions.
- **Security Protocols:**
  - Strict session handling (`HttpOnly`, `SameSite=Lax`, secure cookie flags, 30-minute session regeneration).
  - Cryptographic token generation (`hash_equals`) protecting all mutating requests against Cross-Site Request Forgery (CSRF).
  - Centralized audit logging capturing User ID, IP Address, HTTP User-Agent, module, and timestamp on all CRUD events.
  - Rate limiting & brute-force defense: Automatic account locking after 5 consecutive failed logins.
  - Role-Based Access Control (RBAC): `can_upload`, `can_edit`, `can_approve_tasks`, `can_download`, `is_admin`.

#### 2.2 Frontend UX & UI Architecture
- **Styling & Framework:** Bootstrap 5.3 + Tailwind CSS utility principles + FontAwesome 6 Pro icons.
- **Branding:** Official Government of Kenya aesthetic: Navy Blue (`#0a2558`), Royal Blue (`#0d47a1`), Light Slate Blue (`#1976d2`), with high-contrast text and crisp card containers.
- **Typography:** `Plus Jakarta Sans` for clean typography and `JetBrains Mono` for monetary numbers and reference codes.
- **Analytics Visualization:** Chart.js 4 for status distribution and risk heatmaps.

---

### 3. Core Functional Modules

#### 3.1 Executive Dashboard (`dashboard.php`)
- **Quick Access Hub:** 10 primary action cards matching the ministerial dashboard structure.
- **High-Level KPI Counters:** Project Portfolio Count, Total Allocated Budget in KES, Open Action Points, Pending Reports.
- **Interactive Visualizations:** Project Status distribution (Doughnut Chart) and Flagship Risk Levels (Bar Chart).
- **Recent Action Items & Live Audit Trail:** Real-time stream of user actions across the department.

#### 3.2 Priority Flagships (`modules/flagships.php`)
- Strategic multi-year initiatives (e.g. Afya Care UHC Digitization, National Emergency Medical Services Fund, KEMSA Supply Chain Overhaul).
- Tracks Risk Level (`Low`, `Medium`, `High`, `Severe`), Priority Tier (`Critical`, `High`, `Medium`, `Low`), Progress %, Budget Allocation vs Utilization, Timeline Variance, and Linked Directorate Projects.

#### 3.3 Projects & Programmes (`modules/projects.php`)
- Comprehensive portfolio management of medical infrastructure, specialized clinics, and medical supply chains.
- Segmented Directorate vs SAGA views.
- Interactive Gantt chart timeline view.
- Color-coded rows based on project health (`In Progress`, `Delayed`, `On Hold`, `Completed`).
- Every project attaches to a Priority Flagship. Includes direct links to Meeting Minutes & Action Points.

#### 3.4 Activities & Events (`modules/events.php`)
- Calendar and list view for ministerial events, field inspections, hospital launches, and executive delegations.
- Categorized by Event Type with chair/host tracking and attendee logs.

#### 3.5 Action Points Tracker (`modules/actions.php`)
- Tracking of directives from ministerial meetings, cabinet briefings, and field inspections.
- Tracks Ref No, Date Raised, Meeting Title, Person Responsible, Timeline, The Issue, Progress / Action Made, Resolution Notes, and Formal Approval Status.

#### 3.6 Meeting Minutes & Financiers (`modules/minutes.php`)
- Records bilateral/multilateral donor meetings, exchequer financing sessions, and board minutes.
- Attachment management with digital viewing and downloading of minutes documents.

#### 3.7 Reports & Approval Pipeline (`modules/reports.php`)
- Multi-tier document repository with formal approval lifecycle: `Pending` &rarr; `Approved` / `Rejected`.
- Role-based visibility controls (`Public`, `Restricted`, `Confidential`).

#### 3.8 Project Planner Diary (`modules/diary.php`)
- Interactive monthly grid calendar with daily event rendering.
- Priority color-coded legends: `Meeting` (Blue), `Task` (Teal), `Deadline` (Red), `Event` (Orange), `General` (Gray).

#### 3.9 Performance Contract (`modules/pc.php`)
- Implementation of the official State Department for Medical Services Annual Performance Contract (PC).
- Real-world indicator baselines and targets from Kenyatta National Hospital, Moi Teaching & Referral Hospital, KUTRRH, KEMSA, Blood Transfusion Services, and NASCOP.

#### 3.10 Visitors Management (`modules/visitors.php`)
- Real-time headquarters visitor register for Afya House, logging visitor badge numbers, National ID, host officer, office visited, and check-in / check-out timestamps.

#### 3.11 Mail Management & Registry (`modules/mail.php`)
- Electronic folio registry for Inward and Outward official government correspondence, memos, and executive circulars.

#### 3.12 Users & RBAC Administration (`modules/users.php`)
- Management of staff accounts, roles, access privileges, failed login unlock, and security audits.

#### 3.13 cPanel & Backup Management (`admin/backup.php`)
- Diagnostic health checker for cPanel web servers.
- One-click SQL dump generator and schema exporter.

---

### 4. Database Schema Structure
The system relational schema consists of 18 tables:
1. `roles` — Permission matrices (`can_upload`, `can_edit`, `can_approve_tasks`, `can_download`, `is_admin`).
2. `users` — Authentication credentials, role mapping, failed login locking, and activity timestamps.
3. `directorates` — Ministry directorates (Health Infrastructure, Medical Services, Preventive Health, etc.).
4. `sagas` — Semi-Autonomous Government Agencies (KNH, MTRH, KEMSA, KEMRI, NHIF/SHA, KUTRRH, etc.).
5. `flagships` — Top-level presidential and ministerial priority initiatives.
6. `projects` — Capital projects and programmes with budget and timeline tracking.
7. `project_financiers` — Grants, loans, and counterpart exchequer funding.
8. `kpis` — Measurable project-level deliverables.
9. `performance_contracts` — Annual ministerial performance contract targets, quarters, and scores.
10. `action_points` — Directives and resolutions tracked to completion.
11. `events` — Ministerial field visits, ceremonies, and committee sessions.
12. `meetings` — Formal minutes with local and foreign donors and financiers.
13. `reports` — Uploaded technical reports with executive review lifecycle.
14. `diary` — Date and time-indexed executive planning entries.
15. `mail` — Inward/Outward registered physical and electronic correspondence.
16. `visitors` — Afya House physical visitor security log.
17. `system_records` — Dynamic document attachments.
18. `audit_logs` — Immutable historical audit log.
