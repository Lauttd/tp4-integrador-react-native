import { buscarLibros, obtenerLibros } from '../src/lib/api';

describe('API simulada de libros', () => {
  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0.9);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('devuelve al menos quince libros con ISBN válidos', async () => {
    const libros = await obtenerLibros();

    expect(libros.length).toBeGreaterThanOrEqual(15);
    expect(libros.every((libro) => /^\d{13}$/.test(libro.isbn))).toBe(true);
  });

  it('busca por título o autor sin distinguir mayúsculas', async () => {
    const libros = await buscarLibros('borges');

    expect(libros.length).toBeGreaterThan(0);
    expect(
      libros.every(
        (libro) =>
          libro.titulo.toLowerCase().includes('borges') ||
          libro.autor.toLowerCase().includes('borges'),
      ),
    ).toBe(true);
  });
});
