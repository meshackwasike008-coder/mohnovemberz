# Ministry of Health (MOH) — PP-SDOMS
## Complete cPanel Production Installation Guide

This guide provides end-to-end instructions for deploying the **MOH Project Performance, Service Delivery & Operational Management System (PP-SDOMS)** on any standard cPanel web hosting environment running Apache, PHP 8.1+ and MySQL/MariaDB.

---

### 1. Prerequisites & Hosting Requirements
- **cPanel Access:** Active cPanel account with File Manager and phpMyAdmin privileges.
- **PHP Version:** PHP 8.1 or PHP 8.2 (Recommended).
- **Required PHP Extensions:**
  - `pdo_mysql`
  - `curl`
  - `mbstring`
  - `json`
  - `fileinfo`
  - `gd` or `imagick`
- **MySQL / MariaDB:** MySQL 5.7+ or MariaDB 10.3+.

---

### 2. Step-by-Step Installation Instructions

#### Step 2.1: Verify & Configure PHP in cPanel
1. Log into your cPanel account.
2. In the **Software** section, click on **Select PHP Version** (or **MultiPHP Manager**).
3. Set your active domain or subdomain to **PHP 8.1** or **PHP 8.2**.
4. In **PHP Extensions**, ensure `pdo_mysql`, `mbstring`, `curl`, and `fileinfo` are checked.
5. In **PHP Options / MultiPHP INI Editor**, update the following settings:
   - `upload_max_filesize` = `64M`
   - `post_max_size` = `64M`
   - `memory_limit` = `256M`
   - `max_execution_time` = `300`

#### Step 2.2: Create MySQL Database & Database User
1. In cPanel, navigate to **Databases &rarr; MySQL Database Wizard**.
2. **Step 1: Create A Database:**
   - Name your database: `cpaneluser_mohsdms` (Replace `cpaneluser` with your actual cPanel prefix).
   - Click **Next Step**.
3. **Step 2: Create Database Users:**
   - Username: `cpaneluser_mohuser`
   - Password: Use the **Password Generator** to create a strong password (e.g. `M0h_Sdms!Secure2026`).
   - Copy this password to a secure notepad.
   - Click **Create User**.
4. **Step 3: Add User to Database:**
   - Check the box **ALL PRIVILEGES**.
   - Click **Make Changes**.

#### Step 2.3: Import Database Schema and Demo Data
1. In cPanel, navigate to **Databases &rarr; phpMyAdmin**.
2. From the left sidebar, click on your newly created database (`cpaneluser_mohsdms`).
3. Click on the **Import** tab at the top.
4. Click **Choose File** and select `database/schema.sql` from your computer (or download directly from the system's *cPanel & Backup* screen).
5. Ensure Format is set to **SQL** and click **Import** (or **Go**).
6. Verify that all 18 tables (such as `projects`, `flagships`, `meetings`, `action_points`, `reports`, `performance_contracts`, `users`, etc.) have been imported successfully with demo records.

#### Step 2.4: Upload Application Files to cPanel
1. In cPanel, open **Files &rarr; File Manager**.
2. Navigate to your target web directory:
   - For main domain: `public_html/`
   - For subdomain: `public_html/sdms/` (or designated directory).
3. Click **Upload** in the top toolbar.
4. Upload the application ZIP archive.
5. Once uploaded (progress bar turns green), right-click the ZIP archive in File Manager and select **Extract**.
6. Ensure files are directly in `public_html/` (so `index.php`, `dashboard.php`, `bootstrap.php` are in the web root).

#### Step 2.5: Configure Environment Variables (.env)
1. In cPanel File Manager, click **Settings** (top right) and ensure **Show Hidden Files (dotfiles)** is checked.
2. In the project root, locate `.env.example`.
3. Right-click `.env.example` and select **Copy**, then rename the copy to `.env`.
4. Right-click `.env` and select **Edit**.
5. Update your database connection parameters:
   ```ini
   DB_HOST=localhost
   DB_NAME=cpaneluser_mohsdms
   DB_USER=cpaneluser_mohuser
   DB_PASS=M0h_Sdms!Secure2026
   DB_PORT=3306
   APP_URL=https://your-domain.gov.ke
   ```
6. Save changes.

#### Step 2.6: Set Directory Permissions
In File Manager, ensure appropriate permissions:
- `uploads/` &rarr; `0755` (Writable by web server)
- `backups/` &rarr; `0755` (Protected by `.htaccess` against public web requests)

---

### 3. Default System Credentials
Immediately after import, you can log in using the pre-seeded administrative account:

| Attribute | Default Value |
|---|---|
| **Login URL** | `https://your-domain.gov.ke/index.php` |
| **Email** | `admin@health.go.ke` |
| **Password** | `ChangeMe@2026` |
| **Role** | System Administrator (Full Super Admin Privileges) |

> **Security Advisory:** After initial login, immediately navigate to **Users** module, edit the `admin@health.go.ke` account, and change the password.

---

### 4. Setting Up Automated Backups in cPanel (Cron Job)
To set up daily automated database backups:
1. In cPanel, open **Advanced &rarr; Cron Jobs**.
2. Select **Once Per Day (0 0 * * *)**.
3. In the command line, enter:
   ```bash
   mysqldump -u cpaneluser_mohuser -p'M0h_Sdms!Secure2026' cpaneluser_mohsdms | gzip > /home/cpaneluser/backups/moh_db_$(date +\%Y\%m\%d).sql.gz
   ```
4. Click **Add New Cron Job**.
