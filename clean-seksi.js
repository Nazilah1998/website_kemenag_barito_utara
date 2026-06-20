import fs from 'fs';

const file = 'src/data/seksi.js';
let content = fs.readFileSync(file, 'utf8');

// Use regex to remove layanan_ptsp and link_aplikasi properties from the objects
content = content.replace(/layanan_ptsp:\s*\[[\s\S]*?\],\s*/g, '');
content = content.replace(/link_aplikasi:\s*\[[\s\S]*?\],\s*/g, '');

fs.writeFileSync(file, content);
console.log("Cleaned seksi.js!");
