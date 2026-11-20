import { leerJson, serializarJson } from '../src/lib/persistencia';

describe('persistencia local', () => {
  it('serializa y recupera datos JSON', () => {
    const datos = [{ isbn: '9780140449136' }];

    expect(leerJson(serializarJson(datos))).toEqual(datos);
  });

  it('devuelve undefined cuando el contenido está corrupto', () => {
    expect(leerJson('{no es json')).toBeUndefined();
  });
});
