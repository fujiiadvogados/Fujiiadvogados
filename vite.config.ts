// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";

/*
 * Formulário de contato no desenvolvimento.
 * O endpoint é PHP (public/api/contato.php) e o servidor do Vite NÃO executa PHP: sem
 * tratamento, ele devolveria o código-fonte do arquivo como estático.
 * - Com CONTACT_API_DEV_TARGET (ex.: http://localhost:8088, ver docker-compose.dev.yml),
 *   a rota é encaminhada para um Apache+PHP real.
 * - Sem a variável, a rota responde um JSON 503 explícito (nunca o código-fonte).
 */
const CONTACT_PATH = "/api/contato.php";
const contactTarget = process.env["CONTACT_API_DEV_TARGET"];

function contactDevFallback(): Plugin {
  return {
    name: "fujii-contact-dev-fallback",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(CONTACT_PATH, (_req, res) => {
        res.statusCode = 503;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.setHeader("Cache-Control", "no-store");
        res.end(
          JSON.stringify({
            ok: false,
            code: "dev_no_php",
            message: "Servidor PHP de desenvolvimento não configurado.",
          }),
        );
      });
    },
  };
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: contactTarget
    ? { server: { proxy: { [CONTACT_PATH]: { target: contactTarget, changeOrigin: false } } } }
    : { plugins: [contactDevFallback()] },
});
