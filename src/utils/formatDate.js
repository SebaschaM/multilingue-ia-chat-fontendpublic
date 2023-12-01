export function formatearFecha(fechaString) {
  return new Date(fechaString).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
