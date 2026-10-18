const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'frontend');
const dest = path.join(__dirname, 'public');

if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest, { recursive: true });
}

fs.cpSync(src, dest, { recursive: true });
console.log('Successfully prepared public directory for Vercel deployment!');
