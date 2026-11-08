# STATE DEPARTMENT FOR MEDICAL SERVICES (PP-SDOMS)
## Standalone PHP & MySQL cPanel Deployment Package

Zero Node.js dependency required. Runs on pure PHP 8.x + MySQL / MariaDB.

The original single-file layout and functionality are retained (Dashboard, Priority Flagships, Projects & Programmes, Performance Contracts, Official Diary) with the following additive features:

- Sticky header with coat of arms, main title **STATE DEPARTMENT FOR MEDICAL SERVICES**, last login and user account.
- Priority Flagships — **Show all fields** toggle for linked projects.
- Performance Contracts — **+ Add Record** button and form.
- Official Diary — compact detail popups with linked project title links (hover: "Click to view details").
- Project details — **Action Board** (read-only, KPI-derived) and automatic **Progress** at the bottom.
- Projects — **Finance Records** tab with editable financing figures and the "Financial Data (Amount in Millions)" graph.
- Notifications — functional for admin/PS/authorised accounts; action changes are pending approval with approver + timestamp.
- Notifications — always present, greyed out after reading, dropdown + audit-log details view.

### Step 1: Upload Files to cPanel
1. Log in to your cPanel account and open **File Manager**.
2. Navigate to **public_html**.
3. Upload this entire zip archive (`pp-sdoms-php.zip`) into `public_html`.
4. Right-click the uploaded zip file and select **Extract**. Extract all files directly into `public_html`.
5. When asked, choose **Overwrite** for every existing file.

> ⚠️ **IMPORTANT — always upload `index.php` and `db.php` together.**
> `index.php` depends on the helper functions defined in `db.php` (`current_user()`,
> `audit_log()`, `notify()`, `project_progress()`, `h()`, `m_fmt()`, …).
> If you replace only `index.php` and keep an older `db.php`, the page will stop with
> `Call to undefined function current_user()`. The current `db.php` identifies itself
> with `define('PP_SDOMS_DB_VERSION', '2.0');` at the top — if that line is missing,
> the file is out of date. Newer builds detect the mismatch and show a clear
> "db.php is out of date" page instead of a fatal error.

### Step 2: Create MySQL Database & User
1. In cPanel, go to **MySQL® Database Wizard**.
2. Create a database (e.g., `health_db`).
3. Create a database user with a strong password and assign **All Privileges** to the database.

### Step 3: Import Database Schema & Demo Data
1. In cPanel, open **phpMyAdmin**.
2. Select your newly created database from the left sidebar.
3. Click the **Import** tab at the top.
4. Import, in order:
   - `schema.sql` (core schema + demo data)
   - `migration_001.sql` (optional enrichment)
   - **`migration_002_features.sql`** (required — Action Points, Notifications, Audit Logs, Pending Approvals, Finance Records, last login)
5. Click **Go** after each import.

> `migration_002_features.sql` is additive and idempotent — it creates the new tables/columns without touching the original schema or data.

### Step 4: Configure Database Connection
1. Open `db.php` in cPanel File Manager (or text editor).
2. Update your database credentials:
   - `$host = 'localhost';`
   - `$dbname = 'your_db_name';`
   - `$username = 'your_db_user';`
   - `$password = 'your_db_password';`
3. Save changes.

### Step 5: Access Your Application
Open your domain in your web browser (e.g., `https://yourdomain.com`). The standalone PHP dashboard, flagships, project portfolio, performance contracts, official diary, action points, notifications and audit logs are fully operational.
