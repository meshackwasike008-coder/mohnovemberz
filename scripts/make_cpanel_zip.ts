import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function createCpanelZip() {
  const zip = new JSZip();

  // Add php_app files at root level for public_html
  const phpAppDir = path.resolve('public/php_app');
  if (fs.existsSync(phpAppDir)) {
    const files = fs.readdirSync(phpAppDir);
    for (const file of files) {
      if (file === 'schema.sql') continue; // we put schema in database folder
      const filePath = path.join(phpAppDir, file);
      if (fs.statSync(filePath).isFile()) {
        const content = fs.readFileSync(filePath);
        zip.file(file, content);
      }
    }
  }

  // Add database folder with schema.sql and migration_001.sql
  const dbFolder = zip.folder('database');
  const dbDir = path.resolve('public/database');
  if (fs.existsSync(dbDir) && dbFolder) {
    const dbFiles = fs.readdirSync(dbDir);
    for (const file of dbFiles) {
      const filePath = path.join(dbDir, file);
      if (fs.statSync(filePath).isFile()) {
        const content = fs.readFileSync(filePath);
        dbFolder.file(file, content);
      }
    }
  }

  // Add cPanel README instructions
  const readmeContent = `# STATE DEPARTMENT FOR MEDICAL SERVICES (PP-SDOMS)
## Standalone PHP & MySQL cPanel Deployment Package

Zero Node.js dependency required. Runs on pure PHP 8.x + MySQL / MariaDB.

### Step 1: Upload Files to cPanel
1. Log in to your cPanel account and open **File Manager**.
2. Navigate to **public_html**.
3. Upload this entire zip archive (` + "`moh_cpanel_installation_package.zip`" + `) into ` + "`public_html`" + `.
4. Right-click the uploaded zip file and select **Extract**. Extract all files directly into ` + "`public_html`" + `.

### Step 2: Create MySQL Database & User
1. In cPanel, go to **MySQL® Database Wizard**.
2. Create a database (e.g., ` + "`health_db`" + `).
3. Create a database user with a strong password and assign **All Privileges** to the database.

### Step 3: Import Database Schema & Demo Data
1. In cPanel, open **phpMyAdmin**.
2. Select your newly created database from the left sidebar.
3. Click the **Import** tab at the top.
4. Choose file ` + "`database/schema.sql`" + ` (and optionally ` + "`database/migration_001.sql`" + `) and click **Go**.

### Step 4: Configure Database Connection
1. Open ` + "`db.php`" + ` in cPanel File Manager (or text editor).
2. Update your database credentials:
   - ` + "`$host = 'localhost';`" + `
   - ` + "`$dbname = 'your_db_name';`" + `
   - ` + "`$username = 'your_db_user';`" + `
   - ` + "`$password = 'your_db_password';`" + `
3. Save changes.

### Step 5: Access Your Application
Open your domain in your web browser (e.g., ` + "`https://yourdomain.com`" + `). The standalone PHP dashboard, SAGA portals, KPI metrics, and reporting tools are fully operational!
`;

  zip.file('README.md', readmeContent);

  const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
  const targetPath = path.resolve('public/moh_cpanel_installation_package.zip');
  fs.writeFileSync(targetPath, zipContent);
  console.log('Successfully created clean cPanel installation package:', targetPath);
}

createCpanelZip().catch(err => {
  console.error('Error creating cPanel zip:', err);
  process.exit(1);
});
