import { calcularFechaDevolucion, tieneReserva } from '../src/lib/reservas';

describe('reglas de reservas', () => {
  it('calcula una devolución siete días después', () => {
    expect(calcularFechaDevolucion(new Date('2026-11-20T12:00:00.000Z'))).toBe(
      '27/11/2026',
    );
  });

  it('detecta que una persona ya reservó un libro', () => {
    expect(
      tieneReserva(
        [{ isbn: '9780140449136', fechaDevolucion: '27/11/2026', recordatorioActivo: false }],
        [{ isbn: '9788420633137', posicion: 1 }],
        '9780140449136',
      ),
    ).toBe(true);
  });

  it('permite reservar un libro que no está en préstamos ni espera', () => {
    expect(
      tieneReserva(
        [{ isbn: '9780140449136', fechaDevolucion: '27/11/2026', recordatorioActivo: false }],
        [],
        '9788420633137',
      ),
    ).toBe(false);
  });
});
