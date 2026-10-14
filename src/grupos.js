/**
 * Un objeto por grupo. Es lo único que hay que tocar para dar de alta otro
 * webinar: la plantilla `panel-fuente.html` no sabe de qué grupo se trata.
 *
 * hojas[].rol le dice al panel para qué sirve cada pestaña:
 *   general      la de objetivos, fechas y lista de asesores
 *   registros    respuestas del formulario (una por persona registrada)
 *   campanas     leads de pauta; puede haber varias y se suman
 *   difusiones   envíos de WhatsApp; filtra por `periodo`
 */

const GRUPOS = [
  {
    id: "onestorage",
    salida: ".",
    titulo: "Webinar One Storage",
    marca: "OS",
    subtitulo: "8 oct 2026 · 7:30 PM",
    archivo: "Registro Webinar One Storage | WA (Respuestas)",
    hora: "7:30 PM",
    hoja: "1thV_Pb10TSE495xcYqfC75C68F38rQe7pbw82XmuVTA",
    formulario: "https://forms.gle/LXo9ofqJr1SFCT5V9",
    pauta: {
      nombre: "WEBINAR PAUTA SEP",
      url: "https://drive.google.com/drive/folders/1fvR0EoybyiaZKPD0770VUOwaCNZNf2U8",
    },
    periodo: { key: "septiembre 2026", label: "Septiembre 2026" },
    // El formulario y las hojas de leads identifican al asesor por su ID de
    // Kommo. El panel lo traduce para que el registro cuente en su fila.
    asesoresPorId: {
      12093183: "Giovanni Colosia",
      12260927: "Ana Hernández",
      13326296: "Ricardo Maza",
      14579251: "Edwin Euceda",
      14787567: "Alejandra May",
      15481887: "Arlette Zuñiga",
      15738151: "Fernando Alcaraz",
    },
    hojas: [
      { nombre: "General", gid: "1681182596", rol: "general" },
      { nombre: "Registros", gid: "1808037740", rol: "registros" },
      { nombre: "Campañas", gid: "1706737363", rol: "campanas" },
      { nombre: "Duplicados", gid: "144632605", rol: "campanas" },
      { nombre: "Difusiones", gid: "2073372722", rol: "difusiones" },
    ],
  },
  {
    id: "gt",
    salida: "gt",
    titulo: "Webinar GT",
    marca: "GT",
    subtitulo: "8 oct 2026",
    archivo: "Registro Webinar GT (Respuestas)",
    hoja: "1yoNk52JX1HYB6GcLwpPeoXncjcxiL7wGI7-ORp3qWWA",
    formulario: "https://forms.gle/xcyDTehj2tY8NrHk8",
    // Respaldo por si una fila llega sin la columna Asesor resuelta.
    asesoresPorId: {
      15423767: "Claudia Proclama",
      15423779: "Rafael Turullols",
      15423799: "José Ambrosio",
      15552823: "Eduardo Lee",
    },
    periodo: { key: "septiembre 2026", label: "Septiembre 2026" },
    hojas: [
      { nombre: "General", gid: "1835923959", rol: "general" },
      { nombre: "Registros asesores", gid: "2108741196", rol: "registros" },
      { nombre: "Campañas nuevos", gid: "1892030472", rol: "campanas" },
      { nombre: "Difusiones", gid: "972916596", rol: "difusiones" },
    ],
  },
];

module.exports = { GRUPOS };
