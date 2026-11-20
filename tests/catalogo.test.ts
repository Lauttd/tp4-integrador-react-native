import { esIsbnValido, normalizarConsulta } from '../src/lib/catalogo';

describe('validación del catálogo', () => {
  it('acepta únicamente ISBN de trece dígitos', () => {
    expect(esIsbnValido('9780140449136')).toBe(true);
    expect(esIsbnValido('978-0140449136')).toBe(false);
    expect(esIsbnValido('123')).toBe(false);
  });

  it('normaliza la consulta del buscador', () => {
    expect(normalizarConsulta('  Borges  ')).toBe('Borges');
    expect(normalizarConsulta(undefined)).toBe('');
  });
});
