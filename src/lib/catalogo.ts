export function esIsbnValido(isbn: string): boolean {
  return /^\d{13}$/.test(isbn);
}

export function normalizarConsulta(consulta: string | string[] | undefined): string {
  if (Array.isArray(consulta)) {
    return (consulta[0] ?? '').trim();
  }
  return (consulta ?? '').trim();
}
