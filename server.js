import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
const root = resolve(import.meta.dirname);
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript; charset=utf-8' };
http.createServer(async (req,res) => {
  try {
    const path = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const file = resolve(root, '.' + (path === '/' ? '/index.html' : path));
    if (!file.startsWith(root + '/') || !['.html','.css','.js'].includes(extname(file))) { res.writeHead(404).end(); return; }
    res.writeHead(200, {'Content-Type':types[extname(file)]}); res.end(await readFile(file));
  } catch { res.writeHead(404).end('Not found'); }
}).listen(Number(process.env.PORT || 3000), '0.0.0.0', () => console.log('Thai flashcards running on port ' + (process.env.PORT || 3000)));
