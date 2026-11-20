export function serializarJson<T>(valor: T): string {
  return JSON.stringify(valor);
}

export function leerJson<T>(valor: string | null): T | undefined {
  if (!valor) {
    return undefined;
  }

  try {
    return JSON.parse(valor) as T;
  } catch {
    return undefined;
  }
}
