const http = require('http');
const fs = require('fs');
const path = require('path');

let port = parseInt(process.env.PORT, 10) || 4173;

const mimeTypes = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const safePath = path.normalize(decodeURIComponent(parsedUrl.pathname)).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(__dirname, safePath);

  // Allow alias paths for resume / CV
  if (parsedUrl.pathname.match(/\/assets\/Bhushan_Patel_(CV|Resume|Lebenslauf)\.pdf$/i)) {
    filePath = path.join(__dirname, 'assets', 'Bhushan_Patel_Lebenslauf.pdf');
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('404 Not Found');
      return;
    }

    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    // Handle HEAD requests immediately
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    const requestedFilename = path.basename(safePath) || path.basename(filePath);

    const headers = {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    };

    if (ext === '.pdf') {
      const isInline = parsedUrl.searchParams.get('inline') === '1' || parsedUrl.searchParams.get('view') === '1';
      headers['Content-Disposition'] = isInline
        ? `inline; filename="${requestedFilename}"`
        : `attachment; filename="${requestedFilename}"`;
      headers['Cache-Control'] = 'no-cache';
    }

    if (req.method === 'HEAD') {
      res.writeHead(200, headers);
      res.end();
      return;
    }

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('404 Not Found');
        return;
      }

      headers['Content-Length'] = content.length;
      res.writeHead(200, headers);
      res.end(content);
    });
  });
});

function startServer(currentPort) {
  server.removeAllListeners('error');

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[Warnung] Port ${currentPort} wird bereits verwendet. Versuche Port ${currentPort + 1}...`);
      startServer(currentPort + 1);
    } else {
      console.error('Serverfehler:', err);
    }
  });

  server.listen(currentPort, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Bhushan Patel Portfolio Server läuft unter:`);
    console.log(`👉 http://localhost:${currentPort}`);
    console.log(`======================================================\n`);
  });
}

startServer(port);
