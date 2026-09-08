#!/usr/bin/env node
/**
 * Genera una página autónoma por grupo, a partir de panel-fuente.html.
 *
 *   node build-web.js          # todos los grupos
 *   node build-web.js gt       # solo uno
 *
 * Cada página lee las pestañas de su Google Sheets directamente desde el
 * navegador (Google manda access-control-allow-origin: * en la exportación
 * CSV), así que se actualiza sola cada minuto sin servidor ni republicar.
 */

const fs = require("fs");
const path = require("path");
const { GRUPOS } = require("./grupos");

const DIR = __dirname;                          // deploy/src
const RAIZ = path.join(DIR, "..");              // deploy: lo que publica Pages
const ESTADO = path.join(RAIZ, "..", ".estado"); // fuera del repo
const FUENTE = path.join(DIR, "panel-fuente.html");

const DOCKERFILE = `FROM nginx:alpine
COPY . /usr/share/nginx/html/
RUN printf 'server {\\n\\
  listen 80;\\n\\
  root /usr/share/nginx/html;\\n\\
  add_header Cache-Control "no-store";\\n\\
  location / { try_files $uri $uri/ /index.html; }\\n\\
}\\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
`;

function favicon(marca) {
  const txt = String(marca || "··").slice(0, 2);
  return "data:image/svg+xml," + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` +
    `<rect width="32" height="32" rx="7" fill="#0A0A0A"/>` +
    `<text x="16" y="21" font-family="Helvetica,Arial" font-size="13" font-weight="700" ` +
    `fill="#FFFFFF" text-anchor="middle">${txt}</text></svg>`
  );
}

function construir(grupo, overrides, version) {
  const cfg = {
    version,
    titulo: grupo.titulo,
    marca: grupo.marca,
    subtitulo: grupo.subtitulo || "",
    archivo: grupo.archivo || "",
    hora: grupo.hora || "",
    hoja: grupo.hoja,
    formulario: grupo.formulario || "",
    pauta: grupo.pauta || null,
    periodo: grupo.periodo || { key: "", label: "" },
    excluirAsesores: grupo.excluirAsesores || [],
    asesoresPorId: grupo.asesoresPorId || {},
    hojas: grupo.hojas,
  };

  const web = {
    cfg,
    publico: false,   // conserva el editor de objetivos y el enlace a la hoja
    soloPanel: false, // muestra las pestañas fila por fila
    recortar: false,  // sin recorte de columnas
    intervalo: 60000,
    overrides: overrides || undefined,
  };

  const cuerpo = fs.readFileSync(FUENTE, "utf8")
    .replace(/<title>[^<]*<\/title>/, `<title>${grupo.titulo}</title>`);

  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="description" content="Avance de registros del ${grupo.titulo}.">
<link rel="icon" href="${favicon(grupo.marca)}">
<style>:root{color-scheme:light dark}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
<script>window.__PANEL_WEB__ = ${JSON.stringify(web, null, 2).replace(/</g, "\\u003c")};</script>
</head>
<body>
${cuerpo}
</body>
</html>
`;

  const dir = path.join(RAIZ, grupo.salida);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
  // GitHub Pages cachea el HTML 10 minutos. La página compara su versión
  // contra este archivo y se recarga sola cuando publicamos algo nuevo.
  fs.writeFileSync(path.join(dir, "version.txt"), version + "\n");
  return { dir, kb: (Buffer.byteLength(html) / 1024).toFixed(0) };
}

function objetivosDe(id) {
  const p = path.join(ESTADO, id, "objetivos.json");
  const legado = path.join(ESTADO, "config", "objetivos.json");
  const archivo = fs.existsSync(p) ? p : (id === "onestorage" && fs.existsSync(legado) ? legado : null);
  if (!archivo) return undefined;
  try {
    const raw = JSON.parse(fs.readFileSync(archivo, "utf8"));
    return raw && raw.data && typeof raw.data === "object" ? raw.data : raw;
  } catch (e) {
    process.stderr.write(`${id}: objetivos ilegibles (${e.message})\n`);
    return undefined;
  }
}

const pedido = process.argv[2];
const grupos = pedido ? GRUPOS.filter((g) => g.id === pedido) : GRUPOS;
if (!grupos.length) {
  console.error(`No hay grupo "${pedido}". Disponibles: ${GRUPOS.map((g) => g.id).join(", ")}`);
  process.exit(1);
}

const VERSION = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15);

for (const g of grupos) {
  const { dir, kb } = construir(g, objetivosDe(g.id), VERSION);
  process.stdout.write(`${g.id.padEnd(12)} ${(path.relative(RAIZ, dir) || ".").padEnd(12)} ${kb.padStart(4)} KB  v${VERSION}\n`);
}

// El Dockerfile sirve toda la carpeta, con cada grupo en su subruta.
fs.writeFileSync(path.join(RAIZ, "Dockerfile"), DOCKERFILE);
process.stdout.write("deploy/Dockerfile\n");
