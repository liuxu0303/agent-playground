import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import * as store from './tasks.js';

const here = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT) || 3000;
const tasks = [];

function send(res, status, body, type = 'application/json') {
  const text = type === 'application/json' ? JSON.stringify(body) : body;
  res.writeHead(status, { 'content-type': type, 'content-length': Buffer.byteLength(text) });
  res.end(text);
}

async function readBody(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error('body is not JSON');
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${port}`);
  const path = url.pathname;

  try {
    if (path === '/' || path === '/index.html') {
      const html = await readFile(join(here, '..', 'public', 'index.html'), 'utf8');
      return send(res, 200, html, 'text/html; charset=utf-8');
    }

    if (path.startsWith('/api/tasks')) {
      const id = path.startsWith('/api/tasks/') ? path.slice('/api/tasks/'.length) : null;

      if (req.method === 'GET' && !id) {
        const done = url.searchParams.has('done') ? url.searchParams.get('done') === 'true' : undefined;
        return send(res, 200, { tasks: store.list(tasks, { done }) });
      }

      if (req.method === 'POST' && !id) {
        return send(res, 201, { task: store.create(tasks, await readBody(req)) });
      }

      if (req.method === 'PATCH' && id) {
        const task = store.update(tasks, id, await readBody(req));
        return task ? send(res, 200, { task }) : send(res, 404, { error: 'not found' });
      }

      if (req.method === 'DELETE' && id) {
        return store.remove(tasks, id)
          ? send(res, 204, '')
          : send(res, 404, { error: 'not found' });
      }

      return send(res, 405, { error: 'method not allowed' });
    }

    send(res, 404, { error: 'not found' });
  } catch (error) {
    send(res, 400, { error: String(error.message ?? error) });
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`agent-playground listening on http://127.0.0.1:${port}`);
});
