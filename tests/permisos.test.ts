import { estadoPermiso } from '../src/lib/permisos';

describe('estados de permisos', () => {
  it('distingue carga, concedido, preguntable y bloqueado', () => {
    expect(estadoPermiso(null)).toBe('cargando');
    expect(estadoPermiso({ granted: true, canAskAgain: true })).toBe('concedido');
    expect(estadoPermiso({ granted: false, canAskAgain: true })).toBe('preguntable');
    expect(estadoPermiso({ granted: false, canAskAgain: false })).toBe('bloqueado');
  });

  it('prioriza concedido aunque el sistema permita volver a preguntar', () => {
    expect(estadoPermiso({ granted: true, canAskAgain: false })).toBe('concedido');
  });
});
