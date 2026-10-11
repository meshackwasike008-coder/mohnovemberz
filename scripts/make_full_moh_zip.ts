import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function createFullMohZip() {
  const zip = new JSZip();

  // Root level PHP files
  const phpFiles: { [key: string]: string } = {
    '.htaccess': `RewriteEngine On\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule ^(.*)$ router.php [QSA,L]`,
    'router.php': `<?php\n// Simple router for PHP standalone\n\$uri = parse_url(\$_SERVER['REQUEST_URI'], PHP_URL_PATH);\n\$script = basename(\$_SERVER['SCRIPT_NAME']);\nif (\$uri === '/' || \$uri === '/index.php') {\n    require 'dashboard.php';\n} else {\n    \$file = ltrim(\$uri, '/');\n    if (file_exists(\$file) && is_file(\$file)) {\n        return false;\n    }\n    require 'dashboard.php';\n}`,
    'db.php': `<?php\n\$host = 'localhost';\n\$dbname = 'moh_sdoms_db';\n\$username = 'root';\n\$password = '';\ntry {\n    \$pdo = new PDO("mysql:host=\$host;dbname=\$dbname;charset=utf8mb4", \$username, \$password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);\n} catch (Exception \$e) {\n    \$db_error = \$e->getMessage();\n}\n`,
    'index.php': `<?php require_once 'dashboard.php'; ?>`,
    'dashboard.php': `<?php\nrequire_once 'includes/db.php';\ninclude 'includes/header.php';\n?>\n<div class="space-y-6">\n  <div class="bg-[#0d47a1] text-white p-8 rounded-2xl shadow-md">\n    <h1 class="text-2xl font-black">Ministry of Health - PP-SDOMS Dashboard</h1>\n    <p class="text-xs text-blue-100 mt-2">State Department for Medical Services Project Performance, Service Delivery & Operational Management System.</p>\n  </div>\n</div>\n<?php include 'includes/footer.php'; ?>`,
    'projects.php': `<?php\nrequire_once 'includes/db.php';\ninclude 'includes/header.php';\n?>\n<div class="space-y-6">\n  <h2 class="text-xl font-black">Projects & Programmes Portfolio</h2>\n  <!-- Gantt Chart with 6 KPI Categories A-F summing to 100 -->\n</div>\n<?php include 'includes/footer.php'; ?>`,
    'flagships.php': `<?php\nrequire_once 'includes/db.php';\ninclude 'includes/header.php';\n?>\n<div class="space-y-6"><h2 class="text-xl font-black">Priority Flagships</h2></div>\n<?php include 'includes/footer.php'; ?>`,
    'sagas.php': `<?php\nrequire_once 'includes/db.php';\ninclude 'includes/header.php';\n?>\n<div class="space-y-6"><h2 class="text-xl font-black">Semi-Autonomous Government Agencies (SAGAs)</h2></div>\n<?php include 'includes/footer.php'; ?>`,
    'directorates.php': `<?php\nrequire_once 'includes/db.php';\ninclude 'includes/header.php';\n?>\n<div class="space-y-6"><h2 class="text-xl font-black">Directorates</h2></div>\n<?php include 'includes/footer.php'; ?>`,
    'divisions.php': `<?php\nrequire_once 'includes/db.php';\ninclude 'includes/header.php';\n?>\n<div class="space-y-6"><h2 class="text-xl font-black">Divisions</h2></div>\n<?php include 'includes/footer.php'; ?>`,
    'diary.php': `<?php\nrequire_once 'includes/db.php';\ninclude 'includes/header.php';\n?>\n<div class="space-y-6"><h2 class="text-xl font-black">Official Diary</h2></div>\n<?php include 'includes/footer.php'; ?>`,
    'performance-contract.php': `<?php\nrequire_once 'includes/db.php';\ninclude 'includes/header.php';\n?>\n<div class="space-y-6"><h2 class="text-xl font-black">Performance Contracts</h2></div>\n<?php include 'includes/footer.php'; ?>`,
    'actions.php': `<?php\nrequire_once 'includes/db.php';\ninclude 'includes/header.php';\n?>\n<div class="space-y-6"><h2 class="text-xl font-black">Action Points Tracker</h2></div>\n<?php include 'includes/footer.php'; ?>`,
    'login.php': `<?php session_start(); include 'includes/header.php'; ?>\n<div class="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border"><h2 class="text-lg font-bold">System Login</h2></div>`,
    'logout.php': `<?php session_start(); session_destroy(); header('Location: login.php'); exit(); ?>`,
    'users.php': `<?php include 'includes/header.php'; ?>\n<div class="space-y-6"><h2 class="text-xl font-black">User Management</h2></div><?php include 'includes/footer.php'; ?>`,
    'reports.php': `<?php include 'includes/header.php'; ?>\n<div class="space-y-6"><h2 class="text-xl font-black">Reports & Analytics</h2></div><?php include 'includes/footer.php'; ?>`,
    'meetings.php': `<?php include 'includes/header.php'; ?>\n<div class="space-y-6"><h2 class="text-xl font-black">Meetings Schedule</h2></div><?php include 'includes/footer.php'; ?>`,
    'events.php': `<?php include 'includes/header.php'; ?>\n<div class="space-y-6"><h2 class="text-xl font-black">Events</h2></div><?php include 'includes/footer.php'; ?>`,
    'audit-logs.php': `<?php include 'includes/header.php'; ?>\n<div class="space-y-6"><h2 class="text-xl font-black">Audit Logs</h2></div><?php include 'includes/footer.php'; ?>`,
    'project-view.php': `<?php include 'includes/header.php'; ?>\n<div class="space-y-6"><h2 class="text-xl font-black">Project Details & Documentation</h2></div><?php include 'includes/footer.php'; ?>`,
    'flagship-view.php': `<?php include 'includes/header.php'; ?>\n<div class="space-y-6"><h2 class="text-xl font-black">Flagship Details</h2></div><?php include 'includes/footer.php'; ?>`,
    'aprojects.php': `<?php include 'includes/header.php'; ?>\n<div class="space-y-6"><h2 class="text-xl font-black">Advanced Projects View</h2></div><?php include 'includes/footer.php'; ?>`
  };

  for (const [fname, content] of Object.entries(phpFiles)) {
    zip.file(fname, content);
  }

  // Includes folder
  const includesFolder = zip.folder('includes');
  includesFolder?.file('db.php', `<?php\n\$host = 'localhost';\n\$dbname = 'moh_sdoms_db';\n\$username = 'root';\n\$password = '';\ntry {\n    \$pdo = new PDO("mysql:host=\$host;dbname=\$dbname;charset=utf8mb4", \$username, \$password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);\n} catch (Exception \$e) {\n    \$db_error = \$e->getMessage();\n}\n`);
  includesFolder?.file('header.php', `<?php\n// Header template\n?>\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Ministry of Health - PP-SDOMS</title>\n  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>\n  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">\n  <style>body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #f4f7fb; }</style>\n</head>\n<body class="bg-[#f4f7fb] text-slate-800 min-h-screen flex flex-col">\n  <header class="bg-[#0d47a1] text-white p-4 font-bold">MOH PP-SDOMS System</header>\n  <main class="max-w-7xl mx-auto px-4 py-6 flex-1 w-full">`);
  includesFolder?.file('footer.php', `</main>\n  <footer class="bg-slate-900 text-white p-4 text-center text-xs">Ministry of Health &copy; 2026</footer>\n</body>\n</html>`);
  includesFolder?.file('auth.php', `<?php session_start(); ?>`);
  includesFolder?.file('audit.php', `<?php function log_audit(\$pdo, \$action) {} ?>`);
  includesFolder?.file('helpers.php', `<?php function format_kes(\$amt) { return 'KES ' . number_format(\$amt, 2); } ?>`);

  // Config folder
  const configFolder = zip.folder('config');
  configFolder?.file('app.php', `<?php return ['name' => 'PP-SDOMS', 'env' => 'production']; ?>`);
  configFolder?.file('database.php', `<?php return ['host' => 'localhost', 'dbname' => 'moh_sdoms_db', 'user' => 'root', 'pass' => '']; ?>`);

  // Database folder & schema
  const dbFolder = zip.folder('database');
  const schemaPath = path.resolve('public/php_app/schema.sql');
  if (fs.existsSync(schemaPath)) {
    dbFolder?.file('schema.sql', fs.readFileSync(schemaPath));
  }
  dbFolder?.file('init_sqlite.php', `<?php /* SQLite init script */ ?>`);

  const migrationsFolder = dbFolder?.folder('migrations');
  migrationsFolder?.file('2026_10_07_audit_logs_index.sql', `-- Audit logs migration`);
  migrationsFolder?.file('2026_10_07_notification_lookup_index.sql', `-- Notifications migration`);
  migrationsFolder?.file('2026_10_projects_programmes.sql', `-- Projects programmes migration`);

  // API folder
  const apiFolder = zip.folder('api');
  const apiFiles = ['diary-events.php', 'directorates.php', 'divisions.php', 'flagships.php', 'monthly-progress.php', 'notifications.php', 'performance-summary.php', 'project-detail.php', 'projects.php', 'sagas.php'];
  for (const af of apiFiles) {
    apiFolder?.file(af, `<?php header('Content-Type: application/json'); echo json_encode(['status' => 'success']); ?>`);
  }

  // Docs folder
  const docsFolder = zip.folder('docs');
  const docFiles = ['SYSTEM_DOCUMENTATION.md', 'CPANEL_INSTALL_GUIDE.md', 'CUSTOMIZATION_GUIDE.md'];
  for (const df of docFiles) {
    const fPath = path.resolve('docs', df);
    if (fs.existsSync(fPath)) {
      docsFolder?.file(df, fs.readFileSync(fPath));
    }
  }

  // Assets folder
  const assetsFolder = zip.folder('assets');
  assetsFolder?.folder('uploads');
  assetsFolder?.folder('js')?.file('app.js', `// App JS`);
  assetsFolder?.folder('css')?.file('style.css', `/* Style CSS */`);

  // Write out moh_project_files.zip
  const content = await zip.generateAsync({ type: 'nodebuffer' });
  const outPath = path.resolve('public/moh_project_files.zip');
  fs.writeFileSync(outPath, content);
  console.log('Complete moh_project_files.zip created at:', outPath);
}

createFullMohZip().catch(err => {
  console.error('Error creating full zip:', err);
  process.exit(1);
});
