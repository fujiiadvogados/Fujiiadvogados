import { mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';
const mod = await import('/dev-server/dist/server/index.mjs');
const handler = mod.default ?? mod;
const routes = ['/', '/areas', '/quem-somos', '/etica', '/blog',
  '/areas/tributario','/areas/execucoes-fiscais','/areas/trabalhista',
  '/areas/agronegocio','/areas/credito-rural','/areas/endividamento-rural',
  '/areas/previdenciario','/areas/consumidor','/areas/direito-medico',
  '/areas/companhias-aereas','/areas/concessionarias'];
let fail = 0;
for (const r of routes) {
  try {
    const res = await handler.fetch(new Request('http://localhost' + r), {}, { waitUntil(){} });
    const html = await res.text();
    if (res.status !== 200) { fail++; console.log(r, res.status); continue; }
    const out = r === '/' ? 'dist/client/index.html' : 'dist/client' + r + '/index.html';
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, html);
    console.log(r, res.status, html.length);
  } catch (e) { fail++; console.log(r, 'ERR', String(e).slice(0,120)); }
}
process.exit(fail ? 1 : 0);
