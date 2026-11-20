import { Cola } from '../src/estructuras/Cola';
import { Pila } from '../src/estructuras/Pila';

describe('Pila', () => {
  it('mantiene el elemento más reciente en el tope', () => {
    const pila = new Pila<string>();

    pila.apilar('primero');
    pila.apilar('segundo');

    expect(pila.tope()).toBe('segundo');
    expect(pila.aArray()).toEqual(['segundo', 'primero']);
  });

  it('no duplica el elemento que ya está en el tope', () => {
    const pila = new Pila<string>();

    pila.apilar('libro');
    pila.apilar('libro');

    expect(pila.tamanio).toBe(1);
  });

  it('permite quitar el elemento del tope', () => {
    const pila = new Pila<string>();
    pila.apilar('libro');

    expect(pila.desapilar()).toBe('libro');
    expect(pila.tamanio).toBe(0);
  });
});

describe('Cola', () => {
  it('desencola respetando el orden de llegada', () => {
    const cola = new Cola<string>();

    cola.encolar('Ana');
    cola.encolar('Beto');

    expect(cola.desencolar()).toBe('Ana');
    expect(cola.desencolar()).toBe('Beto');
  });

  it('devuelve undefined al desencolar una cola vacía', () => {
    const cola = new Cola<string>();

    expect(cola.desencolar()).toBeUndefined();
  });

  it('expone una copia ordenada sin permitir mutar la cola', () => {
    const cola = new Cola<string>();
    cola.encolar('Ana');

    const elementos = cola.aArray();
    elementos.push('Beto');

    expect(cola.aArray()).toEqual(['Ana']);
    expect(cola.tamanio).toBe(1);
  });
});
