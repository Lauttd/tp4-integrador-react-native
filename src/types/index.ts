export type Libro = {
  isbn: string;
  titulo: string;
  autor: string;
  anio: number;
  ejemplares: number;
};

export type Prestamo = {
  isbn: string;
  fechaDevolucion: string;
  recordatorioActivo: boolean;
  identificadorNotificacion?: string;
};

export type PersonaEnEspera = {
  id: string;
  nombre: string;
};

export type ReservaEnEspera = {
  isbn: string;
  posicion: number;
};
