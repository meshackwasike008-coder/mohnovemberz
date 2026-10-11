import fs from 'fs';
import path from 'path';

const initialDataPath = path.resolve('src/data/initialData.ts');
let content = fs.readFileSync(initialDataPath, 'utf8');

const lines = content.split('\n');
let inProjects = false;
let currentCategory = '';
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('export const INITIAL_PROJECTS')) {
    inProjects = true;
  }
  if (inProjects && lines[i].includes('category: "Saga"')) {
    currentCategory = 'Saga';
  }
  if (inProjects && lines[i].includes('category: "Directorate"')) {
    currentCategory = 'Directorate';
  }
  if (inProjects && currentCategory === 'Saga') {
    if (lines[i].includes('saga_name:')) {
      lines[i] = lines[i].replace(/saga_name: ".*"/, 'saga_name: "Kenyatta National Hospital"');
    }
    if (lines[i].includes('delivery_unit:')) {
      lines[i] = lines[i].replace(/delivery_unit: ".*"/, 'delivery_unit: "Kenyatta National Hospital"');
    }
  }
  if (inProjects && lines[i].trim() === '];') {
    inProjects = false;
  }
}

fs.writeFileSync(initialDataPath, lines.join('\n'), 'utf8');
console.log('Successfully updated initialData.ts saga projects to Kenyatta National Hospital.');

// Also update schema.sql
const schemaPath = path.resolve('public/database/schema.sql');
if (fs.existsSync(schemaPath)) {
  let schemaContent = fs.readFileSync(schemaPath, 'utf8');
  schemaContent = schemaContent.replace(/,\s*'Saga',\s*NULL,\s*\d+,\s*NULL,\s*'[^']+',/g, ", 'Saga', NULL, 1, NULL, 'Kenyatta National Hospital',");
  fs.writeFileSync(schemaPath, schemaContent, 'utf8');
  console.log('Successfully updated schema.sql projects saga_id to 1 and delivery_unit to Kenyatta National Hospital.');
}
