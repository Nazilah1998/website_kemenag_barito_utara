const fs = require('fs');
const filePath = 'e:/CODING/ptsp-kemenag-barito-utara/drizzle/0000_majestic_nomad.sql';
let sql = fs.readFileSync(filePath, 'utf8');

// Remove CREATE SCHEMA "auth"
sql = sql.replace(/CREATE SCHEMA "auth";\n--> statement-breakpoint\n/g, '');

// Remove CREATE TABLE "auth"."users" (...)
sql = sql.replace(/CREATE TABLE "auth"\."users" \([\s\S]*?\);\n--> statement-breakpoint\n/g, '');

fs.writeFileSync(filePath, sql);
console.log('Fixed SQL file');
