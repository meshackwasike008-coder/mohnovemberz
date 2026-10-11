import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function createCpanelZip() {
  const zip = new JSZip();

  // Add dist files
  const distDir = path.resolve('dist');
  function addDirToZip(dir: string, zipFolder: JSZip) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const subFolder = zipFolder.folder(file);
        if (subFolder) {
          addDirToZip(fullPath, subFolder);
        }
      } else {
        const content = fs.readFileSync(fullPath);
        zipFolder.file(file, content);
      }
    }
  }

  if (fs.existsSync(distDir)) {
    const publicDist = zip.folder('public_html');
    if (publicDist) {
      addDirToZip(distDir, publicDist);
    }
  }

  // Add database schema & demo data
  const dbFolder = zip.folder('database');
  const schemaPath = path.resolve('public/database/schema.sql');
  if (fs.existsSync(schemaPath)) {
    dbFolder?.file('schema.sql', fs.readFileSync(schemaPath));
  }

  // Add docs & guide
  const docsFolder = zip.folder('docs');
  const cpanelGuide = path.resolve('docs/CPANEL_INSTALL_GUIDE.md');
  const customGuide = path.resolve('docs/CUSTOMIZATION_GUIDE.md');
  if (fs.existsSync(cpanelGuide)) docsFolder?.file('CPANEL_INSTALL_GUIDE.md', fs.readFileSync(cpanelGuide));
  if (fs.existsSync(customGuide)) docsFolder?.file('CUSTOMIZATION_GUIDE.md', fs.readFileSync(customGuide));

  // Generate zip buffer
  const content = await zip.generateAsync({ type: 'nodebuffer' });
  const outPath = path.resolve('public/moh_cpanel_installation_package.zip');
  fs.writeFileSync(outPath, content);
  console.log('cPanel installation zip package created successfully at:', outPath);
}

createCpanelZip().catch(err => {
  console.error('Error creating cPanel zip:', err);
  process.exit(1);
});
