import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function createAllZips() {
  const zip = new JSZip();
  const rootDir = path.resolve('.');

  // Exclude patterns
  const excludeDirs = ['node_modules', '.git', '.aistudio', 'dist'];
  const excludeFiles = ['.DS_Store'];

  function addRecursive(currentDir: string, currentZipFolder: JSZip) {
    if (!fs.existsSync(currentDir)) return;
    const entries = fs.readdirSync(currentDir);
    for (const entry of entries) {
      if (excludeFiles.includes(entry)) continue;
      const fullPath = path.join(currentDir, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        if (excludeDirs.includes(entry) && currentDir === rootDir) {
          continue;
        }
        const subFolder = currentZipFolder.folder(entry);
        if (subFolder) {
          addRecursive(fullPath, subFolder);
        }
      } else {
        const content = fs.readFileSync(fullPath);
        currentZipFolder.file(entry, content);
      }
    }
  }

  // 1. Package ALL repository files into moh_project_files.zip
  addRecursive(rootDir, zip);

  const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
  
  const target1 = path.resolve('public/moh_project_files.zip');
  fs.writeFileSync(target1, zipContent);
  console.log('Created:', target1);

  const target2 = path.resolve('public/moh_cpanel_installation_package.zip');
  fs.writeFileSync(target2, zipContent);
  console.log('Created:', target2);

  const target3 = path.resolve('public/moh_php_standalone_package.zip');
  fs.writeFileSync(target3, zipContent);
  console.log('Created:', target3);
}

createAllZips().catch(err => {
  console.error('Error creating zips:', err);
  process.exit(1);
});
