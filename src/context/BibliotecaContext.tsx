import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { useLibros } from '../hooks/useLibros';
import { calcularFechaDevolucion, tieneReserva } from '../lib/reservas';
import { Pila } from '../estructuras/Pila';
import type {
  Libro,
  PersonaEnEspera,
  Prestamo,
  ReservaEnEspera,
} from '../types';

type ResultadoReserva =
  | { tipo: 'prestamo'; prestamo: Prestamo }
  | { tipo: 'espera'; posicion: number }
  | { tipo: 'duplicada' }
  | { tipo: 'inexistente' };

type BibliotecaContextValue = {
  libros: Libro[];
  cargando: boolean;
  error: string | null;
  reintentar: () => void;
  prestamos: Prestamo[];
  reservasEnEspera: ReservaEnEspera[];
  esperas: Record<string, PersonaEnEspera[]>;
  recientes: Libro[];
  sesionPersonal: boolean;
  reservar: (isbn: string) => ResultadoReserva;
  devolver: (isbn: string) => void;
  alternarRecordatorio: (isbn: string, activo: boolean, identificador?: string) => void;
  registrarReciente: (libro: Libro) => void;
  iniciarSesion: (usuario: string, clave: string) => boolean;
  cerrarSesion: () => void;
  entregarAlSiguiente: (isbn: string) => PersonaEnEspera | undefined;
};

const BibliotecaContext = createContext<BibliotecaContextValue | null>(null);

const USUARIO = 'bibliotecario';
const CLAVE = 'ipf2026';
const NOMBRE_USUARIO = 'Lautaro';

export function BibliotecaProvider({ children }: PropsWithChildren) {
  const { libros, cargando, error, reintentar } = useLibros();
  const [disponibles, setDisponibles] = useState<Record<string, number>>({});
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [reservasEnEspera, setReservasEnEspera] = useState<ReservaEnEspera[]>([]);
  const [esperas, setEsperas] = useState<Record<string, PersonaEnEspera[]>>({});
  const [pilaRecientes] = useState(() => new Pila<Libro>());
  const [recientesVersion, setRecientesVersion] = useState(0);
  const [sesionPersonal, setSesionPersonal] = useState(false);

  const obtenerDisponibles = useCallback(
    (libro: Libro) => disponibles[libro.isbn] ?? libro.ejemplares,
    [disponibles],
  );

  const registrarReciente = useCallback(
    (libro: Libro) => {
      pilaRecientes.apilar(libro);
      setRecientesVersion((version) => version + 1);
    },
    [pilaRecientes],
  );

  const reservar = useCallback(
    (isbn: string): ResultadoReserva => {
      const libro = libros.find((item) => item.isbn === isbn);
      if (!libro) {
        return { tipo: 'inexistente' };
      }

      if (tieneReserva(prestamos, reservasEnEspera, isbn)) {
        return { tipo: 'duplicada' };
      }

      if (obtenerDisponibles(libro) > 0) {
        const prestamo: Prestamo = {
          isbn,
          fechaDevolucion: calcularFechaDevolucion(new Date()),
          recordatorioActivo: false,
        };
        setDisponibles((actuales) => ({
          ...actuales,
          [isbn]: obtenerDisponibles(libro) - 1,
        }));
        setPrestamos((actuales) => [...actuales, prestamo]);
        return { tipo: 'prestamo', prestamo };
      }

      const posicion = (esperas[isbn]?.length ?? 0) + 1;
      setEsperas((actuales) => ({
        ...actuales,
        [isbn]: [
          ...(actuales[isbn] ?? []),
          { id: `${isbn}-${posicion}`, nombre: NOMBRE_USUARIO },
        ],
      }));
      setReservasEnEspera((actuales) => [...actuales, { isbn, posicion }]);
      return { tipo: 'espera', posicion };
    },
    [esperas, libros, obtenerDisponibles, prestamos, reservasEnEspera],
  );

  const devolver = useCallback(
    (isbn: string) => {
      setPrestamos((actuales) => actuales.filter((prestamo) => prestamo.isbn !== isbn));
      const libro = libros.find((item) => item.isbn === isbn);
      if (libro) {
        setDisponibles((actuales) => ({
          ...actuales,
          [isbn]: obtenerDisponibles(libro) + 1,
        }));
      }
    },
    [libros, obtenerDisponibles],
  );

  const alternarRecordatorio = useCallback(
    (isbn: string, activo: boolean, identificador?: string) => {
      setPrestamos((actuales) =>
        actuales.map((prestamo) =>
          prestamo.isbn === isbn
            ? {
                ...prestamo,
                recordatorioActivo: activo,
                identificadorNotificacion: activo ? identificador : undefined,
              }
            : prestamo,
        ),
      );
    },
    [],
  );

  const iniciarSesion = useCallback((usuario: string, clave: string) => {
    const valido = usuario === USUARIO && clave === CLAVE;
    setSesionPersonal(valido);
    return valido;
  }, []);

  const cerrarSesion = useCallback(() => {
    setSesionPersonal(false);
  }, []);

  const entregarAlSiguiente = useCallback((isbn: string) => {
    const persona = esperas[isbn]?.[0];
    if (!persona) {
      return undefined;
    }

    setEsperas((actuales) => ({
      ...actuales,
      [isbn]: actuales[isbn].slice(1),
    }));
    setReservasEnEspera((actuales) => {
      const indice = actuales.findIndex((reserva) => reserva.isbn === isbn);
      if (indice < 0) {
        return actuales;
      }
      return actuales.filter((_, posicion) => posicion !== indice);
    });
    return persona;
  }, [esperas]);

  const recientes = useMemo(() => {
    const versionActual = recientesVersion;
    return versionActual >= 0 ? pilaRecientes.aArray().slice(0, 3) : [];
  }, [pilaRecientes, recientesVersion]);

  const value = useMemo<BibliotecaContextValue>(
    () => ({
      libros,
      cargando,
      error,
      reintentar,
      prestamos,
      reservasEnEspera,
      esperas,
      recientes,
      sesionPersonal,
      reservar,
      devolver,
      alternarRecordatorio,
      registrarReciente,
      iniciarSesion,
      cerrarSesion,
      entregarAlSiguiente,
    }),
    [
      alternarRecordatorio,
      cargando,
      cerrarSesion,
      devolver,
      entregarAlSiguiente,
      error,
      esperas,
      iniciarSesion,
      libros,
      prestamos,
      recientes,
      registrarReciente,
      reservar,
      reservasEnEspera,
      reintentar,
      sesionPersonal,
    ],
  );

  return <BibliotecaContext.Provider value={value}>{children}</BibliotecaContext.Provider>;
}

export function useBiblioteca(): BibliotecaContextValue {
  const context = useContext(BibliotecaContext);
  if (!context) {
    throw new Error('useBiblioteca debe usarse dentro de BibliotecaProvider.');
  }
  return context;
}
