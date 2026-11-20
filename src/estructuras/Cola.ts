export class Cola<T> {
  #items: T[] = [];

  get tamanio(): number {
    return this.#items.length;
  }

  encolar(item: T): void {
    this.#items.push(item);
  }

  desencolar(): T | undefined {
    const primero = this.#items[0];
    if (primero === undefined) {
      return undefined;
    }

    this.#items = this.#items.slice(1);
    return primero;
  }

  aArray(): T[] {
    return [...this.#items];
  }
}
