# Paneles de webinar · Zebra

Paneles de avance en vivo, uno por grupo. Este repositorio es el sitio: lo que
está en la raíz se publica en GitHub Pages.

| Grupo | Ruta | Hoja de origen |
|---|---|---|
| One Storage (Midstorage) | `/` | Registro Webinar One Storage \| WA |
| GT (Grupo Tactical) | `/gt/` | Registro Webinar \| One Storage - GT |

Cada página es un solo archivo estático. Lee las pestañas de su Google Sheets
directamente desde el navegador cada 60 segundos, por la exportación CSV de
Google (que responde con `access-control-allow-origin: *`). No hay backend ni
datos guardados aquí.

## Estructura

    index.html      panel de One Storage   (generado)
    gt/index.html   panel de GT            (generado)
    version.txt     versión publicada, para la recarga automática
    Dockerfile      nginx, por si se despliega fuera de Pages
    src/            el código que genera todo lo anterior

## Regenerar

    cd src && node build-web.js        # todos los grupos
    cd src && node build-web.js gt     # solo uno

Luego `git add -A && git commit && git push`. Pages redespliega en menos de un
minuto. Solo hace falta si cambias el diseño o la configuración: **los datos se
actualizan solos**.

La documentación completa está en `src/LEEME.md`.
