import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import pkg from './package.json';

/**
 * A política de segurança muda conforme o alvo:
 * - dev: o Vite precisa falar com o próprio servidor (HMR via websocket);
 * - desktop/web: nada disso existe em produção, então `connect-src` fecha em 'self'.
 */
function buildCsp(connectSrc: string) {
  return [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src ${connectSrc}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');
}

const CSP_META_PATTERN =
  /(<meta\s+http-equiv="Content-Security-Policy"[\s\S]*?content=")[\s\S]*?(")/;

/**
 * Reescreve a meta CSP do index.html de acordo com o alvo do build.
 * Falha o build se a meta sumir do HTML — melhor quebrar do que publicar
 * a política de desenvolvimento (que libera localhost) em produção.
 */
function cspPlugin(csp: string): Plugin {
  return {
    name: 'csp-por-alvo',
    transformIndexHtml(html) {
      if (!CSP_META_PATTERN.test(html)) {
        throw new Error(
          'Meta Content-Security-Policy não encontrada em index.html: o build seria publicado sem CSP.',
        );
      }

      return html.replace(CSP_META_PATTERN, `$1${csp}$2`);
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // O Electron carrega o bundle por file://, então precisa de caminhos relativos.
  // A web é servida a partir da raiz do domínio e precisa de caminhos absolutos,
  // senão qualquer rota profunda (/config/lojas) procura os assets no lugar errado.
  const isDesktopBuild = command === 'build' && mode !== 'web';
  const connectSrc =
    command === 'serve' ? "'self' http://localhost:5173 ws://localhost:5173" : "'self'";

  return {
    base: isDesktopBuild ? './' : '/',
    plugins: [react(), cspPlugin(buildCsp(connectSrc))],
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
    },
    build: {
      // Electron 40 usa Chromium ~114 (boa compatibilidade)
      target: 'chrome114',
    },
  };
});
