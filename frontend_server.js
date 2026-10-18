const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DIR = path.join(__dirname, 'frontend');

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let file = (req.url === '/' || req.url === '') ? 'index.html' : req.url.split('?')[0];
  let filePath = path.join(DIR, file);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(DIR, 'index.html');
  }
  if (!fs.existsSync(filePath)) {
    filePath = path.join(DIR, 'Index.html');
  }
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Frontend server running at http://localhost:${PORT}`);
});
