import { credencialesValidas } from '../src/lib/autenticacion';

describe('acceso de personal', () => {
  it('acepta las credenciales de biblioteca configuradas', () => {
    expect(credencialesValidas('bibliotecario', 'ipf2026')).toBe(true);
  });

  it('rechaza una clave incorrecta', () => {
    expect(credencialesValidas('bibliotecario', 'incorrecta')).toBe(false);
  });
});
