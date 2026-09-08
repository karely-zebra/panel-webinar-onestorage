# Paneles de webinar

Una plantilla, un panel por grupo. Todo lo que cambia entre un webinar y otro
vive en `grupos.js`; `panel-fuente.html` no sabe de qué grupo se trata.

| Grupo | Hoja | Salida | En línea |
|---|---|---|---|
| One Storage (Midstorage) | `Registro Webinar One Storage \| WA` | `deploy/index.html` | `…github.io/panel-webinar-onestorage/` |
| GT (Grupo Tactical) | `Registro Webinar \| One Storage - GT` | `deploy/gt/index.html` | `…github.io/panel-webinar-onestorage/gt/` |

Cada página es un solo archivo estático. Lee las pestañas de su Google Sheets
directamente desde el navegador cada 60 segundos, usando la exportación CSV de
Google (que responde con `access-control-allow-origin: *`). Sin backend, sin
rutinas y sin republicar.

## Comandos

    node build-web.js          # regenera todos los grupos
    node build-web.js gt       # solo uno

Después: `git add -A && git commit && git push`. GitHub Pages redespliega en
menos de un minuto. Esto **solo hace falta si cambias el diseño o la
configuración**: los datos se actualizan solos.

## Dar de alta otro grupo

Agrega un objeto a `GRUPOS` en `grupos.js`:

```js
{
  id: "nuevo",
  salida: "deploy/nuevo",        // la subruta del sitio
  titulo: "Webinar Nuevo",
  marca: "NV",                   // dos letras para el cuadrito y el favicon
  subtitulo: "8 oct 2026",
  archivo: "Registro Webinar Nuevo (Respuestas)",
  hoja: "<id del Google Sheets>",
  formulario: "https://forms.gle/…",
  periodo: { key: "septiembre 2026", label: "Septiembre 2026" },
  hojas: [
    { nombre: "General",   gid: "…", rol: "general"    },
    { nombre: "Registros", gid: "…", rol: "registros"  },
    { nombre: "Campañas",  gid: "…", rol: "campanas"   },
    { nombre: "Difusiones",gid: "…", rol: "difusiones" },
  ],
}
```

**`rol` es lo que importa**, no el nombre de la pestaña: el panel funciona
igual si se llama `Registros` o `Registros asesores`. Puede haber varias hojas
con rol `campanas` y se suman. Si un grupo no tiene alguna, se omite.

Los `gid` de cada pestaña salen de `/htmlview` de la hoja; los nombres, de
`export?format=xlsx` leyendo `xl/workbook.xml`.

## Lo que muestra

- **Panel** — avance contra el objetivo, ritmo esperado vs. real, días
  restantes, proyección, registros por asesor contra su objetivo, respuesta a
  la difusión, atribución y datos del evento.
- **Las pestañas del archivo** — fila por fila, con buscador y encabezado fijo.

En las hojas con columna de asesor hay un selector **Asesor** en la barra: cada
quien se queda solo con sus filas, y la opción muestra cuántas tiene.

## Cómo se identifica al asesor

El formulario manda el **ID de Kommo**, no el nombre. El panel resuelve la
identidad así, en orden:

1. Una columna llamada `Asesor` o `Asesor Asignado` — el nombre ya resuelto por
   la hoja. **Manda sobre todo lo demás.**
2. Cualquier otra columna con "asesor" (por ejemplo `Selecciona tu asesor`),
   traduciendo el ID con `asesoresPorId` de `grupos.js`.
3. Si nada da un nombre, se queda el ID crudo y la fila cae en
   *Sin asesor reconocido*.

Así, si entra un asesor cuyo ID no está en `grupos.js`, basta con que la hoja lo
resuelva en su columna `Asesor`. En la tabla se muestra el nombre con el ID en
gris al lado, sin ocultar lo que dice la hoja.

## Recarga automática

`build-web.js` estampa una versión en cada página y escribe `version.txt`. En
cada refresco de datos la página compara ambas y, si publicaste algo nuevo, se
recarga sola una vez (marcando la versión en la URL para no repetirse). Sin
esto, el caché de GitHub Pages deja una pestaña abierta con la versión anterior
hasta diez minutos.

La hoja **General** se muestra sin la columna *Objetivos* cuando además existe
*Objetivos sesgo* (para no repetir metas), y cortada antes del bloque del
evento. El cálculo del panel sigue leyendo la hoja completa.

Las columnas de General se buscan **por su encabezado**, no por posición: cada
webinar acomoda la hoja distinto.

## Objetivos

El botón *Objetivos* cambia el objetivo total, las fechas, el objetivo por
asesor y si los leads de campañas cuentan en el avance. **Se guarda en el
navegador de quien lo edita.** Para que el cambio lo vea todo el equipo,
cámbialo en la hoja: celda de *Objetivo Registros* para el total, columna
*Objetivos sesgo* (o *Objetivos*) para el reparto por asesor.

Los valores iniciales salen de `.estado/<id>/objetivos.json` si existe.

## Requisito

Cada hoja debe estar compartida como *"cualquier persona con el enlace puede
ver"*. Si se restringe, el panel deja de cargar y lo avisa en pantalla.

## Diseño

Design system de Zebra: escala neutra `ink`, acento monocromo (negro en claro,
blanco en oscuro), bordes de un pelo, sin sombras, **Inter** para texto y
**JetBrains Mono** para datos y etiquetas. Las series de las gráficas usan los
acentos de industria de Zebra (`#96721C`, `#1F5FAE`, `#C2410C`), validados para
daltonismo y contraste en ambos temas.

## Por qué no se usa el conector de Google Drive

Trunca las hojas largas: devolvió 94 de las 1,048 filas de Difusiones. Como las
filas nuevas se agregan al final, habría dejado de ver justo lo reciente. La
exportación CSV devuelve el archivo completo.
