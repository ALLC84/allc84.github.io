/**
 * Genera el PDF del CV desde la ruta /print.
 *
 * Uso:  npm run pdf
 * Esto ejecuta: astro build && node scripts/generate-pdf.mjs
 *
 * El PDF resultante se guarda en public/CV-Alejandro-Llorente.pdf
 * y queda incluido en el siguiente build como asset estático.
 */

import puppeteer from 'puppeteer';
import { spawn }  from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.join(__dirname, '..');
const OUTPUT    = path.join(ROOT, 'public', 'CV-Alejandro-Llorente.pdf');
const PORT      = 4322; // puerto distinto al dev (4321) para no colisionar

// ── Arrancar astro preview ────────────────────────────────────────────────────
console.log('🚀  Iniciando astro preview...');

const server = spawn('npx', ['astro', 'preview', '--port', String(PORT)], {
  cwd:   ROOT,
  stdio: ['ignore', 'pipe', 'pipe'],
});

server.stderr.on('data', d => process.stderr.write(d));

// ── Esperar a que el servidor esté listo (polling con fetch) ─────────────────
async function waitForServer(maxMs = 20_000) {
  const deadline = Date.now() + maxMs;
  while (Date.now() < deadline) {
    try {
      await fetch(`http://localhost:${PORT}/print`);
      return; // listo
    } catch {
      await new Promise(r => setTimeout(r, 400));
    }
  }
  throw new Error(`El servidor no respondió en ${maxMs / 1000}s`);
}

// ── Main ─────────────────────────────────────────────────────────────────────
try {
  await waitForServer();
  console.log('✅  Servidor listo. Generando PDF...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Emular media screen para que se apliquen los estilos normales (no @media print)
  await page.emulateMediaType('screen');

  await page.goto(`http://localhost:${PORT}/print`, {
    waitUntil: 'networkidle0',
    timeout:   15_000,
  });

  await page.pdf({
    path:            OUTPUT,
    format:          'A4',
    printBackground: true,
    margin: {
      top:    '0',
      bottom: '0',
      left:   '0',
      right:  '0',
    },
  });

  await browser.close();

  console.log('');
  console.log('📄  PDF generado correctamente:');
  console.log(`    ${OUTPUT}`);
  console.log('');
  console.log('💡  Haz commit del PDF para que quede disponible en la web.');

} catch (err) {
  console.error('\n❌  Error generando PDF:', err.message);
  process.exitCode = 1;

} finally {
  server.kill();
  // Dar tiempo al proceso hijo para terminar limpiamente
  await new Promise(r => setTimeout(r, 300));
  process.exit(process.exitCode ?? 0);
}
