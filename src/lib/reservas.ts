import type { Prestamo, ReservaEnEspera } from '../types';

export function calcularFechaDevolucion(desde: Date): string {
  const fecha = new Date(desde);
  fecha.setDate(fecha.getDate() + 7);
  return fecha.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function tieneReserva(
  prestamos: Prestamo[],
  reservasEnEspera: ReservaEnEspera[],
  isbn: string,
): boolean {
  return (
    prestamos.some((prestamo) => prestamo.isbn === isbn) ||
    reservasEnEspera.some((reserva) => reserva.isbn === isbn)
  );
}
