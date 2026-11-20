import { useCallback, useEffect, useState } from 'react';

import { obtenerLibros } from '../lib/api';
import type { Libro } from '../types';

type UseLibrosResult = {
  libros: Libro[];
  cargando: boolean;
  error: string | null;
  reintentar: () => void;
};

export function useLibros(): UseLibrosResult {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  const reintentar = useCallback(() => {
    setIntento((actual) => actual + 1);
  }, []);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError(null);

    obtenerLibros()
      .then((datos) => {
        if (activo) {
          setLibros(datos);
        }
      })
      .catch(() => {
        if (activo) {
          setError('No se pudo cargar el catálogo. Intentá nuevamente.');
        }
      })
      .finally(() => {
        if (activo) {
          setCargando(false);
        }
      });

    return () => {
      activo = false;
    };
  }, [intento]);

  return { libros, cargando, error, reintentar };
}
