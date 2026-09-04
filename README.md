# Panel Webinar One Storage

Panel de avance del webinar del 8 de octubre de 2026.

Una sola página estática. Lee las 5 pestañas del Google Sheets del equipo
directamente desde el navegador cada 60 segundos, usando la exportación CSV
de Google (que responde con `access-control-allow-origin: *`). No hay backend
ni datos guardados en este repositorio.

- `index.html` — la página.
- `Dockerfile` — nginx, por si se despliega en Easypanel en lugar de Pages.

Regenerar con `node ../build-web.js`.
