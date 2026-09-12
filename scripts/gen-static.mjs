import { mkdirSync, writeFileSync, cpSync, existsSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Caminho relativo ao projeto (funciona em qualquer maquina/SO), apontando
// para a saida real do build atual (Nitro preset "cloudflare-module").
const serverEntry = new URL('../.output/server/index.mjs', import.meta.url);
const mod = await import(serverEntry.href);
const handler = mod.default ?? mod;

// O preset cloudflare-module nao copia os assets estaticos para dist/client
// como o preset antigo fazia; replicamos isso aqui a partir de .output/public.
const publicDir = fileURLToPath(new URL('../.output/public', import.meta.url));
if (existsSync(publicDir)) {
  mkdirSync('dist/client', { recursive: true });
  cpSync(publicDir, 'dist/client', { recursive: true });
}

const routes = ['/', '/areas', '/quem-somos', '/etica', '/blog',
  '/areas/tributario','/areas/execucoes-fiscais','/areas/trabalhista',
  '/areas/agronegocio','/areas/credito-rural','/areas/endividamento-rural',
  '/areas/previdenciario','/areas/consumidor','/areas/direito-medico',
  '/areas/companhias-aereas','/areas/concessionarias','/sitemap.xml'];
let fail = 0;
for (const r of routes) {
  try {
    const res = await handler.fetch(new Request('http://localhost' + r), {}, { waitUntil(){} });
    const html = await res.text();
    if (res.status !== 200) { fail++; console.log(r, res.status); continue; }
    const hasExtension = /\.[a-z0-9]+$/i.test(r);
    const out = r === '/'
      ? 'dist/client/index.html'
      : hasExtension ? 'dist/client' + r : 'dist/client' + r + '/index.html';
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, html);
    console.log(r, res.status, html.length);
  } catch (e) { fail++; console.log(r, 'ERR', String(e).slice(0,120)); }
}
process.exit(fail ? 1 : 0);
