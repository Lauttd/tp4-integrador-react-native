export class Pila<T> {
  #items: T[] = [];

  get tamanio(): number {
    return this.#items.length;
  }

  apilar(item: T): void {
    if (this.#items[0] !== item) {
      this.#items.unshift(item);
    }
  }

  desapilar(): T | undefined {
    return this.#items.shift();
  }

  tope(): T | undefined {
    return this.#items[0];
  }

  aArray(): T[] {
    return [...this.#items];
  }
}
