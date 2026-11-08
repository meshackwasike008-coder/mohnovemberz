# PP-SDOMS — Native PHP / MySQL Edition (cPanel Installation Guide)

**State Department for Medical Services — Project Performance, Service Delivery & Operational Management System**

This is the native **PHP 8 + MySQL/MariaDB** build. It runs on standard shared cPanel hosting — **no Node.js, no build step, no npm**. Upload the files, create a database, import one SQL file, edit four lines of config, and you are live.

---

## 1. Requirements

| Component | Minimum |
|-----------|---------|
| PHP | 8.0+ (8.1 / 8.2 recommended) |
| PHP extensions | `pdo_mysql`, `mbstring`, `json`, `session` (all standard on cPanel) |
| Database | MySQL 5.7+ / MariaDB 10.3+ |
| Web server | Apache (cPanel default) |

---

## 2. Upload the files

1. Log in to **cPanel → File Manager**.
2. Open the document root for your domain — usually `public_html/` or a subfolder such as `public_html/sdoms/`.
3. Upload the provided ZIP (`pp-sdoms-php.zip`) and **Extract** it into that folder.
4. Confirm `index.php` sits directly inside the folder you chose. The structure should look like:

```
index.php
config.php
db.php
.htaccess
dashboard.php  flagships.php  projects.php  pc.php  diary.php
actions.php  notifications.php  audit-logs.php  users.php  project-view.php
login.php  logout.php
includes/    (auth, helpers, audit, header, footer, coat of arms, POST handler)
modules/     (page views)
assets/      (css, js)
database/schema.sql
```

> If you want the site at the domain root, extract into `public_html/`. For a sub-path, extract into `public_html/sdoms/` and browse `https://yourdomain.com/sdoms/`.

---

## 3. Create the database

1. **cPanel → MySQL® Databases**.
2. Create a database, e.g. `youruser_sdoms`.
3. Create a database user with a strong password and **Add User to Database** with **All Privileges**.
4. Note the three values — cPanel prefixes them with your account name:
   - Database name: `youruser_sdoms`
   - User: `youruser_sdomsuser`
   - Password: `••••••••`

---

## 4. Import the schema

1. **cPanel → phpMyAdmin**.
2. Select your new database in the left sidebar.
3. Click the **Import** tab → **Choose File** → select `database/schema.sql` from the uploaded files → **Go**.
4. This creates all **18 tables** and seeds demo data (4 users, 8 projects, flagships, KPIs, diary, audit logs, notifications, one pending approval).

---

## 5. Configure the connection

Open `config.php` and edit the four database constants to match step 3:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'youruser_sdoms');
define('DB_USER', 'youruser_sdomsuser');
define('DB_PASS', 'your-strong-password');
```

Everything else (app name, organisation, timezone `Africa/Nairobi`, demo password) can stay as-is. You can also set these via environment variables `PP_DB_HOST`, `PP_DB_NAME`, `PP_DB_USER`, `PP_DB_PASS` if your host supports them.

---

## 6. Sign in

Browse to your site (e.g. `https://yourdomain.com/`). The login page appears.

**Demo accounts — password for all: `Password@2026`**

| Name | Email | Role | Rights |
|------|-------|------|--------|
| Dr. Harry Kimtai | `harry.kimtai@health.go.ke` | Principal Secretary – SDMS | Admin + Approver |
| Dr. Patrick Amoth | `patrick.amoth@health.go.ke` | Director General for Health | Admin + Approver |
| Dr. Rose Njeru | `rose.njeru@health.go.ke` | Head of Health Informatics | Edit + Approve |
| CPA Evanson Kamuri | `evanson.kamuri@knh.or.ke` | Chief Executive Officer | Edit (no approve) |

> **Change these passwords before going live.** Create real accounts under **Users → Add User** (admin only), then deactivate or delete the demo accounts.

---

## 7. Post-install hardening

- Change every demo password; create production users.
- In `config.php`, keep `DB_PASS` out of version control.
- Ensure the `.htaccess` file was uploaded (it blocks direct access to `includes/`, `database/`, `config.php`, and `db.php`).
- Enable HTTPS (cPanel → SSL/TLS Status → AutoSSL).
- Take a database backup after seeding (cPanel → Backup).

---

## 8. Feature map

| # | Feature | Where |
|---|---------|-------|
| 1 | Sticky full-row header — coat of arms, title, last login, user, notification bell | every page (`includes/header.php`) |
| 2 | Priority Flagships — linked projects list + **Show all fields** full project table | `index.php?page=flagships&showall=1` |
| 3 | Performance Contracts — **Add Record** button + form | `index.php?page=pc` |
| 4 | Official Diary — compact detail popup, project title links, "Click to view details" hover | `index.php?page=diary` |
| 5 | Project details — **Action Board** (KPI-derived, read-only) + **Progress** at bottom (auto title/date/user) | `index.php?page=project-view&id=1` |
| 6 | Projects — **Finance Records** tab with editable figures + graph | `index.php?page=projects&tab=finance` |
| 7 | Action change requests → pending approval → approver + timestamp | `index.php?page=actions&id=1&tab=changes` |
| 8 | Persistent notifications (grey after read) + dropdown + detail in Audit Logs | bell menu / `index.php?page=notifications` / `index.php?page=audit-logs&focus=1` |

---

## 9. Troubleshooting

**"Database connection failed" banner** — re-check the four constants in `config.php`; confirm the user is attached to the database with all privileges.

**Blank page** — set `display_errors` on temporarily in cPanel → MultiPHP INI Editor, or check `error_log` in the folder.

**404 on sub-pages** — ensure `.htaccess` uploaded and `mod_rewrite` is enabled (cPanel → Apache Handlers / contact host). The app also works without pretty URLs using `index.php?page=...`.

**Login says invalid** — the seeded password is `Password@2026` (case-sensitive). If you re-imported the schema, the bcrypt hash is included in `database/schema.sql`.

---

## 10. Local development (optional)

```bash
php -S localhost:8080
# then open http://localhost:8080/index.php?page=login
```

Requires a local MySQL/MariaDB with `database/schema.sql` imported and `config.php` pointed at it.

---

*Native PHP / MySQL Edition · cPanel Ready · Republic of Kenya © 2026 Ministry of Health*
